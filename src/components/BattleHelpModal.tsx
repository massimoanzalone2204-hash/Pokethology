import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X, Zap, Swords, Target, Shield } from 'lucide-react';
import { sounds } from '../lib/sounds';
import { playHaptic } from '../lib/utils';

interface BattleHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BattleHelpModal: React.FC<BattleHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto custom-scrollbar optimize-scrolling"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.2)] p-5 sm:p-6 flex flex-col gap-4 relative my-auto mx-auto"
        >
          <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3">
            <div className="flex items-center gap-2.5 text-cyan-400">
              <Info className="w-5 h-5" />
              <h2 className="font-hud font-black text-sm sm:text-base uppercase tracking-widest text-cyan-300">
                COMBAT PROTOCOL GUIDE
              </h2>
            </div>
            <button
              onClick={() => { onClose(); sounds.scan(); playHaptic('light'); }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-xs font-mono text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-cyan-500/20">
              <span className="font-hud text-cyan-400 font-bold uppercase tracking-wider block mb-1">Turn Mechanics & Priority</span>
              <p className="text-[11px] text-slate-400">The engine calculates turn sequence based on Speed stats, move priority brackets (+1 to +5), and status conditions (Paralysis speed cut). High speed allows you to strike first.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-cyan-500/20">
              <span className="font-hud text-cyan-400 font-bold uppercase tracking-wider block mb-1">Type Effectiveness & STAB</span>
              <p className="text-[11px] text-slate-400">Matching a move to your Pokemon's primary/secondary typing grants a 1.5x STAB (Same-Type Attack Bonus) damage amplifier on top of 2x / 4x super effective multipliers.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-cyan-500/20">
              <span className="font-hud text-cyan-400 font-bold uppercase tracking-wider block mb-1">Status Ailments</span>
              <p className="text-[11px] text-slate-400">Burn cuts Physical Attack by 50% and drains HP. Poison drains 1/8 max HP per turn. Toxic compounds each turn. Paralysis reduces speed by 50% with a 25% chance of immobility.</p>
            </div>
          </div>

          <button
            onClick={() => { onClose(); sounds.scan(); playHaptic('light'); }}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-hud font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer text-center"
          >
            Acknowledge & Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
