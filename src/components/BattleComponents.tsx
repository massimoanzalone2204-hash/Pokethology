import React, { memo, useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Skull, Flame, Zap, Shield, Sparkles, Trophy, X, Target, Activity, Star } from 'lucide-react';
import { cn, playHaptic } from '../lib/utils';
import { sounds } from '../lib/sounds';

export const HUDCorners = memo(({ className }: { className?: string }) => null);

export interface PokethologyRadarScannerProps {
  onAbort?: () => void;
  targetName?: string;
}

export const PokethologyRadarScanner = memo(({ onAbort, targetName }: PokethologyRadarScannerProps) => {
  const [dots, setDots] = useState<{ id: number; x: number; y: number; size: number; alpha: number; delay: number }[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70,
      size: Math.random() > 0.6 ? 3 : 2,
      alpha: 0.3 + Math.random() * 0.7,
      delay: Math.random() * 2
    }));
    setDots(generated);
  }, []);

  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto flex items-center justify-center">
      {/* Outer Rotating Radar Ring */}
      <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 border-dashed animate-spin-slow" style={{ animationDuration: '24s' }} />
      <div className="absolute inset-4 rounded-full border border-cyan-500/20" />
      <div className="absolute inset-12 rounded-full border border-cyan-500/15" />
      <div className="absolute inset-20 rounded-full border border-cyan-500/10" />

      {/* Axis crosshairs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-[1px] bg-cyan-500/20" />
        <div className="absolute h-full w-[1px] bg-cyan-500/20" />
      </div>

      {/* Radar sweeping beam */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, rgba(6, 182, 212, 0.4) 0deg, rgba(6, 182, 212, 0) 60deg, transparent 60deg)'
        }}
      />

      {/* Detected Blip points */}
      {dots.map(dot => (
        <motion.div
          key={dot.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, dot.alpha, 0], scale: [0.5, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 3, delay: dot.delay, ease: "easeInOut" }}
          style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
          className="absolute w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-[0_0_8px_#06b6d4] pointer-events-none"
        />
      ))}

      {/* Center Target Indicator */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="relative flex items-center justify-center">
          <Target className="w-10 h-10 text-cyan-400 animate-pulse" />
          <div className="absolute inset-0 w-10 h-10 border border-cyan-400 rounded-full animate-ping opacity-30" />
        </div>
        {targetName && (
          <div className="px-3 py-1 bg-slate-900/90 border border-cyan-500/50 rounded-lg text-center shadow-lg">
            <span className="text-[10px] font-mono text-cyan-400 tracking-wider uppercase font-bold block">{targetName}</span>
            <span className="text-[8px] font-mono text-slate-400 tracking-widest uppercase">SCANNING FREQUENCY</span>
          </div>
        )}
        {onAbort && (
          <button
            onClick={onAbort}
            className="mt-2 px-3 py-1 bg-red-950/60 hover:bg-red-900/80 border border-red-500/50 rounded-lg text-[9px] font-hud text-red-400 font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            CANCEL SCAN
          </button>
        )}
      </div>
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
