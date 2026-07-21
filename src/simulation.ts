import type { Equipment, EquipmentType, MaintenanceRecord, SensorReading, TrendPoint } from './types';

interface Spec {
  type: EquipmentType;
  code: string;
  location: string;
  base: SensorReading;
  ranges: { temp: [number, number]; pressure: [number, number]; voltage: [number, number]; current: [number, number]; rpm: [number, number] };
}

const CATALOG: Spec[] = [
  { type: 'Boiler', code: 'BLR-01', location: 'Unit A · Level B2', base: { temperature: 540, pressure: 165, voltage: 0, current: 0, rpm: 0, health: 94 },
    ranges: { temp: [510, 575], pressure: [150, 175], voltage: [0, 0], current: [0, 0], rpm: [0, 0] } },
  { type: 'Steam Turbine', code: 'ST-02', location: 'Unit A · Turbine Hall', base: { temperature: 420, pressure: 95, voltage: 0, current: 0, rpm: 3000, health: 91 },
    ranges: { temp: [395, 455], pressure: [85, 108], voltage: [0, 0], current: [0, 0], rpm: [2980, 3015] } },
  { type: 'Generator', code: 'GEN-03', location: 'Unit A · Turbine Hall', base: { temperature: 88, pressure: 0, voltage: 21, current: 18500, rpm: 3000, health: 96 },
    ranges: { temp: [78, 98], pressure: [0, 0], voltage: [20.5, 21.5], current: [17500, 19500], rpm: [2985, 3010] } },
  { type: 'Transformer', code: 'TR-04', location: 'Switchyard · Bay 1', base: { temperature: 72, pressure: 0, voltage: 400, current: 980, rpm: 0, health: 89 },
    ranges: { temp: [62, 86], pressure: [0, 0], voltage: [395, 405], current: [920, 1040], rpm: [0, 0] } },
  { type: 'Cooling Tower', code: 'CT-05', location: 'Unit A · Roof', base: { temperature: 34, pressure: 1.2, voltage: 0, current: 0, rpm: 120, health: 85 },
    ranges: { temp: [28, 42], pressure: [0.9, 1.6], voltage: [0, 0], current: [0, 0], rpm: [110, 130] } },
  { type: 'Feed Water Pump', code: 'FWP-06', location: 'Unit A · Pump Room', base: { temperature: 65, pressure: 45, voltage: 6.6, current: 320, rpm: 1480, health: 83 },
    ranges: { temp: [55, 78], pressure: [38, 52], voltage: [6.4, 6.8], current: [300, 360], rpm: [1460, 1500] } },
];

const ENGINEERS = ['A. Sharma', 'R. Kowalski', 'M. Chen', 'L. Müller', 'S. Patel', 'J. Okafor'];

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

let rand = seededRandom(42);

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }

function jitter(base: number, range: [number, number]): number {
  if (range[0] === 0 && range[1] === 0) return 0;
  const center = (range[0] + range[1]) / 2;
  const spread = (range[1] - range[0]) / 2;
  return clamp(base + (rand() - 0.5) * spread * 1.6, range[0], range[1]);
}

function statusFromReading(type: EquipmentType, r: SensorReading): Equipment['status'] {
  const spec = CATALOG.find((e) => e.type === type)!;
  if (r.temperature > spec.ranges.temp[1] - 3) return 'Warning';
  if (r.pressure > 0 && r.pressure < spec.ranges.pressure[0] + 2) return 'Warning';
  if (r.voltage > 0 && r.voltage > spec.ranges.voltage[1] - 0.2) return 'Warning';
  if (r.health < 70) return 'Offline';
  return 'Running';
}

function healthFromReading(prev: number, type: EquipmentType, r: SensorReading): number {
  const spec = CATALOG.find((e) => e.type === type)!;
  let penalty = 0;
  if (r.temperature > spec.ranges.temp[1] - 4) penalty += 3;
  if (r.pressure > 0 && r.pressure < spec.ranges.pressure[0] + 3) penalty += 2;
  if (r.voltage > 0 && r.voltage > spec.ranges.voltage[1] - 0.2) penalty += 2;
  return clamp(prev - penalty * 0.05 + (rand() - 0.5) * 0.4, 55, 100);
}

