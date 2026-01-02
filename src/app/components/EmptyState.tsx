import React from 'react';
import { Snowflake } from 'lucide-react';
import { motion } from 'motion/react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-4 rounded-2xl bg-gradient-to-br from-white/30 to-white/10 dark:from-white/5 dark:to-white/5 border border-white/20"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 mb-4">
        {icon || <Snowflake className="w-8 h-8 text-blue-500" />}
      </div>
      
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-70 mb-6 max-w-md mx-auto">{description}</p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg transition-all hover:scale-105"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
