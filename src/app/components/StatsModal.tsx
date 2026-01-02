import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Habit, HabitRecord } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getLast30Days, formatDate } from '../utils/dateUtils';
import { getDayStats, calculateStreak, calculateSuccessRate } from '../utils/habitStats';
import { motion } from 'motion/react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  habits: Habit[];
  records: HabitRecord[];
}

export function StatsModal({ isOpen, onClose, habits, records }: StatsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Trend data - last 30 days
  const last30Days = getLast30Days();
  const trendData = last30Days.map(day => {
    const dateStr = formatDate(day);
    const stats = getDayStats(dateStr, habits, records);
    return {
      date: formatDate(day, 'd.M'),
      success: stats.goodSuccess + stats.badAvoided,
      fail: stats.fail,
    };
  });

  // Weekly data - last 4 weeks
  const weeklyData = [];
  for (let i = 0; i < 4; i++) {
    const weekEnd = 29 - (i * 7);
    const weekStart = weekEnd - 6;
    let weekSuccess = 0;
    let weekFail = 0;
    
    for (let j = weekStart; j <= weekEnd; j++) {
      if (j >= 0 && j < trendData.length) {
        weekSuccess += trendData[j].success;
        weekFail += trendData[j].fail;
      }
    }
    
    weeklyData.unshift({
      week: `Týždeň ${4 - i}`,
      success: weekSuccess,
      fail: weekFail,
    });
  }

  // Consistency pie data
  const totalRecords = records.filter(r => {
    const startDate = formatDate(last30Days[0]);
    return r.date >= startDate;
  });
  
  const successCount = totalRecords.filter(r => r.status === 'success').length;
  const failCount = totalRecords.filter(r => r.status === 'fail').length;
  
  const consistencyData = [
    { name: 'Úspechy', value: successCount, color: '#10b981' },
    { name: 'Neúspechy', value: failCount, color: '#ef4444' },
  ];

  // Per habit data
  const habitStats = habits.map(habit => ({
    habit,
    streak: calculateStreak(habit.id, records),
    successRate: calculateSuccessRate(habit.id, records),
    totalRecords: records.filter(r => r.habitId === habit.id).length,
  })).sort((a, b) => b.successRate - a.successRate);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <DialogHeader>
          <DialogTitle>Pokročilé štatistiky</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Prehľad</TabsTrigger>
            <TabsTrigger value="habits">Podľa návykov</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Trend chart */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
              <h3 className="font-semibold mb-4">Trend úspešnosti (30 dní)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="currentColor" opacity={0.7} />
                  <YAxis stroke="currentColor" opacity={0.7} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} name="Úspechy" />
                  <Line type="monotone" dataKey="fail" stroke="#ef4444" strokeWidth={2} name="Neúspechy" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weekly bar chart */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <h3 className="font-semibold mb-4">Týždne</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="week" stroke="currentColor" opacity={0.7} />
                    <YAxis stroke="currentColor" opacity={0.7} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="success" fill="#10b981" name="Úspechy" />
                    <Bar dataKey="fail" fill="#ef4444" name="Neúspechy" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Consistency donut */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
                <h3 className="font-semibold mb-4">Konzistentnosť</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={consistencyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {consistencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="habits" className="space-y-4 mt-6">
            {habitStats.length === 0 ? (
              <div className="text-center py-12 opacity-70">
                <p>Zatiaľ nemáte žiadne návyky</p>
              </div>
            ) : (
              habitStats.map((stat, index) => (
                <motion.div
                  key={stat.habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl border ${
                    stat.habit.type === 'good'
                      ? 'bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20'
                      : 'bg-gradient-to-br from-rose-500/10 to-red-500/10 border-rose-500/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      stat.habit.type === 'good' ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                    }`}>
                      {stat.habit.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold">{stat.habit.name}</h4>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="px-2 py-1 rounded bg-white/10">
                          Streak: <strong>{stat.streak}</strong>
                        </span>
                        <span className="px-2 py-1 rounded bg-white/10">
                          Úspešnosť: <strong>{stat.successRate}%</strong>
                        </span>
                        <span className="px-2 py-1 rounded bg-white/10">
                          Záznamy: <strong>{stat.totalRecords}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Mini progress bar */}
                    <div className="w-32">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${stat.habit.type === 'good' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                          style={{ width: `${stat.successRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
