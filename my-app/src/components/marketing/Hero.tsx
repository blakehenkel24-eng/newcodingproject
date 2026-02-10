'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Lock, Trash2 } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 to-white -z-10" />
      
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 border border-teal-200 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span className="text-sm font-medium text-teal-700">AI-Powered for Strategy Consultants</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Build consultant-grade slides
          <span className="block mt-2 bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent">
            in minutes, not hours
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Transform your strategy briefs into McKinsey-quality presentations. 
          Used by consultants at top firms to cut deck creation time by 90%.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/login"
            className="
              w-full sm:w-auto
              bg-gradient-to-r from-teal-600 to-teal-500
              hover:from-teal-500 hover:to-teal-400
              text-white font-semibold
              px-8 py-4 rounded-full
              shadow-lg shadow-teal-500/25
              transition-all hover:scale-105 hover:shadow-xl hover:shadow-teal-500/30
              flex items-center justify-center gap-2
            "
          >
            Generate Your First Slide
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <a
            href="#features"
            className="
              w-full sm:w-auto
              border-2 border-slate-300
              text-slate-700 font-semibold
              px-8 py-4 rounded-full
              hover:border-teal-500 hover:text-teal-600
              transition-colors
            "
          >
            See Examples
          </a>
        </div>

        {/* Security Trust Bar */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Zero Data Retention</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
            <Lock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Auto-Delete After Use</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full">
            <Trash2 className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Data Never Stored</span>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-4">Trusted by strategy consultants at</p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 opacity-60">
            {['McKinsey', 'BCG', 'Bain', 'Deloitte', 'Accenture'].map((firm) => (
              <span key={firm} className="text-slate-400 font-semibold text-sm sm:text-base">{firm}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
