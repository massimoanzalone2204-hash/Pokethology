import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Loader2, Database, Sparkles, Search, ArrowUpDown, ChevronDown, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { GENERATIONS } from '../lib/api';
import { Pokemon } from '../types';

interface PokemonListProps {
  listMode: 'home' | 'pokemon' | 'types';
  isSelectingOpponent: boolean;
  isSelectingComparison: boolean;
  lowPerformanceMode: boolean;
  sortedAndFilteredList: any[];
  pokemon: Pokemon | null;
  battleOpponent: Pokemon | null;
  comparisonPokemon: Pokemon | null;
  loadingList: boolean;
  currentGenId: number;
  viewAllGenerations: boolean;
  sortBy: 'id' | 'name';
  sortOrder: 'asc' | 'desc';
  setCurrentGenId: (id: number) => void;
  setViewAllGenerations: (val: boolean) => void;
  setPokemon: (p: Pokemon | null) => void;
  setComparisonPokemon: (p: Pokemon | null) => void;
  setQuery: (q: string) => void;
  setInputValue: (v: string) => void;
  setLastSearched: (s: string) => void;
  setListMode: (m: 'home' | 'pokemon' | 'types') => void;
  setSortBy: (s: 'id' | 'name') => void;
  setSortOrder: (o: 'asc' | 'desc') => void;
  setIsSelectingOpponent: (v: boolean) => void;
  setIsSelectingComparison: (v: boolean) => void;
  setActiveTab: (t: 'data' | 'chat' | 'battle' | 'compare') => void;
  handlePokemonClick: (name: string) => void;
  sounds: any;
  hudButtonClass: (active: boolean, color: string) => string;
}

