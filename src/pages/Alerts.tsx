import { useState } from 'react';
import type { AlertItem } from '../types';
import { severityColor, timeAgo } from '../lib/format';
import { SectionCard } from '../components/SectionCard';
import { AlertOctagon, AlertTriangle, CheckCheck, Info, ShieldAlert, Wrench } from 'lucide-react';

interface AlertsProps {
  alerts: AlertItem[];
  onAcknowledge: (id: string) => void;
  onAcknowledgeAll: () => void;
}

const alertIcon = (type: AlertItem['type']) => {
  switch (type) {
    case 'High Temperature': return <AlertTriangle className="h-4 w-4" />;
    case 'Low Pressure': return <AlertOctagon className="h-4 w-4" />;
    case 'Over Voltage': return <AlertTriangle className="h-4 w-4" />;
    case 'Pump Failure': return <Wrench className="h-4 w-4" />;
    case 'Generator Fault': return <ShieldAlert className="h-4 w-4" />;
  }
};

export function Alerts({ alerts, onAcknowledge, onAcknowledgeAll }: AlertsProps) {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'unack'>('all');
  const filtered = alerts.filter((a) => filter === 'critical' ? a.severity === 'critical' : filter === 'warning' ? a.severity === 'warning' : filter === 'unack' ? !a.acknowledged : true);
  const unack = alerts.filter((a) => !a.acknowledged).length;
  const critical = alerts.filter((a) => a.severity === 'critical').length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="card p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Total</p><p className="stat-value mt-1 text-2xl font-bold text-slate-900 dark:text-white">{alerts.length}</p></div>
        <div className="card p-4"><p className="text-xs uppercase tracking-wide text-rose-400">Critical</p><p className="stat-value mt-1 text-2xl font-bold text-rose-500">{critical}</p></div>
        <div className="card p-4"><p className="text-xs uppercase tracking-wide text-amber-400">Warnings</p><p className="stat-value mt-1 text-2xl font-bold text-amber-500">{alerts.filter((a) => a.severity === 'warning').length}</p></div>
        <div className="card p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Unacknowledged</p><p className="stat-value mt-1 text-2xl font-bold text-industrial-500">{unack}</p></div>
      </div>

      <SectionCard title="Active Alerts Log" description="Real-time anomaly detection from sensor thresholds" action={
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {(['all', 'critical', 'warning', 'unack'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-industrial-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'}`}>{f === 'unack' ? 'Unack' : f}</button>
            ))}
          </div>
          <button onClick={onAcknowledgeAll} className="btn-ghost text-xs" disabled={unack === 0}><CheckCheck className="h-3.5 w-3.5" />Ack all</button>
        </div>
      }>
        <div className="space-y-2.5">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center"><Info className="mb-2 h-8 w-8 text-emerald-400" /><p className="text-sm font-medium text-slate-500">No active alerts — all systems nominal.</p></div>
          )}
          {filtered.map((alert) => {
            const c = severityColor(alert.severity);
            return (
              <div key={alert.id} className={`flex items-center gap-3 rounded-lg border ${c.border} ${c.bg} p-3.5 animate-slide-in`}>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${c.bg} ${c.text}`}>{alertIcon(alert.type)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{alert.type}</p>
                    <span className={`badge ${c.bg} ${c.text} !py-0.5 !text-[10px]`}>{alert.severity}</span>
                    {alert.acknowledged && <span className="badge bg-slate-500/10 text-slate-500 !py-0.5 !text-[10px]">Acknowledged</span>}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-600 dark:text-slate-300">{alert.message}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{alert.equipmentName} · Value {alert.value.toFixed(1)} / threshold {alert.threshold} · {timeAgo(alert.timestamp)}</p>
                </div>
                {!alert.acknowledged && <button onClick={() => onAcknowledge(alert.id)} className="btn-ghost shrink-0 text-xs"><CheckCheck className="h-3.5 w-3.5" />Ack</button>}
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
