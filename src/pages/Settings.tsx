import { SectionCard } from '../components/SectionCard';
import { Bell, Gauge, Monitor, Shield, Sliders, Zap } from 'lucide-react';

interface SettingsProps {
  dark: boolean;
  onToggleDark: () => void;
  refreshSeconds: number;
}

export function Settings({ dark, onToggleDark, refreshSeconds }: SettingsProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Display Preferences" description="Theme and interface controls">
          <div className="space-y-3">
            <Toggle icon={Monitor} label="Dark Mode" description="Use dark industrial theme for control-room environments" checked={dark} onChange={onToggleDark} />
            <Toggle icon={Bell} label="Alert Sounds" description="Audible chime on critical alerts" checked onChange={() => {}} />
            <Toggle icon={Zap} label="Compact KPIs" description="Reduce KPI card padding for dense layouts" checked={false} onChange={() => {}} />
          </div>
        </SectionCard>
        <SectionCard title="Data Acquisition" description="Sensor polling and telemetry">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3.5 dark:bg-white/5">
              <div className="flex items-center gap-3"><Gauge className="h-5 w-5 text-industrial-500" /><div><p className="text-sm font-medium text-slate-900 dark:text-white">Polling Interval</p><p className="text-xs text-slate-400">Sensor refresh rate</p></div></div>
              <span className="stat-value rounded-lg bg-industrial-500/10 px-3 py-1 text-sm font-semibold text-industrial-600 dark:text-industrial-300">{refreshSeconds}s</span>
            </div>
            <Toggle icon={Sliders} label="Auto-calibration" description="Drift correction on sensor channels" checked onChange={() => {}} />
            <Toggle icon={Shield} label="Redundant Validation" description="Cross-check readings across channels" checked onChange={() => {}} />
          </div>
        </SectionCard>
      </div>
      <SectionCard title="System Information" description="Build and compliance metadata">
        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
          <Info label="Version" value="v3.2.1" /><Info label="SCADA" value="Compatible" /><Info label="Compliance" value="ISO 27001" /><Info label="Uptime" value="99.97%" />
        </div>
      </SectionCard>
    </div>
  );
}

function Toggle({ icon: Icon, label, description, checked, onChange }: { icon: typeof Bell; label: string; description: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3.5 dark:bg-white/5">
      <div className="flex items-center gap-3"><Icon className="h-5 w-5 text-slate-500" /><div><p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p><p className="text-xs text-slate-400">{description}</p></div></div>
      <button onClick={onChange} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-industrial-600' : 'bg-slate-300 dark:bg-surface-border'}`} aria-label={label}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3.5 dark:bg-white/5">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="stat-value mt-1 text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
