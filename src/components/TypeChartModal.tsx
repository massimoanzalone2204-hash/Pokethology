import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Layers, X } from 'lucide-react';

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

  const typesList = useMemo(() => {
    return Object.keys(TYPE_CHART).filter(t => t !== 'stellar');
  }, [TYPE_CHART]);

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
        <header className="shrink-0 bg-slate-900/40 backdrop-blur-md px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between gap-3 z-30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-600/20 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.25)] shrink-0">
              <Layers className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="font-hud font-black text-base sm:text-xl text-red-400 uppercase tracking-widest sm:tracking-[0.2em] leading-none">
                TYPE TABLE
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              try { sounds?.scan?.(); } catch (_) {}
            }}
            className="p-2 sm:px-4 sm:py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-2 text-xs font-hud font-bold uppercase tracking-wider group shrink-0"
            title="Close (Esc)"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span className="hidden sm:inline">CLOSE</span>
          </button>
        </header>

        {/* Content Area - Full-Screen Open Space Type Matrix Table */}
        <div className="flex-1 overflow-auto custom-scrollbar relative p-3 sm:p-6 md:p-8 w-full z-10">
          <div className="w-max min-w-full relative pb-12 pr-8">
            {/* Sticky Top Header (Defenders) */}
            <div className="sticky top-0 z-30 grid grid-cols-[80px_repeat(18,minmax(32px,1fr))] sm:grid-cols-[120px_repeat(18,minmax(52px,1fr))] gap-1 sm:gap-1.5 mb-1.5 bg-slate-950/90 backdrop-blur-md py-2">
              <div className="sticky left-0 z-40 h-10 sm:h-12 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md rounded-xl px-1">
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
                      "w-7 h-10 sm:w-11 sm:h-12 flex items-center justify-center text-[7px] sm:text-[9px] font-hud font-black uppercase tracking-tight rounded-xl transition-all duration-150",
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
            <div className="space-y-1 sm:space-y-1.5">
              {typesList.map(atkType => {
                const isRowSelected = selectedAttacker === atkType || hoveredCell?.attacker === atkType;
                return (
                  <div 
                    key={`atk-row-${atkType}`} 
                    className={cn(
                      "grid grid-cols-[80px_repeat(18,minmax(32px,1fr))] sm:grid-cols-[120px_repeat(18,minmax(52px,1fr))] gap-1 sm:gap-1.5 items-center rounded-xl transition-colors group/row",
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
                        "sticky left-0 z-20 h-7 sm:h-9 flex items-center justify-between px-2 sm:px-3 rounded-xl text-[8px] sm:text-[10px] font-hud font-black uppercase tracking-wider cursor-pointer transition-all",
                        typeColors[atkType] || "bg-slate-700",
                        isRowSelected ? "ring-2 ring-red-400 scale-102 shadow-[0_0_15px_rgba(239,68,68,0.6)]" : "opacity-90 hover:opacity-100 group-hover/row:scale-102"
                      )}
                    >
                      <span className="text-white drop-shadow-md">{atkType}</span>
                    </div>

                    {/* Multiplier Cells */}
                    {typesList.map(defType => {
                      const multiplier = TYPE_CHART[atkType]?.[defType] ?? 1;
                      const isCellHighlighted = (hoveredCell?.attacker === atkType && hoveredCell?.defender === defType) ||
                                                (selectedAttacker === atkType || selectedDefender === defType);

                      let cellStyle = "bg-slate-900/30 text-slate-600 hover:bg-slate-800/40";
                      let cellText = "";

                      if (multiplier === 2) {
                        cellStyle = "bg-emerald-500/25 text-emerald-300 font-bold shadow-[0_0_8px_rgba(16,185,129,0.25)] hover:bg-emerald-500/40";
                        cellText = "2×";
                      } else if (multiplier === 0.5) {
                        cellStyle = "bg-rose-500/25 text-rose-300 font-bold shadow-[0_0_8px_rgba(244,63,94,0.25)] hover:bg-rose-500/40";
                        cellText = "½";
                      } else if (multiplier === 0) {
                        cellStyle = "bg-slate-900/60 text-slate-400 font-black hover:bg-slate-800";
                        cellText = "0";
                      }

                      return (
                        <div
                          key={`cell-${atkType}-${defType}`}
                          onMouseEnter={() => setHoveredCell({ attacker: atkType, defender: defType, multiplier })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={cn(
                            "h-7 sm:h-9 flex items-center justify-center text-[9px] sm:text-xs font-mono font-black rounded-lg transition-all duration-100 cursor-pointer",
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
      </motion.div>
    </AnimatePresence>
  );
};

