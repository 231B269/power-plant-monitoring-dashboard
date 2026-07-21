interface StatusBadgeProps {
  status: 'Running' | 'Warning' | 'Offline';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = { Running: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', Warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400', Offline: 'bg-slate-500/15 text-slate-500 dark:text-slate-400' };
  const dot = { Running: 'bg-emerald-500', Warning: 'bg-amber-500', Offline: 'bg-slate-400' };
  return (
    <span className={`badge ${styles[status]}`}>
      <span className={`relative flex h-2 w-2 status-dot ${dot[status]} status-${status.toLowerCase()}`}>
        <span className={`inline-block h-2 w-2 rounded-full ${dot[status]}`} />
      </span>
      {status}
    </span>
  );
}
