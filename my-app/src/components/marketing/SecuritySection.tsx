'use client';

import { Shield, Lock, Trash2 } from 'lucide-react';

const securityFeatures = [
  {
    icon: Trash2,
    title: 'Auto-Deleted',
    description: 'All data deleted immediately after slide generation',
  },
  {
    icon: Lock,
    title: 'Anonymized',
    description: 'Company names & contacts anonymized before processing',
  },
  {
    icon: Shield,
    title: 'Never Stored',
    description: 'Zero data retention. Your data never trains AI models',
  },
];

export function SecuritySection() {
  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Header */}
        <h2 className="text-3xl font-bold text-white mb-4">
          Your data is safe with us
        </h2>
        <p className="text-slate-400 mb-12 max-w-xl mx-auto">
          We know consultants handle sensitive client information. 
          That is why we delete everything immediately—no exceptions.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700">
          <div className="flex gap-3 text-sm">
            <span className="text-slate-400">SOC 2</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">GDPR</span>
            <span className="text-slate-600">•</span>
            <a href="/security" className="text-teal-400 hover:text-teal-300">
              Learn more →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
