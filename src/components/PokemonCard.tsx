import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sparkles, Star, Zap, Swords } from 'lucide-react';
import { cn } from '../lib/utils';
import { getPokemonArtworkUrl, getPokemonSpriteUrl, POKEMON_FORM_IDS } from '../lib/pokemonArtwork';
import { TypeBadge } from './TypeBadge';
import { getShowdownName } from '../utils/showdownName';
import { typeBaseColors } from '../utils/battleQuotesAndColors';
import { HUDCorners } from './BattleComponents';
import { sounds } from '../lib/sounds';

export const PokemonTcgCard = memo(({ displayId, pokemonName, className }: { displayId: string; pokemonName: string; className?: string }) => {
  const [error, setError] = useState(false);
  const artworkUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${displayId}.png`;

  if (error) {
    return (
      <div className={cn(className, "border border-slate-700 bg-slate-900/50 flex justify-center items-center rounded text-[8px] text-slate-400 font-mono text-center p-2")}>
        {pokemonName}
      </div>
    );
  }

  return (
    <img
      src={artworkUrl}
      alt={pokemonName}
      className={cn(className, "object-contain rounded filter drop-shadow-[0_0_12px_rgba(34,211,238,0.3)]")}
      referrerPolicy="no-referrer"
      draggable={false}
      onError={() => setError(true)}
    />
  );
});

export const PokemonCardSprite = memo(({ pokemonName, id, className, isShiny, use2dSprite }: { pokemonName: string; id: string | undefined; className: string; isShiny?: boolean; use2dSprite?: boolean }) => {
    const [fallbackLvl, setFallbackLvl] = useState(0);

  useEffect(() => {
    setFallbackLvl(0);
  }, [pokemonName, isShiny, use2dSprite]);

  const getSrcAtLevel = (lvl: number): string => {
    const cleanName = getShowdownName(pokemonName);
    const parsedId = id && !isNaN(parseInt(id, 10)) ? parseInt(id, 10) : undefined;
    const normName = pokemonName?.toLowerCase()?.trim() || '';
    const formId = POKEMON_FORM_IDS[normName] || (parsedId && parsedId > 1025 ? parsedId : undefined);

    if (use2dSprite) {
      if (lvl === 0) {
        return getPokemonSpriteUrl({ name: pokemonName, formId, displayId: parsedId }, { isShiny, use2d: true });
      }
      if (lvl === 1) {
        return `https://play.pokemonshowdown.com/sprites/gen5${isShiny ? '-shiny' : ''}/${cleanName}.png`;
      }
      if (lvl === 2) {
        return `https://play.pokemonshowdown.com/sprites/ani${isShiny ? '-shiny' : ''}/${cleanName}.gif`;
      }
      return getPokemonArtworkUrl({ name: pokemonName, formId, displayId: parsedId }, { isShiny });
    }
    
    if (lvl === 0) {
      return getPokemonArtworkUrl({ name: pokemonName, formId, displayId: parsedId }, { isShiny });
    }
    if (lvl === 1) {
      // Showdown 2D png fallback (good for megas and gmax)
      return `https://play.pokemonshowdown.com/sprites/gen5${isShiny ? '-shiny' : ''}/${cleanName}.png`;
    }
    if (lvl === 2) {
      // Showdown Animated gif fallback
      return `https://play.pokemonshowdown.com/sprites/ani${isShiny ? '-shiny' : ''}/${cleanName}.gif`;
    }
    // Final fallback to raw PokeAPI sprite
    return getPokemonSpriteUrl({ name: pokemonName, formId, displayId: parsedId }, { isShiny });
  };

  const currentSrc = getSrcAtLevel(fallbackLvl);

  return (
    <img
      src={currentSrc}
      alt={pokemonName}
      referrerPolicy="no-referrer"
      draggable={false}
      className={cn(className, use2dSprite ? "[image-rendering:pixelated]" : "", "w-full h-full object-contain scale-[1.1] group-hover:scale-[1.3] drop-shadow-[0_10px_15px_rgba(34,211,238,0.2)]")}
      loading="lazy"
      onError={(e) => {
        if (fallbackLvl < 3) {
          setFallbackLvl(l => l + 1);
        } else {
          e.currentTarget.style.display = 'none';
        }
      }}
    />
  );
});

