import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPIStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'green' | 'red' | 'blue' | 'purple';
}

export function KPIStatCard({ title, value, icon: Icon, trend, color = 'blue' }: KPIStatCardProps) {
  const colorClasses = {
    green: 'from-emerald-500/10 to-green-500/10 border-emerald-500/20',
    red: 'from-rose-500/10 to-red-500/10 border-rose-500/20',
    blue: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20',
    purple: 'from-purple-500/10 to-pink-500/10 border-purple-500/20',
  };

  const iconColorClasses = {
    green: 'text-emerald-500',
    red: 'text-rose-500',
    blue: 'text-blue-500',
    purple: 'text-purple-500',
  };

  return (
    <div className={`relative overflow-hidden rounded-xl md:rounded-2xl border bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm p-3 md:p-6 transition-all hover:scale-[1.02] hover:shadow-lg`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm opacity-70 mb-1 md:mb-2 truncate">{title}</p>
          <p className="text-xl md:text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={`p-2 md:p-3 rounded-lg md:rounded-xl bg-white/5 ${iconColorClasses[color]} flex-shrink-0`}>
          <Icon className="w-4 h-4 md:w-6 md:h-6" />
        </div>
      </div>

      {/* Frost glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    </div>
  );
}
