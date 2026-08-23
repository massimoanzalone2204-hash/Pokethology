import React, { useState, useEffect, memo, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, hudButtonClass, playHaptic } from '../lib/utils';
import { getDailyHubCombatChallenges } from '../utils/dailyHubChallenges';
import { sounds } from '../lib/sounds';
import { HUDCorners } from './HUDCorners';
import { ParticleExplosion } from './ParticleExplosion';
import { MissionCategory } from '../types';
import { 
  Swords, 
  Trophy, 
  CheckCircle, 
  CheckCircle2,
  XCircle,
  ShieldAlert, 
  Award, 
  Star, 
  Flame, 
  Sparkles, 
  BrainCircuit, 
  Check, 
  Zap, 
  HelpCircle, 
  Compass, 
  Activity, 
  Timer,
  RefreshCw,
  Gauge,
  Download,
  UserCheck,
  Shield,
  Search,
  Sparkle,
  BookOpen,
  GraduationCap,
  Target,
  ShieldCheck,
  Crown,
  Scroll,
  Puzzle
} from 'lucide-react';

export interface CombatMission {
  id: string;
  type: 'type' | 'stat' | 'defeat';
  target: string;
  description: string;
  rewardPoints: number;
  hardModeTarget?: string;
  hardModeDescription?: string;
  hardModeMultiplier?: number;
}

export const COMBAT_MISSIONS: CombatMission[] = [
  { id: 'water', type: 'type', target: 'water', description: 'Defeat Water-type Pokémon in battle to complete the mission.', rewardPoints: 180 },
  { id: 'fire', type: 'type', target: 'fire', description: 'Defeat Fire-type Pokémon in battle to complete the mission.', rewardPoints: 180 },
  { id: 'grass', type: 'type', target: 'grass', description: 'Defeat Grass-type Pokémon in battle to complete the mission.', rewardPoints: 180 },
  { id: 'electric', type: 'type', target: 'electric', description: 'Defeat Electric-type Pokémon in battle to complete the mission.', rewardPoints: 180 },
  { id: 'dragon', type: 'type', target: 'dragon', description: 'Defeat Dragon-type Pokémon in battle to complete the mission.', rewardPoints: 300 },
  { id: 'steel', type: 'type', target: 'steel', description: 'Defeat Steel-type Pokémon in battle to complete the mission.', rewardPoints: 250 },
  { id: 'ghost', type: 'type', target: 'ghost', description: 'Defeat Ghost-type Pokémon in battle to complete the mission.', rewardPoints: 250 },
  { id: 'flying', type: 'type', target: 'flying', description: 'Defeat Flying-type Pokémon in battle to complete the mission.', rewardPoints: 180 },
  { id: 'heavy', type: 'stat', target: 'defense', description: 'Defeat a Pokémon with a very high Defense stat (150+ Base Defense) in battle.', rewardPoints: 220 },
];

export const getDailyCombatMission = (todayStr: string, isHardMode: boolean = false): CombatMission => {
  const hash = todayStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % COMBAT_MISSIONS.length;
  return COMBAT_MISSIONS[index];
};

export const getRequiredCount = (mission: CombatMission, isHardMode: boolean = false): number => {
  if (isHardMode) {
    return 3; // Hard mode is always 3
  }
  // Standard mode: Rare/difficult types require 2 defeats, other types require 3
  if (['dragon', 'steel', 'ghost', 'heavy'].includes(mission.id)) {
    return 2;
  }
  return 3;
};

interface TriviaQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

const EASY_TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    question: "Which status condition is famously known to cut the inflicted Pokémon's offensive physical Attack stat by 50% in standard combat generations?",
    options: ["PARALYSIS", "BURN", "POISON", "SLEEP"],
    answerIndex: 1,
    explanation: "Burn! Aside from dealing constant minor damage each turn, a Burn reduces physical damage output (Attack stat) by half, making it a critical strategic counter against physical sweepers."
  },
  {
    question: "Under normal battle circumstances, which of these dual-type combinations yields a completely unique type profile with absolutely zero weakness?",
    options: ["ELECTRIC/GHOST", "DARK/POISON", "SABLEYE (GHOST/DARK) BEFORE GEN 6", "NORMAL/GHOST"],
    answerIndex: 2,
    explanation: "Sableye (and Spiritomb) with Ghost/Dark typing had absolutely zero type weaknesses before the introduction of Fairy-type in Gen 6!"
  },
  {
    question: "Which Choice held item boosts the user's Speed by 50% but restricts them to executing only the first selected move?",
    options: ["CHOICE SCARF", "CHOICE BAND", "LIFE ORB", "ASSAULT VEST"],
    answerIndex: 0,
    explanation: "Choice Scarf! It boosts Speed by 50% but locks the holder into the first move used until switched out."
  },
  {
    question: "An adversary has the 'Levitate' ability, making them immune to Ground-type attacks. Which of these moves bypasses or removes this immunity entirely?",
    options: ["GRAVITY", "SANDSTORM", "EARTHQUAKE", "MUD-SLAP"],
    answerIndex: 0,
    explanation: "Gravity targets all airborne/flying/levitating units, grounding them and making Ground-type attacks like Earthquake fully hit!"
  },
  {
    question: "Which of the following original Sinnoh myths refers to the creation of the universe from a single egg placed at the vortex of chaos?",
    options: ["THE LEGEND OF SNOWPOINT", "THE LEGEND OF RUIN", "THE CREATION MYTH OF ARCEUS", "THE MYTH OF VEILSTONE"],
    answerIndex: 2,
    explanation: "The Sinnoh creation myth states that in the beginning inside the vortex of chaos, a single Egg emerged, from which the Original One (Arceus) hatched, shaping temporal space and dimensional realms."
  },
  {
    question: "According to Kanto research, which unique species represents the phylogenetic root of all Pokémon due to carrying the genetic codes of every species?",
    options: ["DITTO", "ARCEUS", "MEW", "BULBASAUR"],
    answerIndex: 2,
    explanation: "Mew! It contains the DNA of all Pokémon species, enabling it to learn every single TM, HM, and tutor move available."
  },
  {
    question: "Which environmental weather condition increases the damage of Water-type moves by 50% while decreasing Fire-type move damage by 50%?",
    options: ["SNOW", "RAIN", "SANDSTORM", "HARSH SUNLIGHT"],
    answerIndex: 1,
    explanation: "Rain! Aside from boosting Water moves and weakening Fire moves, it enables perfect-accuracy Hurricanes and Thunders."
  },
  {
    question: "Which traditional entry hazard inflicts percentage damage immediately on switch-in based purely on the target's type-effectiveness weakness to Rock?",
    options: ["STEALTH ROCK", "SPIKES", "TOXIC SPIKES", "STICKY WEB"],
    answerIndex: 0,
    explanation: "Stealth Rock! It inflicts up to 50% of maximum health on switch-in to Fire/Flying types like Charizard, while doing negligible damage to Rock/Ground types."
  }
];

