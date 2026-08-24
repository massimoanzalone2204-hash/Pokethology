export interface HubCombatChallenge {
  id: string;
  tier: 'bronze' | 'silver' | 'gold';
  slot: 3 | 4;
  type: 'type' | 'stat' | 'category' | 'form' | 'dual_type' | 'single_type';
  target: string;
  title: string;
  required: number;
}

// Simple fast pseudo-random number generator from a string seed
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

const ALL_TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 
  'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 
  'dragon', 'dark', 'steel', 'fairy'
];

const ADVANCED_TYPES = [
  'dragon', 'steel', 'ghost', 'dark', 'fairy', 'psychic', 
  'ice', 'ground', 'rock', 'fighting', 'fire', 'electric'
];

const ELITE_TYPES = [
  'dragon', 'ghost', 'steel', 'fairy', 'dark', 'psychic', 'fire', 'water'
];

export const getDailyHubCombatChallenges = (todayStr: string): HubCombatChallenge[] => {
  const baseSeed = hashCode(todayStr);
  
  // Deterministic shuffle helper using date seed
  const pickRandom = <T>(arr: T[], offset: number): T => {
    const r = seededRandom(baseSeed + offset * 1337 + 42);
    const index = Math.floor(r * arr.length);
    return arr[index];
  };

  // --- BRONZE TIER (SLOT 3 & 4) ---
  // Slot 3: Elemental Type challenge
  const bronzeType = pickRandom(ALL_TYPES, 1);
  const bronzeChallengeSlot3: HubCombatChallenge = {
    id: 'bronze_3',
    tier: 'bronze',
    slot: 3,
    type: 'type',
    target: bronzeType,
    title: `Defeat ${bronzeType.charAt(0).toUpperCase() + bronzeType.slice(1)} Types`,
    required: ['dragon', 'ghost', 'steel', 'fairy'].includes(bronzeType) ? 2 : 3
  };

  // Slot 4: High Stat or Typing Variety challenge
  const bronzeSlot4Pool: Omit<HubCombatChallenge, 'id' | 'tier' | 'slot'>[] = [
    { type: 'stat', target: 'speed', title: 'Defeat High Speed Foes (110+ Speed)', required: 3 },
    { type: 'stat', target: 'attack', title: 'Defeat High Attack Foes (110+ Atk)', required: 3 },
    { type: 'stat', target: 'special-attack', title: 'Defeat High Sp. Atk Foes (110+ Sp.Atk)', required: 3 },
    { type: 'stat', target: 'defense', title: 'Defeat High Defense Foes (110+ Def)', required: 3 },
    { type: 'stat', target: 'special-defense', title: 'Defeat High Sp. Def Foes (110+ Sp.Def)', required: 3 },
    { type: 'stat', target: 'hp', title: 'Defeat High HP Foes (110+ HP)', required: 3 },
    { type: 'single_type', target: 'single', title: 'Defeat Pure Single-Type Pokémon', required: 3 },
    { type: 'dual_type', target: 'dual', title: 'Defeat Dual-Type Pokémon', required: 3 }
  ];
  const bronzeSlot4Choice = pickRandom(bronzeSlot4Pool, 2);
  const bronzeChallengeSlot4: HubCombatChallenge = {
    ...bronzeSlot4Choice,
    id: 'bronze_4',
    tier: 'bronze',
    slot: 4
  };

  // --- SILVER TIER (SLOT 7 & 8) ---
  // Slot 3 (Activity 7): Advanced Elemental Type
  const silverTypeCandidates = ADVANCED_TYPES.filter(t => t !== bronzeType);
  const silverType = pickRandom(silverTypeCandidates, 3);
  const silverSlot3Pool: Omit<HubCombatChallenge, 'id' | 'tier' | 'slot'>[] = [
    { type: 'type', target: silverType, title: `Defeat ${silverType.charAt(0).toUpperCase() + silverType.slice(1)} Types`, required: 5 },
    { type: 'stat', target: 'defense', title: 'Defeat Huge Defense Fortresses (130+ Def)', required: 4 },
    { type: 'stat', target: 'attack', title: 'Defeat Huge Attack Powerhouses (130+ Atk)', required: 4 }
  ];
  const silverSlot3Choice = pickRandom(silverSlot3Pool, 4);
  const silverChallengeSlot3: HubCombatChallenge = {
    ...silverSlot3Choice,
    id: 'silver_3',
    tier: 'silver',
    slot: 3
  };

  // Slot 4 (Activity 8): Huge Statistics, Mega, G-Max, or Legendary
  const silverSlot4Pool: Omit<HubCombatChallenge, 'id' | 'tier' | 'slot'>[] = [
    { type: 'stat', target: 'speed', title: 'Defeat Huge Speed Sweepers (125+ Speed)', required: 4 },
    { type: 'stat', target: 'attack', title: 'Defeat Huge Attack Powerhouses (130+ Atk)', required: 4 },
    { type: 'stat', target: 'special-attack', title: 'Defeat Huge Special Attack Foes (130+ Sp.Atk)', required: 4 },
    { type: 'stat', target: 'defense', title: 'Defeat Huge Defense Bastions (130+ Def)', required: 4 },
    { type: 'stat', target: 'special-defense', title: 'Defeat Huge Special Defense Walls (130+ Sp.Def)', required: 4 },
    { type: 'stat', target: 'hp', title: 'Defeat Huge HP Juggernauts (130+ HP)', required: 4 },
    { type: 'stat', target: 'bst', title: 'Defeat Huge Base Stat Foes (520+ BST)', required: 4 },
    { type: 'category', target: 'mega', title: 'Defeat Mega Evolutions & Primal Forms', required: 3 },
    { type: 'category', target: 'gmax', title: 'Defeat Gigantamax & Dynamax Powerhouses', required: 3 },
    { type: 'category', target: 'legendary', title: 'Defeat Legendary or Mythical Pokémon', required: 3 }
  ];
  const silverSlot4Choice = pickRandom(silverSlot4Pool, 5);
  const silverChallengeSlot4: HubCombatChallenge = {
    ...silverSlot4Choice,
    id: 'silver_4',
    tier: 'silver',
    slot: 4
  };

  // --- GOLD TIER (SLOT 11 & 12) ---
  // Slot 3 (Activity 11): Elite Type Mastery or Huge Defense/Attack
  const goldTypeCandidates = ELITE_TYPES.filter(t => t !== bronzeType && t !== silverType);
  const goldType = pickRandom(goldTypeCandidates.length > 0 ? goldTypeCandidates : ELITE_TYPES, 6);
  const goldSlot3Pool: Omit<HubCombatChallenge, 'id' | 'tier' | 'slot'>[] = [
    { type: 'type', target: goldType, title: `Mastery: Defeat ${goldType.charAt(0).toUpperCase() + goldType.slice(1)} Types`, required: 7 },
    { type: 'stat', target: 'defense', title: 'Crush Colossal Defense Bastions (150+ Def)', required: 5 },
    { type: 'stat', target: 'special-defense', title: 'Penetrate Colossal Sp. Defense Walls (140+ Sp.Def)', required: 5 },
    { type: 'stat', target: 'speed', title: 'Outspeed Apex Speed Foes (135+ Speed)', required: 5 },
    { type: 'stat', target: 'attack', title: 'Withstand Apex Attack Power (140+ Attack)', required: 5 }
  ];
  const goldSlot3Choice = pickRandom(goldSlot3Pool, 7);
  const goldChallengeSlot3: HubCombatChallenge = {
    ...goldSlot3Choice,
    id: 'gold_3',
    tier: 'gold',
    slot: 3
  };

  // Slot 4 (Activity 12): Legendary, Mythical, Mega, G-Max, or Colossal Stats
  const goldSlot4Pool: Omit<HubCombatChallenge, 'id' | 'tier' | 'slot'>[] = [
    { type: 'category', target: 'legendary', title: 'Defeat Legendary or Mythical Pokémon', required: 5 },
    { type: 'category', target: 'mega', title: 'Defeat Mega-Evolved & Primal Pokémon', required: 4 },
    { type: 'category', target: 'gmax', title: 'Defeat Gigantamax & Dynamax Powerhouses', required: 4 },
    { type: 'stat', target: 'attack', title: 'Overpower Huge Attack Powerhouses (140+ Attack)', required: 5 },
    { type: 'stat', target: 'defense', title: 'Break Through Huge Defense Bastions (150+ Defense)', required: 5 },
    { type: 'stat', target: 'special-attack', title: 'Overcome Huge Special Attack Power (140+ Sp.Atk)', required: 5 },
    { type: 'stat', target: 'bst', title: 'Defeat Colossal Base Stat Powerhouses (580+ BST)', required: 5 }
  ];
  const goldSlot4Choice = pickRandom(goldSlot4Pool, 8);
  const goldChallengeSlot4: HubCombatChallenge = {
    ...goldSlot4Choice,
    id: 'gold_4',
    tier: 'gold',
    slot: 4
  };

  return [
    bronzeChallengeSlot3,
    bronzeChallengeSlot4,
    silverChallengeSlot3,
    silverChallengeSlot4,
    goldChallengeSlot3,
    goldChallengeSlot4
  ];
};
