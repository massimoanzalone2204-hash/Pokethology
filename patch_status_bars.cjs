const fs = require('fs');
let code = fs.readFileSync('src/components/BattleStatusBars.tsx', 'utf8');

// We need to add AnimatePresence import
code = code.replace(`import { motion } from 'motion/react';`, `import { motion, AnimatePresence } from 'motion/react';`);

const oppOld = `  if (!battleOpponent) {
    return (
      <div className="absolute top-2 left-2 xs:top-3 xs:left-3 sm:top-4 sm:left-4 w-[110px] xs:w-[125px] sm:w-[170px] lg:w-[200px] flex flex-col items-start gap-1 z-20">
        <button 
          onClick={onSelectOpponentClick}
          className="w-full h-10 sm:h-12 bg-red-950/20 border border-dashed border-red-500/30 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-red-900/30 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 ease-out group pointer-events-auto btn-breathe-red"
        >
          <span className="text-[7px] sm:text-[8px] font-bold tracking-wider font-hud text-red-400 uppercase tracking-widest text-center">Select Target</span>
        </button>
      </div>
    );
  }

  const hpPercent = Math.ceil((opponentHP / opponentMaxHP) * 100);
  
  const getBreatheShadow = (percent: number) => {
    if (percent <= 20) return ["0 0 8px rgba(239,68,68,0.2)", "0 0 16px rgba(239,68,68,0.4)", "0 0 8px rgba(239,68,68,0.2)"];
    if (percent <= 50) return ["0 0 6px rgba(234,179,8,0.2)", "0 0 14px rgba(234,179,8,0.3)", "0 0 6px rgba(234,179,8,0.2)"];
    return ["0 0 3px rgba(34,197,94,0.05)", "0 0 8px rgba(34,197,94,0.15)", "0 0 3px rgba(34,197,94,0.05)"];
  };

  const getStatsMap = (poke: Pokemon) => poke.stats.reduce((acc, s) => ({ ...acc, [s.stat.name]: s.base_stat }), {} as Record<string, number>);
  const oStats = getStatsMap(battleOpponent);
  const pStats = player ? getStatsMap(player) : null;

  return (
    <motion.div 
      initial={false}
      animate={statChange ? { x: [0, -10, 10, -10, 10, 0], boxShadow: getBreatheShadow(hpPercent) } : { boxShadow: getBreatheShadow(hpPercent) }}
      transition={statChange ? { duration: 0.4 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="OpponentStatusBar absolute top-2 left-2 xs:top-3 xs:left-3 sm:top-4 sm:left-4 w-[110px] xs:w-[125px] sm:w-[170px] lg:w-[200px] flex flex-col gap-1 z-20 pointer-events-auto"
    >`;

const oppNew = `  const hpPercent = battleOpponent ? Math.ceil((opponentHP / opponentMaxHP) * 100) : 0;
  
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
          key="setup"
          initial={{ opacity: 0, x: -20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="absolute top-2 left-2 xs:top-3 xs:left-3 sm:top-4 sm:left-4 w-[110px] xs:w-[125px] sm:w-[170px] lg:w-[200px] flex flex-col items-start gap-1 z-20"
        >
          <button 
            onClick={onSelectOpponentClick}
            className="w-full h-10 sm:h-12 bg-red-950/20 border border-dashed border-red-500/30 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-red-900/30 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 ease-out group pointer-events-auto btn-breathe-red"
          >
            <span className="text-[7px] sm:text-[8px] font-bold tracking-wider font-hud text-red-400 uppercase tracking-widest text-center">Select Target</span>
          </button>
        </motion.div>
      ) : (
        <motion.div 
          key="battling"
          initial={{ opacity: 0, x: -20, scale: 0.95 }}
          animate={statChange ? { opacity: 1, scale: 1, x: [0, -10, 10, -10, 10, 0], boxShadow: getBreatheShadow(hpPercent) } : { opacity: 1, scale: 1, x: 0, boxShadow: getBreatheShadow(hpPercent) }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          transition={statChange ? { duration: 0.4 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="OpponentStatusBar absolute top-2 left-2 xs:top-3 xs:left-3 sm:top-4 sm:left-4 w-[110px] xs:w-[125px] sm:w-[170px] lg:w-[200px] flex flex-col gap-1 z-20 pointer-events-auto"
        >`;

code = code.replace(oppOld, oppNew);

// Add closing tag for OpponentStatusBar AnimatePresence
code = code.replace(`    </motion.div>
  );
});

OpponentStatusBar.displayName = 'OpponentStatusBar';`, `    </motion.div>
      )}
    </AnimatePresence>
  );
});

OpponentStatusBar.displayName = 'OpponentStatusBar';`);

const playerOld = `  if (!pokemon) return null;

  const getStatsMap = (poke: Pokemon) => poke.stats.reduce((acc, s) => ({ ...acc, [s.stat.name]: s.base_stat }), {} as Record<string, number>);
  const pStats = getStatsMap(pokemon);
  const oStats = opponent ? getStatsMap(opponent) : null;

  return (
    <motion.div 
      initial={false}
      animate={statChange ? { x: [0, 10, -10, 10, -10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="PlayerStatusBar absolute bottom-2 right-2 xs:bottom-3 xs:right-3 sm:bottom-4 sm:right-4 w-[110px] xs:w-[125px] sm:w-[170px] lg:w-[200px] flex flex-col gap-1 z-20 pointer-events-auto"
    >`;

const playerNew = `  const getStatsMap = (poke: Pokemon) => poke.stats.reduce((acc, s) => ({ ...acc, [s.stat.name]: s.base_stat }), {} as Record<string, number>);
  const pStats = pokemon ? getStatsMap(pokemon) : null;
  const oStats = opponent ? getStatsMap(opponent) : null;

  return (
    <AnimatePresence mode="wait">
      {!pokemon ? null : (
        <motion.div 
          key="battling"
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={statChange ? { opacity: 1, scale: 1, x: [0, 10, -10, 10, -10, 0] } : { opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="PlayerStatusBar absolute bottom-2 right-2 xs:bottom-3 xs:right-3 sm:bottom-4 sm:right-4 w-[110px] xs:w-[125px] sm:w-[170px] lg:w-[200px] flex flex-col gap-1 z-20 pointer-events-auto"
        >`;

code = code.replace(playerOld, playerNew);

// Add closing tag for PlayerStatusBar AnimatePresence
code = code.replace(`    </motion.div>
  );
});

PlayerStatusBar.displayName = 'PlayerStatusBar';`, `    </motion.div>
      )}
    </AnimatePresence>
  );
});

PlayerStatusBar.displayName = 'PlayerStatusBar';`);

fs.writeFileSync('src/components/BattleStatusBars.tsx', code, 'utf8');
