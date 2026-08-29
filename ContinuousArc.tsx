import React from 'react';
import { motion } from 'motion/react';

interface ContinuousArcProps {
  variant?: 'curve-left' | 'curve-right' | 'wave' | 'divider';
  className?: string;
}

export const ContinuousArc: React.FC<ContinuousArcProps> = ({
  variant = 'divider',
  className = '',
}) => {
  if (variant === 'divider') {
    return (
      <div className={`relative w-full py-4 flex items-center justify-center overflow-hidden pointer-events-none ${className}`}>
        <svg className="w-full max-w-4xl h-8 opacity-40 dark:opacity-20" viewBox="0 0 1000 40" fill="none">
          <motion.path
            d="M 0 20 Q 250 5 500 20 T 1000 20"
            stroke="url(#arcLinearGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          />
          <defs>
            <linearGradient id="arcLinearGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
              <stop offset="30%" stopColor="#8B5CF6" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#F472B6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (variant === 'curve-left') {
    return (
      <div className={`relative w-full py-6 flex items-center justify-center overflow-hidden pointer-events-none ${className}`}>
        <svg className="w-full max-w-5xl h-14 opacity-35 dark:opacity-20" viewBox="0 0 1200 60" fill="none">
          <motion.path
            d="M 100 50 C 400 0 800 60 1100 10"
            stroke="url(#arcLeftGrad)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="arcLeftGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="50%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative w-full py-6 flex items-center justify-center overflow-hidden pointer-events-none ${className}`}>
      <svg className="w-full max-w-5xl h-14 opacity-35 dark:opacity-20" viewBox="0 0 1200 60" fill="none">
        <motion.path
          d="M 100 10 C 400 60 800 0 1100 50"
          stroke="url(#arcRightGrad)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="arcRightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="50%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
