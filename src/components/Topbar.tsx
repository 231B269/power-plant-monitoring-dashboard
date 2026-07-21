import { Bell, Menu, Moon, Sun } from 'lucide-react';

interface TopbarProps {
  title: string;
  subtitle: string;
  onToggleSidebar: () => void;
  dark: boolean;
  onToggleDark: () => void;
  alertCount: number;
  lastUpdate: Date;
  onAlertsClick: () => void;
}

export function Topbar({ title, subtitle, onToggleSidebar, dark, onToggleDark, alertCount, lastUpdate, onAlertsClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-surface-border dark:bg-surface/80">
      <button onClick={onToggleSidebar} className="btn-ghost !p-2" aria-label="Toggle sidebar">
        <Menu className="h-5 w-5" />
      </button>
      <div className="min-w-0">
        <h1 className="truncate text-base font-bold text-slate-900 dark:text-white">{title}</h1>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-500 dark:bg-white/5 md:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono">Live · {lastUpdate.toLocaleTimeString()}</span>
        </div>
        <button onClick={onAlertsClick} className="relative btn-ghost !p-2" aria-label="Alerts">
          <Bell className="h-5 w-5" />
          {alertCount > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{alertCount}</span>}
        </button>
        <button onClick={onToggleDark} className="btn-ghost !p-2" aria-label="Toggle theme">
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}
