import { motion } from 'motion/react';

export const PokethologyLogo = ({ className }: { className?: string }) => (
  <motion.img
    src="https://i.postimg.cc/1zgPj6SW/20260201-111647-0000.png"
    alt="Pokéthology Logo"
    className={`${className || ''} cursor-pointer filter drop-shadow-[0_0_14px_rgba(34,211,238,0.6)] hover:drop-shadow-[0_0_24px_rgba(192,132,252,0.9)] transition-all duration-300`}
    animate={{ 
      scale: [0.98, 1.06, 0.98],
    }}
    transition={{
      scale: { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
    }}
    whileHover={{
      scale: 1.08,
      transition: { duration: 0.25 }
    }}
    whileTap={{ scale: 0.95 }}
    referrerPolicy="no-referrer"
  />
);
