import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bookmark, User } from 'lucide-react';
import { cn, playHaptic } from '../lib/utils';
import { TRAINER_SPRITES, TrainerSprite } from '../data/trainerSprites';
import { sounds } from '../lib/sounds';

interface AvatarSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: TrainerSprite;
  setCurrentAvatar: (avatar: TrainerSprite) => void;
}

export const AvatarSelectionModal: React.FC<AvatarSelectionModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  setCurrentAvatar,
}) => {
  const [avatarFilter, setAvatarFilter] = useState<'All' | 'Protagonist' | 'Rival' | 'Gym Leader' | 'Champion' | 'Trainer' | 'Villain'>('All');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex bg-black/90 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 25, stiffness: 250 }}
          className="m-auto w-[96vw] max-w-6xl max-h-[92vh] sm:max-h-[90vh] bg-slate-950 border-2 border-cyan-500/60 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.3)] flex flex-col my-auto relative z-10"
        >
          {/* Top Header */}
          <div className="shrink-0 p-3 sm:p-5 lg:p-6 border-b border-cyan-500/30 bg-slate-900/90 flex items-center justify-between z-20 backdrop-blur-md">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <User className="w-4 h-4 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="font-hud font-black text-sm sm:text-xl lg:text-2xl text-cyan-400 uppercase tracking-widest leading-tight">
                  SELECT YOUR IDENTITY
                </h2>
                <p className="text-[9px] sm:text-xs text-slate-400 font-mono">Choose your trainer avatar to represent you across the Pokedex & Arena</p>
              </div>
            </div>
            <button
              onClick={() => { onClose(); try { sounds.scan(); playHaptic('light'); } catch(e){} }}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Side: Avatar Details & Default Save */}
            <div className="w-full lg:w-96 p-3 sm:p-6 lg:p-8 bg-slate-950/90 border-b lg:border-b-0 lg:border-r border-cyan-900/40 flex flex-row lg:flex-col items-center justify-between lg:justify-center relative gap-3 sm:gap-6 shrink-0 z-10">
              <div className="flex flex-row lg:flex-col items-center gap-3 sm:gap-6 flex-1 min-w-0">
                {/* Avatar Image Container */}
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-44 lg:h-44 xl:w-52 xl:h-52 bg-slate-900/60 rounded-3xl flex items-center justify-center border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(34,211,238,0.2)] group shrink-0 p-2 overflow-visible">
                  <div className="absolute inset-0 rounded-3xl bg-cyan-400/5 animate-pulse" />
                  <img 
                    src={`https://play.pokemonshowdown.com/sprites/trainers/${currentAvatar.id}.png`} 
                    alt={currentAvatar.name}
                    className="w-16 h-16 sm:w-24 sm:h-24 lg:w-36 lg:h-36 xl:w-40 xl:h-40 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300 [image-rendering:pixelated]"
                  />
                </div>
                
                {/* Avatar Details */}
                <div className="flex-1 overflow-y-auto custom-scrollbar optimize-scrolling pr-1 sm:pr-2 lg:pr-3 flex flex-col max-h-[22vh] lg:max-h-none">
                  <h3 className="text-base sm:text-2xl lg:text-3xl xl:text-4xl font-hud font-black text-left lg:text-center text-cyan-300 uppercase tracking-[0.15em] mb-1 sm:mb-2 drop-shadow-lg shrink-0">
                    {currentAvatar.name}
                  </h3>
                  <div className="text-[9px] sm:text-xs lg:text-sm text-emerald-400 font-bold uppercase tracking-widest text-center mb-1.5 sm:mb-4 py-0.5 sm:py-1 px-2 sm:px-3 border border-emerald-500/30 bg-emerald-950/30 rounded-full self-start lg:self-center shrink-0">
                    {currentAvatar.role}
                  </div>

                  <p className="text-[11px] sm:text-sm lg:text-base font-serif italic text-slate-300 leading-relaxed opacity-90 text-left lg:text-center mb-1 sm:mb-4">
                    &ldquo;{currentAvatar.lore}&rdquo;
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  try {
                    localStorage.setItem('pokethology_user_avatar', currentAvatar.id);
                    sounds.scan(); playHaptic('light');
                    onClose();
                  } catch(e) {}
                }}
                className="w-full mt-1 lg:mt-auto py-2.5 sm:py-3.5 lg:py-4 px-4 sm:px-6 bg-emerald-600 hover:bg-emerald-500 text-emerald-50 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 lg:hover:-translate-y-1 text-xs sm:text-sm lg:text-base shrink-0 cursor-pointer"
              >
                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5" />
                Set as Default
              </button>
            </div>

            {/* Right Side: Grid Selection */}
            <div className="flex-1 flex flex-col h-full min-h-[300px] bg-slate-900/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none mix-blend-overlay" />
              
              <div className="p-3 sm:p-5 lg:p-5 border-b border-cyan-900/30 bg-slate-900/80 flex gap-2 sm:gap-3 overflow-x-auto hide-scrollbar shrink-0 z-10 backdrop-blur-md">
                {(['All', 'Protagonist', 'Rival', 'Gym Leader', 'Champion', 'Trainer', 'Villain'] as const).map(role => (
                  <button 
                    key={role}
                    onClick={() => { setAvatarFilter(role); try { sounds.scan(); } catch(e){} }}
                    className={cn(
                      "px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-2.5 rounded-xl border-2 whitespace-nowrap transition-all text-xs sm:text-sm lg:text-sm font-bold tracking-widest uppercase cursor-pointer", 
                      avatarFilter === role 
                        ? "bg-cyan-950 border-cyan-400 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.3)]" 
                        : "bg-slate-900/50 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-cyan-500/50"
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar optimize-scrolling p-3 sm:p-5 lg:p-6 z-10">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 lg:gap-4 pb-16">
                  {TRAINER_SPRITES.filter(t => avatarFilter === 'All' || t.role === avatarFilter).map(trainer => (
                    <button
                      key={trainer.id}
                      onClick={() => { setCurrentAvatar(trainer); try { sounds.scan(); } catch(e){} }}
                      className={cn(
                        "relative aspect-[4/4.8] rounded-xl lg:rounded-2xl border-2 transition-all duration-300 group overflow-hidden flex flex-col items-center justify-between p-2 sm:p-2.5 lg:p-3 cursor-pointer",
                        currentAvatar.id === trainer.id 
                          ? "border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.5)] bg-cyan-900/60 ring-1 ring-cyan-400/50" 
                          : "border-slate-700/40 hover:border-cyan-500/60 hover:bg-slate-800/80 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] bg-slate-900/40"
                      )}
                    >
                      <div className="w-full flex-1 flex items-center justify-center min-h-0 pt-0.5 pb-1">
                        <img 
                          src={`https://play.pokemonshowdown.com/sprites/trainers/${trainer.id}.png`} 
                          alt={trainer.name}
                          className={cn(
                            "w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain transition-all duration-300 drop-shadow-md [image-rendering:pixelated]",
                            currentAvatar.id === trainer.id ? "scale-105 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]" : "group-hover:scale-105 opacity-80 group-hover:opacity-100 group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                          )}
                        />
                      </div>
                      <div className={cn(
                        "w-full bg-slate-950/90 py-1 px-1 rounded-lg transition-opacity duration-300 border border-cyan-500/20 shrink-0",
                        currentAvatar.id === trainer.id ? "opacity-100 border-cyan-400/50 bg-cyan-950/80" : "opacity-80 group-hover:opacity-100"
                      )}>
                        <span className="block w-full text-center text-[10px] sm:text-xs font-bold text-cyan-100 truncate tracking-wider uppercase">
                          {trainer.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
