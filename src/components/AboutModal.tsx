import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X, Cpu, ExternalLink, Github, MessageSquare, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex flex-col bg-slate-950/98 backdrop-blur-2xl overflow-hidden text-slate-100"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Header Bar */}
          <div className="shrink-0 border-b border-cyan-500/30 bg-slate-900/90 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 z-20 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <Cpu className="w-5 h-5 text-cyan-400 animate-spin-slow" style={{ animationDuration: '10s' }} />
              </div>
              <div>
                <h2 className="font-hud font-black text-sm sm:text-lg text-cyan-300 uppercase tracking-widest leading-tight">
                  POKÉTHOLOGY CORE OS
                </h2>
                <p className="text-[10px] sm:text-xs font-mono text-slate-400">
                  SYSTEM ARCHITECTURE & REPOSITORY TERMINAL
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                try { sounds.scan(); } catch (_) {}
              }}
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-hud font-bold uppercase tracking-wider group shadow-sm"
              title="Close (Esc)"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              <span className="hidden sm:inline">CLOSE</span>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8">
            <div className="max-w-3xl mx-auto space-y-6">

              {/* System Specs Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-cyan-500/30 text-xs sm:text-sm font-mono space-y-2.5 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <div className="flex items-center gap-2 text-cyan-400 font-hud uppercase tracking-wider font-bold mb-3 pb-2 border-b border-slate-800">
                  <Terminal className="w-4 h-4" /> System Specifications
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Application Version:</span>
                  <span className="text-cyan-400 font-bold">v2.5.0 Core OS</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Core Neural Registry:</span>
                  <span className="text-amber-400 font-bold">Generations I - IX (1025 Units + Regional Forms)</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">AI Cognition Engine:</span>
                  <span className="text-emerald-400 font-bold">Gemini 1.5 Flash (Server-Side)</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Audio Synth Engine:</span>
                  <span className="text-cyan-300 font-bold">WebAudio Dual-Oscillator + Authentic Cries</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Database Layer:</span>
                  <span className="text-purple-400 font-bold">Client-Side IndexedDB Offline Cache + Firestore</span>
                </div>
              </div>

              {/* About Description */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3 text-xs sm:text-sm leading-relaxed text-slate-300 font-sans">
                <div className="flex items-center gap-2 text-yellow-400 font-hud uppercase tracking-wider font-bold">
                  <Sparkles className="w-4 h-4" /> Tactical Research & Simulation
                </div>
                <p>
                  <strong className="text-cyan-400 font-hud">Pokéthology Core OS</strong> is an advanced Pokémon combat intelligence suite, interactive Pokédex registry, and neural combat simulator. Featuring authentic PokeAPI data, live moveset damage calculators, speed tier analysis, and Gemini-powered tactical coaching.
                </p>
                <p>
                  Save your favorite forms and species with one click, run strategic turn-based battles with accurate type effectiveness multipliers, and track achievements in your local vault.
                </p>
              </div>

              {/* GitHub Repository Section */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/40 space-y-3.5 shadow-lg">
                <div className="flex items-start gap-2.5">
                  <MessageSquare className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-hud font-bold text-xs sm:text-sm text-cyan-300 uppercase tracking-wider">
                      Feedback & Bug Reports
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5">
                      Encountered an anomaly, want to report a bug, or discuss new features for Pokéthology? Visit our official GitHub repository to open issues or join discussions!
                    </p>
                  </div>
                </div>

                <a
                  href="https://github.com/massimoanzalone2204-hash/Pokethology"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    try { sounds.scan(); } catch (_) {}
                  }}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-cyan-500/50 hover:border-cyan-400 text-cyan-400 transition-all group shadow-md shadow-cyan-950/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="font-hud text-xs sm:text-sm font-black tracking-wider uppercase">GitHub Repository</span>
                      <span className="text-[10px] sm:text-xs font-mono text-slate-400">massimoanzalone2204-hash/Pokethology</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-colors shrink-0" />
                </a>
              </div>

              {/* Copyright Footnote */}
              <div className="text-[10px] font-mono text-slate-500 text-center pt-4 border-t border-slate-800/80 leading-relaxed">
                Pokémon © 2002-2026 Pokémon. © 1995-2026 Nintendo/Creatures Inc./GAME FREAK inc. TM, ® and Pokémon character names are trademarks of Nintendo.
                <br />
                No copyright or trademark infringement is intended in using Pokémon content on Pokéthology.
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
