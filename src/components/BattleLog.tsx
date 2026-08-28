import React, { memo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Shield, Swords, Flame, Info, Target, TrendingUp, TrendingDown, AlertTriangle, Skull, Activity, Crosshair, Loader2 } from 'lucide-react';
import { LogEntry } from '../types';
import { cn } from '../lib/utils';

export const BattleLog = memo(({ log, enableAnimations, turn, isBattling }: { log: (LogEntry & { turn?: number })[]; enableAnimations: boolean; turn: string; isBattling: boolean }) => {
    const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log.length, isBattling, turn]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      ref={logRef} 
      className="bg-slate-900/30 backdrop-blur-md rounded-xl p-3 sm:p-4 h-32 sm:h-40 md:h-48 overflow-y-auto custom-scrollbar optimize-scrolling font-mono text-[10px] sm:text-[11px] sm:leading-relaxed font-bold tracking-wider space-y-1 sm:space-y-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] shrink-0 pointer-events-auto scroll-smooth" 
      style={{ overflowAnchor: 'none' }}
    >
      {log.slice(-50).map((entry, i) => {
        const isLatest = i === log.length - 1;
        let colorClass = "text-slate-400 border-slate-800 bg-slate-900/40";
        let Icon = Info;

        if (entry.type === 'player') { 
          colorClass = "text-cyan-400 border-cyan-500/30 bg-cyan-950/40 shadow-[0_0_10px_rgba(34,211,238,0.1)]"; 
          Icon = Swords; 
        }
        else if (entry.type === 'opponent') { 
          colorClass = "text-red-400 border-red-500/30 bg-red-950/40 shadow-[0_0_10px_rgba(248,113,113,0.1)]"; 
          Icon = Swords; 
        }
        else if (entry.type === 'critical') { 
          colorClass = "text-yellow-400 border-yellow-500/50 bg-yellow-950/40 font-bold italic"; 
          Icon = Zap; 
        }
        else if (entry.type === 'effective') { 
          colorClass = "text-green-400 border-green-500/30 bg-green-950/40"; 
          Icon = Target; 
        }
        else if (entry.type === 'not-effective') { 
          colorClass = "text-slate-400 border-slate-500/30 bg-slate-900/60"; 
          Icon = Shield; 
        }
        else if (entry.type === 'stat-boost') { 
          colorClass = "text-blue-400 border-blue-500/30 bg-blue-950/40"; 
          Icon = TrendingUp; 
        }
        else if (entry.type === 'stat-lower') { 
          colorClass = "text-purple-400 border-purple-500/30 bg-purple-950/40"; 
          Icon = TrendingDown; 
        }
        else if (entry.type === 'status-effect') { 
          colorClass = "text-orange-400 border-orange-500/30 bg-orange-950/40"; 
          Icon = AlertTriangle; 
        }
        else if (entry.type === 'faint') { 
          colorClass = "text-red-500 border-red-600/50 bg-red-950/60 font-bold uppercase tracking-tighter"; 
          Icon = Skull; 
        }
        else if (entry.type === 'system') { 
          colorClass = "text-white border-white/20 bg-white/5 font-bold"; 
          Icon = Activity; 
        }
        else if (entry.type === 'normal') {
          if (entry.text.includes('Damage:')) { 
            colorClass = "text-slate-400 border-slate-700/30 italic bg-slate-900/20"; 
            Icon = Crosshair; 
          }
          else if (entry.text.includes('DEFENSE') || entry.text.includes('PROTECT')) {
            Icon = Shield;
          }
        }

        return (
          <div 
            key={`battle-log-${entry.turn || turn}-${entry.type || ''}-${i}`} 
            className={cn(
              "border rounded-lg px-2 py-1.5 flex items-center gap-2 transition-all duration-300",
              enableAnimations && !isLatest && "animate-in fade-in slide-in-from-left-1",
              isLatest && "ring-1 ring-white/20 scale-[1.01] bg-white/5 shadow-lg animate-pulse",
              colorClass
            )}
          >
            {entry.turn && (
              <span className="text-[7px] opacity-40 font-mono mr-1">T{entry.turn}</span>
            )}
            <div className="flex-shrink-0 p-1 rounded bg-black/30 border border-white/5">
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="flex-1 leading-tight">{entry.text}</span>
          </div>
        );
      })}
      {isBattling && turn === 'opponent' && (
        <div className="text-red-500 font-hud animate-pulse py-1.5 px-2 tracking-widest flex items-center gap-2 text-[8px] sm:text-[10px]">
          <Loader2 className="w-3 h-3 animate-spin" /> Opponent is thinking...
        </div>
      )}
    </motion.div>
  );
});

