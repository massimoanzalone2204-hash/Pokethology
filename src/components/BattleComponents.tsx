import React, { memo, useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Skull, Flame, Zap, Shield, Sparkles, Trophy, X, Target, Activity, Star } from 'lucide-react';
import { cn, playHaptic } from '../lib/utils';
import { sounds } from '../lib/sounds';
import { PokeballIcon } from './PokeballIcon';

export const HUDCorners = memo(({ className }: { className?: string }) => null);

export interface PokethologyRadarScannerProps {
  onAbort?: () => void;
  targetName?: string;
}

export const PokethologyRadarScanner = memo(({ targetName }: PokethologyRadarScannerProps) => {
  const formattedTarget = targetName && targetName.toLowerCase() !== 'database' 
    ? targetName.charAt(0).toUpperCase() + targetName.slice(1).toLowerCase() 
    : '';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[360px] select-none"
    >
      {/* Fluid Rotating Pokéball (GPU Composited) */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-cyan-500/15 blur-2xl animate-pulse-fluid pointer-events-none" />
        
        <div
          className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] z-10 animate-spin-fluid will-change-transform transform-gpu"
        >
          <PokeballIcon className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Main scanning phrase with the relative Pokemon */}
      <h3 
        className="font-hud font-black text-base sm:text-xl text-cyan-300 uppercase tracking-[0.2em] animate-pulse-fluid"
        style={{ textShadow: '0 0 12px rgba(34,211,238,0.7)' }}
      >
        {formattedTarget ? `Scanning ${formattedTarget}` : "Scanning Pokémon"}
      </h3>

      {/* Synchronization Pokédex Phrase */}
      <p className="text-xs sm:text-sm font-mono font-bold text-cyan-400/90 uppercase tracking-[0.25em] mt-2 animate-pulse-fluid">
        Synchronization Pokédex
      </p>
    </motion.div>
  );
});

export const TerrainEffect = memo(({ playerType, opponentType }: { playerType?: string; opponentType?: string }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/20 via-transparent to-purple-950/20" />
    </div>
  );
});

export const StatusOverlay = memo(({ status }: { status: string | null }) => {
  if (!status) return null;

  const config: Record<string, { label: string; icon: any; color: string; border: string; bg: string }> = {
    brn: { label: 'BURN', icon: Flame, color: 'text-orange-400', border: 'border-orange-500/50', bg: 'bg-orange-950/80' },
    par: { label: 'PARALYSIS', icon: Zap, color: 'text-yellow-400', border: 'border-yellow-500/50', bg: 'bg-yellow-950/80' },
    psn: { label: 'POISON', icon: Skull, color: 'text-purple-400', border: 'border-purple-500/50', bg: 'bg-purple-950/80' },
    tox: { label: 'TOXIC', icon: Skull, color: 'text-purple-400', border: 'border-purple-500/50', bg: 'bg-purple-950/80' },
    slp: { label: 'SLEEP', icon: Shield, color: 'text-slate-400', border: 'border-slate-500/50', bg: 'bg-slate-900/80' },
    frz: { label: 'FROZEN', icon: Sparkles, color: 'text-cyan-300', border: 'border-cyan-400/50', bg: 'bg-cyan-950/80' },
  };

  const current = config[status.toLowerCase()] || {
    label: status.toUpperCase(),
    icon: Activity,
    color: 'text-amber-400',
    border: 'border-amber-500/50',
    bg: 'bg-amber-950/80'
  };

  const Icon = current.icon;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-hud font-bold uppercase tracking-wider shadow-sm",
        current.bg,
        current.border,
        current.color
      )}
    >
      <Icon className="w-3 h-3" />
      <span>{current.label}</span>
    </motion.div>
  );
});

export const HPBar = memo(({ current, max, enableAnimations }: { current: number; max: number; enableAnimations: boolean }) => {
  const percentage = Math.max(0, Math.min(100, (current / (max || 1)) * 100));

  let barColor = "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
  if (percentage <= 20) {
    barColor = "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
  } else if (percentage <= 50) {
    barColor = "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]";
  }

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-wider">
        <span className="text-slate-400">HP</span>
        <span className={cn(percentage <= 20 ? "text-red-400 font-black" : "text-slate-200")}>
          {Math.max(0, Math.round(current))} / {max}
        </span>
      </div>
      <div className="w-full h-2.5 bg-slate-950/80 rounded-full border border-slate-800 p-0.5 overflow-hidden">
        <motion.div
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={enableAnimations ? { duration: 0.4, ease: "easeOut" } : { duration: 0 }}
          className={cn("h-full rounded-full transition-colors", barColor)}
        />
      </div>
    </div>
  );
});

export const VictoryConfetti = () => {
  const pieces = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      size: 4 + Math.random() * 8,
      rotation: Math.random() * 360,
      color: ['#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#3b82f6'][Math.floor(Math.random() * 6)],
      duration: 2.5 + Math.random() * 2,
      delay: Math.random() * 0.8
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[300] overflow-hidden">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: `${p.y}vh`, rotate: 0, opacity: 1 }}
          animate={{ y: '110vh', rotate: p.rotation + 720, opacity: [1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn", repeat: Infinity }}
          style={{ width: p.size, height: p.size, backgroundColor: p.color }}
          className="absolute rounded-sm shadow-sm"
        />
      ))}
    </div>
  );
};
