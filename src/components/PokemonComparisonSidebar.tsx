import React, { useState, useEffect } from 'react';
import { Pokemon } from '../types';
import { cn } from '../lib/utils';
import { searchPokemon } from '../lib/api';
import { TypeBadge } from './TypeBadge';
import { HUDCorners } from './HUDCorners';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeftRight, 
  X, 
  Search, 
  Loader2, 
  Sparkles, 
  Trophy, 
  Scale, 
  Ruler, 
  Swords, 
  RotateCcw, 
  Zap, 
  Shield, 
  TrendingUp, 
  TrendingDown,
  Eye,
  CheckCircle2,
  AlertCircle,
  Layers,
  ChevronDown
} from 'lucide-react';

interface PokemonComparisonSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pinnedPokemon: Pokemon | null;
  onSelectMainPokemon?: (pokemon: Pokemon) => void;
  isLightMode?: boolean;
}

const STAT_NAMES_MAP: Record<string, string> = {
  'hp': 'HP',
  'attack': 'ATK',
  'defense': 'DEF',
  'special-attack': 'SPA',
  'special-defense': 'SPD',
  'speed': 'SPE'
};

const POPULAR_RECOMMENDATIONS = [
  'charizard', 'blastoise', 'venusaur', 'mewtwo', 'gengar', 
  'dragonite', 'lucario', 'rayquaza', 'garchomp', 'gardevoir', 'pikachu', 'eevee'
];

