import { idbGetAll, idbClear, STORES } from "../lib/indexedDB";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  XCircle, 
  Clock, 
  Flame, 
  Droplet, 
  Zap, 
  Shield, 
  Swords, 
  Sprout, 
  Sparkles, 
  Award,
  Lock,
  CheckCircle2,
  Filter,
  X,
  Info,
  Download,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { HUDCorners } from './HUDCorners';

export interface BattleRecord {
  id: string;
  playerPokemon: string;
  opponentPokemon: string;
  playerTypes?: string[];
  opponentTypes?: string[];
  result: 'victory' | 'defeat';
  timestamp: number;
  usedSuperEffective?: boolean;
}

interface TrophyDef {
  id: string;
  title: string;
  description: string;
  types: string[]; 
  targetCount: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  specialRule?: 'none' | 'no-supereffective';
  colorClass: string;
  glowClass: string;
  unlockedColorClass: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TROPHY_DEFS: TrophyDef[] = [
  {
    id: 'boulder-badge',
    title: 'Boulder Badge',
    description: 'Defeat 4 consecutive Rock or Steel type adversaries (Brock Bronze Certification)',
    types: ['rock', 'steel'],
    targetCount: 4,
    tier: 'bronze',
    colorClass: 'text-stone-600/50 bg-stone-950/20 border-stone-900',
    unlockedColorClass: 'text-amber-700 bg-amber-950/40 border-amber-800',
    glowClass: 'shadow-[0_0_12px_rgba(217,119,6,0.2)]',
    icon: Shield
  },
  {
    id: 'cascade-badge',
    title: 'Cascade Badge',
    description: 'Defeat 4 consecutive Water or Ice type adversaries (Misty Deep Water Trial)',
    types: ['water', 'ice'],
    targetCount: 4,
    tier: 'bronze',
    colorClass: 'text-stone-600/50 bg-stone-950/20 border-stone-900',
    unlockedColorClass: 'text-blue-500 bg-blue-950/40 border-blue-800',
    glowClass: 'shadow-[0_0_12px_rgba(37,99,235,0.2)]',
    icon: Droplet
  },
  {
    id: 'rainbow-badge',
    title: 'Rainbow Badge',
    description: 'Defeat 5 consecutive Grass, Bug, or Poison type adversaries (Erika Sanctuary Guardian)',
    types: ['grass', 'bug', 'poison'],
    targetCount: 5,
    tier: 'silver',
    colorClass: 'text-slate-500/40 bg-slate-900/10 border-slate-800',
    unlockedColorClass: 'text-emerald-400 bg-emerald-950/30 border-emerald-500/60',
    glowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    icon: Sprout
  },
  {
    id: 'thunder-badge',
    title: 'Thunder Badge',
    description: 'Defeat 5 consecutive Electric or Flying type adversaries (Lt. Surge High-Volt Medal)',
    types: ['electric', 'flying'],
    targetCount: 5,
    tier: 'silver',
    colorClass: 'text-slate-500/40 bg-slate-900/10 border-slate-800',
    unlockedColorClass: 'text-yellow-400 bg-yellow-950/30 border-yellow-500/60',
    glowClass: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]',
    icon: Zap
  },
  {
    id: 'volcano-badge',
    title: 'Volcano Badge',
    description: 'Defeat 6 consecutive Fire or Ground type adversaries (Blaine Infernus Ring Challenge)',
    types: ['fire', 'ground'],
    targetCount: 6,
    tier: 'gold',
    colorClass: 'text-yellow-600/30 bg-yellow-950/10 border-yellow-950',
    unlockedColorClass: 'text-orange-400 bg-orange-950/30 border-orange-500/70',
    glowClass: 'shadow-[0_0_18px_rgba(249,115,22,0.35)]',
    icon: Flame
  },
  {
    id: 'marsh-badge',
    title: 'Marsh Badge',
    description: 'Defeat 10 consecutive Psychic, Ghost, or Dark type adversaries (Sabrina Spectral Link)',
    types: ['psychic', 'ghost', 'dark'],
    targetCount: 10,
    tier: 'gold',
    colorClass: 'text-yellow-600/30 bg-yellow-950/10 border-yellow-950',
    unlockedColorClass: 'text-purple-400 bg-purple-950/30 border-purple-500/70',
    glowClass: 'shadow-[0_0_18px_rgba(168,85,247,0.35)]',
    icon: Sparkles
  },
  {
    id: 'rising-badge',
    title: 'Rising Badge',
    description: 'Defeat 8 consecutive Dragon, Fairy, or Fire adversaries without using Super-Effective attacks!',
    types: ['dragon', 'fairy', 'fire'],
    targetCount: 8,
    tier: 'platinum',
    specialRule: 'no-supereffective',
    colorClass: 'text-indigo-500/30 bg-indigo-950/10 border-indigo-950',
    unlockedColorClass: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/90 font-extrabold',
    glowClass: 'shadow-[0_0_24px_rgba(6,182,212,0.55)]',
    icon: Award
  },
  {
    id: 'champion-medal',
    title: 'Champion Star',
    description: 'Establish an 8-victory active win streak in the Battle Arena without using Super-Effective attacks!',
    types: ['all'],
    targetCount: 8,
    tier: 'platinum',
    specialRule: 'no-supereffective',
    colorClass: 'text-indigo-500/30 bg-indigo-950/10 border-indigo-950',
    unlockedColorClass: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/90 font-extrabold',
    glowClass: 'shadow-[0_0_24px_rgba(6,182,212,0.55)] animate-pulse',
    icon: Swords
  }
];

