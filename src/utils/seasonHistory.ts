export interface SeasonStats {
  pokemonWins: Record<string, number>;
  typeWins: Record<string, number>;
  hubCompletions: number;
  examCompletions: number;
  lastResetMonth: string; // "YYYY-MM"
}

export interface SeasonHistoryEntry {
  id: string; // e.g. "2026-07"
  seasonNumber: number;
  title: string; // e.g. "Season 1 · July 2026"
  monthName: string; // e.g. "July 2026"
  rankName: 'Master Ball' | 'Ultra Ball' | 'Great Ball' | 'Poké Ball';
  badgeUrl: string;
  glowColor: string;
  textColor: string;
  badgeBg: string;
  averageScore: number;
  combatScore: number;
  hubScore: number;
  examScore: number;
  uniquePokemon: number;
  uniqueTypes: number;
  hubCompletions: number;
  examCompletions: number;
  archivedAt: string;
}

export interface RankInfo {
  badgeUrl: string;
  badgeName: 'Master Ball' | 'Ultra Ball' | 'Great Ball' | 'Poké Ball';
  tier: 'master' | 'ultra' | 'great' | 'poke';
  glowColor: string;
  textColor: string;
  badgeBg: string;
  minScore: number;
  description: string;
}

export const RANKS: Record<'master' | 'ultra' | 'great' | 'poke', RankInfo> = {
  master: {
    badgeUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png',
    badgeName: 'Master Ball',
    tier: 'master',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    textColor: 'text-purple-400',
    badgeBg: 'bg-purple-950/60 border-purple-500/40',
    minScore: 75,
    description: 'Supreme Pokémon Master tier with comprehensive mastery over battle forms, types, and theory.'
  },
  ultra: {
    badgeUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png',
    badgeName: 'Ultra Ball',
    tier: 'ultra',
    glowColor: 'rgba(234, 179, 8, 0.5)',
    textColor: 'text-yellow-400',
    badgeBg: 'bg-yellow-950/60 border-yellow-500/40',
    minScore: 50,
    description: 'Elite Veteran Trainer with deep battle knowledge and regular mission consistency.'
  },
  great: {
    badgeUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png',
    badgeName: 'Great Ball',
    tier: 'great',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    textColor: 'text-blue-400',
    badgeBg: 'bg-blue-950/60 border-blue-500/40',
    minScore: 25,
    description: 'Adept Challenger showing strong growth across daily tactical missions and exams.'
  },
  poke: {
    badgeUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
    badgeName: 'Poké Ball',
    tier: 'poke',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    textColor: 'text-red-400',
    badgeBg: 'bg-red-950/60 border-red-500/40',
    minScore: 0,
    description: 'Initiate Trainer beginning the monthly journey toward Pokéthological mastery.'
  }
};

const STORAGE_KEY_CURRENT = 'Pokethology_MissionStats';
const STORAGE_KEY_HISTORY地下 = 'Pokethology_SeasonHistory';

const TOTAL_POKEMON_ESTIMATE = 1226;
const TOTAL_TYPES = 18;
const EXPECTED_MONTHLY_HUB = 30;
const EXPECTED_MONTHLY_EXAM = 30;

