import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Sun, Moon, Sparkles, Download, BookOpen, Instagram, Github, RotateCcw } from 'lucide-react';
import { AudioSettings } from './AudioSettings';
import { getCurrentSeasonStats } from '../utils/seasonHistory';
import { sounds } from '../lib/sounds';
import { playHaptic, cn } from '../lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLightMode: boolean;
  handleThemeToggle: () => void;
  deferredPrompt: any;
  isInstallable: boolean;
  handleInstallPWA: () => void;
  setIsTutorialOpen: (open: boolean) => void;
  handleSystemRestart: () => void;
  isRebooting: boolean;
  onOpenHistorical?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isLightMode,
  handleThemeToggle,
  deferredPrompt,
  isInstallable,
  handleInstallPWA,
  setIsTutorialOpen,
  handleSystemRestart,
  isRebooting,
  onOpenHistorical,
}) => {
  if (!isOpen) return null;

  const currentStats = getCurrentSeasonStats();
  const { rank } = currentStats.scores;

  return (
    <AnimatePresence>
        {isOpen && (
            <motion.div
              key="settings-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed inset-0  z-[200] flex flex-col bg-slate-950/98 backdrop-blur-2xl overflow-hidden"
            >
              {/* Ambient Glows */}
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Top Header Bar */}
              <div className="shrink-0 border-b border-cyan-500/30 bg-slate-900/90 px-4 sm:px-8 py-3 flex items-center justify-between gap-3 z-20 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 animate-spin-slow" style={{ animationDuration: '10s' }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-hud font-black text-base sm:text-xl text-cyan-300 uppercase tracking-widest leading-none">
                      SETTINGS
                    </h2>
                  </div>
                </div>

                <button 
                  onClick={() => { onClose(); sounds.scan(); playHaptic('light'); }} 
                  className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-hud font-bold uppercase tracking-wider group shadow-sm shrink-0"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                  <span className="hidden sm:inline">CLOSE</span>
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar optimize-scrolling p-4 sm:p-6 md:p-8 max-w-2xl mx-auto w-full flex flex-col gap-5">
                {/* Audio & Visuals Settings */}
                <div className="flex flex-col gap-4 w-full">
                  <span className="text-[10px] font-hud font-black text-cyan-400 uppercase tracking-widest block mb-1">
                    AUDIO & DISPLAY CONTROLS
                  </span>
                  
                  <AudioSettings mode="simple" />

                  {/* Theme Toggle Selector */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 ">
                    <div className="flex flex-col text-center sm:text-left">
                      <span className="text-cyan-300 font-hud uppercase text-xs font-bold tracking-widest">Interface Theme</span>
                      <span className="text-[10px] font-mono text-slate-400">Toggle dark / light display mode</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleThemeToggle}
                      className="relative w-14 h-7 rounded-full bg-slate-950 border border-slate-700/80 transition-colors focus:outline-none cursor-pointer"
                    >
                      <motion.div 
                        initial={false}
                        animate={{ x: isLightMode ? 28 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={cn(
                          "absolute top-1 w-5 h-5 rounded-full flex items-center justify-center left-1 shadow-md",
                          isLightMode ? "bg-amber-500 text-slate-950" : "bg-slate-500 text-white"
                        )}
                      >
                        {isLightMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3 text-slate-900" /> }
                      </motion.div>
                    </motion.button>
                  </div>
                </div>

                {/* Registry & Utilities */}
                <div className="flex flex-col gap-4 w-full">
                  <span className="text-[10px] font-hud font-black text-cyan-400 uppercase tracking-widest block mb-1">
                    REGISTRY & COMMUNITY UTILITIES
                  </span>
                  
                  <div className="flex flex-col gap-2.5">
                    {onOpenHistorical && (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onClose();
                          onOpenHistorical();
                          sounds.scan(); playHaptic('light');
                        }}
                        className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-950/60 hover:bg-slate-950/90 border border-cyan-900/40 hover:border-cyan-500/50 rounded-xl transition-all group w-full cursor-pointer gap-2"
                      >
                        <div className="flex items-center gap-2.5 text-cyan-400 min-w-0 flex-1">
                          <img 
                            src={rank.badgeUrl} 
                            alt={rank.badgeName} 
                            className="w-5 h-5 shrink-0 object-contain rendering-pixelated group-hover:scale-110 transition-transform drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]"
                          />
                          <div className="flex flex-col text-left min-w-0 flex-1">
                            <span className="font-hud text-[9px] sm:text-[10px] font-bold uppercase tracking-widest truncate">
                              {rank.badgeName} Rank
                            </span>
                            <span className="text-[7.5px] sm:text-[8.5px] font-mono text-slate-400 leading-tight truncate">
                              {currentStats.scores.averageScore}% Rating • Season Archives
                            </span>
                          </div>
                        </div>
                        <span className="text-[7.5px] sm:text-[8.5px] font-mono text-cyan-500 group-hover:text-cyan-300 uppercase tracking-widest shrink-0 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-900/50">
                          Archives
                        </span>
                      </motion.button>
                    )}

                    {isInstallable && (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleInstallPWA();
                          sounds.scan(); playHaptic('light');
                        }}
                        className="flex items-center justify-between p-3.5 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/50 hover:border-cyan-400 rounded-xl transition-all group w-full text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)] cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Download className="w-4 h-4 shrink-0 text-cyan-400 group-hover:scale-110 transition-transform animate-bounce" />
                          <div className="flex flex-col text-left">
                            <span className="font-hud text-[9px] sm:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Install App (PWA)</span>
                            <span className="text-[8px] sm:text-[9px] font-mono text-cyan-400/80 leading-none mt-0.5">Install Pokethology locally on your device</span>
                          </div>
                        </div>
                        <span className="text-[8px] font-mono text-cyan-300 group-hover:text-white uppercase tracking-widest bg-cyan-900/60 px-2.5 py-1 rounded border border-cyan-500/40">
                          Install
                        </span>
                      </motion.button>
                    )}

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onClose();
                        setIsTutorialOpen(true);
                        sounds.scan(); playHaptic('light');
                      }}
                      className="flex items-center justify-between p-3.5 bg-slate-950/60 hover:bg-slate-950/90 border border-cyan-900/40 hover:border-cyan-500/50 rounded-xl transition-all group w-full cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 text-cyan-400">
                        <BookOpen className="w-4 h-4 shrink-0 text-cyan-400 group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col text-left">
                          <span className="font-hud text-[9px] sm:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Tutorial</span>
                          <span className="text-[8px] sm:text-[9px] font-mono text-slate-400 leading-none mt-0.5">Guided walkthrough of controls & HUD features</span>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono text-cyan-500 group-hover:text-cyan-300 uppercase tracking-widest">
                        Open
                      </span>
                    </motion.button>

                    <a
                      href="https://www.instagram.com/__.pokethology.__?igsh=YjZrejluMDd5dHoz"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sounds.scan()}
                      className="flex items-center justify-between p-3.5 bg-gradient-to-r from-purple-950/40 via-pink-950/40 to-slate-950/40 hover:from-purple-900/60 hover:to-slate-900/80 border border-pink-500/30 hover:border-pink-400/60 rounded-xl transition-all group w-full text-pink-400 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Instagram className="w-4 h-4 shrink-0 text-pink-400 group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col text-left">
                          <span className="font-hud text-[9px] sm:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Instagram</span>
                          <span className="text-[8px] sm:text-[9px] font-mono text-pink-300/70 leading-none mt-0.5">Follow @__.pokethology.__ for updates & lore</span>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono text-pink-400 group-hover:text-pink-200 uppercase tracking-widest">
                        Visit
                      </span>
                    </a>

                    <a
                      href="https://github.com/massimoanzalone2204-hash/Pokethology"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sounds.scan()}
                      className="flex items-center justify-between p-3.5 bg-slate-950/60 hover:bg-slate-950/90 border border-cyan-900/40 hover:border-cyan-500/50 rounded-xl transition-all group w-full text-cyan-400 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Github className="w-4 h-4 shrink-0 text-cyan-400 group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col text-left">
                          <span className="font-hud text-[9px] sm:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">GitHub Repository</span>
                          <span className="text-[8px] sm:text-[9px] font-mono text-slate-400 leading-none mt-0.5">Explore source code & documentation</span>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono text-cyan-500 group-hover:text-cyan-300 uppercase tracking-widest">
                        Visit
                      </span>
                    </a>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSystemRestart}
                    disabled={isRebooting}
                    className="flex items-center justify-between p-3.5 bg-red-950/20 hover:bg-red-900/40 border border-red-900/40 hover:border-red-500/50 rounded-xl transition-all group mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 text-red-400">
                      <RotateCcw className={cn("w-4 h-4", isRebooting && "animate-spin")} />
                      <span className="font-hud text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                        {isRebooting ? 'REBOOTING POKEDEX...' : 'RESTART POKEDEX SYSTEM'}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono text-red-600 group-hover:text-red-300 uppercase tracking-widest">
                      Reset
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};
