'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  RefreshCw, 
  Settings,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react';
import { useAuth } from '@/lib/supabase/client';
import { ArchetypeId, TargetAudience, DensityMode } from '@/types/slide';
import { FLUX_ARCHETYPE_CONFIGS } from '@/lib/flux';

// Types
interface FluxSlideData {
  slideId: string;
  imageUrl: string;
  imageBase64?: string;
  archetypeId: ArchetypeId;
  generationTimeMs: number;
  modelUsed: string;
  prompt?: {
    prompt: string;
    style: string;
  };
}

interface GenerationState {
  isGenerating: boolean;
  progress: string;
  error: string | null;
}

// Archetype options
const ARCHETYPE_OPTIONS = Object.values(FLUX_ARCHETYPE_CONFIGS).map(config => ({
  id: config.id,
  label: config.id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
  description: config.description,
}));

const AUDIENCE_OPTIONS: { value: TargetAudience; label: string }[] = [
  { value: 'c_suite', label: 'C-Suite Executives' },
  { value: 'pe_investors', label: 'PE Investors' },
  { value: 'external_client', label: 'External Client' },
  { value: 'internal_team', label: 'Internal Team' },
];

const DENSITY_OPTIONS: { value: DensityMode; label: string }[] = [
  { value: 'presentation', label: 'Presentation Mode' },
  { value: 'read_style', label: 'Read Mode' },
];

const STYLE_OPTIONS = [
  { value: 'mckinsey', label: 'McKinsey Style', color: 'bg-blue-900' },
  { value: 'bcg', label: 'BCG Style', color: 'bg-green-800' },
  { value: 'bain', label: 'Bain Style', color: 'bg-red-800' },
  { value: 'modern', label: 'Modern SaaS', color: 'bg-purple-800' },
];

export default function FluxDashboardPage() {
  const { user } = useAuth();
  
  // Form state
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [data, setData] = useState('');
  const [slideType, setSlideType] = useState<ArchetypeId | 'auto'>('auto');
  const [audience, setAudience] = useState<TargetAudience>('c_suite');
  const [density, setDensity] = useState<DensityMode>('presentation');
  const [style, setStyle] = useState<'mckinsey' | 'bcg' | 'bain' | 'modern'>('mckinsey');
  
  // Generation state
  const [generation, setGeneration] = useState<GenerationState>({
    isGenerating: false,
    progress: '',
    error: null,
  });
  
  // Results
  const [generatedSlide, setGeneratedSlide] = useState<FluxSlideData | null>(null);
  const [slideHistory, setSlideHistory] = useState<FluxSlideData[]>([]);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleGenerate = async () => {
    if (!text.trim() || !message.trim()) return;
    
    setGeneration({
      isGenerating: true,
      progress: 'Analyzing content...',
      error: null,
    });
    
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch('/api/flux-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          text,
          message,
          data: data || undefined,
          slideType,
          audience,
          density,
          style,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate slide');
      }
      
      const result = await response.json();
      
      setGeneratedSlide(result);
      setSlideHistory(prev => [result, ...prev]);
      setGeneration({
        isGenerating: false,
        progress: '',
        error: null,
      });
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setGeneration({
          isGenerating: false,
          progress: '',
          error: 'Generation cancelled',
        });
      } else {
        setGeneration({
          isGenerating: false,
          progress: '',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  };

  const handleCancel = () => {
    abortControllerRef.current?.abort();
  };

  const handleDownload = async (slide: FluxSlideData) => {
    try {
      const response = await fetch(slide.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `slide-${slide.slideId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">SlideTheory Flux</h1>
              <p className="text-xs text-slate-500">AI Image Generation Beta</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="/dashboard" 
              className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 px-3 py-1.5 rounded-md hover:bg-teal-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to HTML Mode
            </a>
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-slate-600">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-purple-900">Flux 2.0 Image Generation</h3>
                  <p className="text-sm text-purple-700 mt-1">
                    Generate presentation slides as AI images using Flux 2.0. 
                    This is an experimental feature - images may have text rendering issues.
                  </p>
                </div>
              </div>
            </div>

            {/* Context Input */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Context / Background
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your research notes, data, or background information here..."
                className="w-full h-32 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-sm"
              />
            </div>

            {/* Key Message */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Key Message / Takeaway
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's the single most important point?"
                className="w-full h-20 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-sm"
              />
            </div>

            {/* Data */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Data / Metrics (Optional)
              </label>
              <textarea
                value={data}
                onChange={(e) => setData(e.target.value)}
                placeholder="Paste any specific numbers, metrics, or data points..."
                className="w-full h-20 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-sm"
              />
            </div>

            {/* Options */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h3 className="font-semibold text-slate-900">Options</h3>
              
              {/* Slide Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Slide Type
                </label>
                <select
                  value={slideType}
                  onChange={(e) => setSlideType(e.target.value as ArchetypeId | 'auto')}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="auto">Auto-detect</option>
                  {ARCHETYPE_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Audience */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Audience
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as TargetAudience)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500"
                >
                  {AUDIENCE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Density */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Density Mode
                </label>
                <select
                  value={density}
                  onChange={(e) => setDensity(e.target.value as DensityMode)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500"
                >
                  {DENSITY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Style */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Visual Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STYLE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setStyle(opt.value as any)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-sm transition-all ${
                        style === opt.value
                          ? 'border-purple-500 bg-purple-50 text-purple-900'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded ${opt.color}`} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generation.isGenerating ? handleCancel : handleGenerate}
              disabled={!text.trim() || !message.trim()}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                generation.isGenerating
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {generation.isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Cancel Generation
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Image Slide
                </>
              )}
            </button>

            {/* Error */}
            {generation.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-700">{generation.error}</p>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
            
            {/* Generated Slide */}
            <AnimatePresence mode="wait">
              {generation.isGenerating ? (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-video bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
                  </div>
                  <p className="text-slate-600 font-medium">Generating image...</p>
                  <p className="text-sm text-slate-500 mt-1">This may take 10-30 seconds</p>
                </motion.div>
              ) : generatedSlide ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  {/* Image Container */}
                  <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={generatedSlide.imageUrl}
                      alt="Generated slide"
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Overlay Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{generatedSlide.generationTimeMs}ms</span>
                          <span className="text-white/60">•</span>
                          <span>{generatedSlide.modelUsed}</span>
                        </div>
                        <button
                          onClick={() => handleDownload(generatedSlide)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Prompt Preview */}
                  {generatedSlide.prompt && (
                    <div className="bg-slate-100 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Prompt Used</h4>
                      <p className="text-xs text-slate-600 line-clamp-4 font-mono">
                        {generatedSlide.prompt.prompt}
                      </p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="aspect-video bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400"
                >
                  <ImageIcon className="w-16 h-16 mb-4" />
                  <p className="font-medium">Your generated slide will appear here</p>
                  <p className="text-sm mt-1">Fill in the details and click Generate</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* History */}
            {slideHistory.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700">Recent Generations</h3>
                <div className="grid grid-cols-2 gap-4">
                  {slideHistory.slice(1, 5).map((slide) => (
                    <div
                      key={slide.slideId}
                      className="aspect-video bg-slate-900 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setGeneratedSlide(slide)}
                    >
                      <img
                        src={slide.imageUrl}
                        alt="Previous slide"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
