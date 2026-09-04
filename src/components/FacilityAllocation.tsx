import { BedDouble, Building2, Stethoscope, Check, LayoutGrid } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BedDouble,
  Building2,
  Stethoscope,
};

export interface FacilityState {
  id: string;
  icon: string;
  label: string;
  available: number;
  total: number;
  assigned: boolean;
}

interface FacilityAllocationProps {
  facilities: FacilityState[];
  onAssign: (id: string) => void;
}

export function FacilityAllocation({ facilities, onAssign }: FacilityAllocationProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-primary-400" />
          Facility Allocation
        </h3>
      </div>
      <div className="p-4 space-y-2.5">
        {facilities.map((f) => {
          const Icon = iconMap[f.icon] || BedDouble;
          return (
            <div
              key={f.id}
              className={`flex items-center justify-between rounded-lg border p-3 transition-all ${
                f.assigned
                  ? 'border-ok-500/40 bg-ok-500/5'
                  : 'border-base-700/40 bg-base-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${f.assigned ? 'text-ok-400' : 'text-primary-400'}`} />
                <div>
                  <p className="text-sm font-semibold text-white">{f.label}</p>
                  <p className="text-[10px] text-slate-500">
                    Availability: <span className={`font-bold ${f.available > 0 ? 'text-ok-400' : 'text-critical-400'}`}>
                      {f.available}/{f.total}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => onAssign(f.id)}
                disabled={f.assigned || f.available === 0}
                className={`btn-base text-xs px-3 py-1.5 ${
                  f.assigned
                    ? 'bg-ok-600/30 text-ok-400 border border-ok-500/30'
                    : f.available === 0
                    ? 'bg-base-700/30 text-slate-500 border border-base-700/30'
                    : 'bg-primary-600 hover:bg-primary-500 text-white border border-primary-400/30'
                }`}
              >
                {f.assigned ? <><Check className="w-3 h-3" /> ASSIGNED</> : 'ASSIGN'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
