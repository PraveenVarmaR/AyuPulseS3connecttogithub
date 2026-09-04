import { AlertTriangle, Ambulance, Heart, Activity, Droplet, Gauge } from 'lucide-react';
import type { Patient, TriageLevel } from '@/data/mockData';
import { useSimulatedVitals } from '@/hooks/useSimulatedVitals';
import { Sparkline } from '@/components/charts/Sparkline';

interface PatientQueueProps {
  patients: Patient[];
  selectedId: string;
  onSelect: (id: string) => void;
  triageFilter: TriageLevel | 'ALL';
}

const triageConfig: Record<TriageLevel, { label: string; color: string; bg: string; border: string; dot: string }> = {
  RED: { label: 'RED / CRITICAL', color: 'text-critical-400', bg: 'bg-critical-500/10', border: 'border-critical-500/40', dot: 'bg-critical-500' },
  YELLOW: { label: 'YELLOW / URGENT', color: 'text-warn-400', bg: 'bg-warn-500/10', border: 'border-warn-500/40', dot: 'bg-warn-500' },
  GREEN: { label: 'GREEN / MINOR', color: 'text-ok-400', bg: 'bg-ok-500/10', border: 'border-ok-500/40', dot: 'bg-ok-500' },
  BLACK: { label: 'BLACK / DECEASED', color: 'text-slate-400', bg: 'bg-slate-700/20', border: 'border-slate-600/40', dot: 'bg-slate-500' },
};

export function PatientQueue({ patients, selectedId, onSelect, triageFilter }: PatientQueueProps) {
  const filtered = triageFilter === 'ALL' ? patients : patients.filter((p) => p.triage === triageFilter);

  return (
    <aside className="w-[340px] shrink-0 panel flex flex-col max-h-[calc(100vh-64px)]">
      <div className="panel-header">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Ambulance className="w-4 h-4 text-primary-400" />
          Incoming Queue
        </h2>
        <span className="text-xs text-slate-500 font-mono">{filtered.length} active</span>
      </div>
      <div className="flex-1 overflow-y-auto scroll-thin p-3 space-y-3">
        {filtered.length === 0 && (
          <div className="text-center text-slate-500 text-sm py-8">No patients match this triage filter.</div>
        )}
        {filtered.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            selected={patient.id === selectedId}
            onClick={() => onSelect(patient.id)}
          />
        ))}
      </div>
    </aside>
  );
}

function PatientCard({ patient, selected, onClick }: { patient: Patient; selected: boolean; onClick: () => void }) {
  const tc = triageConfig[patient.triage];
  const hrData = useSimulatedVitals(patient.vitals.hr, 8, 1500, 30);
  const spo2Data = useSimulatedVitals(patient.vitals.spo2, 3, 1500, 30);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border transition-all duration-200 overflow-hidden ${
        selected
          ? 'border-primary-500/60 bg-primary-500/5 shadow-lg shadow-primary-500/10 ring-1 ring-primary-500/20'
          : 'border-base-700/40 bg-base-800/50 hover:border-base-600 hover:bg-base-800'
      }`}
    >
      {/* Card header */}
      <div className={`flex items-center justify-between px-3 py-2 ${tc.bg} border-b ${tc.border}`}>
        <div className="flex items-center gap-2">
          <Ambulance className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-xs font-bold text-white">{patient.ambulance}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">ETA {patient.eta}m</span>
          <span className={`w-2 h-2 rounded-full ${tc.dot} ${patient.triage === 'RED' ? 'animate-pulse-fast' : ''}`} />
        </div>
      </div>

      {/* Patient info */}
      <div className="px-3 py-2.5 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-white">#{patient.id}</span>
            <span className="text-xs text-slate-400 ml-2">{patient.sex} • ~{patient.age}y</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${tc.bg} ${tc.color} border ${tc.border}`}>
            {patient.triage}
          </span>
        </div>

        {/* Vitals mini-grid */}
        <div className="grid grid-cols-4 gap-1.5">
          <MiniVital icon={<Heart className="w-3 h-3" />} label="HR" value={`${patient.vitals.hr}`} unit="bpm" color={patient.vitals.hr > 100 ? 'text-critical-400' : 'text-ok-400'} />
          <MiniVital icon={<Activity className="w-3 h-3" />} label="SpO₂" value={`${patient.vitals.spo2}`} unit="%" color={patient.vitals.spo2 < 90 ? 'text-critical-400' : 'text-ok-400'} />
          <MiniVital icon={<Gauge className="w-3 h-3" />} label="BP" value={`${patient.vitals.bpSys}/${patient.vitals.bpDia}`} unit="" color={patient.vitals.bpSys < 100 ? 'text-warn-400' : 'text-ok-400'} />
          <MiniVital icon={<Droplet className="w-3 h-3" />} label="GCS" value={`${patient.vitals.gcs}`} unit="" color={patient.vitals.gcs < 10 ? 'text-critical-400' : 'text-ok-400'} />
        </div>

        {/* Sparklines */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase tracking-wide">HR Trend</span>
            <Sparkline data={hrData} height={28} stroke="#ef4444" fill="rgba(239,68,68,0.1)" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase tracking-wide">SpO₂ Trend</span>
            <Sparkline data={spo2Data} height={28} stroke={patient.vitals.spo2 < 90 ? '#ef4444' : '#34d399'} fill={patient.vitals.spo2 < 90 ? 'rgba(239,68,68,0.1)' : 'rgba(52,211,153,0.1)'} />
          </div>
        </div>

        {/* Alert */}
        {patient.alert && (
          <div className="flex items-start gap-1.5 px-2 py-1.5 rounded bg-critical-500/10 border border-critical-500/30">
            <AlertTriangle className="w-3 h-3 text-critical-400 shrink-0 mt-0.5 animate-pulse-fast" />
            <span className="text-[10px] text-critical-300 font-medium leading-tight">{patient.alert}</span>
          </div>
        )}

        {/* Complaint */}
        <p className="text-[10px] text-slate-400 leading-tight">{patient.complaint}</p>
      </div>
    </button>
  );
}

function MiniVital({ icon, label, value, unit, color }: { icon: React.ReactNode; label: string; value: string; unit: string; color: string }) {
  return (
    <div className="flex flex-col items-center bg-base-900/60 rounded px-1 py-1.5 border border-base-700/30">
      <div className="flex items-center gap-1 text-slate-500">{icon}<span className="text-[8px] uppercase tracking-wide">{label}</span></div>
      <span className={`text-xs font-bold font-mono ${color}`}>{value}</span>
      {unit && <span className="text-[8px] text-slate-500">{unit}</span>}
    </div>
  );
}
