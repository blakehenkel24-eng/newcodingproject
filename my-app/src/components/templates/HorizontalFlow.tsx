'use client';

import { motion } from 'framer-motion';
import { DensityMode } from '@/types/slide';
import { Workflow, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HorizontalFlowProps {
  title: string;
  steps: {
    number: number;
    label: string;
    description: string;
  }[];
  footnote?: string;
  density: DensityMode;
}

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: -30 },
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

const arrowVariants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 150,
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

export function HorizontalFlow({ title, steps, footnote, density }: HorizontalFlowProps) {
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
            <Workflow className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">{title}</h1>
        </div>
      </motion.div>

      {/* Divider */}
      <motion.div 
        className="w-20 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-8"
        variants={headerVariants}
      />

      {/* Flow Steps */}
      <div className="flex-1 flex items-center">
        <div className="w-full flex items-stretch">
          {steps.map((step, index) => (
            <div key={step.number} className="flex-1 flex items-center">
              {/* Step Card */}
              <motion.div 
                className="flex-1 bg-white rounded-2xl p-6 h-full flex flex-col border-2 border-slate-200 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 group cursor-default"
                variants={stepVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-teal-200"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    {step.number}
                  </motion.div>
                  {index === steps.length - 1 && (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  )}
                </div>
                
                {/* Label */}
                <h3 className={`font-bold text-slate-900 mb-3 ${isReadStyle ? 'text-lg' : 'text-sm'}`}>
                  {step.label}
                </h3>
                
                {/* Description */}
                <p className={`text-slate-600 flex-1 ${isReadStyle ? 'text-sm leading-relaxed' : 'text-xs'}`}>
                  {step.description}
                </p>
                
                {/* Progress indicator */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Step {step.number} of {steps.length}</span>
                    <div className="flex space-x-1">
                      {steps.map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-2 rounded-full ${i <= index ? 'bg-teal-500' : 'bg-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Arrow (except for last item) */}
              {index < steps.length - 1 && (
                <motion.div 
                  className="flex-shrink-0 mx-4 flex items-center"
                  variants={arrowVariants}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-100 to-blue-100 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-teal-600" />
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {footnote && (
        <motion.div className="mt-8 pt-4 border-t border-slate-200" variants={headerVariants}>
          <p className="text-xs text-slate-500">{footnote}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
