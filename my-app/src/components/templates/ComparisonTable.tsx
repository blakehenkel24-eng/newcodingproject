'use client';

import { motion } from 'framer-motion';
import { DensityMode } from '@/types/slide';
import { Table, Check, X, Minus, ArrowRight } from 'lucide-react';

interface ComparisonTableProps {
  title: string;
  headers: string[];
  rows: {
    criteria: string;
    values: string[];
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
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
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

// Check if value indicates positive/negative/neutral
function getValueType(value: string): 'positive' | 'negative' | 'neutral' {
  const lower = value.toLowerCase();
  if (['yes', 'true', '✓', '✔', 'good', 'high', 'excellent'].includes(lower)) return 'positive';
  if (['no', 'false', '✗', '✖', 'bad', 'low', 'poor'].includes(lower)) return 'negative';
  return 'neutral';
}

function ValueCell({ value, isReadStyle }: { value: string; isReadStyle: boolean }) {
  const type = getValueType(value);
  
  if (type === 'positive') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
        <Check className="w-3 h-3 mr-1" />
        {value}
      </span>
    );
  }
  
  if (type === 'negative') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
        <X className="w-3 h-3 mr-1" />
        {value}
      </span>
    );
  }
  
  return <span className="text-slate-600">{value}</span>;
}

export function ComparisonTable({ title, headers, rows, footnote, density }: ComparisonTableProps) {
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
            <Table className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">{title}</h1>
        </div>
      </motion.div>

      {/* Divider */}
      <motion.div 
        className="w-20 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-6"
        variants={headerVariants}
      />

      {/* Table */}
      <motion.div 
        className="flex-1 overflow-auto rounded-xl border border-slate-200 shadow-sm"
        variants={itemVariants}
      >
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-900 to-slate-800">
              {headers.map((header, index) => (
                <motion.th 
                  key={index}
                  className={`text-left py-4 px-4 font-bold text-white ${index === 0 ? 'w-1/4' : ''} ${isReadStyle ? 'text-sm' : 'text-xs'} ${index !== headers.length - 1 ? 'border-r border-slate-700' : ''}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {header}
                </motion.th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <motion.tr 
                key={rowIndex} 
                className={`group transition-colors duration-200 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-teal-50`}
                variants={itemVariants}
                whileHover={{ backgroundColor: 'rgba(20, 184, 166, 0.05)' }}
              >
                <td className={`py-4 px-4 font-semibold text-slate-900 border-b border-slate-100 ${isReadStyle ? 'text-sm' : 'text-xs'}`}>
                  <div className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-teal-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {row.criteria}
                  </div>
                </td>
                {row.values.map((value, valueIndex) => (
                  <td 
                    key={valueIndex} 
                    className={`py-4 px-4 border-b border-slate-100 ${valueIndex !== row.values.length - 1 ? 'border-r border-slate-100' : ''} ${isReadStyle ? 'text-sm' : 'text-xs'}`}
                  >
                    <ValueCell value={value} isReadStyle={isReadStyle} />
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Footer */}
      {footnote && (
        <motion.div className="mt-6 flex items-center space-x-2" variants={itemVariants}>
          <Minus className="w-4 h-4 text-slate-400 rotate-90" />
          <p className="text-xs text-slate-500">{footnote}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
