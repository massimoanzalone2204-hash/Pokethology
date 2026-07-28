import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const playHaptic = (duration: number = 20) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(duration);
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
  "relative px-3 py-1.5 sm:px-4 sm:py-2 flex items-center justify-center gap-1.5 rounded-lg font-bold font-sans text-[10px] sm:text-xs md:text-sm uppercase tracking-wider transition-all duration-200 select-none border",
  
  variant === 'cyan' ? (
    active 
      ? "bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_4px_12px_rgba(6,182,212,0.2)]" 
      : "bg-slate-900/40 border-slate-800 text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-900/70 hover:text-cyan-300"
  ) :
  variant === 'red' ? (
    active 
      ? "bg-red-500 border-red-400 text-white shadow-[0_4px_12px_rgba(239,68,68,0.2)]" 
      : "bg-slate-900/40 border-slate-800 text-red-400 hover:border-red-500/50 hover:bg-slate-900/70 hover:text-red-300"
  ) :
  variant === 'amber' ? (
    active 
      ? "bg-amber-500 border-amber-400 text-slate-950 shadow-[0_4px_12px_rgba(245,158,11,0.2)]" 
      : "bg-slate-900/40 border-slate-800 text-amber-400 hover:border-amber-500/50 hover:bg-slate-900/70 hover:text-amber-300"
  ) :
  variant === 'purple' ? (
    active 
      ? "bg-purple-500 border-purple-400 text-white shadow-[0_4px_12px_rgba(168,85,247,0.2)]" 
      : "bg-slate-900/40 border-slate-800 text-purple-400 hover:border-purple-500/50 hover:bg-slate-900/70 hover:text-purple-300"
  ) :
  variant === 'pink' ? (
    active 
      ? "bg-pink-500 border-pink-400 text-white shadow-[0_4px_12px_rgba(236,72,153,0.2)]" 
      : "bg-slate-900/40 border-slate-800 text-pink-400 hover:border-pink-500/50 hover:bg-slate-900/70 hover:text-pink-300"
  ) :
  variant === 'green' ? (
    active 
      ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_4px_12px_rgba(16,185,129,0.2)]" 
      : "bg-slate-900/40 border-slate-800 text-emerald-400 hover:border-emerald-500/50 hover:bg-slate-900/70 hover:text-emerald-300"
  ) :
  (
    active 
      ? "bg-slate-700 border-slate-600 text-white shadow-sm" 
      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-100 hover:bg-slate-800/60"
  )
);

