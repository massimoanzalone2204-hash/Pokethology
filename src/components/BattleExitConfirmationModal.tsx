import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';
import { sounds } from '../lib/sounds';
import { playHaptic } from '../lib/utils';

interface BattleExitConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const BattleExitConfirmationModal: React.FC<BattleExitConfirmationModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[140] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto custom-scrollbar optimize-scrolling"
      >
        <motion.div
          initial={{ scale: 0.92, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 15 }}
          className="bg-slate-900 border-2 border-red-500/60 rounded-2xl w-full max-w-sm overflow-hidden shadow-[0_0_40px_rgba(239,68,68,0.25)] p-5 sm:p-6 flex flex-col gap-5 relative my-auto mx-auto"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-red-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex flex-col items-center gap-3 text-center border-b border-red-950/40 pb-4">
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-full text-red-400">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-sm sm:text-base font-hud text-red-400 font-black uppercase tracking-[0.15em] mt-1">
              ABORT COMBAT SIMULATION?
            </h2>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              Active simulation protocol will be terminated immediately. Tactical battle progression and recorded telemetry logs will be forfeit.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onCancel();
                sounds.scan(); playHaptic('light');
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-hud font-bold text-xs uppercase tracking-wider transition-all border border-slate-700 cursor-pointer text-center"
            >
              Resume
            </button>
            <button
              onClick={() => {
                onConfirm();
                sounds.faint(); playHaptic('heavy');
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-hud font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] border border-red-400 cursor-pointer text-center"
            >
              Forfeit
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
