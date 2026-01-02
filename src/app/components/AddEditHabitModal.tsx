import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Habit, HabitType, MeasurementUnit, measurementPresets, measurementUnitLabels } from '../types';
import { Ruler, ToggleLeft, Clock } from 'lucide-react';

const EMOJI_OPTIONS = [
  '💪', '🏃', '📚', '🧘', '💧', '🥗', '😴', '✍️',
  '🎯', '🌱', '🚴', '🎨', '🎵', '💼', '🧠', '❤️',
  '🚬', '🍔', '📱', '🎮', '🍺', '☕', '🍰', '🛋️',
  '💤', '📺', '🍕', '🎰', '💸', '😤', '🎪', '🔥'
];

interface AddEditHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Habit) => void;
  editingHabit?: Habit | null;
}

export function AddEditHabitModal({ isOpen, onClose, onSave, editingHabit }: AddEditHabitModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<HabitType>('good');
  const [icon, setIcon] = useState('💪');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');
  const [measurable, setMeasurable] = useState(false);
  const [measurementUnit, setMeasurementUnit] = useState<MeasurementUnit>('km');
  const [measurementGoal, setMeasurementGoal] = useState<string>('');
  const [trackTime, setTrackTime] = useState(false);
  // Time goal in H:M:S format
  const [timeGoalH, setTimeGoalH] = useState<string>('');
  const [timeGoalM, setTimeGoalM] = useState<string>('');
  const [timeGoalS, setTimeGoalS] = useState<string>('');

  // Helper to convert seconds to H:M:S
  const secondsToHMS = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    return { h, m, s };
  };

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setType(editingHabit.type);
      setIcon(editingHabit.icon);
      setNote(editingHabit.note || '');
      setTags(editingHabit.tags.join(', '));
      setMeasurable(editingHabit.measurable || false);
      setMeasurementUnit(editingHabit.measurementUnit || 'km');
      setMeasurementGoal(editingHabit.measurementGoal?.toString() || '');
      setTrackTime(editingHabit.trackTime || false);
      // Convert timeGoal from seconds to H:M:S
      if (editingHabit.timeGoal) {
        const { h, m, s } = secondsToHMS(editingHabit.timeGoal);
        setTimeGoalH(h > 0 ? h.toString() : '');
        setTimeGoalM(m > 0 ? m.toString() : '');
        setTimeGoalS(s > 0 ? s.toString() : '');
      } else {
        setTimeGoalH('');
        setTimeGoalM('');
        setTimeGoalS('');
      }
    } else {
      setName('');
      setType('good');
      setIcon('💪');
      setNote('');
      setTags('');
      setMeasurable(false);
      setMeasurementUnit('km');
      setMeasurementGoal('');
      setTrackTime(false);
      setTimeGoalH('');
      setTimeGoalM('');
      setTimeGoalS('');
    }
  }, [editingHabit, isOpen]);

  // Check if current unit supports time tracking
  const currentPreset = measurementPresets.find(p => p.unit === measurementUnit);
  const supportsTime = currentPreset?.supportsTime || false;

  const handleSave = () => {
    if (!name.trim()) return;

    // Convert H:M:S to total seconds for timeGoal
    const timeGoalSeconds = (parseInt(timeGoalH || '0') * 3600) +
                           (parseInt(timeGoalM || '0') * 60) +
                           parseInt(timeGoalS || '0');

    const habit: Habit = {
      id: editingHabit?.id || Date.now().toString(),
      name: name.trim(),
      type,
      icon,
      note: note.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: editingHabit?.createdAt || new Date().toISOString(),
      measurable,
      measurementUnit: measurable ? measurementUnit : undefined,
      measurementGoal: measurable && measurementGoal ? parseFloat(measurementGoal) : undefined,
      trackTime: measurable && supportsTime ? trackTime : undefined,
      timeGoal: measurable && trackTime && timeGoalSeconds > 0 ? timeGoalSeconds : undefined,
    };

    onSave(habit);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-white/20">
        <DialogHeader>
          <DialogTitle>{editingHabit ? 'Upraviť návyk' : 'Pridať návyk'}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Názov návyku</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Napríklad: Beh, Cvičenie, Čítanie..."
              className="bg-white/50 dark:bg-black/20"
            />
          </div>

          {/* Type selector */}
          <div className="space-y-2">
            <Label>Typ návyku</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('good')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  type === 'good'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                    : 'bg-white/50 dark:bg-white/5 hover:bg-emerald-500/20'
                }`}
              >
                ✅ Dobrý návyk
              </button>
              <button
                type="button"
                onClick={() => setType('bad')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  type === 'bad'
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/50'
                    : 'bg-white/50 dark:bg-white/5 hover:bg-rose-500/20'
                }`}
              >
                ❌ Zlý návyk
              </button>
            </div>
          </div>

          {/* Measurable toggle */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  {measurable ? <Ruler className="w-5 h-5 text-indigo-500" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                </div>
                <div>
                  <p className="font-semibold">Merateľný návyk</p>
                  <p className="text-sm opacity-70">
                    {measurable
                      ? 'Sleduj hodnoty ako km, min, kg...'
                      : 'Jednoduchý áno/nie návyk'}
                  </p>
                </div>
              </div>
              <Switch
                checked={measurable}
                onCheckedChange={setMeasurable}
              />
            </div>

            {/* Measurement options */}
            {measurable && (
              <div className="mt-4 pt-4 border-t border-indigo-500/20 space-y-4">
                <div className="space-y-2">
                  <Label>Jednotka merania</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {measurementPresets.map(preset => (
                      <button
                        key={preset.unit}
                        type="button"
                        onClick={() => setMeasurementUnit(preset.unit)}
                        className={`p-2 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                          measurementUnit === preset.unit
                            ? 'bg-indigo-500 text-white shadow-lg'
                            : 'bg-white/50 dark:bg-white/5 hover:bg-indigo-500/20'
                        }`}
                      >
                        <span className="text-lg">{preset.icon}</span>
                        <span className="text-xs">{measurementUnitLabels[preset.unit]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Denný cieľ (voliteľné)</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="goal"
                      type="number"
                      value={measurementGoal}
                      onChange={(e) => setMeasurementGoal(e.target.value)}
                      placeholder="napr. 5"
                      className="bg-white/50 dark:bg-black/20 w-32"
                    />
                    <span className="text-lg font-medium opacity-70">
                      {measurementUnitLabels[measurementUnit]}
                    </span>
                  </div>
                  <p className="text-xs opacity-50">
                    Nastav si denný cieľ pre lepšie sledovanie pokroku
                  </p>
                </div>

                {/* Time tracking option */}
                {supportsTime && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-semibold">Sledovať aj čas</p>
                          <p className="text-sm opacity-70">
                            Zaznamenávaj čas trvania aktivity
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={trackTime}
                        onCheckedChange={setTrackTime}
                      />
                    </div>

                    {trackTime && (
                      <div className="mt-4 pt-4 border-t border-blue-500/20">
                        <Label>Časový cieľ (voliteľné)</Label>
                        <div className="flex gap-2 items-center mt-2">
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={timeGoalH}
                              onChange={(e) => setTimeGoalH(e.target.value)}
                              placeholder="0"
                              className="bg-white/50 dark:bg-black/20 w-16 text-center"
                              min="0"
                            />
                            <span className="text-sm font-medium opacity-70">h</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={timeGoalM}
                              onChange={(e) => setTimeGoalM(e.target.value)}
                              placeholder="0"
                              className="bg-white/50 dark:bg-black/20 w-16 text-center"
                              min="0"
                              max="59"
                            />
                            <span className="text-sm font-medium opacity-70">m</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={timeGoalS}
                              onChange={(e) => setTimeGoalS(e.target.value)}
                              placeholder="0"
                              className="bg-white/50 dark:bg-black/20 w-16 text-center"
                              min="0"
                              max="59"
                            />
                            <span className="text-sm font-medium opacity-70">s</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Icon picker */}
          <div className="space-y-2">
            <Label>Ikona</Label>
            <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto p-2 bg-white/30 dark:bg-black/10 rounded-xl">
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`aspect-square text-2xl rounded-lg transition-all ${
                    icon === emoji
                      ? 'bg-indigo-500 shadow-lg shadow-indigo-500/50 scale-110'
                      : 'bg-white/50 dark:bg-white/5 hover:bg-indigo-500/20'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Poznámka (voliteľné)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Dôvod, motivácia, alebo poznámka..."
              rows={2}
              className="bg-white/50 dark:bg-black/20"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Štítky (oddelené čiarkou)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="zdravie, ranná rutina, šport"
              className="bg-white/50 dark:bg-black/20"
            />
          </div>

          {/* Preview */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-white/50 to-white/20 dark:from-white/5 dark:to-white/10 border border-white/20">
            <p className="text-sm opacity-70 mb-2">Náhľad</p>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                type === 'good' ? 'bg-emerald-500/20' : 'bg-rose-500/20'
              }`}>
                {icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{name || 'Názov návyku'}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    type === 'good'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                  }`}>
                    {type === 'good' ? 'Dobrý' : 'Zlý'}
                  </span>
                  {measurable && (
                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                      📏 Merateľný ({measurementUnitLabels[measurementUnit]})
                    </span>
                  )}
                  {trackTime && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                      ⏱️ + Čas
                    </span>
                  )}
                  {!measurable && (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-600 dark:text-gray-400">
                      ✓/✗ Áno/Nie
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Zrušiť
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-indigo-500 hover:bg-indigo-600">
            {editingHabit ? 'Uložiť' : 'Pridať návyk'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
