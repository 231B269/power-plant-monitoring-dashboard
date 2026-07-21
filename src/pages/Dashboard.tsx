import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Equipment, TrendPoint } from '../types';
import { statusColor } from '../lib/format';
import { KpiCard } from '../components/KpiCard';
import { SectionCard } from '../components/SectionCard';
import { HealthRing } from '../components/HealthRing';
import { StatusBadge } from '../components/StatusBadge';
import { Activity, AlertTriangle, Gauge, Thermometer, TrendingUp, Zap } from 'lucide-react';

const TS = { backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(51,65,85,0.8)', borderRadius: '8px', fontSize: '12px', color: '#e2e8f0' };

interface DashboardProps {
  equipment: Equipment[];
  trend: TrendPoint[];
  alertCount: number;
  onNavigate: (id: 'equipment' | 'alerts' | 'charts' | 'maintenance') => void;
}

export function Dashboard({ equipment, trend, alertCount, onNavigate }: DashboardProps) {
  const total = equipment.length;
  const running = equipment.filter((e) => e.status === 'Running').length;
  const faulty = equipment.filter((e) => e.status !== 'Running').length;
  const energy = trend[trend.length - 1]?.energy ?? 0;
  const avgHealth = Math.round(equipment.reduce((s, e) => s + e.health, 0) / total);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard title="Total Equipment" value={total} icon={<Gauge className="h-5 w-5" />} accent="industrial" subtitle="Monitored assets" />
        <KpiCard title="Running" value={running} icon={<Activity className="h-5 w-5" />} accent="emerald" subtitle={`${Math.round((running / total) * 100)}% availability`} />
        <KpiCard title="Faulty / Warning" value={faulty} icon={<AlertTriangle className="h-5 w-5" />} accent="amber" subtitle="Needs attention" />
        <KpiCard title="Active Alerts" value={alertCount} icon={<AlertTriangle className="h-5 w-5" />} accent="rose" subtitle="Unacknowledged" />
        <KpiCard title="Power Generation" value={energy} unit="MW" icon={<Zap className="h-5 w-5" />} accent="cyan" trend={{ value: '2.4%', up: true }} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Energy Generation" description="Real-time MW output · last 24h" className="lg:col-span-2" action={<TrendingUp className="h-4 w-4 text-slate-400" />}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} /><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TS} />
                <Area type="monotone" dataKey="energy" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#eg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="System Health" description="Aggregate equipment health">
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <HealthRing value={avgHealth} size={140} stroke={10} label="Health" />
            <div className="grid w-full grid-cols-3 gap-2 text-center">
              <div><p className="stat-value text-lg font-bold text-emerald-500">{equipment.filter((e) => e.health >= 85).length}</p><p className="text-[10px] uppercase text-slate-400">Optimal</p></div>
              <div><p className="stat-value text-lg font-bold text-amber-500">{equipment.filter((e) => e.health >= 70 && e.health < 85).length}</p><p className="text-[10px] uppercase text-slate-400">Fair</p></div>
              <div><p className="stat-value text-lg font-bold text-rose-500">{equipment.filter((e) => e.health < 70).length}</p><p className="text-[10px] uppercase text-slate-400">Poor</p></div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Temperature Trend" description="Avg equipment temperature (°C)">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TS} />
                <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
        <SectionCard title="Pressure Trend" description="Avg system pressure (bar)">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TS} />
                <Line type="monotone" dataKey="pressure" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Equipment Status" description="Live operating condition" action={<button onClick={() => onNavigate('equipment')} className="btn-ghost text-xs">View all →</button>}>
          <div className="space-y-2.5">
            {equipment.map((eq) => {
              const c = statusColor(eq.status);
              return (
                <div key={eq.id} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50 dark:border-surface-border dark:hover:bg-white/5">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.bg} ${c.text}`}><Thermometer className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{eq.name}</p>
                    <p className="truncate text-xs text-slate-500">{eq.code} · {eq.location}</p>
                  </div>
                  <StatusBadge status={eq.status} />
                </div>
              );
            })}
          </div>
        </SectionCard>
        <SectionCard title="Equipment Health" description="Per-asset health score" action={<button onClick={() => onNavigate('charts')} className="btn-ghost text-xs">Analytics →</button>}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={equipment.map((e) => ({ name: e.code, health: Math.round(e.health) }))} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} angle={-25} textAnchor="end" height={50} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TS} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
                <Bar dataKey="health" radius={[6, 6, 0, 0]}>{equipment.map((e) => <Cell key={e.id} fill={e.health >= 85 ? '#10b981' : e.health >= 70 ? '#f59e0b' : '#f43f5e'} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
