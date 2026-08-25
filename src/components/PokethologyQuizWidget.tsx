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
      },
      {
        id: "kanto_11",
        question: "What item developed by Silph Co. allows trainers to identify and interact with cloaked ghost apparitions?",
        options: ["Silph Scope", "Devon Scope", "Itemfinder", "Town Map"],
        answerIndex: 0,
        explanation: "The Silph Scope is an optical visor designed by Silph Co. that pierces ghost cloaking to reveal true identities."
      },
      {
        id: "kanto_12",
        question: "Which deep cave in northwestern Kanto contains the highest concentration of high-level feral Pokémon and Mewtwo?",
        options: ["Cerulean Cave", "Rock Tunnel", "Diglett's Cave", "Seafoam Islands"],
        answerIndex: 0,
        explanation: "Cerulean Cave (Unknown Dungeon) houses formidable, untamed Pokémon and served as Mewtwo's refuge."
      },
      {
        id: "kanto_13",
        question: "What rare extraterrestrial stone found on Mt. Moon causes Clefairy to evolve into Clefable?",
        options: ["Moon Stone", "Sun Stone", "Dusk Stone", "Shiny Stone"],
        answerIndex: 0,
        explanation: "Moon Stones fell with ancient meteorites onto Mt. Moon, triggering Clefairy's lunar evolution."
      },
      {
        id: "kanto_14",
        question: "Who was the enigmatic leader of Team Rocket who simultaneously served as the Viridian City Gym Leader?",
        options: ["Giovanni", "Blaine", "Koga", "Lt. Surge"],
        answerIndex: 0,
        explanation: "Giovanni commanded the Viridian Gym while orchestrating Team Rocket's syndicate across Kanto."
      },
      {
        id: "kanto_15",
        question: "Which Kanto fossil is revived into the predatory, scythe-armed ancient rock arthropod Kabutops?",
        options: ["Dome Fossil", "Helix Fossil", "Old Amber", "Claw Fossil"],
        answerIndex: 0,
        explanation: "The Dome Fossil contains the ancient genetic imprint of Kabuto, which evolves into the deadly Kabutops."
      },
      {
        id: "kanto_16",
        question: "What legendary amber relic contains genetic material sufficient to regenerate the prehistoric dragon Aerodactyl?",
        options: ["Old Amber", "Helix Fossil", "Armor Fossil", "Dragon Fang"],
        answerIndex: 0,
        explanation: "Old Amber preserves primeval tree resin carrying Aerodactyl DNA from millions of years ago."
      },
      {
        id: "kanto_17",
        question: "Which eccentric researcher and inventor created the Pokémon Storage System used across all regions?",
        options: ["Bill", "Professor Oak", "Celio", "Mr. Fuji"],
        answerIndex: 0,
        explanation: "Bill invented the computer PC Pokémon Storage System at his Sea Cottage on Route 25 in Cerulean Cape."
      },
      {
        id: "kanto_18",
        question: "Which frigid cavern located on Route 20 serves as the glacial nesting ground of the legendary bird Articuno?",
        options: ["Seafoam Islands", "Cerulean Cave", "Ice Path", "Rock Tunnel"],
        answerIndex: 0,
        explanation: "The icy subterranean waterfalls of the Seafoam Islands shelter the legendary Ice-bird Articuno."
      },
      {
        id: "kanto_19",
        question: "What martial arts dojo in Saffron City was stripped of official Gym status by Sabrina's Psychic gym?",
        options: ["Fighting Dojo", "Indigo Dojo", "Blackthorn Gym", "Cianwood Dojo"],
        answerIndex: 0,
        explanation: "The Fighting Dojo in Saffron City lost its League sanction after losing an elemental Gym challenge to Sabrina."
      },
      {
        id: "kanto_20",
        question: "Which psychic prodigy and Gym Leader of Saffron City communicated telepathically from early childhood?",
        options: ["Sabrina", "Erika", "Misty", "Lorelei"],
        answerIndex: 0,
        explanation: "Sabrina mastered telekinesis and telepathy at a young age, commanding psychic bends of spoon and mind."
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
        question: "Which sacred cavern in Blackthorn City is reserved exclusively for the Clan of Dragon Masters to test pure spirit?",
        options: ["Dragon's Den", "Whirl Islands Cave", "Mt. Mortar", "Dark Cave"],
        answerIndex: 0,
        explanation: "The Dragon's Den houses the Dragon Shrine, where the Dragon Clan elder tests the heart and character of aspiring Dragon Masters."
      },
      {
        id: "johto_10",
        question: "What traditional artisan in Azalea Town crafts specialized Poké Balls directly from organic Apricorn shells?",
        options: ["Kurt", "Professor Elm", "Mr. Pokémon", "Eusine"],
        answerIndex: 0,
        explanation: "Kurt handcrafts specialized Apricorn Balls (Heavy, Moon, Fast, Level, Lure, Love, Friend) in Azalea Town."
      },
      {
        id: "johto_11",
        question: "Which legendary beast embodies the raging thunder that struck the Brass Tower during the great fire?",
        options: ["Raikou", "Entei", "Suicune", "Zapdos"],
        answerIndex: 0,
        explanation: "Raikou embodies the lightning strike that ignited the Brass Tower in ancient Ecruteak lore."
      },
      {
        id: "johto_12",
        question: "Which legendary beast is said to be born whenever a new volcano erupts onto the earth?",
        options: ["Entei", "Raikou", "Heatran", "Moltres"],
        answerIndex: 0,
        explanation: "Entei is said to race across land, with new ones bursting into life with the eruption of fresh volcanoes."
      },
      {
        id: "johto_13",
        question: "What central pillar inside Sprout Tower in Violet City sways perpetually to absorb seismic shockwaves?",
        options: ["A massive petrified Bellsprout stalk", "A bronze spire", "A solidified steel gyro", "An ancient dragon spine"],
        answerIndex: 0,
        explanation: "Sprout Tower's central swaying timber is modeled after Bellsprout's flexible stem, protecting the structure from earthquakes."
      },
      {
        id: "johto_14",
        question: "What traditional five performers in Ecruteak City test trainers with Eevee evolutions before granting the Tidal/Rainbow bell?",
        options: ["The Kimono Girls", "The Battle Maidens", "The Shrine Maidens", "The Indigo Sisters"],
        answerIndex: 0,
        explanation: "The five Kimono Girls (Tamao, Zuki, Naoko, Sayo, Kuni) guard sacred dance traditions and test trainers before summoning legendary birds."
      },
      {
        id: "johto_15",
        question: "What legendary item is blown to summon Ho-Oh to the apex of the Bell Tower?",
        options: ["Rainbow Wing & Clear Bell", "Silver Wing & Tidal Bell", "Poké Flute", "Azure Flute"],
        answerIndex: 0,
        explanation: "The Rainbow Wing together with the resonant chiming of the Clear Bell summons Ho-Oh."
      },
      {
        id: "johto_16",
        question: "What species had its tails ruthlessly harvested by Team Rocket in Azalea Town's subterranean well?",
        options: ["Slowpoke", "Mareep", "Wooper", "Aipom"],
        answerIndex: 0,
        explanation: "Team Rocket occupied Slowpoke Well to sever and sell delicious, nutritious SlowpokeTails at exorbitant prices."
      },
      {
        id: "johto_17",
        question: "What tranquil, snowbound mountain peak at the border of Johto and Kanto serves as the sanctuary of Pokémon Master Red?",
        options: ["Mt. Silver", "Mt. Coronet", "Mt. Pyre", "Mt. Moon"],
        answerIndex: 0,
        explanation: "Mt. Silver (Silver Cave) is a perilous, restricted nature reserve where Champion Red trains in absolute solitude."
      },
      {
        id: "johto_18",
        question: "What sacred feather allows a trainer to access the underwater chambers of the Whirl Islands to encounter Lugia?",
        options: ["Silver Wing", "Rainbow Wing", "Lunar Wing", "Dragon Scale"],
        answerIndex: 0,
        explanation: "The Silver Wing resonates with Lugia's psychic aura, calming the surrounding whirlpools."
      },
      {
        id: "johto_19",
        question: "What item is required to cure the sick Ampharos (Amphy) guiding ships from the Olivine City Lighthouse?",
        options: ["Secret Medicine from Cianwood City", "Lava Cookie", "Moomoo Milk", "Sacred Ash"],
        answerIndex: 0,
        explanation: "Jasmine requires the ancient Secret Medicine brewed in Cianwood Pharmacy to restore Amphy's radiant beacon."
      },
      {
        id: "johto_20",
        question: "What type specialty does Gym Leader Whitney of Goldenrod City employ, famous for her unstoppable Rollout tactic?",
        options: ["Normal-type", "Fairy-type", "Grass-type", "Ground-type"],
        answerIndex: 0,
        explanation: "Whitney commands cute but notoriously resilient Normal-type Pokémon, headlined by her devastating Miltank."
      }
    ]
  },
  {
    region: "Hoenn",
    themeTitle: "Tectonic Genesis & Primordial Clashes",
    themeDescription: "Hoenn mythos revolves around the primordial shaping of oceans and continents, celestial ozone dragons, and sealed titans.",
    badgeColor: "border-emerald-500/40 text-emerald-400 bg-emerald-950/30",
    questions: [
      {
        id: "hoenn_1",
        question: "Which celestial sky dragon descended from the ozone layer to pacify the apocalyptic battle between Groudon and Kyogre?",
        options: ["Rayquaza", "Latios", "Salamence", "Flygon"],
        answerIndex: 0,
        explanation: "Rayquaza descended from the stratosphere, neutralizing extreme droughts and deluges with its Air Lock ability."
      },
      {
        id: "hoenn_2",
        question: "What ancient process allows Groudon and Kyogre to reclaim the limitless primordial energy of ancient Earth?",
        options: ["Primal Reversion", "Mega Evolution", "Terastallization", "Dynamax"],
        answerIndex: 0,
        explanation: "Primal Reversion allows Groudon and Kyogre to absorb nature's raw energy via the Red and Blue Orbs, transforming into their primordial forms."
      },
      {
        id: "hoenn_3",
        question: "Which extraterrestrial psychic virus mutated upon entering earth's atmosphere via a crystalline laser meteor?",
        options: ["Deoxys", "Jirachi", "Beheeyem", "Starmie"],
        answerIndex: 0,
        explanation: "Deoxys originated as an alien virus on a laser-irradiated meteorite, reconstituting into Normal, Attack, Defense, and Speed forms."
      },
      {
        id: "hoenn_4",
        question: "According to ancient Braille glyphs in the Sealed Chamber, what titanic species created the Regi trio in its own image?",
        options: ["Regigigas", "Arceus", "Groudon", "Rayquaza"],
        answerIndex: 0,
        explanation: "Regigigas forged Regirock from clay/magma, Regice from glacial ice, and Registeel from hardened magma before sealing them across Hoenn."
      },
      {
        id: "hoenn_5",
        question: "Which wishing star Pokémon awakens for only seven days every thousand years when the Millennium Comet passes?",
        options: ["Jirachi", "Celebi", "Manaphy", "Victini"],
        answerIndex: 0,
        explanation: "Jirachi awakens for one week every 1,000 years in the presence of a pure-hearted companion during the Millennium Comet."
      },
      {
        id: "hoenn_6",
        question: "What massive meteor impact crater houses the aquatic, soot-sheltered city of Sootopolis?",
        options: ["An extinct volcano caldera crater submerged by the sea", "A trench blasted by Rayquaza", "A sunken crater formed by Regirock", "An ancient flooded meteorite site"],
        answerIndex: 0,
        explanation: "Sootopolis City was founded inside a giant collapsed oceanic volcanic crater formed during primeval clashes."
      },
      {
        id: "hoenn_7",
        question: "Which ancient clan passed down the history of Mega Evolution and the dragon meteor invocation to Zinnia?",
        options: ["The Draconid Tribe", "The Meteor Clan", "The Ancient Solaceon Clan", "The Celestic Tribe"],
        answerIndex: 0,
        explanation: "The Draconid people inhabited Meteor Falls and preserved Rayquaza's lore for millennia."
      },
      {
        id: "hoenn_8",
        question: "What crystalline soul relic contains the essence and life-force of the Eon Pokémon Latios and Latias?",
        options: ["Soul Dew", "Adamant Orb", "Griseous Core", "Lustrous Globe"],
        answerIndex: 0,
        explanation: "Soul Dew is a crystallized relic containing the spirits of departed guardian Latios or Latias."
      },
      {
        id: "hoenn_9",
        question: "What company headquartered in Rustboro City developed the Devon Scope and Infinity Energy technology?",
        options: ["Devon Corporation", "Silph Co.", "Macro Cosmos", "Aether Foundation"],
        answerIndex: 0,
        explanation: "President Mr. Stone's Devon Corporation revolutionized Hoenn with advanced navigational scopes and Infinity Energy."
      },
      {
        id: "hoenn_10",
        question: "What volcanic mountain in central Hoenn produces fine mineral ash collected by trainers to blow glass flutes?",
        options: ["Mt. Chimney", "Mt. Pyre", "Mt. Moon", "Cinnabar Volcano"],
        answerIndex: 0,
        explanation: "Mt. Chimney showers Route 113 with thick volcanic ash used by the Glass Workshop in Fallarbor Town."
      },
      {
        id: "hoenn_11",
        question: "What sacred burial mountain in eastern Hoenn houses spirits and holds the Red and Blue Orbs on its summit?",
        options: ["Mt. Pyre", "Mt. Chimney", "Meteor Falls", "Sky Pillar"],
        answerIndex: 0,
        explanation: "Mt. Pyre serves as a resting ground for Pokémon spirits and the historic sanctuary for the primordial Orbs."
      },
      {
        id: "hoenn_12",
        question: "What soaring ancient tower off Route 131 leads directly up into the sky where Rayquaza roosts?",
        options: ["Sky Pillar", "Tin Tower", "Dragonspiral Tower", "Prism Tower"],
        answerIndex: 0,
        explanation: "Sky Pillar was constructed by the Draconid people as a direct ladder to the ozone realm of Lord Rayquaza."
      },
      {
        id: "hoenn_13",
        question: "What weather-sensing synthetic Pokémon was created by the scientists at the Hoenn Weather Institute?",
        options: ["Castform", "Porygon2", "Rotom", "Baltoy"],
        answerIndex: 0,
        explanation: "Castform was engineered by Weather Institute researchers to shift between Sun, Rain, and Snow forms dynamically."
      },
      {
        id: "hoenn_14",
        question: "Which Hoenn Champion is a wandering mineral collector and heir to the Devon Corporation?",
        options: ["Steven Stone", "Wallace", "Drake", "Sidney"],
        answerIndex: 0,
        explanation: "Steven Stone travels the world prospecting rare stones and masterfully commanding Steel-type titans like Metagross."
      },
      {
        id: "hoenn_15",
        question: "What legendary Hoenn Pokémon represents the landmass and expanding tectonic plates of the world?",
        options: ["Groudon", "Kyogre", "Regigigas", "Torterra"],
        answerIndex: 0,
        explanation: "Groudon is revered in mythology as the creator and expander of the continents with blazing volcanic heat."
      },
      {
        id: "hoenn_16",
        question: "What legendary Hoenn Pokémon represents the oceans and expanded world waters through torrential downpours?",
        options: ["Kyogre", "Groudon", "Manaphy", "Lugia"],
        answerIndex: 0,
        explanation: "Kyogre is heralded as the master of the oceans, raising sea levels with endless rainstorms."
      },
      {
        id: "hoenn_17",
        question: "What tree-top settlement in northern Hoenn consists entirely of interconnected canopy treehouses?",
        options: ["Fortree City", "Fallarbor Town", "Lavaridge Town", "Pacifidlog Town"],
        answerIndex: 0,
        explanation: "Fortree City's residents live in aerial canopy homes to exist in harmony with wild Flying Pokémon."
      },
      {
        id: "hoenn_18",
        question: "What floating village in southern Hoenn is built atop wooden rafts anchored over coral reefs?",
        options: ["Pacifidlog Town", "Dewford Town", "Slateport City", "Mossdeep City"],
        answerIndex: 0,
        explanation: "Pacifidlog Town floats entirely on wooden rafts anchored in deep ocean currents."
      },
      {
        id: "hoenn_19",
        question: "What island city in Hoenn is home to the regional Space Center and twin psychic Gym Leaders Tate and Liza?",
        options: ["Mossdeep City", "Sootopolis City", "Ever Grande City", "Dewford Town"],
        answerIndex: 0,
        explanation: "Mossdeep City houses the Mossdeep Space Center, launching rockets into orbit."
      },
      {
        id: "hoenn_20",
        question: "What mystical elusive island in Hoenn appears only when a Pokémon's personality values align with random coordinates?",
        options: ["Mirage Island", "Southern Island", "Faraway Island", "Birth Island"],
        answerIndex: 0,
        explanation: "Mirage Island only appears on Route 130 when a party Pokémon matches its daily generated bit-flags, growing Liechi Berries."
      }
    ]
  },
  {
    region: "Sinnoh",
    themeTitle: "Cosmic Creation & Dimensional Geometry",
    themeDescription: "Sinnoh lore delves into universal genesis, the creation of time, space, antimatter, and human consciousness.",
    badgeColor: "border-blue-500/40 text-blue-400 bg-blue-950/30",
    questions: [
      {
        id: "sinnoh_1",
        question: "In Sinnoh mythology, which deity emerged from a single egg in the cosmic void to shape the entire Pokémon universe?",
        options: ["Arceus", "Giratina", "Dialga", "Palkia"],
        answerIndex: 0,
        explanation: "Arceus (The Original One) was born from an egg in the void of chaos, spinning reality into existence."
      },
      {
        id: "sinnoh_2",
        question: "Which legendary dragon controls the flow of time and accelerates or halts temporal sequences?",
        options: ["Dialga", "Palkia", "Giratina", "Celebi"],
        answerIndex: 0,
        explanation: "Dialga was created by Arceus to govern the dimension of Time, keeping seconds flowing in harmony."
      },
      {
        id: "sinnoh_3",
        question: "Which deity presides over spatial geometry, planar dimensions, and the curvature of the cosmos?",
        options: ["Palkia", "Dialga", "Giratina", "Deoxys"],
        answerIndex: 0,
        explanation: "Palkia commands spatial dimensions, enabling instantaneous transit across the universe."
      },
      {
        id: "sinnoh_4",
        question: "Why was Giratina banished to the Distortion World by Arceus following the creation of the universe?",
        options: ["For its destructive, violent nature and antimatter physics", "It attempted to absorb the Sun", "It destroyed the Lake Trio", "It created dark void portals in Jubilife"],
        answerIndex: 0,
        explanation: "Giratina's violent antimatter instability threatened cosmic physics, leading Arceus to seal it in the Distortion World."
      },
      {
        id: "sinnoh_5",
        question: "Which three Lake Guardians embody Knowledge, Emotion, and Willpower in Sinnoh folklore?",
        options: ["Uxie, Mesprit, Azelf", "Articuno, Zapdos, Moltres", "Cobalion, Terrakion, Virizion", "Tornadus, Thundurus, Landorus"],
        answerIndex: 0,
        explanation: "Uxie represents Knowledge (Acuity), Mesprit represents Emotion (Verity), and Azelf represents Willpower (Valor)."
      },
      {
        id: "sinnoh_6",
        question: "What ancient sacred summit on Mt. Coronet contains the ruins where Dialga and Palkia can be summoned?",
        options: ["Spear Pillar", "Dragonspiral Tower", "Sky Pillar", "Hall of Origin"],
        answerIndex: 0,
        explanation: "The Spear Pillar sits atop Mt. Coronet, where ancient people constructed a temple to the creation deities."
      },
      {
        id: "sinnoh_7",
        question: "What pitch-black mythical Pokémon causes endless nightmares unless countered by Cresselia's Lunar Feather?",
        options: ["Darkrai", "Spiritomb", "Gengar", "Yveltal"],
        answerIndex: 0,
        explanation: "Darkrai inhabits Newmoon Island, unintentionally inducing deep nightmares in nearby inhabitants."
      },
      {
        id: "sinnoh_8",
        question: "What colossal continent-pulling titan sleeps deep within the subterranean temple beneath Snowpoint City?",
        options: ["Regigigas", "Groudon", "Heatran", "Avalugg"],
        answerIndex: 0,
        explanation: "Regigigas rests in Snowpoint Temple, awakenable only by presenting Regirock, Regice, and Registeel."
      },
      {
        id: "sinnoh_9",
        question: "Which magma-dwelling legendary titan dwells inside the volcanic chambers of Stark Mountain?",
        options: ["Heatran", "Volcanion", "Groudon", "Magmortar"],
        answerIndex: 0,
        explanation: "Heatran was formed from magma bubbling deep beneath Stark Mountain during Sinnoh's creation."
      },
      {
        id: "sinnoh_10",
        question: "What mythical hedgehog-like Pokémon purifies toxic atmospheric pollution and blooms into Sky Forme with a Gracidea flower?",
        options: ["Shaymin", "Celebi", "Meloetta", "Jirachi"],
        answerIndex: 0,
        explanation: "Shaymin absorbs environmental toxins using Seed Flare and blooms into Sky Forme when exposed to Gracidea flowers."
      },
      {
        id: "sinnoh_11",
        question: "What ancient town in Sinnoh is the oldest settlement, preserving ancient shrine murals of the creation trio?",
        options: ["Celestic Town", "Solaceon Town", "Pastoria City", "Canalave City"],
        answerIndex: 0,
        explanation: "Celestic Town preserves ancestral Sinnoh heritage, overseen by Champion Cynthia's grandmother."
      },
      {
        id: "sinnoh_12",
        question: "What item forged by Cyrus from the Lake Guardians was designed to shackle Dialga and Palkia without a Poké Ball?",
        options: ["The Red Chain", "The Lunar Wing", "The Adamant Orb", "The Griseous Orb"],
        answerIndex: 0,
        explanation: "The Red Chain bound the minds and cosmic powers of the creation dragons to prevent their power from diminishing."
      },
      {
        id: "sinnoh_13",
        question: "What spectral Pokémon was sealed inside the Hallowed Tower on Route 209 due to committing 108 misdeeds?",
        options: ["Spiritomb", "Rotom", "Dusknoir", "Froslass"],
        answerIndex: 0,
        explanation: "Spiritomb is formed of 108 spirits bound to an Odd Keystone 500 years ago as punishment for wicked deeds."
      },
      {
        id: "sinnoh_14",
        question: "What legendary sea prince Pokémon hatches only in warm ocean currents and can bond with all aquatic Pokémon via Heart Swap?",
        options: ["Manaphy", "Phione", "Kyogre", "Lugia"],
        answerIndex: 0,
        explanation: "Manaphy is the Prince of the Sea Temple (Samiya), capable of calming aquatic minds."
      },
      {
        id: "sinnoh_15",
        question: "Which Sinnoh Champion is a brilliant archaeologist who conducts field studies at Solaceon and Celestic ruins?",
        options: ["Cynthia", "Steven", "Lance", "Alder"],
        answerIndex: 0,
        explanation: "Cynthia studies ancient mythology and archeology, guarding the balance between Pokémon and humanity."
      },
      {
        id: "sinnoh_16",
        question: "What vast subterranean maze spreads under the entire Sinnoh region, filled with mining spheres and fossils?",
        options: ["The Underground / Grand Underground", "Cerulean Cave", "Wayward Cave", "Iron Island"],
        answerIndex: 0,
        explanation: "The Underground is an expansive tunnel network beneath Sinnoh where trainers unearth ancient fossils and plates."
      },
      {
        id: "sinnoh_17",
        question: "How many elemental Plates did Arceus drop across creation that alter its typing with the Multitype ability?",
        options: ["18 Plates (including Pixie Plate)", "16 Plates", "17 Plates", "12 Plates"],
        answerIndex: 0,
        explanation: "Arceus carries 18 elemental plates representing every type in existence."
      },
      {
        id: "sinnoh_18",
        question: "What haunted manor inside Eterna Forest contains paintings whose eyes follow visitors and electric spirits like Rotom?",
        options: ["Old Chateau", "Lost Tower", "Hallowed Tower", "Turnback Cave"],
        answerIndex: 0,
        explanation: "The Old Chateau is an abandoned mansion in Eterna Forest home to ghosts, rare desserts (Old Gateau), and Rotom."
      },
      {
        id: "sinnoh_19",
        question: "What mysterious island contains a portal to the Distortion World if Giratina is not caught at Spear Pillar?",
        options: ["Sendoff Spring & Turnback Cave", "Fullmoon Island", "Iron Island", "Stark Mountain"],
        answerIndex: 0,
        explanation: "Sendoff Spring is known as the Fourth Lake of Sinnoh, concealing Turnback Cave's link to the Distortion World."
      },
      {
        id: "sinnoh_20",
        question: "What library city in western Sinnoh contains ancient myth books detailing Pokémon-human marriage and primordial genesis?",
        options: ["Canalave City", "Jubilife City", "Sunyshore City", "Oreburgh City"],
        answerIndex: 0,
        explanation: "The Canalave Library holds ancient myth folktales describing primeval history and Sinnoh customs."
      }
    ]
  },
  {
    region: "Unova",
    themeTitle: "Truth vs Ideals & The Tao Dragon Split",
    themeDescription: "Unova mythos focuses on moral duality, the division of the Original Dragon into Reshiram, Zekrom, and Kyurem, and the Swords of Justice.",
    badgeColor: "border-purple-500/40 text-purple-400 bg-purple-950/30",
    questions: [
      {
        id: "unova_1",
        question: "What was the singular ancient entity that split into Reshiram and Zekrom when twin hero princes clashed?",
        options: ["The Original Dragon", "Kyurem", "Arceus", "Victini"],
        answerIndex: 0,
        explanation: "The Original Dragon split into Reshiram (Truth) and Zekrom (Ideals) due to ideological warfare between twin princes."
      },
      {
        id: "unova_2",
        question: "Which white dragon seeks the absolute Truth and burns the world with blazing turbo-flare jet engines?",
        options: ["Reshiram", "Zekrom", "Kyurem", "Palkia"],
        answerIndex: 0,
        explanation: "Reshiram guides heroes seeking the pursuit of absolute Truth with scorch-tail turbine engines."
      },
      {
        id: "unova_3",
        question: "Which black dragon embodies Ideals and channels furious lightning through its generator tail?",
        options: ["Zekrom", "Reshiram", "Kyurem", "Thundurus"],
        answerIndex: 0,
        explanation: "Zekrom assists heroes seeking noble Ideals with high-voltage lightning storms."
      },
      {
        id: "unova_4",
        question: "What frozen hollow shell was left behind when the Original Dragon split into two?",
        options: ["Kyurem", "Genesect", "Necrozma", "Regice"],
        answerIndex: 0,
        explanation: "Kyurem is the frozen husk remaining after the split, longing to be filled with truth or ideals."
      },
      {
        id: "unova_5",
        question: "Which item allows Kyurem to recombine with Reshiram or Zekrom into White or Black Kyurem?",
        options: ["DNA Splicers", "Adamant Crystal", "Prison Bottle", "Dragon Core"],
        answerIndex: 0,
        explanation: "The DNA Splicers fuse Kyurem with Reshiram or Zekrom to reabsorb their dragon genetic energy."
      },
      {
        id: "unova_6",
        question: "Which quadrupedal quartet of legendary Pokémon protected wild Pokémon from devastating human wars in Unova?",
        options: ["The Swords of Justice (Cobalion, Terrakion, Virizion, Keldeo)", "The Forces of Nature", "The Tao Dragons", "The Lake Guardians"],
        answerIndex: 0,
        explanation: "The Swords of Justice defended forest Pokémon during the Moor of Icirrus fire caused by human conflicts."
      },
      {
        id: "unova_7",
        question: "Which mythical Pokémon represents infinite victory and produces limitless radiant energy from its core?",
        options: ["Victini", "Meloetta", "Keldeo", "Genesect"],
        answerIndex: 0,
        explanation: "Victini is said to bring absolute victory to any trainer who befriends it, generating infinite stamina."
      },
      {
        id: "unova_8",
        question: "Which ancient Paleozoic bug predator was excavated and mechanically modified by Team Plasma with a cannon?",
        options: ["Genesect", "Kabutops", "Durant", "Scolipede"],
        answerIndex: 0,
        explanation: "Genesect was an ancient apex hunter 300 million years ago, resurrected and cybernetically upgraded by Team Plasma."
      },
      {
        id: "unova_9",
        question: "Which trio of deities governs the violent weather forces of wind, lightning, and fertile earth in Unova?",
        options: ["Tornadus, Thundurus, Landorus", "Articuno, Zapdos, Moltres", "Raikou, Entei, Suicune", "Kyurem, Reshiram, Zekrom"],
        answerIndex: 0,
        explanation: "The Forces of Nature (Kami trio) control storms, with Landorus reigning in the destructive tempests of Tornadus and Thundurus."
      },
      {
        id: "unova_10",
        question: "What desert ruins in central Unova contain ancient sun deity Volcarona and crumbling golden sarcophagi?",
        options: ["Relic Castle", "Dragonspiral Tower", "Giant Chasm", "Abyssal Ruins"],
        answerIndex: 0,
        explanation: "Relic Castle lies buried in the Desert Resort sands, preserving a lost civilization that worshipped Volcarona as a replacement sun."
      },
      {
        id: "unova_11",
        question: "What ancient tower in northern Unova is the oldest standing architectural structure where legendary dragons roost?",
        options: ["Dragonspiral Tower", "Celestial Tower", "Bell Tower", "Prism Tower"],
        answerIndex: 0,
        explanation: "Dragonspiral Tower was built in ancient times as a resting platform for the legendary dragons."
      },
      {
        id: "unova_12",
        question: "What deep crater impact site near Lacunosa Town was believed to have brought Kyurem down from the stars?",
        options: ["Giant Chasm", "Meteor Falls", "Wellspring Cave", "Pinwheel Forest"],
        answerIndex: 0,
        explanation: "Lacunosa Town residents built high walls to protect themselves from the monster residing in the Giant Chasm."
      },
      {
        id: "unova_13",
        question: "What musical mythical Pokémon sings the ancient Relic Song to transform between Aria and Pirouette forms?",
        options: ["Meloetta", "Jirachi", "Chatot", "Chimecho"],
        answerIndex: 0,
        explanation: "Meloetta can switch from Normal/Psychic (Aria) to Normal/Fighting (Pirouette) upon singing the sacred Relic Song."
      },
      {
        id: "unova_14",
        question: "What ancient sunken palace in Undella Bay is covered in cryptic cipher runes describing a benevolent ancient king?",
        options: ["Abyssal Ruins", "Sea Shrine", "Submerged Grotto", "Relic Castle"],
        answerIndex: 0,
        explanation: "The Abyssal Ruins contain 4 floors of ancient cipher-coded tiles praising an ancient king who united the people."
      },
      {
        id: "unova_15",
        question: "Who was crowned king of Team Plasma by Ghetsis under the false premise of liberating Pokémon from humans?",
        options: ["N (Natural Harmonia Gropius)", "Colress", "Alder", "Cheren"],
        answerIndex: 0,
        explanation: "N was raised among orphaned Pokémon and chosen by Reshiram/Zekrom to build a world where Pokémon roam free."
      },
      {
        id: "unova_16",
        question: "Which scientific leader of Team Plasma sought to unlock the full latent potential of Pokémon through scientific manipulation?",
        options: ["Colress", "Ghetsis", "Charon", "Dr. Fuji"],
        answerIndex: 0,
        explanation: "Colress pursued the ultimate expression of Pokémon power, eventually discovering that human bonds surpass mechanical force."
      },
      {
        id: "unova_17",
        question: "What item in Unova turns into Reshiram or Zekrom when awoken by a pure-hearted hero?",
        options: ["Light Stone & Dark Stone", "Sun Stone & Moon Stone", "Adamant Orb & Lustrous Orb", "Red & Blue Orbs"],
        answerIndex: 0,
        explanation: "Reshiram and Zekrom slumber as dormant crystalline Light and Dark Stones until their prospective heroes call them."
      },
      {
        id: "unova_18",
        question: "What tranquil bell tower on Route 7 rings in memory of deceased Pokémon across Unova?",
        options: ["Celestial Tower", "Sprout Tower", "Pokémon Tower", "Lost Tower"],
        answerIndex: 0,
        explanation: "Celestial Tower is a memorial tower where trainers ring the topmost bell to comfort resting spirits."
      },
      {
        id: "unova_19",
        question: "What wandering Champion of Unova lost his first partner Volcarona to illness and traveled the region connecting with youth?",
        options: ["Alder", "Iris", "Steven", "Leon"],
        answerIndex: 0,
        explanation: "Alder served as a compassionate roaming Champion, passing the torch to Iris in later years."
      },
      {
        id: "unova_20",
        question: "What bustling modern bridge in Unova is the longest suspension bridge in the Pokémon world?",
        options: ["Skyarrow Bridge", "Driftveil Drawbridge", "Tubeline Bridge", "Village Bridge"],
        answerIndex: 0,
        explanation: "Skyarrow Bridge connects Pinwheel Forest to Castelia City, showcasing Unova's grand metropolitan engineering."
      }
    ]
  },
  {
    region: "Kalos",
    themeTitle: "Life, Death & The Ultimate Weapon",
    themeDescription: "Kalos mythology explores immortality, entropic destruction, the 3,000-year-old Ultimate Weapon, and Mega Evolution.",
    badgeColor: "border-pink-500/40 text-pink-400 bg-pink-950/30",
    questions: [
      {
        id: "kalos_1",
        question: "Which legendary stag Pokémon radiates eternal life energy and transforms into a shining tree when resting?",
        options: ["Xerneas", "Yveltal", "Zygarde", "Sawsbuck"],
        answerIndex: 0,
        explanation: "Xerneas shares eternal life through its horns and slumbers for a millennium in the form of a radiant tree."
      },
      {
        id: "kalos_2",
        question: "Which avian harbinger of destruction absorbs the life force of all living creatures upon entering cocoon dormancy?",
        options: ["Yveltal", "Xerneas", "Zygarde", "Darkrai"],
        answerIndex: 0,
        explanation: "Yveltal absorbs biological life energy with its Oblivion Wing, sealing itself in an ominous dark cocoon."
      },
      {
        id: "kalos_3",
        question: "Which ecological deity monitors environmental equilibrium using dispersed Cores and Cells across the globe?",
        options: ["Zygarde", "Arceus", "Rayquaza", "Volcanion"],
        answerIndex: 0,
        explanation: "Zygarde synthesizes its 10%, 50%, and 100% Complete Formes from microscopic cells scattered throughout nature."
      },
      {
        id: "kalos_4",
        question: "What ancient machine built by King AZ 3,000 years ago utilized Pokémon life energy to end the ancient Kalos war?",
        options: ["The Ultimate Weapon", "The Infinity Core", "The Prism Generator", "The DNA Splicer"],
        answerIndex: 0,
        explanation: "King AZ constructed the Ultimate Weapon in Geosenge Town to resurrect his beloved Floette, destroying both armies."
      },
      {
        id: "kalos_5",
        question: "What celestial phenomenon is believed to have created Mega Stones from regular evolutionary stones 3,000 years ago?",
        options: ["The blast radiation of the Ultimate Weapon and Rayquaza's meteor", "A Solar Flare from Solgaleo", "The explosion of Meteor Falls", "The birth of Arceus"],
        answerIndex: 0,
        explanation: "The beam of the Ultimate Weapon radiated into evolutionary stones, transforming them into Mega Stones."
      },
      {
        id: "kalos_6",
        question: "Which mythical jewel Pokémon was created through high-pressure subterranean mutation of a Carbink?",
        options: ["Diancie", "Sableye", "Starmie", "Minior"],
        answerIndex: 0,
        explanation: "Diancie is a sudden mutation of Carbink that can compress carbon in its hands to form shimmering diamonds."
      },
      {
        id: "kalos_7",
        question: "Which mythical djinn Pokémon possesses dimensional golden rings capable of transporting islands and legendary beasts?",
        options: ["Hoopa (Unbound)", "Volcanion", "Magearna", "Marshadow"],
        answerIndex: 0,
        explanation: "Hoopa uses its interdimensional rings to teleport objects and entire legendary Pokémon across time and space."
      },
      {
        id: "kalos_8",
        question: "What unique steam-engine Pokémon generates boiling steam inside its arms by combining water and fire internal reservoirs?",
        options: ["Volcanion", "Heatran", "Castform", "Magmortar"],
        answerIndex: 0,
        explanation: "Volcanion expels internal steam with enough force to blow away mountains, standing as the only Fire/Water dual type."
      },
      {
        id: "kalos_9",
        question: "What massive crystalline monument in Anistar City acts as an ancient sundial linked to Mega Evolution?",
        options: ["The Anistar Sundial", "The Prism Tower", "The Geosenge Pillars", "The Shalour Tower"],
        answerIndex: 0,
        explanation: "The Anistar Sundial absorbs sunlight and channels cosmic energy, upgrading the Mega Ring between 8 PM and 9 PM."
      },
      {
        id: "kalos_10",
        question: "What coastal tower in Shalour City is the historic sanctuary where trainers learn the mastery of Mega Evolution from Korrina?",
        options: ["Tower of Mastery", "Prism Tower", "Dragonspiral Tower", "Sky Pillar"],
        answerIndex: 0,
        explanation: "The Tower of Mastery houses the Lucario statue and tests trainers worthy of wielding Key Stones."
      },
      {
        id: "kalos_11",
        question: "What ancient, deeply saddened nine-foot-tall king wandered Kalos for 3,000 years searching for his Eternal Floette?",
        options: ["AZ", "Lysandre", "Professor Sycamore", "Wulfric"],
        answerIndex: 0,
        explanation: "AZ was cursed with immortality after firing the Ultimate Weapon, wandering the earth until reuniting with Floette."
      },
      {
        id: "kalos_12",
        question: "What magnificent golden palace on Route 6 was built by an ancient Kalos king to celebrate victory with statues of Reshiram?",
        options: ["Parfum Palace", "Shalour Castle", "Lumiose Palace", "Camberley Manor"],
        answerIndex: 0,
        explanation: "Parfum Palace features sprawling hedge mazes and grand historic artifacts showcasing Kalos royalty."
      },
      {
        id: "kalos_13",
        question: "What central architectural monument in Lumiose City serves as the regional Gym run by Clemont?",
        options: ["Prism Tower", "Eiffel Spire", "Lumiose Spire", "Anistar Sundial"],
        answerIndex: 0,
        explanation: "Prism Tower is the electrical heart of Lumiose City and its official Electric-type League Gym."
      },
      {
        id: "kalos_14",
        question: "What organization led by Lysandre sought to purify the world by wiping out human life using the Ultimate Weapon?",
        options: ["Team Flare", "Team Plasma", "Team Galactic", "Team Rocket"],
        answerIndex: 0,
        explanation: "Team Flare believed human greed ruined the planet's beauty, attempting to eliminate all but their chosen members."
      },
      {
        id: "kalos_15",
        question: "Which artificial clockwork Pokémon was created 500 years ago by an ancient kingdom scientist using human soul energy (Soul-Heart)?",
        options: ["Magearna", "Golurk", "Genesect", "Porygon"],
        answerIndex: 0,
        explanation: "Magearna was crafted by Nikola 500 years ago as a gift for a princess, driven by its conscious Soul-Heart core."
      },
      {
        id: "kalos_16",
        question: "What Champion of Kalos is a famous movie star and connoisseur of Mega Evolution with her Mega Gardevoir?",
        options: ["Diantha", "Cynthia", "Iris", "Malva"],
        answerIndex: 0,
        explanation: "Diantha balances her international film career with her responsibilities as Kalos League Champion."
      },
      {
        id: "kalos_17",
        question: "What deep mining cavern on Route 18 was closed down after miners disturbed the resting chamber of Zygarde 50%?",
        options: ["Terminus Cave", "Glittering Cave", "Connecting Cave", "Seafoam Islands"],
        answerIndex: 0,
        explanation: "Terminus Cave leads down into dark abandoned shafts where Zygarde 50% monitors planetary health."
      },
      {
        id: "kalos_18",
        question: "What mysterious facility in the northern Lumiose Badlands harnesses geothermal electricity and was hijacked by Team Flare?",
        options: ["Kalos Power Plant", "Devon Labs", "Silph Co.", "Weather Institute"],
        answerIndex: 0,
        explanation: "The Kalos Power Plant produces clean sun and wind energy in the desolate Lumiose Badlands."
      },
      {
        id: "kalos_19",
        question: "What unique genetic phenomenon occurs between Ash and his Greninja, transforming it into Ash-Greninja?",
        options: ["Battle Bond", "Mega Evolution", "Primal Reversion", "Z-Power Resonance"],
        answerIndex: 0,
        explanation: "The Battle Bond ability occurs once every few centuries when trainer and Pokémon sync their willpower perfectly."
      },
      {
        id: "kalos_20",
        question: "What ancient town filled with standing dolmen megaliths was the site where the Ultimate Weapon was buried?",
        options: ["Geosenge Town", "Dendemille Town", "Laverre City", "Coumarine City"],
        answerIndex: 0,
        explanation: "Geosenge Town is ringed by ancient megalith standing stones, concealing the buried Ultimate Weapon underneath."
      }
    ]
  },
  {
    region: "Alola",
    themeTitle: "Ultra Space & The Solar/Lunar Emissaries",
    themeDescription: "Alolan mythos centers on island guardians, solar/lunar deities, interdimensional Ultra Beasts, and Necrozma's light theft.",
    badgeColor: "border-orange-500/40 text-orange-400 bg-orange-950/30",
    questions: [
      {
        id: "alola_1",
        question: "Which four elemental guardian deities protect the natural islands of Melemele, Akala, Ula'ula, and Poni?",
        options: ["Tapu Koko, Tapu Lele, Tapu Bulu, Tapu Fini", "Articuno, Zapdos, Moltres, Lugia", "Uxie, Mesprit, Azelf, Arceus", "Cobalion, Terrakion, Virizion, Keldeo"],
        answerIndex: 0,
        explanation: "The four Tapu deities guard their respective islands, electing Island Kahunas and maintaining natural harmony."
      },
      {
        id: "alola_2",
        question: "Which solar emissary Pokémon is hailed as 'the beast that devours the sun' in ancient Alolan texts?",
        options: ["Solgaleo", "Lunala", "Necrozma", "Volcarona"],
        answerIndex: 0,
        explanation: "Solgaleo is the Radiant Sun emissary, channeling solar brilliance through its Radiant Sun phase."
      },
      {
        id: "alola_3",
        question: "Which lunar emissary Pokémon is revered as 'the beast that calls the moon' in Alolan myth?",
        options: ["Lunala", "Solgaleo", "Cresselia", "Darkrai"],
        answerIndex: 0,
        explanation: "Lunala shines as the Full Moon emissary, flying across the night skies in its Full Moon phase."
      },
      {
        id: "alola_4",
        question: "Which light-devouring prism dragon stole all light from Ultra Megalopolis before invading Alola?",
        options: ["Necrozma", "Giratina", "Kyurem", "Guzzlord"],
        answerIndex: 0,
        explanation: "Necrozma lost its true form and light in ancient times, absorbing Solgaleo or Lunala to become Ultra Necrozma."
      },
      {
        id: "alola_5",
        question: "What mysterious interdimensional gateways open throughout Alola, allowing Ultra Beasts to spill into our world?",
        options: ["Ultra Wormholes", "Distortion Portals", "Hoopa Rings", "Space Rifts"],
        answerIndex: 0,
        explanation: "Ultra Wormholes connect our world to alien dimensions such as Ultra Deep Sea and Ultra Plant."
      },
      {
        id: "alola_6",
        question: "What synthetic beast killer was engineered by the Aether Foundation using DNA of all types to combat Ultra Beasts?",
        options: ["Type: Null & Silvally", "Mewtwo", "Genesect", "Porygon-Z"],
        answerIndex: 0,
        explanation: "The Aether Foundation created Type: Null (formerly 'Beast Killer') which evolves into Silvally through true friendship."
      },
      {
        id: "alola_7",
        question: "What crystalline artifacts channel the natural Z-Power of Alola into devastating ultimate battle techniques?",
        options: ["Z-Crystals & Z-Rings", "Mega Stones", "Tera Orbs", "Dynamax Bands"],
        answerIndex: 0,
        explanation: "Z-Crystals (derived from the radiant body parts of Necrozma) unleash devastating Z-Moves."
      },
      {
        id: "alola_8",
        question: "What tiny gaseous nebula Pokémon evolves into the massive dense star Cosmoem and eventually Solgaleo or Lunala?",
        options: ["Cosmog", "Poipole", "Minior", "Solosis"],
        answerIndex: 0,
        explanation: "Cosmog ('Nebby') is a celestial being that condenses into the 2,200 lb Cosmoem before becoming a legendary emissary."
      },
      {
        id: "alola_9",
        question: "What artificial floating conservation sanctuary was constructed by President Lusamine in the sea between islands?",
        options: ["Aether Paradise", "Po Town", "Brooklet Hill", "Mount Lanakila"],
        answerIndex: 0,
        explanation: "Aether Paradise is a colossal man-made island serving as a wildlife refuge and secret research facility."
      },
      {
        id: "alola_10",
        question: "Which black shadow-stalker mythical Pokémon conceals itself within shadows to mimic and enhance human martial arts?",
        options: ["Marshadow", "Zeraora", "Magearna", "Darkrai"],
        answerIndex: 0,
        explanation: "Marshadow can slip into any entity's shadow, deciphering their thoughts and duplicating their physical power."
      },
      {
        id: "alola_11",
        question: "Which high-speed electric mythical Pokémon generates powerful magnetic fields from its electrified paws without an internal organ?",
        options: ["Zeraora", "Raikou", "Tapu Koko", "Electivire"],
        answerIndex: 0,
        explanation: "Zeraora runs at lightning speeds by emitting high-voltage electricity through its paw pads."
      },
      {
        id: "alola_12",
        question: "Which massive Ultra Beast resembles a voracious black chasm with dual arm-like mouths, consuming entire landscapes?",
        options: ["Guzzlord (UB-05 Glutton)", "Nihilego", "Buzzwole", "Kartana"],
        answerIndex: 0,
        explanation: "Guzzlord devours mountains, buildings, and toxic waste, leaving no waste behind due to its extreme metabolism."
      },
      {
        id: "alola_13",
        question: "Which parasitic glass-like jellyfish Ultra Beast injects neurotoxins that stimulate extreme aggression and obsession in humans?",
        options: ["Nihilego (UB-01 Symbiont)", "Pheromosa", "Celesteela", "Poipole"],
        answerIndex: 0,
        explanation: "Nihilego acts as a parasitic neural symbiote, merging with hosts like Lusamine to unlock violent uninhibited behavior."
      },
      {
        id: "alola_14",
        question: "What origami-thin Ultra Beast can slice through steel towers with its razor-sharp paper-thin blades?",
        options: ["Kartana (UB-04 Blade)", "Buzzwole", "Xurkitree", "Blacephalon"],
        answerIndex: 0,
        explanation: "Kartana is lightweight and flat like paper, yet its edges can effortlessly slice giant iron structures in half."
      },
      {
        id: "alola_15",
        question: "What traditional rite of passage takes the place of standard Gym challenges across the Alola region?",
        options: ["The Island Challenge (Grand Trials & Totem Trials)", "The Battle Frontier", "The Indigo League", "The Gym Challenge"],
        answerIndex: 0,
        explanation: "Young trainers undertake the Island Challenge, defeating Totem Pokémon and the four Kahunas."
      },
      {
        id: "alola_16",
        question: "What lonely Ghost/Fairy Pokémon crafts a crude Pikachu costume to be loved by humans because its true form is terrifying?",
        options: ["Mimikyu", "Banette", "Gengar", "Sableye"],
        answerIndex: 0,
        explanation: "Mimikyu wears a disguise modeled after popular Pikachu merchandise so people will not faint from viewing its real body."
      },
      {
        id: "alola_17",
        question: "What snowy peak on Ula'ula Island was chosen as the site for Alola's newly founded Pokémon League by Professor Kukui?",
        options: ["Mount Lanakila", "Mount Hokulani", "Wela Volcano", "Haina Desert"],
        answerIndex: 0,
        explanation: "Mount Lanakila is the highest mountain in Alola, housing the newly inaugurated Pokémon League summit."
      },
      {
        id: "alola_18",
        question: "What walled, rain-soaked town in northern Ula'ula Island was occupied and covered in graffiti by Team Skull?",
        options: ["Po Town", "Malie City", "Konikoni City", "Hau'oli City"],
        answerIndex: 0,
        explanation: "Po Town was seized by Guzma and Team Skull as their barricaded hangout."
      },
      {
        id: "alola_19",
        question: "Which Poison-type baby Ultra Beast is affectionately kept as a starter partner by the Ultra Recon Squad?",
        options: ["Poipole (UB Adhesive)", "Naganadel", "Cosmog", "Stakataka"],
        answerIndex: 0,
        explanation: "Poipole is an expressive, friendly Ultra Beast that evolves into Naganadel upon learning Dragon Pulse."
      },
      {
        id: "alola_20",
        question: "What stone fortress Ultra Beast is made of hundreds of living quadrangular rock eye-bricks stacked into a tower?",
        options: ["Stakataka (UB Assembly)", "Blacephalon", "Regirock", "Guzzlord"],
        answerIndex: 0,
        explanation: "Stakataka appears as a stone building, with each individual stone being a distinct lifeform."
      }
    ]
  },
  {
    region: "Galar",
    themeTitle: "The Darkest Day & The Rusted Legends",
    themeDescription: "Galar lore focuses on the Darkest Day 3,000 years ago, Eternatus's dynamax storm, Zacian & Zamazenta, and Calyrex's steeds.",
    badgeColor: "border-cyan-500/40 text-cyan-400 bg-cyan-950/30",
    questions: [
      {
        id: "galar_1",
        question: "What cataclysmic event occurred 3,000 years ago when Eternatus nearly destroyed the Galar region with a dynamax storm?",
        options: ["The Darkest Day", "The Ultimate War", "The Primal Drought", "The Lightless Eclipse"],
        answerIndex: 0,
        explanation: "The Darkest Day saw Eternatus leak massive gigantamax energy across Galar, plunging the region into chaotic red storms."
      },
      {
        id: "galar_2",
        question: "Which twin wolf kings wielded ancient weapons to vanquish the Darkest Day before falling into slumber in Slumbering Weald?",
        options: ["Zacian & Zamazenta", "Solgaleo & Lunala", "Reshiram & Zekrom", "Latios & Latias"],
        answerIndex: 0,
        explanation: "Zacian (The Crowned Sword) and Zamazenta (The Crowned Shield) united with human kings to defeat Eternatus."
      },
      {
        id: "galar_3",
        question: "What colossal poison/dragon core brought Dynamax energy to Galar via falling Wishing Stars 20,000 years ago?",
        options: ["Eternatus", "Rayquaza", "Necrozma", "Giratina"],
        answerIndex: 0,
        explanation: "Eternatus arrived on a meteorite, emitting Galar Particles and Wishing Stars that fuel the Dynamax phenomenon."
      },
      {
        id: "galar_4",
        question: "Which mythical sovereign Pokémon is revered as the King of Bountiful Harvests in the Crown Tundra?",
        options: ["Calyrex", "Zarude", "Kubfu", "Urshifu"],
        answerIndex: 0,
        explanation: "Calyrex ruled ancient Galar with supreme intelligence, causing crops to bloom instantly and healing wounded land."
      },
      {
        id: "galar_5",
        question: "Which two legendary steeds can Calyrex tame using the Reins of Unity to ride into battle?",
        options: ["Glastrier (Ice) & Spectrier (Ghost)", "Rapidash & Mudsdale", "Raikou & Entei", "Cobalion & Terrakion"],
        answerIndex: 0,
        explanation: "Calyrex mounts Glastrier (Ice Rider) or Spectrier (Shadow Rider) using the sacred Reins of Unity."
      },
      {
        id: "galar_6",
        question: "Which fighting bear apprentice trains in either the Tower of Darkness or Tower of Waters to master Single or Rapid Strike styles?",
        options: ["Kubfu & Urshifu", "Pangoro", "Bewear", "Ursaring"],
        answerIndex: 0,
        explanation: "Kubfu trains on the Isle of Armor, evolving into Urshifu Single Strike (Fighting/Dark) or Rapid Strike (Fighting/Water)."
      },
      {
        id: "galar_7",
        question: "Which two ancient giants represent the sealed dragon and electric titan expansions in the Crown Tundra temples?",
        options: ["Regidrago & Regieleki", "Regirock & Regice", "Dialga & Palkia", "Zekrom & Reshiram"],
        answerIndex: 0,
        explanation: "Regieleki (pure electricity) and Regidrago (pure dragon energy) were constructed by Regigigas and sealed in Crown Tundra."
      },
      {
        id: "galar_8",
        question: "What mysterious fog-shrouded ancient forest at the edge of Postwick conceals the Rusted Sword and Rusted Shield?",
        options: ["Slumbering Weald", "Glimwood Tangle", "Ballonlea Forest", "Dappled Grove"],
        answerIndex: 0,
        explanation: "Slumbering Weald is a mystical forest home to the resting shrine of Zacian and Zamazenta."
      },
      {
        id: "galar_9",
        question: "What luminescent fairy settlement deep in the glowing mushroom forests of Galar is overseen by Gym Leader Opal?",
        options: ["Ballonlea", "Circhester", "Hammerlocke", "Motostoke"],
        answerIndex: 0,
        explanation: "Ballonlea is tucked within the Glimwood Tangle, illuminated by vibrant glowing mushrooms."
      },
      {
        id: "galar_10",
        question: "What industrial powerhouse city in central Galar features an ancient medieval castle housing the energy plant?",
        options: ["Hammerlocke", "Motostoke", "Wyndon", "Circhester"],
        answerIndex: 0,
        explanation: "Hammerlocke Castle was reinforced with modern technology by Chairman Rose to harbor the Energy Plant under the stadium."
      },
      {
        id: "galar_11",
        question: "What rogue warrior mythical Pokémon inhabits the dense canopy of the Forest of Okoya, swinging with vines?",
        options: ["Zarude", "Rillaboom", "Passimian", "Marshadow"],
        answerIndex: 0,
        explanation: "Zarude grows vines from its wrists, living in hierarchical packs and using Jungle Healing."
      },
      {
        id: "galar_12",
        question: "What mineralized pieces of Eternatus's ancient shell are collected by trainers to craft Dynamax Bands?",
        options: ["Wishing Stars", "Z-Crystals", "Mega Stones", "Tera Shards"],
        answerIndex: 0,
        explanation: "Wishing Stars fall from the sky and emit red particles that enable Pokémon to Dynamax at Power Spots."
      },
      {
        id: "galar_13",
        question: "What mismatched fossil abominations did researcher Cara Liss create by combining incompatible halves on Route 6?",
        options: ["Dracovish, Dracozolt, Arctovish, Arctozolt", "Omanyte & Kabuto", "Tyrunt & Amaura", "Cranidos & Shieldon"],
        answerIndex: 0,
        explanation: "Cara Liss famously combined mismatched fossil halves to produce the bizarre chimeric species like Dracovish."
      },
      {
        id: "galar_14",
        question: "What undefeated Champion of Galar commanded Charizard and was known for having zero sense of direction?",
        options: ["Leon", "Hop", "Raihan", "Peony"],
        answerIndex: 0,
        explanation: "Leon was Galar's superstar Champion, renowned for his sportsmanship, Charizard, and getting comically lost."
      },
      {
        id: "galar_15",
        question: "What dragon specialist Gym Leader of Hammerlocke is Leon's fiercest rival and commands sandstorm weather tactics?",
        options: ["Raihan", "Kabu", "Gordie", "Piers"],
        answerIndex: 0,
        explanation: "Raihan takes selfies mid-battle and harnesses severe weather dynamics with his signature Duraludon."
      },
      {
        id: "galar_16",
        question: "What rock-and-roll Dark-type Gym Leader in Spikemuth refused to Dynamax his Pokémon during battles?",
        options: ["Piers", "Marnie", "Bede", "Allister"],
        answerIndex: 0,
        explanation: "Piers and Spikemuth Gym operate without Power Spots, battling purely with raw tactics and musical passion."
      },
      {
        id: "galar_17",
        question: "What vast open wilderness area in central Galar features dynamically shifting biomes and roaming wild Pokémon?",
        options: ["The Wild Area", "Isle of Armor", "Crown Tundra", "Slumbering Weald"],
        answerIndex: 0,
        explanation: "The Wild Area spans massive expanses of wilderness with Pokémon Dens connected to the Dynamax network."
      },
      {
        id: "galar_18",
        question: "What ancient tea master Pokémon species possesses a stamp of authenticity on its bottom rim to prove it is not counterfeit?",
        options: ["Sinistea & Polteageist (Antique Form)", "Poltchageist", "Applin", "Alcremie"],
        answerIndex: 0,
        explanation: "Antique Sinistea and Polteageist feature a genuine forgery-proof seal on the underside of their porcelain."
      },
      {
        id: "galar_19",
        question: "What supreme battle master and former Champion runs the Master Dojo on the Isle of Armor?",
        options: ["Mustard", "Peony", "Leon", "Kabu"],
        answerIndex: 0,
        explanation: "Master Mustard held the Galar Championship for 18 consecutive years before training Leon and the protagonist."
      },
      {
        id: "galar_20",
        question: "What hot-headed expedition leader guides players through legendary Dynamax Adventures in the Crown Tundra?",
        options: ["Peony (Chairman Rose's brother)", "Peonia", "Professor Magnolia", "Sonia"],
        answerIndex: 0,
        explanation: "Peony (former Steel Gym Leader and Champion) leads expeditions into the subterranean Max Lair."
      }
    ]
  },
  {
    region: "Paldea",
    themeTitle: "The Great Crater, Paradox Beings & The Terastal Matrix",
    themeDescription: "Paldea lore explores Area Zero, the Terastal crystal core, ancient and future Paradox creatures, and the cursed Treasures of Ruin.",
    badgeColor: "border-violet-500/40 text-violet-400 bg-violet-950/30",
    questions: [
      {
        id: "paldea_1",
        question: "What giant crystal turtle deity resting in the Underdepths of Area Zero is the origin of the Terastal phenomenon?",
        options: ["Terapagos", "Koraidon", "Miraidon", "Pecharunt"],
        answerIndex: 0,
        explanation: "Terapagos embodies the Terastal energy, crystallizing surrounding matter into Stellar and elemental types."
      },
      {
        id: "paldea_2",
        question: "What mysterious geological depression in the center of Paldea has been sealed off due to extreme danger for centuries?",
        options: ["The Great Crater of Paldea (Area Zero)", "Asado Desert", "Casseroya Lake", "Dalizapa Passage"],
        answerIndex: 0,
        explanation: "The Great Crater of Paldea (Area Zero) descends into a crystalline abyss harboring Paradox Pokémon."
      },
      {
        id: "paldea_3",
        question: "Which ancient Paradox Pokémon known as the 'Winged King' serves as the scarlet companion in Paldea?",
        options: ["Koraidon (Ancient Cyclizar)", "Roaring Moon", "Great Tusk", "Walking Wake"],
        answerIndex: 0,
        explanation: "Koraidon is the prehistoric ancestor of Cyclizar, possessing raw solar power and apex fighting instincts."
      },
      {
        id: "paldea_4",
        question: "Which futuristic cybernetic Paradox Pokémon known as the 'Iron Serpent' glides with twin hover drives?",
        options: ["Miraidon (Future Cyclizar)", "Iron Valiant", "Iron Leaves", "Iron Hands"],
        answerIndex: 0,
        explanation: "Miraidon is the futuristic descendant of Cyclizar, channeling Hadron Engine electric propulsion."
      },
      {
        id: "paldea_5",
        question: "What four cursed entities brought ruin to an ancient Paldean king when infused with negative human emotions?",
        options: ["The Treasures of Ruin (Wo-Chien, Chien-Pao, Ting-Lu, Chi-Yu)", "The Loyal Three", "The Tapu Guardians", "The Swords of Justice"],
        answerIndex: 0,
        explanation: "The Treasures of Ruin were cursed artifacts (wooden tablets, sword, ritual vessel, beads) that awoke as destructive beasts."
      },
      {
        id: "paldea_6",
        question: "Which ogre Pokémon of Kitakami wears four distinct elemental masks to shift typing and Terastal capabilities?",
        options: ["Ogerpon", "Pecharunt", "Okidogi", "Fezandipiti"],
        answerIndex: 0,
        explanation: "Ogerpon changes between Teal, Wellspring, Hearthflame, and Cornerstone forms when equipping her masks."
      },
      {
        id: "paldea_7",
        question: "Which mythical mochi Pokémon manipulated the Loyal Three (Okidogi, Munkidori, Fezandipiti) with toxic binding chains?",
        options: ["Pecharunt", "Ogerpon", "Hoopa", "Marshadow"],
        answerIndex: 0,
        explanation: "Pecharunt feeds Binding Mochi to Pokémon and humans, controlling their minds through toxic greed."
      },
      {
        id: "paldea_8",
        question: "What ancient expedition journal written by author Heath documented Paradox Pokémon in Area Zero 200 years ago?",
        options: ["The Scarlet / Violet Book", "The Occulture Magazine", "The Sinnoh Myth Book", "The Silph Reports"],
        answerIndex: 0,
        explanation: "Heath's expedition journal illustrated mysterious sketches of Great Tusk, Iron Treads, and the Disk Pokémon."
      },
      {
        id: "paldea_9",
        question: "What high-tech overseas academy in the Unova ocean contains the massive four-biome Terarium?",
        options: ["Blueberry Academy", "Naranja Academy", "Uva Academy", "Indigo Academy"],
        answerIndex: 0,
        explanation: "Blueberry Academy features a massive undersea Terarium with Savannah, Coastal, Canyon, and Polar biomes."
      },
      {
        id: "paldea_10",
        question: "What 19th Terastal type combines the strengths of all 18 elemental types, retaining base defensive profiles?",
        options: ["Stellar Type", "Cosmic Type", "Infinity Type", "Origin Type"],
        answerIndex: 0,
        explanation: "The Stellar Tera type supercharges every elemental move once while preserving the user's natural resistances."
      },
      {
        id: "paldea_11",
        question: "Which ancient Paradox Pokémon is a ferocious prehistoric relative of the dragon Salamence?",
        options: ["Roaring Moon", "Flutter Mane", "Scream Tail", "Brute Bonnet"],
        answerIndex: 0,
        explanation: "Roaring Moon resembles ancient illustrations of Mega Salamence with jagged blood-red wings."
      },
      {
        id: "paldea_12",
        question: "Which future Paradox Pokémon is a robotic synthetic fusion of Gardevoir and Gallade wielding light-blades?",
        options: ["Iron Valiant", "Iron Bundle", "Iron Thorns", "Iron Jugulis"],
        answerIndex: 0,
        explanation: "Iron Valiant was engineered by a mad scientist attempting to forge the ultimate psychic-fairy swordsman."
      },
      {
        id: "paldea_13",
        question: "What culinary Titan herb was discovered in Area Zero and used by Arven to heal his injured Mabosstiff?",
        options: ["Herba Mystica (Sweet, Salty, Bitter, Sour, Spicy)", "Gracidea Flower", "Revival Herb", "Big Root"],
        answerIndex: 0,
        explanation: "The five Herba Mystica possess profound regenerative properties, guarded by gargantuan Titan Pokémon."
      },
      {
        id: "paldea_14",
        question: "What group of truant academy students founded five operational bases across Paldea under Big Boss Penny?",
        options: ["Team Star", "Team Skull", "Team Yell", "Team Plasma"],
        answerIndex: 0,
        explanation: "Team Star formed Operation Starfall to defend bullied students against academy intimidation."
      },
      {
        id: "paldea_15",
        question: "Which eccentric streamer and Levincia Gym Leader quizzes challengers on her viral web broadcast?",
        options: ["Iono", "Rika", "Grusha", "Tulip"],
        answerIndex: 0,
        explanation: "Iono streams her battles live to millions, commanding her signature Bellibolt with electric traps."
      },
      {
        id: "paldea_16",
        question: "What tired, overworked Normal-type Gym Leader and Elite Four member secretly works for the Pokémon League office?",
        options: ["Larry", "Geeta", "Hassel", "Poppy"],
        answerIndex: 0,
        explanation: "Larry is a quintessential salaryman who battles pragmatically at the Medali eatery and the League."
      },
      {
        id: "paldea_17",
        question: "What top Champion and chairwoman of the Paldea League oversees the talent accreditation of the region?",
        options: ["Geeta (La Primera)", "Cynthia", "Diantha", "Nemona"],
        answerIndex: 0,
        explanation: "Geeta evaluates prospective Champion-rank trainers across Paldea, leading the Elite Four."
      },
      {
        id: "paldea_18",
        question: "What battle-obsessed Champion-rank student council president is your enthusiastic rival in Paldea?",
        options: ["Nemona", "Penny", "Arven", "Carmine"],
        answerIndex: 0,
        explanation: "Nemona achieved Champion rank at a young age and enthusiastically mentors new trainers to battle at full strength."
      },
      {
        id: "paldea_19",
        question: "What legendary paradox trio represents the ancient prehistoric incarnations of the Johto legendary beasts?",
        options: ["Walking Wake, Gouging Fire, Raging Bolt", "Raikou, Entei, Suicune", "Great Tusk, Scream Tail, Brute Bonnet", "Iron Crown, Iron Boulder, Iron Leaves"],
        answerIndex: 0,
        explanation: "Walking Wake (Suicune), Gouging Fire (Entei), and Raging Bolt (Raikou) resemble primeval dinosaur beasts."
      },
      {
        id: "paldea_20",
        question: "What legendary paradox trio represents the mechanized futuristic incarnations of the Swords of Justice?",
        options: ["Iron Leaves, Iron Boulder, Iron Crown", "Cobalion, Terrakion, Virizion", "Iron Valiant, Iron Bundle, Iron Hands", "Walking Wake, Gouging Fire, Raging Bolt"],
        answerIndex: 0,
        explanation: "Iron Leaves (Virizion), Iron Boulder (Terrakion), and Iron Crown (Cobalion) are futuristic cybernetic titans."
      }
    ]
  }
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function stripHtmlTags(str: string): string {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '');
}

