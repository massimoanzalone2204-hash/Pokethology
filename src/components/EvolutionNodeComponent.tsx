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
}

const doesNodeLeadTo = (node: EvolutionNode, targetName: string): boolean => {
  if (node.name === targetName) return true;
  if (!node.evolves_to) return false;
  return node.evolves_to.some(child => doesNodeLeadTo(child, targetName));
};

export const EvolutionNodeComponent = memo(({ 
  node, 
  depth = 0, 
  currentPokemonName, 
  onSearch 
}: EvolutionNodeComponentProps) => {
  const hasChildren = node.evolves_to && node.evolves_to.length > 0;
  const isCurrent = node.name === currentPokemonName;
  const inActivePath = currentPokemonName ? doesNodeLeadTo(node, currentPokemonName) : false;
  
  return (
    <div className="flex flex-row items-center justify-start py-2 shrink-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: depth * 0.1 }}
        className="flex flex-col items-center shrink-0"
      >
        <button 
          type="button"
          onClick={() => onSearch(node.name)}
          className="flex flex-col items-center group cursor-pointer w-20 sm:w-28 focus:outline-none relative"
        >
          {/* Detailed Circular Backdrop */}
          <div className={cn(
            "w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-2 rounded-full transition-all duration-300 relative",
            isCurrent 
              ? "bg-gradient-to-b from-cyan-500/20 to-blue-900/40 ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]" 
              : inActivePath 
                ? "bg-gradient-to-b from-cyan-900/40 to-slate-800/80 ring-1 ring-cyan-700/50 group-hover:bg-cyan-900/60 group-hover:ring-cyan-500/50 shadow-lg backdrop-blur-sm"
                : "bg-gradient-to-b from-slate-800/80 to-slate-900/90 ring-1 ring-slate-700/80 group-hover:bg-slate-800 group-hover:ring-cyan-500/50 shadow-lg backdrop-blur-sm"
          )}>
            {/* Inner tech ring */}
            <div className={cn(
               "absolute inset-1 rounded-full border border-dashed opacity-30 transition-all duration-500",
               isCurrent ? "border-cyan-300 rotate-180" : inActivePath ? "border-cyan-500/50" : "border-slate-500 group-hover:border-cyan-500/50 group-hover:rotate-45"
            )} />

            {/* Micro data point */}
            {isCurrent && (
               <div className="absolute -top-1 -right-1 w-3 h-3 bg-slate-900 rounded-full flex items-center justify-center border border-cyan-500 shrink-0 z-20">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
               </div>
            )}

            <img 
              src={node.image} 
              alt={node.name} 
              referrerPolicy="no-referrer" 
              className={cn(
                "w-full h-full object-contain transition-transform duration-300 relative z-10",
                isCurrent ? "scale-110 drop-shadow-[0_2px_5px_rgba(34,211,238,0.5)]" : "group-hover:scale-110 drop-shadow-md"
              )} 
              loading="lazy"
            />
          </div>
          
          <div className="flex flex-col items-center mt-2.5 space-y-0.5">
             <span className={cn(
               "text-[9px] sm:text-xs font-bold uppercase tracking-widest transition-colors w-full text-center truncate",
               isCurrent ? "text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.6)]" : inActivePath ? "text-cyan-500/80 group-hover:text-cyan-400" : "text-slate-300 group-hover:text-cyan-300"
             )}>
               {node.name.replace('-', ' ')}
             </span>
             {isCurrent && (
               <div className="flex items-center gap-1 text-cyan-600 mt-0.5">
                 <Database className="w-2.5 h-2.5" />
                 <span className="text-[6px] sm:text-[7px] font-mono tracking-widest font-black uppercase">Active</span>
               </div>
             )}
          </div>
        </button>
      </motion.div>

      {hasChildren && (
        <div className="flex flex-row items-center shrink-0">
          <div className="relative flex items-center justify-center w-8 sm:w-16 shrink-0 z-0">
             {/* Base line */}
             <div className="absolute w-full h-[2px] bg-gradient-to-r from-slate-700 to-slate-800" />
             
             {/* Active Path line (Solid) */}
             {!isCurrent && inActivePath && (
               <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-cyan-600 to-cyan-900 origin-left" />
             )}
             
             {/* Animated path if it's the current pokemon */}
             {isCurrent && (
               <>
                 <div className="absolute w-full h-[2px] bg-gradient-to-r from-cyan-500/30 to-blue-500/10" />
                 <motion.div 
                   className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent origin-left"
                   animate={{ 
                     x: ["-100%", "100%"],
                     opacity: [0, 1, 0]
                   }}
                   transition={{ 
                     duration: 1.5, 
                     repeat: Infinity, 
                     ease: "easeInOut" 
                   }}
                 />
               </>
             )}

             <ChevronRight className={cn(
               "w-4 h-4 sm:w-6 sm:h-6 shrink-0 z-10 translate-x-4 sm:translate-x-8 rounded-full transition-colors",
               isCurrent ? "text-cyan-300 bg-slate-900 border border-cyan-500/50 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" :
               inActivePath ? "text-cyan-600 bg-slate-900" : "text-slate-500 bg-slate-900"
             )} />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 pl-4 sm:pl-6">
            {node.evolves_to.map((child, idx) => (
              <EvolutionNodeComponent 
                key={`${child.id || child.name || idx}-${idx}`}
                node={child} 
                depth={depth + 1} 
                currentPokemonName={currentPokemonName} 
                onSearch={onSearch} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
