import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Search, Trash2, Plus, X, Eye, Swords, Sparkles, Check, Database, AlertCircle, Layers } from 'lucide-react';
import { cn } from '../lib/utils';
import { Pokemon } from '../types';
import { searchPokemon } from '../lib/api';

interface FavoriteItem {
  id: string; // pokemon name
  name: string;
  url?: string;
  displayId?: number;
  addedAt: number;
}

interface FavoritesVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteItem[];
  toggleFavorite: (pokemon: { name: string; url: string; displayId?: number }) => Promise<void>;
  onSelectPokemon: (name: string) => void;
  onStartBattleWithPokemon?: (name: string) => void;
  isLightMode?: boolean;
  sounds?: any;
}

interface DiscoveredForm {
  name: string;
  displayName: string;
  id: number;
  baseId: number;
  isDefault: boolean;
  artwork: string;
  sprite: string;
}

const POPULAR_SUGGESTIONS = [
  { name: 'pikachu', id: 25 },
  { name: 'charizard', id: 6 },
  { name: 'gengar', id: 94 },
  { name: 'lucario', id: 448 },
  { name: 'mewtwo', id: 150 },
  { name: 'greninja', id: 658 },
  { name: 'eevee', id: 133 },
  { name: 'rayquaza', id: 384 },
  { name: 'gardevoir', id: 282 },
  { name: 'garchomp', id: 445 },
  { name: 'sylveon', id: 700 },
  { name: 'tyranitar', id: 248 }
];

