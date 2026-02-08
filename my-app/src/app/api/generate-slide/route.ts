import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, incrementGenerationCount } from '@/lib/rateLimit';
import { executePipeline, generateSlidePPTX } from '@/lib/llm/pipeline';
import { SlideInput } from '@/types/input';
import { mapToArchetype } from '@/types/slide';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Verify authentication
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check rate limit
    const { allowed, remaining, profile, isTestUser } = await checkRateLimit(user.id);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Daily generation limit reached. Upgrade to Pro for unlimited slides.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body: SlideInput = await request.json();

    // Validate input
    if (!body.text || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields: text and message' },
        { status: 400 }
      );
    }

    // Execute the upgraded pipeline
    const pipelineResult = await executePipeline(
      {
        text: body.text,
        message: body.message,
        data: body.data,
        fileContent: body.fileContent,
        slideType: body.slideType,
        audience: body.audience,
        density: body.density,
      },
      {
        preferredModel: 'openai',
        skipQA: false,
      }
    );

    // Generate PPTX blob (optional - can be done on-demand)
    // const pptxBlob = await generateSlidePPTX(pipelineResult);

    // Calculate generation time
    const generationTimeMs = Date.now() - startTime;

    // Store in database
    const { error: dbError } = await supabase.from('slides').insert({
      id: pipelineResult.slideId,
      user_id: user.id,
      context_input: body.text,
      message_input: body.message,
      data_input: body.data || null,
      slide_type: body.slideType,
      target_audience: body.audience,
      density_mode: body.density,
      llm_blueprint: {
        // Store both old and new formats for compatibility
        slideTitle: pipelineResult.structured.title,
        keyMessage: pipelineResult.structured.coreMessage,
        contentBlocks: pipelineResult.structured.logicalGroups.map(g => ({
          type: 'text' as const,
          label: g.heading,
          value: g.bullets.join('. '),
          emphasis: g.emphasis,
        })),
        suggestedLayout: mapToArchetype(body.slideType || 'auto'),
        footnote: pipelineResult.structured.footnote,
        source: pipelineResult.structured.source,
      },
      selected_template: pipelineResult.archetypeId,
      template_props: pipelineResult.templateProps as Record<string, unknown>,
      llm_model_used: pipelineResult.modelUsed,
      generation_time_ms: generationTimeMs,
      regeneration_count: body.isRegeneration ? 1 : 0,
    });

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue even if DB storage fails - don't block the user
    }

    // Increment generation count
    await incrementGenerationCount(user.id);

    return NextResponse.json({
      slideId: pipelineResult.slideId,
      archetypeId: pipelineResult.archetypeId,
      templateId: pipelineResult.archetypeId, // For backward compatibility
      props: pipelineResult.templateProps,
      structured: pipelineResult.structured,
      blueprint: {
        // For backward compatibility
        slideTitle: pipelineResult.structured.title,
        keyMessage: pipelineResult.structured.coreMessage,
        contentBlocks: pipelineResult.structured.logicalGroups.map(g => ({
          type: 'text' as const,
          label: g.heading,
          value: g.bullets.join('. '),
          emphasis: g.emphasis,
        })),
        suggestedLayout: mapToArchetype(body.slideType || 'auto'),
        footnote: pipelineResult.structured.footnote,
        source: pipelineResult.structured.source,
      },
      generationTimeMs,
      remainingGenerations: remaining - 1,
      modelUsed: pipelineResult.modelUsed,
      qaScore: pipelineResult.qaReport.score,
      qaPassed: pipelineResult.qaReport.passed,
      qaRecommendations: pipelineResult.qaReport.recommendations,
    });

  } catch (error) {
    console.error('Error generating slide:', error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate slide' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to retrieve slide history
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Fetch slides from database
    const { data: slides, error } = await supabase
      .from('slides')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch slides' },
        { status: 500 }
      );
    }

    return NextResponse.json({ slides });

  } catch (error) {
    console.error('Error fetching slides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slides' },
      { status: 500 }
    );
  }
}
