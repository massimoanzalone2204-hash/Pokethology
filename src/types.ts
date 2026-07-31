export interface Ability {
  name: string;
  is_hidden: boolean;
  description: string;
}

export interface GameStat {
  game: string;
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

export interface EvolutionDetail {
  min_level?: number;
  min_happiness?: number;
  item?: { name: string };
  trigger?: { name: string };
  time_of_day?: string;
  location?: { name: string };
  known_move?: { name: string };
  known_move_type?: { name: string };
  min_affection?: number;
  min_beauty?: number;
  trade_species?: { name: string };
  party_species?: { name: string };
  party_type?: { name: string };
  needs_overworld_rain?: boolean;
  turn_upside_down?: boolean;
}

export interface EvolutionNode {
  id: number;
  name: string;
  image: string;
  evolves_to: EvolutionNode[];
  evolution_details?: EvolutionDetail[];
}

export interface Move {
  name: string;
  url: string;
  level_learned_at?: number;
  learn_method: 'level-up' | 'machine' | 'egg' | 'tutor' | 'other';
  power: number | null;
  accuracy: number | null;
  priority?: number;
  type: string;
  pp: number;
  currentPP?: number;
  damage_class: 'physical' | 'special' | 'status';
  description?: string;
  effect_chance: number | null;
  stat_changes?: {
    change: number;
    stat: {
      name: string;
    };
  }[];
  meta?: {
    ailment?: {
      name: string;
    };
    category?: {
      name: string;
    };
    min_hits?: number;
    max_hits?: number;
    min_turns?: number;
    max_turns?: number;
    drain?: number;
    healing?: number;
    crit_rate?: number;
    ailment_chance?: number;
    flinch_chance?: number;
    stat_chance?: number;
  };
  target?: string;
}

export interface Pokemon {
  id: number;
  baseId?: number;
  name: string;
  sprites: {
    front_default: string;
    front_female?: string;
    front_shiny?: string;
    front_shiny_female?: string;
    back_default?: string;
    back_female?: string;
    back_shiny?: string;
    back_shiny_female?: string;
    other: {
      'official-artwork': {
        front_default: string;
        front_female?: string;
        front_shiny?: string;
        front_shiny_female?: string;
      };
      home?: {
        front_default: string;
        front_female?: string;
        front_shiny?: string;
        front_shiny_female?: string;
      };
      showdown: {
        front_default: string;
        front_female?: string;
        front_shiny?: string;
        front_shiny_female?: string;
        back_default?: string;
        back_female?: string;
        back_shiny?: string;
        back_shiny_female?: string;
      };
    };
  };
  cries?: {
    latest: string;
    legacy: string;
  };
  types: {
    type: {
      name: string;
      localized_name?: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort?: number;
    stat: {
      name: string;
    };
  }[];
  base_experience?: number;
  capture_rate?: number;
  growth_rate?: string;
  gameStats?: GameStat[];
  weight: number;
  height: number;
  abilities: Ability[];
  evolutionChain: EvolutionNode | null;
  weaknesses: string[];
  description: string;
  moves: Move[];
  varieties?: {
    is_default: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }[];
  gameDescriptions?: {
    version: string;
    flavor_text: string;
  }[];
}

export type LogEntry = {
  text: string;
  type: 'normal' | 'critical' | 'effective' | 'not-effective' | 'stat-boost' | 'stat-lower' | 'status-effect' | 'faint' | 'system' | 'opponent' | 'player';
};

export type MissionCategory = 'theory' | 'combat' | 'pokedex' | 'reactivity';
export type MissionDifficulty = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Mission {
  id: string;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  title: string;
  description: string;
}
