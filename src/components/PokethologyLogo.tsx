import { motion } from 'motion/react';

export const PokethologyLogo = ({ className }: { className?: string }) => (
  <motion.img
    src="https://i.postimg.cc/1zgPj6SW/20260201-111647-0000.png"
    alt="Pokéthology Logo"
    className={`${className || ''} cursor-pointer filter drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:drop-shadow-[0_0_25px_rgba(192,132,252,0.95)] transition-all duration-300`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ 
      opacity: 1, 
      scale: [0.90, 1.10, 0.90],
    }}
    transition={{
      opacity: { duration: 0.5 },
      scale: { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
    }}
    whileHover={{
      scale: 1.15,
      transition: { duration: 0.3 }
    }}
    whileTap={{ scale: 0.92 }}
    referrerPolicy="no-referrer"
  />
);

