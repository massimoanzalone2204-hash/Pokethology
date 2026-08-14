import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Move } from '../types';
import { cn } from '../lib/utils';
import { OfficialMoveBox } from './OfficialMoveBox';

interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  moves: Move[];
  onMoveClick: (move: Move) => void;
  isLightMode: boolean;
  typeColors?: Record<string, string>;
}

export const MoveModal: React.FC<MoveModalProps> = ({ isOpen, onClose, moves, onMoveClick, isLightMode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              "fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 border rounded-3xl p-5 sm:p-6 shadow-2xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col",
              isLightMode ? "bg-slate-900 border-slate-700" : "bg-slate-950/95 border-cyan-500/40"
            )}
          >
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <h2 className="text-base sm:text-lg font-hud uppercase tracking-widest text-cyan-300">
                  Select Action Move
                </h2>
              </div>
              <button 
                onClick={onClose} 
                className="p-1.5 rounded-full border border-slate-700 hover:border-cyan-400 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shadow-md flex items-center justify-center shrink-0 cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-grow custom-scrollbar">
              {moves.map((move, i) => (
                <OfficialMoveBox
                  key={`${move.name}-${i}`}
                  move={move}
                  variant="selector"
                  isLightMode={isLightMode}
                  onClick={() => onMoveClick(move)}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