function capitalize(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatFormDisplayName(formName: string, _baseName?: string): string {
  return formName.replace(/-/g, ' ').toUpperCase();
}

export const FavoritesVaultModal: React.FC<FavoritesVaultModalProps> = ({
  isOpen,
  onClose,
  favorites,
  toggleFavorite,
  onSelectPokemon,
  onStartBattleWithPokemon,
  isLightMode = false,
  sounds
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [addInput, setAddInput] = useState('');
  const [isSearchingPokeApi, setIsSearchingPokeApi] = useState(false);
  const [discoveredForms, setDiscoveredForms] = useState<DiscoveredForm[]>([]);
  const [searchedPokemonName, setSearchedPokemonName] = useState<string>('');
  const [addMessage, setAddMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered list of favorites
  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) return favorites;
    const q = searchQuery.toLowerCase().trim();
    return favorites.filter(f => 
      f.name.toLowerCase().includes(q) || 
      (f.displayId && f.displayId.toString().includes(q))
    );
  }, [favorites, searchQuery]);

  const handleSearchAndDiscoverForms = async (nameOrId: string) => {
    const term = nameOrId.trim().toLowerCase();
    if (!term) return;

    setIsSearchingPokeApi(true);
    setAddMessage(null);
    setDiscoveredForms([]);
    setSearchedPokemonName(term);

    try {
      const data = await searchPokemon(term, 'en');
      if (data && data.name) {
        const baseId = data.baseId || data.id;
        const formsList: DiscoveredForm[] = [];

        // Check if there are varieties from species data
        if (data.varieties && data.varieties.length > 0) {
          data.varieties.forEach((v: any) => {
            const formUrl = v.pokemon.url || '';
            const formIdStr = formUrl.split('/').filter(Boolean).pop();
            const formId = formIdStr ? parseInt(formIdStr, 10) : baseId;
            const formName = v.pokemon.name;

            formsList.push({
              name: formName,
              displayName: formatFormDisplayName(formName, data.name),
              id: formId,
              baseId: baseId,
              isDefault: !!v.is_default,
              artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${formId}.png`,
              sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${formId}.png`
            });
          });
        } else {
          // Single default form
          formsList.push({
            name: data.name,
            displayName: capitalize(data.name.replace(/-/g, ' ')),
            id: data.id,
            baseId: baseId,
            isDefault: true,
            artwork: data.sprites?.other?.['official-artwork']?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
            sprite: data.sprites?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`
          });
        }

        setDiscoveredForms(formsList);
        try { sounds?.scan?.(); } catch (_) {}
      } else {
        setAddMessage({ text: `Could not find "${term}". Check spelling or ID.`, type: 'error' });
      }
    } catch (err) {
      setAddMessage({ text: `Could not find "${term}". Check spelling or ID.`, type: 'error' });
    } finally {
      setIsSearchingPokeApi(false);
    }
  };

  const handleToggleFormFavorite = async (form: DiscoveredForm) => {
    try {
      await toggleFavorite({
        name: form.name,
        url: form.artwork || form.sprite,
        displayId: form.id
      });
      const isNowFav = !favorites.some(f => f.name.toLowerCase() === form.name.toLowerCase());
      if (isNowFav) {
        try { sounds?.shiny?.(); } catch (_) {}
        setAddMessage({ text: `Added ${form.displayName.toUpperCase()} to favorites!`, type: 'success' });
      } else {
        try { sounds?.hover?.(); } catch (_) {}
        setAddMessage({ text: `Removed ${form.displayName.toUpperCase()} from favorites.`, type: 'success' });
      }
      setTimeout(() => setAddMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const isFormInFavorites = (formName: string) => {
    return favorites.some(f => f.name.toLowerCase() === formName.toLowerCase());
  };

  const getArtworkUrl = (item: FavoriteItem) => {
    if (item.displayId) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.displayId}.png`;
    }
    return item.url || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex flex-col bg-slate-950/98 backdrop-blur-2xl overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Header Bar */}
          <div className="shrink-0 border-b border-yellow-500/30 bg-slate-900/90 px-3 sm:px-8 py-3 flex items-center justify-between gap-3 z-20 shadow-lg">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-yellow-500/20 border border-yellow-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.3)] shrink-0">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="font-hud font-black text-base sm:text-xl text-yellow-300 uppercase tracking-widest leading-none">
                  FAVORITES
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-yellow-950/90 border border-yellow-500/40 text-yellow-300 text-[10px] sm:text-xs font-mono font-bold whitespace-nowrap shadow-sm">
                  {favorites.length} {favorites.length === 1 ? 'UNIT' : 'UNITS'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                try { sounds?.scan?.(); } catch (_) {}
              }}
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-hud font-bold uppercase tracking-wider group shadow-sm shrink-0"
              title="Close (Esc)"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              <span className="hidden sm:inline">CLOSE</span>
            </button>
          </div>

          {/* Search & Discover Forms Tool Strip */}
          <div className="shrink-0 bg-slate-900/80 border-b border-slate-800/80 px-3 sm:px-8 py-3 z-10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-2.5 sm:gap-3">
              {/* Filter Current Saved Favorites */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter saved squad by name or #ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 focus:border-yellow-500/50 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 outline-none transition-all shadow-inner font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Add New Pokemon / Discover Forms Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearchAndDiscoverForms(addInput);
                }}
                className="flex items-center gap-2 w-full md:w-auto shrink-0"
              >
                <div className="relative flex-1 md:w-72">
                  <Plus className="w-4 h-4 text-yellow-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search to add (e.g. Charizard, 6)..."
                    value={addInput}
                    onChange={(e) => setAddInput(e.target.value)}
                    disabled={isSearchingPokeApi}
                    className="w-full bg-yellow-950/20 border border-yellow-500/30 focus:border-yellow-400 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-yellow-100 placeholder-yellow-500/50 outline-none transition-all shadow-inner font-sans"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!addInput.trim() || isSearchingPokeApi}
                  className={cn(
                    "px-3.5 sm:px-4 py-2 rounded-xl text-xs font-hud font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-md",
                    !addInput.trim() || isSearchingPokeApi
                      ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                      : "bg-yellow-500 hover:bg-yellow-400 text-slate-950 border border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)] active:scale-95"
                  )}
                >
                  {isSearchingPokeApi ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span className="hidden min-[380px]:inline">SEARCHING...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>FIND FORMS</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Notification Banner */}
            <AnimatePresence>
              {addMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="max-w-6xl mx-auto mt-2"
                >
                  <div
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 border",
                      addMessage.type === 'success'
                        ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300"
                        : "bg-rose-950/80 border-rose-500/50 text-rose-300"
                    )}
                  >
                    {addMessage.type === 'success' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    )}
                    <span>{addMessage.text}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main Grid Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6">

              {/* DISCOVERED FORMS SELECTION TRAY (When user searches for Charizard, etc.) */}
              <AnimatePresence>
                {discoveredForms.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-yellow-950/40 via-slate-900/90 to-slate-900 border-2 border-yellow-500/50 shadow-[0_0_30px_rgba(250,204,21,0.2)] relative"
                  >
                    <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-yellow-500/30">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-yellow-400 animate-pulse" />
                        <span className="font-hud font-black text-xs sm:text-sm uppercase text-yellow-300 tracking-wider">
                          AVAILABLE FORMS FOR "{searchedPokemonName.toUpperCase()}" ({discoveredForms.length})
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setDiscoveredForms([]);
                          setSearchedPokemonName('');
                        }}
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Dismiss form results"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-300 font-sans mb-3">
                      Select the specific form(s) to pin directly to your favorites:
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {discoveredForms.map((form) => {
                        const inFavs = isFormInFavorites(form.name);
                        return (
                          <div
                            key={form.name}
                            className={cn(
                              "border rounded-xl p-3 flex flex-col items-center relative transition-all bg-slate-950/80 group",
                              inFavs
                                ? "border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)] bg-yellow-950/20"
                                : "border-slate-800 hover:border-yellow-500/60"
                            )}
                          >
                            <div className="self-start text-[8.5px] font-mono text-yellow-500/80 bg-yellow-950/60 border border-yellow-500/20 px-1.5 py-0.5 rounded">
                              #{String(form.baseId || form.id).padStart(4, '0')}
                            </div>

                            <div className="w-16 h-16 sm:w-20 sm:h-20 my-1 relative flex items-center justify-center">
                              <img
                                src={form.artwork}
                                alt={form.displayName}
                                className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.src = form.sprite;
                                }}
                              />
                            </div>

                            <span className="font-hud font-bold text-[10px] sm:text-xs text-yellow-200 text-center leading-tight truncate w-full mb-2">
                              {form.displayName}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleToggleFormFavorite(form)}
                              className={cn(
                                "w-full py-1.5 rounded-lg text-[10px] font-hud font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm",
                                inFavs
                                  ? "bg-yellow-500 text-slate-950 border border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.4)]"
                                  : "bg-slate-800 hover:bg-yellow-950/60 border border-slate-700 hover:border-yellow-500/50 text-slate-300 hover:text-yellow-300"
                              )}
                            >
                              <Star className={cn("w-3 h-3", inFavs ? "fill-slate-950" : "fill-none")} />
                              <span>{inFavs ? "SAVED" : "PIN FORM"}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SAVED SQUAD LIST */}
              <div>
                {/* If Empty State */}
                {favorites.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-500/10 border-2 border-dashed border-yellow-500/30 flex items-center justify-center mb-4">
                      <Star className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500/40" />
                    </div>
                    <h3 className="font-hud font-black text-base sm:text-xl text-yellow-300 uppercase tracking-widest mb-1">
                      NO FAVORITES PINNED YET
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 font-sans">
                      Search above for any Pokémon and all its forms (Mega, Gigantamax, Alolan, etc.) or click the star on any card to build your elite squad.
                    </p>

                    <div className="w-full max-w-2xl bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-6 text-left">
                      <span className="text-[11px] font-hud uppercase tracking-wider text-yellow-400/90 font-bold block mb-3 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> POPULAR RECOMMENDATIONS (1-CLICK SEARCH & FORMS)
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                        {POPULAR_SUGGESTIONS.map((sug) => (
                          <button
                            key={sug.name}
                            onClick={() => handleSearchAndDiscoverForms(sug.name)}
                            className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 hover:bg-yellow-950/40 border border-slate-800 hover:border-yellow-500/50 transition-all text-left group cursor-pointer"
                          >
                            <img
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${sug.id}.png`}
                              alt={sug.name}
                              className="w-8 h-8 object-contain shrink-0 group-hover:scale-110 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-[11px] font-hud font-bold text-slate-300 group-hover:text-yellow-300 uppercase block truncate">
                                {sug.name}
                              </span>
                              <span className="text-[9px] font-mono text-slate-500">
                                #{sug.id.toString().padStart(3, '0')}
                              </span>
                            </div>
                            <Plus className="w-3.5 h-3.5 text-slate-600 group-hover:text-yellow-400 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : filteredFavorites.length === 0 ? (
                  <div className="text-center py-16">
                    <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h4 className="font-hud font-bold text-slate-300 uppercase tracking-wider text-sm mb-1">
                      No Matching Favorites Found
                    </h4>
                    <p className="text-xs text-slate-500 font-sans">
                      No saved Pokémon match "{searchQuery}".
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer"
                    >
                      Clear Filter
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    <AnimatePresence>
                      {filteredFavorites.map((fav) => {
                        const artwork = getArtworkUrl(fav);
                        return (
                          <motion.div
                            key={fav.name}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-slate-900/90 border border-yellow-500/25 hover:border-yellow-400/80 rounded-2xl p-3 sm:p-4 flex flex-col items-center relative group transition-all hover:shadow-[0_0_20px_rgba(250,204,21,0.25)] hover:bg-slate-900"
                          >
                            {/* Remove Favorite Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite({ name: fav.name, url: fav.url || '', displayId: fav.displayId });
                                try { sounds?.hover?.(); } catch (_) {}
                              }}
                              className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-950/80 hover:bg-rose-950 text-yellow-400 hover:text-rose-400 border border-yellow-500/30 hover:border-rose-500/50 transition-all z-20 cursor-pointer"
                              title="Remove from favorites"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Top ID Badge */}
                            <div className="self-start text-[9px] font-mono font-bold text-yellow-500/80 bg-yellow-950/60 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                              #{String(fav.displayId || '???').padStart(4, '0')}
                            </div>

                            {/* Artwork Preview */}
                            <div
                              onClick={() => {
                                onSelectPokemon(fav.name);
                                onClose();
                                try { sounds?.scan?.(); } catch (_) {}
                              }}
                              className="w-20 h-20 sm:w-28 sm:h-28 my-2 relative flex items-center justify-center cursor-pointer group-hover:scale-105 transition-transform"
                            >
                              <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-xl group-hover:bg-yellow-500/20 transition-all" />
                              <img
                                src={artwork}
                                alt={fav.name}
                                className="max-w-full max-h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] z-10"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${fav.displayId || 25}.png`;
                                }}
                              />
                            </div>

                            {/* Name */}
                            <h4
                              onClick={() => {
                                onSelectPokemon(fav.name);
                                onClose();
                                try { sounds?.scan?.(); } catch (_) {}
                              }}
                              className="font-hud font-black uppercase text-xs sm:text-sm text-yellow-300 group-hover:text-yellow-200 tracking-wider truncate w-full text-center cursor-pointer"
                            >
                              {fav.name.replace(/-/g, ' ')}
                            </h4>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1.5 w-full mt-3 pt-2.5 border-t border-slate-800/80">
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectPokemon(fav.name);
                                  onClose();
                                  try { sounds?.scan?.(); } catch (_) {}
                                }}
                                className="flex-1 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[10px] font-hud font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                                title="Inspect in Pokédex"
                              >
                                <Eye className="w-3 h-3" />
                                <span>INSPECT</span>
                              </button>

                              {onStartBattleWithPokemon && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onStartBattleWithPokemon(fav.name);
                                    onClose();
                                    try { sounds?.scan?.(); } catch (_) {}
                                  }}
                                  className="py-1.5 px-2.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/50 hover:border-rose-400 text-rose-300 hover:text-rose-200 text-[10px] font-hud font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(244,63,94,0.3)] shrink-0"
                                  title={`Combat with ${fav.name.replace(/-/g, ' ')}`}
                                >
                                  <Swords className="w-3.5 h-3.5 text-rose-400" />
                                  <span className="text-[9px] hidden xs:inline font-bold">FIGHT</span>
                                </button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
