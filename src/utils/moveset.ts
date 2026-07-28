import { Move, Pokemon } from '../types';

const TYPE_CHART: Record<string, Record<string, number>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

function getEffectivenessMultiplier(moveType: string, targetTypes: string[]): number {
  let mult = 1;
  const m = moveType.toLowerCase();
  for (const t of targetTypes) {
    const target = t.toLowerCase();
    if (TYPE_CHART[m]?.[target] !== undefined) {
      mult *= TYPE_CHART[m][target];
    }
  }
  return mult;
}

/**
 * Generates a highly competitive, customized 4-move set for any Pokémon.
 * If targetOpponent is provided, builds a counter-moveset customized specifically
 * against the target's typing and stat profile!
 */
export function generateCompetitiveMoveset(
  pokemon: Pokemon,
  currentMoves: Move[] = [],
  targetOpponent?: Pokemon | null
): Move[] {
  if (!pokemon || !pokemon.moves || pokemon.moves.length === 0) {
    return [];
  }

  const movesPool = [...pokemon.moves];
  
  // If the Pokémon has 4 or fewer moves total, return all of them
  if (movesPool.length <= 4) {
    const shuffled = [...movesPool].sort(() => 0.5 - Math.random());
    return shuffled.map(m => ({
      ...m,
      currentPP: m.pp !== null && m.pp !== undefined ? m.pp : 20
    }));
  }

  // Determine Attacking Bias
  const atkStat = pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 50;
  const spaStat = pokemon.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 50;
  const isPhysicalAttacker = atkStat > spaStat + 10;
  const isSpecialAttacker = spaStat > atkStat + 10;

  const pokemonTypes = pokemon.types.map(t => t.type.name.toLowerCase());
  const currentMoveNames = new Set(currentMoves.map(m => m.name.toLowerCase()));

  // Target Opponent Analysis
  const targetTypes = targetOpponent ? targetOpponent.types.map(t => t.type.name.toLowerCase()) : [];
  const targetAtk = targetOpponent ? (targetOpponent.stats.find(s => s.stat.name === 'attack')?.base_stat || 50) : 50;
  const targetSpA = targetOpponent ? (targetOpponent.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 50) : 50;

  // 1. Score individual attacking moves
  const evaluatedAttackingMoves = movesPool
    .filter(m => m.power !== null && m.power > 0)
    .map(m => {
      let score = m.power || 40;
      const mType = m.type.toLowerCase();

      // Same Type Attack Bonus (STAB)
      const isSTAB = pokemonTypes.includes(mType);
      if (isSTAB) score *= 1.45;

      // Class synergy (Physical vs Special)
      if (m.damage_class === 'physical') {
        if (isPhysicalAttacker) score += 25;
        if (isSpecialAttacker) score -= 25;
      } else if (m.damage_class === 'special') {
        if (isSpecialAttacker) score += 25;
        if (isPhysicalAttacker) score -= 25;
      }

      // Accuracy evaluation
      const accuracy = m.accuracy !== null ? m.accuracy : 100;
      if (accuracy < 75) {
        score *= 0.75;
      } else if (accuracy >= 95) {
        score *= 1.1;
      }

      // Priority move bonus
      if (m.priority && m.priority > 0) score += 20;

      // Filter early low power moves (Tackle, Scratch, etc.)
      if ((m.power || 0) < 45 && movesPool.length > 8) {
        score -= 35;
      }

      // TARGET OPPONENT TYPE MATCHUP COUNTER BIAS
      if (targetTypes.length > 0) {
        const eff = getEffectivenessMultiplier(mType, targetTypes);
        if (eff >= 4) {
          score += 180; // Massive multiplier against 4x weak target
        } else if (eff >= 2) {
          score += 100; // Super effective coverage
        } else if (eff === 0) {
          score -= 400; // Completely immune move
        } else if (eff < 1) {
          score -= 40; // Resisted move
        }
      }

      // Slight penalty for moves currently equipped to allow variety when clicking random
      if (currentMoveNames.has(m.name.toLowerCase())) {
        score -= 15;
      }

      // Dynamic Random Variance Factor
      score += Math.random() * 35;

      return { move: m, score, effectiveness: targetTypes.length > 0 ? getEffectivenessMultiplier(mType, targetTypes) : 1 };
    })
    .sort((a, b) => b.score - a.score);

  // 2. Score status/utility/healing moves
  const evaluatedStatusMoves = movesPool
    .filter(m => m.damage_class === 'status' || m.power === null || m.power === 0)
    .map(m => {
      let score = 45;
      const nameLower = m.name.toLowerCase();

      // Top tier healing moves
      if (m.meta?.healing && m.meta.healing > 0) score += 45;
      if (nameLower.includes('recover') || nameLower.includes('roost') || nameLower.includes('soft-boiled') || nameLower.includes('synthesis')) {
        score += 60;
      }

      // High-tier Setup/Boosting moves
      if (m.stat_changes && m.stat_changes.length > 0) {
        const isSelfBuff = m.stat_changes.some(change => change.change > 0);
        if (isSelfBuff) score += 40;
      }

      // Status ailments (Will-O-Wisp, Thunder Wave, Toxic, Spore)
      if (m.meta?.ailment) {
        const ailment = m.meta.ailment.name.toLowerCase();
        if (ailment === 'sleep') {
          score += 55;
        } else if (ailment === 'burn') {
          // Extra value if target is a physical attacker
          score += (targetAtk >= targetSpA) ? 50 : 35;
        } else if (ailment === 'paralysis') {
          score += 40;
        } else if (ailment === 'poison' || ailment === 'toxic') {
          score += 30;
        }
      }

      // Protect / Substitute / Reflect / Light Screen
      if (nameLower === 'substitute' || nameLower === 'protect' || nameLower === 'reflect' || nameLower === 'light-screen' || nameLower === 'will-o-wisp') {
        score += 35;
      }

      // Low tier useless status triggers
      if (nameLower === 'splash' || nameLower === 'celebrate' || nameLower === 'hold-hands') {
        score -= 120;
      } else if (nameLower === 'growl' || nameLower === 'tail-whip' || nameLower === 'leer') {
        score -= 30;
      }

      // TARGET TYPE IMMUNITY FOR STATUS
      if (targetTypes.length > 0) {
        if (nameLower.includes('will-o-wisp') && targetTypes.includes('fire')) score -= 150;
        if (nameLower.includes('thunder-wave') && (targetTypes.includes('electric') || targetTypes.includes('ground'))) score -= 150;
        if (nameLower.includes('toxic') && (targetTypes.includes('poison') || targetTypes.includes('steel'))) score -= 150;
      }

      // Dynamic Random Variance Factor
      score += Math.random() * 30;

      return { move: m, score };
    })
    .sort((a, b) => b.score - a.score);

  // Assemble the 4-move set
  const finalRoster: Move[] = [];
  const chosenTypes = new Set<string>();
  const chosenNames = new Set<string>();

  const tryAddMove = (m: Move) => {
    if (!chosenNames.has(m.name)) {
      finalRoster.push(m);
      chosenNames.add(m.name);
      chosenTypes.add(m.type.toLowerCase());
      return true;
    }
    return false;
  };

  const pickFromTopCandidates = (candidates: { move: Move; score: number }[], topN: number = 3) => {
    const pool = candidates.slice(0, Math.min(topN, candidates.length));
    if (pool.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex].move;
  };

  // Step A: Pick best Super-Effective move against target (if target provided)
  if (targetTypes.length > 0) {
    const superEffectiveCandidates = evaluatedAttackingMoves.filter(item => item.effectiveness >= 2);
    if (superEffectiveCandidates.length > 0) {
      const superMove = pickFromTopCandidates(superEffectiveCandidates, 3);
      if (superMove) tryAddMove(superMove);
    }
  }

  // Step B: Pick primary STAB move
  const stabCandidates = evaluatedAttackingMoves.filter(item => pokemonTypes.includes(item.move.type.toLowerCase()));
  if (stabCandidates.length > 0) {
    const pickedSTAB = pickFromTopCandidates(stabCandidates, 3);
    if (pickedSTAB) tryAddMove(pickedSTAB);
  }

  // Step C: Pick high utility / status move (80% probability)
  if (evaluatedStatusMoves.length > 0 && Math.random() < 0.8) {
    const topStatus = pickFromTopCandidates(evaluatedStatusMoves, 3);
    if (topStatus) tryAddMove(topStatus);
  }

  // Step D: Pick coverage or priority move (different type)
  const coverageCandidates = evaluatedAttackingMoves.filter(item => {
    const mType = item.move.type.toLowerCase();
    return !chosenTypes.has(mType) && !chosenNames.has(item.move.name);
  });
  if (coverageCandidates.length > 0) {
    const pickedCoverage = pickFromTopCandidates(coverageCandidates, 3);
    if (pickedCoverage) tryAddMove(pickedCoverage);
  }

  // Step E: Fill any remaining empty slots from combined top scored moves
  const combinedPool = [
    ...evaluatedAttackingMoves.map(item => ({ move: item.move, score: item.score })),
    ...evaluatedStatusMoves.map(item => ({ move: item.move, score: item.score - 10 }))
  ].sort((a, b) => b.score - a.score);

  for (const item of combinedPool) {
    if (finalRoster.length >= 4) break;
    tryAddMove(item.move);
  }

  // Fallback if under 4 moves
  if (finalRoster.length < 4) {
    const remaining = movesPool.filter(m => !chosenNames.has(m.name)).sort(() => 0.5 - Math.random());
    for (const m of remaining) {
      if (finalRoster.length >= 4) break;
      tryAddMove(m);
    }
  }

  // Return formatted moves with initial PP
  return finalRoster.map(m => ({
    ...m,
    currentPP: m.pp !== null && m.pp !== undefined ? m.pp : 20
  }));
}
