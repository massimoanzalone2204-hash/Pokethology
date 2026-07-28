import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: string | number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  distance: number;
  shape: 'circle' | 'square' | 'star' | 'diamond';
}

const COLORS = [
  '#22d3ee', // Cyan
  '#38bdf8', // Sky
  '#f59e0b', // Amber
  '#34d399', // Emerald
  '#a855f7', // Purple
  '#f43f5e', // Rose
];

export const ParticleExplosion: React.FC<{ active: boolean; onComplete?: () => void }> = ({ active, onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      // Spawn 60 particles
      const newParticles: Particle[] = Array.from({ length: 60 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * 180;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const size = 4 + Math.random() * 12;
        const shapes: ('circle' | 'square' | 'star' | 'diamond')[] = ['circle', 'square', 'star', 'diamond'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        return {
          id: `${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`,
          x: 0,
          y: 0,
          color,
          size,
          angle,
          distance,
          shape,
        };
      });

      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-[150]">
      <AnimatePresence>
        {particles.map((p) => {
          const targetX = Math.cos(p.angle) * p.distance;
          const targetY = Math.sin(p.angle) * p.distance;
          const rotate = Math.random() * 720 - 360;

          return (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
              animate={{
                x: targetX,
                y: [0, targetY - 40, targetY + 120], // subtle gravity drop
                scale: [0, 1.2, 0.8, 0],
                opacity: [1, 1, 0.8, 0],
                rotate,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 1.8 + Math.random() * 0.7,
                ease: [0.1, 0.8, 0.3, 1],
              }}
              className="absolute shadow-[0_0_8px_currentColor]"
              style={{
                width: p.size,
                height: p.size,
                color: p.color,
                backgroundColor: p.shape === 'star' || p.shape === 'diamond' ? 'transparent' : p.color,
                borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'square' ? '4px' : '0px',
                clipPath: p.shape === 'star' 
                  ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                  : p.shape === 'diamond'
                  ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                  : undefined,
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};
