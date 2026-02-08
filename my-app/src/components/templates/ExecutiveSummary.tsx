'use client';

import { motion } from 'framer-motion';
import { DensityMode } from '@/types/slide';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  Zap,
  ArrowRight,
  Star,
  BarChart3,
  Users,
  Shield,
  Rocket
} from 'lucide-react';

interface ExecutiveSummaryProps {
  title: string;
  keyMessage?: string;
  points: {
    title: string;
    description: string;
    highlight?: boolean;
    icon?: string;
  }[];
  callout?: {
    title: string;
    content: string;
    type?: 'info' | 'warning' | 'success' | 'insight';
  };
  footnote?: string;
  source?: string;
  density: DensityMode;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  target: Target,
  trend: TrendingUp,
  alert: AlertTriangle,
  check: CheckCircle,
  lightbulb: Lightbulb,
  zap: Zap,
  star: Star,
  chart: BarChart3,
  users: Users,
  shield: Shield,
  rocket: Rocket,
};

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
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

// Callout styling
const calloutStyles = {
  info: {
    bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    icon: 'bg-blue-100 text-blue-600',
    title: 'text-blue-800',
  },
  warning: {
    bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
    border: 'border-amber-200',
    icon: 'bg-amber-100 text-amber-600',
    title: 'text-amber-800',
  },
  success: {
    bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
    border: 'border-green-200',
    icon: 'bg-green-100 text-green-600',
    title: 'text-green-800',
  },
  insight: {
    bg: 'bg-gradient-to-r from-purple-50 to-pink-50',
    border: 'border-purple-200',
    icon: 'bg-purple-100 text-purple-600',
    title: 'text-purple-800',
  },
};

function getIconComponent(iconName?: string) {
  const IconComponent = iconName && iconMap[iconName.toLowerCase()] ? iconMap[iconName.toLowerCase()] : Lightbulb;
  return IconComponent;
}

function CalloutBox({ callout }: { callout: ExecutiveSummaryProps['callout'] }) {
  if (!callout) return null;
  
  const style = calloutStyles[callout.type || 'info'];
  const IconComponent = callout.type === 'warning' ? AlertTriangle : 
                       callout.type === 'success' ? CheckCircle : 
                       callout.type === 'insight' ? Lightbulb : Target;

  return (
    <motion.div 
      className={`${style.bg} rounded-xl p-5 border ${style.border} shadow-sm mb-6`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 w-10 h-10 ${style.icon} rounded-full flex items-center justify-center`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className={`font-bold ${style.title} mb-1`}>{callout.title}</h4>
          <p className="text-slate-700 text-sm leading-relaxed">{callout.content}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function ExecutiveSummary({ title, keyMessage, points, callout, footnote, source, density }: ExecutiveSummaryProps) {
  const isReadStyle = density === 'read_style';

  return (
    <motion.div 
      className="w-full h-full bg-white p-10 flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Title - Action oriented, prominent */}
      <motion.div className="mb-4" variants={headerVariants}>
        <h1 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">
          {title}
        </h1>
      </motion.div>

      {/* Key Message - The "so what" */}
      {keyMessage && (
        <motion.div className="mb-5" variants={headerVariants}>
          <p className={`text-slate-600 font-medium ${isReadStyle ? 'text-base' : 'text-sm'} leading-relaxed`}>
            {keyMessage}
          </p>
        </motion.div>
      )}

      {/* Divider */}
      <motion.div 
        className="w-20 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-6"
        variants={headerVariants}
      />

      {/* Highlighted Callout Box */}
      {callout && <CalloutBox callout={callout} />}

      {/* Key Points - MECE structure */}
      <div className="flex-1 space-y-3">
        {points.map((point, index) => {
          const IconComponent = getIconComponent(point.icon);
          return (
            <motion.div 
              key={index} 
              className={`group flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 ${
                point.highlight 
                  ? 'bg-gradient-to-r from-teal-50 to-cyan-50 border-l-4 border-teal-500 shadow-sm' 
                  : 'hover:bg-slate-50'
              }`}
              variants={itemVariants}
              whileHover={{ x: point.highlight ? 0 : 4 }}
            >
              {/* Icon */}
              <motion.div 
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  point.highlight 
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-200' 
                    : 'bg-slate-100 text-slate-600 group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors'
                }`}
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <IconComponent className="w-5 h-5" />
              </motion.div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-xs font-bold ${point.highlight ? 'text-teal-600' : 'text-slate-400'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className={`font-bold text-slate-900 ${isReadStyle ? 'text-base' : 'text-sm'}`}>
                    {point.title}
                  </h3>
                  {point.highlight && (
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  )}
                </div>
                <p className={`text-slate-600 ${isReadStyle ? 'text-sm leading-relaxed' : 'text-xs'}`}>
                  {point.description}
                </p>
              </div>
              
              {/* Arrow indicator */}
              <motion.div 
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                <ArrowRight className="w-5 h-5 text-teal-500" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer - Source */}
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
