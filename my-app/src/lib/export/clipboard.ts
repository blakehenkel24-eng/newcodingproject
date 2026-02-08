import html2canvas from 'html2canvas';

export async function copySlideToClipboard(element: HTMLElement): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution
      backgroundColor: '#ffffff',
      logging: false,
    });
    
    // Convert canvas to blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });
    
    if (!blob) {
      throw new Error('Failed to convert canvas to image');
    }
    
    // Copy to clipboard
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);
    
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    throw new Error('Failed to copy slide to clipboard');
  }
}
