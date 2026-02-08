'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, FileText, FileSpreadsheet, FileCheck, FileCode, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Resource } from '@/lib/content';
import { EmailGateModal } from './EmailGateModal';

interface ResourceCardProps {
  resource: Resource;
  featured?: boolean;
}

const typeIcons = {
  pdf: FileText,
  template: FileSpreadsheet,
  checklist: FileCheck,
  cheatsheet: FileCode,
};

const typeLabels = {
  pdf: 'PDF Guide',
  template: 'Template',
  checklist: 'Checklist',
  cheatsheet: 'Cheat Sheet',
};

export function ResourceCard({ resource, featured = false }: ResourceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const Icon = typeIcons[resource.type];

  const handleDownload = () => {
    if (resource.requiresEmail) {
      setIsModalOpen(true);
    } else {
      window.open(resource.downloadUrl, '_blank');
    }
  };

  if (featured) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group"
        >
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="grid md:grid-cols-5 gap-0">
              {/* Thumbnail */}
              <div className="md:col-span-2 relative aspect-[4/3] md:aspect-auto overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600">
                {resource.thumbnail ? (
                  <Image
                    src={resource.thumbnail}
                    alt={resource.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="w-20 h-20 text-white/40" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                    Featured Resource
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Icon className="w-3.5 h-3.5" />
                    {typeLabels[resource.type]}
                  </span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-slate-500 text-xs">{resource.fileSize}</span>
                  {resource.pages && (
                    <>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-slate-500 text-xs">{resource.pages} pages</span>
                    </>
                  )}
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">
                  {resource.title}
                </h3>

                <p className="text-slate-600 mb-6">
                  {resource.description}
                </p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleDownload}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    {resource.requiresEmail ? 'Get Free Access' : 'Download Now'}
                  </button>

                  {resource.requiresEmail && (
                    <span className="flex items-center gap-1.5 text-slate-500 text-sm">
                      <Lock className="w-4 h-4" />
                      Email required
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <EmailGateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          resourceTitle={resource.title}
          resourceSlug={resource.slug}
          downloadUrl={resource.downloadUrl}
          fileSize={resource.fileSize}
          fileType={typeLabels[resource.type]}
        />
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group"
      >
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300 h-full flex flex-col">
          {/* Thumbnail */}
          <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
            {resource.thumbnail ? (
              <Image
                src={resource.thumbnail}
                alt={resource.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                  <Icon className="w-10 h-10 text-orange-500" />
                </div>
              </div>
            )}
            <div className="absolute top-3 left-3">
              <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <Icon className="w-3.5 h-3.5" />
                {typeLabels[resource.type]}
              </span>
            </div>
            {resource.requiresEmail && (
              <div className="absolute top-3 right-3">
                <span className="bg-slate-900/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Free
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
              <span className="text-teal-600 font-medium">{resource.category}</span>
              <span>•</span>
              <span>{resource.fileSize}</span>
              {resource.pages && (
                <>
                  <span>•</span>
                  <span>{resource.pages} pages</span>
                </>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
              {resource.title}
            </h3>

            <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-grow">
              {resource.description}
            </p>

            <button
              onClick={handleDownload}
              className="w-full bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 group/btn"
            >
              <Download className="w-4 h-4" />
              {resource.requiresEmail ? 'Get Free Access' : 'Download'}
            </button>
          </div>
        </div>
      </motion.div>

      <EmailGateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resourceTitle={resource.title}
        resourceSlug={resource.slug}
        downloadUrl={resource.downloadUrl}
        fileSize={resource.fileSize}
        fileType={typeLabels[resource.type]}
      />
    </>
  );
}
