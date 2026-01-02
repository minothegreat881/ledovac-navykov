import React from 'react';
import { CalendarDayCell } from './CalendarDayCell';
import { Habit, HabitRecord } from '../types';
import { getCalendarDays, getDayOfWeek, formatDate, isToday as checkIsToday, isSameDayAs, isCurrentMonth as checkIsCurrentMonth } from '../utils/dateUtils';
import { getDayStats } from '../utils/habitStats';

interface HabitCalendarProps {
  currentMonth: Date;
  selectedDate: Date;
  habits: Habit[];
  records: HabitRecord[];
  onSelectDate: (date: Date) => void;
}

export function HabitCalendar({ currentMonth, selectedDate, habits, records, onSelectDate }: HabitCalendarProps) {
  const calendarDays = getCalendarDays(currentMonth);
  const weekDays = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div className="w-full">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm opacity-70 font-medium">
            {getDayOfWeek(day)}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const dateStr = formatDate(day);
          const dayData = getDayStats(dateStr, habits, records);
          
          return (
            <CalendarDayCell
              key={index}
              date={day}
              dayData={dayData}
              isToday={checkIsToday(day)}
              isSelected={isSameDayAs(day, selectedDate)}
              isCurrentMonth={checkIsCurrentMonth(day, currentMonth)}
              onClick={() => onSelectDate(day)}
            />
          );
        })}
      </div>
    </div>
  );
}
