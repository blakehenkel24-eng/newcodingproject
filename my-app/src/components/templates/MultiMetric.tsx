'use client';

import { motion } from 'framer-motion';
import { DensityMode } from '@/types/slide';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface MultiMetricProps {
  title: string;
  keyMessage?: string;
  metrics: {
    label: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    sparklineData?: number[];
  }[];
  footnote?: string;
  source?: string;
  density: DensityMode;
}

// Number formatting utility
function formatNumber(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
  if (isNaN(num)) return String(value);
  
  const absNum = Math.abs(num);
  if (absNum >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (absNum >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (absNum >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toLocaleString();
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

// Item animation variants
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

// Header animation variants
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

// Sparkline component
function Sparkline({ data, trend }: { data: number[]; trend?: 'up' | 'down' | 'neutral' }) {
  if (!data || data.length < 2) return null;
  
  const chartData = data.map((value, index) => ({ value, index }));
  const color = trend === 'up' ? '#16a34a' : trend === 'down' ? '#dc2626' : '#6b7280';
  
  return (
    <div className="h-8 w-20 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`sparkline-${trend}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#sparkline-${trend})`}
            isAnimationActive={true}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MultiMetric({ title, keyMessage, metrics, footnote, source, density }: MultiMetricProps) {
  const isReadStyle = density === 'read_style';

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="w-4 h-4" />;
      case 'down':
        return <ArrowDownRight className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  // Determine grid layout based on metric count
  const getGridClass = () => {
    const count = metrics.length;
    if (count <= 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    return 'grid-cols-3';
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
        <h1 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">{title}</h1>
        {keyMessage && (
          <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-3xl">{keyMessage}</p>
        )}
      </motion.div>

      {/* Divider */}
      <motion.div 
        className="w-20 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-8"
        variants={headerVariants}
      />

      {/* Metrics Grid */}
      <motion.div 
        className={`flex-1 grid ${getGridClass()} gap-5 content-center`}
        variants={containerVariants}
      >
        {metrics.map((metric, index) => (
          <motion.div 
            key={index} 
            className="group bg-white rounded-xl p-6 flex flex-col justify-between border border-slate-200 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all duration-300 cursor-default"
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  {metric.label}
                </p>
                <p 
                  className="text-4xl font-bold text-slate-900 tracking-tight" 
                  data-metric 
                  data-label={metric.label}
                >
                  {formatNumber(metric.value)}
                </p>
              </div>
              
              {/* Sparkline */}
              {metric.sparklineData && (
                <Sparkline data={metric.sparklineData} trend={metric.trend} />
              )}
            </div>
            
            {metric.change && (
              <div className="flex items-center mt-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getTrendColor(metric.trend)}`}>
                  {getTrendIcon(metric.trend)}
                  <span className="ml-1">{metric.change}</span>
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div 
        className="mt-8 pt-4 border-t border-slate-200"
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
