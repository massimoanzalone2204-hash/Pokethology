import { motion } from 'motion/react';

export const PokethologyLogo = ({ className }: { className?: string }) => (
  <motion.img
    src="https://i.postimg.cc/1zgPj6SW/20260201-111647-0000.png"
    alt="Pokéthology Logo"
    className={`${className || ''} cursor-pointer drop-shadow-md`}
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
      scale: 1.05,
      rotate: [0, -5, 5, 0],
      transition: { rotate: { duration: 0.5 } }
    }}
    whileTap={{ scale: 0.95 }}
    referrerPolicy="no-referrer"
  />
);

