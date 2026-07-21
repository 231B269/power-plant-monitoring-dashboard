import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Equipment, TrendPoint } from '../types';
import { SectionCard } from '../components/SectionCard';

const TS = { backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(51,65,85,0.8)', borderRadius: '8px', fontSize: '12px', color: '#e2e8f0' };

interface ChartsProps {
  trend: TrendPoint[];
  equipment: Equipment[];
}

export function Charts({ trend, equipment }: ChartsProps) {
  const radarData = equipment.map((e) => ({ name: e.code, health: Math.round(e.health), temp: Math.min(100, Math.round((e.temperature / 575) * 100)), pressure: e.pressure > 0 ? Math.min(100, Math.round((e.pressure / 175) * 100)) : 0 }));
  const energyData = trend.map((t) => ({ time: t.time, energy: t.energy, health: t.health }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Temperature Trend" description="Aggregate plant temperature (°C) · 24h">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.4} /><stop offset="95%" stopColor="#f97316" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TS} />
                <Area type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2.5} fill="url(#tg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
        <SectionCard title="Pressure Trend" description="Aggregate system pressure (bar) · 24h">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TS} />
                <Area type="monotone" dataKey="pressure" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#pg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard title="Energy Generation" description="MW output · 24h" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TS} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="energy" name="Energy (MW)" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="health" name="Health (%)" stroke="#10b981" strokeWidth={2.5} dot={false} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
        <SectionCard title="Equipment Health Radar" description="Comparative metrics">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="rgba(148,163,184,0.2)" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Radar name="Health" dataKey="health" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Radar name="Temp Load" dataKey="temp" stroke="#f97316" fill="#f97316" fillOpacity={0.15} />
                <Tooltip contentStyle={TS} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Equipment Health Distribution" description="Per-asset health score">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={equipment.map((e) => ({ name: e.code, Health: Math.round(e.health), Temperature: Math.round(e.temperature) }))} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TS} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar yAxisId="left" dataKey="Health" radius={[6, 6, 0, 0]}>{equipment.map((e) => <Cell key={e.id} fill={e.health >= 85 ? '#10b981' : e.health >= 70 ? '#f59e0b' : '#f43f5e'} />)}</Bar>
              <Bar yAxisId="right" dataKey="Temperature" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}
