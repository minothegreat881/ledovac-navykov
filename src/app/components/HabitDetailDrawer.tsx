import React, { useMemo, useState, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Habit, HabitRecord, measurementUnitLabels } from '../types';
import { Button } from './ui/button';
import { Pencil, Trash2, Flame, Target, TrendingUp, TrendingDown, Minus, XCircle, Clock, Ruler, Zap, BarChart3 } from 'lucide-react';
import { calculateStreak, calculateLongestStreak, calculateSuccessRate, calculateFailCount } from '../utils/habitStats';
import { getLast30Days, formatDate } from '../utils/dateUtils';
import { motion } from 'motion/react';

interface HabitDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit | null;
  records: HabitRecord[];
  onEdit: () => void;
  onDelete: () => void;
}

// Helper to format time from seconds to readable format
function formatTimeDisplay(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  if (h > 0) {
    return `${h}h ${m}m ${s}s`;
  } else if (m > 0) {
    return `${m}m ${s}s`;
  }
  return `${s}s`;
}

// Helper to format time in compact format (for stats)
function formatTimeCompact(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) {
    return `${h}h ${m}m`;
  }
  return `${m}m`;
}

// Helper to format pace (seconds per unit -> mm:ss format)
function formatPace(secondsPerUnit: number): string {
  const m = Math.floor(secondsPerUnit / 60);
  const s = Math.floor(secondsPerUnit % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Helper to calculate trend
function calculateTrend(values: number[]): 'up' | 'down' | 'stable' {
  if (values.length < 2) return 'stable';
  const recent = values.slice(-7);
  const older = values.slice(-14, -7);
  if (older.length === 0) return 'stable';

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

  const diff = ((recentAvg - olderAvg) / olderAvg) * 100;
  if (diff > 5) return 'up';
  if (diff < -5) return 'down';
  return 'stable';
}

// Simple line chart component
function MiniLineChart({ data, color, height = 80 }: { data: number[], color: string, height?: number }) {
  if (data.length === 0) return null;

  const max = Math.max(...data) || 1;
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - ((value - min) / range) * (height - 10) - 5;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} 100,${height}`;

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#gradient-${color})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((value, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = height - ((value - min) / range) * (height - 10) - 5;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="2"
            fill={color}
            className="opacity-0 hover:opacity-100 transition-opacity"
          />
        );
      })}
    </svg>
  );
}

// Bar chart component for comparing values
function MiniBarChart({ data, color, height = 60 }: { data: number[], color: string, height?: number }) {
  if (data.length === 0) return null;

  const max = Math.max(...data) || 1;
  const barWidth = 100 / data.length - 2;

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" preserveAspectRatio="none">
      {data.map((value, i) => {
        const barHeight = (value / max) * (height - 5);
        const x = i * (100 / data.length) + 1;
        const y = height - barHeight;
        return (
          <motion.rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx="2"
            fill={color}
            initial={{ height: 0, y: height }}
            animate={{ height: barHeight, y }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="opacity-70 hover:opacity-100 transition-opacity"
          />
        );
      })}
    </svg>
  );
}

export function HabitDetailDrawer({ isOpen, onClose, habit, records, onEdit, onDelete }: HabitDetailDrawerProps) {
  // Swipe to close gesture
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);

    // Only track horizontal swipes (deltaX > deltaY means more horizontal than vertical)
    if (deltaX > 0 && deltaX > deltaY) {
      setSwipeOffset(Math.min(deltaX, 200)); // Cap at 200px
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > 100) {
      // If swiped more than 100px, close the drawer
      onClose();
    }
    setSwipeOffset(0);
  };

  if (!habit) return null;

  const streak = calculateStreak(habit.id, records);
  const longestStreak = calculateLongestStreak(habit.id, records);
  const successRate = calculateSuccessRate(habit.id, records);
  const failCount = calculateFailCount(habit.id, records);

  const last30Days = getLast30Days();
  const heatmapData = last30Days.map(day => {
    const dateStr = formatDate(day);
    const record = records.find(r => r.habitId === habit.id && r.date === dateStr);
    return {
      date: dateStr,
      status: record?.status || 'none',
    };
  });

  // Get measurement data for charts
  const measurementData = useMemo(() => {
    if (!habit.measurable) return null;

    const habitRecords = records
      .filter(r => r.habitId === habit.id && r.measurementValue !== undefined)
      .sort((a, b) => a.date.localeCompare(b.date));

    const values = habitRecords.map(r => r.measurementValue!);
    const timeValues = habitRecords.map(r => r.secondaryValue).filter((v): v is number => v !== undefined);
    const dates = habitRecords.map(r => r.date);

    // Calculate stats
    const total = values.reduce((a, b) => a + b, 0);
    const average = values.length > 0 ? total / values.length : 0;
    const best = values.length > 0 ? Math.max(...values) : 0;
    const totalTime = timeValues.reduce((a, b) => a + b, 0);
    const avgTime = timeValues.length > 0 ? totalTime / timeValues.length : 0;

    // Calculate pace (for distance + time)
    const paceData = habitRecords
      .filter(r => r.measurementValue && r.secondaryValue)
      .map(r => r.secondaryValue! / r.measurementValue!); // min per unit

    const avgPace = paceData.length > 0 ? paceData.reduce((a, b) => a + b, 0) / paceData.length : 0;
    const bestPace = paceData.length > 0 ? Math.min(...paceData) : 0;

    // Weekly aggregation for bar chart
    const weeklyData: number[] = [];
    const weeklyTimeData: number[] = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = 21 - i * 7;
      const weekEnd = 28 - i * 7;
      const weekRecords = habitRecords.filter(r => {
        const daysAgo = Math.floor((Date.now() - new Date(r.date).getTime()) / (1000 * 60 * 60 * 24));
        return daysAgo >= weekStart && daysAgo < weekEnd;
      });
      weeklyData.unshift(weekRecords.reduce((sum, r) => sum + (r.measurementValue || 0), 0));
      weeklyTimeData.unshift(weekRecords.reduce((sum, r) => sum + (r.secondaryValue || 0), 0));
    }

    return {
      values,
      timeValues,
      dates,
      total,
      average,
      best,
      totalTime,
      avgTime,
      avgPace,
      bestPace,
      weeklyData,
      weeklyTimeData,
      trend: calculateTrend(values),
      timeTrend: calculateTrend(timeValues),
      paceTrend: paceData.length >= 2 ? calculateTrend(paceData.map(p => -p)) : 'stable' as const, // Invert for pace (lower is better)
    };
  }, [habit, records]);

  const unit = habit.measurementUnit ? measurementUnitLabels[habit.measurementUnit] : '';

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        className="w-full overflow-y-auto bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-0 transition-transform"
        style={{ transform: `translateX(${swipeOffset}px)`, opacity: 1 - swipeOffset / 300 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="max-w-2xl mx-auto p-6">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl">Detail návyku</SheetTitle>
          </SheetHeader>

          <div className="space-y-6">
          {/* Habit info card */}
          <div className={`p-6 rounded-2xl border ${
            habit.type === 'good' 
              ? 'bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20'
              : 'bg-gradient-to-br from-rose-500/10 to-red-500/10 border-rose-500/20'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl ${
                habit.type === 'good' ? 'bg-emerald-500/20' : 'bg-rose-500/20'
              }`}>
                {habit.icon}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{habit.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    habit.type === 'good' 
                      ? 'bg-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-rose-500/30 text-rose-600 dark:text-rose-400'
                  }`}>
                    {habit.type === 'good' ? 'Dobrý návyk' : 'Zlý návyk'}
                  </span>
                  {habit.tags.map(tag => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/20">
                      {tag}
                    </span>
                  ))}
                </div>
                {habit.note && (
                  <p className="mt-3 text-sm opacity-80">{habit.note}</p>
                )}
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm opacity-70">Aktuálny streak</span>
              </div>
              <p className="text-2xl font-bold">{streak}</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-purple-500" />
                <span className="text-sm opacity-70">Najdlhší streak</span>
              </div>
              <p className="text-2xl font-bold">{longestStreak}</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm opacity-70">Úspešnosť (30d)</span>
              </div>
              <p className="text-2xl font-bold">{successRate}%</p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-rose-500/20">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-rose-500" />
                <span className="text-sm opacity-70">Neúspechy (30d)</span>
              </div>
              <p className="text-2xl font-bold">{failCount}</p>
            </div>
          </div>

          {/* Charts for measurable habits */}
          {habit.measurable && measurementData && measurementData.values.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Štatistiky a trendy
              </h4>

              {/* Trend indicators */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs opacity-70">Trend ({unit})</span>
                    {measurementData.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                    {measurementData.trend === 'down' && <TrendingDown className="w-4 h-4 text-rose-500" />}
                    {measurementData.trend === 'stable' && <Minus className="w-4 h-4 text-gray-400" />}
                  </div>
                  <p className="text-lg font-bold">
                    {measurementData.trend === 'up' && 'Zlepšuješ sa!'}
                    {measurementData.trend === 'down' && 'Pokles'}
                    {measurementData.trend === 'stable' && 'Stabilný'}
                  </p>
                </div>

                {habit.trackTime && measurementData.timeValues.length > 0 && (
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs opacity-70">Trend (čas)</span>
                      {measurementData.timeTrend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                      {measurementData.timeTrend === 'down' && <TrendingDown className="w-4 h-4 text-rose-500" />}
                      {measurementData.timeTrend === 'stable' && <Minus className="w-4 h-4 text-gray-400" />}
                    </div>
                    <p className="text-lg font-bold">
                      {measurementData.timeTrend === 'up' && 'Viac času'}
                      {measurementData.timeTrend === 'down' && 'Menej času'}
                      {measurementData.timeTrend === 'stable' && 'Stabilný'}
                    </p>
                  </div>
                )}
              </div>

              {/* Pace indicator for distance activities */}
              {habit.trackTime && measurementData.avgPace > 0 && (habit.measurementUnit === 'km' || habit.measurementUnit === 'm') && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold">Tempo</span>
                    {measurementData.paceTrend === 'up' && <span className="text-xs text-emerald-500 ml-auto">Zlepšuješ sa!</span>}
                    {measurementData.paceTrend === 'down' && <span className="text-xs text-rose-500 ml-auto">Spomaľuješ</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs opacity-70">Priemerné tempo</p>
                      <p className="text-xl font-bold">{formatPace(measurementData.avgPace)}/{unit}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-70">Najlepšie tempo</p>
                      <p className="text-xl font-bold text-amber-500">{formatPace(measurementData.bestPace)}/{unit}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-white/5 text-center">
                  <Ruler className="w-4 h-4 mx-auto mb-1 opacity-50" />
                  <p className="text-xs opacity-70">Celkom</p>
                  <p className="font-bold">{measurementData.total.toFixed(1)} {unit}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 text-center">
                  <Target className="w-4 h-4 mx-auto mb-1 opacity-50" />
                  <p className="text-xs opacity-70">Priemer</p>
                  <p className="font-bold">{measurementData.average.toFixed(1)} {unit}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 text-center">
                  <Flame className="w-4 h-4 mx-auto mb-1 opacity-50" />
                  <p className="text-xs opacity-70">Maximum</p>
                  <p className="font-bold">{measurementData.best.toFixed(1)} {unit}</p>
                </div>
              </div>

              {/* Time stats */}
              {habit.trackTime && measurementData.timeValues.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-center">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                    <p className="text-xs opacity-70">Celkový čas</p>
                    <p className="font-bold">{formatTimeCompact(measurementData.totalTime)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 text-center">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                    <p className="text-xs opacity-70">Priemerný čas</p>
                    <p className="font-bold">{formatTimeDisplay(measurementData.avgTime)}</p>
                  </div>
                </div>
              )}

              {/* Progress line chart */}
              {measurementData.values.length > 1 && (
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-sm font-medium mb-3">Vývoj ({unit})</p>
                  <div className="h-20">
                    <MiniLineChart data={measurementData.values} color="#8b5cf6" />
                  </div>
                </div>
              )}

              {/* Time line chart */}
              {habit.trackTime && measurementData.timeValues.length > 1 && (
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-sm font-medium mb-3">Vývoj času (min)</p>
                  <div className="h-20">
                    <MiniLineChart data={measurementData.timeValues} color="#06b6d4" />
                  </div>
                </div>
              )}

              {/* Weekly bar chart */}
              {measurementData.weeklyData.some(v => v > 0) && (
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-sm font-medium mb-3">Týždenný prehľad</p>
                  <div className="h-16">
                    <MiniBarChart data={measurementData.weeklyData} color="#10b981" />
                  </div>
                  <div className="flex justify-between text-xs opacity-50 mt-2">
                    <span>Pred 4 týždňami</span>
                    <span>Tento týždeň</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Heatmap */}
          <div className="space-y-3">
            <h4 className="font-semibold">Posledných 30 dní</h4>
            <div className="grid grid-cols-10 gap-1.5">
              {heatmapData.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={`aspect-square rounded-md ${
                    day.status === 'success'
                      ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
                      : day.status === 'fail'
                      ? 'bg-rose-500 shadow-lg shadow-rose-500/50'
                      : 'bg-white/10'
                  }`}
                  title={day.date}
                />
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs opacity-70">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span>Úspech</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-rose-500" />
                <span>Neúspech</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-white/10" />
                <span>Bez záznamu</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onEdit} className="flex-1">
              <Pencil className="w-4 h-4 mr-2" />
              Upraviť
            </Button>
            <Button variant="destructive" onClick={onDelete} className="flex-1">
              <Trash2 className="w-4 h-4 mr-2" />
              Zmazať
            </Button>
          </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
