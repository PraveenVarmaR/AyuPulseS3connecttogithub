import { Camera, ScanEye, Maximize2, AlertTriangle } from 'lucide-react';
import type { Patient } from '@/data/mockData';

const SCENE_IMAGES = [
  { url: 'https://images.pexels.com/photos/35784044/pexels-photo-35784044.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', label: 'Scene Cam 01 — Impact Zone' },
  { url: 'https://images.pexels.com/photos/28123710/pexels-photo-28123710.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', label: 'Scene Cam 02 — Approach' },
  { url: 'https://images.pexels.com/photos/5458450/pexels-photo-5458450.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', label: 'Scene Cam 03 — Bystander Feed' },
];

export function SceneIntelligence({ patient }: { patient: Patient }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Camera className="w-4 h-4 text-primary-400" />
          Scene Intelligence
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">CITIZEN/BYSTANDER MEDIA</span>
      </div>

      <div className="p-4 space-y-3">
        {/* Thumbnails */}
        <div className="grid grid-cols-3 gap-2">
          {SCENE_IMAGES.map((img, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-base-700/40 bg-base-950">
              <img src={img.url} alt={img.label} className="w-full h-24 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-base-950/80 to-transparent" />
              <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between">
                <span className="text-[9px] text-slate-300 font-mono leading-tight">{img.label}</span>
              </div>
              <div className="absolute top-1 right-1">
                <span className="w-1.5 h-1.5 rounded-full bg-critical-500 animate-pulse-fast block" />
              </div>
            </div>
          ))}
        </div>

        {/* Analysis */}
        <div className="rounded-lg bg-base-950/60 border border-base-700/40 p-3">
          <div className="flex items-center gap-2 mb-2">
            <ScanEye className="w-4 h-4 text-primary-400" />
            <span className="text-xs font-bold text-primary-300">AyuPulse Scene Analysis</span>
          </div>
          <ul className="space-y-1.5">
            {patient.sceneNotes.map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <AlertTriangle className="w-3 h-3 text-warn-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{note}</span>
              </li>
            ))}
          </ul>
        </div>

        <button className="btn-base w-full bg-primary-600 hover:bg-primary-500 text-white border border-primary-400/30 transition-all">
          <Maximize2 className="w-3.5 h-3.5" />
          View Full Media
        </button>
      </div>
    </div>
  );
}
