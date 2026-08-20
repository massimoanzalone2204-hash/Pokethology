import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X, Check } from 'lucide-react';
import { sounds } from '../lib/sounds';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-slate-950/95 backdrop-blur-2xl text-slate-100 overflow-y-auto"
          onClick={onClose}
        >
          {/* Background Cyber Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Full Screen Modal Card Container */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-slate-900/95 border-2 border-cyan-500/50 rounded-2xl sm:rounded-3xl shadow-[0_0_60px_rgba(34,211,238,0.25)] overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] my-auto"
          >
            {/* HUD Corner Decorators */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 pointer-events-none rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 pointer-events-none rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 pointer-events-none rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 pointer-events-none rounded-br-2xl" />

            {/* Header */}
            <div className="relative shrink-0 px-5 sm:px-8 py-5 sm:py-6 border-b border-cyan-500/30 bg-slate-950/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                  <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <h2 className="font-hud text-base sm:text-xl font-black tracking-wider uppercase text-cyan-100 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                      Copyright Disclaimer
                    </h2>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  try { sounds.scan(); } catch (_) {}
                  onClose();
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-cyan-200 flex items-center justify-center transition-all shrink-0 active:scale-95"
                title="Close Disclaimer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Content - Exact Original Disclaimer Messages */}
            <div className="p-6 sm:p-10 space-y-5 overflow-y-auto text-sm sm:text-base font-mono leading-relaxed text-slate-200 text-center custom-scrollbar my-auto">
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-4 shadow-inner max-w-xl mx-auto">
                <p className="text-slate-200">
                  Pokéthology is an unofficial, free fan made app and is NOT affiliated, endorsed or supported by Nintendo, GAME FREAK or The Pokémon company in any way.
                </p>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Some images used in this app are copyrighted and are supported under fair use.
                </p>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Pokémon and Pokémon character names are trademarks of Nintendo. No copyright infringement intended.
                </p>
                <div className="pt-3 border-t border-slate-800 text-cyan-300 font-bold text-xs sm:text-sm">
                  Pokémon © 2002-2026 Pokémon. © 1995-2026 Nintendo/Creatures Inc./GAME FREAK inc.
                </div>
              </div>
            </div>

            {/* Modal Bottom Footer Action */}
            <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Full-Screen Policy Compliance</span>
              </div>
              
              <button
                onClick={() => {
                  try { sounds.scan(); } catch (_) {}
                  onClose();
                }}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-hud text-xs sm:text-sm font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-95 flex items-center justify-center gap-2 ml-auto"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>I Understand & Close</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface DisclaimerButtonProps {
  onClick: () => void;
  className?: string;
  variant?: 'pill' | 'button' | 'link';
}

export function DisclaimerButton({ onClick, className = '', variant = 'pill' }: DisclaimerButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try { sounds.scan(); } catch (_) {}
    onClick();
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        className={`px-4 py-2 bg-slate-900/90 hover:bg-slate-800/90 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-cyan-100 rounded-xl font-hud text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] flex items-center gap-2 group active:scale-95 ${className}`}
        title="Open Full Screen Legal Disclaimer"
      >
        <ShieldCheck className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
        <span>Disclaimer</span>
      </button>
    );
  }

  if (variant === 'link') {
    return (
      <button
        onClick={handleClick}
        className={`text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/50 hover:decoration-cyan-400 flex items-center gap-1 transition-colors ${className}`}
        title="View Full Legal Disclaimer"
      >
        <ShieldCheck className="w-3.5 h-3.5 inline shrink-0" />
        <span>Disclaimer</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 text-xs font-mono font-semibold tracking-wide transition-all shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] group active:scale-95 cursor-pointer ${className}`}
      title="View Legal Disclaimer & Copyright Notice"
    >
      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
      <span>Disclaimer</span>
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 group-hover:bg-cyan-300 animate-pulse ml-0.5" />
    </button>
  );
}
