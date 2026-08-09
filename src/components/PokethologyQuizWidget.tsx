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
  GraduationCap,
  Dna,
  Flame,
  Globe,
  Scale,
  Heart,
  Sun,
  Zap,
  Gem,
  Compass
} from 'lucide-react';

const REGION_ICONS: Record<string, React.ElementType> = {
  Kanto: Dna,
  Johto: Flame,
  Hoenn: Globe,
  Sinnoh: Compass,
  Unova: Scale,
  Kalos: Heart,
  Alola: Sun,
  Galar: Zap,
  Paldea: Gem,
};

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
    region: "Kanto",
    themeTitle: "Genetic Creation & Artificial Deities",
    themeDescription: "Kanto lore centers on scientific hubris, genetic splicing of ancestral DNA, and virtual entity synthesis.",
    badgeColor: "border-red-500/40 text-red-400 bg-red-950/30",
    questions: [
      {
        id: "kanto_1",
        question: "Which legendary Pokémon was created artificially through genetic manipulation of ancient Mew DNA?",
        options: ["Mewtwo", "Genesect", "Porygon-Z", "Mew"],
        answerIndex: 0,
        explanation: "Mewtwo was created by genetic engineering in the Cinnabar Island Mansion based on Mew's genetic material."
      },
      {
        id: "kanto_2",
        question: "According to Silph Co. records, which Pokémon was completely synthesized from virtual computer code?",
        options: ["Rotom", "Castform", "Porygon", "Magnemite"],
        answerIndex: 2,
        explanation: "Porygon was developed by Silph Co. using advanced programming technology, making it the first man-made code Pokémon."
      },
      {
        id: "kanto_3",
        question: "In Kanto mythos, which ancestor Pokémon possesses the genetic code of all Pokémon species?",
        options: ["Ditto", "Mew", "Bulbasaur", "Arceus"],
        answerIndex: 1,
        explanation: "Mew is believed to hold the genetic blueprint of all Pokémon species, enabling it to learn almost every move."
      },
      {
        id: "kanto_4",
        question: "According to the Shamouti prophecy, which three legendary birds govern elemental climate equilibrium?",
        options: ["Articuno, Zapdos, Moltres", "Raikou, Entei, Suicune", "Tornadus, Thundurus, Landorus", "Regirock, Regice, Registeel"],
        answerIndex: 0,
        explanation: "Articuno, Zapdos, and Moltres maintain ice, lightning, and fire climate balances in elemental mythos."
      },
      {
        id: "kanto_5",
        question: "Which fossil Pokémon species was resurrected from ancient shell armor discovered in Mt. Moon?",
        options: ["Omanyte & Kabuto", "Lileep & Anorith", "Cranidos & Shieldon", "Tyrunt & Amaura"],
        answerIndex: 0,
        explanation: "Omanyte and Kabuto fossils were recovered from ancient primeval seabeds in Kanto."
      },
      {
        id: "kanto_6",
        question: "What traumatic event led to the destruction and permanent abandonment of the Cinnabar Mansion lab?",
        options: ["Mewtwo's uncontrollable genetic outburst", "A volcanic eruption from Mt. Cinnabar", "Team Rocket's arson raid", "An electrical overload from Porygon"],
        answerIndex: 0,
        explanation: "Mewtwo grew far too powerful for the scientists to contain, destroying the Mansion laboratory before escaping to Cerulean Cave."
      },
      {
        id: "kanto_7",
        question: "Which unquiet spirit haunted the Pokémon Tower in Lavender Town until laid to rest with a Silph Scope?",
        options: ["Ghost of Marowak", "Haunter of Cinnabar", "Spiritomb Core", "Gengar of Vermilion"],
        answerIndex: 0,
        explanation: "The ghost of a mother Marowak slain by Team Rocket haunted the upper floor of Lavender Town's Pokémon Tower."
      },
      {
        id: "kanto_8",
        question: "According to Kanto folklore, which sleeping giant blocks narrow roads and requires a Poké Flute to awaken?",
        options: ["Snorlax", "Slaking", "Regigigas", "Torterra"],
        answerIndex: 0,
        explanation: "Snorlax frequently falls asleep on vital thoroughfares like Route 12 and Route 16, requiring the soothing notes of a Poké Flute."
      },
      {
        id: "kanto_9",
        question: "Which electric species is said to nest near regional power plants and absorb high-voltage currents during electrical storms?",
        options: ["Electabuzz & Zapdos", "Raichu & Jolteon", "Magneton & Electrode", "Voltorb & Luxray"],
        answerIndex: 0,
        explanation: "Electabuzz and Zapdos thrive on high-voltage currents around Kanto's abandoned Power Plant."
      },
      {
        id: "kanto_10",
        question: "What unique radiation stone forces Eevee's unstable genetic structure to mutate into Vaporeon?",
        options: ["Water Stone", "Thunder Stone", "Fire Stone", "Moon Stone"],
        answerIndex: 0,
        explanation: "Exposure to the radiation of a Water Stone triggers Eevee's cellular composition to restructure into the aquatic Vaporeon."
      }
    ]
  },
  {
    region: "Johto",
    themeTitle: "Tower Resurrection & Elemental Mythos",
    themeDescription: "Johto lore focuses on ancient traditions, sacred towers, elemental beasts, and spiritual resurrection.",
    badgeColor: "border-amber-500/40 text-amber-400 bg-amber-950/30",
    questions: [
      {
        id: "johto_1",
        question: "Which sacred rainbow deity resurrected the three legendary beasts when the Brass Tower burned down?",
        options: ["Lugia", "Ho-Oh", "Suicune", "Celebi"],
        answerIndex: 1,
        explanation: "Ho-Oh bestowed new life upon the three nameless Pokémon that perished in the Brass Tower flames, creating Raikou, Entei, and Suicune."
      },
      {
        id: "johto_2",
        question: "Which dragon deity governs the oceanic depths and calms violent tempests in Whirl Islands legend?",
        options: ["Lugia", "Kyogre", "Gyarados", "Suicune"],
        answerIndex: 0,
        explanation: "Lugia resides at the bottom of the ocean trench near Whirl Islands, possessing wings powerful enough to create 40-day storms."
      },
      {
        id: "johto_3",
        question: "The legendary beast Suicune is revered in Johto lore as the physical embodiment of which natural force?",
        options: ["Volcanic Magma", "North Wind & Pure Water", "Storm Cloud Thunderbolts", "Spring Growth"],
        answerIndex: 1,
        explanation: "Suicune embodies the compassion of the North Wind, purifying murky waters wherever it treads."
      },
      {
        id: "johto_4",
        question: "Which time-traveling mythical guardian protects the sacred shrine in Ilex Forest?",
        options: ["Celebi", "Jirachi", "Victini", "Mew"],
        answerIndex: 0,
        explanation: "Celebi travels through time as the Voice of the Forest, bringing lush green vegetation wherever it appears."
      },
      {
        id: "johto_5",
        question: "What mysterious alphabetic psychic entities inhabit the Ruins of Alph, shaping reality through collective thoughts?",
        options: ["Unown", "Sigilyph", "Bronzor", "Solrock"],
        answerIndex: 0,
        explanation: "Unown exist as ancient letter glyphs that distort reality when gathered in high numbers."
      },
      {
        id: "johto_6",
        question: "What was the original historical name of Ecruteak City's Bell Tower before its neighbor was destroyed by fire?",
        options: ["Tin Tower", "Brass Tower", "Sprout Tower", "Burned Tower"],
        answerIndex: 0,
        explanation: "The Bell Tower was historically known as the Tin Tower, built as a roosting perch for Ho-Oh opposite the Brass Tower."
      },
      {
        id: "johto_7",
        question: "According to Lake of Rage research, what caused the wild Gyarados species to turn vibrant red?",
        options: ["Forced evolution induced by Team Rocket's radio waves", "Volcanic ash contamination from Mt. Silver", "Exposure to a Red Chain fragment", "A genetic mutation from Magikarp overpopulation"],
        answerIndex: 0,
        explanation: "Team Rocket's experimental broadcast forced Magikarp at the Lake of Rage to evolve prematurely, retaining Magikarp's red coloration."
      },
      {
        id: "johto_8",
        question: "Which dark armored dragon species can crumble entire mountains to construct its territory according to Mt. Silver lore?",
        options: ["Tyranitar", "Dragonite", "Aggron", "Garchomp"],
        answerIndex: 0,
        explanation: "Tyranitar is so insolently strong that it can alter maps by collapsing mountains and filling in rivers."
      },
      {
        id: "johto_9",
        question: "Which steel-clad mantis Pokémon evolves from Scyther when traded while holding a heavy Metal Coat?",
        options: ["Scizor", "Steelix", "Skarmory", "Forretress"],
        answerIndex: 0,
        explanation: "Trading Scyther with a Metal Coat fuses metallic strength into its exoskeleton, evolving it into Scizor."
      },
      {
        id: "johto_10",
        question: "Which legendary beast embodies the lightning bolt that struck the Brass Tower during its tragic burning?",
        options: ["Raikou", "Entei", "Suicune", "Zapdos"],
        answerIndex: 0,
        explanation: "Raikou embodies the lightning bolt that struck the tower, roaring like thunder as it runs across the land."
      }
    ]
  },
  {
    region: "Hoenn",
    themeTitle: "Primal Weather Trio & Continental Expansion",
    themeDescription: "Hoenn mythology revolves around super-ancient primal forces shaping landmasses, abyssal oceans, and ozone equilibrium.",
    badgeColor: "border-emerald-500/40 text-emerald-400 bg-emerald-950/30",
    questions: [
      {
        id: "hoenn_1",
        question: "Which super-ancient deity expanded the landmasses during its primordial clash with Kyogre?",
        options: ["Regigigas", "Groudon", "Rayquaza", "Heatran"],
        answerIndex: 1,
        explanation: "Groudon evaporated oceans with intense sunlight to expand the continents during the ancient primal era."
      },
      {
        id: "hoenn_2",
        question: "According to Hoenn legend, which sky dragon descended from the ozone layer to quell Groudon and Kyogre?",
        options: ["Rayquaza", "Deoxys", "Latios", "Giratina"],
        answerIndex: 0,
        explanation: "Rayquaza ended the destructive primal battle between Groudon and Kyogre, returning peace to the Hoenn atmosphere."
      },
      {
        id: "hoenn_3",
        question: "What divine energy process allows Kyogre and Groudon to reclaim their original ancient power?",
        options: ["Primal Reversion", "Mega Evolution", "Dynamax", "Terastallization"],
        answerIndex: 0,
        explanation: "Primal Reversion allows Groudon and Kyogre to absorb natural energy and reclaim their ancient primal forms."
      },
      {
        id: "hoenn_4",
        question: "Which alien DNA virus mutated in the ozone layer after exposed to laser rays, creating an alien mythical titan?",
        options: ["Deoxys", "Rayquaza", "Eternatus", "Necrozma"],
        answerIndex: 0,
        explanation: "Deoxys mutated from an extraterrestrial virus aboard a meteor that entered Earth's upper atmosphere."
      },
      {
        id: "hoenn_5",
        question: "Which wish-granting Pokémon awakens from a thousand-year slumber when the Millennium Comet shines?",
        options: ["Jirachi", "Celebi", "Victini", "Shaymin"],
        answerIndex: 0,
        explanation: "Jirachi awakens for seven days every millennium to grant heartfelt wishes written on its paper tags."
      },
      {
        id: "hoenn_6",
        question: "According to Mt. Chimney research, which lava-dwelling legendary causes volcanic eruptions when its magma blood boils?",
        options: ["Heatran", "Magcargo", "Camerupt", "Groudon"],
        answerIndex: 0,
        explanation: "Heatran's body is composed of molten magma; when its core heat surges, volcanic peaks erupt."
      },
      {
        id: "hoenn_7",
        question: "What trio of ancient element titans were sealed away in Hoenn's Desert, Island, and Ancient Tomb chambers?",
        options: ["Regirock, Regice, and Registeel", "Raikou, Entei, and Suicune", "Cobalion, Terrakion, and Virizion", "Uknown Trio"],
        answerIndex: 0,
        explanation: "Ancient humans sealed Regirock, Regice, and Registeel in locked stone chambers out of fear of their power."
      },
      {
        id: "hoenn_8",
        question: "Which dragon species can bend light around its downy feathers to become completely invisible to human eyes?",
        options: ["Latios & Latias", "Flygon & Altaria", "Rayquaza & Salamence", "Dragonite & Druddigon"],
        answerIndex: 0,
        explanation: "Latios and Latias refract light using glass-like feathers to cloak themselves or project human illusions."
      },
      {
        id: "hoenn_9",
        question: "Which intense weather state is summoned when Kyogre undergoes Primal Reversion in battle?",
        options: ["Primordial Sea (Torrential Rain)", "Desolate Land (Harsh Sunlight)", "Delta Stream (Mystic Wind)", "Sandstorm"],
        answerIndex: 0,
        explanation: "Primal Kyogre triggers Primordial Sea, causing downpours that completely evaporate Fire-type attacks."
      },
      {
        id: "hoenn_10",
        question: "Which intense weather state is summoned when Groudon undergoes Primal Reversion in battle?",
        options: ["Desolate Land (Harsh Sunlight)", "Primordial Sea (Torrential Rain)", "Delta Stream (Mystic Wind)", "Hailstorm"],
        answerIndex: 0,
        explanation: "Primal Groudon triggers Desolate Land, emitting extreme heat that instantly evaporates Water-type attacks."
      }
    ]
  },
  {
    region: "Sinnoh",
    themeTitle: "Cosmological Creation & Void Dimensions",
    themeDescription: "Sinnoh theology explores universal origin, time, space, emotion, and the primordial void egg.",
    badgeColor: "border-cyan-500/40 text-cyan-400 bg-cyan-950/30",
    questions: [
      {
        id: "sinnoh_1",
        question: "Which supreme deity emerged from an egg in the void of chaos to shape the universe and creation trio?",
        options: ["Arceus", "Dialga", "Palkia", "Giratina"],
        answerIndex: 0,
        explanation: "Arceus is known in Sinnoh lore as the Original One, born from an egg in the void before the universe existed."
      },
      {
        id: "sinnoh_2",
        question: "In Sinnoh creation theology, Dialga and Palkia govern which fundamental dimensions of reality?",
        options: ["Time and Space", "Light and Darkness", "Life and Death", "Past and Future"],
        answerIndex: 0,
        explanation: "Dialga's heartbeat maintains the flow of Time, while Palkia's breath stabilizes the structure of Space."
      },
      {
        id: "sinnoh_3",
        question: "Which deity was banished to the Distortion World due to its volatile nature, balancing reality from the reverse side?",
        options: ["Giratina", "Darkrai", "Regigigas", "Necrozma"],
        answerIndex: 0,
        explanation: "Giratina inhabits the Distortion World where time does not flow and space is unstable, holding the world in equilibrium."
      },
      {
        id: "sinnoh_4",
        question: "The Lake Guardians (Uxie, Mesprit, Azelf) bestowed which three divine attributes upon human minds?",
        options: ["Knowledge, Emotion, Willpower", "Strength, Speed, Wisdom", "Faith, Hope, Charity", "Time, Space, Void"],
        answerIndex: 0,
        explanation: "Uxie gave knowledge, Mesprit taught emotion, and Azelf birthed willpower in humanity."
      },
      {
        id: "sinnoh_5",
        question: "According to Sinnoh temple lore, which colossus pulled continents across oceans using massive ropes?",
        options: ["Regigigas", "Groudon", "Palkia", "Heatran"],
        answerIndex: 0,
        explanation: "Regigigas created the golem trio from clay, ice, and magma and towed continents into position."
      },
      {
        id: "sinnoh_6",
        question: "At Spear Pillar, which mythical items allow Arceus to alter its body color and elemental typing at will?",
        options: ["Elemental Plates", "Z-Crystals", "Terastal Shards", "Mega Stones"],
        answerIndex: 0,
        explanation: "Arceus carries 18 elemental Plates crafted during universe creation, changing its type when holding any Plate."
      },
      {
        id: "sinnoh_7",
        question: "Which dark entity causes inescapable nightmare slumbers to anyone near Newmoon Island or Canalave City?",
        options: ["Darkrai", "Giratina", "Spiritomb", "Yveltal"],
        answerIndex: 0,
        explanation: "Darkrai induces terrifying nightmares as a defense mechanism, keeping people away from its isolated domain."
      },
      {
        id: "sinnoh_8",
        question: "Which gentle lunar deity creates Lunar Feathers that dispel Darkrai's nightmare slumbers?",
        options: ["Cresselia", "Lunala", "Jirachi", "Meloetta"],
        answerIndex: 0,
        explanation: "Cresselia resides on Fullmoon Island, shedding glowing feathers that bring serene dreams and cure Darkrai nightmares."
      },
      {
        id: "sinnoh_9",
        question: "What is the name of the alternate dimension governed by Giratina where matter and gravity behave erratically?",
        options: ["Distortion World", "Ultra Space", "Underdepths", "Null Zone"],
        answerIndex: 0,
        explanation: "The Distortion World (or Reverse World) is a realm where Giratina maintains the physical balance of the real world."
      },
      {
        id: "sinnoh_10",
        question: "Which gratitude Pokémon absorbs airborne pollutants in its Gratitude Form and purifies blighted landscapes?",
        options: ["Shaymin", "Celebi", "Phione", "Manaphy"],
        answerIndex: 0,
        explanation: "Shaymin uses Seed Flare to dissolve toxic atmospheric gases, converting wasteland deserts into blooming flower gardens."
      }
    ]
  },
  {
    region: "Unova",
    themeTitle: "Dragons of Truth, Ideals & Harmony",
    themeDescription: "Unova mythology addresses philosophical duality: the split of the Original Dragon into Truth and Ideals.",
    badgeColor: "border-purple-500/40 text-purple-400 bg-purple-950/30",
    questions: [
      {
        id: "unova_1",
        question: "Unova legend speaks of a single Original Dragon that split into two deities representing which dual philosophy?",
        options: ["Truth and Ideals", "Creation and Destruction", "Light and Darkness", "Order and Chaos"],
        answerIndex: 0,
        explanation: "The Original Dragon split into Reshiram (Truth) and Zekrom (Ideals) when twin hero brothers disagreed on how to rule Unova."
      },
      {
        id: "unova_2",
        question: "Which vast white dragon deity in Unova mythos aids those who pursue absolute Truth?",
        options: ["Reshiram", "Zekrom", "Kyurem", "Victini"],
        answerIndex: 0,
        explanation: "Reshiram scorches the world with fire to support those seeking a world of pure Truth."
      },
      {
        id: "unova_3",
        question: "Kyurem represents the frozen empty shell left behind after the split. What is its elemental type pairing?",
        options: ["Dragon & Ice", "Dragon & Fire", "Dragon & Electric", "Dragon & Dark"],
        answerIndex: 0,
        explanation: "Kyurem is a Dragon/Ice type that awaits a hero to fuse with Reshiram or Zekrom and restore its power."
      },
      {
        id: "unova_4",
        question: "Which quadrupedal knight trio (Cobalion, Terrakion, Virizion) fought humans to protect wild Pokémon habitats?",
        options: ["Swords of Justice", "Ruinous Four", "Forces of Nature", "Lake Guardians"],
        answerIndex: 0,
        explanation: "The Swords of Justice defended wild Pokémon during ancient fires ignited by human conflict."
      },
      {
        id: "unova_5",
        question: "Which victory-bringing deity generates infinite energy inside its body, ensuring victory to its trainer?",
        options: ["Victini", "Meloetta", "Genesect", "Keldeo"],
        answerIndex: 0,
        explanation: "Victini shares unlimited energy with anyone who bonds with it, guaranteeing absolute triumph."
      },
      {
        id: "unova_6",
        question: "What ancient relic artifact enables Kyurem to absorb Reshiram or Zekrom into White or Black Kyurem?",
        options: ["DNA Splicers", "Dragon Skull", "Light Stone", "Dark Stone"],
        answerIndex: 0,
        explanation: "The DNA Splicers allow Kyurem to re-absorb Reshiram or Zekrom, merging their dragon cores into a single entity."
      },
      {
        id: "unova_7",
        question: "Which brutal three-headed dragon species rules the highest peaks of Unova's Victory Road?",
        options: ["Hydreigon", "Druddigon", "Haxorus", "Flygon"],
        answerIndex: 0,
        explanation: "Hydreigon is notoriously aggressive, using its three heads to attack anything that moves in its territory."
      },
      {
        id: "unova_8",
        question: "Where in Unova was the giant spiral tower constructed as a sacred resting sanctuary for the Original Dragon?",
        options: ["Icirrus City (Dragonspiral Tower)", "Castelia City", "Nimbasa City", "Opelucid City"],
        answerIndex: 0,
        explanation: "Dragonspiral Tower near Icirrus City is said to be the oldest structure in Unova, built for the Original Dragon."
      },
      {
        id: "unova_9",
        question: "Which elemental genie trio (Tornadus, Thundurus, Landorus) governs climate weather forces across Unova?",
        options: ["Forces of Nature", "Swords of Justice", "Creation Trio", "Kami Trio"],
        answerIndex: 0,
        explanation: "Tornadus (wind), Thundurus (lightning), and Landorus (fertile land) represent the Forces of Nature."
      },
      {
        id: "unova_10",
        question: "Which equine apprentice trained rigorously under the Swords of Justice to master its Secret Sword technique?",
        options: ["Keldeo", "Cobalion", "Zebstrika", "Rapidash"],
        answerIndex: 0,
        explanation: "Keldeo traveled across Unova to learn courage and master the Secret Sword technique from Cobalion, Terrakion, and Virizion."
      }
    ]
  },
  {
    region: "Kalos",
    themeTitle: "Order of Mortality, Life & Ultimate Weapon",
    themeDescription: "Kalos history grapples with eternal life, annihilation, ecosystem order, and ancient king energy weapons.",
    badgeColor: "border-pink-500/40 text-pink-400 bg-pink-950/30",
    questions: [
      {
        id: "kalos_1",
        question: "Which Kalos deity radiates life energy and sleeps in the form of a tree to bestow immortality?",
        options: ["Xerneas", "Yveltal", "Zygarde", "Diancie"],
        answerIndex: 0,
        explanation: "Xerneas shares eternal life when its horns glow with seven colors, entering a thousand-year slumber as a tree."
      },
      {
        id: "kalos_2",
        question: "Which entity absorbs life energy from all living creatures when its life cycle terminates?",
        options: ["Yveltal", "Darkrai", "Giratina", "Necrozma"],
        answerIndex: 0,
        explanation: "Yveltal spreads its crimson wings to absorb the vitality of all living things before transforming into a cocoon."
      },
      {
        id: "kalos_3",
        question: "Zygarde monitors ecological order. In what percentage forms does its cell assembly manifest?",
        options: ["10%, 50%, and Complete (100%)", "25% and 75%", "33% and 66%", "20% and 80%"],
        answerIndex: 0,
        explanation: "Zygarde gathers its dispersed Cells into 10% Hound, 50% Snake, and 100% Complete Titan forms when the ecosystem is threatened."
      },
      {
        id: "kalos_4",
        question: "What weapon built by King AZ 3,000 years ago utilized Pokémon life energy to grant immortality and end the war?",
        options: ["The Ultimate Weapon", "The Terastal Orb", "The Darkest Day Core", "The Soul-Heart Cannon"],
        answerIndex: 0,
        explanation: "The Ultimate Weapon was constructed by King AZ to revive his beloved Floette, sacrificing countless Pokémon lives."
      },
      {
        id: "kalos_5",
        question: "Which mythical diamond princess Pokémon transformed from Carbink to compress compressed carbon into gems?",
        options: ["Diancie", "Magearna", "Hoopa", "Volcanion"],
        answerIndex: 0,
        explanation: "Diancie can instantly compress carbon in the air to create sparkling diamonds."
      },
      {
        id: "kalos_6",
        question: "What unique emotional resonance form occurs when Greninja achieves perfect sync with its trainer in battle?",
        options: ["Ash-Greninja (Battle Bond)", "Mega Greninja", "Terastal Greninja", "Primal Greninja"],
        answerIndex: 0,
        explanation: "When Greninja and its trainer's hearts align, it transforms into Ash-Greninja, greatly boosting its stats and Water Shuriken."
      },
      {
        id: "kalos_7",
        question: "What was the name of the ancient king who wandered Kalos for 3,000 years seeking his eternal Floette?",
        options: ["King AZ", "King N", "King Alder", "King Peony"],
        answerIndex: 0,
        explanation: "King AZ was granted eternal life by his Ultimate Weapon and spent 3,000 years wandering Kalos searching for his Floette."
      },
      {
        id: "kalos_8",
        question: "Which mythical genie species uses its dimensional rings to warp islands, buildings, and legendary dragons across space?",
        options: ["Hoopa (Hoopa Unbound)", "Volcanion", "Magearna", "Diancie"],
        answerIndex: 0,
        explanation: "Hoopa Unbound possesses six massive arms and dimensional rings capable of summoning anything across distant dimensions."
      },
      {
        id: "kalos_9",
        question: "Where in Kalos does Zygarde's core slumber deep underground to keep watch over ecological destruction?",
        options: ["Terminus Cave", "Reflection Cave", "Frost Cavern", "Lost Hotel"],
        answerIndex: 0,
        explanation: "Deep within Terminus Cave, Zygarde monitors environmental degradation and intervenes if the ecosystem is disrupted."
      },
      {
        id: "kalos_10",
        question: "What temporary evolutionary phenomenon discovered in Kalos requires a Key Stone and Mega Stone to unleash?",
        options: ["Mega Evolution", "Z-Moves", "Dynamax", "Terastallization"],
        answerIndex: 0,
        explanation: "Mega Evolution temporarily releases a Pokémon's hidden potential, altering its appearance, stats, and abilities in battle."
      }
    ]
  },
  {
    region: "Alola",
    themeTitle: "Guardian Tapus, Light & Ultra Space",
    themeDescription: "Alola lore emphasizes island guardian spirits, ultra wormholes, cosmic solar/lunar deities, and light energy stolen by Necrozma.",
    badgeColor: "border-yellow-500/40 text-yellow-400 bg-yellow-950/30",
    questions: [
      {
        id: "alola_1",
        question: "What are the divine guardian deities protecting the four islands of Alola called?",
        options: ["The Tapus", "The Lake Guardians", "The Swords of Justice", "The Ruinous Four"],
        answerIndex: 0,
        explanation: "Tapu Koko, Tapu Lele, Tapu Bulu, and Tapu Fini serve as the revered divine guardians of Alola's islands."
      },
      {
        id: "alola_2",
        question: "Solgaleo and Lunala are heralded in Alola mythology as the emissaries of which cosmic bodies?",
        options: ["Sun and Moon", "Stars and Comets", "Eclipse and Nebula", "Void and Cosmos"],
        answerIndex: 0,
        explanation: "Solgaleo is known as the Beast that Devours the Sun, while Lunala is the Beast that Calls the Moon."
      },
      {
        id: "alola_3",
        question: "Which ancient crystal dragon lost its light in Ultra Megalopolis, becoming a shadow prism entity?",
        options: ["Necrozma", "Eternatus", "Kyurem", "Rayquaza"],
        answerIndex: 0,
        explanation: "Necrozma was once a radiant light source before losing its energy, seeking to absorb Solgaleo or Lunala to regain its true Ultra form."
      },
      {
        id: "alola_4",
        question: "What synthetic artificial Beast Killer Pokémon was engineered by Aether Foundation using genetic cells from all types?",
        options: ["Type: Null", "Mewtwo", "Genesect", "Silvally"],
        answerIndex: 0,
        explanation: "Type: Null was constructed as Code: Beast Killer to combat invading Ultra Beasts."
      },
      {
        id: "alola_5",
        question: "Which 500-year-old artificial mechanical Pokémon houses an artificial soul-heart constructed by a brilliant scientist?",
        options: ["Magearna", "Melmetal", "Genesect", "Poipole"],
        answerIndex: 0,
        explanation: "Magearna was constructed 500 years ago with a Soul-Heart created by gathering life force."
      },
      {
        id: "alola_6",
        question: "What interdimensional gateways open across Alola's sky, allowing alien Ultra Beasts to breach Earth's dimension?",
        options: ["Ultra Wormholes", "Space Distortion Rifts", "Hoopa Rings", "Terastal Fissures"],
        answerIndex: 0,
        explanation: "Ultra Wormholes are cosmic rifts connecting Earth to foreign Ultra Space dimensions populated by Ultra Beasts."
      },
      {
        id: "alola_7",
        question: "Which dormant cocoon stage do both Solgaleo and Lunala pass through after evolving from Cosmog?",
        options: ["Cosmoem", "Solgaleo Core", "Lunala Core", "Necrozma Shell"],
        answerIndex: 0,
        explanation: "Cosmog evolves into Cosmoem, an extraordinarily dense star cocoon weighing 2,204 lbs before evolving into Solgaleo or Lunala."
      },
      {
        id: "alola_8",
        question: "Which purple Ultra Beast is known as the Poison Pin Pokémon and partner of the Ultra Recon Squad?",
        options: ["Poipole", "Naganadel", "Nihilego", "Blacephalon"],
        answerIndex: 0,
        explanation: "Poipole displays playful emotions and is used as a partner Pokémon by the Ultra Recon Squad in Ultra Megalopolis."
      },
      {
        id: "alola_9",
        question: "Which ghost/fairy species wears a ragged Pikachu costume to seek friendship and protect itself from sunlight?",
        options: ["Mimikyu", "Banette", "Sableye", "Dhelmise"],
        answerIndex: 0,
        explanation: "Mimikyu wears a homemade Pikachu rag disguise because Pikachu's popularity makes it easier to approach humans."
      },
      {
        id: "alola_10",
        question: "What crystalline item, when equipped alongside a Z-Ring, allows a Pokémon to release an ultimate Z-Move?",
        options: ["Z-Crystal", "Mega Stone", "Tera Shard", "Wishing Star"],
        answerIndex: 0,
        explanation: "Z-Crystals channel a trainer's Z-Power through the Z-Ring, unleashing a devastating elemental Z-Move once per battle."
      }
    ]
  },
  {
    region: "Galar",
    themeTitle: "The Darkest Day & Heroic Relics",
    themeDescription: "Galar lore focuses on 3,000-year-old catastrophic Dynamax storms, Eternatus energy, and the Heroic Sword & Shield.",
    badgeColor: "border-blue-500/40 text-blue-400 bg-blue-950/30",
    questions: [
      {
        id: "galar_1",
        question: "Which ancient catastrophic storm event brought Dynamax energy to Galar 3,000 years ago?",
        options: ["The Darkest Day", "The Ultimate Weapon", "The Primal Surge", "The Great Cataclysm"],
        answerIndex: 0,
        explanation: "The Darkest Day was caused when Eternatus attempted to absorb Galar's energy, making Pokémon gigantean and wild."
      },
      {
        id: "galar_2",
        question: "Zacian and Zamazenta saved Galar during the Darkest Day using which iconic relics?",
        options: ["Rusted Sword and Rusted Shield", "Crown and Lance", "Bow and Arrow", "Orb and Scepter"],
        answerIndex: 0,
        explanation: "Equipped with the Rusted Sword and Rusted Shield, Zacian and Zamazenta sealed Eternatus away."
      },
      {
        id: "galar_3",
        question: "Which alien dragon core is the true source of all Wishing Stars and Dynamax energy in Galar?",
        options: ["Eternatus", "Rayquaza", "Regidrago", "Urshifu"],
        answerIndex: 0,
        explanation: "Eternatus arrived in a meteor 20,000 years ago; its leaking energy powers Galar's Dynamax Power Spots."
      },
      {
        id: "galar_4",
        question: "Which ancient King of Bountiful Harvests rode Glastrier or Spectrier to heal Galar's blighted crops?",
        options: ["Calyrex", "Zarude", "Urshifu", "Regieleki"],
        answerIndex: 0,
        explanation: "Calyrex ruled Galar in ancient times, bringing prosperity and healing frozen lands."
      },
      {
        id: "galar_5",
        question: "Regieleki and Regidrago were created by Regigigas using which concentrated elemental materials?",
        options: ["Pure Electrical Energy & Dragon Crystal Energy", "Solar Ray & Void Energy", "Magma & Ice", "Steel & Rock"],
        answerIndex: 0,
        explanation: "Regieleki was constructed from electrical energy, while Regidrago was formed from crystallized dragon energy."
      },
      {
        id: "galar_6",
        question: "Which martial arts bear Pokémon evolves into either Single Strike or Rapid Strike Style Urshifu?",
        options: ["Kubfu", "Pangoro", "Stufful", "Bewear"],
        answerIndex: 0,
        explanation: "Kubfu trains at the Towers of Two Fists in the Isle of Armor, evolving into Fighting/Dark or Fighting/Water Urshifu."
      },
      {
        id: "galar_7",
        question: "Which legendary ice steed can Calyrex tame using the Reins of Unity to become Ice Rider Calyrex?",
        options: ["Glastrier", "Spectrier", "Mudsdale", "Rapidash"],
        answerIndex: 0,
        explanation: "Calyrex binds with Glastrier using the Reins of Unity, gaining powerful Ice/Psychic combat prowess."
      },
      {
        id: "galar_8",
        question: "Which punk-rock electric lizard species absorbs voltage to generate electric bass sounds in Galar stadium matches?",
        options: ["Toxtricity", "Eternatus", "Morpeko", "Boltund"],
        answerIndex: 0,
        explanation: "Toxtricity (Amped or Low Key) generates rhythm by strumming the guitar-like protrusions on its chest."
      },
      {
        id: "galar_9",
        question: "What battle phenomenon occurs at Galar Power Spots when Wishing Star energy causes Pokémon to grow to colossal proportions?",
        options: ["Dynamax / Gigantamax", "Mega Evolution", "Terastallization", "Z-Power"],
        answerIndex: 0,
        explanation: "Dynamaxing distorts space around a Pokémon, turning it into a giant projection with Max Moves for three turns."
      },
      {
        id: "galar_10",
        question: "Which strange fossil combinations were constructed by combining mismatched ancient halves in Galar's Route 6 lab?",
        options: ["Dracozolt, Arctozolt, Dracovish & Arctovish", "Tyrunt & Amaura", "Cranidos & Shieldon", "Omanyte & Kabuto"],
        answerIndex: 0,
        explanation: "Galar's fossil researcher mistakenly fused different fossil upper and lower bodies together to create unique chimera Pokémon."
      }
    ]
  },
  {
    region: "Paldea",
    themeTitle: "Area Zero Terastal Matrix & Ruin Treasures",
    themeDescription: "Paldea lore centers on the Great Crater crystal anomaly, Terapagos matrix energy, and cursed treasures born from ancient greed.",
    badgeColor: "border-orange-500/40 text-orange-400 bg-orange-950/30",
    questions: [
      {
        id: "paldea_1",
        question: "What mysterious crystalline phenomenon in Paldea alters a Pokémon's typing and bestows a glowing gem crown?",
        options: ["Terastallization", "Mega Evolution", "Z-Power", "Gigantamax"],
        answerIndex: 0,
        explanation: "Terastallization crystallizes a Pokémon, altering its offensive/defensive type matching based on its Tera Type."
      },
      {
        id: "paldea_2",
        question: "The Treasures of Ruin (Wo-Chien, Chien-Pao, Ting-Lu, Chi-Yu) were born from ancient artifacts corrupted by what emotion?",
        options: ["Human Greed & Hatred", "Envy & Jealousy", "Fear & Despair", "Arrogance"],
        answerIndex: 0,
        explanation: "Ancient vessels, tablets, beads, and swords bought by a Paldean king were corrupted by malice and greed, coming to life as destructive ruins."
      },
      {
        id: "paldea_3",
        question: "Which legendary indigo turtle sleeping at the bottom of the Underdepths is the origin of Terastal energy?",
        options: ["Terapagos", "Koraidon", "Miraidon", "Ogerpon"],
        answerIndex: 0,
        explanation: "Terapagos produces the Terastal energy matrix that fuels the crystal ecosystem throughout Paldea and Area Zero."
      },
      {
        id: "paldea_4",
        question: "Which ancient/future paradox entities were brought to Area Zero using Professor Sada/Turo's Time Machine?",
        options: ["Koraidon/Miraidon & Paradox Species", "Ultra Beasts", "Ruin Treasures", "Genesect Squad"],
        answerIndex: 0,
        explanation: "Paradox Pokémon like Great Tusk and Iron Treads were pulled from ancient past or distant future timelines."
      },
      {
        id: "paldea_5",
        question: "Which lone ogre Pokémon in Kitakami wears four distinct elemental masks carved by an ancient craftsman?",
        options: ["Ogerpon", "Pecharunt", "Okidogi", "Terapagos"],
        answerIndex: 0,
        explanation: "Ogerpon changes its Tera type and form when holding the Teal, Wellspring, Hearthflame, or Cornerstone Masks."
      },
      {
        id: "paldea_6",
        question: "Which ancient apex paradox bike Pokémon embodies primeval prehistoric power in Paldea's scarlet lore?",
        options: ["Koraidon", "Miraidon", "Cyclizar", "Great Tusk"],
        answerIndex: 0,
        explanation: "Koraidon is the Winged King, an ancient ancestor of Cyclizar that runs across land, swims, and glides through skies."
      },
      {
        id: "paldea_7",
        question: "Which cybernetic future paradox bike Pokémon embodies high-tech plasma drive in Paldea's violet lore?",
        options: ["Miraidon", "Koraidon", "Cyclizar", "Iron Treads"],
        answerIndex: 0,
        explanation: "Miraidon is the Iron Serpent, a futuristic descendant of Cyclizar powered by internal plasma engines."
      },
      {
        id: "paldea_8",
        question: "Which mischievous peach-shaped mythical Pokémon controls minds and bodies using toxic binding mochi in Kitakami?",
        options: ["Pecharunt", "Ogerpon", "Okidogi", "Dipplin"],
        answerIndex: 0,
        explanation: "Pecharunt uses its toxic binding mochi to command minds, as told in the story of the Loyal Three."
      },
      {
        id: "paldea_9",
        question: "Which three hero Pokémon of Kitakami folklore were granted strength by Pecharunt's toxic mochi to attack Ogerpon?",
        options: ["Okidogi, Munkidori & Fezandipiti", "Wo-Chien, Chien-Pao & Ting-Lu", "Suicune, Raikou & Entei", "The Tapus"],
        answerIndex: 0,
        explanation: "Okidogi, Munkidori, and Fezandipiti were revered as the Loyal Three in Kitakami village legends."
      },
      {
        id: "paldea_10",
        question: "Which ruin treasure was born from a cursed ancient sword that slaughtered thousands before being sealed in ice?",
        options: ["Chien-Pao", "Wo-Chien", "Ting-Lu", "Chi-Yu"],
        answerIndex: 0,
        explanation: "Chien-Pao was born from the hatred of those who perished by an ancient sword, controlling snow and ice."
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

let examCacheKey = '';
let cachedExams: any = null;

export const PokethologyQuizWidget: React.FC = memo(() => {
  const [activeRegionIndex, setActiveRegionIndex] = useState<number>(0);
  const [userAnswersMap, setUserAnswersMap] = useState<Record<string, number>>({});
  const [selectedOptionMap, setSelectedOptionMap] = useState<Record<string, number>>({});
  const [lockedMap, setLockedMap] = useState<Record<string, boolean>>({});
  const [customSeed, setCustomSeed] = useState<number>(0);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const formattedToday = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  // Dynamically calculate today's selected 3 theory exam questions per region with fast cache
  const allExams = useMemo(() => {
    const key = `${todayStr}_v2_seed_${customSeed}`;
    if (examCacheKey === key && cachedExams) {
      return cachedExams;
    }
    const baseHash = hashCode(key);
    
    const result = REGION_LORE_DATABASE.map((regionData, rIdx) => {
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

    examCacheKey = key;
    cachedExams = result;
    return result;
  }, [todayStr, customSeed]);

  const handleRerollDailyExam = () => {
    const nextSeed = customSeed + 1;
    setCustomSeed(nextSeed);
    setUserAnswersMap({});
    setSelectedOptionMap({});
    setLockedMap({});
    try { sounds.scan(); } catch (_) {}
  };

  const currentRegionData = allExams[activeRegionIndex] || allExams[0];

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

  return (
    <div className="w-full flex flex-col gap-4 text-left font-sans">
      {/* DAILY REFRESH STATUS BANNER */}
      <div className="bg-slate-900/60 border border-cyan-500/20 rounded-xl p-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="text-[10px] font-mono font-bold text-cyan-300 tracking-wider uppercase">
            {formattedToday.toUpperCase()} - THEORY EXAM
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

      {/* REGION SELECTION TABS */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1.5 shrink-0">
        {allExams.map((rData, idx) => {
          const isActive = idx === activeRegionIndex;
          const RegionIcon = REGION_ICONS[rData.region] || Globe;

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
              <RegionIcon className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-slate-950" : "text-cyan-400")} />
              <span>{rData.region}</span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE REGION HEADER BANNER */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col gap-1.5 text-left relative overflow-hidden">
        <HUDCorners />
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
          <h3 className="text-xs xs:text-sm sm:text-base font-hud font-black text-amber-300 uppercase tracking-wider flex items-center gap-2 min-w-0 break-words">
            {React.createElement(REGION_ICONS[currentRegionData.region] || BookOpen, { className: "w-4 h-4 text-amber-400 shrink-0" })}
            <span className="truncate">{currentRegionData.region}: {currentRegionData.themeTitle}</span>
          </h3>
          <span className={cn('px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider border shrink-0', currentRegionData.badgeColor)}>
            THEORY QUIZ
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
                  QUESTION {qIndex + 1} / {currentRegionData.questions.length}
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
                        <Check className="w-3 h-3 text-emerald-400" /> CORRECT
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-rose-400" /> INCORRECT
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
                      key={`q-opt-${optIdx}`}
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
                    SUBMIT ANSWER
                  </button>
                </div>
              ) : (
                <div className="mt-2 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                  <strong className="text-cyan-400 font-hud block mb-1 uppercase tracking-wider text-[9px]">
                    EXPLANATION
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
