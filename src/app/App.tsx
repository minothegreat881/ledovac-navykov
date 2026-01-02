import React, { useState, useMemo } from 'react';
import { ThemeProvider } from 'next-themes';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { RightPanel } from './components/RightPanel';
import { HabitCalendar } from './components/HabitCalendar';
import { HabitCard } from './components/HabitCard';
import { HabitDetailDrawer } from './components/HabitDetailDrawer';
import { AddEditHabitModal } from './components/AddEditHabitModal';
import { StatsModal } from './components/StatsModal';
import { ResetModal } from './components/ResetModal';
import { KPIStatCard } from './components/KPIStatCard';
import { EmptyState } from './components/EmptyState';
import { useHabits } from './hooks/useHabits';
import { Habit, HabitType } from './types';
import { formatDate, formatDisplayDate } from './utils/dateUtils';
import { calculateStreak, getTotalStats } from './utils/habitStats';
import { Flame, Target, TrendingUp, XCircle, CalendarDays } from 'lucide-react';
import { motion } from 'motion/react';
import { Toaster, toast } from 'sonner';

function AppContent() {
  const {
    habits,
    records,
    addHabit,
    updateHabit,
    deleteHabit,
    addRecord,
    getRecord,
    resetAllData,
  } = useHabits();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState<'all' | HabitType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const totalStats = getTotalStats(habits, records);

  const filteredHabits = useMemo(() => {
    let filtered = habits;
    
    if (filter !== 'all') {
      filtered = filtered.filter(h => h.type === filter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(h => 
        h.name.toLowerCase().includes(query) ||
        h.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [habits, filter, searchQuery]);

  const selectedDateStr = formatDate(selectedDate);
  const todayHabits = filteredHabits;

  const handleAddHabit = () => {
    setEditingHabit(null);
    setShowAddEditModal(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowAddEditModal(true);
  };

  const handleSaveHabit = (habit: Habit) => {
    if (editingHabit) {
      updateHabit(habit.id, habit);
      toast.success('Návyk bol aktualizovaný');
    } else {
      addHabit(habit);
      toast.success('Návyk bol pridaný');
    }
  };

  const handleDeleteHabit = (habitId: string) => {
    deleteHabit(habitId);
    setShowDetailDrawer(false);
    toast.success('Návyk bol odstránený');
  };

  // Helper to format seconds to readable time
  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const handleHabitSuccess = (habitId: string, measurementValue?: number, secondaryValue?: number) => {
    const existing = getRecord(habitId, selectedDateStr);

    if (existing?.status === 'success' && !measurementValue) {
      // Remove record if clicking again without new value
      addRecord({ habitId, date: selectedDateStr, status: 'fail' });
      toast.info('Záznam zmenený na neúspech');
    } else {
      addRecord({
        habitId,
        date: selectedDateStr,
        status: 'success',
        measurementValue,
        secondaryValue
      });
      if (measurementValue && secondaryValue) {
        toast.success(`Zaznačené: ${measurementValue} + ${formatTime(secondaryValue)} 🎉`);
      } else if (measurementValue) {
        toast.success(`Zaznačené: ${measurementValue} 🎉`);
      } else {
        toast.success('Úspech zaznačený! 🎉');
      }
    }
  };

  const handleHabitFail = (habitId: string) => {
    const existing = getRecord(habitId, selectedDateStr);
    
    if (existing?.status === 'fail') {
      // Remove record if clicking again
      addRecord({ habitId, date: selectedDateStr, status: 'success' });
      toast.info('Záznam zmenený na úspech');
    } else {
      addRecord({ habitId, date: selectedDateStr, status: 'fail' });
      toast.error('Neúspech zaznamenaný');
    }
  };

  const handleHabitClick = (habit: Habit) => {
    setSelectedHabit(habit);
    setShowDetailDrawer(true);
  };

  const handleReset = () => {
    resetAllData();
    setShowResetModal(false);
    toast.success('Všetky dáta boli odstránené');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Header
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
        onAddHabit={handleAddHabit}
        onShowStats={() => setShowStatsModal(true)}
        onReset={() => setShowResetModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex">
        {/* Left Sidebar - hidden on mobile */}
        <div className="hidden lg:block">
          <LeftSidebar
            selectedDate={selectedDate}
            filter={filter}
            onFilterChange={setFilter}
            todayStats={totalStats}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto w-full">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8 p-4 md:p-8 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <CalendarDays className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
              <h2 className="text-xl md:text-2xl font-bold">Dashboard</h2>
            </div>
            <p className="opacity-70 text-sm md:text-base">{formatDisplayDate(new Date())}</p>
            <p className="mt-2 text-xs md:text-sm opacity-80 italic hidden sm:block">
              Každý deň je nová príležitosť zmeniť svoje návyky. Pokračuj! 💪
            </p>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <KPIStatCard
              title="Aktuálne streaky"
              value={totalStats.totalStreaks}
              icon={Flame}
              color="purple"
            />
            <KPIStatCard
              title="Úspechy (30d)"
              value={totalStats.totalSuccess}
              icon={Target}
              color="green"
            />
            <KPIStatCard
              title="Neúspechy (30d)"
              value={totalStats.totalFails}
              icon={XCircle}
              color="red"
            />
            <KPIStatCard
              title="Konzistentnosť"
              value={`${totalStats.consistency}%`}
              icon={TrendingUp}
              color="blue"
            />
          </div>

          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 md:mb-8 p-4 md:p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/20 backdrop-blur-sm"
          >
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Kalendár</h3>
            <HabitCalendar
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              habits={habits}
              records={records}
              onSelectDate={setSelectedDate}
            />
          </motion.div>

          {/* Habits List for Selected Day */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <h3 className="font-semibold text-sm md:text-base">
                Návyky - {formatDisplayDate(selectedDate)}
              </h3>
              <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm flex-wrap">
                {(() => {
                  const pending = todayHabits.filter(h => !getRecord(h.id, selectedDateStr)).length;
                  const completed = todayHabits.filter(h => getRecord(h.id, selectedDateStr)?.status === 'success').length;
                  return (
                    <>
                      {pending > 0 && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-500">
                          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-500 animate-pulse" />
                          {pending} čaká
                        </span>
                      )}
                      {completed > 0 && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-500">
                          ✓ {completed}
                        </span>
                      )}
                      <span className="opacity-50">
                        {todayHabits.length} celkom
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>

            {todayHabits.length === 0 ? (
              <EmptyState
                title={searchQuery ? 'Žiadne návyky nenájdené' : 'Zatiaľ nemáte žiadne návyky'}
                description={searchQuery ? 'Skúste zmeniť vyhľadávací dotaz' : 'Začnite svoju cestu k lepším návykom pridaním prvého návyku'}
                action={!searchQuery ? {
                  label: 'Pridať prvý návyk',
                  onClick: handleAddHabit
                } : undefined}
              />
            ) : (
              <div className="space-y-3">
                {todayHabits.map((habit) => {
                  const record = getRecord(habit.id, selectedDateStr);
                  const streak = calculateStreak(habit.id, records);

                  return (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      status={record?.status || 'none'}
                      streak={streak}
                      measurementValue={record?.measurementValue}
                      secondaryValue={record?.secondaryValue}
                      onSuccess={(val, time) => handleHabitSuccess(habit.id, val, time)}
                      onFail={() => handleHabitFail(habit.id)}
                      onClick={() => handleHabitClick(habit)}
                      onDelete={() => handleDeleteHabit(habit.id)}
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        </main>

        {/* Right Panel - hidden on mobile */}
        <div className="hidden xl:block">
          <RightPanel habits={habits} records={records} />
        </div>
      </div>

      {/* Modals */}
      <AddEditHabitModal
        isOpen={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        onSave={handleSaveHabit}
        editingHabit={editingHabit}
      />

      <StatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        habits={habits}
        records={records}
      />

      <ResetModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleReset}
      />

      <HabitDetailDrawer
        isOpen={showDetailDrawer}
        onClose={() => setShowDetailDrawer(false)}
        habit={selectedHabit}
        records={records}
        onEdit={() => {
          if (selectedHabit) {
            handleEditHabit(selectedHabit);
            setShowDetailDrawer(false);
          }
        }}
        onDelete={() => {
          if (selectedHabit) {
            handleDeleteHabit(selectedHabit.id);
          }
        }}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppContent />
    </ThemeProvider>
  );
}