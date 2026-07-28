import React, { useState, useEffect, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, hudButtonClass, playHaptic } from '../lib/utils';
import { sounds } from '../lib/sounds';
import { HUDCorners } from './HUDCorners';
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  Award,
  Sparkles,
  BookOpen,
  RotateCcw,
  Check,
  ChevronRight,
  Shield,
  Layers,
  GraduationCap
} from 'lucide-react';

export interface RegionQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface RegionLoreData {
  region: string;
  themeTitle: string;
  themeDescription: string;
  badgeColor: string;
  questions: RegionQuestion[];
}

export const REGION_LORE_DATABASE: RegionLoreData[] = [
  {
    region: 'Kanto',
    themeTitle: 'Genetic Creation & Artificial Deities',
    themeDescription: 'Kanto lore centers on scientific hubris, genetic splicing of ancestral DNA, and virtual entity synthesis.',
    badgeColor: 'border-red-500/40 text-red-400 bg-red-950/30',
    questions: [
      {
        id: 'kanto_1',
        question: 'Which legendary Pokémon was created artificially through genetic manipulation of ancient Mew DNA?',
        options: ['Mewtwo', 'Genesect', 'Porygon-Z', 'Mew'],
        answerIndex: 0,
        explanation: 'Mewtwo was created by genetic engineering in the Cinnabar Island Mansion based on Mew\'s genetic material.'
      },
      {
        id: 'kanto_2',
        question: 'According to Silph Co. records, which Pokémon was completely synthesized from virtual computer code?',
        options: ['Rotom', 'Castform', 'Porygon', 'Magnemite'],
        answerIndex: 2,
        explanation: 'Porygon was developed by Silph Co. using advanced programming technology, making it the first man-made code Pokémon.'
      },
      {
        id: 'kanto_3',
        question: 'In Kanto mythos, which ancestor Pokémon possesses the genetic code of all Pokémon species?',
        options: ['Ditto', 'Mew', 'Bulbasaur', 'Arceus'],
        answerIndex: 1,
        explanation: 'Mew is believed to hold the genetic blueprint of all Pokémon species, enabling it to learn almost every move.'
      },
      {
        id: 'kanto_4',
        question: 'According to the Shamouti prophecy, which three legendary birds govern elemental climate equilibrium?',
        options: ['Articuno, Zapdos, Moltres', 'Raikou, Entei, Suicune', 'Tornadus, Thundurus, Landorus', 'Regirock, Regice, Registeel'],
        answerIndex: 0,
        explanation: 'Articuno, Zapdos, and Moltres maintain ice, lightning, and fire climate balances in elemental mythos.'
      },
      {
        id: 'kanto_5',
        question: 'Which fossil Pokémon species was resurrected from ancient shell armor discovered in Mt. Moon?',
        options: ['Omanyte & Kabuto', 'Lileep & Anorith', 'Cranidos & Shieldon', 'Tyrunt & Amaura'],
        answerIndex: 0,
        explanation: 'Omanyte and Kabuto fossils were recovered from ancient primeval seabeds in Kanto.'
      }
    ]
  },
  {
    region: 'Johto',
    themeTitle: 'Tower Resurrection & Elemental Mythos',
    themeDescription: 'Johto lore focuses on ancient traditions, sacred towers, elemental beasts, and spiritual resurrection.',
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-950/30',
    questions: [
      {
        id: 'johto_1',
        question: 'Which sacred rainbow deity resurrected the three legendary beasts when the Brass Tower burned down?',
        options: ['Lugia', 'Ho-Oh', 'Suicune', 'Celebi'],
        answerIndex: 1,
        explanation: 'Ho-Oh bestowed new life upon the three nameless Pokémon that perished in the Brass Tower flames, creating Raikou, Entei, and Suicune.'
      },
      {
        id: 'johto_2',
        question: 'Which dragon deity governs the oceanic depths and calms violent tempests in Whirl Islands legend?',
        options: ['Lugia', 'Kyogre', 'Gyarados', 'Suicune'],
        answerIndex: 0,
        explanation: 'Lugia resides at the bottom of the ocean trench near Whirl Islands, possessing wings powerful enough to create 40-day storms.'
      },
      {
        id: 'johto_3',
        question: 'The legendary beast Suicune is revered in Johto lore as the physical embodiment of which natural force?',
        options: ['Volcanic Magma', 'North Wind & Pure Water', 'Storm Cloud Thunderbolts', 'Spring Growth'],
        answerIndex: 1,
        explanation: 'Suicune embodies the compassion of the North Wind, purifying murky waters wherever it treads.'
      },
      {
        id: 'johto_4',
        question: 'Which time-traveling mythical guardian protects the sacred shrine in Ilex Forest?',
        options: ['Celebi', 'Jirachi', 'Victini', 'Mew'],
        answerIndex: 0,
        explanation: 'Celebi travels through time as the Voice of the Forest, bringing lush green vegetation wherever it appears.'
      },
      {
        id: 'johto_5',
        question: 'What mysterious alphabetic psychic entities inhabit the Ruins of Alph, shaping reality through collective thoughts?',
        options: ['Unown', 'Sigilyph', 'Bronzor', 'Solrock'],
        answerIndex: 0,
        explanation: 'Unown exist as ancient letter glyphs that distort reality when gathered in high numbers.'
      }
    ]
  },
  {
    region: 'Hoenn',
    themeTitle: 'Primal Weather Trio & Continental Expansion',
    themeDescription: 'Hoenn mythology revolves around super-ancient primal forces shaping landmasses, abyssal oceans, and ozone equilibrium.',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30',
    questions: [
      {
        id: 'hoenn_1',
        question: 'Which super-ancient deity expanded the landmasses during its primordial clash with Kyogre?',
        options: ['Regigigas', 'Groudon', 'Rayquaza', 'Heatran'],
        answerIndex: 1,
        explanation: 'Groudon evaporated oceans with intense sunlight to expand the continents during the ancient primal era.'
      },
      {
        id: 'hoenn_2',
        question: 'According to Hoenn legend, which sky dragon descended from the ozone layer to quell Groudon and Kyogre?',
        options: ['Rayquaza', 'Deoxys', 'Latios', 'Giratina'],
        answerIndex: 0,
        explanation: 'Rayquaza ended the destructive primal battle between Groudon and Kyogre, returning peace to the Hoenn atmosphere.'
      },
      {
        id: 'hoenn_3',
        question: 'What divine energy process allows Kyogre and Groudon to reclaim their original ancient power?',
        options: ['Primal Reversion', 'Mega Evolution', 'Dynamax', 'Terastallization'],
        answerIndex: 0,
        explanation: 'Primal Reversion allows Groudon and Kyogre to absorb natural energy and reclaim their ancient primal forms.'
      },
      {
        id: 'hoenn_4',
        question: 'Which alien DNA virus mutated in the ozone layer after exposed to laser rays, creating a alien mythical titan?',
        options: ['Deoxys', 'Rayquaza', 'Eternatus', 'Necrozma'],
        answerIndex: 0,
        explanation: 'Deoxys mutated from an extraterrestrial virus aboard a meteor that entered Earth\'s upper atmosphere.'
      },
      {
        id: 'hoenn_5',
        question: 'Which wish-granting Pokémon awakens from a thousand-year slumber when the Millennium Comet shines?',
        options: ['Jirachi', 'Celebi', 'Victini', 'Shaymin'],
        answerIndex: 0,
        explanation: 'Jirachi awakens for seven days every millennium to grant heartfelt wishes written on its paper tags.'
      }
    ]
  },
  {
    region: 'Sinnoh',
    themeTitle: 'Cosmological Creation & Void Dimensions',
    themeDescription: 'Sinnoh theology explores universal origin, time, space, emotion, and the primordial void egg.',
    badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/30',
    questions: [
      {
        id: 'sinnoh_1',
        question: 'Which supreme deity emerged from an egg in the void of chaos to shape the universe and creation trio?',
        options: ['Arceus', 'Dialga', 'Palkia', 'Giratina'],
        answerIndex: 0,
        explanation: 'Arceus is known in Sinnoh lore as the Original One, born from an egg in the void before the universe existed.'
      },
      {
        id: 'sinnoh_2',
        question: 'In Sinnoh creation theology, Dialga and Palkia govern which fundamental dimensions of reality?',
        options: ['Time and Space', 'Light and Darkness', 'Life and Death', 'Past and Future'],
        answerIndex: 0,
        explanation: 'Dialga\'s heartbeat maintains the flow of Time, while Palkia\'s breath stabilizes the structure of Space.'
      },
      {
        id: 'sinnoh_3',
        question: 'Which deity was banished to the Distortion World due to its volatile nature, balancing reality from the reverse side?',
        options: ['Giratina', 'Darkrai', 'Regigigas', 'Necrozma'],
        answerIndex: 0,
        explanation: 'Giratina inhabits the Distortion World where time does not flow and space is unstable, holding the world in equilibrium.'
      },
      {
        id: 'sinnoh_4',
        question: 'The Lake Guardians (Uxie, Mesprit, Azelf) bestowed which three divine attributes upon human minds?',
        options: ['Knowledge, Emotion, Willpower', 'Strength, Speed, Wisdom', 'Faith, Hope, Charity', 'Time, Space, Void'],
        answerIndex: 0,
        explanation: 'Uxie gave knowledge, Mesprit taught emotion, and Azelf birthed willpower in humanity.'
      },
      {
        id: 'sinnoh_5',
        question: 'According to Sinnoh temple lore, which colossus pulled continents across oceans using massive ropes?',
        options: ['Regigigas', 'Groudon', 'Palkia', 'Heatran'],
        answerIndex: 0,
        explanation: 'Regigigas created the golem trio from clay, ice, and magma and towed continents into position.'
      }
    ]
  },
  {
    region: 'Unova',
    themeTitle: 'Dragons of Truth, Ideals & Harmony',
    themeDescription: 'Unova mythology addresses philosophical duality: the split of the Original Dragon into Truth and Ideals.',
    badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-950/30',
    questions: [
      {
        id: 'unova_1',
        question: 'Unova legend speaks of a single Original Dragon that split into two deities representing which dual philosophy?',
        options: ['Truth and Ideals', 'Creation and Destruction', 'Light and Darkness', 'Order and Chaos'],
        answerIndex: 0,
        explanation: 'The Original Dragon split into Reshiram (Truth) and Zekrom (Ideals) when twin hero brothers disagreed on how to rule Unova.'
      },
      {
        id: 'unova_2',
        question: 'Which vast white dragon deity in Unova mythos aids those who pursue absolute Truth?',
        options: ['Reshiram', 'Zekrom', 'Kyurem', 'Victini'],
        answerIndex: 0,
        explanation: 'Reshiram scorches the world with fire to support those seeking a world of pure Truth.'
      },
      {
        id: 'unova_3',
        question: 'Kyurem represents the frozen empty shell left behind after the split. What is its elemental type pairing?',
        options: ['Dragon & Ice', 'Dragon & Fire', 'Dragon & Electric', 'Dragon & Dark'],
        answerIndex: 0,
        explanation: 'Kyurem is a Dragon/Ice type that awaits a hero to fuse with Reshiram or Zekrom and restore its power.'
      },
      {
        id: 'unova_4',
        question: 'Which quadrupedal knight trio (Cobalion, Terrakion, Virizion) fought humans to protect wild Pokémon habitats?',
        options: ['Swords of Justice', 'Ruinous Four', 'Forces of Nature', 'Lake Guardians'],
        answerIndex: 0,
        explanation: 'The Swords of Justice defended wild Pokémon during ancient fires ignited by human conflict.'
      },
      {
        id: 'unova_5',
        question: 'Which victory-bringing deity generates infinite energy inside its body, ensuring victory to its trainer?',
        options: ['Victini', 'Meloetta', 'Genesect', 'Keldeo'],
        answerIndex: 0,
        explanation: 'Victini shares unlimited energy with anyone who bonds with it, guaranteeing absolute triumph.'
      }
    ]
  },
  {
    region: 'Kalos',
    themeTitle: 'Order of Mortality, Life & Ultimate Weapon',
    themeDescription: 'Kalos history grapples with eternal life, annihilation, ecosystem order, and ancient king energy weapons.',
    badgeColor: 'border-pink-500/40 text-pink-400 bg-pink-950/30',
    questions: [
      {
        id: 'kalos_1',
        question: 'Which Kalos deity radiates life energy and sleeps in the form of a tree to bestow immortality?',
        options: ['Xerneas', 'Yveltal', 'Zygarde', 'Diancie'],
        answerIndex: 0,
        explanation: 'Xerneas shares eternal life when its horns glow with seven colors, entering a thousand-year slumber as a tree.'
      },
      {
        id: 'kalos_2',
        question: 'Which entity absorbs life energy from all living creatures when its life cycle terminates?',
        options: ['Yveltal', 'Darkrai', 'Giratina', 'Necrozma'],
        answerIndex: 0,
        explanation: 'Yveltal spreads its crimson wings to absorb the vitality of all living things before transforming into a cocoon.'
      },
      {
        id: 'kalos_3',
        question: 'Zygarde monitors ecological order. In what percentage forms does its cell assembly manifest?',
        options: ['10%, 50%, and Complete (100%)', '25% and 75%', '33% and 66%', '20% and 80%'],
        answerIndex: 0,
        explanation: 'Zygarde gathers its dispersed Cells into 10% Hound, 50% Snake, and 100% Complete Titan forms when the ecosystem is threatened.'
      },
      {
        id: 'kalos_4',
        question: 'What weapon built by King AZ 3,000 years ago utilized Pokémon life energy to grant immortality and end the war?',
        options: ['The Ultimate Weapon', 'The Terastal Orb', 'The Darkest Day Core', 'The Soul-Heart Cannon'],
        answerIndex: 0,
        explanation: 'The Ultimate Weapon was constructed by King AZ to revive his beloved Floette, sacrificing countless Pokémon lives.'
      },
      {
        id: 'kalos_5',
        question: 'Which mythical diamond princess Pokémon transformed from Carbink to compress compressed carbon into gems?',
        options: ['Diancie', 'Magearna', 'Hoopa', 'Volcanion'],
        answerIndex: 0,
        explanation: 'Diancie can instantly compress carbon in the air to create sparkling diamonds.'
      }
    ]
  },
  {
    region: 'Alola',
    themeTitle: 'Guardian Tapus, Light & Ultra Space',
    themeDescription: 'Alola lore emphasizes island guardian spirits, ultra wormholes, cosmic solar/lunar deities, and light energy stolen by Necrozma.',
    badgeColor: 'border-yellow-500/40 text-yellow-400 bg-yellow-950/30',
    questions: [
      {
        id: 'alola_1',
        question: 'What are the divine guardian deities protecting the four islands of Alola called?',
        options: ['The Tapus', 'The Lake Guardians', 'The Swords of Justice', 'The Ruinous Four'],
        answerIndex: 0,
        explanation: 'Tapu Koko, Tapu Lele, Tapu Bulu, and Tapu Fini serve as the revered divine guardians of Alola\'s islands.'
      },
      {
        id: 'alola_2',
        question: 'Solgaleo and Lunala are heralded in Alola mythology as the emissaries of which cosmic bodies?',
        options: ['Sun and Moon', 'Stars and Comets', 'Eclipse and Nebula', 'Void and Cosmos'],
        answerIndex: 0,
        explanation: 'Solgaleo is known as the Beast that Devours the Sun, while Lunala is the Beast that Calls the Moon.'
      },
      {
        id: 'alola_3',
        question: 'Which ancient crystal dragon lost its light in Ultra Megalopolis, becoming a shadow prism entity?',
        options: ['Necrozma', 'Eternatus', 'Kyurem', 'Rayquaza'],
        answerIndex: 0,
        explanation: 'Necrozma was once a radiant light source before losing its energy, seeking to absorb Solgaleo or Lunala to regain its true Ultra form.'
      },
      {
        id: 'alola_4',
        question: 'What synthetic artificial Beast Killer Pokémon was engineered by Aether Foundation using genetic cells from all types?',
        options: ['Type: Null', 'Mewtwo', 'Genesect', 'Silvally'],
        answerIndex: 0,
        explanation: 'Type: Null was constructed as Code: Beast Killer to combat invading Ultra Beasts.'
      },
      {
        id: 'alola_5',
        question: 'Which 500-year-old artificial mechanical Pokémon houses an artificial soul-heart constructed by a brilliant scientist?',
        options: ['Magearna', 'Melmetal', 'Genesect', 'Poipole'],
        answerIndex: 0,
        explanation: 'Magearna was constructed 500 years ago with a Soul-Heart created by gathering life force.'
      }
    ]
  },
  {
    region: 'Galar',
    themeTitle: 'The Darkest Day & Heroic Relics',
    themeDescription: 'Galar lore focuses on 3,000-year-old catastrophic Dynamax storms, Eternatus energy, and the Heroic Sword & Shield.',
    badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-950/30',
    questions: [
      {
        id: 'galar_1',
        question: 'Which ancient catastrophic storm event brought Dynamax energy to Galar 3,000 years ago?',
        options: ['The Darkest Day', 'The Ultimate Weapon', 'The Primal Surge', 'The Great Cataclysm'],
        answerIndex: 0,
        explanation: 'The Darkest Day was caused when Eternatus attempted to absorb Galar\'s energy, making Pokémon gigantean and wild.'
      },
      {
        id: 'galar_2',
        question: 'Zacian and Zamazenta saved Galar during the Darkest Day using which iconic relics?',
        options: ['Rusted Sword and Rusted Shield', 'Crown and Lance', 'Bow and Arrow', 'Orb and Scepter'],
        answerIndex: 0,
        explanation: 'Equipped with the Rusted Sword and Rusted Shield, Zacian and Zamazenta sealed Eternatus away.'
      },
      {
        id: 'galar_3',
        question: 'Which alien dragon core is the true source of all Wishing Stars and Dynamax energy in Galar?',
        options: ['Eternatus', 'Rayquaza', 'Regidrago', 'Urshifu'],
        answerIndex: 0,
        explanation: 'Eternatus arrived in a meteor 20,000 years ago; its leaking energy powers Galar\'s Dynamax Power Spots.'
      },
      {
        id: 'galar_4',
        question: 'Which ancient King of Bountiful Harvests rode Glastrier or Spectrier to heal Galar\'s blighted crops?',
        options: ['Calyrex', 'Zarude', 'Urshifu', 'Regieleki'],
        answerIndex: 0,
        explanation: 'Calyrex ruled Galar in ancient times, bringing prosperity and healing frozen lands.'
      },
      {
        id: 'galar_5',
        question: 'Regieleki and Regidrago were created by Regigigas using which concentrated elemental materials?',
        options: ['Pure Electrical Energy & Dragon Crystal Energy', 'Solar Ray & Void Energy', 'Magma & Ice', 'Steel & Rock'],
        answerIndex: 0,
        explanation: 'Regieleki was constructed from electrical energy, while Regidrago was formed from crystallized dragon energy.'
      }
    ]
  },
  {
    region: 'Paldea',
    themeTitle: 'Area Zero Terastal Matrix & Ruin Treasures',
    themeDescription: 'Paldea lore centers on the Great Crater crystal anomaly, Terapagos matrix energy, and cursed treasures born from ancient greed.',
    badgeColor: 'border-orange-500/40 text-orange-400 bg-orange-950/30',
    questions: [
      {
        id: 'paldea_1',
        question: 'What mysterious crystalline phenomenon in Paldea alters a Pokémon\'s typing and bestows a glowing gem crown?',
        options: ['Terastallization', 'Mega Evolution', 'Z-Power', 'Gigantamax'],
        answerIndex: 0,
        explanation: 'Terastallization crystallizes a Pokémon, altering its offensive/defensive type matching based on its Tera Type.'
      },
      {
        id: 'paldea_2',
        question: 'The Treasures of Ruin (Wo-Chien, Chien-Pao, Ting-Lu, Chi-Yu) were born from ancient artifacts corrupted by what emotion?',
        options: ['Human Greed & Hatred', 'Envy & Jealousy', 'Fear & Despair', 'Arrogance'],
        answerIndex: 0,
        explanation: 'Ancient vessels, tablets, beads, and swords bought by a Paldean king were corrupted by malice and greed, coming to life as destructive ruins.'
      },
      {
        id: 'paldea_3',
        question: 'Which legendary indigo turtle sleeping at the bottom of the Underdepths is the origin of Terastal energy?',
        options: ['Terapagos', 'Koraidon', 'Miraidon', 'Ogerpon'],
        answerIndex: 0,
        explanation: 'Terapagos produces the Terastal energy matrix that fuels the crystal ecosystem throughout Paldea and Area Zero.'
      },
      {
        id: 'paldea_4',
        question: 'Which ancient/future paradox entities were brought to Area Zero using Professor Sada/Turo\'s Time Machine?',
        options: ['Koraidon/Miraidon & Paradox Species', 'Ultra Beasts', 'Ruin Treasures', 'Genesect Squad'],
        answerIndex: 0,
        explanation: 'Paradox Pokémon like Great Tusk and Iron Treads were pulled from ancient past or distant future timelines.'
      },
      {
        id: 'paldea_5',
        question: 'Which lone ogre Pokémon in Kitakami wears four distinct elemental masks carved by an ancient craftsman?',
        options: ['Ogerpon', 'Pecharunt', 'Okidogi', 'Terapagos'],
        answerIndex: 0,
        explanation: 'Ogerpon changes its Tera type and form when holding the Teal, Wellspring, Hearthflame, or Cornerstone Masks.'
      }
    ]
  }
];

