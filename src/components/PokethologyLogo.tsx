import { motion } from 'motion/react';

export const PokethologyLogo = ({ className }: { className?: string }) => (
  <motion.img
    src="https://i.postimg.cc/1zgPj6SW/20260201-111647-0000.png"
    alt="Pokéthology Logo"
    className={`${className || ''} cursor-pointer filter drop-shadow-[0_0_12px_rgba(34,211,238,0.5)] hover:drop-shadow-[0_0_20px_rgba(192,132,252,0.8)] transition-all duration-300`}
    initial={{ opacity: 0, y: -4 }}
    animate={{ 
      opacity: 1, 
      y: [0, -6, 0],
    }}
    transition={{
      opacity: { duration: 0.5 },
      y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }}
    whileHover={{
      scale: 1.08,
      rotate: [0, -4, 4, 0],
      transition: { rotate: { duration: 0.5 } }
    }}
    whileTap={{ scale: 0.95 }}
    referrerPolicy="no-referrer"
  />
);

