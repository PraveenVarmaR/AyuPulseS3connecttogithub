import { Heart, Activity, Gauge, AlertTriangle, Brain, Wind, Droplets, ShieldAlert, Clock } from 'lucide-react';
import type { Patient } from '@/data/mockData';
import { useSimulatedVitals, useEcgWaveform, useClock } from '@/hooks/useSimulatedVitals';
import { Sparkline, EcgWaveform } from '@/components/charts/Sparkline';

const triageBanner: Record<string, string> = {
  RED: 'bg-critical-500/15 border-critical-500/40 text-critical-300',
  YELLOW: 'bg-warn-500/15 border-warn-500/40 text-warn-300',
  GREEN: 'bg-ok-500/15 border-ok-500/40 text-ok-300',
  BLACK: 'bg-slate-700/30 border-slate-600/40 text-slate-300',
};

export function ClinicalWorkspace({ patient }: { patient: Patient }) {
  return (
    <div className="space-y-4">
      {/* Patient banner */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-lg border ${triageBanner[patient.triage]}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-base-900/60 border border-base-700/50 flex items-center justify-center text-sm font-bold text-white">
            {patient.sex === 'Male' ? 'M' : 'F'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-none">Patient #{patient.id}</h2>
            <p className="text-xs text-slate-400 mt-1">
              {patient.sex} • ~{patient.age} Years • <span className="font-bold">{patient.triage === 'RED' ? 'RED / CRITICAL' : patient.triage}</span>
            </p>
          </div>
        </div>
        {patient.triage === 'RED' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-critical-500/20 border border-critical-500/50 animate-pulse-fast">
            <AlertTriangle className="w-4 h-4 text-critical-400" />
            <span className="text-xs font-bold text-critical-300">CRITICAL PATIENT</span>
          </div>
        )}
      </div>

      {/* Telemetry + Decision Support side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TelemetryMonitor patient={patient} />
        </div>
        <div>
          <DecisionSupport patient={patient} />
        </div>
      </div>
    </div>
  );
}

function TelemetryMonitor({ patient }: { patient: Patient }) {
  const clock = useClock();
  const hrData = useSimulatedVitals(patient.vitals.hr, 10, 1000, 40);
  const spo2Data = useSimulatedVitals(patient.vitals.spo2, 4, 1000, 40);
  const bpData = useSimulatedVitals(patient.vitals.bpSys, 8, 2000, 40);
  const ecgData = useEcgWaveform(40, 100);

  const spo2Critical = patient.vitals.spo2 < 90;
  const hrCritical = patient.vitals.hr > 100;

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary-400" />
          Live Telemetry Monitor
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-wide">Simulated / Demo</span>
          <span className="w-2 h-2 rounded-full bg-ok-500 animate-pulse-fast" />
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* ECG strip */}
        <div className="rounded-lg bg-base-950/80 border border-base-700/40 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-ok-400 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" /> ECG RHYTHM
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Lead II</span>
          </div>
          <EcgWaveform data={ecgData} height={80} stroke="#34d399" />
        </div>

        {/* Three vital sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Heart Rate */}
          <div className="rounded-lg bg-base-950/60 border border-base-700/40 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Heart className={`w-3.5 h-3.5 ${hrCritical ? 'text-critical-400' : 'text-ok-400'}`} /> HEART RATE
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${hrCritical ? 'bg-critical-500/20 text-critical-400' : 'bg-ok-500/20 text-ok-400'}`}>
                {hrCritical ? 'TACHY' : 'NORMAL'}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-bold font-mono ${hrCritical ? 'text-critical-400 text-glow-red' : 'text-ok-400'}`}>{patient.vitals.hr}</span>
              <span className="text-xs text-slate-500">BPM</span>
            </div>
            <Sparkline data={hrData} height={36} stroke={hrCritical ? '#ef4444' : '#34d399'} fill={hrCritical ? 'rgba(239,68,68,0.1)' : 'rgba(52,211,153,0.1)'} />
          </div>

          {/* SpO2 */}
          <div className={`rounded-lg bg-base-950/60 border p-3 space-y-2 ${spo2Critical ? 'border-critical-500/40' : 'border-base-700/40'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Activity className={`w-3.5 h-3.5 ${spo2Critical ? 'text-critical-400' : 'text-ok-400'}`} /> SpO₂
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${spo2Critical ? 'bg-critical-500/20 text-critical-400 animate-pulse-fast' : 'bg-ok-500/20 text-ok-400'}`}>
                {spo2Critical ? 'HYPOXIA' : 'NORMAL'}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-bold font-mono ${spo2Critical ? 'text-critical-400 text-glow-red animate-blink' : 'text-ok-400'}`}>{patient.vitals.spo2}</span>
              <span className="text-xs text-slate-500">%</span>
            </div>
            <Sparkline data={spo2Data} height={36} stroke={spo2Critical ? '#ef4444' : '#34d399'} fill={spo2Critical ? 'rgba(239,68,68,0.15)' : 'rgba(52,211,153,0.1)'} />
          </div>

          {/* Blood Pressure */}
          <div className="rounded-lg bg-base-950/60 border border-base-700/40 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-primary-400" /> BLOOD PRESSURE
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-warn-500/20 text-warn-400">LOW</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold font-mono text-warn-400">{patient.vitals.bpSys}<span className="text-slate-500 text-xl">/</span>{patient.vitals.bpDia}</span>
              <span className="text-xs text-slate-500">mmHg</span>
            </div>
            <Sparkline data={bpData} height={36} stroke="#f59e0b" fill="rgba(245,158,11,0.1)" />
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center justify-between pt-1 border-t border-base-700/30">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            <span>Last telemetry update: <span className="text-primary-300 font-mono">{clock}</span></span>
          </div>
          <span className="text-[10px] text-slate-600 font-mono">SIMULATED DATA — NOT FOR CLINICAL USE</span>
        </div>
      </div>
    </div>
  );
}

function DecisionSupport({ patient }: { patient: Patient }) {
  const considerations = [
    'Airway compromise / respiratory failure',
    'Possible internal hemorrhage',
    'Hemodynamic instability',
  ];

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary-400" />
          AyuPulse Decision Support
        </h3>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Algorithmic pointer */}
        <div className="rounded-lg bg-critical-500/10 border border-critical-500/30 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <AlertTriangle className="w-4 h-4 text-critical-400 animate-pulse-fast" />
            <span className="text-xs font-bold text-critical-400">CRITICAL</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rapid SpO₂ decline detected despite relatively stable heart-rate trend.
          </p>
        </div>

        {/* Clinical considerations */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Possible Clinical Considerations</p>
          <ol className="space-y-1.5">
            {considerations.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="w-4 h-4 rounded-full bg-primary-500/20 text-primary-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{c}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Risk tracking */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Prognosis / Risk Tracking</p>
          <div className="rounded-lg bg-base-950/60 border border-base-700/40 p-3 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5"><Wind className="w-3.5 h-3.5" /> Respiratory Risk</span>
              <span className="font-bold text-critical-400">HIGH</span>
            </div>
            <RiskBar level="high" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5" /> Hemorrhage Risk</span>
              <span className="font-bold text-critical-400">HIGH</span>
            </div>
            <RiskBar level="high" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5"><Brain className="w-3.5 h-3.5" /> Neurological Risk</span>
              <span className="font-bold text-warn-400">MODERATE-HIGH</span>
            </div>
            <RiskBar level="moderate-high" />
          </div>
          <div className="flex items-center gap-1.5 mt-2 px-2 py-1.5 rounded bg-warn-500/10 border border-warn-500/20">
            <ShieldAlert className="w-3 h-3 text-warn-400 shrink-0" />
            <span className="text-[10px] text-warn-300 leading-tight">Immediate intervention required</span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-slate-500 italic leading-tight border-t border-base-700/30 pt-2">
          Decision support only — final clinical decisions remain with the attending physician.
        </p>
      </div>
    </div>
  );
}

function RiskBar({ level }: { level: 'high' | 'moderate-high' | 'moderate' | 'low' }) {
  const widths = { high: '100%', 'moderate-high': '75%', moderate: '50%', low: '25%' };
  const colors = { high: 'bg-critical-500', 'moderate-high': 'bg-warn-500', moderate: 'bg-warn-400', low: 'bg-ok-500' };
  return (
    <div className="h-1.5 rounded-full bg-base-700/50 overflow-hidden">
      <div className={`h-full rounded-full ${colors[level]} transition-all duration-500`} style={{ width: widths[level] }} />
    </div>
  );
}