const stripHtmlTags = (str: string) => {
  if (!str) return '';
  return str.replace(/<\/?p[^>]*>/gi, '').replace(/<[^>]+>/g, '').trim();
};

function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export const PokethologyQuizWidget: React.FC = memo(() => {
  const [activeRegionIndex, setActiveRegionIndex] = useState<number>(0);
  const [userAnswersMap, setUserAnswersMap] = useState<Record<string, number>>({});
  const [selectedOptionMap, setSelectedOptionMap] = useState<Record<string, number>>({});
  const [lockedMap, setLockedMap] = useState<Record<string, boolean>>({});
  const [customSeed, setCustomSeed] = useState<number>(() => {
    return parseInt(localStorage.getItem('pokethology_exam_custom_seed') || '0', 10);
  });

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const formattedToday = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  // Dynamically calculate today's selected 3 theological exam questions per region
  const allExams = useMemo(() => {
    const baseHash = hashCode(`${todayStr}_v2_seed_${customSeed}`);
    
    return REGION_LORE_DATABASE.map((regionData, rIdx) => {
      const pool = [...regionData.questions];
      const count = 3;
      const picked: RegionQuestion[] = [];
      
      for (let i = 0; i < count && pool.length > 0; i++) {
        const rand = seededRandom(baseHash + rIdx * 100 + i);
        const idx = Math.floor(rand * pool.length);
        const item = pool.splice(idx, 1)[0];
        
        // Shuffle option order deterministically for today
        const correctAnswerText = item.options[item.answerIndex];
        const shuffledOpts = [...item.options];
        for (let j = shuffledOpts.length - 1; j > 0; j--) {
          const r2 = seededRandom(baseHash + rIdx * 50 + j * 7 + i);
          const swapIdx = Math.floor(r2 * (j + 1));
          [shuffledOpts[j], shuffledOpts[swapIdx]] = [shuffledOpts[swapIdx], shuffledOpts[j]];
        }
        const newAnswerIndex = shuffledOpts.indexOf(correctAnswerText);
        
        picked.push({
          ...item,
          id: `${item.id}_${todayStr}_s${customSeed}`,
          options: shuffledOpts,
          answerIndex: newAnswerIndex
        });
      }

      return {
        ...regionData,
        questions: picked
      };
    });
  }, [todayStr, customSeed]);

  // Load state from localStorage on mount (scoped by daily date string so it automatically refreshes each day)
  useEffect(() => {
    const dailyAnswerKey = `pokethology_exam_answers_v2_${todayStr}`;
    const dailyLockKey = `pokethology_exam_locked_v2_${todayStr}`;
    const savedAnswers = localStorage.getItem(dailyAnswerKey) || localStorage.getItem('pokethology_exam_answers_v2');
    const savedLocked = localStorage.getItem(dailyLockKey) || localStorage.getItem('pokethology_exam_locked_v2');
    if (savedAnswers) {
      try {
        setUserAnswersMap(JSON.parse(savedAnswers));
      } catch (e) {}
    }
    if (savedLocked) {
      try {
        setLockedMap(JSON.parse(savedLocked));
      } catch (e) {}
    }
  }, [todayStr]);

  // Save progress to localStorage scoped by today's date
  useEffect(() => {
    if (todayStr) {
      localStorage.setItem(`pokethology_exam_answers_v2_${todayStr}`, JSON.stringify(userAnswersMap));
      localStorage.setItem(`pokethology_exam_locked_v2_${todayStr}`, JSON.stringify(lockedMap));
      // Also write to generic key for backward compatibility
      localStorage.setItem('pokethology_exam_answers_v2', JSON.stringify(userAnswersMap));
      localStorage.setItem('pokethology_exam_locked_v2', JSON.stringify(lockedMap));
    }
  }, [userAnswersMap, lockedMap, todayStr]);

  const handleRerollDailyExam = () => {
    const nextSeed = customSeed + 1;
    setCustomSeed(nextSeed);
    localStorage.setItem('pokethology_exam_custom_seed', String(nextSeed));
    setUserAnswersMap({});
    setSelectedOptionMap({});
    setLockedMap({});
    try { sounds.scan(); } catch (_) {}
  };

  const currentRegionData = allExams[activeRegionIndex] || allExams[0];

  // Calculate totals across ALL 9 regions
  const totalQuestionsCount = useMemo(() => {
    return allExams.reduce((sum, r) => sum + r.questions.length, 0);
  }, []);

  const answeredQuestionsCount = useMemo(() => {
    return Object.keys(lockedMap).filter(k => lockedMap[k]).length;
  }, [lockedMap]);

  const correctAnswersCount = useMemo(() => {
    let count = 0;
    allExams.forEach(r => {
      r.questions.forEach(q => {
        if (lockedMap[q.id] && userAnswersMap[q.id] === q.answerIndex) {
          count++;
        }
      });
    });
    return count;
  }, [lockedMap, userAnswersMap]);

  const overallPercent = Math.round((answeredQuestionsCount / totalQuestionsCount) * 100) || 0;

  const getAcademicRank = (correct: number, total: number) => {
    if (correct === total) return { title: 'Arch-Theologian Deity', color: 'text-amber-400 font-black' };
    if (correct >= 20) return { title: 'Master Lore Scholar', color: 'text-cyan-400 font-extrabold' };
    if (correct >= 12) return { title: 'Regional Mythologist', color: 'text-emerald-400 font-bold' };
    if (correct >= 5) return { title: 'Acolyte Pilgrim', color: 'text-purple-400 font-bold' };
    return { title: 'Novice Student', color: 'text-slate-400 font-semibold' };
  };

  const currentRank = getAcademicRank(correctAnswersCount, totalQuestionsCount);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (lockedMap[questionId]) return;
    setSelectedOptionMap(prev => ({ ...prev, [questionId]: optionIdx }));
    try { sounds.typing(); } catch (_) {}
  };

  const handleLockInAnswer = (question: RegionQuestion) => {
    const selected = selectedOptionMap[question.id];
    if (selected === undefined || lockedMap[question.id]) return;

    setLockedMap(prev => ({ ...prev, [question.id]: true }));
    setUserAnswersMap(prev => ({ ...prev, [question.id]: selected }));

    const isCorrect = selected === question.answerIndex;
    if (isCorrect) {
      try { sounds.success(); } catch (_) {}
    } else {
      try { sounds.error(); } catch (_) {}
    }
  };

  const handleResetExam = () => {
    if (window.confirm('Reset all academic exam progress across all regions for today?')) {
      setUserAnswersMap({});
      setSelectedOptionMap({});
      setLockedMap({});
      if (todayStr) {
        localStorage.removeItem(`pokethology_exam_answers_v2_${todayStr}`);
        localStorage.removeItem(`pokethology_exam_locked_v2_${todayStr}`);
      }
      localStorage.removeItem('pokethology_exam_answers_v2');
      localStorage.removeItem('pokethology_exam_locked_v2');
      try { sounds.scan(); } catch (_) {}
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 text-left font-sans">
      {/* DAILY REFRESH STATUS BANNER */}
      <div className="bg-slate-900/60 border border-cyan-500/20 rounded-xl p-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="text-[10px] font-mono font-bold text-cyan-300 tracking-wider uppercase">
            {formattedToday.toUpperCase()}
          </span>
        </div>
        <button
          type="button"
          onClick={handleRerollDailyExam}
          className="flex items-center gap-1 text-[9.5px] font-mono font-bold text-amber-300 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 px-2.5 py-1 rounded-md transition-all cursor-pointer shadow-md active:scale-95"
          title="Generate a fresh set of questions"
        >
          <RotateCcw className="w-3 h-3 text-amber-400 shrink-0" />
          <span>NEW EXAM SET</span>
        </button>
      </div>

      {/* PERSISTENT ACADEMIC PROGRESS BAR */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-3.5 sm:p-4 shadow-lg relative overflow-hidden">
        <HUDCorners />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-hud font-black text-amber-400 tracking-wider uppercase">
                GLOBAL ACADEMIC PROGRESS
              </span>
              <span className={cn('text-xs font-hud uppercase tracking-widest', currentRank.color)}>
                {currentRank.title}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">
              {correctAnswersCount} / {answeredQuestionsCount} CORRECT ({answeredQuestionsCount}/{totalQuestionsCount} ANSWERED)
            </span>
            <button
              onClick={handleResetExam}
              className="p-1.5 rounded bg-slate-950 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/30 transition-all text-[9px] font-mono flex items-center gap-1"
              title="Reset Exam Progress"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Glowing Progress Track */}
        <div className="w-full h-2.5 bg-slate-950 rounded-full border border-slate-800 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </div>

      {/* REGION SELECTION TABS */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1.5 shrink-0">
        {allExams.map((rData, idx) => {
          const regionQuestions = rData.questions;
          const answeredInRegion = regionQuestions.filter(q => lockedMap[q.id]).length;
          const isComplete = answeredInRegion === regionQuestions.length;
          const isActive = idx === activeRegionIndex;

          return (
            <button
              key={`${rData.region}-${idx}`}
              onClick={() => {
                setActiveRegionIndex(idx);
                try { sounds.scan(); } catch (_) {}
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg font-hud text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider transition-all duration-200 shrink-0 flex items-center gap-1.5 border cursor-pointer select-none',
                isActive
                  ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 hover:bg-slate-900'
              )}
            >
              <span>{rData.region}</span>
              {isComplete ? (
                <CheckCircle2 className={cn('w-3 h-3', isActive ? 'text-slate-950' : 'text-emerald-400')} />
              ) : (
                <span className={cn('text-[8px] font-mono font-bold px-1 rounded', isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-950 text-cyan-400')}>
                  {answeredInRegion}/3
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ACTIVE REGION HEADER BANNER */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col gap-1.5 text-left relative overflow-hidden">
        <HUDCorners />
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
          <h3 className="text-sm sm:text-base font-hud font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            {currentRegionData.region} Lore: {currentRegionData.themeTitle}
          </h3>
          <span className={cn('px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider border', currentRegionData.badgeColor)}>
            THEMATIC EVALUATION
          </span>
        </div>
        <div className="text-xs text-slate-300 font-sans leading-relaxed">
          {stripHtmlTags(currentRegionData.themeDescription)}
        </div>
      </div>

      {/* REGION QUESTIONS LIST */}
      <div className="flex flex-col gap-4">
        {currentRegionData.questions.map((q, qIndex) => {
          const isLocked = !!lockedMap[q.id];
          const selectedOption = selectedOptionMap[q.id] ?? userAnswersMap[q.id];
          const isCorrect = isLocked && userAnswersMap[q.id] === q.answerIndex;

          return (
            <div
              key={`q-${q.id || qIndex}-${qIndex}`}
              className={cn(
                'bg-slate-900/60 border rounded-xl p-4 flex flex-col gap-3 relative transition-all text-left shadow-md',
                isLocked
                  ? isCorrect
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-rose-500/40 bg-rose-950/10'
                  : 'border-slate-800/80 hover:border-slate-700'
              )}
            >
              <HUDCorners />

              {/* Question header */}
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  QUESTION {qIndex + 1} OF {currentRegionData.questions.length}
                </span>
                {isLocked && (
                  <span
                    className={cn(
                      'text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded border flex items-center gap-1',
                      isCorrect
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                    )}
                  >
                    {isCorrect ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> CORRECT ACCREDITED
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-rose-400" /> INCORRECT ENTRY
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Question Text */}
              <div className="text-xs sm:text-sm font-hud font-bold text-slate-100 leading-snug">
                {stripHtmlTags(q.question)}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  let optStyle = 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-900';

                  if (isLocked) {
                    if (optIdx === q.answerIndex) {
                      optStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 line-through';
                    } else {
                      optStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    optStyle = 'bg-cyan-950/80 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_10px_rgba(6,182,212,0.25)]';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isLocked}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={cn(
                        'p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between gap-2 cursor-pointer',
                        optStyle
                      )}
                    >
                      <span className="break-words font-medium">{stripHtmlTags(opt)}</span>
                      {isLocked && optIdx === q.answerIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action / Explanation */}
              {!isLocked ? (
                <div className="flex justify-end mt-1">
                  <button
                    disabled={selectedOption === undefined}
                    onClick={() => handleLockInAnswer(q)}
                    className={cn(
                      hudButtonClass(false, 'cyan'),
                      'px-4 py-2 !text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5',
                      selectedOption === undefined ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-102'
                    )}
                  >
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    LOCK IN ANSWER
                  </button>
                </div>
              ) : (
                <div className="mt-2 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                  <strong className="text-cyan-400 font-hud block mb-1 uppercase tracking-wider text-[9px]">
                    ACADEMIC EXPLANATION & ARCHIVAL LORE
                  </strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

PokethologyQuizWidget.displayName = 'PokethologyQuizWidget';
