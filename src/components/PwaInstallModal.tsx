import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Smartphone, Laptop, X, Check, Sparkles, Shield, Cpu } from 'lucide-react';
import { HUDCorners } from './HUDCorners';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.2)] overflow-hidden"
        >
          <HUDCorners />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 flex items-center justify-center p-1 shadow-lg">
                <img
                  src="https://i.postimg.cc/1zgPj6SW/20260201-111647-0000.png"
                  alt="Pokéthology Logo"
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>
              <div>
                <h3 className="font-hud font-black text-cyan-300 text-base uppercase tracking-wider flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyan-400 animate-bounce" /> Install Pokéthology
                </h3>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  Desktop & Mobile Progressive App
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4 text-left">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-hud text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-yellow-400" /> App Features on Home Screen
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Install Pokéthology directly onto your mobile home screen or PC desktop for lightning-fast offline access, immersive fullscreen combat, live push sync, and dedicated app icon launcher.
              </p>
            </div>

            {/* Install Action or Instructions */}
            {isInstalled ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-emerald-300">
                <Check className="w-6 h-6 shrink-0 text-emerald-400" />
                <div>
                  <h4 className="font-hud font-bold text-xs uppercase tracking-wider">Successfully Installed!</h4>
                  <p className="text-[10px] text-slate-300 font-mono">Pokéthology is now installed on your device.</p>
                </div>
              </div>
            ) : deferredPrompt ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInstallClick}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-hud font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <Download className="w-5 h-5 animate-pulse" />
                Install App Now
              </motion.button>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-300 font-hud text-[11px] font-bold uppercase">
                    <Smartphone className="w-4 h-4 text-cyan-400" /> Mobile / iOS / Android
                  </div>
                  <ol className="text-[11px] text-slate-300 space-y-1 list-decimal list-inside font-sans">
                    <li>Tap your browser menu (<span className="text-cyan-400 font-bold">⋮</span> or <span className="text-cyan-400 font-bold">Share</span>).</li>
                    <li>Select <span className="text-cyan-400 font-bold">"Add to Home Screen"</span>.</li>
                    <li>Launch anytime from your device home screen with your custom icon!</li>
                  </ol>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-300 font-hud text-[11px] font-bold uppercase">
                    <Laptop className="w-4 h-4 text-cyan-400" /> PC / Mac Desktop
                  </div>
                  <ol className="text-[11px] text-slate-300 space-y-1 list-decimal list-inside font-sans">
                    <li>Click the install icon (<span className="text-cyan-400 font-bold">⊕</span> or <span className="text-cyan-400 font-bold">Install</span>) in your browser address bar.</li>
                    <li>Confirm installation to add to your desktop.</li>
                    <li>Enjoy standalone native app performance!</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span>Pokéthology PWA Engine</span>
            <span>v2.6.4</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
