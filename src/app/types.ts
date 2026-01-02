export type HabitType = 'good' | 'bad';

export type RecordStatus = 'success' | 'fail';

// Predefined measurement units
export type MeasurementUnit =
  | 'km'        // kilometers
  | 'm'         // meters
  | 'min'       // minutes
  | 'h'         // hours
  | 'kg'        // kilograms
  | 'g'         // grams
  | 'l'         // liters
  | 'ml'        // milliliters
  | 'kcal'      // calories
  | 'reps'      // repetitions
  | 'sets'      // sets
  | 'pages'     // pages (for reading)
  | 'pcs'       // pieces/count
  | 'custom';   // custom unit

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  icon: string;
  note?: string;
  tags: string[];
  createdAt: string;
  // Measurement fields
  measurable: boolean;
  measurementUnit?: MeasurementUnit;
  measurementLabel?: string; // Custom label like "vzdialenosť", "čas", "váha"
  measurementGoal?: number;  // Optional daily goal
  // Secondary measurement (e.g., time for running)
  trackTime?: boolean;
  timeGoal?: number; // Goal in minutes
}

export interface HabitRecord {
  habitId: string;
  date: string; // YYYY-MM-DD
  status: RecordStatus;
  // Measurement value for measurable habits
  measurementValue?: number;
  // Secondary measurement (e.g., time in minutes for running)
  secondaryValue?: number;
  // Notes for this specific record
  note?: string;
}

export interface DayData {
  date: string;
  goodSuccess: number;
  badAvoided: number;
  fail: number;
}

// Helper for measurement units display
export const measurementUnitLabels: Record<MeasurementUnit, string> = {
  km: 'km',
  m: 'm',
  min: 'min',
  h: 'hod',
  kg: 'kg',
  g: 'g',
  l: 'l',
  ml: 'ml',
  kcal: 'kcal',
  reps: 'opak.',
  sets: 'série',
  pages: 'strán',
  pcs: 'ks',
  custom: '',
};

// Common measurement presets
export const measurementPresets = [
  { label: 'Vzdialenosť (km)', unit: 'km' as MeasurementUnit, icon: '🏃', supportsTime: true },
  { label: 'Vzdialenosť (m)', unit: 'm' as MeasurementUnit, icon: '📏', supportsTime: true },
  { label: 'Čas (minúty)', unit: 'min' as MeasurementUnit, icon: '⏱️', supportsTime: false },
  { label: 'Čas (hodiny)', unit: 'h' as MeasurementUnit, icon: '🕐', supportsTime: false },
  { label: 'Hmotnosť (kg)', unit: 'kg' as MeasurementUnit, icon: '⚖️', supportsTime: false },
  { label: 'Objem (litre)', unit: 'l' as MeasurementUnit, icon: '💧', supportsTime: false },
  { label: 'Kalórie', unit: 'kcal' as MeasurementUnit, icon: '🔥', supportsTime: false },
  { label: 'Opakovania', unit: 'reps' as MeasurementUnit, icon: '💪', supportsTime: true },
  { label: 'Série', unit: 'sets' as MeasurementUnit, icon: '🏋️', supportsTime: true },
  { label: 'Strany (čítanie)', unit: 'pages' as MeasurementUnit, icon: '📖', supportsTime: true },
  { label: 'Počet kusov', unit: 'pcs' as MeasurementUnit, icon: '🔢', supportsTime: false },
];
