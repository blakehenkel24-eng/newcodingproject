'use client';

import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to transform your
          <span className="block text-teal-400">presentation workflow?</span>
        </h2>
        
        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
          Join 500+ consultants who&apos;ve already cut their deck creation time by 90%.
          Start your free trial today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/login"
            className="
              w-full sm:w-auto
              bg-gradient-to-r from-teal-600 to-teal-500
              hover:from-teal-500 hover:to-teal-400
              text-white font-semibold
              px-10 py-4 rounded-full
              text-lg
              shadow-lg shadow-teal-500/25
              transition-all hover:scale-105
              text-center
            "
          >
            Start Free Trial
          </Link>
          
          <a
            href="mailto:demo@slidetheory.com"
            className="
              w-full sm:w-auto
              border border-slate-600
              text-slate-300 font-semibold
              px-10 py-4 rounded-full
              hover:border-teal-500 hover:text-teal-400
              transition-colors
              text-center
            "
          >
            Schedule Demo
          </a>
        </div>

        <p className="text-sm text-slate-500 mt-8">
          14-day free trial • No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  );
}
