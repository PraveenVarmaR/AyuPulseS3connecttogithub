import { BedDouble, Droplets, ScanLine, Wind, Brain, Check, Loader2, Zap } from 'lucide-react';
import type { ResourceItem, ResourceState } from '@/data/mockData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BedDouble,
  Droplets,
  ScanLine,
  Wind,
  Brain,
};

const stateConfig: Record<ResourceState, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  READY: { label: 'READY', color: 'text-slate-400', bg: 'bg-base-800/60', border: 'border-base-700/40', icon: null },
  REQUESTED: { label: 'REQUESTED', color: 'text-warn-400', bg: 'bg-warn-500/10', border: 'border-warn-500/40', icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  CONFIRMED: { label: 'CONFIRMED', color: 'text-ok-400', bg: 'bg-ok-500/10', border: 'border-ok-500/40', icon: <Check className="w-3 h-3" /> },
};

interface ResourceAllocationProps {
  resources: ResourceItem[];
  onAdvance: (id: string) => void;
}

export function ResourceAllocation({ resources, onAdvance }: ResourceAllocationProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-warn-400" />
          One-Tap Resource Pre-Allocation
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">TAP TO CYCLE: READY → REQUESTED → CONFIRMED</span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-5 gap-3">
          {resources.map((r) => {
            const Icon = iconMap[r.icon] || BedDouble;
            const sc = stateConfig[r.state];
            return (
              <button
                key={r.id}
                onClick={() => onAdvance(r.id)}
                className={`group rounded-lg border p-3 text-left transition-all duration-200 hover:scale-[1.02] ${sc.bg} ${sc.border}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-primary-400" />
                  <span className={`text-[10px] font-bold flex items-center gap-1 ${sc.color}`}>
                    {sc.icon}
                    {sc.label}
                  </span>
                </div>
                <p className="text-xs font-bold text-white mb-1">{r.label}</p>
                <p className="text-[10px] text-slate-400 leading-tight">{r.action}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
