'use client';

import { useState } from 'react';
import { 
  LayoutGrid, 
  ArrowRight, 
  Table2, 
  BarChart3, 
  GitBranch, 
  Clock, 
  Network,
  Grid2X2,
  Sparkles,
  Check
} from 'lucide-react';
import { SlideType } from '@/types/slide';

interface TemplateOption {
  id: SlideType;
  label: string;
  description: string;
  icon: React.ElementType;
  useCases: string[];
  previewColor: string;
}

const templates: TemplateOption[] = [
  {
    id: 'executive_summary',
    label: 'Executive Summary',
    description: 'High-level overview with key metrics and takeaways',
    icon: LayoutGrid,
    useCases: ['Leadership updates', 'Board presentations'],
    previewColor: 'from-blue-500 to-blue-600',
  },
  {
    id: 'horizontal_flow',
    label: 'Horizontal Flow',
    description: 'Process flows, timelines, and sequential steps',
    icon: ArrowRight,
    useCases: ['Process maps', 'Project plans'],
    previewColor: 'from-green-500 to-green-600',
  },
  {
    id: 'comparison_table',
    label: 'Comparison Table',
    description: 'Side-by-side comparisons and evaluations',
    icon: Table2,
    useCases: ['Vendor comparison', 'Feature analysis'],
    previewColor: 'from-purple-500 to-purple-600',
  },
  {
    id: 'data_chart',
    label: 'Data Chart',
    description: 'Bar charts, line graphs, and data visualization',
    icon: BarChart3,
    useCases: ['Financial data', 'Performance metrics'],
    previewColor: 'from-orange-500 to-orange-600',
  },
  {
    id: 'issue_tree',
    label: 'Issue Tree',
    description: 'Problem breakdown and root cause analysis',
    icon: GitBranch,
    useCases: ['Problem solving', 'Decision trees'],
    previewColor: 'from-red-500 to-red-600',
  },
  {
    id: 'timeline',
    label: 'Timeline',
    description: 'Project roadmaps and chronological events',
    icon: Clock,
    useCases: ['Project planning', 'Milestone tracking'],
    previewColor: 'from-teal-500 to-teal-600',
  },
  {
    id: 'graph_chart',
    label: 'Graph Chart',
    description: 'Network diagrams and relationship mappings',
    icon: Network,
    useCases: ['Org charts', 'System architecture'],
    previewColor: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 'two_by_two_matrix',
    label: '2×2 Matrix',
    description: 'Strategic frameworks and positioning maps',
    icon: Grid2X2,
    useCases: ['Risk assessment', 'Portfolio analysis'],
    previewColor: 'from-pink-500 to-pink-600',
  },
  {
    id: 'multi_metric',
    label: 'Multi Metric',
    description: 'Dashboard-style multiple KPI displays',
    icon: LayoutGrid,
    useCases: ['KPI dashboards', 'Scorecards'],
    previewColor: 'from-cyan-500 to-cyan-600',
  },
];

interface TemplatePreviewProps {
  selected: SlideType[];
  onChange: (selected: SlideType[]) => void;
}

export function TemplatePreview({ selected, onChange }: TemplatePreviewProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<SlideType | null>(null);

  const toggleTemplate = (templateId: SlideType) => {
    if (selected.includes(templateId)) {
      onChange(selected.filter((id) => id !== templateId));
    } else {
      onChange([...selected, templateId]);
    }
  };

  const selectAll = () => {
    onChange(templates.map((t) => t.id));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-4">
      {/* Selection controls */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {selected.length === 0 ? (
            'Select templates you want to use (or we\'ll auto-select for you)'
          ) : (
            <span className="text-accent-teal font-medium">
              {selected.length} template{selected.length !== 1 ? 's' : ''} selected
            </span>
          )}
        </p>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="text-xs text-gray-500 hover:text-accent-teal transition-colors"
          >
            Select All
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={clearAll}
            className="text-xs text-gray-500 hover:text-accent-teal transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const isSelected = selected.includes(template.id);
          const isHovered = hoveredTemplate === template.id;
          const Icon = template.icon;
          
          return (
            <button
              key={template.id}
              onClick={() => toggleTemplate(template.id)}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              className={`relative rounded-xl border-2 overflow-hidden transition-all duration-300 text-left ${
                isSelected
                  ? 'border-accent-teal shadow-lg shadow-accent-teal/10'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {/* Preview header with gradient */}
              <div className={`h-20 bg-gradient-to-br ${template.previewColor} relative overflow-hidden`}>
                {/* Abstract pattern overlay */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-2 left-2 w-8 h-8 bg-white rounded" />
                  <div className="absolute top-4 left-12 w-16 h-4 bg-white rounded" />
                  <div className="absolute top-10 left-4 w-12 h-3 bg-white rounded" />
                  <div className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full" />
                </div>
                
                {/* Selection checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4 text-accent-teal" />
                  </div>
                )}
                
                {/* Icon */}
                <div className="absolute bottom-3 left-3 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4 bg-white">
                <h3 className={`font-semibold mb-1 ${isSelected ? 'text-navy' : 'text-gray-900'}`}>
                  {template.label}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {template.description}
                </p>
                
                {/* Use case tags */}
                <div className="flex flex-wrap gap-1">
                  {template.useCases.map((useCase) => (
                    <span
                      key={useCase}
                      className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Auto-select option */}
      <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-lg border border-teal-100">
        <div className="w-10 h-10 bg-accent-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-accent-teal" />
        </div>
        <div>
          <p className="text-sm font-medium text-navy">Smart Auto-Selection</p>
          <p className="text-xs text-gray-600">
            Don&apos;t worry if you&apos;re unsure—SlideTheory will automatically choose the best template based on your content.
          </p>
        </div>
      </div>
    </div>
  );
}
