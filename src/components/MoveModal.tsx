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
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-hud text-cyan-400 uppercase tracking-widest">Available Moves</h2>
              <button 
                onClick={onClose} 
                className="p-2 rounded-full bg-slate-800/80 border border-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-md flex items-center justify-center shrink-0"
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
                  className="w-full p-4 rounded-xl border border-cyan-900/30 bg-slate-800/50 hover:bg-slate-800 hover:border-cyan-500/50 transition-all text-left group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-hud font-bold text-cyan-300 uppercase tracking-wider group-hover:text-white">
                      {move.name.replace('-', ' ')}
                    </span>
                    <span className="font-mono text-xs font-bold text-cyan-600">PP: {move.pp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TypeBadge type={move.type} size="sm" />
                    {move.power && <span className="text-xs text-slate-400">PWR: {move.power}</span>}
                    {move.accuracy && <span className="text-xs text-slate-400">ACC: {move.accuracy}%</span>}
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
