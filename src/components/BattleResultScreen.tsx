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
    : (isVictory ? "bg-slate-950/98 border-emerald-500/40 text-slate-100" : "bg-slate-950/98 border-rose-500/40 text-slate-100");

  const accentColor = isVictory 
    ? (isLightMode ? "text-emerald-600" : "text-emerald-400") 
    : (isLightMode ? "text-rose-600" : "text-rose-400");

  const headerBg = isLightMode ? "bg-white border-slate-200 text-slate-900 shadow-sm" : "bg-slate-900/95 border-slate-800 text-slate-100 shadow-lg";
  const footerBg = isLightMode ? "bg-slate-100/95 border-slate-200 text-slate-800" : "bg-slate-950/95 border-slate-800 text-slate-100";
  const cardBg = isLightMode ? "bg-white border-slate-300 text-slate-800 shadow-md" : "bg-slate-900/90 border-slate-750 text-slate-100 shadow-xl";
  const cardBorderAccent = isVictory 
    ? (isLightMode ? "border-emerald-400" : "border-emerald-500/60") 
    : (isLightMode ? "border-rose-400" : "border-rose-500/60");

  return (
    <AnimatePresence>
      <motion.div
        key="battle-result-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={cn("fixed inset-0 z-[300] flex flex-col overflow-hidden text-slate-100 backdrop-blur-2xl", theme)}
      >
        {/* Background Ambient Glows */}
        {isVictory ? (
          <>
            <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
          </>
        )}

        {/* Top Header Banner */}
        <div className={cn("shrink-0 border-b px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-4 z-20", headerBg)}>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={cn(
              "w-10 h-10 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-lg",
              isVictory 
                ? "bg-emerald-500/20 border-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-emerald-400" 
                : "bg-rose-500/20 border-rose-400/80 shadow-[0_0_20px_rgba(244,63,94,0.3)] text-rose-400"
            )}>
              {isVictory ? (
                <Trophy className="w-5 h-5 sm:w-7 sm:h-7" />
              ) : (
                <ShieldAlert className="w-5 h-5 sm:w-7 sm:h-7" />
              )}
            </div>
            <div>
              <h2 className={cn("font-hud font-black text-xl sm:text-3xl uppercase tracking-widest leading-none", accentColor)}>
                {isVictory ? "VICTORY ACHIEVED" : "DEFEAT SUSTAINED"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs font-bold">
            <span className={cn("w-2.5 h-2.5 rounded-full animate-pulse", isVictory ? "bg-emerald-400" : "bg-rose-400")} />
            <span className={cn("hidden sm:inline uppercase tracking-wider", isLightMode ? "text-slate-700" : "text-slate-300")}>
              {isVictory ? "MATCH WIN" : "MATCH LOSE"}
            </span>
          </div>
        </div>

        {/* Scrollable Center Content Area - Optimized full-screen layout */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-6 md:p-8 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.97, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            className="w-full max-w-2xl sm:max-w-3xl space-y-3.5 sm:space-y-5 my-auto py-2"
          >
            {/* Pokemon Matchup Showcase */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5 relative">
              {/* VS badge in middle */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900 border-2 border-cyan-500/60 flex items-center justify-center font-hud text-xs sm:text-sm font-black text-cyan-300 shadow-2xl">
                VS
              </div>

              {/* Player Fighter Card */}
              <div className={cn(
                "p-3 sm:p-5 rounded-2xl border-2 flex flex-col items-center text-center relative overflow-hidden transition-all",
                cardBg,
                isVictory ? "border-emerald-500/70 shadow-[0_0_25px_rgba(16,185,129,0.2)]" : "border-slate-700/60 opacity-90"
              )}>
                <HUDCorners />
                <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 px-2 py-0.5 rounded-lg text-[10px] font-hud font-black tracking-wider uppercase border bg-slate-950/80 border-inherit z-10">
                  {isVictory ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-extrabold"><Sparkles className="w-3 h-3" /> WINNER</span>
                  ) : (
                    <span className="text-rose-400 font-extrabold">FAINTED</span>
                  )}
                </div>

                <div className="w-16 h-16 sm:w-24 sm:h-24 my-1 sm:my-2 relative flex items-center justify-center">
                  {playerSprite ? (
                    <img 
                      src={playerSprite} 
                      alt={pokemon?.name} 
                      className={cn(
                        "w-full h-full object-contain filter drop-shadow-xl transition-all",
                        !isVictory && "grayscale opacity-50"
                      )}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-200">
                      {pokemon?.name?.substring(0, 3)}
                    </div>
                  )}
                </div>

                <span className={cn("font-hud font-extrabold text-xs sm:text-lg uppercase tracking-wider truncate w-full mt-1", isLightMode ? "text-slate-900" : "text-white")}>
                  {pokemon?.name?.replace('-', ' ')}
                </span>

                {/* HP Bar */}
                <div className="w-full mt-2 sm:mt-3">
                  <div className="flex justify-between text-[11px] sm:text-xs font-mono font-bold mb-1">
                    <span className={isLightMode ? "text-slate-600" : "text-slate-400"}>HP</span>
                    <span className={isLightMode ? "text-slate-900" : "text-slate-200"}>{playerFinalHP} / {pokemonMaxHP}</span>
                  </div>
                  <div className="w-full h-2 sm:h-2.5 bg-slate-950/60 rounded-full overflow-hidden border border-slate-700/60">
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
                "p-3 sm:p-5 rounded-2xl border-2 flex flex-col items-center text-center relative overflow-hidden transition-all",
                cardBg,
                !isVictory ? "border-rose-500/70 shadow-[0_0_25px_rgba(244,63,94,0.2)]" : "border-slate-700/60 opacity-90"
              )}>
                <HUDCorners />
                <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 px-2 py-0.5 rounded-lg text-[10px] font-hud font-black tracking-wider uppercase border bg-slate-950/80 border-inherit z-10">
                  {!isVictory ? (
                    <span className="text-rose-400 flex items-center gap-1 font-extrabold"><Sparkles className="w-3 h-3" /> WINNER</span>
                  ) : (
                    <span className="text-slate-400 font-extrabold">FAINTED</span>
                  )}
                </div>

                <div className="w-16 h-16 sm:w-24 sm:h-24 my-1 sm:my-2 relative flex items-center justify-center">
                  {opponentSprite ? (
                    <img 
                      src={opponentSprite} 
                      alt={battleOpponent?.name} 
                      className={cn(
                        "w-full h-full object-contain filter drop-shadow-xl transition-all",
                        isVictory && "grayscale opacity-50"
                      )}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-200">
                      {battleOpponent?.name?.substring(0, 3)}
                    </div>
                  )}
                </div>

                <span className={cn("font-hud font-extrabold text-xs sm:text-lg uppercase tracking-wider truncate w-full mt-1", isLightMode ? "text-slate-900" : "text-white")}>
                  {battleOpponent?.name?.replace('-', ' ')}
                </span>

                {/* HP Bar */}
                <div className="w-full mt-2 sm:mt-3">
                  <div className="flex justify-between text-[11px] sm:text-xs font-mono font-bold mb-1">
                    <span className={isLightMode ? "text-slate-600" : "text-slate-400"}>HP</span>
                    <span className={isLightMode ? "text-slate-900" : "text-slate-200"}>{opponentFinalHP} / {opponentMaxHP}</span>
                  </div>
                  <div className="w-full h-2 sm:h-2.5 bg-slate-950/60 rounded-full overflow-hidden border border-slate-700/60">
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
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              <div className={cn("p-3 sm:p-4 rounded-xl border flex flex-col items-center text-center", cardBg)}>
                <span className={cn("text-[11px] sm:text-xs uppercase font-hud tracking-wider flex items-center gap-1 font-bold", isLightMode ? "text-slate-600" : "text-slate-400")}>
                  <Hash className="w-3.5 h-3.5 text-cyan-400" /> Turns
                </span>
                <span className="font-mono font-black text-lg sm:text-2xl mt-1 text-cyan-400">{turnNumber}</span>
              </div>

              <div className={cn("p-3 sm:p-4 rounded-xl border flex flex-col items-center text-center", cardBg)}>
                <span className={cn("text-[11px] sm:text-xs uppercase font-hud tracking-wider flex items-center gap-1 font-bold", isLightMode ? "text-slate-600" : "text-slate-400")}>
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Rank
                </span>
                <span className={cn("font-hud font-black text-lg sm:text-2xl mt-1", accentColor)}>
                  {isVictory ? (victorHPPercent > 50 ? 'S-RANK' : 'A-RANK') : 'C-RANK'}
                </span>
              </div>

              <div className={cn("p-3 sm:p-4 rounded-xl border flex flex-col items-center text-center", cardBg)}>
                <span className={cn("text-[11px] sm:text-xs uppercase font-hud tracking-wider flex items-center gap-1 font-bold", isLightMode ? "text-slate-600" : "text-slate-400")}>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Victor HP
                </span>
                <span className="font-mono font-black text-lg sm:text-2xl mt-1 text-emerald-400">
                  {victorHPPercent}%
                </span>
              </div>
            </div>

            {/* Mission Objective Milestone Notice */}
            {missionNotice && (
              <div className={cn(
                "p-3.5 sm:p-4 rounded-2xl border flex items-center gap-3.5 relative overflow-hidden shadow-lg",
                missionNotice.isComplete 
                  ? "bg-emerald-950/90 border-emerald-500/70 text-white" 
                  : "bg-slate-900/95 border-cyan-500/70 text-white"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-md",
                  missionNotice.isComplete 
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300" 
                    : "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                )}>
                  {missionNotice.isComplete ? (
                    <Trophy className="w-6 h-6 animate-bounce" />
                  ) : (
                    <Target className="w-6 h-6 animate-pulse" />
                  )}
                </div>
                <div className="flex flex-col text-left overflow-hidden">
                  <span className={cn(
                    "text-xs font-hud font-black uppercase tracking-wider flex items-center gap-1",
                    missionNotice.isComplete ? "text-emerald-400" : "text-cyan-400"
                  )}>
                    {missionNotice.isComplete ? "🎉 MISSION OBJECTIVE COMPLETED" : "⚔️ DAILY HUB MISSION PROGRESS"}
                  </span>
                  <span className="text-sm font-black text-white truncate mt-0.5">
                    {missionNotice.title}
                  </span>
                  <span className="text-xs text-slate-200 font-sans truncate font-medium">
                    {missionNotice.description}
                  </span>
                </div>
              </div>
            )}

            {/* Minimal Final Combat Logs */}
            {lastLogs.length > 0 && (
              <div className={cn("p-3.5 sm:p-4 rounded-2xl border space-y-2", cardBg)}>
                <div className={cn("flex items-center gap-2 text-xs font-hud font-bold uppercase tracking-wider border-b pb-2", isLightMode ? "border-slate-200 text-slate-700" : "border-slate-800 text-slate-300")}>
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Final Log Sequence
                </div>
                <div className="space-y-1.5 font-mono text-xs">
                  {lastLogs.map((logItem, i) => (
                    <div key={`reslog-${logItem.turn || i}-${i}`} className="flex gap-2.5 items-center truncate">
                      <span className="text-[10px] font-hud font-bold text-cyan-400/90 shrink-0">T{logItem.turn || turnNumber}</span>
                      <span className={cn("truncate font-medium", isLightMode ? "text-slate-800" : "text-slate-200")}>{logItem.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Action Footer Buttons */}
        <div className={cn("shrink-0 p-3 sm:px-8 sm:py-3.5 border-t flex items-center justify-between gap-3 z-20", footerBg)}>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
            <span className={cn("w-2.5 h-2.5 rounded-full animate-pulse", isVictory ? "bg-emerald-400" : "bg-rose-400")} />
            <span>Combat Evaluation Completed</span>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-stretch sm:justify-end gap-2 sm:gap-3">
            <button
              onClick={onInspect}
              className={cn(
                "flex-1 sm:flex-initial min-w-[95px] sm:min-w-[120px] px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl font-hud font-black uppercase tracking-wider text-xs sm:text-sm transition-all border flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-black/10 active:scale-95 cursor-pointer font-bold whitespace-nowrap",
                isLightMode ? "border-slate-400 bg-white text-slate-800 hover:bg-slate-50" : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
              )}
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Inspect
            </button>

            <button
              onClick={onRematch}
              className={cn(
                "flex-1 sm:flex-initial min-w-[95px] sm:min-w-[120px] px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl font-hud font-black uppercase tracking-wider text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg active:scale-95 cursor-pointer whitespace-nowrap",
                isVictory 
                  ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/30"
                  : "bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/30"
              )}
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Rematch
            </button>

            <button
              onClick={onNewBattle}
              className={cn(
                "flex-1 sm:flex-initial min-w-[95px] sm:min-w-[120px] px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl font-hud font-black uppercase tracking-wider text-xs sm:text-sm transition-all border flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-black/10 active:scale-95 cursor-pointer font-bold whitespace-nowrap",
                isLightMode ? "border-slate-400 bg-white text-slate-800 hover:bg-slate-50" : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
              )}
            >
              Arena <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
