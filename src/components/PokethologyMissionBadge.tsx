import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Trophy, BookOpen } from 'lucide-react';

export const PokethologyMissionBadge: React.FC = () => {
  const [stats, setStats] = useState({
    uniquePokemon: 0,
    uniqueTypes: 0,
    hubCompletions: 0,
    examCompletions: 0
  });
  
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      try {
        const data = JSON.parse(localStorage.getItem('Pokethology_MissionStats') || '{"pokemonWins":{}, "typeWins":{}, "hubCompletions":0, "examCompletions":0}');
        setStats({
          uniquePokemon: Object.keys(data.pokemonWins || {}).length,
          uniqueTypes: Object.keys(data.typeWins || {}).length,
          hubCompletions: data.hubCompletions || 0,
          examCompletions: data.examCompletions || 0
        });
      } catch (e) {
        console.error(e);
      }
    };
    
    // Initial load
    handleStorage();

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Calculate generic medium (average) rank for the month
  const TOTAL_POKEMON_ESTIMATE = 1320;
  const TOTAL_TYPES = 18;
  const EXPECTED_MONTHLY_HUB = 30; // approx 1 completion per day goal
  const EXPECTED_MONTHLY_EXAM = 30; // approx 1 correct exam per day goal
  
  const combatScore = Math.min(100, ((stats.uniquePokemon + stats.uniqueTypes) / (TOTAL_POKEMON_ESTIMATE + TOTAL_TYPES)) * 100);
  const hubScore = Math.min(100, (stats.hubCompletions / EXPECTED_MONTHLY_HUB) * 100);
  const examScore = Math.min(100, (stats.examCompletions / EXPECTED_MONTHLY_EXAM) * 100);
  
  const averageScore = (combatScore + hubScore + examScore) / 3;

  let badgeUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
  let badgeName = 'Poké Ball Rank';
  const glowColor = 'rgba(34, 211, 238, 0.35)'; // Light fade blue / cyan matching trainer avatar

  if (averageScore >= 75) {
    badgeUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png';
    badgeName = 'Master Ball Rank';
  } else if (averageScore >= 50) {
    badgeUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png';
    badgeName = 'Ultra Ball Rank';
  } else if (averageScore >= 25) {
    badgeUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png';
    badgeName = 'Great Ball Rank';
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 px-2.5 py-1.5 rounded-lg flex flex-row items-center gap-2 shadow-md cursor-help transition-all hover:scale-105 relative group" 
        style={{ boxShadow: `0 0 14px ${glowColor}` }}
      >
        <div className="absolute inset-0 rounded-lg bg-cyan-500/10 filter blur-sm pointer-events-none group-hover:bg-cyan-500/20 transition-colors" />
        <img 
          src={badgeUrl} 
          alt={badgeName}
          className="w-5 h-5 rendering-pixelated drop-shadow-[0_2px_6px_rgba(34,211,238,0.4)] shrink-0 relative z-10"
        />
        <span className="text-[9px] sm:text-[10px] font-hud uppercase tracking-widest text-cyan-300 font-bold whitespace-nowrap leading-none relative z-10">
          RANK
        </span>
        
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 mt-2 bg-slate-950/95 border border-slate-800 p-3 rounded-xl shadow-xl z-30 min-w-[175px] pointer-events-none"
          >
            <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-slate-800">
              <img src={badgeUrl} alt={badgeName} className="w-4 h-4 rendering-pixelated" />
              <span className="text-[10px] font-hud font-bold text-amber-400 uppercase tracking-wider">{badgeName}</span>
            </div>
            <div className="text-[9px] text-slate-400 font-hud tracking-widest uppercase mb-2">
              Monthly Rating: {Math.round(averageScore)}%
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-slate-300">
                <span className="flex items-center gap-1"><Target className="w-3 h-3 text-purple-400"/> Combat</span>
                <span className="font-bold text-purple-300">{stats.uniquePokemon} + {stats.uniqueTypes}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-slate-300">
                <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-cyan-400"/> Daily Hub</span>
                <span className="font-bold text-cyan-300">{stats.hubCompletions}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-slate-300">
                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-amber-400"/> Theory Exam</span>
                <span className="font-bold text-amber-300">{stats.examCompletions}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
