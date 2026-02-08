'use client';

import { motion } from 'framer-motion';
import { DensityMode } from '@/types/slide';
import { Grid3X3, ArrowUp, ArrowRight, Star, Circle } from 'lucide-react';

interface TwoByTwoMatrixProps {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  quadrants: {
    name: string;
    items: string[];
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }[];
  density: DensityMode;
}

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const quadrantVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
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

// Quadrant colors and styles
const quadrantStyles = {
  'top-left': {
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    header: 'text-blue-800',
    accent: 'bg-blue-500',
    icon: 'text-blue-500',
  },
  'top-right': {
    bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
    border: 'border-green-200',
    header: 'text-green-800',
    accent: 'bg-green-500',
    icon: 'text-green-500',
  },
  'bottom-left': {
    bg: 'bg-gradient-to-br from-amber-50 to-yellow-50',
    border: 'border-amber-200',
    header: 'text-amber-800',
    accent: 'bg-amber-500',
    icon: 'text-amber-500',
  },
  'bottom-right': {
    bg: 'bg-gradient-to-br from-red-50 to-rose-50',
    border: 'border-red-200',
    header: 'text-red-800',
    accent: 'bg-red-500',
    icon: 'text-red-500',
  },
};

export function TwoByTwoMatrix({ title, xAxisLabel, yAxisLabel, quadrants, density }: TwoByTwoMatrixProps) {
  const isReadStyle = density === 'read_style';
  
  const getQuadrant = (position: string) => quadrants.find(q => q.position === position) || { name: '', items: [] };
  
  const topLeft = getQuadrant('top-left');
  const topRight = getQuadrant('top-right');
  const bottomLeft = getQuadrant('bottom-left');
  const bottomRight = getQuadrant('bottom-right');

  const renderQuadrant = (quadrant: { name: string; items: string[] }, position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right', delay: number) => {
    const style = quadrantStyles[position];
    const isTopRight = position === 'top-right';
    
    return (
      <motion.div 
        className={`${style.bg} rounded-2xl p-4 border-2 ${style.border} shadow-sm hover:shadow-lg transition-all duration-300`}
        variants={quadrantVariants}
        custom={delay}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center space-x-2 mb-3">
          <div className={`w-3 h-3 rounded-full ${style.accent}`} />
          <h3 className={`font-bold ${style.header} ${isReadStyle ? 'text-sm' : 'text-xs'}`}>
            {quadrant.name}
          </h3>
          {isTopRight && <Star className={`w-4 h-4 ${style.icon} fill-current`} />}
        </div>
        <motion.ul 
          className="space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {quadrant.items.map((item, i) => (
            <motion.li 
              key={i} 
              className="flex items-start space-x-2 text-xs text-slate-700 group cursor-default"
              variants={itemVariants}
              whileHover={{ x: 4 }}
            >
              <Circle className={`w-2 h-2 mt-1 flex-shrink-0 ${style.icon} fill-current`} />
              <span className="group-hover:text-slate-900 transition-colors">{item}</span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    );
  };

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
            <Grid3X3 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">{title}</h1>
        </div>
      </motion.div>

      {/* Divider */}
      <motion.div 
        className="w-20 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-6"
        variants={headerVariants}
      />

      {/* Matrix Container */}
      <div className="flex-1 relative">
        {/* Y Axis Label */}
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-center flex items-center space-x-2"
          variants={headerVariants}
        >
          <ArrowUp className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{yAxisLabel}</span>
        </motion.div>

        {/* Matrix Grid */}
        <div className="ml-10 h-full grid grid-cols-2 grid-rows-2 gap-4">
          {/* Top Left */}
          {renderQuadrant(topLeft, 'top-left', 0)}

          {/* Top Right */}
          {renderQuadrant(topRight, 'top-right', 1)}

          {/* Bottom Left */}
          {renderQuadrant(bottomLeft, 'bottom-left', 2)}

          {/* Bottom Right */}
          {renderQuadrant(bottomRight, 'bottom-right', 3)}
        </div>

        {/* X Axis Label */}
        <motion.div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 flex items-center space-x-2"
          variants={headerVariants}
        >
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{xAxisLabel}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
