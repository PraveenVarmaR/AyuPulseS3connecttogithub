import { AlertOctagon, Send } from 'lucide-react';

interface FooterProps {
  onDispatchAll: () => void;
}

export function Footer({ onDispatchAll }: FooterProps) {
  return (
    <footer className="sticky bottom-0 z-40 border-t border-critical-500/30 bg-base-900/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-critical-500/15 border border-critical-500/30">
            <AlertOctagon className="w-4 h-4 text-critical-400 animate-pulse-fast" />
            <span className="text-xs font-bold text-critical-300">EMERGENCY BROADCAST</span>
          </div>
          <p className="text-xs text-slate-400 hidden md:block">
            Send Advance Directives to Pharmacy, Radiology & Laboratory Nodes through Hospital LAN.
          </p>
        </div>
        <button
          onClick={onDispatchAll}
          className="btn-base bg-critical-600 hover:bg-critical-500 text-white border border-critical-400/30 shadow-lg shadow-critical-500/20 text-sm px-6 py-2.5"
        >
          <Send className="w-4 h-4" />
          DISPATCH ALL DIRECTIVES
        </button>
      </div>
    </footer>
  );
}
