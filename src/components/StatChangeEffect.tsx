import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface StatChangeEffectProps {
  id: number;
  type: 'boost' | 'lower';
  onComplete: (id: number) => void;
}

export const StatChangeEffect: React.FC<StatChangeEffectProps> = ({ id, type, onComplete }) => {
  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => onComplete(id)}
    >
      <motion.div
        className={cn(
          "relative w-32 h-32 rounded-full border-4",
          type === 'boost' ? "border-emerald-400/50" : "border-rose-400/50"
        )}
        animate={{
          rotate: type === 'boost' ? 360 : -360,
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          rotate: { duration: 1.5, ease: "linear", repeat: Infinity },
          scale: { duration: 0.75, ease: "easeInOut", repeat: 1 },
        }}
      >
        <div className={cn(
          "absolute -top-2 left-1/2 w-4 h-4 rounded-full",
          type === 'boost' ? "bg-emerald-300" : "bg-rose-300"
        )} />
      </motion.div>
    </motion.div>
  );
};
