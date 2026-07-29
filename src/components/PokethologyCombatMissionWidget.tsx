import React, { useState, useEffect, memo, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, hudButtonClass, playHaptic } from '../lib/utils';
import { sounds } from '../lib/sounds';
import { HUDCorners } from './HUDCorners';
import { ParticleExplosion } from './ParticleExplosion';
import { MissionCategory } from '../types';
import { 
  Swords, 
  Trophy, 
  CheckCircle, 
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
  Sparkle
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
  }
];

interface PokethologyCombatMissionWidgetProps {
  todayStr: string;
  isCompleted: boolean;
  missionProgressCount?: number;
  missionRequiredCount?: number;
}

export const PokethologyCombatMissionWidget: React.FC<PokethologyCombatMissionWidgetProps> = memo(({ todayStr, isCompleted, missionProgressCount, missionRequiredCount }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'bronze' | 'silver' | 'gold'>('bronze');
  
  // Session level overrides for API fetched questions
  const [sessionEasyTriviaQuestion, setSessionEasyTriviaQuestion] = useState<TriviaQuestion | null>(null);
  const [sessionEasyTriviaQuestionB, setSessionEasyTriviaQuestionB] = useState<TriviaQuestion | null>(null);
  const [sessionMedTriviaQuestion, setSessionMedTriviaQuestion] = useState<TriviaQuestion | null>(null);
  const [sessionMedTriviaQuestionB, setSessionMedTriviaQuestionB] = useState<TriviaQuestion | null>(null);
  const [sessionHardTriviaQuestion, setSessionHardTriviaQuestion] = useState<TriviaQuestion | null>(null);
  const [sessionHardTriviaQuestionB, setSessionHardTriviaQuestionB] = useState<TriviaQuestion | null>(null);
  
  const [meditationFlash, setMeditationFlash] = useState<boolean>(false);
  const [chronoFlash, setChronoFlash] = useState<boolean>(false);
  const [legendaryFlash, setLegendaryFlash] = useState<boolean>(false);
  const [chaosFlash, setChaosFlash] = useState<boolean>(false);
  const [easyStrikeFlash, setEasyStrikeFlash] = useState<boolean>(false);
  
  const isHardModeActive = useMemo(() => {
    return (localStorage.getItem(`pokethology_mission_hard_${todayStr}`) || localStorage.getItem(`poketheology_mission_hard_${todayStr}`)) === 'true';
  }, [todayStr]);

  const activeMission = useMemo(() => {
    return getDailyCombatMission(todayStr, isHardModeActive);
  }, [todayStr, isHardModeActive]);

  const requiredCount = useMemo(() => {
    return missionRequiredCount !== undefined ? missionRequiredCount : getRequiredCount(activeMission, isHardModeActive);
  }, [activeMission, isHardModeActive, missionRequiredCount]);

  const progressCount = useMemo(() => {
    if (missionProgressCount !== undefined) return missionProgressCount;
    const saved = localStorage.getItem(`pokethology_mission_progress_count_${todayStr}`);
    if (saved) return parseInt(saved, 10);
    return isCompleted ? requiredCount : 0;
  }, [todayStr, isCompleted, requiredCount, missionProgressCount]);
  
  // Dynamic stats
  const [combatPoints, setCombatPoints] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [celebrationPoints, setCelebrationPoints] = useState<number>(0);
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    title: string;
    points: number;
    categoryName?: string;
    description: string;
    itemUnlocked?: string;
  } | null>(null);

  // Loading and Particle Explosion States
  const [isWidgetLoading, setIsWidgetLoading] = useState<boolean>(true);
  const [showMissionExplosion, setShowMissionExplosion] = useState<boolean>(false);
  const prevProgress = useRef<number>(-1);

  // Simulate populating local storage and daily mission data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWidgetLoading(false);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  // Monitor progress for real-time mission completion explosion
  useEffect(() => {
    if (!isWidgetLoading) {
      if (progressCount >= requiredCount && prevProgress.current !== -1 && prevProgress.current < requiredCount) {
        setShowMissionExplosion(true);
        try { sounds.success?.(); } catch (_) {}
        setSuccessModal({
          isOpen: true,
          title: "TOTAL MISSION PARAMETERS EXCEEDED",
          points: 500,
          categoryName: "DAILY HUB SUPREMACY",
          description: "INCREDIBLE PERFORMANCE: All daily combat objectives have been neutralized with extreme tactical efficiency. Your dedication to the Pokétheology grid is truly unparalleled!",
          itemUnlocked: "Master-Tier Operational Credential"
        });
      }
      prevProgress.current = progressCount;
    }
  }, [progressCount, requiredCount, isWidgetLoading]);

  // Spark explosion if already completed on mount
  useEffect(() => {
    if (!isWidgetLoading && (isCompleted || progressCount >= requiredCount)) {
      const delayTimer = setTimeout(() => {
        setShowMissionExplosion(true);
      }, 350);
      return () => clearTimeout(delayTimer);
    }
  }, [isWidgetLoading, isCompleted, progressCount, requiredCount]);

  // Loading states
  useEffect(() => {
    const savedPoints = localStorage.getItem(`pokethology_combat_points_${todayStr}`);
    if (savedPoints) {
      setCombatPoints(parseInt(savedPoints, 10));
    } else {
      setCombatPoints(0);
    }
  }, [todayStr]);

  // Sync stage points
  const addBonusPoints = (pts: number, details?: { title: string; category?: string; description?: string; itemUnlocked?: string }) => {
    const savedPoints = localStorage.getItem(`pokethology_combat_points_${todayStr}`);
    const currentTotal = savedPoints ? parseInt(savedPoints, 10) : 0;
    const newTotal = currentTotal + pts;
    localStorage.setItem(`pokethology_combat_points_${todayStr}`, newTotal.toString());
    setCombatPoints(newTotal);
    setCelebrationPoints(pts);
    setShowCelebration(true);

    // Trigger AnimatePresence success modal!
    setSuccessModal({
      isOpen: true,
      title: details?.title || "Operational Bounty Secured",
      points: pts,
      categoryName: details?.category || "Sinnoh Core Mission Command",
      description: details?.description || "You have successfully synchronized with the divine Pokétheology grid and unlocked operational resources.",
      itemUnlocked: details?.itemUnlocked || (pts >= 300 ? "Arceus Origin Cosmic Shard" : pts >= 180 ? "Sinnoh Core-Link Vector" : "Zen Meditation Candle Chip")
    });

    try {
      sounds.success?.();
    } catch (_) {}
  };

  // --- EASY ACTIVITIES STATES ---
  
  // 1. Daily Synapse Med Check-in
  const [medCheckinStatus, setMedCheckinStatus] = useState<'idle' | 'breathing' | 'claimable' | 'completed'>(() => {
    return (localStorage.getItem(`pokethology_act_med_${todayStr}`) === 'completed') ? 'completed' : 'idle';
  });
  const [medSeconds, setMedSeconds] = useState<number>(10);
  
  // 2. Easy Trivia Question A
  const [easyTriviaStatus, setEasyTriviaStatus] = useState<'unanswered' | 'correct' | 'incorrect'>(() => {
    return (localStorage.getItem(`pokethology_act_etriv_${todayStr}`) as any) || 'unanswered';
  });
  const [easyChosenOption, setEasyChosenOption] = useState<number | null>(() => {
    const saved = localStorage.getItem(`pokethology_act_etriv_opt_${todayStr}`);
    return saved !== null ? parseInt(saved, 10) : null;
  });
  const easyTriviaIndex = useMemo(() => {
    const hash = todayStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % EASY_TRIVIA_QUESTIONS.length;
  }, [todayStr]);
  const easyTriviaQuestion = sessionEasyTriviaQuestion || EASY_TRIVIA_QUESTIONS[easyTriviaIndex];

  // 3. Easy Trivia Question B (REPLACES COMBAT ARENA STRIKE)
  const [easyTriviaStatusB, setEasyTriviaStatusB] = useState<'unanswered' | 'correct' | 'incorrect'>(() => {
    return (localStorage.getItem(`pokethology_act_etriv_b_${todayStr}`) as any) || 'unanswered';
  });
  const [easyChosenOptionB, setEasyChosenOptionB] = useState<number | null>(() => {
    const saved = localStorage.getItem(`pokethology_act_etriv_opt_b_${todayStr}`);
    return saved !== null ? parseInt(saved, 10) : null;
  });
  const easyTriviaIndexB = useMemo(() => {
    const hash = todayStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash + 1) % EASY_TRIVIA_QUESTIONS.length;
  }, [todayStr]);
  const easyTriviaQuestionB = sessionEasyTriviaQuestionB || EASY_TRIVIA_QUESTIONS[easyTriviaIndexB];

  // Legacy holder so it does not break types or initial state lookups
  const [easyStrikeClaimed, setEasyStrikeClaimed] = useState<boolean>(() => {
    return localStorage.getItem(`pokethology_act_estrike_${todayStr}`) === 'claimed';
  });

  // 4. Cosmic Grid Scan
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'completed'>(() => {
    return (localStorage.getItem(`pokethology_act_escan_${todayStr}`) === 'completed') ? 'completed' : 'idle';
  });

  // 5. Dimensional Time Sync (NEW EASY)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'completed'>(() => {
    return (localStorage.getItem(`pokethology_act_esync_${todayStr}`) === 'completed') ? 'completed' : 'idle';
  });

  // --- MEDIUM ACTIVITIES STATES ---

  // 1. Advanced Lore Exam A
  const [medTriviaStatus, setMedTriviaStatus] = useState<'unanswered' | 'correct' | 'incorrect'>(() => {
    return (localStorage.getItem(`pokethology_act_mtriv_${todayStr}`) as any) || 'unanswered';
  });
  const [medChosenOption, setMedChosenOption] = useState<number | null>(() => {
    const saved = localStorage.getItem(`pokethology_act_mtriv_opt_${todayStr}`);
    return saved !== null ? parseInt(saved, 10) : null;
  });
  const medTriviaIndex = useMemo(() => {
    const hash = todayStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash + 3) % MEDIUM_TRIVIA_QUESTIONS.length;
  }, [todayStr]);
  const medTriviaQuestion = sessionMedTriviaQuestion || MEDIUM_TRIVIA_QUESTIONS[medTriviaIndex];

  // 2. Medium Trivia Question B (REPLACES COMBAT ARENA CHAOS)
  const [medTriviaStatusB, setMedTriviaStatusB] = useState<'unanswered' | 'correct' | 'incorrect'>(() => {
    return (localStorage.getItem(`pokethology_act_mtriv_b_${todayStr}`) as any) || 'unanswered';
  });
  const [medChosenOptionB, setMedChosenOptionB] = useState<number | null>(() => {
    const saved = localStorage.getItem(`pokethology_act_mtriv_opt_b_${todayStr}`);
    return saved !== null ? parseInt(saved, 10) : null;
  });
  const medTriviaIndexB = useMemo(() => {
    const hash = todayStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash + 5) % MEDIUM_TRIVIA_QUESTIONS.length;
  }, [todayStr]);
  const medTriviaQuestionB = sessionMedTriviaQuestionB || MEDIUM_TRIVIA_QUESTIONS[medTriviaIndexB];

  // Legacy holder
  const [chaosClaimed, setChaosClaimed] = useState<boolean>(() => {
    return localStorage.getItem(`pokethology_act_mchaos_${todayStr}`) === 'claimed';
  });

  // 3. Chrono-Anomaly Strike
  const [chronoClaimed, setChronoClaimed] = useState<boolean>(() => {
    return localStorage.getItem(`pokethology_act_mchrono_${todayStr}`) === 'claimed';
  });

  // 4. Temporal Core Recharge Game
  const [coreRechargeStatus, setCoreRechargeStatus] = useState<'idle' | 'playing' | 'completed'>(() => {
    return (localStorage.getItem(`pokethology_act_mcore_${todayStr}`) === 'completed') ? 'completed' : 'idle';
  });
  const [sliderPosition, setSliderPosition] = useState<number>(0);
  const sliderDirectionRef = useRef<number>(1);
  const [gameResult, setGameResult] = useState<string | null>(null);

  // --- HARD ACTIVITIES STATES ---
  
  // 1. Hard Trivia Question B (REPLACES COMBAT ARENA RAID)
  const [masterExamStatusB, setMasterExamStatusB] = useState<'unanswered' | 'correct' | 'incorrect'>(() => {
    return (localStorage.getItem(`pokethology_act_hexam_b_${todayStr}`) as any) || 'unanswered';
  });
  const [masterChosenOptionB, setMasterChosenOptionB] = useState<number | null>(() => {
    const saved = localStorage.getItem(`pokethology_act_hexam_opt_b_${todayStr}`);
    return saved !== null ? parseInt(saved, 10) : null;
  });
  const masterTriviaIndexB = useMemo(() => {
    const hash = todayStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash + 1) % HARD_TRIVIA_QUESTIONS.length;
  }, [todayStr]);
  const hardTriviaQuestionB = sessionHardTriviaQuestionB || HARD_TRIVIA_QUESTIONS[masterTriviaIndexB];

  // Legacy holder
  const [legendaryClaimed, setLegendaryClaimed] = useState<boolean>(() => {
      return localStorage.getItem(`pokethology_act_hlegend_${todayStr}`) === 'claimed';
  });
  
  // 2. Elite Speed Trial
  const [speedTrialStatus, setSpeedTrialStatus] = useState<'idle' | 'running' | 'completed'>(() => {
      return (localStorage.getItem(`pokethology_act_hspeed_${todayStr}`) === 'completed') ? 'completed' : 'idle';
  });
  
  // 3. Master Strategist Exam A
  const [masterExamStatus, setMasterExamStatus] = useState<'unanswered' | 'correct' | 'incorrect'>(() => {
    return (localStorage.getItem(`pokethology_act_hexam_${todayStr}`) as any) || 'unanswered';
  });
  const [masterChosenOption, setMasterChosenOption] = useState<number | null>(() => {
    const saved = localStorage.getItem(`pokethology_act_hexam_opt_${todayStr}`);
    return saved !== null ? parseInt(saved, 10) : null;
  });
  const masterTriviaIndex = useMemo(() => {
    const hash = todayStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.abs(hash) % HARD_TRIVIA_QUESTIONS.length;
  }, [todayStr]);
  const hardTriviaQuestion = sessionHardTriviaQuestion || HARD_TRIVIA_QUESTIONS[masterTriviaIndex];
  
  // 4. Ultimate Matrix Lockdown
  const [matrixLockdownStatus, setMatrixLockdownStatus] = useState<'idle' | 'active' | 'completed'>(() => {
      return (localStorage.getItem(`pokethology_act_hmatrix_${todayStr}`) === 'completed') ? 'completed' : 'idle';
  });

  // --- HARD ACTIVITIES INTERACTIVE STATES & LOGIC ---
  // A. Raid Battle States for Legendary Defeat
  const [raidActive, setRaidActive] = useState<boolean>(false);
  const [raidBossHP, setRaidBossHP] = useState<number>(100);
  const [raidTimeLeft, setRaidTimeLeft] = useState<number>(12);
  const [raidMessage, setRaidMessage] = useState<string>('');
  
  // B. Speed Trial States
  const [speedTrialCurrent, setSpeedTrialCurrent] = useState<number>(100);

  // C. Matrix Game Grid
  const [matrixGrid, setMatrixGrid] = useState<boolean[]>([
    true, false, true, 
    false, true, false, 
    true, false, true
  ]);

  // Handlers
  const startRaidChallenge = () => {
    try { sounds.scan(); } catch (_) {}
    setRaidActive(true);
    setRaidBossHP(100);
    setRaidTimeLeft(12);
    setRaidMessage('CHALLENGE ACTIVE! STRIKE RAPIDLY!');
  };

  useEffect(() => {
    if (!raidActive) return;
    if (raidTimeLeft <= 0) {
      setRaidActive(false);
      setRaidMessage(raidBossHP <= 0 ? 'VICTORY!' : 'TIMEOUT! STRIKE RUN FAILED');
      return;
    }
    const timer = setTimeout(() => {
      setRaidTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [raidActive, raidTimeLeft]);

  const handleRaidStrike = () => {
    if (!raidActive || raidBossHP <= 0) return;
    try { sounds.hover(); } catch (_) {}
    setRaidBossHP(prev => {
      const next = Math.max(0, prev - 12 - Math.floor(Math.random() * 8));
      if (next <= 0) {
        setRaidActive(false);
        setLegendaryClaimed(true);
        localStorage.setItem(`pokethology_act_hlegend_${todayStr}`, 'claimed');
        localStorage.setItem(`pokethology_legendary_defeated_${todayStr}`, 'true');
        addBonusPoints(300, {
          title: "Legendary Boss Overthrown",
          category: "HARD MYTHOLOGY COGNITION",
          description: "Neutralized the spatial anomaly bosses and repaired the rift in the theological matrix.",
          itemUnlocked: "Arceus Origin Cosmic Crest"
        });
        setRaidMessage('VICTORY! COGNITIVE BARRIER SECURED!');
      }
      return next;
    });
  };

  const handleLegendaryClaim = () => {
    try { sounds.scan(); } catch (_) {}
    playHaptic(30);
    setLegendaryFlash(true);
    setTimeout(() => {
      setLegendaryFlash(false);
    }, 1500);
    setLegendaryClaimed(true);
    localStorage.setItem(`pokethology_act_hlegend_${todayStr}`, 'claimed');
    addBonusPoints(300, {
      title: "Mythology Sovereign Neutralized",
      category: "HARD MYTHOLOGY COGNITION",
      description: "Successfully quarantined the Boss and secured the Outer Space boundaries.",
      itemUnlocked: "Griseous Singularity Beacon"
    });
  };

  const startSpeedTrial = () => {
    try { sounds.scan(); } catch (_) {}
    setSpeedTrialStatus('running');
    setSpeedTrialCurrent(120);
  };

  useEffect(() => {
    if (speedTrialStatus !== 'running') return;
    let dir = 1;
    const interval = setInterval(() => {
      setSpeedTrialCurrent(prev => {
        let amt = Math.floor(Math.random() * 50) + 18;
        let next = prev + dir * amt;
        if (next >= 430) {
          next = 430;
          dir = -1;
        } else if (next <= 70) {
          next = 70;
          dir = 1;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [speedTrialStatus]);

  const handleSpeedStrike = () => {
    if (speedTrialStatus !== 'running') return;
    try { sounds.scan(); } catch (_) {}
    if (speedTrialCurrent >= 365) {
      setSpeedTrialStatus('completed');
      localStorage.setItem(`pokethology_act_hspeed_${todayStr}`, 'completed');
      addBonusPoints(250, {
        title: "Velocity Threshold Surpassed",
        category: "HARD EXPERTISE",
        description: "Successfully struck the sweet-spot threshold during extreme speed surges (>365 MPH).",
        itemUnlocked: "Speed-Force Micro-Chip"
      });
    } else {
      setSpeedTrialCurrent(60);
    }
  };

  const handleMatrixCellToggle = (index: number) => {
    if (matrixLockdownStatus === 'completed') return;
    try { sounds.hover(); } catch (_) {}
    if (matrixLockdownStatus !== 'active') {
      setMatrixLockdownStatus('active');
    }
    
    setMatrixGrid(prev => {
      const next = [...prev];
      next[index] = !next[index];
      
      const row = Math.floor(index / 3);
      const col = index % 3;
      
      if (row > 0) next[index - 3] = !next[index - 3];
      if (row < 2) next[index + 3] = !next[index + 3];
      if (col > 0) next[index - 1] = !next[index - 1];
      if (col < 2) next[index + 1] = !next[index + 1];
      
      const allEnabled = next.every(val => val === true);
      if (allEnabled) {
        setTimeout(() => {
          setMatrixLockdownStatus('completed');
          localStorage.setItem(`pokethology_act_hmatrix_${todayStr}`, 'completed');
          addBonusPoints(350, {
            title: "Matrix Grid Alignment",
            category: "HARD CORE OPERATIONS",
            description: "Synchronized all structural micro-network nodes to unlock default matrix throughput.",
            itemUnlocked: "Arceus Cosmos Kernel Key"
          });
        }, 80);
      }
      
      return next;
    });
  };

  const handleResetMatrix = () => {
    try { sounds.scan(); } catch (_) {}
    setMatrixGrid([true, false, true, false, true, false, true, false, true]);
    setMatrixLockdownStatus('active');
  };

  // Meditation timer effect
  useEffect(() => {
    if (medCheckinStatus !== 'breathing') return;
    if (medSeconds <= 0) {
      setMedCheckinStatus('claimable');
      return;
    }
    const timer = setTimeout(() => {
      setMedSeconds(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [medCheckinStatus, medSeconds]);

  // Sweet spot game loop
  useEffect(() => {
    if (coreRechargeStatus !== 'playing') return;
    
    const interval = setInterval(() => {
      setSliderPosition(prev => {
        let next = prev + sliderDirectionRef.current * 4.5;
        if (next >= 100) {
          next = 100;
          sliderDirectionRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          sliderDirectionRef.current = 1;
        }
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [coreRechargeStatus]);

  // --- EASY HANDLERS ---
  const handleMeditationStart = () => {
    try { sounds.scan(); } catch (_) {}
    setMedCheckinStatus('breathing');
    setMedSeconds(6);
  };

  const handleMeditationClaim = () => {
    playHaptic(30);
    setMeditationFlash(true);
    setTimeout(() => {
      setMeditationFlash(false);
    }, 1500);
    setMedCheckinStatus('completed');
    localStorage.setItem(`pokethology_act_med_${todayStr}`, 'completed');
    addBonusPoints(50, {
      title: "Silent Recalibration Complete",
      category: "EASY OPERATIONS",
      description: "Successfully calibrated neural frequencies via targeted breathing patterns and synchronized biological rhythms.",
      itemUnlocked: "Zen Meditation Candle"
    });
  };

  const handleEasyTriviaAnswer = (optIdx: number) => {
    if (easyTriviaStatus !== 'unanswered') return;
    setEasyChosenOption(optIdx);
    const correct = optIdx === easyTriviaQuestion.answerIndex;
    
    if (correct) {
      setEasyTriviaStatus('correct');
      localStorage.setItem(`pokethology_act_etriv_${todayStr}`, 'correct');
      localStorage.setItem(`pokethology_act_etriv_opt_${todayStr}`, optIdx.toString());
      addBonusPoints(100, {
        title: "Trivia Intel Verified",
        category: "EASY THEORY",
        description: "Verified fundamental status mechanics and item dynamics under clinical simulation parameters.",
        itemUnlocked: "Kanto Bio-Scanner Mini-Core"
      });
    } else {
      setEasyTriviaStatus('incorrect');
      localStorage.setItem(`pokethology_act_etriv_${todayStr}`, 'incorrect');
      localStorage.setItem(`pokethology_act_etriv_opt_${todayStr}`, optIdx.toString());
      try { sounds.error(); } catch (_) {}
    }
  };

  const handleEasyTriviaAnswerB = (optIdx: number) => {
    if (easyTriviaStatusB !== 'unanswered') return;
    setEasyChosenOptionB(optIdx);
    const correct = optIdx === easyTriviaQuestionB.answerIndex;
    
    if (correct) {
      setEasyTriviaStatusB('correct');
      localStorage.setItem(`pokethology_act_etriv_b_${todayStr}`, 'correct');
      localStorage.setItem(`pokethology_act_etriv_opt_b_${todayStr}`, optIdx.toString());
      addBonusPoints(120, {
        title: "Sinnoh Myth Entry Verification",
        category: "EASY THEORY",
        description: "Successfully validated foundational cosmological folklore indexes for Sinnoh regional records.",
        itemUnlocked: "Lake Verity Local Map"
      });
    } else {
      setEasyTriviaStatusB('incorrect');
      localStorage.setItem(`pokethology_act_etriv_b_${todayStr}`, 'incorrect');
      localStorage.setItem(`pokethology_act_etriv_opt_b_${todayStr}`, optIdx.toString());
      try { sounds.error(); } catch (_) {}
    }
  };

  const handleMasterExamAnswer = (optIdx: number) => {
    if (masterExamStatus !== 'unanswered') return;
    setMasterChosenOption(optIdx);
    const correct = optIdx === hardTriviaQuestion.answerIndex;
    
    if (correct) {
      setMasterExamStatus('correct');
      localStorage.setItem(`pokethology_act_hexam_${todayStr}`, 'correct');
      localStorage.setItem(`pokethology_act_hexam_opt_${todayStr}`, optIdx.toString());
      addBonusPoints(300, {
        title: "Grandmaster Cosmology Verified",
        category: "HARD THEORY EXAMS",
        description: "Solved high-density legendary questions concerning Space-Time creation and divinity origins.",
        itemUnlocked: "Griseous Orb Vector Key"
      });
    } else {
      setMasterExamStatus('incorrect');
      localStorage.setItem(`pokethology_act_hexam_${todayStr}`, 'incorrect');
      localStorage.setItem(`pokethology_act_hexam_opt_${todayStr}`, optIdx.toString());
      try { sounds.error(); } catch (_) {}
    }
  };

  const handleMasterExamAnswerB = (optIdx: number) => {
    if (masterExamStatusB !== 'unanswered') return;
    setMasterChosenOptionB(optIdx);
    const correct = optIdx === hardTriviaQuestionB.answerIndex;
    
    if (correct) {
      setMasterExamStatusB('correct');
      localStorage.setItem(`pokethology_act_hexam_b_${todayStr}`, 'correct');
      localStorage.setItem(`pokethology_act_hexam_opt_b_${todayStr}`, optIdx.toString());
      addBonusPoints(350, {
        title: "Arceus Origin Theorist Clearance",
        category: "HARD THEORY EXAMS",
        description: "Resolved critical structural space-time creation and legendary origin myths successfully.",
        itemUnlocked: "Arceus Core Matrix Seal"
      });
    } else {
      setMasterExamStatusB('incorrect');
      localStorage.setItem(`pokethology_act_hexam_b_${todayStr}`, 'incorrect');
      localStorage.setItem(`pokethology_act_hexam_opt_b_${todayStr}`, optIdx.toString());
      try { sounds.error(); } catch (_) {}
    }
  };

  const handleEasyStrikeClaim = () => {
    if (isCompleted && !easyStrikeClaimed) {
      playHaptic(30);
      setEasyStrikeFlash(true);
      setTimeout(() => {
        setEasyStrikeFlash(false);
      }, 1500);
      setEasyStrikeClaimed(true);
      localStorage.setItem(`pokethology_act_estrike_${todayStr}`, 'claimed');
      addBonusPoints(150, {
        title: "Tactical Strike Bounty Unlocked",
        category: "EASY OPERATIONS",
        description: "Successfully tracked and defeated designated combat targets during dynamic biospheric simulations.",
        itemUnlocked: "Battle Frontier Honour Badge"
      });
    }
  };

  const handleCosmicScan = () => {
    try { sounds.scan(); } catch (_) {}
    setScanStatus('scanning');
    setTimeout(() => {
      setScanStatus('completed');
      localStorage.setItem(`pokethology_act_escan_${todayStr}`, 'completed');
      addBonusPoints(80, {
        title: "Deep Spatial Sweep Complete",
        category: "EASY OPERATIONS",
        description: "Successfully mapped active background cosmic structures and recorded dimensional anomalies.",
        itemUnlocked: "Cosmic Coordinate Signal #88"
      });
    }, 2800);
  };

  // --- MEDIUM HANDLERS ---
  const handleMedTriviaAnswer = (optIdx: number) => {
    if (medTriviaStatus !== 'unanswered') return;
    setMedChosenOption(optIdx);
    const correct = optIdx === medTriviaQuestion.answerIndex;
    
    if (correct) {
      setMedTriviaStatus('correct');
      localStorage.setItem(`pokethology_act_mtriv_${todayStr}`, 'correct');
      localStorage.setItem(`pokethology_act_mtriv_opt_${todayStr}`, optIdx.toString());
      addBonusPoints(150, {
        title: "Combat Analysis Cleared",
        category: "MEDIUM THEORY",
        description: "Calculated climate modifiers and turn-order speed thresholds with absolute clinical accuracy.",
        itemUnlocked: "Eviolite Matrix Shard"
      });
    } else {
      setMedTriviaStatus('incorrect');
      localStorage.setItem(`pokethology_act_mtriv_${todayStr}`, 'incorrect');
      localStorage.setItem(`pokethology_act_mtriv_opt_${todayStr}`, optIdx.toString());
      try { sounds.error(); } catch (_) {}
    }
  };

  const handleMedTriviaAnswerB = (optIdx: number) => {
    if (medTriviaStatusB !== 'unanswered') return;
    setMedChosenOptionB(optIdx);
    const correct = optIdx === medTriviaQuestionB.answerIndex;
    
    if (correct) {
      setMedTriviaStatusB('correct');
      localStorage.setItem(`pokethology_act_mtriv_b_${todayStr}`, 'correct');
      localStorage.setItem(`pokethology_act_mtriv_opt_b_${todayStr}`, optIdx.toString());
      addBonusPoints(200, {
        title: "Synergy Theory Verified",
        category: "MEDIUM THEORY",
        description: "Resolved ability interaction multipliers on active environmental battle fields.",
        itemUnlocked: "Terrain Seed Link"
      });
    } else {
      setMedTriviaStatusB('incorrect');
      localStorage.setItem(`pokethology_act_mtriv_b_${todayStr}`, 'incorrect');
      localStorage.setItem(`pokethology_act_mtriv_opt_b_${todayStr}`, optIdx.toString());
      try { sounds.error(); } catch (_) {}
    }
  };

  const handleChaosClaim = () => {
    const isChaosWon = localStorage.getItem(`pokethology_sandbox_${todayStr}`) === 'true';
    if (isChaosWon && !chaosClaimed) {
      playHaptic(30);
      setChaosFlash(true);
      setTimeout(() => {
        setChaosFlash(false);
      }, 1500);
      setChaosClaimed(true);
      localStorage.setItem(`pokethology_act_mchaos_${todayStr}`, 'claimed');
      addBonusPoints(180, {
        title: "Chaos draft victory",
        category: "MEDIUM OPERATIONS",
        description: "Synchronized dynamic sandbox battle teams and mastered competitive party synergy.",
        itemUnlocked: "Simulation Gilded Token"
      });
    }
  };

  const handleChronoClaim = () => {
    if (isCompleted && !chronoClaimed) {
      playHaptic(30);
      setChronoFlash(true);
      setTimeout(() => {
        setChronoFlash(false);
      }, 1500);
      setChronoClaimed(true);
      localStorage.setItem(`pokethology_act_mchrono_${todayStr}`, 'claimed');
      addBonusPoints(200, {
        title: "Time Matrix Aligned",
        category: "MEDIUM OPERATIONS",
        description: "Calibrated systemic chronometers and successfully established synchronization with central Sinnoh servers.",
        itemUnlocked: "Metronome Rhythm Sensor"
      });
    }
  };

  const handleRetryEasyTrivia = () => {
    setEasyTriviaStatus('unanswered');
    setEasyChosenOption(null);
    localStorage.removeItem(`pokethology_act_etriv_${todayStr}`);
    localStorage.removeItem(`pokethology_act_etriv_opt_${todayStr}`);
    try { sounds.scan(); } catch (_) {}
  };

  const handleRetryEasyTriviaB = () => {
    setEasyTriviaStatusB('unanswered');
    setEasyChosenOptionB(null);
    localStorage.removeItem(`pokethology_act_etriv_b_${todayStr}`);
    localStorage.removeItem(`pokethology_act_etriv_opt_b_${todayStr}`);
    try { sounds.scan(); } catch (_) {}
  };

  const handleRetryMedTrivia = () => {
    setMedTriviaStatus('unanswered');
    setMedChosenOption(null);
    localStorage.removeItem(`pokethology_act_mtriv_${todayStr}`);
    localStorage.removeItem(`pokethology_act_mtriv_opt_${todayStr}`);
    try { sounds.scan(); } catch (_) {}
  };

  const handleRetryMedTriviaB = () => {
    setMedTriviaStatusB('unanswered');
    setMedChosenOptionB(null);
    localStorage.removeItem(`pokethology_act_mtriv_b_${todayStr}`);
    localStorage.removeItem(`pokethology_act_mtriv_opt_b_${todayStr}`);
    try { sounds.scan(); } catch (_) {}
  };

  const handleRetryMasterExam = () => {
    setMasterExamStatus('unanswered');
    setMasterChosenOption(null);
    localStorage.removeItem(`pokethology_act_hexam_${todayStr}`);
    localStorage.removeItem(`pokethology_act_hexam_opt_${todayStr}`);
    try { sounds.scan(); } catch (_) {}
  };

  const handleRetryMasterExamB = () => {
    setMasterExamStatusB('unanswered');
    setMasterChosenOptionB(null);
    localStorage.removeItem(`pokethology_act_hexam_b_${todayStr}`);
    localStorage.removeItem(`pokethology_act_hexam_opt_b_${todayStr}`);
    try { sounds.scan(); } catch (_) {}
  };

  const handleLockCoreEnergy = () => {
    // Sweet spot is 42% - 58%
    const inSweetSpot = sliderPosition >= 42 && sliderPosition <= 58;
    try { sounds.scan(); } catch (_) {}
    
    if (inSweetSpot) {
      setGameResult('success');
      setCoreRechargeStatus('completed');
      localStorage.setItem(`pokethology_act_mcore_${todayStr}`, 'completed');
      addBonusPoints(120, {
        title: "Magnetic Core Energized",
        category: "MEDIUM OPERATIONS",
        description: "Successfully locked the magnetic oscillator sweepers within the 42%-58% sweet spot to re-energize the central core grid.",
        itemUnlocked: "Oscilloscope Resonance Plug"
      });
    } else {
      setGameResult('failed');
      setTimeout(() => {
        setGameResult(null);
        setSliderPosition(0);
      }, 1500);
    }
  };

  const easyCompletedCount = useMemo(() => {
    let count = 0;
    if (medCheckinStatus === 'completed') count++;
    if (easyTriviaStatus === 'correct') count++;
    if (easyTriviaStatusB === 'correct') count++;
    if (scanStatus === 'completed') count++;
    return count;
  }, [medCheckinStatus, easyTriviaStatus, easyTriviaStatusB, scanStatus]);

  const medCompletedCount = useMemo(() => {
    let count = 0;
    if (medTriviaStatus === 'correct') count++;
    if (medTriviaStatusB === 'correct') count++;
    if (chronoClaimed) count++;
    if (coreRechargeStatus === 'completed') count++;
    return count;
  }, [medTriviaStatus, medTriviaStatusB, chronoClaimed, coreRechargeStatus]);

  const hardCompletedCount = useMemo(() => {
    let count = 0;
    if (masterExamStatusB === 'correct') count++;
    if (speedTrialStatus === 'completed') count++;
    if (masterExamStatus === 'correct') count++;
    if (matrixLockdownStatus === 'completed') count++;
    return count;
  }, [masterExamStatusB, speedTrialStatus, masterExamStatus, matrixLockdownStatus]);

  const totalCompletedCount = easyCompletedCount + medCompletedCount + hardCompletedCount;

  const operatorRank = useMemo(() => {
    if (totalCompletedCount >= 3) return { title: 'Expert', color: 'text-amber-400 border-amber-500/30' };
    if (totalCompletedCount >= 2) return { title: 'Intermediate', color: 'text-purple-400 border-purple-500/30' };
    if (totalCompletedCount >= 1) return { title: 'Beginner', color: 'text-emerald-400 border-emerald-500/30' };
    return { title: 'Novice', color: 'text-slate-400 border-slate-700/50' };
  }, [totalCompletedCount]);

  if (isWidgetLoading) {
    return (
      <div className="relative w-full flex flex-col gap-4 text-left animate-pulse">
        {/* Skeleton Header Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/70 p-4.5 rounded-2xl border border-cyan-500/10 shadow-lg">
          <div className="space-y-2 border-b sm:border-b-0 sm:border-r border-slate-900 pb-3 sm:pb-0 sm:pr-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-slate-800 rounded-lg" />
              <div className="h-3 w-32 bg-slate-800 rounded" />
            </div>
            <div className="h-2.5 w-48 bg-slate-900 rounded" />
            <div className="h-6 w-20 bg-slate-800 rounded-lg mt-1" />
          </div>
          <div className="space-y-2 sm:pl-4 flex flex-col justify-center">
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-slate-800 rounded" />
              <div className="h-3.5 w-16 bg-slate-900 rounded" />
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full mt-1" />
            <div className="h-2.5 w-32 bg-slate-900 rounded self-end mt-1" />
          </div>
        </div>

        {/* Skeleton Campaign Tracker */}
        <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-4.5 flex flex-col gap-3 relative overflow-hidden">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-2">
              <div className="h-2.5 w-36 bg-slate-900 rounded" />
              <div className="h-4 w-44 bg-slate-800 rounded" />
            </div>
            <div className="h-5 w-24 bg-slate-900 rounded-lg" />
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-slate-800/60 rounded" />
              <div className="h-3 w-4/5 bg-slate-800/60 rounded" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-3 border-t border-slate-900/60">
              <div className="space-y-1.5">
                <div className="h-2.5 w-24 bg-slate-800 rounded" />
                <div className="h-2.5 w-full bg-slate-900 rounded-full" />
              </div>
              <div className="h-4 w-32 bg-slate-900 rounded self-end sm:self-center" />
            </div>
          </div>
        </div>

        {/* Skeleton Difficulty Selection */}
        <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-800 gap-1 h-11">
          <div className="flex-1 bg-slate-800 rounded-lg" />
          <div className="flex-1 bg-slate-900/50 rounded-lg" />
          <div className="flex-1 bg-slate-900/50 rounded-lg" />
        </div>

        {/* Skeleton Activity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-4 h-36 flex flex-col gap-3 animate-pulse" />
          <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-4 h-36 flex flex-col gap-3 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div id="combat-mission-dashboard" className="relative w-full flex flex-col gap-4 text-center">
      {/* Particle Explosion celebration */}
      <ParticleExplosion active={showMissionExplosion} onComplete={() => setShowMissionExplosion(false)} />
      {/* Dynamic Header Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/70 p-4.5 rounded-2xl border border-cyan-500/10 text-left shadow-lg">
        <div className="space-y-1.5 border-b sm:border-b-0 sm:border-r border-slate-900 pb-3 sm:pb-0 sm:pr-4">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Award className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-hud font-black text-cyan-400 uppercase tracking-widest">Operator Synapse Level</span>
          </div>
          <p className="text-[9px] font-mono text-slate-400 uppercase">
            Current Status: &nbsp;
            <span className={cn("font-bold text-[10px] tracking-wider", operatorRank.color)}>
              {operatorRank.title}
            </span>
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-xl sm:text-2xl font-hud font-black text-white leading-none">
              {totalCompletedCount} <span className="text-xs text-cyan-400/60 font-bold">COMPLETED</span>
            </div>
          </div>
        </div>

        <div className="space-y-1 sm:pl-4 flex flex-col justify-center">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-hud font-extrabold text-slate-400 uppercase tracking-wider">Daily Accomplices</span>
            <span className="text-xs font-hud font-black text-white">{totalCompletedCount} / 12 Completed</span>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-[1px] mt-1.5">
            <motion.div 
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
              initial={{ width: 0 }}
              animate={{ width: `${(totalCompletedCount / 12) * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <p className="text-[8px] font-mono text-slate-500 uppercase mt-1 tracking-wider text-right">
            Active Operations: {12 - totalCompletedCount} remaining today
          </p>
        </div>
      </div>
        {/* HUD OPERATIONS DIRECTORY (BRONZE, SILVER, GOLD DIVISION) */}
      <div className="mt-4 select-none">
        <div className="flex justify-center items-center mb-2 px-1">
          <h4 className="text-[10px] font-hud font-black text-cyan-500/80 uppercase tracking-widest flex items-center gap-1.5 justify-center">
            <Sparkles className="w-3.5 h-3.5" />
            OPERATIONAL TIERS
          </h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {[
            { 
              id: 'bronze', 
              label: 'Bronze operations', 
              desc: 'Basic calibration', 
              color: 'from-orange-600/20 to-orange-950/20 border-orange-500 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]', 
              activeStyle: 'border-orange-400 bg-gradient-to-br from-orange-950/60 via-slate-900/90 to-orange-900/30 text-orange-300 shadow-[0_0_20px_rgba(249,115,22,0.3)]',
              hoverBorder: 'hover:border-orange-700/40',
              icon: Flame, 
              completed: easyCompletedCount,
              accent: 'bg-orange-500'
            },
            { 
              id: 'silver', 
              label: 'Silver operations', 
              desc: 'Standard alignment', 
              color: 'from-slate-600/20 to-slate-800/10 border-slate-400 text-slate-200 shadow-[0_0_15px_rgba(148,163,184,0.2)]', 
              activeStyle: 'border-slate-300 bg-gradient-to-br from-slate-950/60 via-slate-900/90 to-slate-800/30 text-slate-200 shadow-[0_0_20px_rgba(148,163,184,0.3)]',
              hoverBorder: 'hover:border-slate-600/40',
              icon: Zap, 
              completed: medCompletedCount,
              accent: 'bg-slate-400'
            },
            { 
              id: 'gold', 
              label: 'Gold operations', 
              desc: 'Overload validation', 
              color: 'from-yellow-600/20 to-yellow-950/20 border-yellow-500 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]', 
              activeStyle: 'border-yellow-400 bg-gradient-to-br from-yellow-950/60 via-slate-900/90 to-yellow-900/30 text-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.3)]',
              hoverBorder: 'hover:border-yellow-600/40',
              icon: Trophy, 
              completed: hardCompletedCount,
              accent: 'bg-yellow-500'
            }
          ].map((tier) => {
            const isActive = selectedDifficulty === tier.id;
            const TierIcon = tier.icon;
            
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * parseInt(tier.id === 'bronze' ? '0' : tier.id === 'silver' ? '1' : '2') }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedDifficulty(tier.id as any); try { sounds.scan(); } catch (_) {} }}
                  className={cn(
                    "relative group flex flex-row items-center justify-between border rounded-xl transition-all duration-200 cursor-pointer overflow-hidden text-left focus:outline-none w-full px-4 h-14",
                    isActive 
                      ? tier.activeStyle
                      : "bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  )}
                >
                  <div className="flex items-center gap-1.5 shrink-0">
                    <TierIcon className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-current" : "text-slate-500")} />
                    <span className="font-hud text-[9.5px] font-black uppercase tracking-wider">{tier.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0 font-mono text-[9px] font-semibold">
                    <span className={cn("px-1.5 py-0.5 rounded text-[8px] tracking-tight leading-none", isActive ? "bg-slate-950/80 text-current" : "bg-slate-950/30 text-slate-500")}>
                      {tier.completed}/4
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping shrink-0" />
                    )}
                  </div>
                </motion.button>
              </motion.div>
            )
          })}
        </div>
        
        {/* Elegant status line matching selected difficulty tier */}
        <div className="mt-2.5 mb-1 px-3 py-1.5 bg-slate-950/40 border border-slate-900/80 rounded-lg flex justify-between items-center text-[7.5px] font-mono tracking-wider text-slate-400 uppercase select-none">
          <div className="flex items-center gap-1.5">
            <span className="text-cyan-500/80 font-bold font-mono">Status:</span>
            <span className={cn("font-black font-hud text-[8px]", 
              selectedDifficulty === 'bronze' ? 'text-orange-400' : selectedDifficulty === 'silver' ? 'text-slate-300' : 'text-yellow-400'
            )}>
              {selectedDifficulty} Tier Selected
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-500 lowercase font-medium">
              {selectedDifficulty === 'bronze' ? 'basic training calibration' : selectedDifficulty === 'silver' ? 'standard alignment protocols' : 'expert overload validation logs'}
            </span>
          </div>
          <div className="text-slate-500 font-medium">
            {selectedDifficulty === 'bronze' ? easyCompletedCount : selectedDifficulty === 'silver' ? medCompletedCount : hardCompletedCount} of 4 completed
          </div>
        </div>
      </div>

      {/* OPERATIONS VIEW CONTENT AREA */}
      <div className="text-left w-full">
        <AnimatePresence mode="wait">
          {selectedDifficulty === 'bronze' ? (
            <motion.div
              key="bronze-dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col md:grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 w-full max-w-full"
            >
              {/* ACTIVITY 01 • Theory Challenge */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden shadow-lg text-left max-w-full">
                <HUDCorners />
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h4 className="text-[11px] font-hud text-amber-500 uppercase font-black tracking-wider flex items-center gap-1.5 font-bold">
                      <BrainCircuit className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      Activity 01 • Theory Challenge
                    </h4>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5 font-bold">Nectar of the Novices </span>
                  </div>
                  {easyTriviaStatus === 'correct' ? (
                    <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">COMPLETED</span>
                  ) : (
                    <span className="text-[8px] font-bold text-amber-500 bg-amber-950/30 border border-amber-500/25 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">ACTIVE</span>
                  )}
                </div>

                <p className="text-[10px] sm:text-xs text-zinc-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 italic leading-relaxed break-words max-w-full" style={{ overflowWrap: 'break-word' }}>
                  "{easyTriviaQuestion.question}"
                </p>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 max-w-full">
                  {easyTriviaQuestion.options.map((opt, idx) => {
                    const isSelected = easyChosenOption === idx;
                    const isCorrect = idx === easyTriviaQuestion.answerIndex;
                    let bStyle = "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300";
                    
                    if (easyTriviaStatus !== 'unanswered') {
                      if (isCorrect) {
                        bStyle = "bg-emerald-950/50 border-emerald-500/50 text-emerald-300 font-bold";
                      } else if (isSelected) {
                        bStyle = "bg-red-950/50 border-red-500/50 text-red-300 font-bold";
                      } else {
                        bStyle = "bg-slate-955/30 border-slate-900 text-slate-600 cursor-not-allowed";
                      }
                    }

                    return (
                      <button
                        key={`easy-opt-${idx}`}
                        disabled={easyTriviaStatus !== 'unanswered'}
                        onClick={() => handleEasyTriviaAnswer(idx)}
                        className={cn(
                          "p-2.5 border rounded-lg text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-left transition-all cursor-pointer flex items-center justify-between min-h-[42px] w-full max-w-full",
                          bStyle
                        )}
                      >
                        <span key={`easy-opt-txt-${idx}`} className="break-words flex-1 min-w-0 text-left leading-tight pr-1" style={{ overflowWrap: 'break-word' }}>{opt}</span>
                        {easyTriviaStatus !== 'unanswered' && isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>

                {easyTriviaStatus !== 'unanswered' && (
                  <div className="flex flex-col gap-1.5 mt-1 max-w-full">
                    <p className="text-[8px] sm:text-[9px] text-teal-400 font-mono tracking-wide leading-relaxed bg-teal-950/20 p-2.5 rounded border border-teal-500/10 uppercase break-words max-w-full" style={{ overflowWrap: 'break-word' }}>
                      {easyTriviaStatus === 'correct' ? "✔️ Right! " : "❌ Locked! "}
                      {easyTriviaQuestion.explanation}
                    </p>
                    {easyTriviaStatus === 'incorrect' && (
                      <button
                        onClick={handleRetryEasyTrivia}
                        className="py-1 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-[8px] font-mono uppercase font-black tracking-widest border border-red-500/30 rounded-lg transition-all cursor-pointer w-fit self-end"
                      >
                        Reset & Try Again
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ACTIVITY 02 • Theory Challenge II */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden shadow-lg text-left">
                <HUDCorners />
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h4 className="text-[11px] font-hud text-amber-500 uppercase font-black tracking-wider flex items-center gap-1.5 font-bold">
                      <BrainCircuit className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      Activity 02 • Theory II
                    </h4>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5 font-bold">Type Effectiveness Check </span>
                  </div>
                  {easyTriviaStatusB === 'correct' ? (
                    <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">COMPLETED</span>
                  ) : (
                    <span className="text-[8px] font-bold text-amber-500 bg-amber-950/30 border border-amber-500/25 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">ACTIVE</span>
                  )}
                </div>

                <p className="text-[10px] sm:text-xs text-zinc-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 italic leading-relaxed break-words">
                  "{easyTriviaQuestionB.question}"
                </p>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                  {easyTriviaQuestionB.options.map((opt, idx) => {
                    const isSelected = easyChosenOptionB === idx;
                    const isCorrect = idx === easyTriviaQuestionB.answerIndex;
                    let bStyle = "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300";
                    
                    if (easyTriviaStatusB !== 'unanswered') {
                      if (isCorrect) {
                        bStyle = "bg-emerald-950/50 border-emerald-500/50 text-emerald-300 font-bold";
                      } else if (isSelected) {
                        bStyle = "bg-red-950/50 border-red-500/50 text-red-300 font-bold";
                      } else {
                        bStyle = "bg-slate-955/30 border-slate-900 text-slate-600 cursor-not-allowed";
                      }
                    }

                    return (
                      <button
                        key={`easy-opt-b-${idx}`}
                        disabled={easyTriviaStatusB !== 'unanswered'}
                        onClick={() => handleEasyTriviaAnswerB(idx)}
                        className={cn(
                          "p-2.5 border rounded-lg text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-left transition-all cursor-pointer flex items-center justify-between min-h-[42px] w-full",
                          bStyle
                        )}
                      >
                        <span className="break-words flex-1 min-w-0 text-left leading-tight pr-1">{opt}</span>
                        {easyTriviaStatusB !== 'unanswered' && isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>

                {easyTriviaStatusB !== 'unanswered' && (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <p className="text-[8px] sm:text-[9px] text-teal-400 font-mono tracking-wide leading-relaxed bg-teal-950/20 p-2.5 rounded border border-teal-500/10 uppercase break-words">
                      {easyTriviaStatusB === 'correct' ? "✔️ Right! " : "❌ Locked! "}
                      {easyTriviaQuestionB.explanation}
                    </p>
                    {easyTriviaStatusB === 'incorrect' && (
                      <button
                        onClick={handleRetryEasyTriviaB}
                        className="py-1 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-[8px] font-mono uppercase font-black tracking-widest border border-red-500/30 rounded-lg transition-all cursor-pointer w-fit self-end"
                      >
                        Reset & Try Again
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ACTIVITY 03 • Pokédex Challenge */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden shadow-lg text-left">
                <HUDCorners />
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h4 className="text-[11px] font-hud text-amber-500 uppercase font-black tracking-wider flex items-center gap-1.5 font-bold">
                      <BrainCircuit className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                      Activity 03 • Pokédex
                    </h4>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5 font-bold">Daily Pokédex Scan </span>
                  </div>
                  {scanStatus === 'completed' ? (
                    <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">COMPLETED</span>
                  ) : (
                    <span className="text-[8px] font-bold text-amber-500 bg-amber-950/30 border border-amber-500/25 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">ACTIVE</span>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 leading-normal">
                  Scan the Pokédex to load new highlights and complete this daily activity.
                </p>

                <div>
                  {scanStatus === 'idle' && (
                    <button
                      onClick={handleCosmicScan}
                      className="w-full py-2.5 bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-300 border border-indigo-500/30 text-[10px] font-hud font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    >
                      <Search className="w-3.5 h-3.5" />
                      Start Pokédex Scan
                    </button>
                  )}

                  {scanStatus === 'scanning' && (
                    <div className="w-full py-2 bg-indigo-950/40 border border-indigo-500/30 text-[10px] font-hud font-black uppercase tracking-wider rounded-lg flex flex-col items-center justify-center gap-1 p-2">
                      <div className="flex items-center gap-1.5 text-cyan-400">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Scanning Pokédex logs...</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-1.5">
                        <motion.div 
                          className="h-full bg-cyan-400"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2.8, ease: "linear" }}
                        />
                      </div>
                    </div>
                  )}

                  {scanStatus === 'completed' && (
                    <div className="w-full py-2 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-hud font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Pokédex scan completed 
                    </div>
                  )}
                </div>
              </div>

              {/* ACTIVITY 04 • Smart & Reactivity Challenge */}
              <div className={cn(
                "bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden shadow-lg transition-all duration-300 text-left",
                meditationFlash ? "ring-2 ring-emerald-400 border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.8)] bg-emerald-950/10 scale-[1.01]" : ""
              )}>
                <HUDCorners />
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h4 className="text-[11px] font-hud text-amber-500 uppercase font-black tracking-wider flex items-center gap-1.5 font-bold">
                      <Gauge className="w-3.5 h-3.5 text-amber-500" />
                      Activity 04 • Smart & Reactivity
                    </h4>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5 font-bold">Focus Meditation </span>
                  </div>
                  {medCheckinStatus === 'completed' ? (
                    <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">COMPLETED</span>
                  ) : (
                    <span className="text-[8px] font-bold text-amber-500 bg-amber-950/30 border border-amber-500/25 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">ACTIVE</span>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 leading-normal">
                  Take a quick 6-second deep breath to relax and focus before your battles.
                </p>

                <div className="mt-2.5">
                  {medCheckinStatus === 'idle' && (
                    <button
                      onClick={handleMeditationStart}
                      className="w-full py-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 text-[10px] font-hud font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    >
                      <Timer className="w-3.5 h-3.5" />
                      Begin Focused Breathing (6s)
                    </button>
                  )}

                  {medCheckinStatus === 'breathing' && (
                    <div className="w-full py-2 bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-hud font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      <span>Inhale deeply... {medSeconds}s</span>
                    </div>
                  )}

                  {medCheckinStatus === 'claimable' && (
                    <button
                      onClick={handleMeditationClaim}
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-hud font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg active:scale-95 animate-bounce"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      Claim  Reward!
                    </button>
                  )}

                  {medCheckinStatus === 'completed' && (
                    <div className="w-full py-2 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-hud font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 select-none opacity-80">
                      <Check className="w-3.5 h-3.5" />
                      Completed 
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : selectedDifficulty === 'silver' ? (
            <motion.div
              key="silver-dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col md:grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 w-full max-w-full"
            >
              {/* ACTIVITY 05 • Theory Challenge */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden shadow-lg text-left">
                <HUDCorners />
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h4 className="text-[11px] font-hud text-slate-300 uppercase font-black tracking-wider flex items-center gap-1.5 font-bold">
                      <BrainCircuit className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
                      Activity 05 • Theory Challenge
                    </h4>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5 font-bold">Advanced Hermeneutics Exam </span>
                  </div>
                  {medTriviaStatus === 'correct' ? (
                    <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">COMPLETED</span>
                  ) : (
                    <span className="text-[8px] font-bold text-slate-400 bg-slate-950/30 border border-slate-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">ACTIVE</span>
                  )}
                </div>

                <p className="text-[10px] sm:text-xs text-zinc-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 italic leading-relaxed break-words">
                  "{medTriviaQuestion.question}"
                </p>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                  {medTriviaQuestion.options.map((opt, idx) => {
                    const isSelected = medChosenOption === idx;
                    const isCorrect = idx === medTriviaQuestion.answerIndex;
                    let bStyle = "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300";
                    
                    if (medTriviaStatus !== 'unanswered') {
                      if (isCorrect) {
                        bStyle = "bg-emerald-950/50 border-emerald-500/50 text-emerald-300 font-bold";
                      } else if (isSelected) {
                        bStyle = "bg-red-950/50 border-red-500/50 text-red-300 font-bold";
                      } else {
                        bStyle = "bg-slate-955/30 border-slate-900 text-slate-600 cursor-not-allowed";
                      }
                    }

                    return (
                      <button
                        key={`silver-opt-${idx}`}
                        disabled={medTriviaStatus !== 'unanswered'}
                        onClick={() => handleMedTriviaAnswer(idx)}
                        className={cn(
                          "p-2.5 border rounded-lg text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-left transition-all cursor-pointer flex items-center justify-between min-h-[42px] w-full",
                          bStyle
                        )}
                      >
                        <span className="break-words flex-1 min-w-0 text-left leading-tight pr-1">{opt}</span>
                        {medTriviaStatus !== 'unanswered' && isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>

                {medTriviaStatus !== 'unanswered' && (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <p className="text-[8px] sm:text-[9px] text-purple-400 font-mono tracking-wide leading-relaxed bg-purple-950/20 p-2.5 rounded border border-purple-500/10 uppercase break-words">
                      {medTriviaStatus === 'correct' ? "✔️ Right! " : "❌ Locked! "}
                      {medTriviaQuestion.explanation}
                    </p>
                    {medTriviaStatus === 'incorrect' && (
                      <button
                        onClick={handleRetryMedTrivia}
                        className="py-1 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-[8px] font-mono uppercase font-black tracking-widest border border-red-500/30 rounded-lg transition-all cursor-pointer w-fit self-end"
                      >
                        Reset & Try Again
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ACTIVITY 06 • Theory Challenge II */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden shadow-lg text-left">
                <HUDCorners />
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h4 className="text-[11px] font-hud text-slate-300 uppercase font-black tracking-wider flex items-center gap-1.5 font-bold">
                      <BrainCircuit className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
                      Activity 06 • Theory II
                    </h4>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5 font-bold">Complex Move Strategy Check </span>
                  </div>
                  {medTriviaStatusB === 'correct' ? (
                    <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">COMPLETED</span>
                  ) : (
                    <span className="text-[8px] font-bold text-slate-400 bg-slate-950/30 border border-slate-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">ACTIVE</span>
                  )}
                </div>

                <p className="text-[10px] sm:text-xs text-zinc-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 italic leading-relaxed break-words">
                  "{medTriviaQuestionB.question}"
                </p>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                  {medTriviaQuestionB.options.map((opt, idx) => {
                    const isSelected = medChosenOptionB === idx;
                    const isCorrect = idx === medTriviaQuestionB.answerIndex;
                    let bStyle = "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300";
                    
                    if (medTriviaStatusB !== 'unanswered') {
                      if (isCorrect) {
                        bStyle = "bg-emerald-950/50 border-emerald-500/50 text-emerald-300 font-bold";
                      } else if (isSelected) {
                        bStyle = "bg-red-950/50 border-red-500/50 text-red-300 font-bold";
                      } else {
                        bStyle = "bg-slate-955/30 border-slate-900 text-slate-600 cursor-not-allowed";
                      }
                    }

                    return (
                      <button
                        key={`silver-opt-b-${idx}`}
                        disabled={medTriviaStatusB !== 'unanswered'}
                        onClick={() => handleMedTriviaAnswerB(idx)}
                        className={cn(
                          "p-2.5 border rounded-lg text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-left transition-all cursor-pointer flex items-center justify-between min-h-[42px] w-full",
                          bStyle
                        )}
                      >
                        <span className="break-words flex-1 min-w-0 text-left leading-tight pr-1">{opt}</span>
                        {medTriviaStatusB !== 'unanswered' && isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>

                {medTriviaStatusB !== 'unanswered' && (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <p className="text-[8px] sm:text-[9px] text-purple-400 font-mono tracking-wide leading-relaxed bg-purple-950/20 p-2.5 rounded border border-purple-500/10 uppercase break-words">
                      {medTriviaStatusB === 'correct' ? "✔️ Right! " : "❌ Locked! "}
                      {medTriviaQuestionB.explanation}
                    </p>
                    {medTriviaStatusB === 'incorrect' && (
                      <button
                        onClick={handleRetryMedTriviaB}
                        className="py-1 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-[8px] font-mono uppercase font-black tracking-widest border border-red-500/30 rounded-lg transition-all cursor-pointer w-fit self-end"
                      >
                        Reset & Try Again
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ACTIVITY 07 • Pokédex Challenge */}
              <div className={cn(
                "bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden shadow-lg scale-100 transition-all duration-300 text-left",
                chronoFlash ? "ring-2 ring-emerald-400 border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.8)] bg-emerald-950/10 scale-[1.01]" : ""
              )}>
                <HUDCorners />
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h4 className="text-[11px] font-hud text-slate-300 uppercase font-black tracking-wider flex items-center gap-1.5 font-bold">
                      <BrainCircuit className="w-3.5 h-3.5 text-slate-400 animate-spin" style={{ animationDuration: '6s' }} />
                      Activity 07 • Pokédex
                    </h4>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5 font-bold">High-Stat Defense Scanner </span>
                  </div>
                  {chronoClaimed ? (
                    <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">COMPLETED</span>
                  ) : (
                    <span className="text-[8px] font-bold text-slate-400 bg-slate-950/30 border border-slate-500/25 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">ACTIVE</span>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 leading-normal">
                  Search and register a heavy-defense species (greater than 100 Base Defense) in your active collection logs.
                </p>

                <div>
                  {isCompleted ? (
                    chronoClaimed ? (
                      <div className="w-full py-2 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-hud font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        Defense metrics locked perfectly!
                      </div>
                    ) : (
                      <button
                        onClick={handleChronoClaim}
                        className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-[10px] font-hud font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95 animate-bounce"
                      >
                        <Trophy className="w-3.5 h-3.5 animate-pulse" />
                        Claim Activity
                      </button>
                    )
                  ) : (
                    <div className="w-full py-2.5 bg-slate-900 border border-slate-800 text-slate-500 text-[10px] font-hud font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 select-none">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Pending heavy defense index detection...
                    </div>
                  )}
                </div>
              </div>

              {/* ACTIVITY 08 • Smart & Reactivity Challenge */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden shadow-lg text-left">
                <HUDCorners />
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h4 className="text-[11px] font-hud text-slate-300 uppercase font-black tracking-wider flex items-center gap-1.5 font-bold">
                      <Gauge className="w-3.5 h-3.5 text-slate-400" />
                      Activity 08 • Smart & Reactivity
                    </h4>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5 font-bold">Reflex Calibration Exercise </span>
                  </div>
                  {coreRechargeStatus === 'completed' ? (
                    <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">COMPLETED</span>
                  ) : (
                    <span className="text-[8px] font-bold text-slate-400 bg-slate-950/30 border border-slate-500/25 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">ACTIVE</span>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 leading-normal">
                  Test your quick decision skills. Click the calibration lock precisely within the optimal 42% to 58% buffer range.
                </p>

                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 relative select-none">
                  <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 mb-1">
                    <span>MIN ENERGY</span>
                    <span className="text-emerald-500 font-bold">SWEET SPOT (42% - 58%)</span>
                    <span>MAX CAPACITY</span>
                  </div>
                  
                  {/* Energy bar visual */}
                  <div className="h-6 w-full bg-slate-950 rounded border border-slate-800 relative overflow-hidden">
                    {/* Perfect target marker in the center */}
                    <div className="absolute top-0 bottom-0 left-[42%] right-[42%] bg-emerald-500/20 border-x border-dashed border-emerald-400/40" />
                    
                    {/* The slider dial */}
                    <div 
                      className="absolute top-0 bottom-0 w-2.5 bg-gradient-to-r from-cyan-400 to-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)] rounded-sm transition-all"
                      style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                    />
                  </div>

                  {gameResult === 'failed' && (
                    <p className="text-[8px] font-mono text-rose-500 uppercase mt-1.5 animate-pulse text-center">
                      ❌ ENERGY INSTABILITY! TRY AGAIN...
                    </p>
                  )}

                  {gameResult === 'success' && (
                    <p className="text-[8px] font-mono text-emerald-400 uppercase mt-1.5 animate-pulse text-center">
                      ✔️ CALIBRATION LOCK SUCCESS!
                    </p>
                  )}
                </div>

                <div>
                  {coreRechargeStatus === 'idle' && (
                    <button
                      onClick={() => setCoreRechargeStatus('playing')}
                      className="w-full py-2.5 bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-300 border border-indigo-500/30 text-[10px] font-hud font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    >
                      <Gauge className="w-3.5 h-3.5" />
                      Calibrate Temporal Core (Play)
                    </button>
                  )}

                  {coreRechargeStatus === 'playing' && (
                    <button
                      onClick={handleLockCoreEnergy}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-hud font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95 animate-pulse"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      LOCK CORE ENERGY NOW!
                    </button>
                  )}

                  {coreRechargeStatus === 'completed' && (
                    <div className="w-full py-2 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-hud font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Grid Calibration Perfect 
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="hard-dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 gap-4"
            >
              {/* ACTIVITY 09: Master Strategist Exam (Hard Trivia) */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden shadow-lg text-left">
                <HUDCorners />
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h4 className="text-[11px] font-hud text-yellow-400 uppercase font-black tracking-wider flex items-center gap-1.5 font-bold">
                      <BrainCircuit className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                      Activity 09 • Theory Challenge
                    </h4>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5 font-bold">Master Strategist Theory Exam </span>
                  </div>
                  {masterExamStatus === 'correct' ? (
                    <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">COMPLETED</span>
                  ) : (
                    <span className="text-[8px] font-bold text-yellow-500 bg-yellow-950/30 border border-yellow-500/25 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">ACTIVE</span>
                  )}
                </div>

                <p className="text-[10px] sm:text-xs text-zinc-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 italic leading-relaxed break-words">
                  "{hardTriviaQuestion.question}"
                </p>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                  {hardTriviaQuestion.options.map((opt, idx) => {
                    const isSelected = masterChosenOption === idx;
                    const isCorrect = idx === hardTriviaQuestion.answerIndex;
                    let bStyle = "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300";
                    
                    if (masterExamStatus !== 'unanswered') {
                      if (isCorrect) {
                        bStyle = "bg-emerald-950/50 border-emerald-500/50 text-emerald-300 font-bold";
                      } else if (isSelected) {
                        bStyle = "bg-red-950/50 border-red-500/50 text-red-300 font-bold";
                      } else {
                        bStyle = "bg-slate-955/30 border-slate-900 text-slate-600 cursor-not-allowed";
                      }
                    }

                    return (
                      <button
                        key={`hard-opt-${idx}`}
                        disabled={masterExamStatus !== 'unanswered'}
                        onClick={() => handleMasterExamAnswer(idx)}
                        className={cn(
                          "p-2.5 border rounded-lg text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-left transition-all cursor-pointer flex items-center justify-between min-h-[42px] w-full",
                          bStyle
                        )}
                      >
                        <span className="break-words flex-1 min-w-0 text-left leading-tight pr-1">{opt}</span>
                        {masterExamStatus !== 'unanswered' && isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>

                {masterExamStatus !== 'unanswered' && (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <p className="text-[8px] sm:text-[9px] text-red-400 font-mono tracking-wide leading-relaxed bg-red-950/20 p-2.5 rounded border border-red-500/10 uppercase break-words text-left">
                      {masterExamStatus === 'correct' ? "✔️ Right! " : "❌ Locked! "}
                      {hardTriviaQuestion.explanation}
                    </p>
                    {masterExamStatus === 'incorrect' && (
                      <button
                        onClick={handleRetryMasterExam}
                        className="py-1 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-[8px] font-mono uppercase font-black tracking-widest border border-red-500/30 rounded-lg transition-all cursor-pointer w-fit self-end"
                      >
                        Reset & Try Again
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* HARD MISSIONS WITH HIGH FIDELITY INTERACTIVE CARDS */}
              <div className="flex flex-col md:grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 w-full max-w-full">
                {/* Activity 10: Theory Challenge II */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden shadow-lg text-left">
                  <HUDCorners />
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h4 className="text-[11px] font-hud text-yellow-400 uppercase font-black tracking-wider flex items-center gap-1.5 font-bold">
                        <BrainCircuit className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                        Activity 10 • Theory II
                      </h4>
                      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5 font-bold">Legendary Lore </span>
                    </div>
                    {masterExamStatusB === 'correct' ? (
                      <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">COMPLETED</span>
                    ) : (
                      <span className="text-[8px] font-bold text-yellow-500 bg-yellow-950/30 border border-yellow-500/25 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">ACTIVE</span>
                    )}
                  </div>

                  <p className="text-[9px] text-slate-300 bg-slate-900/40 p-2.5 rounded border border-slate-800/60 leading-relaxed font-mono text-left italic">
                    "{hardTriviaQuestionB.question}"
                  </p>

                  <div className="grid grid-cols-1 gap-1.5 mt-auto">
                    {hardTriviaQuestionB.options.map((opt, idx) => {
                      const isSelected = masterChosenOptionB === idx;
                      const isCorrect = idx === hardTriviaQuestionB.answerIndex;
                      let bStyle = "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300";
                      
                      if (masterExamStatusB !== 'unanswered') {
                        if (isCorrect) {
                          bStyle = "bg-emerald-950/50 border-emerald-500/50 text-emerald-300 font-bold";
                        } else if (isSelected) {
                          bStyle = "bg-red-950/50 border-red-500/50 text-red-300 font-bold";
                        } else {
                          bStyle = "bg-slate-955/30 border-slate-900 text-slate-600 cursor-not-allowed";
                        }
                      }

                      return (
                        <button
                          key={`master-opt-b-${idx}`}
                          disabled={masterExamStatusB !== 'unanswered'}
                          onClick={() => handleMasterExamAnswerB(idx)}
                          className={cn(
                            "py-1.5 px-2 border rounded-lg text-[9px] font-mono uppercase tracking-wide text-left transition-all cursor-pointer flex items-center justify-between min-h-[36px]",
                            bStyle
                          )}
                        >
                          <span className="pr-1 whitespace-normal break-words">{opt}</span>
                          {masterExamStatusB !== 'unanswered' && isCorrect && <Check className="w-3 h-3 text-emerald-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {masterExamStatusB !== 'unanswered' && (
                    <div className="flex flex-col gap-1.5 mt-1 w-full text-left">
                      <p className="text-[8px] text-red-400 font-mono tracking-wide leading-relaxed bg-red-950/20 p-2 rounded border border-red-500/10 uppercase">
                        {masterExamStatusB === 'correct' ? "✔️ Right! " : "❌ Locked! "}
                        {hardTriviaQuestionB.explanation}
                      </p>
                      {masterExamStatusB === 'incorrect' && (
                        <button
                          onClick={handleRetryMasterExamB}
                          className="py-1 px-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-[8px] font-mono uppercase font-black tracking-widest border border-red-500/30 rounded-lg transition-all cursor-pointer w-fit self-end"
                        >
                          Reset & Try Again
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Activity 11: Pokédex Challenge */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden shadow-lg text-left">
                  <HUDCorners />
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h4 className="text-[11px] font-hud text-yellow-400 uppercase font-black tracking-wider flex items-center gap-1.5 font-bold">
                        <BrainCircuit className="w-3.5 h-3.5 text-yellow-400 animate-spin" style={{ animationDuration: '6s' }} />
                        Activity 11 • Pokédex Puzzle
                      </h4>
                      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5 font-bold">Grid Puzzle </span>
                    </div>
                    {matrixLockdownStatus === 'completed' ? (
                      <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">COMPLETED</span>
                    ) : (
                      <span className="text-[8px] font-bold text-yellow-500 bg-yellow-950/30 border border-yellow-500/25 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">ACTIVE</span>
                    )}
                  </div>

                  <p className="text-[9px] text-slate-400 leading-relaxed font-sans mt-0.5">
                    Click cells to toggle them and their neighbors. Turn all cells green (value 1) to solve the puzzle!
                  </p>

                  {matrixLockdownStatus === 'completed' ? (
                    <div className="mt-auto pt-2 flex items-center gap-2 text-emerald-400 text-[10px] font-medium font-hud uppercase font-black">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Puzzle Completed!
                    </div>
                  ) : (
                    <div className="mt-auto space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="grid grid-cols-3 gap-1 w-20 h-20 shrink-0">
                          {matrixGrid.map((val, idx) => (
                            <button
                              key={`matrix-cell-${idx}`}
                              onClick={() => handleMatrixCellToggle(idx)}
                              className={cn(
                                "w-full h-full rounded border font-mono font-black text-[10px] sm:text-[11px] transition-all cursor-pointer flex items-center justify-center",
                                val 
                                  ? "bg-emerald-900/40 border-emerald-400 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                                  : "bg-red-950/40 border-red-500/30 text-red-500"
                              )}
                            >
                              {val ? '1' : '0'}
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-col justify-between py-1 shrink-0 h-20">
                          <span className="text-[7.5px] font-mono text-slate-500 uppercase leading-none block">TARGET:<br/>ALL 1s</span>
                          <button
                            onClick={handleResetMatrix}
                            className="px-1.5 py-1 text-[7px] text-zinc-400 hover:text-white border border-slate-700 hover:border-slate-500 bg-slate-900 rounded font-bold uppercase transition-all cursor-pointer"
                          >
                            RESET GRID
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Activity 12: Smart & Reactivity Challenge */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden shadow-lg text-left">
                  <HUDCorners />
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h4 className="text-[11px] font-hud text-yellow-400 uppercase font-black tracking-wider flex items-center gap-1.5 font-bold">
                        <Gauge className="w-3.5 h-3.5 text-yellow-400" />
                        Activity 12 • Smart & Reactivity
                      </h4>
                      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-0.5 font-bold">Speed Trial </span>
                    </div>
                    {speedTrialStatus === 'completed' ? (
                      <span className="text-[8px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">PASSED</span>
                    ) : (
                      <span className="text-[8px] font-bold text-yellow-500 bg-yellow-950/30 border border-yellow-500/25 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">ACTIVE</span>
                    )}
                  </div>

                  <p className="text-[9px] text-slate-400 leading-relaxed font-sans mt-0.5">
                    Test your reaction speed! Click the STRIKE button exactly when the speed indicator goes above 365 MPH.
                  </p>

                  {speedTrialStatus === 'completed' ? (
                    <div className="mt-auto pt-2 flex items-center gap-2 text-emerald-400 text-[10px] font-medium font-hud uppercase">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Target speed reached!
                    </div>
                  ) : (
                    <div className="mt-auto space-y-2">
                      {speedTrialStatus === 'running' ? (
                        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg space-y-2 text-center">
                          <div className="flex justify-between items-center text-[8px] font-mono text-slate-400">
                            <span>SWEET SPOT: <strong className="text-emerald-400">365+ MPH</strong></span>
                            <span>SPEED: <strong className={cn(speedTrialCurrent >= 365 ? "text-emerald-400 animate-pulse" : "text-amber-500")}>{speedTrialCurrent} MPH</strong></span>
                          </div>
                          {/* Speedometer line graph mockup */}
                          <div className="w-full bg-slate-950 h-3 rounded overflow-hidden p-[1px] border border-slate-800 relative">
                            <div className="absolute right-0 top-0 bottom-0 w-[40px] bg-emerald-500/10 border-l border-emerald-500/30" />
                            <div className="h-full bg-cyan-500 transition-all duration-75" style={{ width: `${Math.min(100, (speedTrialCurrent / 430) * 100)}%` }} />
                          </div>
                          <button
                            onClick={handleSpeedStrike}
                            className="w-full py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/30 rounded text-[9px] font-hud uppercase font-black tracking-wider shadow cursor-pointer"
                          >
                            ⚡ STRIKE!
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={startSpeedTrial}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 hover:border-cyan-500/30 rounded text-[9px] font-hud uppercase tracking-wider font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Activity className="w-3.5 h-3.5 text-cyan-400" />
                          START SPEED TRIAL
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER GENERAL STATUS */}
      <div className="flex flex-col sm:flex-row justify-center items-center mt-3 border-t border-slate-900/80 pt-3 text-[9px] font-mono gap-2 text-center w-full px-2">
        <span className="text-cyan-400 font-extrabold uppercase tracking-widest text-[9.5px]">
          AGGREGATE OPERATIONAL POWER: {totalCompletedCount} ACTIVITIES COMPLETED
        </span>
      </div>

      {/* Sparkly particles celebration effect */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-50 bg-cyan-400/5 rounded-2xl">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute w-1.5 h-1.5 bg-gradient-to-tr from-amber-400 via-yellow-300 to-cyan-300 rounded-full"
              initial={{ 
                x: Math.random() * 200 - 100, 
                y: Math.random() * 100 - 30 + 80,
                opacity: 1,
                scale: 0.5
              }}
              animate={{ 
                y: -220,
                opacity: 0,
                scale: [0.5, 2.5, 0]
              }}
              transition={{ 
                duration: 2.5, 
                delay: Math.random() * 0.4,
                ease: "easeOut"
              }}
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: '50%'
              }}
            />
          ))}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.8 }}
            className="absolute inset-0 border-4 border-cyan-400 rounded-2xl pointer-events-none"
            onAnimationComplete={() => setShowCelebration(false)}
          />
          <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-slate-950/90 border border-amber-500/30 font-hud text-amber-400 text-sm font-black px-4 py-2 rounded-xl flex items-center gap-2.5 shadow-2xl animate-bounce">
            <Sparkle className="w-4 h-4 animate-spin text-amber-400" />
            <span>EXAMINATION STATUS SECURED</span>
          </div>
        </div>
      )}

      {/* Dynamic Success Award Modal overlay */}
      <AnimatePresence>
        {successModal && successModal.isOpen && (
          <motion.div
            key="success-claim-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSuccessModal(null)}
          >
            <motion.div
              key="success-claim-modal-container"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                transition: { type: "spring", stiffness: 300, damping: 25 }
              }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative p-6 flex flex-col items-center text-center gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Retro HUD corners */}
              <HUDCorners />

              {/* Animated glowing badge placeholder with SVG / Lucide sparks */}
              <div className="relative w-24 h-24 flex items-center justify-center mt-2">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-amber-500/10 to-teal-500/20 rounded-full animate-pulse blur-xl" />
                
                {/* Holographic golden spinning circle */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="absolute inset-0 border border-dashed border-amber-500/40 rounded-full p-2"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                  className="absolute inset-2 border border-dotted border-cyan-500/30 rounded-full p-2"
                />

                <div className="relative w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
                  <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
                </div>
              </div>

              {/* Title parameters */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 font-extrabold uppercase px-2.5 py-0.5 bg-amber-950/40 border border-amber-900/30 rounded-full">
                  {successModal.categoryName || "BOUNTY CLAIMED"}
                </span>
                <h3 className="text-md sm:text-lg font-sans font-black tracking-wider text-zinc-100 uppercase pt-2.5">
                  {successModal.title}
                </h3>
              </div>

              {/* Description summary */}
              <p className="text-[10.5px] text-zinc-400 font-sans leading-relaxed max-w-[280px]">
                {successModal.description}
              </p>

              {/* Unlocked / gained resources list */}
              <div className="w-full bg-zinc-900/50 border border-zinc-900 rounded-2xl p-4 space-y-3 px-3.5 divide-y divide-zinc-900/80">
                <div className="flex flex-col items-center gap-1 pb-1">
                  <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase">Gained Grid Currency</span>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                    <span className="text-xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-emerald-400">
                      ACTIVITY RESOLVED
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 text-[10px] font-mono">
                  <span className="text-zinc-500 uppercase">Cognitive Insight</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    +1 Crystal Node
                  </span>
                </div>

                {successModal.itemUnlocked && (
                  <div className="flex flex-col items-center gap-1.5 pt-3">
                    <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase">Tactical Item Unlocked</span>
                    <div className="flex items-center gap-2 bg-cyan-950/30 border border-cyan-900/40 px-3 py-1.5 rounded-xl w-full justify-center">
                      <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="text-cyan-300 font-sans text-[10px] font-extrabold uppercase tracking-wide truncate">
                        {successModal.itemUnlocked}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSuccessModal(null);
                  try { sounds.scan(); } catch (_) {}
                }}
                className="w-full py-3 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-center text-[10px] font-sans font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-zinc-950/50 mt-1"
              >
                DISMISS SYSTEM INTERFACE
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

PokethologyCombatMissionWidget.displayName = 'PokethologyCombatMissionWidget';
