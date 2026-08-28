import React, { memo } from 'react';
import { PokemonCard } from './PokemonCard';

export const PokemonGrid = memo(({ list, displayLimit, selectedName, opponentName, enableAnimations, onClick, isShiny, isCardView, isLightMode, use2dSprite, isFavorite, onToggleFavorite }: any) => {
  return (
    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4 py-2 px-1">
      {list.slice(0, displayLimit).map((p: any, i: number) => (
        <PokemonCard
          key={`${p.name || 'poke'}-${p.id || i}-${i}`}
          p={p}
          isSelected={p.name === selectedName}
          isOpponentSelected={p.name === opponentName}
          enableAnimations={enableAnimations}
          onClick={onClick}
          isShiny={isShiny}
          isCardView={isCardView}
          isLightMode={isLightMode}
          use2dSprite={use2dSprite}
          isFav={isFavorite ? isFavorite(p.name) : false}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
});

