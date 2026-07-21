import { useEffect, useRef, useState } from 'react';
import type { AlertItem, Equipment, MaintenanceRecord, TrendPoint } from './types';
import { createInitialEquipment, createInitialMaintenance, createInitialTrend, tickEquipment, tickTrend } from './simulation';

const THRESH = { highTemp: 560, lowPressure: 40, overVoltage: 21.4 };

function buildAlerts(equipment: Equipment[], existing: AlertItem[]): AlertItem[] {
  const now = new Date().toISOString();
  const fresh: AlertItem[] = [];
  for (const eq of equipment) {
    if (eq.temperature > THRESH.highTemp) fresh.push({ id: `${eq.id}-temp`, equipmentId: eq.id, equipmentName: eq.name, type: 'High Temperature', severity: 'critical', message: `${eq.name} temperature exceeded safe limit`, value: eq.temperature, threshold: THRESH.highTemp, timestamp: now, acknowledged: false });
    if (eq.pressure > 0 && eq.pressure < THRESH.lowPressure) fresh.push({ id: `${eq.id}-press`, equipmentId: eq.id, equipmentName: eq.name, type: 'Low Pressure', severity: 'warning', message: `${eq.name} pressure below nominal range`, value: eq.pressure, threshold: THRESH.lowPressure, timestamp: now, acknowledged: false });
    if (eq.voltage > 0 && eq.voltage > THRESH.overVoltage) fresh.push({ id: `${eq.id}-volt`, equipmentId: eq.id, equipmentName: eq.name, type: 'Over Voltage', severity: 'critical', message: `${eq.name} voltage above rated capacity`, value: eq.voltage, threshold: THRESH.overVoltage, timestamp: now, acknowledged: false });
    if (eq.type === 'Feed Water Pump' && eq.status === 'Offline') fresh.push({ id: `${eq.id}-pump`, equipmentId: eq.id, equipmentName: eq.name, type: 'Pump Failure', severity: 'critical', message: `${eq.name} stopped responding — manual inspection required`, value: eq.rpm, threshold: 1460, timestamp: now, acknowledged: false });
    if (eq.type === 'Generator' && eq.health < 75) fresh.push({ id: `${eq.id}-gen`, equipmentId: eq.id, equipmentName: eq.name, type: 'Generator Fault', severity: 'critical', message: `${eq.name} health degraded — potential stator issue`, value: eq.health, threshold: 75, timestamp: now, acknowledged: false });
  }
  const merged: AlertItem[] = [];
  const seen = new Set<string>();
  for (const a of fresh) { const prev = existing.find((x) => x.id === a.id); merged.push({ ...a, acknowledged: prev?.acknowledged ?? false }); seen.add(a.id); }
  for (const a of existing) if (!seen.has(a.id) && a.acknowledged) merged.push(a);
  return merged.slice(0, 40);
}

export function usePlantData() {
  const [equipment, setEquipment] = useState<Equipment[]>(() => createInitialEquipment());
  const [trend, setTrend] = useState<TrendPoint[]>(() => createInitialTrend());
  const [maintenance] = useState<MaintenanceRecord[]>(() => createInitialMaintenance(createInitialEquipment()));
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    setAlerts((a) => buildAlerts(equipment, a));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEquipment((prev) => {
        const next = tickEquipment(prev);
        setTrend((t) => tickTrend(t, next));
        setAlerts((a) => buildAlerts(next, a));
        return next;
      });
      setLastUpdate(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const acknowledgeAlert = (id: string) => setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  const acknowledgeAll = () => setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));

  return { equipment, trend, maintenance, alerts, lastUpdate, acknowledgeAlert, acknowledgeAll };
}
