import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { HUDCorners } from './HUDCorners';
import { Layers, X, Swords, Shield } from 'lucide-react';

export interface TypeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  typeColors: Record<string, string>;
  TYPE_CHART: Record<string, Record<string, number>>;
  isLightMode?: boolean;
  sounds?: any;
}

export const TypeChartModal: React.FC<TypeChartModalProps> = ({
  isOpen,
  onClose,
  typeColors,
  TYPE_CHART,
  sounds
}) => {
  const [selectedAttacker, setSelectedAttacker] = useState<string | null>(null);
  const [selectedDefender, setSelectedDefender] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ attacker: string; defender: string; multiplier: number } | null>(null);

  const typesList = useMemo(() => Object.keys(typeColors), [typeColors]);

  // Keyboard accessibility: ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="type-chart-fullscreen-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] flex flex-col bg-slate-950/98 backdrop-blur-2xl overflow-hidden text-slate-100 font-sans select-none"
      >
        {/* Ambient Background Accents */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <header className="shrink-0 border-b border-red-500/30 bg-slate-900/90 px-4 sm:px-8 py-3 flex items-center justify-between gap-3 z-30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-600/20 border border-red-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.35)] shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-hud font-black text-sm sm:text-lg text-red-400 uppercase tracking-wider sm:tracking-[0.2em] leading-none">
                  TYPE EFFECTIVENESS CHART
                </h2>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold uppercase">
                  18 Standard Types
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] font-mono text-slate-400 tracking-wider uppercase mt-0.5 hidden sm:block">
                Offensive & Defensive Multipliers Grid
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              try { sounds?.scan?.(); } catch (_) {}
            }}
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-hud font-bold uppercase tracking-wider group shadow-sm shrink-0"
            title="Close (Esc)"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span className="hidden sm:inline">CLOSE</span>
          </button>
        </header>

        {/* Content Area - Full Matrix Grid */}
        <div className="flex-1 overflow-hidden flex flex-col p-2 sm:p-4 md:p-6 max-w-[1700px] w-full mx-auto relative z-10">
          <div className="flex-1 flex flex-col bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xl relative">
            <HUDCorners />

            {/* Legend & Hover Info Bar */}
            <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] sm:text-xs">
                  <Swords className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-slate-300 font-bold uppercase">Rows:</span> Attacking
                  <span className="mx-1 text-slate-600">|</span>
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-slate-300 font-bold uppercase">Columns:</span> Defending
                </div>
              </div>

              {/* Hover Cell Display */}
              {hoveredCell ? (
                <div className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono flex items-center gap-2 shadow-inner">
                  <span className="font-bold uppercase text-white">{hoveredCell.attacker}</span>
                  <span className="text-slate-400">➜</span>
                  <span className="font-bold uppercase text-white">{hoveredCell.defender}</span>
                  <span className="text-slate-400">=</span>
                  <span className={cn(
                    "font-black px-1.5 py-0.5 rounded text-[11px]",
                    hoveredCell.multiplier === 2 ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" :
                    hoveredCell.multiplier === 0.5 ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" :
                    hoveredCell.multiplier === 0 ? "bg-slate-800 text-slate-400 border border-slate-700" :
                    "bg-slate-900 text-slate-300"
                  )}>
                    {hoveredCell.multiplier === 2 ? "2× Super Effective" :
                     hoveredCell.multiplier === 0.5 ? "½× Not Very Effective" :
                     hoveredCell.multiplier === 0 ? "0× Immune" :
                     "1× Normal"}
                  </span>
                </div>
              ) : (
                <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
                  Hover over or tap any cell to inspect damage multiplier.
                </div>
              )}
            </div>

            {/* Scrollable Matrix Table Container */}
            <div className="flex-1 overflow-auto custom-scrollbar relative p-2 sm:p-4 bg-slate-950/40">
              <div className="w-max min-w-full relative pb-6 pr-6">
                {/* Sticky Top Header (Defenders) */}
                <div className="sticky top-0 z-30 grid grid-cols-[80px_repeat(18,minmax(32px,1fr))] sm:grid-cols-[120px_repeat(18,minmax(48px,1fr))] gap-1 sm:gap-1.5 mb-1.5 bg-slate-900/95 backdrop-blur-md pt-2 pb-2 px-1 border-b border-slate-800 rounded-t-xl">
                  <div className="sticky left-0 z-40 h-10 sm:h-12 flex flex-col items-center justify-center bg-slate-950 rounded-lg border border-slate-800 shadow-[4px_0_12px_rgba(0,0,0,0.6)] px-1">
                    <span className="text-[8px] sm:text-[10px] font-black text-red-400 font-hud uppercase tracking-wider leading-none">ATK</span>
                    <span className="text-[7px] text-slate-500 font-mono">VS</span>
                    <span className="text-[8px] sm:text-[10px] font-black text-cyan-400 font-hud uppercase tracking-wider leading-none">DEF</span>
                  </div>

                  {typesList.map(defType => {
                    const isColSelected = selectedDefender === defType || hoveredCell?.defender === defType;
                    return (
                      <div 
                        key={`def-hdr-${defType}`} 
                        onClick={() => {
                          setSelectedDefender(prev => prev === defType ? null : defType);
                          try { sounds?.typing?.(); } catch (_) {}
                        }}
                        className="h-10 sm:h-12 flex items-center justify-center cursor-pointer group"
                      >
                        <div className={cn(
                          "w-7 h-10 sm:w-11 sm:h-12 flex items-center justify-center text-[7px] sm:text-[9px] font-hud font-black uppercase tracking-tight rounded-lg shadow-md transition-all duration-150 border",
                          typeColors[defType] || "bg-slate-700",
                          isColSelected ? "ring-2 ring-cyan-400 scale-105 shadow-[0_0_12px_rgba(6,182,212,0.6)]" : "opacity-90 hover:opacity-100 hover:scale-105"
                        )}>
                          <span className="drop-shadow-md text-white">
                            {defType.slice(0, 3)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Matrix Rows (Attackers) */}
                <div className="space-y-1 sm:space-y-1.5 px-1">
                  {typesList.map(atkType => {
                    const isRowSelected = selectedAttacker === atkType || hoveredCell?.attacker === atkType;
                    return (
                      <div 
                        key={`atk-row-${atkType}`} 
                        className={cn(
                          "grid grid-cols-[80px_repeat(18,minmax(32px,1fr))] sm:grid-cols-[120px_repeat(18,minmax(48px,1fr))] gap-1 sm:gap-1.5 items-center rounded-lg transition-colors group/row",
                          isRowSelected && "bg-red-950/20"
                        )}
                      >
                        {/* Sticky Left Attacker Label */}
                        <div 
                          onClick={() => {
                            setSelectedAttacker(prev => prev === atkType ? null : atkType);
                            try { sounds?.typing?.(); } catch (_) {}
                          }}
                          className={cn(
                            "sticky left-0 z-20 h-7 sm:h-9 flex items-center justify-between px-2 sm:px-3 rounded-lg text-[8px] sm:text-[10px] font-hud font-black uppercase tracking-wider shadow-[4px_0_10px_rgba(0,0,0,0.5)] cursor-pointer transition-all border",
                            typeColors[atkType] || "bg-slate-700",
                            isRowSelected ? "ring-2 ring-red-400 scale-102 shadow-[0_0_15px_rgba(239,68,68,0.6)]" : "opacity-90 hover:opacity-100 group-hover/row:scale-102"
                          )}
                        >
                          <span className="text-white drop-shadow-md">{atkType}</span>
                          <Swords className="w-2.5 h-2.5 opacity-60 hidden sm:block text-white" />
                        </div>

                        {/* Multiplier Cells */}
                        {typesList.map(defType => {
                          const multiplier = TYPE_CHART[atkType]?.[defType] ?? 1;
                          const isCellHighlighted = (hoveredCell?.attacker === atkType && hoveredCell?.defender === defType) ||
                                                    (selectedAttacker === atkType || selectedDefender === defType);

                          let cellStyle = "bg-slate-950/40 border-slate-800/40 text-slate-600 hover:border-slate-500";
                          let cellText = "";

                          if (multiplier === 2) {
                            cellStyle = "bg-emerald-500/25 border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_8px_rgba(16,185,129,0.25)] hover:bg-emerald-500/40";
                            cellText = "2×";
                          } else if (multiplier === 0.5) {
                            cellStyle = "bg-rose-500/25 border-rose-500/60 text-rose-300 font-bold shadow-[0_0_8px_rgba(244,63,94,0.25)] hover:bg-rose-500/40";
                            cellText = "½";
                          } else if (multiplier === 0) {
                            cellStyle = "bg-slate-900 border-slate-700 text-slate-400 font-black hover:bg-slate-800";
                            cellText = "0";
                          }

                          return (
                            <div
                              key={`cell-${atkType}-${defType}`}
                              onMouseEnter={() => setHoveredCell({ attacker: atkType, defender: defType, multiplier })}
                              onMouseLeave={() => setHoveredCell(null)}
                              className={cn(
                                "h-7 sm:h-9 flex items-center justify-center text-[9px] sm:text-xs font-mono font-black rounded-md sm:rounded-lg border transition-all duration-100 cursor-pointer",
                                cellStyle,
                                isCellHighlighted && "ring-1 ring-white/50 scale-105 z-10"
                              )}
                              title={`${atkType.toUpperCase()} vs ${defType.toUpperCase()}: ${multiplier}x`}
                            >
                              {cellText}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Legend Footer */}
          <footer className="mt-3 bg-slate-950/90 border border-slate-800/80 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 shadow-lg">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-emerald-500/30 border border-emerald-500 rounded text-[9px] font-mono font-bold flex items-center justify-center text-emerald-400">2×</div>
                <span className="text-[10px] font-hud font-bold text-emerald-400 uppercase tracking-wider">Super Effective</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-rose-500/30 border border-rose-500 rounded text-[9px] font-mono font-bold flex items-center justify-center text-rose-400">½</div>
                <span className="text-[10px] font-hud font-bold text-rose-400 uppercase tracking-wider">Not Very Effective</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-slate-800 border border-slate-700 rounded text-[9px] font-mono font-bold flex items-center justify-center text-slate-400">0</div>
                <span className="text-[10px] font-hud font-bold text-slate-400 uppercase tracking-wider">Immune (0×)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-slate-950 border border-slate-800 rounded"></div>
                <span className="text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider">Standard (1×)</span>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden lg:block">
              Press [ESC] or click Close to return
            </div>
          </footer>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
