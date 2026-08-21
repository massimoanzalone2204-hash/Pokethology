export interface HubCombatChallenge {
  id: string;
  tier: 'bronze' | 'silver' | 'gold';
  slot: 3 | 4;
  type: string;
  target: string;
  title: string;
  required: number;
}

export const getDailyHubCombatChallenges = (todayStr: string): HubCombatChallenge[] => {
  const hash = todayStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const types = ['water', 'fire', 'grass', 'electric', 'flying', 'bug', 'normal', 'poison', 'ground', 'rock', 'fighting', 'psychic', 'ghost', 'ice', 'dragon', 'dark', 'steel', 'fairy'];
  
  const getDailyType = (offset: number) => types[(hash + offset) % types.length];
  
  return [
    { id: 'bronze_3', tier: 'bronze', slot: 3, type: 'type', target: getDailyType(1), title: `Defeat ${getDailyType(1)} Types`, required: 3 },
    { id: 'bronze_4', tier: 'bronze', slot: 4, type: 'stat', target: 'speed', title: 'Defeat Fast Foes (120+)', required: 3 },
    { id: 'silver_3', tier: 'silver', slot: 3, type: 'type', target: getDailyType(2), title: `Defeat ${getDailyType(2)} Types`, required: 5 },
    { id: 'silver_4', tier: 'silver', slot: 4, type: 'stat', target: 'attack', title: 'Defeat High Attack (130+)', required: 5 },
    { id: 'gold_3', tier: 'gold', slot: 3, type: 'type', target: getDailyType(3), title: `Defeat ${getDailyType(3)} Types`, required: 10 },
    { id: 'gold_4', tier: 'gold', slot: 4, type: 'category', target: 'legendary', title: 'Defeat Legendary Pokémon', required: 8 },
  ];
};
