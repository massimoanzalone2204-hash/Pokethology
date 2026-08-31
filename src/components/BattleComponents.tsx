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

  const normStatus = status.toLowerCase();

  const isBurn = normStatus === 'brn' || normStatus === 'bur' || normStatus === 'burn';
  const isParalysis = normStatus === 'par' || normStatus === 'paralysis';
  const isPoison = normStatus === 'psn' || normStatus === 'poi' || normStatus === 'poison' || normStatus === 'tox' || normStatus === 'toxic';
  const isToxic = normStatus === 'tox' || normStatus === 'toxic';
  const isFreeze = normStatus === 'frz' || normStatus === 'freeze' || normStatus === 'frozen';
  const isSleep = normStatus === 'slp' || normStatus === 'sle' || normStatus === 'sleep';
  const isConfusion = normStatus === 'con' || normStatus === 'confusion';

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center overflow-visible">
      {/* 1. BURN GLOW EFFECT */}
      {isBurn && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Outer Pulsing Fire Glow */}
          <motion.div
            animate={{
              scale: [0.95, 1.12, 1],
              opacity: [0.45, 0.85, 0.55],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-4 sm:-inset-6 rounded-full bg-gradient-to-t from-red-600/35 via-orange-500/30 to-amber-400/25 blur-2xl"
          />
          {/* Inner Fiery Core */}
          <motion.div
            animate={{
              scale: [1, 1.08, 0.96, 1.05, 1],
              opacity: [0.6, 0.9, 0.65, 0.85, 0.6],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-1 sm:-inset-2 rounded-full border-2 border-orange-500/40 blur-sm mix-blend-screen shadow-[0_0_25px_rgba(249,115,22,0.8)]"
          />
          {/* Rising Ember Sparks */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`burn-ember-${i}`}
              initial={{ y: 20, x: (i - 2.5) * 16, opacity: 0, scale: 0.5 }}
              animate={{
                y: [-10, -50 - (i * 8)],
                x: [(i - 2.5) * 16, (i - 2.5) * 20 + ((i % 2 === 0 ? 1 : -1) * 12)],
                opacity: [0, 1, 0.8, 0],
                scale: [0.6, 1.2, 0.4]
              }}
              transition={{
                duration: 1.4 + (i * 0.2),
                repeat: Infinity,
                delay: i * 0.22,
                ease: "easeOut"
              }}
              className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-t from-orange-500 to-yellow-300 blur-[0.5px] shadow-[0_0_10px_rgba(251,146,60,0.9)]"
            />
          ))}
        </div>
      )}

      {/* 2. FREEZE GLOW EFFECT */}
      {isFreeze && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Crystalline Frost Glow */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.5, 0.9, 0.55],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-4 sm:-inset-6 rounded-full bg-gradient-to-b from-cyan-400/35 via-sky-500/25 to-blue-600/30 blur-2xl"
          />
          {/* Subzero Ice Crystals Aura */}
          <motion.div
            animate={{
              rotate: [0, 180, 360],
              scale: [0.98, 1.06, 0.98],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              rotate: { duration: 18, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -inset-2 sm:-inset-3 rounded-2xl border border-cyan-300/60 blur-[1px] shadow-[0_0_30px_rgba(34,211,238,0.85)]"
          />
          {/* Glistening Frost Flares */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`frz-sparkle-${i}`}
              animate={{
                scale: [0.4, 1.3, 0.4],
                opacity: [0.2, 1, 0.2],
                rotate: [0, 90, 180],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
              style={{
                top: `${20 + (i * 12)}%`,
                left: `${15 + ((i * 23) % 70)}%`
              }}
              className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(103,232,249,1)]"
            />
          ))}
        </div>
      )}

      {/* 3. PARALYSIS GLOW EFFECT */}
      {isParalysis && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Voltage Energy Halo */}
          <motion.div
            animate={{
              scale: [0.95, 1.15, 0.98, 1.12, 0.95],
              opacity: [0.4, 0.85, 0.5, 0.9, 0.4],
            }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-4 sm:-inset-6 rounded-full bg-yellow-400/25 blur-2xl"
          />
          {/* Electric Crackle Pulses */}
          <motion.div
            animate={{
              scale: [1, 1.08, 0.98, 1.06, 1],
              opacity: [0.5, 1, 0.3, 0.95, 0.5],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -inset-1 sm:-inset-3 rounded-full border border-yellow-300/60 blur-[1px] shadow-[0_0_30px_rgba(250,204,21,0.9)]"
          />
          {/* Sparking Voltage Jolts */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`par-spark-${i}`}
              animate={{
                opacity: [0, 1, 0, 1, 0],
                scale: [0.6, 1.4, 0.5, 1.2, 0.4],
                x: [(i % 2 === 0 ? -1 : 1) * (15 + i * 8), (i % 2 === 0 ? 1 : -1) * (20 + i * 6)],
                y: [(i - 2) * 14, (i - 2) * 18]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
              className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-200 shadow-[0_0_12px_rgba(250,204,21,1)]"
            />
          ))}
        </div>
      )}

      {/* 4. POISON & TOXIC GLOW EFFECT */}
      {isPoison && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Toxic Miasma Vapor Glow */}
          <motion.div
            animate={{
              scale: [0.95, 1.1, 0.95],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={cn(
              "absolute -inset-4 sm:-inset-6 rounded-full blur-2xl",
              isToxic ? "bg-gradient-to-t from-fuchsia-700/35 via-purple-600/35 to-violet-500/30" : "bg-purple-600/25"
            )}
          />
          {/* Venom Border Pulse */}
          <motion.div
            animate={{
              scale: [1, 1.06, 1],
              opacity: [0.5, 0.9, 0.5],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={cn(
              "absolute -inset-1 sm:-inset-2 rounded-full border blur-[1px]",
              isToxic ? "border-fuchsia-400/60 shadow-[0_0_28px_rgba(217,70,239,0.85)]" : "border-purple-400/60 shadow-[0_0_24px_rgba(168,85,247,0.8)]"
            )}
          />
          {/* Drifting Poison Bubbles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`psn-bubble-${i}`}
              initial={{ y: 25, opacity: 0, scale: 0.4 }}
              animate={{
                y: [-5, -45 - (i * 6)],
                x: [(i - 2.5) * 14, (i - 2.5) * 18 + ((i % 2 === 0 ? 1 : -1) * 8)],
                opacity: [0, 0.9, 0.6, 0],
                scale: [0.5, 1.1, 0.3]
              }}
              transition={{
                duration: 1.9 + (i * 0.2),
                repeat: Infinity,
                delay: i * 0.28,
                ease: "easeOut"
              }}
              className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-purple-400/90 shadow-[0_0_10px_rgba(192,132,252,0.9)]"
            />
          ))}
        </div>
      )}

      {/* 5. SLEEP GLOW EFFECT */}
      {isSleep && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Twilight Astral Sleep Glow */}
          <motion.div
            animate={{
              scale: [0.94, 1.08, 0.94],
              opacity: [0.35, 0.7, 0.35],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-4 sm:-inset-6 rounded-full bg-gradient-to-t from-indigo-900/40 via-slate-700/30 to-sky-900/30 blur-2xl"
          />
          {/* Gentle Breathing Aura Ring */}
          <motion.div
            animate={{
              scale: [0.98, 1.05, 0.98],
              opacity: [0.4, 0.75, 0.4],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-1 sm:-inset-2 rounded-full border border-indigo-400/40 blur-[1px] shadow-[0_0_20px_rgba(129,140,248,0.6)]"
          />
          {/* Floating Dream Orbs */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`slp-orb-${i}`}
              animate={{
                y: [0, -18, 0],
                x: [0, (i % 2 === 0 ? 8 : -8), 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.6, 1.2, 0.6]
              }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeInOut"
              }}
              style={{
                top: `${25 + (i * 15)}%`,
                left: `${20 + ((i * 25) % 60)}%`
              }}
              className="absolute w-2 h-2 rounded-full bg-indigo-300/80 shadow-[0_0_10px_rgba(165,180,252,0.8)]"
            />
          ))}
        </div>
      )}

      {/* 6. CONFUSION GLOW EFFECT */}
      {isConfusion && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Swirling Psychic Distortion Ring */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [0.96, 1.08, 0.96],
              opacity: [0.5, 0.85, 0.5],
            }}
            transition={{
              rotate: { duration: 6, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -inset-2 sm:-inset-4 rounded-full border-2 border-dashed border-pink-400/60 blur-[1px] shadow-[0_0_25px_rgba(244,114,182,0.8)]"
          />
        </div>
      )}
    </div>
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
