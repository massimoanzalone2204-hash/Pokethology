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
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[360px] select-none">
      {/* Rotating Pokéball with enhanced aesthetic and center blue lampent light */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Ambient Outer Halos & Cyber Pulse Rings */}
        <div className="absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-cyan-500/20 blur-2xl animate-pulse pointer-events-none" />
        <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-cyan-400/30 border-dashed animate-spin-slow pointer-events-none" style={{ animationDuration: '18s' }} />
        <div className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-cyan-500/20 pointer-events-none animate-ping" style={{ animationDuration: '3s' }} />
        
        {/* Enhanced Rotating Pokéball */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
          className="relative w-22 h-22 sm:w-28 sm:h-28 flex items-center justify-center filter drop-shadow-[0_0_25px_rgba(6,182,212,0.7)] z-10"
        >
          <PokeballIcon className="w-full h-full object-contain" />
        </motion.div>

        {/* Center Blue Lampent Light & Concentric Core Flares */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          {/* Outer Lampent Radiant Bloom */}
          <motion.div
            animate={{ scale: [0.85, 1.6, 0.85], opacity: [0.4, 0.9, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-cyan-400/40 blur-md"
          />
          {/* Radial Lampent Flare */}
          <motion.div
            animate={{ scale: [0.9, 1.4, 0.9], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cyan-300/60 blur-sm"
          />
          {/* Piercing Center Lampent Core */}
          <motion.div
            animate={{ scale: [0.95, 1.25, 0.95], opacity: [0.9, 1, 0.9] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-cyan-200 shadow-[0_0_20px_#00f0ff,0_0_35px_#06b6d4,0_0_50px_#38bdf8] border-2 border-white"
          />
        </div>
      </div>

      {/* Main scanning phrase */}
      <h3 
        className="font-hud font-black text-sm sm:text-lg text-cyan-300 uppercase tracking-[0.25em] animate-pulse"
        style={{ textShadow: '0 0 14px rgba(34,211,238,0.8)' }}
      >
        {targetName ? `ANALYZING ${targetName.toUpperCase()}` : "SCANNING DATABASE..."}
      </h3>

      {/* Under phrase for the Pokémon analyze */}
      <p className="text-[10.5px] sm:text-xs font-mono text-cyan-400/90 uppercase tracking-widest mt-2 animate-pulse">
        {targetName 
          ? `Analyzing ${targetName} telemetry, stats & combat matrix...` 
          : "Analyzing Pokémon species, movesets & abilities..."}
      </p>
    </div>
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
