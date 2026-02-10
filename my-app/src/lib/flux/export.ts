/**
 * Flux 2.0 Export Utilities
 * Export generated images to PPTX and other formats
 */

import PptxGenJS from 'pptxgenjs';

interface FluxExportOptions {
  title?: string;
  subtitle?: string;
}

/**
 * Export Flux-generated image to PPTX
 */
export async function exportFluxToPPTX(
  imageUrl: string,
  filename: string = 'flux-slide.pptx',
  options: FluxExportOptions = {}
): Promise<void> {
  const pptx = new PptxGenJS();
  
  // Set presentation properties
  pptx.title = options.title || 'Flux Generated Slide';
  pptx.author = 'SlideTheory Flux';
  pptx.company = 'SlideTheory';
  
  // Add slide
  const slide = pptx.addSlide();
  
  // Add image to fill the slide
  // 16:9 aspect ratio - standard presentation size
  slide.addImage({
    data: imageUrl,
    x: 0,
    y: 0,
    w: '100%',
    h: '100%',
    sizing: {
      type: 'contain',
      w: '100%',
      h: '100%',
    },
  });
  
  // Save
  await pptx.writeFile({ fileName: filename });
}

/**
 * Export multiple Flux images to PPTX as a deck
 */
export async function exportFluxBatchToPPTX(
  images: Array<{ imageUrl: string; title?: string }>,
  filename: string = 'flux-slides.pptx'
): Promise<void> {
  const pptx = new PptxGenJS();
  
  pptx.title = 'Flux Generated Slides';
  pptx.author = 'SlideTheory Flux';
  
  images.forEach((img, index) => {
    const slide = pptx.addSlide();
    
    slide.addImage({
      data: img.imageUrl,
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
      sizing: {
        type: 'contain',
        w: '100%',
        h: '100%',
      },
    });
  });
  
  await pptx.writeFile({ fileName: filename });
}

/**
 * Convert base64 image to PPTX-ready format
 */
export function prepareImageForPPTX(base64Image: string): string {
  // Ensure proper data URL format
  if (base64Image.startsWith('data:image')) {
    return base64Image;
  }
  return `data:image/png;base64,${base64Image}`;
}

/**
 * Download image directly
 */
export async function downloadFluxImage(
  imageUrl: string,
  filename: string = 'flux-slide.png'
): Promise<void> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  window.URL.revokeObjectURL(url);
}

/**
 * Copy image to clipboard
 */
export async function copyFluxImageToClipboard(imageUrl: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
    
    return true;
  } catch (error) {
    console.error('Failed to copy image:', error);
    return false;
  }
}
