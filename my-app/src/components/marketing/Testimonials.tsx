'use client';

import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "SlideTheory cut my deck creation time from 6 hours to 45 minutes. Game changer for tight deadlines.",
    author: 'Sarah Chen',
    role: 'Senior Consultant',
    firm: 'McKinsey'
  },
  {
    quote: "The AI actually understands consulting frameworks. It is like having a first-year analyst who never sleeps.",
    author: 'James Miller',
    role: 'Manager',
    firm: 'BCG'
  },
  {
    quote: "My clients have noticed the difference. The slides look sharper, and I spend more time on strategy.",
    author: 'Emma Rodriguez',
    role: 'Independent Consultant',
    firm: 'Former Bain'
  }
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Loved by strategy consultants
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-orange-400 text-orange-400" />
                ))}
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed">&quot;{testimonial.quote}&quot;</p>
              <div>
                <p className="font-semibold text-slate-900">{testimonial.author}</p>
                <p className="text-sm text-slate-500">{testimonial.role} • {testimonial.firm}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
