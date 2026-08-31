import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Trophy, BookOpen, History } from 'lucide-react';
import { getCurrentSeasonStats } from '../utils/seasonHistory';
import { sounds } from '../lib/sounds';
import { playHaptic } from '../lib/utils';

export interface PokethologyMissionBadgeProps {
  onOpenHistorical?: () => void;
  className?: string;
}

export const PokethologyMissionBadge: React.FC<PokethologyMissionBadgeProps> = ({ 
  onOpenHistorical,
  className 
}) => {
  const [seasonData, setSeasonData] = useState(() => getCurrentSeasonStats());
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setSeasonData(getCurrentSeasonStats());
    };
    
    // Initial load
    handleUpdate();

    window.addEventListener('storage', handleUpdate);
    // Also periodically check for changes during active gameplay
    const interval = setInterval(handleUpdate, 3000);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const { scores } = seasonData;
  const { rank } = scores;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={className || "absolute top-2 left-2 sm:top-4 sm:left-4 z-20 flex flex-col items-start gap-1"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        onClick={() => {
          if (onOpenHistorical) {
            onOpenHistorical();
          }
          try { sounds?.scan?.(); playHaptic('light'); } catch (_) {}
        }}
        className="relative flex items-center justify-center shrink-0 group hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        title="Open Historical Seasons & Records Archive"
      >
        <div 
          className="absolute inset-0 rounded-2xl filter blur-[2px] opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none"
          style={{ background: rank.glowColor }}
        />
        <div className="relative z-10 w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 lg:w-22 lg:h-22 flex items-center justify-center">
          <img 
            src={rank.badgeUrl} 
            alt={rank.badgeName}
            className="w-8 h-8 xs:w-11 xs:h-11 sm:w-14 sm:h-14 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] [image-rendering:pixelated] group-hover:rotate-12 transition-transform duration-300"
          />
        </div>
      </button>

      <div className="text-left hidden xs:flex flex-col items-start -mt-1">
        <span className={`font-hud font-bold text-[9px] sm:text-[10px] ${rank.textColor} uppercase tracking-widest leading-none drop-shadow flex items-center gap-1`}>
          {rank.badgeName}
        </span>
        <span className="text-[7px] sm:text-[8px] font-mono text-cyan-400/75 tracking-wider uppercase leading-none mt-0.5 flex items-center gap-0.5">
          <History className="w-2 h-2 text-cyan-400/70 inline" /> HISTORICAL
        </span>
      </div>

      {isHovered && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 mt-1 bg-slate-950/95 border border-slate-800/80 p-3 rounded-xl shadow-2xl z-40 min-w-[190px] pointer-events-none backdrop-blur-md"
        >
          <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-slate-800">
            <img src={rank.badgeUrl} alt={rank.badgeName} className="w-4 h-4 rendering-pixelated" />
            <span className={`text-[10px] font-hud font-bold ${rank.textColor} uppercase tracking-wider`}>
              {rank.badgeName} Rank
            </span>
          </div>
          <div className="text-[9px] text-slate-400 font-hud tracking-widest uppercase mb-2">
            Monthly Rating: {scores.averageScore}%
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-slate-300">
              <span className="flex items-center gap-1"><Target className="w-3 h-3 text-purple-400"/> Combat</span>
              <span className="font-bold text-purple-300">{scores.uniquePokemon} + {scores.uniqueTypes}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-slate-300">
              <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-cyan-400"/> Daily Hub</span>
              <span className="font-bold text-cyan-300">{scores.hubCompletions}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-slate-300">
              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-amber-400"/> Theory Exam</span>
              <span className="font-bold text-amber-300">{scores.examCompletions}</span>
            </div>
          </div>
          <div className="mt-2 pt-1 border-t border-slate-800/80 text-[8px] text-cyan-400 font-mono text-center">
            Click to view Historical Records
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

