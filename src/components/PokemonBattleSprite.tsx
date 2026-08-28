import React, { useState, useEffect, useMemo, memo } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { getPokemonSpriteUrl } from '../lib/pokemonArtwork';
import { getShowdownName } from '../utils/showdownName';

export const PokemonBattleSprite = memo(({ pokemon, isBack, isShiny, isFemale, className, onClick, arenaMode = false, flip, scaleMultiplier = 1, isPlayer = false, use2dSprite = false }: any) => {
  const [fallbackLevel, setFallbackLevel] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setFallbackLevel(0);
    setImageLoaded(false);
  }, [pokemon?.name, isShiny, isFemale, use2dSprite]);

  const generateSrc = (level: number) => {
    if (!pokemon) return '';
    const cleanName = getShowdownName(pokemon?.name, isFemale);
    const effectiveLevel = level;
    const idNum = pokemon.id || pokemon.url?.split('/').filter(Boolean).pop() || pokemon.name;
    const shinyPath = isShiny ? 'shiny/' : '';

    if (use2dSprite) {
      // 2D PIXEL ART SPRITE MODE (PokeAPI 2D pixel art for every Pokemon: base, mega, gmax, regional, alternative forms)
      if (effectiveLevel === 0 && pokemon.sprites) {
        if (isFemale) {
          const fem = isBack 
            ? (isShiny ? (pokemon.sprites.back_shiny_female || pokemon.sprites.back_female || pokemon.sprites.back_default) : (pokemon.sprites.back_female || pokemon.sprites.back_default))
            : (isShiny ? (pokemon.sprites.front_shiny_female || pokemon.sprites.front_female || pokemon.sprites.front_default) : (pokemon.sprites.front_female || pokemon.sprites.front_default));
          if (fem) return fem;
        }
        const spr = isBack 
          ? (isShiny ? (pokemon.sprites.back_shiny || pokemon.sprites.back_default || pokemon.sprites.front_default) : (pokemon.sprites.back_default || pokemon.sprites.front_default))
          : (isShiny ? (pokemon.sprites.front_shiny || pokemon.sprites.front_default) : pokemon.sprites.front_default);
        if (spr) return spr;
      }

      // Level 1: Direct PokeAPI raw 2D pixel art sprite URL (covers 10000+ IDs for megas, gmax, regional forms!)
      if (effectiveLevel <= 1) {
        if (isFemale) {
          return isBack 
            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/female/${shinyPath}${idNum}.png`
            : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/female/${shinyPath}${idNum}.png`;
        }
        return isBack 
          ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${shinyPath}${idNum}.png`
          : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinyPath}${idNum}.png`;
      }

      // Level 2: Showdown static 2D sprite
      if (effectiveLevel === 2) {
        const basePath = isBack ? `gen5-back${isShiny ? '-shiny' : ''}` : `gen5${isShiny ? '-shiny' : ''}`;
        return `https://play.pokemonshowdown.com/sprites/${basePath}/${cleanName}.png`;
      }

      // Level 3: Showdown animated 2D sprite
      if (effectiveLevel === 3) {
        const basePath = isBack ? `ani-back${isShiny ? '-shiny' : ''}` : `ani${isShiny ? '-shiny' : ''}`;
        return `https://play.pokemonshowdown.com/sprites/${basePath}/${cleanName}.gif`;
      }

      // Level 4: PokeAPI front 2D sprite fallback if back was requested but missing
      if (effectiveLevel === 4) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinyPath}${idNum}.png`;
      }

      // Level 5: Official artwork fallback
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shinyPath}${idNum}.png`;
    }

    // HOME 3D ARTWORK MODE (Default)
    if (effectiveLevel === 0 && pokemon.sprites) {
      if (arenaMode && pokemon.sprites.other?.home) {
        const home = pokemon.sprites.other.home;
        if (isFemale && (home.front_female || home.front_shiny_female)) {
          return isShiny 
            ? (home.front_shiny_female || home.front_female) 
            : home.front_female;
        } else {
          return isShiny 
            ? (home.front_shiny || home.front_default) 
            : home.front_default;
        }
      }
      if (isFemale) {
        if (pokemon.sprites.other?.home?.front_female) {
          return isShiny 
            ? (pokemon.sprites.other.home.front_shiny_female || pokemon.sprites.other.home.front_female) 
            : pokemon.sprites.other.home.front_female;
        }
        if (pokemon.sprites.other?.['official-artwork']?.front_female) {
          const offArt = pokemon.sprites.other['official-artwork'];
          return isShiny ? (offArt.front_shiny_female || offArt.front_female) : offArt.front_female;
        }
        // If female is requested, but official arts lack it, we skip returning here 
        // to let it fall through to Showdown (Level 1) which often has the female sprite.
      } else {
        const offArt = pokemon.sprites.other?.['official-artwork'];
        const homeArt = pokemon.sprites.other?.home;
        if (offArt && (offArt.front_default || offArt.front_shiny)) {
          return isShiny ? (offArt.front_shiny || offArt.front_default) : offArt.front_default;
        } else if (homeArt && (homeArt.front_default || homeArt.front_shiny)) {
          return isShiny ? (homeArt.front_shiny || homeArt.front_default) : homeArt.front_default;
        }
      }
    }
    
    // Level 1: Showdown animated gif
    if (effectiveLevel <= 1) {
      const basePath = isBack ? `ani-back${isShiny ? '-shiny' : ''}` : `ani${isShiny ? '-shiny' : ''}`;
      return `https://play.pokemonshowdown.com/sprites/${basePath}/${cleanName}.gif`;
    }
    
    // Level 2: Showdown static 2D
    if (effectiveLevel === 2) {
      const basePath = isBack ? `gen5-back${isShiny ? '-shiny' : ''}` : `gen5${isShiny ? '-shiny' : ''}`;
      return `https://play.pokemonshowdown.com/sprites/${basePath}/${cleanName}.png`;
    }

    // Level 3: Pokemon object regular sprite
    if (effectiveLevel === 3 && pokemon.sprites) {
      if (isFemale) {
        return isBack 
          ? (isShiny ? (pokemon.sprites.back_shiny_female || pokemon.sprites.back_female || pokemon.sprites.back_default) : (pokemon.sprites.back_female || pokemon.sprites.back_default))
          : (isShiny ? (pokemon.sprites.front_shiny_female || pokemon.sprites.front_female || pokemon.sprites.front_default) : (pokemon.sprites.front_female || pokemon.sprites.front_default));
      }
      return isBack 
        ? (isShiny ? (pokemon.sprites.back_shiny || pokemon.sprites.back_default) : pokemon.sprites.back_default)
        : (isShiny ? (pokemon.sprites.front_shiny || pokemon.sprites.front_default) : pokemon.sprites.front_default);
    }

    // Fallback URL generation
    
    if (effectiveLevel === 4) {
      let spriteId = idNum;
      if (isShiny && (idNum === '10309' || idNum === 10309 || pokemon.name?.includes('garchomp-mega-z'))) {
        spriteId = '10058';
      }
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shinyPath}${spriteId}.png`;
    }
    
    return isBack 
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${shinyPath}${idNum}.png`
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinyPath}${idNum}.png`;
  };

  const currentSrc = generateSrc(fallbackLevel);
  const autoShouldFlip = isBack && (currentSrc.includes('official-artwork') || (!currentSrc.includes('back') && !currentSrc.includes('ani-back') && !currentSrc.includes('gen5-back')));
  const finalFlip = flip !== undefined ? flip : autoShouldFlip;
  
  const isMega = pokemon?.name ? pokemon.name.includes('-mega') : false;
  const isGmax = pokemon?.name ? pokemon.name.includes('-gmax') : false;
  const isMegaOrGmax = isMega || isGmax;
  
  const scaleFactor = useMemo(() => {
    if (!pokemon) return 1;
    if (!arenaMode) {
      // In database details view, keep a consistent beautiful size that never clips
      return use2dSprite ? (isMegaOrGmax ? 1.05 : 1.1) : (isMegaOrGmax ? 0.92 : 0.95);
    }
    const h = pokemon.height || 10; // default 1.0m
    let baseScale = 1.35;
    if (h <= 3) baseScale = 1.25;        // Tiny scale (e.g. Joltik) is boosted so it remains visible
    else if (h <= 10) baseScale = 1.35;   // Small-Medium (e.g. Pikachu, Eevee)
    else if (h <= 20) baseScale = 1.50;   // Normal-Large (e.g. Charizard)
    else if (h <= 60) baseScale = 1.65;   // Huge
    else baseScale = 1.75;                // Giant (e.g. Steelix, Wailord) is clamped to fit perfectly
    
    if (use2dSprite) {
      // Improved dimensions for 2D pixel sprites in combat arena so they are larger and crisp
      if (h <= 4) {
        baseScale = 2.45; // Extra boost for tiny 2D pixel sprites (e.g. Joltik, Flabebe, Cosmog)
      } else if (h <= 9) {
        baseScale = 2.25; // Boost for small 2D pixel sprites (e.g. Pikachu, Eevee, Diglett)
      } else if (h <= 20) {
        baseScale = 2.05; // Medium 2D pixel sprites
      } else {
        baseScale = 2.15; // Large/giant 2D pixel sprites
      }
      baseScale *= (isMegaOrGmax ? 1.20 : 1.35);
    } else {
      if (isMegaOrGmax) {
        baseScale *= 1.15; // Megas and G-Max forms share the exact same grand dimension
      }
    }
    return baseScale * scaleMultiplier;
  }, [pokemon?.height, pokemon?.name, isMega, isGmax, isMegaOrGmax, arenaMode, scaleMultiplier, use2dSprite]);

  
  const [clickAura, setClickAura] = useState(false);


  const handleClick = (e: any) => {
    if (isMegaOrGmax) {
      setClickAura(true);
      setTimeout(() => setClickAura(false), 500);
    }
    if (onClick) onClick(e);
  };

  // Preloading image in background to support progressive load
  useEffect(() => {
    setImageLoaded(false);
    if (!currentSrc || fallbackLevel >= 5) return;

    const img = new window.Image();
    img.src = currentSrc;
    img.referrerPolicy = "no-referrer";
    img.onload = () => {
      setImageLoaded(true);
    };
  }, [currentSrc, fallbackLevel]);

  if (!pokemon) return null;

  const idNum = pokemon.id || pokemon.url?.split('/').filter(Boolean).pop() || pokemon.name;
  const shinyPath = isShiny ? 'shiny/' : '';
  const silhouetteUrl = isBack
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${shinyPath}${idNum}.png`
    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinyPath}${idNum}.png`;

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center w-full h-full transition-all duration-700",
        className
      )}
      onClick={handleClick}
    >
      {clickAura && isMegaOrGmax && (
        <motion.div 
          className={cn("absolute inset-0 rounded-full blur-xl mix-blend-screen pointer-events-none -inset-4", pokemon?.name?.includes('-mega') ? "bg-cyan-500" : "bg-red-500")}
          initial={{ opacity: 1, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}

      <div className={cn("absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300", fallbackLevel >= 5 ? "opacity-100" : "opacity-0")}>
        <div className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest p-4 border border-cyan-500/20 bg-cyan-950/40 rounded-xl whitespace-nowrap">
          artwork invisible
        </div>
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        {/* Silhouette low-resolution placeholder */}
        <motion.img
          src={silhouetteUrl}
          alt="Silhouette Loading..."
          initial={{ 
            scaleX: finalFlip ? -scaleFactor * 0.95 : scaleFactor * 0.95, 
            scaleY: scaleFactor * 0.95, 
            opacity: 0.7 
          }}
          animate={{ 
            scaleX: finalFlip ? -scaleFactor : scaleFactor, 
            scaleY: scaleFactor, 
            opacity: (!imageLoaded && fallbackLevel < 5) ? 0.6 : 0,
            y: arenaMode ? [0, -10, 0] : 0 
          }}
          transition={{ 
            opacity: { duration: 0.5, ease: "easeInOut" },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            scaleX: { type: "spring", stiffness: 300, damping: 15 }
          }}
          className={cn(
            "absolute object-contain pointer-events-none select-none transition-transform duration-500",
            "max-w-[85vw] sm:max-w-[90%] max-h-[90%]"
          )}
          style={{
            filter: isPlayer 
              ? 'brightness(0) contrast(0) opacity(0.4) drop-shadow(0 0 8px rgba(6,182,212,0.8))'
              : 'brightness(0) contrast(0) opacity(0.4) drop-shadow(0 0 8px rgba(239,68,68,0.8))'
          }}
          referrerPolicy="no-referrer"
        />

        {/* Full high-resolution / animated sprite */}
        <motion.img
          src={fallbackLevel >= 5 ? undefined : currentSrc}
          alt={fallbackLevel >= 5 ? "" : pokemon?.name}
          onError={(e) => {
            if (fallbackLevel < 5) {
              setFallbackLevel(prev => prev + 1);
            } else {
              e.currentTarget.style.display = 'none';
            }
          }}
          initial={{ 
            scaleX: finalFlip ? -scaleFactor * 0.9 : scaleFactor * 0.9, 
            scaleY: scaleFactor * 0.9, 
            opacity: 0 
          }}
          animate={{ 
            scaleX: finalFlip ? -scaleFactor : scaleFactor, 
            scaleY: scaleFactor, 
            opacity: imageLoaded && fallbackLevel < 5 ? 1 : 0, 
            y: arenaMode ? [0, -10, 0] : 0 
          }}
          transition={{ 
            opacity: { duration: 0.4, ease: "easeOut" },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            scaleX: { type: "spring", stiffness: 300, damping: 15 }
          }}
          className={cn(
            "object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]",
            use2dSprite ? "[image-rendering:pixelated]" : "",
            "max-w-[85vw] sm:max-w-[90%] max-h-[90%]"
          )}
          style={{
            filter: isShiny && fallbackLevel > 0 ? 'hue-rotate(60deg) saturate(1.5)' : 'none'
          }}
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
});
