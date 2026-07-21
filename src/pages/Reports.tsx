import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AlertItem, Equipment, MaintenanceRecord, TrendPoint } from '../types';
import { formatDate } from '../lib/format';
import { SectionCard } from '../components/SectionCard';
import { Download, FileBarChart, FileText, FileWarning } from 'lucide-react';

interface ReportsProps {
  equipment: Equipment[];
  maintenance: MaintenanceRecord[];
  alerts: AlertItem[];
  trend: TrendPoint[];
}

type ReportType = 'equipment' | 'maintenance' | 'alerts' | 'summary';

const META: Record<ReportType, { title: string; description: string; icon: typeof FileText }> = {
  equipment: { title: 'Equipment Status Report', description: 'Full sensor telemetry snapshot of all assets', icon: FileBarChart },
  maintenance: { title: 'Maintenance Log Report', description: 'Scheduled and completed work orders', icon: FileText },
  alerts: { title: 'Alerts & Incidents Report', description: 'All active and acknowledged alerts', icon: FileWarning },
  summary: { title: 'Plant Summary Report', description: 'KPI overview with trend data', icon: FileBarChart },
};

export function Reports({ equipment, maintenance, alerts, trend }: ReportsProps) {
  const [busy, setBusy] = useState<ReportType | null>(null);

  const generate = (type: ReportType) => {
    setBusy(type);
    setTimeout(() => {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const now = new Date().toLocaleString();
      const meta = META[type];

      doc.setFillColor(26, 58, 158);
      doc.rect(0, 0, 595, 70, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('PowerGrid Monitoring', 40, 35);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(meta.title, 40, 55);

      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.text(`Generated: ${now}`, 40, 95);
      doc.text(`Plant: Thermal Power Station Unit A`, 40, 108);

      let y = 130;

      if (type === 'equipment' || type === 'summary') {
        const running = equipment.filter((e) => e.status === 'Running').length;
        const faulty = equipment.filter((e) => e.status !== 'Running').length;
        const avgHealth = Math.round(equipment.reduce((s, e) => s + e.health, 0) / equipment.length);
        const energy = trend[trend.length - 1]?.energy ?? 0;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(20, 20, 20);
        doc.text('Key Performance Indicators', 40, y);
        y += 10;
        autoTable(doc, { startY: y, head: [['Metric', 'Value']], body: [['Total Equipment', String(equipment.length)], ['Running', String(running)], ['Faulty / Warning', String(faulty)], ['Active Alerts', String(alerts.filter((a) => !a.acknowledged).length)], ['Avg Health', `${avgHealth}%`], ['Power Generation', `${energy} MW`]], theme: 'striped', headStyles: { fillColor: [26, 58, 158] }, margin: { left: 40, right: 40 } });
        // @ts-expect-error augmented
        y = doc.lastAutoTable.finalY + 24;

        if (type === 'summary') {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.text('Trend Snapshot (last 6 readings)', 40, y);
          y += 10;
          autoTable(doc, { startY: y, head: [['Time', 'Temp (°C)', 'Pressure (bar)', 'Energy (MW)', 'Health (%)']], body: trend.slice(-6).map((t) => [t.time, String(t.temperature), String(t.pressure), String(t.energy), String(t.health)]), theme: 'grid', headStyles: { fillColor: [26, 58, 158] }, margin: { left: 40, right: 40 } });
          // @ts-expect-error augmented
          y = doc.lastAutoTable.finalY + 24;
        }
      }

      if (type === 'equipment' || type === 'summary') {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Equipment Detail', 40, y);
        y += 10;
        autoTable(doc, { startY: y, head: [['Code', 'Equipment', 'Status', 'Temp (°C)', 'Pressure', 'Voltage (kV)', 'Current (A)', 'RPM', 'Health (%)', 'Last Service']], body: equipment.map((e) => [e.code, e.name, e.status, e.temperature.toFixed(1), e.pressure > 0 ? e.pressure.toFixed(1) : '—', e.voltage > 0 ? e.voltage.toFixed(1) : '—', e.current > 0 ? e.current.toFixed(0) : '—', e.rpm > 0 ? e.rpm.toFixed(0) : '—', `${Math.round(e.health)}%`, formatDate(e.lastMaintenance)]), theme: 'striped', headStyles: { fillColor: [26, 58, 158], fontSize: 8 }, bodyStyles: { fontSize: 8 }, margin: { left: 40, right: 40 } });
      }

      if (type === 'maintenance') {
        autoTable(doc, { startY: y, head: [['Work Order', 'Equipment', 'Type', 'Status', 'Engineer', 'Priority', 'Scheduled', 'Completed']], body: maintenance.map((r) => [r.id, r.equipmentName, r.type, r.status, r.assignedEngineer, r.priority, formatDate(r.scheduledDate), r.completedDate ? formatDate(r.completedDate) : '—']), theme: 'striped', headStyles: { fillColor: [26, 58, 158], fontSize: 8 }, bodyStyles: { fontSize: 8 }, margin: { left: 40, right: 40 } });
      }

      if (type === 'alerts') {
        autoTable(doc, { startY: y, head: [['Equipment', 'Type', 'Severity', 'Value', 'Threshold', 'Acknowledged', 'Timestamp']], body: alerts.map((a) => [a.equipmentName, a.type, a.severity, a.value.toFixed(1), String(a.threshold), a.acknowledged ? 'Yes' : 'No', new Date(a.timestamp).toLocaleString()]), theme: 'striped', headStyles: { fillColor: [220, 38, 38], fontSize: 8 }, bodyStyles: { fontSize: 8 }, margin: { left: 40, right: 40 } });
      }

      const pages = doc.getNumberOfPages();
      for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text(`PowerGrid Monitoring Suite · Confidential · Page ${i} of ${pages}`, 40, 820);
      }

      doc.save(`${type}-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      setBusy(null);
    }, 400);
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Report Center" description="Generate downloadable PDF reports for audits and shift handover">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(Object.keys(META) as ReportType[]).map((type) => {
            const meta = META[type];
            const Icon = meta.icon;
            return (
              <div key={type} className="card card-hover flex items-start gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-industrial-500/10 text-industrial-600 dark:text-industrial-300"><Icon className="h-6 w-6" /></div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{meta.title}</h3>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{meta.description}</p>
                  <button onClick={() => generate(type)} disabled={busy !== null} className="btn-primary mt-3 !py-2 text-xs">
                    {busy === type ? (<><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />Generating…</>) : (<><Download className="h-3.5 w-3.5" />Download PDF</>)}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Recent Activity" description="Snapshot of plant status at report generation time">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat label="Equipment" value={equipment.length} />
          <Stat label="Running" value={equipment.filter((e) => e.status === 'Running').length} accent="emerald" />
          <Stat label="Alerts" value={alerts.length} accent="rose" />
          <Stat label="Work Orders" value={maintenance.length} accent="industrial" />
        </div>
      </SectionCard>
    </div>
  );
}

function Stat({ label, value, accent = 'slate' }: { label: string; value: number; accent?: 'slate' | 'emerald' | 'rose' | 'industrial' }) {
  const colors = { slate: 'text-slate-900 dark:text-white', emerald: 'text-emerald-500', rose: 'text-rose-500', industrial: 'text-industrial-600 dark:text-industrial-300' };
  return (
    <div className="rounded-lg bg-slate-50 p-4 dark:bg-white/5">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`stat-value mt-1 text-2xl font-bold ${colors[accent]}`}>{value}</p>
    </div>
  );
}
