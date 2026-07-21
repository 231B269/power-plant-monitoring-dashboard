import { useState } from 'react';
import type { MaintenanceRecord } from '../types';
import { formatDate, priorityColor } from '../lib/format';
import { SectionCard } from '../components/SectionCard';
import { Calendar, CheckCircle2, Clock, Wrench } from 'lucide-react';

interface MaintenanceProps {
  records: MaintenanceRecord[];
}

export function Maintenance({ records }: MaintenanceProps) {
  const [tab, setTab] = useState<'upcoming' | 'completed'>('upcoming');
  const upcoming = records.filter((r) => r.status === 'Upcoming');
  const completed = records.filter((r) => r.status === 'Completed');
  const list = tab === 'upcoming' ? upcoming : completed;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-industrial-500/10 text-industrial-600 dark:text-industrial-300"><Calendar className="h-5 w-5" /></div><div><p className="text-xs uppercase tracking-wide text-slate-400">Upcoming</p><p className="stat-value text-xl font-bold text-slate-900 dark:text-white">{upcoming.length}</p></div></div></div>
        <div className="card p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="h-5 w-5" /></div><div><p className="text-xs uppercase tracking-wide text-slate-400">Completed</p><p className="stat-value text-xl font-bold text-slate-900 dark:text-white">{completed.length}</p></div></div></div>
        <div className="card p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400"><Wrench className="h-5 w-5" /></div><div><p className="text-xs uppercase tracking-wide text-slate-400">Critical Priority</p><p className="stat-value text-xl font-bold text-slate-900 dark:text-white">{records.filter((r) => r.priority === 'Critical').length}</p></div></div></div>
      </div>

      <SectionCard title="Maintenance Schedule" description="Planned and completed work orders" action={
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-white/5">
          <button onClick={() => setTab('upcoming')} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${tab === 'upcoming' ? 'bg-white text-industrial-600 shadow-sm dark:bg-surface-card dark:text-industrial-300' : 'text-slate-500'}`}>Upcoming</button>
          <button onClick={() => setTab('completed')} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${tab === 'completed' ? 'bg-white text-industrial-600 shadow-sm dark:bg-surface-card dark:text-industrial-300' : 'text-slate-500'}`}>Completed</button>
        </div>
      }>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-surface-border">
              <th className="pb-3 pr-4 font-medium">Work Order</th><th className="pb-3 pr-4 font-medium">Equipment</th><th className="pb-3 pr-4 font-medium">Type</th><th className="pb-3 pr-4 font-medium">Engineer</th><th className="pb-3 pr-4 font-medium">Priority</th><th className="pb-3 pr-4 font-medium">{tab === 'upcoming' ? 'Scheduled' : 'Completed'}</th><th className="pb-3 font-medium">Description</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-surface-border">
              {list.map((r) => (
                <tr key={r.id} className="group transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="py-3 pr-4"><span className="font-mono text-xs font-semibold text-industrial-600 dark:text-industrial-300">{r.id}</span></td>
                  <td className="py-3 pr-4"><p className="font-medium text-slate-900 dark:text-white">{r.equipmentName}</p><p className="text-xs text-slate-400">{r.equipmentId}</p></td>
                  <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{r.type}</td>
                  <td className="py-3 pr-4"><div className="flex items-center gap-2"><div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-industrial-500 to-industrial-700 text-[10px] font-bold text-white">{r.assignedEngineer.split(' ').map((n) => n[0]).join('')}</div><span className="text-slate-600 dark:text-slate-300">{r.assignedEngineer}</span></div></td>
                  <td className="py-3 pr-4"><span className={`badge ${priorityColor(r.priority)}`}>{r.priority}</span></td>
                  <td className="py-3 pr-4"><span className="flex items-center gap-1.5 text-xs text-slate-500"><Clock className="h-3 w-3" />{formatDate(tab === 'upcoming' ? r.scheduledDate : (r.completedDate ?? r.scheduledDate))}</span></td>
                  <td className="py-3 max-w-xs text-xs text-slate-500 dark:text-slate-400"><span className="line-clamp-2">{r.description}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <div className="py-10 text-center text-sm text-slate-400">No {tab} maintenance records.</div>}
        </div>
      </SectionCard>
    </div>
  );
}
