import { useState } from 'react';
import { Activity, Eye, EyeOff, Lock, ShieldCheck, User, Zap } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('supervisor@powergrid.io');
  const [password, setPassword] = useState('plant123');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 700);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 dark:bg-surface">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-industrial-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-industrial-700/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(#1a3a9e 1px, transparent 1px), linear-gradient(90deg, #1a3a9e 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-industrial-500 to-industrial-700 text-white shadow-xl shadow-industrial-600/40">
              <Zap className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">PowerGrid Monitoring</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Industrial Equipment Control Suite</p>
          </div>

          <div className="card p-7">
            <div className="mb-5 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-industrial-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Secure Sign In</h2>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Operator ID</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="operator@powergrid.io" required />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field px-10" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" aria-label={show ? 'Hide' : 'Show'}>
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-500">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-industrial-600 focus:ring-industrial-500" />
                  Remember this terminal
                </label>
                <button type="button" className="font-medium text-industrial-600 hover:underline dark:text-industrial-400">Forgot?</button>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Authenticating…</>) : (<><Activity className="h-4 w-4" />Access Control Room</>)}
              </button>
            </form>
            <div className="mt-5 rounded-lg bg-slate-50 p-3 text-center text-xs text-slate-500 dark:bg-white/5">
              Demo credentials pre-filled · Click <span className="font-semibold text-industrial-600 dark:text-industrial-400">Access Control Room</span> to enter
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-slate-400">© 2026 PowerGrid Industrial Systems · SCADA-Ready · ISO 27001 Certified</p>
        </div>
      </div>
    </div>
  );
}
