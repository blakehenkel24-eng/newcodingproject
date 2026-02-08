'use client';

import { motion } from 'framer-motion';
import { DensityMode } from '@/types/slide';
import { FileText, ChevronRight } from 'lucide-react';

interface GeneralProps {
  title: string;
  content: string;
  sections?: {
    heading: string;
    text: string;
  }[];
  footnote?: string;
  source?: string;
  density: DensityMode;
}

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 20,
    },
  },
};

export function General({ title, content, sections, footnote, source, density }: GeneralProps) {
  const isReadStyle = density === 'read_style';

  return (
    <motion.div 
      className="w-full h-full bg-white p-10 flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div className="mb-6" variants={headerVariants}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">{title}</h1>
        </div>
      </motion.div>

      {/* Divider */}
      <motion.div 
        className="w-20 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-6"
        variants={headerVariants}
      />

      {/* Main Content */}
      <motion.div 
        className="mb-6 bg-slate-50 rounded-xl p-6 border border-slate-100"
        variants={itemVariants}
        whileHover={{ scale: 1.005 }}
        transition={{ duration: 0.2 }}
      >
        <p className={`text-slate-700 leading-relaxed ${isReadStyle ? 'text-base' : 'text-sm'}`}>
          {content}
        </p>
      </motion.div>

      {/* Sections */}
      {sections && sections.length > 0 && (
        <motion.div 
          className="flex-1 space-y-3"
          variants={containerVariants}
        >
          {sections.map((section, index) => (
            <motion.div 
              key={index} 
              className="group flex items-start space-x-3 bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ x: 4 }}
            >
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-teal-100 to-blue-100 rounded-lg flex items-center justify-center mt-0.5 group-hover:from-teal-200 group-hover:to-blue-200 transition-colors">
                <span className="text-sm font-bold text-teal-700">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-slate-900 mb-1 ${isReadStyle ? 'text-base' : 'text-sm'} flex items-center`}>
                  {section.heading}
                  <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 text-teal-500 transition-opacity" />
                </h3>
                <p className={`text-slate-600 ${isReadStyle ? 'text-sm' : 'text-xs'} leading-relaxed`}>
                  {section.text}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Footer */}
      <motion.div 
        className="mt-6 pt-4 border-t border-slate-200"
        variants={itemVariants}
      >
        {footnote && (
          <p className="text-xs text-slate-500">{footnote}</p>
        )}
        {source && (
          <p className="text-xs text-slate-400 mt-1 flex items-center">
            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-2" />
            Source: {source}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
