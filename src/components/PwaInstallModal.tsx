import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Bell, Sparkles, CheckCircle2, X, Smartphone, Monitor, ShieldCheck, Share, PlusSquare } from 'lucide-react';
import {
  isPwaInstallable,
  promptPwaInstall,
  isPushSupported,
  getNotificationPermissionState,
  requestNotificationPermission,
  sendDiscoveryNotifications
} from '../lib/pwa';
import { HUDCorners } from './HUDCorners';
import { sounds } from '../lib/sounds';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  const [canInstall, setCanInstall] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    setCanInstall(isPwaInstallable());
    setNotificationsEnabled(getNotificationPermissionState() === 'granted');

    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    const checkInstall = () => setCanInstall(isPwaInstallable());
    window.addEventListener('beforeinstallprompt', checkInstall);
    return () => window.removeEventListener('beforeinstallprompt', checkInstall);
  }, [isOpen]);

  const handleInstall = async () => {
    const outcome = await promptPwaInstall();
    if (outcome === 'accepted') {
      setInstallSuccess(true);
      try { sounds.shiny(); } catch (_) {}
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  const handleEnableNotifications = async () => {
    const res = await requestNotificationPermission();
    if (res === 'granted') {
      setNotificationsEnabled(true);
      sendDiscoveryNotifications();
      try { sounds.shiny(); } catch (_) {}
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex flex-col bg-slate-950/98 backdrop-blur-2xl overflow-hidden text-slate-100"
      >
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="shrink-0 border-b border-cyan-500/30 bg-slate-900/90 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 z-20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              <Download className="w-5 h-5 text-cyan-400 animate-bounce" />
            </div>
            <div>
              <h2 className="font-hud font-black text-sm sm:text-lg text-cyan-300 uppercase tracking-widest leading-tight">
                INSTALL POKÉTHOLOGY APP
              </h2>
              <p className="text-[10px] sm:text-xs font-mono text-slate-400">
                UNIVERSAL DEVICE PWA & PUSH ALERTS
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
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center gap-2 text-cyan-400 font-hud text-xs sm:text-sm font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-yellow-400" /> Offline Playability & App Launcher
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Install Pokéthology on your iOS, Android, macOS, or Windows device for full offline access, zero-clipping launcher icon, fast cold start, and full-screen tactical battle simulation.
              </p>
            </div>

            {/* Notification Activation Bar */}
            <div className="bg-gradient-to-r from-purple-950/60 to-cyan-950/60 p-4 sm:p-5 rounded-2xl border border-purple-500/30 flex items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-900/60 border border-purple-400/40 text-purple-300">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-hud font-bold text-purple-300 uppercase tracking-wider">
                    Push Notifications
                  </h4>
                  <p className="text-[11px] text-slate-300 font-sans">
                    Receive daily battle alerts and legendary discovery notifications
                  </p>
                </div>
              </div>

              <button
                onClick={handleEnableNotifications}
                disabled={notificationsEnabled}
                className={`px-3.5 py-2 rounded-xl text-xs font-hud font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer shadow-md ${
                  notificationsEnabled
                    ? 'bg-emerald-950 border border-emerald-500 text-emerald-400 cursor-default'
                    : 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-400 active:scale-95 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                }`}
              >
                {notificationsEnabled ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ENABLED
                  </span>
                ) : (
                  'ENABLE'
                )}
              </button>
            </div>

            {/* Install Action or iOS Guide */}
            {isIOS ? (
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-hud text-xs sm:text-sm font-bold uppercase tracking-wider">
                  <Smartphone className="w-4 h-4" /> Install on Apple iOS (Safari)
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  To install Pokéthology on your iPhone or iPad:
                </p>
                <ol className="text-xs sm:text-sm text-slate-300 font-sans space-y-2 list-decimal list-inside pl-1">
                  <li>
                    Tap the <strong className="text-cyan-400 inline-flex items-center gap-1 font-mono"><Share className="w-3.5 h-3.5" /> Share</strong> button in Safari's bottom toolbar.
                  </li>
                  <li>
                    Scroll down and select <strong className="text-cyan-400 inline-flex items-center gap-1 font-mono"><PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen</strong>.
                  </li>
                  <li>
                    Tap <strong className="text-emerald-400 font-hud">Add</strong> in the top right corner.
                  </li>
                </ol>
              </div>
            ) : canInstall ? (
              <button
                onClick={handleInstall}
                disabled={installSuccess}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-hud font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all cursor-pointer active:scale-[0.99]"
              >
                {installSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-slate-950" />
                    <span>INSTALLED SUCCESSFULLY!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 text-slate-950 animate-bounce" />
                    <span>INSTALL AS DESKTOP / MOBILE APP</span>
                  </>
                )}
              </button>
            ) : (
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center">
                <p className="text-xs sm:text-sm text-slate-400 font-mono">
                  App already installed or browser supports direct URL pinning.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
