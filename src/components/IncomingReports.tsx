import { useState } from 'react';
import { ScanLine, FlaskConical, Pill, FileText, CheckCircle2, Loader2, Circle, Clock } from 'lucide-react';
import type { ReportStep } from '@/data/mockData';

type Tab = 'radiology' | 'laboratory' | 'pharmacy';

export function IncomingReports() {
  const [tab, setTab] = useState<Tab>('radiology');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'radiology', label: 'Radiology', icon: <ScanLine className="w-3.5 h-3.5" /> },
    { id: 'laboratory', label: 'Laboratory', icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: 'pharmacy', label: 'Pharmacy', icon: <Pill className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary-400" />
          Incoming Reports
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-base-700/40 px-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              tab === t.id
                ? 'border-primary-500 text-primary-300'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === 'radiology' && <RadiologyReport />}
        {tab === 'laboratory' && <LabReport />}
        {tab === 'pharmacy' && <PharmacyReport />}
      </div>
    </div>
  );
}

function Timeline({ steps }: { steps: ReportStep[] }) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
              step.done
                ? 'border-ok-500 bg-ok-500/20 text-ok-400'
                : 'border-base-600 bg-base-800 text-slate-500'
            }`}>
              {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />}
            </div>
            <span className={`text-[9px] text-center leading-tight ${step.done ? 'text-ok-400' : 'text-slate-500'}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 flex-1 mx-1 ${step.done ? 'bg-ok-500/40' : 'bg-base-700'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function RadiologyReport() {
  const steps: ReportStep[] = [
    { label: 'Request Sent', done: true },
    { label: 'Scan Started', done: true },
    { label: 'Analysis', done: false },
    { label: 'Report Generated', done: false },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-white">Emergency CT Report</p>
          <p className="text-xs text-slate-500">Patient #AP-8842</p>
        </div>
        <span className="stat-pill border-warn-500/40 text-warn-400 bg-warn-500/10">
          <Loader2 className="w-3 h-3 animate-spin" />
          Processing
        </span>
      </div>
      <Timeline steps={steps} />
      <div className="rounded-lg bg-base-950/60 border border-base-700/40 p-3">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-3.5 h-3.5 text-primary-400" />
          <span className="text-xs font-semibold text-primary-300">Radiologist Notes</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed italic">
          "Preliminary trauma imaging review available. Awaiting final radiologist verification."
        </p>
      </div>
    </div>
  );
}

function LabReport() {
  const steps: ReportStep[] = [
    { label: 'Sample Received', done: true },
    { label: 'Testing', done: false },
    { label: 'Report Generated', done: false },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-white">Blood Panel & Crossmatch</p>
          <p className="text-xs text-slate-500">Patient #AP-8842</p>
        </div>
        <span className="stat-pill border-warn-500/40 text-warn-400 bg-warn-500/10">
          <Loader2 className="w-3 h-3 animate-spin" />
          In Progress
        </span>
      </div>
      <Timeline steps={steps} />
      <div className="grid grid-cols-2 gap-2">
        <ReportRow label="Blood Panel" status="pending" />
        <ReportRow label="Crossmatch" status="pending" />
        <ReportRow label="ABG" status="pending" />
        <ReportRow label="Coagulation" status="pending" />
      </div>
    </div>
  );
}

function PharmacyReport() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-white">STAT Medication Orders</p>
          <p className="text-xs text-slate-500">Patient #AP-8842</p>
        </div>
        <span className="stat-pill border-ok-500/40 text-ok-400 bg-ok-500/10">
          <CheckCircle2 className="w-3 h-3" />
          Received
        </span>
      </div>
      <div className="space-y-2">
        <ReportRow label="Intubation Kit" status="complete" />
        <ReportRow label="Inotropic Support (Norepinephrine)" status="preparing" />
        <ReportRow label="IV Fluids (Normal Saline)" status="complete" />
        <ReportRow label="TXA (Tranexamic Acid)" status="preparing" />
      </div>
    </div>
  );
}

function ReportRow({ label, status }: { label: string; status: 'pending' | 'preparing' | 'complete' }) {
  const config = {
    pending: { icon: <Circle className="w-3 h-3" />, color: 'text-slate-500', label: 'Pending' },
    preparing: { icon: <Loader2 className="w-3 h-3 animate-spin" />, color: 'text-warn-400', label: 'Preparing' },
    complete: { icon: <CheckCircle2 className="w-3 h-3" />, color: 'text-ok-400', label: 'Ready' },
  };
  const c = config[status];
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-md bg-base-950/40 border border-base-700/30">
      <span className="text-xs text-slate-300">{label}</span>
      <span className={`flex items-center gap-1.5 text-[10px] font-semibold ${c.color}`}>
        {c.icon}
        {c.label}
      </span>
    </div>
  );
}
