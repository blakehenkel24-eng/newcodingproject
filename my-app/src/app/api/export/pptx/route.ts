import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generatePPTX } from '@/lib/export/pptxGenerator';
import { ArchetypeId } from '@/lib/llm/archetypes';
import { TemplateProps } from '@/lib/llm/archetypeClassifier';

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const { slideId, archetypeId, props } = body;

    if (!slideId || !archetypeId || !props) {
      return NextResponse.json(
        { error: 'Missing required fields: slideId, archetypeId, props' },
        { status: 400 }
      );
    }

    // Generate PPTX
    const blob = await generatePPTX(
      archetypeId as ArchetypeId,
      props as TemplateProps,
      `slidetheory-${slideId.slice(0, 8)}.pptx`
    );

    // Return blob as array buffer
    const arrayBuffer = await blob.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="slidetheory-${slideId.slice(0, 8)}.pptx"`,
      },
    });

  } catch (error) {
    console.error('Error exporting PPTX:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to export PPTX' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to export a saved slide by ID
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

    // Get slide ID from query params
    const { searchParams } = new URL(request.url);
    const slideId = searchParams.get('id');

    if (!slideId) {
      return NextResponse.json(
        { error: 'Missing slide ID' },
        { status: 400 }
      );
    }

    // Fetch slide from database
    const { data: slide, error } = await supabase
      .from('slides')
      .select('*')
      .eq('id', slideId)
      .eq('user_id', user.id)
      .single();

    if (error || !slide) {
      return NextResponse.json(
        { error: 'Slide not found' },
        { status: 404 }
      );
    }

    // Generate PPTX from saved data
    const templateProps = slide.template_props as any;
    // Ensure required fields exist
    templateProps.title = templateProps.title || 'Slide';
    templateProps.archetype = slide.selected_template;
    templateProps.density = templateProps.density || 'presentation';
    
    const blob = await generatePPTX(
      slide.selected_template as ArchetypeId,
      templateProps as TemplateProps,
      `slidetheory-${slideId.slice(0, 8)}.pptx`
    );

    const arrayBuffer = await blob.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="slidetheory-${slideId.slice(0, 8)}.pptx"`,
      },
    });

  } catch (error) {
    console.error('Error exporting PPTX:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to export PPTX' },
      { status: 500 }
    );
  }
}
