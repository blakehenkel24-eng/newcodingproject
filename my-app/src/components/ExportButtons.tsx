'use client';

import { useState } from 'react';
import { copySlideToClipboard } from '@/lib/export/clipboard';
import { Download, Copy, Check, FileDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { ArchetypeId } from '@/lib/llm/archetypes';
import { TemplateProps } from '@/lib/llm/archetypeClassifier';

interface ExportButtonsProps {
  slideElement: HTMLDivElement | null;
  slideTitle: string;
  slideId?: string;
  archetypeId?: ArchetypeId;
  templateProps?: TemplateProps;
}

export function ExportButtons({ 
  slideElement, 
  slideTitle, 
  slideId,
  archetypeId,
  templateProps 
}: ExportButtonsProps) {
  const [isCopying, setIsCopying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!slideElement) {
      toast.error('No slide to copy');
      return;
    }

    setIsCopying(true);
    try {
      await copySlideToClipboard(slideElement);
      setCopied(true);
      toast.success('Slide copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy slide');
      console.error(error);
    } finally {
      setIsCopying(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Use new archetype-based export if data is available
      if (slideId && archetypeId && templateProps) {
        await exportArchetypePPTX(slideId, archetypeId, templateProps, slideTitle);
      } else if (slideElement) {
        // Fallback to legacy HTML-based export
        await exportLegacyPPTX(slideElement, slideTitle);
      } else {
        toast.error('No slide data available for export');
        return;
      }
      toast.success('Slide exported to PowerPoint!');
    } catch (error) {
      toast.error('Failed to export slide');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleCopy}
        disabled={isCopying}
        className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
      >
        {copied ? (
          <Check className="w-4 h-4 mr-1.5 text-green-600" />
        ) : (
          <Copy className="w-4 h-4 mr-1.5" />
        )}
        {copied ? 'Copied!' : 'Copy'}
      </button>
      
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
      >
        {isExporting ? (
          <FileDown className="w-4 h-4 mr-1.5 animate-pulse" />
        ) : (
          <Download className="w-4 h-4 mr-1.5" />
        )}
        Export PPTX
      </button>
    </div>
  );
}

/**
 * Export PPTX using new archetype-based generator
 */
async function exportArchetypePPTX(
  slideId: string,
  archetypeId: ArchetypeId,
  templateProps: TemplateProps,
  slideTitle: string
): Promise<void> {
  const response = await fetch('/api/export/pptx', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      slideId,
      archetypeId,
      props: templateProps,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to export PPTX');
  }

  // Download the file
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const filename = `${slideTitle.replace(/\s+/g, '_').toLowerCase()}.pptx`;
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Legacy HTML-based export (fallback)
 */
async function exportLegacyPPTX(
  slideElement: HTMLDivElement,
  slideTitle: string
): Promise<void> {
  // Dynamic import to avoid SSR issues
  const { exportToPPTX } = await import('@/lib/export/pptxExport');
  const filename = `${slideTitle.replace(/\s+/g, '_').toLowerCase()}.pptx`;
  await exportToPPTX(slideElement, filename);
}