let cachedBattleHistory: BattleRecord[] | null = null;

export interface BattleHistoryProps {
  isLightMode?: boolean;
}

export const BattleHistory: React.FC<BattleHistoryProps> = React.memo(({ isLightMode = false }) => {
    const [history, setHistory] = useState<BattleRecord[]>(() => cachedBattleHistory || []);
    const [selectedTrophy, setSelectedTrophy] = useState<TrophyDef | null>(TROPHY_DEFS[0]);
    const [hoveredTrophyId, setHoveredTrophyId] = useState<string | null>(null);
    const [filterUnlocked, setFilterUnlocked] = useState<'all' | 'unlocked'>('all');
    const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
    const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
    const [timeLeftStr, setTimeLeftStr] = useState('');
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const getStartOfWeek = (d: Date) => {
        const date = new Date(d);
        const day = date.getUTCDay();
        const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1); // Monday is start of the week
        const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), diff));
        monday.setUTCHours(0, 0, 0, 0);
        return monday;
    };

    const fetchHistory = async () => {
        const saved = await idbGetAll(STORES.BATTLE_HISTORY);
        if (saved) {
            const sorted = saved.sort((a, b) => b.timestamp - a.timestamp);
            cachedBattleHistory = sorted;
            setHistory(sorted);
        }
    };

    useEffect(() => {
        fetchHistory();
        window.addEventListener('storage', fetchHistory);

        const updateCountdown = () => {
            const now = new Date();
            const nextMonday = new Date(now);
            const day = now.getUTCDay();
            const diff = day === 0 ? 1 : 8 - day; // days until next Monday in UTC
            
            nextMonday.setUTCDate(now.getUTCDate() + diff);
            nextMonday.setUTCHours(0, 0, 0, 0);
            nextMonday.setUTCMinutes(0, 0, 0);

            const diffMs = nextMonday.getTime() - now.getTime();
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

            setTimeLeftStr(`${days}d ${hours}h ${minutes}m ${seconds}s UTC`);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => {
            window.removeEventListener('storage', fetchHistory);
            clearInterval(interval);
        };
    }, []);

    const handleDownloadSummary = () => {
      const summaryText = history.slice(0, 5).map((r, i) => 
        `Battle #${i + 1}: ${r.playerPokemon} vs ${r.opponentPokemon} - Result: ${r.result.toUpperCase()} (${new Date(r.timestamp).toLocaleString()})`
      ).join("\n");
      const blob = new Blob([summaryText || "No battle logs recorded yet."], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "battle-history-summary.txt";
      a.click();
      URL.revokeObjectURL(url);
    };

    // Memoize streak calculation helper
    const streakMap = React.useMemo(() => {
        const startOfWeek = getStartOfWeek(new Date()).getTime();
        const thisWeeksHistory = history.filter(record => record.timestamp >= startOfWeek);
        const sorted = [...thisWeeksHistory].sort((a, b) => a.timestamp - b.timestamp);

        const map: Record<string, { current: number; max: number; unlocked: boolean; unlockTimestamp: number | null; unlockOpponent: string | null }> = {};

        for (const trophy of TROPHY_DEFS) {
            let filtered: BattleRecord[] = [];
            if (trophy.types.includes('all')) {
                filtered = sorted;
            } else {
                filtered = sorted.filter(record => {
                    if (!record.opponentTypes) return false;
                    return record.opponentTypes.some(t => trophy.types.includes(t.toLowerCase()));
                });
            }

            let currentStreak = 0;
            let maxStreak = 0;
            let unlockTimestamp: number | null = null;
            let unlockOpponent: string | null = null;

            for (const record of filtered) {
                const satisfiesRule = trophy.specialRule !== 'no-supereffective' || !record.usedSuperEffective;
                
                if (record.result === 'victory' && satisfiesRule) {
                    currentStreak += 1;
                    if (currentStreak > maxStreak) {
                        maxStreak = currentStreak;
                    }
                    if (currentStreak >= trophy.targetCount && !unlockTimestamp) {
                        unlockTimestamp = record.timestamp;
                        unlockOpponent = record.opponentPokemon;
                    }
                } else {
                    currentStreak = 0;
                }
            }

            map[trophy.id] = {
                current: currentStreak,
                max: maxStreak,
                unlocked: maxStreak >= trophy.targetCount,
                unlockTimestamp,
                unlockOpponent
            };
        }

        return map;
    }, [history]);

    const getStreak = React.useCallback((trophy: TrophyDef) => {
        return streakMap[trophy.id] || { current: 0, max: 0, unlocked: false, unlockTimestamp: null, unlockOpponent: null };
    }, [streakMap]);

    const hasHistory = history.length > 0;

    // Memoize list of unlocked trophies & stats
    const { unlockedTrophies, totalBattles, victories, defeats, winRate, currentStreakCount, maxStreakCount } = React.useMemo(() => {
        const unlocked = TROPHY_DEFS.map(t => ({
            compDef: t,
            streakData: streakMap[t.id] || { current: 0, max: 0, unlocked: false, unlockTimestamp: null, unlockOpponent: null }
        })).filter(item => item.streakData.unlocked);

        const total = history.length;
        const v = history.filter(x => x.result === 'victory').length;
        const d = total - v;
        const rate = total > 0 ? Math.round((v / total) * 100) : 0;

        const sortedChronological = [...history].sort((a, b) => a.timestamp - b.timestamp);
        let currentS = 0;
        let maxS = 0;
        for (const r of sortedChronological) {
            if (r.result === 'victory') {
                currentS++;
                if (currentS > maxS) maxS = currentS;
            } else {
                currentS = 0;
            }
        }

        return {
            unlockedTrophies: unlocked,
            totalBattles: total,
            victories: v,
            defeats: d,
            winRate: rate,
            currentStreakCount: currentS,
            maxStreakCount: maxS
        };
    }, [history, streakMap]);

    // Render original Game Badge Case component helper
    const renderMedalCase = (isCabinetMode: boolean = false) => {
        return (
            <div className={cn(
                "rounded-2xl p-4 md:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.8),inset_0_4px_15px_rgba(255,255,255,0.05)] relative overflow-hidden",
                isLightMode ? "bg-[#efe6dd] border-[6px] border-[#bb9e88]" : "bg-[#241710] border-[6px] border-[#3e2314]"
            )}>
                {/* Vintage metallic plate accent */}
                <div className={cn(
                    "absolute top-0 left-1/2 -translate-x-1/2 border-b-2 border-x-2 px-6 py-1 rounded-b-lg flex items-center gap-1.5 shadow-md",
                    isLightMode ? "bg-[#bb9e88] border-[#8a6e59] text-amber-950" : "bg-[#5d3f2c] border-[#1c120c] text-yellow-300"
                )}>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="text-[8px] font-mono tracking-[0.25em] font-extrabold uppercase shrink-0">
                        {isCabinetMode ? "OFFICIAL KANTO LEAGUE ARCHIVE" : "INDIGO CHAMPIONSHIP MEDAL CASE"}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                </div>

                {/* Inner velvet lining - supports horizontal sliding and snap-scrolling on mobile devices */}
                <div className={cn(
                    "mt-4 border-2 rounded-xl p-4 sm:p-6 shadow-[inset_0_5px_25px_rgba(0,0,0,0.95)]",
                    isLightMode ? "bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] border-slate-300" : "bg-gradient-to-b from-[#380e14] via-[#1c0205] to-[#040001] border-[#100305]"
                )}>
                    <div className="flex xl:grid items-start xl:grid-cols-8 gap-4 sm:gap-6 relative z-10 pt-2 pb-4 overflow-x-auto xl:overflow-x-visible snap-x snap-mandatory scrollbar-none w-full max-w-full">
                        {TROPHY_DEFS.map((trophy) => {
                            const { current, max, unlocked, unlockTimestamp, unlockOpponent } = getStreak(trophy);
                            const IconCmp = trophy.icon;

                            if (isCabinetMode && filterUnlocked === 'unlocked' && !unlocked) return null;

                            const isHovered = hoveredTrophyId === trophy.id;
                            const isSelected = selectedTrophy?.id === trophy.id;
                            const victoriesNeeded = trophy.targetCount - current;
                            const percent = Math.min(100, (current / trophy.targetCount) * 100);

                            // Badge tier color tags
                            const tierLabel = trophy.tier.toUpperCase();
                            const tierColor = 
                                trophy.tier === 'platinum' ? "text-cyan-400 border-cyan-500/30 bg-cyan-950/40" :
                                trophy.tier === 'gold' ? "text-yellow-400 border-yellow-500/30 bg-yellow-950/40" :
                                trophy.tier === 'silver' ? "text-slate-300 border-slate-650/30 bg-slate-800/40" :
                                "text-amber-600 border-amber-800/30 bg-amber-950/40";

                            return (
                                <div key={trophy.id} className="relative flex flex-col items-center shrink-0 w-24 sm:w-28 xl:w-full snap-center">
                                    <motion.div
                                        onMouseEnter={() => setHoveredTrophyId(trophy.id)}
                                        onMouseLeave={() => setHoveredTrophyId(null)}
                                        onClick={() => setSelectedTrophy(selectedTrophy?.id === trophy.id ? null : trophy)}
                                        className={cn(
                                            "relative rounded-full w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center cursor-pointer transition-all border-2 group shadow-xl",
                                            unlocked 
                                                ? cn(isLightMode ? "bg-white/90 border-[#b45309]" : "bg-black/40 border-[#b45309]", trophy.glowClass) 
                                                : isLightMode ? "bg-slate-300/40 border-slate-300 shadow-[inset_0_4px_10px_rgba(0,0,0,0.1)] hover:border-slate-400" : "bg-black/75 border-[#27272a] shadow-[inset_0_4px_10px_rgba(0,0,0,0.9)] hover:border-slate-800",
                                            isSelected ? "ring-2 ring-yellow-400 border-yellow-400 scale-102" : ""
                                        )}
                                        whileHover={{ scale: 1.06, y: -2 }}
                                        whileTap={{ scale: 0.96 }}
                                    >
                                        <HUDCorners />
                                        
                                        {/* Outer circular recess shadow shadow-inset */}
                                        <div className={cn(
                                            "absolute inset-1.5 rounded-full pointer-events-none",
                                            isLightMode ? "bg-slate-100 border border-slate-200" : "absolute inset-1.5 rounded-full bg-[#150407]/85 border border-[#3e1217]/50"
                                        )} />

                                        {/* Trophy/Badge Icon */}
                                        <div className="relative z-10">
                                            <IconCmp className={cn(
                                                "w-6 h-6 sm:w-8 sm:h-8 transition-all duration-300",
                                                unlocked 
                                                    ? "text-[#f59e0b] filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)] group-hover:scale-110 active:rotate-12"
                                                    : "text-zinc-800/80 grayscale opacity-30 group-hover:opacity-40 group-hover:grayscale-0"
                                            )} />
                                            
                                            {!unlocked && (
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 rounded-full p-0.5">
                                                    <Lock className="w-2.5 h-2.5 text-zinc-500" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Status glowing ping for unlocked elite medals */}
                                        {unlocked && (
                                            <span className="absolute top-1 right-1 flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                        )}
                                    </motion.div>

                                    {/* Small bottom text signature - BEAUTIFIED TO ELIMINATE TRUNCATION */}
                                    <span className={cn(
                                        "text-[9px] sm:text-[10px] font-hud uppercase tracking-wider mt-1.5 w-full text-center font-black leading-tight select-none",
                                        unlocked ? "text-amber-400" : "text-stone-500"
                                    )}>
                                        {trophy.title}
                                    </span>
                                    
                                    <span className="text-[7.5px] sm:text-[8.5px] font-mono text-slate-500 mt-0.5">
                                        {unlocked ? "SECURED" : `${current}/${trophy.targetCount}`}
                                    </span>

                                    {/* Circular or line progress below the spot */}
                                    {!unlocked && (
                                        <div className="w-8 bg-[#180407] border border-[#270b0e] h-1 rounded-full mt-1 overflow-hidden relative">
                                            <div 
                                                className="absolute top-0 left-0 bg-yellow-500 h-full rounded-full transition-all duration-500" 
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    )}

                                    {/* RESPONSIVE FLOATING TOOLTIP WINDOW (DESKTOP) */}
                                    <AnimatePresence>
                                        {isHovered && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                className="absolute bottom-full mb-3 z-[100] w-56 p-3 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl text-left pointer-events-none"
                                            >
                                                <HUDCorners />
                                                <div className="flex items-center justify-between gap-1 border-b border-slate-900 pb-1.5 mb-1.5">
                                                    <span className="text-[9.5px] font-hud font-black text-white uppercase tracking-wider">{trophy.title}</span>
                                                    <span className={cn("text-[6px] font-mono px-1.5 py-0.5 rounded border border-[#ef4444]/20 uppercase shrink-0 font-extrabold", tierColor)}>
                                                        {tierLabel}
                                                    </span>
                                                </div>
                                                <p className="text-[8.5px] text-slate-400 leading-snug font-sans mb-2">
                                                    {trophy.description}
                                                </p>
                                                <div className="space-y-1 text-[7px] font-mono uppercase tracking-wide">
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">TYPES REQUIRED:</span>
                                                        <span className="text-slate-350">{trophy.types.join(' | ')}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">BEST STREAK:</span>
                                                        <span className="text-amber-400">{max} / {trophy.targetCount}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">STATUS:</span>
                                                        <span className={unlocked ? "text-emerald-400" : "text-rose-500"}>
                                                            {unlocked ? "CLAIMED" : `LOCKED (-${victoriesNeeded})`}
                                                        </span>
                                                    </div>
                                                    {unlocked && unlockTimestamp && (
                                                        <div className="text-[6.5px] border-t border-slate-900 pt-1 mt-1 text-slate-500 leading-normal lowercase">
                                                            secured on {new Date(unlockTimestamp).toLocaleDateString()} versus {unlockOpponent}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>

                    {/* CENTRAL DESK VIEW: ACTIVE FOCUS SPECIFICATIONS (MOBILE + DETAILED DRILLDOWN) */}
                    <div className={cn(
                        "mt-4 border-t pt-4 text-left",
                        isLightMode ? "border-slate-300" : "border-[#3d1116]/80"
                    )}>
                        {selectedTrophy ? (
                            <div className={cn(
                                "rounded-xl p-3 relative shadow-md",
                                isLightMode ? "bg-white border border-slate-300 text-slate-900" : "bg-[#1c080b]/90 border border-[#45161c]/80 text-white"
                            )}>
                                <HUDCorners />
                                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                                    <div className="space-y-1">
                                        {/* Medal Title / Tier / Condition Label */}
                                        <div className="flex items-center gap-2">
                                            {React.createElement(selectedTrophy.icon, { className: "w-5 h-5 text-yellow-400 animate-pulse" })}
                                            <h4 className={cn(
                                                "text-[12px] font-hud uppercase tracking-widest font-extrabold",
                                                isLightMode ? "text-slate-900" : "text-amber-200"
                                            )}>
                                                {selectedTrophy.title} Certification Credentials
                                            </h4>
                                            <span className="bg-yellow-500/10 border border-yellow-500/30 px-1.5 py-0.5 rounded text-[7px] text-yellow-500 font-bold uppercase shrink-0">
                                                {selectedTrophy.tier} Medal
                                            </span>
                                        </div>
                                        <p className={cn(
                                            "text-[10px] leading-relaxed font-sans",
                                            isLightMode ? "text-slate-600" : "text-slate-300"
                                        )}>
                                            {selectedTrophy.description}
                                        </p>
                                    </div>

                                    {/* Action points / specs */}
                                    {(() => {
                                        const { current, max, unlocked, unlockTimestamp, unlockOpponent } = getStreak(selectedTrophy);
                                        return (
                                            <div className={cn(
                                                "p-2.5 rounded-lg flex flex-col gap-1.5 text-[8.5px] font-mono uppercase shrink-0 w-full sm:w-auto",
                                                isLightMode ? "bg-slate-50 border border-slate-200 text-slate-700" : "bg-black/60 border border-slate-850 text-slate-400"
                                            )}>
                                                <div className="flex justify-between gap-4">
                                                    <span>Consecutive Streak:</span>
                                                    <strong className={cn(current > 0 ? "text-cyan-500" : "text-slate-500")}>{current} / {selectedTrophy.targetCount}</strong>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span>Historic Peak Stream:</span>
                                                    <strong className="text-amber-500">{max} / {selectedTrophy.targetCount}</strong>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span>Challenge constraints:</span>
                                                    <strong className="text-[#f59e0b]">{selectedTrophy.specialRule === 'no-supereffective' ? "NO SUPER-EFFECTIVE MOVES" : "STANDARD COMBAT RULES"}</strong>
                                                </div>
                                                {unlocked && unlockTimestamp && (
                                                    <div className="text-[7.5px] text-emerald-600 font-bold border-t border-slate-200 pt-1 mt-1 text-center font-sans tracking-wide">
                                                        Secured vs {unlockOpponent?.toUpperCase()} on {new Date(unlockTimestamp).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        ) : (
                            <div className={cn(
                                "text-center py-4 rounded-xl font-mono text-[8px] uppercase tracking-widest leading-none flex items-center justify-center gap-1.5",
                                isLightMode ? "bg-slate-100 border border-slate-200 text-slate-500" : "bg-black/35 border border-[#3e1116]/30 text-stone-500"
                            )}>
                                <Info className="w-4 h-4 text-stone-600 shrink-0" />
                                Highlight a badge to inspect full historical metrics and alignment conditions
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4 select-none">
            {/* REAL-TIME BATTLE STATISTICS HIGH-QOL HUD */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 relative overflow-hidden flex flex-col justify-between">
                    <HUDCorners />
                    <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-widest block">Total Battles</span>
                    <span className="text-xl font-hud font-black text-cyan-400 mt-1">{totalBattles}</span>
                    <div className="text-[6.5px] font-mono text-slate-500 uppercase mt-2 pt-1 border-t border-slate-900">
                        Record: <span className="text-emerald-400 font-bold">{victories} W</span> - <span className="text-red-400 font-bold">{defeats} L</span>
                    </div>
                </div>
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 relative overflow-hidden flex flex-col justify-between">
                    <HUDCorners />
                    <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-widest block">Win Rate</span>
                    <span className="text-xl font-hud font-black text-emerald-400 mt-1">{winRate}%</span>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${winRate}%` }} />
                    </div>
                </div>
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 relative overflow-hidden flex flex-col justify-between">
                    <HUDCorners />
                    <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-widest block">Active Win Streak</span>
                    <span className="text-xl font-hud font-black text-amber-400 mt-1 flex items-center gap-1.5">
                        {currentStreakCount}
                        <Flame className={cn("w-4 h-4 text-orange-500", currentStreakCount > 0 && "animate-pulse")} />
                    </span>
                    <div className="text-[6.5px] font-mono text-slate-500 uppercase mt-2 pt-1 border-t border-slate-900">
                        All-Time Best: <span className="text-amber-400 font-bold">{maxStreakCount}</span>
                    </div>
                </div>
            </div>

            {/* 2. Recent Battle List (Last 5) */}
            {hasHistory && (
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2 border-b border-slate-800 pb-1.5 flex-wrap gap-2">
                        <h3 className="text-[9px] font-hud font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Arena Log entries (Last 5)
                        </h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDownloadSummary}
                                className="flex items-center gap-1.5 px-2.5 py-1 text-[8px] font-mono font-bold uppercase rounded border border-cyan-800/60 bg-cyan-950/30 text-cyan-400 hover:bg-cyan-900/40 hover:text-cyan-300 transition-all cursor-pointer select-none active:scale-95"
                                title="Download last 5 battles report"
                            >
                                <Download className="w-3 h-3 text-cyan-400 animate-pulse" />
                                Download Summary
                            </button>
                            {showClearConfirm ? (
                                <div className="flex items-center gap-1.5 bg-slate-900 border border-rose-500/30 px-2 py-0.5 rounded">
                                    <span className="text-[8px] font-mono font-bold text-rose-400 uppercase">Wipe?</span>
                                    <button
                                        onClick={() => {
                                            idbClear(STORES.BATTLE_HISTORY);
                                            setHistory([]);
                                            setShowClearConfirm(false);
                                        }}
                                        className="px-1.5 py-0.5 text-[8px] font-hud font-black uppercase rounded bg-rose-950 border border-rose-500/40 text-rose-400 hover:bg-rose-900 transition-all cursor-pointer select-none"
                                    >
                                        YES
                                    </button>
                                    <button
                                        onClick={() => setShowClearConfirm(false)}
                                        className="px-1.5 py-0.5 text-[8px] font-hud font-black uppercase rounded bg-slate-800 border border-slate-700 text-slate-450 hover:bg-slate-750 transition-all cursor-pointer select-none"
                                    >
                                        NO
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowClearConfirm(true)}
                                    className="flex items-center gap-1.5 px-2.5 py-1 text-[8px] font-mono font-bold uppercase rounded border border-rose-900/40 bg-rose-950/20 text-rose-400 hover:bg-rose-900/30 hover:text-rose-300 transition-all cursor-pointer select-none active:scale-95"
                                    title="Clear all battle history"
                                >
                                    <Trash2 className="w-3 h-3 text-rose-500" />
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        {history.slice(0, 5).map((record, index) => (
                            <div key={`${record.id}-${index}`} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-800 text-[10px] transition-colors hover:border-slate-700">
                                <div className="flex items-center gap-2">
                                    {record.result === 'victory' ? (
                                        <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                        <XCircle className="w-3.5 h-3.5 text-red-500" />
                                    )}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                        <span className="font-mono text-slate-300 uppercase tracking-tight">{record.playerPokemon} vs {record.opponentPokemon}</span>
                                        {record.opponentTypes && record.opponentTypes.length > 0 && (
                                            <div className="flex gap-0.5 items-center">
                                                <span className="text-[6.5px] text-slate-500 font-mono scale-95 uppercase">types:</span>
                                                {record.opponentTypes.map((t, i) => (
                                                    <span key={`${t}-${i}`} className="text-[6px] tracking-widest px-1 py-[1.5px] rounded bg-slate-950 text-slate-400 uppercase border border-slate-900 font-bold scale-95">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span className="text-slate-600 font-mono flex items-center gap-1 shrink-0">
                                    <Clock className="w-2.5 h-2.5" />
                                    {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});
