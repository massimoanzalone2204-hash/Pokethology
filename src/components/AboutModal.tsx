import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X, ShieldCheck, Bug, Send, Cpu, CheckCircle2, Sparkles, ExternalLink, Terminal } from 'lucide-react';
import { sounds } from '../lib/sounds';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLightMode?: boolean;
}

export function AboutModal({ isOpen, onClose, isLightMode = false }: AboutModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'bug'>('info');
  const [bugCategory, setBugCategory] = useState<string>('UI & Visuals');
  const [bugSubject, setBugSubject] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleSubmitBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugSubject.trim() || !bugDescription.trim()) return;

    sounds.success();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setBugSubject('');
      setBugDescription('');
      setActiveTab('info');
    }, 2200);
  };

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

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-4 p-1 rounded-xl bg-slate-900/60 border border-slate-800">
              <button
                onClick={() => {
                  setActiveTab('info');
                  sounds.scan();
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-hud uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'info'
                    ? 'bg-cyan-600 text-slate-950 shadow-md shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                System Overview
              </button>

              <button
                onClick={() => {
                  setActiveTab('bug');
                  sounds.scan();
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-hud uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'bug'
                    ? 'bg-amber-600 text-slate-950 shadow-md shadow-amber-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bug className="w-3.5 h-3.5" />
                Report Bug / Issue
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'info' ? (
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

                {/* Quick Bug Report Trigger Banner */}
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bug className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-[10px] font-mono text-amber-300">
                      Encountered an anomaly or glitch?
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('bug');
                      sounds.scan();
                    }}
                    className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 font-hud uppercase text-[9px] font-black tracking-wider transition-all"
                  >
                    Report Bug
                  </button>
                </div>

                {/* Copyright Footnote */}
                <div className="text-[9px] font-mono text-slate-500 text-center pt-2 border-t border-slate-800">
                  Pokémon © 2002-2026 Pokémon. © 1995-2026 Nintendo/Creatures Inc./GAME FREAK inc. TM, ® and Pokémon character names are trademarks of Nintendo.
                  <br />
                  No copyright or trademark infringement is intended in using Pokémon content on Pokéthology.
                </div>
              </div>
            ) : (
              <div>
                {reportSubmitted ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-7 h-7 animate-bounce" />
                    </div>
                    <h4 className="text-sm font-hud font-bold text-emerald-400 uppercase tracking-widest">
                      TELEMETRY REPORT SUBMITTED
                    </h4>
                    <p className="text-[11px] font-mono text-slate-300 max-w-xs mx-auto">
                      Thank you for helping keep Pokéthology operational! Your bug log has been dispatched.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitBug} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-hud uppercase font-bold text-cyan-300">
                        Category
                      </label>
                      <select
                        value={bugCategory}
                        onChange={(e) => setBugCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
                      >
                        <option value="UI & Visuals">UI & Visuals / Layout</option>
                        <option value="Audio & BGM">Audio & Sound / BGM</option>
                        <option value="Combat Simulation">Combat Simulation Engine</option>
                        <option value="Database & Dex">Database & Pokédex Registry</option>
                        <option value="Other">Other / System Glitch</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-hud uppercase font-bold text-cyan-300">
                        Issue Summary
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. BGM slider mute issue or PDF stats alignment"
                        value={bugSubject}
                        onChange={(e) => setBugSubject(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono placeholder:text-slate-600"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-hud uppercase font-bold text-cyan-300">
                        Description & Steps
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Describe what happened and how to reproduce it..."
                        value={bugDescription}
                        onChange={(e) => setBugDescription(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono placeholder:text-slate-600 resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-hud font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-600/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit Telemetry Log
                    </button>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
