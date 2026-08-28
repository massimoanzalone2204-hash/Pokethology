import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Sparkles, Check } from 'lucide-react';
import { sounds } from '../lib/sounds';
import { playHaptic } from '../lib/utils';

interface MissionCelebrationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  dailyStreak: number;
  missionName?: string;
  missionRequirementText?: string;
}

export const MissionCelebrationOverlay: React.FC<MissionCelebrationOverlayProps> = ({
  isOpen,
  onClose,
  dailyStreak,
  missionName,
  missionRequirementText,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
        onClick={() => {
          onClose();
          try { sounds.scan(); playHaptic('light'); } catch (_) {}
        }}
      >
        <motion.div
          initial={{ scale: 0.8, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 30 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative max-w-md w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-amber-400/80 rounded-3xl p-8 text-center shadow-[0_0_80px_rgba(251,191,36,0.4)] overflow-hidden flex flex-col items-center gap-6"
          onClick={e => e.stopPropagation()}
        >
          {/* Ambient Glows */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="absolute inset-0 -m-4 border border-dashed border-amber-400/30 rounded-full"
            />
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.6)] border-2 border-yellow-200">
              <Trophy className="w-12 h-12 text-slate-950 fill-slate-950" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              MISSION ACCOMPLISHED
            </div>
            <h3 className="font-hud font-black text-2xl sm:text-3xl text-yellow-300 uppercase tracking-widest drop-shadow-md">
              DAILY PROTOCOL COMPLETE!
            </h3>
            {missionName && (
              <p className="text-sm font-mono text-slate-300 mt-1 font-bold">
                {missionName}
              </p>
            )}
            {missionRequirementText && (
              <p className="text-xs font-mono text-slate-400 max-w-xs mx-auto">
                {missionRequirementText}
              </p>
            )}
          </div>

          <div className="w-full bg-slate-900/80 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-around">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">DAILY STREAK</span>
              <span className="text-xl font-hud font-black text-amber-400 flex items-center gap-1">
                🔥 {dailyStreak} DAYS
              </span>
            </div>
            <div className="w-[1px] h-8 bg-amber-500/20" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">REWARD</span>
              <span className="text-xl font-hud font-black text-emerald-400 flex items-center gap-1">
                +100 EXP
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              try { sounds.scan(); playHaptic('light'); } catch (_) {}
            }}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-hud font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-[0_0_25px_rgba(245,158,11,0.5)] cursor-pointer"
          >
            CLAIM VICTORY & CLOSE
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