const MEDIUM_TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    question: "During Harsh Sunlight (Sunny Day), which specific base stat modification or damage multiplier occurs for Fire-type and Water-type moves?",
    options: [
      "FIRE MOVES DEAL 1.5X DAMAGE, WATER MOVES DEAL 0.5X DAMAGE",
      "FIRE MOVES DEAL 2.0X DAMAGE, WATER MOVES ARE COMPLETELY DISABLED",
      "FIRE MOVES GAIN 100% ACCURACY, WATER MOVES DEAL 0.75X DAMAGE",
      "FIRE MOVES DEAL 1.5X DAMAGE, WATER MOVES DEAL 0.8X DAMAGE"
    ],
    answerIndex: 0,
    explanation: "Harsh Sunlight boosts the base power of Fire-type moves by 50% (1.5x) and reduces the base power of Water-type moves by 50% (0.5x)."
  },
  {
    question: "Which legendary Pokémon has a legendary signature item that historically granted a 50% increase to both its Special Attack and Special Defense stats when held?",
    options: ["DIALGA (ADAMANT ORB)", "LATIOS (SOUL DEW)", "PALKIA (LUSTROUS ORB)", "GIRATINA (GRISEOUS ORB)"],
    answerIndex: 1,
    explanation: "Soul Dew! In Generations 3 to 6, holding Soul Dew boosted Latios or Latias's Special Attack and Special Defense by 50%!"
  },
  {
    question: "What is the exact maximum possible base power of the Ghost-type move 'Rage Fist' after the user has taken a high volume of direct combat strikes?",
    options: ["200 BASE POWER", "250 BASE POWER", "300 BASE POWER", "350 BASE POWER"],
    answerIndex: 3,
    explanation: "Rage Fist starts with 50 base power. Each hit received increases its power by 50, capping out at a devastating 350 base power!"
  },
  {
    question: "Which of these Gen 1 mechanics was notoriously glitched, causing high-speed Pokémon to have an astronomically higher critical hit rate?",
    options: [
      "CRITICAL HIT RATE TIED DIRECTLY TO THE BASE SPEED STAT",
      "FOCUS ENERGY MULTIPLYING SPECIFIC ATTACK STATS",
      "PARALYSIS BOOSTING CRITICAL RATES BY 20%",
      "PUDDING CORRUPTION OF MEMORY MAP"
    ],
    answerIndex: 0,
    explanation: "In Gen 1, critical hit probability was calculated as: Base Speed * 100 / 512. High-speed units like Electrode and Persian critted almost constantly!"
  },
  {
    question: "Archaeological texts from the Solaceon Ruins map the strange glyph-like species 'Unown' as which of the following conceptual mechanisms?",
    options: [
      "MESSENGERS SENT BY CELESTIAL METEORITES",
      "FOSSILS BROUGHT TO LIFE BY GEOLOGICAL HEAT",
      "THE SYMBOLIC VISUAL REPRESENTATION OF THE ENTIRE CREATIVE ALPHABET",
      "MUTATED GHOSTS FROM BROKEN REEF REALMS"
    ],
    answerIndex: 2,
    explanation: "Unown appear as flat characters resembling letters. Research implies they represent the primeval language alphabet used to draft reality!"
  },
  {
    question: "The ancient tectonic legends of the Sinnoh region state that Regigigas moved entire continents into place using which unique method?",
    options: [
      "CHOPPING THE LANDMASSES WITH BRUTAL FORCE",
      "WEAVING ROPES OF HEAVY LEYLINES AND PULLING THEM OVER THE SEA",
      "USING VOLCANIC MAGMA CURRENTS",
      "SPINNING THE POLAR FIELD OF THE EARTH"
    ],
    answerIndex: 1,
    explanation: "Legend says Regigigas bound huge tectonic landmasses together using heavy, durable ropes and dragged the continents across oceans."
  },
  {
    question: "How does the Burn status effect alter the offensive capacity of more resilient Pokémon holding the 'Guts' ability?",
    options: [
      "IT CUTS ATTACK NORMAL BY 50% ANYWAY",
      "IT NEGATES ALL STATUS HEALING TO ZERO",
      "IT COMPLETELY BYPASSES BURN'S REDUCTION AND BOOSTS ATTACK BY 50%",
      "IT DEALS DOUBLE REFLEXIVE CHIP DAMAGE TO THE ENEMY"
    ],
    answerIndex: 2,
    explanation: "Guts ignores the physical Attack halving effect of Burn and instead activates a 50% offensive Attack stat boost!"
  },
  {
    question: "Which terrain effect prevents grounded participants in active battle from being afflicted by any major status conditions (burn, sleep, freeze, poison, paralysis)?",
    options: ["ELECTRIC TERRAIN", "GRASSY TERRAIN", "PSYCHIC TERRAIN", "MISTY TERRAIN"],
    answerIndex: 3,
    explanation: "Misty Terrain! Grounded units standing on Misty Terrain cannot be statused or confused, protecting them from classic status plays."
  },
  {
    question: "Which battle item doubles the effective Speed stat of the holder in combat, but restricts them to executing only the first move selected?",
    options: ["CHOICE SCARF", "CHOICE BAND", "CHOICE SPECS", "LIFE ORB"],
    answerIndex: 0,
    explanation: "Choice Scarf boosts Speed by 50% (1.5x) but locks the user into the selected move until switched out!"
  },
  {
    question: "What occurs when Shedinja (ability Wonder Guard) is struck by a direct move that is NOT super-effective against Bug/Ghost?",
    options: [
      "IT TAKES ABSOLUTELY ZERO DAMAGE FROM THE DIRECT ATTACK",
      "IT TAKES HALF DAMAGE",
      "IT TAKES MINIMUM 1 HP DAMAGE",
      "THE ATTACK IS REFLECTED BACK"
    ],
    answerIndex: 0,
    explanation: "Wonder Guard blocks all direct attack damage except moves that deal super-effective damage!"
  },
  {
    question: "What beneficial stat multiplier is bestowed by the held item 'Eviolite' when equipped on a Pokémon species that is NOT fully evolved?",
    options: [
      "BOOSTS BOTH DEFENSE AND SPECIAL DEFENSE BY 50%",
      "BOOSTS MAXIMUM HP BY 50%",
      "BOOSTS ATTACK AND SPEED BY 30%",
      "DOUBLES SPECIAL ATTACK"
    ],
    answerIndex: 0,
    explanation: "Eviolite increases the Defense and Special Defense of unevolved species by 1.5x (50%), making Pokémon like Chansey and Dusclops exceptionally bulky!"
  },
  {
    question: "Which entry hazard inflicts direct percentage damage on switch-in to Flying-type or Levitate Pokémon that are immune to Spikes?",
    options: ["STEALTH ROCK", "TOXIC SPIKES", "STICKY WEB", "SHADOW TRAP"],
    answerIndex: 0,
    explanation: "Stealth Rock deals Rock-type hazard damage on switch-in regardless of whether the target is grounded or airborne!"
  },
  {
    question: "What is the primary effect of Psychic Terrain on grounded Pokémon when active on the field?",
    options: [
      "BLOCKS INCREASED PRIORITY MOVES TARGETING GROUNDED ALLIES AND BOOSTS PSYCHIC POWER BY 30%",
      "PREVENTS ALL STATUS CONDITIONS AND BOOSTS SPEED",
      "RECOVERS 1/16 HP PER TURN FOR ALL UNITS",
      "DOUBLES CRITICAL HIT RATIO FOR PSYCHIC SPECIES"
    ],
    answerIndex: 0,
    explanation: "Psychic Terrain prevents targeted priority moves (like Extreme Speed or Aqua Jet) from striking grounded Pokémon and increases Psychic move power!"
  }
];

