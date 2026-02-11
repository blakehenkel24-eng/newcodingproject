/**
 * Flux 2.0 Slide Generation API Route
 * Production-ready endpoint with comprehensive error handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { runFluxPipeline } from '@/lib/flux/pipeline';
import { isFluxConfigured, validateFluxConfig, getConfigHelp } from '@/lib/flux/config';
import { ArchetypeId, TargetAudience, DensityMode } from '@/types/slide';

export const runtime = 'nodejs';
export const maxDuration = 180; // 3 minutes max for image generation

interface FluxGenerateRequest {
  text: string;
  message: string;
  data?: string;
  fileContent?: string;
  slideType: ArchetypeId | 'auto';
  audience: TargetAudience;
  density: DensityMode;
}

/**
 * POST handler - generate Flux image
 */
export async function POST(request: NextRequest) {
  const requestStartTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log(`[Flux API ${requestId}] Request started`);
  
  try {
    // ============================================================================
    // Step 1: Validate Configuration
    // ============================================================================
    
    if (!isFluxConfigured()) {
      console.error(`[Flux API ${requestId}] Flux not configured`);
      return NextResponse.json(
        { 
          error: 'Flux image generation is not configured',
          details: 'FLUX_PROVIDER and FLUX_API_KEY environment variables must be set',
          help: getConfigHelp(),
        },
        { status: 503 }
      );
    }
    
    const configValidation = validateFluxConfig();
    if (!configValidation.valid) {
      console.error(`[Flux API ${requestId}] Invalid config:`, configValidation.errors);
      return NextResponse.json(
        {
          error: 'Invalid Flux configuration',
          details: configValidation.errors,
          warnings: configValidation.warnings,
          docsUrl: configValidation.docsUrl,
        },
        { status: 503 }
      );
    }
    
    console.log(`[Flux API ${requestId}] Config valid - Provider: ${configValidation.provider}, Model: ${configValidation.model}`);
    
    // ============================================================================
    // Step 2: Authenticate User
    // ============================================================================
    
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error(`[Flux API ${requestId}] Authentication failed:`, authError);
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    console.log(`[Flux API ${requestId}] Authenticated user: ${user.id}`);
    
    // ============================================================================
    // Step 3: Parse and Validate Request
    // ============================================================================
    
    let body: FluxGenerateRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    const errors: string[] = [];
    
    if (!body.text || body.text.trim().length < 10) {
      errors.push('Context text is required (minimum 10 characters)');
    }
    
    if (!body.message || body.message.trim().length < 5) {
      errors.push('Key message is required (minimum 5 characters)');
    }
    
    if (errors.length > 0) {
      console.error(`[Flux API ${requestId}] Validation failed:`, errors);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    // Log request details
    console.log(`[Flux API ${requestId}] Request details:`, {
      textLength: body.text.length,
      messageLength: body.message.length,
      dataLength: body.data?.length || 0,
      slideType: body.slideType || 'auto',
      audience: body.audience || 'c_suite',
      density: body.density || 'presentation',
    });
    
    // ============================================================================
    // Step 4: Check Rate Limits (reuse existing logic)
    // ============================================================================
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('daily_generation_count, last_generation_date, tier')
      .eq('id', user.id)
      .single();
    
    const testEmails = ['test@slidetheory.com', 'admin@slidetheory.com', 'demo@slidetheory.com'];
    const isTestUser = testEmails.includes(user.email?.toLowerCase() || '');
    
    if (!isTestUser && profile) {
      const today = new Date().toISOString().split('T')[0];
      const lastGenDate = profile.last_generation_date;
      
      if (lastGenDate !== today) {
        // Reset counter for new day
        await supabase
          .from('profiles')
          .update({ daily_generation_count: 0, last_generation_date: today })
          .eq('id', user.id);
      } else if (profile.daily_generation_count >= 5) {
        return NextResponse.json(
          { error: 'Daily generation limit reached (5 per day)' },
          { status: 429 }
        );
      }
    }
    
    // ============================================================================
    // Step 5: Run Flux Pipeline
    // ============================================================================
    
    console.log(`[Flux API ${requestId}] Starting Flux pipeline...`);
    
    const result = await runFluxPipeline({
      text: body.text,
      message: body.message,
      data: body.data,
      fileContent: body.fileContent,
      slideType: body.slideType || 'auto',
      audience: body.audience || 'c_suite',
      density: body.density || 'presentation',
    });
    
    if (!result.success || !result.result) {
      console.error(`[Flux API ${requestId}] Pipeline failed:`, result.error);
      return NextResponse.json(
        { 
          error: 'Image generation failed',
          details: result.error || 'Unknown error',
        },
        { status: 500 }
      );
    }
    
    console.log(`[Flux API ${requestId}] Pipeline succeeded:`, {
      slideId: result.result.slideId,
      archetypeId: result.archetypeId,
      generationTimeMs: result.generationTimeMs,
    });
    
    // ============================================================================
    // Step 6: Store in Database
    // ============================================================================
    
    const { error: dbError } = await supabase.from('slides').insert({
      user_id: user.id,
      context_input: body.text,
      message_input: body.message,
      data_input: body.data || null,
      slide_type: body.slideType || 'auto',
      target_audience: body.audience,
      density_mode: body.density,
      llm_blueprint: {
        ...result.structured,
        fluxPrompt: result.prompt?.prompt.substring(0, 500), // Truncate for storage
      },
      selected_template: `flux_${result.archetypeId}`,
      template_props: {
        imageUrl: result.result.imageUrl,
        archetypeId: result.archetypeId,
        modelUsed: result.result.modelUsed,
        seed: result.result.seed,
      },
      llm_model_used: result.result.modelUsed,
      generation_time_ms: result.generationTimeMs,
    });
    
    if (dbError) {
      console.error(`[Flux API ${requestId}] Database error (non-fatal):`, dbError);
      // Don't fail the request, just log it
    } else {
      // Increment generation count
      if (!isTestUser) {
        await supabase.rpc('increment_generation_count', { user_id: user.id });
      }
    }
    
    // ============================================================================
    // Step 7: Return Success Response
    // ============================================================================
    
    const totalTimeMs = Date.now() - requestStartTime;
    console.log(`[Flux API ${requestId}] Request completed in ${totalTimeMs}ms`);
    
    return NextResponse.json({
      success: true,
      slideId: result.result.slideId,
      imageUrl: result.result.imageUrl,
      imageBase64: result.result.imageBase64,
      archetypeId: result.archetypeId,
      structured: result.structured,
      prompt: {
        prompt: result.prompt?.prompt.substring(0, 1000), // Truncate for response
        style: result.prompt?.style,
      },
      generationTimeMs: result.generationTimeMs,
      totalTimeMs,
      modelUsed: result.result.modelUsed,
      seed: result.result.seed,
    });
    
  } catch (error) {
    const totalTimeMs = Date.now() - requestStartTime;
    console.error(`[Flux API ${requestId}] Unhandled error after ${totalTimeMs}ms:`, error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        requestId,
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - check Flux configuration status
 */
export async function GET(request: NextRequest) {
  const configured = isFluxConfigured();
  const validation = validateFluxConfig();
  
  // Check auth
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const testEmails = ['test@slidetheory.com', 'admin@slidetheory.com', 'demo@slidetheory.com'];
  const isAdmin = user && testEmails.includes(user.email?.toLowerCase() || '');
  
  return NextResponse.json({
    configured,
    valid: validation.valid,
    provider: validation.provider,
    model: validation.model,
    warnings: validation.warnings,
    // Only show detailed errors to admins
    errors: isAdmin ? validation.errors : validation.errors.length > 0 ? ['Configuration error'] : [],
    docsUrl: validation.docsUrl,
  });
}
