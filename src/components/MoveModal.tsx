import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Move } from '../types';
import { cn } from '../lib/utils';
import { TypeBadge } from './TypeBadge';

interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  moves: Move[];
  onMoveClick: (move: Move) => void;
  isLightMode: boolean;
  typeColors: Record<string, string>;
}

export const MoveModal: React.FC<MoveModalProps> = ({ isOpen, onClose, moves, onMoveClick, isLightMode, typeColors }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 border rounded-3xl p-6 shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col",
              isLightMode ? "bg-white border-slate-200" : "bg-slate-900 border-cyan-500/30"
            )}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={cn("text-xl font-hud uppercase tracking-widest", isLightMode ? "text-slate-900" : "text-cyan-400")}>Available Moves</h2>
              <button 
                onClick={onClose} 
                className={cn(
                  "p-2 rounded-full border transition-all hover:scale-105 active:scale-95 shadow-md flex items-center justify-center shrink-0",
                  isLightMode ? "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700" : "bg-slate-800/80 border-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white"
                )}
                title="Close"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
            <div className="overflow-y-auto pr-2 space-y-3 flex-grow">
              {moves.map((move, i) => (
                <button
                  key={`${move.name}-${i}`}
                  onClick={() => onMoveClick(move)}
                  className={cn(
                    "w-full p-4 rounded-xl border transition-all text-left group",
                    isLightMode ? "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-cyan-500" : "bg-slate-800/50 border-cyan-900/30 hover:bg-slate-800 hover:border-cyan-500/50"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={cn(
                      "text-sm font-hud font-bold uppercase tracking-wider group-hover:opacity-80",
                      isLightMode ? "text-slate-900" : "text-cyan-300"
                    )}>
                      {move.name.replace('-', ' ')}
                    </span>
                    <span className={cn("font-mono text-xs font-bold", isLightMode ? "text-slate-600" : "text-cyan-600")}>PP: {move.pp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TypeBadge type={move.type} size="sm" />
                    {move.power && <span className={cn("text-xs", isLightMode ? "text-slate-600" : "text-slate-400")}>PWR: {move.power}</span>}
                    {move.accuracy && <span className={cn("text-xs", isLightMode ? "text-slate-600" : "text-slate-400")}>ACC: {move.accuracy}%</span>}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
