import React, { memo } from 'react';
import { motion } from 'motion/react';
import { EvolutionNode } from '../types';
import { cn } from '../lib/utils';
import { ChevronRight, Database } from 'lucide-react';

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

export const EvolutionNodeComponent = memo(({ 
  node, 
  depth = 0, 
  currentPokemonName, 
  onSearch,
  isLightMode = false
}: EvolutionNodeComponentProps) => {
  const hasChildren = node.evolves_to && node.evolves_to.length > 0;
  const isCurrent = node.name === currentPokemonName;
  const inActivePath = currentPokemonName ? doesNodeLeadTo(node, currentPokemonName) : false;
  
  return (
    <div className="flex flex-row items-center justify-center py-2 shrink-0 my-auto">
      {/* Node Avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: depth * 0.08, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center shrink-0 my-auto"
      >
        <button 
          type="button"
          onClick={() => onSearch(node.name)}
          className="flex flex-col items-center group cursor-pointer w-20 sm:w-28 focus:outline-none relative"
        >
          {/* Circular Backdrop */}
          <div className={cn(
            "w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-2 rounded-full transition-all duration-300 relative",
            isCurrent 
              ? "bg-gradient-to-b from-cyan-500/25 to-blue-900/40 ring-2 ring-cyan-400 shadow-[0_0_22px_rgba(34,211,238,0.45)]" 
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
               isCurrent ? "border-cyan-300 rotate-180" : inActivePath ? "border-cyan-500/50" : "border-slate-500 group-hover:border-cyan-500/50 group-hover:rotate-45"
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
                isCurrent ? "scale-110 drop-shadow-[0_2px_8px_rgba(34,211,238,0.6)]" : "group-hover:scale-110 drop-shadow-md"
              )} 
              loading="lazy"
            />
          </div>
          
          <div className="flex flex-col items-center mt-2 space-y-0.5 max-w-[100px]">
             <span className={cn(
               "text-[9.5px] sm:text-xs font-black uppercase tracking-wider transition-colors w-full text-center truncate",
               isCurrent 
                 ? isLightMode ? "text-cyan-700 font-extrabold" : "text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]" 
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
                <div className="flex flex-col items-center justify-center min-w-[85px] sm:min-w-[120px] max-w-[150px] px-1 sm:px-2 relative shrink-0 z-10 my-auto">
                  
                  {/* Evolution Method Badge */}
                  <div className={cn(
                    "mb-1.5 px-2 py-0.5 rounded-full text-[8px] sm:text-[9.5px] font-mono font-bold tracking-wider uppercase text-center shadow-sm border transition-all duration-300 z-20 max-w-full truncate",
                    childInPath
                      ? isLightMode
                        ? "bg-cyan-600 text-white border-cyan-500 shadow-[0_2px_8px_rgba(6,182,212,0.3)] font-black"
                        : "bg-cyan-950/90 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(34,211,238,0.35)]"
                      : isLightMode
                        ? "bg-slate-100 text-amber-900 border-amber-300/80 font-bold"
                        : "bg-slate-900/90 text-amber-300 border-amber-500/40"
                  )}>
                    {child.min_details || "Level Up"}
                  </div>

                  {/* Horizontal Connector Line + Arrow */}
                  <div className="relative w-full flex items-center justify-center h-4">
                    {/* Background Line */}
                    <div className={cn(
                      "absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px]",
                      isLightMode ? "bg-slate-300" : "bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700"
                    )} />
                    
                    {/* Active Path Line */}
                    {childInPath && (
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                    )}

                    {/* Chevron Arrow Icon */}
                    <div className={cn(
                      "relative z-10 p-0.5 rounded-full border transition-all duration-300",
                      childInPath
                        ? isLightMode
                          ? "bg-cyan-500 text-white border-cyan-400 shadow-md"
                          : "bg-slate-950 text-cyan-300 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                        : isLightMode
                          ? "bg-white text-slate-400 border-slate-300"
                          : "bg-slate-900 text-slate-400 border-slate-700"
                    )}>
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
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
