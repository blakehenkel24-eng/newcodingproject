'use client';

import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  PieChart, 
  Lightbulb,
  Check
} from 'lucide-react';

export type UseCase = 
  | 'business_strategy'
  | 'sales_pitches'
  | 'financial_reports'
  | 'team_updates'
  | 'training_education'
  | 'consulting'
  | 'startup_fundraising';

interface UseCaseOption {
  id: UseCase;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const useCases: UseCaseOption[] = [
  {
    id: 'business_strategy',
    label: 'Business Strategy',
    description: 'Market analysis, competitive positioning, and strategic planning',
    icon: Briefcase,
    color: 'bg-blue-500',
  },
  {
    id: 'sales_pitches',
    label: 'Sales & Pitches',
    description: 'Client proposals, product demos, and sales presentations',
    icon: TrendingUp,
    color: 'bg-green-500',
  },
  {
    id: 'financial_reports',
    label: 'Financial Reports',
    description: 'Quarterly reviews, investor updates, and financial analysis',
    icon: PieChart,
    color: 'bg-purple-500',
  },
  {
    id: 'team_updates',
    label: 'Team Updates',
    description: 'Project status, team meetings, and internal communications',
    icon: Users,
    color: 'bg-orange-500',
  },
  {
    id: 'training_education',
    label: 'Training & Education',
    description: 'Workshops, training materials, and educational content',
    icon: GraduationCap,
    color: 'bg-teal-500',
  },
  {
    id: 'consulting',
    label: 'Consulting',
    description: 'Client deliverables, recommendations, and analysis',
    icon: Lightbulb,
    color: 'bg-indigo-500',
  },
];

interface UseCaseSelectorProps {
  selected: UseCase[];
  onChange: (selected: UseCase[]) => void;
}

export function UseCaseSelector({ selected, onChange }: UseCaseSelectorProps) {
  const toggleUseCase = (useCase: UseCase) => {
    if (selected.includes(useCase)) {
      onChange(selected.filter((id) => id !== useCase));
    } else {
      onChange([...selected, useCase]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {useCases.map((useCase) => {
        const isSelected = selected.includes(useCase.id);
        const Icon = useCase.icon;
        
        return (
          <button
            key={useCase.id}
            onClick={() => toggleUseCase(useCase.id)}
            className={`relative p-5 rounded-xl border-2 text-left transition-all duration-300 group ${
              isSelected
                ? 'border-accent-teal bg-teal-50 shadow-lg shadow-accent-teal/10'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            }`}
          >
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-accent-teal rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            
            {/* Icon */}
            <div className={`w-12 h-12 ${useCase.color} rounded-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            
            {/* Content */}
            <h3 className={`font-semibold mb-1 ${isSelected ? 'text-navy' : 'text-gray-900'}`}>
              {useCase.label}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {useCase.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
