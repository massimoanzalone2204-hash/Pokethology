import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bookmark, User, Check, Sparkles, Shield, Crown, Swords, Skull, Compass, Eye, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isLoreExpanded, setIsLoreExpanded] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
        try { sounds.scan(); playHaptic('light'); } catch (_) {}
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredTrainers = useMemo(() => {
    if (avatarFilter === 'All') return TRAINER_SPRITES;
    return TRAINER_SPRITES.filter(t => t.role === avatarFilter);
  }, [avatarFilter]);

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'Champion':
        return {
          badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          icon: Crown,
        };
      case 'Gym Leader':
        return {
          badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
          icon: Shield,
        };
      case 'Protagonist':
        return {
          badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          icon: Sparkles,
        };
      case 'Rival':
        return {
          badge: "bg-orange-500/20 text-orange-300 border-orange-500/40",
          icon: Swords,
        };
      case 'Villain':
        return {
          badge: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          icon: Skull,
        };
      default:
        return {
          badge: "bg-blue-500/20 text-blue-300 border-blue-500/40",
          icon: Compass,
        };
    }
  };

  const handleSaveDefault = () => {
    try {
      localStorage.setItem('pokethology_user_avatar', currentAvatar.id);
      try { sounds.scan(); } catch (_) {}
      playHaptic('medium');
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 500);
    } catch (_) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentRoleStyle = getRoleBadgeStyle(currentAvatar.role);
  const CurrentRoleIcon = currentRoleStyle.icon;

  return (
    <AnimatePresence>
      <motion.div
        key="avatar-modal-fullscreen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] flex flex-col bg-slate-950/98 backdrop-blur-2xl overflow-hidden w-screen h-screen select-none"
      >
        {/* Ambient Holographic Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Top HUD Header Bar */}
        <div className="shrink-0 border-b border-cyan-500/30 bg-slate-900/90 px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-3 z-20 shadow-lg backdrop-blur-xl">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] shrink-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            </div>
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <h2 className="font-hud font-black text-sm sm:text-lg lg:text-xl text-cyan-300 uppercase tracking-widest leading-tight drop-shadow">
                Choose Avatar
              </h2>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                {TRAINER_SPRITES.length} ARCHIVED
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { onClose(); try { sounds.scan(); playHaptic('light'); } catch (_) {} }}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/80 hover:border-cyan-400/50 shadow-md cursor-pointer flex items-center gap-1.5"
              title="Close (Esc)"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden md:inline text-xs font-mono font-bold tracking-wider">ESC</span>
            </button>
          </div>
        </div>

        {/* Modal Body: Prominent Top Section + Lower Categories & Grid */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 w-full">
          
          {/* ========================================================================= */}
          {/* PROMINENT UPPER SPOTLIGHT SECTION (Hero Avatar Preview & Identity)        */}
          {/* ========================================================================= */}
          <div className="shrink-0 bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950/90 border-b border-cyan-500/30 p-3 sm:p-5 lg:p-6 shadow-2xl relative overflow-hidden z-10">
            {/* Cyber background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-6 relative z-10">
              
              {/* Left/Center: Large Holographic Pedestal & Big Trainer Avatar Sprite */}
              <div className="flex items-center gap-4 sm:gap-6 min-w-0 w-full md:w-auto">
                <div className="relative w-28 h-28 xxs:w-32 xxs:h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-56 lg:h-56 flex items-center justify-center shrink-0">
                  {/* Cyber glow rings */}
                  <div className="absolute inset-0 rounded-full border border-cyan-400/35 animate-spin-slow pointer-events-none" style={{ animationDuration: '20s' }} />
                  <div className="absolute inset-2 sm:inset-3 rounded-full border border-dashed border-cyan-400/25 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/25 to-transparent rounded-full blur-xl pointer-events-none" />
                  <div className="absolute -bottom-1.5 w-24 sm:w-36 md:w-44 h-4 bg-cyan-400/40 rounded-full blur-md" />

                  {/* Animated Big Trainer Sprite */}
                  <motion.img 
                    key={currentAvatar.id}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    src={`https://play.pokemonshowdown.com/sprites/trainers/${currentAvatar.id}.png`} 
                    alt={currentAvatar.name}
                    className="relative z-10 w-24 h-24 xxs:w-28 xxs:h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.95)] [image-rendering:pixelated]"
                  />
                </div>

                {/* Right Details: Name, Role Badge, Compact Lore */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 sm:gap-1.5 max-w-lg">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-hud font-black text-sm xs:text-base sm:text-xl md:text-2xl text-cyan-200 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] truncate">
                      {currentAvatar.name}
                    </h3>
                    <div className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] sm:text-[10px] font-mono font-bold uppercase tracking-wider border shrink-0 shadow-sm",
                      currentRoleStyle.badge
                    )}>
                      <CurrentRoleIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {currentAvatar.role}
                    </div>
                  </div>

                  {/* Compact Lore Quote Box with Show All / Show Less Toggle */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950/75 border border-cyan-500/25 relative overflow-hidden shadow-inner flex flex-col gap-1">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500" />
                    <p className={cn(
                      "text-[10.5px] sm:text-xs font-serif italic text-slate-300 leading-relaxed pl-1 transition-all",
                      !isLoreExpanded && "line-clamp-2"
                    )}>
                      &ldquo;{currentAvatar.lore}&rdquo;
                    </p>
                    {currentAvatar.lore && (
                      <div className="flex justify-end pl-1 mt-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsLoreExpanded(!isLoreExpanded);
                            try { sounds.scan(); playHaptic('light'); } catch (_) {}
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/70 hover:bg-cyan-900/90 border border-cyan-500/30 text-cyan-300 hover:text-cyan-100 text-[8.5px] sm:text-[9.5px] font-hud font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                        >
                          <Eye className="w-2.5 h-2.5 text-cyan-400" />
                          <span>{isLoreExpanded ? "Show Less" : "Show All"}</span>
                          {isLoreExpanded ? (
                            <ChevronUp className="w-2.5 h-2.5 text-cyan-400" />
                          ) : (
                            <ChevronDown className="w-2.5 h-2.5 text-cyan-400" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Compact Apply / Set Active Button */}
              <div className="w-full md:w-auto shrink-0 flex justify-end">
                <button
                  onClick={handleSaveDefault}
                  className={cn(
                    "w-full md:w-auto py-2 sm:py-2.5 px-4 sm:px-5 rounded-xl font-hud font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 text-[11px] sm:text-xs cursor-pointer shadow-lg active:scale-95",
                    savedSuccess
                      ? "bg-emerald-500 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.7)]"
                      : "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]"
                  )}
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                      SAVED ACTIVE AVATAR!
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      SET AS ACTIVE AVATAR
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* LOWER SECTION: Category Tabs & List of Other Avatars                      */}
          {/* ========================================================================= */}
          <div className="flex-1 flex flex-col min-h-0 bg-slate-950/60 relative overflow-hidden">
            
            {/* Category Tabs Bar (Search Bar Removed) */}
            <div className="p-2 sm:p-3 border-b border-cyan-900/40 bg-slate-900/80 shrink-0 z-10 backdrop-blur-md flex items-center justify-between overflow-x-auto hide-scrollbar">
              <div className="flex gap-1.5 sm:gap-2 mx-auto sm:mx-0 max-w-full">
                {(['All', 'Protagonist', 'Rival', 'Gym Leader', 'Champion', 'Trainer', 'Villain'] as const).map(role => {
                  const isSelected = avatarFilter === role;
                  const count = role === 'All' ? TRAINER_SPRITES.length : TRAINER_SPRITES.filter(t => t.role === role).length;
                  return (
                    <button 
                      key={role}
                      onClick={() => { 
                        setAvatarFilter(role); 
                        try { sounds.scan(); playHaptic('light'); } catch (_) {} 
                      }}
                      className={cn(
                        "px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl border whitespace-nowrap transition-all text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase cursor-pointer flex items-center gap-1.5", 
                        isSelected
                          ? "bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.3)] ring-1 ring-cyan-400/40" 
                          : "bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-cyan-500/40"
                      )}
                    >
                      <span>{role}</span>
                      <span className="text-[8px] sm:text-[9px] px-1 py-0.2 rounded bg-slate-800/80 text-slate-400 font-mono">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Expansive Responsive Trainer Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2.5 sm:p-4 lg:p-6 z-10 min-h-0">
              <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 sm:gap-3 pb-16">
                {filteredTrainers.map(trainer => {
                  const isSelected = currentAvatar.id === trainer.id;

                  return (
                    <button
                      key={trainer.id}
                      onClick={() => { 
                        setCurrentAvatar(trainer); 
                        try { sounds.scan(); playHaptic('light'); } catch (_) {} 
                      }}
                      className={cn(
                        "relative aspect-[4/4.8] rounded-xl sm:rounded-2xl border-2 transition-all duration-150 group overflow-hidden flex flex-col items-center justify-between p-1.5 sm:p-2.5 cursor-pointer text-left",
                        isSelected 
                          ? "border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.45)] bg-gradient-to-b from-cyan-950/80 to-slate-900/90 ring-2 ring-cyan-400/50 scale-[1.02]" 
                          : "border-slate-800/80 hover:border-cyan-500/60 hover:bg-slate-900/70 hover:shadow-[0_0_12px_rgba(34,211,238,0.2)] bg-slate-950/60"
                      )}
                    >
                      {/* Active Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-md z-20">
                          <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Trainer Sprite Container */}
                      <div className="w-full flex-1 flex items-center justify-center min-h-0 py-0.5">
                        <img 
                          src={`https://play.pokemonshowdown.com/sprites/trainers/${trainer.id}.png`} 
                          alt={trainer.name}
                          loading="lazy"
                          className={cn(
                            "w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain transition-all duration-200 drop-shadow-md [image-rendering:pixelated]",
                            isSelected ? "scale-110 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" : "group-hover:scale-105 opacity-85 group-hover:opacity-100"
                          )}
                        />
                      </div>

                      {/* Name & Role Tag */}
                      <div className={cn(
                        "w-full py-1 px-1 rounded-lg sm:rounded-xl transition-all duration-200 border shrink-0 text-center",
                        isSelected 
                          ? "bg-cyan-950 border-cyan-400/60" 
                          : "bg-slate-900/90 border-slate-800 group-hover:border-cyan-500/30"
                      )}>
                        <span className={cn(
                          "block text-[9.5px] sm:text-[11px] font-hud font-bold truncate tracking-wider uppercase leading-tight",
                          isSelected ? "text-cyan-200" : "text-slate-300 group-hover:text-cyan-100"
                        )}>
                          {trainer.name}
                        </span>
                        <span className="block text-[7.5px] sm:text-[8.5px] font-mono text-slate-500 uppercase tracking-widest truncate leading-tight mt-0.5">
                          {trainer.role}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
