const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startIdx = code.indexOf('const getEffectiveStat = useCallback((p: Pokemon | null, statName: string, isPlayer: boolean) => {');
const endIdx = code.indexOf('}, [pokemon, customStats, playerStatStages, opponentStatStages, pokemonStatus, opponentStatus, dailyPokemon, isChaosModeActive]);');

if (startIdx !== -1 && endIdx !== -1) {
    const end = endIdx + '}, [pokemon, customStats, playerStatStages, opponentStatStages, pokemonStatus, opponentStatus, dailyPokemon, isChaosModeActive]);'.length;
    const replaceFn = `const getEffectiveStat = useCallback((p: Pokemon | null, statName: string, isPlayer: boolean) => {
    if (!p) return 0;
    const baseRaw = p.stats.find((s: any) => s.stat.name === statName)?.base_stat || 50;
    
    // Proper level 50 stat calculation (assuming 31 IVs and 0 EVs)
    // HP = floor((2 * Base + 31) * 50 / 100) + 50 + 10 = Base + 75
    // Other Stats = floor((2 * Base + 31) * 50 / 100) + 5 = Base + 20
    const calculatedBase = statName === 'hp' ? baseRaw + 75 : baseRaw + 20;
    const base = isChaosModeActive ? calculatedBase + 20 : calculatedBase;
    
    const boost = p.name === pokemon?.name ? (customStats[statName] || 0) : 0;
    const totalBase = base + boost;

    // Stat stages don't apply to HP
    if (statName === 'hp') {
      return totalBase;
    }
    
    // Stat stages
    const stages = isPlayer ? playerStatStages : opponentStatStages;
    const stage = stages[statName] || 0;
    
    // Stage multipliers in Pokémon: 2/2, 3/2, 4/2... or 2/3, 2/4...
    const stageMultiplier = Math.max(2, 2 + stage) / Math.max(2, 2 - stage);
    
    // Status effects
    const status = isPlayer ? pokemonStatus : opponentStatus;
    let multiplier = stageMultiplier;
    if (status === 'PAR' && statName === 'speed') multiplier *= 0.5;
    if (status === 'BRN' && statName === 'attack') multiplier *= 0.5;
    
    return Math.floor(totalBase * multiplier);
  }, [pokemon, customStats, playerStatStages, opponentStatStages, pokemonStatus, opponentStatus, isChaosModeActive]);`;

    code = code.substring(0, startIdx) + replaceFn + code.substring(end);
    fs.writeFileSync('src/App.tsx', code);
    console.log("getEffectiveStat updated via substring!");
} else {
    console.log("Could not find getEffectiveStat definition.");
}