const HARD_TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    question: "In Generation 6 onwards, what is the maximum EV cap in a single stat, and how many absolute stat points does it yield at Level 100?",
    options: [
      "252 EVS YIELDING +63 STAT POINTS",
      "255 EVS YIELDING +63 STAT POINTS",
      "252 EVS YIELDING +126 STAT POINTS",
      "510 EVS YIELDING +127 STAT POINTS"
    ],
    answerIndex: 0,
    explanation: "In Gen 6+, EVs are capped at 252 per stat (instead of 255). Since 4 EVs equal 1 stat point at Level 100, 252 EVs yield exactly 63 additional points (252 / 4 = 63)."
  },
  {
    question: "Under Trick Room conditions, what is the exact execution priority tier of standard priority moves like 'Extreme Speed' (+2) versus 'Detect' (+4)?",
    options: [
      "TRICK ROOM REVERSES BOTH SPEED AND ALL PRIORITY BRACKETS IN THE TURN",
      "TRICK ROOM REVERSES INDIVIDUAL SPEED WITHIN THE SAME PRIORITY BRACKET ONLY",
      "PRIORITY BRACKETS ALWAYS BECOME NEGATIVE INSTEAD",
      "SPEED STATS COMPUTE NORMALLY BUT TURN ORDER IS CHRONOLOGICALLY INVERTED"
    ],
    answerIndex: 1,
    explanation: "Trick Room only reverses the turn sequence within each priority bracket based on Speed. Priority brackets (+4, +2, etc.) still execute in standard order!"
  },
  {
    question: "What happens when a Pokémon with the 'Dry Skin' ability holds a 'Ring Target' and is struck by a Water-type move in standard rain?",
    options: [
      "IT ABSORBS THE MOVE AND RECOVERS 25% HP DUE TO DRY SKIN BENEFITS",
      "IT TAKES 1.25X DAMAGE BECAUSE RING TARGET REMOVES IMMUNITY AND VULNERABILITY",
      "IT TAKES ZERO DAMAGE BUT FAILS TO RECOVER HEALTH",
      "THE RAIN DOUBLES THE HEALING EFFECT RESULTING IN 50% HP RECOVERY"
    ],
    answerIndex: 0,
    explanation: "Dry Skin confers a Water absorption/immunity benefit (healing instead of damage). Ring Target removes immune type matchups, but since Water is not immune to water under normal conditions, Dry Skin functions perfectly, healing the Pokémon by 25%!"
  },
  {
    question: "If a level 100 Pokémon with 300 Attack uses 'Self-Destruct' (200 base power) against a target with 200 Defense in Gen 1, what unique formula quirk occurs?",
    options: [
      "THE TARGET'S DEFENSE IS TEMPORARILY HALVED TO 100 DURING DAMAGE CALCULATION",
      "THE MOVE AUTOMATICALLY INFLICTS A GUARANTEED CRITICAL HIT DUE TO PHYSICAL ENERGY SPIKE",
      "THE USER'S SPEED STAT IS ADDED DIRECTLY TO DAMAGE CALCULATIONS",
      "THE HP OF ALL PARTY MEMBERS IS DRAINED TO FUEL THE BLAST"
    ],
    answerIndex: 0,
    explanation: "In Generations 1 to 4, Self-Destruct and Explosion had a hidden effect that halved the target's Defense stat during the damage check, essentially doubling their effective base power!"
  },
  {
    question: "In Sinnoh's cosmology, has been verified that Giratina represents antimatter, Dialga time, and Palkia space. Where was Giratina banished to by Arceus due to its highly unstable physics?",
    options: [
      "THE DEPTHS OF MT. CORONET",
      "THE ABYSSAL DEEP SEA TRENCH",
      "THE DISTORTION WORLD WHERE PHYSICS, TIME, AND DIRECTIONS ARE COMPLETELY BROKEN",
      "THE SPACE BETWEEN TEMPORAL PORTALS"
    ],
    answerIndex: 2,
    explanation: "Banished into the Distortion World! There, gravity flows in erratic patterns, writing is flipped, and standard dimensions fail to follow linear geometric logic."
  },
  {
    question: "Necrozma's ability to pull light particles into its core and convert them to dark energy is a physical metaphor for which cosmic phenomenon?",
    options: [
      "A HYDROGEN ATMOSPHERE STELLAR SOLAR ECLIPSE",
      "SUPER-MASSIVE BLACK HOLES AND STELLAR GRAVITY COLLAPSE",
      "THE QUANTUM REFRIGERATION COOLING METHOD",
      "CHRONO-GEOMETRIC LORE MATRIX CHANNELS"
    ],
    answerIndex: 1,
    explanation: "Black holes! Necrozma behaves like a stellar black hole, absorbing all electromagnetic light to sustain its massive, heavy energy density."
  },
  {
    question: "If an active combat challenger holds an Assault Vest, which moveset functions are completely blocked from execution?",
    options: [
      "PHYSICAL ATTACK SKILLS",
      "FIRE-BASED MOVES AND RECOIL ATTACKS",
      "RECOVERY MOVES TIER 1",
      "ANY MOCK STATUS OR NON-DAMAGE STATUS MOVES"
    ],
    answerIndex: 3,
    explanation: "Assault Vest boosts Special Defense by 50% but restricts the bearer to only spending turns executing offensive damaging attacks. Status moves are completely blocked!"
  },
  {
    question: "The Sinnoh Legends record that the Lake Guardians (Uxie, Mesprit, Azelf) can materialize a specific object. What was forged by Cyrus to bind Dialga and Palkia's spatial power?",
    options: [
      "THE ORIGIN ORB OF DECAY",
      "THE RED CHAIN FORGED FROM BALANCED SPIRIT CRUCIBLES",
      "THE CHRONO KEYS OF DISTORTION",
      "THE CELESTIAL DRAGON FLUTE"
    ],
    answerIndex: 1,
    explanation: "The Red Chain! Combining the mystical crystals of the Lake Trio, Cyrus forged the Red Chain to directly constrain Palkia and Dialga without standard PokeBall trapping mechanics."
  },
  {
    question: "How does the ability 'Supreme Overlord' (Kingambit) dynamically scale damage in competitive battles?",
    options: [
      "GAINS +10% DAMAGE FOR EACH FAINTED ALLY IN THE PARTY",
      "GAINS +20% ATTACK PER FAINTED OPPONENT",
      "DOUBLES CRITICAL RATE WHEN HP IS BELOW 25%",
      "GAINS +50% SPEED IF KINGAMBIT IS THE LAST REMAINING POKÉMON"
    ],
    answerIndex: 0,
    explanation: "Supreme Overlord grants a 10% damage increase for every fainted party member, capping out at a 50% boost when 5 allies have fallen!"
  },
  {
    question: "What is the exact STAB (Same Type Attack Bonus) multiplier for a Pokémon possessing the 'Adaptability' ability?",
    options: ["2.0X MULTIPLIER", "1.5X MULTIPLIER", "1.75X MULTIPLIER", "2.5X MULTIPLIER"],
    answerIndex: 0,
    explanation: "Adaptability elevates the standard STAB multiplier from 1.5x to a massive 2.0x for moves matching the user's typing!"
  },
  {
    question: "Which capability defines the 'Pixilate', 'Refrigerate', and 'Aerilate' abilities?",
    options: [
      "TURNS NORMAL-TYPE MOVES INTO FAIRY/ICE/FLYING AND BOOSTS THEIR POWER BY 20%",
      "GRANTS IMMUNITY TO FAIRY/ICE/FLYING ATTACKS AND HEALS HP",
      "DOUBLES STAB DAMAGE FOR RELEVANT TYPES",
      "ALLOWS MOVES TO HIT GHOST TYPES FOR SUPER-EFFECTIVE DAMAGE"
    ],
    answerIndex: 0,
    explanation: "Galvanize/Pixilate/Refrigerate/Aerilate convert Normal-type moves to their respective element and grant an extra 20% power boost!"
  },
  {
    question: "How does the Ghost-type move 'Hex' behave when targeting an opponent suffering from a major status condition?",
    options: [
      "BASE POWER DOUBLES FROM 65 TO 130",
      "CRITICAL HIT CHANCE BECOMES 100%",
      "RECOVERS 50% OF DAMAGE DEALT AS HP",
      "BYPASSES ALL DEFENSIVE STAT MODIFIERS"
    ],
    answerIndex: 0,
    explanation: "Hex doubles its base power from 65 to 130 if the target is afflicted with burn, poison, paralysis, sleep, or freeze!"
  },
  {
    question: "In Generation 9 Terastallization mechanics, what happens to STAB when a Pokémon Terastallizes into a Tera type that matches one of its ORIGINAL base types?",
    options: [
      "STAB MULTIPLIER INCREASES FROM 1.5X TO 2.0X FOR THAT TYPE",
      "STAB MULTIPLIER REMAINS EXACTLY 1.5X WITHOUT CHANGE",
      "STAB MULTIPLIER BECOMES 3.0X FOR PHYSICAL MOVES ONLY",
      "BASE POWER OF ALL MOVES OF THAT TYPE IS INCREASED BY 50 BASE POWER"
    ],
    answerIndex: 0,
    explanation: "Terastallizing into a Tera Type matching an original base type boosts the STAB bonus for that type from 1.5x to 2.0x!"
  }
];

