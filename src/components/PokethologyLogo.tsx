import { motion } from 'motion/react';

export const PokethologyLogo = ({ className }: { className?: string }) => (
  <motion.img
    src="https://i.postimg.cc/1zgPj6SW/20260201-111647-0000.png"
    alt="Pokéthology Logo"
    className={`${className || ''} cursor-pointer filter drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:drop-shadow-[0_0_25px_rgba(192,132,252,0.95)] transition-all duration-300 will-change-transform transform-gpu`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ 
      opacity: 1, 
      scale: [0.92, 1.08, 0.92],
    }}
    transition={{
      opacity: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      scale: { duration: 3.5, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }
    }}
    whileHover={{
      scale: 1.12,
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
    }}
    whileTap={{ scale: 0.94 }}
    referrerPolicy="no-referrer"
  />
);

