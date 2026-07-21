import { Activity, AlertTriangle, FileText, Gauge, LayoutDashboard, Settings, Wrench, Zap } from 'lucide-react';

export type PageId = 'dashboard' | 'equipment' | 'charts' | 'alerts' | 'maintenance' | 'reports' | 'settings';

const NAV: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'equipment', label: 'Equipment', icon: Gauge },
  { id: 'charts', label: 'Charts', icon: Activity },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  active: PageId;
  onNavigate: (id: PageId) => void;
  alertCount: number;
  collapsed: boolean;
}

export function Sidebar({ active, onNavigate, alertCount, collapsed }: SidebarProps) {
  return (
    <aside className={`fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-surface-border dark:bg-surface-card ${collapsed ? 'w-16' : 'w-60'}`}>
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-4 dark:border-surface-border">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-industrial-600 text-white shadow-lg shadow-industrial-600/30">
          <Zap className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold leading-tight text-slate-900 dark:text-white">PowerGrid</p>
            <p className="text-[11px] leading-tight text-slate-500">Monitoring Suite</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)} className={`nav-link w-full ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`} title={item.label}>
              <span className="relative shrink-0">
                <Icon className="h-5 w-5" />
                {item.id === 'alerts' && alertCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{alertCount}</span>
                )}
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
              {isActive && !collapsed && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-industrial-500" />}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3 dark:border-surface-border">
        <div className={`flex items-center gap-2.5 rounded-lg bg-slate-50 p-2.5 dark:bg-white/5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-industrial-500 to-industrial-700 text-xs font-bold text-white">RK</div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">Rohit Kumar</p>
              <p className="truncate text-[10px] text-slate-500">Shift Supervisor</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
