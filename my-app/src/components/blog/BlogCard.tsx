'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/lib/content';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group"
      >
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden bg-gradient-to-br from-teal-500 to-teal-600">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/30 text-6xl font-bold">S</span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Featured
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                  <span className="text-teal-600 font-medium">{post.category}</span>
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

                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">
                  {post.title}
                </h2>

                <p className="text-slate-600 mb-6 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {post.author.image ? (
                      <Image
                        src={post.author.image}
                        alt={post.author.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-teal-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{post.author.name}</p>
                      <p className="text-slate-500 text-xs">{post.author.role}</p>
                    </div>
                  </div>

                  <span className="flex items-center gap-2 text-teal-600 font-medium text-sm group-hover:gap-3 transition-all">
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg hover:border-teal-200 transition-all duration-300 h-full flex flex-col">
          {/* Image */}
          <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center">
                  <span className="text-teal-500 text-2xl font-bold">S</span>
                </div>
              </div>
            )}
            <div className="absolute top-3 left-3">
              <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {post.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
              <span>•</span>
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
              {post.title}
            </h3>

            <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-grow">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {post.author.image ? (
                  <Image
                    src={post.author.image}
                    alt={post.author.name}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-7 h-7 bg-teal-100 rounded-full flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                )}
                <span className="text-sm text-slate-600">{post.author.name}</span>
              </div>

              <ArrowRight className="w-4 h-4 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
