import React, { useState } from 'react';
import { Move } from '../types';
import { cn } from '../lib/utils';
import { Swords, ArrowUp, Cpu, Sparkles, BookOpen, ChevronDown, Info, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  typeColors,
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
          <span className="font-bold">Moveset</span>
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
            placeholder="Search moves..."
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
            ? <ArrowUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            : method === 'machine'
              ? <Cpu className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              : method === 'egg'
                ? <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                : <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;

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
                onMouseEnter={() => sounds?.hover?.()}
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
                      methodMoves.map((move, moveIdx) => (
                        <button
                          key={`${move.name}-${moveIdx}`}
                          type="button"
                          onClick={() => {
                            setSelectedMoveDetail(move);
                            setIsMoveDetailOpen(true);
                            try { sounds?.scan?.(); } catch (_) {}
                          }}
                          onMouseEnter={() => sounds?.hover?.()}
                          className={cn(
                            "w-full p-2 rounded-lg border flex justify-between items-center group transition-all text-left cursor-pointer",
                            isLightMode
                              ? "bg-white border-slate-200 hover:border-cyan-500/50"
                              : "bg-slate-900/80 border-cyan-900/30 hover:border-cyan-400/80"
                          )}
                        >
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className={cn("text-[10.5px] font-bold font-hud uppercase tracking-wider truncate", isLightMode ? "text-slate-900" : "text-cyan-100")}>
                              {move.name.replace(/-/g, ' ')}
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={cn(
                                "text-[7.5px] font-mono font-bold px-1.5 py-0.2 rounded uppercase text-white",
                                typeColors[move.type] || "bg-slate-600"
                              )}>
                                {move.type}
                              </span>
                              {move.power ? (
                                <span className={cn("text-[8px] font-mono font-bold", isLightMode ? "text-slate-600" : "text-amber-300")}>
                                  PWR: {move.power}
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <div className="text-right flex flex-col items-end gap-1 shrink-0">
                            <span className={cn("font-mono text-[8.5px] font-bold uppercase", isLightMode ? "text-slate-500" : "text-cyan-500")}>
                              PP: {move.pp}
                            </span>
                            <Info className={cn("w-3 h-3 transition-colors", isLightMode ? "text-slate-400 group-hover:text-cyan-600" : "text-cyan-600 group-hover:text-cyan-300")} />
                          </div>
                        </button>
                      ))
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
