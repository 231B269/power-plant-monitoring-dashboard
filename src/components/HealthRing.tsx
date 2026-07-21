interface HealthRingProps {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
}

export function HealthRing({ value, size = 72, stroke = 6, label }: HealthRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 85 ? '#10b981' : value >= 70 ? '#f59e0b' : '#f43f5e';
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} className="stroke-slate-200 dark:stroke-surface-border" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} stroke={color} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s' }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="stat-value text-base font-bold text-slate-900 dark:text-white">{Math.round(value)}%</span>
        {label && <span className="text-[10px] uppercase tracking-wide text-slate-400">{label}</span>}
      </div>
    </div>
  );
}
