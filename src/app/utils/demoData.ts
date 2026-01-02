import { Habit, HabitRecord } from '../types';
import { formatDate, getLast30Days } from './dateUtils';

export const demoHabits: Habit[] = [
  {
    id: '1',
    name: 'Ranné cvičenie',
    type: 'good',
    icon: '💪',
    note: 'Minimálne 30 minút kardio alebo posilňovanie',
    tags: ['zdravie', 'ranná rutina', 'šport'],
    createdAt: '2025-12-15T08:00:00.000Z',
  },
  {
    id: '2',
    name: 'Čítanie kníh',
    type: 'good',
    icon: '📚',
    note: 'Aspoň 20 strán denne pre rozvoj mysle',
    tags: ['vzdelávanie', 'večerná rutina'],
    createdAt: '2025-12-18T20:00:00.000Z',
  },
  {
    id: '3',
    name: 'Meditácia',
    type: 'good',
    icon: '🧘',
    note: '10-15 minút rannej meditácie pre duševný pokoj',
    tags: ['zdravie', 'mindfulness', 'ranná rutina'],
    createdAt: '2025-12-20T07:00:00.000Z',
  },
  {
    id: '4',
    name: 'Pitie vody',
    type: 'good',
    icon: '💧',
    note: '2 litre vody denne pre hydratáciu',
    tags: ['zdravie'],
    createdAt: '2025-12-22T09:00:00.000Z',
  },
  {
    id: '5',
    name: 'Fajčenie',
    type: 'bad',
    icon: '🚬',
    note: 'Úplne sa vyvarovať cigaretám',
    tags: ['zdravie', 'závislosť'],
    createdAt: '2025-12-10T10:00:00.000Z',
  },
  {
    id: '6',
    name: 'Fast food',
    type: 'bad',
    icon: '🍔',
    note: 'Vyhýbať sa nezdravému jedlu',
    tags: ['zdravie', 'strava'],
    createdAt: '2025-12-12T12:00:00.000Z',
  },
  {
    id: '7',
    name: 'Prílišné používanie telefónu',
    type: 'bad',
    icon: '📱',
    note: 'Obmedziť čas na sociálnych sieťach pod 1 hodinu',
    tags: ['produktivita', 'technológia'],
    createdAt: '2025-12-14T15:00:00.000Z',
  },
  {
    id: '8',
    name: 'Gratulačný denník',
    type: 'good',
    icon: '✍️',
    note: 'Zapísať 3 veci za ktoré som vďačný',
    tags: ['mindfulness', 'večerná rutina'],
    createdAt: '2025-12-25T21:00:00.000Z',
  },
];

export const generateDemoRecords = (): HabitRecord[] => {
  const records: HabitRecord[] = [];
  const last30Days = getLast30Days();

  demoHabits.forEach(habit => {
    const habitCreatedDate = new Date(habit.createdAt);
    
    last30Days.forEach((day, index) => {
      // Only create records for days after habit was created
      if (day < habitCreatedDate) return;

      const dateStr = formatDate(day);
      const random = Math.random();

      // Good habits: 70% success rate, increasing over time
      if (habit.type === 'good') {
        const baseSuccessRate = 0.5 + (index / last30Days.length) * 0.3; // 50% to 80%
        
        if (random < baseSuccessRate) {
          records.push({
            habitId: habit.id,
            date: dateStr,
            status: 'success',
          });
        } else if (random < baseSuccessRate + 0.2) {
          records.push({
            habitId: habit.id,
            date: dateStr,
            status: 'fail',
          });
        }
        // Otherwise no record for this day
      }
      
      // Bad habits: 60% avoided (success), decreasing failures over time
      if (habit.type === 'bad') {
        const baseAvoidRate = 0.4 + (index / last30Days.length) * 0.3; // 40% to 70%
        
        if (random < baseAvoidRate) {
          records.push({
            habitId: habit.id,
            date: dateStr,
            status: 'success', // Avoided the bad habit
          });
        } else if (random < baseAvoidRate + 0.25) {
          records.push({
            habitId: habit.id,
            date: dateStr,
            status: 'fail', // Did the bad habit
          });
        }
      }
    });
  });

  return records;
};

export const loadDemoData = () => {
  const hasExistingData = localStorage.getItem('ledovac_habits');
  
  if (!hasExistingData) {
    localStorage.setItem('ledovac_habits', JSON.stringify(demoHabits));
    localStorage.setItem('ledovac_records', JSON.stringify(generateDemoRecords()));
    return true;
  }
  
  return false;
};
