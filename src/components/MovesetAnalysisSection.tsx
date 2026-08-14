import React, { useState } from 'react';
import { Move } from '../types';
import { cn } from '../lib/utils';
import { Swords, TrendingUp, Disc, Sparkles, GraduationCap, ChevronDown, Info, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TypeBadge } from './TypeBadge';
import { DamageClassIcon, PokemonTypeIcon } from './PokemonTypeIcon';
import { officialMoveBoxStyles } from './OfficialMoveBox';

interface MovesetAnalysisSectionProps {
  moves: Move[];
  isLightMode: boolean;
  typeColors: Record<string, string>;
  sounds?: any;
  setSelectedMoveDetail: (move: Move) => void;
  setIsMoveDetailOpen: (open: boolean) => void;
}

const methodDisplayNames: Record<string, string> = {
  'level-up': 'Level Up',
  'machine': 'TM / HM',
  'egg': 'Egg Moves',
  'tutor': 'Tutor Moves'
};

export const MovesetAnalysisSection: React.FC<MovesetAnalysisSectionProps> = ({
  moves,
  isLightMode,
  sounds,
  setSelectedMoveDetail,
  setIsMoveDetailOpen
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedMethods, setCollapsedMethods] = useState<Record<string, boolean>>({
    'machine': true,
    'egg': true,
    'tutor': true
  });

  const toggleMethod = (method: string) => {
    setCollapsedMethods(prev => ({
      ...prev,
      [method]: !prev[method]
    }));
    try { sounds?.scan?.(); } catch (_) {}
  };

  const methods = ['level-up', 'machine', 'egg', 'tutor'] as const;

  const filteredMoves = moves.filter(m => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return m.name.toLowerCase().includes(q) || m.type.toLowerCase().includes(q);
  });

  return (
    <div className={cn(
      "backdrop-blur-xl rounded-2xl p-5 sm:p-6 border shadow-xl relative overflow-hidden transition-all",
      isLightMode
        ? "bg-white/95 border-slate-200"
        : "bg-slate-900/70 border-cyan-900/40"
    )}>
      {/* Header */}
      <div className={cn(
        "font-hud text-[13px] uppercase tracking-wider mb-4 pb-3 border-b flex items-center justify-between gap-2",
        isLightMode ? "text-cyan-900 border-slate-200" : "text-cyan-400 border-cyan-900/40"
      )}>
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">Moveset Analysis</span>
        </div>

        <span className={cn(
          "text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
          isLightMode ? "bg-slate-100 text-slate-600 border-slate-200" : "bg-cyan-950/80 text-cyan-400 border-cyan-800/60"
        )}>
          {moves.length} Moves
        </span>
      </div>

      {/* Search Input Filter */}
      <div className="mb-4 relative">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search moves by name or type..."
            className={cn(
              "w-full pl-9 pr-4 py-1.5 rounded-xl text-[11px] font-sans border transition-all outline-none",
              isLightMode
                ? "bg-slate-50 border-slate-200 text-slate-800 focus:border-cyan-500 focus:bg-white"
                : "bg-slate-950/80 border-cyan-900/50 text-cyan-100 focus:border-cyan-400"
            )}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-[10px] text-slate-400 hover:text-white uppercase font-mono font-bold cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Move Methods List */}
      <div className="space-y-3">
        {methods.map((method) => {
          const methodMoves = filteredMoves.filter(m => m.learn_method === method);
          if (methodMoves.length === 0 && searchQuery) return null;

          const isCollapsed = searchQuery ? false : (collapsedMethods[method] ?? false);

          const icon = method === 'level-up'
            ? <TrendingUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            : method === 'machine'
              ? <Disc className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              : method === 'egg'
                ? <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                : <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;

          return (
            <div
              key={`move-method-${method}`}
              className={cn(
                "border rounded-xl p-3 transition-colors",
                isLightMode ? "bg-slate-50/70 border-slate-200" : "bg-slate-950/50 border-cyan-900/30"
              )}
            >
              {/* Category Header Bar */}
              <button
                type="button"
                onClick={() => toggleMethod(method)}
                className="w-full flex items-center justify-between py-1 px-1 hover:bg-cyan-500/5 rounded-lg transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {icon}
                  <h4 className={cn("text-[11px] font-hud font-bold uppercase tracking-wider", isLightMode ? "text-slate-800" : "text-cyan-300")}>
                    {methodDisplayNames[method]} ({methodMoves.length})
                  </h4>
                </div>

                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300 text-cyan-400", !isCollapsed && "rotate-180")} />
              </button>

              {/* Move Grid */}
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-2 pt-2 border-t border-cyan-900/20 overflow-hidden"
                  >
                    {methodMoves.length > 0 ? (
                      methodMoves.map((move, moveIdx) => {
                        const normType = (move.type || 'normal').toLowerCase();
                        const theme = officialMoveBoxStyles[normType] || officialMoveBoxStyles.normal;
                        return (
                          <button
                            key={`${move.name}-${moveIdx}`}
                            type="button"
                            onClick={() => {
                              setSelectedMoveDetail(move);
                              setIsMoveDetailOpen(true);
                              try { sounds?.scan?.(); } catch (_) {}
                            }}
                            className={cn(
                              "w-full p-2.5 rounded-xl border flex flex-col justify-between gap-1 group transition-all text-left cursor-pointer relative overflow-hidden",
                              "bg-gradient-to-br",
                              theme.bgGradient,
                              theme.border,
                              "hover:scale-[1.01] active:scale-[0.99]"
                            )}
                          >
                            <div className="flex justify-between items-start w-full gap-1.5 relative z-10">
                              <div className="flex flex-col min-w-0">
                                <span className={cn(
                                  "text-[10px] sm:text-[11px] font-hud font-bold uppercase tracking-wider truncate",
                                  isLightMode ? "text-slate-900" : "text-white group-hover:text-cyan-200"
                                )}>
                                  {move.name.replace(/-/g, ' ')}
                                </span>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <DamageClassIcon damageClass={move.damage_class} size="xs" />
                                  {move.power ? (
                                    <span className="text-[7.5px] font-mono font-bold text-amber-300">
                                      PWR: {move.power}
                                    </span>
                                  ) : null}
                                </div>
                              </div>

                              <TypeBadge type={move.type} size="xs" showIcon={true} />
                            </div>

                            <div className="flex items-center justify-between w-full relative z-10 pt-1 border-t border-white/10 text-[7.5px] font-mono text-slate-300">
                              <span>ACC: {move.accuracy ? `${move.accuracy}%` : '--'}</span>
                              <span className="font-bold text-slate-200">PP {move.pp}</span>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <p className="col-span-full text-[9px] font-mono text-slate-500 p-2 italic text-center">
                        No moves found matching "{searchQuery}".
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
