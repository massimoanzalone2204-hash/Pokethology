import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  Trash2, 
  HardDrive, 
  Gauge, 
  AlertTriangle, 
  RefreshCw, 
  ShieldAlert, 
  Sparkles, 
  Download, 
  Upload, 
  CheckCircle2, 
  Sliders, 
  Cpu, 
  Activity, 
  X,
  Swords,
  Users,
  Layers,
  Zap
} from 'lucide-react';
import { 
  getStorageUsageReport, 
  pruneOutdatedCache, 
  setCacheThresholdMB, 
  clearAllLocalCaches,
  StorageUsageReport, 
  PruneResult 
} from '../lib/cacheManager';
import { 
  getAllQuotaStatuses, 
  recordApiUsage, 
  resetQuotaUsage, 
  setCustomQuotaLimit, 
  subscribeQuotaChange,
  QuotaStatus, 
  ServiceName, 
  SERVICES_CONFIG 
} from '../lib/quotaManager';
import { idbGetAll, STORES } from '../lib/indexedDB';

interface OfflineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaySound?: (soundType: 'scan' | 'success' | 'flee' | 'hover') => void;
}

export const OfflineManagerModal: React.FC<OfflineManagerModalProps> = ({
  isOpen,
  onClose,
  onPlaySound
}) => {
  const [activeTab, setActiveTab] = useState<'cache' | 'quotas' | 'database'>('cache');
  const [report, setReport] = useState<StorageUsageReport | null>(null);
  const [quotas, setQuotas] = useState<Record<ServiceName, QuotaStatus>>(getAllQuotaStatuses());
  const [isPruning, setIsPruning] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; message: string; onConfirm: () => void }>({
    isOpen: false,
    message: '',
    onConfirm: () => {}
  });

  const handleClearAllCaches = () => {
    setConfirmModal({
      isOpen: true,
      message: "Are you sure you want to purge all cached Pokémon data and images?\n\nBattle history will not be affected.",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        await clearAllLocalCaches();
        await refreshStorageAndDB();
        showNotify("All local Pokémon data & image caches cleared.", 'warn');
      }
    });
  };

  const [pruneResult, setPruneResult] = useState<PruneResult | null>(null);
  const [dbStats, setDbStats] = useState<{
    battlesCount: number;
    favoritesCount: number;
    quizCount: number;
  }>({ battlesCount: 0, favoritesCount: 0, quizCount: 0 });

  const [customThreshold, setCustomThreshold] = useState<number>(50);
  const [quotaInputMap, setQuotaInputMap] = useState<Record<ServiceName, number>>({
    pokeapi: 1000,
    gemini_ai: 50
  });

  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'warn' | 'info' } | null>(null);
  const [isPreCaching, setIsPreCaching] = useState(false);
  const [preCacheProgress, setPreCacheProgress] = useState<{ current: number; total: number; genName: string } | null>(null);

  const handlePreCacheGen = async (start: number, end: number, genName: string) => {
    setIsPreCaching(true);
    setPreCacheProgress({ current: 0, total: end - start + 1, genName });
    showNotify(`Pre-caching ${genName} (#${start}-#${end}) into IndexedDB...`, 'info');
    try {
      const { preCachePokemonRange } = await import('../lib/cacheManager');
      const count = await preCachePokemonRange(start, end, (current, total) => {
        setPreCacheProgress({ current, total, genName });
      });
      await refreshStorageAndDB();
      showNotify(`Successfully pre-cached ${count} Pokémon from ${genName} into IndexedDB!`, 'success');
    } catch (err) {
      showNotify("Failed to pre-cache Pokémon range.", 'warn');
    } finally {
      setIsPreCaching(false);
      setPreCacheProgress(null);
    }
  };

  const refreshStorageAndDB = async () => {
    try {
      const rep = await getStorageUsageReport();
      setReport(rep);
      setCustomThreshold(rep.thresholdMB);

      // Fetch DB stats
      const battles = await idbGetAll(STORES.BATTLE_HISTORY);
      const favs = await idbGetAll(STORES.FAVORITES);
      const quiz = await idbGetAll(STORES.QUIZ_RECORDS);

      setDbStats({
        battlesCount: battles.length,
        favoritesCount: favs.length,
        quizCount: quiz.length
      });
    } catch (err) {
      console.warn("Modal status refresh error:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshStorageAndDB();
      const currentQuotas = getAllQuotaStatuses();
      setQuotas(currentQuotas);
      setQuotaInputMap({
        pokeapi: currentQuotas.pokeapi.limit,
        gemini_ai: currentQuotas.gemini_ai.limit
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const unsubscribe = subscribeQuotaChange((newQuotas) => {
      setQuotas(newQuotas);
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const showNotify = (text: string, type: 'success' | 'warn' | 'info' = 'success') => {
    setNotification({ text, type });
    if (onPlaySound) onPlaySound(type === 'success' ? 'success' : 'scan');
    setTimeout(() => setNotification(null), 4000);
  };

  const handlePruneNow = async () => {
    setIsPruning(true);
    if (onPlaySound) onPlaySound('scan');
    try {
      const res = await pruneOutdatedCache(true);
      setPruneResult(res);
      await refreshStorageAndDB();
      showNotify(`Cache Prune Complete! Freed ${(res.freedBytes / (1024 * 1024)).toFixed(2)} MB (${res.prunedPokemonCount} Pokémon entries & ${res.prunedImagesCount} image assets removed).`);
    } catch (err) {
      showNotify('Failed to prune cache.', 'warn');
    } finally {
      setIsPruning(false);
    }
  };

  

  const handleSaveThreshold = (newMB: number) => {
    setCustomThreshold(newMB);
    setCacheThresholdMB(newMB);
    refreshStorageAndDB();
    showNotify(`Local storage threshold updated to ${newMB} MB.`);
  };

  const handleSaveQuotaLimit = (service: ServiceName) => {
    const val = quotaInputMap[service];
    setCustomQuotaLimit(service, val);
    showNotify(`Updated daily ${SERVICES_CONFIG[service].name} limit to ${val}.`);
  };

  const handleResetQuotaUsage = (service: ServiceName) => {
    resetQuotaUsage(service);
    showNotify(`Reset daily usage counter for ${SERVICES_CONFIG[service].name}.`);
  };

  const handleExportBackup = async () => {
    try {
      const backupData = {
        app: 'Pokethology',
        version: 2,
        exportedAt: new Date().toISOString(),
        battleHistory: await idbGetAll(STORES.BATTLE_HISTORY),
        favorites: await idbGetAll(STORES.FAVORITES),
        quizRecords: await idbGetAll(STORES.QUIZ_RECORDS),
        localStorage: {
          battleHistory: localStorage.getItem('pokethology_battle_history'),
          favorites: localStorage.getItem('pokethology_favorites')
        }
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pokethology_offline_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotify("Exported offline data backup file successfully!");
    } catch (err) {
      showNotify("Export backup failed.", 'warn');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (data.app !== 'Pokethology') {
          throw new Error("Invalid backup file format.");
        }
        showNotify("Backup imported and offline state restored!");
        refreshStorageAndDB();
      } catch (err) {
        showNotify("Invalid backup file.", 'warn');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-slate-950/98 backdrop-blur-2xl overflow-hidden text-slate-100">
      {/* Top Header Bar */}
      <div className="shrink-0 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-slate-900/90 border-b border-cyan-500/30 z-20 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <HardDrive className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm sm:text-lg font-hud font-black text-cyan-300 tracking-wider uppercase flex items-center gap-2">
              LOCAL STORAGE & API QUOTA ENGINE
            </h2>
            <p className="text-[10px] sm:text-xs font-mono text-slate-400">
              Automated LRU Cache Pruning • Offline IndexedDB Sync • Local Quota Enforcement
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (onPlaySound) onPlaySound('hover');
            onClose();
          }}
          className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-hud font-bold uppercase tracking-wider group shadow-sm"
          title="Close (Esc)"
        >
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          <span className="hidden sm:inline">CLOSE</span>
        </button>
      </div>

      {/* Tab Selection */}
      <div className="shrink-0 flex items-center border-b border-slate-800 bg-slate-900/60 px-4 sm:px-8 pt-2 gap-2 overflow-x-auto no-scrollbar z-10">
          <button
            onClick={() => { setActiveTab('cache'); if (onPlaySound) onPlaySound('hover'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-hud font-bold tracking-wider uppercase transition-all cursor-pointer border-t border-x ${
              activeTab === 'cache'
                ? 'bg-slate-900 text-cyan-300 border-cyan-500/50 border-b-slate-900 -mb-px shadow-sm'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Gauge className="w-4 h-4 text-cyan-400" />
            <span>Automated Cache Pruning</span>
          </button>

          <button
            onClick={() => { setActiveTab('quotas'); if (onPlaySound) onPlaySound('hover'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-hud font-bold tracking-wider uppercase transition-all cursor-pointer border-t border-x ${
              activeTab === 'quotas'
                ? 'bg-slate-900 text-amber-300 border-amber-500/50 border-b-slate-900 -mb-px shadow-sm'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>Local API Quotas</span>
            {Object.values(quotas).some(q => q.isWarning || q.isCritical || q.isExceeded) && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => { setActiveTab('database'); if (onPlaySound) onPlaySound('hover'); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-hud font-bold tracking-wider uppercase transition-all cursor-pointer border-t border-x ${
              activeTab === 'database'
                ? 'bg-slate-900 text-purple-300 border-purple-500/50 border-b-slate-900 -mb-px shadow-sm'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-4 h-4 text-purple-400" />
            <span>IndexedDB Persistence</span>
          </button>
        </div>

        {/* Notification Alert Banner */}
        {notification && (
          <div className={`px-4 py-2 text-xs font-mono flex items-center justify-between transition-all ${
            notification.type === 'warn' ? 'bg-amber-950/90 text-amber-200 border-b border-amber-500/40' : 'bg-emerald-950/90 text-emerald-200 border-b border-emerald-500/40'
          }`}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 animate-spin" />
              <span>{notification.text}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-xs hover:underline">Dismiss</button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">

          {/* TAB 1: AUTOMATED CACHE PRUNING & THRESHOLD MANAGEMENT */}
          {activeTab === 'cache' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Usage Gauge Bar */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-hud font-bold uppercase tracking-wider text-slate-200">
                      Local Offline Storage Meter
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {report?.totalMB.toFixed(2)} MB / {report?.thresholdMB} MB ({report?.percentageUsed}%)
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      (report?.percentageUsed || 0) >= 90
                        ? 'bg-gradient-to-r from-amber-500 to-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]'
                        : (report?.percentageUsed || 0) >= 75
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                        : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, report?.percentageUsed || 0)}%` }}
                  />
                </div>

                {report?.isNearThreshold && (
                  <div className="flex items-center gap-2 text-[11px] font-mono text-amber-300 bg-amber-950/60 border border-amber-500/40 px-3 py-1.5 rounded-lg">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>
                      Storage usage is near limit ({report.percentageUsed}%). Auto-pruning will clear older items when threshold is reached.
                    </span>
                  </div>
                )}
              </div>

              {/* Storage Category Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-hud font-bold uppercase text-slate-400">Pokémon Data Cache</span>
                  <div className="text-base font-bold text-cyan-300 font-mono">
                    {((report?.breakdown.pokemonCacheBytes || 0) / (1024 * 1024)).toFixed(2)} MB
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {report?.breakdown.pokemonCacheItems || 0} Pokémon indexed in IndexedDB
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-hud font-bold uppercase text-slate-400">Sprites & Artwork Blobs</span>
                  <div className="text-base font-bold text-emerald-300 font-mono">
                    {((report?.breakdown.imageCacheBytes || 0) / (1024 * 1024)).toFixed(2)} MB
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {report?.breakdown.imageCacheItems || 0} cached artwork assets
                  </p>
                </div>

                

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-hud font-bold uppercase text-slate-400">Battle Logs & History</span>
                  <div className="text-base font-bold text-amber-300 font-mono">
                    {((report?.breakdown.battleHistoryBytes || 0) / 1024).toFixed(1)} KB
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {dbStats.battlesCount} saved battle telemetry records
                  </p>
                </div>
              </div>

              {/* Threshold Configurator */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-hud font-bold uppercase text-slate-200">
                      Auto-Prune Maximum Threshold Limit
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-cyan-300 font-bold">{customThreshold} MB Limit</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  When local storage reaches this threshold, Pokethology automatically runs a Least Recently Used (LRU) algorithm to prune outdated Pokémon data and images while preserving battle history and favorites.
                </p>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="15"
                    max="200"
                    step="5"
                    value={customThreshold}
                    onChange={(e) => setCustomThreshold(parseInt(e.target.value, 10))}
                    className="flex-1 accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex gap-1.5">
                    {[25, 50, 100, 150].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => handleSaveThreshold(preset)}
                        className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md border transition-all cursor-pointer ${
                          customThreshold === preset
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {preset}MB
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleSaveThreshold(customThreshold)}
                    className="px-4 py-1.5 bg-cyan-900/60 hover:bg-cyan-800 border border-cyan-500/50 text-cyan-200 text-xs font-hud font-bold uppercase rounded-lg transition-all cursor-pointer"
                  >
                    Save Threshold
                  </button>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <button
                  onClick={handlePruneNow}
                  disabled={isPruning}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-900/80 to-blue-900/80 hover:from-cyan-800 hover:to-blue-800 text-cyan-100 font-hud font-bold text-xs uppercase tracking-wider rounded-xl border border-cyan-500/60 shadow-lg cursor-pointer active:scale-95 transition-all"
                >
                  <RefreshCw className={`w-4 h-4 text-cyan-300 ${isPruning ? 'animate-spin' : ''}`} />
                  <span>{isPruning ? 'Pruning Outdated Cache...' : 'Run Auto-Prune Now (LRU)'}</span>
                </button>

                <button
                  onClick={handleClearAllCaches}
                  className="flex items-center gap-2 px-4 py-2 bg-red-950/70 hover:bg-red-900 text-red-200 font-hud font-bold text-xs uppercase tracking-wider rounded-xl border border-red-500/40 hover:border-red-500/80 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>Purge All Cache Stores</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: LOCAL API QUOTA STATE MANAGEMENT */}
          {activeTab === 'quotas' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-300">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <h3 className="text-xs font-hud font-bold uppercase tracking-wider">
                    Simulated Offline & Cloud Quota Enforcement
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  To prevent rate limiting during continuous offline use or high-frequency battle simulations, Pokethology enforces daily request quota limits locally. Usage resets automatically every 24 hours at midnight.
                </p>
              </div>

              {/* Quota Service Cards */}
              <div className="space-y-4">
                {(Object.keys(quotas) as ServiceName[]).map((serviceKey) => {
                  const q = quotas[serviceKey];
                  const cfg = SERVICES_CONFIG[serviceKey];
                  const isNear = q.isWarning || q.isCritical || q.isExceeded;

                  return (
                    <div 
                      key={serviceKey}
                      className={`bg-slate-950/80 border rounded-xl p-4 space-y-3 transition-all ${
                        q.isExceeded
                          ? 'border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                          : q.isCritical
                          ? 'border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                          : 'border-slate-800'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-hud font-bold text-slate-200 uppercase flex items-center gap-2">
                            <span>{q.name}</span>
                            {q.isExceeded && (
                              <span className="px-2 py-0.5 bg-red-950 border border-red-500/60 text-red-300 text-[9px] font-mono font-bold rounded">
                                EXCEEDED
                              </span>
                            )}
                            {q.isWarning && !q.isExceeded && (
                              <span className="px-2 py-0.5 bg-amber-950 border border-amber-500/60 text-amber-300 text-[9px] font-mono font-bold rounded">
                                WARNING ({q.percentage}%)
                              </span>
                            )}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-sans mt-0.5">{cfg.description}</p>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-mono font-bold text-cyan-300">
                            {q.used} / {q.limit} {cfg.unitName}
                          </span>
                          <p className="text-[10px] text-slate-500 font-mono">
                            Resets in {q.resetTimeFormatted}
                          </p>
                        </div>
                      </div>

                      {/* Meter Bar */}
                      <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            q.isExceeded
                              ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                              : q.isCritical
                              ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                              : q.isWarning
                              ? 'bg-yellow-400'
                              : 'bg-emerald-400'
                          }`}
                          style={{ width: `${q.percentage}%` }}
                        />
                      </div>

                      {/* Limit Adjuster & Manual Increments */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900/80">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-slate-400">Daily Limit:</span>
                          <input
                            type="number"
                            min="5"
                            max="50000"
                            value={quotaInputMap[serviceKey] || q.limit}
                            onChange={(e) => setQuotaInputMap({ ...quotaInputMap, [serviceKey]: parseInt(e.target.value, 10) || 10 })}
                            className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                          />
                          <button
                            onClick={() => handleSaveQuotaLimit(serviceKey)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono rounded border border-slate-700 transition-all cursor-pointer"
                          >
                            Update
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              recordApiUsage(serviceKey, 1);
                              showNotify(`Simulated 1 ${cfg.unitName} request to ${cfg.name}.`);
                            }}
                            className="px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono rounded transition-all cursor-pointer"
                          >
                            + Sim Request
                          </button>
                          <button
                            onClick={() => handleResetQuotaUsage(serviceKey)}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 text-[11px] font-mono rounded transition-all cursor-pointer"
                          >
                            Reset Counter
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: INDEXEDDB LOCAL PERSISTENCE & SYNC ENGINE */}
          {activeTab === 'database' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-slate-950/80 border border-purple-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-purple-300">
                  <Database className="w-4 h-4 shrink-0" />
                  <h3 className="text-xs font-hud font-bold uppercase tracking-wider">
                    Full Local IndexedDB Sync Engine
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Pokethology operates as a fully offline-capable web application. All battle telemetry records and theological quiz stats are synchronized automatically to IndexedDB store <code className="text-purple-300 font-mono">PokethologyDB (v2)</code>.
                </p>
              </div>

              {/* Database Store Counters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-hud font-bold text-amber-300 uppercase flex items-center gap-2">
                      <Swords className="w-4 h-4 text-amber-400" />
                      Battle History Telemetry
                    </span>
                    <span className="px-2 py-0.5 bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold rounded">
                      {dbStats.battlesCount} Logs
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Detailed turn-by-turn battle logs, damage stats, and win/loss records.
                  </p>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-hud font-bold text-pink-300 uppercase flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      Favorite Pokémon List
                    </span>
                    <span className="px-2 py-0.5 bg-pink-950 border border-pink-500/40 text-pink-300 text-xs font-mono font-bold rounded">
                      {dbStats.favoritesCount} Favorites
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Quick access favorites list stored locally in IndexedDB.
                  </p>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-hud font-bold text-emerald-300 uppercase flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Lore Quiz Records
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold rounded">
                      {dbStats.quizCount} Daily Exams
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Pokethology daily theological lore exam scores, streaks, and answered logs.
                  </p>
                </div>
              </div>

              {/* Bulk Offline Pre-caching Section */}
              <div className="bg-slate-950/80 border border-cyan-500/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-hud font-bold uppercase text-cyan-300 flex items-center gap-2">
                    <Download className="w-4 h-4 text-cyan-400" />
                    Bulk Pre-cache Generations for Offline Browsing
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    IndexedDB Local Storage
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Download Pokémon data, stats, movesets, and official artwork into your local IndexedDB database so you can browse the entire Pokédex even when offline without an internet connection.
                </p>

                {isPreCaching && preCacheProgress && (
                  <div className="space-y-1.5 p-3 bg-cyan-950/50 border border-cyan-500/40 rounded-lg">
                    <div className="flex justify-between text-[11px] font-mono text-cyan-300">
                      <span>Pre-caching {preCacheProgress.genName}...</span>
                      <span>{preCacheProgress.current} / {preCacheProgress.total} ({Math.round((preCacheProgress.current / preCacheProgress.total) * 100)}%)</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-cyan-500/30">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
                        style={{ width: `${(preCacheProgress.current / preCacheProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    disabled={isPreCaching}
                    onClick={() => handlePreCacheGen(1, 151, 'Gen 1 Kanto')}
                    className="px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    + Pre-cache Gen 1 (#1-151)
                  </button>
                  <button
                    disabled={isPreCaching}
                    onClick={() => handlePreCacheGen(152, 251, 'Gen 2 Johto')}
                    className="px-3 py-1.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-200 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    + Pre-cache Gen 2 (#152-251)
                  </button>
                  <button
                    disabled={isPreCaching}
                    onClick={() => handlePreCacheGen(252, 386, 'Gen 3 Hoenn')}
                    className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    + Pre-cache Gen 3 (#252-386)
                  </button>
                  <button
                    disabled={isPreCaching}
                    onClick={() => handlePreCacheGen(1, 50, 'Top 50 Starters')}
                    className="px-3 py-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-200 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    + Pre-cache Top 50
                  </button>
                </div>
              </div>

              {/* Offline Backup Export / Import */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-hud font-bold uppercase text-slate-200 flex items-center gap-2">
                  <Download className="w-4 h-4 text-purple-400" />
                  Offline Data Backup & Restore
                </h4>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Export your full IndexedDB database (battle history, quiz scores, favorites) into a single portable JSON file, or restore from a previous backup.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleExportBackup}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-200 text-xs font-hud font-bold uppercase rounded-lg transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export JSON Backup</span>
                  </button>

                  <label className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-hud font-bold uppercase rounded-lg transition-all cursor-pointer">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span>Import JSON Backup</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>IndexedDB Engine Active • PokethologyDB v2</span>
          </div>

          <button
            onClick={() => {
              if (onPlaySound) onPlaySound('hover');
              onClose();
            }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-hud font-bold uppercase rounded-lg transition-all cursor-pointer"
          >
            Close Engine Modal
          </button>
        </div>

      </div>
  );
};