function randomPastDate(minDays: number, maxDays: number): string {
  const days = minDays + Math.floor(rand() * (maxDays - minDays));
  const d = new Date(); d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function randomFutureDate(minDays: number, maxDays: number): string {
  const days = minDays + Math.floor(rand() * (maxDays - minDays));
  const d = new Date(); d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function createInitialEquipment(): Equipment[] {
  rand = seededRandom(42);
  return CATALOG.map((spec) => {
    const reading: SensorReading = {
      temperature: jitter(spec.base.temperature, spec.ranges.temp),
      pressure: spec.base.pressure > 0 ? jitter(spec.base.pressure, spec.ranges.pressure) : 0,
      voltage: spec.base.voltage > 0 ? jitter(spec.base.voltage, spec.ranges.voltage) : 0,
      current: spec.base.current > 0 ? jitter(spec.base.current, spec.ranges.current) : 0,
      rpm: spec.base.rpm > 0 ? jitter(spec.base.rpm, spec.ranges.rpm) : 0,
      health: spec.base.health,
    };
    return { id: spec.code, name: spec.type, code: spec.code, type: spec.type, status: statusFromReading(spec.type, reading), lastMaintenance: randomPastDate(30, 120), location: spec.location, ...reading };
  });
}

export function tickEquipment(prev: Equipment[]): Equipment[] {
  return prev.map((eq) => {
    const spec = CATALOG.find((s) => s.type === eq.type)!;
    const reading: SensorReading = {
      temperature: jitter(eq.temperature, spec.ranges.temp),
      pressure: eq.pressure > 0 ? jitter(eq.pressure, spec.ranges.pressure) : 0,
      voltage: eq.voltage > 0 ? jitter(eq.voltage, spec.ranges.voltage) : 0,
      current: eq.current > 0 ? jitter(eq.current, spec.ranges.current) : 0,
      rpm: eq.rpm > 0 ? jitter(eq.rpm, spec.ranges.rpm) : 0,
      health: eq.health,
    };
    reading.health = healthFromReading(eq.health, eq.type, reading);
    return { ...eq, ...reading, status: statusFromReading(eq.type, reading) };
  });
}

export function createInitialTrend(): TrendPoint[] {
  const points: TrendPoint[] = [];
  let temp = 520, pressure = 160, energy = 580, health = 92;
  for (let i = 23; i >= 0; i--) {
    const d = new Date(); d.setHours(d.getHours() - i);
    temp = clamp(temp + (rand() - 0.5) * 12, 500, 560);
    pressure = clamp(pressure + (rand() - 0.5) * 6, 150, 175);
    energy = clamp(energy + (rand() - 0.5) * 30, 540, 640);
    health = clamp(health + (rand() - 0.5) * 1.2, 80, 98);
    points.push({ time: `${d.getHours().toString().padStart(2, '0')}:00`, temperature: Math.round(temp), pressure: Math.round(pressure), energy: Math.round(energy), health: Math.round(health) });
  }
  return points;
}

export function tickTrend(prev: TrendPoint[], equipment: Equipment[]): TrendPoint[] {
  const avgTemp = equipment.reduce((s, e) => s + e.temperature, 0) / equipment.length;
  const pressurized = equipment.filter((e) => e.pressure > 0);
  const avgPressure = pressurized.length ? pressurized.reduce((s, e) => s + e.pressure, 0) / pressurized.length : 0;
  const avgHealth = equipment.reduce((s, e) => s + e.health, 0) / equipment.length;
  const running = equipment.filter((e) => e.status === 'Running').length;
  const d = new Date();
  return [...prev.slice(-23), { time: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`, temperature: Math.round(avgTemp), pressure: Math.round(avgPressure), energy: Math.round(running * 105 + (rand() - 0.5) * 20), health: Math.round(avgHealth) }];
}

export function createInitialMaintenance(equipment: Equipment[]): MaintenanceRecord[] {
  const types: MaintenanceRecord['type'][] = ['Preventive', 'Corrective', 'Predictive', 'Overhaul'];
  const priorities: MaintenanceRecord['priority'][] = ['Low', 'Medium', 'High', 'Critical'];
  const records: MaintenanceRecord[] = [];
  equipment.forEach((eq, idx) => {
    records.push({ id: `M-${100 + idx}`, equipmentId: eq.id, equipmentName: eq.name, type: types[idx % 4], status: 'Upcoming', assignedEngineer: ENGINEERS[idx % 6], scheduledDate: randomFutureDate(3, 25), completedDate: null, description: `${types[idx % 4]} maintenance for ${eq.name} (${eq.code}). Inspect bearings, seals, and calibration.`, priority: priorities[idx % 4] });
    records.push({ id: `M-${200 + idx}`, equipmentId: eq.id, equipmentName: eq.name, type: types[(idx + 1) % 4], status: 'Completed', assignedEngineer: ENGINEERS[(idx + 2) % 6], scheduledDate: randomPastDate(20, 60), completedDate: randomPastDate(15, 50), description: `Routine ${types[(idx + 1) % 4].toLowerCase()} service completed. All parameters within nominal range.`, priority: priorities[(idx + 1) % 4] });
  });
  return records;
}
