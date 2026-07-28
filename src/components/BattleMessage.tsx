import React, { memo } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Zap, Target, AlertTriangle, Swords } from 'lucide-react';

interface BattleMessageProps {
  message: string;
  type: 'default' | 'critical' | 'effective' | 'status' | 'move';
  onComplete: () => void;
  enableAnimations?: boolean;
  isLightMode?: boolean;
}

export const BattleMessage: React.FC<BattleMessageProps> = memo(({ message, type, enableAnimations = true }) => {

  const getStyle = () => {
    switch (type) {
      case 'critical':
        return {
          container: 'bg-red-950/95 border-red-500/80 text-red-50 shadow-[0_0_25px_rgba(239,68,68,0.5)]',
          chip: 'bg-red-900/60 border-red-500/40 text-red-200',
          icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 shrink-0 animate-pulse" />
        };
      case 'effective':
        return {
          container: 'bg-amber-950/95 border-amber-500/80 text-amber-50 shadow-[0_0_25px_rgba(245,158,11,0.5)]',
          chip: 'bg-amber-900/60 border-amber-500/40 text-amber-200',
          icon: <Target className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
        };
      case 'status':
        return {
          container: 'bg-indigo-950/95 border-indigo-500/80 text-indigo-50 shadow-[0_0_25px_rgba(99,102,241,0.5)]',
          chip: 'bg-indigo-900/60 border-indigo-500/40 text-indigo-200',
          icon: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 shrink-0" />
        };
      default:
      case 'move':
        return {
          container: 'bg-slate-900/95 border-cyan-400/80 text-cyan-50 shadow-[0_0_25px_rgba(34,211,238,0.5)]',
          chip: 'bg-slate-800/80 border-cyan-500/40 text-cyan-200',
          icon: <Swords className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" />
        };
    }
  };

  const styles = getStyle();
  const subMessages = message.split(' • ').map(s => s.trim()).filter(Boolean);
  const isMultiMessage = subMessages.length > 1;

  const totalLength = message.length;
  const getFontSizeClass = () => {
    if (isMultiMessage || totalLength > 32) {
      return 'text-[10px] sm:text-xs md:text-sm tracking-wide font-bold';
    }
    if (totalLength > 18) {
      return 'text-xs sm:text-sm md:text-base tracking-wider font-bold';
    }
    return 'text-xs sm:text-base md:text-lg lg:text-xl tracking-widest font-black';
  };

  return (
    <motion.div
      initial={enableAnimations ? { opacity: 0, scale: 0.85, y: 25, x: '-50%' } : { opacity: 1, scale: 1, y: 0, x: '-50%' }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        x: '-50%',
        transition: {
          type: 'spring',
          damping: 18,
          stiffness: 420
        }
      }}
      exit={enableAnimations ? { opacity: 0, scale: 1.05, y: -15, x: '-50%' } : { opacity: 0 }}
      className={cn(
        "absolute top-[38%] left-1/2 z-[100] px-3.5 sm:px-5 py-2 sm:py-3 rounded-2xl border-2 backdrop-blur-md pointer-events-none w-auto max-w-[92vw] sm:max-w-[85vw] md:max-w-xl lg:max-w-2xl transform-gpu flex items-center justify-center gap-2 sm:gap-3 box-border",
        styles.container
      )}
    >
      <div className="shrink-0 relative z-10 flex items-center">{styles.icon}</div>

      {isMultiMessage ? (
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-full relative z-10">
          {subMessages.map((sub, idx) => (
            <span
              key={idx}
              className={cn(
                "px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border font-hud uppercase whitespace-nowrap text-[9px] sm:text-xs font-bold leading-tight shadow-sm",
                styles.chip
              )}
            >
              {sub}
            </span>
          ))}
        </div>
      ) : (
        <span className={cn("font-hud uppercase text-center relative z-10 leading-snug break-words max-w-full whitespace-normal", getFontSizeClass())}>
          {message}
        </span>
      )}

      {/* Decorative scanline overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20 pointer-events-none rounded-2xl" />
    </motion.div>
  );
});

BattleMessage.displayName = 'BattleMessage';
