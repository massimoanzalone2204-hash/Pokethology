// Unified IndexedDB Storage Engine for Pokethology
// Manages local offline persistence for Pokémon data, image blobs, user teams, battle history, quiz logs, and quota telemetry.

export const DB_NAME = 'PokethologyDB';
export const DB_VERSION = 2;

export const STORES = {
  POKEMON_CACHE: 'pokemon_cache',
  IMAGE_CACHE: 'image_cache',
  USER_TEAMS: 'user_teams',
  BATTLE_HISTORY: 'battle_history',
  FAVORITES: 'favorites',
  QUIZ_RECORDS: 'quiz_records',
  QUOTA_LOGS: 'quota_logs'
} as const;

export type StoreName = typeof STORES[keyof typeof STORES];

let dbPromise: Promise<IDBDatabase> | null = null;

export function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = request.result;

      // 1. Pokémon Data Cache
      if (!db.objectStoreNames.contains(STORES.POKEMON_CACHE)) {
        const pStore = db.createObjectStore(STORES.POKEMON_CACHE, { keyPath: 'key' });
        pStore.createIndex('lastAccessed', 'lastAccessed', { unique: false });
        pStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // 2. Image Blob Cache (Sprites & Artwork)
      if (!db.objectStoreNames.contains(STORES.IMAGE_CACHE)) {
        const imgStore = db.createObjectStore(STORES.IMAGE_CACHE, { keyPath: 'url' });
        imgStore.createIndex('lastAccessed', 'lastAccessed', { unique: false });
        imgStore.createIndex('size', 'size', { unique: false });
      }

      // 3. User Teams
      if (!db.objectStoreNames.contains(STORES.USER_TEAMS)) {
        const teamStore = db.createObjectStore(STORES.USER_TEAMS, { keyPath: 'id' });
        teamStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      // 4. Battle History & Telemetry
      if (!db.objectStoreNames.contains(STORES.BATTLE_HISTORY)) {
        const battleStore = db.createObjectStore(STORES.BATTLE_HISTORY, { keyPath: 'id' });
        battleStore.createIndex('date', 'date', { unique: false });
      }

      // 5. Favorites
      if (!db.objectStoreNames.contains(STORES.FAVORITES)) {
        db.createObjectStore(STORES.FAVORITES, { keyPath: 'id' });
      }

      // 6. Pokethology Quiz Records
      if (!db.objectStoreNames.contains(STORES.QUIZ_RECORDS)) {
        db.createObjectStore(STORES.QUIZ_RECORDS, { keyPath: 'date' });
      }

      // 7. API Quota Telemetry Logs
      if (!db.objectStoreNames.contains(STORES.QUOTA_LOGS)) {
        const qStore = db.createObjectStore(STORES.QUOTA_LOGS, { keyPath: 'id' });
        qStore.createIndex('service_date', ['service', 'dateStr'], { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

// --- Generic Helper Methods ---

export async function idbGet<T = any>(storeName: StoreName, key: string | number): Promise<T | null> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? (req.result.data !== undefined ? req.result.data : req.result) : null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IndexedDB idbGet failed for ${storeName}:${key}`, err);
    return null;
  }
}

export async function idbSet<T = any>(storeName: StoreName, value: T): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(value);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IndexedDB idbSet failed for store ${storeName}`, err);
  }
}

export async function idbGetAll<T = any>(storeName: StoreName): Promise<T[]> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IndexedDB idbGetAll failed for ${storeName}`, err);
    return [];
  }
}

export async function idbDelete(storeName: StoreName, key: string | number): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IndexedDB idbDelete failed for ${storeName}:${key}`, err);
  }
}

export async function idbClear(storeName: StoreName): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IndexedDB idbClear failed for ${storeName}`, err);
  }
}

export async function idbCount(storeName: StoreName): Promise<number> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.count();
      req.onsuccess = () => resolve(req.result || 0);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    return 0;
  }
}

export async function getStoreByteSize(storeName: StoreName): Promise<number> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => {
        const items = req.result || [];
        let totalBytes = 0;
        for (const item of items) {
          if (item.size && typeof item.size === 'number') {
            totalBytes += item.size;
          } else if (item.blob instanceof Blob) {
            totalBytes += item.blob.size;
          } else {
            try {
              totalBytes += new Blob([JSON.stringify(item)]).size;
            } catch (_) {
              totalBytes += 1000;
            }
          }
        }
        resolve(totalBytes);
      };
      req.onerror = () => resolve(0);
    });
  } catch (_) {
    return 0;
  }
}

export async function getAllCachedPokemonData(): Promise<any[]> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.POKEMON_CACHE, 'readonly');
      const store = tx.objectStore(STORES.POKEMON_CACHE);
      const req = store.getAll();
      req.onsuccess = () => {
        const items = req.result || [];
        resolve(items.map(item => item.data).filter(Boolean));
      };
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    console.warn("Failed to retrieve cached pokemon data", err);
    return [];
  }
}

