'use client';

import { Sparkles, Layout, Download, Shield, Clock, Users } from 'lucide-react';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconColor: 'teal' | 'orange';
}

function FeatureCard({ icon, title, description, iconColor }: FeatureCardProps) {
  const iconBgClass = iconColor === 'teal' 
    ? 'bg-teal-50 text-teal-600' 
    : 'bg-orange-50 text-orange-500';

  return (
    <div className="group bg-white rounded-xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      <div className={`w-12 h-12 rounded-lg ${iconBgClass} flex items-center justify-center mb-5`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">
        {title}
      </h3>
      <p className="text-slate-600 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

const features = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'AI-Powered Generation',
    description: 'Transform your brief into a complete presentation in under 30 seconds. Our AI understands consulting frameworks and applies them automatically.',
    iconColor: 'teal' as const,
  },
  {
    icon: <Layout className="w-6 h-6" />,
    title: 'Expert Templates',
    description: 'Access 10+ consultant-grade templates designed for every scenario. From board decks to status updates, always start with a proven structure.',
    iconColor: 'teal' as const,
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: 'One-Click Export',
    description: 'Export to PowerPoint, copy to clipboard, or download as PDF. Your slides work seamlessly with the tools you already use.',
    iconColor: 'orange' as const,
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Enterprise Security',
    description: 'Your client data stays protected with SOC 2 compliant infrastructure. End-to-end encryption and strict access controls.',
    iconColor: 'teal' as const,
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Save 90% of Time',
    description: 'Reduce slide creation time from hours to minutes. Focus on insights and strategy instead of formatting and layout.',
    iconColor: 'orange' as const,
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Built for Teams',
    description: 'Share templates and best practices across your consulting practice. Collaborate seamlessly with built-in version control.',
    iconColor: 'teal' as const,
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Everything you need to close faster
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Professional-grade tools designed for management consultants who demand excellence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconColor={feature.iconColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
