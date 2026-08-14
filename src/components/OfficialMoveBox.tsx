import React from 'react';
import { Move } from '../types';
import { cn } from '../lib/utils';
import { TypeBadge } from './TypeBadge';
import { DamageClassIcon, PokemonTypeIcon } from './PokemonTypeIcon';

// Official type styling palettes for move boxes (gradients, border tints, glows)
export const officialMoveBoxStyles: Record<
  string,
  {
    bgGradient: string;
    border: string;
    glow: string;
    accentColor: string;
    categoryBg: string;
    tagBg: string;
  }
> = {
  normal: {
    bgGradient: 'from-[#2A2A22]/95 via-[#1C1C18]/95 to-[#12120F]/95',
    border: 'border-[#A8A878]/50 hover:border-[#D0D0B0]',
    glow: 'shadow-[0_0_12px_rgba(168,168,120,0.2)]',
    accentColor: 'text-[#D0D0B0]',
    categoryBg: 'bg-[#A8A878]/20',
    tagBg: 'bg-[#A8A878]/15 border-[#A8A878]/30 text-[#D0D0B0]',
  },
  fire: {
    bgGradient: 'from-[#3A1405]/95 via-[#230C03]/95 to-[#120501]/95',
    border: 'border-[#F08030]/60 hover:border-[#FFA868]',
    glow: 'shadow-[0_0_15px_rgba(240,128,48,0.3)]',
    accentColor: 'text-[#FFA868]',
    categoryBg: 'bg-[#F08030]/20',
    tagBg: 'bg-[#F08030]/15 border-[#F08030]/30 text-[#FFA868]',
  },
  water: {
    bgGradient: 'from-[#0A1E40]/95 via-[#061328]/95 to-[#020814]/95',
    border: 'border-[#6890F0]/60 hover:border-[#98B8F8]',
    glow: 'shadow-[0_0_15px_rgba(104,144,240,0.3)]',
    accentColor: 'text-[#98B8F8]',
    categoryBg: 'bg-[#6890F0]/20',
    tagBg: 'bg-[#6890F0]/15 border-[#6890F0]/30 text-[#98B8F8]',
  },
  electric: {
    bgGradient: 'from-[#362D03]/95 via-[#201A02]/95 to-[#100D01]/95',
    border: 'border-[#F8D030]/60 hover:border-[#FFF078]',
    glow: 'shadow-[0_0_15px_rgba(248,208,48,0.3)]',
    accentColor: 'text-[#FFE866]',
    categoryBg: 'bg-[#F8D030]/20',
    tagBg: 'bg-[#F8D030]/15 border-[#F8D030]/30 text-[#FFE866]',
  },
  grass: {
    bgGradient: 'from-[#142C0A]/95 via-[#0C1B06]/95 to-[#050D03]/95',
    border: 'border-[#78C850]/60 hover:border-[#98E070]',
    glow: 'shadow-[0_0_15px_rgba(120,200,80,0.3)]',
    accentColor: 'text-[#98E070]',
    categoryBg: 'bg-[#78C850]/20',
    tagBg: 'bg-[#78C850]/15 border-[#78C850]/30 text-[#98E070]',
  },
  ice: {
    bgGradient: 'from-[#0D2E2E]/95 via-[#081C1C]/95 to-[#040E0E]/95',
    border: 'border-[#98D8D8]/60 hover:border-[#C0F8F8]',
    glow: 'shadow-[0_0_15px_rgba(152,216,216,0.3)]',
    accentColor: 'text-[#C0F8F8]',
    categoryBg: 'bg-[#98D8D8]/20',
    tagBg: 'bg-[#98D8D8]/15 border-[#98D8D8]/30 text-[#C0F8F8]',
  },
  fighting: {
    bgGradient: 'from-[#380E0B]/95 via-[#230807]/95 to-[#120403]/95',
    border: 'border-[#C03028]/60 hover:border-[#F05850]',
    glow: 'shadow-[0_0_15px_rgba(192,48,40,0.3)]',
    accentColor: 'text-[#F05850]',
    categoryBg: 'bg-[#C03028]/20',
    tagBg: 'bg-[#C03028]/15 border-[#C03028]/30 text-[#F05850]',
  },
  poison: {
    bgGradient: 'from-[#2A0E2A]/95 via-[#1B091B]/95 to-[#0E040E]/95',
    border: 'border-[#A040A0]/60 hover:border-[#D868D8]',
    glow: 'shadow-[0_0_15px_rgba(160,64,160,0.3)]',
    accentColor: 'text-[#D868D8]',
    categoryBg: 'bg-[#A040A0]/20',
    tagBg: 'bg-[#A040A0]/15 border-[#A040A0]/30 text-[#D868D8]',
  },
  ground: {
    bgGradient: 'from-[#332709]/95 via-[#211906]/95 to-[#110D03]/95',
    border: 'border-[#E0C068]/60 hover:border-[#F0D888]',
    glow: 'shadow-[0_0_15px_rgba(224,192,104,0.3)]',
    accentColor: 'text-[#F0D888]',
    categoryBg: 'bg-[#E0C068]/20',
    tagBg: 'bg-[#E0C068]/15 border-[#E0C068]/30 text-[#F0D888]',
  },
  flying: {
    bgGradient: 'from-[#231A40]/95 via-[#161028]/95 to-[#0B0814]/95',
    border: 'border-[#A890F0]/60 hover:border-[#C8B8F8]',
    glow: 'shadow-[0_0_15px_rgba(168,144,240,0.3)]',
    accentColor: 'text-[#C8B8F8]',
    categoryBg: 'bg-[#A890F0]/20',
    tagBg: 'bg-[#A890F0]/15 border-[#A890F0]/30 text-[#C8B8F8]',
  },
  psychic: {
    bgGradient: 'from-[#3A0F1D]/95 via-[#240912]/95 to-[#120409]/95',
    border: 'border-[#F85888]/60 hover:border-[#FF88A8]',
    glow: 'shadow-[0_0_15px_rgba(248,88,136,0.3)]',
    accentColor: 'text-[#FF88A8]',
    categoryBg: 'bg-[#F85888]/20',
    tagBg: 'bg-[#F85888]/15 border-[#F85888]/30 text-[#FF88A8]',
  },
  bug: {
    bgGradient: 'from-[#282C05]/95 via-[#191C03]/95 to-[#0D0E02]/95',
    border: 'border-[#A8B820]/60 hover:border-[#C8D838]',
    glow: 'shadow-[0_0_15px_rgba(168,184,32,0.3)]',
    accentColor: 'text-[#C8D838]',
    categoryBg: 'bg-[#A8B820]/20',
    tagBg: 'bg-[#A8B820]/15 border-[#A8B820]/30 text-[#C8D838]',
  },
  rock: {
    bgGradient: 'from-[#2D2608]/95 via-[#1D1805]/95 to-[#0F0C03]/95',
    border: 'border-[#B8A038]/60 hover:border-[#D8C058]',
    glow: 'shadow-[0_0_15px_rgba(184,160,56,0.3)]',
    accentColor: 'text-[#D8C058]',
    categoryBg: 'bg-[#B8A038]/20',
    tagBg: 'bg-[#B8A038]/15 border-[#B8A038]/30 text-[#D8C058]',
  },
  ghost: {
    bgGradient: 'from-[#1A1428]/95 via-[#100C1A]/95 to-[#08060D]/95',
    border: 'border-[#705898]/60 hover:border-[#8888C8]',
    glow: 'shadow-[0_0_15px_rgba(112,88,152,0.3)]',
    accentColor: 'text-[#A090D0]',
    categoryBg: 'bg-[#705898]/20',
    tagBg: 'bg-[#705898]/15 border-[#705898]/30 text-[#A090D0]',
  },
  dragon: {
    bgGradient: 'from-[#1C0D42]/95 via-[#11082A]/95 to-[#090415]/95',
    border: 'border-[#7038F8]/60 hover:border-[#A880F8]',
    glow: 'shadow-[0_0_15px_rgba(112,56,248,0.3)]',
    accentColor: 'text-[#B898F8]',
    categoryBg: 'bg-[#7038F8]/20',
    tagBg: 'bg-[#7038F8]/15 border-[#7038F8]/30 text-[#B898F8]',
  },
  dark: {
    bgGradient: 'from-[#1E1612]/95 via-[#130E0B]/95 to-[#090705]/95',
    border: 'border-[#705848]/60 hover:border-[#A08878]',
    glow: 'shadow-[0_0_15px_rgba(112,88,72,0.3)]',
    accentColor: 'text-[#C0A898]',
    categoryBg: 'bg-[#705848]/20',
    tagBg: 'bg-[#705848]/15 border-[#705848]/30 text-[#C0A898]',
  },
  steel: {
    bgGradient: 'from-[#262630]/95 via-[#181820]/95 to-[#0C0C10]/95',
    border: 'border-[#B8B8D0]/60 hover:border-[#D8D8E8]',
    glow: 'shadow-[0_0_15px_rgba(184,184,208,0.3)]',
    accentColor: 'text-[#D8D8E8]',
    categoryBg: 'bg-[#B8B8D0]/20',
    tagBg: 'bg-[#B8B8D0]/15 border-[#B8B8D0]/30 text-[#D8D8E8]',
  },
  fairy: {
    bgGradient: 'from-[#3A1E28]/95 via-[#251319]/95 to-[#130A0D]/95',
    border: 'border-[#EE99AC]/60 hover:border-[#F8C8E0]',
    glow: 'shadow-[0_0_15px_rgba(238,153,172,0.3)]',
    accentColor: 'text-[#F8C8E0]',
    categoryBg: 'bg-[#EE99AC]/20',
    tagBg: 'bg-[#EE99AC]/15 border-[#EE99AC]/30 text-[#F8C8E0]',
  },
  stellar: {
    bgGradient: 'from-[#0C2242]/95 via-[#07152B]/95 to-[#030A15]/95',
    border: 'border-[#40A8FF]/60 hover:border-[#70E0FF]',
    glow: 'shadow-[0_0_15px_rgba(64,168,255,0.3)]',
    accentColor: 'text-[#70E0FF]',
    categoryBg: 'bg-[#40A8FF]/20',
    tagBg: 'bg-[#40A8FF]/15 border-[#40A8FF]/30 text-[#70E0FF]',
  },
};