export const PokemonList = memo(({
  listMode,
  isSelectingOpponent,
  isSelectingComparison,
  lowPerformanceMode,
  sortedAndFilteredList,
  pokemon,
  battleOpponent,
  comparisonPokemon,
  loadingList,
  currentGenId,
  viewAllGenerations,
  sortBy,
  sortOrder,
  setCurrentGenId,
  setViewAllGenerations,
  setPokemon,
  setComparisonPokemon,
  setQuery,
  setInputValue,
  setLastSearched,
  setListMode,
  setSortBy,
  setSortOrder,
  setIsSelectingOpponent,
  setIsSelectingComparison,
  setActiveTab,
  handlePokemonClick,
  sounds,
  hudButtonClass
}: PokemonListProps) => {
  if (listMode !== 'pokemon' && !isSelectingOpponent && !isSelectingComparison) return null;

  return (
    <motion.div 
      key="pokemon-list"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className="flex-1 bg-zinc-950/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-zinc-800/80 shadow-2xl relative overflow-hidden flex flex-col"
    >
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header - YouTube Styled */}
        <div className="flex flex-col gap-3.5 mb-5 border-b border-zinc-900 pb-4 shrink-0">
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-full shadow-inner overflow-hidden p-1">
                <img 
                  src="/logo.png" 
                  alt="Pokéthology Logo" 
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(6,182,212,0.4)]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-md sm:text-xl font-sans font-black tracking-widest text-zinc-100 flex items-center gap-2">
                  DATABASE INDEX
                  <span className="text-[9px] font-mono bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800/60 uppercase">
                    v2.5
                  </span>
                </h1>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                  Operational Core • Live Biospheres Sync
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 self-stretch xs:self-auto justify-between xs:justify-end">
              {isSelectingOpponent && (
                <button 
                  onClick={() => {
                    setIsSelectingOpponent(false);
                    setPokemon(pokemon);
                    setActiveTab('battle');
                    try { sounds.scan(); } catch (_) {}
                  }}
                  className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-900/50 hover:border-red-500 rounded-full text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                >
                  Cancel Opponent
                </button>
              )}
              {isSelectingComparison && (
                <button 
                  onClick={() => {
                    setIsSelectingComparison(false);
                    setActiveTab('compare');
                    try { sounds.scan(); } catch (_) {}
                  }}
                  className="px-3 py-1.5 bg-amber-950/40 hover:bg-amber-900/50 text-amber-400 border border-amber-900/50 hover:border-amber-500 rounded-full text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                >
                  Cancel Matchup
                </button>
              )}
              <span className="text-cyan-400 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 rounded-lg shadow-sm flex items-center gap-1.5">
                {(typeof navigator !== 'undefined' && !navigator.onLine) || sortedAndFilteredList.some((p: any) => p.isOfflineCached) ? (
                  <>
                    <Database className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span className="text-amber-300">Offline Cache ({sortedAndFilteredList.length})</span>
                  </>
                ) : (
                  <>{sortedAndFilteredList.length} Units Available</>
                )}
              </span>
            </div>
          </div>
          
          {/* Generation Category Chips - Styled exactly like YouTube horizontal categories */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none max-w-full">
              {GENERATIONS.map((gen) => {
                const isActive = !viewAllGenerations && currentGenId === gen.id;
                return (
                  <motion.button
                    key={gen.id}
                    type="button"
                    onClick={() => {
                      setCurrentGenId(gen.id);
                      setViewAllGenerations(false);
                      setPokemon(null);
                      try { sounds.scan(); } catch (_) {}
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "whitespace-nowrap px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-medium font-sans tracking-wide transition-all duration-200 cursor-pointer select-none border",
                      isActive
                        ? "bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold shadow-md shadow-zinc-950/20"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800"
                    )}
                  >
                    {gen.name}
                  </motion.button>
                );
              })}
              
              {/* All / Combined Option Pills */}
              <motion.button
                type="button"
                onClick={() => {
                  setViewAllGenerations(!viewAllGenerations);
                  setPokemon(null);
                  setQuery('');
                  setInputValue('');
                  setLastSearched('');
                  setListMode('pokemon');
                  try { sounds.scan(); } catch (_) {}
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "whitespace-nowrap px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-medium font-sans tracking-wide transition-all duration-200 cursor-pointer select-none border flex items-center gap-1",
                  viewAllGenerations
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 shadow-md shadow-purple-900/30"
                    : "bg-zinc-900 text-purple-400 border-zinc-800 hover:text-purple-300 hover:bg-purple-950/20"
                )}
              >
                <Sparkles className="w-3 h-3 text-current" />
                <span>All Gens</span>
              </motion.button>
            </div>

            {/* Sort & Order Controls */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
              <button
                onClick={() => {
                  setSortBy(sortBy === 'id' ? 'name' : 'id');
                  try { sounds.scan(); } catch (_) {}
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-mono tracking-wide transition-all duration-150 cursor-pointer active:scale-95 text-zinc-400 hover:text-zinc-200",
                  sortBy === 'name' ? "bg-zinc-900 border-zinc-800" : "bg-transparent border-transparent"
                )}
                title="Sort Parameter"
              >
                <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                <span>{sortBy === 'id' ? 'ID Sort' : 'Alpha ABC'}</span>
              </button>
              
              <button
                onClick={() => {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  try { sounds.scan(); } catch (_) {}
                }}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors"
                title="Toggle Direction"
              >
                <span className="text-[10px] uppercase px-1.5 py-0.5 font-bold font-mono">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* List Content */}
        {loadingList ? (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 min-h-[350px]">
            <div className="relative mb-5 flex items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-cyan-500" />
              <div className="absolute inset-0 border border-cyan-500/10 rounded-full animate-ping"></div>
            </div>
            <span className="font-sans font-bold text-[14px] tracking-widest uppercase text-zinc-300">Synchronizing Intel Matrix...</span>
            <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider mt-1.5">Parsing Generation {currentGenId} Endpoint</span>
          </div>
        ) : sortedAndFilteredList.length > 0 ? (
          <div className="flex-1 overflow-y-auto pr-1 select-none custom-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 pb-6">
              {sortedAndFilteredList.slice(0, lowPerformanceMode ? 100 : 500).map((p, idx) => {
                const id = p.url.split('/').filter(Boolean).pop();
                const displayId = p.displayId || id;
                const isSelected = p.name === pokemon?.name;
                const isOpponentSelected = p.name === battleOpponent?.name;
                const isComparisonSelected = p.name === comparisonPokemon?.name;
                
                let selectBorderClass = "border-slate-800/60 bg-slate-900/40 text-slate-400 hover:bg-slate-800/80 hover:border-slate-600 hover:text-slate-200";
                
                if (isSelected) {
                  selectBorderClass = "bg-cyan-950/40 border-cyan-500/50 text-cyan-300 shadow-[0_4px_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/20";
                } else if (isOpponentSelected && isSelectingOpponent) {
                  selectBorderClass = "bg-red-950/40 border-red-500/50 text-red-300 shadow-[0_4px_15px_rgba(239,68,68,0.15)] ring-1 ring-red-500/20";
                } else if (isComparisonSelected && isSelectingComparison) {
                  selectBorderClass = "bg-amber-950/40 border-amber-500/50 text-amber-300 shadow-[0_4px_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/20";
                }

                return (
                  <button
                    key={`${p.name}-${p.id || id || idx}`}
                    type="button"
                    onClick={() => handlePokemonClick(p.name)}
                    onMouseEnter={() => { try { sounds.hover(); } catch (_) {} }}
                    className={cn(
                      "group border rounded-2xl p-3 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer relative overflow-hidden w-full text-center h-32 sm:h-36 shadow-sm hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]",
                      selectBorderClass
                    )}
                  >
                    
                    {/* Tiny YouTube-style item badge / Unit Indicator */}
                    <div className="absolute top-2.5 left-3 text-[9px] font-mono text-slate-500 group-hover:text-slate-400 transition-colors flex items-center gap-1.5 shrink-0">
                      <span>#{String(displayId || "0").padStart(4, '0')}</span>
                    </div>

                    {/* Official Artwork */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mt-2 z-10 shrink-0">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${displayId || id}.png`}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src.includes('official-artwork')) {
                            target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${displayId || id}.png`;
                          }
                        }}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className={cn(
                          "w-full h-full object-contain relative z-10 transition-transform duration-300 drop-shadow-md",
                          (isSelected || isOpponentSelected || isComparisonSelected)
                            ? "scale-125 drop-shadow-[0_4px_10px_rgba(6,182,212,0.3)]"
                            : "opacity-80 group-hover:opacity-100 group-hover:scale-110"
                        )}
                        loading="lazy"
                      />
                    </div>

                    {/* Clean Typography Title */}
                    <span className={cn(
                      "font-sans text-[11px] sm:text-[13px] uppercase tracking-wider font-extrabold relative z-10 transition-colors break-words whitespace-normal leading-tight w-full px-1 mt-1 text-center line-clamp-2",
                      (isSelected || isOpponentSelected || isComparisonSelected) ? "font-black" : "text-slate-400 group-hover:text-slate-100"
                    )}>
                      {p.name.replace(/-/g, ' ')}
                    </span>
                  </button>
                );
              })}
            </div>

            {sortedAndFilteredList.length > (lowPerformanceMode ? 100 : 500) && (
              <div className="text-center py-5 border-t border-zinc-900 mt-2">
                <p className="text-[10px] text-zinc-650 font-mono uppercase tracking-wider">
                  Displaying {lowPerformanceMode ? 100 : 500} of {sortedAndFilteredList.length} items. Refine search constraints for complete index parsing.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-650 font-sans text-sm uppercase tracking-wider min-h-[300px]">
            <Database className="w-10 h-10 mb-3 text-zinc-700" />
            <p className="text-zinc-500 font-semibold text-xs font-mono">No matching records identified</p>
          </div>
        )}
      </div>
    </motion.div>
  );
});
