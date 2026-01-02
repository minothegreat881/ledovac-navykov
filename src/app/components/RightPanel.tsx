import React from 'react';
import { Habit, HabitRecord } from '../types';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getLast30Days, formatDate } from '../utils/dateUtils';
import { getDayStats } from '../utils/habitStats';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, AlertTriangle } from 'lucide-react';

interface RightPanelProps {
  habits: Habit[];
  records: HabitRecord[];
}

export function RightPanel({ habits, records }: RightPanelProps) {
  const last30Days = getLast30Days();
  
  // Trend data
  const trendData = last30Days.slice(-14).map(day => {
    const dateStr = formatDate(day);
    const stats = getDayStats(dateStr, habits, records);
    return {
      date: formatDate(day, 'd.M'),
      success: stats.goodSuccess + stats.badAvoided,
      fail: stats.fail,
    };
  });

  // Weekly data
  const weeklyData = [];
  for (let i = 0; i < 4; i++) {
    const weekEnd = 29 - (i * 7);
    const weekStart = weekEnd - 6;
    let weekSuccess = 0;
    let weekFail = 0;
    
    const fullTrendData = last30Days.map(day => {
      const dateStr = formatDate(day);
      const stats = getDayStats(dateStr, habits, records);
      return {
        success: stats.goodSuccess + stats.badAvoided,
        fail: stats.fail,
      };
    });
    
    for (let j = weekStart; j <= weekEnd; j++) {
      if (j >= 0 && j < fullTrendData.length) {
        weekSuccess += fullTrendData[j].success;
        weekFail += fullTrendData[j].fail;
      }
    }
    
    weeklyData.unshift({
      week: `T${4 - i}`,
      success: weekSuccess,
      fail: weekFail,
    });
  }

  // Consistency data
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

  // Critical bad habits (most failures)
  const badHabits = habits.filter(h => h.type === 'bad');
  const criticalHabits = badHabits
    .map(habit => {
      const failCount = records.filter(r => {
        const startDate = formatDate(last30Days[0]);
        return r.habitId === habit.id && r.date >= startDate && r.status === 'fail';
      }).length;
      return { habit, failCount };
    })
    .filter(h => h.failCount > 0)
    .sort((a, b) => b.failCount - a.failCount)
    .slice(0, 3);

  return (
    <aside className="w-[320px] h-screen sticky top-0 border-l border-white/10 bg-gradient-to-b from-white/50 to-white/20 dark:from-gray-900/50 dark:to-gray-900/20 backdrop-blur-sm overflow-y-auto">
      <div className="p-6 space-y-6">
        <h2 className="font-bold flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Insights
        </h2>

        {/* Trend Chart */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <h3 className="font-semibold text-sm">Trend (14 dní)</h3>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="currentColor" opacity={0.5} style={{ fontSize: '10px' }} />
              <YAxis stroke="currentColor" opacity={0.5} style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="fail" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Bar Chart */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-purple-500" />
            <h3 className="font-semibold text-sm">Týždne</h3>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="week" stroke="currentColor" opacity={0.5} style={{ fontSize: '10px' }} />
              <YAxis stroke="currentColor" opacity={0.5} style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Bar dataKey="success" fill="#10b981" />
              <Bar dataKey="fail" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Consistency Donut */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-3">
            <PieChartIcon className="w-4 h-4 text-emerald-500" />
            <h3 className="font-semibold text-sm">Konzistentnosť</h3>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={consistencyData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
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
                  fontSize: '12px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Úspechy</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Neúspechy</span>
            </div>
          </div>
        </div>

        {/* Critical Bad Habits */}
        {criticalHabits.length > 0 && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-rose-500/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="font-semibold text-sm">Kritické zlozvyky</h3>
            </div>
            <div className="space-y-2">
              {criticalHabits.map(({ habit, failCount }) => (
                <div key={habit.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/10">
                  <div className="text-lg">{habit.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{habit.name}</p>
                    <p className="text-xs opacity-70">{failCount} neúspechov</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs opacity-70 mt-3 italic">
              💡 Skúste náhradnú aktivitu
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
