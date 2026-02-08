import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, User, Share2, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';
import { StickyTableOfContents } from '@/components/blog/TableOfContents';
import { getAllBlogPosts, getBlogPostBySlug, generateBlogPostStructuredData } from '@/lib/content';

// Generate static params for all blog posts
export function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | SlideTheory',
    };
  }

  const title = post.metaTitle || `${post.title} | SlideTheory Blog`;
  const description = post.metaDescription || post.excerpt;
  const url = `https://slidetheory.com/blog/${post.slug}`;

  return {
    title,
    description,
    keywords: post.tags,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: post.coverImage || 'https://slidetheory.com/og-blog.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [post.coverImage || 'https://slidetheory.com/og-blog.jpg'],
    },
    alternates: {
      canonical: post.canonicalUrl || url,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const structuredData = generateBlogPostStructuredData(post);

  // Parse content to extract headings for TOC
  const extractHeadings = (content: string) => {
    const headings = [];
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/g;
    const h3Regex = /<h3[^>]*>(.*?)<\/h3>/g;
    
    let match;
    while ((match = h2Regex.exec(content)) !== null) {
      const text = match[1].replace(/<[^>]+>/g, '');
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ id, text, level: 2 });
    }
    while ((match = h3Regex.exec(content)) !== null) {
      const text = match[1].replace(/<[^>]+>/g, '');
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ id, text, level: 3 });
    }
    return headings;
  };

  const tocItems = extractHeadings(post.content);

  // Process content to add IDs to headings
  const processedContent = post.content
    .replace(/<h2>(.*?)<\/h2>/g, (match, text) => {
      const id = text.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return `<h2 id="${id}">${text}</h2>`;
    })
    .replace(/<h3>(.*?)<\/h3>/g, (match, text) => {
      const id = text.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return `<h3 id="${id}">${text}</h3>`;
    });

  const shareUrl = `https://slidetheory.com/blog/${post.slug}`;
  const shareText = encodeURIComponent(post.title);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Navbar />

      <main className="pt-24 pb-16">
        {/* Back Link */}
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Article Header */}
        <article className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_280px] gap-12">
              {/* Main Content */}
              <div>
                {/* Post Header */}
                <header className="mb-8">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-4">
                    <span className="bg-teal-100 text-teal-700 font-medium px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formattedDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                    {post.title}
                  </h1>

                  <p className="text-xl text-slate-600 leading-relaxed">
                    {post.excerpt}
                  </p>
                </header>

                {/* Author */}
                <div className="flex items-center gap-4 py-6 border-y border-slate-200 mb-8">
                  {post.author.image ? (
                    <Image
                      src={post.author.image}
                      alt={post.author.name}
                      width={56}
                      height={56}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
                      <User className="w-7 h-7 text-teal-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-900">{post.author.name}</p>
                    <p className="text-slate-500">{post.author.role}</p>
                  </div>
                </div>

                {/* Cover Image */}
                {post.coverImage && (
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8 bg-slate-100">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                {/* Article Content */}
                <div 
                  className="prose prose-lg prose-slate max-w-none
                    prose-headings:font-bold prose-headings:text-slate-900
                    prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-slate-600 prose-p:leading-relaxed
                    prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-slate-900
                    prose-blockquote:border-l-4 prose-blockquote:border-teal-500 prose-blockquote:bg-teal-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                    prose-ul:list-disc prose-ul:pl-6 prose-li:text-slate-600
                    prose-ol:list-decimal prose-ol:pl-6
                    prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-4 prose-pre:rounded-lg
                    prose-hr:border-slate-200
                  "
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-slate-200">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Share */}
                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-slate-200">
                  <span className="text-slate-500 font-medium flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share this article:
                  </span>
                  <div className="flex gap-2">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-slate-100 hover:bg-sky-500 hover:text-white rounded-full flex items-center justify-center transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-slate-100 hover:bg-blue-500 hover:text-white rounded-full flex items-center justify-center transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="hidden lg:block">
                <StickyTableOfContents items={tocItems} />
              </aside>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <section className="px-4 sm:px-6 lg:px-8 mt-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">More Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {getAllBlogPosts()
                .filter((p) => p.slug !== post.slug)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="group block bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-teal-200 transition-all"
                  >
                    <span className="text-teal-600 text-sm font-medium">{relatedPost.category}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2 mb-3 group-hover:text-teal-600 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
