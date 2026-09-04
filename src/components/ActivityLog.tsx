import { ScrollText, Info, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import type { ActivityEntry } from '@/data/mockData';

const levelConfig = {
  info: { icon: <Info className="w-3 h-3" />, color: 'text-primary-400', dot: 'bg-primary-500' },
  critical: { icon: <AlertOctagon className="w-3 h-3" />, color: 'text-critical-400', dot: 'bg-critical-500' },
  warn: { icon: <AlertTriangle className="w-3 h-3" />, color: 'text-warn-400', dot: 'bg-warn-500' },
  success: { icon: <CheckCircle2 className="w-3 h-3" />, color: 'text-ok-400', dot: 'bg-ok-500' },
};

export function ActivityLog({ entries }: { entries: ActivityEntry[] }) {
  return (
    <div className="panel flex flex-col max-h-[420px]">
      <div className="panel-header">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-primary-400" />
          Activity Log
        </h3>
        <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-ok-500 animate-pulse-fast" />
          LIVE
        </span>
      </div>
      <div className="flex-1 overflow-y-auto scroll-thin p-3">
        <div className="space-y-1">
          {entries.map((entry, i) => {
            const c = levelConfig[entry.level];
            return (
              <div
                key={i}
                className="flex items-start gap-2.5 px-2 py-2 rounded-md hover:bg-base-800/40 transition-colors animate-fade-in"
              >
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${c.dot}`} />
                <span className="text-[10px] font-mono text-slate-500 shrink-0 w-16 pt-0.5">{entry.time}</span>
                <span className={`flex items-center gap-1.5 text-xs ${c.color} shrink-0 pt-0.5`}>{c.icon}</span>
                <span className="text-xs text-slate-300 leading-relaxed">{entry.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
