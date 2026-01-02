import React, { useState } from 'react';
import { Habit, measurementUnitLabels } from '../types';
import { Check, X, Flame, Ruler, Trash2, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface HabitCardProps {
  habit: Habit;
  status?: 'success' | 'fail' | 'none';
  streak?: number;
  measurementValue?: number;
  secondaryValue?: number; // Time in minutes
  onSuccess?: (measurementValue?: number, secondaryValue?: number) => void;
  onFail?: () => void;
  onClick?: () => void;
  onDelete?: () => void;
}

// Helper to convert seconds to H:M:S format
function secondsToHMS(totalSeconds: number): { h: number, m: number, s: number } {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return { h, m, s };
}

// Helper to format time display
function formatTimeDisplay(totalSeconds: number): string {
  const { h, m, s } = secondsToHMS(totalSeconds);
  if (h > 0) {
    return `${h}h ${m}m ${s}s`;
  } else if (m > 0) {
    return `${m}m ${s}s`;
  }
  return `${s}s`;
}

export function HabitCard({
  habit,
  status = 'none',
  streak = 0,
  measurementValue,
  secondaryValue, // Now stored as seconds
  onSuccess,
  onFail,
  onClick,
  onDelete
}: HabitCardProps) {
  const [inputValue, setInputValue] = useState<string>(measurementValue?.toString() || '');
  // Time in H:M:S format
  const initialTime = secondaryValue ? secondsToHMS(secondaryValue) : { h: 0, m: 0, s: 0 };
  const [hours, setHours] = useState<string>(initialTime.h > 0 ? initialTime.h.toString() : '');
  const [minutes, setMinutes] = useState<string>(initialTime.m > 0 ? initialTime.m.toString() : '');
  const [seconds, setSeconds] = useState<string>(initialTime.s > 0 ? initialTime.s.toString() : '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isGood = habit.type === 'good';
  const isPending = status === 'none';

  // Different styles based on completion status
  const borderColor = isPending
    ? 'border-amber-500/50 border-2'
    : status === 'success'
    ? 'border-emerald-500/50'
    : status === 'fail'
    ? 'border-rose-500/50'
    : isGood
    ? 'border-emerald-500/30 hover:border-emerald-500/50'
    : 'border-rose-500/30 hover:border-rose-500/50';

  const bgGradient = isPending
    ? 'from-amber-500/10 to-yellow-500/5'
    : status === 'success'
    ? isGood ? 'from-emerald-500/15 to-green-500/10' : 'from-emerald-500/15 to-green-500/10'
    : status === 'fail'
    ? 'from-rose-500/15 to-red-500/10'
    : isGood
    ? 'from-emerald-500/5 to-green-500/5'
    : 'from-rose-500/5 to-red-500/5';

  const handleSuccess = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (habit.measurable && inputValue) {
      // Convert H:M:S to total seconds
      const totalSeconds = habit.trackTime
        ? (parseInt(hours || '0') * 3600) + (parseInt(minutes || '0') * 60) + parseInt(seconds || '0')
        : undefined;
      onSuccess?.(parseFloat(inputValue), totalSeconds && totalSeconds > 0 ? totalSeconds : undefined);
    } else {
      onSuccess?.();
    }
  };

  const unit = habit.measurementUnit ? measurementUnitLabels[habit.measurementUnit] : '';
  const goalProgress = habit.measurementGoal && measurementValue
    ? Math.min((measurementValue / habit.measurementGoal) * 100, 100)
    : 0;
  // timeGoal is stored in seconds now
  const timeProgress = habit.timeGoal && secondaryValue
    ? Math.min((secondaryValue / habit.timeGoal) * 100, 100)
    : 0;
  const timeGoalFormatted = habit.timeGoal ? formatTimeDisplay(habit.timeGoal) : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-xl border ${borderColor} bg-gradient-to-br ${bgGradient} backdrop-blur-sm p-4 transition-all hover:shadow-lg cursor-pointer group`}
      onClick={onClick}
    >
      {/* Pending indicator */}
      {isPending && (
        <motion.div
          className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-medium"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <AlertCircle className="w-3 h-3" />
          <span>Čaká</span>
        </motion.div>
      )}

      {/* Success indicator */}
      {status === 'success' && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-xs font-medium">
          <Check className="w-3 h-3" />
          <span>Hotovo</span>
        </div>
      )}

      {/* Fail indicator */}
      {status === 'fail' && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-rose-500/20 text-rose-500 text-xs font-medium">
          <X className="w-3 h-3" />
          <span>Nesplnené</span>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          isPending
            ? 'bg-amber-500/20'
            : status === 'success'
            ? 'bg-emerald-500/20'
            : status === 'fail'
            ? 'bg-rose-500/20'
            : isGood ? 'bg-emerald-500/10' : 'bg-rose-500/10'
        }`}>
          {habit.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{habit.name}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isGood
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                }`}>
                  {isGood ? 'Dobrý' : 'Zlý'}
                </span>
                {habit.measurable && (
                  <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <Ruler className="w-3 h-3" />
                    {unit}
                  </span>
                )}
                {streak > 0 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {streak}
                  </span>
                )}
                {habit.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {habit.note && (
            <p className="text-sm opacity-70 mt-2 line-clamp-1">{habit.note}</p>
          )}

          {/* Measurement input for measurable habits */}
          {habit.measurable && (
            <div className="mt-3 space-y-2">
              {/* Primary measurement */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1">
                  <Ruler className="w-3 h-3 opacity-50" />
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="0"
                    className="w-14 bg-transparent text-center font-semibold focus:outline-none"
                  />
                  <span className="text-sm opacity-70">{unit}</span>
                </div>
                {habit.measurementGoal && (
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${goalProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-xs opacity-50">
                      / {habit.measurementGoal} {unit}
                    </span>
                  </div>
                )}
              </div>

              {/* Time measurement - H:M:S format */}
              {habit.trackTime && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-blue-500/10 rounded-lg px-2 py-1">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <input
                      type="number"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="0"
                      className="w-8 bg-transparent text-center font-semibold focus:outline-none"
                      min="0"
                    />
                    <span className="text-xs opacity-50">h</span>
                    <input
                      type="number"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="0"
                      className="w-8 bg-transparent text-center font-semibold focus:outline-none"
                      min="0"
                      max="59"
                    />
                    <span className="text-xs opacity-50">m</span>
                    <input
                      type="number"
                      value={seconds}
                      onChange={(e) => setSeconds(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="0"
                      className="w-8 bg-transparent text-center font-semibold focus:outline-none"
                      min="0"
                      max="59"
                    />
                    <span className="text-xs opacity-50">s</span>
                  </div>
                  {habit.timeGoal && (
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${timeProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="text-xs opacity-50">
                        / {timeGoalFormatted}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Success indicator */}
              {status === 'success' && measurementValue && (
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-500">
                  <span>✓ {measurementValue} {unit}</span>
                  {secondaryValue && <span>• {formatTimeDisplay(secondaryValue)}</span>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSuccess}
            className={`p-2 rounded-lg transition-all ${
              status === 'success'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                : 'bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-500'
            }`}
          >
            <Check className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onFail?.();
            }}
            className={`p-2 rounded-lg transition-all ${
              status === 'fail'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/50'
                : 'bg-white/5 hover:bg-rose-500/20 hover:text-rose-500'
            }`}
          >
            <X className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            className="p-2 rounded-lg transition-all bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 opacity-50 hover:opacity-100"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-3 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-medium">Naozaj chceš zmazať tento návyk?</p>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium"
              >
                Zrušiť
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium"
              >
                Zmazať
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Frost glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Pending glow animation */}
      {isPending && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl"
          animate={{
            boxShadow: [
              'inset 0 0 20px rgba(245, 158, 11, 0.1)',
              'inset 0 0 30px rgba(245, 158, 11, 0.2)',
              'inset 0 0 20px rgba(245, 158, 11, 0.1)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Streak glow animation */}
      {streak >= 7 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              'radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.1) 0%, transparent 70%)',
              'radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.2) 0%, transparent 70%)',
              'radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.1) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
