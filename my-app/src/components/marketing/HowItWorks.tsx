'use client';

import { FileText, Brain, Presentation } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Dump your context',
    description: 'Paste your strategy brief, client notes, or raw ideas. No formatting needed.',
    icon: FileText,
  },
  {
    step: '02',
    title: 'AI structures your story',
    description: 'Our AI applies MECE frameworks and the Pyramid Principle to build your narrative.',
    icon: Brain,
  },
  {
    step: '03',
    title: 'Export & present',
    description: 'Get a polished slide in PowerPoint or copy to clipboard—ready for your client.',
    icon: Presentation,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            From brief to boardroom in 3 steps
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((item, i) => (
            <div key={i} className="relative">
              {/* Connector line */}
              {i < 2 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-slate-200" />
              )}
              
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <span className="inline-block text-4xl font-bold text-teal-100 mb-4">{item.step}</span>
                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
