/**
 * PokeApiService
 * 
 * A robust, production-ready service for interacting with the PokéAPI.
 * Features:
 * - In-memory and localStorage caching to minimize network requests.
 * - Input formatting (kebab-case, lowercase, remove special characters).
 * - Graceful error handling, returning structured error objects instead of throwing.
 * - Targeted data extraction for cleaner application state.
 */

import { recordApiUsage, checkQuotaAllowed } from "./quotaManager";

const BASE_URL = 'https://pokeapi.co/api/v2';

// --- Types ---

export interface PokemonEssentialData {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  stats: { name: string; value: number }[];
  abilities: { name: string; isHidden: boolean }[];
}

export interface PokemonSpeciesData {
  id: number;
  name: string;
  description: string;
  generation: string;
}

export interface PokemonListResult {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
}

export interface ApiError {
  error: true;
  message: string;
  status?: number;
}

// Type guard to check for errors
export const isApiError = (obj: any): obj is ApiError => {
  return obj && obj.error === true;
};

// --- Service ---

class PokeApiService {
  private inMemoryCache: Map<string, any> = new Map();

  /**
   * Format input string to match PokeAPI requirements (kebab-case, lowercase)
   */
  public formatInput(input: string | number): string {
    if (typeof input === 'number') return input.toString();
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-');        // Replace spaces with hyphens
  }

  /**
   * Smart cache retrieval (checks memory, then localStorage)
   */
  private getCache<T>(key: string): T | null {
    // 1. Check Memory
    if (this.inMemoryCache.has(key)) {
      return this.inMemoryCache.get(key) as T;
    }
    
    // 2. Check LocalStorage
    try {
      const stored = localStorage.getItem(`pokeapi_cache_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        let actualData: T;
        
        if (parsed && typeof parsed === 'object' && 'timestamp' in parsed && 'data' in parsed) {
          // Check TTL (7 days)
          const TTL = 7 * 24 * 60 * 60 * 1000;
          if (Date.now() - parsed.timestamp > TTL) {
            localStorage.removeItem(`pokeapi_cache_${key}`);
            return null;
          }
          // Update timestamp for LRU access tracking
          parsed.timestamp = Date.now();
          localStorage.setItem(`pokeapi_cache_${key}`, JSON.stringify(parsed));
          actualData = parsed.data as T;
        } else {
          // Legacy cache data, convert to new format
          actualData = parsed as T;
          localStorage.setItem(`pokeapi_cache_${key}`, JSON.stringify({ data: actualData, timestamp: Date.now() }));
        }

        // Backfill memory cache
        this.inMemoryCache.set(key, actualData);
        return actualData;
      }
    } catch (e) {
      console.warn("Failed to read from localStorage cache", e);
    }
    
    return null;
  }

  /**
   * Smart cache storage (writes to memory and localStorage)
   */
  private setCache<T>(key: string, data: T): void {
    // 1. Write to Memory
    this.inMemoryCache.set(key, data);
    
    // 2. Write to LocalStorage (with quota exception handling & auto-pruning)
    const entry = { data, timestamp: Date.now() };
    try {
      localStorage.setItem(`pokeapi_cache_${key}`, JSON.stringify(entry));
    } catch (e: any) {
      // Clear older entries when quota is exceeded
      if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.message?.includes('quota')) {
        this.pruneCache();
        try {
          localStorage.setItem(`pokeapi_cache_${key}`, JSON.stringify(entry));
        } catch (err) {
          // Fallback silently to memory-only if storage remains full
        }
      } else {
        this.pruneCache();
        try {
          localStorage.setItem(`pokeapi_cache_${key}`, JSON.stringify(entry));
        } catch (err) {}
      }
    }
  }

  /**
   * Prune oldest cache entries to free up space based on timestamp
   */
  private pruneCache(): void {
    try {
      const cacheEntries: { key: string; timestamp: number }[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('pokeapi_cache_')) {
          try {
            const stored = localStorage.getItem(k);
            if (stored) {
              const parsed = JSON.parse(stored);
              // Use timestamp if exists, otherwise assign 0 to prioritize removal
              const timestamp = (parsed && typeof parsed === 'object' && 'timestamp' in parsed) ? parsed.timestamp : 0;
              cacheEntries.push({ key: k, timestamp });
            }
          } catch(e) {}
        }
      }

      // Sort ascending by timestamp (oldest first)
      cacheEntries.sort((a, b) => a.timestamp - b.timestamp);

      // Remove half of the oldest cached API responses from localStorage
      const removeCount = Math.ceil(cacheEntries.length / 2);
      for (let i = 0; i < removeCount; i++) {
        localStorage.removeItem(cacheEntries[i].key);
      }
    } catch (err) {
      console.warn("Failed to prune localStorage cache", err);
    }
  }

  /**
   * Clears the entire PokeAPI cache from both memory and localStorage.
   */
  public clearCache(): void {
    this.inMemoryCache.clear();
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('pokeapi_cache_')) {
          keysToRemove.push(k);
        }
      }
      for (const k of keysToRemove) {
        localStorage.removeItem(k);
      }
      console.log(`Cleared ${keysToRemove.length} cache entries.`);
    } catch(e) {
      console.warn("Failed to clear localStorage cache", e);
    }
  }

  /**
   * Generic fetcher with caching and error handling (public for raw data needs)
   */
  public async fetchWithCache<T>(endpoint: string, cacheKey: string): Promise<T | ApiError> {
    const cached = this.getCache<T>(cacheKey);
    if (cached) return cached;

    // Check quota before hitting network
    const { allowed } = checkQuotaAllowed("pokeapi");
    if (!allowed) {
      return {
        error: true,
        message: "Local API Quota Exceeded for PokeAPI! Please reset quota or wait until tomorrow."
      };
    }

    const urlStr = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // Generous and resilient timeout for direct and proxied PokeAPI requests
    const timeoutMs = urlStr.includes('limit=') ? 12000 : 8000;

    let lastError: any;
    let res: Response | null = null;
    
    // Direct network attempt with quick retry
    for (let i = 0; i < 2; i++) {
      const controller = new AbortController();
      const tId = setTimeout(() => controller.abort(), timeoutMs);
      try {
        res = await fetch(urlStr, { signal: controller.signal });
        clearTimeout(tId);
        if (res.ok || res.status === 404) break;
      } catch (err) {
        clearTimeout(tId);
        lastError = err;
        if (i < 1) {
          await new Promise(r => setTimeout(r, 200));
        }
      }
    }

    // Fall back immediately to local server-side proxy which acts as a secondary cache & network gateway
    if (!res || (!res.ok && res.status !== 404)) {
      const proxyController = new AbortController();
      const proxyTimeoutId = setTimeout(() => proxyController.abort(), 10000);
      try {
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(urlStr)}`;
        const proxyRes = await fetch(proxyUrl, { signal: proxyController.signal });
        clearTimeout(proxyTimeoutId);
        if (proxyRes.ok) {
          res = proxyRes;
        }
      } catch (proxyErr) {
        clearTimeout(proxyTimeoutId);
        // Silently record fallback state without uncaught rejection
      }
    }

    recordApiUsage("pokeapi", 1); // Record usage after attempt

    if (!res) {
      return {
        error: true,
        message: lastError?.message || 'Network error occurred while fetching from PokeAPI'
      };
    }

    if (!res.ok) {
      return {
        error: true,
        message: `PokeAPI request failed: ${res.statusText}`,
        status: res.status
      };
    }

    try {
      const data = await res.json();
      this.setCache(cacheKey, data);
      return data as T;
    } catch (parseError: any) {
      return {
        error: true,
        message: `Failed to parse response: ${parseError.message}`
      };
    }
  }

