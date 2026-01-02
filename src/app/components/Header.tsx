import React, { useState } from 'react';
import { Plus, Moon, Sun, ChevronLeft, ChevronRight, BarChart3, RotateCcw, Search, Snowflake, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useTheme } from 'next-themes';
import { getMonthName } from '../utils/dateUtils';
import { addMonths, subMonths } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onAddHabit: () => void;
  onShowStats: () => void;
  onReset: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({
  currentMonth,
  onMonthChange,
  onAddHabit,
  onShowStats,
  onReset,
  searchQuery,
  onSearchChange
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-white/20 shadow-lg">
      <div className="max-w-[1920px] mx-auto px-3 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Snowflake className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                LEDOVAČ
              </h1>
              <p className="text-xs opacity-70 hidden md:block">Premieňte návyky na víťazstvá</p>
            </div>
          </div>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <Input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Hľadať návyky..."
                className="pl-10 bg-white/50 dark:bg-black/20 border-white/20"
              />
            </div>
          </div>

          {/* Month Navigation - Compact on mobile */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMonthChange(subMonths(currentMonth, 1))}
              className="rounded-xl w-8 h-8 md:w-10 md:h-10"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            <div className="min-w-[100px] md:min-w-[180px] text-center font-semibold text-sm md:text-base">
              {getMonthName(currentMonth)}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMonthChange(addMonths(currentMonth, 1))}
              className="rounded-xl w-8 h-8 md:w-10 md:h-10"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onShowStats}
              className="rounded-xl"
              title="Štatistiky"
            >
              <BarChart3 className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onReset}
              className="rounded-xl"
              title="Resetovať dáta"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-xl"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button
              onClick={onAddHabit}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Pridať návyk
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="rounded-xl w-9 h-9"
            >
              <Search className="w-4 h-4" />
            </Button>

            <Button
              onClick={onAddHabit}
              size="icon"
              className="rounded-xl w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-600"
            >
              <Plus className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="rounded-xl w-9 h-9"
            >
              {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Hľadať návyky..."
                    className="pl-10 bg-white/50 dark:bg-black/20 border-white/20"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-3 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { onShowStats(); setShowMobileMenu(false); }}
                  className="rounded-xl flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Štatistiky
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="rounded-xl flex items-center gap-2"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {theme === 'dark' ? 'Svetlý' : 'Tmavý'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { onReset(); setShowMobileMenu(false); }}
                  className="rounded-xl flex items-center gap-2 text-rose-500"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
