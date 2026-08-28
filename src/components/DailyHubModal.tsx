import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, X } from 'lucide-react';
import { PokethologyCombatMissionWidget } from './PokethologyCombatMissionWidget';
import { sounds } from '../lib/sounds';
import { playHaptic } from '../lib/utils';

interface DailyHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  today: string;
  isMissionCompleted: boolean;
  missionProgressCount: number;
  missionRequiredCount: number;
  dailyStreak: number;
}

export const DailyHubModal: React.FC<DailyHubModalProps> = ({
  isOpen,
  onClose,
  today,
  isMissionCompleted,
  missionProgressCount,
  missionRequiredCount,
  dailyStreak,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="daily-hub-modal"
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
        <div className="shrink-0 border-b border-cyan-500/30 bg-slate-900/90 px-4 sm:px-8 py-3 flex items-center justify-between gap-3 z-20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 filter drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
            </div>
            <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
              <h2 className="font-hud font-black text-base sm:text-xl text-cyan-300 uppercase tracking-widest leading-none whitespace-nowrap">
                DAILY HUB
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-[10px] sm:text-xs font-mono font-bold whitespace-nowrap shadow-sm">
                {today}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              try { sounds.scan(); playHaptic('light'); } catch (_) {}
            }}
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-hud font-bold uppercase tracking-wider group shadow-sm shrink-0"
            title="Close (Esc)"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span className="hidden sm:inline">CLOSE</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar optimize-scrolling p-3.5 sm:p-6 md:p-8 max-w-5xl mx-auto w-full flex flex-col">
          <PokethologyCombatMissionWidget 
            todayStr={today} 
            isCompleted={isMissionCompleted} 
            missionProgressCount={missionProgressCount}
            missionRequiredCount={missionRequiredCount}
            dailyStreak={dailyStreak}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
