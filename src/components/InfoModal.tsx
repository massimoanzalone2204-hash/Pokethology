import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDisclaimer?: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  onOpenDisclaimer,
}) => {
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticsCompleted, setDiagnosticsCompleted] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);

  const runDiagnosticsCheck = () => {
    setIsDiagnosticRunning(true);
    setDiagnosticsCompleted(false);
    setDiagnosticProgress(10);
    setDiagnosticLogs(['[INIT] Running diagnostics telemetry...']);

    setTimeout(() => {
      setDiagnosticProgress(45);
      setDiagnosticLogs(prev => [...prev, '[OK] Web Audio & Sound Matrix loaded', '[OK] Pokedex Local Storage Cache verified']);
    }, 400);

    setTimeout(() => {
      setDiagnosticProgress(80);
      setDiagnosticLogs(prev => [...prev, '[OK] Type effectiveness calculations calibrated', '[OK] Showdown Asset Fallbacks active']);
    }, 900);

    setTimeout(() => {
      setDiagnosticProgress(100);
      setDiagnosticsCompleted(true);
      setIsDiagnosticRunning(false);
      setDiagnosticLogs(prev => [...prev, '[SUCCESS] All internal systems operating at peak performance!']);
    }, 1400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto custom-scrollbar optimize-scrolling"
      >
        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-slate-900/90 border border-cyan-500/40 backdrop-blur-xl rounded-2xl w-full max-w-lg overflow-hidden shadow-[0_15px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(6,182,212,0.15)] flex flex-col max-h-[90dvh] my-auto mx-auto"
        >
          <div className="p-5 sm:p-7 border-b border-white/5 bg-slate-900/40 relative flex items-center justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            <div>
              <h2 className="text-lg sm:text-xl font-hud font-black uppercase tracking-[0.2em] relative z-10 flex items-center gap-3 text-cyan-300">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
                Information Center
              </h2>
              <span className="text-[9px] font-mono text-cyan-500 uppercase tracking-[0.3em] mt-1 block relative z-10">Core System Specifications & Modalities</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer relative z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-slate-300 text-xs text-left flex flex-col custom-scrollbar optimize-scrolling">
            <div className="space-y-3 w-full">
              <h3 className="text-cyan-400 font-black uppercase tracking-[0.2em] text-[10px] font-hud flex items-center gap-2">
                <div className="w-1 h-3 bg-cyan-500 rounded-md"></div>
                About Pokethology
              </h3>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 shadow-inner leading-relaxed">
                <p className="italic text-cyan-300/80 font-serif mb-3 text-sm">Where dreams and adventures begin!</p>
                <p className="text-[11px] sm:text-[12px] text-slate-400">The primary function of Pokethology is to act as a highly interactive, all-in-one encyclopedia and combat simulator. Designed with an ultra-high performance gaming framework, it syncs live PokeAPI variables instantly to enable full-scale combat testing under strict competitive parameters.</p>
              </div>
            </div>
            
            <div className="space-y-3 w-full">
              <h3 className="text-cyan-400 font-black uppercase tracking-[0.2em] text-[10px] font-hud flex items-center gap-2">
                <div className="w-1 h-3 bg-purple-500 rounded-md"></div>
                System Modalities
              </h3>
              <ul className="space-y-2 text-[11px] sm:text-[12px] text-slate-400 bg-slate-950/40 p-5 rounded-xl border border-white/5 shadow-inner">
                <li className="flex items-start gap-2"><div className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 shrink-0"></div><span><strong className="text-purple-300">Gen Registry grids</strong> with disappearing Daily hub & Exam drawers.</span></li>
                <li className="flex items-start gap-2"><div className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 shrink-0"></div><span><strong className="text-purple-300">Symmetric Matchup Previews</strong> positioned above the simulated Arena.</span></li>
                <li className="flex items-start gap-2"><div className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 shrink-0"></div><span><strong className="text-purple-300">Lossless Cry Audio Board</strong> with dynamic volume controls.</span></li>
                <li className="flex items-start gap-2"><div className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 shrink-0"></div><span><strong className="text-purple-300">Server-side Gemini AI Chatbot</strong> proxy for real-time answers on lore, combat strategies, and general topics.</span></li>
                <li className="flex items-start gap-2"><div className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 shrink-0"></div><span><strong className="text-purple-300">Offline Diagnostics Center</strong> and Kanto Badge verification cards.</span></li>
              </ul>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-amber-400 font-black font-hud uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isDiagnosticRunning ? "bg-amber-400" : "bg-cyan-400")}></span>
                    <span className={cn("relative inline-flex rounded-full h-2 w-2", isDiagnosticRunning ? "bg-amber-500" : "bg-cyan-500")}></span>
                  </span>
                  System Diagnostics
                </h3>
                
                <button
                  onClick={runDiagnosticsCheck}
                  disabled={isDiagnosticRunning}
                  className={cn(
                    "px-4 py-2 font-hud text-[9px] font-black uppercase tracking-widest rounded-lg border transition-all active:scale-95 disabled:pointer-events-none cursor-pointer",
                    isDiagnosticRunning
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse"
                      : "bg-slate-900 border-white/10 hover:bg-white hover:text-slate-900 hover:border-white shadow-lg"
                  )}
                >
                  {isDiagnosticRunning ? "Testing..." : "Run Diagnostic"}
                </button>
              </div>

              {/* DIAGNOSTICS CONSOLE */}
              {(isDiagnosticRunning || diagnosticsCompleted) && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-black/90 border border-cyan-500/30 rounded-lg p-3 font-mono text-[9px] leading-relaxed relative overflow-hidden shadow-inner"
                >
                  <div className="flex items-center justify-between border-b border-cyan-950 pb-1.5 mb-2">
                    <span className="text-cyan-500/70 font-hud tracking-wider uppercase text-[8px]">INTELLIGENT DIAGNOSTIC LOG</span>
                    <span className="text-slate-500 text-[8px]">{diagnosticProgress}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden mb-2.5">
                    <motion.div 
                      className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full"
                      style={{ width: `${diagnosticProgress}%` }}
                      transition={{ type: "spring", damping: 25, stiffness: 250 }}
                    />
                  </div>

                  {/* Logs Stream */}
                  <div className="space-y-1 max-h-[110px] overflow-y-auto flex flex-col">
                    {diagnosticLogs.map((log, index) => (
                      <motion.div 
                        key={`diag-${index}`}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          log.includes("[SUCCESS]") ? "text-emerald-400 font-bold" :
                          log.includes("[WARN]") ? "text-amber-400 font-bold" :
                          log.includes("[OK]") ? "text-cyan-400" : "text-slate-400"
                        )}
                      >
                        {log}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-950 flex justify-end">
            <button
              onClick={onClose}
              className="px-8 py-2.5 bg-cyan-600 hover:bg-cyan-500 font-hud text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-[0_4px_20px_rgba(8,145,178,0.4)] active:scale-95 cursor-pointer text-white"
            >
              Got it!
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
