import { Activity, Ambulance, BedDouble, Building2, Lock, Radio, ShieldCheck } from 'lucide-react';
import { useClock } from '@/hooks/useSimulatedVitals';
import type { TriageLevel } from '@/data/mockData';

interface HeaderProps {
  triageFilter: TriageLevel | 'ALL';
  onTriageChange: (t: TriageLevel | 'ALL') => void;
}

const TRIAGE_OPTIONS: (TriageLevel | 'ALL')[] = ['ALL', 'RED', 'YELLOW', 'GREEN', 'BLACK'];

const triageStyles: Record<string, string> = {
  ALL: 'border-primary-500/50 text-primary-300 bg-primary-500/10',
  RED: 'border-critical-500/50 text-critical-400 bg-critical-500/10',
  YELLOW: 'border-warn-500/50 text-warn-400 bg-warn-500/10',
  GREEN: 'border-ok-500/50 text-ok-400 bg-ok-500/10',
  BLACK: 'border-slate-500/50 text-slate-400 bg-slate-700/30',
};

export function Header({ triageFilter, onTriageChange }: HeaderProps) {
  const clock = useClock();

  return (
    <header className="border-b border-base-700/60 bg-base-900/90 backdrop-blur-md sticky top-0 z-50">
      {/* Top row */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-ok-500 border-2 border-base-900 animate-pulse-fast" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-none">
              AyuPulse <span className="text-primary-400">ER Command Hub</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Visakhapatnam Emergency Ward • Doctor Clinical Workspace</p>
          </div>
        </div>

        {/* Right-side indicators */}
        <div className="flex items-center gap-2.5">
          <Indicator icon={<ShieldCheck className="w-3.5 h-3.5" />} label="Hospital LAN" value="SYNCHRONIZED" color="ok" pulse />
          <Indicator icon={<Ambulance className="w-3.5 h-3.5" />} label="Ambulances" value="2" color="warn" />
          <Indicator icon={<BedDouble className="w-3.5 h-3.5" />} label="ICU Beds" value="1 Avail" color="primary" />
          <Indicator icon={<Building2 className="w-3.5 h-3.5" />} label="Trauma Bays" value="2 Avail" color="primary" />
          <Indicator icon={<Lock className="w-3.5 h-3.5" />} label="LAN" value="Encrypted" color="ok" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-base-800/80 border border-base-700/50">
            <Radio className="w-3.5 h-3.5 text-primary-400" />
            <span className="font-mono text-sm font-semibold text-primary-300 tabular-nums">{clock}</span>
          </div>
        </div>
      </div>

      {/* Triage filter row */}
      <div className="flex items-center gap-2 px-6 py-2 border-t border-base-700/40 bg-base-950/50">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">Triage Filter</span>
        {TRIAGE_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => onTriageChange(opt)}
            className={`px-3 py-1 rounded-md text-xs font-bold border transition-all duration-150 ${
              triageFilter === opt
                ? triageStyles[opt] + ' scale-105 shadow-sm'
                : 'border-base-700/40 text-slate-500 hover:text-slate-300 hover:border-base-600'
            }`}
          >
            {opt === 'ALL' ? 'ALL' : opt}
          </button>
        ))}
      </div>
    </header>
  );
}

function Indicator({
  icon,
  label,
  value,
  color,
  pulse,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'ok' | 'warn' | 'primary' | 'critical';
  pulse?: boolean;
}) {
  const colors = {
    ok: 'border-ok-500/30 bg-ok-500/5 text-ok-400',
    warn: 'border-warn-500/30 bg-warn-500/5 text-warn-400',
    primary: 'border-primary-500/30 bg-primary-500/5 text-primary-300',
    critical: 'border-critical-500/30 bg-critical-500/5 text-critical-400',
  };
  return (
    <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border ${colors[color]}`}>
      <span className={pulse ? 'animate-pulse-fast' : ''}>{icon}</span>
      <div className="flex flex-col leading-none">
        <span className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</span>
        <span className="text-xs font-semibold">{value}</span>
      </div>
    </div>
  );
}