export interface OfficialMoveBoxProps {
  move: Move;
  variant?: 'battle' | 'compact' | 'detail' | 'selector';
  onClick?: () => void;
  disabled?: boolean;
  isSelected?: boolean;
  effectiveness?: number;
  isStab?: boolean;
  isLightMode?: boolean;
  className?: string;
  onHover?: () => void;
}

export const OfficialMoveBox: React.FC<OfficialMoveBoxProps> = ({
  move,
  variant = 'battle',
  onClick,
  disabled = false,
  isSelected = false,
  effectiveness,
  isStab = false,
  isLightMode = false,
  className,
  onHover,
}) => {
  const normType = (move.type || 'normal').toLowerCase();
  const theme = officialMoveBoxStyles[normType] || officialMoveBoxStyles.normal;
  
  const currentPP = move.currentPP !== undefined ? move.currentPP : move.pp;
  const maxPP = move.pp || 15;
  const isOutOfPP = currentPP === 0;
  const isLowPP = currentPP > 0 && currentPP <= Math.ceil(maxPP * 0.25);
  const ppPercent = Math.min(100, Math.max(0, (currentPP / maxPP) * 100));

  const formattedName = (move.name || '').replace(/[-_]/g, ' ').toUpperCase();
  const isLongName = formattedName.length > 12;

  // Compact, high-visibility effectiveness tag
  let effectivenessBadge: React.ReactNode = null;
  if (effectiveness !== undefined) {
    if (effectiveness > 1) {
      effectivenessBadge = (
        <span className="inline-flex items-center text-[7px] sm:text-[7.5px] font-mono font-black px-1.5 py-0.5 rounded border uppercase bg-emerald-950/90 border-emerald-500/50 text-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.3)] shrink-0 whitespace-nowrap">
          {effectiveness}x SUPER
        </span>
      );
    } else if (effectiveness < 1 && effectiveness > 0) {
      effectivenessBadge = (
        <span className="inline-flex items-center text-[7px] sm:text-[7.5px] font-mono font-black px-1.5 py-0.5 rounded border uppercase bg-amber-950/90 border-amber-500/50 text-amber-300 shadow-[0_0_6px_rgba(245,158,11,0.3)] shrink-0 whitespace-nowrap">
          {effectiveness}x RESIST
        </span>
      );
    } else if (effectiveness === 0) {
      effectivenessBadge = (
        <span className="inline-flex items-center text-[7px] sm:text-[7.5px] font-mono font-black px-1.5 py-0.5 rounded border uppercase bg-slate-900/90 border-slate-700 text-slate-400 shrink-0 whitespace-nowrap">
          0x IMMUNE
        </span>
      );
    }
  }

  // Battle variant (Official in-arena interactive move button)
  if (variant === 'battle') {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={onHover}
        disabled={disabled || isOutOfPP}
        className={cn(
          "relative overflow-hidden w-full text-left p-2 xs:p-2.5 sm:p-3 rounded-xl border transition-all duration-150 flex flex-col justify-between gap-1.5 group select-none cursor-pointer min-h-[76px] sm:min-h-[82px]",
          "bg-gradient-to-br",
          theme.bgGradient,
          theme.border,
          theme.glow,
          (disabled || isOutOfPP) && "opacity-45 cursor-not-allowed grayscale-[40%]",
          isSelected && "ring-2 ring-cyan-400 border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.5)]",
          !disabled && !isOutOfPP && "hover:scale-[1.015] active:scale-[0.985]",
          className
        )}
      >
        {/* Subtle Watermark Type Logo */}
        <div className="absolute -right-2 -bottom-2 opacity-[0.08] group-hover:opacity-[0.14] transition-opacity pointer-events-none">
          <PokemonTypeIcon type={normType} size="xl" className="w-16 h-16 text-white" showShadow={false} />
        </div>

        {/* Top Metallic Gloss Highlight */}
        <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-xl" />

        {/* Top Header: Move Name + Type Badge */}
        <div className="flex items-start justify-between w-full gap-1.5 relative z-10">
          <div className="flex-1 min-w-0 pr-1">
            <span className={cn(
              "font-hud font-black uppercase tracking-wide break-words line-clamp-2 leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] block",
              isLongName ? "text-[9px] xs:text-[10px] sm:text-[11px]" : "text-[10px] xs:text-[11px] sm:text-[12px]",
              isLightMode ? "text-slate-900" : "text-white group-hover:text-amber-200 transition-colors"
            )}>
              {formattedName}
            </span>
          </div>

          <div className="shrink-0 flex items-center">
            <TypeBadge type={move.type} size="xs" showIcon={true} />
          </div>
        </div>

        {/* Middle Status Row: Damage Class & Effectiveness Badges */}
        <div className="flex items-center gap-1 flex-wrap relative z-10">
          <DamageClassIcon damageClass={move.damage_class} size="xs" />
          {isStab && (
            <span className="text-[6.5px] font-mono font-extrabold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-1 py-0.2 rounded uppercase shrink-0 whitespace-nowrap">
              STAB 1.5x
            </span>
          )}
          {effectivenessBadge}
        </div>

        {/* Bottom Bar: Stats (PWR / ACC) and PP Gauge */}
        <div className="flex items-center justify-between w-full relative z-10 pt-1 border-t border-white/10 text-[7.5px] xs:text-[8px] sm:text-[8.5px] font-mono">
          <div className="flex items-center gap-1.5 xs:gap-2.5">
            <span className="text-slate-300 font-bold whitespace-nowrap">
              PWR <strong className={cn("font-black", move.power ? theme.accentColor : "text-slate-400")}>{move.power || '--'}</strong>
            </span>
            <span className="text-slate-400 whitespace-nowrap">
              ACC <strong className="text-slate-300 font-bold">{move.accuracy ? `${move.accuracy}%` : '--'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1 xs:gap-1.5 shrink-0">
            <span className={cn(
              "font-black tracking-tight whitespace-nowrap",
              isOutOfPP ? "text-red-400 animate-pulse" : isLowPP ? "text-amber-400" : "text-slate-200"
            )}>
              PP {currentPP}/{maxPP}
            </span>
            {/* Miniature PP Battery Gauge */}
            <div className="w-6 xs:w-8 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  isOutOfPP ? "bg-red-500" : isLowPP ? "bg-amber-400" : "bg-emerald-400"
                )}
                style={{ width: `${ppPercent}%` }}
              />
            </div>
          </div>
        </div>
      </button>
    );
  }

  // Selector variant (for building movesets / learnable moves list)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      disabled={disabled}
      className={cn(
        "relative overflow-hidden w-full text-left p-2 xs:p-2.5 sm:p-3 rounded-xl border transition-all duration-150 flex flex-col justify-between gap-1.5 group select-none cursor-pointer min-h-[72px] sm:min-h-[78px]",
        "bg-gradient-to-br",
        theme.bgGradient,
        theme.border,
        isSelected
          ? "ring-2 ring-cyan-400 border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.4)]"
          : "hover:border-cyan-400/60 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
    >
      {/* Watermark logo */}
      <div className="absolute -right-2 -bottom-2 opacity-[0.07] pointer-events-none">
        <PokemonTypeIcon type={normType} size="xl" className="w-14 h-14 text-white" showShadow={false} />
      </div>

      <div className="flex items-start justify-between w-full gap-1.5 relative z-10">
        <div className="flex-1 min-w-0 pr-1">
          <span className={cn(
            "font-hud font-black uppercase tracking-wide break-words line-clamp-2 leading-tight text-white group-hover:text-cyan-200 block",
            isLongName ? "text-[9px] xs:text-[9.5px] sm:text-[10.5px]" : "text-[9.5px] xs:text-[10px] sm:text-[11.5px]"
          )}>
            {formattedName}
          </span>
        </div>

        <div className="shrink-0 flex items-center">
          <TypeBadge type={move.type} size="xs" showIcon={true} />
        </div>
      </div>

      <div className="flex items-center gap-1.5 relative z-10 flex-wrap">
        <DamageClassIcon damageClass={move.damage_class} size="xs" />
        {isStab && (
          <span className="text-[6.5px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-1 rounded uppercase shrink-0 whitespace-nowrap">
            STAB 1.5x
          </span>
        )}
      </div>

      <div className="flex items-center justify-between w-full relative z-10 pt-1 border-t border-white/10 text-[7.5px] xs:text-[8px] font-mono text-slate-300">
        <div className="flex gap-2">
          <span>PWR: <strong className={theme.accentColor}>{move.power || '--'}</strong></span>
          <span>ACC: <strong className="text-slate-200">{move.accuracy ? `${move.accuracy}%` : '--'}</strong></span>
        </div>
        <span className="font-bold text-slate-300">PP {move.pp}</span>
      </div>
    </button>
  );
};
