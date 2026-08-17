// Automated Cache Management Strategy for Pokethology
// Monitors local storage consumption across IndexedDB, Cache Storage, and localStorage.
// Automatically prunes outdated Pokémon data & image blobs when usage reaches defined thresholds.

import { 
  STORES, 
  getDB, 
  idbGet, 
  idbSet, 
  idbDelete, 
  getStoreByteSize,
  getAllCachedPokemonData
} from './indexedDB';
import { pokeApi } from './pokeApiService';

export interface StorageUsageReport {
  totalBytes: number;
  totalMB: number;
  thresholdMB: number;
  percentageUsed: number;
  breakdown: {
    pokemonCacheBytes: number;
    pokemonCacheItems: number;
    imageCacheBytes: number;
    imageCacheItems: number;
    battleHistoryBytes: number;
    battleHistoryCount: number;
    localStorageBytes: number;
  };
  isNearThreshold: boolean;
  isOverThreshold: boolean;
}

export interface PruneResult {
  prunedPokemonCount: number;
  prunedImagesCount: number;
  freedBytes: number;
  freedMB: number;
  remainingBytes: number;
  remainingMB: number;
  timestamp: number;
}

const DEFAULT_THRESHOLD_MB = 50; // Default 50 MB local cache limit
const THRESHOLD_KEY = 'pokethology_cache_threshold_mb';
const LAST_PRUNE_KEY = 'pokethology_last_cache_prune_time';

export function getCacheThresholdMB(): number {
  const saved = localStorage.getItem(THRESHOLD_KEY);
  if (saved) {
    const parsed = parseFloat(saved);
    if (!isNaN(parsed) && parsed >= 10 && parsed <= 500) {
      return parsed;
    }
  }
  return DEFAULT_THRESHOLD_MB;
}

export function setCacheThresholdMB(limitMB: number): void {
  const sanitized = Math.max(10, Math.min(500, limitMB));
  localStorage.setItem(THRESHOLD_KEY, sanitized.toString());
}

/**
 * Calculates current local storage usage across IndexedDB and localStorage
 */
export async function getStorageUsageReport(): Promise<StorageUsageReport> {
  const thresholdMB = getCacheThresholdMB();
  const thresholdBytes = thresholdMB * 1024 * 1024;

  let pokemonCacheBytes = 0;
  let pokemonCacheItems = 0;
  let imageCacheBytes = 0;
  let imageCacheItems = 0;
  let battleHistoryBytes = 0;
  let battleHistoryCount = 0;

  try {
    const db = await getDB();
    
    // 1. Pokémon Data Store
    const pTx = db.transaction(STORES.POKEMON_CACHE, 'readonly');
    const pStore = pTx.objectStore(STORES.POKEMON_CACHE);
    const pReq = pStore.getAll();
    await new Promise<void>((res) => {
      pReq.onsuccess = () => {
        const items = pReq.result || [];
        pokemonCacheItems = items.length;
        for (const item of items) {
          pokemonCacheBytes += item.size || 2000;
        }
        res();
      };
      pReq.onerror = () => res();
    });

    // 2. Image Store
    const imgTx = db.transaction(STORES.IMAGE_CACHE, 'readonly');
    const imgStore = imgTx.objectStore(STORES.IMAGE_CACHE);
    const imgReq = imgStore.getAll();
    await new Promise<void>((res) => {
      imgReq.onsuccess = () => {
        const items = imgReq.result || [];
        imageCacheItems = items.length;
        for (const item of items) {
          imageCacheBytes += item.size || (item.blob ? item.blob.size : 5000);
        }
        res();
      };
      imgReq.onerror = () => res();
    });

    // 4. Battle History
    battleHistoryBytes = await getStoreByteSize(STORES.BATTLE_HISTORY);
    const battlesList: any[] = (await idbGet(STORES.BATTLE_HISTORY, 'all_list')) || [];
    battleHistoryCount = Array.isArray(battlesList) ? battlesList.length : 0;

  } catch (err) {
    console.warn("Storage report calculation warning:", err);
  }

  // 5. localStorage calculation
  let localStorageBytes = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const val = localStorage.getItem(key) || '';
        localStorageBytes += (key.length + val.length) * 2; // UTF-16 approx 2 bytes/char
      }
    }
  } catch (_) {}

  const totalBytes = pokemonCacheBytes + imageCacheBytes + battleHistoryBytes + localStorageBytes;
  const totalMB = totalBytes / (1024 * 1024);
  const percentageUsed = Math.min(100, Math.round((totalBytes / thresholdBytes) * 100));

  return {
    totalBytes,
    totalMB,
    thresholdMB,
    percentageUsed,
    breakdown: {
      pokemonCacheBytes,
      pokemonCacheItems,
      imageCacheBytes,
      imageCacheItems,
      battleHistoryBytes,
      battleHistoryCount,
      localStorageBytes
    },
    isNearThreshold: percentageUsed >= 80,
    isOverThreshold: totalBytes >= thresholdBytes
  };
}

