import { useEffect, useMemo, useState } from 'react';
import { Sidebar, type PageId } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Login } from './components/Login';
import { Dashboard } from './pages/Dashboard';
import { EquipmentPage } from './pages/EquipmentPage';
import { Charts } from './pages/Charts';
import { Alerts } from './pages/Alerts';
import { Maintenance } from './pages/Maintenance';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { usePlantData } from './usePlantData';

const PAGE_META: Record<PageId, { title: string; subtitle: string }> = {
  dashboard: { title: 'Control Room Dashboard', subtitle: 'Real-time overview of plant operations' },
  equipment: { title: 'Equipment Monitoring', subtitle: 'Live sensor telemetry across all assets' },
  charts: { title: 'Analytics & Trends', subtitle: 'Historical performance and health analytics' },
  alerts: { title: 'Alerts & Incidents', subtitle: 'Anomaly detection and incident management' },
  maintenance: { title: 'Maintenance Operations', subtitle: 'Work order scheduling and engineer assignment' },
  reports: { title: 'Report Center', subtitle: 'Generate and download operational reports' },
  settings: { title: 'Settings', subtitle: 'System configuration and preferences' },
};

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [page, setPage] = useState<PageId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dark, setDark] = useState(true);
  const plant = usePlantData();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const unackCount = useMemo(() => plant.alerts.filter((a) => !a.acknowledged).length, [plant.alerts]);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  const meta = PAGE_META[page];
  const sidebarWidth = sidebarCollapsed ? 'md:pl-16' : 'md:pl-60';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-surface">
      <Sidebar active={page} onNavigate={setPage} alertCount={unackCount} collapsed={sidebarCollapsed} />
      <div className={`flex min-h-screen flex-col transition-all duration-300 ${sidebarWidth}`}>
        <Topbar title={meta.title} subtitle={meta.subtitle} onToggleSidebar={() => setSidebarCollapsed((c) => !c)} dark={dark} onToggleDark={() => setDark((d) => !d)} alertCount={unackCount} lastUpdate={plant.lastUpdate} onAlertsClick={() => setPage('alerts')} />
        <main className="flex-1 p-4 md:p-5">
          {page === 'dashboard' && <Dashboard equipment={plant.equipment} trend={plant.trend} alertCount={unackCount} onNavigate={setPage} />}
          {page === 'equipment' && <EquipmentPage equipment={plant.equipment} />}
          {page === 'charts' && <Charts trend={plant.trend} equipment={plant.equipment} />}
          {page === 'alerts' && <Alerts alerts={plant.alerts} onAcknowledge={plant.acknowledgeAlert} onAcknowledgeAll={plant.acknowledgeAll} />}
          {page === 'maintenance' && <Maintenance records={plant.maintenance} />}
          {page === 'reports' && <Reports equipment={plant.equipment} maintenance={plant.maintenance} alerts={plant.alerts} trend={plant.trend} />}
          {page === 'settings' && <Settings dark={dark} onToggleDark={() => setDark((d) => !d)} refreshSeconds={5} />}
        </main>
      </div>
    </div>
  );
}
