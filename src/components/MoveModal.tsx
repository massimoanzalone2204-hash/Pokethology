import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Zap, Swords } from 'lucide-react';
import { Move } from '../types';
import { cn } from '../lib/utils';
import { TypeBadge } from './TypeBadge';
import { sounds } from '../lib/sounds';

interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  moves: Move[];
  onMoveClick: (move: Move) => void;
  isLightMode: boolean;
  typeColors: Record<string, string>;
}

export const MoveModal: React.FC<MoveModalProps> = ({ isOpen, onClose, moves, onMoveClick, isLightMode, typeColors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredMoves = useMemo(() => {
    return moves.filter(m => {
      const matchSearch = !searchTerm || m.name.toLowerCase().includes(searchTerm.toLowerCase().replace(/\s+/g, '-'));
      const matchType = !selectedType || m.type.toLowerCase() === selectedType.toLowerCase();
      return matchSearch && matchType;
    });
  }, [moves, searchTerm, selectedType]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(moves.map(m => m.type.toLowerCase()))).sort();
  }, [moves]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex flex-col bg-slate-950/98 backdrop-blur-2xl overflow-hidden text-slate-100"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Header Bar */}
          <div className="shrink-0 border-b border-cyan-500/30 bg-slate-900/90 px-3 sm:px-8 py-3.5 flex items-center justify-between gap-4 z-20 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <Swords className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="font-hud font-black text-sm sm:text-lg text-cyan-300 uppercase tracking-widest leading-tight">
                  AVAILABLE MOVESET
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] sm:text-xs font-mono font-bold">
                  {filteredMoves.length} {filteredMoves.length === 1 ? 'MOVE' : 'MOVES'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                try { sounds.scan(); } catch (_) {}
              }}
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-hud font-bold uppercase tracking-wider group shadow-sm"
              title="Close (Esc)"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              <span className="hidden sm:inline">CLOSE</span>
            </button>
          </div>

          {/* Filter & Search Bar */}
          <div className="shrink-0 bg-slate-900/70 border-b border-slate-800/80 px-3 sm:px-8 py-2.5 z-10">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search move by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-500/60 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 outline-none transition-all font-sans"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Type Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 no-scrollbar">
                <button
                  onClick={() => setSelectedType(null)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-hud font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border",
                    !selectedType
                      ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm"
                      : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                  )}
                >
                  ALL TYPES
                </button>
                {uniqueTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(selectedType === t ? null : t)}
                    className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-hud font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border",
                      selectedType === t
                        ? "bg-cyan-950 border-cyan-400 text-cyan-300 shadow-sm"
                        : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Moves Grid / List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
              {filteredMoves.length === 0 ? (
                <div className="text-center py-16">
                  <Zap className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="font-hud font-bold text-slate-300 uppercase tracking-wider text-sm mb-1">
                    No Moves Match Filter
                  </p>
                  <button
                    onClick={() => { setSearchTerm(''); setSelectedType(null); }}
                    className="mt-2 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredMoves.map((move, i) => (
                    <button
                      key={`${move.name}-${i}`}
                      onClick={() => {
                        onMoveClick(move);
                        onClose();
                        try { sounds.scan(); } catch (_) {}
                      }}
                      className="p-3.5 rounded-xl border border-slate-800 hover:border-cyan-500/60 bg-slate-900/70 hover:bg-slate-900 transition-all text-left group shadow-sm flex flex-col justify-between cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs sm:text-sm font-hud font-black uppercase tracking-wider text-cyan-300 group-hover:text-cyan-200">
                          {move.name.replace(/-/g, ' ')}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          PP: {move.pp}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-800/60">
                        <TypeBadge type={move.type} size="sm" />
                        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                          {move.power ? (
                            <span className="text-amber-400 font-bold">PWR: {move.power}</span>
                          ) : (
                            <span className="text-slate-500">PWR: —</span>
                          )}
                          {move.accuracy ? (
                            <span className="text-emerald-400">ACC: {move.accuracy}%</span>
                          ) : (
                            <span className="text-slate-500">ACC: —</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
