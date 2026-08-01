import React, { memo } from 'react';
import { motion } from 'motion/react';
import { EvolutionNode } from '../types';
import { cn } from '../lib/utils';
import { ChevronRight, Database, Crown } from 'lucide-react';

interface EvolutionNodeComponentProps {
  node: EvolutionNode;
  depth?: number;
  currentPokemonName?: string;
  onSearch: (name: string) => void;
  isLightMode?: boolean;
}

const doesNodeLeadTo = (node: EvolutionNode, targetName: string): boolean => {
  if (!node) return false;
  if (node.name === targetName) return true;
  if (!node.evolves_to || node.evolves_to.length === 0) return false;
  return node.evolves_to.some(child => doesNodeLeadTo(child, targetName));
};

// Format evolution method label cleanly (e.g., "Lv. 16" -> "LV. 16")
const formatMethodLabel = (details?: string) => {
  if (!details || details.trim() === '') return 'LV. UP';
  let formatted = details.replace(/Lv\./gi, 'LV.').toUpperCase();
  if (formatted === 'LEVEL UP') return 'LV. UP';
  return formatted;
};

export const EvolutionNodeComponent = memo(({ 
  node, 
  depth = 0, 
  currentPokemonName, 
  onSearch,
  isLightMode = false
}: EvolutionNodeComponentProps) => {
  const hasChildren = node.evolves_to && node.evolves_to.length > 0;
  const isFinalForm = !hasChildren && depth > 0;
  const isBaseForm = depth === 0 && hasChildren;
  const isIntermediateForm = depth > 0 && hasChildren;
  const isSingleStage = depth === 0 && !hasChildren;

  const isCurrent = node.name === currentPokemonName;
  const inActivePath = currentPokemonName ? doesNodeLeadTo(node, currentPokemonName) : false;
  
  return (
    <div className="flex flex-row items-center justify-center py-2 shrink-0 my-auto touch-pan-x touch-pan-y [touch-action:pan-x_pan-y]">
      {/* Node Avatar Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: depth * 0.08, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center shrink-0 my-auto touch-pan-x touch-pan-y [touch-action:pan-x_pan-y]"
      >
        <button 
          type="button"
          onClick={() => onSearch(node.name)}
          className="flex flex-col items-center group cursor-pointer w-22 sm:w-28 focus:outline-none relative"
        >
          {/* Stage Badge Above Circle */}
          <div className="mb-1.5 h-6 flex items-center justify-center">
            {isFinalForm && (
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-black tracking-widest uppercase flex items-center gap-1 border shadow-md animate-pulse",
                isLightMode 
                  ? "bg-amber-100 text-amber-900 border-amber-400 shadow-amber-200" 
                  : "bg-[#1a1202]/95 text-amber-300 border-amber-400/90 shadow-[0_0_12px_rgba(251,191,36,0.45)] ring-1 ring-amber-400/40"
              )}>
                <Crown className="w-2.5 h-2.5 text-amber-400" />
                {depth >= 2 ? "STAGE 3" : "STAGE 2"}
              </span>
            )}
            {isBaseForm && (
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-black tracking-widest uppercase border shadow-md",
                isLightMode 
                  ? "bg-slate-100 text-cyan-800 border-cyan-400" 
                  : "bg-[#061423]/95 text-cyan-300 border-cyan-400/90 shadow-[0_0_10px_rgba(34,211,238,0.4)] ring-1 ring-cyan-400/30"
              )}>
                BASE FORM
              </span>
            )}
            {isIntermediateForm && (
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-black tracking-widest uppercase border shadow-md",
                isLightMode 
                  ? "bg-purple-100 text-purple-900 border-purple-400" 
                  : "bg-[#150927]/95 text-purple-300 border-purple-400/90 shadow-[0_0_10px_rgba(168,85,247,0.4)] ring-1 ring-purple-400/30"
              )}>
                STAGE 2
              </span>
            )}
            {isSingleStage && (
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-black tracking-widest uppercase border shadow-md",
                isLightMode 
                  ? "bg-emerald-100 text-emerald-900 border-emerald-400" 
                  : "bg-[#041a14]/95 text-emerald-300 border-emerald-400/90 shadow-[0_0_10px_rgba(52,211,153,0.4)] ring-1 ring-emerald-400/30"
              )}>
                SINGLE FORM
              </span>
            )}
          </div>

          {/* Circular Backdrop */}
          <div className={cn(
            "w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-2 rounded-full transition-all duration-300 relative",
            isCurrent 
              ? "bg-gradient-to-b from-cyan-500/25 to-blue-900/40 ring-2 ring-cyan-400 shadow-[0_0_22px_rgba(34,211,238,0.45)]" 
              : isFinalForm
                ? isLightMode
                  ? "bg-amber-50 border-2 border-amber-400/80 ring-2 ring-amber-300/50 shadow-md group-hover:bg-amber-100"
                  : "bg-gradient-to-b from-amber-950/60 via-purple-950/40 to-slate-900/90 ring-2 ring-amber-400/70 group-hover:ring-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.3)] backdrop-blur-sm"
                : inActivePath 
                  ? isLightMode
                    ? "bg-cyan-50 border border-cyan-400/60 ring-2 ring-cyan-400/50 shadow-md"
                    : "bg-gradient-to-b from-cyan-900/40 to-slate-800/80 ring-1 ring-cyan-700/50 group-hover:bg-cyan-900/60 group-hover:ring-cyan-500/50 shadow-lg backdrop-blur-sm"
                  : isLightMode
                    ? "bg-slate-100 border border-slate-300 group-hover:bg-cyan-50 group-hover:border-cyan-300 shadow-sm"
                    : "bg-gradient-to-b from-slate-800/80 to-slate-900/90 ring-1 ring-slate-700/80 group-hover:bg-slate-800 group-hover:ring-cyan-500/50 shadow-lg backdrop-blur-sm"
          )}>
            {/* Inner tech ring */}
            <div className={cn(
               "absolute inset-1 rounded-full border border-dashed opacity-30 transition-all duration-500",
               isCurrent ? "border-cyan-300 rotate-180" : isFinalForm ? "border-amber-400 rotate-45" : inActivePath ? "border-cyan-500/50" : "border-slate-500 group-hover:border-cyan-500/50 group-hover:rotate-45"
            )} />

            {/* Active micro badge */}
            {isCurrent && (
               <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-slate-950 rounded-full flex items-center justify-center border border-cyan-400 shrink-0 z-20 shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
               </div>
            )}

            <img 
              src={node.image} 
              alt={node.name} 
              referrerPolicy="no-referrer" 
              className={cn(
                "w-full h-full object-contain transition-transform duration-300 relative z-10",
                isCurrent ? "scale-110 drop-shadow-[0_2px_8px_rgba(34,211,238,0.6)]" : isFinalForm ? "scale-105 group-hover:scale-115 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]" : "group-hover:scale-110 drop-shadow-md"
              )} 
              loading="lazy"
            />
          </div>
          
          <div className="flex flex-col items-center mt-2 space-y-0.5 max-w-[100px]">
             <span className={cn(
               "text-[9.5px] sm:text-xs font-black uppercase tracking-wider transition-colors w-full text-center truncate",
               isCurrent 
                 ? isLightMode ? "text-cyan-700 font-extrabold" : "text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]" 
                 : isFinalForm
                   ? isLightMode ? "text-amber-800 font-extrabold group-hover:text-amber-600" : "text-amber-300 font-black group-hover:text-amber-200 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                   : inActivePath 
                     ? isLightMode ? "text-cyan-800" : "text-cyan-400 group-hover:text-cyan-300" 
                     : isLightMode ? "text-slate-700 group-hover:text-cyan-700" : "text-slate-300 group-hover:text-cyan-300"
             )}>
               {node.name.replace(/-/g, ' ')}
             </span>
             {isCurrent && (
               <div className="flex items-center gap-1 text-cyan-500 mt-0.5">
                 <Database className="w-2.5 h-2.5" />
                 <span className="text-[6.5px] sm:text-[7.5px] font-mono tracking-widest font-black uppercase">Current</span>
               </div>
             )}
          </div>
        </button>
      </motion.div>

      {/* Children Branches */}
      {hasChildren && (
        <div className="flex flex-col gap-5 sm:gap-6 justify-center shrink-0 my-auto">
          {node.evolves_to.map((child, idx) => {
            const childInPath = currentPokemonName ? doesNodeLeadTo(child, currentPokemonName) : false;
            
            return (
              <div key={`${child.id || child.name || idx}-${idx}`} className="flex flex-row items-center justify-center shrink-0 my-auto">
                {/* Method & Connector Arrow to Child */}
                <div className="flex flex-col items-center justify-center min-w-[100px] sm:min-w-[140px] max-w-[170px] px-1 sm:px-2 relative shrink-0 z-10 my-auto">
                  
                  {/* Glowing Pill Badge (Exact user screenshot style: LV. 16) */}
                  <div className={cn(
                    "mb-2 px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-mono font-black tracking-widest uppercase text-center transition-all duration-300 z-20 max-w-full truncate shadow-md border",
                    isLightMode
                      ? "bg-white/95 text-cyan-900 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                      : "bg-[#061423]/95 text-cyan-300 border-cyan-400/90 shadow-[0_0_12px_rgba(34,211,238,0.5)] ring-1 ring-cyan-400/40"
                  )}>
                    {formatMethodLabel(child.min_details)}
                  </div>

                  {/* Horizontal Connector Line + Glowing Arrow Button */}
                  <div className="relative w-full flex items-center justify-center h-6">
                    {/* Blue Glowing Connector Bar */}
                    <div className={cn(
                      "absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full",
                      childInPath
                        ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.95)]"
                        : isLightMode
                          ? "bg-gradient-to-r from-cyan-400 to-blue-500 shadow-sm"
                          : "bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]"
                    )} />

                    {/* Glowing Blue Circle Arrow Icon (Matching image) */}
                    <div className={cn(
                      "relative z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 border border-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.85)]",
                      childInPath
                        ? "bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 scale-110"
                        : "bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400"
                    )}>
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 stroke-[3.5]" />
                    </div>
                  </div>
                </div>

                {/* Recursive Child Node */}
                <EvolutionNodeComponent 
                  node={child} 
                  depth={depth + 1} 
                  currentPokemonName={currentPokemonName} 
                  onSearch={onSearch} 
                  isLightMode={isLightMode}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
