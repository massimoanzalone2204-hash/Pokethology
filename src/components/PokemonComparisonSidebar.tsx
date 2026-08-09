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
  AlertCircle
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

    try {
      const result = await searchPokemon(q);
      if (result) {
        setSecondPokemon(result);
        setSearchQuery('');
      } else {
        setSearchError(`No Pokémon found matching "${q}"`);
      }
    } catch (err: any) {
      setSearchError(err?.message || `Failed to find "${q}"`);
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
        <div className="fixed inset-0 z-[150] flex justify-end overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: '0%', opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ 
              type: 'spring', 
              damping: 28, 
              stiffness: 280, 
              mass: 0.85 
            }}
            className={cn(
              "relative z-[160] w-full max-w-2xl h-full flex flex-col shadow-2xl border-l transition-colors duration-200 overflow-hidden",
              isLightMode
                ? "bg-slate-50 text-slate-900 border-slate-300"
                : "bg-slate-950 text-slate-100 border-cyan-500/30"
            )}
          >
            {/* Header Bar */}
            <div className={cn(
              "px-5 py-4 border-b flex items-center justify-between shrink-0 relative overflow-hidden",
              isLightMode
                ? "bg-white border-slate-200"
                : "bg-slate-900/90 border-cyan-900/50"
            )}>
              <HUDCorners />
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 shrink-0">
                  <ArrowLeftRight className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-hud font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    Pokémon Stat Comparator
                  </h2>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Pin stats and analyze head-to-head combat metrics
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className={cn(
                  "p-2 rounded-xl border transition-all cursor-pointer",
                  isLightMode
                    ? "bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-700"
                    : "bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-300"
                )}
                title="Close Comparator"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6">

              {/* DUAL POKEMON SELECTOR CARDS */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 relative">
                
                {/* POKEMON 1 CARD */}
                <div className={cn(
                  "rounded-2xl p-3.5 sm:p-4 border relative overflow-hidden flex flex-col items-center text-center transition-all",
                  isLightMode
                    ? "bg-white border-slate-200 shadow-sm"
                    : "bg-slate-900/80 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                )}>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    P1 (Pinned)
                  </span>

                  {pokemon1 ? (
                    <>
                      <div className="w-20 h-20 sm:w-24 sm:h-24 my-2 relative flex items-center justify-center">
                        <img
                          src={getSpriteUrl(pokemon1)}
                          alt={pokemon1.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                        />
                      </div>
                      <h3 className="font-hud font-black uppercase text-sm sm:text-base tracking-wider truncate w-full text-cyan-300">
                        {pokemon1.name}
                      </h3>
                      <p className="text-[10px] font-mono text-slate-400">
                        #{String(pokemon1.id).padStart(3, '0')}
                      </p>
                      <div className="flex flex-wrap justify-center gap-1 mt-2">
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
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-cyan-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:scale-110 active:scale-95 transition-all border border-cyan-300 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}

                {/* POKEMON 2 CARD */}
                <div className={cn(
                  "rounded-2xl p-3.5 sm:p-4 border relative overflow-hidden flex flex-col items-center text-center transition-all",
                  isLightMode
                    ? "bg-white border-slate-200 shadow-sm"
                    : "bg-slate-900/80 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                )}>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    P2 (Compare)
                  </span>

                  {secondPokemon ? (
                    <>
                      <div className="w-20 h-20 sm:w-24 sm:h-24 my-2 relative flex items-center justify-center">
                        <img
                          src={getSpriteUrl(secondPokemon)}
                          alt={secondPokemon.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                        />
                      </div>
                      <h3 className="font-hud font-black uppercase text-sm sm:text-base tracking-wider truncate w-full text-purple-300">
                        {secondPokemon.name}
                      </h3>
                      <p className="text-[10px] font-mono text-slate-400">
                        #{String(secondPokemon.id).padStart(3, '0')}
                      </p>
                      <div className="flex flex-wrap justify-center gap-1 mt-2">
                        {secondPokemon.types.map((t, idx) => (
                          <TypeBadge key={idx} type={t.type.name} size="sm" />
                        ))}
                      </div>

                      <button
                        onClick={() => setSecondPokemon(null)}
                        className="mt-3 text-[10px] font-hud uppercase tracking-wider text-rose-400 hover:text-rose-300 underline cursor-pointer"
                      >
                        Change P2
                      </button>
                    </>
                  ) : (
                    <div className="py-4 w-full flex flex-col items-center justify-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 my-1">
                        <Search className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-hud font-bold text-slate-300">Select Pokémon 2</span>
                      <p className="text-[10px] text-slate-400 px-2">Use search below to select rival</p>
                    </div>
                  )}
                </div>

              </div>

              {/* SEARCH INPUT BAR FOR POKEMON 2 */}
              <div className={cn(
                "p-4 rounded-2xl border space-y-3 relative overflow-hidden",
                isLightMode ? "bg-white border-slate-200" : "bg-slate-900/60 border-slate-800"
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
                      placeholder="Enter Pokémon name or ID (e.g. Mewtwo, 150)..."
                      className={cn(
                        "w-full px-3.5 py-2.5 rounded-xl text-xs font-sans border outline-none transition-all",
                        isLightMode
                          ? "bg-slate-100 border-slate-300 text-slate-900 focus:border-cyan-500"
                          : "bg-slate-950 border-slate-700 text-slate-100 focus:border-cyan-400"
                      )}
                    />
                  </div>

                  <button
                    onClick={() => handleSearch()}
                    disabled={isSearching || !searchQuery.trim()}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-2 border transition-all cursor-pointer shrink-0",
                      isSearching
                        ? "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
                        : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
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

                {searchError && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 p-2.5 rounded-xl font-mono">
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
                            "px-2.5 py-1 rounded-lg text-[10px] font-hud uppercase tracking-wider border transition-all cursor-pointer capitalize",
                            isLightMode
                              ? "bg-slate-100 border-slate-300 text-slate-700 hover:bg-cyan-50 hover:border-cyan-400 hover:text-cyan-800"
                              : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-cyan-950/60 hover:border-cyan-500/80 hover:text-cyan-300"
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
                  className="space-y-6"
                >
                  {/* WINNER BANNER HIGHLIGHT */}
                  <div className={cn(
                    "p-4 rounded-2xl border flex items-center justify-between gap-3 relative overflow-hidden",
                    p1Total === p2Total
                      ? "bg-amber-950/30 border-amber-500/40 text-amber-300"
                      : p1Total > p2Total
                        ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-300"
                        : "bg-purple-950/40 border-purple-500/50 text-purple-300"
                  )}>
                    <HUDCorners />
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 shrink-0">
                        <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
                      </div>
                      <div>
                        <span className="text-[10px] font-hud uppercase tracking-widest text-slate-400">
                          Total Base Stat Advantage
                        </span>
                        <h4 className="font-hud font-black text-sm sm:text-base uppercase tracking-wider">
                          {p1Total === p2Total ? (
                            "Exact Stat Parity Tie!"
                          ) : p1Total > p2Total ? (
                            `${pokemon1.name} leads by +${p1Total - p2Total} BST`
                          ) : (
                            `${secondPokemon.name} leads by +${p2Total - p1Total} BST`
                          )}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-slate-300">
                        <span className="text-cyan-400 font-extrabold">{p1Total}</span> vs <span className="text-purple-400 font-extrabold">{p2Total}</span>
                      </div>
                    </div>
                  </div>

                  {/* STAT-BY-STAT COMPARISON BARS */}
                  <div className={cn(
                    "p-4 sm:p-5 rounded-2xl border space-y-4 relative overflow-hidden",
                    isLightMode ? "bg-white border-slate-200" : "bg-slate-900/80 border-slate-800"
                  )}>
                    <HUDCorners />
                    <div className="flex items-center justify-between border-b pb-3 border-slate-800">
                      <h4 className="text-xs font-hud font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                        <Swords className="w-4 h-4" />
                        <span>Base Stat Head-to-Head</span>
                      </h4>
                      <div className="flex items-center gap-4 text-[10px] font-hud uppercase tracking-wider">
                        <span className="text-cyan-400 font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          {pokemon1.name}
                        </span>
                        <span className="text-purple-400 font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-purple-400" />
                          {secondPokemon.name}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3.5 pt-1">
                      {[
                        { key: 'hp', label: 'HP' },
                        { key: 'attack', label: 'Attack' },
                        { key: 'defense', label: 'Defense' },
                        { key: 'special-attack', label: 'Sp. Atk' },
                        { key: 'special-defense', label: 'Sp. Def' },
                        { key: 'speed', label: 'Speed' },
                      ].map(({ key, label }) => {
                        const val1 = getStatValue(pokemon1, key);
                        const val2 = getStatValue(secondPokemon, key);
                        const diff = val1 - val2;
                        const maxVal = Math.max(val1, val2, 120);

                        return (
                          <div key={key} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-hud">
                              <span className="text-slate-300 font-bold uppercase tracking-wider">
                                {label}
                              </span>
                              <div className="flex items-center gap-3 font-mono font-bold text-[11px]">
                                <span className={cn(
                                  val1 > val2 ? "text-cyan-400 font-extrabold" : "text-slate-400"
                                )}>
                                  {val1}
                                </span>
                                <span className="text-slate-600">vs</span>
                                <span className={cn(
                                  val2 > val1 ? "text-purple-400 font-extrabold" : "text-slate-400"
                                )}>
                                  {val2}
                                </span>

                                {/* Diff badge */}
                                {diff !== 0 && (
                                  <span className={cn(
                                    "px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ml-1",
                                    diff > 0 
                                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" 
                                      : "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                                  )}>
                                    {diff > 0 ? `+${diff} P1` : `+${Math.abs(diff)} P2`}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Dual Bar Display */}
                            <div className="grid grid-cols-2 gap-2 h-2.5 bg-slate-950/80 p-0.5 rounded-full border border-slate-800/80 overflow-hidden">
                              {/* P1 Bar (Align Right) */}
                              <div className="flex justify-end items-center h-full">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    val1 >= val2
                                      ? "bg-gradient-to-l from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                                      : "bg-slate-700/80"
                                  )}
                                  style={{ width: `${Math.min(100, (val1 / maxVal) * 100)}%` }}
                                />
                              </div>

                              {/* P2 Bar (Align Left) */}
                              <div className="flex justify-start items-center h-full">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    val2 >= val1
                                      ? "bg-gradient-to-r from-purple-400 to-indigo-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                                      : "bg-slate-700/80"
                                  )}
                                  style={{ width: `${Math.min(100, (val2 / maxVal) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* PHYSICAL SPECS & ABILITIES COMPARISON */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* HEIGHT & WEIGHT */}
                    <div className={cn(
                      "p-4 rounded-2xl border space-y-3 relative overflow-hidden",
                      isLightMode ? "bg-white border-slate-200" : "bg-slate-900/80 border-slate-800"
                    )}>
                      <HUDCorners />
                      <h5 className="text-xs font-hud font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 border-b pb-2 border-slate-800">
                        <Scale className="w-3.5 h-3.5" />
                        <span>Physical Metrics</span>
                      </h5>

                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                          <span className="text-slate-400 flex items-center gap-1 font-sans">
                            <Ruler className="w-3 h-3 text-amber-400" /> Height:
                          </span>
                          <span className="text-slate-200">
                            <span className="text-cyan-300 font-bold">{pokemon1.height / 10}m</span> vs <span className="text-purple-300 font-bold">{secondPokemon.height / 10}m</span>
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-400 flex items-center gap-1 font-sans">
                            <Scale className="w-3 h-3 text-emerald-400" /> Weight:
                          </span>
                          <span className="text-slate-200">
                            <span className="text-cyan-300 font-bold">{pokemon1.weight / 10}kg</span> vs <span className="text-purple-300 font-bold">{secondPokemon.weight / 10}kg</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ABILITIES OVERVIEW */}
                    <div className={cn(
                      "p-4 rounded-2xl border space-y-3 relative overflow-hidden",
                      isLightMode ? "bg-white border-slate-200" : "bg-slate-900/80 border-slate-800"
                    )}>
                      <HUDCorners />
                      <h5 className="text-xs font-hud font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2 border-b pb-2 border-slate-800">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Abilities</span>
                      </h5>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-[9px] font-hud uppercase text-cyan-400 font-bold block mb-1">
                            {pokemon1.name}
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
                          <span className="text-[9px] font-hud uppercase text-purple-400 font-bold block mb-1">
                            {secondPokemon.name}
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
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          onSelectMainPokemon(secondPokemon);
                          onClose();
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-hud font-bold text-xs uppercase tracking-wider border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Inspect {secondPokemon.name} in Full Pokédex</span>
                      </button>
                    </div>
                  )}

                </motion.div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
