import { useState, useEffect } from 'react';
import { Habit, HabitRecord } from '../types';

const HABITS_KEY = 'ledovac_habits';
const RECORDS_KEY = 'ledovac_records';
const VERSION_KEY = 'ledovac_version';
const CURRENT_VERSION = '2.0'; // Change this to force reset

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [records, setRecords] = useState<HabitRecord[]>([]);

  useEffect(() => {
    // Clear demo data on version change
    const savedVersion = localStorage.getItem(VERSION_KEY);
    if (savedVersion !== CURRENT_VERSION) {
      localStorage.removeItem(HABITS_KEY);
      localStorage.removeItem(RECORDS_KEY);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    }

    const savedHabits = localStorage.getItem(HABITS_KEY);
    const savedRecords = localStorage.getItem(RECORDS_KEY);

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  const saveHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
    localStorage.setItem(HABITS_KEY, JSON.stringify(newHabits));
  };

  const saveRecords = (newRecords: HabitRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem(RECORDS_KEY, JSON.stringify(newRecords));
  };

  const addHabit = (habit: Habit) => {
    saveHabits([...habits, habit]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    saveHabits(habits.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const deleteHabit = (id: string) => {
    saveHabits(habits.filter(h => h.id !== id));
    saveRecords(records.filter(r => r.habitId !== id));
  };

  const addRecord = (record: HabitRecord) => {
    const existing = records.find(
      r => r.habitId === record.habitId && r.date === record.date
    );
    
    if (existing) {
      saveRecords(
        records.map(r => 
          r.habitId === record.habitId && r.date === record.date 
            ? record 
            : r
        )
      );
    } else {
      saveRecords([...records, record]);
    }
  };

  const deleteRecord = (habitId: string, date: string) => {
    saveRecords(records.filter(r => !(r.habitId === habitId && r.date === date)));
  };

  const getRecord = (habitId: string, date: string) => {
    return records.find(r => r.habitId === habitId && r.date === date);
  };

  const resetAllData = () => {
    saveHabits([]);
    saveRecords([]);
  };

  return {
    habits,
    records,
    addHabit,
    updateHabit,
    deleteHabit,
    addRecord,
    deleteRecord,
    getRecord,
    resetAllData,
  };
}