'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      {/* Glassmorphism pill */}
      <div className="
        flex items-center justify-between gap-4
        px-4 sm:px-6 py-3
        bg-white/90 backdrop-blur-xl
        rounded-full
        border border-slate-200/50
        shadow-lg shadow-slate-900/5
      ">
        {/* Logo */}
        <Link href="/dashboard">
          <Logo size="sm" showText={true} variant="dark" />
        </Link>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Pricing</a>
          <Link href="/blog" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Blog</Link>
          <Link href="/resources" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">Resources</Link>
        </div>

        {/* CTA & Mobile Menu */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="
              hidden sm:block
              bg-teal-600 hover:bg-teal-700
              text-white text-sm font-medium
              px-5 py-2 rounded-full
              transition-colors
            "
          >
            Start Free
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 bg-white rounded-2xl border border-slate-200 shadow-lg p-4">
          <div className="flex flex-col gap-3">
            <a 
              href="#features" 
              className="text-sm font-medium text-slate-600 hover:text-teal-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="text-sm font-medium text-slate-600 hover:text-teal-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <Link
              href="/blog"
              className="text-sm font-medium text-slate-600 hover:text-teal-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/resources"
              className="text-sm font-medium text-slate-600 hover:text-teal-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <Link
              href="/login"
              className="
                bg-teal-600 hover:bg-teal-700
                text-white text-sm font-medium
                px-5 py-2 rounded-full
                transition-colors
                text-center
              "
              onClick={() => setIsMenuOpen(false)}
            >
              Start Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
