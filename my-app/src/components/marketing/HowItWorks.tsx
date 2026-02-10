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
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            From brief to boardroom in 3 steps
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-24">
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

        {/* Example Flow Demo - Full Width */}
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">See It In Action</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            Input your brief, get a board-ready slide
          </h2>
        </div>

        {/* Demo Container - 1/3 Input, 2/3 Output */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="grid lg:grid-cols-3 min-h-[600px]">
            
            {/* INPUT SIDE - 1/3 */}
            <div className="p-6 bg-slate-50/80 border-r border-slate-200 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-teal-600" />
                  </div>
                  <span className="font-semibold text-slate-900">Your Input</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-full border border-green-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-green-700">Secure</span>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4 flex-1">
                {/* Context Field */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Context / Background
                  </label>
                  <div className="w-full p-3 text-[13px] bg-white border border-slate-200 rounded-lg text-slate-700 leading-relaxed shadow-sm min-h-[100px]">
                    Client is a premium DTC coffee brand expanding into Europe. 
                    Current: 12 US facilities, $340M revenue, 2.3M subscribers. 
                    Competitors: Nespresso (55% share), local roasters. EU regulations 
                    on packaging, carbon tariffs. 67% of EU consumers prioritize sustainability.
                  </div>
                </div>

                {/* Key Message Field */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Key Message
                  </label>
                  <div className="w-full p-3 text-[13px] bg-white border border-slate-200 rounded-lg text-slate-700 shadow-sm">
                    Europe represents $2.1B opportunity requiring phased rollout starting with Germany & Netherlands.
                  </div>
                </div>

                {/* Data Field */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Data / Metrics
                  </label>
                  <div className="w-full p-3 text-[13px] bg-white border border-slate-200 rounded-lg text-slate-700 shadow-sm">
                    TAM: $2.1B | Target Y1: $45M | CAC: €28 | Break-even: 18mo | ROI: 340%
                  </div>
                </div>

                {/* Generate Button */}
                <button className="w-full flex items-center justify-center py-3 px-4 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-md mt-auto">
                  <Presentation className="w-4 h-4 mr-2" />
                  Generate Slide
                </button>
              </div>
            </div>

            {/* OUTPUT SIDE - 2/3 with 16:9 PowerPoint Slide */}
            <div className="lg:col-span-2 p-8 bg-[#f0f0f0] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">P</span>
                  </div>
                  <span className="font-semibold text-slate-900">Generated Slide</span>
                </div>
                <span className="text-xs text-slate-500">PowerPoint</span>
              </div>

              {/* PowerPoint Slide Container - 16:9 Aspect Ratio */}
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-[720px] aspect-video bg-white shadow-2xl relative">
                  
                  {/* Slide Content - BCG Style */}
                  <div className="absolute inset-0 p-10 flex flex-col">
                    
                    {/* Title */}
                    <h1 className="text-[26px] font-bold text-slate-900 leading-tight mb-4">
                      Capture $2.1B EU Coffee Market with Phased Entry Strategy
                    </h1>

                    {/* Key Message */}
                    <p className="text-[14px] text-slate-600 mb-5 leading-relaxed">
                      Europe represents a $2.1B addressable opportunity, but success requires a phased 
                      rollout starting with Germany and Netherlands, localized sustainability messaging, 
                      and strategic partnerships to achieve profitability within 18 months.
                    </p>

                    {/* 2x2 Grid - BCG Style */}
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      {/* 01 - Market Opportunity - Highlighted */}
                      <div className="relative p-4 bg-slate-50 rounded-sm overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500" />
                        <div className="flex gap-3">
                          <span className="text-xl font-bold text-teal-500">01</span>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">Market Opportunity</h3>
                            <p className="text-xs text-slate-600 leading-snug">
                              $2.1B TAM with 67% of EU consumers prioritizing sustainability certifications
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 02 - Entry Strategy */}
                      <div className="p-4 bg-slate-50 rounded-sm">
                        <div className="flex gap-3">
                          <span className="text-xl font-bold text-slate-300">02</span>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">Entry Strategy</h3>
                            <p className="text-xs text-slate-600 leading-snug">
                              Phased rollout: Germany & Netherlands first, then broader EU expansion
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 03 - Investment Required */}
                      <div className="p-4 bg-slate-50 rounded-sm">
                        <div className="flex gap-3">
                          <span className="text-xl font-bold text-slate-300">03</span>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">Investment Required</h3>
                            <p className="text-xs text-slate-600 leading-snug">
                              $12M initial investment with break-even in 18 months
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 04 - Success Factors */}
                      <div className="p-4 bg-slate-50 rounded-sm">
                        <div className="flex gap-3">
                          <span className="text-xl font-bold text-slate-300">04</span>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">Success Factors</h3>
                            <p className="text-xs text-slate-600 leading-snug">
                              Localized messaging, sustainability certs, logistics partnerships
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Source Footer */}
                    <div className="mt-4 pt-2 border-t border-slate-100">
                      <p className="text-[10px] text-slate-400">
                        Source: Client data and EU market analysis
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats Bar */}
          <div className="px-8 py-4 bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-slate-300">Generated in 12 seconds</span>
              </div>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Would take 45+ minutes manually</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Quality Score:</span>
              <span className="text-sm font-semibold text-teal-400">94/100</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
