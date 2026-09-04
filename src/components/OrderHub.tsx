import { useState } from 'react';
import { Pill, ScanLine, FlaskConical, Send, Radio, CheckCircle2, Loader2, ArrowRight, Check } from 'lucide-react';

export interface DepartmentState {
  pharmacy: { actions: string[]; sent: boolean };
  radiology: { actions: string[]; sent: boolean };
  lab: { actions: string[]; sent: boolean };
}

export interface DispatchResult {
  show: boolean;
  pharmacy: boolean;
  radiology: boolean;
  lab: boolean;
}

interface OrderHubProps {
  state: DepartmentState;
  dispatch: DispatchResult;
  onToggleAction: (dept: 'pharmacy' | 'radiology' | 'lab', action: string) => void;
  onSend: (dept: 'pharmacy' | 'radiology' | 'lab') => void;
  onDispatchAll: () => void;
}

export function OrderHub({ state, dispatch, onToggleAction, onSend, onDispatchAll }: OrderHubProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Radio className="w-4 h-4 text-primary-400" />
          Local Network Orders
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">LAN DIRECT SYNC</span>
      </div>

      {/* Flow visualization */}
      <div className="px-4 py-3 border-b border-base-700/30">
        <div className="flex items-center justify-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-md bg-primary-500/15 border border-primary-500/30 text-primary-300 font-semibold">
            Doctor Command Hub
          </span>
          <ArrowRight className="w-4 h-4 text-slate-500" />
          <span className="px-3 py-1.5 rounded-md bg-base-800 border border-base-700/50 text-slate-300 font-semibold">
            Hospital LAN
          </span>
          <ArrowRight className="w-4 h-4 text-slate-500" />
          <span className="px-3 py-1.5 rounded-md bg-base-800 border border-base-700/50 text-slate-300 font-semibold">
            Department Nodes
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Pharmacy */}
          <DeptCard
            title="Pharmacy Node"
            icon={<Pill className="w-4 h-4 text-primary-400" />}
            actions={state.pharmacy.actions}
            sent={state.pharmacy.sent}
            received={dispatch.pharmacy}
            onToggle={(a) => onToggleAction('pharmacy', a)}
            onSend={() => onSend('pharmacy')}
          />
          {/* Radiology */}
          <DeptCard
            title="Radiology Node"
            icon={<ScanLine className="w-4 h-4 text-primary-400" />}
            actions={state.radiology.actions}
            sent={state.radiology.sent}
            received={dispatch.radiology}
            onToggle={(a) => onToggleAction('radiology', a)}
            onSend={() => onSend('radiology')}
            checkbox
          />
          {/* Lab */}
          <DeptCard
            title="Lab Node"
            icon={<FlaskConical className="w-4 h-4 text-primary-400" />}
            actions={state.lab.actions}
            sent={state.lab.sent}
            received={dispatch.lab}
            onToggle={(a) => onToggleAction('lab', a)}
            onSend={() => onSend('lab')}
            checkbox
          />
        </div>

        {/* Dispatch all */}
        <button
          onClick={onDispatchAll}
          className="btn-base w-full bg-critical-600 hover:bg-critical-500 text-white border border-critical-400/30 shadow-lg shadow-critical-500/20 transition-all"
        >
          <Send className="w-4 h-4" />
          DISPATCH ALL DIRECTIVES
        </button>

        {/* Confirmation */}
        {dispatch.show && (
          <div className="rounded-lg bg-ok-500/10 border border-ok-500/30 p-3 animate-fade-in">
            <p className="text-xs font-bold text-ok-400 mb-2 text-center">
              All selected directives transmitted through Hospital LAN.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <StatusBadge label="Pharmacy" ok={dispatch.pharmacy} />
              <StatusBadge label="Radiology" ok={dispatch.radiology} />
              <StatusBadge label="Laboratory" ok={dispatch.lab} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DeptCard({
  title,
  icon,
  actions,
  sent,
  received,
  onToggle,
  onSend,
  checkbox,
}: {
  title: string;
  icon: React.ReactNode;
  actions: string[];
  sent: boolean;
  received: boolean;
  onToggle: (action: string) => void;
  onSend: () => void;
  checkbox?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-3 transition-all ${sent ? 'border-ok-500/30 bg-ok-500/5' : 'border-base-700/40 bg-base-800/50'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">{icon} {title}</span>
        {sent && received && <CheckCircle2 className="w-3.5 h-3.5 text-ok-400" />}
        {sent && !received && <Loader2 className="w-3.5 h-3.5 text-warn-400 animate-spin" />}
      </div>
      <ul className="space-y-1.5 mb-3">
        {actions.map((a) => (
          <li key={a}>
            <button
              onClick={() => onToggle(a)}
              className="flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors w-full text-left"
            >
              {checkbox ? (
                <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                  a.startsWith('✓') ? 'border-primary-500 bg-primary-500/20' : 'border-base-600'
                }`}>
                  {a.startsWith('✓') && <Check className="w-2.5 h-2.5 text-primary-400" />}
                </span>
              ) : null}
              <span className={a.startsWith('✓') ? 'text-primary-300' : ''}>{a.replace('✓ ', '')}</span>
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={onSend}
        disabled={sent}
        className={`btn-base w-full text-xs ${
          sent
            ? 'bg-ok-600/30 text-ok-400 border border-ok-500/30'
            : 'bg-primary-600 hover:bg-primary-500 text-white border border-primary-400/30'
        }`}
      >
        {sent ? <><CheckCircle2 className="w-3 h-3" /> SENT</> : <><Send className="w-3 h-3" /> SEND TO {title.split(' ')[0].toUpperCase()}</>}
      </button>
    </div>
  );
}

function StatusBadge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      {ok ? <CheckCircle2 className="w-3.5 h-3.5 text-ok-400" /> : <Loader2 className="w-3.5 h-3.5 text-warn-400 animate-spin" />}
      <span className={ok ? 'text-ok-400' : 'text-warn-400'}>{label} — {ok ? 'Received' : 'Pending'}</span>
    </span>
  );
}
