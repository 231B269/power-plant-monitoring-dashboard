export type EquipmentStatus = 'Running' | 'Warning' | 'Offline';
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface SensorReading {
  temperature: number;
  pressure: number;
  voltage: number;
  current: number;
  rpm: number;
  health: number;
}

export interface Equipment extends SensorReading {
  id: string;
  name: string;
  code: string;
  type: EquipmentType;
  status: EquipmentStatus;
  lastMaintenance: string;
  location: string;
}

export type EquipmentType =
  | 'Boiler' | 'Steam Turbine' | 'Generator'
  | 'Transformer' | 'Cooling Tower' | 'Feed Water Pump';

export interface AlertItem {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: 'High Temperature' | 'Low Pressure' | 'Over Voltage' | 'Pump Failure' | 'Generator Fault';
  severity: AlertSeverity;
  message: string;
  value: number;
  threshold: number;
  timestamp: string;
  acknowledged: boolean;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: 'Preventive' | 'Corrective' | 'Predictive' | 'Overhaul';
  status: 'Upcoming' | 'In Progress' | 'Completed';
  assignedEngineer: string;
  scheduledDate: string;
  completedDate: string | null;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface TrendPoint {
  time: string;
  temperature: number;
  pressure: number;
  energy: number;
  health: number;
}

export interface User {
  name: string;
  role: string;
  email: string;
}