/**
 * Executes automated pruning of oldest cached Pokémon and image blobs (LRU strategy)
 * Target usage after pruning is 70% of maximum threshold MB.
 */
export async function pruneOutdatedCache(force: boolean = false): Promise<PruneResult> {
  const report = await getStorageUsageReport();
  const thresholdBytes = report.thresholdMB * 1024 * 1024;
  const targetMaxBytes = thresholdBytes * 0.70; // Reduce down to 70% capacity

  let freedBytes = 0;
  let prunedPokemonCount = 0;
  let prunedImagesCount = 0;

  if (!force && report.totalBytes < thresholdBytes) {
    return {
      prunedPokemonCount: 0,
      prunedImagesCount: 0,
      freedBytes: 0,
      freedMB: 0,
      remainingBytes: report.totalBytes,
      remainingMB: report.totalMB,
      timestamp: Date.now()
    };
  }

  try {
    const db = await getDB();

    // Collect all Pokémon cache entries sorted by lastAccessed ascending (LRU)
    let pItems: any[] = [];
    await new Promise<void>((res) => {
      const tx = db.transaction(STORES.POKEMON_CACHE, 'readonly');
      const store = tx.objectStore(STORES.POKEMON_CACHE);
      const req = store.getAll();
      req.onsuccess = () => {
        pItems = req.result || [];
        res();
      };
      req.onerror = () => res();
    });

    pItems.sort((a, b) => (a.lastAccessed || 0) - (b.lastAccessed || 0));

    // Collect all Image cache entries sorted by lastAccessed ascending
    let imgItems: any[] = [];
    await new Promise<void>((res) => {
      const tx = db.transaction(STORES.IMAGE_CACHE, 'readonly');
      const store = tx.objectStore(STORES.IMAGE_CACHE);
      const req = store.getAll();
      req.onsuccess = () => {
        imgItems = req.result || [];
        res();
      };
      req.onerror = () => res();
    });

    imgItems.sort((a, b) => (a.lastAccessed || 0) - (b.lastAccessed || 0));

    let currentBytes = report.totalBytes;

    // Phase 1: Delete oldest Pokémon data cache entries
    for (const pItem of pItems) {
      if (currentBytes <= targetMaxBytes && !force) break;
      await idbDelete(STORES.POKEMON_CACHE, pItem.key);
      const itemSize = pItem.size || 2000;
      freedBytes += itemSize;
      currentBytes -= itemSize;
      prunedPokemonCount++;
    }

    // Phase 2: Delete oldest Image cache entries if still over target
    for (const imgItem of imgItems) {
      if (currentBytes <= targetMaxBytes && !force) break;
      await idbDelete(STORES.IMAGE_CACHE, imgItem.url);
      const imgSize = imgItem.size || (imgItem.blob ? imgItem.blob.size : 5000);
      freedBytes += imgSize;
      currentBytes -= imgSize;
      prunedImagesCount++;
    }

    localStorage.setItem(LAST_PRUNE_KEY, Date.now().toString());

  } catch (err) {
    console.error("Cache pruning error:", err);
  }

  const finalReport = await getStorageUsageReport();

  return {
    prunedPokemonCount,
    prunedImagesCount,
    freedBytes,
    freedMB: freedBytes / (1024 * 1024),
    remainingBytes: finalReport.totalBytes,
    remainingMB: finalReport.totalMB,
    timestamp: Date.now()
  };
}

/**
 * Stores Pokémon data in IndexedDB with lastAccessed timestamp & auto-prune check
 */
export async function savePokemonToCache(key: string, data: any): Promise<void> {
  try {
    const jsonStr = JSON.stringify(data);
    const size = new Blob([jsonStr]).size;
    const now = Date.now();

    const record = {
      key,
      data,
      size,
      timestamp: now,
      lastAccessed: now
    };

    await idbSet(STORES.POKEMON_CACHE, record);

    // Run a fast lightweight threshold check in the background
    setTimeout(() => {
      getStorageUsageReport().then(report => {
        if (report.isOverThreshold) {
          pruneOutdatedCache(false);
        }
      }).catch(() => {});
    }, 1000);

  } catch (err) {
    console.warn("Error saving to Pokémon cache:", err);
  }
}

/**
 * Fetches Pokémon data from IndexedDB cache and updates lastAccessed
 */
export async function getPokemonFromCache(key: string): Promise<any | null> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.POKEMON_CACHE, 'readwrite');
      const store = tx.objectStore(STORES.POKEMON_CACHE);
      const req = store.get(key);

      req.onsuccess = () => {
        const item = req.result;
        if (!item) {
          resolve(null);
          return;
        }

        // Update lastAccessed timestamp for LRU priority
        item.lastAccessed = Date.now();
        store.put(item);
        resolve(item.data);
      };

      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

/**
 * Caches sprite/artwork image blob for offline loading
 */
