import type { EquipmentStatus, AlertSeverity } from '../types';

export function statusColor(status: EquipmentStatus): { bg: string; text: string; dot: string } {
  switch (status) {
    case 'Running': return { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' };
    case 'Warning': return { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' };
    case 'Offline': return { bg: 'bg-slate-500/10', text: 'text-slate-500 dark:text-slate-400', dot: 'bg-slate-400' };
  }
}

export function severityColor(severity: AlertSeverity): { bg: string; text: string; border: string } {
  switch (severity) {
    case 'critical': return { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/30' };
    case 'warning': return { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30' };
    case 'info': return { bg: 'bg-industrial-500/10', text: 'text-industrial-600 dark:text-industrial-300', border: 'border-industrial-500/30' };
  }
}

export function priorityColor(priority: string): string {
  switch (priority) {
    case 'Critical': return 'bg-rose-500/15 text-rose-600 dark:text-rose-400';
    case 'High': return 'bg-amber-500/15 text-amber-600 dark:text-amber-400';
    case 'Medium': return 'bg-industrial-500/15 text-industrial-600 dark:text-industrial-300';
    case 'Low': return 'bg-slate-500/15 text-slate-500 dark:text-slate-400';
    default: return 'bg-slate-500/15 text-slate-500';
  }
}

export function healthColor(health: number): string {
  if (health >= 85) return 'text-emerald-500';
  if (health >= 70) return 'text-amber-500';
  return 'text-rose-500';
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}
