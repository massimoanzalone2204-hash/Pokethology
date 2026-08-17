import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Trophy, ShieldAlert, Zap, TrendingUp, Clock, RotateCcw, Target, Sparkles, ChevronRight, Hash, Eye, Award } from 'lucide-react';
import { HUDCorners } from './HUDCorners';

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
  isLightMode?: boolean;
  missionNotice?: {
    title: string;
    description: string;
    isComplete: boolean;
  } | null;
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
  isLightMode,
  missionNotice
}: BattleResultScreenProps) {
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

            {/* Mission Objective Milestone Notice */}
            {missionNotice && (
              <div className={cn(
                "p-3 rounded-xl border flex items-center gap-3 relative overflow-hidden",
                missionNotice.isComplete 
                  ? "bg-emerald-950/70 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.25)]" 
                  : "bg-cyan-950/70 border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.25)]"
              )}>
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center shrink-0 border",
                  missionNotice.isComplete 
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300" 
                    : "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                )}>
                  {missionNotice.isComplete ? (
                    <Trophy className="w-5 h-5 animate-bounce" />
                  ) : (
                    <Target className="w-5 h-5 animate-pulse" />
                  )}
                </div>
                <div className="flex flex-col text-left overflow-hidden">
                  <span className={cn(
                    "text-[10px] font-hud font-black uppercase tracking-wider flex items-center gap-1",
                    missionNotice.isComplete ? "text-emerald-400" : "text-cyan-400"
                  )}>
                    {missionNotice.isComplete ? "🎉 MISSION OBJECTIVE COMPLETED" : "⚔️ DAILY HUB MISSION PROGRESS"}
                  </span>
                  <span className="text-xs font-bold text-white truncate">
                    {missionNotice.title}
                  </span>
                  <span className="text-[10px] text-slate-300 font-sans truncate">
                    {missionNotice.description}
                  </span>
                </div>
              </div>
            )}

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
