import React from 'react';
import { HabitType } from '../types';
import { Filter, Calendar, Circle } from 'lucide-react';
import { formatDisplayDate } from '../utils/dateUtils';

interface LeftSidebarProps {
  selectedDate: Date;
  filter: 'all' | HabitType;
  onFilterChange: (filter: 'all' | HabitType) => void;
  todayStats: {
    totalStreaks: number;
    totalSuccess: number;
    totalFails: number;
    consistency: number;
  };
}

export function LeftSidebar({ selectedDate, filter, onFilterChange, todayStats }: LeftSidebarProps) {
  return (
    <aside className="w-[280px] h-screen sticky top-0 border-r border-white/10 bg-gradient-to-b from-white/50 to-white/20 dark:from-gray-900/50 dark:to-gray-900/20 backdrop-blur-sm overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Today Summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm opacity-70">
            <Calendar className="w-4 h-4" />
            <span>Dnes</span>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
            <p className="text-xs opacity-70 mb-1">Vybraný deň</p>
            <p className="font-semibold text-sm">{formatDisplayDate(selectedDate)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm opacity-70">
            <Filter className="w-4 h-4" />
            <span>Filtre</span>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => onFilterChange('all')}
              className={`w-full px-4 py-2.5 rounded-xl text-left transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10'
              }`}
            >
              Všetky návyky
            </button>
            
            <button
              onClick={() => onFilterChange('good')}
              className={`w-full px-4 py-2.5 rounded-xl text-left transition-all ${
                filter === 'good'
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                  : 'bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10'
              }`}
            >
              Dobré návyky
            </button>
            
            <button
              onClick={() => onFilterChange('bad')}
              className={`w-full px-4 py-2.5 rounded-xl text-left transition-all ${
                filter === 'bad'
                  ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg'
                  : 'bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10'
              }`}
            >
              Zlé návyky
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          <p className="text-sm opacity-70">Legenda bodiek</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 fill-emerald-500 text-emerald-500" />
              <span>Dobrý návyk - úspech</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 fill-rose-500 text-rose-500" />
              <span>Zlý návyk - vyhnutie</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 fill-orange-500 text-orange-500" />
              <span>Neúspech</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-3">
          <p className="text-sm opacity-70">Rýchle štatistiky (30 dní)</p>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
              <p className="text-2xl font-bold">{todayStats.totalStreaks}</p>
              <p className="text-xs opacity-70 mt-1">Streaky</p>
            </div>
            
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
              <p className="text-2xl font-bold">{todayStats.totalSuccess}</p>
              <p className="text-xs opacity-70 mt-1">Úspechy</p>
            </div>
            
            <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-rose-500/20">
              <p className="text-2xl font-bold">{todayStats.totalFails}</p>
              <p className="text-xs opacity-70 mt-1">Neúspechy</p>
            </div>
            
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <p className="text-2xl font-bold">{todayStats.consistency}%</p>
              <p className="text-xs opacity-70 mt-1">Konzistencia</p>
            </div>
          </div>
        </div>

        {/* Motivational text */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
          <p className="text-sm italic opacity-80">
            "Malé kroky denne vedú k veľkým výsledkom."
          </p>
        </div>
      </div>
    </aside>
  );
}
