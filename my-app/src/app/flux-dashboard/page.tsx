'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Download,
  RefreshCw,
  Image as ImageIcon,
  Clock
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import toast from 'react-hot-toast';
import { ArchetypeId, TargetAudience, DensityMode } from '@/types/slide';
import { FLUX_ARCHETYPE_CONFIGS } from '@/lib/flux';

// Types
interface FluxSlideData {
  slideId: string;
  imageUrl: string;
  imageBase64?: string;
  archetypeId: ArchetypeId;
  generationTimeMs: number;
  totalTimeMs: number;
  modelUsed: string;
  structured: {
    title: string;
    coreMessage: string;
    contentType: string;
  };
}

interface UserProfile {
  id: string;
  email: string;
  daily_generation_count: number;
}

export default function FluxDashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const slideRef = useRef<HTMLDivElement>(null);

  // User state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [remainingGenerations, setRemainingGenerations] = useState(10);
  const [isTestUser, setIsTestUser] = useState(false);

  // Form state - same as HTML dashboard
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [data, setData] = useState('');
  const [slideType, setSlideType] = useState<ArchetypeId | 'auto'>('auto');
  const [audience, setAudience] = useState<TargetAudience>('c_suite');
  const [density, setDensity] = useState<DensityMode>('presentation');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSlide, setGeneratedSlide] = useState<FluxSlideData | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // UI state
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Resizable sidebar logic
  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);
  
  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      const newWidth = mouseMoveEvent.clientX;
      const clampedWidth = Math.min(Math.max(newWidth, 280), 480);
      setSidebarWidth(clampedWidth);
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();
      
      if (error || !authUser) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      setUser(profile);
      const testEmails = ['test@slidetheory.com', 'admin@slidetheory.com', 'demo@slidetheory.com'];
      const isTest = testEmails.includes(profile?.email?.toLowerCase());
      setIsTestUser(isTest);
      setRemainingGenerations(isTest ? 999 : 10 - (profile?.daily_generation_count || 0));
    } catch {
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!text.trim() || !message.trim()) {
      toast.error('Please enter context and key message');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/flux-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          message,
          data: data || undefined,
          slideType,
          audience,
          density,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate slide');
      }

      setGeneratedSlide(result);
      setRemainingGenerations(prev => Math.max(0, prev - 1));
      
      toast.success(
        <div>
          <p className="font-medium">Slide generated in {result.totalTimeMs}ms!</p>
          <p className="text-sm text-gray-600">Archetype: {result.archetypeId.replace(/_/g, ' ')}</p>
        </div>,
        { duration: 4000 }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setGenerationError(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedSlide) return;
    
    try {
      const response = await fetch(generatedSlide.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `flux-slide-${generatedSlide.slideId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded');
    } catch {
      toast.error('Download failed');
    }
  };

  // Archetype options - same as HTML dashboard
  const archetypeOptions = [
    { id: 'auto', label: '✨ Auto-select (Recommended)', category: 'Smart' },
    ...Object.values(FLUX_ARCHETYPE_CONFIGS).map(config => ({
      id: config.id,
      label: config.id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      category: 'Manual',
    })),
  ];

  const audiences: { value: TargetAudience; label: string }[] = [
    { value: 'c_suite', label: 'C-Suite' },
    { value: 'pe_investors', label: 'PE Investors' },
    { value: 'external_client', label: 'External Client' },
    { value: 'internal_team', label: 'Internal Team' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header - matches HTML dashboard */}
      <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center space-x-3">
          <Logo size="sm" showText={true} variant="dark" />
          <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Flux 2.0
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full font-medium">
            INTERNAL TESTING
          </span>
          <div className="w-px h-4 bg-gray-300" />
          {isTestUser ? (
            <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
              Test User - Unlimited
            </span>
          ) : (
            <span className="text-xs text-gray-500">
              {remainingGenerations} generation{remainingGenerations !== 1 ? 's' : ''} left
            </span>
          )}
          <div className="w-7 h-7 bg-purple-900 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Input Panel (matches HTML dashboard structure) */}
        <aside 
          className="bg-white border-r border-gray-200 flex flex-col shrink-0 relative"
          style={{ width: sidebarWidth }}
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Internal Testing Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                <strong>Internal Testing Only</strong><br />
                This Flux 2.0 feature is for A/B testing. Compare outputs with the 
                <a href="/dashboard" className="underline hover:text-amber-900">main dashboard</a>.
              </p>
            </div>

            {/* Context Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Context / Background
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your research notes, data, or background information here..."
                className="w-full h-32 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-sm"
                disabled={isGenerating}
              />
            </div>

            {/* Key Message */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Key Message / Takeaway <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's the single most important point you want to communicate?"
                className="w-full h-20 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-sm"
                disabled={isGenerating}
              />
            </div>

            {/* Data */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Data / Metrics <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={data}
                onChange={(e) => setData(e.target.value)}
                placeholder="Paste any specific numbers, metrics, or data points..."
                className="w-full h-20 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-sm"
                disabled={isGenerating}
              />
            </div>

            {/* Options Toggle */}
            <div>
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center justify-between w-full py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                <span>Options</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showOptions ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showOptions && (
                <div className="mt-3 space-y-4 pt-4 border-t border-gray-200">
                  {/* Slide Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Slide Type
                    </label>
                    <select
                      value={slideType}
                      onChange={(e) => setSlideType(e.target.value as ArchetypeId | 'auto')}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 text-sm"
                      disabled={isGenerating}
                    >
                      {archetypeOptions.map(opt => (
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
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 text-sm"
                      disabled={isGenerating}
                    >
                      {audiences.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Density */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Density Mode
                    </label>
                    <div className="flex gap-2">
                      {(['presentation', 'read_style'] as DensityMode[]).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setDensity(mode)}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            density === mode
                              ? 'bg-purple-100 text-purple-700 border border-purple-300'
                              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                          }`}
                          disabled={isGenerating}
                        >
                          {mode === 'presentation' ? 'Presentation' : 'Read Mode'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !text.trim() || !message.trim()}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating Image...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Slide
                </>
              )}
            </button>

            {/* Error */}
            {generationError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700">{generationError}</p>
              </div>
            )}
          </div>
          
          {/* Resize Handle */}
          <div
            className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize flex items-center justify-center hover:bg-purple-50/50 transition-colors group"
            onMouseDown={startResizing}
          >
            <div className="w-0.5 h-8 bg-gray-300 rounded-full group-hover:bg-purple-400" />
          </div>
        </aside>

        {/* Main Preview Area */}
        <main className="flex-1 bg-gray-100 p-6 flex flex-col min-w-0">
          {/* Slide Preview */}
          <div className="flex-1 flex items-center justify-center min-h-0">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-video bg-white rounded-lg shadow-xl flex flex-col items-center justify-center max-w-5xl w-full"
                >
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                    <RefreshCw className="w-10 h-10 text-purple-600 animate-spin" />
                  </div>
                  <p className="text-lg font-medium text-slate-700">Generating your slide...</p>
                  <p className="text-sm text-slate-500 mt-2">This takes 10-30 seconds</p>
                </motion.div>
              ) : generatedSlide ? (
                <motion.div
                  key="result"
                  ref={slideRef}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-5xl aspect-video bg-white shadow-2xl rounded-sm overflow-hidden relative"
                >
                  <img
                    src={generatedSlide.imageUrl}
                    alt={generatedSlide.structured.title}
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="w-full max-w-5xl aspect-video bg-white shadow-xl rounded-lg flex flex-col items-center justify-center"
                >
                  <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                    <ImageIcon className="w-10 h-10 text-purple-300" />
                  </div>
                  <p className="text-lg font-medium text-slate-600">Ready to generate</p>
                  <p className="text-sm text-slate-400 mt-2 text-center max-w-md">
                    Enter your context and key message, then click Generate.<br />
                    Flux 2.0 will create an AI-generated image of your slide.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Slide Info Bar */}
          {generatedSlide && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3"
            >
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <span className="text-gray-500">Archetype:</span>
                  <span className="ml-2 font-medium capitalize">
                    {generatedSlide.archetypeId.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-1.5" />
                  <span>{generatedSlide.totalTimeMs}ms</span>
                </div>
                <div className="text-xs text-gray-400">
                  {generatedSlide.modelUsed}
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
