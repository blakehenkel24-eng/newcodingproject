'use client';

import { motion } from 'framer-motion';
import { DensityMode } from '@/types/slide';
import { Share2, Circle, ArrowRightLeft } from 'lucide-react';

interface GraphChartProps {
  title: string;
  nodes: {
    id: string;
    label: string;
    type?: 'central' | 'primary' | 'secondary';
  }[];
  edges: {
    from: string;
    to: string;
    label?: string;
  }[];
  density: DensityMode;
}

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const nodeVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
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

const edgeVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeInOut' as const,
    },
  },
};

export function GraphChart({ title, nodes, edges, density }: GraphChartProps) {
  const isReadStyle = density === 'read_style';

  const getNodeStyle = (type?: string) => {
    switch (type) {
      case 'central':
        return 'bg-gradient-to-br from-slate-900 to-slate-800 text-white text-base font-bold px-6 py-4 shadow-xl shadow-slate-300';
      case 'primary':
        return 'bg-gradient-to-br from-teal-500 to-teal-600 text-white font-semibold px-5 py-3 text-sm shadow-lg shadow-teal-200';
      default:
        return 'bg-white text-slate-700 px-4 py-2.5 text-xs border-2 border-slate-200 shadow-md hover:border-teal-300 hover:shadow-lg';
    }
  };

  // Simple layout: central node in center, others arranged around it
  const centralNode = nodes.find(n => n.type === 'central') || nodes[0];
  const otherNodes = nodes.filter(n => n.id !== centralNode?.id);

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
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">{title}</h1>
        </div>
      </motion.div>

      {/* Divider */}
      <motion.div 
        className="w-20 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-6"
        variants={headerVariants}
      />

      {/* Graph */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Edges (SVG lines) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {edges.map((edge, index) => {
            const targetIndex = nodes.findIndex(n => n.id === edge.to);
            const targetNode = otherNodes.find(n => n.id === edge.to);
            if (!targetNode) return null;
            
            const angle = ((targetIndex - 1) / otherNodes.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 30;
            const x2 = 50 + radius * Math.cos(angle);
            const y2 = 50 + radius * Math.sin(angle);
            
            return (
              <motion.line
                key={index}
                x1="50%"
                y1="50%"
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke={edge.label ? '#0d9488' : '#cbd5e1'}
                strokeWidth={edge.label ? '3' : '2'}
                strokeDasharray={edge.label ? '0' : '8,4'}
                variants={edgeVariants}
                custom={index}
              />
            );
          })}
        </svg>

        {/* Central Node */}
        {centralNode && (
          <motion.div 
            className={`absolute rounded-2xl z-20 ${getNodeStyle(centralNode.type)}`}
            variants={nodeVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center space-x-2">
              <Circle className="w-4 h-4 fill-current" />
              <span>{centralNode.label}</span>
            </div>
          </motion.div>
        )}

        {/* Other Nodes - arranged in a circle */}
        {otherNodes.map((node, index) => {
          const angle = (index / otherNodes.length) * 2 * Math.PI - Math.PI / 2;
          const radius = 30;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);

          return (
            <motion.div
              key={node.id}
              className={`absolute rounded-xl z-10 cursor-pointer ${getNodeStyle(node.type)}`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              variants={nodeVariants}
              whileHover={{ scale: 1.1, zIndex: 30 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {node.label}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <motion.div 
        className="mt-6 flex justify-center space-x-6 text-sm"
        variants={headerVariants}
      >
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg" />
          <span className="text-slate-600 font-medium">Central</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg" />
          <span className="text-slate-600 font-medium">Primary</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-white border-2 border-slate-200 rounded-lg" />
          <span className="text-slate-600 font-medium">Secondary</span>
        </div>
        <div className="flex items-center space-x-2">
          <ArrowRightLeft className="w-4 h-4 text-teal-600" />
          <span className="text-slate-600 font-medium">Direct Connection</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
