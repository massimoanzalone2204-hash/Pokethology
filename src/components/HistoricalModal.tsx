import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  X, 
  Calendar, 
  Swords, 
  Target, 
  BookOpen, 
  Sparkles, 
  Flame, 
  History,
  CheckCircle2
} from 'lucide-react';
import { cn, playHaptic } from '../lib/utils';
import { sounds } from '../lib/sounds';
import { 
  getCurrentSeasonStats, 
  getPastSeasonsHistory, 
  SeasonHistoryEntry, 
  RANKS 
} from '../utils/seasonHistory';

export interface HistoricalModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyStreak?: number;
}

export const HistoricalModal: React.FC<HistoricalModalProps> = ({
  isOpen,
  onClose,
  dailyStreak = 0
}) => {
  const [activeView, setActiveView] = useState<'current' | 'history' | 'activity' | 'tiers'>('current');
  const [currentSeasonData, setCurrentSeasonData] = useState(() => getCurrentSeasonStats());
  const [pastSeasons, setPastSeasons] = useState<SeasonHistoryEntry[]>(() => getPastSeasonsHistory());

  useEffect(() => {
    if (isOpen) {
      setCurrentSeasonData(getCurrentSeasonStats());
      setPastSeasons(getPastSeasonsHistory());
    }
  }, [isOpen]);

  // Keyboard accessibility: ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
        try { sounds?.scan?.(); } catch (_) {}
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const { scores, monthName, daysRemaining } = currentSeasonData;
  const { rank } = scores;

  // Lifetime metrics across all seasons
  const lifetimeStats = useMemo(() => {
    let totalHubs = scores.hubCompletions;
    let totalExams = scores.examCompletions;
    
    pastSeasons.forEach(s => {
      totalHubs += s.hubCompletions || 0;
      totalExams += s.examCompletions || 0;
    });

    return {
      totalHubs,
      totalExams,
      totalPastSeasons: pastSeasons.length
    };
  }, [scores, pastSeasons]);

  // Read recorded daily hub history & exam completions from local storage items
  const activityLogs = useMemo(() => {
    const logs: Array<{ date: string; type: 'hub' | 'exam'; title: string; count: number }> = [];

    // Scan recent days in current month
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const monthStr = dateStr.slice(0, 7);

      // Check if this date matches the current month or previous entries
      const hubCount = parseInt(localStorage.getItem(`pokethology_hub_cleared_${dateStr}`) || '0', 10);
      if (hubCount > 0) {
        logs.push({
          date: dateStr,
          type: 'hub',
          title: `Daily Hub Completed`,
          count: hubCount
        });
      }
    }

    return logs;
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="historical-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] flex flex-col bg-slate-950/98 backdrop-blur-2xl overflow-hidden text-slate-100 font-sans select-none"
      >
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top System Header Bar */}
        <div className="shrink-0 border-b border-emerald-500/30 bg-slate-900/90 px-4 sm:px-8 py-3 flex items-center justify-between gap-3 z-20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0">
              <History className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 filter drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            </div>
            <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
              <h2 className="font-hud font-black text-base sm:text-xl text-emerald-300 uppercase tracking-widest leading-none whitespace-nowrap">
                HISTORICAL
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[10px] sm:text-xs font-mono font-bold whitespace-nowrap shadow-sm">
                {monthName}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              try { sounds?.scan?.(); playHaptic('light'); } catch (_) {}
            }}
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-hud font-bold uppercase tracking-wider group shadow-sm shrink-0"
            title="Close (Esc)"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span className="hidden sm:inline">CLOSE</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="shrink-0 px-3 sm:px-8 py-2 bg-slate-900/60 border-b border-emerald-900/30 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar sm:custom-scrollbar">
          <button
            onClick={() => { setActiveView('current'); try { sounds?.typing?.(); playHaptic('light'); } catch (_) {} }}
            className={cn(
              "px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0",
              activeView === 'current' 
                ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-black" 
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Current Season</span>
          </button>

          <button
            onClick={() => { setActiveView('history'); try { sounds?.typing?.(); playHaptic('light'); } catch (_) {} }}
            className={cn(
              "px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0",
              activeView === 'history' 
                ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-black" 
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent"
            )}
          >
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Past Seasons {pastSeasons.length > 0 ? `(${pastSeasons.length})` : ''}</span>
          </button>

          <button
            onClick={() => { setActiveView('activity'); try { sounds?.typing?.(); playHaptic('light'); } catch (_) {} }}
            className={cn(
              "px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0",
              activeView === 'activity' 
                ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-black" 
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent"
            )}
          >
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hub & Exam History</span>
          </button>

          <button
            onClick={() => { setActiveView('tiers'); try { sounds?.typing?.(); playHaptic('light'); } catch (_) {} }}
            className={cn(
              "px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0",
              activeView === 'tiers' 
                ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-black" 
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent"
            )}
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span>Rank Tiers</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">

          {/* VIEW 1: CURRENT SEASON */}
          {activeView === 'current' && (
            <div className="space-y-6">
              
              {/* Header Overview Banner - Clean without bordered square box */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
                    <img 
                      src={rank.badgeUrl} 
                      alt={rank.badgeName} 
                      className="w-12 h-12 sm:w-14 sm:h-14 object-contain rendering-pixelated drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl font-hud font-black text-white">
                        {monthName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                        {daysRemaining}d left
                      </span>
                    </div>
                    <div className={cn("text-xs font-hud font-bold uppercase tracking-wider mt-0.5", rank.textColor)}>
                      {rank.badgeName} ({scores.averageScore}%)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-stretch sm:self-auto justify-end">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Daily Streak</span>
                    <span className="text-lg font-hud font-black text-orange-400 flex items-center justify-end gap-1">
                      <Flame className="w-4 h-4 inline" /> {dailyStreak}d
                    </span>
                  </div>
                  <div className="h-8 w-px bg-slate-800" />
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Overall Score</span>
                    <span className="text-lg font-hud font-black text-white">{scores.averageScore}%</span>
                  </div>
                </div>
              </div>

              {/* Progress Pillars */}
              <div className="space-y-3">
                <h3 className="text-xs font-hud font-bold text-slate-400 uppercase tracking-wider">
                  Season Progress Breakdown
                </h3>

                {/* 1. Pokédex Pokémon Wins */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 transition-colors hover:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Swords className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-hud font-bold text-white">Pokédex Wins</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        (Won with unique species)
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-purple-300">
                      {scores.combatScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mb-2.5">
                    <div 
                      className="bg-purple-500 h-full rounded-full transition-all duration-300" 
                      style={{ width: `${scores.combatScore}%` }} 
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2">
                    <span>
                      <strong className="text-white font-bold">{scores.uniquePokemon}</strong> Pokédex species won with
                    </span>
                    <span>
                      <strong className="text-white font-bold">{scores.uniqueTypes} / 18</strong> elemental types won with
                    </span>
                  </div>
                </div>

                {/* 2. Daily Hub Quests */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 transition-colors hover:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-hud font-bold text-white">Daily Hub Missions</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      {scores.hubScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mb-2.5">
                    <div 
                      className="bg-cyan-500 h-full rounded-full transition-all duration-300" 
                      style={{ width: `${scores.hubScore}%` }} 
                    />
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    <strong className="text-white font-bold">{scores.hubCompletions}</strong> missions cleared this month
                  </div>
                </div>

                {/* 3. Theory Exams */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 transition-colors hover:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-hud font-bold text-white">Theory Exams</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-300">
                      {scores.examScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mb-2.5">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-300" 
                      style={{ width: `${scores.examScore}%` }} 
                    />
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    <strong className="text-white font-bold">{scores.examCompletions}</strong> regional questions aced
                  </div>
                </div>
              </div>

              {/* Lifetime Overview */}
              <div className="pt-2 border-t border-slate-800/80">
                <h3 className="text-xs font-hud font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Lifetime Totals
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border border-slate-800/80 rounded-xl p-3 text-center bg-slate-900/30">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Hub Quests</div>
                    <div className="text-lg font-hud font-bold text-cyan-300 mt-0.5">{lifetimeStats.totalHubs}</div>
                  </div>
                  <div className="border border-slate-800/80 rounded-xl p-3 text-center bg-slate-900/30">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Exams Passed</div>
                    <div className="text-lg font-hud font-bold text-amber-300 mt-0.5">{lifetimeStats.totalExams}</div>
                  </div>
                  <div className="border border-slate-800/80 rounded-xl p-3 text-center bg-slate-900/30">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Seasons Archived</div>
                    <div className="text-lg font-hud font-bold text-purple-300 mt-0.5">{lifetimeStats.totalPastSeasons}</div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* VIEW 2: PAST SEASONS */}
          {activeView === 'history' && (
            <div className="space-y-4">
              <h3 className="text-xs font-hud font-bold text-slate-400 uppercase tracking-wider">
                Completed Seasons
              </h3>

              {pastSeasons.length === 0 ? (
                <div className="border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-2">
                  <div className="text-base font-hud font-bold text-slate-300 uppercase">
                    No Past Seasons Yet
                  </div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    At the end of {monthName}, your final stats and rank will be archived here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pastSeasons.map((season) => (
                    <div 
                      key={season.id} 
                      className="bg-slate-900/50 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <img 
                          src={season.badgeUrl} 
                          alt={season.rankName} 
                          className="w-10 h-10 object-contain rendering-pixelated shrink-0" 
                        />
                        <div>
                          <div className="text-sm font-hud font-bold text-white">
                            {season.monthName}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            {season.rankName} • {season.averageScore}%
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono text-slate-400 text-right">
                        <div>
                          <span className="text-slate-500 block text-[9px] uppercase">Pokédex Wins</span>
                          <span className="text-white font-bold">{season.uniquePokemon}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9px] uppercase">Hub Quests</span>
                          <span className="text-cyan-300 font-bold">{season.hubCompletions}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9px] uppercase">Exams</span>
                          <span className="text-amber-300 font-bold">{season.examCompletions}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: HUB & EXAM HISTORY */}
          {activeView === 'activity' && (
            <div className="space-y-5">
              <h3 className="text-xs font-hud font-bold text-slate-400 uppercase tracking-wider">
                Daily Hub & Theory Exam History
              </h3>

              {/* Monthly Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Daily Hub Monthly Box */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-hud font-bold text-white">Daily Hub Quests</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {scores.hubCompletions} Completed
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono space-y-1">
                    <div className="flex justify-between">
                      <span>Active Month:</span>
                      <strong className="text-white">{monthName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Lifetime Hub Clears:</span>
                      <strong className="text-cyan-300">{lifetimeStats.totalHubs}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Daily Streak:</span>
                      <strong className="text-orange-400">{dailyStreak} Days</strong>
                    </div>
                  </div>
                </div>

                {/* Theory Exam Monthly Box */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-hud font-bold text-white">Theory Exam Tests</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {scores.examCompletions} Aced
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono space-y-1">
                    <div className="flex justify-between">
                      <span>Active Month:</span>
                      <strong className="text-white">{monthName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Lifetime Exam Answers:</span>
                      <strong className="text-amber-300">{lifetimeStats.totalExams}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Season Score:</span>
                      <strong className="text-white">{scores.examScore}%</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Past Seasons Contribution Breakdown */}
              {pastSeasons.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-hud font-bold text-slate-400 uppercase tracking-wider">
                    Past Seasons Hub & Exam Records
                  </h4>
                  <div className="space-y-2">
                    {pastSeasons.map((season) => (
                      <div 
                        key={`act-${season.id}`}
                        className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between text-xs font-mono"
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="font-bold text-white">{season.monthName}</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400">
                          <span>
                            Hubs: <strong className="text-cyan-300">{season.hubCompletions}</strong>
                          </span>
                          <span>
                            Exams: <strong className="text-amber-300">{season.examCompletions}</strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 4: RANK TIERS */}
          {activeView === 'tiers' && (
            <div className="space-y-3">
              <h3 className="text-xs font-hud font-bold text-slate-400 uppercase tracking-wider">
                Monthly Rank Requirements
              </h3>

              <div className="space-y-2.5">
                {/* Master Ball */}
                <div className="bg-slate-900/50 border border-purple-500/30 rounded-xl p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={RANKS.master.badgeUrl} alt="Master Ball" className="w-9 h-9 object-contain rendering-pixelated" />
                    <div>
                      <div className="text-sm font-hud font-bold text-purple-300">Master Ball</div>
                      <div className="text-xs text-slate-400">Achieve 75%+ overall monthly score</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 border border-purple-500/30 px-2 py-1 rounded">
                      ≥ 75%
                    </span>
                  </div>
                </div>

                {/* Ultra Ball */}
                <div className="bg-slate-900/50 border border-yellow-500/30 rounded-xl p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={RANKS.ultra.badgeUrl} alt="Ultra Ball" className="w-9 h-9 object-contain rendering-pixelated" />
                    <div>
                      <div className="text-sm font-hud font-bold text-yellow-300">Ultra Ball</div>
                      <div className="text-xs text-slate-400">Achieve 50%+ overall monthly score</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-yellow-400 bg-yellow-950/60 border border-yellow-500/30 px-2 py-1 rounded">
                      ≥ 50%
                    </span>
                  </div>
                </div>

                {/* Great Ball */}
                <div className="bg-slate-900/50 border border-blue-500/30 rounded-xl p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={RANKS.great.badgeUrl} alt="Great Ball" className="w-9 h-9 object-contain rendering-pixelated" />
                    <div>
                      <div className="text-sm font-hud font-bold text-blue-300">Great Ball</div>
                      <div className="text-xs text-slate-400">Achieve 25%+ overall monthly score</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/60 border border-blue-500/30 px-2 py-1 rounded">
                      ≥ 25%
                    </span>
                  </div>
                </div>

                {/* Poké Ball */}
                <div className="bg-slate-900/50 border border-red-500/30 rounded-xl p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={RANKS.poke.badgeUrl} alt="Poké Ball" className="w-9 h-9 object-contain rendering-pixelated" />
                    <div>
                      <div className="text-sm font-hud font-bold text-red-300">Poké Ball</div>
                      <div className="text-xs text-slate-400">Starting tier for each monthly season</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 border border-red-500/30 px-2 py-1 rounded">
                      0% – 24%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
