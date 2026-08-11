import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Smartphone, Laptop, X, Check, Sparkles, Bell, Bot, Swords } from 'lucide-react';
import { HUDCorners } from './HUDCorners';
import { requestNotificationPermission, sendDiscoveryNotifications } from '../utils/notificationManager';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      requestNotificationPermission().then(() => setNotificationsEnabled(true));
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
        requestNotificationPermission().then(() => setNotificationsEnabled(true));
      }
      setDeferredPrompt(null);
    }
  };

  const handleEnableNotifications = async () => {
    const res = await requestNotificationPermission();
    if (res === 'granted') {
      setNotificationsEnabled(true);
      sendDiscoveryNotifications();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(6,182,212,0.2)] overflow-hidden my-auto"
        >
          <HUDCorners />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-slate-950 border border-cyan-400/50 flex items-center justify-center p-1.5 shadow-lg overflow-hidden shrink-0">
                <img
                  src="/logo.png"
                  alt="Pokéthology Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                />
              </div>
              <div>
                <h3 className="font-hud font-black text-cyan-300 text-sm sm:text-base uppercase tracking-wider flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyan-400 animate-bounce" /> Install Pokéthology
                </h3>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  Universal Device PWA & Push Alerts
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
          <div className="space-y-3.5 text-left">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-hud text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-yellow-400" /> Offline Playability & App Launcher
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Install Pokéthology on your iOS, Android, macOS, or Windows device for full offline access, zero-clipping logo launcher, and tactical battle simulation.
              </p>
            </div>

            {/* Notification Activation Bar */}
            <div className="bg-gradient-to-r from-purple-950/50 to-cyan-950/50 p-3.5 rounded-xl border border-purple-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-900/60 border border-purple-400/40 text-purple-300">
                  <Bell className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-hud font-bold text-[11px] text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-cyan-400" /> World Push Discovery
                  </h4>
                  <p className="text-[10px] text-slate-300 font-mono">
                    AI Chatbot & Battle Tactics Alerts
                  </p>
                </div>
              </div>
              <button
                onClick={handleEnableNotifications}
                disabled={notificationsEnabled}
                className={
                  notificationsEnabled
                    ? 'px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0'
                    : 'px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-hud font-black uppercase tracking-wider shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-all shrink-0 cursor-pointer'
                }
              >
                {notificationsEnabled ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Enabled
                  </>
                ) : (
                  'Enable Alerts'
                )}
              </button>
            </div>

            {/* Install Action or Instructions */}
            {isInstalled ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-emerald-300">
                <Check className="w-5 h-5 shrink-0 text-emerald-400" />
                <div>
                  <h4 className="font-hud font-bold text-xs uppercase tracking-wider">Successfully Installed!</h4>
                  <p className="text-[10px] text-slate-300 font-mono">Launch Pokéthology from your home screen or desktop anytime.</p>
                </div>
              </div>
            ) : deferredPrompt ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInstallClick}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-hud font-black text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <Download className="w-5 h-5 animate-pulse" />
                Install App Now
              </motion.button>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-300 font-hud text-[11px] font-bold uppercase">
                    <Smartphone className="w-4 h-4 text-cyan-400" /> Mobile / iOS / Android
                  </div>
                  <ol className="text-[10.5px] text-slate-300 space-y-1 list-decimal list-inside font-sans">
                    <li>Tap browser menu (<span className="text-cyan-400 font-bold">⋮</span> or <span className="text-cyan-400 font-bold">Share</span>).</li>
                    <li>Select <span className="text-cyan-400 font-bold">"Add to Home Screen"</span>.</li>
                    <li>Launch with full unclipped logo icon!</li>
                  </ol>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-300 font-hud text-[11px] font-bold uppercase">
                    <Laptop className="w-4 h-4 text-cyan-400" /> PC / Mac Desktop
                  </div>
                  <ol className="text-[10.5px] text-slate-300 space-y-1 list-decimal list-inside font-sans">
                    <li>Click install icon (<span className="text-cyan-400 font-bold">⊕</span> or <span className="text-cyan-400 font-bold">Install</span>) in address bar.</li>
                    <li>Confirm installation.</li>
                    <li>Enjoy offline native app performance!</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-5 pt-3.5 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span>Pokéthology World Engine</span>
            <span>v2.6.5</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
