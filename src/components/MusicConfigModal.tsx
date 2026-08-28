import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, X, Trophy } from 'lucide-react';
import { AudioSettings } from './AudioSettings';
import { sounds } from '../lib/sounds';
import { playHaptic } from '../lib/utils';

interface MusicConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMissionModal?: () => void;
}

export const MusicConfigModal: React.FC<MusicConfigModalProps> = ({
  isOpen,
  onClose,
  onOpenMissionModal,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 250 }}
        className="fixed inset-0 z-[200] flex flex-col bg-slate-950/98 backdrop-blur-2xl overflow-hidden"
      >
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top System Header Bar */}
        <div className="shrink-0 flex justify-between items-center px-4 sm:px-8 py-3.5 border-b border-cyan-500/30 w-full bg-slate-900/90 z-20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
              <Music className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 filter drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
            </div>
            <div>
              <h2 className="font-hud font-black text-base sm:text-xl text-cyan-300 uppercase tracking-widest leading-none">
                AUDIO & MUSIC MATRIX
              </h2>
              <p className="text-[9px] sm:text-xs text-slate-400 font-mono mt-0.5">Configure ambient battle tracks, SFX volume & sound engine parameters</p>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              try { sounds.scan(); playHaptic('light'); } catch (_) {}
            }}
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-hud font-bold uppercase tracking-wider group shadow-sm shrink-0"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span className="hidden sm:inline">CLOSE</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar optimize-scrolling p-4 sm:p-8 max-w-4xl mx-auto w-full flex flex-col gap-6">
          <div className="bg-slate-900/60 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
            <AudioSettings />
          </div>

          {onOpenMissionModal && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-950/20 p-4 rounded-xl border border-amber-500/20">
              <div className="flex flex-col gap-1.5">
                <span className="text-amber-400 font-hud uppercase text-xs font-bold tracking-widest flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Pokethology Mission
                </span>
                <span className="text-slate-400 text-xs">Track your overall combat mastery progress.</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenMissionModal();
                }}
                className="px-6 py-2.5 rounded-xl font-hud uppercase text-[10px] font-bold tracking-widest transition-all bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] whitespace-nowrap cursor-pointer"
              >
                Personalize
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