export async function saveImageBlobToCache(url: string, blob: Blob): Promise<void> {
  try {
    const now = Date.now();
    const record = {
      url,
      blob,
      size: blob.size,
      timestamp: now,
      lastAccessed: now
    };
    await idbSet(STORES.IMAGE_CACHE, record);
  } catch (err) {
    console.warn("Failed to cache image blob:", err);
  }
}

/**
 * Retrieves cached image blob URL for offline rendering
 */
export async function getCachedImageUrl(url: string): Promise<string | null> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.IMAGE_CACHE, 'readwrite');
      const store = tx.objectStore(STORES.IMAGE_CACHE);
      const req = store.get(url);

      req.onsuccess = () => {
        const item = req.result;
        if (!item || !item.blob) {
          resolve(null);
          return;
        }

        item.lastAccessed = Date.now();
        store.put(item);
        const objectUrl = URL.createObjectURL(item.blob);
        resolve(objectUrl);
      };

      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

/**
 * Emergency purge of all cached data
 */
export async function clearAllLocalCaches(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction([STORES.POKEMON_CACHE, STORES.IMAGE_CACHE], 'readwrite');
  tx.objectStore(STORES.POKEMON_CACHE).clear();
  tx.objectStore(STORES.IMAGE_CACHE).clear();

  // Clear PokeAPI localStorage caches
  try {
    pokeApi.clearCache();
  } catch (e) {
    console.warn("Failed to clear localStorage caches", e);
  }
}

/**
 * Searches IndexedDB for a cached Pokémon matching exact or partial query
 */
export async function searchOfflinePokemon(query: string): Promise<any | null> {
  try {
    const formatted = query.toLowerCase().trim();
    if (!formatted) return null;

    const all = await getAllCachedPokemonData();
    if (!all || all.length === 0) return null;

    // 1. Exact match on name
    let match = all.find((p: any) => p.name?.toLowerCase() === formatted);
    if (match) return match;

    // 2. Exact match on ID
    const numId = parseInt(formatted, 10);
    if (!isNaN(numId)) {
      match = all.find((p: any) => p.id === numId || p.baseId === numId);
      if (match) return match;
    }

    // 3. Partial name match (ignoring mega/gmax unless requested)
    const wantsMega = formatted.includes('mega');
    const wantsGmax = formatted.includes('gmax') || formatted.includes('gigantamax');
    match = all.find((p: any) => {
      const nameLower = p.name?.toLowerCase() || '';
      if (!nameLower.includes(formatted)) return false;
      if (!wantsMega && nameLower.includes('-mega')) return false;
      if (!wantsGmax && nameLower.includes('-gmax')) return false;
      return true;
    });
    if (match) return match;

    return null;
  } catch (err) {
    console.warn("Offline pokemon search failed:", err);
    return null;
  }
}

/**
 * Retrieves list of all cached Pokémon in IndexedDB formatted for list views
 */
export async function getOfflinePokemonList(): Promise<{ name: string; url: string; displayId?: number; isForm?: boolean; isOfflineCached?: boolean; types?: string[] }[]> {
  try {
    const all = await getAllCachedPokemonData();
    const seen = new Set<string>();
    const list: any[] = [];

    for (const p of all) {
      if (!p || !p.name || seen.has(p.name)) continue;
      seen.add(p.name);
      list.push({
        name: p.name,
        url: `https://pokeapi.co/api/v2/pokemon/${p.id || p.name}`,
        displayId: p.displayId || p.id || 1,
        isForm: p.isForm || false,
        isOfflineCached: true,
        types: p.types?.map((t: any) => typeof t === 'string' ? t : t?.type?.name) || []
      });
    }

    list.sort((a, b) => (a.displayId || 0) - (b.displayId || 0));
    return list;
  } catch (err) {
    console.warn("Failed to generate offline pokemon list:", err);
    return [];
  }
}

/**
 * Pre-caches a range of Pokémon and their official artwork images into IndexedDB for offline browsing
 */
export async function preCachePokemonRange(
  start: number, 
  end: number, 
  onProgress?: (current: number, total: number) => void
): Promise<number> {
  let count = 0;
  const total = end - start + 1;
  const { searchPokemon } = await import('./api');

  for (let id = start; id <= end; id++) {
    try {
      const data = await searchPokemon(id.toString(), 'en');
      if (data) {
        count++;
        // Pre-cache artwork sprite image blob into IndexedDB if available
        const artworkUrl = data.sprites?.other?.['official-artwork']?.front_default || data.sprites?.front_default;
        if (artworkUrl) {
          try {
            const res = await fetch(artworkUrl);
            if (res.ok) {
              const blob = await res.blob();
              await saveImageBlobToCache(artworkUrl, blob);
            }
          } catch (_) {}
        }
      }
    } catch (err) {
      console.warn(`Failed to pre-cache pokemon #${id}:`, err);
    }
    if (onProgress) {
      onProgress(id - start + 1, total);
    }
  }
  return count;
}


