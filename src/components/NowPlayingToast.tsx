import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music } from 'lucide-react';
import { sounds, POKE_CHILL_TRACKS } from '../lib/sounds';

export function NowPlayingToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let lastTrackId: string | null = null;
    let wasPlaying = false;

    const interval = setInterval(() => {
      const state = sounds.getBGMState();
      
      if (!state) return;

      const isPlaying = state.isPlaying;
      const trackId = state.trackId;

      // Trigger if track changed OR if it went from paused to playing
      if ((trackId && trackId !== lastTrackId) || (isPlaying && !wasPlaying)) {
        const track = POKE_CHILL_TRACKS.find(t => t.id === trackId);
        if (track) {
          setCurrentTrack(track);
          setIsVisible(true);
          
          if (timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            setIsVisible(false);
          }, 5000); // 5 seconds as requested
        }
      }

      lastTrackId = trackId;
      wasPlaying = isPlaying;
    }, 1000);

    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && currentTrack && (
        <motion.div
          initial={{ opacity: 0, x: 50, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 50, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed top-6 right-6 z-[9999] pointer-events-none"
        >
          <div className="bg-slate-950/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 flex items-center p-2.5 pr-5 gap-3 max-w-[280px] backdrop-blur-md">
            {/* Album Cover */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg shadow-black">
              <img 
                src="https://f4.bcbits.com/img/a4164358298_10.jpg" 
                alt="Poké & Chill Album Cover" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              {/* Music Bar Overlay */}
              <div className="absolute bottom-1 left-1 right-1 flex justify-center items-end gap-[2px] h-3">
                <div className="w-[2px] bg-emerald-400 rounded-sm animate-[music-bar_1s_ease-in-out_infinite]" style={{ height: '40%' }} />
                <div className="w-[2px] bg-emerald-400 rounded-sm animate-[music-bar_1.2s_ease-in-out_infinite_0.2s]" style={{ height: '80%' }} />
                <div className="w-[2px] bg-emerald-400 rounded-sm animate-[music-bar_0.8s_ease-in-out_infinite_0.4s]" style={{ height: '60%' }} />
                <div className="w-[2px] bg-emerald-400 rounded-sm animate-[music-bar_1.1s_ease-in-out_infinite_0.1s]" style={{ height: '100%' }} />
              </div>
            </div>
            
            {/* Track Info */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[8px] font-mono font-bold text-emerald-500/80 uppercase tracking-widest truncate">
                  Now Playing
                </span>
              </div>
              <span className="text-xs font-hud uppercase font-black text-emerald-400 tracking-wider truncate drop-shadow-sm w-full">
                {currentTrack.name}
              </span>
              <span className="text-[9px] text-slate-400 font-mono mt-0.5 truncate">
                Mikel & GameChops
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
