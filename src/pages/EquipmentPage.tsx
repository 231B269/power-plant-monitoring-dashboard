import { useState } from 'react';
import type { Equipment } from '../types';
import { formatDate, healthColor } from '../lib/format';
import { HealthRing } from '../components/HealthRing';
import { SectionCard } from '../components/SectionCard';
import { StatusBadge } from '../components/StatusBadge';
import { Gauge, Search, Thermometer, Zap } from 'lucide-react';

interface EquipmentPageProps {
  equipment: Equipment[];
}

function Metric({ label, value, unit }: { label: string; value: number; unit: string }) {
  if (value === 0) return (
    <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-white/5">
      <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="stat-value mt-0.5 text-sm font-semibold text-slate-300 dark:text-slate-600">N/A</p>
    </div>
  );
  return (
    <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-white/5">
      <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="stat-value mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">{value.toLocaleString(undefined, { maximumFractionDigits: 1 })}<span className="ml-1 text-[10px] font-normal text-slate-400">{unit}</span></p>
    </div>
  );
}

export function EquipmentPage({ equipment }: EquipmentPageProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Running' | 'Warning' | 'Offline'>('All');

  const filtered = equipment.filter((e) => {
    const mq = e.name.toLowerCase().includes(query.toLowerCase()) || e.code.toLowerCase().includes(query.toLowerCase());
    const mf = filter === 'All' || e.status === filter;
    return mq && mf;
  });

  return (
    <SectionCard title="Equipment Monitoring" description="Live sensor telemetry across all plant assets" action={
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search equipment…" className="input-field !py-2 pl-9 text-sm" />
      </div>
    }>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {(['All', 'Running', 'Warning', 'Offline'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filter === f ? 'bg-industrial-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'}`}>
            {f}<span className="ml-1.5 opacity-60">{f === 'All' ? equipment.length : equipment.filter((e) => e.status === f).length}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((eq) => (
          <div key={eq.id} className="card card-hover animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-surface-border dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-industrial-500/10 text-industrial-600 dark:text-industrial-300"><Gauge className="h-5 w-5" /></div>
                <div><p className="text-sm font-bold text-slate-900 dark:text-white">{eq.name}</p><p className="text-xs text-slate-500">{eq.code} · {eq.location}</p></div>
              </div>
              <StatusBadge status={eq.status} />
            </div>
            <div className="flex items-center gap-4 p-4">
              <HealthRing value={eq.health} size={80} stroke={7} label="Health" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between text-xs"><span className="text-slate-500">Health</span><span className={`stat-value font-bold ${healthColor(eq.health)}`}>{Math.round(eq.health)}%</span></div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-surface-border">
                  <div className={`h-full rounded-full transition-all duration-700 ${eq.health >= 85 ? 'bg-emerald-500' : eq.health >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${eq.health}%` }} />
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500"><Thermometer className="h-3 w-3" /><span>Last service: {formatDate(eq.lastMaintenance)}</span></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 px-4 pb-4">
              <Metric label="Temp" value={eq.temperature} unit="°C" />
              <Metric label="Pressure" value={eq.pressure} unit="bar" />
              <Metric label="Voltage" value={eq.voltage} unit="kV" />
              <Metric label="Current" value={eq.current} unit="A" />
              <Metric label="RPM" value={eq.rpm} unit="rpm" />
              <Metric label="Load" value={Math.round(eq.health * 8.5)} unit="kW" />
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 text-xs dark:border-surface-border dark:bg-white/5">
              <span className="flex items-center gap-1.5 text-slate-500"><Zap className="h-3 w-3 text-amber-500" />Updated 5s ago</span>
              <span className="font-mono text-slate-400">{eq.id}</span>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">No equipment matches your filters.</div>}
    </SectionCard>
  );
}
