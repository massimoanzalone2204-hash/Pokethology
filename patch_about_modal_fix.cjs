const fs = require('fs');

let fileContent = `import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X, ShieldCheck, Bug, Send, Cpu, CheckCircle2, Sparkles, ExternalLink, Terminal } from 'lucide-react';
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
            className={\`relative w-full max-w-lg rounded-2xl border p-5 sm:p-6 shadow-2xl overflow-hidden \${
              isLightMode
                ? 'bg-white/95 border-slate-200 text-slate-800'
                : 'bg-slate-950/90 border-cyan-500/30 text-slate-100'
            }\`}
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
                    SYSTEM INFO & MAINTENANCE TERMINAL
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
                  <span className="text-slate-400">Current Build Date:</span>
                  <span className="text-emerald-400 font-bold">July 2026 (Rev 10.4)</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Core Neural Registry:</span>
                  <span className="text-amber-400 font-bold">Generation I - IX (1025 Units)</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Audio Synth Engine:</span>
                  <span className="text-cyan-300 font-bold">WebAudio Dual-Oscillator</span>
                </div>
              </div>

              {/* About Description */}
              <p className="text-[11px] leading-relaxed text-slate-300 font-sans">
                <strong className="text-cyan-400 font-hud">Pokéthology Core OS</strong> is an advanced, responsive tactical Pokémon research index and combat simulation terminal. Designed with real-time stat analyzers, damage calculators, and move matrix engines.
              </p>

              {/* Copyright Footnote */}
              <div className="text-[9px] font-mono text-slate-500 text-center pt-2 border-t border-slate-800">
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
`;

fs.writeFileSync('src/components/AboutModal.tsx', fileContent);
