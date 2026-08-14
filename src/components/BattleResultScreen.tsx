import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Trophy, ShieldAlert, Zap, TrendingUp, Clock, RotateCcw, Target, Sparkles, ChevronRight, Hash, Eye, Award, Swords, CheckCircle2, ShieldCheck, Flame, Crown, X } from 'lucide-react';
import { HUDCorners } from './HUDCorners';
import { ChallengeProgressResult } from '../lib/dailyCombatChallenges';

interface BattleResultScreenProps {
  isOpen: boolean;
  battleResult: 'victory' | 'defeat' | null;
  pokemon: any;
  battleOpponent: any;
  battleLog: any[];
  turnNumber: number;
  pokemonHP: number;
  opponentHP: number;
  pokemonMaxHP: number;
  opponentMaxHP: number;
  pokemonStatus: any;
  opponentStatus: any;
  onRematch: () => void;
  onInspect: () => void;
  onNewBattle: () => void;
  onOpenDailyHub?: () => void;
  recentChallengeProgress?: ChallengeProgressResult[];
  isLightMode?: boolean;
}

export function BattleResultScreen({
  isOpen,
  battleResult,
  pokemon,
  battleOpponent,
  battleLog,
  turnNumber,
  pokemonHP,
  opponentHP,
  pokemonMaxHP,
  opponentMaxHP,
  onRematch,
  onInspect,
  onNewBattle,
  onOpenDailyHub,
  recentChallengeProgress = [],
  isLightMode
}: BattleResultScreenProps) {
  const [showToast, setShowToast] = useState(false);

  // Automatically show toast if there's progress, and dismiss after 8 seconds
  useEffect(() => {
    if (isOpen && recentChallengeProgress && recentChallengeProgress.length > 0) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 8000);
      return () => clearTimeout(timer);
    } else {
      setShowToast(false);
    }
  }, [isOpen, recentChallengeProgress]);

  if (!isOpen) return null;

  const isVictory = battleResult === 'victory';
  const playerFinalHP = Math.max(0, Math.ceil(pokemonHP));
  const opponentFinalHP = Math.max(0, Math.ceil(opponentHP));
  
  const playerHPPercent = Math.min(100, Math.max(0, Math.ceil((playerFinalHP / pokemonMaxHP) * 100)));
  const opponentHPPercent = Math.min(100, Math.max(0, Math.ceil((opponentFinalHP / opponentMaxHP) * 100)));

  const victorHP = isVictory ? playerFinalHP : opponentFinalHP;
  const victorMaxHP = isVictory ? pokemonMaxHP : opponentMaxHP;
  const victorHPPercent = Math.ceil((victorHP / victorMaxHP) * 100);

  const lastLogs = battleLog.slice(-3);

  const getSprite = (p: any) => {
    if (!p) return '';
    return p.sprites?.other?.home?.front_default ||
           p.sprites?.other?.['official-artwork']?.front_default ||
           p.sprites?.front_default ||
           p.sprite ||
           p.image ||
           '';
  };

  const playerSprite = getSprite(pokemon);
  const opponentSprite = getSprite(battleOpponent);

  const theme = isLightMode 
    ? (isVictory ? "bg-slate-50 border-emerald-300 text-slate-800" : "bg-slate-50 border-rose-300 text-slate-800")
    : (isVictory ? "bg-slate-950/95 border-emerald-500/40 text-slate-100" : "bg-slate-950/95 border-rose-500/40 text-slate-100");

  const accentColor = isVictory 
    ? (isLightMode ? "text-emerald-600" : "text-emerald-400") 
    : (isLightMode ? "text-rose-600" : "text-rose-400");

  const bgOverlay = isLightMode ? "bg-slate-900/60" : "bg-slate-950/90";
  const cardBg = isLightMode ? "bg-white/80 border-slate-200" : "bg-slate-900/50 border-slate-800/80";

  return (
    <AnimatePresence>
      <motion.div
        key="battle-result-modal"
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        className={cn("fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-4 overflow-y-auto", bgOverlay)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          className={cn(
            "w-full max-w-xl rounded-2xl border shadow-2xl relative overflow-hidden flex flex-col my-auto",
            theme
          )}
        >
          <HUDCorners />

          {/* Sleek Header Banner */}
          <div className="text-center py-4 px-4 relative z-10 border-b border-inherit bg-black/10 flex flex-col items-center justify-center">
            <h2 className={cn("font-hud font-black text-2xl sm:text-3xl uppercase tracking-widest", accentColor)}>
              {isVictory ? "MATCH WIN" : "MATCH LOSE"}
            </h2>
          </div>

          {/* Main Visual Head-To-Head Cards */}
          <div className="p-4 sm:p-5 space-y-4">
            
            {/* Pokemon Matchup Showcase */}
            <div className="grid grid-cols-2 gap-3 relative">
              {/* VS badge in middle */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-hud text-[10px] font-black text-slate-400 shadow-md">
                VS
              </div>

              {/* Player Fighter Card */}
              <div className={cn(
                "p-3 rounded-xl border flex flex-col items-center text-center relative overflow-hidden transition-all",
                cardBg,
                isVictory ? "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : "opacity-75"
              )}>
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-hud font-black tracking-wider uppercase border bg-black/30 border-inherit">
                  {isVictory ? (
                    <span className="text-emerald-400 flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" /> WINNER</span>
                  ) : (
                    <span className="text-rose-400">FAINTED</span>
                  )}
                </div>

                <div className="w-16 h-16 sm:w-20 sm:h-20 my-1 relative flex items-center justify-center">
                  {playerSprite ? (
                    <img 
                      src={playerSprite} 
                      alt={pokemon?.name} 
                      className={cn(
                        "w-full h-full object-contain filter drop-shadow-md transition-all",
                        !isVictory && "grayscale opacity-60"
                      )}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs">
                      {pokemon?.name?.substring(0, 3)}
                    </div>
                  )}
                </div>

                <span className="font-hud font-bold text-xs uppercase tracking-wider truncate w-full mt-1">
                  {pokemon?.name?.replace('-', ' ')}
                </span>

                {/* HP Bar */}
                <div className="w-full mt-2">
                  <div className="flex justify-between text-[9px] font-mono opacity-80 mb-0.5">
                    <span>HP</span>
                    <span>{playerFinalHP} / {pokemonMaxHP}</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden border border-inherit">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500 rounded-full",
                        playerHPPercent > 50 ? "bg-emerald-500" : playerHPPercent > 20 ? "bg-amber-500" : "bg-rose-500"
                      )} 
                      style={{ width: `${playerHPPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Opponent Fighter Card */}
              <div className={cn(
                "p-3 rounded-xl border flex flex-col items-center text-center relative overflow-hidden transition-all",
                cardBg,
                !isVictory ? "border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]" : "opacity-75"
              )}>
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-hud font-black tracking-wider uppercase border bg-black/30 border-inherit">
                  {!isVictory ? (
                    <span className="text-rose-400 flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" /> WINNER</span>
                  ) : (
                    <span className="text-slate-400">FAINTED</span>
                  )}
                </div>

                <div className="w-16 h-16 sm:w-20 sm:h-20 my-1 relative flex items-center justify-center">
                  {opponentSprite ? (
                    <img 
                      src={opponentSprite} 
                      alt={battleOpponent?.name} 
                      className={cn(
                        "w-full h-full object-contain filter drop-shadow-md transition-all",
                        isVictory && "grayscale opacity-60"
                      )}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs">
                      {battleOpponent?.name?.substring(0, 3)}
                    </div>
                  )}
                </div>

                <span className="font-hud font-bold text-xs uppercase tracking-wider truncate w-full mt-1">
                  {battleOpponent?.name?.replace('-', ' ')}
                </span>

                {/* HP Bar */}
                <div className="w-full mt-2">
                  <div className="flex justify-between text-[9px] font-mono opacity-80 mb-0.5">
                    <span>HP</span>
                    <span>{opponentFinalHP} / {opponentMaxHP}</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden border border-inherit">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500 rounded-full",
                        opponentHPPercent > 50 ? "bg-emerald-500" : opponentHPPercent > 20 ? "bg-amber-500" : "bg-rose-500"
                      )} 
                      style={{ width: `${opponentHPPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-2">
              <div className={cn("p-2.5 rounded-xl border flex flex-col items-center text-center", cardBg)}>
                <span className="text-[9px] uppercase font-hud tracking-wider opacity-60 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-cyan-400" /> Turns
                </span>
                <span className="font-mono font-bold text-base sm:text-lg mt-0.5">{turnNumber}</span>
              </div>

              <div className={cn("p-2.5 rounded-xl border flex flex-col items-center text-center", cardBg)}>
                <span className="text-[9px] uppercase font-hud tracking-wider opacity-60 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" /> Rank
                </span>
                <span className={cn("font-hud font-black text-base sm:text-lg mt-0.5", accentColor)}>
                  {isVictory ? (victorHPPercent > 50 ? 'S-RANK' : 'A-RANK') : 'C-RANK'}
                </span>
              </div>
            </div>

            {/* 8-Second Auto-dismissing Notification for Daily Hub Progress */}
            <AnimatePresence>
              {showToast && recentChallengeProgress.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.3 } }}
                  className={cn(
                    "p-3 rounded-xl border relative overflow-hidden shadow-lg",
                    isLightMode ? "bg-amber-500/10 border-amber-500/30 text-amber-900" : "bg-slate-900/95 border-amber-500/40 text-slate-100 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                  )}
                >
                  <HUDCorners />
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                        <Target className="w-3.5 h-3.5 animate-pulse" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-hud font-black text-amber-400 uppercase tracking-widest block truncate">
                          DAILY HUB OPERATIONS UPDATED
                        </span>
                        <span className="text-[9px] font-mono text-slate-300 truncate block">
                          {recentChallengeProgress.some(p => p.justCompleted || p.next >= p.requirement) 
                            ? '⭐ Daily combat objective completed!' 
                            : `Combat battle recorded (${recentChallengeProgress.length} challenge${recentChallengeProgress.length > 1 ? 's' : ''} updated)`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {onOpenDailyHub && (
                        <button
                          onClick={onOpenDailyHub}
                          className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-hud text-[8.5px] font-black uppercase tracking-wider transition-all flex items-center gap-0.5 active:scale-95 cursor-pointer"
                        >
                          HUB <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => setShowToast(false)}
                        className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 8-second countdown bar */}
                  <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden mt-2 border border-white/5">
                    <motion.div
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 8, ease: "linear" }}
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Minimal Final Combat Logs */}
            {lastLogs.length > 0 && (
              <div className={cn("p-3 rounded-xl border space-y-1.5", cardBg)}>
                <div className="flex items-center gap-1.5 text-[10px] font-hud uppercase tracking-wider opacity-70 border-b border-inherit pb-1.5">
                  <Clock className="w-3 h-3 text-cyan-400" /> Final Log Sequence
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  {lastLogs.map((logItem, i) => (
                    <div key={`reslog-${logItem.turn || i}-${i}`} className="flex gap-2 items-center truncate">
                      <span className="text-[9px] font-hud font-bold opacity-50 shrink-0">T{logItem.turn || turnNumber}</span>
                      <span className="truncate opacity-90">{logItem.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Action Footer Buttons */}
          <div className="p-4 bg-black/20 border-t border-inherit flex flex-wrap gap-2.5 justify-end">
            {onOpenDailyHub && (
              <button
                onClick={onOpenDailyHub}
                className={cn(
                  "px-3.5 py-2.5 rounded-xl font-hud font-black uppercase tracking-wider text-xs transition-all border flex items-center gap-1.5 active:scale-95 cursor-pointer",
                  isLightMode 
                    ? "bg-amber-100/80 border-amber-300 text-amber-900 hover:bg-amber-200" 
                    : "bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                )}
              >
                <Target className="w-3.5 h-3.5 text-amber-400" /> Daily Hub
              </button>
            )}

            <button
              onClick={onRematch}
              className={cn(
                "px-4 py-2.5 rounded-xl font-hud font-extrabold uppercase tracking-wider text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer",
                isVictory 
                  ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20"
                  : "bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/20"
              )}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Rematch
            </button>

            <button
              onClick={onInspect}
              className={cn(
                "px-4 py-2.5 rounded-xl font-hud font-extrabold uppercase tracking-wider text-xs transition-all border flex items-center gap-1.5 hover:bg-black/10 active:scale-95 cursor-pointer",
                isLightMode ? "border-slate-300 text-slate-700 hover:border-slate-400" : "border-slate-700 text-slate-300 hover:border-slate-500"
              )}
            >
              <Eye className="w-3.5 h-3.5" /> Inspect Data
            </button>

            <button
              onClick={onNewBattle}
              className={cn(
                "px-4 py-2.5 rounded-xl font-hud font-extrabold uppercase tracking-wider text-xs transition-all border flex items-center gap-1.5 hover:bg-black/10 active:scale-95 cursor-pointer",
                isLightMode ? "border-slate-300 text-slate-700 hover:border-slate-400" : "border-slate-700 text-slate-300 hover:border-slate-500"
              )}
            >
              Arena <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
