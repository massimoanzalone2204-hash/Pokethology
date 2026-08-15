import { useState, useEffect, useCallback } from 'react';
import { STORES, idbGetAll, idbSet, idbDelete } from '../lib/indexedDB';

export interface FavoritePokemon {
  id: string; // usually pokemon name
  name: string;
  url: string;
  displayId?: number;
  addedAt: number;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);

  const loadFavorites = useCallback(async () => {
    try {
      const items = await idbGetAll<FavoritePokemon>(STORES.FAVORITES);
      setFavorites(items.sort((a, b) => b.addedAt - a.addedAt));
    } catch (e) {
      console.warn("Error loading favorites", e);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = async (pokemon: { name: string; url: string; displayId?: number }) => {
    const isFav = favorites.some(f => f.id === pokemon.name);
    if (isFav) {
      await idbDelete(STORES.FAVORITES, pokemon.name);
      setFavorites(prev => prev.filter(f => f.id !== pokemon.name));
    } else {
      const newFav: FavoritePokemon = {
        id: pokemon.name,
        name: pokemon.name,
        url: pokemon.url,
        displayId: pokemon.displayId,
        addedAt: Date.now()
      };
      await idbSet(STORES.FAVORITES, newFav);
      setFavorites(prev => [newFav, ...prev]);
    }
  };

  const isFavorite = (name: string) => {
    return favorites.some(f => f.id === name);
  };

  return { favorites, toggleFavorite, isFavorite, loadFavorites };
}