  // --- Main Methods ---

  /**
   * 0. Get Raw Pokemon (For backward compatibility with existing complex types)
   */
  public async getPokemonRaw(idOrName: string | number): Promise<any | ApiError> {
    const formatted = this.formatInput(idOrName);
    const endpoint = `/pokemon/${formatted}`;
    const cacheKey = `raw_${formatted}`;
    return this.fetchWithCache<any>(endpoint, cacheKey);
  }

  /**
   * 1. Get Paginated Pokemon List
   */
  public async getPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonListResult | ApiError> {
    const endpoint = `/pokemon?limit=${limit}&offset=${offset}`;
    const cacheKey = `list_${limit}_${offset}`;
    return this.fetchWithCache<PokemonListResult>(endpoint, cacheKey);
  }

  /**
   * 2. Get Single Pokemon Details (Cleanly mapped for essential data)
   */
  public async getPokemonDetails(idOrName: string | number): Promise<PokemonEssentialData | ApiError> {
    const formatted = this.formatInput(idOrName);
    const endpoint = `/pokemon/${formatted}`;
    const cacheKey = `details_${formatted}`;

    const rawData = await this.fetchWithCache<any>(endpoint, cacheKey);
    
    if (isApiError(rawData)) return rawData; // Pass through error

    // Map nested data to clean essential format
    try {
      const essentialData: PokemonEssentialData = {
        id: rawData.id,
        name: rawData.name,
        // Prefer official artwork, fallback to front_default
        sprite: rawData.sprites?.other?.['official-artwork']?.front_default || rawData.sprites?.front_default || '',
        types: rawData.types.map((t: any) => t.type.name),
        stats: rawData.stats.map((s: any) => ({
          name: s.stat.name,
          value: s.base_stat
        })),
        abilities: rawData.abilities.map((a: any) => ({
          name: a.ability.name,
          isHidden: a.is_hidden
        }))
      };
      
      return essentialData;
    } catch (error: any) {
      return {
        error: true,
        message: 'Failed to parse Pokemon data structure'
      };
    }
  }

  /**
   * 3. Get Pokemon Species Data (Pokedex description)
   */
  public async getPokemonSpecies(idOrName: string | number): Promise<PokemonSpeciesData | ApiError> {
    const formatted = this.formatInput(idOrName);
    const endpoint = `/pokemon-species/${formatted}`;
    const cacheKey = `species_${formatted}`;

    const rawData = await this.fetchWithCache<any>(endpoint, cacheKey);
    
    if (isApiError(rawData)) return rawData;

    try {
      // Find the first english flavor text
      const flavorTextEntry = rawData.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'en'
      );
      
      // Clean up newlines/form-feeds from the raw API string
      const description = flavorTextEntry 
        ? flavorTextEntry.flavor_text.replace(/[\n\f\r]/g, ' ') 
        : 'No description available.';

      const speciesData: PokemonSpeciesData = {
        id: rawData.id,
        name: rawData.name,
        description,
        generation: rawData.generation?.name || 'unknown'
      };

      return speciesData;
    } catch (error: any) {
      return {
        error: true,
        message: 'Failed to parse Species data structure'
      };
    }
  }
}

export const pokeApi = new PokeApiService();
export default pokeApi;
