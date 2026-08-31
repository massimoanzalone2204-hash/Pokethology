import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BookOpen, X, ChevronRight } from 'lucide-react';
import { PokethologyLogo } from './PokethologyLogo';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTutorial: () => void;
}

export const WelcomeModal = ({ isOpen, onClose, onOpenTutorial }: WelcomeModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative w-full max-w-md bg-slate-900 border-2 border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(34,211,238,0.15)] flex flex-col items-center text-center overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-6">
               <PokethologyLogo className="w-full h-full object-contain" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-hud font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-8 uppercase tracking-wider">
              Welcome to Pokéthology
            </h2>

            <div className="flex flex-col w-full gap-3 relative z-10">
              <button
                onClick={() => {
                  onClose();
                  onOpenTutorial();
                }}
                className="group relative w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <BookOpen className="w-5 h-5 relative z-10" />
                <span className="relative z-10 font-hud tracking-wider uppercase text-sm">Start Tutorial</span>
                <ChevronRight className="w-4 h-4 relative z-10 opacity-70 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 text-slate-400 hover:text-white text-sm font-hud tracking-wider uppercase transition-colors cursor-pointer"
              >
                Skip for now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
