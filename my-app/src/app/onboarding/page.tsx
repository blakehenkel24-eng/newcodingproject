'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Clock, 
  Palette,
  ChevronRight,
  ChevronLeft,
  Play,
  LayoutDashboard,
  FileText,
  Upload,
  Wand2
} from 'lucide-react';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { UseCaseSelector, UseCase } from '@/components/onboarding/UseCaseSelector';
import { TemplatePreview } from '@/components/onboarding/TemplatePreview';
import { TutorialTooltip, TutorialStep } from '@/components/onboarding/TutorialTooltip';
import { SlideType } from '@/types/slide';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const ONBOARDING_STORAGE_KEY = 'slidetheory_onboarding_completed';
const ONBOARDING_PROGRESS_KEY = 'slidetheory_onboarding_progress';

const steps = ['Welcome', 'Use Case', 'Templates', 'Tutorial', 'Complete'];

const tutorialSteps: TutorialStep[] = [
  {
    target: '[data-tutorial="context"]',
    title: 'Add Your Context',
    content: 'Paste your research notes, data, or any background information here. This helps AI understand the full picture.',
    position: 'right',
  },
  {
    target: '[data-tutorial="message"]',
    title: 'Define Your Key Message',
    content: 'What\'s the one thing you want your audience to remember? This guides how the slide is structured.',
    position: 'right',
  },
  {
    target: '[data-tutorial="data"]',
    title: 'Include Data (Optional)',
    content: 'Add specific numbers or metrics to include in your slide. The AI will visualize them appropriately.',
    position: 'right',
  },
  {
    target: '[data-tutorial="generate"]',
    title: 'Generate Your Slide',
    content: 'Click here to create your slide! The AI will choose the best template and layout based on your content.',
    position: 'top',
  },
];

