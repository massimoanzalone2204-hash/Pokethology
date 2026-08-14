import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Crown, Swords, ShieldCheck, CheckCircle2, Sparkles, Clock, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { HUDCorners } from './HUDCorners';
import { cn } from '../lib/utils';
import { ParticleExplosion } from './ParticleExplosion';

interface TierCompleted3DBadgeProps {
  tier: 'bronze' | 'silver' | 'gold';
  onNavigateToArena?: () => void;
  onSwitchTier?: (tier: 'bronze' | 'silver' | 'gold') => void;
  otherTiersProgress?: {
    bronze: number;
    silver: number;
    gold: number;
  };
}

export const TierCompleted3DBadge: React.FC<TierCompleted3DBadgeProps> = ({
  tier,
  onNavigateToArena,
  onSwitchTier,
  otherTiersProgress
}) => {
  const [timeUntilReset, setTimeUntilReset] = useState('');

  // Calculate live countdown to next 00:00 UTC
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextUtc = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0, 0, 0, 0
      ));
      const diff = Math.max(0, nextUtc.getTime() - now.getTime());
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUntilReset(
        `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const config = {
    bronze: {
      name: 'Bronze Tier',
      division: 'BRONZE DIVISION',
      medalOuter: 'from-amber-600 via-yellow-700 to-amber-900 border-amber-500/80 shadow-[0_0_35px_rgba(217,119,6,0.5)]',
      medalInner: 'from-amber-800 via-amber-700 to-amber-950 border-amber-400/60',
      metalHighlight: 'rgba(251,191,36,0.35)',
      glowColor: 'rgba(245,158,11,0.25)',
      titleColor: 'text-amber-400',
      badgeBorder: 'border-amber-500/40 bg-amber-950/40 text-amber-300',
      accentGradient: 'from-amber-500 to-yellow-400',
      nextTier: 'silver' as const,
      nextTierLabel: 'Silver Tier'
    },
    silver: {
      name: 'Silver Tier',
      division: 'SILVER DIVISION',
      medalOuter: 'from-slate-200 via-slate-400 to-slate-700 border-cyan-300/80 shadow-[0_0_35px_rgba(148,163,184,0.5)]',
      medalInner: 'from-slate-800 via-slate-700 to-slate-900 border-slate-300/70',
      metalHighlight: 'rgba(226,232,240,0.4)',
      glowColor: 'rgba(6,182,212,0.25)',
      titleColor: 'text-slate-200',
      badgeBorder: 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300',
      accentGradient: 'from-cyan-400 to-slate-200',
      nextTier: 'gold' as const,
      nextTierLabel: 'Gold Tier'
    },
    gold: {
      name: 'Gold Tier',
      division: 'GOLD DIVISION',
      medalOuter: 'from-yellow-300 via-amber-500 to-yellow-700 border-yellow-300/90 shadow-[0_0_40px_rgba(234,179,8,0.6)]',
      medalInner: 'from-yellow-900 via-amber-800 to-slate-950 border-yellow-400/80',
      metalHighlight: 'rgba(253,224,71,0.45)',
      glowColor: 'rgba(234,179,8,0.3)',
      titleColor: 'text-yellow-400',
      badgeBorder: 'border-yellow-500/40 bg-yellow-950/40 text-yellow-300',
      accentGradient: 'from-yellow-400 to-amber-300',
      nextTier: null,
      nextTierLabel: null
    }
  }[tier];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-950/95 border border-white/10 shadow-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center gap-6"
    >
      <HUDCorners />
      <ParticleExplosion active={true} />

      {/* Ambient background glow */}
      <div 
        className="absolute w-72 h-72 rounded-full blur-3xl pointer-events-none -top-10 animate-pulse"
        style={{ backgroundColor: config.glowColor }}
      />

      {/* Top Completion Header Pill */}
      <div className="flex items-center gap-2 z-10">
        <span className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-hud font-black uppercase tracking-widest border shadow-sm",
          config.badgeBorder
        )}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          {config.division} • 100% COMPLETED
        </span>
      </div>

      {/* 3D Animated Interactive Badge Container */}
      <div className="relative my-2 py-4 flex items-center justify-center perspective-[1000px] z-10 select-none">
        {/* Orbiting particle ring */}
        <motion.div 
          className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-dashed border-white/20 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <div className={cn("absolute -top-1.5 left-1/2 -ml-1.5 w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] bg-gradient-to-r", config.accentGradient)} />
          <div className={cn("absolute -bottom-1.5 left-1/2 -ml-1.5 w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] bg-gradient-to-r", config.accentGradient)} />
        </motion.div>

        {/* Floating 3D Badge Node */}
        <motion.div
          animate={{ 
            y: [-6, 6, -6],
            rotateX: [4, -4, 4],
            rotateY: [-6, 6, -6],
            rotateZ: [-1, 1, -1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative cursor-pointer group"
        >
          {/* External Halo Glow */}
          <div 
            className="absolute -inset-4 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: config.glowColor }}
          />

          {/* 3D Medal Outer Coin Ring */}
          <div className={cn(
            "relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-2.5 bg-gradient-to-br border-2 flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.6)] transform-gpu transition-transform duration-300 group-hover:scale-105",
            config.medalOuter
          )}>
            {/* Shimmer Light Sweep */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <motion.div
                className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
              />
            </div>

            {/* Inner Recessed Medal Core */}
            <div className={cn(
              "w-full h-full rounded-full p-2 bg-gradient-to-br border flex flex-col items-center justify-center relative overflow-hidden shadow-inner",
              config.medalInner
            )}>
              {/* Star / Crest Motif */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                {tier === 'bronze' && (
                  <>
                    <ShieldCheck className="w-8 h-8 sm:w-11 sm:h-11 text-amber-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                      <span className="text-[8px] sm:text-[9px] font-hud font-black text-amber-200 tracking-wider">RANK I</span>
                    </div>
                  </>
                )}

                {tier === 'silver' && (
                  <>
                    <Swords className="w-8 h-8 sm:w-11 sm:h-11 text-cyan-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <Zap className="w-2.5 h-2.5 text-cyan-300" />
                      <span className="text-[8px] sm:text-[9px] font-hud font-black text-slate-100 tracking-wider">RANK II</span>
                    </div>
                  </>
                )}

                {tier === 'gold' && (
                  <>
                    <Crown className="w-9 h-9 sm:w-12 sm:h-12 text-yellow-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] animate-pulse" />
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <Trophy className="w-2.5 h-2.5 text-yellow-300" />
                      <span className="text-[8px] sm:text-[9px] font-hud font-black text-yellow-200 tracking-wider">MASTER</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Primary Status & Explanatory Notice */}
      <div className="space-y-2 z-10 max-w-md">
        <h3 className={cn("text-lg sm:text-xl font-hud font-black uppercase tracking-wider", config.titleColor)}>
          {config.name} Objectives Completed
        </h3>
        
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          You have finished all tactical operations for the <strong className="text-white">{config.name}</strong> today!
        </p>

        {/* Come Back Tomorrow Box */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs flex flex-col gap-2 mt-3 shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-hud uppercase tracking-wider text-slate-400 border-b border-white/5 pb-1.5">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Next Missions Arrival
            </span>
            <span className="font-mono font-bold text-cyan-300">{timeUntilReset}</span>
          </div>

          <p className="text-[11px] text-slate-400 leading-normal text-left">
            Come back tomorrow for brand new daily questions, research puzzles, and fresh Combat Arena challenges.
          </p>
        </div>
      </div>

      {/* Interactive Navigation Footer */}
      <div className="flex flex-wrap items-center justify-center gap-3 z-10 w-full max-w-md pt-1">
        {onNavigateToArena && (
          <button
            onClick={onNavigateToArena}
            className="flex-1 min-w-[140px] py-2.5 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-hud font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/50 active:scale-95 border border-red-400/30"
          >
            <Swords className="w-4 h-4" />
            Enter Combat Arena
          </button>
        )}

        {config.nextTier && onSwitchTier && otherTiersProgress && otherTiersProgress[config.nextTier] < 4 && (
          <button
            onClick={() => onSwitchTier(config.nextTier as any)}
            className="flex-1 min-w-[140px] py-2.5 px-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-hud font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow"
          >
            <span>Play {config.nextTierLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
