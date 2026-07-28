import React, { useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { TrendingUp, TrendingDown, Zap, Skull, Activity } from 'lucide-react';

interface FloatingTextProps {
  id: string | number;
  text: string;
  type: 'damage' | 'super-damage' | 'weak-damage' | 'crit-damage' | 'boost' | 'lower' | 'status' | 'effective' | 'not-effective';
  onComplete: (id: string | number) => void;
  x?: string;
  y?: string;
}

export const FloatingText: React.FC<FloatingTextProps> = memo(({ id, text, type, onComplete, x = '50%', y = '50%' }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(id);
    }, 1200);
    return () => clearTimeout(timer);
  }, [id, onComplete]);

  const getIcon = () => {
    switch (type) {
      case 'boost': return <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'lower': return <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'status': return <Zap className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'damage':
      case 'super-damage':
      case 'weak-damage':
      case 'crit-damage':
        return null;
      default: return null;
    }
  };

  const getStyle = () => {
    switch (type) {
      case 'super-damage':
        return 'text-green-400 font-bold text-2xl sm:text-4xl flex items-center gap-1 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)] font-black italic';
      case 'weak-damage':
        return 'text-red-600 font-bold text-xl sm:text-2xl flex items-center gap-1 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] font-black opacity-80';
      case 'crit-damage':
        return 'text-amber-400 font-bold text-3xl sm:text-5xl flex items-center gap-1 drop-shadow-[0_0_15px_rgba(251,191,36,0.9)] font-black italic tracking-tighter';
      case 'damage':
        return 'text-white font-bold text-2xl sm:text-3xl flex items-center gap-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] font-black';
      case 'boost':
        return 'text-green-400 font-hud text-xs sm:text-sm flex items-center gap-1';
      case 'lower':
        return 'text-red-400 font-hud text-xs sm:text-sm flex items-center gap-1';
      case 'status':
        return 'text-purple-400 font-hud text-xs sm:text-sm flex items-center gap-1';
      case 'effective':
        return 'text-amber-400 font-hud text-xs sm:text-sm italic';
      case 'not-effective':
        return 'text-slate-400 font-hud text-xs sm:text-sm italic';
      default:
        return 'text-white font-hud text-xs sm:text-sm';
    }
  };

  const isDamage = type.includes('damage');

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        y: -100, 
        scale: [0.5, 1.4, 1, 1.2],
        rotate: isDamage ? [0, -10, 10, 0] : 0
      }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      style={{ left: x, top: y }}
      className={cn(
        "absolute z-[80] pointer-events-none whitespace-nowrap -translate-x-1/2 flex items-center gap-1.5 transform-gpu will-change-transform",
        getStyle()
      )}
    >
      {getIcon()}
      <span 
        className={cn(
          isDamage && "font-black tracking-tighter"
        )}
        style={{ textShadow: isDamage ? '0 0 4px rgba(0,0,0,0.8)' : undefined }}
      >
        {isDamage ? `-${text}` : text}
      </span>
    </motion.div>
  );
});
