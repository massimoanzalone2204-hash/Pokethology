import fs from 'fs';
let content = fs.readFileSync('src/components/PokethologyMissionModal.tsx', 'utf-8');

// We need to add state for `allPokemonNames` and fetch it.
const importBlock = "import React, { useState, useEffect, useMemo } from 'react';";
content = content.replace("import React, { useState, useEffect } from 'react';", importBlock);

const newLogic = `
  const [stats, setStats] = useState<{ pokemonWins: Record<string, number>, typeWins: Record<string, number>, lastResetMonth?: string }>({ pokemonWins: {}, typeWins: {} });
  const [allPokemonNames, setAllPokemonNames] = useState<string[]>([]);
  const [isLoadingNames, setIsLoadingNames] = useState(false);
  
  const ALL_TYPES = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];

  useEffect(() => {
    if (isOpen) {
      try {
        let data = JSON.parse(localStorage.getItem('Pokethology_MissionStats') || '{"pokemonWins":{}, "typeWins":{}}');
        
        // Handle monthly reset
        const currentMonth = new Date().toISOString().slice(0, 7);
        if (data.lastResetMonth !== currentMonth) {
          data = { pokemonWins: {}, typeWins: {}, lastResetMonth: currentMonth };
          localStorage.setItem('Pokethology_MissionStats', JSON.stringify(data));
        }
        
        setStats(data);
      } catch (e) {
        console.error("Error loading mission stats", e);
      }
      
      if (allPokemonNames.length === 0) {
        setIsLoadingNames(true);
        fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
          .then(r => r.json())
          .then(d => {
             setAllPokemonNames(d.results.map((p: any) => p.name));
          })
          .catch(e => console.error(e))
          .finally(() => setIsLoadingNames(false));
      }
    }
  }, [isOpen]);

  const missingTypes = useMemo(() => ALL_TYPES.filter(t => !stats.typeWins[t]), [stats.typeWins]);
  const missingPokemon = useMemo(() => allPokemonNames.filter(p => !stats.pokemonWins[p]), [allPokemonNames, stats.pokemonWins]);
`;

content = content.replace(/const \[stats, setStats\] = useState[^;]+;/g, newLogic);

// Add the missing blocks to the UI
const typeMasteryBlock = `
                {/* Type Mastery */}
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-cyan-400 font-hud uppercase tracking-widest text-xs">Type Mastery</h4>
                    </div>
                    <span className="text-cyan-300 font-mono font-bold text-sm">
                      {uniqueTypeWins} / {TOTAL_TYPES}
                    </span>
                  </div>
                  
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: \`\${Math.min(100, (uniqueTypeWins / TOTAL_TYPES) * 100)}%\` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="text-[10px] text-cyan-400/80 font-hud tracking-widest uppercase mt-1">Completed ({uniqueTypeWins})</div>
                    <div className="flex flex-wrap gap-1.5 overflow-y-auto max-h-[100px] custom-scrollbar pr-1">
                      {Object.entries(stats.typeWins).sort((a,b) => b[1] - a[1]).map(([type, count]) => (
                        <div key={type} className="px-2 py-1 bg-cyan-950/40 border border-cyan-500/30 rounded text-[9px] font-mono text-cyan-300 flex items-center gap-1.5">
                          <span className="uppercase">{type}</span>
                          <span className="bg-cyan-500/20 px-1 rounded-sm text-cyan-100">{count}</span>
                        </div>
                      ))}
                      {uniqueTypeWins === 0 && (
                        <span className="text-[10px] text-slate-500 italic">No type victories yet.</span>
                      )}
                    </div>
                    
                    <div className="text-[10px] text-red-400/80 font-hud tracking-widest uppercase mt-3">Missing ({missingTypes.length})</div>
                    <div className="flex flex-wrap gap-1.5 overflow-y-auto max-h-[100px] custom-scrollbar pr-1">
                      {missingTypes.map(type => (
                        <div key={type} className="px-2 py-1 bg-red-950/20 border border-red-500/20 rounded text-[9px] font-mono text-red-300 flex items-center gap-1.5 opacity-75">
                          <span className="uppercase">{type}</span>
                        </div>
                      ))}
                      {missingTypes.length === 0 && (
                        <span className="text-[10px] text-slate-500 italic">All types completed!</span>
                      )}
                    </div>
                  </div>
                </div>
`;

content = content.replace(/\{\/\* Type Mastery \*\/\}.*?(?=\{\/\* Pokemon Mastery \*\/)/s, typeMasteryBlock);

const pokemonMasteryBlock = `
                {/* Pokemon Mastery */}
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crosshair className="w-4 h-4 text-purple-400" />
                      <h4 className="text-purple-400 font-hud uppercase tracking-widest text-xs">Pokédex Mastery</h4>
                    </div>
                    <span className="text-purple-300 font-mono font-bold text-sm">
                      {uniquePokemonWins} / {ESTIMATED_TOTAL_POKEMON}+
                    </span>
                  </div>
                  
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: \`\${Math.min(100, (uniquePokemonWins / ESTIMATED_TOTAL_POKEMON) * 100)}%\` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="text-[10px] text-purple-400/80 font-hud tracking-widest uppercase mt-1">Completed ({uniquePokemonWins})</div>
                    <div className="flex flex-wrap gap-1.5 overflow-y-auto max-h-[100px] custom-scrollbar pr-1">
                      {Object.entries(stats.pokemonWins).sort((a,b) => b[1] - a[1]).map(([pokemon, count]) => (
                        <div key={pokemon} className="px-2 py-1 bg-purple-950/40 border border-purple-500/30 rounded text-[9px] font-mono text-purple-300 flex items-center gap-1.5">
                          <span className="uppercase">{pokemon.replace(/-/g, ' ')}</span>
                          <span className="bg-purple-500/20 px-1 rounded-sm text-purple-100">{count}</span>
                        </div>
                      ))}
                      {uniquePokemonWins === 0 && (
                        <span className="text-[10px] text-slate-500 italic">No Pokémon victories yet.</span>
                      )}
                    </div>
                    
                    <div className="text-[10px] text-red-400/80 font-hud tracking-widest uppercase mt-3">Missing ({missingPokemon.length})</div>
                    <div className="flex flex-wrap gap-1.5 overflow-y-auto max-h-[150px] custom-scrollbar pr-1">
                      {isLoadingNames ? (
                        <span className="text-[10px] text-slate-500 italic animate-pulse">Loading Pokédex data...</span>
                      ) : missingPokemon.slice(0, 100).map(pokemon => (
                        <div key={pokemon} className="px-2 py-1 bg-red-950/20 border border-red-500/20 rounded text-[9px] font-mono text-red-300 flex items-center gap-1.5 opacity-75">
                          <span className="uppercase">{pokemon.replace(/-/g, ' ')}</span>
                        </div>
                      ))}
                      {!isLoadingNames && missingPokemon.length > 100 && (
                        <span className="text-[9px] text-slate-500 italic px-2 py-1">+ {missingPokemon.length - 100} more forms</span>
                      )}
                      {!isLoadingNames && missingPokemon.length === 0 && (
                        <span className="text-[10px] text-slate-500 italic">All standard Pokémon completed!</span>
                      )}
                    </div>
                  </div>
                </div>
`;

content = content.replace(/\{\/\* Pokemon Mastery \*\/\}.*?(?=\<\/div\>\s*\<\/div\>\s*\<\/div\>\s*\<\/motion\.div\>)/s, pokemonMasteryBlock);

fs.writeFileSync('src/components/PokethologyMissionModal.tsx', content);
