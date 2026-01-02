import { Habit, HabitRecord } from '../types';
import { formatDate, getLast30Days } from './dateUtils';
import { startOfDay, parseISO, differenceInDays } from 'date-fns';

export const calculateStreak = (habitId: string, records: HabitRecord[]): number => {
  const habitRecords = records
    .filter(r => r.habitId === habitId && r.status === 'success')
    .map(r => parseISO(r.date))
    .sort((a, b) => b.getTime() - a.getTime());

  if (habitRecords.length === 0) return 0;

  let streak = 0;
  let currentDate = startOfDay(new Date());

  for (const recordDate of habitRecords) {
    const diff = differenceInDays(currentDate, startOfDay(recordDate));
    
    if (diff === streak) {
      streak++;
    } else if (diff > streak) {
      break;
    }
  }

  return streak;
};

export const calculateLongestStreak = (habitId: string, records: HabitRecord[]): number => {
  const habitRecords = records
    .filter(r => r.habitId === habitId && r.status === 'success')
    .map(r => parseISO(r.date))
    .sort((a, b) => a.getTime() - b.getTime());

  if (habitRecords.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < habitRecords.length; i++) {
    const diff = differenceInDays(habitRecords[i], habitRecords[i - 1]);
    
    if (diff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
};

export const calculateSuccessRate = (habitId: string, records: HabitRecord[], days: number = 30): number => {
  const last30Days = getLast30Days();
  const startDate = formatDate(last30Days[0]);
  
  const relevantRecords = records.filter(r => r.habitId === habitId && r.date >= startDate);
  
  if (relevantRecords.length === 0) return 0;
  
  const successCount = relevantRecords.filter(r => r.status === 'success').length;
  return Math.round((successCount / relevantRecords.length) * 100);
};

export const calculateFailCount = (habitId: string, records: HabitRecord[], days: number = 30): number => {
  const last30Days = getLast30Days();
  const startDate = formatDate(last30Days[0]);
  
  return records.filter(r => r.habitId === habitId && r.date >= startDate && r.status === 'fail').length;
};

export const getSuccessCountLast30Days = (habitId: string, records: HabitRecord[]): number => {
  const last30Days = getLast30Days();
  const startDate = formatDate(last30Days[0]);
  
  return records.filter(r => r.habitId === habitId && r.date >= startDate && r.status === 'success').length;
};

export const getTotalStats = (habits: Habit[], records: HabitRecord[]) => {
  const last30Days = getLast30Days();
  const startDate = formatDate(last30Days[0]);
  
  const relevantRecords = records.filter(r => r.date >= startDate);
  
  const totalSuccess = relevantRecords.filter(r => r.status === 'success').length;
  const totalFails = relevantRecords.filter(r => r.status === 'fail').length;
  
  const totalStreaks = habits.reduce((sum, habit) => {
    return sum + calculateStreak(habit.id, records);
  }, 0);
  
  const consistency = relevantRecords.length > 0 
    ? Math.round((totalSuccess / relevantRecords.length) * 100)
    : 0;
  
  return {
    totalStreaks,
    totalSuccess,
    totalFails,
    consistency,
  };
};

export const getDayStats = (date: string, habits: Habit[], records: HabitRecord[]) => {
  const dayRecords = records.filter(r => r.date === date);
  
  let goodSuccess = 0;
  let badAvoided = 0;
  let fail = 0;
  
  dayRecords.forEach(record => {
    const habit = habits.find(h => h.id === record.habitId);
    if (!habit) return;
    
    if (record.status === 'success') {
      if (habit.type === 'good') {
        goodSuccess++;
      } else {
        badAvoided++;
      }
    } else {
      fail++;
    }
  });
  
  return { goodSuccess, badAvoided, fail };
};
