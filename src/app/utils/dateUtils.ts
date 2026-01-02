import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, parseISO, subDays } from 'date-fns';
import { sk } from 'date-fns/locale';

export const formatDate = (date: Date, formatStr: string = 'yyyy-MM-dd') => {
  return format(date, formatStr, { locale: sk });
};

export const formatDisplayDate = (date: Date) => {
  return format(date, "EEEE, d. MMMM yyyy", { locale: sk });
};

export const getCalendarDays = (currentDate: Date) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = calendarStart;

  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  return days;
};

export const getLast30Days = (endDate: Date = new Date()) => {
  const days: Date[] = [];
  for (let i = 29; i >= 0; i--) {
    days.push(subDays(endDate, i));
  }
  return days;
};

export const isToday = (date: Date) => {
  return isSameDay(date, new Date());
};

export const isSameDayAs = (date1: Date, date2: Date) => {
  return isSameDay(date1, date2);
};

export const isCurrentMonth = (date: Date, currentMonth: Date) => {
  return isSameMonth(date, currentMonth);
};

export const getMonthName = (date: Date) => {
  return format(date, 'LLLL yyyy', { locale: sk });
};

export const getDayOfWeek = (dayIndex: number) => {
  const days = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
  return days[dayIndex];
};
