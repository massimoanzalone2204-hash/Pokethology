import React, { memo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ChevronLeft, ChevronRight, Flame, Skull, Zap, Snowflake, Moon, RefreshCw, Crosshair } from 'lucide-react';

const STATUS_ICONS: Record<string, React.ReactNode> = {
  'BRN': <Flame className="w-3 h-3 text-orange-400" />,
  'PSN': <Skull className="w-3 h-3 text-purple-400" />,
  'PAR': <Zap className="w-3 h-3 text-yellow-400" />,
  'FRZ': <Snowflake className="w-3 h-3 text-cyan-400" />,
  'SLP': <Moon className="w-3 h-3 text-slate-400" />,
  'CON': <RefreshCw className="w-3 h-3 text-pink-400" />,
};
import { Pokemon } from '../types';

// Let's copy/define HPBar locally or import if available. We can define/use a polished local HPBar
const HPBar = memo(({ current, max, enableAnimations = true }: { current: number; max: number; enableAnimations?: boolean }) => {
  const percentage = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0;
  const color = percentage > 50 ? 'bg-emerald-500' : percentage > 20 ? 'bg-amber-500' : 'bg-red-500';
  
  const prevPercentageRef = useRef(percentage);
  const [isDamaged, setIsDamaged] = useState(false);
  const [glowTrigger, setGlowTrigger] = useState(0);
  
  useEffect(() => {
    if (percentage < prevPercentageRef.current) {
      setIsDamaged(true);
      setGlowTrigger(prev => prev + 1);
      const timer = setTimeout(() => setIsDamaged(false), 600);
      prevPercentageRef.current = percentage;
      return () => clearTimeout(timer);
    } else {
      setIsDamaged(false);
    }
    prevPercentageRef.current = percentage;
  }, [percentage]);
  
  return (
    <div 
      className={cn(
        "w-full bg-slate-950/90 rounded-full h-1.5 sm:h-2 p-[1px] border my-1 overflow-visible relative transform-gpu transition-colors duration-300",
        isDamaged ? "border-red-500 ring-1 ring-red-500/50" : "border-slate-800/80"
      )}
      key={`hp-bar-${glowTrigger}`}
    >
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {/* Secondary delay translucent red catch-up bar (staggered trailing damage) */}
        <motion.div 
          className="absolute top-0 bottom-0 left-0 bg-red-500/80 rounded-full origin-left transform-gpu"
          initial={{ width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            type: "tween",
            ease: "easeOut",
            duration: 0.35
          }}
        />
        {/* Primary HP color bar - visually drains over when damage is received */}
        <motion.div 
          className={cn("h-full rounded-full relative z-10 origin-left transition-colors duration-300 transform-gpu", color)}
          initial={{ width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            type: "tween",
            ease: "easeOut",
            duration: 0.3
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/20 rounded-full"></div>
          <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-white/70 rounded-r-full"></div>
        </motion.div>
      </div>
    </div>
  );
});

HPBar.displayName = 'HPBar';

const REVERSE_FACING_AVATARS = ['alder', 'ghetsis', 'cilan', 'peony'];

export interface OpponentStatusBarProps {
  battleOpponent: Pokemon | null;
  opponentHP: number;
  opponentMaxHP: number;
  opponentStatStages: Record<string, number>;
  opponentStatus: string | null;
  opponentSubstitute: number;
  opponentProtected: boolean;
  turn: 'player' | 'opponent';
  enableAnimations: boolean;
  isSelectingOpponent: boolean;
  onSelectOpponentClick: () => void;
  onSearchOpponent?: (name: string) => void;
  statChange?: 'none' | 'boost' | 'lower';
  player?: Pokemon | null;
  showComparison?: boolean;
  isCompact?: boolean;
  opponentAvatar?: { id: string; name: string; role?: string } | null;
}

export const OpponentStatusBar: React.FC<OpponentStatusBarProps> = memo(({
  battleOpponent,
  opponentHP,
  opponentMaxHP,
  opponentStatStages,
  opponentStatus,
  opponentSubstitute,
  opponentProtected,
  turn,
  enableAnimations,
  onSelectOpponentClick,
  onSearchOpponent,
  statChange,
  player,
  showComparison,
  isCompact,
  opponentAvatar
}) => {
  const hpPercent = battleOpponent ? Math.ceil((opponentHP / opponentMaxHP) * 100) : 0;
  
  const getBreatheShadow = (percent: number) => {
    if (percent <= 20) return ["0 0 8px rgba(239,68,68,0.2)", "0 0 16px rgba(239,68,68,0.4)", "0 0 8px rgba(239,68,68,0.2)"];
    if (percent <= 50) return ["0 0 6px rgba(234,179,8,0.2)", "0 0 14px rgba(234,179,8,0.3)", "0 0 6px rgba(234,179,8,0.2)"];
    return ["0 0 3px rgba(34,197,94,0.05)", "0 0 8px rgba(34,197,94,0.15)", "0 0 3px rgba(34,197,94,0.05)"];
  };

  const getStatsMap = (poke: Pokemon) => poke.stats.reduce((acc, s) => ({ ...acc, [s.stat.name]: s.base_stat }), {} as Record<string, number>);
  const oStats = battleOpponent ? getStatsMap(battleOpponent) : null;
  const pStats = player ? getStatsMap(player) : null;

  return (
    <AnimatePresence mode="wait">
      {!battleOpponent ? (
        <motion.div
          key="opponent-setup"
          initial={{ opacity: 0, x: -20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "z-20 flex flex-col items-start gap-1 pointer-events-auto",
            isCompact ? "relative w-full max-w-xs mx-auto" : "absolute top-2 right-2 xs:top-3 xs:right-3 sm:top-4 sm:right-4"
          )}
        >
          <div className="pointer-events-auto">
            <button 
              type="button"
              onClick={onSelectOpponentClick}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 min-h-[32px] sm:min-h-[36px] rounded-lg bg-transparent hover:bg-red-500/10 border border-dashed border-red-500/60 hover:border-red-400 text-red-400 hover:text-red-300 transition-all flex items-center gap-1.5 group cursor-pointer"
              title="Select Rival Target"
            >
              <Crosshair className="w-3.5 h-3.5 text-red-400 group-hover:rotate-90 transition-transform duration-300 shrink-0" />
              <span className="text-[9.5px] sm:text-[10.5px] font-hud font-bold tracking-wider uppercase whitespace-nowrap">
                SELECT TARGET
              </span>
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="opponent-battling"
          initial={{ opacity: 0, x: -20, scale: 0.95 }}
          animate={statChange ? { opacity: 1, scale: 1, x: [0, -6, 6, -6, 6, 0] } : { opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "OpponentStatusBar z-20 pointer-events-auto flex items-center gap-1.5 sm:gap-2 transform-gpu",
            isCompact ? "relative w-full max-w-xs mx-auto" : "absolute bottom-2 right-2 xs:bottom-3 xs:right-3 sm:bottom-4 sm:right-4"
          )}
        >
      {/* Opponent Avatar on the left of HP bar (small/little) */}
      {opponentAvatar && (
        <div className="shrink-0 flex items-center justify-center pointer-events-none drop-shadow-md">
          <img 
            src={`https://play.pokemonshowdown.com/sprites/trainers/${opponentAvatar.id}.png`}
            alt={opponentAvatar.name}
            className={cn(
              "w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain [image-rendering:pixelated] drop-shadow-[0_2px_8px_rgba(239,68,68,0.45)]",
              REVERSE_FACING_AVATARS.includes(opponentAvatar.id) && "-scale-x-100"
            )}
          />
        </div>
      )}
      <div className={cn(
        "w-[110px] xs:w-[125px] sm:w-[170px] lg:w-[200px] bg-slate-950/92 border border-red-500/30 rounded-2xl p-1.5 sm:p-2 sm:px-2.5 shadow-md relative group overflow-hidden transition-all duration-200 transform-gpu",
        turn === 'opponent' && "ring-1 ring-red-500/70 border-red-500/80 scale-[1.01]"
      )}>
        {/* Sleek digital accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent"></div>
        
        {/* Row 1: Name, Level, Status & HP% */}
        <div className="flex justify-between items-center gap-1.5 mb-0.5">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[7.5px] xs:text-[8.5px] sm:text-[11px] font-hud font-black text-white uppercase tracking-wider truncate drop-shadow">{battleOpponent?.name}</span>
            <span className="text-[6px] xs:text-[7px] sm:text-[8px] font-bold text-slate-500 font-mono">L50</span>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            {opponentStatus && (
              <span className={cn(
                "px-0.5 py-0.2 rounded text-[4.5px] xs:text-[5px] sm:text-[6.5px] font-hud font-black text-white uppercase tracking-wide shadow",
                opponentStatus === 'BRN' || opponentStatus === 'BUR' ? "bg-orange-700" :
                opponentStatus === 'PAR' ? "bg-amber-600" :
                opponentStatus === 'PSN' || opponentStatus === 'POI' ? "bg-purple-700" :
                opponentStatus === 'FRZ' ? "bg-sky-600" : 
                opponentStatus === 'SLP' || opponentStatus === 'SLE' ? "bg-indigo-700" : 
                opponentStatus === 'CON' ? "bg-pink-600" : "bg-slate-700"
              )}>
                {opponentStatus === 'BUR' ? 'BRN' : opponentStatus === 'POI' ? 'PSN' : opponentStatus === 'SLE' ? 'SLP' : opponentStatus}
              </span>
            )}
            <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-bold font-mono text-cyan-400 drop-shadow">{hpPercent}%</span>
          </div>
        </div>
        
        {/* Row 2: Slim HP Bar */}
        <HPBar current={opponentHP} max={opponentMaxHP} enableAnimations={enableAnimations} />
        
        {/* Row 3: Mini Badges (Active conditions and stat stages) */}
        {(Object.values(opponentStatStages).some(s => s !== 0) || opponentSubstitute > 0 || opponentProtected) && (
          <div className="flex flex-wrap gap-0.5 mt-0.5 items-center">
            {Object.entries(opponentStatStages).map(([stat, stage]) => {
              if (stage === 0) return null;
              return (
                <span key={`opp-stat-${stat}`} className={cn(
                  "text-[5px] sm:text-[6.5px] font-bold tracking-wider px-0.5 rounded uppercase font-mono",
                  stage > 0 ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"
                )}>
                  {stat.substring(0, 3)} {stage > 0 ? `+${stage}` : stage}
                </span>
              );
            })}
            {opponentSubstitute > 0 && (
              <span className="px-0.5 py-0.2 rounded text-[5px] sm:text-[6.5px] font-mono font-bold bg-lime-500/20 text-lime-300 border border-lime-500/30 uppercase">
                SUB
              </span>
            )}
            {opponentProtected && (
              <span className="px-0.5 py-0.2 rounded text-[5px] sm:text-[6.5px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                SAFE
              </span>
            )}
          </div>
        )}

        {/* Stat Comparison (Compact Grid) */}
        {showComparison && pStats && (
          <div className="grid grid-cols-4 gap-0.5 mt-0.5 text-[5.5px] sm:text-[7px] font-mono text-slate-300 bg-slate-950/80 p-0.5 rounded border border-slate-800/60 shadow-inner">
            {['hp', 'attack', 'defense', 'speed'].map(s => {
              const diff = oStats[s] - pStats[s];
              return (
                <div key={`opp-stat-diff-${s}`} className="text-center truncate uppercase leading-none">
                  {s.substring(0, 3)}:<span className={diff > 0 ? "text-green-400 font-bold" : diff < 0 ? "text-red-400 font-bold" : "text-slate-500"}>{diff > 0 ? '+' : ''}{diff}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>


      
      {turn === 'opponent' && (
        <motion.div 
          initial={{ x: -6, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute -right-4 top-1/2 -translate-y-1/2 text-red-500 z-30 pointer-events-none"
        >
          <ChevronLeft className="w-3 h-3 animate-pulse" />
        </motion.div>
      )}
    </motion.div>
      )}
    </AnimatePresence>
  );
});

OpponentStatusBar.displayName = 'OpponentStatusBar';

interface PlayerStatusBarProps {
  pokemon: Pokemon | null;
  pokemonHP: number;
  pokemonMaxHP: number;
  playerStatStages: Record<string, number>;
  pokemonStatus: string | null;
  playerSubstitute: number;
  playerProtected: boolean;
  turn: 'player' | 'opponent';
  enableAnimations: boolean;
  statChange?: 'none' | 'boost' | 'lower';
  opponent?: Pokemon | null;
  showComparison?: boolean;
  isCompact?: boolean;
  playerAvatar?: { id: string; name: string; role?: string } | null;
}

export const PlayerStatusBar: React.FC<PlayerStatusBarProps> = memo(({
  pokemon,
  pokemonHP,
  pokemonMaxHP,
  playerStatStages,
  pokemonStatus,
  playerSubstitute,
  playerProtected,
  turn,
  enableAnimations,
  statChange,
  opponent,
  showComparison,
  isCompact,
  playerAvatar
}) => {
  const getStatsMap = (poke: Pokemon) => poke.stats.reduce((acc, s) => ({ ...acc, [s.stat.name]: s.base_stat }), {} as Record<string, number>);
  const pStats = pokemon ? getStatsMap(pokemon) : null;
  const oStats = opponent ? getStatsMap(opponent) : null;

  return (
    <AnimatePresence mode="wait">
      {!pokemon ? null : (
        <motion.div 
          key="player-battling"
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={statChange ? { opacity: 1, scale: 1, x: [0, 10, -10, 10, -10, 0] } : { opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className={cn(
            "PlayerStatusBar z-20 pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 transform-gpu",
            isCompact ? "relative w-full max-w-xs mx-auto" : "absolute bottom-2 left-2 xs:bottom-3 xs:left-3 sm:bottom-4 sm:left-4"
          )}
        >
      <div className={cn(
        "w-[110px] xs:w-[125px] sm:w-[170px] lg:w-[200px] bg-slate-950/92 border border-cyan-500/30 rounded-2xl p-1.5 sm:p-2 sm:px-2.5 shadow-md relative group overflow-hidden transition-all duration-200 transform-gpu",
        turn === 'player' && "ring-1 ring-cyan-500/70 border-cyan-500/80 scale-[1.01]"
      )}>
        {/* Sleek digital accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
        
        {/* Row 1: Name, Level, Status & HP Value/Ratio */}
        <div className="flex justify-between items-center gap-1.5 mb-0.5">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[7.5px] xs:text-[8.5px] sm:text-[11px] font-hud font-black text-white uppercase tracking-wider truncate drop-shadow">{pokemon?.name}</span>
            <span className="text-[6px] xs:text-[7px] sm:text-[8px] font-bold text-slate-500 font-mono">L50</span>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            {pokemonStatus && (
              <span className={cn(
                "px-0.5 py-0.2 rounded text-[4.5px] xs:text-[5px] sm:text-[6.5px] font-hud font-black text-white uppercase tracking-wide shadow",
                pokemonStatus === 'BRN' || pokemonStatus === 'BUR' ? "bg-orange-700" :
                pokemonStatus === 'PAR' ? "bg-amber-600" :
                pokemonStatus === 'PSN' || pokemonStatus === 'POI' ? "bg-purple-700" :
                pokemonStatus === 'FRZ' ? "bg-sky-600" : 
                pokemonStatus === 'SLP' || pokemonStatus === 'SLE' ? "bg-indigo-700" : 
                pokemonStatus === 'CON' ? "bg-pink-600" : "bg-slate-700"
              )}>
                {pokemonStatus === 'BUR' ? 'BRN' : pokemonStatus === 'POI' ? 'PSN' : pokemonStatus === 'SLE' ? 'SLP' : pokemonStatus}
              </span>
            )}
            <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-bold font-mono text-cyan-400 drop-shadow">{Math.ceil(pokemonHP)}/{pokemonMaxHP}</span>
          </div>
        </div>

        {/* Row 2: Slim HP Bar */}
        <HPBar current={pokemonHP} max={pokemonMaxHP} enableAnimations={enableAnimations} />
        
        {/* Row 3: Mini Badges (Active conditions and stat stages) */}
        {(Object.values(playerStatStages).some(s => s !== 0) || playerSubstitute > 0 || playerProtected) && (
          <div className="flex flex-wrap gap-0.5 mt-0.5 items-center">
            {Object.entries(playerStatStages).map(([stat, stage]) => {
              if (stage === 0) return null;
              return (
                <span key={`opp-stat-${stat}`} className={cn(
                  "text-[5px] sm:text-[6.5px] font-bold tracking-wider px-0.5 rounded uppercase font-mono",
                  stage > 0 ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"
                )}>
                  {stat.substring(0, 3)} {stage > 0 ? `+${stage}` : stage}
                </span>
              );
            })}
            {playerSubstitute > 0 && (
              <span className="px-0.5 py-0.2 rounded text-[5px] sm:text-[6.5px] font-mono font-bold bg-lime-500/20 text-lime-300 border border-lime-500/30 uppercase">
                SUB
              </span>
            )}
            {playerProtected && (
              <span className="px-0.5 py-0.2 rounded text-[5px] sm:text-[6.5px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                SAFE
              </span>
            )}
          </div>
        )}

        {/* Stat Comparison (Compact Grid) */}
        {showComparison && oStats && (
          <div className="grid grid-cols-4 gap-0.5 mt-0.5 text-[5.5px] sm:text-[7px] font-mono text-slate-300 bg-slate-950/80 p-0.5 rounded border border-slate-800/60 shadow-inner">
            {['hp', 'attack', 'defense', 'speed'].map(s => {
              const diff = pStats[s] - oStats[s];
              return (
                <div key={`opp-stat-diff-${s}`} className="text-center truncate uppercase leading-none">
                  {s.substring(0, 3)}:<span className={diff > 0 ? "text-green-400 font-bold" : diff < 0 ? "text-red-400 font-bold" : "text-slate-500"}>{diff > 0 ? '+' : ''}{diff}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Player Character Avatar on the right of HP bar (bigger) */}
      {playerAvatar && (
        <div className="shrink-0 flex items-center justify-center pointer-events-none drop-shadow-lg">
          <img 
            src={`https://play.pokemonshowdown.com/sprites/trainers/${playerAvatar.id}.png`}
            alt={playerAvatar.name}
            className={cn(
              "w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain [image-rendering:pixelated] drop-shadow-[0_4px_14px_rgba(34,211,238,0.45)]",
              !REVERSE_FACING_AVATARS.includes(playerAvatar.id) && "-scale-x-100"
            )}
          />
        </div>
      )}

      {turn === 'player' && (
        <motion.div 
          initial={{ x: 6, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute -left-4 top-1/2 -translate-y-1/2 text-cyan-500 z-30 pointer-events-none"
        >
          <ChevronRight className="w-3 h-3 animate-pulse" />
        </motion.div>
      )}
    </motion.div>
      )}
    </AnimatePresence>
  );
});

PlayerStatusBar.displayName = 'PlayerStatusBar';
