import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export interface QuotaData {
  requestsToday: number;
  dailyCapacity: number;
  rpm: number;
  rpmLimit: number;
  percentUsed: number;
  percentRemaining: number;
  isQuotaExhausted: boolean;
  cooldownSecondsRemaining: number;
  timeUntilDailyReset: string;
  resetTimestampMs: number;
  hasCustomApiKey?: boolean;
}

interface ApiQuotaMonitorProps {
  quotaLimitReached: boolean;
  onQuotaLimitChange?: (exhausted: boolean) => void;
  compact?: boolean;
}

export const ApiQuotaMonitor: React.FC<ApiQuotaMonitorProps> = ({
  quotaLimitReached,
  onQuotaLimitChange,
  compact = false
}) => {
  const [quotaData, setQuotaData] = useState<QuotaData>({
    requestsToday: 18,
    dailyCapacity: 1500,
    rpm: 1,
    rpmLimit: 15,
    percentUsed: 1,
    percentRemaining: 99,
    isQuotaExhausted: quotaLimitReached,
    cooldownSecondsRemaining: quotaLimitReached ? 60 : 0,
    timeUntilDailyReset: '23h 59m 59s',
    resetTimestampMs: Date.now() + 86400000,
    hasCustomApiKey: true
  });

  const [cooldownSec, setCooldownSec] = useState<number>(quotaData.cooldownSecondsRemaining || 0);
  const [liveCountdown, setLiveCountdown] = useState<string>('');

  // Sync prop changes
  useEffect(() => {
    if (quotaLimitReached !== quotaData.isQuotaExhausted) {
      setQuotaData(prev => ({
        ...prev,
        isQuotaExhausted: quotaLimitReached
      }));
    }
  }, [quotaLimitReached]);

  // Fetch real-time quota metrics from backend
  const refreshQuota = useCallback(async () => {
    try {
      const res = await fetch('/api/quota');
      if (res.ok) {
        const data: QuotaData = await res.json();
        setQuotaData(data);
        const isTruly100PercentExhausted = data.isQuotaExhausted || data.requestsToday >= data.dailyCapacity || data.percentUsed >= 100;
        if (isTruly100PercentExhausted !== quotaLimitReached && onQuotaLimitChange) {
          onQuotaLimitChange(isTruly100PercentExhausted);
        }
        if (data.cooldownSecondsRemaining > 0) {
          setCooldownSec(data.cooldownSecondsRemaining);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch quota metrics:", err);
    }
  }, [quotaLimitReached, onQuotaLimitChange]);

  useEffect(() => {
    refreshQuota();
    const interval = setInterval(refreshQuota, 2500);
    
    const handleEvent = () => {
      refreshQuota();
    };
    
    window.addEventListener('api-quota-update', handleEvent);
    return () => {
      clearInterval(interval);
      window.removeEventListener('api-quota-update', handleEvent);
    };
  }, [refreshQuota]);

  // Live 1-second ticker for reset & cooldown countdown
  useEffect(() => {
    const updateTick = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setUTCHours(24, 0, 0, 0);
      const diffMs = Math.max(0, tomorrow.getTime() - now.getTime());
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      setLiveCountdown(`${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`);

      setCooldownSec(prev => (prev <= 1 ? 0 : prev - 1));
    };

    updateTick();
    const timer = setInterval(updateTick, 1000);
    return () => clearInterval(timer);
  }, []);

  const isExhausted = quotaData.isQuotaExhausted || cooldownSec > 0;
  const remainingReqs = Math.max(0, quotaData.dailyCapacity - quotaData.requestsToday);
  
  // Calculate exact conscientious bar fill width (at least 1% if requests > 0 so user sees subtle fill)
  const actualPercentUsed = Math.min(100, Math.round((quotaData.requestsToday / quotaData.dailyCapacity) * 100));
  const displayBarPercent = Math.min(100, Math.max(quotaData.requestsToday > 0 ? 1 : 0, actualPercentUsed));

  let barColorClass = "bg-gradient-to-r from-cyan-500 to-emerald-400";
  let statusTextColor = "text-emerald-400";
  
  if (isExhausted) {
    barColorClass = "bg-gradient-to-r from-amber-500 to-rose-500 animate-pulse";
    statusTextColor = "text-amber-400";
  } else if (actualPercentUsed > 80) {
    barColorClass = "bg-gradient-to-r from-amber-500 to-orange-400";
    statusTextColor = "text-amber-400";
  }

  if (compact) {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex justify-between items-center text-[9px]">
          <span className="font-hud uppercase tracking-wider text-cyan-300 flex items-center gap-1 font-bold">
            <Activity className="w-3 h-3 text-cyan-400" />
            API Quota & Rate Limit
          </span>
          <span className={cn("font-mono font-bold", statusTextColor)}>
            {isExhausted ? `Cooldown (${cooldownSec}s) • ${actualPercentUsed}% Used` : `${100 - actualPercentUsed}% Left (${remainingReqs})`}
          </span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div 
            className={cn("h-full transition-all duration-500 rounded-full", barColorClass)}
            style={{ width: `${displayBarPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[8px] font-mono text-slate-400">
          <span>RPM: {quotaData.rpm}/{quotaData.rpmLimit}</span>
          <span className="text-cyan-400">Reset: {isExhausted ? `${cooldownSec}s` : liveCountdown}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 pt-3 pb-1 border-t border-cyan-900/40 text-left w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-1.5">
          <div className={cn("w-2 h-2 rounded-full", isExhausted ? "bg-amber-500 animate-ping" : "bg-emerald-400 animate-pulse")} />
          <span className="text-cyan-300 font-hud uppercase text-[9.5px] font-bold tracking-widest flex items-center gap-1">
            API Quota & Rate Limit (Gemini 2.5 Flash-Lite)
          </span>
        </div>
        <span className={cn("text-[8.5px] font-mono font-bold", statusTextColor)}>
          {isExhausted ? `RATE LIMITED (${cooldownSec}s) • ${actualPercentUsed}% USED` : `${actualPercentUsed}% Used (${100 - actualPercentUsed}% / ${remainingReqs} req left)`}
        </span>
      </div>

      <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800 p-0.5">
        <motion.div 
          className={cn("h-full transition-all duration-500 rounded-full", barColorClass)}
          initial={{ width: '0%' }}
          animate={{ width: `${displayBarPercent}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-[8px] font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <Zap className="w-2.5 h-2.5 text-cyan-400" />
          Usage: {quotaData.requestsToday}/{quotaData.dailyCapacity} req ({actualPercentUsed}%) • RPM: {quotaData.rpm}/{quotaData.rpmLimit}
        </span>
        <span className="text-cyan-400 flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          Reset: {isExhausted ? `${cooldownSec}s cooldown` : liveCountdown}
        </span>
      </div>
    </div>
  );
};
