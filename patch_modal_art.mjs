import fs from 'fs';
let content = fs.readFileSync('src/components/PokethologyMissionModal.tsx', 'utf-8');

// Replace allPokemonNames with allPokemonList
content = content.replace(
  'const [allPokemonNames, setAllPokemonNames] = useState<string[]>([]);',
  'const [allPokemonList, setAllPokemonList] = useState<{name: string, id: number}[]>([]);'
);

// Replace fetch mapping
content = content.replace(
  'setAllPokemonNames(d.results.map((p: any) => p.name));',
  'setAllPokemonList(d.results.map((p: any) => {\n             const parts = p.url.split(\'/\').filter(Boolean);\n             const id = parseInt(parts[parts.length - 1], 10);\n             return { name: p.name, id };\n           }));'
);

// Replace missingPokemon calculation
content = content.replace(
  'const missingPokemon = useMemo(() => allPokemonNames.filter(p => !stats.pokemonWins[p]), [allPokemonNames, stats.pokemonWins]);',
  `const missingPokemon = useMemo(() => allPokemonList.filter(p => !stats.pokemonWins[p.name]), [allPokemonList, stats.pokemonWins]);
  
  const completedPokemonList = useMemo(() => {
    return Object.entries(stats.pokemonWins).sort((a,b) => b[1] - a[1]).map(([name, count]) => {
      const match = allPokemonList.find(p => p.name === name);
      return { name, count, id: match ? match.id : 0 };
    });
  }, [allPokemonList, stats.pokemonWins]);`
);

// Replace Type Mastery completed list
content = content.replace(
  /<div className="flex flex-wrap gap-1\.5 overflow-y-auto max-h-\[100px\] custom-scrollbar pr-1">\s*\{Object\.entries\(stats\.typeWins\)([\s\S]*?)No type victories yet\.<\/span>\s*\)}\s*<\/div>/,
  `<div className="flex flex-wrap gap-2 overflow-y-auto max-h-[120px] custom-scrollbar pr-1">
                      {Object.entries(stats.typeWins).sort((a,b) => b[1] - a[1]).map(([type, count]) => (
                        <div key={type} className="px-2.5 py-1.5 bg-cyan-950/40 border border-cyan-500/30 rounded-lg text-[10px] font-mono text-cyan-300 flex items-center gap-2 shadow-sm">
                          <span className="uppercase font-bold tracking-wider">{type}</span>
                          <span className="bg-cyan-500/20 px-1.5 py-0.5 rounded text-cyan-100 font-bold">{count}</span>
                        </div>
                      ))}
                      {uniqueTypeWins === 0 && (
                        <span className="text-[10px] text-slate-500 italic">No type victories yet.</span>
                      )}
                    </div>`
);

// Replace Type Mastery missing list
content = content.replace(
  /<div className="flex flex-wrap gap-1\.5 overflow-y-auto max-h-\[100px\] custom-scrollbar pr-1">\s*\{missingTypes\.map([\s\S]*?)All types completed!<\/span>\s*\)}\s*<\/div>/,
  `<div className="flex flex-wrap gap-2 overflow-y-auto max-h-[120px] custom-scrollbar pr-1">
                      {missingTypes.map(type => (
                        <div key={type} className="px-2.5 py-1 bg-red-950/20 border border-red-500/20 rounded-lg text-[9px] font-mono text-red-300/70 flex items-center gap-1.5 opacity-75">
                          <span className="uppercase tracking-wider">{type}</span>
                        </div>
                      ))}
                      {missingTypes.length === 0 && (
                        <span className="text-[10px] text-slate-500 italic">All types completed!</span>
                      )}
                    </div>`
);


// Replace Pokemon Mastery completed list
content = content.replace(
  /<div className="flex flex-wrap gap-1\.5 overflow-y-auto max-h-\[100px\] custom-scrollbar pr-1">\s*\{Object\.entries\(stats\.pokemonWins\)([\s\S]*?)No Pokémon victories yet\.<\/span>\s*\)}\s*<\/div>/,
  `<div className="grid grid-cols-3 sm:grid-cols-4 gap-2 overflow-y-auto max-h-[220px] custom-scrollbar pr-1">
                      {completedPokemonList.map(({name, count, id}) => (
                        <div key={name} className="bg-purple-950/40 border border-purple-500/30 rounded-lg p-1.5 flex flex-col items-center gap-1 shadow-sm relative group overflow-hidden transition-colors hover:bg-purple-900/50">
                          {id !== 0 ? (
                             <img src={\`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/\${id}.png\`} alt={name} className="w-10 h-10 rendering-pixelated drop-shadow-md group-hover:scale-110 transition-transform" loading="lazy" />
                          ) : (
                             <div className="w-10 h-10 flex items-center justify-center opacity-50"><Crosshair className="w-4 h-4 text-purple-400"/></div>
                          )}
                          <span className="uppercase text-[8px] sm:text-[9px] font-mono font-bold text-purple-200 text-center leading-tight truncate w-full px-1">{name.replace(/-/g, ' ')}</span>
                          <div className="absolute top-1 right-1 bg-purple-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">{count}</div>
                        </div>
                      ))}
                      {uniquePokemonWins === 0 && (
                        <span className="text-[10px] text-slate-500 italic col-span-full">No Pokémon victories yet.</span>
                      )}
                    </div>`
);


// Replace Pokemon Mastery missing list
content = content.replace(
  /<div className="flex flex-wrap gap-1\.5 overflow-y-auto max-h-\[150px\] custom-scrollbar pr-1">\s*\{isLoadingNames([\s\S]*?)All standard Pokémon completed!<\/span>\s*\)}\s*<\/div>/,
  `<div className="grid grid-cols-4 sm:grid-cols-6 gap-2 overflow-y-auto max-h-[220px] custom-scrollbar pr-1">
                      {isLoadingNames ? (
                        <span className="text-[10px] text-slate-500 italic animate-pulse col-span-full">Loading Pokédex data...</span>
                      ) : missingPokemon.slice(0, 60).map(p => (
                        <div key={p.name} className="bg-red-950/10 border border-red-500/20 rounded-lg p-1 flex flex-col items-center gap-0.5 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-help" title={p.name.replace(/-/g, ' ')}>
                           <img src={\`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/\${p.id}.png\`} alt={p.name} className="w-8 h-8 rendering-pixelated drop-shadow-sm" loading="lazy" />
                           <span className="uppercase text-[6px] sm:text-[7px] font-mono text-red-300/80 text-center leading-tight truncate w-full px-0.5">{p.name.replace(/-/g, ' ')}</span>
                        </div>
                      ))}
                      {!isLoadingNames && missingPokemon.length > 60 && (
                        <div className="col-span-full text-center py-2 mt-1">
                           <span className="text-[9px] font-bold text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800 shadow-sm">+ {missingPokemon.length - 60} MORE MISSING</span>
                        </div>
                      )}
                      {!isLoadingNames && missingPokemon.length === 0 && (
                        <span className="text-[10px] text-slate-500 italic col-span-full">All standard Pokémon completed!</span>
                      )}
                    </div>`
);

fs.writeFileSync('src/components/PokethologyMissionModal.tsx', content);
