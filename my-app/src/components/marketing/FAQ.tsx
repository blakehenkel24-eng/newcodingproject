'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'How does SlideTheory differ from other AI presentation tools?',
    answer: 'Unlike generic AI presentation tools, SlideTheory is specifically built for strategy consultants. We use HTML/CSS rendering instead of image generation, ensuring perfect text accuracy, editability, and professional typography. Our LLM pipeline is trained on consulting frameworks like the Pyramid Principle to structure content the way top-tier firms expect.',
  },
  {
    question: 'Can I edit the slides after they\'re generated?',
    answer: 'Yes! When you export as PPTX, you get fully editable PowerPoint files with selectable text, movable shapes, and editable charts. Unlike image-based AI tools, your slides remain completely editable in PowerPoint, Keynote, or Google Slides.',
  },
  {
    question: 'What slide templates are available?',
    answer: 'SlideTheory includes 8+ slide archetypes: Executive Summary, Horizontal Flow (process/timeline), Vertical Flow (hierarchy), 2x2 Framework, Comparison Matrix, Waterfall/Bridge Chart, Timeline, Graph/Chart, and General Purpose. The AI automatically selects the best template based on your content structure.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We take data security seriously. Your inputs are processed securely and never used to train our AI models. We use industry-standard encryption, and as a consulting-focused tool, we understand the sensitivity of client data. Enterprise plans include additional security features like SSO and data retention controls.',
  },
  {
    question: 'What\'s the difference between Presentation Mode and Read-Style Mode?',
    answer: 'Presentation Mode creates slides optimized for live presenting—less text, larger fonts, and more whitespace. Read-Style Mode creates detail-oriented slides with more comprehensive text, suitable for documents that will be read rather than presented. You can toggle between these modes based on your use case.',
  },
  {
    question: 'How does the free tier work?',
    answer: 'The free tier gives you 10 slides per day with access to all templates and clipboard export. You get 2 regenerations per slide if the first output isn\'t quite right. The daily limit resets at midnight UTC. Upgrade to Pro for unlimited slides, PPTX export, and additional features.',
  },
  {
    question: 'Can I use SlideTheory for client work?',
    answer: 'Yes, Pro users can use SlideTheory for client deliverables. The slides you generate are yours to use commercially. Many consultants use SlideTheory for first drafts and then refine the slides with firm-specific branding and additional analysis.',
  },
  {
    question: 'What file formats can I upload for data?',
    answer: 'SlideTheory supports CSV, Excel (.xlsx), JSON, and plain text files for data upload. You can also paste data directly into the input field. Our parsers automatically extract and structure the data for visualization in charts and tables.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#008080]/10 text-[#008080] text-sm font-semibold mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#003366] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600">
            Everything you need to know about SlideTheory.
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-xl transition-all duration-200 ${
                openIndex === index
                  ? 'border-[#008080]/30 bg-[#008080]/5'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-[#003366] pr-8">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-[#008080] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-slate-50 rounded-2xl">
          <p className="text-slate-600 mb-2">Still have questions?</p>
          <a 
            href="mailto:support@slidetheory.com" 
            className="text-[#008080] font-semibold hover:underline"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
}
