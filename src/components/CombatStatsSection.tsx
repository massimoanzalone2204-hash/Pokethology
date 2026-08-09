import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { Gauge, BarChart2, PieChart, ArrowLeftRight } from 'lucide-react';
import { motion } from 'motion/react';
import { SingleStatRadar } from './SingleStatRadar';

interface CombatStatsSectionProps {
  stats: { base_stat: number; stat: { name: string } }[];
  isLightMode: boolean;
  sounds?: any;
  onCompare?: () => void;
}

const statNameMap: Record<string, string> = {
  'hp': 'HP',
  'attack': 'Attack',
  'defense': 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  'speed': 'Speed'
};

const getStatColor = (val: number) => {
  if (val >= 130) return { bar: "from-amber-500 to-yellow-400", text: "text-amber-400" };
  if (val >= 100) return { bar: "from-emerald-500 to-teal-400", text: "text-emerald-400" };
  if (val >= 80)  return { bar: "from-cyan-500 to-blue-400", text: "text-cyan-400" };
  if (val >= 60)  return { bar: "from-blue-600 to-indigo-400", text: "text-blue-400" };
  return { bar: "from-slate-500 to-slate-400", text: "text-slate-400" };
};

export const CombatStatsSection: React.FC<CombatStatsSectionProps> = ({
  stats,
  isLightMode,
  onCompare
}) => {
  const [viewMode, setViewMode] = useState<'bars' | 'radar'>('bars');

  const bst = stats.reduce((acc, curr) => acc + curr.base_stat, 0);

  let highestStat = stats[0];
  let lowestStat = stats[0];
  stats.forEach(s => {
    if (s.base_stat > highestStat.base_stat) highestStat = s;
    if (s.base_stat < lowestStat.base_stat) lowestStat = s;
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
          <Gauge className="w-4 h-4 text-cyan-400" />
          <span className="font-bold">Base Stats</span>
        </div>

        <div className="flex items-center gap-2">
          {onCompare && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCompare}
              title="Pin & Compare Stats"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-hud uppercase tracking-wider border transition-all cursor-pointer font-bold bg-gradient-to-r from-purple-950/80 to-cyan-950/80 hover:from-purple-900 hover:to-cyan-900 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.25)]"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Compare</span>
            </motion.button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-950/40 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('bars')}
            className={cn(
              "p-1 rounded text-[10px] transition-all cursor-pointer",
              viewMode === 'bars'
                ? "bg-cyan-500 text-slate-950 font-black"
                : "text-slate-400 hover:text-white"
            )}
            title="Bars View"
          >
            <BarChart2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('radar')}
            className={cn(
              "p-1 rounded text-[10px] transition-all cursor-pointer",
              viewMode === 'radar'
                ? "bg-cyan-500 text-slate-950 font-black"
                : "text-slate-400 hover:text-white"
            )}
            title="Radar View"
          >
            <PieChart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className={cn("p-2.5 rounded-xl border text-center", isLightMode ? "bg-slate-50 border-slate-200" : "bg-slate-950/80 border-cyan-900/50")}>
          <span className="text-[9px] font-hud uppercase tracking-wider text-slate-400 font-bold block">Total</span>
          <p className={cn("text-[16px] font-black font-hud leading-none mt-1", isLightMode ? "text-cyan-900" : "text-cyan-200")}>{bst}</p>
        </div>

        <div className={cn("p-2.5 rounded-xl border text-center", isLightMode ? "bg-slate-50 border-slate-200" : "bg-slate-950/80 border-cyan-900/50")}>
          <span className="text-[9px] font-hud uppercase tracking-wider text-slate-400 font-bold block">Highest</span>
          <p className="text-[12px] font-hud font-black uppercase mt-1 text-amber-400">
            {statNameMap[highestStat.stat.name]} ({highestStat.base_stat})
          </p>
        </div>

        <div className={cn("p-2.5 rounded-xl border text-center", isLightMode ? "bg-slate-50 border-slate-200" : "bg-slate-950/80 border-cyan-900/50")}>
          <span className="text-[9px] font-hud uppercase tracking-wider text-slate-400 font-bold block">Lowest</span>
          <p className="text-[12px] font-hud font-black uppercase mt-1 text-slate-400">
            {statNameMap[lowestStat.stat.name]} ({lowestStat.base_stat})
          </p>
        </div>
      </div>

      {/* Main View */}
      <div>
        {viewMode === 'radar' ? (
          <div className="p-4 rounded-xl border bg-slate-950/80 border-cyan-900/40 flex items-center justify-center min-h-[220px]">
            <SingleStatRadar stats={stats} color="#22d3ee" />
          </div>
        ) : (
          <div className="space-y-2.5">
            {stats.map((s, idx) => {
              const name = statNameMap[s.stat.name] || s.stat.name;
              const colorInfo = getStatColor(s.base_stat);

              return (
                <div key={`stat-bar-${s.stat.name}-${idx}`} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px] font-hud uppercase font-bold">
                    <span className={isLightMode ? "text-slate-800" : "text-cyan-200"}>{name}</span>
                    <span className={cn("font-mono font-black", colorInfo.text)}>{s.base_stat}</span>
                  </div>

                  <div className={cn(
                    "w-full h-2.5 rounded-full overflow-hidden border p-[1px]",
                    isLightMode ? "bg-slate-100 border-slate-300" : "bg-slate-950 border-cyan-950/80"
                  )}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (s.base_stat / 200) * 100)}%` }}
                      transition={{ duration: 0.3 }}
                      className={cn("h-full rounded-full bg-gradient-to-r", colorInfo.bar)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
