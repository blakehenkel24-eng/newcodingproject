import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowRight, Rss } from 'lucide-react';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';
import { BlogCard } from '@/components/blog/BlogCard';
import { getAllBlogPosts, getFeaturedBlogPosts, getAllCategories } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Blog | SlideTheory - Consulting & Presentation Tips',
  description: 'Learn consulting skills, presentation techniques, and slide design from former McKinsey, BCG, and Bain consultants. Actionable advice for better business presentations.',
  keywords: ['consulting blog', 'presentation tips', 'slide design', 'McKinsey', 'BCG', 'Bain', 'business presentations'],
  openGraph: {
    title: 'SlideTheory Blog - Consulting & Presentation Tips',
    description: 'Learn consulting skills, presentation techniques, and slide design from former top-tier consultants.',
    type: 'website',
    url: 'https://slidetheory.com/blog',
    images: [
      {
        url: 'https://slidetheory.com/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'SlideTheory Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SlideTheory Blog - Consulting & Presentation Tips',
    description: 'Learn consulting skills, presentation techniques, and slide design from former top-tier consultants.',
    images: ['https://slidetheory.com/og-blog.jpg'],
  },
  alternates: {
    canonical: 'https://slidetheory.com/blog',
  },
};

// Structured data for blog listing
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'SlideTheory Blog',
  description: 'Consulting skills, presentation techniques, and slide design tips',
  url: 'https://slidetheory.com/blog',
  publisher: {
    '@type': 'Organization',
    name: 'SlideTheory',
    logo: {
      '@type': 'ImageObject',
      url: 'https://slidetheory.com/logo.png',
    },
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const featuredPosts = getFeaturedBlogPosts(1);
  const categories = getAllCategories();

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
              <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <BookOpen className="w-4 h-4" />
                <span>The SlideTheory Blog</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Learn Consulting Skills from{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-500">
                  Former McKinsey Consultants
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Actionable advice on presentation design, slide storytelling, and consulting frameworks. 
                Learn the techniques used at top-tier firms.
              </p>
              
              {/* Categories */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Link
                  href="/blog"
                  className="bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  All Posts
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPosts.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 mb-16">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  FEATURED
                </span>
              </div>
              <BlogCard post={featuredPosts[0]} featured />
            </div>
          </section>
        )}

        {/* All Posts Grid */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Latest Articles</h2>
              <a
                href="/rss.xml"
                className="flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors text-sm"
              >
                <Rss className="w-4 h-4" />
                RSS Feed
              </a>
            </div>

            {posts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-50 rounded-2xl">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No posts yet</h3>
                <p className="text-slate-600">Check back soon for new articles!</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="px-4 sm:px-6 lg:px-8 mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Get Weekly Consulting Tips
              </h2>
              <p className="text-teal-100 mb-8 max-w-xl mx-auto">
                Join 5,000+ professionals receiving actionable advice on presentations, 
                slide design, and consulting skills every week.
              </p>
              <form 
                action="/api/leads/capture" 
                method="POST"
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input type="hidden" name="source" value="blog_newsletter" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  type="submit"
                  className="bg-white text-teal-700 font-medium px-6 py-3 rounded-lg hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <p className="text-teal-200 text-sm mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