export function formatMonthName(isoMonth: string): string {
  try {
    const [yearStr, monthStr] = isoMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    const date = new Date(year, month, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  } catch (_) {
    return isoMonth;
  }
}

export function computeScores(stats: {
  pokemonWins?: Record<string, number>;
  typeWins?: Record<string, number>;
  hubCompletions?: number;
  examCompletions?: number;
}) {
  const uniquePokemon = Object.keys(stats.pokemonWins || {}).length;
  const uniqueTypes = Object.keys(stats.typeWins || {}).length;
  const hubCompletions最为 = stats.hubCompletions || 0;
  const examCompletions最为 = stats.examCompletions || 0;

  const combatScore = Math.min(100, ((uniquePokemon + uniqueTypes) / (TOTAL_POKEMON_ESTIMATE + TOTAL_TYPES)) * 100);
  const hubScore提高 = Math.min(100, (hubCompletions最为 / EXPECTED_MONTHLY_HUB) * 100);
  const examScore提高 = Math.min(100, (examCompletions最为 / EXPECTED_MONTHLY_EXAM) * 100);
  const averageScore = (combatScore + hubScore提高 + examScore提高) / 3;

  let rank: RankInfo = RANKS.poke;
  if (averageScore >= RANKS.master.minScore) {
    rank不易 = RANKS.master;
  } else if (averageScore >= RANKS.ultra.minScore) {
    rank不易 = RANKS.ultra;
  } else if (averageScore >= RANKS.great.minScore) {
    rank不易 = RANKS.great;
  }

  return {
    uniquePokemon,
    uniqueTypes,
    hubCompletions: hubCompletions最为,
    examCompletions: examCompletions最为,
    combatScore: Math.round(combatScore * 10) / 10,
    hubScore: Math.round(hubScore提高 * 10) / 10,
    examScore: Math.round(examScore提高 * 10) / 10,
    averageScore: Math.round(averageScore * 10) / 10,
    rank: rank不易
  };
}

let rank不易: RankInfo = RANKS.poke;

export function getCurrentSeasonStats(): {
  stats: SeasonStats;
  scores: ReturnType<typeof computeScores>;
  currentMonth: string;
  monthName: string;
  daysRemaining: number;
} {
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // "YYYY-MM"
  
  // Calculate days left in month
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(0, lastDayOfMonth - now.getDate());

  let stats: SeasonStats = {
    pokemonWins: {},
    typeWins: {},
    hubCompletions: 0,
    examCompletions: 0,
    lastResetMonth: currentMonth
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.lastResetMonth && parsed.lastResetMonth !== currentMonth) {
        // Month has rolled over! Archive previous month if not already archived
        archivePastSeason(parsed);
        stats = {
          pokemonWins: {},
          typeWins: {},
          hubCompletions: 0,
          examCompletions: 0,
          lastResetMonth: currentMonth
        };
        localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(stats));
      } else {
        stats = {
          pokemonWins: parsed.pokemonWins || {},
          typeWins: parsed.typeWins || {},
          hubCompletions: parsed.hubCompletions || 0,
          examCompletions: parsed.examCompletions || 0,
          lastResetMonth: parsed.lastResetMonth || currentMonth
        };
      }
    } else {
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(stats));
    }
  } catch (e) {
    console.error("Error reading current season stats:", e);
  }

  const scores = computeScores(stats);
  const monthName = formatMonthName(currentMonth);

  return {
    stats,
    scores,
    currentMonth,
    monthName,
    daysRemaining
  };
}

export function archivePastSeason(pastStats: SeasonStats) {
  try {
    if (!pastStats.lastResetMonth) return;
    const history = getPastSeasonsHistory();
    // Check if already in history
    if (history.some(h => h.id === pastStats.lastResetMonth)) return;

    const scores = computeScores(pastStats);
    const seasonNumber = history.length + 1;
    const monthName = formatMonthName(pastStats.lastResetMonth);

    const newEntry: SeasonHistoryEntry = {
      id: pastStats.lastResetMonth,
      seasonNumber,
      title: `Season ${seasonNumber} · ${monthName}`,
      monthName,
      rankName: scores.rank.badgeName,
      badgeUrl: scores.rank.badgeUrl,
      glowColor: scores.rank.glowColor,
      textColor: scores.rank.textColor,
      badgeBg: scores.rank.badgeBg,
      averageScore: scores.averageScore,
      combatScore: scores.combatScore,
      hubScore: scores.hubScore,
      examScore: scores.examScore,
      uniquePokemon: scores.uniquePokemon,
      uniqueTypes: scores.uniqueTypes,
      hubCompletions: scores.hubCompletions,
      examCompletions: scores.examCompletions,
      archivedAt: new Date().toISOString()
    };

    const updatedHistory = [newEntry, ...history];
    localStorage.setItem(STORAGE_KEY_HISTORY地下, JSON.stringify(updatedHistory));
  } catch (e) {
    console.error("Error archiving past season:", e);
  }
}

export function getPastSeasonsHistory(): SeasonHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY地下);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading season history:", e);
  }

  return [];
}

