import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, description, action, children, className = '' }: SectionCardProps) {
  return (
    <section className={`card animate-fade-in ${className}`}>
      <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-surface-border">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
