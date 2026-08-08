import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { Shield, ShieldAlert, AlertTriangle, ShieldCheck, ShieldMinus } from 'lucide-react';
import { TypeBadge } from './TypeBadge';

interface TypeWeaknessesSectionProps {
  weaknesses: string[];
  types: { type: { name: string } }[];
  isLightMode: boolean;
  typeColors?: Record<string, string>;
}

const TYPE_CHART: Record<string, Record<string, number>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

const ALL_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'steel', 'dark', 'fairy'
];

export const TypeWeaknessesSection: React.FC<TypeWeaknessesSectionProps> = ({
  weaknesses,
  types,
  isLightMode
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'weak' | 'resist' | 'immune' | 'normal'>('all');

  const defenderTypes = types.map(t => t.type.name.toLowerCase());
  const effectivenessMap: Record<string, number> = {};

  ALL_TYPES.forEach(atkType => {
    let multiplier = 1;
    defenderTypes.forEach(defType => {
      if (TYPE_CHART[atkType] && TYPE_CHART[atkType][defType] !== undefined) {
        multiplier *= TYPE_CHART[atkType][defType];
      }
    });
    effectivenessMap[atkType] = multiplier;
  });

  const quadWeak = ALL_TYPES.filter(t => effectivenessMap[t] === 4);
  const doubleWeak = ALL_TYPES.filter(t => effectivenessMap[t] === 2);
  const normalDamage = ALL_TYPES.filter(t => effectivenessMap[t] === 1);
  const halfResist = ALL_TYPES.filter(t => effectivenessMap[t] === 0.5);
  const quadResist = ALL_TYPES.filter(t => effectivenessMap[t] === 0.25);
  const immunities = ALL_TYPES.filter(t => effectivenessMap[t] === 0);

  const totalWeaknesses = quadWeak.length + doubleWeak.length;
  const totalResistances = halfResist.length + quadResist.length;

  const showWeak = filterMode === 'all' || filterMode === 'weak';
  const showResist = filterMode === 'all' || filterMode === 'resist';
  const showImmune = filterMode === 'all' || filterMode === 'immune';
  const showNormal = filterMode === 'all' || filterMode === 'normal';

  return (
    <div className={cn(
      "backdrop-blur-xl rounded-2xl p-5 sm:p-6 border shadow-xl relative overflow-hidden transition-all",
      isLightMode
        ? "bg-white/95 border-slate-200"
        : "bg-slate-900/70 border-cyan-900/40"
    )}>
      {/* Section Header */}
      <div className={cn(
        "font-hud text-[13px] uppercase tracking-wider mb-4 pb-3 border-b flex flex-wrap items-center justify-between gap-2",
        isLightMode ? "text-cyan-900 border-slate-200" : "text-cyan-400 border-cyan-900/40"
      )}>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span className="font-bold">Type Matchups & Effectiveness</span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950/40 p-1 rounded-lg border border-slate-800">
          {(['all', 'weak', 'resist', 'immune', 'normal'] as const).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilterMode(mode)}
              className={cn(
                "px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer",
                filterMode === mode
                  ? "bg-cyan-500 text-slate-950"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Breakdown Layout */}
      <div className="space-y-4">
        {/* WEAKNESSES BLOCK (4x & 2x) */}
        {showWeak && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-hud uppercase font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Weaknesses ({totalWeaknesses})</span>
              </div>
            </div>

            {totalWeaknesses > 0 ? (
              <div className="flex flex-wrap gap-2">
                {/* 4x Extreme Weakness */}
                {quadWeak.map(type => (
                  <div key={`quad-${type}`} className="flex items-center gap-1.5 bg-rose-950/50 p-1 pr-2.5 rounded-lg border border-rose-800/80 shadow-sm">
                    <TypeBadge type={type} size="sm" />
                    <span className="text-[10px] font-mono font-black text-rose-300 bg-rose-900/80 px-1 py-0.2 rounded">4x</span>
                  </div>
                ))}

                {/* 2x Weakness */}
                {doubleWeak.map(type => (
                  <div key={`weak-${type}`} className="flex items-center gap-1.5 bg-amber-950/40 p-1 pr-2.5 rounded-lg border border-amber-800/50 shadow-sm">
                    <TypeBadge type={type} size="sm" />
                    <span className="text-[10px] font-mono font-bold text-amber-300">2x</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={cn("text-[10px] font-mono italic p-2 rounded border border-dashed", isLightMode ? "bg-slate-50 border-slate-200 text-slate-500" : "bg-slate-950/40 border-slate-800 text-slate-400")}>
                No weaknesses (0)
              </p>
            )}
          </div>
        )}

        {/* RESISTANCES BLOCK (1/2x & 1/4x) */}
        {showResist && (
          <div className="pt-3 border-t border-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className={cn("text-[11px] font-hud uppercase font-bold flex items-center gap-1.5", isLightMode ? "text-slate-800" : "text-emerald-400")}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Resistances ({totalResistances})</span>
              </div>
            </div>

            {totalResistances > 0 ? (
              <div className="flex flex-wrap gap-2">
                {/* 1/4x Quad Resistance */}
                {quadResist.map(type => (
                  <div key={`quad-resist-${type}`} className="flex items-center gap-1.5 bg-emerald-950/60 p-1 pr-2.5 rounded-lg border border-emerald-700/80 shadow-sm">
                    <TypeBadge type={type} size="sm" />
                    <span className="text-[10px] font-mono font-black text-emerald-300 bg-emerald-900/80 px-1 py-0.2 rounded">¼x</span>
                  </div>
                ))}

                {/* 1/2x Half Resistance */}
                {halfResist.map(type => (
                  <div key={`half-resist-${type}`} className="flex items-center gap-1.5 bg-emerald-950/30 p-1 pr-2.5 rounded-lg border border-emerald-900/50 shadow-sm">
                    <TypeBadge type={type} size="sm" />
                    <span className="text-[10px] font-mono font-bold text-emerald-400">½x</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={cn("text-[10px] font-mono italic p-2 rounded border border-dashed", isLightMode ? "bg-slate-50 border-slate-200 text-slate-500" : "bg-slate-950/40 border-slate-800 text-slate-400")}>
                No resistances (0)
              </p>
            )}
          </div>
        )}

        {/* IMMUNITIES BLOCK (0x) */}
        {showImmune && (
          <div className="pt-3 border-t border-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className={cn("text-[11px] font-hud uppercase font-bold flex items-center gap-1.5", isLightMode ? "text-slate-800" : "text-cyan-400")}>
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Immunities ({immunities.length})</span>
              </div>
            </div>

            {immunities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {immunities.map(type => (
                  <div key={`immune-${type}`} className="flex items-center gap-1.5 bg-cyan-950/50 p-1 pr-2.5 rounded-lg border border-cyan-800/70 shadow-sm">
                    <TypeBadge type={type} size="sm" />
                    <span className="text-[10px] font-mono font-black text-cyan-300 bg-cyan-900/80 px-1 py-0.2 rounded">0x</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={cn("text-[10px] font-mono italic p-2 rounded border border-dashed", isLightMode ? "bg-slate-50 border-slate-200 text-slate-500" : "bg-slate-950/40 border-slate-800 text-slate-400")}>
                No immunities (0)
              </p>
            )}
          </div>
        )}

        {/* NORMAL DAMAGE BLOCK (1x) */}
        {showNormal && (
          <div className="pt-3 border-t border-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className={cn("text-[11px] font-hud uppercase font-bold flex items-center gap-1.5", isLightMode ? "text-slate-700" : "text-slate-400")}>
                <ShieldMinus className="w-3.5 h-3.5 text-slate-400" />
                <span>Normal Damage ({normalDamage.length})</span>
              </div>
            </div>

            {normalDamage.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {normalDamage.map(type => (
                  <div key={`normal-${type}`} className="flex items-center gap-1.5 bg-slate-900/40 p-1 pr-2.5 rounded-lg border border-slate-800 shadow-sm">
                    <TypeBadge type={type} size="sm" />
                    <span className="text-[10px] font-mono font-bold text-slate-400">1x</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={cn("text-[10px] font-mono italic p-2 rounded border border-dashed", isLightMode ? "bg-slate-50 border-slate-200 text-slate-500" : "bg-slate-950/40 border-slate-800 text-slate-400")}>
                None (0)
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
