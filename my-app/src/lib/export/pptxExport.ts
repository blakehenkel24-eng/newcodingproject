'use client';

// Dynamically import pptxgenjs only on client side
export async function exportToPPTX(
  element: HTMLElement,
  filename: string = 'slide.pptx'
): Promise<void> {
  // Dynamic import to avoid SSR issues
  const PptxGenJS = (await import('pptxgenjs')).default;
  
  const pptx = new PptxGenJS();
  
  // Set slide size to 16:9
  pptx.defineSlideMaster({
    title: 'SLIDE_THEORY_MASTER',
    background: { color: 'FFFFFF' },
  });
  
  const slide = pptx.addSlide();
  
  // Extract content from the HTML element
  const title = element.querySelector('h1, h2, .slide-title')?.textContent || 'Slide';
  const subtitle = element.querySelector('.slide-subtitle, .key-message')?.textContent || '';
  
  // Add title
  slide.addText(title, {
    x: 0.5,
    y: 0.5,
    w: '90%',
    h: 0.8,
    fontSize: 32,
    fontFace: 'Calibri',
    bold: true,
    color: '003366',
  });
  
  // Add subtitle/key message
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5,
      y: 1.4,
      w: '90%',
      h: 0.5,
      fontSize: 16,
      fontFace: 'Calibri',
      color: '708090',
    });
  }
  
  // Try to extract and add metrics/content
  const metrics = element.querySelectorAll('.metric-value, [data-metric]');
  let yPos = 2.2;
  
  metrics.forEach((metric, index) => {
    const label = metric.getAttribute('data-label') || `Metric ${index + 1}`;
    const value = metric.textContent || '0';
    
    slide.addText(`${label}: ${value}`, {
      x: 0.5 + (index % 3) * 3,
      y: yPos + Math.floor(index / 3) * 1,
      w: 2.5,
      h: 0.8,
      fontSize: 20,
      fontFace: 'Calibri',
      bold: true,
      color: '008080',
    });
  });
  
  // Add footnote if present
  const footnote = element.querySelector('.footnote, [data-footnote]')?.textContent;
  if (footnote) {
    slide.addText(footnote, {
      x: 0.5,
      y: '90%',
      w: '90%',
      h: 0.3,
      fontSize: 10,
      fontFace: 'Calibri',
      color: '888888',
    });
  }
  
  await pptx.writeFile({ fileName: filename });
}
