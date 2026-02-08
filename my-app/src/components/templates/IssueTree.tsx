'use client';

import { motion } from 'framer-motion';
import { DensityMode } from '@/types/slide';
import { GitBranch, AlertCircle, ChevronRight } from 'lucide-react';

interface IssueTreeProps {
  title: string;
  rootProblem: string;
  branches: {
    cause: string;
    subCauses: string[];
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

const branchVariants = {
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

export function IssueTree({ title, rootProblem, branches, density }: IssueTreeProps) {
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
            <GitBranch className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">{title}</h1>
        </div>
      </motion.div>

      {/* Divider */}
      <motion.div 
        className="w-20 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-6"
        variants={headerVariants}
      />

      {/* Issue Tree */}
      <div className="flex-1 flex flex-col items-center">
        {/* Root Problem */}
        <motion.div 
          className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl px-8 py-4 text-center mb-4 shadow-xl shadow-red-200"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6" />
            <p className={`font-bold ${isReadStyle ? 'text-lg' : 'text-base'}`}>
              {rootProblem}
            </p>
          </div>
        </motion.div>

        {/* Connector Line */}
        <motion.div 
          className="w-1 h-8 bg-gradient-to-b from-red-300 to-teal-300"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{ transformOrigin: 'top' }}
        />

        {/* Branches Container */}
        <div className="w-full flex justify-center space-x-4">
          {branches.map((branch, index) => (
            <motion.div 
              key={index} 
              className="flex-1 max-w-xs flex flex-col items-center"
              variants={branchVariants}
              custom={index}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              {/* Horizontal connector */}
              <motion.div 
                className="w-full h-1 bg-gradient-to-r from-teal-300 to-teal-400 mb-0 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                style={{ transformOrigin: index === 0 ? 'right' : index === branches.length - 1 ? 'left' : 'center' }}
              />
              
              {/* Vertical connector */}
              <motion.div 
                className="w-1 h-6 bg-gradient-to-b from-teal-300 to-teal-500"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.2 }}
                style={{ transformOrigin: 'top' }}
              />

              {/* Cause Box */}
              <motion.div 
                className="w-full bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl px-4 py-3 text-center mb-4 shadow-lg shadow-teal-200 cursor-pointer"
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <ChevronRight className="w-4 h-4" />
                  <p className={`font-bold ${isReadStyle ? 'text-sm' : 'text-xs'}`}>
                    {branch.cause}
                  </p>
                </div>
              </motion.div>

              {/* Sub-causes */}
              {branch.subCauses.length > 0 && (
                <motion.div 
                  className="w-full space-y-2"
                  variants={containerVariants}
                >
                  {branch.subCauses.map((subCause, subIndex) => (
                    <motion.div 
                      key={subIndex}
                      className="bg-white rounded-lg px-4 py-3 text-center border-2 border-slate-200 shadow-sm hover:border-teal-300 hover:shadow-md transition-all duration-300 group cursor-default"
                      variants={itemVariants}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-teal-400 rounded-full group-hover:bg-teal-500 transition-colors" />
                        <p className={`text-slate-700 font-medium ${isReadStyle ? 'text-xs' : 'text-xs'}`}>
                          {subCause}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
