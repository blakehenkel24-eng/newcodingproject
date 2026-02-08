'use client';

import { useEffect, useState } from 'react';
import { X, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react';

export interface TutorialStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialTooltipProps {
  steps: TutorialStep[];
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onComplete: () => void;
  isOpen: boolean;
}

export function TutorialTooltip({
  steps,
  currentStep,
  onNext,
  onPrev,
  onSkip,
  onComplete,
  isOpen,
}: TutorialTooltipProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const currentTutorial = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  useEffect(() => {
    if (!isOpen || !currentTutorial) return;

    const updatePosition = () => {
      const targetElement = document.querySelector(currentTutorial.target);
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const tooltipWidth = 320;
      const tooltipHeight = 150;
      const offset = 16;

      let top = 0;
      let left = 0;

      switch (currentTutorial.position) {
        case 'bottom':
          top = rect.bottom + offset;
          left = rect.left + (rect.width - tooltipWidth) / 2;
          break;
        case 'top':
          top = rect.top - tooltipHeight - offset;
          left = rect.left + (rect.width - tooltipWidth) / 2;
          break;
        case 'left':
          top = rect.top + (rect.height - tooltipHeight) / 2;
          left = rect.left - tooltipWidth - offset;
          break;
        case 'right':
          top = rect.top + (rect.height - tooltipHeight) / 2;
          left = rect.right + offset;
          break;
      }

      // Keep within viewport
      left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
      top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16));

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [currentTutorial, isOpen]);

  if (!isOpen || !currentTutorial) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-navy/20 z-40 pointer-events-none" />

      {/* Highlight around target */}
      <div
        className="fixed z-40 pointer-events-none rounded-lg ring-4 ring-accent-teal/50 ring-offset-4 transition-all duration-300"
        style={{
          ...(typeof document !== 'undefined' && document.querySelector(currentTutorial.target)
            ? (() => {
                const rect = document.querySelector(currentTutorial.target)!.getBoundingClientRect();
                return {
                  top: rect.top - 8,
                  left: rect.left - 8,
                  width: rect.width + 16,
                  height: rect.height + 16,
                };
              })()
            : {}),
        }}
      />

      {/* Tooltip */}
      <div
        className="fixed z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300"
        style={{ top: position.top, left: position.left }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-navy to-blue-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent-teal rounded-full flex items-center justify-center">
              <Lightbulb className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">
              Tip {currentStep + 1} of {steps.length}
            </span>
          </div>
          <button
            onClick={onSkip}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h4 className="font-semibold text-navy mb-2">{currentTutorial.title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{currentTutorial.content}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onSkip}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip tour
          </button>
          
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={onPrev}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-navy transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={isLastStep ? onComplete : onNext}
              className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-white bg-accent-teal hover:bg-accent-teal/90 rounded-md transition-colors"
            >
              {isLastStep ? 'Finish' : 'Next'}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 pb-3 bg-gray-50">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === currentStep ? 'bg-accent-teal' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
