import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Shield, 
  Lock, 
  Trash2, 
  EyeOff, 
  FileX, 
  Clock,
  CheckCircle,
  Server,
  Users,
  ArrowLeft,
  Mail
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Security & Privacy | SlideTheory',
  description: 'Learn how SlideTheory keeps your client data secure with zero data retention, automatic deletion, and enterprise-grade encryption.',
};

interface SecurityCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
}

function SecurityCard({ icon, title, description, details }: SecurityCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm mb-4 leading-relaxed">{description}</p>
      <ul className="space-y-2">
        {details.map((detail, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
            <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const securityMeasures = [
  {
    icon: <Trash2 className="w-6 h-6 text-teal-600" />,
    title: 'Automatic Data Deletion',
    description: 'Your data is never stored longer than necessary. We automatically purge all content immediately after slide generation.',
    details: [
      'Raw inputs deleted immediately after processing',
      'Generated slides cached for 5 minutes maximum',
      'Metadata anonymized and purged within 30 days',
      'No backups or copies retained',
    ],
  },
  {
    icon: <EyeOff className="w-6 h-6 text-teal-600" />,
    title: 'Smart Anonymization',
    description: 'We automatically detect and anonymize sensitive identifiers while preserving your strategic content and financial data.',
    details: [
      'Company names → [Company Name]',
      'Person names → [Executive] or [Stakeholder]',
      'Email addresses → [Email Address]',
      'Phone numbers → [Phone Number]',
      'Financial figures preserved intact',
    ],
  },
  {
    icon: <Lock className="w-6 h-6 text-teal-600" />,
    title: 'Zero Data Retention',
    description: 'We have strict agreements with our AI providers ensuring your data is never used for training or retained in any form.',
    details: [
      'OpenAI API with store: false flag',
      'No training on user data',
      'No data retention by AI providers',
      'Isolated processing sessions',
    ],
  },
  {
    icon: <Server className="w-6 h-6 text-teal-600" />,
    title: 'Enterprise Infrastructure',
    description: 'Built on SOC 2 Type II compliant infrastructure with end-to-end encryption and strict access controls.',
    details: [
      'TLS 1.3 encryption in transit',
      'AES-256 encryption at rest',
      'Regular third-party security audits',
      'Penetration testing twice yearly',
    ],
  },
  {
    icon: <Users className="w-6 h-6 text-teal-600" />,
    title: 'Access Controls',
    description: 'Strict access controls ensure only you can access your data. We never view or access your client content.',
    details: [
      'Row-level security in database',
      'JWT-based authentication',
      'No internal access to user data',
      'Audit logs for all access attempts',
    ],
  },
  {
    icon: <FileX className="w-6 h-6 text-teal-600" />,
    title: 'No Data Selling',
    description: 'Your data is yours alone. We never sell, share, or monetize your information in any way.',
    details: [
      'No third-party data sharing',
      'No analytics cookies tracking',
      'No advertising or profiling',
      'Data only used for slide generation',
    ],
  },
];

const faqs = [
  {
    question: 'How long is my data stored?',
    answer: 'Your raw input data (context, messages, files) is deleted immediately after your slide is generated—usually within seconds. Generated slides are cached for up to 5 minutes to allow for regeneration if needed. After that, only anonymized metadata (like timestamp and archetype used) is retained for analytics, which is purged after 30 days.',
  },
  {
    question: 'Does SlideTheory use my data to train AI models?',
    answer: 'Absolutely not. We have zero data retention agreements with our AI providers (OpenAI, Google). Your data is never used to train or improve AI models. Each request is processed in an isolated session and all data is purged immediately after.',
  },
  {
    question: 'What data gets anonymized?',
    answer: 'We automatically anonymize: company names, person names, email addresses, and phone numbers. We intentionally do NOT anonymize financial figures, market sizes, growth rates, percentages, or strategic content—these are essential for your slides and remain intact.',
  },
  {
    question: 'Is SlideTheory SOC 2 compliant?',
    answer: 'We are currently in the process of obtaining SOC 2 Type II certification. Our infrastructure and practices are designed to meet SOC 2 requirements, and we expect certification within 6 months.',
  },
  {
    question: 'Can I request immediate deletion of my data?',
    answer: 'Yes. You can delete your account and all associated data at any time from your account settings. For immediate deletion of specific slides, contact us at security@slidetheory.com and we will purge the data within 24 hours.',
  },
  {
    question: 'Do you offer on-premise deployment?',
    answer: 'Yes, for Enterprise customers we offer on-premise deployment options where all processing happens within your own infrastructure. Contact our sales team for details.',
  },
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200 mb-6">
            <Shield className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Security & Privacy</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Your client data is safe with us
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We understand that consultants handle sensitive client information. 
            That is why we built SlideTheory with privacy and security as core principles—not afterthoughts.
          </p>
        </div>
      </section>

      {/* Security Measures Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-12">
            How we protect your data
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityMeasures.map((measure, index) => (
              <SecurityCard key={index} {...measure} />
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Badges */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Compliance & Certifications
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-lg border border-slate-200">
              <Shield className="w-6 h-6 text-teal-600" />
              <div className="text-left">
                <div className="font-semibold text-slate-900">SOC 2</div>
                <div className="text-xs text-slate-500">In Progress</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-lg border border-slate-200">
              <Lock className="w-6 h-6 text-teal-600" />
              <div className="text-left">
                <div className="font-semibold text-slate-900">GDPR</div>
                <div className="text-xs text-slate-500">Compliant</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-lg border border-slate-200">
              <Server className="w-6 h-6 text-teal-600" />
              <div className="text-left">
                <div className="font-semibold text-slate-900">ISO 27001</div>
                <div className="text-xs text-slate-500">Planned</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-slate-900 rounded-2xl p-8 md:p-12">
            <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Have security questions?
            </h2>
            <p className="text-slate-400 mb-6">
              Our security team is here to help. Reach out for detailed information about our security practices, compliance, or to request a security review.
            </p>
            <a 
              href="mailto:security@slidetheory.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact Security Team
            </a>
            <p className="text-slate-500 text-sm mt-4">
              security@slidetheory.com
            </p>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="py-8 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-slate-600 hover:text-slate-900">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-600 hover:text-slate-900">
              Terms of Service
            </Link>
            <a 
              href="mailto:security@slidetheory.com" 
              className="text-slate-600 hover:text-slate-900"
            >
              Report Security Issue
            </a>
          </div>
          <p className="text-center text-slate-400 text-xs mt-6">
            © {new Date().getFullYear()} SlideTheory. All rights reserved.
          </p>
        </div>
      </section>
    </main>
  );
}
