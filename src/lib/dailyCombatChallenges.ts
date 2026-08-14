export interface DailyCombatChallenge {
  id: string; // 'bronze_3', 'bronze_4', 'silver_3', 'silver_4', 'gold_3', 'gold_4'
  tier: 'bronze' | 'silver' | 'gold';
  activityNumber: number; // 3, 4, 7, 8, 11, 12
  title: string;
  category: string;
  description: string;
  requirement: number;
  type: 'wins' | 'super_effective' | 'super_or_crit';
  icon: 'Swords' | 'Zap' | 'ShieldCheck' | 'Target' | 'Crown' | 'Flame';
}

export const DAILY_COMBAT_CHALLENGES: DailyCombatChallenge[] = [
  // Bronze / Easy Level
  {
    id: 'bronze_3',
    tier: 'bronze',
    activityNumber: 3,
    title: 'Activity 03 • Arena Rookie Victory',
    category: 'Combat Arena Victory',
    description: 'Enter the Combat Arena and achieve 1 victory against any opponent.',
    requirement: 1,
    type: 'wins',
    icon: 'Swords'
  },
  {
    id: 'bronze_4',
    tier: 'bronze',
    activityNumber: 4,
    title: 'Activity 04 • Super Effective Blast',
    category: 'Combat Strike Protocol',
    description: 'Land 2 Super Effective attacks against opposing Pokémon in the Combat Arena.',
    requirement: 2,
    type: 'super_effective',
    icon: 'Zap'
  },

  // Silver / Medium Level
  {
    id: 'silver_3',
    tier: 'silver',
    activityNumber: 7,
    title: 'Activity 07 • Tactical Arena Mastery',
    category: 'Arena Veteran Trial',
    description: 'Demonstrate tactical strength by winning 2 battles in the Combat Arena.',
    requirement: 2,
    type: 'wins',
    icon: 'ShieldCheck'
  },
  {
    id: 'silver_4',
    tier: 'silver',
    activityNumber: 8,
    title: 'Activity 08 • Precision Strike Protocol',
    category: 'Combat Critical & STAB',
    description: 'Land 3 Super Effective or Critical Hit strikes during Combat Arena encounters.',
    requirement: 3,
    type: 'super_or_crit',
    icon: 'Target'
  },

  // Gold / Master / Hard Level
  {
    id: 'gold_3',
    tier: 'gold',
    activityNumber: 11,
    title: 'Activity 11 • Arena Champion Sweep',
    category: 'Master Arena Dominance',
    description: 'Prove supreme combat mastery by achieving 3 victories in the Combat Arena.',
    requirement: 3,
    type: 'wins',
    icon: 'Crown'
  },
  {
    id: 'gold_4',
    tier: 'gold',
    activityNumber: 12,
    title: 'Activity 12 • Decisive Finisher Protocol',
    category: 'Super Effective Blitz',
    description: 'Execute 5 Super Effective attacks during Combat Arena battles to master all elements.',
    requirement: 5,
    type: 'super_effective',
    icon: 'Flame'
  }
];

export interface ChallengeProgressResult {
  challenge: DailyCombatChallenge;
  prev: number;
  next: number;
  requirement: number;
  justCompleted: boolean;
  delta: number;
}

export function getChallengeProgress(id: string, todayStr: string): number {
  try {
    const key = `pokethology_challenge_${id}_${todayStr}`;
    const val = localStorage.getItem(key);
    return val ? parseInt(val, 10) : 0;
  } catch (_) {
    return 0;
  }
}

export function setChallengeProgress(id: string, todayStr: string, value: number): void {
  try {
    const key = `pokethology_challenge_${id}_${todayStr}`;
    localStorage.setItem(key, String(value));
  } catch (_) {}
}

export function getAllCombatChallengesProgress(todayStr: string): Record<string, number> {
  const result: Record<string, number> = {};
  for (const c of DAILY_COMBAT_CHALLENGES) {
    result[c.id] = getChallengeProgress(c.id, todayStr);
  }
  return result;
}

export function updateCombatChallengesOnBattle({
  todayStr,
  isVictory,
  superEffectiveHits,
  criticalHits
}: {
  todayStr: string;
  isVictory: boolean;
  superEffectiveHits: number;
  criticalHits: number;
}): ChallengeProgressResult[] {
  const results: ChallengeProgressResult[] = [];

  for (const challenge of DAILY_COMBAT_CHALLENGES) {
    const prev = getChallengeProgress(challenge.id, todayStr);
    let delta = 0;

    if (challenge.type === 'wins') {
      if (isVictory) {
        delta = 1;
      }
    } else if (challenge.type === 'super_effective') {
      delta = superEffectiveHits;
    } else if (challenge.type === 'super_or_crit') {
      delta = superEffectiveHits + criticalHits;
    }

    if (delta > 0) {
      const next = Math.min(challenge.requirement, prev + delta);
      setChallengeProgress(challenge.id, todayStr, next);
      
      const justCompleted = prev < challenge.requirement && next >= challenge.requirement;
      results.push({
        challenge,
        prev,
        next,
        requirement: challenge.requirement,
        justCompleted,
        delta: next - prev
      });
    }
  }

  // Dispatch custom window event so UI can react in real-time
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('daily-challenge-progress', { detail: results }));
      window.dispatchEvent(new Event('storage'));
    }
  } catch (_) {}

  return results;
}
