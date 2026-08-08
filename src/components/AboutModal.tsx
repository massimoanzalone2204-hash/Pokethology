import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X, Cpu, ExternalLink, Github, MessageSquare } from 'lucide-react';
import { sounds } from '../lib/sounds';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLightMode?: boolean;
}

export function AboutModal({ isOpen, onClose, isLightMode = false }: AboutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`relative w-full max-w-lg rounded-2xl border p-5 sm:p-6 shadow-2xl overflow-hidden ${
              isLightMode
                ? 'bg-white/95 border-slate-200 text-slate-800'
                : 'bg-slate-950/90 border-cyan-500/30 text-slate-100'
            }`}
          >
            {/* Top decorative line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-900/30">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
                  <Cpu className="w-5 h-5 animate-spin-slow" style={{ animationDuration: '10s' }} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-hud font-black uppercase tracking-widest text-cyan-400">
                    POKÉTHOLOGY CORE OS
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">
                    SYSTEM INFO & REPOSITORY TERMINAL
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  sounds.scan();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-900/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* System Specs Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] font-mono space-y-2">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Application Version:</span>
                  <span className="text-cyan-400 font-bold">v2.5.0 Core OS</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Core Neural Registry:</span>
                  <span className="text-amber-400 font-bold">Generations I - IX (1025 Units)</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">AI Cognition Engine:</span>
                  <span className="text-emerald-400 font-bold">Gemini 1.5 Flash</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Audio Synth Engine:</span>
                  <span className="text-cyan-300 font-bold">WebAudio Dual-Oscillator + Legacy Cries</span>
                </div>
              </div>

              {/* About Description */}
              <div className="space-y-2 text-[11px] leading-relaxed text-slate-300 font-sans">
                <p>
                  <strong className="text-cyan-400 font-hud">Pokéthology Core OS</strong> is an advanced tactical Pokémon research index and real-time combat simulation system. Built with authentic PokeAPI data, dynamic damage calculators, speed tier analysis, and Gemini-powered tactical coaching.
                </p>
              </div>

              {/* GitHub Repository Section */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-cyan-500/30 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-[10.5px] leading-normal text-slate-300 font-sans">
                    Encountered an anomaly, want to report a bug, or discuss new features for Pokéthology? Visit our official GitHub repository to open issues or join discussions!
                  </p>
                </div>

                <a
                  href="https://github.com/massimoanzalone2204-hash/Pokethology"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sounds.scan()}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 transition-all group shadow-md shadow-cyan-950/50"
                >
                  <div className="flex items-center gap-2.5">
                    <Github className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="font-hud text-[10px] font-black tracking-wider uppercase">GitHub repository</span>
                      <span className="text-[8.5px] font-mono text-slate-400">massimoanzalone2204-hash/Pokethology</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 transition-colors shrink-0" />
                </a>
              </div>

              {/* Copyright Footnote */}
              <div className="text-[9px] font-mono text-slate-400 text-center mt-4 pt-4 pb-1 border-t border-slate-800/80 leading-relaxed break-words px-2 select-text">
                Pokémon © 2002-2026 Pokémon. © 1995-2026 Nintendo/Creatures Inc./GAME FREAK inc. TM, ® and Pokémon character names are trademarks of Nintendo.
                <br />
                No copyright or trademark infringement is intended in using Pokémon content on Pokéthology.
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
