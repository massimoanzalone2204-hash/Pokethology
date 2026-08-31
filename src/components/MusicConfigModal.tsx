import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, X, Trophy } from 'lucide-react';
import { AudioSettings } from './AudioSettings';
import { getCurrentSeasonStats } from '../utils/seasonHistory';
import { sounds } from '../lib/sounds';
import { playHaptic } from '../lib/utils';

interface MusicConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMissionModal?: () => void;
  onOpenHistorical?: () => void;
}

export const MusicConfigModal: React.FC<MusicConfigModalProps> = ({
  isOpen,
  onClose,
  onOpenMissionModal,
  onOpenHistorical,
}) => {
  if (!isOpen) return null;

  const currentStats = getCurrentSeasonStats();
  const { rank } = currentStats.scores;

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
              <Settings2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 filter drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
            </div>
            <div>
              <h2 className="font-hud font-black text-base sm:text-xl text-cyan-300 uppercase tracking-widest leading-none">
                COMBAT OPTIONS
              </h2>
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
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar optimize-scrolling p-3.5 sm:p-8 max-w-4xl mx-auto w-full flex flex-col gap-4 sm:gap-5">
          {/* Quick Access Registry & Missions */}
          <div className="flex flex-col gap-2 w-full">
            {onOpenHistorical && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose();
                  onOpenHistorical();
                  try { sounds.scan(); playHaptic('light'); } catch (_) {}
                }}
                className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-950/60 hover:bg-slate-950/90 border border-cyan-900/40 hover:border-cyan-500/50 rounded-xl transition-all group w-full cursor-pointer gap-2"
              >
                <div className="flex items-center gap-2.5 text-cyan-400 min-w-0 flex-1">
                  <img 
                    src={rank.badgeUrl} 
                    alt={rank.badgeName} 
                    className="w-5 h-5 shrink-0 object-contain rendering-pixelated group-hover:scale-110 transition-transform drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]"
                  />
                  <div className="flex flex-col text-left min-w-0 flex-1">
                    <span className="font-hud text-[9px] sm:text-[10px] font-bold uppercase tracking-widest truncate">
                      {rank.badgeName} Rank
                    </span>
                    <span className="text-[7.5px] sm:text-[8.5px] font-mono text-slate-400 leading-tight truncate">
                      {currentStats.scores.averageScore}% Rating • Season Archives
                    </span>
                  </div>
                </div>
                <span className="text-[7.5px] sm:text-[8.5px] font-mono text-cyan-500 group-hover:text-cyan-300 uppercase tracking-widest shrink-0 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-900/50">
                  Archives
                </span>
              </motion.button>
            )}

            {onOpenMissionModal && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose();
                  onOpenMissionModal();
                  try { sounds.scan(); playHaptic('light'); } catch (_) {}
                }}
                className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-950/60 hover:bg-slate-950/90 border border-cyan-900/40 hover:border-cyan-500/50 rounded-xl transition-all group w-full cursor-pointer gap-2"
              >
                <div className="flex items-center gap-2.5 text-cyan-400 min-w-0 flex-1">
                  <Trophy className="w-5 h-5 shrink-0 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col text-left min-w-0 flex-1">
                    <span className="font-hud text-[9px] sm:text-[10px] font-bold uppercase tracking-widest truncate">
                      Pokéthology Missions
                    </span>
                    <span className="text-[7.5px] sm:text-[8.5px] font-mono text-slate-400 leading-tight truncate">
                      Type Mastery & Dex Conquest
                    </span>
                  </div>
                </div>
                <span className="text-[7.5px] sm:text-[8.5px] font-mono text-cyan-500 group-hover:text-cyan-300 uppercase tracking-widest shrink-0 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-900/50">
                  Open
                </span>
              </motion.button>
            )}
          </div>

          <div className="bg-slate-900/50 rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
            <AudioSettings />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
