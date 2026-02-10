'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { InputPanel } from '@/components/InputPanel';
import { SlidePreview } from '@/components/SlidePreview';
import { ExportButtons } from '@/components/ExportButtons';
import { SlideHistory } from '@/components/SlideHistory';
import { SlideData } from '@/types/slide';
import { UserProfile, SlideRecord } from '@/types/input';
import { Loader2, Settings, Sparkles, CheckCircle, AlertCircle, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { Logo } from '@/components/Logo';

export default function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [slideData, setSlideData] = useState<SlideData | null>(null);
  const [slideHistory, setSlideHistory] = useState<SlideRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [remainingGenerations, setRemainingGenerations] = useState(10);
  const [isTestUser, setIsTestUser] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320); // Default 320px (w-80)
  const [isResizing, setIsResizing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [textCopied, setTextCopied] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Resizable sidebar logic
  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);
  
  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      const newWidth = mouseMoveEvent.clientX;
      // Limit min and max width
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Extract text from slide when data changes
  useEffect(() => {
    if (slideData?.props) {
      const text = extractTextFromSlide(slideData.props);
      setExtractedText(text);
    }
  }, [slideData]);

  const extractTextFromSlide = (props: unknown): string => {
    const typedProps = props as Record<string, unknown>;
    const parts: string[] = [];
    
    if (typedProps.title) parts.push(String(typedProps.title));
    if (typedProps.keyMessage) parts.push(String(typedProps.keyMessage));
    if (typedProps.subtitle) parts.push(String(typedProps.subtitle));
    
    // Extract from points array
    if (Array.isArray(typedProps.points)) {
      typedProps.points.forEach((point: { title?: string; description?: string }) => {
        if (point.title) parts.push(point.title);
        if (point.description) parts.push(point.description);
      });
    }
    
    // Extract from metrics
    if (Array.isArray(typedProps.metrics)) {
      typedProps.metrics.forEach((m: { label?: string; value?: string }) => {
        if (m.label && m.value) parts.push(`${m.label}: ${m.value}`);
      });
    }
    
    return parts.join('\n\n');
  };

  const copyExtractedText = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setTextCopied(true);
      toast.success('Slide text copied to clipboard');
      setTimeout(() => setTextCopied(false), 2000);
    } catch {
      toast.error('Failed to copy text');
    }
  };

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
      // Check if test user (unlimited generations)
      const testEmails = ['test@slidetheory.com', 'admin@slidetheory.com', 'demo@slidetheory.com'];
      const isTest = testEmails.includes(profile?.email?.toLowerCase());
      setIsTestUser(isTest);
      setRemainingGenerations(isTest ? 999 : 10 - (profile?.daily_generation_count || 0));
      await fetchSlideHistory(authUser.id);
    } catch {
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSlideHistory = async (userId: string) => {
    const { data } = await supabase
      .from('slides')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (data) setSlideHistory(data);
  };

  const handleSlideGenerated = (data: SlideData) => {
    setSlideData(data);
    setRemainingGenerations(prev => Math.max(0, prev - 1));
    
    // Show detailed feedback
    const qaMessage = data.qaPassed 
      ? `Quality score: ${data.qaScore}/100 ✅`
      : `Quality score: ${data.qaScore}/100 ⚠️`;
    
    toast.success(
      <div>
        <p className="font-medium">Slide generated in {data.generationTimeMs}ms!</p>
        <p className="text-sm text-gray-600">{qaMessage}</p>
      </div>,
      { duration: 4000 }
    );
    
    if (user) fetchSlideHistory(user.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center space-x-3">
          <Logo size="sm" showText={true} variant="dark" />
          <span className="px-2 py-0.5 text-xs bg-teal-100 text-teal-700 rounded-full">Beta</span>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href="/flux-dashboard"
            className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 px-3 py-1.5 rounded-md hover:bg-purple-50 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Try Flux 2.0
          </a>
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
          <button 
            onClick={() => setShowHistory(!showHistory)} 
            className="text-sm text-gray-600 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-gray-100"
          >
            History
          </button>
          <div className="w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Resizable Left Sidebar */}
        <aside 
          className="bg-white border-r border-gray-200 flex flex-col shrink-0 relative"
          style={{ width: sidebarWidth }}
        >
          <div className="flex-1 overflow-y-auto">
            <InputPanel 
              onSlideGenerated={handleSlideGenerated}
              remainingGenerations={remainingGenerations}
            />
          </div>
          
          {/* Resize Handle */}
          <div
            className="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize flex items-center justify-center hover:bg-teal-50/50 transition-colors group"
            onMouseDown={startResizing}
          >
            <div className="w-0.5 h-8 bg-gray-300 rounded-full group-hover:bg-teal-400" />
          </div>
        </aside>

        <main className="flex-1 bg-gray-100 p-6 flex flex-col min-w-0">
          {/* Slide Preview Area */}
          <div className="flex-1 flex items-center justify-center min-h-0">
            <div 
              ref={slideRef}
              className="w-full max-w-5xl aspect-video bg-white shadow-2xl rounded-sm overflow-hidden"
              style={{ 
                maxWidth: typeof window !== 'undefined' ? `${Math.min(1200, window.innerWidth - sidebarWidth - 100)}px` : '100%' 
              }}
            >
              {slideData ? (
                <SlidePreview
                  templateId={slideData.templateId}
                  archetypeId={slideData.archetypeId}
                  props={slideData.props}
                  density="presentation"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Enter content and click Generate</p>
                    <p className="text-gray-400 text-xs mt-1">AI will auto-select the best slide archetype</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Extracted Text Box - Below Slide Preview */}
          {slideData && extractedText && (
            <div className="mt-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-sm font-medium text-slate-700">Slide Text (Editable)</span>
                <button
                  onClick={copyExtractedText}
                  className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 px-2 py-1 rounded hover:bg-teal-50 transition-colors"
                >
                  {textCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                className="w-full h-24 px-4 py-3 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="Slide text will appear here..."
              />
            </div>
          )}

          {/* Slide Info Bar */}
          {slideData && (
            <div className="mt-4 flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <span className="text-gray-500">Archetype:</span>
                  <span className="ml-2 font-medium capitalize">{slideData.archetypeId.replace(/_/g, ' ')}</span>
                </div>
                {slideData.qaScore > 0 && (
                  <div className="flex items-center">
                    {slideData.qaPassed ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 mr-1.5" />
                    )}
                    <span className={slideData.qaPassed ? 'text-green-600' : 'text-amber-600'}>
                      Quality: {slideData.qaScore}/100
                    </span>
                  </div>
                )}
                <div className="text-xs text-gray-400">
                  {slideData.modelUsed}
                </div>
              </div>
              <ExportButtons 
                slideElement={slideRef.current} 
                slideTitle={slideData.props.title as string}
                slideId={slideData.slideId}
                archetypeId={slideData.archetypeId}
                templateProps={slideData.props as import('@/lib/llm/archetypeClassifier').TemplateProps}
              />
            </div>
          )}
        </main>

        {showHistory && (
          <aside className="w-72 bg-white border-l border-gray-200 flex flex-col shrink-0">
            <SlideHistory slides={slideHistory} onSelectSlide={() => {}} />
          </aside>
        )}
      </div>
    </div>
  );
}
