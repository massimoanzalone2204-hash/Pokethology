import { useState, useEffect, useCallback } from 'react';
import { STORES, idbGetAll, idbSet, idbDelete } from '../lib/indexedDB';
import { getPokemonArtworkUrl, POKEMON_FORM_IDS } from '../lib/pokemonArtwork';

export interface FavoritePokemon {
  id: string; // pokemon name
  name: string;
  url: string;
  displayId?: number;
  formId?: number;
  baseId?: number;
  artwork?: string;
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

  const toggleFavorite = async (pokemon: {
    name: string;
    url?: string;
    displayId?: number;
    formId?: number;
    baseId?: number;
    artwork?: string;
  }) => {
    const isFav = favorites.some(f => f.name.toLowerCase() === pokemon.name.toLowerCase() || f.id === pokemon.name);
    if (isFav) {
      await idbDelete(STORES.FAVORITES, pokemon.name);
      setFavorites(prev => prev.filter(f => f.name.toLowerCase() !== pokemon.name.toLowerCase() && f.id !== pokemon.name));
    } else {
      const normName = pokemon.name.toLowerCase().trim();
      const resolvedFormId = pokemon.formId || POKEMON_FORM_IDS[normName];
      const resolvedArtwork = pokemon.artwork || getPokemonArtworkUrl({
        name: pokemon.name,
        url: pokemon.url,
        displayId: pokemon.displayId,
        formId: resolvedFormId,
        baseId: pokemon.baseId,
        artwork: pokemon.artwork
      });

      const newFav: FavoritePokemon = {
        id: pokemon.name,
        name: pokemon.name,
        url: pokemon.url || resolvedArtwork,
        displayId: pokemon.displayId,
        formId: resolvedFormId,
        baseId: pokemon.baseId,
        artwork: resolvedArtwork,
        addedAt: Date.now()
      };
      await idbSet(STORES.FAVORITES, newFav);
      setFavorites(prev => [newFav, ...prev]);
    }
  };

  const isFavorite = (name: string) => {
    if (!name) return false;
    const norm = name.toLowerCase().trim();
    return favorites.some(f => f.name.toLowerCase() === norm || f.id === norm);
  };

  return { favorites, toggleFavorite, isFavorite, loadFavorites };
}
