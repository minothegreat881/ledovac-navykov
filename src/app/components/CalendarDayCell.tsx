import React from 'react';
import { motion } from 'motion/react';
import { DayData } from '../types';

interface CalendarDayCellProps {
  date: Date;
  dayData: DayData;
  isToday: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean;
  onClick: () => void;
}

export function CalendarDayCell({ 
  date, 
  dayData, 
  isToday, 
  isSelected, 
  isCurrentMonth,
  onClick 
}: CalendarDayCellProps) {
  const hasData = dayData.goodSuccess > 0 || dayData.badAvoided > 0 || dayData.fail > 0;
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative aspect-square rounded-xl p-2 cursor-pointer transition-all
        ${!isCurrentMonth ? 'opacity-30' : 'opacity-100'}
        ${isToday ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' : ''}
        ${isSelected 
          ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30 shadow-lg shadow-indigo-500/50' 
          : 'bg-white/5 hover:bg-white/10'
        }
        border border-white/10
      `}
    >
      {/* Date number */}
      <div className="flex items-center justify-center h-full">
        <span className={`text-sm ${isToday ? 'font-bold' : ''}`}>
          {date.getDate()}
        </span>
      </div>
      
      {/* Status dots */}
      {hasData && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          {dayData.goodSuccess > 0 && (
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
          )}
          {dayData.badAvoided > 0 && (
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50" />
          )}
          {dayData.fail > 0 && (
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50" />
          )}
        </div>
      )}
      
      {/* Frost glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Today glow */}
      {isToday && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 20px rgba(59, 130, 246, 0.3)',
              '0 0 30px rgba(59, 130, 246, 0.5)',
              '0 0 20px rgba(59, 130, 246, 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
