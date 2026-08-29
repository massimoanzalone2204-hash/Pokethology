import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, X, Shield, Crosshair, Target, Sparkles, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { LEGENDS_ZA_MEGA_ENTRIES } from '../lib/api';

export interface PokethologyMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PokethologyMissionModal: React.FC<PokethologyMissionModalProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<{ pokemonWins: Record<string, number>, typeWins: Record<string, number>, hubCompletions?: number, examCompletions?: number, lastResetMonth?: string }>({ pokemonWins: {}, typeWins: {}, hubCompletions: 0, examCompletions: 0 });
  const [allPokemonList, setAllPokemonList] = useState<{name: string, id: number}[]>([]);
  const [isLoadingNames, setIsLoadingNames] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'missing'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const ALL_TYPES = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];

  useEffect(() => {
    if (isOpen) {
      try {
        let data = JSON.parse(localStorage.getItem('Pokethology_MissionStats') || '{"pokemonWins":{}, "typeWins":{}, "hubCompletions":0, "examCompletions":0}');
        
        // Handle monthly reset
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        if (data.lastResetMonth !== currentMonth) {
          data = { pokemonWins: {}, typeWins: {}, hubCompletions: 0, examCompletions: 0, lastResetMonth: currentMonth };
          localStorage.setItem('Pokethology_MissionStats', JSON.stringify(data));
        }
        
        setStats(data);
      } catch (e) {
        console.error("Error loading mission stats", e);
      }
      
      if (allPokemonList.length === 0) {
        setIsLoadingNames(true);
        fetch('https://pokeapi.co/api/v2/pokemon?limit=2000')
          .then(r => r.json())
          .then(d => {
             const list: {name: string, id: number}[] = (d.results || [])
               .filter((p: any) => {
                 const n = p.name;
                 if (n.includes('-totem') || n.includes('-starter') || n.includes('-cosplay') || n.includes('-cap') || n.includes('pikachu-phd') || n.includes('pikachu-pop-star') || n.includes('pikachu-rock-star') || n.includes('pikachu-belle') || n.includes('pikachu-libre')) return false;
                 return true;
               })
               .map((p: any) => {
                 const parts = p.url.split('/').filter(Boolean);
                 const id = parseInt(parts[parts.length - 1], 10);
                 return { name: p.name, id };
               });

             // Inject custom Legends Z-A Megas if not already included
             Object.keys(LEGENDS_ZA_MEGA_ENTRIES).forEach(zaKey => {
               if (zaKey === 'tatsugiri-curly-mega' || zaKey === 'tatsugiri-droopy-mega' || zaKey === 'meowstic-female-mega' || zaKey === 'meowstic-male-mega' || zaKey === 'pyroar-female-mega' || zaKey === 'pyroar-male-mega' || zaKey === 'zygarde-50-mega' || zaKey === 'floette-eternal-mega') return;
               if (!list.some(p => p.name === zaKey)) {
                 const baseName = zaKey.split('-')[0];
                 const matchBase = list.find(p => p.name === baseName);
                 list.push({ name: zaKey, id: matchBase ? matchBase.id : 0 });
               }
             });

             setAllPokemonList(list);
          })
          .catch(e => console.error(e))
          .finally(() => setIsLoadingNames(false));
      }
    }
  }, [isOpen]);

  const totalTargetPokemon = allPokemonList.length || 1350;
  const TOTAL_TYPES = 18;

  const missingTypes = useMemo(() => ALL_TYPES.filter(t => !stats.typeWins[t]), [stats.typeWins]);

  const missingPokemon = useMemo(() => {
    let list = allPokemonList.filter(p => !stats.pokemonWins[p.name]);
    if (!searchQuery) return list;
    return list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [allPokemonList, stats.pokemonWins, searchQuery]);
  
  const completedPokemonList = useMemo(() => {
    let list = Object.entries(stats.pokemonWins).sort((a,b) => b[1] - a[1]).map(([name, count]) => {
      const match = allPokemonList.find(p => p.name === name);
      return { name, count, id: match ? match.id : 0 };
    });
    if (!searchQuery) return list;
    return list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [allPokemonList, stats.pokemonWins, searchQuery]);

  const uniquePokemonWins = Object.keys(stats.pokemonWins).length;
  const uniqueTypeWins = Object.keys(stats.typeWins).length;

  const combatScore = Math.min(100, ((uniquePokemonWins + uniqueTypeWins) / (totalTargetPokemon + TOTAL_TYPES)) * 100);
  const hubScore = Math.min(100, ((stats.hubCompletions || 0) / 30) * 100);
  const examScore = Math.min(100, ((stats.examCompletions || 0) / 30) * 100);
  const averageScore = (combatScore + hubScore + examScore) / 3;

  const currentRank = useMemo(() => {
    if (averageScore >= 75) {
      return {
        badgeUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png',
        badgeName: 'Master Ball Rank',
        glowColor: 'rgba(168, 85, 247, 0.6)',
        textColor: 'text-purple-400',
        badgeBg: 'bg-purple-950/60 border-purple-500/40'
      };
    } else if (averageScore >= 50) {
      return {
        badgeUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png',
        badgeName: 'Ultra Ball Rank',
        glowColor: 'rgba(234, 179, 8, 0.5)',
        textColor: 'text-yellow-400',
        badgeBg: 'bg-yellow-950/60 border-yellow-500/40'
      };
    } else if (averageScore >= 25) {
      return {
        badgeUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png',
        badgeName: 'Great Ball Rank',
        glowColor: 'rgba(59, 130, 246, 0.5)',
        textColor: 'text-blue-400',
        badgeBg: 'bg-blue-950/60 border-blue-500/40'
      };
    }
    return {
      badgeUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
      badgeName: 'Poké Ball Rank',
      glowColor: 'rgba(239, 68, 68, 0.5)',
      textColor: 'text-red-400',
      badgeBg: 'bg-red-950/60 border-red-500/40'
    };
  }, [averageScore]);

  const getFormTag = (name: string) => {
    if (name.includes('-mega')) {
      return <span className="text-[6px] sm:text-[7px] font-hud font-bold px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">MEGA</span>;
    }
    if (name.includes('-gmax')) {
      return <span className="text-[6px] sm:text-[7px] font-hud font-bold px-1 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">G-MAX</span>;
    }
    if (name.includes('-alola') || name.includes('-galar') || name.includes('-hisui') || name.includes('-paldea')) {
      return <span className="text-[6px] sm:text-[7px] font-hud font-bold px-1 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">REGIONAL</span>;
    }
    if (name.includes('-primal') || name.includes('-origin') || name.includes('-therian') || name.includes('-crowned') || name.includes('-dusk') || name.includes('-dawn') || name.includes('-ultra') || name.includes('-complete') || name.includes('-shadow') || name.includes('-ice')) {
      return <span className="text-[6px] sm:text-[7px] font-hud font-bold px-1 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">FORM</span>;
    }
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[600] flex flex-col bg-slate-950/98 backdrop-blur-2xl overflow-hidden w-screen h-screen"
          onClick={onClose}
        >
          {/* Ambient Background Glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top System Header Bar */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="shrink-0 border-b border-amber-500/30 bg-slate-900/90 px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-3 z-20 shadow-lg"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="font-hud font-black text-sm sm:text-xl text-amber-400 uppercase tracking-widest leading-none truncate">
                  POKÉTHOLOGY MISSION
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-hud font-bold uppercase tracking-wider group shadow-sm shrink-0"
              title="Close (Esc)"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              <span className="hidden sm:inline">CLOSE</span>
            </button>
          </div>

          {/* Fullscreen Body Content */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-4 sm:gap-6 min-h-0"
          >
            {/* Primary Objective Banner */}
            <div className="bg-amber-950/25 border border-amber-500/30 p-3.5 sm:p-4 md:p-5 rounded-2xl shadow-inner flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <h3 className="text-amber-300 font-hud uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-400 shrink-0" />
                  Primary Mission Objective
                </h3>
                <p className="text-slate-300 text-[11px] sm:text-xs font-sans leading-relaxed">
                  Conquer combat battles using every Pokémon species, Mega Evolution, G-Max variant, and Alternate Form while mastering all 18 elemental types.
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] sm:text-[11px] text-amber-200/90 font-mono">
                  <span className="text-slate-400 font-sans">Rank calculated from:</span>
                  <span className="text-cyan-300 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-500/30">Pokémon Victories</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-amber-300 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-500/30">Daily Hub Done</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-purple-300 bg-purple-950/50 px-1.5 py-0.5 rounded border border-purple-500/30">Theory Exams Done</span>
                </div>
                <p className="text-[10px] text-amber-400/90 font-sans italic flex items-center gap-1.5 pt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
                  Rank season resets automatically on the 1st of every month.
                </p>
              </div>

              {/* Progress and Rank on the right with responsive adaptable dimensions */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
                <div className="flex-1 sm:flex-none flex items-center justify-between sm:justify-start gap-2.5 bg-slate-900/90 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-amber-500/20 shadow-sm">
                  <div className="text-left sm:text-right">
                    <div className="text-[9px] font-hud text-amber-400/80 uppercase tracking-wider">Total Progress</div>
                    <div className="text-sm sm:text-base font-mono font-bold text-amber-300 leading-tight">
                      {Math.round(((uniquePokemonWins + uniqueTypeWins) / (totalTargetPokemon + TOTAL_TYPES)) * 100)}%
                    </div>
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                </div>

                {/* Rank Tracker Badge */}
                <div 
                  className={cn("flex-1 sm:flex-none flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border shadow-md bg-slate-900/90", currentRank.badgeBg)}
                  style={{ boxShadow: `0 0 12px ${currentRank.glowColor}` }}
                >
                  <img 
                    src={currentRank.badgeUrl} 
                    alt={currentRank.badgeName} 
                    className="w-6 h-6 sm:w-7 sm:h-7 rendering-pixelated drop-shadow-md shrink-0"
                  />
                  <div className="flex flex-col text-left whitespace-nowrap min-w-0">
                    <span className="text-[7px] sm:text-[8px] font-hud uppercase tracking-widest text-slate-400 leading-none">Current Rank</span>
                    <span className={cn("text-[9px] sm:text-[11px] font-hud font-black uppercase tracking-wider leading-tight truncate", currentRank.textColor)}>
                      {currentRank.badgeName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
              {/* Type Mastery Column */}
              <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col gap-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <h4 className="text-cyan-400 font-hud uppercase tracking-widest text-sm">Type Mastery</h4>
                  </div>
                  <span className="text-cyan-300 font-mono font-bold text-sm bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                    {uniqueTypeWins} / {TOTAL_TYPES}
                  </span>
                </div>
                
                <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <motion.div 
                    className="h-full bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (uniqueTypeWins / TOTAL_TYPES) * 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                
                {/* Completed Types */}
                <div className="flex flex-col gap-2">
                  <div className="text-[10px] text-cyan-400/90 font-hud tracking-widest uppercase">
                    Completed Types ({uniqueTypeWins})
                  </div>
                  <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[140px] custom-scrollbar pr-1">
                    {Object.entries(stats.typeWins).sort((a,b) => b[1] - a[1]).map(([type, count]) => (
                      <div key={type} className="px-2.5 py-1.5 bg-cyan-950/50 border border-cyan-500/40 rounded-lg text-[10px] font-mono text-cyan-200 flex items-center gap-2 shadow-sm">
                        <span className="uppercase font-bold tracking-wider">{type}</span>
                        <span className="bg-cyan-500/20 px-1.5 py-0.5 rounded text-cyan-100 font-bold">{count}</span>
                      </div>
                    ))}
                    {uniqueTypeWins === 0 && (
                      <span className="text-xs text-slate-500 italic py-2">No type victories recorded yet.</span>
                    )}
                  </div>
                </div>

                {/* Missing Types */}
                <div className="flex flex-col gap-2 mt-2">
                  <div className="text-[10px] text-red-400/90 font-hud tracking-widest uppercase">
                    Missing Types ({missingTypes.length})
                  </div>
                  <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[140px] custom-scrollbar pr-1">
                    {missingTypes.map(type => (
                      <div key={type} className="px-2.5 py-1.5 bg-red-950/25 border border-red-500/20 rounded-lg text-[10px] font-mono text-red-300/80 flex items-center gap-1.5 opacity-80">
                        <span className="uppercase tracking-wider">{type}</span>
                      </div>
                    ))}
                    {missingTypes.length === 0 && (
                      <span className="text-xs text-emerald-400 font-hud tracking-wider italic py-2">✨ All 18 elemental types mastered!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pokédex Mastery Column */}
              <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col gap-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-5 h-5 text-purple-400" />
                    <h4 className="text-purple-400 font-hud uppercase tracking-widest text-sm">Pokédex & Forms Mastery</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search Pokemon / Form..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 font-mono w-40 sm:w-48"
                      />
                    </div>
                    <span className="text-purple-300 font-mono font-bold text-sm bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-500/30 whitespace-nowrap">
                      {uniquePokemonWins} / {totalTargetPokemon}
                    </span>
                  </div>
                </div>
                
                {/* Pokédex Progress Bar */}
                <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-400 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (uniquePokemonWins / totalTargetPokemon) * 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800/80 pb-2">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-hud uppercase tracking-wider transition-all cursor-pointer",
                      activeTab === 'all' ? "bg-purple-600/30 border border-purple-500 text-purple-200 shadow-sm" : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    All ({allPokemonList.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('completed')}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-hud uppercase tracking-wider transition-all cursor-pointer",
                      activeTab === 'completed' ? "bg-purple-600/30 border border-purple-500 text-purple-200 shadow-sm" : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    Completed ({uniquePokemonWins})
                  </button>
                  <button
                    onClick={() => setActiveTab('missing')}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-hud uppercase tracking-wider transition-all cursor-pointer",
                      activeTab === 'missing' ? "bg-red-600/30 border border-red-500 text-red-200 shadow-sm" : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    Missing ({allPokemonList.length > 0 ? allPokemonList.length - uniquePokemonWins : '...'})
                  </button>
                </div>
                
                {/* Completed Pokémon Section */}
                {(activeTab === 'all' || activeTab === 'completed') && completedPokemonList.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="text-[10px] text-purple-400/90 font-hud tracking-widest uppercase flex items-center justify-between">
                      <span>Completed Victories ({completedPokemonList.length})</span>
                    </div>
                    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 overflow-y-auto max-h-[260px] custom-scrollbar pr-1.5 p-1">
                      {completedPokemonList.map(({name, count, id}) => (
                        <div key={name} className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-2 flex flex-col items-center gap-1 shadow-sm relative group overflow-hidden transition-all hover:bg-purple-900/50 hover:border-purple-400">
                          {id !== 0 ? (
                             <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`} alt={name} className="w-12 h-12 rendering-pixelated drop-shadow-md group-hover:scale-110 transition-transform" loading="lazy" onError={(e: any) => { e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`; }} />
                          ) : (
                             <div className="w-12 h-12 flex items-center justify-center opacity-50"><Crosshair className="w-5 h-5 text-purple-400"/></div>
                          )}
                          <div className="flex items-center gap-1 mt-0.5">
                            {getFormTag(name)}
                          </div>
                          <span className="uppercase text-[8px] sm:text-[9px] font-mono font-bold text-purple-200 text-center leading-tight truncate w-full px-0.5">{name.replace(/-/g, ' ')}</span>
                          <div className="absolute top-1 right-1 bg-purple-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">{count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Missing Pokémon Section */}
                {(activeTab === 'all' || activeTab === 'missing') && (
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="text-[10px] text-red-400/90 font-hud tracking-widest uppercase flex items-center justify-between">
                      <span>Missing Victories ({missingPokemon.length})</span>
                    </div>
                    <div className="grid grid-cols-4 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 overflow-y-auto max-h-[300px] custom-scrollbar pr-1.5 p-1">
                      {isLoadingNames ? (
                        <div className="col-span-full text-center py-8 text-slate-400 italic text-xs animate-pulse">
                          Loading complete Pokédex, Megas, G-Max, and Form records...
                        </div>
                      ) : missingPokemon.slice(0, 160).map(p => (
                        <div key={p.name} className="bg-slate-950/60 border border-red-500/20 rounded-xl p-1.5 flex flex-col items-center gap-0.5 opacity-60 hover:opacity-100 transition-all grayscale hover:grayscale-0 hover:border-red-400/60 cursor-help group relative" title={p.name.replace(/-/g, ' ')}>
                           {p.id > 0 ? (
                             <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} alt={p.name} className="w-10 h-10 rendering-pixelated drop-shadow-sm group-hover:scale-110 transition-transform" loading="lazy" onError={(e: any) => { e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`; }} />
                           ) : (
                             <div className="w-10 h-10 flex items-center justify-center"><Crosshair className="w-4 h-4 text-red-400"/></div>
                           )}
                           <div className="flex items-center gap-0.5">
                             {getFormTag(p.name)}
                           </div>
                           <span className="uppercase text-[7px] font-mono text-red-300/80 text-center leading-tight truncate w-full px-0.5">{p.name.replace(/-/g, ' ')}</span>
                        </div>
                      ))}
                      {!isLoadingNames && missingPokemon.length > 160 && (
                        <div className="col-span-full text-center py-3">
                           <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-4 py-2 rounded-full border border-slate-800 shadow-sm">
                             + {missingPokemon.length - 160} MORE TO MASTER
                           </span>
                        </div>
                      )}
                      {!isLoadingNames && missingPokemon.length === 0 && (
                        <div className="col-span-full text-center py-6 text-emerald-400 font-hud text-sm italic">
                          🎉 Master rank achieved! All Pokémon and forms conquered in battle!
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
