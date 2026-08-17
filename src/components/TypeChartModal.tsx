import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, hudButtonClass } from '../lib/utils';
import { HUDCorners } from './HUDCorners';
import { 
  Layers, 
  X, 
  Search, 
  Shield, 
  Swords, 
  Sparkles, 
  Info, 
  Filter, 
  Check, 
  Maximize2,
  HelpCircle,
  Flame,
  Droplets,
  Zap,
  Leaf
} from 'lucide-react';

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
  isLightMode = false,
  sounds
}) => {
  const [selectedAttacker, setSelectedAttacker] = useState<string | null>(null);
  const [selectedDefender, setSelectedDefender] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ attacker: string; defender: string; multiplier: number } | null>(null);
  const [viewMode, setViewMode] = useState<'matrix' | 'inspector'>('matrix');
  const [inspectorType, setInspectorType] = useState<string>('fire');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const typesList = useMemo(() => Object.keys(typeColors), [typeColors]);

  const filteredTypes = useMemo(() => {
    if (!searchFilter.trim()) return typesList;
    return typesList.filter(t => t.toLowerCase().includes(searchFilter.toLowerCase()));
  }, [typesList, searchFilter]);

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

  // Inspector statistics for chosen type
  const inspectorStats = useMemo(() => {
    const type = inspectorType.toLowerCase();
    const superEffectiveAgainst: string[] = [];
    const notVeryEffectiveAgainst: string[] = [];
    const noEffectAgainst: string[] = [];

    const weakTo: string[] = [];
    const resistantTo: string[] = [];
    const immuneTo: string[] = [];

    // Offense (When this type attacks)
    typesList.forEach(def => {
      const mult = TYPE_CHART[type]?.[def] ?? 1;
      if (mult === 2) superEffectiveAgainst.push(def);
      else if (mult === 0.5) notVeryEffectiveAgainst.push(def);
      else if (mult === 0) noEffectAgainst.push(def);
    });

    // Defense (When this type is attacked)
    typesList.forEach(atk => {
      const mult = TYPE_CHART[atk]?.[type] ?? 1;
      if (mult === 2) weakTo.push(atk);
      else if (mult === 0.5) resistantTo.push(atk);
      else if (mult === 0) immuneTo.push(atk);
    });

    return {
      superEffectiveAgainst,
      notVeryEffectiveAgainst,
      noEffectAgainst,
      weakTo,
      resistantTo,
      immuneTo
    };
  }, [inspectorType, typesList, TYPE_CHART]);

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
        {/* Ambient Glowing Background */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top System Header Bar */}
        <header className="shrink-0 border-b border-red-500/30 bg-slate-900/90 px-4 sm:px-8 py-3 flex items-center justify-between gap-3 z-30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-600/20 border border-red-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.35)] shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-hud font-black text-sm sm:text-lg text-red-400 uppercase tracking-wider sm:tracking-[0.2em] leading-none">
                  TYPE EFFECTIVENESS MATRIX
                </h2>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold uppercase">
                  18 Standard Types
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] font-mono text-slate-400 tracking-wider uppercase mt-0.5 hidden sm:block">
                Offensive & Defensive Multiplier Registry • Real-Time Combat Calculations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setViewMode('matrix');
                  try { sounds?.scan(); } catch (_) {}
                }}
                className={cn(
                  "px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-hud font-bold uppercase tracking-wider transition-all flex items-center gap-1.5",
                  viewMode === 'matrix' 
                    ? "bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]" 
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Matrix View</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('inspector');
                  try { sounds?.scan(); } catch (_) {}
                }}
                className={cn(
                  "px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-hud font-bold uppercase tracking-wider transition-all flex items-center gap-1.5",
                  viewMode === 'inspector' 
                    ? "bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]" 
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Type Inspector</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                try { sounds?.scan(); } catch (_) {}
              }}
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-hud font-bold uppercase tracking-wider group shadow-sm shrink-0"
              title="Close (Esc)"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              <span className="hidden sm:inline">CLOSE</span>
            </button>
          </div>
        </header>

        {/* Content Area - Fits full screen */}
        <div className="flex-1 overflow-hidden flex flex-col p-2 sm:p-4 md:p-6 max-w-[1700px] w-full mx-auto relative z-10">
          {viewMode === 'matrix' ? (
            <div className="flex-1 flex flex-col bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xl relative">
              <HUDCorners />

              {/* Sub-header Filter & Info Bar */}
              <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] sm:text-xs">
                    <Swords className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-slate-300 font-bold uppercase">Rows:</span> Attacking Type
                    <span className="mx-1 text-slate-600">|</span>
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-slate-300 font-bold uppercase">Columns:</span> Defending Type
                  </div>
                </div>

                {/* Hover / Selection Live Tooltip */}
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
                       hoveredCell.multiplier === 0 ? "0× No Effect (Immune)" :
                       "1× Normal Damage"}
                    </span>
                  </div>
                ) : (
                  <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
                    Hover over or tap any matrix cell to inspect specific damage multipliers.
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
                                onClick={() => {
                                  setInspectorType(atkType);
                                  setViewMode('inspector');
                                  try { sounds?.scan(); } catch (_) {}
                                }}
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
          ) : (
            /* Inspector View */
            <div className="flex-1 flex flex-col md:flex-row gap-4 bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-6 overflow-hidden shadow-2xl relative">
              <HUDCorners />

              {/* Left Column: Type Selector Chips */}
              <div className="w-full md:w-64 flex flex-col gap-3 shrink-0 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-red-400" />
                  <h3 className="font-hud font-black text-xs sm:text-sm text-slate-200 uppercase tracking-wider">
                    Select Target Type
                  </h3>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search type..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-red-500/60 font-mono"
                  />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar max-h-48 md:max-h-full grid grid-cols-2 md:grid-cols-1 gap-1.5 pr-1">
                  {filteredTypes.map(t => {
                    const isSelected = inspectorType.toLowerCase() === t.toLowerCase();
                    return (
                      <button
                        key={`inspect-btn-${t}`}
                        type="button"
                        onClick={() => {
                          setInspectorType(t);
                          try { sounds?.scan(); } catch (_) {}
                        }}
                        className={cn(
                          "px-3 py-2 rounded-xl text-left font-hud font-bold text-xs uppercase tracking-wider flex items-center justify-between border transition-all cursor-pointer",
                          typeColors[t] || "bg-slate-800",
                          isSelected 
                            ? "ring-2 ring-white scale-102 shadow-[0_0_15px_rgba(255,255,255,0.4)]" 
                            : "opacity-80 hover:opacity-100 hover:scale-101"
                        )}
                      >
                        <span className="text-white drop-shadow-md">{t}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Detailed Breakdown for selected type */}
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-5 pr-1">
                {/* Header Banner */}
                <div className={cn(
                  "p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 relative overflow-hidden shadow-xl",
                  typeColors[inspectorType] || "bg-slate-800"
                )}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-black/30 border border-white/30 backdrop-blur-md flex items-center justify-center text-white text-2xl font-hud font-black uppercase shadow-inner">
                      {inspectorType.slice(0, 2)}
                    </div>
                    <div>
                      <span className="text-[10px] font-hud font-black uppercase tracking-widest text-white/80">Elemental Profile</span>
                      <h2 className="text-2xl sm:text-3xl font-hud font-black uppercase tracking-wider text-white drop-shadow-lg">
                        {inspectorType} TYPE
                      </h2>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/20 text-center">
                      <span className="text-[9px] font-mono block text-slate-300 uppercase">Super Effective</span>
                      <span className="text-sm font-hud font-black text-emerald-400">{inspectorStats.superEffectiveAgainst.length} Types</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/20 text-center">
                      <span className="text-[9px] font-mono block text-slate-300 uppercase">Weaknesses</span>
                      <span className="text-sm font-hud font-black text-rose-400">{inspectorStats.weakTo.length} Types</span>
                    </div>
                  </div>
                </div>

                {/* Offensive Profile */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Swords className="w-4 h-4 text-red-400" />
                    <h3 className="font-hud font-black text-xs sm:text-sm text-slate-200 uppercase tracking-widest">
                      Offensive Matchups (When {inspectorType} Attacks)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Super Effective */}
                    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-emerald-400 font-hud text-xs font-black uppercase">
                        <span>Super Effective (2×)</span>
                        <span>{inspectorStats.superEffectiveAgainst.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {inspectorStats.superEffectiveAgainst.length > 0 ? (
                          inspectorStats.superEffectiveAgainst.map(t => (
                            <span key={t} className={cn("px-2.5 py-1 rounded-md text-[10px] font-hud font-bold uppercase text-white shadow-sm", typeColors[t] || "bg-slate-700")}>
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] font-mono text-slate-500">None</span>
                        )}
                      </div>
                    </div>

                    {/* Not Very Effective */}
                    <div className="bg-slate-900/90 border border-rose-500/30 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-rose-400 font-hud text-xs font-black uppercase">
                        <span>Not Very Effective (½×)</span>
                        <span>{inspectorStats.notVeryEffectiveAgainst.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {inspectorStats.notVeryEffectiveAgainst.length > 0 ? (
                          inspectorStats.notVeryEffectiveAgainst.map(t => (
                            <span key={t} className={cn("px-2.5 py-1 rounded-md text-[10px] font-hud font-bold uppercase text-white shadow-sm", typeColors[t] || "bg-slate-700")}>
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] font-mono text-slate-500">None</span>
                        )}
                      </div>
                    </div>

                    {/* No Effect */}
                    <div className="bg-slate-900/90 border border-slate-700/50 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-slate-400 font-hud text-xs font-black uppercase">
                        <span>No Effect (0×)</span>
                        <span>{inspectorStats.noEffectAgainst.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {inspectorStats.noEffectAgainst.length > 0 ? (
                          inspectorStats.noEffectAgainst.map(t => (
                            <span key={t} className={cn("px-2.5 py-1 rounded-md text-[10px] font-hud font-bold uppercase text-white shadow-sm", typeColors[t] || "bg-slate-700")}>
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] font-mono text-slate-500">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Defensive Profile */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-hud font-black text-xs sm:text-sm text-slate-200 uppercase tracking-widest">
                      Defensive Resistances (When {inspectorType} Defends)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Weaknesses */}
                    <div className="bg-slate-900/90 border border-rose-500/30 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-rose-400 font-hud text-xs font-black uppercase">
                        <span>Weak To (Takes 2×)</span>
                        <span>{inspectorStats.weakTo.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {inspectorStats.weakTo.length > 0 ? (
                          inspectorStats.weakTo.map(t => (
                            <span key={t} className={cn("px-2.5 py-1 rounded-md text-[10px] font-hud font-bold uppercase text-white shadow-sm", typeColors[t] || "bg-slate-700")}>
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] font-mono text-slate-500">None</span>
                        )}
                      </div>
                    </div>

                    {/* Resistances */}
                    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-emerald-400 font-hud text-xs font-black uppercase">
                        <span>Resists (Takes ½×)</span>
                        <span>{inspectorStats.resistantTo.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {inspectorStats.resistantTo.length > 0 ? (
                          inspectorStats.resistantTo.map(t => (
                            <span key={t} className={cn("px-2.5 py-1 rounded-md text-[10px] font-hud font-bold uppercase text-white shadow-sm", typeColors[t] || "bg-slate-700")}>
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] font-mono text-slate-500">None</span>
                        )}
                      </div>
                    </div>

                    {/* Immunities */}
                    <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-cyan-400 font-hud text-xs font-black uppercase">
                        <span>Immune To (Takes 0×)</span>
                        <span>{inspectorStats.immuneTo.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {inspectorStats.immuneTo.length > 0 ? (
                          inspectorStats.immuneTo.map(t => (
                            <span key={t} className={cn("px-2.5 py-1 rounded-md text-[10px] font-hud font-bold uppercase text-white shadow-sm", typeColors[t] || "bg-slate-700")}>
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] font-mono text-slate-500">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Legend Bar */}
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