export const PokemonComparisonSidebar: React.FC<PokemonComparisonSidebarProps> = ({
  isOpen,
  onClose,
  pinnedPokemon,
  onSelectMainPokemon,
  isLightMode = false
}) => {
  const [secondPokemon, setSecondPokemon] = useState<Pokemon | null>(null);
  const [pokemon1, setPokemon1] = useState<Pokemon | null>(pinnedPokemon);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [availableFormsForP2, setAvailableFormsForP2] = useState<{ name: string; url: string }[]>([]);

  // Sync pinnedPokemon when prop updates
  useEffect(() => {
    if (pinnedPokemon) {
      setPokemon1(pinnedPokemon);
    }
  }, [pinnedPokemon]);

  // Handle search for second pokemon
  const handleSearch = async (queryToSearch?: string) => {
    const q = (queryToSearch || searchQuery).trim();
    if (!q) return;

    setIsSearching(true);
    setSearchError(null);
    setAvailableFormsForP2([]);

    try {
      const result = await searchPokemon(q);
      if (result) {
        setSecondPokemon(result);
        setSearchQuery('');
        if (result.varieties && result.varieties.length > 1) {
          setAvailableFormsForP2(result.varieties.map((v: any) => ({ name: v.pokemon.name, url: v.pokemon.url })));
        }
      } else {
        setSearchError(`No Pokémon found matching "${q}"`);
      }
    } catch (err: any) {
      setSearchError(err?.message || `Failed to find "${q}"`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectForm = async (formName: string) => {
    setIsSearching(true);
    try {
      const result = await searchPokemon(formName);
      if (result) {
        setSecondPokemon(result);
      }
    } catch (err: any) {
      setSearchError(err?.message || `Failed to switch form`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSwap = () => {
    if (pokemon1 && secondPokemon) {
      const temp = pokemon1;
      setPokemon1(secondPokemon);
      setSecondPokemon(temp);
    }
  };

  // Calculate Stat Totals
  const getStatValue = (p: Pokemon | null, statName: string): number => {
    if (!p) return 0;
    const found = p.stats.find(s => s.stat.name === statName);
    return found ? found.base_stat : 0;
  };

  const getTotalStats = (p: Pokemon | null): number => {
    if (!p) return 0;
    return p.stats.reduce((acc, s) => acc + s.base_stat, 0);
  };

  const p1Total = getTotalStats(pokemon1);
  const p2Total = getTotalStats(secondPokemon);

  const getSpriteUrl = (p: Pokemon | null): string => {
    if (!p) return '';
    return p.sprites?.other?.['official-artwork']?.front_default 
      || p.sprites?.front_default 
      || '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed inset-0 z-[200] flex flex-col overflow-hidden",
            isLightMode
              ? "bg-slate-50 text-slate-900"
              : "bg-slate-950/98 text-slate-100 backdrop-blur-2xl"
          )}
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Header Bar */}
          <div className={cn(
            "shrink-0 px-4 sm:px-8 py-3.5 border-b flex items-center justify-between gap-3 z-20 shadow-lg relative overflow-hidden",
            isLightMode
              ? "bg-white border-slate-200"
              : "bg-slate-900/90 border-cyan-900/50"
          )}>
            <HUDCorners />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
                <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-hud font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  Comparing Pokémon
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className={cn(
                "p-2 sm:px-3.5 sm:py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-hud font-bold uppercase tracking-wider group shadow-sm shrink-0",
                isLightMode
                  ? "bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-700"
                  : "bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700"
              )}
              title="Close (Esc)"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              <span className="hidden sm:inline">CLOSE</span>
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 sm:p-6 md:p-8 space-y-6 max-w-6xl w-full mx-auto relative z-10">

              {/* DUAL POKEMON SELECTOR CARDS */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 relative">
                
                {/* POKEMON 1 CARD */}
                <div className={cn(
                  "rounded-2xl p-3 sm:p-4 relative overflow-hidden flex flex-col items-center text-center transition-all",
                  isLightMode
                    ? "bg-white shadow-sm"
                    : "bg-slate-900/60 shadow-[0_0_20px_rgba(6,182,212,0.08)]"
                )}>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-widest bg-cyan-500/20 text-cyan-400">
                    P1
                  </span>

                  {pokemon1 ? (
                    <>
                      <div className="w-20 h-20 sm:w-28 sm:h-28 my-1 relative flex items-center justify-center">
                        <img
                          src={getSpriteUrl(pokemon1)}
                          alt={pokemon1.name}
                          className="max-w-full max-h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                        />
                      </div>
                      <h3 className="font-hud font-black uppercase text-xs sm:text-base tracking-wider truncate w-full text-cyan-300">
                        {pokemon1.name.replace(/-/g, ' ')}
                      </h3>
                      <p className="text-[10px] font-mono text-slate-400">
                        #{String(pokemon1.baseId || pokemon1.id).padStart(3, '0')}
                      </p>
                      <div className="flex flex-wrap justify-center gap-1 mt-1.5">
                        {pokemon1.types.map((t, idx) => (
                          <TypeBadge key={idx} type={t.type.name} size="sm" />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-slate-400 text-xs">
                      No Pokémon Pinned
                    </div>
                  )}
                </div>

                {/* SWAP ICON IN THE CENTER */}
                {pokemon1 && secondPokemon && (
                  <button
                    onClick={handleSwap}
                    title="Swap P1 and P2"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-cyan-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}

                {/* POKEMON 2 CARD */}
                <div className={cn(
                  "rounded-2xl p-3 sm:p-4 relative overflow-hidden flex flex-col items-center text-center transition-all",
                  isLightMode
                    ? "bg-white shadow-sm"
                    : "bg-slate-900/60 shadow-[0_0_20px_rgba(168,85,247,0.08)]"
                )}>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-widest bg-purple-500/20 text-purple-400">
                    P2
                  </span>

                  {secondPokemon ? (
                    <>
                      <div className="w-20 h-20 sm:w-28 sm:h-28 my-1 relative flex items-center justify-center">
                        <img
                          src={getSpriteUrl(secondPokemon)}
                          alt={secondPokemon.name}
                          className="max-w-full max-h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                        />
                      </div>
                      <h3 className="font-hud font-black uppercase text-xs sm:text-base tracking-wider truncate w-full text-purple-300">
                        {secondPokemon.name.replace(/-/g, ' ')}
                      </h3>
                      <p className="text-[10px] font-mono text-slate-400">
                        #{String(secondPokemon.baseId || secondPokemon.id).padStart(3, '0')}
                      </p>
                      <div className="flex flex-wrap justify-center gap-1 mt-1.5">
                        {secondPokemon.types.map((t, idx) => (
                          <TypeBadge key={idx} type={t.type.name} size="sm" />
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setSecondPokemon(null);
                          setAvailableFormsForP2([]);
                        }}
                        className="mt-2 text-[9px] sm:text-[10px] font-hud uppercase tracking-wider text-rose-400 hover:text-rose-300 underline cursor-pointer"
                      >
                        Change P2
                      </button>
                    </>
                  ) : (
                    <div className="py-6 w-full flex flex-col items-center justify-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 my-1">
                        <Search className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-hud font-bold text-slate-300">Select Pokémon 2</span>
                      <p className="text-[10px] text-slate-400 px-2 font-sans">Use search below to select rival</p>
                    </div>
                  )}
                </div>

              </div>

              {/* SEARCH INPUT BAR FOR POKEMON 2 */}
              <div className={cn(
                "p-3.5 sm:p-4 rounded-2xl space-y-3 relative overflow-hidden",
                isLightMode ? "bg-white shadow-sm" : "bg-slate-900/50"
              )}>
                <HUDCorners />
                <label className="text-xs font-hud font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Rival Pokémon</span>
                </label>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter Pokémon name or ID (e.g. Charizard, Mewtwo, 150)..."
                      className={cn(
                        "w-full px-3.5 py-2.5 rounded-xl text-xs font-sans outline-none transition-all",
                        isLightMode
                          ? "bg-slate-100 text-slate-900 focus:ring-1 focus:ring-cyan-500"
                          : "bg-slate-950/80 text-slate-100 focus:ring-1 focus:ring-cyan-400"
                      )}
                    />
                  </div>

                  <button
                    onClick={() => handleSearch()}
                    disabled={isSearching || !searchQuery.trim()}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0",
                      isSearching
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                        : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                    )}
                  >
                    {isSearching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span className="hidden sm:inline">Compare</span>
                      </>
                    )}
                  </button>
                </div>

                {/* If Multiple Forms Discovered on Search, Display Form Selection Pills */}
                {availableFormsForP2.length > 1 && (
                  <div className="p-3 rounded-xl bg-purple-950/40 space-y-2">
                    <span className="text-[10px] font-hud uppercase tracking-wider text-purple-300 font-bold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      Multiple Forms Available — Click to Select:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {availableFormsForP2.map((f) => (
                        <button
                          key={f.name}
                          type="button"
                          onClick={() => handleSelectForm(f.name)}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[9.5px] font-hud uppercase tracking-wider transition-all cursor-pointer",
                            secondPokemon?.name.toLowerCase() === f.name.toLowerCase()
                              ? "bg-purple-500 text-slate-950 font-black shadow-md"
                              : "bg-slate-900/90 text-purple-200 hover:bg-purple-900/60 hover:text-white"
                          )}
                        >
                          {f.name.replace(/-/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {searchError && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl font-mono">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{searchError}</span>
                  </div>
                )}

                {/* Popular Quick-Select Chips */}
                {!secondPokemon && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-hud uppercase tracking-wider text-slate-400">
                      Popular Rival Choices:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_RECOMMENDATIONS.map((name) => (
                        <button
                          key={name}
                          onClick={() => handleSearch(name)}
                          disabled={isSearching}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[10px] font-hud uppercase tracking-wider transition-all cursor-pointer",
                            isLightMode
                              ? "bg-slate-100 text-slate-700 hover:bg-cyan-50 hover:text-cyan-800"
                              : "bg-slate-800/80 text-slate-300 hover:bg-cyan-950/60 hover:text-cyan-300"
                          )}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* STAT COMPARISON RESULTS */}
              {pokemon1 && secondPokemon && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  {/* WINNER BANNER HIGHLIGHT */}
                  <div className={cn(
                    "p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-3 relative overflow-hidden",
                    p1Total === p2Total
                      ? "bg-amber-950/30 text-amber-300"
                      : p1Total > p2Total
                        ? "bg-cyan-950/40 text-cyan-300"
                        : "bg-purple-950/40 text-purple-300"
                  )}>
                    <HUDCorners />
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 sm:p-2.5 rounded-xl bg-white/10 shrink-0">
                        <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9.5px] font-hud uppercase tracking-widest text-slate-400 block">
                          Total Base Stat Advantage
                        </span>
                        <h4 className="font-hud font-black text-xs sm:text-sm uppercase tracking-wider truncate">
                          {p1Total === p2Total ? (
                            "Exact Stat Parity Tie!"
                          ) : p1Total > p2Total ? (
                            `${pokemon1.name.replace(/-/g, ' ')} leads by +${p1Total - p2Total} BST`
                          ) : (
                            `${secondPokemon.name.replace(/-/g, ' ')} leads by +${p2Total - p1Total} BST`
                          )}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs sm:text-sm font-mono font-bold text-slate-300">
                        <span className="text-cyan-400 font-extrabold">{p1Total}</span> vs <span className="text-purple-400 font-extrabold">{p2Total}</span>
                      </div>
                    </div>
                  </div>

                  {/* STAT-BY-STAT COMPARISON BARS */}
                  <div className={cn(
                    "p-4 sm:p-5 rounded-2xl space-y-4 relative overflow-hidden",
                    isLightMode ? "bg-white shadow-sm" : "bg-slate-900/60"
                  )}>
                    <HUDCorners />
                    <div className="flex items-center justify-between pb-2">
                      <h4 className="text-xs font-hud font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                        <Swords className="w-4 h-4" />
                        <span>Base Stat Head-to-Head</span>
                      </h4>
                      <div className="flex items-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] font-hud uppercase tracking-wider">
                        <span className="text-cyan-400 font-bold flex items-center gap-1 truncate max-w-[120px]">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                          {pokemon1.name.replace(/-/g, ' ')}
                        </span>
                        <span className="text-purple-400 font-bold flex items-center gap-1 truncate max-w-[120px]">
                          <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                          {secondPokemon.name.replace(/-/g, ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      {['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].map((statKey) => {
                        const val1 = getStatValue(pokemon1, statKey);
                        const val2 = getStatValue(secondPokemon, statKey);
                        const maxVal = Math.max(val1, val2, 160);
                        const diff = val1 - val2;

                        return (
                          <div key={statKey} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-hud font-bold text-slate-300 w-10">
                                  {STAT_NAMES_MAP[statKey]}
                                </span>
                                <span className={cn(
                                  "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded",
                                  diff > 0 
                                    ? "bg-cyan-500/20 text-cyan-400" 
                                    : diff < 0 
                                      ? "bg-purple-500/20 text-purple-400" 
                                      : "bg-slate-800 text-slate-400"
                                )}>
                                  {diff > 0 ? `+${diff} P1` : diff < 0 ? `+${Math.abs(diff)} P2` : 'EQUAL'}
                                </span>
                              </div>

                              <div className="font-mono text-xs flex items-center gap-3">
                                <span className={cn("font-bold", val1 >= val2 ? "text-cyan-400" : "text-slate-400")}>
                                  {val1}
                                </span>
                                <span className="text-slate-600">/</span>
                                <span className={cn("font-bold", val2 >= val1 ? "text-purple-400" : "text-slate-400")}>
                                  {val2}
                                </span>
                              </div>
                            </div>

                            {/* Dual Dynamic Bar */}
                            <div className="grid grid-cols-2 gap-1.5 h-2 bg-slate-950/80 rounded-full p-0.5">
                              {/* P1 Bar (Fills to the left or scaled right) */}
                              <div className="w-full flex justify-end bg-slate-900 rounded-l-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-l from-cyan-400 to-cyan-600 rounded-l-full transition-all duration-500"
                                  style={{ width: `${Math.min(100, (val1 / maxVal) * 100)}%` }}
                                />
                              </div>

                              {/* P2 Bar (Fills to the right) */}
                              <div className="w-full flex justify-start bg-slate-900 rounded-r-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-r-full transition-all duration-500"
                                  style={{ width: `${Math.min(100, (val2 / maxVal) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* PHYSICAL SPECS & ABILITIES BREAKDOWN */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    {/* PHYSICAL MEASUREMENTS */}
                    <div className={cn(
                      "p-4 rounded-2xl space-y-3",
                      isLightMode ? "bg-white shadow-sm" : "bg-slate-900/60"
                    )}>
                      <h5 className="text-xs font-hud font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 pb-1">
                        <Scale className="w-3.5 h-3.5" />
                        <span>Physical Metrics</span>
                      </h5>

                      <div className="space-y-2 text-xs font-sans">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Height:</span>
                          <div className="font-mono text-[11px] flex gap-2">
                            <span className="text-cyan-400 font-bold">{(pokemon1.height / 10).toFixed(1)}m</span>
                            <span className="text-slate-600">vs</span>
                            <span className="text-purple-400 font-bold">{(secondPokemon.height / 10).toFixed(1)}m</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Weight:</span>
                          <div className="font-mono text-[11px] flex gap-2">
                            <span className="text-cyan-400 font-bold">{(pokemon1.weight / 10).toFixed(1)}kg</span>
                            <span className="text-slate-600">vs</span>
                            <span className="text-purple-400 font-bold">{(secondPokemon.weight / 10).toFixed(1)}kg</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ABILITIES COMPARISON */}
                    <div className={cn(
                      "p-4 rounded-2xl space-y-3",
                      isLightMode ? "bg-white shadow-sm" : "bg-slate-900/60"
                    )}>
                      <h5 className="text-xs font-hud font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2 pb-1">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Abilities</span>
                      </h5>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-[9px] font-hud uppercase text-cyan-400 font-bold block mb-1 truncate">
                            {pokemon1.name.replace(/-/g, ' ')}
                          </span>
                          <ul className="space-y-1">
                            {pokemon1.abilities?.map((a, i) => (
                              <li key={i} className="truncate text-slate-300 flex items-center gap-1 capitalize">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                {(a.name || (a as any).ability?.name || '').replace(/-/g, ' ')}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <span className="text-[9px] font-hud uppercase text-purple-400 font-bold block mb-1 truncate">
                            {secondPokemon.name.replace(/-/g, ' ')}
                          </span>
                          <ul className="space-y-1">
                            {secondPokemon.abilities?.map((a, i) => (
                              <li key={i} className="truncate text-slate-300 flex items-center gap-1 capitalize">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                                {(a.name || (a as any).ability?.name || '').replace(/-/g, ' ')}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* ACTION: INSPECT SECOND POKEMON IN MAIN APP */}
                  {onSelectMainPokemon && (
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          onSelectMainPokemon(secondPokemon);
                          onClose();
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-hud font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Inspect {secondPokemon.name.replace(/-/g, ' ')} in Full Pokédex</span>
                      </button>
                    </div>
                  )}

                </motion.div>
              )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
