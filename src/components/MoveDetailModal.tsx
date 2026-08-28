import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Move } from '../types';
import { cn } from '../lib/utils';
import { TypeBadge } from './TypeBadge';

interface MoveDetailModalProps {
  isOpen: boolean;
  move: Move | null;
  onClose: () => void;
  typeHeaderGradients?: Record<string, string>;
}

export const MoveDetailModal: React.FC<MoveDetailModalProps> = ({
  isOpen,
  move,
  onClose,
  typeHeaderGradients = {},
}) => {
  if (!isOpen || !move) return null;

  const moveType = (move.type || '').toLowerCase();
  const headerBg = typeHeaderGradients[moveType] || "bg-gradient-to-r from-cyan-900 via-slate-900 to-slate-950";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.98, y: 6, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.98, y: 6, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-slate-900 border-2 border-cyan-500/50 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.2)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={cn("p-4 sm:p-6 flex justify-between items-start relative overflow-hidden w-full border-b border-cyan-500/30", headerBg)}>
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-white font-hud text-2xl uppercase tracking-widest drop-shadow-lg">
                {move.name.replace(/-/g, ' ')}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <TypeBadge type={move.type} size="sm" />
                <span className="px-2 py-0.5 bg-black/40 rounded text-[10px] font-bold tracking-wider font-black text-white uppercase border border-black/50 shadow-inner">
                  {move.currentPP ?? move.pp} / {move.pp} PP
                </span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider font-black uppercase shadow-sm border",
                    move.damage_class === 'physical'
                      ? "bg-red-600 border-red-800"
                      : move.damage_class === 'special'
                      ? "bg-indigo-600 border-indigo-800"
                      : "bg-slate-500 border-slate-700"
                  )}
                >
                  {move.damage_class}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="relative z-20 p-2 text-white bg-black/40 hover:bg-black/60 border border-white/25 rounded-full transition-all shrink-0 hover:scale-110 active:scale-95 shadow-md flex items-center justify-center cursor-pointer"
              title="Close Analysis"
            >
              <X className="w-5 h-5 text-white stroke-[2.5]" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-6 bg-slate-900">
            {/* Description */}
            {move.description && (
              <div className="space-y-2">
                <h4 className="text-[8px] font-bold tracking-wider text-cyan-600 uppercase font-hud tracking-widest border-b border-cyan-900/30 pb-1">
                  Data Entry
                </h4>
                <p className="text-slate-300 text-[11px] font-medium leading-relaxed font-sans bg-slate-950/50 p-3 rounded-lg border border-cyan-900/20 italic">
                  "{move.description}"
                </p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="space-y-2">
              <h4 className="text-[8px] font-bold tracking-wider text-cyan-600 uppercase font-hud tracking-widest border-b border-cyan-900/30 pb-1">
                Performance Metrics
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-cyan-900/30 flex flex-col items-center justify-center gap-1">
                  <span className="text-[8px] font-bold tracking-wider text-cyan-700 uppercase font-hud">Power</span>
                  <span className="text-xl font-mono text-cyan-400">{move.power != null ? move.power : '--'}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-cyan-900/30 flex flex-col items-center justify-center gap-1">
                  <span className="text-[8px] font-bold tracking-wider text-cyan-700 uppercase font-hud">Accuracy</span>
                  <span className="text-xl font-mono text-cyan-400">
                    {move.accuracy != null ? `${move.accuracy}%` : '--'}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-cyan-900/30 flex flex-col items-center justify-center gap-1 col-span-2 sm:col-span-1">
                  <span className="text-[8px] font-bold tracking-wider text-cyan-700 uppercase font-hud">Effect Chance</span>
                  <span className="text-xl font-mono text-cyan-400">
                    {move.effect_chance != null ? `${move.effect_chance}%` : '--'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stat Changes */}
            {move.stat_changes && move.stat_changes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[8px] font-bold tracking-wider text-cyan-600 uppercase font-hud tracking-widest border-b border-cyan-900/30 pb-1">
                  Modifier Effects
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {move.stat_changes.map((sc, i) => (
                    <div
                      key={`sc-${sc.stat?.name || i}-${i}`}
                      className="bg-slate-950/50 p-2 rounded border border-cyan-900/20 flex justify-between items-center"
                    >
                      <span className="text-cyan-400 text-[10px] font-bold tracking-wider font-hud uppercase">
                        {sc.stat.name.replace(/-/g, ' ')}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-bold tracking-wider font-mono",
                          sc.change > 0 ? "text-green-400" : "text-red-400"
                        )}
                      >
                        {sc.change > 0 ? `+${sc.change}` : sc.change} STAGE
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Meta */}
            {move.meta && (
              <div className="space-y-2">
                <h4 className="text-[8px] font-bold tracking-wider text-cyan-600 uppercase font-hud tracking-widest border-b border-cyan-900/30 pb-1">
                  Additional Data
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[9px] font-bold tracking-wider font-mono text-slate-400">
                  {move.meta.ailment && move.meta.ailment.name !== 'none' && (
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span>AILMENT:</span>
                      <span className="text-red-400 uppercase">{move.meta.ailment.name}</span>
                    </div>
                  )}
                  {move.priority !== undefined && (
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span>PRIORITY:</span>
                      <span className="text-cyan-400">{move.priority}</span>
                    </div>
                  )}
                  {move.target && (
                    <div className="flex justify-between border-b border-slate-800 pb-1 col-span-2">
                      <span>TARGET:</span>
                      <span className="text-slate-200 uppercase">{move.target.replace(/-/g, ' ')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-2 bg-cyan-600 hover:bg-cyan-500 font-hud text-[10px] font-bold tracking-wider uppercase tracking-widest rounded-full transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] cursor-pointer"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
