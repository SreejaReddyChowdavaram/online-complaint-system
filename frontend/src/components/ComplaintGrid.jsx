import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ComplaintGrid Component
 * 
 * Implements a professional SaaS grid layout:
 * - Mobile: 1 Column
 * - Tablet: 2 Columns
 * - Desktop: Auto-fit (min 300px)
 */
const ComplaintGrid = ({ children, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:complaint-grid-auto gap-6">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="h-64 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800"
          />
        ))}
      </div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div 
        layout
        className="responsive-grid"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ComplaintGrid;