interface PokethologyCombatMissionWidgetProps {
  todayStr: string;
  isCompleted: boolean;
  missionProgressCount?: number;
  missionRequiredCount?: number;
  dailyStreak?: number;
}




function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      // Ignore
    }
  }, [key, state]);

  return [state, setState];
}

export const PokethologyCombatMissionWidget: React.FC<PokethologyCombatMissionWidgetProps> = memo(({ todayStr, isCompleted, missionProgressCount, missionRequiredCount, dailyStreak }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'bronze' | 'silver' | 'gold'>('bronze');

  const hash = useMemo(() => todayStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0), [todayStr]);

  const easyTriviaQuestion = EASY_TRIVIA_QUESTIONS[hash % EASY_TRIVIA_QUESTIONS.length];
  const easyTriviaQuestionB = EASY_TRIVIA_QUESTIONS[(hash + 1) % EASY_TRIVIA_QUESTIONS.length];
  
  const medTriviaQuestion = MEDIUM_TRIVIA_QUESTIONS[(hash + 3) % MEDIUM_TRIVIA_QUESTIONS.length];
  const medTriviaQuestionB = MEDIUM_TRIVIA_QUESTIONS[(hash + 5) % MEDIUM_TRIVIA_QUESTIONS.length];
  
  const hardTriviaQuestion = HARD_TRIVIA_QUESTIONS[Math.abs(hash) % HARD_TRIVIA_QUESTIONS.length];
  const hardTriviaQuestionB = HARD_TRIVIA_QUESTIONS[(hash + 1) % HARD_TRIVIA_QUESTIONS.length];

  const combatChallenges = useMemo(() => getDailyHubCombatChallenges(todayStr), [todayStr]);

  // Persistent States
  const [easyStatusA, setEasyStatusA] = usePersistentState<'unanswered'|'correct'|'incorrect'>(`pokethology_hub_easy_a_${todayStr}`, 'unanswered');
  const [easyOptA, setEasyOptA] = usePersistentState<number|null>(`pokethology_hub_easy_opta_${todayStr}`, null);
  
  const [easyStatusB, setEasyStatusB] = usePersistentState<'unanswered'|'correct'|'incorrect'>(`pokethology_hub_easy_b_${todayStr}`, 'unanswered');
  const [easyOptB, setEasyOptB] = usePersistentState<number|null>(`pokethology_hub_easy_optb_${todayStr}`, null);
  
  const [medStatusA, setMedStatusA] = usePersistentState<'unanswered'|'correct'|'incorrect'>(`pokethology_hub_med_a_${todayStr}`, 'unanswered');
  const [medOptA, setMedOptA] = usePersistentState<number|null>(`pokethology_hub_med_opta_${todayStr}`, null);
  
  const [medStatusB, setMedStatusB] = usePersistentState<'unanswered'|'correct'|'incorrect'>(`pokethology_hub_med_b_${todayStr}`, 'unanswered');
  const [medOptB, setMedOptB] = usePersistentState<number|null>(`pokethology_hub_med_optb_${todayStr}`, null);
  
  const [hardStatusA, setHardStatusA] = usePersistentState<'unanswered'|'correct'|'incorrect'>(`pokethology_hub_hard_a_${todayStr}`, 'unanswered');
  const [hardOptA, setHardOptA] = usePersistentState<number|null>(`pokethology_hub_hard_opta_${todayStr}`, null);
  
  const [hardStatusB, setHardStatusB] = usePersistentState<'unanswered'|'correct'|'incorrect'>(`pokethology_hub_hard_b_${todayStr}`, 'unanswered');
  const [hardOptB, setHardOptB] = usePersistentState<number|null>(`pokethology_hub_hard_optb_${todayStr}`, null);

  // Uncommitted selected choices before submission (matches Theory Exam structure)
  const [selectedChoices, setSelectedChoices] = useState<Record<string, number>>({});

  // Poll local storage for combat progress and listen to custom sync events
  const [combatProgress, setCombatProgress] = useState<Record<string, number>>({});
  
  useEffect(() => {
    const updateCombatProgress = () => {
      const newProgress: Record<string, number> = {};
      combatChallenges.forEach(c => {
        newProgress[c.id] = parseInt(localStorage.getItem(`pokethology_hub_combat_${todayStr}_${c.id}`) || '0', 10);
      });
      setCombatProgress(newProgress);
    };
    updateCombatProgress();
    
    window.addEventListener('pokethology_hub_update', updateCombatProgress);
    window.addEventListener('storage', updateCombatProgress);
    const interval = setInterval(updateCombatProgress, 1500);
    return () => {
      window.removeEventListener('pokethology_hub_update', updateCombatProgress);
      window.removeEventListener('storage', updateCombatProgress);
      clearInterval(interval);
    };
  }, [todayStr, combatChallenges]);

  const bronzeCombat1Done = (combatProgress['bronze_3'] || 0) >= (combatChallenges[0]?.required || 1);
  const bronzeCombat2Done = (combatProgress['bronze_4'] || 0) >= (combatChallenges[1]?.required || 1);
  const silverCombat1Done = (combatProgress['silver_3'] || 0) >= (combatChallenges[2]?.required || 2);
  const silverCombat2Done = (combatProgress['silver_4'] || 0) >= (combatChallenges[3]?.required || 2);
  const goldCombat1Done = (combatProgress['gold_3'] || 0) >= (combatChallenges[4]?.required || 3);
  const goldCombat2Done = (combatProgress['gold_4'] || 0) >= (combatChallenges[5]?.required || 1);

  const bronzeCompleted = easyStatusA === 'correct' && easyStatusB === 'correct' && bronzeCombat1Done && bronzeCombat2Done;
  const silverCompleted = medStatusA === 'correct' && medStatusB === 'correct' && silverCombat1Done && silverCombat2Done;
  const goldCompleted = hardStatusA === 'correct' && hardStatusB === 'correct' && goldCombat1Done && goldCombat2Done;

  const completedActivitiesList = [
    easyStatusA === 'correct',
    easyStatusB === 'correct',
    bronzeCombat1Done,
    bronzeCombat2Done,
    medStatusA === 'correct',
    medStatusB === 'correct',
    silverCombat1Done,
    silverCombat2Done,
    hardStatusA === 'correct',
    hardStatusB === 'correct',
    goldCombat1Done,
    goldCombat2Done
  ];

  const totalCompletedCount = completedActivitiesList.filter(Boolean).length;

  const RANK_TIERS = useMemo(() => [
    { title: 'Novice', level: 1, minCount: 0, color: 'text-slate-400 bg-slate-600/10 border-slate-600/40', badge: 'Novice Operator', desc: 'Standard field accreditation initialized.' },
    { title: 'Cadet', level: 2, minCount: 1, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]', badge: 'Active Cadet', desc: 'First daily activities logged. Diagnostic capabilities active.' },
    { title: 'Beginner', level: 3, minCount: 4, color: 'text-orange-400 bg-orange-500/10 border-orange-500/40 shadow-[0_0_15px_rgba(234,88,12,0.3)]', badge: 'Combat Specialist', desc: 'Bronze Tier completed. Advanced tactical awareness unlocked.' },
    { title: 'Intermediate', level: 4, minCount: 8, color: 'text-slate-200 bg-slate-300/10 border-slate-400/40 shadow-[0_0_15px_rgba(148,163,184,0.3)]', badge: 'Senior Strategist', desc: 'Silver Tier cleared. Expert-level battle execution certified.' },
    { title: 'Master', level: 5, minCount: 12, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.35)]', badge: 'Pokéthology Master', desc: 'Flawless execution of all 12 theory & combat objectives.' }
  ], []);

  const operatorRank = useMemo(() => {
    if (goldCompleted || totalCompletedCount === 12) {
      return RANK_TIERS[4];
    }
    if (silverCompleted || totalCompletedCount >= 8) {
      return RANK_TIERS[3];
    }
    if (bronzeCompleted || totalCompletedCount >= 4) {
      return RANK_TIERS[2];
    }
    if (totalCompletedCount >= 1) {
      return RANK_TIERS[1];
    }
    return RANK_TIERS[0];
  }, [goldCompleted, silverCompleted, bronzeCompleted, totalCompletedCount, RANK_TIERS]);

  // Rank-Up Celebration State
  const [celebratingRank, setCelebratingRank] = useState<{
    rank: typeof RANK_TIERS[0];
    prevRankTitle: string;
  } | null>(null);
  const prevRankLevelRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('pokethology_user_rank', operatorRank.title);
      localStorage.setItem(`pokethology_user_rank_${todayStr}`, operatorRank.title);
      
      const celebratedLevelKey = `pokethology_celebrated_rank_level_${todayStr}`;
      const highestCelebrated = parseInt(localStorage.getItem(celebratedLevelKey) || '1', 10);

      if (prevRankLevelRef.current === null) {
        prevRankLevelRef.current = operatorRank.level;
      } else if (operatorRank.level > prevRankLevelRef.current && operatorRank.level > highestCelebrated) {
        const prevTitle = RANK_TIERS.find(r => r.level === prevRankLevelRef.current)?.title || 'Novice';
        setCelebratingRank({
          rank: operatorRank,
          prevRankTitle: prevTitle
        });
        localStorage.setItem(celebratedLevelKey, String(operatorRank.level));
        try {
          sounds.victory?.();
          playHaptic?.();
        } catch (_) {}
        prevRankLevelRef.current = operatorRank.level;
      } else {
        prevRankLevelRef.current = operatorRank.level;
      }
    } catch (_) {}
  }, [operatorRank, todayStr, RANK_TIERS]);

  const handleSelectChoice = (tier: string, questionId: string, idx: number, isLocked: boolean) => {
    if (isLocked) return;
    const key = `${tier}_${questionId}`;
    setSelectedChoices(prev => ({ ...prev, [key]: idx }));
    try { sounds.typing?.(); } catch (_) {}
  };

  const handleLockInAnswer = (tier: string, questionId: string, q: any) => {
    const key = `${tier}_${questionId}`;
    const chosenIdx = selectedChoices[key];
    if (chosenIdx === undefined) return;

    const answerIdx = q.answerIndex ?? q.correctAnswer ?? 0;
    const isCorrect = chosenIdx === answerIdx;

    try { sounds.scan(); } catch (_) {}
    if (isCorrect) {
      try { sounds.success?.(); } catch (_) {}
    } else {
      try { sounds.error?.(); } catch (_) {}
    }
    
    if (tier === 'bronze' && questionId === 'A') {
      setEasyOptA(chosenIdx); setEasyStatusA(isCorrect ? 'correct' : 'incorrect');
    } else if (tier === 'bronze' && questionId === 'B') {
      setEasyOptB(chosenIdx); setEasyStatusB(isCorrect ? 'correct' : 'incorrect');
    } else if (tier === 'silver' && questionId === 'A') {
      setMedOptA(chosenIdx); setMedStatusA(isCorrect ? 'correct' : 'incorrect');
    } else if (tier === 'silver' && questionId === 'B') {
      setMedOptB(chosenIdx); setMedStatusB(isCorrect ? 'correct' : 'incorrect');
    } else if (tier === 'gold' && questionId === 'A') {
      setHardOptA(chosenIdx); setHardStatusA(isCorrect ? 'correct' : 'incorrect');
    } else if (tier === 'gold' && questionId === 'B') {
      setHardOptB(chosenIdx); setHardStatusB(isCorrect ? 'correct' : 'incorrect');
    }
  };

  const renderTrivia = (q: any, tier: string, qId: string, status: string, opt: number | null, num: number) => {
    let tierColor = "text-amber-400";
    if (tier === 'bronze') tierColor = "text-orange-400";
    if (tier === 'silver') tierColor = "text-slate-300";
    if (tier === 'gold') tierColor = "text-yellow-400";

    const key = `${tier}_${qId}`;
    const isLocked = status !== 'unanswered';
    const selectedOption = isLocked ? opt : selectedChoices[key];
    const correctIdx = q.answerIndex ?? q.correctAnswer ?? 0;
    const isCorrect = status === 'correct';

    return (
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden shadow-lg text-left">
        <HUDCorners />
        <div className="flex justify-between items-center gap-2">
          <h4 className={`text-xs sm:text-sm font-hud ${tierColor} uppercase font-bold tracking-wider flex items-center gap-2`}>
            <HelpCircle className={`w-4 h-4 ${tierColor} shrink-0`} />
            Activity {num} • Theory Question
          </h4>
          {isLocked && (
            <span
              className={cn(
                'px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase tracking-wider flex items-center gap-1 shrink-0',
                isCorrect
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
              )}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> CORRECT
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5 text-rose-400" /> INCORRECT
                </>
              )}
            </span>
          )}
        </div>
        
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-medium">{q.question}</p>
        
        <div className="grid grid-cols-1 gap-2 mt-1">
          {q.options.map((option: string, i: number) => {
            const isSelected = selectedOption === i;
            let optStyle = 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800';

            if (isLocked) {
              if (i === correctIdx) {
                optStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]';
              } else if (isSelected && !isCorrect) {
                optStyle = 'bg-rose-950/80 border-rose-500 text-rose-300 line-through opacity-80 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
              } else {
                optStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
              }
            } else if (isSelected) {
              optStyle = 'bg-cyan-950/90 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_15px_rgba(6,182,212,0.35)]';
            } else {
              optStyle = 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800 transition-colors';
            }
            
            return (
              <button
                key={i}
                disabled={isLocked}
                onClick={() => handleSelectChoice(tier, qId, i, isLocked)}
                className={cn(
                  'p-3 rounded-lg text-left text-xs sm:text-sm transition-all duration-200 flex items-center justify-between gap-2 border cursor-pointer',
                  optStyle
                )}
              >
                <div className="flex items-start gap-2">
                  <span className="font-mono font-bold opacity-80 mt-0.5">{String.fromCharCode(65 + i)}.</span>
                  <span className="font-medium break-words leading-tight">{option}</span>
                </div>
                {isLocked && i === correctIdx && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Action / Explanation Section */}
        {!isLocked ? (
          <div className="flex justify-end mt-2">
            <button
              disabled={selectedChoices[key] === undefined}
              onClick={() => handleLockInAnswer(tier, qId, q)}
              className={cn(
                hudButtonClass(false, 'cyan'),
                'px-4 py-2 !text-[10px] font-hud font-black tracking-wider uppercase flex items-center gap-1.5 transition-all',
                selectedChoices[key] === undefined ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-102 shadow-lg shadow-cyan-950/50'
              )}
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              SUBMIT ANSWER
            </button>
          </div>
        ) : (
          <div className="mt-2 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
            <div className="flex justify-between items-center mb-1.5 border-b border-slate-800 pb-1.5">
              <strong className={cn("font-hud uppercase tracking-wider text-[10px]", isCorrect ? "text-emerald-400" : "text-rose-400")}>
                {isCorrect ? "CORRECT" : "INCORRECT"}
              </strong>
              <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">
                Correct Answer: {String.fromCharCode(65 + correctIdx)}
              </span>
            </div>
            <strong className="text-cyan-400 font-hud block mb-1 uppercase tracking-wider text-[9px]">
              EXPLANATION
            </strong>
            {q.explanation}
          </div>
        )}
      </div>
    );
  };

  const renderCombatChallenge = (challenge: any, tier: string, num: number) => {
    const prog = combatProgress[challenge.id] || 0;
    const isDone = prog >= challenge.required;

    let tierColor = "text-red-400";
    if (tier === 'bronze') tierColor = "text-orange-400";
    if (tier === 'silver') tierColor = "text-slate-300";
    if (tier === 'gold') tierColor = "text-yellow-400";

    return (
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden shadow-lg text-left">
        <HUDCorners />
        <div className="flex justify-between items-center">
          <h4 className={`text-xs sm:text-sm font-hud ${tierColor} uppercase font-bold tracking-wider flex items-center gap-2`}>
            <Swords className={`w-4 h-4 ${tierColor}`} />
            Activity {num} • Arena Combat
          </h4>
          {isDone && <CheckCircle className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />}
        </div>
        
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">{challenge.title}</p>
        
        <div className="mt-2 p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-2">
          <div className="text-2xl font-hud font-black text-white">{prog} <span className="text-sm text-slate-400">/ {challenge.required}</span></div>
          {isDone ? (
            <span className="text-xs font-hud text-emerald-400 uppercase tracking-widest font-bold">Challenge Complete</span>
          ) : (
            <span className={`text-xs font-hud ${tierColor} uppercase tracking-widest font-bold animate-pulse`}>Awaiting Combat...</span>
          )}
        </div>
      </div>
    );
  };

  const renderCompletedBadge = (tierName: string) => {
    let colorClass = "text-emerald-400";
    let bgClass = "bg-emerald-500/10";
    let borderClass = "border-emerald-500/40";
    let wrapperBorder = "border-emerald-500/20";
    let shadowClass = "shadow-[0_0_40px_rgba(52,211,153,0.2)]";

    if (tierName === 'Bronze') {
      colorClass = "text-orange-400";
      bgClass = "bg-orange-500/10";
      borderClass = "border-orange-500/40";
      wrapperBorder = "border-orange-500/20";
      shadowClass = "shadow-[0_0_40px_rgba(234,88,12,0.2)]";
    } else if (tierName === 'Silver') {
      colorClass = "text-slate-300";
      bgClass = "bg-slate-500/10";
      borderClass = "border-slate-500/40";
      wrapperBorder = "border-slate-500/20";
      shadowClass = "shadow-[0_0_40px_rgba(148,163,184,0.2)]";
    } else if (tierName === 'Gold') {
      colorClass = "text-yellow-400";
      bgClass = "bg-yellow-500/10";
      borderClass = "border-yellow-500/40";
      wrapperBorder = "border-yellow-500/20";
      shadowClass = "shadow-[0_0_40px_rgba(234,179,8,0.2)]";
    }

    return (
      <div className={`col-span-1 md:col-span-2 py-16 flex flex-col items-center justify-center gap-4 bg-slate-950/60 rounded-2xl border ${wrapperBorder}`}>
        <div className={`w-24 h-24 rounded-full ${bgClass} border-2 ${borderClass} flex items-center justify-center ${shadowClass}`}>
          <Award className={`w-12 h-12 ${colorClass}`} />
        </div>
        <h3 className={`text-2xl font-hud font-black ${colorClass} tracking-widest uppercase`}>{tierName} Tier Cleared</h3>
        <p className="text-sm text-slate-400 font-mono text-center max-w-sm px-4">
          All activities in this tier have been successfully completed. Check back tomorrow for new challenges!
        </p>
      </div>
    );
  };

  return (
    <div id="combat-mission-dashboard" className="relative w-full flex flex-col gap-4 text-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/70 p-4.5 rounded-2xl border border-cyan-500/10 text-left shadow-lg">
        <div className="space-y-1.5 border-b sm:border-b-0 sm:border-r border-slate-900 pb-3 sm:pb-0 sm:pr-4 flex flex-col justify-center">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              <span className="text-[10px] sm:text-xs font-hud font-black text-cyan-400 uppercase tracking-widest">Rank</span>
            </div>
            {dailyStreak !== undefined && (
              <div className="px-2 py-0.5 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-400 text-[8.5px] sm:text-[9.5px] font-hud font-bold whitespace-nowrap shadow-[0_0_10px_rgba(249,115,22,0.3)] flex items-center gap-1">
                <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-orange-500 text-orange-400" />
                <span>{dailyStreak} DAY{dailyStreak !== 1 ? "S" : ""}</span>
              </div>
            )}
          </div>
          <div className="mt-1">
            <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md border text-xs sm:text-sm font-hud uppercase font-black tracking-widest drop-shadow-md", operatorRank.color)}>
              {operatorRank.title}
            </span>
          </div>
        </div>
        <div className="space-y-1 sm:pl-4 flex flex-col justify-center">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-hud font-extrabold text-slate-400 uppercase tracking-wider">Daily Progress</span>
            <span className="text-xs font-hud font-black text-white">{totalCompletedCount} / 12</span>
          </div>
          <div className="w-full bg-slate-900 h-2 sm:h-2.5 rounded-full overflow-hidden border border-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${(totalCompletedCount / 12) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 my-2">
        {[
          { id: 'bronze', label: 'Bronze', completed: bronzeCompleted, color: 'bronze' },
          { id: 'silver', label: 'Silver', completed: silverCompleted, color: 'silver' },
          { id: 'gold', label: 'Gold', completed: goldCompleted, color: 'gold' }
        ].map((tier) => (
          <button
            key={tier.id}
            onClick={() => setSelectedDifficulty(tier.id as any)}
            className={cn(
              hudButtonClass(selectedDifficulty === tier.id, tier.color as any),
              "px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-hud font-bold uppercase tracking-wider !rounded-xl transition-all relative overflow-hidden group flex items-center gap-2",
              tier.completed && selectedDifficulty !== tier.id && "opacity-80"
            )}
          >
            {tier.label} Tier
            {tier.completed && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.8)]" />}
          </button>
        ))}
      </div>

      <div className="w-full relative mt-2">
        <AnimatePresence mode="wait">
          {selectedDifficulty === 'bronze' && (
            <motion.div key="bronze" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bronzeCompleted ? renderCompletedBadge('Bronze') : (
                <>
                  {renderTrivia(easyTriviaQuestion, 'bronze', 'A', easyStatusA, easyOptA, 1)}
                  {renderTrivia(easyTriviaQuestionB, 'bronze', 'B', easyStatusB, easyOptB, 2)}
                  {renderCombatChallenge(combatChallenges[0], 'bronze', 3)}
                  {renderCombatChallenge(combatChallenges[1], 'bronze', 4)}
                </>
              )}
            </motion.div>
          )}

          {selectedDifficulty === 'silver' && (
            <motion.div key="silver" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {silverCompleted ? renderCompletedBadge('Silver') : (
                <>
                  {renderTrivia(medTriviaQuestion, 'silver', 'A', medStatusA, medOptA, 5)}
                  {renderTrivia(medTriviaQuestionB, 'silver', 'B', medStatusB, medOptB, 6)}
                  {renderCombatChallenge(combatChallenges[2], 'silver', 7)}
                  {renderCombatChallenge(combatChallenges[3], 'silver', 8)}
                </>
              )}
            </motion.div>
          )}

          {selectedDifficulty === 'gold' && (
            <motion.div key="gold" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goldCompleted ? renderCompletedBadge('Gold') : (
                <>
                  {renderTrivia(hardTriviaQuestion, 'gold', 'A', hardStatusA, hardOptA, 9)}
                  {renderTrivia(hardTriviaQuestionB, 'gold', 'B', hardStatusB, hardOptB, 10)}
                  {renderCombatChallenge(combatChallenges[4], 'gold', 11)}
                  {renderCombatChallenge(combatChallenges[5], 'gold', 12)}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Visual Rank-Up Celebration Modal */}
      <AnimatePresence>
        {celebratingRank && (
          <motion.div
            key="rank-up-celebration-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <ParticleExplosion active={true} />

            <motion.div
              initial={{ scale: 0.8, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative w-full max-w-md bg-slate-950/95 border-2 border-cyan-400/80 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-[0_0_60px_rgba(6,182,212,0.4)] overflow-hidden"
            >
              {/* Ambient Glowing Background Accents */}
              <div className="absolute -top-16 -left-16 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Rotating Holographic Aura */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 rounded-full border border-dashed border-cyan-400/40 absolute top-10 pointer-events-none"
              />

              {/* Rank Emblem with Animated Scaling and Glow */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
                className={cn(
                  "w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center border-2 mb-4 relative z-10 shadow-2xl",
                  celebratingRank.rank.title === 'Master' ? 'bg-yellow-500/20 border-yellow-400 shadow-[0_0_35px_rgba(234,179,8,0.5)]' :
                  celebratingRank.rank.title === 'Intermediate' ? 'bg-slate-300/20 border-slate-300 shadow-[0_0_35px_rgba(148,163,184,0.4)]' :
                  celebratingRank.rank.title === 'Beginner' ? 'bg-orange-500/20 border-orange-400 shadow-[0_0_35px_rgba(234,88,12,0.5)]' :
                  'bg-cyan-500/20 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.5)]'
                )}
              >
                {celebratingRank.rank.title === 'Master' ? (
                  <Crown className="w-14 h-14 text-yellow-400 animate-bounce" />
                ) : celebratingRank.rank.title === 'Intermediate' ? (
                  <Trophy className="w-14 h-14 text-slate-200 animate-pulse" />
                ) : celebratingRank.rank.title === 'Beginner' ? (
                  <Award className="w-14 h-14 text-orange-400 animate-pulse" />
                ) : (
                  <Trophy className="w-14 h-14 text-cyan-400 animate-pulse" />
                )}
              </motion.div>

              {/* Header Titles */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="space-y-1 z-10"
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-hud font-black text-cyan-400 uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>RANK MILESTONE ATTAINED</span>
                  <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-hud font-black text-white uppercase tracking-wider">
                  PROMOTED TO <span className={cn(
                    "drop-shadow-[0_0_12px_currentColor]",
                    celebratingRank.rank.title === 'Master' ? 'text-yellow-400' :
                    celebratingRank.rank.title === 'Intermediate' ? 'text-slate-200' :
                    celebratingRank.rank.title === 'Beginner' ? 'text-orange-400' :
                    'text-cyan-300'
                  )}>{celebratingRank.rank.title}</span>
                </h3>

                <p className="text-xs sm:text-sm font-sans text-slate-300 max-w-xs mx-auto leading-relaxed pt-1">
                  {celebratingRank.rank.desc}
                </p>
              </motion.div>

              {/* Progress Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 my-4 flex items-center justify-around z-10"
              >
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-hud font-bold text-slate-400 uppercase">Previous</span>
                  <span className="text-xs sm:text-sm font-hud font-black text-slate-300 uppercase">{celebratingRank.prevRankTitle}</span>
                </div>
                <div className="text-cyan-400 font-hud text-lg">➜</div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-hud font-bold text-cyan-400 uppercase">Current Rank</span>
                  <span className={cn("text-xs sm:text-sm font-hud font-black uppercase", celebratingRank.rank.color.split(' ')[0])}>
                    {celebratingRank.rank.title} (Level {celebratingRank.rank.level})
                  </span>
                </div>
              </motion.div>

              {/* Confirm / Continue Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 }}
                onClick={() => {
                  setCelebratingRank(null);
                  try { sounds.scan(); } catch (_) {}
                }}
                className={cn(
                  hudButtonClass(true, 'cyan'),
                  "w-full py-3 text-xs sm:text-sm font-hud font-black uppercase tracking-widest !rounded-2xl cursor-pointer shadow-lg shadow-cyan-950/60 z-10 flex items-center justify-center gap-2 hover:scale-102 transition-transform"
                )}
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                CLAIM RANK & CONTINUE
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
PokethologyCombatMissionWidget.displayName = 'PokethologyCombatMissionWidget';
