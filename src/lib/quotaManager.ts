// API Quota State Management System
// Tracks local API request counters for PokeAPI and Gemini AI Strategy services.
// Provides local quota limits, warning thresholds, daily auto-resets, and offline cloud simulation.

export type ServiceName = 'pokeapi' | 'gemini_ai';

export interface ServiceQuotaConfig {
  name: string;
  service: ServiceName;
  defaultLimit: number;
  description: string;
  unitName: string;
}

export const SERVICES_CONFIG: Record<ServiceName, ServiceQuotaConfig> = {
  pokeapi: {
    name: 'PokeAPI Requests',
    service: 'pokeapi',
    defaultLimit: 1000,
    description: 'Pokémon dex queries, move statistics, and sprite asset requests',
    unitName: 'Requests'
  },
  gemini_ai: {
    name: 'Gemini AI Lore & Strategy',
    service: 'gemini_ai',
    defaultLimit: 50,
    description: 'AI battle suggestions, theological lore generation, and team synergy diagnostics',
    unitName: 'Prompts'
  }
};

export interface QuotaStatus {
  service: ServiceName;
  name: string;
  used: number;
  limit: number;
  remaining: number;
  percentage: number;
  isWarning: boolean; // >= 75%
  isCritical: boolean; // >= 90%
  isExceeded: boolean; // >= 100%
  resetTimeFormatted: string;
  dateStr: string;
}

const QUOTA_STORAGE_KEY = 'pokethology_api_quota_v1';
const CUSTOM_LIMITS_KEY = 'pokethology_custom_quota_limits';

type QuotaListener = (status: Record<ServiceName, QuotaStatus>) => void;
const listeners: Set<QuotaListener> = new Set();

export function subscribeQuotaChange(listener: QuotaListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  const status = getAllQuotaStatuses();
  listeners.forEach(fn => {
    try { fn(status); } catch (_) {}
  });
}

export function getTodayDateStr(): string {
  return new Date().toISOString().split('T')[0];
}

interface StoredQuotaData {
  dateStr: string;
  counts: Record<ServiceName, number>;
}

function getStoredLimits(): Record<ServiceName, number> {
  const custom = localStorage.getItem(CUSTOM_LIMITS_KEY);
  if (custom) {
    try {
      const parsed = JSON.parse(custom);
      return {
        pokeapi: parsed.pokeapi || SERVICES_CONFIG.pokeapi.defaultLimit,
        gemini_ai: parsed.gemini_ai || SERVICES_CONFIG.gemini_ai.defaultLimit
      };
    } catch (_) {}
  }
  return {
    pokeapi: SERVICES_CONFIG.pokeapi.defaultLimit,
    gemini_ai: SERVICES_CONFIG.gemini_ai.defaultLimit
  };
}

export function setCustomQuotaLimit(service: ServiceName, newLimit: number): void {
  const current = getStoredLimits();
  current[service] = Math.max(5, Math.min(100000, newLimit));
  localStorage.setItem(CUSTOM_LIMITS_KEY, JSON.stringify(current));
  notifyListeners();
}

function getStoredQuotaData(): StoredQuotaData {
  const today = getTodayDateStr();
  const raw = localStorage.getItem(QUOTA_STORAGE_KEY);
  
  if (raw) {
    try {
      const parsed: StoredQuotaData = JSON.parse(raw);
      if (parsed.dateStr === today) {
        return {
          dateStr: today,
          counts: {
            pokeapi: parsed.counts?.pokeapi || 0,
            gemini_ai: parsed.counts?.gemini_ai || 0
          }
        };
      }
    } catch (_) {}
  }

  // Daily Reset cycle
  const resetData: StoredQuotaData = {
    dateStr: today,
    counts: { pokeapi: 0, gemini_ai: 0 }
  };
  localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(resetData));
  return resetData;
}

export function getQuotaStatus(service: ServiceName): QuotaStatus {
  const stored = getStoredQuotaData();
  const limits = getStoredLimits();
  const config = SERVICES_CONFIG[service];

  const used = stored.counts[service] || 0;
  const limit = limits[service] || config.defaultLimit;
  const remaining = Math.max(0, limit - used);
  const percentage = Math.min(100, Math.round((used / limit) * 100));

  // Time remaining until local midnight reset
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const diffMs = midnight.getTime() - now.getTime();
  const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
  const minsLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const resetTimeFormatted = `${hoursLeft}h ${minsLeft}m`;

  return {
    service,
    name: config.name,
    used,
    limit,
    remaining,
    percentage,
    isWarning: percentage >= 75 && percentage < 90,
    isCritical: percentage >= 90 && percentage < 100,
    isExceeded: percentage >= 100,
    resetTimeFormatted,
    dateStr: stored.dateStr
  };
}

export function getAllQuotaStatuses(): Record<ServiceName, QuotaStatus> {
  return {
    pokeapi: getQuotaStatus('pokeapi'),
    gemini_ai: getQuotaStatus('gemini_ai')
  };
}

export function recordApiUsage(service: ServiceName, incrementBy: number = 1): QuotaStatus {
  const stored = getStoredQuotaData();
  stored.counts[service] = (stored.counts[service] || 0) + incrementBy;
  localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(stored));

  notifyListeners();
  return getQuotaStatus(service);
}

export function checkQuotaAllowed(service: ServiceName): { allowed: boolean; status: QuotaStatus } {
  const status = getQuotaStatus(service);
  return {
    allowed: true,
    status
  };
}

export function resetQuotaUsage(service?: ServiceName): void {
  const stored = getStoredQuotaData();
  if (service) {
    stored.counts[service] = 0;
  } else {
    stored.counts = { pokeapi: 0, gemini_ai: 0 };
  }
  localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(stored));
  notifyListeners();
}
