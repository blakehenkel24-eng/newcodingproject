import { Metadata } from 'next';
import Link from 'next/link';
import { Download, FileText, Sparkles, ArrowRight, Star } from 'lucide-react';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';
import { ResourceCard } from '@/components/blog/ResourceCard';
import { getAllResources, getFeaturedResources } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Free Resources | SlideTheory - Templates, Checklists & Guides',
  description: 'Download free McKinsey-style slide templates, consulting checklists, and presentation guides. Professional resources to improve your business presentations.',
  keywords: ['slide templates', 'consulting templates', 'presentation resources', 'free downloads', 'McKinsey templates'],
  openGraph: {
    title: 'Free Resources | SlideTheory',
    description: 'Download free McKinsey-style slide templates, consulting checklists, and presentation guides.',
    type: 'website',
    url: 'https://slidetheory.com/resources',
    images: [
      {
        url: 'https://slidetheory.com/og-resources.jpg',
        width: 1200,
        height: 630,
        alt: 'SlideTheory Resources',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resources | SlideTheory',
    description: 'Download free McKinsey-style slide templates, consulting checklists, and presentation guides.',
    images: ['https://slidetheory.com/og-resources.jpg'],
  },
  alternates: {
    canonical: 'https://slidetheory.com/resources',
  },
};

// Structured data for resources page
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'SlideTheory Resources',
  description: 'Free slide templates, checklists, and guides for consulting presentations',
  url: 'https://slidetheory.com/resources',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: getAllResources().map((resource, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'DigitalDocument',
        name: resource.title,
        description: resource.description,
        url: `https://slidetheory.com/resources/${resource.slug}`,
      },
    })),
  },
};

export default function ResourcesPage() {
  const resources = getAllResources();
  const featuredResources = getFeaturedResources(1);

  const stats = [
    { value: '50+', label: 'Slide Templates' },
    { value: '10K+', label: 'Downloads' },
    { value: '100%', label: 'Free' },
  ];

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Free Professional Resources</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Tools to Build{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-500">
                  Consulting-Quality
                </span>{' '}
                Presentations
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Download professional slide templates, checklists, and guides used by 
                former McKinsey, BCG, and Bain consultants. 100% free.
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 md:gap-12">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-teal-600">{stat.value}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Resource */}
        {featuredResources.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 mb-16">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                <span className="text-slate-900 font-semibold">Featured Resource</span>
              </div>
              <ResourceCard resource={featuredResources[0]} featured />
            </div>
          </section>
        )}

        {/* All Resources Grid */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">All Resources</h2>
              <span className="text-slate-500 text-sm">
                {resources.length} resources available
              </span>
            </div>

            {resources.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                  <ResourceCard key={resource.slug} resource={resource} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-50 rounded-2xl">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No resources yet</h3>
                <p className="text-slate-600">Check back soon for new downloads!</p>
              </div>
            )}
          </div>
        </section>

        {/* Why Download Section */}
        <section className="px-4 sm:px-6 lg:px-8 mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="bg-slate-50 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-12">
                Why Professionals Choose Our Resources
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-7 h-7 text-teal-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Consulting-Grade</h3>
                  <p className="text-slate-600 text-sm">
                    Templates and tools designed by former consultants from McKinsey, BCG, and Bain.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Download className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Instant Access</h3>
                  <p className="text-slate-600 text-sm">
                    Download immediately after email confirmation. No waiting, no hassle.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-7 h-7 text-teal-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Always Free</h3>
                  <p className="text-slate-600 text-sm">
                    No credit card required. No hidden fees. Just quality resources for professionals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Create Better Presentations?
              </h2>
              <p className="text-orange-100 mb-8 max-w-xl mx-auto">
                Don&apos;t stop at templates. Generate complete, consulting-quality slides 
                in seconds with SlideTheory&apos;s AI-powered platform.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-white text-orange-600 font-medium px-8 py-4 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Try SlideTheory Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
