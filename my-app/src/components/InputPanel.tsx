'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { SlideType, TargetAudience, DensityMode, SlideData, getArchetypeOptions } from '@/types/slide';
import { parseFile, formatParsedDataForLLM } from '@/lib/parsers';
import { FileText, Upload, Loader2, Wand2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface InputPanelProps {
  onSlideGenerated: (data: SlideData) => void;
  remainingGenerations: number;
}

// New archetype options grouped by category
const archetypeOptions = getArchetypeOptions();

// Legacy slide types for backward compatibility
const legacySlideTypes: { value: SlideType; label: string }[] = [
  { value: 'auto', label: '✨ Auto-select (Recommended)' },
];

const audiences: { value: TargetAudience; label: string }[] = [
  { value: 'c_suite', label: 'C-Suite' },
  { value: 'pe_investors', label: 'PE Investors' },
  { value: 'external_client', label: 'External Client' },
  { value: 'internal_team', label: 'Internal Team' },
];

export function InputPanel({ onSlideGenerated, remainingGenerations }: InputPanelProps) {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [data, setData] = useState('');
  const [fileName, setFileName] = useState('');
  const [parsedFileContent, setParsedFileContent] = useState('');
  const [slideType, setSlideType] = useState<SlideType>('auto');
  const [audience, setAudience] = useState<TargetAudience>('c_suite');
  const [density, setDensity] = useState<DensityMode>('presentation');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const parsed = await parseFile(file);
      setFileName(file.name);
      const formatted = formatParsedDataForLLM(parsed);
      setParsedFileContent(formatted);
      toast.success(`Parsed: ${file.name}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to parse file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleGenerate = async () => {
    if (!text.trim() || !message.trim()) {
      toast.error('Please provide context and a key message');
      return;
    }

    if (remainingGenerations <= 0) {
      toast.error('Daily limit reached');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          message,
          data: data || undefined,
          fileContent: parsedFileContent || undefined,
          slideType,
          audience,
          density,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate slide');
      }

      const slideData: SlideData = await response.json();
      onSlideGenerated(slideData);
      
      // Show QA feedback
      if (slideData.qaRecommendations && slideData.qaRecommendations.length > 0) {
        toast.success(
          `Slide generated! Quality score: ${slideData.qaScore}/100`,
          { duration: 4000 }
        );
      } else {
        toast.success('Slide generated successfully!');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate slide');
    } finally {
      setIsGenerating(false);
    }
  };

  // Group archetypes by category for the dropdown
  const groupedOptions = archetypeOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, typeof archetypeOptions>);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2 text-teal-600">
        <Sparkles className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wide">AI-Powered Generation</span>
      </div>

      {/* Context */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
          Context / Background
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste research notes, data, meeting transcripts, or any background information..."
          className="w-full h-28 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Key Message */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
          Key Message / Takeaway
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's the single most important insight or recommendation?"
          className="w-full h-16 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        />
        <p className="mt-1 text-xs text-gray-500">
          Tip: Follow the format: [WHAT] + [SO WHAT] + [NOW WHAT]
        </p>
      </div>

      {/* Data */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
          Data / Metrics <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Key numbers, percentages, dollar amounts..."
          className="w-full h-14 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        />
      </div>

      {/* File Upload */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-3 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        {fileName ? (
          <div className="flex items-center justify-center text-xs text-gray-600">
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            {fileName}
          </div>
        ) : (
          <div className="flex items-center justify-center text-xs text-gray-500">
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Drop CSV, Excel, JSON (max 5MB)
          </div>
        )}
      </div>

      {/* Options Toggle */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center text-xs text-gray-500 hover:text-gray-700"
      >
        {showOptions ? <ChevronUp className="w-3.5 h-3.5 mr-1" /> : <ChevronDown className="w-3.5 h-3.5 mr-1" />}
        Options
      </button>

      {/* Options */}
      {showOptions && (
        <div className="space-y-3 pt-2 border-t border-gray-200">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Slide Archetype</label>
            <select
              value={slideType}
              onChange={(e) => setSlideType(e.target.value as SlideType)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <optgroup label="Recommended">
                {legacySlideTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </optgroup>
              {Object.entries(groupedOptions).map(([category, options]) => (
                <optgroup key={category} label={category}>
                  {options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Auto-select uses AI to choose the best archetype for your content
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Audience</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as TargetAudience)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {audiences.map((aud) => (
                  <option key={aud.value} value={aud.value}>{aud.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Mode</label>
              <select
                value={density}
                onChange={(e) => setDensity(e.target.value as DensityMode)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="presentation">Presentation</option>
                <option value="read_style">Read Style</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || remainingGenerations <= 0}
        className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 mr-2" />
            Generate Slide
          </>
        )}
      </button>

      {remainingGenerations <= 3 && remainingGenerations > 0 && (
        <p className="text-xs text-amber-600 text-center">
          {remainingGenerations} generation{remainingGenerations !== 1 ? 's' : ''} remaining today
        </p>
      )}

      {remainingGenerations <= 0 && (
        <p className="text-xs text-red-600 text-center">
          Daily limit reached. Upgrade for more.
        </p>
      )}
    </div>
  );
}