// Safe localStorage helper functions
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setLocalStorageItem = (key: string, value: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const removeLocalStorageItem = (key: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Form state
  const [selectedUseCases, setSelectedUseCases] = useState<UseCase[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<SlideType[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  // Sample content for tutorial step
  const [sampleContext] = useState(
    `Q3 Performance Review:
- Revenue grew 25% YoY to $2.4M
- Customer acquisition cost reduced by 15%
- New enterprise clients: 3 (Acme Corp, TechStart, GlobalBiz)
- Team expanded from 12 to 18 members`
  );
  const [sampleMessage] = useState('Strong Q3 results position us for aggressive Q4 expansion');

  // Set isClient to true once component mounts (prevents hydration mismatches)
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      checkOnboardingStatus();
    }
  }, [isClient]);

  const checkOnboardingStatus = async () => {
    try {
      // Check localStorage first
      const completed = getLocalStorageItem(ONBOARDING_STORAGE_KEY);
      if (completed === 'true') {
        router.push('/dashboard');
        return;
      }

      // Check if user has already generated slides
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: slides } = await supabase
          .from('slides')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (slides && slides.length > 0) {
          setLocalStorageItem(ONBOARDING_STORAGE_KEY, 'true');
          router.push('/dashboard');
          return;
        }

        // Restore progress if exists
        const savedProgress = getLocalStorageItem(ONBOARDING_PROGRESS_KEY);
        if (savedProgress) {
          try {
            const progress = JSON.parse(savedProgress);
            setCurrentStep(progress.step || 1);
            setSelectedUseCases(progress.useCases || []);
            setSelectedTemplates(progress.templates || []);
          } catch {
            // Invalid JSON, ignore
          }
        }
      }
    } catch {
      // Continue with onboarding
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = () => {
    const progress = {
      step: currentStep,
      useCases: selectedUseCases,
      templates: selectedTemplates,
    };
    setLocalStorageItem(ONBOARDING_PROGRESS_KEY, JSON.stringify(progress));
  };

  useEffect(() => {
    if (!isLoading && isClient) {
      saveProgress();
    }
  }, [currentStep, selectedUseCases, selectedTemplates, isLoading, isClient]);

  const transitionToStep = (newStep: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(newStep);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 200);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      if (currentStep === 4) {
        // Start tutorial
        setShowTutorial(true);
      } else {
        transitionToStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      transitionToStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      // Save preferences to user profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({
            onboarding_completed: true,
            preferred_use_cases: selectedUseCases,
            preferred_templates: selectedTemplates,
          })
          .eq('id', user.id);
      }

      // Mark as completed
      setLocalStorageItem(ONBOARDING_STORAGE_KEY, 'true');
      removeLocalStorageItem(ONBOARDING_PROGRESS_KEY);
      
      toast.success('Welcome to SlideTheory!');
      router.push('/dashboard');
    } catch {
      toast.error('Something went wrong, but let\'s continue!');
      router.push('/dashboard');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkipOnboarding = () => {
    setLocalStorageItem(ONBOARDING_STORAGE_KEY, 'true');
    router.push('/dashboard');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 2:
        return selectedUseCases.length > 0;
      case 3:
        return true; // Templates are optional
      default:
        return true;
    }
  };

  // Show loading state during SSR and initial client load
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-accent-teal animate-pulse" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-navy to-accent-teal rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-navy">SlideTheory</span>
          </div>
          <button
            onClick={handleSkipOnboarding}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip onboarding
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Step indicator */}
          <StepIndicator
            currentStep={currentStep}
            totalSteps={steps.length}
            steps={steps}
          />

          {/* Step content */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-h-[500px]">
            <div 
              className={`transition-all duration-200 ${
                isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
            >
              {/* Step 1: Welcome */}
              {currentStep === 1 && (
                <div className="p-8 md:p-12">
                  <div className="text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-navy to-accent-teal rounded-2xl mb-6 shadow-lg shadow-accent-teal/20">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                      Welcome to SlideTheory
                    </h1>
                    
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      Transform your ideas into professional presentation slides in seconds. 
                      No design skills needed—just bring your content.
                    </p>

                    {/* Value props */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                      <div className="p-5 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-accent-teal/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Zap className="w-6 h-6 text-accent-teal" />
                        </div>
                        <h3 className="font-semibold text-navy mb-1">AI-Powered</h3>
                        <p className="text-sm text-gray-600">Generate slides from text in seconds</p>
                      </div>
                      
                      <div className="p-5 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-accent-teal/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Palette className="w-6 h-6 text-accent-teal" />
                        </div>
                        <h3 className="font-semibold text-navy mb-1">Professional</h3>
                        <p className="text-sm text-gray-600">Consulting-grade templates and layouts</p>
                      </div>
                      
                      <div className="p-5 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-accent-teal/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Clock className="w-6 h-6 text-accent-teal" />
                        </div>
                        <h3 className="font-semibold text-navy mb-1">Time-Saving</h3>
                        <p className="text-sm text-gray-600">Focus on content, not formatting</p>
                      </div>
                    </div>

                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-navy hover:bg-blue-800 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-navy/20"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Use Case Selection */}
              {currentStep === 2 && (
                <div className="p-8 md:p-12">
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
                        What type of slides do you make?
                      </h2>
                      <p className="text-gray-600">
                        Select all that apply. This helps us personalize your experience.
                      </p>
                    </div>

                    <UseCaseSelector
                      selected={selectedUseCases}
                      onChange={setSelectedUseCases}
                    />

                    <div className="mt-8 flex justify-between items-center">
                      <button
                        onClick={handlePrev}
                        className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-navy transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className="flex items-center gap-2 px-8 py-3 bg-navy hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
                      >
                        Continue
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Template Preferences */}
              {currentStep === 3 && (
                <div className="p-8 md:p-12">
                  <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
                        Choose your templates
                      </h2>
                      <p className="text-gray-600">
                        Pick the slide layouts you&apos;ll use most. You can always change this later.
                      </p>
                    </div>

                    <TemplatePreview
                      selected={selectedTemplates}
                      onChange={setSelectedTemplates}
                    />

                    <div className="mt-8 flex justify-between items-center">
                      <button
                        onClick={handlePrev}
                        className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-navy transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                      </button>
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-8 py-3 bg-navy hover:bg-blue-800 text-white font-semibold rounded-lg transition-all"
                      >
                        Continue
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Tutorial */}
              {currentStep === 4 && (
                <div className="p-8 md:p-12">
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
                        Let&apos;s create your first slide
                      </h2>
                      <p className="text-gray-600">
                        Here&apos;s a quick walkthrough of how SlideTheory works.
                      </p>
                    </div>

                    {/* Mock Input Panel for Tutorial */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 max-w-md mx-auto">
                      <div className="space-y-4">
                        {/* Context */}
                        <div data-tutorial="context">
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                            Context
                          </label>
                          <textarea
                            readOnly
                            value={sampleContext}
                            className="w-full h-24 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 resize-none"
                          />
                        </div>

                        {/* Key Message */}
                        <div data-tutorial="message">
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                            Key Message
                          </label>
                          <textarea
                            readOnly
                            value={sampleMessage}
                            className="w-full h-12 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 resize-none"
                          />
                        </div>

                        {/* Data */}
                        <div data-tutorial="data">
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                            Data / Metrics (Optional)
                          </label>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FileText className="w-4 h-4" />
                            <span>Revenue: $2.4M | Growth: 25%</span>
                          </div>
                        </div>

                        {/* Upload area */}
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-3 text-center">
                          <div className="flex items-center justify-center text-xs text-gray-500">
                            <Upload className="w-4 h-4 mr-1.5" />
                            Drop CSV, Excel, JSON
                          </div>
                        </div>

                        {/* Generate Button */}
                        <div data-tutorial="generate">
                          <button className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-medium text-white bg-navy rounded-md">
                            <Wand2 className="w-4 h-4 mr-2" />
                            Generate Slide
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 text-center">
                      <button
                        onClick={() => setShowTutorial(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent-teal hover:bg-accent-teal/90 text-white font-semibold rounded-lg transition-all"
                      >
                        <Play className="w-5 h-5" />
                        Start Interactive Tour
                      </button>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                      <button
                        onClick={handlePrev}
                        className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-navy transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                      </button>
                      <button
                        onClick={handleNext}
                        className="text-sm text-gray-500 hover:text-accent-teal transition-colors"
                      >
                        Skip tutorial →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Completion */}
              {currentStep === 5 && (
                <div className="p-8 md:p-12">
                  <div className="text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
                      <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                      You&apos;re all set!
                    </h2>

                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      You&apos;re ready to create stunning presentation slides with SlideTheory. 
                      Remember, you get <span className="font-semibold text-accent-teal">10 free generations</span> per day.
                    </p>

                    {/* Summary */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                      <h3 className="font-semibold text-navy mb-4">Your preferences:</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-accent-teal/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent-teal" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Use cases:</span>
                            <span className="text-sm text-gray-600 ml-2">
                              {selectedUseCases.length > 0 
                                ? `${selectedUseCases.length} selected` 
                                : 'Auto-detect'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-accent-teal/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent-teal" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Templates:</span>
                            <span className="text-sm text-gray-600 ml-2">
                              {selectedTemplates.length > 0 
                                ? `${selectedTemplates.length} selected` 
                                : 'Smart auto-selection'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleComplete}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-navy to-accent-teal hover:from-blue-800 hover:to-teal-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-accent-teal/20"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <LayoutDashboard className="w-5 h-5" />
                          Go to Dashboard
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Tutorial Tooltip */}
      <TutorialTooltip
        steps={tutorialSteps}
        currentStep={tutorialStep}
        onNext={() => {
          if (tutorialStep < tutorialSteps.length - 1) {
            setTutorialStep(tutorialStep + 1);
          } else {
            setShowTutorial(false);
            setCurrentStep(5);
          }
        }}
        onPrev={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
        onSkip={() => {
          setShowTutorial(false);
          setCurrentStep(5);
        }}
        onComplete={() => {
          setShowTutorial(false);
          setCurrentStep(5);
        }}
        isOpen={showTutorial}
      />
    </div>
  );
}
