import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
let lastHapticTime = 0;
let audioCtx: AudioContext | null = null;

export type HapticPreset = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'error' | 'impact' | 'cry';

function playSyntheticMicroTick(type: HapticPreset) {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return;
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioCtxClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'light' || type === 'selection') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.015);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
      osc.start(now);
      osc.stop(now + 0.015);
    } else if (type === 'medium' || type === 'impact') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.03);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === 'heavy' || type === 'cry') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.06);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.04);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'error') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(100, now + 0.025);
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (_) {}
}

export const isNonPcDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent)
  );
};

export const playHaptic = (pattern: number | number[] | HapticPreset = 'selection') => {
  if (typeof window === 'undefined') return;
  // Enhanced haptic feedback for devices that aren't PC
  if (!isNonPcDevice()) return;

  const now = Date.now();
  if (now - lastHapticTime < 20) return;
  lastHapticTime = now;

  let vibrationPattern: number | number[] = 15;
  let presetName: HapticPreset = 'selection';

  if (typeof pattern === 'string') {
    presetName = pattern as HapticPreset;
    switch (pattern) {
      case 'light':
      case 'selection':
        vibrationPattern = 18;
        break;
      case 'medium':
        vibrationPattern = 32;
        break;
      case 'heavy':
        vibrationPattern = [45, 30, 45];
        break;
      case 'impact':
        vibrationPattern = [35, 25, 60];
        break;
      case 'success':
        vibrationPattern = [20, 40, 30];
        break;
      case 'error':
        vibrationPattern = [50, 40, 50, 40];
        break;
      case 'cry':
        vibrationPattern = [30, 45, 30, 45, 35];
        break;
      default:
        vibrationPattern = 20;
    }
  } else {
    vibrationPattern = pattern;
    if (typeof pattern === 'number') {
      presetName = pattern > 40 ? 'heavy' : pattern > 20 ? 'medium' : 'light';
    } else {
      presetName = 'impact';
    }
  }

  let didVibrate = false;
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      didVibrate = navigator.vibrate(vibrationPattern);
    } catch (_) {}
  }

  // Play subtle synthetic audio micro-tick if navigator.vibrate was unsupported or returned false (e.g. iOS Safari)
  if (!didVibrate) {
    playSyntheticMicroTick(presetName);
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
  
  variant === 'bronze' ? (
    active 
      ? "bg-orange-600 border-orange-400 text-white shadow-[0_4px_15px_rgba(234,88,12,0.3)]" 
      : "bg-slate-900/40 border-slate-800 text-orange-500 hover:border-orange-500/50 hover:bg-slate-900/70 hover:text-orange-400"
  ) :
  variant === 'silver' ? (
    active 
      ? "bg-slate-300 border-slate-100 text-slate-950 shadow-[0_4px_15px_rgba(203,213,225,0.3)]" 
      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-400/50 hover:bg-slate-900/70 hover:text-slate-300"
  ) :
  variant === 'gold' ? (
    active 
      ? "bg-yellow-500 border-yellow-300 text-black shadow-[0_4px_15px_rgba(234,179,8,0.3)]" 
      : "bg-slate-900/40 border-slate-800 text-yellow-500 hover:border-yellow-500/50 hover:bg-slate-900/70 hover:text-yellow-400"
  ) :

  variant === 'mustard' ? (
    active 
      ? "bg-[#dca11d] border-yellow-400 text-black shadow-[0_4px_12px_rgba(220,161,29,0.35)] font-black" 
      : "bg-slate-900/40 border-slate-800 text-[#dca11d] hover:border-yellow-500/50 hover:bg-slate-900/70 hover:text-yellow-300"
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

