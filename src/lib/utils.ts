import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
let lastHapticTime = 0;
export const playHaptic = (duration: number = 20) => {
  const now = Date.now();
  if (now - lastHapticTime < 35) return;
  lastHapticTime = now;
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(duration);
    } catch (_) {}
  }
};

export const abbreviateType = (type: string) => {
  const map: Record<string, string> = {
    normal: 'NRM',
    fire: 'FIR',
    water: 'WAT',
    electric: 'ELE',
    grass: 'GRS',
    ice: 'ICE',
    fighting: 'FIG',
    poison: 'POI',
    ground: 'GRD',
    flying: 'FLY',
    psychic: 'PSY',
    bug: 'BUG',
    rock: 'RCK',
    ghost: 'GHO',
    dragon: 'DRA',
    dark: 'DRK',
    steel: 'STL',
    fairy: 'FAI',
  };
  return map[type.toLowerCase()] || type.substring(0, 3).toUpperCase();
};

export const hudButtonClass = (active: boolean = false, variant: string = 'cyan') => cn(
  "relative px-3 py-1.5 sm:px-4 sm:py-2 flex items-center justify-center gap-1.5 rounded-lg font-bold font-sans text-[10px] sm:text-xs md:text-sm uppercase tracking-wider transition-all duration-200 select-none border cursor-pointer",
  
  variant === 'cyan' ? (
    active 
      ? "bg-cyan-500 border-cyan-300 text-slate-950 font-black shadow-[0_0_20px_rgba(34,211,238,0.7),0_0_40px_rgba(34,211,238,0.4)]" 
      : "bg-slate-900/60 border-cyan-500/50 text-cyan-400 hover:border-cyan-300 hover:bg-cyan-950/60 hover:text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.3)] hover:shadow-[0_0_24px_rgba(34,211,238,0.65)]"
  ) :
  variant === 'red' ? (
    active 
      ? "bg-red-500 border-red-300 text-white font-black shadow-[0_0_20px_rgba(239,68,68,0.7),0_0_40px_rgba(239,68,68,0.4)]" 
      : "bg-slate-900/60 border-red-500/50 text-red-400 hover:border-red-300 hover:bg-red-950/60 hover:text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.3)] hover:shadow-[0_0_24px_rgba(239,68,68,0.65)]"
  ) :
  variant === 'amber' ? (
    active 
      ? "bg-amber-500 border-amber-300 text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.7),0_0_40px_rgba(245,158,11,0.4)]" 
      : "bg-slate-900/60 border-amber-500/50 text-amber-400 hover:border-amber-300 hover:bg-amber-950/60 hover:text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)] hover:shadow-[0_0_24px_rgba(245,158,11,0.65)]"
  ) :
  variant === 'purple' ? (
    active 
      ? "bg-purple-500 border-purple-300 text-white font-black shadow-[0_0_20px_rgba(168,85,247,0.7),0_0_40px_rgba(168,85,247,0.4)]" 
      : "bg-slate-900/60 border-purple-500/50 text-purple-400 hover:border-purple-300 hover:bg-purple-950/60 hover:text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.3)] hover:shadow-[0_0_24px_rgba(168,85,247,0.65)]"
  ) :
  variant === 'pink' ? (
    active 
      ? "bg-pink-500 border-pink-300 text-white font-black shadow-[0_0_20px_rgba(236,72,153,0.7),0_0_40px_rgba(236,72,153,0.4)]" 
      : "bg-slate-900/60 border-pink-500/50 text-pink-400 hover:border-pink-300 hover:bg-pink-950/60 hover:text-pink-200 shadow-[0_0_12px_rgba(236,72,153,0.3)] hover:shadow-[0_0_24px_rgba(236,72,153,0.65)]"
  ) :
  variant === 'green' ? (
    active 
      ? "bg-emerald-500 border-emerald-300 text-white font-black shadow-[0_0_20px_rgba(16,185,129,0.7),0_0_40px_rgba(16,185,129,0.4)]" 
      : "bg-slate-900/60 border-emerald-500/50 text-emerald-400 hover:border-emerald-300 hover:bg-emerald-950/60 hover:text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:shadow-[0_0_24px_rgba(16,185,129,0.65)]"
  ) :
  (
    active 
      ? "bg-slate-700 border-slate-400 text-white font-black shadow-[0_0_16px_rgba(148,163,184,0.5)]" 
      : "bg-slate-900/60 border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-200 hover:bg-slate-800/80 shadow-[0_0_10px_rgba(148,163,184,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]"
  )
);

