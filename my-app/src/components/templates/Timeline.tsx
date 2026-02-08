'use client';

import { motion } from 'framer-motion';
import { DensityMode } from '@/types/slide';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Clock, 
  MapPin,
  Flag,
  ArrowRight
} from 'lucide-react';

interface TimelineProps {
  title: string;
  milestones: {
    date: string;
    label: string;
    description: string;
    status?: 'complete' | 'current' | 'future';
  }[];
  density: DensityMode;
}

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const milestoneVariants = {
  hidden: { opacity: 0, y: 30 },
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

export function Timeline({ title, milestones, density }: TimelineProps) {
  const isReadStyle = density === 'read_style';

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'complete':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
        );
      case 'current':
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-200">
            <Clock className="w-6 h-6 text-white" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-slate-100 border-2 border-slate-300 rounded-full flex items-center justify-center">
            <Circle className="w-6 h-6 text-slate-400" />
          </div>
        );
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'complete':
        return 'border-green-500 bg-green-50';
      case 'current':
        return 'border-amber-500 bg-amber-50';
      default:
        return 'border-slate-300 bg-white';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'complete':
        return <span className="text-xs font-semibold text-green-600">Completed</span>;
      case 'current':
        return <span className="text-xs font-semibold text-amber-600">In Progress</span>;
      default:
        return <span className="text-xs font-semibold text-slate-400">Upcoming</span>;
    }
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
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">{title}</h1>
        </div>
      </motion.div>

      {/* Divider */}
      <motion.div 
        className="w-20 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-10"
        variants={headerVariants}
      />

      {/* Timeline */}
      <div className="flex-1 flex items-center">
        <div className="w-full relative">
          {/* Timeline Line Background */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200 rounded-full" />
          
          {/* Timeline Progress Line */}
          <motion.div 
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-green-500 via-amber-500 to-slate-300 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
          />

          {/* Milestones */}
          <div className="relative flex justify-between">
            {milestones.map((milestone, index) => (
              <motion.div 
                key={index} 
                className="flex flex-col items-center"
                style={{ width: `${100 / milestones.length}%` }}
                variants={milestoneVariants}
                custom={index}
              >
                {/* Icon Container */}
                <motion.div 
                  className="relative z-10"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {getStatusIcon(milestone.status)}
                  
                  {/* Pulse animation for current status */}
                  {milestone.status === 'current' && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-amber-400"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {/* Status Label */}
                <div className="mt-3">
                  {getStatusLabel(milestone.status)}
                </div>

                {/* Date */}
                <motion.div 
                  className="mt-3 px-3 py-1 bg-slate-100 rounded-full"
                  whileHover={{ backgroundColor: '#e2e8f0' }}
                >
                  <p className="text-xs font-bold text-slate-700">
                    {milestone.date}
                  </p>
                </motion.div>

                {/* Label */}
                <p className={`mt-3 text-center font-bold text-slate-900 ${isReadStyle ? 'text-sm' : 'text-xs'}`}>
                  {milestone.label}
                </p>

                {/* Description Card */}
                {isReadStyle && (
                  <motion.div 
                    className={`mt-3 p-4 rounded-xl border-2 max-w-xs text-center ${getStatusColor(milestone.status)}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <MapPin className="w-4 h-4 text-slate-400 mr-1" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <motion.div 
        className="mt-8 flex justify-center space-x-8 text-sm"
        variants={headerVariants}
      >
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-slate-600 font-medium">Completed</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-amber-500" />
          <span className="text-slate-600 font-medium">In Progress</span>
        </div>
        <div className="flex items-center space-x-2">
          <Circle className="w-5 h-5 text-slate-400" />
          <span className="text-slate-600 font-medium">Upcoming</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
