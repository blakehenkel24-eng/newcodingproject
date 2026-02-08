import fs from 'fs';
import path from 'path';

// Blog Post Types
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    image?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  readTime: string;
  category: string;
  tags: string[];
  featured?: boolean;
  coverImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
}

// Resource Types
export interface Resource {
  slug: string;
  title: string;
  description: string;
  type: 'pdf' | 'template' | 'checklist' | 'cheatsheet';
  category: string;
  downloadUrl: string;
  fileSize: string;
  pages?: number;
  thumbnail: string;
  requiresEmail: boolean;
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

// Read blog posts from JSON files
export function getAllBlogPosts(): BlogPost[] {
  const blogDir = path.join(process.cwd(), 'src/content/blog');
  
  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = fs.readdirSync(blogDir);
  const posts: BlogPost[] = [];

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(blogDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const post = JSON.parse(content) as BlogPost;
      post.slug = file.replace('.json', '');
      posts.push(post);
    }
  }

  // Sort by published date (newest first)
  return posts.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Get a single blog post by slug
export function getBlogPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(process.cwd(), 'src/content/blog', `${slug}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const post = JSON.parse(content) as BlogPost;
  post.slug = slug;
  return post;
}

// Get featured blog posts
export function getFeaturedBlogPosts(limit: number = 3): BlogPost[] {
  const posts = getAllBlogPosts();
  return posts.filter(post => post.featured).slice(0, limit);
}

// Get blog posts by category
export function getBlogPostsByCategory(category: string): BlogPost[] {
  const posts = getAllBlogPosts();
  return posts.filter(post => post.category.toLowerCase() === category.toLowerCase());
}

// Get all blog categories
export function getAllCategories(): string[] {
  const posts = getAllBlogPosts();
  const categories = new Set(posts.map(post => post.category));
  return Array.from(categories);
}

// Read resources from JSON files
export function getAllResources(): Resource[] {
  const resourcesDir = path.join(process.cwd(), 'src/content/resources');
  
  if (!fs.existsSync(resourcesDir)) {
    return [];
  }

  const files = fs.readdirSync(resourcesDir);
  const resources: Resource[] = [];

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(resourcesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const resource = JSON.parse(content) as Resource;
      resource.slug = file.replace('.json', '');
      resources.push(resource);
    }
  }

  return resources;
}

// Get a single resource by slug
export function getResourceBySlug(slug: string): Resource | null {
  const filePath = path.join(process.cwd(), 'src/content/resources', `${slug}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const resource = JSON.parse(content) as Resource;
  resource.slug = slug;
  return resource;
}

// Get featured resources
export function getFeaturedResources(limit: number = 3): Resource[] {
  const resources = getAllResources();
  return resources.filter(resource => resource.featured).slice(0, limit);
}

// Get resources by category
export function getResourcesByCategory(category: string): Resource[] {
  const resources = getAllResources();
  return resources.filter(resource => resource.category.toLowerCase() === category.toLowerCase());
}

// Estimate read time from content
export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Generate structured data for blog post (JSON-LD)
export function generateBlogPostStructuredData(post: BlogPost): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || 'https://slidetheory.com/og-image.jpg',
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SlideTheory',
      logo: {
        '@type': 'ImageObject',
        url: 'https://slidetheory.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://slidetheory.com/blog/${post.slug}`,
    },
  };
}

// Generate structured data for resources (JSON-LD)
export function generateResourceStructuredData(resource: Resource): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    name: resource.title,
    description: resource.description,
    encodingFormat: resource.type === 'pdf' ? 'application/pdf' : 'application/octet-stream',
    contentSize: resource.fileSize,
    thumbnail: resource.thumbnail,
  };
}
