'use client';

import { motion } from 'framer-motion';
import { DensityMode } from '@/types/slide';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell
} from 'recharts';
import { Lightbulb, Info } from 'lucide-react';

interface DataChartProps {
  title: string;
  chartType: 'bar' | 'line';
  data: {
    label: string;
    value: number;
  }[];
  keyTakeaway: string;
  footnote?: string;
  density: DensityMode;
}

// Custom tooltip component
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <motion.div 
        className="bg-white p-4 rounded-xl shadow-xl border border-slate-200"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
      >
        <p className="text-sm font-semibold text-slate-700 mb-2">{label}</p>
        <p className="text-2xl font-bold text-slate-900">
          {payload[0].value.toLocaleString()}
        </p>
      </motion.div>
    );
  }
  return null;
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

// Color palette for bars
const barColors = [
  '#0f766e', // teal-700
  '#0d9488', // teal-600
  '#14b8a6', // teal-500
  '#2dd4bf', // teal-400
  '#5eead4', // teal-300
  '#99f6e4', // teal-200
];

export function DataChart({ title, chartType, data, keyTakeaway, footnote, density }: DataChartProps) {
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
        <h1 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">{title}</h1>
      </motion.div>

      {/* Divider */}
      <motion.div 
        className="w-20 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-6"
        variants={headerVariants}
      />

      {/* Chart */}
      <motion.div className="flex-1 min-h-0" variants={itemVariants}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity={1} />
                  <stop offset="100%" stopColor="#0f766e" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis 
                dataKey="label" 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                angle={-35}
                textAnchor="end"
                height={60}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
                tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}K` : value}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
              <Bar 
                dataKey="value" 
                radius={[8, 8, 0, 0]}
                animationDuration={1500}
                animationBegin={300}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={barColors[index % barColors.length]}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis 
                dataKey="label" 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                angle={-35}
                textAnchor="end"
                height={60}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
                tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}K` : value}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="url(#lineGradient)" 
                strokeWidth={3}
                dot={{ fill: '#0d9488', strokeWidth: 2, stroke: '#fff', r: 5 }}
                activeDot={{ r: 8, fill: '#0f766e', stroke: '#fff', strokeWidth: 3 }}
                animationDuration={1500}
                animationBegin={300}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </motion.div>

      {/* Key Takeaway */}
      <motion.div 
        className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200 shadow-sm"
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className={`text-slate-800 leading-relaxed ${isReadStyle ? 'text-sm' : 'text-xs'}`}>
              <span className="font-bold text-amber-700">Key Takeaway: </span>
              {keyTakeaway}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      {footnote && (
        <motion.div className="mt-4 flex items-center space-x-2" variants={itemVariants}>
          <Info className="w-4 h-4 text-slate-400" />
          <p className="text-xs text-slate-500">{footnote}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
