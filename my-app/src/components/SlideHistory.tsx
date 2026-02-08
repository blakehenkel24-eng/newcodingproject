'use client';

import { SlideRecord } from '@/types/input';
import { Clock, FileText } from 'lucide-react';

interface SlideHistoryProps {
  slides: SlideRecord[];
  onSelectSlide: (slide: SlideRecord) => void;
}

export function SlideHistory({ slides, onSelectSlide }: SlideHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Recent Slides</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {slides.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No slides yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {slides.map((slide) => (
              <button
                key={slide.id}
                onClick={() => onSelectSlide(slide)}
                className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {slide.selected_template.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {slide.message_input}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(slide.created_at)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
