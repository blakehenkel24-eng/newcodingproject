'use client';

import { DensityMode, ArchetypeId, TemplateProps } from '@/types/slide';
import { SlidePreview } from './SlidePreview';

interface FluxSlideDisplayProps {
  imageUrl: string | null;
  textFallback?: {
    title: string;
    content: string;
    archetype: string;
  } | null;
  templateId: string;
  archetypeId?: ArchetypeId;
  props: Record<string, unknown> | TemplateProps;
  density: DensityMode;
}

/**
 * Displays a Flux-generated slide image
 * Falls back to HTML template if image is not available
 * Text fallback is now handled separately in the dashboard
 */
export function FluxSlideDisplay({
  imageUrl,
  textFallback,
  templateId,
  archetypeId,
  props,
  density,
}: FluxSlideDisplayProps) {
  const hasImage = !!imageUrl;

  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
      {hasImage ? (
        <div className="w-full h-full relative flex items-center justify-center p-4">
          <img
            src={imageUrl}
            alt="Generated slide"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      ) : (
        <SlidePreview
          templateId={templateId}
          archetypeId={archetypeId}
          props={props}
          density={density}
        />
      )}
    </div>
  );
}