let examCacheKey = '';
let cachedExams: RegionLoreData[] | null = null;

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

export const PokethologyQuizWidget: React.FC = memo(() => {
  const [activeRegionIndex, setActiveRegionIndex] = useState<number>(0);
  const [userAnswersMap, setUserAnswersMap] = usePersistentState<Record<string, number>>(`pokethology_quiz_answers_${new Date().toISOString().split('T')[0]}`, {});
  const [selectedOptionMap, setSelectedOptionMap] = usePersistentState<Record<string, number>>(`pokethology_quiz_selected_${new Date().toISOString().split('T')[0]}`, {});
  const [lockedMap, setLockedMap] = usePersistentState<Record<string, boolean>>(`pokethology_quiz_locked_${new Date().toISOString().split('T')[0]}`, {});
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
    const key = `${todayStr}_v3_seed_${customSeed}`;
    if (examCacheKey === key && cachedExams) {
      return cachedExams;
    }
    const baseHash = hashCode(key);
    
    const result = REGION_LORE_DATABASE.map((regionData, rIdx) => {
      const pool = [...regionData.questions];
      const count = 3;
      const picked: RegionQuestion[] = [];
      
      for (let i = 0; i < count && pool.length > 0; i++) {
        const rand = seededRandom(baseHash + rIdx * 100 + i * 37);
        const idx = Math.floor(rand * pool.length);
        const item = pool.splice(idx, 1)[0];
        
        // Shuffle option order deterministically for today
        const correctAnswerText = item.options[item.answerIndex];
        const shuffledOpts = [...item.options];
        for (let j = shuffledOpts.length - 1; j > 0; j--) {
          const r2 = seededRandom(baseHash + rIdx * 50 + j * 7 + i * 13);
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
      try {
        let stats = JSON.parse(localStorage.getItem('Pokethology_MissionStats') || '{"pokemonWins":{}, "typeWins":{}, "hubCompletions":0, "examCompletions":0}');
        const currentMonth = new Date().toISOString().slice(0, 7);
        if (stats.lastResetMonth !== currentMonth) {
          stats = { pokemonWins: {}, typeWins: {}, hubCompletions: 0, examCompletions: 0, lastResetMonth: currentMonth };
        }
        stats.examCompletions = (stats.examCompletions || 0) + 1;
        localStorage.setItem('Pokethology_MissionStats', JSON.stringify(stats));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.error("Error updating exam stats", e);
      }
    } else {
      try { sounds.error(); } catch (_) {}
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 text-left font-sans">
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
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-3.5 flex items-center justify-between gap-2 text-left relative overflow-hidden shadow-sm">
        <HUDCorners />
        <h3 className="text-xs xs:text-sm sm:text-base font-hud font-black text-amber-300 uppercase tracking-wider flex items-center gap-2 min-w-0 break-words">
          {React.createElement(REGION_ICONS[currentRegionData.region] || BookOpen, { className: "w-4 h-4 text-amber-400 shrink-0" })}
          <span className="truncate">{currentRegionData.region} Exam</span>
        </h3>
        <span className="text-[9.5px] font-mono text-cyan-400/80 uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20">
          Theory & Lore Certification
        </span>
      </div>

      {/* REGION QUESTIONS LIST */}
      <div className="flex flex-col gap-4">
        {(() => {
          const allLocked = currentRegionData.questions.every((q: any) => lockedMap[q.id]);
          if (allLocked) {
             return (
                <div className="py-12 flex flex-col items-center justify-center gap-4 bg-slate-950/60 rounded-2xl border border-emerald-500/20 mt-2">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(52,211,153,0.2)]">
                    <Award className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-hud font-black text-emerald-400 tracking-widest uppercase text-center">{currentRegionData.region} Cleared</h3>
                  <p className="text-xs text-slate-400 font-mono text-center max-w-sm px-4">
                    All theory questions for this region have been successfully completed. Check back tomorrow for new challenges or generate a new set!
                  </p>
                </div>
             );
          }
          return currentRegionData.questions.map((q, qIndex) => {
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
                      optStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'bg-rose-950/80 border-rose-500 text-rose-300 line-through opacity-80 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
                    } else {
                      optStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    optStyle = 'bg-cyan-950/80 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]';
                  } else {
                    optStyle = 'bg-slate-800 border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-700 transition-colors';
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
                      <div className="flex items-start gap-2">
                        <span className="font-mono font-bold opacity-80 mt-0.5">{String.fromCharCode(65 + optIdx)}.</span>
                        <span className="break-words font-medium">{stripHtmlTags(opt)}</span>
                      </div>
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
                  <div className="flex justify-between items-center mb-1.5 border-b border-slate-800 pb-1.5">
                    <strong className={cn("font-hud uppercase tracking-wider text-[10px]", isCorrect ? "text-emerald-400" : "text-rose-400")}>
                      {isCorrect ? "CORRECT" : "INCORRECT"}
                    </strong>
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">
                      Correct Answer: {String.fromCharCode(65 + q.answerIndex)}
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
        })})()}
      </div>
    </div>
  );
});

PokethologyQuizWidget.displayName = 'PokethologyQuizWidget';