export const PokemonCard = memo(({ p, isSelected, isOpponentSelected, enableAnimations, onClick, isShiny, isCardView, isLightMode, use2dSprite, isFav, onToggleFavorite }: any) => {
    const id = p.url.split('/').filter(Boolean).pop();
  const displayId = p.displayId || p.baseId || id;
  const isSpecial = parseInt(id || "0") > 1025 && !p.displayId;
  const isMega = p.name.includes('-mega');
  const isGmax = p.name.includes('-gmax');

  const [clickAura, setClickAura] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cardType, setCardType] = useState<string | null>(null);

  useEffect(() => {
    if ((isHovered || isSelected || isOpponentSelected) && !cardType && p.url) {
      let isMounted = true;
      fetch(p.url)
        .then(res => res.json())
        .then(data => {
          if (isMounted && data.types && data.types[0]) {
            setCardType(data.types[0].type.name);
          }
        })
        .catch(err => console.error("Failed to fetch card type", err));
      return () => { isMounted = false; };
    }
  }, [isHovered, isSelected, isOpponentSelected, cardType, p.url]);


  // Framer Motion spring-bound coordinates for hyper-optimized 3D Tilt hover effect (Zero React Re-renders)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 240, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableAnimations) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const valX = (e.clientX - rect.left) / width;
    const valY = (e.clientY - rect.top) / height;
    mouseX.set(valX);
    mouseY.set(valY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const handleClick = () => {
    if (isMega || isGmax) {
      setClickAura(true);
      setTimeout(() => setClickAura(false), 500);
    }
    onClick(p.name);
  };
  
  const spriteClasses = cn(
    "transition-transform duration-500  select-none max-w-[150%] max-h-[150%]",
    (isSelected || isOpponentSelected) 
      ? "!scale-[1.6]" 
      : "opacity-90 group-hover:opacity-100"
  );
  
  return (
    <motion.div
      layout={enableAnimations}
      role="button"
      tabIndex={0}
      initial={enableAnimations ? { opacity: 0, scale: 0.95 } : undefined}
      animate={enableAnimations ? { opacity: 1, scale: 1 } : undefined}
      exit={enableAnimations ? { opacity: 0, scale: 0.95 } : undefined}
      whileHover={enableAnimations ? { scale: 1.04, y: -5, boxShadow: "0 20px 35px -5px rgba(6,182,212,0.22)" } : undefined}
      whileTap={enableAnimations ? { scale: 0.97, y: 0 } : undefined}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={enableAnimations ? { 
        rotateX, 
        rotateY, 
        transformStyle: "preserve-3d",
        perspective: 605
      } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        sounds.hover();
      }}
      className={cn(
        "border rounded-xl p-3 flex flex-col items-center transition-all group cursor-pointer relative overflow-hidden h-32 sm:h-36 justify-center  shadow-lg",
        isLightMode
          ? "bg-white border-slate-200 hover:bg-cyan-50/20 hover:border-cyan-400"
          : "bg-slate-950/40 border-slate-800/50 hover:bg-cyan-950/20 hover:border-cyan-500/40",
        isSelected && (
          isLightMode
            ? "bg-cyan-50 border-cyan-500 ring-1 ring-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)] z-10"
            : "bg-cyan-900/40 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/50 z-10"
        ),
        isOpponentSelected && (
          isLightMode
            ? "bg-rose-50 border-rose-500 ring-1 ring-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.15)] z-10"
            : "bg-red-900/40 border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.25)] ring-1 ring-red-400/50 z-10"
        ),
        isCardView && (isLightMode ? "p-1 bg-slate-100" : "p-1 bg-slate-900")
      )}
    >
      {clickAura && (isMega || isGmax) && (
        <motion.div 
          className={cn("absolute inset-0 z-0 blur-md mix-blend-screen pointer-events-none -inset-2", isMega ? "bg-cyan-500/50" : "bg-red-500/50")}
          initial={{ opacity: 1, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b  r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Type-based Particle Aura */}
      <AnimatePresence>
        {(isHovered || isSelected || isOpponentSelected) && cardType && typeBaseColors[cardType] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1.5 h-1.5 rounded-full blur-[1px] ${typeBaseColors[cardType]}`}
                initial={{
                  x: Math.random() * 100 + "%",
                  y: "110%",
                  scale: Math.random() * 0.5 + 0.5,
                  opacity: Math.random() * 0.5 + 0.2
                }}
                animate={{
                  y: "-10%",
                  x: `${Math.random() * 100}%`,
                  opacity: [0, Math.random() * 0.5 + 0.2, 0],
                  scale: [Math.random() * 0.5 + 0.5, Math.random() * 1.5 + 0.5, 0]
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: Math.random() * 2
                }}
              />
            ))}
            <div className={`absolute inset-0 opacity-20 blur-xl ${typeBaseColors[cardType]}`} />
          </motion.div>
        )}
      </AnimatePresence>
      {!isCardView && <HUDCorners />}
      
      {/* ID Badge */}
      {!isCardView && (
        <div className="absolute top-2 left-2.5 px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[7px] font-bold font-mono text-cyan-600 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all flex items-center gap-1 z-20">
          {isSpecial && !isMega && !isGmax
            ? "SPECIAL" 
            : `#${String(displayId || "0").padStart(4, '0')}`}
        </div>
      )}

      {/* Favorite Star Toggle (Opposite side of ID badge) */}
      {!isCardView && onToggleFavorite && (
        <button 
          type="button"
          className="absolute top-2 right-2.5 z-30 p-1 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-yellow-500/60 transition-all cursor-pointer shadow-sm group/star"
          onClick={(e) => {
            e.stopPropagation();
            try { sounds.hover(); } catch (_) {}
            const numId = id && !isNaN(parseInt(id, 10)) ? parseInt(id, 10) : undefined;
            const normName = p.name?.toLowerCase()?.trim() || '';
            const formId = p.formId || POKEMON_FORM_IDS[normName] || (numId && numId > 1025 ? numId : undefined);
            onToggleFavorite({
              name: p.name,
              url: p.url,
              displayId: p.displayId || p.baseId || numId,
              formId,
              baseId: p.baseId || p.displayId,
              artwork: p.artwork
            });
          }}
          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Star 
            className={cn(
              "w-3.5 h-3.5 transition-transform duration-200 group-hover/star:scale-110", 
              isFav ? "fill-yellow-400 text-yellow-400 filter drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]" : "text-slate-500 group-hover/star:text-yellow-300"
            )} 
          />
        </button>
      )}

      {/* Scanline Effect */}
      {!isCardView && <div className="absolute inset-0 pointer-events-none opacity-[0.03] group-hover:opacity-[0.07] transition-opacity z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>}

      <div className={cn("relative z-10 flex items-center justify-center", isCardView ? "w-full h-full" : "w-20 h-20 sm:w-24 sm:h-24")}>
        {/* Sprite Glow */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)' }}></div>
        
        {enableAnimations && (isSelected || isOpponentSelected) && (
          <motion.div 
            className={cn(
              "absolute inset-0 rounded-full opacity-20",
              isSelected ? "bg-[radial-gradient(circle,rgba(34,211,238,1)_0%,transparent_70%)]" : "bg-[radial-gradient(circle,rgba(248,113,113,1)_0%,transparent_70%)]"
            )}
            animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.3, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
        
        {isCardView ? (
          <PokemonTcgCard displayId={String(displayId)} pokemonName={p.name} className="w-full h-full" />
        ) : (
          <PokemonCardSprite
            pokemonName={p.name}
            id={id}
            isShiny={isShiny}
            use2dSprite={use2dSprite}
            className={spriteClasses}
          />
        )}
      </div>

      {!isCardView && (
        <span className={cn(
          "font-hud text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-wider uppercase tracking-[0.1em] sm:tracking-[0.2em] mt-2 relative z-20 transition-colors break-words whitespace-normal leading-tight w-full text-center px-1",
          isSelected ? "text-cyan-300" : isOpponentSelected ? "text-red-300" : "text-slate-400 group-hover:text-cyan-300"
        )}>
          {p.name.replace(/-/g, ' ')}
        </span>
      )}
    </motion.div>
  );
});

interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

interface QuizData {
  date: string;
  questions: QuizQuestion[];
  isFallback?: boolean;
}

