/**
 * Flux 2.0 Slide Generation API Route
 * Parallel endpoint to /api/generate-slide but using Flux image generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { runFluxPipeline, isFluxConfigured } from '@/lib/flux';
import { ArchetypeId, TargetAudience, DensityMode } from '@/types/slide';

export const runtime = 'nodejs';
export const maxDuration = 120; // 2 minutes for image generation

interface FluxGenerateRequest {
  text: string;
  message: string;
  data?: string;
  fileContent?: string;
  slideType: ArchetypeId | 'auto';
  audience: TargetAudience;
  density: DensityMode;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Check if Flux is configured
    if (!isFluxConfigured()) {
      return NextResponse.json(
        { error: 'Flux image generation is not configured. Please set FLUX_API_KEY and FLUX_PROVIDER environment variables.' },
        { status: 503 }
      );
    }
    
    // Authenticate user
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body: FluxGenerateRequest = await request.json();
    
    // Validate required fields
    if (!body.text || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields: text and message' },
        { status: 400 }
      );
    }
    
    console.log('[Flux API] Generating slide for user:', user.id);
    console.log('[Flux API] Slide type:', body.slideType);
    console.log('[Flux API] Audience:', body.audience);
    
    // Run Flux pipeline
    const result = await runFluxPipeline({
      text: body.text,
      message: body.message,
      data: body.data,
      fileContent: body.fileContent,
      slideType: body.slideType,
      audience: body.audience || 'c_suite',
      density: body.density || 'presentation',
      userId: user.id,
    });
    
    if (!result.success || !result.result) {
      console.error('[Flux API] Pipeline failed:', result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to generate slide' },
        { status: 500 }
      );
    }
    
    // Store in database (optional - for history)
    const { error: dbError } = await supabase.from('slides').insert({
      user_id: user.id,
      context_input: body.text,
      message_input: body.message,
      data_input: body.data || null,
      slide_type: body.slideType,
      target_audience: body.audience,
      density_mode: body.density,
      llm_blueprint: {
        ...result.structured,
        fluxPrompt: result.prompt,
      },
      selected_template: `flux_${result.archetypeId}`,
      template_props: {
        imageUrl: result.result.imageUrl,
        archetypeId: result.archetypeId,
        prompt: result.prompt?.prompt,
      },
      llm_model_used: result.result.modelUsed,
      generation_time_ms: result.generationTimeMs,
    });
    
    if (dbError) {
      console.error('[Flux API] Database error:', dbError);
      // Don't fail the request, just log it
    }
    
    const totalTime = Date.now() - startTime;
    console.log('[Flux API] Success! Total time:', totalTime, 'ms');
    
    return NextResponse.json({
      success: true,
      slideId: result.result.slideId,
      imageUrl: result.result.imageUrl,
      imageBase64: result.result.imageBase64,
      archetypeId: result.archetypeId,
      structured: result.structured,
      prompt: result.prompt,
      generationTimeMs: result.generationTimeMs,
      totalTimeMs: totalTime,
      modelUsed: result.result.modelUsed,
    });
    
  } catch (error) {
    console.error('[Flux API] Unexpected error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - retrieve Flux slide history
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get query params
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Fetch slides with Flux templates
    const { data: slides, error } = await supabase
      .from('slides')
      .select('*')
      .eq('user_id', user.id)
      .ilike('selected_template', 'flux_%')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('[Flux API] Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch slides' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      slides: slides || [],
      count: slides?.length || 0,
    });
    
  } catch (error) {
    console.error('[Flux API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
