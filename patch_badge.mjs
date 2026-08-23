import fs from 'fs';

const content = `import React, { useState, useEffect } from 'react';
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
  let glowColor = 'rgba(239, 68, 68, 0.5)'; // red

  if (averageScore >= 75) {
    badgeUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png';
    badgeName = 'Master Ball Rank';
    glowColor = 'rgba(168, 85, 247, 0.6)'; // purple
  } else if (averageScore >= 50) {
    badgeUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png';
    badgeName = 'Ultra Ball Rank';
    glowColor = 'rgba(234, 179, 8, 0.5)'; // yellow
  } else if (averageScore >= 25) {
    badgeUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png';
    badgeName = 'Great Ball Rank';
    glowColor = 'rgba(59, 130, 246, 0.5)'; // blue
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 flex flex-col items-start gap-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="bg-slate-950/80 backdrop-blur-md border border-slate-800/80 p-1 sm:p-1.5 rounded-xl flex flex-col items-center gap-0.5 shadow-lg cursor-help transition-all hover:scale-105 relative" 
        style={{ boxShadow: \`0 0 15px \${glowColor}\` }}
      >
        <img 
          src={badgeUrl} 
          alt={badgeName}
          className="w-6 h-6 sm:w-8 sm:h-8 rendering-pixelated drop-shadow-md"
        />
        <span className="text-[7px] sm:text-[8px] font-hud uppercase tracking-widest text-slate-300 font-bold max-w-[50px] text-center leading-tight">
          {badgeName}
        </span>
        
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 mt-2 bg-slate-950/95 border border-slate-800 p-3 rounded-xl shadow-xl z-30 min-w-[160px] pointer-events-none"
          >
            <div className="text-[9px] text-slate-400 font-hud tracking-widest uppercase mb-2 border-b border-slate-800 pb-1">
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
`;

fs.writeFileSync('src/components/PokethologyMissionBadge.tsx', content);
