'use client';

import Link from 'next/link';
import { Twitter, Linkedin, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-slate-900">SlideTheory</span>
            </div>
            <p className="text-sm text-slate-500">
              AI-powered slide generation for strategy consultants.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#features" className="text-slate-600 hover:text-teal-600">Features</a></li>
              <li><a href="/#pricing" className="text-slate-600 hover:text-teal-600">Pricing</a></li>
              <li><Link href="/dashboard" className="text-slate-600 hover:text-teal-600">Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="text-slate-600 hover:text-teal-600">Blog</Link></li>
              <li><Link href="/resources" className="text-slate-600 hover:text-teal-600">Free Templates</Link></li>
              <li><Link href="/resources" className="text-slate-600 hover:text-teal-600">Guides & Checklists</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-600 hover:text-teal-600">Privacy</a></li>
              <li><a href="#" className="text-slate-600 hover:text-teal-600">Terms</a></li>
              <li><a href="#" className="text-slate-600 hover:text-teal-600">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">© 2026 SlideTheory. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-slate-600">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-600">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-600">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
