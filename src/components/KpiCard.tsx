import type { ReactNode } from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  accent: 'industrial' | 'emerald' | 'amber' | 'rose' | 'cyan';
  subtitle?: string;
  trend?: { value: string; up: boolean };
}

const ACCENT = {
  industrial: { bg: 'bg-industrial-500/10', text: 'text-industrial-600 dark:text-industrial-300', ring: 'ring-industrial-500/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-500/20' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', ring: 'ring-rose-500/20' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', ring: 'ring-cyan-500/20' },
};

export function KpiCard({ title, value, unit, icon, accent, subtitle, trend }: KpiCardProps) {
  const a = ACCENT[accent];
  return (
    <div className="card card-hover p-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="stat-value text-3xl font-bold text-slate-900 dark:text-white">{value}</span>
            {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
          </div>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.bg} ${a.text} ring-1 ${a.ring}`}>{icon}</div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={`text-xs font-semibold ${trend.up ? 'text-emerald-500' : 'text-rose-500'}`}>{trend.up ? '▲' : '▼'} {trend.value}</span>
          <span className="text-xs text-slate-400">vs last hour</span>
        </div>
      )}
    </div>
  );
}
