import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, playHaptic } from '../lib/utils';
import { HUDCorners } from './HUDCorners';
import { TypeBadge } from './TypeBadge';
import { 
  Layers, 
  X, 
  Search, 
  Shield, 
  Swords, 
  Sparkles, 
  Info, 
  RotateCcw,
  Check, 
  ArrowRight,
  Calculator,
  Plus,
  HelpCircle
} from 'lucide-react';

export interface TypeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  typeColors: Record<string, string>;
  TYPE_CHART: Record<string, Record<string, number>>;
  isLightMode?: boolean;
  sounds?: any;
}

const ALL_18_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 
  'rock', 'ghost', 'dragon', 'steel', 'dark', 'fairy'
];

export const TypeChartModal: React.FC<TypeChartModalProps> = ({
  isOpen,
  onClose,
  typeColors,
  TYPE_CHART,
  isLightMode = false,
  sounds
}) => {
  // Navigation tab: 'explorer' (simple 1-tap card) | 'calculator' (vs evaluator) | 'matrix' (full 18x18 grid)
  const [activeTab, setActiveTab] = useState<'explorer' | 'calculator' | 'matrix'>('explorer');

  // Explorer State
  const [selectedPrimaryType, setSelectedPrimaryType] = useState<string>('fire');
  const [selectedSecondaryType, setSelectedSecondaryType] = useState<string | null>(null);
  const [typeSearch, setTypeSearch] = useState<string>('');

  // Calculator State
  const [calcAttacker, setCalcAttacker] = useState<string>('water');
  const [calcDefender1, setCalcDefender1] = useState<string>('fire');
  const [calcDefender2, setCalcDefender2] = useState<string | null>(null);

  // Matrix State
  const [hoveredCell, setHoveredCell] = useState<{ attacker: string; defender: string; multiplier: number } | null>(null);
  const [matrixFilterAtk, setMatrixFilterAtk] = useState<string | null>(null);
  const [matrixFilterDef, setMatrixFilterDef] = useState<string | null>(null);

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

  // Types list
  const availableTypes = useMemo(() => {
    const list = Object.keys(TYPE_CHART).length > 0 ? Object.keys(TYPE_CHART) : ALL_18_TYPES;
    return list;
  }, [TYPE_CHART]);

  const filteredTypes = useMemo(() => {
    if (!typeSearch.trim()) return availableTypes;
    return availableTypes.filter(t => t.toLowerCase().includes(typeSearch.toLowerCase().trim()));
  }, [availableTypes, typeSearch]);

  // Calculations for Explorer Mode (Offense of Primary Type & Defense of Primary + Optional Secondary Type)
  const explorerMatchups = useMemo(() => {
    const primary = selectedPrimaryType.toLowerCase();
    const secondary = selectedSecondaryType?.toLowerCase();

    // 1. Offense (When attacking as the Primary Type)
    const superEffectiveOffense: string[] = [];
    const notVeryEffectiveOffense: string[] = [];
    const noEffectOffense: string[] = [];
    const normalOffense: string[] = [];

    availableTypes.forEach(defType => {
      const mult = TYPE_CHART[primary]?.[defType] ?? 1;
      if (mult === 2) superEffectiveOffense.push(defType);
      else if (mult === 0.5) notVeryEffectiveOffense.push(defType);
      else if (mult === 0) noEffectOffense.push(defType);
      else normalOffense.push(defType);
    });

    // 2. Defense (When defending as Primary + Optional Secondary)
    const quadWeakDef: string[] = [];
    const doubleWeakDef: string[] = [];
    const halfResistDef: string[] = [];
    const quadResistDef: string[] = [];
    const immuneDef: string[] = [];
    const normalDef: string[] = [];

    availableTypes.forEach(atkType => {
      let mult1 = TYPE_CHART[atkType]?.[primary] ?? 1;
      let mult2 = secondary ? (TYPE_CHART[atkType]?.[secondary] ?? 1) : 1;
      let totalMult = mult1 * mult2;

      if (totalMult >= 4) quadWeakDef.push(atkType);
      else if (totalMult === 2) doubleWeakDef.push(atkType);
      else if (totalMult === 0.5) halfResistDef.push(atkType);
      else if (totalMult <= 0.25 && totalMult > 0) quadResistDef.push(atkType);
      else if (totalMult === 0) immuneDef.push(atkType);
      else normalDef.push(atkType);
    });

    return {
      offense: {
        superEffective: superEffectiveOffense,
        notVeryEffective: notVeryEffectiveOffense,
        noEffect: noEffectOffense,
        normal: normalOffense
      },
      defense: {
        quadWeak: quadWeakDef,
        doubleWeak: doubleWeakDef,
        halfResist: halfResistDef,
        quadResist: quadResistDef,
        immune: immuneDef,
        normal: normalDef
      }
    };
  }, [selectedPrimaryType, selectedSecondaryType, availableTypes, TYPE_CHART]);

  // Calculator Result
  const calculatorResult = useMemo(() => {
    const atk = calcAttacker.toLowerCase();
    const def1 = calcDefender1.toLowerCase();
    const def2 = calcDefender2?.toLowerCase();

    let mult1 = TYPE_CHART[atk]?.[def1] ?? 1;
    let mult2 = def2 ? (TYPE_CHART[atk]?.[def2] ?? 1) : 1;
    let totalMult = mult1 * mult2;

    let rating: 'quad-super' | 'super' | 'normal' | 'resist' | 'quad-resist' | 'immune' = 'normal';
    let label = '1× Regular Damage';
    let colorClass = 'text-slate-300 bg-slate-900 border-slate-700';

    if (totalMult >= 4) {
      rating = 'quad-super';
      label = '4× Ultra Effective!';
      colorClass = 'text-emerald-300 bg-emerald-950/80 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.35)]';
    } else if (totalMult === 2) {
      rating = 'super';
      label = '2× Super Effective!';
      colorClass = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.25)]';
    } else if (totalMult === 0.5) {
      rating = 'resist';
      label = '½× Not Very Effective';
      colorClass = 'text-rose-400 bg-rose-950/60 border-rose-500/70 shadow-[0_0_15px_rgba(244,63,94,0.2)]';
    } else if (totalMult <= 0.25 && totalMult > 0) {
      rating = 'quad-resist';
      label = '¼× Heavily Resisted';
      colorClass = 'text-rose-400 bg-rose-950/80 border-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.35)]';
    } else if (totalMult === 0) {
      rating = 'immune';
      label = '0× No Effect (Immune)';
      colorClass = 'text-slate-400 bg-slate-950 border-slate-700';
    }

    return {
      totalMult,
      rating,
      label,
      colorClass
    };
  }, [calcAttacker, calcDefender1, calcDefender2, TYPE_CHART]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="type-chart-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-[200] flex flex-col bg-slate-950/98 backdrop-blur-2xl overflow-hidden text-slate-100 font-sans select-none"
      >
        {/* Subtle Ambient Accent Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <header className="shrink-0 border-b border-red-500/30 bg-slate-900/90 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 z-30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-600/20 border border-red-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.35)] shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-hud font-black text-sm sm:text-lg text-red-400 uppercase tracking-wider leading-none">
                  TYPE EFFECTIVENESS CHART
                </h2>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold uppercase">
                  18 Types
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] font-mono text-slate-400 tracking-wider uppercase mt-0.5 hidden sm:block">
                Simple Matchup Guide • Offense, Defense & Weaknesses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Navigation Tabs */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('explorer');
                  playHaptic('selection');
                  try { sounds?.scan(); } catch (_) {}
                }}
                className={cn(
                  "px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-hud font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer",
                  activeTab === 'explorer' 
                    ? "bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]" 
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Type Explorer</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('calculator');
                  playHaptic('selection');
                  try { sounds?.scan(); } catch (_) {}
                }}
                className={cn(
                  "px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-hud font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer",
                  activeTab === 'calculator' 
                    ? "bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]" 
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Vs Calculator</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('matrix');
                  playHaptic('selection');
                  try { sounds?.scan(); } catch (_) {}
                }}
                className={cn(
                  "px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-hud font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer",
                  activeTab === 'matrix' 
                    ? "bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]" 
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">18×18 Table</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                playHaptic('light');
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

        {/* Content Body Container */}
        <div 
          className="type-chart-container flex-1 overflow-hidden flex flex-col p-2 sm:p-4 md:p-6 max-w-6xl w-full mx-auto relative z-10 h-full max-h-[85vh]"
          style={{ objectFit: 'contain', height: '100%', maxHeight: '85vh' }}
        >
          {/* TAB 1: TYPE EXPLORER (Simple, Clear, Instant 1-Tap Info) */}
          {activeTab === 'explorer' && (
            <div className="flex-1 flex flex-col bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xl relative p-3 sm:p-5 gap-4">
              <HUDCorners />

              {/* Type Selection Strip */}
              <div className="shrink-0 space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-hud font-black text-slate-300 uppercase tracking-wider">
                      Select Type to Inspect:
                    </span>
                    {selectedSecondaryType && (
                      <span className="text-[10px] font-mono bg-cyan-950 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded-md font-bold">
                        Dual Type Defense Active
                      </span>
                    )}
                  </div>

                  {/* Dual Type Helper Button */}
                  <div className="flex items-center gap-2">
                    {selectedSecondaryType ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSecondaryType(null);
                          playHaptic('light');
                          try { sounds?.scan(); } catch (_) {}
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors border border-slate-700"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Remove 2nd Type ({selectedSecondaryType})
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                        (Tip: Tap + Secondary Type below to check dual-type defending Pokémon)
                      </span>
                    )}
                  </div>
                </div>

                {/* Horizontal Scrollable/Wrapped 18 Type Badges */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-24 sm:max-h-none overflow-y-auto custom-scrollbar pt-1">
                  {availableTypes.map(t => {
                    const isPrimary = selectedPrimaryType.toLowerCase() === t.toLowerCase();
                    const isSecondary = selectedSecondaryType?.toLowerCase() === t.toLowerCase();

                    return (
                      <button
                        key={`explorer-type-${t}`}
                        type="button"
                        onClick={() => {
                          if (isPrimary) return;
                          setSelectedPrimaryType(t);
                          if (selectedSecondaryType === t) {
                            setSelectedSecondaryType(null);
                          }
                          playHaptic('selection');
                          try { sounds?.scan(); } catch (_) {}
                        }}
                        className={cn(
                          "px-2.5 py-1 sm:py-1.5 rounded-lg text-xs font-hud font-black uppercase tracking-wider transition-all duration-150 flex items-center gap-1.5 cursor-pointer border",
                          typeColors[t] || "bg-slate-800",
                          isPrimary 
                            ? "ring-2 ring-white scale-105 shadow-[0_0_15px_rgba(255,255,255,0.4)] z-10" 
                            : isSecondary
                            ? "ring-2 ring-cyan-400 opacity-95 scale-102"
                            : "opacity-75 hover:opacity-100 hover:scale-102"
                        )}
                      >
                        <span className="text-white drop-shadow-md">{t}</span>
                        {isPrimary && <Check className="w-3.5 h-3.5 text-white" />}
                        {isSecondary && <span className="text-[9px] bg-cyan-900/90 text-cyan-200 px-1 rounded">2nd</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Optional Secondary Type Dropdown / Quick Select */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Defending 2nd Type (Optional):</span>
                  <select
                    value={selectedSecondaryType || ''}
                    onChange={(e) => {
                      const val = e.target.value || null;
                      setSelectedSecondaryType(val);
                      playHaptic('selection');
                      try { sounds?.scan(); } catch (_) {}
                    }}
                    className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 font-mono uppercase focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="">None (Single {selectedPrimaryType} Type)</option>
                    {availableTypes.filter(t => t !== selectedPrimaryType).map(t => (
                      <option key={`secondary-opt-${t}`} value={t}>
                        + {t.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Main 2-Column Matchup Display */}
              <div className="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4 pr-1">
                {/* 1. OFFENSIVE MATCHUPS */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Swords className="w-4 h-4 text-red-400" />
                      <h3 className="font-hud font-black text-xs sm:text-sm text-red-400 uppercase tracking-wider">
                        Attacking with {selectedPrimaryType.toUpperCase()}
                      </h3>
                    </div>
                    <TypeBadge type={selectedPrimaryType} size="xs" />
                  </div>

                  {/* Super Effective (2x) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-hud font-black uppercase text-emerald-400">
                      <span>🟢 Super Effective (2× Damage)</span>
                      <span className="font-mono bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/40">
                        {explorerMatchups.offense.superEffective.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-900/60 rounded-lg border border-slate-800/80">
                      {explorerMatchups.offense.superEffective.length > 0 ? (
                        explorerMatchups.offense.superEffective.map(t => (
                          <button
                            key={`off-super-${t}`}
                            type="button"
                            onClick={() => {
                              setSelectedPrimaryType(t);
                              playHaptic('selection');
                              try { sounds?.scan(); } catch (_) {}
                            }}
                            className={cn("px-2.5 py-1 rounded-md text-[10px] font-hud font-bold uppercase text-white shadow-sm hover:scale-105 transition-transform cursor-pointer border border-white/10", typeColors[t] || "bg-slate-700")}
                            title={`Click to view ${t.toUpperCase()}`}
                          >
                            {t}
                          </button>
                        ))
                      ) : (
                        <span className="text-[11px] font-mono text-slate-500 italic my-auto">No super effective matchups</span>
                      )}
                    </div>
                  </div>

                  {/* Not Very Effective (0.5x) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-hud font-black uppercase text-rose-400">
                      <span>🔴 Not Very Effective (½× Damage)</span>
                      <span className="font-mono bg-rose-950 px-1.5 py-0.5 rounded border border-rose-500/40">
                        {explorerMatchups.offense.notVeryEffective.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-900/60 rounded-lg border border-slate-800/80">
                      {explorerMatchups.offense.notVeryEffective.length > 0 ? (
                        explorerMatchups.offense.notVeryEffective.map(t => (
                          <button
                            key={`off-not-${t}`}
                            type="button"
                            onClick={() => {
                              setSelectedPrimaryType(t);
                              playHaptic('selection');
                              try { sounds?.scan(); } catch (_) {}
                            }}
                            className={cn("px-2.5 py-1 rounded-md text-[10px] font-hud font-bold uppercase text-white shadow-sm hover:scale-105 transition-transform cursor-pointer border border-white/10", typeColors[t] || "bg-slate-700")}
                            title={`Click to view ${t.toUpperCase()}`}
                          >
                            {t}
                          </button>
                        ))
                      ) : (
                        <span className="text-[11px] font-mono text-slate-500 italic my-auto">None</span>
                      )}
                    </div>
                  </div>

                  {/* No Effect (0x) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-hud font-black uppercase text-slate-400">
                      <span>⚫ No Effect (0× Damage)</span>
                      <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                        {explorerMatchups.offense.noEffect.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-900/60 rounded-lg border border-slate-800/80">
                      {explorerMatchups.offense.noEffect.length > 0 ? (
                        explorerMatchups.offense.noEffect.map(t => (
                          <button
                            key={`off-none-${t}`}
                            type="button"
                            onClick={() => {
                              setSelectedPrimaryType(t);
                              playHaptic('selection');
                              try { sounds?.scan(); } catch (_) {}
                            }}
                            className={cn("px-2.5 py-1 rounded-md text-[10px] font-hud font-bold uppercase text-white shadow-sm hover:scale-105 transition-transform cursor-pointer border border-white/10", typeColors[t] || "bg-slate-700")}
                            title={`Click to view ${t.toUpperCase()}`}
                          >
                            {t}
                          </button>
                        ))
                      ) : (
                        <span className="text-[11px] font-mono text-slate-500 italic my-auto">Deals damage to all types</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. DEFENSIVE MATCHUPS */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <h3 className="font-hud font-black text-xs sm:text-sm text-cyan-400 uppercase tracking-wider">
                        Defending as {selectedPrimaryType.toUpperCase()} {selectedSecondaryType ? `/ ${selectedSecondaryType.toUpperCase()}` : ''}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <TypeBadge type={selectedPrimaryType} size="xs" />
                      {selectedSecondaryType && <TypeBadge type={selectedSecondaryType} size="xs" />}
                    </div>
                  </div>

                  {/* Weaknesses (2x and 4x) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-hud font-black uppercase text-rose-400">
                      <span>🔴 Weaknesses (Takes 2× / 4× Damage)</span>
                      <span className="font-mono bg-rose-950 px-1.5 py-0.5 rounded border border-rose-500/40">
                        {explorerMatchups.defense.quadWeak.length + explorerMatchups.defense.doubleWeak.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-900/60 rounded-lg border border-slate-800/80">
                      {explorerMatchups.defense.quadWeak.map(t => (
                        <button
                          key={`def-quad-${t}`}
                          type="button"
                          onClick={() => {
                            setSelectedPrimaryType(t);
                            playHaptic('selection');
                            try { sounds?.scan(); } catch (_) {}
                          }}
                          className={cn("px-2.5 py-1 rounded-md text-[10px] font-hud font-black uppercase text-white shadow-sm hover:scale-105 transition-transform cursor-pointer border-2 border-rose-400 flex items-center gap-1", typeColors[t] || "bg-slate-700")}
                          title={`Takes 4x damage from ${t.toUpperCase()}`}
                        >
                          <span>{t}</span>
                          <span className="bg-rose-900/90 text-rose-200 px-1 py-0.2 rounded text-[8px]">4×</span>
                        </button>
                      ))}
                      {explorerMatchups.defense.doubleWeak.map(t => (
                        <button
                          key={`def-double-${t}`}
                          type="button"
                          onClick={() => {
                            setSelectedPrimaryType(t);
                            playHaptic('selection');
                            try { sounds?.scan(); } catch (_) {}
                          }}
                          className={cn("px-2.5 py-1 rounded-md text-[10px] font-hud font-bold uppercase text-white shadow-sm hover:scale-105 transition-transform cursor-pointer border border-white/10 flex items-center gap-1", typeColors[t] || "bg-slate-700")}
                          title={`Takes 2x damage from ${t.toUpperCase()}`}
                        >
                          <span>{t}</span>
                          <span className="bg-rose-950 text-rose-300 px-1 py-0.2 rounded text-[8px]">2×</span>
                        </button>
                      ))}
                      {explorerMatchups.defense.quadWeak.length === 0 && explorerMatchups.defense.doubleWeak.length === 0 && (
                        <span className="text-[11px] font-mono text-slate-500 italic my-auto">No weaknesses</span>
                      )}
                    </div>
                  </div>

                  {/* Resistances (0.5x and 0.25x) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-hud font-black uppercase text-emerald-400">
                      <span>🟢 Resistances (Takes ½× / ¼× Damage)</span>
                      <span className="font-mono bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/40">
                        {explorerMatchups.defense.halfResist.length + explorerMatchups.defense.quadResist.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-900/60 rounded-lg border border-slate-800/80">
                      {explorerMatchups.defense.quadResist.map(t => (
                        <button
                          key={`def-quad-res-${t}`}
                          type="button"
                          onClick={() => {
                            setSelectedPrimaryType(t);
                            playHaptic('selection');
                            try { sounds?.scan(); } catch (_) {}
                          }}
                          className={cn("px-2.5 py-1 rounded-md text-[10px] font-hud font-black uppercase text-white shadow-sm hover:scale-105 transition-transform cursor-pointer border-2 border-emerald-400 flex items-center gap-1", typeColors[t] || "bg-slate-700")}
                          title={`Takes 1/4x damage from ${t.toUpperCase()}`}
                        >
                          <span>{t}</span>
                          <span className="bg-emerald-900/90 text-emerald-200 px-1 py-0.2 rounded text-[8px]">¼×</span>
                        </button>
                      ))}
                      {explorerMatchups.defense.halfResist.map(t => (
                        <button
                          key={`def-half-res-${t}`}
                          type="button"
                          onClick={() => {
                            setSelectedPrimaryType(t);
                            playHaptic('selection');
                            try { sounds?.scan(); } catch (_) {}
                          }}
                          className={cn("px-2.5 py-1 rounded-md text-[10px] font-hud font-bold uppercase text-white shadow-sm hover:scale-105 transition-transform cursor-pointer border border-white/10 flex items-center gap-1", typeColors[t] || "bg-slate-700")}
                          title={`Takes 1/2x damage from ${t.toUpperCase()}`}
                        >
                          <span>{t}</span>
                          <span className="bg-emerald-950 text-emerald-300 px-1 py-0.2 rounded text-[8px]">½×</span>
                        </button>
                      ))}
                      {explorerMatchups.defense.halfResist.length === 0 && explorerMatchups.defense.quadResist.length === 0 && (
                        <span className="text-[11px] font-mono text-slate-500 italic my-auto">No resistances</span>
                      )}
                    </div>
                  </div>

                  {/* Immunities (0x) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-hud font-black uppercase text-cyan-400">
                      <span>🔵 Immunities (Takes 0× Damage)</span>
                      <span className="font-mono bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/40">
                        {explorerMatchups.defense.immune.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-900/60 rounded-lg border border-slate-800/80">
                      {explorerMatchups.defense.immune.length > 0 ? (
                        explorerMatchups.defense.immune.map(t => (
                          <button
                            key={`def-immune-${t}`}
                            type="button"
                            onClick={() => {
                              setSelectedPrimaryType(t);
                              playHaptic('selection');
                              try { sounds?.scan(); } catch (_) {}
                            }}
                            className={cn("px-2.5 py-1 rounded-md text-[10px] font-hud font-bold uppercase text-white shadow-sm hover:scale-105 transition-transform cursor-pointer border border-white/10", typeColors[t] || "bg-slate-700")}
                            title={`Immune to ${t.toUpperCase()}`}
                          >
                            {t}
                          </button>
                        ))
                      ) : (
                        <span className="text-[11px] font-mono text-slate-500 italic my-auto">Takes damage from all types</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VS CALCULATOR (Quick 1-on-1 Combat Evaluator) */}
          {activeTab === 'calculator' && (
            <div className="flex-1 flex flex-col bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xl relative p-4 sm:p-6 gap-5">
              <HUDCorners />

              <div className="text-center max-w-xl mx-auto space-y-1">
                <h3 className="text-base sm:text-lg font-hud font-black text-red-400 uppercase tracking-widest">
                  Matchup Evaluator
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Select an attacking move type and target defending type to test combat effectiveness.
                </p>
              </div>

              {/* Selector Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full items-center">
                {/* Attacker */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-red-500/30 flex flex-col gap-2.5 shadow-lg">
                  <div className="flex items-center gap-2 text-xs font-hud font-black text-red-400 uppercase">
                    <Swords className="w-4 h-4 text-red-400" />
                    <span>Attacking Move Type</span>
                  </div>
                  <select
                    value={calcAttacker}
                    onChange={(e) => {
                      setCalcAttacker(e.target.value);
                      playHaptic('selection');
                      try { sounds?.scan(); } catch (_) {}
                    }}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-sm rounded-xl p-2.5 font-hud font-bold uppercase cursor-pointer focus:outline-none focus:border-red-500"
                  >
                    {availableTypes.map(t => (
                      <option key={`calc-atk-${t}`} value={t}>{t.toUpperCase()}</option>
                    ))}
                  </select>
                  <div className="flex justify-center pt-1">
                    <TypeBadge type={calcAttacker} size="md" />
                  </div>
                </div>

                {/* Defender */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-cyan-500/30 flex flex-col gap-2.5 shadow-lg">
                  <div className="flex items-center justify-between text-xs font-hud font-black text-cyan-400 uppercase">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span>Defending Target</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={calcDefender1}
                      onChange={(e) => {
                        setCalcDefender1(e.target.value);
                        playHaptic('selection');
                        try { sounds?.scan(); } catch (_) {}
                      }}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl p-2 font-hud font-bold uppercase cursor-pointer focus:outline-none focus:border-cyan-500"
                    >
                      {availableTypes.map(t => (
                        <option key={`calc-def1-${t}`} value={t}>{t.toUpperCase()}</option>
                      ))}
                    </select>

                    <select
                      value={calcDefender2 || ''}
                      onChange={(e) => {
                        setCalcDefender2(e.target.value || null);
                        playHaptic('selection');
                        try { sounds?.scan(); } catch (_) {}
                      }}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl p-2 font-hud font-bold uppercase cursor-pointer focus:outline-none focus:border-cyan-500"
                    >
                      <option value="">None (Single)</option>
                      {availableTypes.filter(t => t !== calcDefender1).map(t => (
                        <option key={`calc-def2-${t}`} value={t}>+ {t.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-center gap-1.5 pt-1">
                    <TypeBadge type={calcDefender1} size="md" />
                    {calcDefender2 && <TypeBadge type={calcDefender2} size="md" />}
                  </div>
                </div>
              </div>

              {/* Big Result Card */}
              <div className="max-w-xl mx-auto w-full">
                <div className={cn(
                  "p-6 rounded-2xl border flex flex-col items-center justify-center text-center gap-3 transition-all duration-200",
                  calculatorResult.colorClass
                )}>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                    COMBAT EFFECTIVENESS MULTIPLIER
                  </span>
                  
                  <div className="text-2xl sm:text-4xl font-hud font-black uppercase tracking-wider">
                    {calculatorResult.label}
                  </div>

                  <p className="text-xs sm:text-sm font-sans text-slate-300 max-w-md">
                    {calculatorResult.totalMult >= 2 ? (
                      `A ${calcAttacker.toUpperCase()} attack deals super effective increased damage to a ${calcDefender1.toUpperCase()}${calcDefender2 ? ` / ${calcDefender2.toUpperCase()}` : ''} Pokémon.`
                    ) : calculatorResult.totalMult === 0.5 || calculatorResult.totalMult === 0.25 ? (
                      `A ${calcAttacker.toUpperCase()} attack is resisted and deals reduced damage to a ${calcDefender1.toUpperCase()}${calcDefender2 ? ` / ${calcDefender2.toUpperCase()}` : ''} Pokémon.`
                    ) : calculatorResult.totalMult === 0 ? (
                      `A ${calcAttacker.toUpperCase()} attack has zero effect against a ${calcDefender1.toUpperCase()}${calcDefender2 ? ` / ${calcDefender2.toUpperCase()}` : ''} Pokémon.`
                    ) : (
                      `A ${calcAttacker.toUpperCase()} attack deals standard 100% damage to a ${calcDefender1.toUpperCase()}${calcDefender2 ? ` / ${calcDefender2.toUpperCase()}` : ''} Pokémon.`
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FULL 18x18 MATRIX (Streamlined & Clean) */}
          {activeTab === 'matrix' && (
            <div className="flex-1 flex flex-col bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xl relative h-full max-h-[85vh]">
              <HUDCorners />

              {/* Sub-header Filter & Info Bar */}
              <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
                <div className="flex items-center gap-3 text-slate-400 font-mono text-[10px] sm:text-xs">
                  <div className="flex items-center gap-1">
                    <Swords className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-slate-300 font-bold uppercase">Rows:</span> Attacker
                  </div>
                  <span className="text-slate-600">|</span>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-slate-300 font-bold uppercase">Cols:</span> Defender
                  </div>
                </div>

                {hoveredCell ? (
                  <div className="px-3 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono flex items-center gap-1.5 shadow-inner">
                    <span className="font-bold uppercase text-white">{hoveredCell.attacker}</span>
                    <span className="text-slate-400">➜</span>
                    <span className="font-bold uppercase text-white">{hoveredCell.defender}</span>
                    <span className="text-slate-400">:</span>
                    <span className={cn(
                      "font-black px-1.5 py-0.2 rounded text-[11px]",
                      hoveredCell.multiplier === 2 ? "text-emerald-300" :
                      hoveredCell.multiplier === 0.5 ? "text-rose-300" :
                      hoveredCell.multiplier === 0 ? "text-slate-400" :
                      "text-slate-300"
                    )}>
                      {hoveredCell.multiplier === 2 ? "2× Super Effective" :
                       hoveredCell.multiplier === 0.5 ? "½× Not Very Effective" :
                       hoveredCell.multiplier === 0 ? "0× Immune" :
                       "1× Normal Damage"}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">
                    Hover over any cell to see damage multiplier
                  </span>
                )}
              </div>

              {/* Scrollable Matrix Table */}
              <div className="flex-1 overflow-auto custom-scrollbar relative p-2 sm:p-3 bg-slate-950/40">
                <div className="w-max min-w-full relative pb-4 pr-4">
                  {/* Sticky Top Header (Defenders) */}
                  <div className="sticky top-0 z-30 grid grid-cols-[80px_repeat(18,minmax(32px,1fr))] sm:grid-cols-[100px_repeat(18,minmax(42px,1fr))] gap-1 mb-1 bg-slate-900/95 backdrop-blur-md pt-1.5 pb-1.5 px-1 border-b border-slate-800 rounded-t-xl">
                    <div className="sticky left-0 z-40 h-8 sm:h-9 flex items-center justify-center bg-slate-950 rounded-lg border border-slate-800 px-1">
                      <span className="text-[8px] sm:text-[9px] font-black text-red-400 font-hud uppercase">ATK / DEF</span>
                    </div>

                    {availableTypes.map(defType => (
                      <div 
                        key={`def-hdr-${defType}`} 
                        onClick={() => {
                          setMatrixFilterDef(prev => prev === defType ? null : defType);
                          playHaptic('selection');
                        }}
                        className="h-8 sm:h-9 flex items-center justify-center cursor-pointer"
                      >
                        <div className={cn(
                          "w-full h-full flex items-center justify-center text-[7.5px] sm:text-[8.5px] font-hud font-black uppercase rounded-md shadow-sm transition-all border",
                          typeColors[defType] || "bg-slate-700",
                          matrixFilterDef === defType ? "ring-2 ring-cyan-400 scale-105" : "opacity-90 hover:opacity-100"
                        )}>
                          <span className="drop-shadow-md text-white">{defType.slice(0, 3)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Matrix Rows (Attackers) */}
                  <div className="space-y-1 px-1">
                    {availableTypes.map(atkType => (
                      <div 
                        key={`atk-row-${atkType}`} 
                        className="grid grid-cols-[80px_repeat(18,minmax(32px,1fr))] sm:grid-cols-[100px_repeat(18,minmax(42px,1fr))] gap-1 items-center"
                      >
                        {/* Sticky Left Attacker Label */}
                        <div 
                          onClick={() => {
                            setMatrixFilterAtk(prev => prev === atkType ? null : atkType);
                            playHaptic('selection');
                          }}
                          className={cn(
                            "sticky left-0 z-20 h-7 sm:h-8 flex items-center justify-between px-2 rounded-md text-[8px] sm:text-[9px] font-hud font-black uppercase tracking-wider shadow-md cursor-pointer transition-all border",
                            typeColors[atkType] || "bg-slate-700",
                            matrixFilterAtk === atkType ? "ring-2 ring-red-400 scale-102" : "opacity-90 hover:opacity-100"
                          )}
                        >
                          <span className="text-white drop-shadow-md truncate">{atkType}</span>
                        </div>

                        {/* Multiplier Cells */}
                        {availableTypes.map(defType => {
                          const multiplier = TYPE_CHART[atkType]?.[defType] ?? 1;
                          let cellStyle = "bg-slate-950/40 border-slate-800/40 text-slate-600";
                          let cellText = "";

                          if (multiplier === 2) {
                            cellStyle = "bg-emerald-500/25 border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_6px_rgba(16,185,129,0.2)]";
                            cellText = "2×";
                          } else if (multiplier === 0.5) {
                            cellStyle = "bg-rose-500/25 border-rose-500/60 text-rose-300 font-bold shadow-[0_0_6px_rgba(244,63,94,0.2)]";
                            cellText = "½";
                          } else if (multiplier === 0) {
                            cellStyle = "bg-slate-900 border-slate-700 text-slate-400 font-black";
                            cellText = "0";
                          }

                          return (
                            <div
                              key={`cell-${atkType}-${defType}`}
                              onMouseEnter={() => setHoveredCell({ attacker: atkType, defender: defType, multiplier })}
                              onMouseLeave={() => setHoveredCell(null)}
                              className={cn(
                                "h-7 sm:h-8 flex items-center justify-center text-[9px] sm:text-xs font-mono font-black rounded-md border transition-all duration-100 cursor-pointer",
                                cellStyle,
                                (matrixFilterAtk === atkType || matrixFilterDef === defType) && "ring-1 ring-white/60"
                              )}
                              title={`${atkType.toUpperCase()} vs ${defType.toUpperCase()}: ${multiplier}x`}
                            >
                              {cellText}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Simple Bottom Legend Bar */}
          <footer className="mt-2 bg-slate-950/90 border border-slate-800/80 rounded-xl px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 shadow-lg">
            <div className="flex flex-wrap items-center gap-4 justify-center">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-emerald-500/30 border border-emerald-500 rounded text-[9px] font-mono font-bold flex items-center justify-center text-emerald-400">2×</div>
                <span className="text-[10px] font-hud font-bold text-emerald-400 uppercase tracking-wider">Super Effective</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-rose-500/30 border border-rose-500 rounded text-[9px] font-mono font-bold flex items-center justify-center text-rose-400">½</div>
                <span className="text-[10px] font-hud font-bold text-rose-400 uppercase tracking-wider">Not Very Effective</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-slate-800 border border-slate-700 rounded text-[9px] font-mono font-bold flex items-center justify-center text-slate-400">0</div>
                <span className="text-[10px] font-hud font-bold text-slate-400 uppercase tracking-wider">Immune (0×)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-slate-950 border border-slate-800 rounded"></div>
                <span className="text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider">Normal (1×)</span>
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
