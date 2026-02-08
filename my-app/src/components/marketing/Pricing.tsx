'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

export function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
    {
      name: 'Starter',
      description: 'For trying out SlideTheory',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        '5 slides per day',
        'All 10+ templates',
        'Copy to clipboard',
        'Email support',
      ],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Professional',
      description: 'For serious consultants',
      monthlyPrice: 12,
      yearlyPrice: 10,
      features: [
        'Unlimited slides',
        'All templates',
        'PPTX export',
        'Priority support',
        'Team collaboration',
        'Custom branding',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">Pricing</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
            Simple, consultant-friendly pricing
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Start free. Upgrade when you&apos;re ready to supercharge your workflow.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center items-center gap-3 mb-12">
          <span className={`text-sm font-medium ${!isYearly ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-14 h-7 rounded-full transition-colors ${isYearly ? 'bg-teal-600' : 'bg-slate-300'}`}
          >
            <span 
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${isYearly ? 'right-1' : 'left-1'}`} 
            />
          </button>
          <span className={`text-sm font-medium ${isYearly ? 'text-slate-900' : 'text-slate-500'}`}>Yearly</span>
          <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Save 20%</span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`bg-white rounded-2xl p-8 relative ${
                plan.popular 
                  ? 'border-2 border-teal-500 shadow-xl shadow-teal-500/10' 
                  : 'border border-slate-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-teal-600 to-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-slate-600 mb-6">{plan.description}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-bold text-slate-900">
                  ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className="text-slate-500">/month</span>
                {isYearly && plan.yearlyPrice > 0 && (
                  <span className="block text-sm text-slate-400 mt-1">Billed yearly (${(plan.yearlyPrice * 12).toFixed(2)})</span>
                )}
              </div>

              <Link
                href="/login"
                className={`w-full block text-center py-3 px-4 font-semibold rounded-xl transition-all mb-8 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white hover:shadow-lg'
                    : 'border-2 border-slate-300 text-slate-700 hover:border-teal-500 hover:text-teal-600'
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-slate-700">
                    <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.popular && (
                <p className="text-center text-sm text-slate-500 mt-6">
                  14-day free trial • No credit card required
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Trust Note */}
        <p className="text-center text-sm text-slate-500 mt-8">
          Join 500+ consultants already saving hours every week
        </p>
      </div>
    </section>
  );
}
