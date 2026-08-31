import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Target, Sparkles, X, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { sounds } from '../lib/sounds';

export interface DailyHubNotificationData {
  id: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'daily';
  title: string;
  missionName: string;
  progress: number;
  required: number;
  isCompleted: boolean;
  explanation?: string;
}

interface DailyHubNotificationProps {
  notification: DailyHubNotificationData | null;
  onClose: () => void;
  onOpenDailyHub?: () => void;
}

export const DailyHubNotification: React.FC<DailyHubNotificationProps> = ({
  notification,
  onClose,
  onOpenDailyHub,
}) => {
  useEffect(() => {
    if (!notification) return;

    // Play subtle audio cue
    try {
      if (notification.isCompleted) {
        sounds.success();
      } else {
        sounds.scan();
      }
    } catch (_) {}

    // Auto-dismiss strictly after 5 seconds (5000ms)
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [notification?.id, notification?.progress, notification?.isCompleted, onClose]);

  const isCompleted = notification ? (notification.isCompleted || notification.progress >= notification.required) : false;
  const percent = notification 
    ? Math.min(100, Math.max(0, Math.round((notification.progress / notification.required) * 100)))
    : 0;

  const tierColors = {
    bronze: {
      badge: "bg-amber-950/80 border-amber-500/50 text-amber-300",
      bar: "bg-gradient-to-r from-amber-500 to-amber-300"
    },
    silver: {
      badge: "bg-slate-800/90 border-cyan-400/50 text-cyan-200",
      bar: "bg-gradient-to-r from-cyan-500 to-blue-400"
    },
    gold: {
      badge: "bg-yellow-950/90 border-yellow-400/60 text-yellow-300",
      bar: "bg-gradient-to-r from-yellow-500 to-amber-300"
    },
    daily: {
      badge: "bg-cyan-950/90 border-cyan-400/50 text-cyan-300",
      bar: "bg-gradient-to-r from-cyan-400 to-emerald-400"
    }
  };

  const tierStyle = tierColors[notification?.tier || 'daily'];

  return (
    <AnimatePresence mode="wait">
      {notification && (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: -15, scale: 0.92, x: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
          exit={{ opacity: 0, y: -12, scale: 0.9, x: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed top-3 right-3 sm:top-4 sm:right-4 z-[9999] pointer-events-auto w-[255px] sm:w-[275px]"
        >
          <div 
            onClick={() => {
              if (onOpenDailyHub) {
                onOpenDailyHub();
                onClose();
              }
            }}
            className={cn(
              "relative overflow-hidden rounded-xl border p-2 sm:p-2.5 bg-slate-950/95 backdrop-blur-xl shadow-lg transition-all cursor-pointer group",
              isCompleted 
                ? "border-emerald-400/90 shadow-[0_0_15px_rgba(16,185,129,0.25)]" 
                : "border-cyan-500/70 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:border-cyan-400"
            )}
          >
            {/* Top scanning accent line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

            {/* Header row: Badge + 5s Countdown + Close */}
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "px-1.5 py-0.5 rounded border text-[8px] sm:text-[8.5px] font-hud font-black uppercase tracking-wider flex items-center gap-1 leading-none shadow-sm",
                  isCompleted 
                    ? "bg-emerald-950/90 border-emerald-400/60 text-emerald-300" 
                    : tierStyle.badge
                )}>
                  {isCompleted ? (
                    <>
                      <Sparkles className="w-2 h-2 text-emerald-400 animate-pulse" />
                      COMPLETED
                    </>
                  ) : (
                    <>
                      <Target className="w-2 h-2 text-cyan-400" />
                      {notification.tier ? `${notification.tier.toUpperCase()}` : 'DAILY'} MISSION
                    </>
                  )}
                </span>
                <span className="text-[7.5px] font-mono text-slate-400 font-semibold">
                  5s
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-0.5 rounded text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Content Row: Icon + Text Details */}
            <div className="flex items-start gap-2">
              <div className={cn(
                "w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 border shadow-sm transition-transform group-hover:scale-105",
                isCompleted 
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300" 
                  : "bg-cyan-500/20 border-cyan-400 text-cyan-300"
              )}>
                {isCompleted ? (
                  <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Target className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-hud font-black text-[10px] sm:text-[11px] text-white uppercase tracking-wider truncate leading-tight">
                  {notification.title || notification.missionName}
                </h4>
                
                {notification.explanation && (
                  <p className="text-[8.5px] sm:text-[9px] text-slate-300 font-sans leading-tight line-clamp-1 mt-0.5">
                    {notification.explanation}
                  </p>
                )}

                {/* Progress Bar & Counter */}
                <div className="mt-1 space-y-0.5">
                  <div className="flex justify-between items-center text-[8px] font-mono font-bold leading-none">
                    <span className={isCompleted ? "text-emerald-300 font-hud text-[7.5px]" : "text-cyan-300 font-hud text-[7.5px]"}>
                      {isCompleted ? 'ACHIEVED' : 'PROGRESS'}
                    </span>
                    <span className="text-white font-mono text-[8px]">
                      {notification.progress}/{notification.required} ({percent}%)
                    </span>
                  </div>

                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-700/60">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full",
                        isCompleted ? "bg-emerald-400" : tierStyle.bar
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Footer shortcut */}
            <div className="mt-1.5 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[7.5px] font-mono text-slate-400">
              <span className="flex items-center gap-0.5 text-slate-300 group-hover:text-cyan-300 transition-colors">
                <span>Open Daily Hub</span>
                <ChevronRight className="w-2 h-2 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <span className="text-slate-500">
                {isCompleted ? '+Rank XP' : '+1 Step'}
              </span>
            </div>

            {/* 5-Second Linear Countdown at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 overflow-hidden">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
                className={cn(
                  "h-full",
                  isCompleted ? "bg-emerald-400" : "bg-cyan-400"
                )}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

