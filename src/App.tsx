import React, { Suspense } from 'react';
import { idbGet, idbSet, idbGetAll, idbDelete, STORES } from "./lib/indexedDB";
import { checkQuotaAllowed, recordApiUsage } from "./lib/quotaManager";
import { useState, useEffect, useRef, useTransition, useMemo, useCallback, memo } from 'react';

import { Download, Search, Loader2, Database, Sparkles, Volume2, VolumeX, Copy, Check, Send, MessageSquare, Info, X, ChevronLeft, ChevronRight, ChevronDown, Plus, Zap, BrainCircuit, MoveRight, Flame, Moon, Music, HardDrive, Settings, Sun, RotateCcw, Swords, Crosshair, Globe, Layers, Cpu, Book, BookOpen, AlertTriangle, Shield, Skull, TrendingUp, TrendingDown, Target, Activity, Dna, User, RefreshCw, BarChart, CreditCard, Trophy, Star, Clock, ArrowUp, Trash2, Eye, Mic, MicOff, Instagram, Image, Gamepad2, GitFork, Github, ArrowLeftRight, Wifi, WifiOff, Bookmark } from 'lucide-react';
import { EvolutionNodeComponent } from './components/EvolutionNodeComponent';

import { PokethologyLogo } from './components/PokethologyLogo';
import { PokeballIcon } from './components/PokeballIcon';
import { BattleMessage } from './components/BattleMessage';
import { StatChangeEffect } from './components/StatChangeEffect';
import { FloatingText } from './components/FloatingText';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { searchPokemon, getPokemonList, getPokemonByType, GENERATIONS } from './lib/api';
import { useFavorites } from './hooks/useFavorites';
import { useBattleSimulation } from './hooks/useBattleSimulation';
import { Pokemon, EvolutionNode, Move, LogEntry } from './types';
import { sounds } from './lib/sounds';
import { cn, abbreviateType, hudButtonClass, playHaptic } from './lib/utils';
import { getPokemonArtworkUrl, getPokemonSpriteUrl, POKEMON_FORM_IDS } from './lib/pokemonArtwork';
import { PokethologyCombatMissionWidget, getDailyCombatMission, COMBAT_MISSIONS, getRequiredCount } from './components/PokethologyCombatMissionWidget';
import { getDailyHubCombatChallenges } from './utils/dailyHubChallenges';
import { generateCompetitiveMoveset } from './utils/moveset';
import { OpponentStatusBar, PlayerStatusBar } from './components/BattleStatusBars';
import { TypeBadge } from './components/TypeBadge';
import { BattleErrorBoundary } from './components/BattleErrorBoundary';
import { ErrorBoundary } from './components/ErrorBoundary';

import { StatRadar } from './components/StatRadar';
import { SingleStatRadar } from './components/SingleStatRadar';
import Markdown from 'react-markdown';
import { AudioSettings } from './components/AudioSettings';
import { NowPlayingToast } from './components/NowPlayingToast';
import ReactPlayer from 'react-player';

import { pokeApi, isApiError } from './lib/pokeApiService';

// Directly imported UI and modal components for instant rendering
import { BattleResultScreen } from './components/BattleResultScreen';
import { Tutorial } from './components/Tutorial';
import { WelcomeModal } from './components/WelcomeModal';
import { PokethologyQuizWidget } from './components/PokethologyQuizWidget';
import { MoveModal } from './components/MoveModal';
import { MoveDetailModal } from './components/MoveDetailModal';
import { BattleHistory } from './components/BattleHistory';
import { PokethologyMissionModal } from './components/PokethologyMissionModal';
import { AboutModal } from './components/AboutModal';
import { DisclaimerModal, DisclaimerButton } from './components/DisclaimerModal';
import { PwaInstallModal } from './components/PwaInstallModal';
import { OfflineManagerModal } from './components/OfflineManagerModal';
import { PokedexEntrySection } from './components/PokedexEntrySection';
import { PokemonComparisonSidebar } from './components/PokemonComparisonSidebar';
import { AbilitiesSection } from './components/AbilitiesSection';
import { TypeWeaknessesSection } from './components/TypeWeaknessesSection';
import { CombatStatsSection } from './components/CombatStatsSection';
import { MovesetAnalysisSection } from './components/MovesetAnalysisSection';
import { FavoritesVaultModal } from './components/FavoritesVaultModal';
import { TypeChartModal } from './components/TypeChartModal';

const TRAINER_SPRITES = [
  {
    "name": "Brock",
    "id": "brock",
    "role": "Gym Leader",
    "lore": "The Rock-Solid Pok\u00e9mon Trainer. As the Pewter City Gym Leader, he acts as a wall of defense for challengers, believing in the unbreakable spirit of Rock-type Pok\u00e9mon and their enduring fortitude against any storm."
  },
  {
    "name": "Misty",
    "id": "misty",
    "role": "Gym Leader",
    "lore": "The Tomboyish Mermaid of Cerulean City. A fierce Water-type specialist whose tactics flow like a raging river. She balances grace and power, demanding absolute respect for the depths of water strategy."
  },
  {
    "name": "Lt. Surge",
    "id": "ltsurge",
    "role": "Gym Leader",
    "lore": "The Lightning American. A veteran of a vague, historic Pok\u00e9mon war, he uses his military discipline to command Electric-type Pok\u00e9mon with shocking precision and explosive speed from his Vermilion City Gym."
  },
  {
    "name": "Erika",
    "id": "erika",
    "role": "Gym Leader",
    "lore": "The Nature-Loving Princess. A practitioner of traditional flower arrangement in Celadon City. She finds true elegance in Grass-type Pok\u00e9mon, preferring battles that bloom with natural beauty and tranquility."
  },
  {
    "name": "Koga",
    "id": "koga",
    "role": "Gym Leader",
    "lore": "The Poisonous Ninja Master. Relying on confusion, toxins, and shadows, this Fuchsia City Gym Leader treats Pok\u00e9mon battling as an extension of the ancient ninja arts, striking when his foes are least prepared."
  },
  {
    "name": "Sabrina",
    "id": "sabrina",
    "role": "Gym Leader",
    "lore": "The Master of Psychic Pok\u00e9mon. A psychic prodigy from Saffron City who communicates telepathically with her Pok\u00e9mon. She foresaw your arrival and believes that true power lies in the untethered mind."
  },
  {
    "name": "Blaine",
    "id": "blaine",
    "role": "Gym Leader",
    "lore": "The Hotheaded Quiz Master. Living on the volcanic Cinnabar Island, this eccentric Fire-type specialist combines his passion for riddles with the searing heat of his beloved fiery companions."
  },
  {
    "name": "Giovanni",
    "id": "giovanni",
    "role": "Gym Leader",
    "lore": "The enigmatic boss of Team Rocket and the former Viridian City Gym Leader. A ruthless mastermind who views Pok\u00e9mon primarily as tools for absolute domination and financial conquest."
  },
  {
    "name": "Lance",
    "id": "lance",
    "role": "Champion",
    "lore": "The venerable Dragon Master of Blackthorn City. As a member of the Elite Four and later a Champion, he unleashes the mythical, untamed fury of Dragon-type Pok\u00e9mon to uphold justice across the regions."
  },
  {
    "name": "Falkner",
    "id": "falkner",
    "role": "Gym Leader",
    "lore": "The Elegant Master of Flying Pok\u00e9mon. Inheriting the Violet City Gym from his father, he commands the skies and fiercely defends the honor of Flying-types against those who underestimate them."
  },
  {
    "name": "Bugsy",
    "id": "bugsy",
    "role": "Gym Leader",
    "lore": "The Walking Bug Pok\u00e9mon Encyclopedia. Despite his youth, this Azalea Town prodigy has dedicated his life to researching the hidden potential and evolutionary wonders of Bug-type Pok\u00e9mon."
  },
  {
    "name": "Whitney",
    "id": "whitney",
    "role": "Gym Leader",
    "lore": "The Incredibly Pretty Girl of Goldenrod City! Don't let her tears fool you\u2014her Normal-type Pok\u00e9mon are notoriously resilient, utilizing relentless tactics like Rollout to crush unsuspecting challengers."
  },
  {
    "name": "Morty",
    "id": "morty",
    "role": "Gym Leader",
    "lore": "The Mystic Seer of the Future. Stationed in Ecruteak City, he has dedicated his life to studying the legends of Ho-Oh, communicating with Ghost-types to pierce the veil between the physical and spiritual realms."
  },
  {
    "name": "Chuck",
    "id": "chuck",
    "role": "Gym Leader",
    "lore": "His Roaring Fists Do the Talking. Training endlessly under the crashing waterfalls of Cianwood City, this Fighting-type Gym Leader channels the raw, unyielding power of nature into his Pok\u00e9mon's strikes."
  },
  {
    "name": "Jasmine",
    "id": "jasmine",
    "role": "Gym Leader",
    "lore": "The Steel-Clad Defense Girl. Initially timid and caring, she hardens her resolve in battle, directing her defensively impenetrable Steel-type Pok\u00e9mon to stand firm as the lighthouse of Olivine City."
  },
  {
    "name": "Pryce",
    "id": "pryce",
    "role": "Gym Leader",
    "lore": "The Teacher of Winter's Harshness. A veteran who has seen many bitter winters, this Mahogany Town Gym Leader uses Ice-types to test the inner warmth and unyielding willpower of the younger generations."
  },
  {
    "name": "Clair",
    "id": "clair",
    "role": "Gym Leader",
    "lore": "The Blessed User of Dragon Pok\u00e9mon. Proud, fiercely competitive, and demanding, she expects perfection from her challengers, reigning over the Blackthorn Gym with the overwhelming might of her dragons."
  },
  {
    "name": "Roxanne",
    "id": "roxanne",
    "role": "Gym Leader",
    "lore": "The Rock-Loving Scholar. A top graduate of the Pok\u00e9mon Trainer's School, she approaches battles with academic rigor, testing her textbook strategies through her sturdy Rock-type Pok\u00e9mon."
  },
  {
    "name": "Brawly",
    "id": "brawly",
    "role": "Gym Leader",
    "lore": "A big wave in motion! Surfing the tides of Dewford Town, he applies the fluidity of the ocean to his martial arts, instructing his Fighting-type Pok\u00e9mon to absorb impact and counterattack."
  },
  {
    "name": "Wattson",
    "id": "wattson",
    "role": "Gym Leader",
    "lore": "The cheerfully electrifying man! A jovial inventor who revolutionized Mauville City, he greets every battle with a hearty laugh, sparking joy and high-voltage tactics with his Electric-type Pok\u00e9mon."
  },
  {
    "name": "Flannery",
    "id": "flannery",
    "role": "Gym Leader",
    "lore": "One with a fiery passion that burns! Recently inheriting the Lavaridge Gym, her inexperience is masked by her explosive enthusiasm and the intense heat radiating from her Fire-type companions."
  },
  {
    "name": "Norman",
    "id": "norman",
    "role": "Gym Leader",
    "lore": "A man in pursuit of ultimate power. The protagonist's strict but loving father, he commands the Petalburg Gym with disciplined Normal-type strategies, offering the ultimate test of his child's growth."
  },
  {
    "name": "Winona",
    "id": "winona",
    "role": "Gym Leader",
    "lore": "The bird user taking flight into the world. Graceful and deeply attuned to the winds of Fortree City, she dances with her Flying-type Pok\u00e9mon, performing aerial acrobatics that dazzle her opponents."
  },
  {
    "name": "Wallace",
    "id": "wallace",
    "role": "Champion",
    "lore": "Artist, and lover of water. An elegant coordinator and powerful trainer from Sootopolis City, he intertwines beauty and strength, commanding Water-type Pok\u00e9mon with the grace of a master illusionist."
  },
  {
    "name": "Juan",
    "id": "juan",
    "role": "Gym Leader",
    "lore": "The Gym Leader with the beauty of pure water. Wallace's sophisticated mentor, he delights in creating dazzling, aquatic spectacles, proving that true power can be a breathtaking work of art."
  },
  {
    "name": "Steven",
    "id": "steven",
    "role": "Champion",
    "lore": "The wandering stone collector. An heir to the Devon Corporation and the Champion of Hoenn, he traverses the globe in search of rare minerals, battling with an unshakeable, Steel-clad resolve."
  },
  {
    "name": "Roark",
    "id": "roark",
    "role": "Gym Leader",
    "lore": "Call him Roark the Rock! The dedicated foreman of the Oreburgh Mine, he follows in his father's footsteps, polishing the rugged potential of Rock-type Pok\u00e9mon into shining gems of strength."
  },
  {
    "name": "Gardenia",
    "id": "gardenia",
    "role": "Gym Leader",
    "lore": "Master of Vivid Plant Pok\u00e9mon! A deeply enthusiastic Grass-type specialist in Eterna City, she loves her botanical companions fiercely\u2014though she remains famously terrified of Ghost-types."
  },
  {
    "name": "Maylene",
    "id": "maylene",
    "role": "Gym Leader",
    "lore": "The Barefoot Fighting Genius! A humble prodigy from Veilstone City who sometimes doubts her own strength, yet commands her Fighting-type Pok\u00e9mon with astonishing, instinctual precision."
  },
  {
    "name": "Crasher Wake",
    "id": "crasherwake",
    "role": "Gym Leader",
    "lore": "The Torrential Masked Master! A larger-than-life pro wrestler from Pastoria City who loves entertaining the crowds, washing away the competition with the brute force of his Water-type Pok\u00e9mon."
  },
  {
    "name": "Fantina",
    "id": "fantina",
    "role": "Gym Leader",
    "lore": "The Alluring Soul Dancer! A flamboyant contest coordinator and Hearthome Gym Leader, she speaks with a foreign flair, utilizing Ghost-type Pok\u00e9mon to weave mesmerizing, unpredictable illusions."
  },
  {
    "name": "Byron",
    "id": "byron",
    "role": "Gym Leader",
    "lore": "The Man with the Steel Body! Roark's boisterous father and the Canalave City Gym Leader, he forged his unyielding defensive strategies deep within the Iron Island mines."
  },
  {
    "name": "Candice",
    "id": "candice",
    "role": "Gym Leader",
    "lore": "The Diamond Dust Girl! Despite Snowpoint City's freezing climate, her fierce, passionate spirit burns brightly, inspiring her Ice-type Pok\u00e9mon to strike with the focus of a blizzard."
  },
  {
    "name": "Volkner",
    "id": "volkner",
    "role": "Gym Leader",
    "lore": "The Shining, Shocking Star! Bored by weak challengers, this brilliant but melancholic Sunyshore City Gym Leader revitalizes the local technology to spark the ultimate Electric-type battle."
  },
  {
    "name": "Cynthia",
    "id": "cynthia",
    "role": "Champion",
    "lore": "The beloved Champion of the Sinnoh region. Deeply fascinated by Pok\u00e9mon mythology and the creation of the universe, she battles with an unparalleled, terrifyingly diverse team led by her Garchomp."
  },
  {
    "name": "Cilan",
    "id": "cilan",
    "role": "Gym Leader",
    "lore": "A sophisticated connoisseur of Grass-type Pok\u00e9mon. Alongside his brothers in Striaton City, he carefully analyzes the flavor of a challenger's battling style, aiming for a perfectly balanced encounter."
  },
  {
    "name": "Lenora",
    "id": "lenora",
    "role": "Gym Leader",
    "lore": "The Archeologist with a Backbone! Directing the Nacrene City Museum, she applies her rigorous scientific deduction to battling, using Normal-type Pok\u00e9mon to unearth her opponents' weaknesses."
  },
  {
    "name": "Burgh",
    "id": "burgh",
    "role": "Gym Leader",
    "lore": "The Premiere Insect Artist! A wandering bohemian soul in Castelia City, he finds profound artistic inspiration in the pure, unadulterated nature of Bug-type Pok\u00e9mon."
  },
  {
    "name": "Elesa",
    "id": "elesa",
    "role": "Gym Leader",
    "lore": "The Shining Beauty! A world-famous supermodel in Nimbasa City, she dazzles the runway and the battlefield alike, electrifying her audiences with a flashy, high-voltage combat style."
  },
  {
    "name": "Clay",
    "id": "clay",
    "role": "Gym Leader",
    "lore": "The Underground Boss! A gruff, hard-working magnate who built Driftveil City through sheer willpower, he crushes obstacles using the raw, unrefined power of his Ground-type Pok\u00e9mon."
  },
  {
    "name": "Skyla",
    "id": "skyla",
    "role": "Gym Leader",
    "lore": "The Highflying Girl! A cheerful cargo pilot in Mistralton City, she loves soaring through the open skies and subjects her challengers to dizzying, wind-blown aerial trials."
  },
  {
    "name": "Brycen",
    "id": "brycen",
    "role": "Gym Leader",
    "lore": "The legendary Ice Mask! Once a celebrated movie star, he retreated to Icirrus City to hone his martial arts in the freezing cold, mastering the silent, crystalline precision of Ice-type Pok\u00e9mon."
  },
  {
    "name": "Drayden",
    "id": "drayden",
    "role": "Gym Leader",
    "lore": "The Spartan Mayor! An imposing, physically powerful leader in Opelucid City, he governs with wisdom and battles with the ancient, devastating ferocity of Dragon-type Pok\u00e9mon."
  },
  {
    "name": "Iris",
    "id": "iris",
    "role": "Champion",
    "lore": "The Girl Who Knows the Hearts of Dragons! A wild, energetic prodigy deeply connected to nature, she embraces the untamed spirit of Dragon-types to ascend as the Champion of Unova."
  },
  {
    "name": "Alder",
    "id": "alder",
    "role": "Champion",
    "lore": "The wandering Champion of Unova. Carrying a heavy burden of loss, he travels the region teaching others that the bond between humans and Pok\u00e9mon is far more important than the pursuit of raw power."
  },
  {
    "name": "Red",
    "id": "red",
    "role": "Protagonist",
    "lore": "The legendary silent prodigy from Pallet Town. He conquered the Kanto region and retreated to Mt. Silver to await a challenger worthy of his ultimate team."
  },
  {
    "name": "Blue",
    "id": "blue",
    "role": "Rival",
    "lore": "Red's arrogant but brilliant rival and the former Kanto Champion. Smell ya later!"
  },
  {
    "name": "Ethan",
    "id": "ethan",
    "role": "Protagonist",
    "lore": "The heroic boy from New Bark Town who toppled Team Rocket and conquered two entire regions."
  },
  {
    "name": "Lyra",
    "id": "lyra",
    "role": "Protagonist",
    "lore": "A cheerful and energetic trainer from Johto, always ready for an adventure with her Marill."
  },
  {
    "name": "Brendan",
    "id": "brendan",
    "role": "Protagonist",
    "lore": "The confident son of Professor Birch, constantly exploring the vibrant, tropical Hoenn region."
  },
  {
    "name": "May",
    "id": "may",
    "role": "Protagonist",
    "lore": "Daughter of the Petalburg Gym Leader Norman, balancing her love for battles and Pok\u00e9mon Contests."
  },
  {
    "name": "Lucas",
    "id": "lucas",
    "role": "Protagonist",
    "lore": "A dedicated assistant to Professor Rowan in Sinnoh, eager to uncover the secrets of evolution."
  },
  {
    "name": "Dawn",
    "id": "dawn",
    "role": "Protagonist",
    "lore": "A spirited trainer from Twinleaf Town, aiming to conquer the Sinnoh league and contests alike."
  },
  {
    "name": "Hilbert",
    "id": "hilbert",
    "role": "Protagonist",
    "lore": "The hero of truth or ideals from Nuvema Town, destined to awaken a legendary dragon."
  },
  {
    "name": "Hilda",
    "id": "hilda",
    "role": "Protagonist",
    "lore": "A fierce and determined Unovan trainer, ready to take on Team Plasma and save the region."
  },
  {
    "name": "Nate",
    "id": "nate",
    "role": "Protagonist",
    "lore": "A rising star from Aspertia City, fighting alongside Hugh to liberate Unova from Neo Team Plasma."
  },
  {
    "name": "Rosa",
    "id": "rosa",
    "role": "Protagonist",
    "lore": "An energetic and talented trainer, exploring the evolving landscape of the Unova region."
  },
  {
    "name": "Ace Trainer",
    "id": "acetrainer",
    "role": "Trainer",
    "lore": "Elite, highly skilled trainers who use diverse and fully-evolved teams to crush unprepared opponents."
  },
  {
    "name": "Bug Catcher",
    "id": "bugcatcher",
    "role": "Trainer",
    "lore": "Enthusiastic kids wielding nets, constantly searching the forests for rare and fascinating Bug-type Pok\u00e9mon."
  },
  {
    "name": "Lass",
    "id": "lass",
    "role": "Trainer",
    "lore": "Young girls beginning their journeys, typically preferring cute Normal and Fairy-type companions."
  },
  {
    "name": "Youngster",
    "id": "youngster",
    "role": "Trainer",
    "lore": "Energetic boys obsessed with battling. They really like shorts because they are comfy and easy to wear!"
  },
  {
    "name": "Hiker",
    "id": "hiker",
    "role": "Trainer",
    "lore": "Jovial mountaineers scaling the highest peaks, relying on sturdy Rock and Ground-type Pok\u00e9mon."
  },
  {
    "name": "Scientist",
    "id": "scientist",
    "role": "Trainer",
    "lore": "Analytical minds experimenting with Pok\u00e9mon genetics, artificial items, and strategic battle calculations."
  },
  {
    "name": "Black Belt",
    "id": "blackbelt",
    "role": "Trainer",
    "lore": "Disciplined martial artists who train their bodies in tandem with their powerful Fighting-type Pok\u00e9mon."
  },
  {
    "name": "Beauty",
    "id": "beauty",
    "role": "Trainer",
    "lore": "Elegant trainers who believe true strength lies in a Pok\u00e9mon's grace, charm, and immaculate grooming."
  },
  {
    "name": "Psychic",
    "id": "psychic",
    "role": "Trainer",
    "lore": "Mystics capable of bending spoons and minds, harmonizing their brainwaves with Psychic-type Pok\u00e9mon."
  },
  {
    "name": "Dragon Tamer",
    "id": "dragontamer",
    "role": "Trainer",
    "lore": "Specialized experts who brave extreme conditions to tame the mythical and devastating Dragon-type Pok\u00e9mon."
  },
  {
    "name": "Veteran",
    "id": "veteran",
    "role": "Trainer",
    "lore": "Seasoned masters with decades of combat experience and profoundly powerful, diverse teams."
  },
  {
    "name": "Rocket Grunt",
    "id": "rocketgrunt",
    "role": "Villain",
    "lore": "Foot soldiers of the notorious Team Rocket, stealing Pok\u00e9mon for profit and absolute domination."
  },
  {
    "name": "Magma Grunt",
    "id": "magmagrunt",
    "role": "Villain",
    "lore": "Fanatical members of Team Magma, seeking to expand the landmass by awakening ancient primal forces."
  },
  {
    "name": "Aqua Grunt",
    "id": "aquagrunt",
    "role": "Villain",
    "lore": "Pirates of Team Aqua, fighting to flood the earth and return it to a prehistoric oceanic state."
  },
  {
    "name": "Galactic Grunt",
    "id": "galacticgrunt",
    "role": "Villain",
    "lore": "Emotionless operatives of Team Galactic, aiming to destroy the universe and rebuild it for their leader."
  },
  {
    "name": "Plasma Grunt",
    "id": "plasmagrunt",
    "role": "Villain",
    "lore": "Knights of Team Plasma, hypocritically \"liberating\" Pok\u00e9mon while seeking total control of the Unova region."
  },
  {
    "name": "Maxie",
    "id": "maxie-gen6",
    "role": "Villain",
    "lore": "The analytical leader of Team Magma, who wishes to expand the landmass to create more space for human progress and development."
  },
  {
    "name": "Archie",
    "id": "archie-gen6",
    "role": "Villain",
    "lore": "The boisterous leader of Team Aqua, who seeks to expand the sea to return the world to its primordial, natural state for Pok\u00e9mon."
  },
  {
    "name": "Cyrus",
    "id": "cyrus",
    "role": "Villain",
    "lore": "The emotionless boss of Team Galactic. He despises the human spirit and aims to destroy the universe to rebuild a perfect one without emotion."
  },
  {
    "name": "Ghetsis",
    "id": "ghetsis",
    "role": "Villain",
    "lore": "The true mastermind behind Team Plasma. A manipulative and cruel dictator who uses the ideal of Pok\u00e9mon liberation as a front for world domination."
  },
  {
    "name": "N",
    "id": "n",
    "role": "Villain",
    "lore": "The enigmatic King of Team Plasma. Raised alongside Pok\u00e9mon, he can hear their inner voices and seeks to separate their world from humans."
  },
  {
    "name": "Lysandre",
    "id": "lysandre",
    "role": "Villain",
    "lore": "The charismatic leader of Team Flare. Obsessed with preserving the world's beauty, he plans to activate the ultimate weapon to wipe out the \"ugly\" elements of society."
  },
  {
    "name": "Guzma",
    "id": "guzma",
    "role": "Villain",
    "lore": "The destructive boss of Team Skull. A misunderstood outcast who relies on Bug-type Pok\u00e9mon and overwhelming force to beat down his opponents."
  },
  {
    "name": "Lusamine",
    "id": "lusamine",
    "role": "Villain",
    "lore": "The elegant president of the Aether Foundation. Her obsessive love for Ultra Beasts drives her to terrifying extremes, disregarding the safety of everyone around her."
  },
  {
    "name": "Calem",
    "id": "calem",
    "role": "Protagonist",
    "lore": "The stylish hero of the Kalos region, striving to uncover the mysteries of Mega Evolution."
  },
  {
    "name": "Serena",
    "id": "serena",
    "role": "Protagonist",
    "lore": "A passionate and determined trainer from Kalos, seeking to become the very best."
  },
  {
    "name": "Elio",
    "id": "elio",
    "role": "Protagonist",
    "lore": "The bright-eyed champion of Alola, who brought the Island Challenge to new heights."
  },
  {
    "name": "Selene",
    "id": "selene",
    "role": "Protagonist",
    "lore": "A cheerful Alolan trainer, always ready for an adventure beneath the tropical sun."
  },
  {
    "name": "Victor",
    "id": "victor",
    "role": "Protagonist",
    "lore": "The determined hero of Galar, ready to conquer the Gym Challenge in packed stadiums."
  },
  {
    "name": "Gloria",
    "id": "gloria",
    "role": "Protagonist",
    "lore": "A spirited Galarian trainer with an unstoppable drive to become the Champion."
  },
  {
    "name": "Florian",
    "id": "florian-s",
    "role": "Protagonist",
    "lore": "A student of Naranja Academy in Paldea, exploring the vast region on a treasure hunt."
  },
  {
    "name": "Juliana",
    "id": "juliana-s",
    "role": "Protagonist",
    "lore": "A student of Uva Academy in Paldea, seeking her own unique treasure across the region."
  },
  {
    "name": "Leon",
    "id": "leon",
    "role": "Champion",
    "lore": "The undefeated Champion of the Galar region. Known for his incredible battle sense and terrible sense of direction."
  },
  {
    "name": "Geeta",
    "id": "geeta",
    "role": "Champion",
    "lore": "The Top Champion of the Paldea region. She oversees the Pokemon League with unmatched grace and authority."
  },
  {
    "name": "Diantha",
    "id": "diantha",
    "role": "Champion",
    "lore": "The glamorous Champion of the Kalos region and a world-renowned movie star."
  },
  {
    "name": "Kukui",
    "id": "kukui",
    "role": "Champion",
    "lore": "The passionate Pokemon Professor of Alola, and the founder of its first-ever Pokemon League."
  },
  {
    "name": "Hop",
    "id": "hop",
    "role": "Rival",
    "lore": "Leon's younger brother and a fiercely determined rival aiming to step out of his brother's shadow."
  },
  {
    "name": "Nemona",
    "id": "nemona-s",
    "role": "Rival",
    "lore": "A battle-obsessed Champion-ranked trainer from Paldea who loves testing new strategies."
  },
  {
    "name": "Kieran",
    "id": "kieran",
    "role": "Rival",
    "lore": "A quiet trainer from Kitakami whose intense determination pushed him to become the BB League Champion."
  },
  {
    "name": "Carmine",
    "id": "carmine",
    "role": "Rival",
    "lore": "A strong-willed student from Blueberry Academy who fiercely protects her younger brother Kieran."
  },
  {
    "name": "Marnie",
    "id": "marnie",
    "role": "Rival",
    "lore": "A composed trainer from Spikemuth. Her quiet strength earned her the fanatic devotion of Team Yell."
  },
  {
    "name": "Bede",
    "id": "bede",
    "role": "Rival",
    "lore": "A proud and arrogant trainer who eventually found his true calling as the Ballonlea Gym Leader."
  },
  {
    "name": "Penny",
    "id": "penny",
    "role": "Trainer",
    "lore": "A shy tech genius from Paldea who secretly led Team Star to protect her friends."
  },
  {
    "name": "Arven",
    "id": "arven-s",
    "role": "Trainer",
    "lore": "A culinary expert from Paldea on a quest to find the mythical Herba Mystica to heal his partner Pokemon."
  }
];;

const getShowdownName = (name: string, isFemale: boolean = false) => {
  if (!name) return '';
  let slug = name.toLowerCase().trim();
  
  // Mega/Gmax/Form/Paradox handling
  const specialForms: Record<string, string> = {
    'ho-oh': 'hooh',
    'kommo-o': 'kommoo',
    'hakamo-o': 'hakamoo',
    'jangmo-o': 'jangmoo',
    'porygon-z': 'porygonz',
    'sirfetchd': 'sirfetchd',
    'farfetchd': 'farfetchd',
    'mr-mime': 'mrmime',
    'mr-rime': 'mrrime',
    'mime-jr': 'mimejr',
    'type-null': 'typenull',
    'wo-chien': 'wochien',
    'chien-pao': 'chienpao',
    'ting-lu': 'tinglu',
    'chi-yu': 'chiyu',
    'great-tusk': 'greattusk',
    'scream-tail': 'screamtail',
    'brute-bonnet': 'brutebonnet',
    'flutter-mane': 'fluttermane',
    'slither-wing': 'slitherwing',
    'sandy-shocks': 'sandyshocks',
    'iron-treads': 'irontreads',
    'iron-bundle': 'ironbundle',
    'iron-hands': 'ironhands',
    'iron-jugulis': 'ironjugulis',
    'iron-moth': 'ironmoth',
    'iron-thorns': 'ironthorns',
    'iron-valiant': 'ironvaliant',
    'iron-leaves': 'ironleaves',
    'walking-wake': 'walkingwake',
    'iron-boulder': 'ironboulder',
    'iron-crown': 'ironcrown',
    'raging-bolt': 'ragingbolt',
    'gouging-fire': 'gougingfire',
    'flabebe': 'flabebe',
    'meowscarada': 'meowscarada',
    'skeledirge': 'skeledirge',
    'quaquaval': 'quaquaval',
    'oricorio-baile': 'oricorio',
    'oricorio-pom-pom': 'oricorio-pompom',
    'oricorio-pa-u': 'oricorio-pau',
    'oricorio-sensu': 'oricorio-sensu',
    'lycanroc-midday': 'lycanroc',
    'lycanroc-midnight': 'lycanroc-midnight',
    'lycanroc-dusk': 'lycanroc-dusk',
    'minior-red-meteor': 'minior',
    'minior-red': 'minior',
    'minior-orange-meteor': 'minior',
    'minior-orange': 'minior-orange',
    'minior-yellow-meteor': 'minior',
    'minior-yellow': 'minior-yellow',
    'minior-green-meteor': 'minior',
    'minior-green': 'minior-green',
    'minior-blue-meteor': 'minior',
    'minior-blue': 'minior-blue',
    'minior-indigo-meteor': 'minior',
    'minior-indigo': 'minior-indigo',
    'minior-violet-meteor': 'minior',
    'minior-violet': 'minior-violet',
    'mimikyu-disguised': 'mimikyu',
    'mimikyu-busted': 'mimikyu-busted',
    'zygarde-10': 'zygarde10',
    'zygarde-50': 'zygarde',
    'basculin-red-striped': 'basculin',
    'basculin-blue-striped': 'basculin-blue',
    'basculin-white-striped': 'basculin-white',
    'keldeo-ordinary': 'keldeo',
    'keldeo-resolute': 'keldeo-resolute',
    'meloetta-aria': 'meloetta',
    'meloetta-pirouette': 'meloetta-pirouette',
    'thundurus-incarnate': 'thundurus',
    'thundurus-therian': 'thundurus-therian',
    'tornadus-incarnate': 'tornadus',
    'tornadus-therian': 'tornadus-therian',
    'landorus-incarnate': 'landorus',
    'landorus-therian': 'landorus-therian',
    'enamorus-incarnate': 'enamorus',
    'enamorus-therian': 'enamorus-therian',
    'gourgeist-average': 'gourgeist',
    'gourgeist-small': 'gourgeist-small',
    'gourgeist-large': 'gourgeist-large',
    'gourgeist-super': 'gourgeist-super',
    'pumpkaboo-average': 'pumpkaboo',
    'pumpkaboo-small': 'pumpkaboo-small',
    'pumpkaboo-large': 'pumpkaboo-large',
    'pumpkaboo-super': 'pumpkaboo-super',
    'toxtricity-amped': 'toxtricity',
    'toxtricity-low-key': 'toxtricity-lowkey',
    'urshifu-single-strike': 'urshifu',
    'urshifu-rapid-strike': 'urshifu-rapidstrike',
    'deoxys-normal': 'deoxys',
    'deoxys-attack': 'deoxys-attack',
    'deoxys-defense': 'deoxys-defense',
    'deoxys-speed': 'deoxys-speed',
    'wormadam-plant': 'wormadam',
    'wormadam-sandy': 'wormadam-sandy',
    'wormadam-trash': 'wormadam-trash',
    'giratina-altered': 'giratina',
    'giratina-origin': 'giratina-origin',
    'shaymin-land': 'shaymin',
    'shaymin-sky': 'shaymin-sky',
    'aegislash-shield': 'aegislash',
    'aegislash-blade': 'aegislash-blade',
    'basculegion-male': 'basculegion',
    'basculegion-female': 'basculegion-f',
    'meowstic-male': 'meowstic',
    'meowstic-female': 'meowstic-f',
    'indeedee-male': 'indeedee',
    'indeedee-female': 'indeedee-f',
    'oinkologne-male': 'oinkologne',
    'oinkologne-female': 'oinkologne-f',
    'pyroar-male': 'pyroar',
    'pyroar-female': 'pyroar-f',
    'unfezant-male': 'unfezant',
    'unfezant-female': 'unfezant-f',
    'frillish-male': 'frillish',
    'frillish-female': 'frillish-f',
    'jellicent-male': 'jellicent',
    'jellicent-female': 'jellicent-f',
    'meowstic': 'meowstic',
    'indeedee': 'indeedee',
    'oinkologne': 'oinkologne',
    'pyroar': 'pyroar',
    'unfezant': 'unfezant',
    'frillish': 'frillish',
    'jellicent': 'jellicent',
    'hippowdon': 'hippowdon',
    'hippopotas': 'hippopotas',
    'basculegion': 'basculegion',
    'nidoran-m': 'nidoranm',
    'nidoran-f': 'nidoranf',
    'hippowdon-male': 'hippowdon',
    'hippowdon-female': 'hippowdon-f',
    'hippopotas-male': 'hippopotas',
    'hippopotas-female': 'hippopotas-f',
    'darmanitan-standard': 'darmanitan',
    'darmanitan-zen': 'darmanitan-zen',
    'darmanitan-galar-standard': 'darmanitan-galar',
    'darmanitan-galar-zen': 'darmanitan-galar-zen',
    'wishiwashi-solo': 'wishiwashi',
    'wishiwashi-school': 'wishiwashi-school',
    'zygarde-10-power-construct': 'zygarde10',
    'zygarde-50-power-construct': 'zygarde',
    'zygarde-complete': 'zygarde-complete',
    'greninja-ash': 'greninja-ash',
    'necrozma-dusk': 'necrozma-duskmane',
    'necrozma-dawn': 'necrozma-dawnwings',
    'necrozma-ultra': 'necrozma-ultra',
    'calyrex-ice': 'calyrex-ice',
    'calyrex-shadow': 'calyrex-shadow',
    'palafin-zero': 'palafin',
    'palafin-hero': 'palafin-hero',
    'maushold-family-of-three': 'maushold',
    'maushold-family-of-four': 'maushold',
    'dudunsparce-two-segment': 'dudunsparce',
    'dudunsparce-three-segment': 'dudunsparce-threesegment',
    'ogerpon-teal-mask': 'ogerpon',
    'ogerpon-wellspring-mask': 'ogerpon-wellspring',
    'ogerpon-hearthflame-mask': 'ogerpon-hearthflame',
    'ogerpon-cornerstone-mask': 'ogerpon-cornerstone',
    'terapagos-normal': 'terapagos',
    'terapagos-terastal': 'terapagos-terastal',
    'terapagos-stellar': 'terapagos-stellar',
  };

  if (specialForms[slug] || slug === 'pyroar' || slug === 'meowstic') {
    let result = specialForms[slug] || slug;
    if (isFemale && !result.endsWith('f')) {
      const dashFemale = ['meowstic', 'indeedee', 'basculegion', 'oinkologne', 'pyroar', 'unfezant', 'frillish', 'jellicent', 'hippowdon', 'hippopotas'];
      if (dashFemale.includes(result)) {
        result += '-f';
      } else {
        result += 'f';
      }
    }
    return result;
  }

  // Default stripping logic for species that doesn't have a special form mapping
  let processed = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (isFemale) {
    if (processed === 'nidoranm') return 'nidoranf';
    if (!processed.endsWith('f')) {
      processed += 'f'; // Showdown uses pikachuf, wobbuffetf, etc without dash
    }
  }

  return processed;
};

// Custom Typewriter component for typewriter visual text effects on both PC and mobile devices
const TypewriterText = memo(({ text, delay = 12, onComplete }: { text: string; delay?: number; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let currentText = '';
    setDisplayedText(currentText);
    let index = 0;
    let timer: any = null;
    
    const run = () => {
      if (index < text.length) {
        currentText += text.charAt(index);
        setDisplayedText(currentText);
        index++;
        if (Math.random() > 0.45) {
          try {
            sounds.typing?.();
          } catch (_) {}
        }
        timer = setTimeout(run, delay);
      } else {
        onComplete?.();
      }
    };
    
    timer = setTimeout(run, delay);
    return () => clearTimeout(timer);
  }, [text, delay, onComplete]);

  return <span>{displayedText}</span>;
});
TypewriterText.displayName = "TypewriterText";

// Custom Sprite Component for perfect Battle Arena sizing and Showdown fallbacks
const PokemonBattleSprite = memo(({ pokemon, isBack, isShiny, isFemale, className, onClick, arenaMode = false, flip, scaleMultiplier = 1, isPlayer = false, use2dSprite = false }: any) => {
  const [fallbackLevel, setFallbackLevel] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setFallbackLevel(0);
    setImageLoaded(false);
  }, [pokemon?.name, isShiny, isFemale, use2dSprite]);

  const generateSrc = (level: number) => {
    if (!pokemon) return '';
    const cleanName = getShowdownName(pokemon?.name, isFemale);
    const effectiveLevel = level;
    const idNum = pokemon.id || pokemon.url?.split('/').filter(Boolean).pop() || pokemon.name;
    const shinyPath = isShiny ? 'shiny/' : '';

    if (use2dSprite) {
      // 2D PIXEL ART SPRITE MODE (Pok√©API 2D pixel art for every Pok√©mon: base, mega, gmax, regional, alternative forms)
      if (effectiveLevel === 0 && pokemon.sprites) {
        if (isFemale) {
          const fem = isBack 
            ? (isShiny ? (pokemon.sprites.back_shiny_female || pokemon.sprites.back_female || pokemon.sprites.back_default) : (pokemon.sprites.back_female || pokemon.sprites.back_default))
            : (isShiny ? (pokemon.sprites.front_shiny_female || pokemon.sprites.front_female || pokemon.sprites.front_default) : (pokemon.sprites.front_female || pokemon.sprites.front_default));
          if (fem) return fem;
        }
        const spr = isBack 
          ? (isShiny ? (pokemon.sprites.back_shiny || pokemon.sprites.back_default || pokemon.sprites.front_default) : (pokemon.sprites.back_default || pokemon.sprites.front_default))
          : (isShiny ? (pokemon.sprites.front_shiny || pokemon.sprites.front_default) : pokemon.sprites.front_default);
        if (spr) return spr;
      }

      // Level 1: Direct Pok√©API raw 2D pixel art sprite URL (covers 10000+ IDs for megas, gmax, regional forms!)
      if (effectiveLevel <= 1) {
        if (isFemale) {
          return isBack 
            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/female/${shinyPath}${idNum}.png`
            : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/female/${shinyPath}${idNum}.png`;
        }
        return isBack 
          ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${shinyPath}${idNum}.png`
          : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinyPath}${idNum}.png`;
      }

      // Level 2: Showdown static 2D sprite
      if (effectiveLevel === 2) {
        const basePath = isBack ? `gen5-back${isShiny ? '-shiny' : ''}` : `gen5${isShiny ? '-shiny' : ''}`;
        return `https://play.pokemonshowdown.com/sprites/${basePath}/${cleanName}.png`;
      }

      // Level 3: Showdown animated 2D sprite
      if (effectiveLevel === 3) {
        const basePath = isBack ? `ani-back${isShiny ? '-shiny' : ''}` : `ani${isShiny ? '-shiny' : ''}`;
        return `https://play.pokemonshowdown.com/sprites/${basePath}/${cleanName}.gif`;
      }

      // Level 4: Pok√©API front 2D sprite fallback if back was requested but missing
      if (effectiveLevel === 4) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinyPath}${idNum}.png`;
      }

      // Level 5: Official artwork fallback
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shinyPath}${idNum}.png`;
    }

    // HOME 3D ARTWORK MODE (Default)
    if (effectiveLevel === 0 && pokemon.sprites) {
      if (arenaMode && pokemon.sprites.other?.home) {
        const home = pokemon.sprites.other.home;
        if (isFemale && (home.front_female || home.front_shiny_female)) {
          return isShiny 
            ? (home.front_shiny_female || home.front_female) 
            : home.front_female;
        } else {
          return isShiny 
            ? (home.front_shiny || home.front_default) 
            : home.front_default;
        }
      }
      if (isFemale) {
        if (pokemon.sprites.other?.home?.front_female) {
          return isShiny 
            ? (pokemon.sprites.other.home.front_shiny_female || pokemon.sprites.other.home.front_female) 
            : pokemon.sprites.other.home.front_female;
        }
        if (pokemon.sprites.other?.['official-artwork']?.front_female) {
          const offArt = pokemon.sprites.other['official-artwork'];
          return isShiny ? (offArt.front_shiny_female || offArt.front_female) : offArt.front_female;
        }
        // If female is requested, but official arts lack it, we skip returning here 
        // to let it fall through to Showdown (Level 1) which often has the female sprite.
      } else {
        const offArt = pokemon.sprites.other?.['official-artwork'];
        const homeArt = pokemon.sprites.other?.home;
        if (offArt && (offArt.front_default || offArt.front_shiny)) {
          return isShiny ? (offArt.front_shiny || offArt.front_default) : offArt.front_default;
        } else if (homeArt && (homeArt.front_default || homeArt.front_shiny)) {
          return isShiny ? (homeArt.front_shiny || homeArt.front_default) : homeArt.front_default;
        }
      }
    }
    
    // Level 1: Showdown animated gif
    if (effectiveLevel <= 1) {
      const basePath = isBack ? `ani-back${isShiny ? '-shiny' : ''}` : `ani${isShiny ? '-shiny' : ''}`;
      return `https://play.pokemonshowdown.com/sprites/${basePath}/${cleanName}.gif`;
    }
    
    // Level 2: Showdown static 2D
    if (effectiveLevel === 2) {
      const basePath = isBack ? `gen5-back${isShiny ? '-shiny' : ''}` : `gen5${isShiny ? '-shiny' : ''}`;
      return `https://play.pokemonshowdown.com/sprites/${basePath}/${cleanName}.png`;
    }

    // Level 3: Pokemon object regular sprite
    if (effectiveLevel === 3 && pokemon.sprites) {
      if (isFemale) {
        return isBack 
          ? (isShiny ? (pokemon.sprites.back_shiny_female || pokemon.sprites.back_female || pokemon.sprites.back_default) : (pokemon.sprites.back_female || pokemon.sprites.back_default))
          : (isShiny ? (pokemon.sprites.front_shiny_female || pokemon.sprites.front_female || pokemon.sprites.front_default) : (pokemon.sprites.front_female || pokemon.sprites.front_default));
      }
      return isBack 
        ? (isShiny ? (pokemon.sprites.back_shiny || pokemon.sprites.back_default) : pokemon.sprites.back_default)
        : (isShiny ? (pokemon.sprites.front_shiny || pokemon.sprites.front_default) : pokemon.sprites.front_default);
    }

    // Fallback URL generation
    
    if (effectiveLevel === 4) {
      let spriteId = idNum;
      if (isShiny && (idNum === '10309' || idNum === 10309 || pokemon.name?.includes('garchomp-mega-z'))) {
        spriteId = '10058';
      }
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shinyPath}${spriteId}.png`;
    }
    
    return isBack 
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${shinyPath}${idNum}.png`
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinyPath}${idNum}.png`;
  };

  const currentSrc = generateSrc(fallbackLevel);
  const autoShouldFlip = isBack && (currentSrc.includes('official-artwork') || (!currentSrc.includes('back') && !currentSrc.includes('ani-back') && !currentSrc.includes('gen5-back')));
  const finalFlip = flip !== undefined ? flip : autoShouldFlip;
  
  const isMega = pokemon?.name ? pokemon.name.includes('-mega') : false;
  const isGmax = pokemon?.name ? pokemon.name.includes('-gmax') : false;
  const isMegaOrGmax = isMega || isGmax;
  
  const scaleFactor = useMemo(() => {
    if (!pokemon) return 1;
    if (!arenaMode) {
      // In database details view, keep a consistent beautiful size that never clips
      return use2dSprite ? (isMegaOrGmax ? 1.05 : 1.1) : (isMegaOrGmax ? 0.92 : 0.95);
    }
    const h = pokemon.height || 10; // default 1.0m
    let baseScale = 1.35;
    if (h <= 3) baseScale = 1.25;        // Tiny scale (e.g. Joltik) is boosted so it remains visible
    else if (h <= 10) baseScale = 1.35;   // Small-Medium (e.g. Pikachu, Eevee)
    else if (h <= 20) baseScale = 1.50;   // Normal-Large (e.g. Charizard)
    else if (h <= 60) baseScale = 1.65;   // Huge
    else baseScale = 1.75;                // Giant (e.g. Steelix, Wailord) is clamped to fit perfectly
    
    if (use2dSprite) {
      // Improved dimensions for 2D pixel sprites in combat arena so they are larger and crisp
      if (h <= 4) {
        baseScale = 2.45; // Extra boost for tiny 2D pixel sprites (e.g. Joltik, Flab√©b√©, Cosmog)
      } else if (h <= 9) {
        baseScale = 2.25; // Boost for small 2D pixel sprites (e.g. Pikachu, Eevee, Diglett)
      } else if (h <= 20) {
        baseScale = 2.05; // Medium 2D pixel sprites
      } else {
        baseScale = 2.15; // Large/giant 2D pixel sprites
      }
      baseScale *= (isMegaOrGmax ? 1.20 : 1.35);
    } else {
      if (isMegaOrGmax) {
        baseScale *= 1.15; // Megas and G-Max forms share the exact same grand dimension
      }
    }
    return baseScale * scaleMultiplier;
  }, [pokemon?.height, pokemon?.name, isMega, isGmax, isMegaOrGmax, arenaMode, scaleMultiplier, use2dSprite]);

  
  const [clickAura, setClickAura] = useState(false);


  const handleClick = (e: any) => {
    if (isMegaOrGmax) {
      setClickAura(true);
      setTimeout(() => setClickAura(false), 500);
    }
    if (onClick) onClick(e);
  };

  // Preloading image in background to support progressive load
  useEffect(() => {
    setImageLoaded(false);
    if (!currentSrc || fallbackLevel >= 5) return;

    const img = new window.Image();
    img.src = currentSrc;
    img.referrerPolicy = "no-referrer";
    img.onload = () => {
      setImageLoaded(true);
    };
  }, [currentSrc, fallbackLevel]);

  if (!pokemon) return null;

  const idNum = pokemon.id || pokemon.url?.split('/').filter(Boolean).pop() || pokemon.name;
  const shinyPath = isShiny ? 'shiny/' : '';
  const silhouetteUrl = isBack
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${shinyPath}${idNum}.png`
    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinyPath}${idNum}.png`;

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center w-full h-full transition-all duration-700",
        className
      )}
      onClick={handleClick}
    >
      {clickAura && isMegaOrGmax && (
        <motion.div 
          className={cn("absolute inset-0 rounded-full blur-xl mix-blend-screen pointer-events-none -inset-4", pokemon?.name?.includes('-mega') ? "bg-cyan-500" : "bg-red-500")}
          initial={{ opacity: 1, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}

      <div className={cn("absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300", fallbackLevel >= 5 ? "opacity-100" : "opacity-0")}>
        <div className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest p-4 border border-cyan-500/20 bg-cyan-950/40 rounded-xl whitespace-nowrap">
          artwork invisible
        </div>
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        {/* Silhouette low-resolution placeholder */}
        <motion.img
          src={silhouetteUrl}
          alt="Silhouette Loading..."
          initial={{ 
            scaleX: finalFlip ? -scaleFactor * 0.95 : scaleFactor * 0.95, 
            scaleY: scaleFactor * 0.95, 
            opacity: 0.7 
          }}
          animate={{ 
            scaleX: finalFlip ? -scaleFactor : scaleFactor, 
            scaleY: scaleFactor, 
            opacity: (!imageLoaded && fallbackLevel < 5) ? 0.6 : 0,
            y: arenaMode ? [0, -10, 0] : 0 
          }}
          transition={{ 
            opacity: { duration: 0.5, ease: "easeInOut" },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            scaleX: { type: "spring", stiffness: 300, damping: 15 }
          }}
          className={cn(
            "absolute object-contain pointer-events-none select-none transition-transform duration-500",
            "max-w-[85vw] sm:max-w-[90%] max-h-[90%]"
          )}
          style={{
            filter: isPlayer 
              ? 'brightness(0) contrast(0) opacity(0.4) drop-shadow(0 0 8px rgba(6,182,212,0.8))'
              : 'brightness(0) contrast(0) opacity(0.4) drop-shadow(0 0 8px rgba(239,68,68,0.8))'
          }}
          referrerPolicy="no-referrer"
        />

        {/* Full high-resolution / animated sprite */}
        <motion.img
          src={fallbackLevel >= 5 ? undefined : currentSrc}
          alt={fallbackLevel >= 5 ? "" : pokemon?.name}
          onError={(e) => {
            if (fallbackLevel < 5) {
              setFallbackLevel(prev => prev + 1);
            } else {
              e.currentTarget.style.display = 'none';
            }
          }}
          initial={{ 
            scaleX: finalFlip ? -scaleFactor * 0.9 : scaleFactor * 0.9, 
            scaleY: scaleFactor * 0.9, 
            opacity: 0 
          }}
          animate={{ 
            scaleX: finalFlip ? -scaleFactor : scaleFactor, 
            scaleY: scaleFactor, 
            opacity: imageLoaded && fallbackLevel < 5 ? 1 : 0, 
            y: arenaMode ? [0, -10, 0] : 0 
          }}
          transition={{ 
            opacity: { duration: 0.4, ease: "easeOut" },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            scaleX: { type: "spring", stiffness: 300, damping: 15 }
          }}
          className={cn(
            "object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]",
            use2dSprite ? "[image-rendering:pixelated]" : "",
            "max-w-[85vw] sm:max-w-[90%] max-h-[90%]"
          )}
          style={{
            filter: isShiny && fallbackLevel > 0 ? 'hue-rotate(60deg) saturate(1.5)' : 'none'
          }}
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
});

const getOpponentMoveQuote = (pokeName: string, moveName: string) => {
  const lowerMove = moveName.toLowerCase();
  
  const translations: Record<string, Record<string, string>> = {
    it: {
      default: `Ecco il potere di ${pokeName}!`,
      fire: "Che le fiamme ti brucino!",
      water: "Travolto dalla corrente d'acqua!",
      electric: "Scossa ad alta tensione fulminea!",
      grass: "La natura reclama il suo regno!",
      ice: "Congelati sotto il gelo assoluto!",
      psychic: "La forza della mente supera la gravit√†!",
      dragon: "La rabbia del drago imperverser√†!",
      boost: "Ogni molecola del mio essere si sta ricaricando!",
      protect: "Scudo d'energia inattaccabile!",
      healing: "Rigenerazione cellulare avviata!"
    },
    es: {
      default: `¬°Aqu√≠ est√° el poder de ${pokeName}!`,
      fire: "¬°Que la llama eterna te consuma!",
      water: "¬°Arrastrado por las corrientes del oc√©ano!",
      electric: "¬°Rel√°mpago de alta tensi√≥n el√©ctrica!",
      grass: "¬°La naturaleza reclama su poder!",
      ice: "¬°Siente el fr√≠o absoluto!",
      psychic: "¬°Mi mentalidad supera cualquier fuerza f√≠sica!",
      dragon: "¬°La ira del drag√≥n se desata!",
      boost: "¬°Sintiendo la m√°xima energ√≠a competitiva!",
      protect: "¬°Escudo de energ√≠a impenetrable!",
      healing: "¬°Restauraci√≥n vital iniciada!"
    },
    fr: {
      default: `Voici le pouvoir de ${pokeName}!`,
      fire: "Que les flammes te consument !",
      water: "Emport√© par le courant marin !",
      electric: "D√©charge haute tension foudroyante !",
      grass: "La nature reprend ses droits !",
      ice: "Ressens le froid absolu !",
      psychic: "La force de l'esprit transcende la mati√®re !",
      dragon: "La col√®re du dragon fait rage !",
      boost: "Mon √©nergie atteint son paroxysme !",
      protect: "Bouclier d'√©nergie imp√©n√©trable !",
      healing: "R√©g√©n√©ration d'√©nergie entam√©e !"
    },
    de: {
      default: `Sieh die wahre Macht von ${pokeName}!`,
      fire: "Lass die Flammen dich verzehren!",
      water: "Weggesp√ºlt von der Flut!",
      electric: "Hochspannungsschock aktiv!",
      grass: "Die Kraft der Natur holt sich den Sieg!",
      ice: "Erfriere im absoluten Nullpunkt!",
      psychic: "Die Kraft des Geistes √ºberwindet alles!",
      dragon: "Die Wut des Drachen bricht los!",
      boost: "Meine Energie steigt ins Unermessliche!",
      protect: "Undurchdringlicher Energieschild!",
      healing: "Heilungszellen aktiviert!"
    },
    en: {
      default: `${pokeName} unleashes pure power!`,
      fire: "Let the raging flames burn through your defenses!",
      water: "Get swept away by the hydro tidal currents!",
      electric: "Maximum high-voltage shock discharge!",
      grass: "The power of wild nature reclaims its hold!",
      ice: "Freeze under the weight of absolute zero!",
      psychic: "The power of the mind transcends physical force!",
      dragon: "The dragon's true wrath is unleashed!",
      boost: "My energy reserves are expanding to their absolute maximum!",
      protect: "Laying down impenetrable energy shields!",
      healing: "Cellular reconstruction process initialized!"
    }
  };

  const pool = translations['en'];
  
  if (lowerMove.includes('protect') || lowerMove.includes('detect') || lowerMove.includes('substitute')) return pool.protect;
  if (lowerMove.includes('recover') || lowerMove.includes('heal') || lowerMove.includes('roost') || lowerMove.includes('rest')) return pool.healing;
  if (lowerMove.includes('dance') || lowerMove.includes('calm') || lowerMove.includes('nasty') || lowerMove.includes('swords') || lowerMove.includes('charge')) return pool.boost;
  
  // check category or type
  if (lowerMove.includes('fire') || lowerMove.includes('burn') || lowerMove.includes('flame')) return pool.fire;
  if (lowerMove.includes('water') || lowerMove.includes('wave') || lowerMove.includes('surf') || lowerMove.includes('hydro')) return pool.water;
  if (lowerMove.includes('bolt') || lowerMove.includes('thunder') || lowerMove.includes('spark') || lowerMove.includes('shock')) return pool.electric;
  if (lowerMove.includes('leaf') || lowerMove.includes('giga') || lowerMove.includes('seed') || lowerMove.includes('grass')) return pool.grass;
  if (lowerMove.includes('ice') || lowerMove.includes('freeze') || lowerMove.includes('blizzard') || lowerMove.includes('chill')) return pool.ice;
  if (lowerMove.includes('psych') || lowerMove.includes('mind') || lowerMove.includes('zen') || lowerMove.includes('teleport')) return pool.psychic;
  if (lowerMove.includes('dragon') || lowerMove.includes('draco') || lowerMove.includes('claw') || lowerMove.includes('outrage')) return pool.dragon;
  
  return pool.default;
};

const getMoveButtonClasses = (type: string) => {
  const map: Record<string, string> = {
    normal: 'border-stone-500/50 text-stone-400',
    fire: 'border-red-500/50 text-red-400',
    water: 'border-blue-500/50 text-blue-400',
    electric: 'border-yellow-400/50 text-yellow-400',
    grass: 'border-emerald-500/50 text-emerald-400',
    ice: 'border-cyan-300/50 text-cyan-300',
    fighting: 'border-orange-700/50 text-orange-500',
    poison: 'border-purple-500/50 text-purple-400',
    ground: 'border-amber-600/50 text-amber-500',
    flying: 'border-sky-400/50 text-sky-400',
    psychic: 'border-pink-500/50 text-pink-400',
    bug: 'border-lime-500/50 text-lime-400',
    rock: 'border-yellow-800/50 text-yellow-600',
    ghost: 'border-indigo-600/50 text-indigo-400',
    dragon: 'border-violet-700/50 text-violet-400',
    dark: 'border-zinc-800/50 text-zinc-400',
    steel: 'border-zinc-500/50 text-zinc-400',
    fairy: 'border-rose-400/50 text-rose-400',
  };
  return map[type] ? `bg-slate-950 border ${map[type]} hover:bg-slate-900` : "bg-slate-900 border border-cyan-900/40 hover:border-cyan-500/60 text-cyan-300 hover:text-white";
};

const typeBaseColors: Record<string, string> = {
  normal: 'bg-[#A8A77A]',
  fire: 'bg-[#EE8130]',
  water: 'bg-[#6390F0]',
  electric: 'bg-[#F7D02C]',
  grass: 'bg-[#7AC74C]',
  ice: 'bg-[#96D9D6]',
  fighting: 'bg-[#C22E28]',
  poison: 'bg-[#A33EA1]',
  ground: 'bg-[#E2BF65]',
  flying: 'bg-[#A98FF3]',
  psychic: 'bg-[#F95587]',
  bug: 'bg-[#A6B91A]',
  rock: 'bg-[#B6A136]',
  ghost: 'bg-[#735797]',
  dragon: 'bg-[#6F35FC]',
  dark: 'bg-[#705746]',
  steel: 'bg-[#B7B7CE]',
  fairy: 'bg-[#D685AD]',
};

const typeHeaderGradients: Record<string, string> = {
  normal: 'bg-gradient-to-r from-[#8A8A68] via-[#686848] to-slate-900',
  fire: 'bg-gradient-to-r from-[#D06010] via-[#9C3800] to-slate-900',
  water: 'bg-gradient-to-r from-[#4870D0] via-[#2048B0] to-slate-900',
  electric: 'bg-gradient-to-r from-[#D8B010] via-[#A88800] to-slate-900',
  grass: 'bg-gradient-to-r from-[#58A830] via-[#387818] to-slate-900',
  ice: 'bg-gradient-to-r from-[#60B8B8] via-[#409090] to-slate-900',
  fighting: 'bg-gradient-to-r from-[#A82820] via-[#781008] to-slate-900',
  poison: 'bg-gradient-to-r from-[#883088] via-[#581858] to-slate-900',
  ground: 'bg-gradient-to-r from-[#C0A040] via-[#886818] to-slate-900',
  flying: 'bg-gradient-to-r from-[#8870D0] via-[#5838B8] to-slate-900',
  psychic: 'bg-gradient-to-r from-[#D03060] via-[#A01040] to-slate-900',
  bug: 'bg-gradient-to-r from-[#889810] via-[#586800] to-slate-900',
  rock: 'bg-gradient-to-r from-[#988010] via-[#605008] to-slate-900',
  ghost: 'bg-gradient-to-r from-[#584080] via-[#382858] to-slate-900',
  dragon: 'bg-gradient-to-r from-[#5020C0] via-[#3800A0] to-slate-900',
  dark: 'bg-gradient-to-r from-[#504030] via-[#382818] to-slate-900',
  steel: 'bg-gradient-to-r from-[#9090A8] via-[#606080] to-slate-900',
  fairy: 'bg-gradient-to-r from-[#C87088] via-[#984860] to-slate-900',
  stellar: 'bg-gradient-to-r from-[#2080D0] via-[#1040A0] to-slate-900',
};

const baseBadge = "relative overflow-hidden inline-flex items-center justify-center font-hud font-black uppercase tracking-widest text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-3px_6px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.5)] border border-white/20 rounded-md transition-all before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none";

const typeColors: Record<string, string> = {
  normal: `${baseBadge} bg-gradient-to-br from-[#A8A878] to-[#787848] ring-1 ring-[#A8A878]/50`,
  fire: `${baseBadge} bg-gradient-to-br from-[#F08030] to-[#C04000] ring-1 ring-[#F08030]/50`,
  water: `${baseBadge} bg-gradient-to-br from-[#6890F0] to-[#2050C0] ring-1 ring-[#6890F0]/50`,
  electric: `${baseBadge} bg-gradient-to-br from-[#F8D030] to-[#B89000] ring-1 ring-[#F8D030]/50`,
  grass: `${baseBadge} bg-gradient-to-br from-[#78C850] to-[#489820] ring-1 ring-[#78C850]/50`,
  ice: `${baseBadge} bg-gradient-to-br from-[#98D8D8] to-[#58A8A8] ring-1 ring-[#98D8D8]/50`,
  fighting: `${baseBadge} bg-gradient-to-br from-[#C03028] to-[#801010] ring-1 ring-[#C03028]/50`,
  poison: `${baseBadge} bg-gradient-to-br from-[#A040A0] to-[#601060] ring-1 ring-[#A040A0]/50`,
  ground: `${baseBadge} bg-gradient-to-br from-[#E0C068] to-[#A08028] ring-1 ring-[#E0C068]/50`,
  flying: `${baseBadge} bg-gradient-to-br from-[#A890F0] to-[#7860C0] ring-1 ring-[#A890F0]/50`,
  psychic: `${baseBadge} bg-gradient-to-br from-[#F85888] to-[#C82858] ring-1 ring-[#F85888]/50`,
  bug: `${baseBadge} bg-gradient-to-br from-[#A8B820] to-[#788800] ring-1 ring-[#A8B820]/50`,
  rock: `${baseBadge} bg-gradient-to-br from-[#B8A038] to-[#887018] ring-1 ring-[#B8A038]/50`,
  ghost: `${baseBadge} bg-gradient-to-br from-[#705898] to-[#402868] ring-1 ring-[#705898]/50`,
  dragon: `${baseBadge} bg-gradient-to-br from-[#7038F8] to-[#4008C8] ring-1 ring-[#7038F8]/50`,
  dark: `${baseBadge} bg-gradient-to-br from-[#705848] to-[#402818] ring-1 ring-[#705848]/50`,
  steel: `${baseBadge} bg-gradient-to-br from-[#B8B8D0] to-[#8888A0] ring-1 ring-[#B8B8D0]/50`,
  fairy: `${baseBadge} bg-gradient-to-br from-[#EE99AC] to-[#BD687B] ring-1 ring-[#EE99AC]/50`,
  stellar: `${baseBadge} bg-gradient-to-br from-[#40A8FF] to-[#1068C0] ring-1 ring-[#40A8FF]/50`,
};

const statExplanations: Record<string, string> = {
  hp: "Hit Points: Determines how much damage a Pok√©mon can take before fainting.",
  attack: "Physical Attack: Affects the damage dealt by physical moves.",
  defense: "Physical Defense: Reduces the damage taken from physical moves.",
  "special-attack": "Special Attack: Affects the damage dealt by special moves.",
  "special-defense": "Special Defense: Reduces the damage taken from special moves.",
  speed: "Speed: Determines which Pok√©mon moves first in battle.",
};

const NATURES = [
  { name: 'Hardy', plus: null, minus: null },
  { name: 'Lonely', plus: 'attack', minus: 'defense' },
  { name: 'Brave', plus: 'attack', minus: 'speed' },
  { name: 'Adamant', plus: 'attack', minus: 'special-attack' },
  { name: 'Naughty', plus: 'attack', minus: 'special-defense' },
  { name: 'Bold', plus: 'defense', minus: 'attack' },
  { name: 'Docile', plus: null, minus: null },
  { name: 'Relaxed', plus: 'defense', minus: 'speed' },
  { name: 'Impish', plus: 'defense', minus: 'special-attack' },
  { name: 'Lax', plus: 'defense', minus: 'special-defense' },
  { name: 'Timid', plus: 'speed', minus: 'attack' },
  { name: 'Hasty', plus: 'speed', minus: 'defense' },
  { name: 'Serious', plus: null, minus: null },
  { name: 'Jolly', plus: 'speed', minus: 'special-attack' },
  { name: 'Naive', plus: 'speed', minus: 'special-defense' },
  { name: 'Modest', plus: 'special-attack', minus: 'attack' },
  { name: 'Mild', plus: 'special-attack', minus: 'defense' },
  { name: 'Quiet', plus: 'special-attack', minus: 'speed' },
  { name: 'Bashful', plus: null, minus: null },
  { name: 'Rash', plus: 'special-attack', minus: 'special-defense' },
  { name: 'Calm', plus: 'special-defense', minus: 'attack' },
  { name: 'Gentle', plus: 'special-defense', minus: 'defense' },
  { name: 'Sassy', plus: 'special-defense', minus: 'speed' },
  { name: 'Careful', plus: 'special-defense', minus: 'special-attack' },
  { name: 'Quirky', plus: null, minus: null },
];

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


const getBattleBackground = (playerType?: string, opponentType?: string) => {
  const map: Record<string, string> = {
    normal: 'grassy meadow with wild daisies and soft rustic plains', 
    grass: 'mystical deep forest filled with lush bioluminescent ferns and ancient moss-covered trees', 
    bug: 'vibrant retro overgrown jungle canopy with glowing fireflies and twisted hanging vines',
    fire: 'epic dynamic volcanic crater with bubbling hot neon orange flowing lava rivers',
    water: 'crashing ocean shore waves under a dark marine crest with spray and sea foam', 
    ice: 'crystal glacier ice cavern glittering with sapphire icicles and frozen walls',
    rock: 'sharp dramatic mountain peak summit with crumbling stones and high thin atmosphere', 
    ground: 'sandy desert canyons with windblown sand dunes and dry cracked earth', 
    fighting: 'legendary martial arts temple dojo with sacred tatami mats and stone lanterns',
    electric: 'high-tech high-voltage electrical power plant grid with blue sparks and generator coils', 
    steel: 'brutal industrial mechanical gear factory with turning steel cogs and steam escape vents',
    psychic: 'mystical abstract celestial galaxy warp with cosmic nebulas, purple star clusters, and space dimensional rifts', 
    ghost: 'spooky gothic haunted cemetery path lined with tombstones under an ethereal low-hanging violet fog', 
    dark: 'cool low-key retro moonlit city rooftops at midnight under a purple starry night sky', 
    poison: 'toxic glowing acid swamp pools with bubbling purple sludge and mossy tree trunks',
    dragon: 'ancient misty mountain valley ruins of a forgotten dragon temple with stone runic pillars', 
    flying: 'soaring high-altitude sky filled with epic turbulent thunderstorm clouds and sky ribbons', 
    fairy: 'magical glowing fantasy dreamscape meadow with pastel crystal spires and sparkling glitter dust'
  };

  const pType = playerType || 'normal';
  const oType = opponentType || 'normal';

  const pDesc = map[pType] || `${pType} wilderness`;
  const oDesc = map[oType] || `${oType} sanctuary`;

  let keyword = '';
  if (pType === oType) {
    keyword = `pure majestic landscape of a ${pDesc}`;
  } else {
    keyword = `epic symmetric split-screen Pok√©mon stadium battleground arena: on the left side is a gorgeous ${pDesc} fading into a stunning ${oDesc} on the right side, seamlessly merged at the vertical center line`;
  }

  const basePrompt = `16-bit vintage retro pixel art aesthetic pokemon showdown battle stadium arena background, high detail pixel texture, beautiful scenic landscape environment, ${keyword}, epic cinematic mood, high-contrast, beautiful rich colors, native game screen capture`;
  const prompt = encodeURIComponent(basePrompt);
  
  const textSeed = `${pType}-${oType}-clear`;
  let seedVal = 42;
  for (let i = 0; i < textSeed.length; i++) {
    seedVal = (seedVal * 31 + textSeed.charCodeAt(i)) % 1000;
  }
  
  return `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=576&nologo=true&seed=${seedVal || 42}`;
};

const getBattleFallbackGradient = (playerType?: string, opponentType?: string) => {
  const pType = playerType || 'normal';
  const oType = opponentType || 'normal';
  
  const colors: Record<string, string> = {
    normal: '#4b5563', grass: '#047857', bug: '#4d7c0f',
    fire: '#b91c1c', water: '#1d4ed8', ice: '#0369a1',
    rock: '#78350f', ground: '#a16207', fighting: '#991b1b',
    electric: '#5f3e09', steel: '#475569', psychic: '#be185d',
    ghost: '#6d28d9', dark: '#111827', poison: '#7e22ce',
    dragon: '#4338ca', flying: '#0284c7', fairy: '#9d174d'
  };

  const color1 = colors[pType] || colors.normal;
  const color2 = colors[oType] || colors.normal;
  
  return `linear-gradient(135deg, ${color1}cc 0%, ${color1}cc 40%, #020617 40%, #020617 60%, ${color2}cc 60%, ${color2}cc 100%)`;
};

const HUDCorners = memo(({ className }: { className?: string }) => null);

interface PokethologyRadarScannerProps {
  onAbort: () => void;
  targetName?: string;
}

const PokethologyRadarScanner = memo(({ onAbort, targetName }: PokethologyRadarScannerProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev < 96) {
          return prev + Math.floor(Math.random() * 3) + 2; // Smooth 4s steady progression
        }
        return prev;
      });
    }, 80);

    const watchdog = setTimeout(onAbort, 4000); // 4s buffer auto-bypass for smooth data pre-caching

    return () => {
      clearInterval(progressTimer);
      clearTimeout(watchdog);
    };
  }, [onAbort]);

  const formattedName = targetName ? targetName.replace(/-/g, ' ').toUpperCase() : "POK√âMON";

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] w-full max-w-sm mx-auto p-6 text-center select-none relative overflow-hidden my-auto">
      {/* Sleek Glowing Pok√©ball Spinner */}
      <div className="relative w-24 h-24 mb-5 flex items-center justify-center shrink-0">
        <div className="absolute inset-0 rounded-full bg-cyan-500/15 blur-xl animate-pulse" />
        
        {/* Modern Pokeball vector spinner */}
        <div className="relative w-16 h-16 rounded-full border-3 border-slate-950 bg-white overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.3)] animate-spin" style={{ animationDuration: '1.6s' }}>
          <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-red-500 to-rose-600 border-b-3 border-slate-950" />
          <div className="absolute top-1/2 left-1/2 -ml-3 -mt-3 w-6 h-6 bg-white border-3 border-slate-950 rounded-full flex items-center justify-center z-10 shadow-sm">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
          </div>
        </div>
      </div>

      {/* Clean Status Text */}
      <div className="space-y-1 mb-5 z-10">
        <h2 className="font-hud text-base sm:text-lg font-black tracking-wider text-slate-100 uppercase">
          SCANNING {formattedName}...
        </h2>
        <p className="text-[11px] font-mono text-cyan-400/90 tracking-widest uppercase animate-pulse">
          Syncing Pok√©dex Registry
        </p>
      </div>

      {/* Minimalist Progress Line */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3 z-10">
        <div className="w-full h-1.5 bg-slate-900/90 rounded-full overflow-hidden border border-slate-800/80 relative">
          <div 
            style={{ width: `${Math.min(100, progress)}%` }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.7)] transition-all duration-200"
          />
        </div>
        
        <button
          onClick={onAbort}
          className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors uppercase tracking-wider underline cursor-pointer py-1 px-3"
        >
          Cancel
        </button>
      </div>
    </div>
  );
});

PokethologyRadarScanner.displayName = "PokethologyRadarScanner";


const TerrainEffect = memo(({ playerType, opponentType }: { playerType?: string; opponentType?: string }) => {
  // Determine ambient effect based on primary pokemon types
  const effectType = useMemo(() => {
    if (playerType === 'fire' || opponentType === 'fire') return 'fire';
    if (playerType === 'water' || opponentType === 'water') return 'water';
    if (playerType === 'electric' || opponentType === 'electric') return 'electric-ambient';
    if (playerType === 'ice' || opponentType === 'ice') return 'ice';
    if (playerType === 'ghost' || opponentType === 'ghost' || playerType === 'dark' || opponentType === 'dark') return 'shadow';
    return null;
  }, [playerType, opponentType]);

  if (!effectType) return null;

  return (
    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none select-none rounded-xl sm:rounded-2xl ">
      {/* Electric ambient overlay */}
      {effectType === 'electric-ambient' && (
        <div className="absolute inset-0 bg-yellow-950/15">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(234,179,8,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(234,179,8,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(234,179,8,0.15)_0%,transparent_80%)] animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-yellow-400/45 rounded-full "
                style={{
                  width: '2px',
                  height: `${12 + (i % 3) * 15}px`,
                  left: `${15 + i * 14}%`,
                  bottom: `${10 + (i * 20) % 70}%`,
                  boxShadow: '0 0 6px rgba(234,179,8,0.6)',
                  animation: `sparkleVertical ${1.5 + (i % 2) * 0.8}s ease-in-out infinite`,
                  animationDelay: `${i * 0.25}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fire weather effect */}
      {effectType === 'fire' && (
        <div className="absolute inset-0 bg-red-950/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0%,transparent_75%)] animate-pulse" style={{ animationDuration: '2.5s' }} />
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-orange-500/50 rounded-full "
                style={{
                  width: `${3 + (i % 3) * 2}px`,
                  height: `${3 + (i % 3) * 2}px`,
                  left: `${10 + i * 11}%`,
                  bottom: `-10px`,
                  boxShadow: '0 0 6px rgba(249,115,22,0.6)',
                  animation: `emberRise ${3 + (i % 3) * 1.5}s ease-out infinite`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Water weather effect */}
      {effectType === 'water' && (
        <div className="absolute inset-0 bg-blue-950/15">
          <div className="absolute inset-0 bg-slate-900/5 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1)_0%,transparent_80%)]" />
          <div className="absolute inset-0">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-blue-400/25 rounded "
                style={{
                  width: '1px',
                  height: `${20 + (i % 4) * 15}px`,
                  left: `${5 + i * 9}%`,
                  top: `-50px`,
                  transform: 'rotate(15deg)',
                  animation: `rainFall ${0.8 + (i % 3) * 0.2}s linear infinite`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Ice weather effect */}
      {effectType === 'ice' && (
        <div className="absolute inset-0 bg-cyan-950/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1)_0%,transparent_80%)] animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white/40 rounded-full "
                style={{
                  width: `${4 + (i % 3) * 2}px`,
                  height: `${4 + (i % 3) * 2}px`,
                  left: `${8 + i * 11}%`,
                  top: `-10px`,
                  animation: `fallAndSway ${5 + (i % 3) * 2}s linear infinite`,
                  animationDelay: `${i * 0.25}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Shadow / Twilight ambient effect */}
      {effectType === 'shadow' && (
        <div className="absolute inset-0 bg-purple-950/15">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.08)_0%,transparent_85%)] animate-pulse" style={{ animationDuration: '7s' }} />
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-purple-900/15 rounded-full blur-xl"
                style={{
                  width: `${80 + (i % 3) * 40}px`,
                  height: `${80 + (i % 3) * 40}px`,
                  left: `${15 + i * 18}%`,
                  top: `${20 + (i * 12) % 50}%`,
                  animation: `shadowDrift ${10 + i * 3}s ease-in-out infinite alternate`,
                  animationDelay: `${i * 1.5}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

TerrainEffect.displayName = "TerrainEffect";

const PokemonTcgCard = memo(({ displayId, pokemonName, className }: { displayId: string; pokemonName: string; className?: string }) => {
  const [error, setError] = useState(false);
  const artworkUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${displayId}.png`;

  if (error) {
    return (
      <div className={cn(className, "border border-slate-700 bg-slate-900/50 flex justify-center items-center rounded text-[8px] text-slate-400 font-mono text-center p-2")}>
        {pokemonName}
      </div>
    );
  }

  return (
    <img
      src={artworkUrl}
      alt={pokemonName}
      className={cn(className, "object-contain rounded filter drop-shadow-[0_0_12px_rgba(34,211,238,0.3)]")}
      referrerPolicy="no-referrer"
      draggable={false}
      onError={() => setError(true)}
    />
  );
});

const PokemonCardSprite = memo(({ pokemonName, id, className, isShiny, use2dSprite }: { pokemonName: string; id: string | undefined; className: string; isShiny?: boolean; use2dSprite?: boolean }) => {
    const [fallbackLvl, setFallbackLvl] = useState(0);

  useEffect(() => {
    setFallbackLvl(0);
  }, [pokemonName, isShiny, use2dSprite]);

  const getSrcAtLevel = (lvl: number): string => {
    const cleanName = getShowdownName(pokemonName);
    const parsedId = id && !isNaN(parseInt(id, 10)) ? parseInt(id, 10) : undefined;
    const normName = pokemonName?.toLowerCase()?.trim() || '';
    const formId = POKEMON_FORM_IDS[normName] || (parsedId && parsedId > 1025 ? parsedId : undefined);

    if (use2dSprite) {
      if (lvl === 0) {
        return getPokemonSpriteUrl({ name: pokemonName, formId, displayId: parsedId }, { isShiny, use2d: true });
      }
      if (lvl === 1) {
        return `https://play.pokemonshowdown.com/sprites/gen5${isShiny ? '-shiny' : ''}/${cleanName}.png`;
      }
      if (lvl === 2) {
        return `https://play.pokemonshowdown.com/sprites/ani${isShiny ? '-shiny' : ''}/${cleanName}.gif`;
      }
      return getPokemonArtworkUrl({ name: pokemonName, formId, displayId: parsedId }, { isShiny });
    }
    
    if (lvl === 0) {
      return getPokemonArtworkUrl({ name: pokemonName, formId, displayId: parsedId }, { isShiny });
    }
    if (lvl === 1) {
      // Showdown 2D png fallback (good for megas and gmax)
      return `https://play.pokemonshowdown.com/sprites/gen5${isShiny ? '-shiny' : ''}/${cleanName}.png`;
    }
    if (lvl === 2) {
      // Showdown Animated gif fallback
      return `https://play.pokemonshowdown.com/sprites/ani${isShiny ? '-shiny' : ''}/${cleanName}.gif`;
    }
    // Final fallback to raw PokeAPI sprite
    return getPokemonSpriteUrl({ name: pokemonName, formId, displayId: parsedId }, { isShiny });
  };

  const currentSrc = getSrcAtLevel(fallbackLvl);

  return (
    <img
      src={currentSrc}
      alt={pokemonName}
      referrerPolicy="no-referrer"
      draggable={false}
      className={cn(className, use2dSprite ? "[image-rendering:pixelated]" : "", "w-full h-full object-contain scale-[1.1] group-hover:scale-[1.3] drop-shadow-[0_10px_15px_rgba(34,211,238,0.2)]")}
      loading="lazy"
      onError={(e) => {
        if (fallbackLvl < 3) {
          setFallbackLvl(l => l + 1);
        } else {
          e.currentTarget.style.display = 'none';
        }
      }}
    />
  );
});

const PokemonCard = memo(({ p, isSelected, isOpponentSelected, enableAnimations, onClick, isShiny, isCardView, isLightMode, use2dSprite, isFav, onToggleFavorite }: any) => {
    const id = p.url.split('/').filter(Boolean).pop();
  const displayId = p.displayId || p.baseId || id;
  const isSpecial = parseInt(id || "0") > 1025 && !p.displayId;
  const isMega = p.name.includes('-mega');
  const isGmax = p.name.includes('-gmax');

  const [clickAura, setClickAura] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cardType, setCardType] = useState<string | null>(null);

  useEffect(() => {
    if ((isHovered || isSelected || isOpponentSelected) && !cardType && p.url) {
      let isMounted = true;
      fetch(p.url)
        .then(res => res.json())
        .then(data => {
          if (isMounted && data.types && data.types[0]) {
            setCardType(data.types[0].type.name);
          }
        })
        .catch(err => console.error("Failed to fetch card type", err));
      return () => { isMounted = false; };
    }
  }, [isHovered, isSelected, isOpponentSelected, cardType, p.url]);


  // Framer Motion spring-bound coordinates for hyper-optimized 3D Tilt hover effect (Zero React Re-renders)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 240, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableAnimations) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const valX = (e.clientX - rect.left) / width;
    const valY = (e.clientY - rect.top) / height;
    mouseX.set(valX);
    mouseY.set(valY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const handleClick = () => {
    if (isMega || isGmax) {
      setClickAura(true);
      setTimeout(() => setClickAura(false), 500);
    }
    onClick(p.name);
  };
  
  const spriteClasses = cn(
    "transition-transform duration-500  select-none max-w-[150%] max-h-[150%]",
    (isSelected || isOpponentSelected) 
      ? "!scale-[1.6]" 
      : "opacity-90 group-hover:opacity-100"
  );
  
  return (
    <motion.div
      layout={enableAnimations}
      role="button"
      tabIndex={0}
      initial={enableAnimations ? { opacity: 0, scale: 0.95 } : undefined}
      animate={enableAnimations ? { opacity: 1, scale: 1 } : undefined}
      exit={enableAnimations ? { opacity: 0, scale: 0.95 } : undefined}
      whileHover={enableAnimations ? { scale: 1.04, y: -5, boxShadow: "0 20px 35px -5px rgba(6,182,212,0.22)" } : undefined}
      whileTap={enableAnimations ? { scale: 0.97, y: 0 } : undefined}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={enableAnimations ? { 
        rotateX, 
        rotateY, 
        transformStyle: "preserve-3d",
        perspective: 605
      } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        sounds.hover();
      }}
      className={cn(
        "border rounded-xl p-3 flex flex-col items-center transition-all group cursor-pointer relative overflow-hidden h-32 sm:h-36 justify-center  shadow-lg",
        isLightMode
          ? "bg-white border-slate-200 hover:bg-cyan-50/20 hover:border-cyan-400"
          : "bg-slate-950/40 border-slate-800/50 hover:bg-cyan-950/20 hover:border-cyan-500/40",
        isSelected && (
          isLightMode
            ? "bg-cyan-50 border-cyan-500 ring-1 ring-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)] z-10"
            : "bg-cyan-900/40 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/50 z-10"
        ),
        isOpponentSelected && (
          isLightMode
            ? "bg-rose-50 border-rose-500 ring-1 ring-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.15)] z-10"
            : "bg-red-900/40 border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.25)] ring-1 ring-red-400/50 z-10"
        ),
        isCardView && (isLightMode ? "p-1 bg-slate-100" : "p-1 bg-slate-900")
      )}
    >
      {clickAura && (isMega || isGmax) && (
        <motion.div 
          className={cn("absolute inset-0 z-0 blur-md mix-blend-screen pointer-events-none -inset-2", isMega ? "bg-cyan-500/50" : "bg-red-500/50")}
          initial={{ opacity: 1, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b  r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Type-based Particle Aura */}
      <AnimatePresence>
        {(isHovered || isSelected || isOpponentSelected) && cardType && typeBaseColors[cardType] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1.5 h-1.5 rounded-full blur-[1px] ${typeBaseColors[cardType]}`}
                initial={{
                  x: Math.random() * 100 + "%",
                  y: "110%",
                  scale: Math.random() * 0.5 + 0.5,
                  opacity: Math.random() * 0.5 + 0.2
                }}
                animate={{
                  y: "-10%",
                  x: `${Math.random() * 100}%`,
                  opacity: [0, Math.random() * 0.5 + 0.2, 0],
                  scale: [Math.random() * 0.5 + 0.5, Math.random() * 1.5 + 0.5, 0]
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: Math.random() * 2
                }}
              />
            ))}
            <div className={`absolute inset-0 opacity-20 blur-xl ${typeBaseColors[cardType]}`} />
          </motion.div>
        )}
      </AnimatePresence>
      {!isCardView && <HUDCorners />}
      
      {/* ID Badge */}
      {!isCardView && (
        <div className="absolute top-2 left-2.5 px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[7px] font-bold font-mono text-cyan-600 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all flex items-center gap-1 z-20">
          {isSpecial && !isMega && !isGmax
            ? "SPECIAL" 
            : `#${String(displayId || "0").padStart(4, '0')}`}
        </div>
      )}

      {/* Favorite Star Toggle (Opposite side of ID badge) */}
      {!isCardView && onToggleFavorite && (
        <button 
          type="button"
          className="absolute top-2 right-2.5 z-30 p-1 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-yellow-500/60 transition-all cursor-pointer shadow-sm group/star"
          onClick={(e) => {
            e.stopPropagation();
            try { sounds.hover(); } catch (_) {}
            const numId = id && !isNaN(parseInt(id, 10)) ? parseInt(id, 10) : undefined;
            const normName = p.name?.toLowerCase()?.trim() || '';
            const formId = p.formId || POKEMON_FORM_IDS[normName] || (numId && numId > 1025 ? numId : undefined);
            onToggleFavorite({
              name: p.name,
              url: p.url,
              displayId: p.displayId || p.baseId || numId,
              formId,
              baseId: p.baseId || p.displayId,
              artwork: p.artwork
            });
          }}
          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Star 
            className={cn(
              "w-3.5 h-3.5 transition-transform duration-200 group-hover/star:scale-110", 
              isFav ? "fill-yellow-400 text-yellow-400 filter drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]" : "text-slate-500 group-hover/star:text-yellow-300"
            )} 
          />
        </button>
      )}

      {/* Scanline Effect */}
      {!isCardView && <div className="absolute inset-0 pointer-events-none opacity-[0.03] group-hover:opacity-[0.07] transition-opacity z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>}

      <div className={cn("relative z-10 flex items-center justify-center", isCardView ? "w-full h-full" : "w-20 h-20 sm:w-24 sm:h-24")}>
        {/* Sprite Glow */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)' }}></div>
        
        {enableAnimations && (isSelected || isOpponentSelected) && (
          <motion.div 
            className={cn(
              "absolute inset-0 rounded-full opacity-20",
              isSelected ? "bg-[radial-gradient(circle,rgba(34,211,238,1)_0%,transparent_70%)]" : "bg-[radial-gradient(circle,rgba(248,113,113,1)_0%,transparent_70%)]"
            )}
            animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.3, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
        
        {isCardView ? (
          <PokemonTcgCard displayId={String(displayId)} pokemonName={p.name} className="w-full h-full" />
        ) : (
          <PokemonCardSprite
            pokemonName={p.name}
            id={id}
            isShiny={isShiny}
            use2dSprite={use2dSprite}
            className={spriteClasses}
          />
        )}
      </div>

      {!isCardView && (
        <span className={cn(
          "font-hud text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-wider uppercase tracking-[0.1em] sm:tracking-[0.2em] mt-2 relative z-20 transition-colors break-words whitespace-normal leading-tight w-full text-center px-1",
          isSelected ? "text-cyan-300" : isOpponentSelected ? "text-red-300" : "text-slate-400 group-hover:text-cyan-300"
        )}>
          {p.name.replace(/-/g, ' ')}
        </span>
      )}
    </motion.div>
  );
});

interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

interface QuizData {
  date: string;
  questions: QuizQuestion[];
  isFallback?: boolean;
}

const OFFLINE_QUIZ_FALLBACK = {
  date: new Date().toISOString().split('T')[0],
  isFallback: true,
  questions: [
    {
      question: "Who is considered the 'Renegade Pok√©mon' in Sinnoh cosmology, banished due to its violent nature?",
      options: ["Kyurem", "Giratina", "Necrozma", "Darkrai"],
      answerIndex: 1,
      explanation: "Giratina was created alongside Dialga and Palkia but was banished to the Distortion World by Arceus due to its exceptionally violent and destructive nature. It represents antimatter and gravity."
    },
    {
      question: "According to ancient legends, Mew is the genetic ancestor of all Pok√©mon, but why does Arceus precede Mew in mythology?",
      options: [
        "Mew was created by human scientists to clone Arceus",
        "Arceus is the creator deity who hatched from an egg in nothingness, and Mew represents the ancestor of all common mortal species",
        "Mew and Arceus fought in a primordial war, and Mew lost",
        "Arceus is actually an evolved form of Mew"
      ],
      answerIndex: 1,
      explanation: "Arceus is the divine prime creator who hatched from the cosmic egg in a void of nothingness, whereas Mew acts as the biological stem-ancestor containing the DNA of all non-deity Pok√©mon."
    },
    {
      question: "The Lake Guardians (Uxie, Mesprit, and Azelf) were birthed from a single egg. What core philosophical aspects of the human spirit do they govern?",
      options: ["Body, Mind, and Soul", "Time, Space, and Matter", "Knowledge, Emotion, and Willpower", "Truth, Ideals, and Void"],
      answerIndex: 2,
      explanation: "Created by Arceus, Uxie governs Knowledge (giving humans mind), Mesprit governs Emotion (giving humans heart), and Azelf governs Willpower (giving humans resolve)."
    }
  ]
};

let globalPrefetchedQuiz: any = null;

if (typeof window !== 'undefined') {
  fetch('/api/quiz')
    .then(r => {
      if (r.ok) return r.json();
      throw new Error();
    })
    .then(d => {
      globalPrefetchedQuiz = d;
    })
    .catch(() => {});
}

// PokethologyQuizWidget is imported from ./components/PokethologyQuizWidget


const PokemonGrid = memo(({ list, displayLimit, selectedName, opponentName, enableAnimations, onClick, isShiny, isCardView, isLightMode, use2dSprite, isFavorite, onToggleFavorite }: any) => {
  return (
    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4 py-2 px-1">
      {list.slice(0, displayLimit).map((p: any, i: number) => (
        <PokemonCard
          key={`${p.name || 'poke'}-${p.id || i}-${i}`}
          p={p}
          isSelected={p.name === selectedName}
          isOpponentSelected={p.name === opponentName}
          enableAnimations={enableAnimations}
          onClick={onClick}
          isShiny={isShiny}
          isCardView={isCardView}
          isLightMode={isLightMode}
          use2dSprite={use2dSprite}
          isFav={isFavorite ? isFavorite(p.name) : false}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
});

const BattleLog = memo(({ log, enableAnimations, turn, isBattling }: { log: (LogEntry & { turn?: number })[]; enableAnimations: boolean; turn: string; isBattling: boolean }) => {
    const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log.length, isBattling, turn]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      ref={logRef} 
      className="bg-slate-900/30 backdrop-blur-md rounded-xl p-3 sm:p-4 h-32 sm:h-40 md:h-48 overflow-y-auto custom-scrollbar optimize-scrolling font-mono text-[10px] sm:text-[11px] sm:leading-relaxed font-bold tracking-wider space-y-1 sm:space-y-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] shrink-0 pointer-events-auto scroll-smooth" 
      style={{ overflowAnchor: 'none' }}
    >
      {log.slice(-50).map((entry, i) => {
        const isLatest = i === log.length - 1;
        let colorClass = "text-slate-400 border-slate-800 bg-slate-900/40";
        let Icon = Info;

        if (entry.type === 'player') { 
          colorClass = "text-cyan-400 border-cyan-500/30 bg-cyan-950/40 shadow-[0_0_10px_rgba(34,211,238,0.1)]"; 
          Icon = Swords; 
        }
        else if (entry.type === 'opponent') { 
          colorClass = "text-red-400 border-red-500/30 bg-red-950/40 shadow-[0_0_10px_rgba(248,113,113,0.1)]"; 
          Icon = Swords; 
        }
        else if (entry.type === 'critical') { 
          colorClass = "text-yellow-400 border-yellow-500/50 bg-yellow-950/40 font-bold italic"; 
          Icon = Zap; 
        }
        else if (entry.type === 'effective') { 
          colorClass = "text-green-400 border-green-500/30 bg-green-950/40"; 
          Icon = Target; 
        }
        else if (entry.type === 'not-effective') { 
          colorClass = "text-slate-400 border-slate-500/30 bg-slate-900/60"; 
          Icon = Shield; 
        }
        else if (entry.type === 'stat-boost') { 
          colorClass = "text-blue-400 border-blue-500/30 bg-blue-950/40"; 
          Icon = TrendingUp; 
        }
        else if (entry.type === 'stat-lower') { 
          colorClass = "text-purple-400 border-purple-500/30 bg-purple-950/40"; 
          Icon = TrendingDown; 
        }
        else if (entry.type === 'status-effect') { 
          colorClass = "text-orange-400 border-orange-500/30 bg-orange-950/40"; 
          Icon = AlertTriangle; 
        }
        else if (entry.type === 'faint') { 
          colorClass = "text-red-500 border-red-600/50 bg-red-950/60 font-bold uppercase tracking-tighter"; 
          Icon = Skull; 
        }
        else if (entry.type === 'system') { 
          colorClass = "text-white border-white/20 bg-white/5 font-bold"; 
          Icon = Activity; 
        }
        else if (entry.type === 'normal') {
          if (entry.text.includes('Damage:')) { 
            colorClass = "text-slate-400 border-slate-700/30 italic bg-slate-900/20"; 
            Icon = Crosshair; 
          }
          else if (entry.text.includes('DEFENSE') || entry.text.includes('PROTECT')) {
            Icon = Shield;
          }
        }

        return (
          <div 
            key={`battle-log-${entry.turn || turn}-${entry.type || ''}-${i}`} 
            className={cn(
              "border rounded-lg px-2 py-1.5 flex items-center gap-2 transition-all duration-300",
              enableAnimations && !isLatest && "animate-in fade-in slide-in-from-left-1",
              isLatest && "ring-1 ring-white/20 scale-[1.01] bg-white/5 shadow-lg animate-pulse",
              colorClass
            )}
          >
            {entry.turn && (
              <span className="text-[7px] opacity-40 font-mono mr-1">T{entry.turn}</span>
            )}
            <div className="flex-shrink-0 p-1 rounded bg-black/30 border border-white/5">
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="flex-1 leading-tight">{entry.text}</span>
          </div>
        );
      })}
      {isBattling && turn === 'opponent' && (
        <div className="text-red-500 font-hud animate-pulse py-1.5 px-2 tracking-widest flex items-center gap-2 text-[8px] sm:text-[10px]">
          <Loader2 className="w-3 h-3 animate-spin" /> Opponent is thinking...
        </div>
      )}
    </motion.div>
  );
});

const StatusOverlay = memo(({ status }: { status: string | null }) => {
  if (!status) return null;

  return (
    <div className="absolute inset-0 pointer-events-none touch-none select-none z-20 flex items-center justify-center overflow-visible ">
      {/* BRN - Burn */}
      {(status === 'BRN' || status === 'BUR') && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none touch-none">
          <motion.div
            className="absolute inset-2 sm:inset-3 rounded-full border-2 border-orange-500/60 bg-orange-600/10 pointer-events-none touch-none"
            animate={{ scale: [0.96, 1.02, 0.96], opacity: [0.7, 0.9, 0.7] }}
            transition={{ repeat: Infinity, duration: 2.0, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-1 flex items-center justify-center pointer-events-none touch-none"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          >
            <Flame className="absolute -top-1 w-3.5 h-3.5 text-orange-400" />
            <div className="absolute -bottom-1 w-2 h-2 rounded-full bg-orange-500" />
            <div className="absolute -left-1 w-2 h-2 rounded-full bg-amber-400" />
            <Flame className="absolute -right-1 w-3 h-3 text-red-400" />
          </motion.div>
        </div>
      )}

      {/* PSN - Poison */}
      {(status === 'PSN' || status === 'POI') && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none touch-none">
          <motion.div
            className="absolute inset-2 sm:inset-3 rounded-full border-2 border-purple-500/60 bg-purple-900/15 pointer-events-none touch-none"
            animate={{ scale: [0.96, 1.02, 0.96], opacity: [0.7, 0.9, 0.7] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-1 flex items-center justify-center pointer-events-none touch-none"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
          >
            <div className="absolute -top-1 w-2.5 h-2.5 rounded-full bg-purple-400 border border-purple-200/50" />
            <div className="absolute -bottom-1 w-3 h-3 rounded-full bg-fuchsia-500 border border-purple-200/50" />
            <div className="absolute -left-1 w-2 h-2 rounded-full bg-indigo-500" />
            <div className="absolute -right-1 w-2.5 h-2.5 rounded-full bg-purple-500" />
          </motion.div>
        </div>
      )}

      {/* PAR - Paralysis */}
      {status === 'PAR' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none touch-none">
          <motion.div
            className="absolute inset-2 sm:inset-3 rounded-full border-2 border-dashed border-yellow-400/80 pointer-events-none touch-none"
            animate={{ scale: [0.97, 1.02, 0.97] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          />
          <div className="absolute inset-1 flex items-center justify-center pointer-events-none touch-none">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
              className="absolute -top-1.5 text-yellow-300"
            >
              <Zap className="w-3.5 h-3.5 fill-yellow-300" />
            </motion.div>
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 0.9, delay: 0.2, ease: "easeInOut" }}
              className="absolute -bottom-1.5 text-yellow-400"
            >
              <Zap className="w-3.5 h-3.5 fill-yellow-400" />
            </motion.div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 0.85, delay: 0.4, ease: "easeInOut" }}
              className="absolute -left-1.5 text-amber-300"
            >
              <Zap className="w-3 h-3 fill-amber-300" />
            </motion.div>
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: 0.15, ease: "easeInOut" }}
              className="absolute -right-1.5 text-yellow-300"
            >
              <Zap className="w-3.5 h-3.5 fill-yellow-300" />
            </motion.div>
          </div>
        </div>
      )}

      {/* FRZ - Freeze */}
      {status === 'FRZ' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none touch-none">
          <motion.div
            className="absolute inset-2 sm:inset-3 rounded-full border-2 border-cyan-300/80 bg-cyan-400/10 pointer-events-none touch-none"
            animate={{ scale: [0.97, 1.03, 0.97], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-1 flex items-center justify-center pointer-events-none touch-none"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          >
            <Sparkles className="absolute -top-1 w-3.5 h-3.5 text-cyan-200" />
            <Sparkles className="absolute -bottom-1 w-3.5 h-3.5 text-cyan-300" />
            <div className="absolute -left-1 w-2 h-2 rounded-full bg-cyan-200" />
            <div className="absolute -right-1 w-2 h-2 rounded-full bg-white" />
          </motion.div>
        </div>
      )}

      {/* SLP - Sleep */}
      {(status === 'SLP' || status === 'SLE') && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none touch-none">
          <motion.div
            className="absolute inset-2 sm:inset-3 rounded-full border border-indigo-400/50 bg-indigo-950/20 pointer-events-none touch-none"
            animate={{ scale: [0.96, 1.02, 0.96], opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          />
          <div className="absolute top-1 right-2 sm:top-2 sm:right-3 flex flex-col items-center pointer-events-none touch-none z-10">
            <motion.span
              animate={{ y: [1, -8], x: [0, 3], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, delay: 0 }}
              className="text-xs sm:text-sm font-bold text-slate-200"
            >
              Z
            </motion.span>
            <motion.span
              animate={{ y: [1, -10], x: [0, 5], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2.4, delay: 0.6 }}
              className="text-[10px] sm:text-xs font-bold text-slate-300"
            >
              z
            </motion.span>
          </div>
        </div>
      )}

      {/* CON - Confusion */}
      {status === 'CON' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none touch-none">
          <motion.div
            className="absolute inset-x-0 top-1 h-8 flex items-center justify-center pointer-events-none touch-none"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
          >
            <Star className="absolute -left-1 w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <Star className="absolute -right-1 w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          </motion.div>
        </div>
      )}
    </div>
  );
});

const HPBar = memo(({ current, max, enableAnimations }: { current: number; max: number; enableAnimations: boolean }) => {
  const percent = max > 0 ? Math.max(0, Math.min(1, current / max)) : 0;
  const color = percent > 0.5 ? "#4ade80" : percent > 0.2 ? "#facc15" : "#f87171";
  
  const prevPercentRef = useRef(percent);
  const [isDamaged, setIsDamaged] = useState(false);
  const [glowTrigger, setGlowTrigger] = useState(0);
  
  useEffect(() => {
    if (percent < prevPercentRef.current) {
      setIsDamaged(true);
      setGlowTrigger(prev => prev + 1);
      const timer = setTimeout(() => setIsDamaged(false), 900);
      prevPercentRef.current = percent;
      return () => clearTimeout(timer);
    } else {
      setIsDamaged(false);
    }
    prevPercentRef.current = percent;
  }, [percent]);

  return (
    <motion.div 
      className="relative h-2.5 sm:h-3.5 bg-slate-950/90 rounded-full overflow-hidden mb-1 mt-1 shadow-inner"
      animate={glowTrigger > 0 ? {
        boxShadow: [
          "0 0 0px rgba(0, 0, 0, 0)",
          "0 0 16px rgba(239, 68, 68, 0.9)",
          "0 0 0px rgba(0, 0, 0, 0)"
        ],
        borderColor: [
          "rgba(255, 255, 255, 0.1)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(255, 255, 255, 0.1)"
        ]
      } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      key={`app-hp-bar-glow-${glowTrigger}`}
    >
      {/* Secondary delay translucent red catch-up bar (staggered trailing damage) */}
      <motion.div 
        className="absolute top-0 left-0 h-full w-full bg-red-500/60 origin-left z-0"
        initial={{ scaleX: percent }}
        animate={{ scaleX: percent }}
        transition={{ 
          delay: enableAnimations && isDamaged ? 0.35 : 0,
          duration: enableAnimations ? (isDamaged ? 0.85 : 0.35) : 0,
          ease: [0.16, 1, 0.3, 1]
        }}
        style={{ transformOrigin: 'left' }}
      />
      {/* Primary HP color bar - drains smoothly and swiftly first */}
      <motion.div 
        className="h-full w-full relative z-10 origin-left"
        initial={{ scaleX: percent }}
        animate={{ scaleX: percent }}
        transition={{ 
          duration: enableAnimations ? (isDamaged ? 0.6 : 0.35) : 0, 
          ease: [0.25, 1, 0.5, 1] 
        }}
        style={{ 
          transformOrigin: 'left',
          backgroundColor: color
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b   from-white/30 via-transparent to-black/20"></div>
        <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-white/70 shadow-[0_0_6px_#fff]"></div>
      </motion.div>
    </motion.div>
  );
});


const VictoryConfetti = () => {
  return (
    <div className="absolute inset-0 z-[100] pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
            left: `${Math.random() * 100}%`,
            top: -10,
          }}
          initial={{ opacity: 1 }}
          animate={{ y: '100vh', opacity: 0, rotate: 720 }}
          transition={{ duration: 2 + Math.random() * 2, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
};


const statNameMap: Record<string, string> = {
  'hp': 'HP',
  'attack': 'Attack',
  'defense': 'Defense',
  'special-attack': 'Special Attack',
  'special-defense': 'Special Defense',
  'speed': 'Speed'
};

const getEvolutionLineInfo = (node: any): { names: string[], stagesCount: number } => {
  if (!node) return { names: [], stagesCount: 0 };
  const names: string[] = [];
  
  const traverse = (n: any) => {
    if (n && n.name) {
      names.push(n.name);
    }
    if (n && n.evolves_to && n.evolves_to.length > 0) {
      n.evolves_to.forEach(traverse);
    }
  };
  
  traverse(node);
  
  const getDepth = (n: any): number => {
    if (!n || !n.evolves_to || n.evolves_to.length === 0) return 1;
    return 1 + Math.max(...n.evolves_to.map((child: any) => getDepth(child)));
  };
  
  const stagesCount = getDepth(node);
  return { names, stagesCount };
};


export default function App() {
  
  const { state: simState, dispatch: battleDispatch } = useBattleSimulation();

  const [query, setQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const allPokemonRef = useRef<string[]>([]);
  const arenaRef = useRef<HTMLDivElement>(null);
  const isProcessingMoveRef = useRef(false);
  useEffect(() => {
    pokeApi.getPokemonList(1302)
      .then(data => {
        if (!isApiError(data)) {
          allPokemonRef.current = data.results.map((r: any) => r.name);
        }
      })
      .catch(e => console.error("Could not load suggest list", e));
  }, []);
  const [isPending, startTransition] = useTransition();
  const [viewAllGenerations, setViewAllGenerations] = useState(false);

  // --- Animation Helpers ---
  const getBattleSpriteAnimation = (animation: string | null, status: string | null, statAnimation?: string | null) => {
    if (statAnimation === 'boost') {
        return { scale: [1, 1.15, 1], filter: ['brightness(1) drop-shadow(0 0 0 rgba(16,185,129,0))', 'brightness(1.5) sepia(1) hue-rotate(90deg) saturate(3) drop-shadow(0 0 40px rgba(16,185,129,1))', 'brightness(1)'] };
    }
    if (statAnimation === 'lower') {
        return { scale: [1, 0.9, 1], filter: ['brightness(1) drop-shadow(0 0 0 rgba(239,68,68,0))', 'brightness(0.7) sepia(1) hue-rotate(-50deg) saturate(5) drop-shadow(0 0 40px rgba(239,68,68,1))', 'brightness(1)'] };
    }

    switch (animation) {
      case 'faint': return { opacity: 0.5, scale: 0.5, filter: 'brightness(0.3) grayscale(100%)' };
      case 'attack_physical': return { scale: 1.05 };
      case 'attack_special': return { scale: 1.05 };
      case 'hit': return { scale: [1, 0.95, 1], filter: ['brightness(1)', 'brightness(2) invert(1)', 'brightness(1)'], x: [0, -15, 15, -10, 10, -5, 5, 0] };
      case 'hit_critical': return { scale: [1, 1.1, 1], filter: ['brightness(1)', 'brightness(2.5) sepia(1) hue-rotate(-50deg) saturate(3)', 'brightness(1)'], x: [0, -25, 25, -20, 20, -10, 10, 0] };
      case 'hit_status': return { scale: 1.02 };
      default: return { scale: 1, opacity: 1, rotate: 0, x: 0, filter: 'brightness(1)' };
    }
  };

  const getBattleSpriteTransition = (animation: string | null, statAnimation?: string | null): any => ({
    type: 'tween',
    duration: (enableAnimations && ((animation !== 'none' && animation !== null) || (statAnimation !== 'none' && statAnimation !== null))) ? 0.6 : 0, 
  });

  const [hoveredMove, setHoveredMove] = useState<Move | null>(null);
  const [loadingPokemon, setLoadingPokemon] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [selectedGameDescIndex, setSelectedGameDescIndex] = useState<number>(0);

  useEffect(() => {
    setSelectedGameDescIndex(0);
  }, [pokemon?.id, pokemon?.name]);
  const [currentVariety, setCurrentVariety] = useState<string | null>(null);
  const [listMode, setListMode] = useState<'home' | 'pokemon' | 'types' | 'favorites'>('home');
  const [currentGenId, setCurrentGenId] = useState<number>(1);
  const [currentAvatar, setCurrentAvatar] = useState(() => {
    try {
      const saved = localStorage.getItem('pokethology_user_avatar');
      if (saved) {
        const found = TRAINER_SPRITES.find(t => t.id === saved);
        if (found) return found;
      }
    } catch (e) {}
    return TRAINER_SPRITES[0];
  });
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarFilter, setAvatarFilter] = useState<'All' | 'Protagonist' | 'Rival' | 'Gym Leader' | 'Champion' | 'Trainer' | 'Villain'>('All');
  const [opponentAvatar, setOpponentAvatar] = useState(() => {
    return TRAINER_SPRITES.find(t => t.id === 'blue') || TRAINER_SPRITES.find(t => t.role === 'Rival') || TRAINER_SPRITES[1] || TRAINER_SPRITES[0];
  });
  const [isSelectingOpponent, setIsSelectingOpponent] = useState(false);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const { favorites, isFavorite, toggleFavorite, loadFavorites } = useFavorites();
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [isInitializingDb, setIsInitializingDb] = useState<boolean>(false);
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 150);
    return () => clearTimeout(handler);
  }, [inputValue]);
  const [battleOpponent, setBattleOpponent] = useState<Pokemon | null>(null);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);

  useEffect(() => {
    if (battleOpponent) {
      const rivals = TRAINER_SPRITES.filter(t => t.id !== currentAvatar.id);
      if (rivals.length > 0) {
        const hash = (battleOpponent.id || battleOpponent.name.length * 7);
        const chosen = rivals[hash % rivals.length];
        setOpponentAvatar(chosen);
      }
    }
  }, [battleOpponent?.id, battleOpponent?.name, currentAvatar.id]);


  const [sessionWins, setSessionWins] = useState<number>(() => {
    const saved = sessionStorage.getItem('pokethology_session_wins');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [sessionLosses, setSessionLosses] = useState<number>(() => {
    const saved = sessionStorage.getItem('pokethology_session_losses');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [opponentTeam, setOpponentTeam] = useState<Pokemon[]>([]);
  const [activeOpponentIndex, setActiveOpponentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'data' | 'chat' | 'battle'>('data');
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);
  const [showScanHistory, setShowScanHistory] = useState(false);
  const [showClearScanConfirm, setShowClearScanConfirm] = useState(false);
  const [showClearChatConfirm, setShowClearChatConfirm] = useState(false);
  const [collapsedMoveMethods, setCollapsedMoveMethods] = useState<Record<string, boolean>>({
    'machine': true,
    'egg': true,
    'tutor': true,
    'level-up': false,
  });
  const [showDetailsScrollTop, setShowDetailsScrollTop] = useState(false);
  const [playerTeam, setPlayerTeam] = useState<Pokemon[]>([]);
  const [inspectingOpponent, setInspectingOpponent] = useState<boolean>(false);
  const basePlayerPokemonRef = useRef<Pokemon | null>(null);

  useEffect(() => {
    if (pokemon) {
      if (!basePlayerPokemonRef.current || basePlayerPokemonRef.current.id !== pokemon.id) {
        basePlayerPokemonRef.current = pokemon;
      }
    }
  }, [pokemon]);

  useEffect(() => {
    if (!battleOpponent) {
      setInspectingOpponent(false);
    }
  }, [battleOpponent]);

  useEffect(() => {
    setInspectingOpponent(false);
  }, [pokemon?.name]);

  // Universal haptic + button click sound feedback on EVERY button across the application
  useEffect(() => {
    const handleGlobalButtonClick = (e: MouseEvent | TouchEvent | PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const button = target.closest('button, [role="button"], input[type="button"], input[type="submit"]');
      if (button && !button.hasAttribute('disabled')) {
        try { sounds.scan(); playHaptic('light'); } catch (_) {}
        try { playHaptic(20); } catch (_) {}
      }
    };

    window.addEventListener('pointerdown', handleGlobalButtonClick, { capture: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleGlobalButtonClick, { capture: true });
    };
  }, []);

  const handleTabChange = useCallback((tab: 'data' | 'chat' | 'battle') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setChatSpeakingIndex(null);
    setIsTabTransitioning(true);

    setTimeout(() => {
      setActiveTab(tab);
      setShowDetailsScrollTop(false);

      if (tab === 'battle') {
        setInspectingOpponent(false);
        setAttackerAnimation('none');
        setDefenderAnimation('none');

        if (basePlayerPokemonRef.current) {
          setPokemon(basePlayerPokemonRef.current);
        }

        const currentPoke = basePlayerPokemonRef.current || pokemon;
        const pBase = currentPoke?.stats?.find((s: any) => s.stat.name === 'hp')?.base_stat || 50;
        const oBase = battleOpponent?.stats?.find((s: any) => s.stat.name === 'hp')?.base_stat || 50;
        const pMax = Math.floor(pBase * 2 + 110);
        const oMax = Math.floor(oBase * 2 + 110);

        setPokemonMaxHP(pMax);
        setOpponentMaxHP(oMax);
        setPokemonHP(pMax);
        setOpponentHP(oMax);

        setPokemonStatus(null);
        setOpponentStatus(null);
        setPokemonFlinched(false);
        setOpponentFlinched(false);
        setPlayerSubstitute(0);
        setOpponentSubstitute(0);
        setPlayerProtected(false);
        setOpponentProtected(false);
        setPlayerStatStages({ attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0, evasion: 0, accuracy: 0 });
        setOpponentStatStages({ attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0, evasion: 0, accuracy: 0 });
        setBattleState('setup');
        setIsBattling(false);
        setBattleResult(null);
        setBattleLog([]);
        setIsBattleHistoryExpanded(false);
      }

      setTimeout(() => {
        if (detailsContainerRef.current) {
          detailsContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
        if (battleScrollRef.current) {
          battleScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
      }, 10);
    }, 150);

    setTimeout(() => {
      setIsTabTransitioning(false);
    }, 300);

    try { sounds.scan(); playHaptic('light'); } catch (_) {}
  }, [pokemon, battleOpponent]);

  const slideSection = useCallback((tab: 'data' | 'chat' | 'battle') => {
    if (tab === 'battle') {
      try { sounds.scan(); playHaptic('light'); } catch (_) {}
      return;
    }
    if (detailsContainerRef.current) {
      const top = detailsContainerRef.current.scrollTop;
      if (top > 50) {
        detailsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const targetScroll = tab === 'data' ? 420 : 320;
        detailsContainerRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }
    try { sounds.scan(); playHaptic('light'); } catch (_) {}
  }, []);


  const slideGrid = useCallback(() => {
    if (gridScrollRef.current) {
      const top = gridScrollRef.current.scrollTop;
      if (top > 50) {
        gridScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        gridScrollRef.current.scrollTo({ top: 600, behavior: 'smooth' });
      }
    }
    try { sounds.scan(); playHaptic('light'); } catch (_) {}
  }, []);
  const [lastSearched, setLastSearched] = useState<string>('');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const aiCache = useRef<Record<string, string>>({});
  const [quotaLimitReached, _setQuotaLimitReached] = useState<boolean>(false);

  const setQuotaLimitReached = useCallback((val: boolean) => {
    _setQuotaLimitReached(val);
  }, []);

  

  

  const [lastQuotaError, setLastQuotaError] = useState<string | null>(null);
  
  const suggestTimeoutRef = useRef<any>(null);
  const [opponentDialogue, setOpponentDialogue] = useState<string | null>(null);
  const [playerDialogue, setPlayerDialogue] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [turnNumber, setTurnNumber] = useState(1);
  const [pokemonStatus, setPokemonStatus] = useState<string | null>(null);
  const [opponentStatus, setOpponentStatus] = useState<string | null>(null);
  const [pokemonFlinched, setPokemonFlinched] = useState(false);
  const [opponentFlinched, setOpponentFlinched] = useState(false);
  const statusStartTurnRef = useRef<{player: number | null, opponent: number | null}>({player: null, opponent: null});

  useEffect(() => {
    if (pokemonStatus && statusStartTurnRef.current.player === null) statusStartTurnRef.current.player = turnNumber;
    if (!pokemonStatus) statusStartTurnRef.current.player = null;
    if (opponentStatus && statusStartTurnRef.current.opponent === null) statusStartTurnRef.current.opponent = turnNumber;
    if (!opponentStatus) statusStartTurnRef.current.opponent = null;
  }, [pokemonStatus, opponentStatus, turnNumber]);
// Helper function to build standard welcome message for Chatbot
  const getChatWelcomeMessage = useCallback((pokemonName?: string) => {
    const nameUpper = pokemonName ? pokemonName.toUpperCase() : null;
    return `Hello! I am Pok√©thology AI. I can assist you with Pok√©mon strategies, biology, stats, and canonical lore. ${nameUpper ? `I see you have selected **${nameUpper}**. ` : ""}How can I assist you today?`;
  }, []);

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string, groundingChunks?: any[], groundingMetadata?: any}[]>([{ role: 'model', text: getChatWelcomeMessage() }]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatSpeakingIndex, setChatSpeakingIndex] = useState<number | null>(null);
  const [chatCopiedIndex, setChatCopiedIndex] = useState<number | null>(null);

  const handleChatTTS = useCallback((text: string, index: number) => {
    if (!('speechSynthesis' in window)) return;

    if (chatSpeakingIndex === index) {
      window.speechSynthesis.cancel();
      setChatSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean text: strip emojis, markdown symbols, and collapse spaces
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}]/gu, '')
      .replace(/[*_#`~>|-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onstart = () => setChatSpeakingIndex(index);
    utterance.onend = () => setChatSpeakingIndex(null);
    utterance.onerror = () => setChatSpeakingIndex(null);

    window.speechSynthesis.speak(utterance);
    try { sounds.scan(); playHaptic('light'); } catch (_) {}
  }, [chatSpeakingIndex]);

  const handleChatCopy = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setChatCopiedIndex(index);
    try { sounds.scan(); playHaptic('light'); } catch (_) {}
    setTimeout(() => setChatCopiedIndex(null), 2000);
  }, []);
  const [battleLog, setBattleLog] = useState<(LogEntry & { turn?: number })[]>([]);
  const [isBattling, setIsBattling] = useState(false);
  const [usedSuperEffectiveCurrentBattle, setUsedSuperEffectiveCurrentBattle] = useState(false);

  // --- WebSocket Integration ---
  const [wsStatus, setWsStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [wsTelemetry, setWsTelemetry] = useState<any | null>(null);
  const [wsClientId, setWsClientId] = useState<string | null>(null);
  const [wsBattleInsight, setWsBattleInsight] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamQueueRef = useRef<string[]>([]);
  const streamTimerRef = useRef<any>(null);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimer: any = null;
    let isCleanup = false;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 7;

    function connect() {
      if (isCleanup) return;
      setWsStatus('connecting');
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      console.log("[WS] Connecting to:", wsUrl);
      
      try {
        socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          if (isCleanup) return;
          console.log("[WS] Connected successfully.");
          setWsStatus('connected');
          reconnectAttempts = 0; // reset on successful connection
        };

      socket.onmessage = (event) => {
        if (isCleanup) return;
        try {
          const data = JSON.parse(event.data);
          const { type, payload } = data;

          if (type === "connection_established") {
            setWsClientId(payload.clientId);
          } else if (type === "telemetry:update") {
            setWsTelemetry(payload);
          } else if (type === "chat:typing") {
            setIsAiTyping(payload.isTyping);
          } else if (type === "chat:stream_chunk") {
            if (payload.chunk) {
              const chars = payload.chunk.split('');
              streamQueueRef.current.push(...chars);
              
              if (!streamTimerRef.current) {
                setChatMessages(prev => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  if (lastIdx < 0 || updated[lastIdx].role !== "model") {
                    updated.push({ role: "model", text: "", groundingChunks: payload.groundingChunks });
                  } else if (payload.groundingChunks) {
                    updated[lastIdx].groundingChunks = payload.groundingChunks || updated[lastIdx].groundingChunks;
                  }
                  return updated;
                });
                
                streamTimerRef.current = setInterval(() => {
                  if (streamQueueRef.current.length > 0) {
                    const char = streamQueueRef.current.shift();
                    setChatMessages(prev => {
                      const updated = [...prev];
                      const lastIdx = updated.length - 1;
                      if (lastIdx >= 0 && updated[lastIdx].role === "model") {
                        updated[lastIdx] = {
                          ...updated[lastIdx],
                          text: updated[lastIdx].text + char
                        };
                      }
                      return updated;
                    });
                  } else {
                    clearInterval(streamTimerRef.current);
                    streamTimerRef.current = null;
                  }
                }, 15);
              }
            }
          } else if (type === "chat:response") {
            streamQueueRef.current = [];
            if (streamTimerRef.current) {
              clearInterval(streamTimerRef.current);
              streamTimerRef.current = null;
            }
            const finalMsg = {
              role: "model" as const,
              text: payload.text,
              groundingChunks: payload.groundingChunks,
              groundingMetadata: payload.groundingMetadata
            };
            if (payload.navigatePokemon) {
              setChatMessages([{ role: 'model', text: finalMsg.text }]);
              performSearch(payload.navigatePokemon, false);
            } else {
              setChatMessages(prev => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                if (lastIdx >= 0 && updated[lastIdx].role === "model") {
                  updated[lastIdx] = finalMsg;
                } else {
                  updated.push(finalMsg);
                }
                return updated;
              });
            }
            setIsChatLoading(false);
            setIsAiTyping(false);
            sounds?.success?.();
          } else if (type === "diag:log") {
            setDiagnosticProgress(payload.progress);
            setDiagnosticLogs(prev => {
              if (payload.progress <= 15) {
                return [payload.log];
              }
              if (!prev.includes(payload.log)) {
                return [...prev, payload.log];
              }
              return prev;
            });
            if (payload.isFinished) {
              setIsDiagnosticRunning(false);
              setDiagnosticsCompleted(true);
              sounds?.success?.();
            } else {
              sounds?.typing?.();
            }
          } else if (type === "battle:insight") {
            setWsBattleInsight(payload.hint);
          }
        } catch (e) {
          console.error("[WS Client] failed to parse message", e);
        }
      };

      socket.onclose = (event) => {
          if (isCleanup) return;
          console.log("[WS] Connection closed:", event.reason);
          setWsStatus('disconnected');
          
          if (reconnectAttempts < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
            reconnectAttempts++;
            console.log(`[WS] Reconnecting in ${delay}ms (Attempt ${reconnectAttempts})`);
            reconnectTimer = setTimeout(connect, delay);
          } else {
            console.log("[WS] Max reconnect attempts reached.");
          }
        };

        socket.onerror = (err) => {
          if (isCleanup) return;
          console.log("[WS] Socket error (expected in iframe if cookies blocked):", err);
          socket?.close();
        };
      } catch (err) {
        console.error("[WS] WebSocket instantiation failed. Possibly blocked by extensions or CSP.", err);
        setWsStatus('disconnected');
        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          reconnectAttempts++;
          reconnectTimer = setTimeout(connect, delay);
        }
      }
    }

    connect();

    return () => {
      isCleanup = true;
      clearTimeout(reconnectTimer);
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, []);

  useEffect(() => {
    if (isBattling) {
      setUsedSuperEffectiveCurrentBattle(false);
    }
  }, [isBattling]);

  useEffect(() => {
    if (battleResult && !isBattling && pokemon && battleOpponent) {
        
        const newRecord = {
            id: Date.now().toString(),
            playerPokemon: pokemon.name,
            opponentPokemon: battleOpponent.name,
            playerTypes: pokemon.types.map((t: any) => t.type.name.toLowerCase()),
            opponentTypes: battleOpponent.types.map((t: any) => t.type.name.toLowerCase()),
            result: battleResult,
            timestamp: Date.now(),
            date: new Date().toISOString(),
            usedSuperEffective: usedSuperEffectiveCurrentBattle,
        };
        if (battleResult === 'victory') {
          try {
            let stats = JSON.parse(localStorage.getItem('Pokethology_MissionStats') || '{"pokemonWins":{}, "typeWins":{}}');
            const currentMonth = new Date().toISOString().slice(0, 7);
            if (stats.lastResetMonth !== currentMonth) {
              stats = { pokemonWins: {}, typeWins: {}, lastResetMonth: currentMonth };
            }
            stats.pokemonWins[pokemon.name] = (stats.pokemonWins[pokemon.name] || 0) + 1;
            pokemon.types.forEach((t: any) => {
              const typeName = t.type.name.toLowerCase();
              stats.typeWins[typeName] = (stats.typeWins[typeName] || 0) + 1;
            });
            localStorage.setItem('Pokethology_MissionStats', JSON.stringify(stats));
          } catch (e) {
            console.error("Error updating mission stats", e);
          }
        }
        idbSet(STORES.BATTLE_HISTORY, newRecord).then(() => {
           idbGetAll(STORES.BATTLE_HISTORY).then(all => {
             const sorted = all.sort((a, b) => b.timestamp - a.timestamp);
             if (sorted.length > 50) {
                const toDelete = sorted.slice(50);
                toDelete.forEach(record => idbDelete(STORES.BATTLE_HISTORY, record.id));
             }
           });
        });

        window.dispatchEvent(new Event('storage'));
    }
  }, [battleResult, isBattling, pokemon, battleOpponent, usedSuperEffectiveCurrentBattle]);
  const [battleDuration, setBattleDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBattling) {
      setBattleDuration(0);
      interval = setInterval(() => {
        setBattleDuration(prev => prev + 1);
      }, 1000);
    } else {
      setBattleDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBattling]);
  const [showVSScreen, setShowVSScreen] = useState(false);
  const vsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const vsPlayerCryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const vsOpponentCryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [pokemonHP, setPokemonHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [turn, setTurn] = useState<'player' | 'opponent' | null>(null);
  const [tempoTier, setTempoTier] = useState(1.0);

  // Sync active battle metrics via websocket stream
  useEffect(() => {
    if (isBattling && pokemon && battleOpponent && wsRef.current && wsStatus === 'connected') {
      wsRef.current.send(JSON.stringify({
        type: "battle:sync",
        payload: {
          opponent: battleOpponent.name,
          playerHP: pokemonHP,
          opponentHP: opponentHP,
          playerPokemon: pokemon.name
        }
      }));
    }
  }, [isBattling, pokemonHP, opponentHP, battleOpponent, pokemon, wsStatus]);

  const [isAnimating, setIsAnimating] = useState(false);
  const [moveBeingLearned, setMoveBeingLearned] = useState<Move | null>(null);
  const [isMoveLearningOpen, setIsMoveLearningOpen] = useState(false);
  const [actionAfterMoveLearn, setActionAfterMoveLearn] = useState<'rematch' | 'new_battle' | null>(null);

  const handlePostBattleAction = (action: 'rematch' | 'new_battle') => {
    setBattleResult(null); // Remove victory/defeat interface
    if (pokemon) {
      const currentSelectedMoves = selectedMovesRef.current;
      const potentialMoves = pokemon.moves.filter(m => 
        !currentSelectedMoves.some(sm => sm.name === m.name)
      );
      
      if (potentialMoves.length > 0) {
        const shuffled = [...potentialMoves].sort(() => 0.5 - Math.random());
        const offered = shuffled.slice(0, Math.min(3, shuffled.length));
        setOfferedMoves(offered);
        setActionAfterMoveLearn(action);
        setIsMoveLearningOpen(true);
        setIsReplacingMove(false);
        return;
      }
    }
    // If no moves to learn, execute immediately
    if (action === 'rematch') {
      sounds.battleStart(); playHaptic('heavy');
      setIsBattling(false);
      setBattleState('setup');
      setTimeout(() => runBattle(), 100);
    } else {
      resetSimulation();
    }
  };

  const finalizeMoveLearn = () => {
    setIsMoveLearningOpen(false);
    if (actionAfterMoveLearn === 'rematch') {
      sounds.battleStart(); playHaptic('heavy');
      setIsBattling(false);
      setBattleState('setup');
      setTimeout(() => runBattle(), 100);
    } else if (actionAfterMoveLearn === 'new_battle') {
      resetSimulation();
    }
    setActionAfterMoveLearn(null);
  };
  const [offeredMoves, setOfferedMoves] = useState<Move[]>([]);
  const [isReplacingMove, setIsReplacingMove] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isCombatMoveModalOpen, setIsCombatMoveModalOpen] = useState(false);
  const [attackerAnimation, setAttackerAnimation] = useState<'none' | 'attack_physical' | 'attack_special' | 'hit' | 'hit_critical' | 'hit_status' | 'faint' | 'boost' | 'drop'>('none');
  const [defenderAnimation, setDefenderAnimation] = useState<'none' | 'attack_physical' | 'attack_special' | 'hit' | 'hit_critical' | 'hit_status' | 'faint' | 'boost' | 'drop'>('none');
  const [moveAnimation, setMoveAnimation] = useState<'none' | 'physical' | 'special'>('none');
  const [battleMessage, setBattleMessage] = useState<{ text: string; type: 'default' | 'critical' | 'effective' | 'status' | 'move' } | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<{ id: string | number; text: string; type: 'damage' | 'super-damage' | 'weak-damage' | 'crit-damage' | 'boost' | 'lower' | 'status' | 'effective' | 'not-effective'; x: string; y: string }[]>([]);
  const [statEffects, setStatEffects] = useState<{ id: string | number; type: 'boost' | 'lower'; isPlayer: boolean }[]>([]);
  const [arenaCriticalNotify, setArenaCriticalNotify] = useState<boolean>(false);
  const [playerAnimMode, setPlayerAnimMode] = useState<'idle' | 'hit' | 'boost' | 'drop'>('idle');
  const [opponentAnimMode, setOpponentAnimMode] = useState<'idle' | 'hit' | 'boost' | 'drop'>('idle');

  const addFloatingText = useCallback((text: string, type: any, isPlayer: boolean) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    // If player is attacking (isPlayer=true), target is opponent (top-right)
    // If opponent is attacking (isPlayer=false), target is player (bottom-left)
    const x = isPlayer ? '70%' : '30%';
    const y = isPlayer ? '25%' : '65%';
    setFloatingTexts(prev => [...prev, { id, text, type, x, y }]);
  }, []);

  const addStatEffect = useCallback((type: 'boost' | 'lower', isPlayer: boolean) => {
     const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
     setStatEffects(prev => [...prev, { id, type, isPlayer }]);
  }, []);

  const handleBattleMessageComplete = useCallback(() => setBattleMessage(null), []);
  const removeFloatingText = useCallback((id: string | number) => {
    setFloatingTexts(prev => prev.filter(t => t.id !== id));
  }, []);
  const removeStatEffect = useCallback((id: string | number) => {
    setStatEffects(prev => prev.filter(e => e.id !== id));
  }, []);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isShiny, setIsShiny] = useState(false);
  const [isCardView, setIsCardView] = useState(false);
  const [isFemale, setIsFemale] = useState(false);
  const [isOpponentShiny, setIsOpponentShiny] = useState(false);
  const [isOpponentFemale, setIsOpponentFemale] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const checkIsInstallable = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in window.navigator && (window.navigator as any).standalone) || document.referrer.includes('android-app://');
      if (isStandalone) {
        setIsInstallable(false);
        return;
      }
      if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream) {
        setIsInstallable(true);
      }
    };
    checkIsInstallable();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsInstallable(false);
    };
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);

  const handleInstallPWA = async () => {
    setIsPwaModalOpen(true);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
      }
    }
  };
  const [isRebooting, setIsRebooting] = useState(false);
  const [autoResetTime, setAutoResetTime] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'id' | 'name'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [battleState, setBattleState] = useState<'setup' | 'battling' | 'finished'>('setup');
  const [selectedMoves, setSelectedMoves] = useState<Move[]>([]);
  const selectedMovesRef = useRef(selectedMoves);
  useEffect(() => {
    selectedMovesRef.current = selectedMoves;
  }, [selectedMoves]);
  const [opponentMoves, setOpponentMoves] = useState<Move[]>([]);
  const [customStats, setCustomStats] = useState<Record<string, number>>({});
  const [playerSpriteFlip, setPlayerSpriteFlip] = useState<boolean>(true);
  const [opponentSpriteFlip, setOpponentSpriteFlip] = useState<boolean>(false);
  
  // Custom Special Mechanics State
  const [playerSubstitute, setPlayerSubstitute] = useState(0);
  const [opponentSubstitute, setOpponentSubstitute] = useState(0);
  const [playerProtected, setPlayerProtected] = useState(false);
  const [opponentProtected, setOpponentProtected] = useState(false);

  const [playerStatStages, setPlayerStatStages] = useState<Record<string, number>>({});
  const [opponentStatStages, setOpponentStatStages] = useState<Record<string, number>>({});
  const [statAnimation, setStatAnimation] = useState<'none' | 'boost' | 'lower'>('none');
  const [isTypeChartOpen, setIsTypeChartOpen] = useState(false);
  const [selectedMoveDetail, setSelectedMoveDetail] = useState<Move | null>(null);
  const [isMoveDetailOpen, setIsMoveDetailOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  const [diagnosticsCompleted, setDiagnosticsCompleted] = useState(false);

  const runDiagnosticsCheck = useCallback(() => {
    if (isDiagnosticRunning) return;
    setIsDiagnosticRunning(true);
    setDiagnosticProgress(5);
    setDiagnosticsCompleted(false);
    setDiagnosticLogs(["[SYSTEM INIT] Activating diagnostic check via WebSockets..."]);
    sounds?.boot?.();

    if (wsRef.current && wsStatus === 'connected') {
      wsRef.current.send(JSON.stringify({ type: "diag:start" }));
    } else {
      // Fallback to offline local simulation
      const logSteps = [
        { text: "[DATABASE] Loading Pok√©dex data... Loaded 1025 Pok√©mon.", delay: 400, progress: 20 },
        { text: "[CONNECTIONS] Connecting to Pok√©mon endpoints... Successful.", delay: 850, progress: 45 },
        { 
          text: quotaLimitReached 
            ? "[WARN] [AI CHATBOT] Quota limit reached. Offline mode active."
            : "[OK] [AI CHATBOT] Universal AI Chatbot initialized and ready.",
          delay: 1400, 
          progress: 70 
        },
        { text: "[AUDIO] Sound effects loaded successfully.", delay: 1850, progress: 85 },
        { text: "[MISSIONS] Daily missions and activities loaded.", delay: 2200, progress: 95 },
        { text: "[SUCCESS] Setup complete! Welcome to Pok√©thology.", delay: 2600, progress: 100 }
      ];

      logSteps.forEach((step) => {
        setTimeout(() => {
          setDiagnosticLogs(prev => [...prev, step.text]);
          setDiagnosticProgress(step.progress);
          sounds?.typing?.();
          if (step.progress === 100) {
            setIsDiagnosticRunning(false);
            setDiagnosticsCompleted(true);
            sounds?.success?.();
          }
        }, step.delay);
      });
    }
  }, [quotaLimitReached, isDiagnosticRunning, wsStatus]);

  const [isBattleHelpOpen, setIsBattleHelpOpen] = useState(false);
  const [showStatComparison, setShowStatComparison] = useState(false);
  const [showCombatOptionsCompare, setShowCombatOptionsCompare] = useState(false);
  const [selectedGame, setSelectedGame] = useState('Red/Blue');
  const [victoryConfetti, setVictoryConfetti] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [battleTheme, setBattleTheme] = useState<string>('auto');
  const [isCompactBattle, setIsCompactBattle] = useState<boolean>(() => window.innerWidth < 768);
  const [isDailyHubOpen, setIsDailyHubOpen] = useState<boolean>(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [pinnedComparisonPokemon, setPinnedComparisonPokemon] = useState<Pokemon | null>(null);

  const handleOpenComparison = (p?: Pokemon) => {
    const targetPokemon = p || pokemon;
    if (targetPokemon) {
      setPinnedComparisonPokemon(targetPokemon);
      setIsComparisonOpen(true);
      if (sounds?.hover) sounds.hover();
    }
  };
    const [isChaosModeActive, setIsChaosModeActive] = useState(false);
  const [dailyStreak, setDailyStreak] = useState<number>(0);
  const [isMissionCompleted, setIsMissionCompleted] = useState<boolean>(false);
  const [missionProgressCount, setMissionProgressCount] = useState<number>(0);
  const [missionRequiredCount, setMissionRequiredCount] = useState<number>(3);
  const [playerStatAnimation, setPlayerStatAnimation] = useState<'none' | 'boost' | 'lower'>('none');
  const [opponentStatAnimation, setOpponentStatAnimation] = useState<'none' | 'boost' | 'lower'>('none');

  // Interactive Toast notification system
  interface AppToast {
    id: string;
    title: string;
    description: string;
    type: 'info' | 'success' | 'warning' | 'combat';
  }
  const [toasts, setToasts] = useState<AppToast[]>([]);
  const addToast = (title: string, description: string, type: 'info' | 'success' | 'warning' | 'combat' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  // Celebratory overlay state for Daily Combat Mission completes
  const [showMissionCelebration, setShowMissionCelebration] = useState<boolean>(false);
  const [showMissionUpdateHUD, setShowMissionUpdateHUD] = useState<boolean>(false);
  const [hubChallengeProgressMessage, setHubChallengeProgressMessage] = useState<string | null>(null);
  const [lastBattleMissionNotice, setLastBattleMissionNotice] = useState<{
    title: string;
    description: string;
    isComplete: boolean;
  } | null>(null);
  const hubProgressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [celebratedMission, setCelebratedMission] = useState<any>(null);

  const today = new Date().toISOString().split('T')[0];

  // 24-hour automatic reset and pruning of historical data for smaller, cleaner database
  useEffect(() => {
    const now = Date.now();
    const lastResetKey = 'pokethology_last_24h_reset';
    const lastReset = localStorage.getItem(lastResetKey);
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    if (!lastReset || now - parseInt(lastReset, 10) > TWENTY_FOUR_HOURS) {
      const runPruning = async () => {
        try {
          const battleHistory = await idbGetAll(STORES.BATTLE_HISTORY);
          const prunedBattles = battleHistory.filter((item: any) => now - (item.timestamp || now) >= TWENTY_FOUR_HOURS);
          prunedBattles.forEach(record => idbDelete(STORES.BATTLE_HISTORY, record.id));
        } catch (e) {
          console.error("Error pruning battle history", e);
        }
      };
      runPruning();

      try {
        const scanHistory = JSON.parse(localStorage.getItem('pokethology_scan_history') || '[]');
        const prunedScans = scanHistory.filter((item: any) => !item.timestamp || now - item.timestamp < TWENTY_FOUR_HOURS);
        localStorage.setItem('pokethology_scan_history', JSON.stringify(prunedScans));
      } catch (e) {
        console.error("Error pruning scan history", e);
      }

      localStorage.setItem(lastResetKey, now.toString());
    }
  }, [today]);

  useEffect(() => {
    const isHardMode = (localStorage.getItem(`pokethology_mission_hard_${today}`) || localStorage.getItem(`poketheology_mission_hard_${today}`)) === 'true';
    const currentMission = getDailyCombatMission(today, isHardMode);
    const required = getRequiredCount(currentMission, isHardMode);
    setMissionRequiredCount(required);

    const countKey = `pokethology_mission_progress_count_${today}`;
    const completedKey = `pokethology_mission_completed_${today}`;
    const legacyCompletedKey = `poketheology_mission_completed_${today}`;

    let savedCountStr = localStorage.getItem(countKey);
    let currentCount = savedCountStr ? parseInt(savedCountStr, 10) : 0;

    const isCompletedVal = (localStorage.getItem(completedKey) || localStorage.getItem(legacyCompletedKey)) === 'true';
    if (isCompletedVal && currentCount < required) {
      currentCount = required;
      localStorage.setItem(countKey, String(required));
    }

    setMissionProgressCount(currentCount);
    setIsMissionCompleted(currentCount >= required);
  }, [today]);
  const dailyId = useMemo(() => {
    // High-entropy split-mix string hash seed
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = today.charCodeAt(i) + ((hash << 5) - hash);
    }
    // High-quality deterministic seeded LCG step to yield wildly scattered pseudo-random index
    let seed = Math.abs(hash);
    // Linear Congruential Generator step with standard parameters
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    seed = (seed * 1103515245 + 12345) % 4294967296;
    // Map to total pokedex range (1025 standard Gen 1-9 species)
    return (seed % 1025) + 1;
  }, [today]);

  const [dailyPokemon, setDailyPokemon] = useState<any>(null);
  const [dailyFemalePokemon, setDailyFemalePokemon] = useState<any>(null);
  const [dailyGender, setDailyGender] = useState<'male' | 'female'>('male');

  useEffect(() => {
    const fetchDaily = async () => {
      try {
        const p = await searchPokemon(dailyId.toString());
        setDailyPokemon(p);
        
        let femaleP = null;
        // Search for female varieties first
        if (p.varieties && p.varieties.length > 1) {
          const femaleVariety = p.varieties.find((v: any) => 
            v.pokemon?.name?.includes('-female') || 
            v.pokemon?.name?.includes('-f') ||
            (p.name === 'nidoran-m' && v.pokemon?.name === 'nidoran-f') ||
            (p.name === 'nidoran-f' && v.pokemon?.name === 'nidoran-m')
          );
          
          if (femaleVariety && femaleVariety.pokemon?.name !== p.name) {
            try {
              femaleP = await searchPokemon(femaleVariety.pokemon?.name);
            } catch (err) {
              console.error("Failed to fetch female variety", err);
            }
          }
        }

        // Add manual fallback for significant gender differences not in varieties (Pyroar, Jellicent, etc.)
        if (!femaleP) {
          const genderDifferents = ['pyroar', 'unfezant', 'frillish', 'jellicent', 'hippowdon', 'hippopotas', 'meowstic', 'indeedee', 'oinkologne', 'basculegion'];
          const baseName = p.name.split('-')[0].toLowerCase();
          if (genderDifferents.includes(baseName) && !p.name.includes('-f') && !p.name.includes('-female')) {
            femaleP = { ...p, name: `${baseName}-female` };
          }
        }

        setDailyFemalePokemon(femaleP);
      } catch (e) {
        console.error("Daily fetch failed", e);
      }
    };
    fetchDaily();
  }, [dailyId]);

  useEffect(() => {
    // Manage Daily Streak
    const lastActiveDate = localStorage.getItem('pokethology_last_active_date') || localStorage.getItem('poketheology_last_active_date');
    const savedStreak = localStorage.getItem('pokethology_daily_streak') || localStorage.getItem('poketheology_daily_streak');
    const streakNum = savedStreak ? parseInt(savedStreak, 10) : 0;

    const todayDate = new Date().toISOString().split('T')[0];
    if (lastActiveDate === todayDate) {
      setDailyStreak(streakNum || 1);
    } else if (lastActiveDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      if (lastActiveDate === yesterdayStr) {
        const newStreak = streakNum + 1;
        setDailyStreak(newStreak);
        localStorage.setItem('pokethology_daily_streak', newStreak.toString());
      } else {
        setDailyStreak(1);
        localStorage.setItem('pokethology_daily_streak', '1');
      }
      localStorage.setItem('pokethology_last_active_date', todayDate);
    } else {
      setDailyStreak(1);
      localStorage.setItem('pokethology_daily_streak', '1');
      localStorage.setItem('pokethology_last_active_date', todayDate);
    }
  }, []);

  useEffect(() => {
    const loadSavedTeam = async () => {
      try {
        const stored = await idbGet(STORES.USER_TEAMS, 'pokethology_player_team');
        if (stored && stored.teamNames) {
          const names: string[] = stored.teamNames;
          const loaded = await Promise.all(names.slice(0, 6).map(async (name) => {
            try {
              return await searchPokemon(name);
            } catch (err) {
              console.error("Failed to load team member", name, err);
              return null;
            }
          }));
          setPlayerTeam(loaded.filter((p): p is Pokemon => p !== null));
        }
      } catch (e) {
        
      }
    };
    loadSavedTeam();
  }, [searchPokemon]);

  const [scanHistory, setScanHistory] = useState<{name: string, id: number, types: string[], bst?: number}[]>(() => {
    try {
      const saved = localStorage.getItem('pokethology_scan_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showScrollTop, setShowScrollTop] = useState(false);
  const gridScrollRef = useRef<HTMLDivElement>(null);

  const [arenaScale, setArenaScale] = useState(1);
  const arenaObserverRef = useRef<HTMLDivElement | null>(null);

  const arenaCallbackRef = useCallback((node: HTMLDivElement | null) => {
    if (arenaObserverRef.current) {
      const oldObserver = (arenaObserverRef.current as any).__observer;
      if (oldObserver) {
        oldObserver.disconnect();
      }
    }
    arenaObserverRef.current = node;
    if (node) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          const baseWidth = 720;
          const baseHeight = 405; // 16:9 ratio
          const widthRatio = width / baseWidth;
          const heightRatio = height / baseHeight;
          const calculatedScale = Math.max(0.5, Math.min(1.0, Math.min(widthRatio, heightRatio)));
          setArenaScale(calculatedScale);
        }
      });
      observer.observe(node);
      (node as any).__observer = observer;
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('pokethology_scan_history', JSON.stringify(scanHistory));
    } catch (e) {
      console.error(e);
    }
  }, [scanHistory]);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOfflineManagerOpen, setIsOfflineManagerOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  const [isDailyScanOpen, setIsDailyScanOpen] = useState(false);
  const [isDailyQuizOpen, setIsDailyQuizOpen] = useState(false);
  const [isBattleHistoryExpanded, setIsBattleHistoryExpanded] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<'flee' | 'run' | null>(null);
  const [isLightMode, setIsLightMode] = useState<boolean>(false);

  const [arenaArtworkMode, setArenaArtworkMode] = useState<'home' | '2d'>('home');

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light');
      document.body.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.body.classList.remove('light');
    }
  }, [isLightMode]);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(50);

  const handleAbort = useCallback(() => {
    setLoadingPokemon(false);
    setError(null);
    setPokemon(null);
    setBattleOpponent(null);
    setIsBattling(false);
    setIsChaosModeActive(false);
    setBattleState('setup');
    setListMode('pokemon');
    sounds.scan(); playHaptic('light');
  }, [setLoadingPokemon, setError, setPokemon, setBattleOpponent, setIsBattling, setIsChaosModeActive, setBattleState, setListMode, sounds]);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  // Lock body scrolling when any modal is active so main app background stays fixed
  useEffect(() => {
    const isAnyModalOpen = isDailyHubOpen || isDailyScanOpen || isDailyQuizOpen || isSettingsOpen || isTutorialOpen || isWelcomeOpen || isMusicOpen || isComparisonOpen || isTypeChartOpen || isAvatarModalOpen;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isDailyHubOpen, isDailyScanOpen, isDailyQuizOpen, isSettingsOpen, isTutorialOpen, isWelcomeOpen, isMusicOpen, isComparisonOpen, isTypeChartOpen, isAvatarModalOpen]);
  const [autoAiEnabled, setAutoAiEnabled] = useState(true);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isChaosMatchSetup, setIsChaosMatchSetup] = useState(false);
  const [chaosPhase, setChaosPhase] = useState<'none' | 'selecting_pokemon' | 'moves_ready'>('none');
  const [sfxVolumeState, setSfxVolumeState] = useState<number>(sounds.getSFXVolume());
  const [ytAudioUrl, setYtAudioUrl] = useState("");
  const [ytPlaying, setYtPlaying] = useState(false);
  const [ytVolume, setYtVolume] = useState(0.5);
  const [globalMusicConnected, setGlobalMusicConnected] = useState(false);

  const [enableAnimations, setEnableAnimations] = useState(true);
  const [battleSpeed, setBattleSpeed] = useState<'normal' | 'fast' | 'turbo'>('normal');
  const [pokemonMaxHP, setPokemonMaxHP] = useState(100);

  useEffect(() => {
    if (pokemonMaxHP > 0) {
      const hpPercent = (pokemonHP / pokemonMaxHP) * 100;
      let newTempo = 1.0;
      if (hpPercent < 25) {
        newTempo = 1.5;
      } else if (hpPercent < 50) {
        newTempo = 1.25;
      }
      
      if (newTempo !== tempoTier) {
        setTempoTier(newTempo);
        sounds.setTempoMultiplier(newTempo);
      }
    }
  }, [pokemonHP, pokemonMaxHP, tempoTier]);
  const [opponentMaxHP, setOpponentMaxHP] = useState(100);
  const [battleSuggestion, setBattleSuggestion] = useState<string | null>(null);
  const [recommendedMove, setRecommendedMove] = useState<string | null>(null);
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const detailsContainerRef = useRef<HTMLDivElement>(null);
  const battleScrollRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const savedChatScrollTopRef = useRef<number>(0);
  const [isChatDragging, setIsChatDragging] = useState(false);
  const chatDragStartY = useRef(0);
  const chatDragScrollTop = useRef(0);

  const handleThemeToggle = () => {
    sounds.boot(); playHaptic('medium');
    
    const toggle = () => {
      setIsLightMode(prev => {
        const next = !prev;
        localStorage.setItem('isLightMode', String(next));
        return next;
      });
    };

    if ('startViewTransition' in document) {
      (document as any).startViewTransition(() => toggle());
    } else {
      toggle();
    }
  };

  const getTypeEffectiveness = useCallback((moveType: string, targetTypes: string[]) => {
    let multiplier = 1;
    targetTypes.forEach(t => {
      if (TYPE_CHART[moveType]?.[t] !== undefined) {
        multiplier *= TYPE_CHART[moveType][t];
      }
    });
    return multiplier;
  }, []);

  const getBestMove = useCallback((opponentTypes: string[], moves: Move[]) => {
    if (opponentTypes.length === 0 || moves.length === 0) return null;
    
    let bestMove: Move | null = null;
    let maxMultiplier = 0;

    for (const move of moves) {
      if (!move.type || move.type === '???') continue;
      
      let multiplier = getTypeEffectiveness(move.type.toLowerCase(), opponentTypes.map(t => t.toLowerCase()));
      
      if (multiplier > maxMultiplier) {
        maxMultiplier = multiplier;
        bestMove = move;
      } else if (multiplier === maxMultiplier && (bestMove?.power || 0) < (move.power || 0)) {
        bestMove = move;
      }
    }
    return bestMove?.name || null;
  }, [getTypeEffectiveness]);

  const getBattleStrategy = useCallback(async () => {
    if (!pokemon || !battleOpponent) return;
    setIsAiSuggesting(true);
    
    const opponentTypes = battleOpponent.types.map((t: any) => t.type.name);
    const bestMove = getBestMove(opponentTypes, selectedMoves);
    setRecommendedMove(bestMove);
    
    try {
      const battleKey = `${pokemon?.name}-${battleOpponent?.name}-${pokemonHP}-${opponentHP}-${pokemonStatus}-${opponentStatus}`;
      if (aiCache.current[battleKey]) {
        setBattleSuggestion(aiCache.current[battleKey]);
        return;
      }

      const battleData = {
        player: { 
          name: pokemon?.name, 
          hpPercent: Math.round((pokemonHP / pokemonMaxHP) * 100),
          status: pokemonStatus,
          moves: selectedMoves.map(m => ({ name: m.name, type: m.type, power: m.power }))
        },
        opponent: { 
          name: battleOpponent?.name, 
          hpPercent: Math.round((opponentHP / opponentMaxHP) * 100),
          status: opponentStatus,
          types: battleOpponent.types.map(t => t.type.name)
        }
      };

      recordApiUsage("gemini_ai", 1);
      const response = await fetch("/api/strategy", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept-Language": navigator.language
        },
        body: JSON.stringify({ 
          battleData,
          lang: 'en'
        }),
      });

      const responseText = await response.text();
      let data: any = {};
      try { data = JSON.parse(responseText); } catch (_) { data = { strategy: null }; }

      const resultStrategy = data?.strategy || (bestMove 
        ? `‚Ä¢ üîÆ **ANALYSIS**: Opponent ${battleOpponent?.name} is vulnerable to optimal type matchups.\n‚Ä¢ ‚öîÔ∏è **COMMAND**: Execute ${bestMove.toUpperCase()} immediately for maximum damage.`
        : `‚Ä¢ üîÆ **ANALYSIS**: Maintain tactical momentum against ${battleOpponent?.name}.\n‚Ä¢ ‚öîÔ∏è **COMMAND**: Focus on high-power moves and HP preservation.`);

      aiCache.current[battleKey] = resultStrategy;
      setBattleSuggestion(resultStrategy);
    } catch (err: any) {
      console.error("Strategy error:", err);
      const fallbackStr = bestMove 
        ? `‚Ä¢ üîÆ **ANALYSIS**: Type advantage identified against ${battleOpponent?.name}.\n‚Ä¢ ‚öîÔ∏è **COMMAND**: Strike with ${bestMove.toUpperCase()}!`
        : `‚Ä¢ üîÆ **ANALYSIS**: Target opponent weaknesses.\n‚Ä¢ ‚öîÔ∏è **COMMAND**: Protect HP and use highest power move.`;
      setBattleSuggestion(fallbackStr);
    } finally {
      setIsAiSuggesting(false);
    }
  }, [pokemon, battleOpponent, pokemonHP, pokemonMaxHP, selectedMoves, opponentHP, opponentMaxHP, opponentStatus, pokemonStatus, getBestMove, 'en']);

  const getEffectiveStat = useCallback((p: Pokemon | null, statName: string, isPlayer: boolean) => {
    if (!p) return 0;
    const baseRaw = p.stats.find((s: any) => s.stat.name === statName)?.base_stat || 50;
    
    // Proper level 50 stat calculation (assuming 31 IVs and 0 EVs)
    // HP = floor((2 * Base + 31) * 50 / 100) + 50 + 10 = Base + 75
    // Other Stats = floor((2 * Base + 31) * 50 / 100) + 5 = Base + 20
    const calculatedBase = statName === 'hp' ? baseRaw + 75 : baseRaw + 20;
    const base = isChaosModeActive ? calculatedBase + 20 : calculatedBase;
    
    const boost = p.name === pokemon?.name ? (customStats[statName] || 0) : 0;
    const totalBase = base + boost;

    // Stat stages don't apply to HP
    if (statName === 'hp') {
      return totalBase;
    }
    
    // Stat stages
    const stages = isPlayer ? playerStatStages : opponentStatStages;
    const stage = stages[statName] || 0;
    
    // Stage multipliers in Pok√©mon: 2/2, 3/2, 4/2... or 2/3, 2/4...
    const stageMultiplier = Math.max(2, 2 + stage) / Math.max(2, 2 - stage);
    
    // Status effects
    const status = isPlayer ? pokemonStatus : opponentStatus;
    let multiplier = stageMultiplier;
    if (status === 'PAR' && statName === 'speed') multiplier *= 0.5;
    if (status === 'BRN' && statName === 'attack') multiplier *= 0.5;
    
    return Math.floor(totalBase * multiplier);
  }, [pokemon, customStats, playerStatStages, opponentStatStages, pokemonStatus, opponentStatus, isChaosModeActive]);

  const skipVSScreen = useCallback(() => {
    if (vsTimeoutRef.current) {
      clearTimeout(vsTimeoutRef.current);
      vsTimeoutRef.current = null;
    }
    if (vsPlayerCryTimeoutRef.current) {
      clearTimeout(vsPlayerCryTimeoutRef.current);
      vsPlayerCryTimeoutRef.current = null;
    }
    if (vsOpponentCryTimeoutRef.current) {
      clearTimeout(vsOpponentCryTimeoutRef.current);
      vsOpponentCryTimeoutRef.current = null;
    }
    
    setShowVSScreen(false);
    setIsBattling(true);
    setBattleState('battling');
    setActiveTab('battle');
    setBattleLog([{ text: "BATTLE START!", type: 'system' }]);

    // Smoothly scroll combat section / arena into view after VS screen closes
    setTimeout(() => {
      const arenaElem = arenaRef.current || document.getElementById('battle-arena-container');
      if (arenaElem) {
        arenaElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (detailsContainerRef.current) {
        detailsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 320);

    const pMaxHP = Math.floor(((pokemon?.stats?.find(s => s.stat.name === 'hp')?.base_stat || 50) + (customStats['hp'] || 0)) * 2 + 110);
    const oMaxHP = Math.floor((battleOpponent?.stats?.find(s => s.stat.name === 'hp')?.base_stat || 50) * 2 + 110);
    setPokemonMaxHP(pMaxHP);
    setOpponentMaxHP(oMaxHP);
    setPokemonHP(pMaxHP);
    setOpponentHP(oMaxHP);
    setPokemonStatus(null);
    setOpponentStatus(null);
    setPokemonFlinched(false);
    setOpponentFlinched(false);

    setPlayerSubstitute(0);
    setOpponentSubstitute(0);
    setPlayerProtected(false);
    setOpponentProtected(false);
    setPlayerStatStages({});
    setOpponentStatStages({});

    setSelectedMoves(prev => prev.map(m => ({ ...m, currentPP: m.pp })));
    
    if (battleOpponent) {
      setOpponentMoves(generateCompetitiveMoveset(battleOpponent, [], pokemon));
    } else {
      setOpponentMoves([]);
    }

    const pSpeed = getEffectiveStat(pokemon, 'speed', true);
    const oSpeed = getEffectiveStat(battleOpponent, 'speed', false);
    setTurn(pSpeed >= oSpeed ? 'player' : 'opponent');
  }, [pokemon, battleOpponent, customStats, getEffectiveStat]);

  const resetSimulation = useCallback(() => {
    setIsBattling(false);
    setIsChaosModeActive(false);
    setBattleSuggestion(null);
    setBattleState('setup');
    setBattleLog([]);
    setTurnNumber(1);
    setPokemonHP(pokemonMaxHP);
    setOpponentHP(opponentMaxHP);
    setPokemonStatus(null);
    setOpponentStatus(null);
    setPokemonFlinched(false);
    setOpponentFlinched(false);
    setPlayerStatStages({});
    setOpponentStatStages({});
    setTurn('player');
    setIsAnimating(false);
    setBattleMessage(null);
    setAttackerAnimation('none');
    setDefenderAnimation('none');
    setMoveAnimation('none');
  }, [pokemonMaxHP, opponentMaxHP]);

  const handleSystemRestart = useCallback(() => {
    setIsRebooting(true);
    sounds.boot(); playHaptic('medium');
    
    setTimeout(() => {
      // 1. Core State Reset
      setIsSettingsOpen(false);
      setIsTutorialOpen(false);
      setIsMusicOpen(false);
      setIsTypeChartOpen(false);
      setIsMoveDetailOpen(false);
      setIsBattleHelpOpen(false);
      
      // 2. Search & List Reset
      setQuery('');
      setInputValue('');
      setLastSearched('');
      setListMode('home');
      setCurrentGenId(1);
      
      setTypeFilter(null);
      setSortBy('id');
      setSortOrder('asc');
      setDisplayLimit(50);
      
      // 3. Selection & Team Reset
      setPokemon(null);
      setCurrentVariety(null);
      setBattleOpponent(null);
      
      setOpponentTeam([]);
      setActivePlayerIndex(0);
      setActiveOpponentIndex(0);
      setBattleResult(null);
      
      // 4. Interface State
      setActiveTab('data');
      setChatMessages([]);
      setIsSelectingOpponent(false);
      
      // 5. Battle & Chaos Reset
      setIsChaosMatchSetup(false);
      setChaosPhase('none');
      setSelectedMoves([]);
      setOpponentMoves([]);
      setCustomStats({});
      
      // 6. Simulation Reset
      resetSimulation();
      
      // 7. Data Cleanup
      setError(null);
      setAiSuggestion(null);
      setBattleSuggestion(null);
      setFloatingTexts([]);

      setTimeout(() => {
        setIsRebooting(false);
        setListMode('home');
      }, 350);
    }, 150);
  }, [resetSimulation]);

  const delay = useCallback((ms: number) => new Promise(resolve => setTimeout(resolve, ms)), []);

  // Automatic simulation reset watchdog after battle finishes (disabled to allow the user full control of rematch/finish choices)
  useEffect(() => {
    setAutoResetTime(null);
  }, []);

  useEffect(() => {
    if (autoResetTime === null) return;
    if (autoResetTime <= 0) {
      resetSimulation();
      return;
    }
    const timer = setTimeout(() => {
      setAutoResetTime(autoResetTime - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [autoResetTime, resetSimulation]);

  const executeMove = useCallback(async (attacker: Pokemon, defender: Pokemon, move: Move, isPlayer: boolean) => {
    if (isAnimating) return 0;
    setIsAnimating(true);
    const log = (msg: string, type: LogEntry['type'] = 'normal') => setBattleLog(prev => [...prev, { text: msg, type, turn: turnNumber }].slice(-50));
    const battleDelay = (ms: number) => {
      if (!enableAnimations) return delay(Math.max(10, ms / 12));
      const speedFactor = battleSpeed === 'normal' ? 0.95 : battleSpeed === 'fast' ? 0.5 : 0.25;
      return delay(ms * speedFactor);
    };

    // Turn anomaly roll in Chaos Mode
    // Effect removed.
    
    const attackerStatus = isPlayer ? pokemonStatus : opponentStatus;
    
    // Check for flinch
    if (isPlayer && pokemonFlinched) {
      setPokemonFlinched(false);
      log(`${attacker.name.toUpperCase()} flinched and couldn't move!`, 'status-effect');
      setBattleMessage({ text: "FLINCHED!", type: 'status' });
      await battleDelay(800);
      setBattleMessage(null);
      return 0;
    } else if (!isPlayer && opponentFlinched) {
      setOpponentFlinched(false);
      log(`${attacker.name.toUpperCase()} flinched and couldn't move!`, 'status-effect');
      setBattleMessage({ text: "FLINCHED!", type: 'status' });
      await battleDelay(800);
      setBattleMessage(null);
      return 0;
    }

    // Check for status effects that prevent moving
    if (attackerStatus === 'PAR' && Math.random() < 0.25) {
      log(`${attacker.name.toUpperCase()} is paralyzed! It can't move!`, 'status-effect');
      setBattleMessage({ text: "PARALYZED", type: 'status' });
      sounds.statusParalysis();
      await battleDelay(800);
      setBattleMessage(null);
      return 0;
    }
    if (attackerStatus === 'FRZ') {
      if (Math.random() < 0.2) {
        log(`${attacker.name.toUpperCase()} thawed out!`, 'status-effect');
        setBattleMessage({ text: "THAWED!", type: 'status' });
        if (isPlayer) setPokemonStatus(null); else setOpponentStatus(null);
        await battleDelay(600);
        setBattleMessage(null);
      } else {
        log(`${attacker.name.toUpperCase()} is frozen solid!`, 'status-effect');
        setBattleMessage({ text: "FROZEN!", type: 'status' });
        sounds.statusFreeze();
        await battleDelay(800);
        setBattleMessage(null);
        return 0;
      }
    }
    if (attackerStatus === 'SLP') {
      log(`${attacker.name.toUpperCase()} is fast asleep...`, 'status-effect');
      setBattleMessage({ text: "ASLEEP", type: 'status' });
      sounds.statusSleep();
      await battleDelay(800);
      setBattleMessage(null);
      return 0;
    }

    if (attackerStatus === 'CON') {
      if (Math.random() < 0.25) {
        log(`${attacker.name.toUpperCase()} snapped out of its confusion!`, 'status-effect');
        setBattleMessage({ text: "SNAPPED OUT!", type: 'status' });
        if (isPlayer) setPokemonStatus(null); else setOpponentStatus(null);
        await battleDelay(600);
        setBattleMessage(null);
      } else {
        log(`${attacker.name.toUpperCase()} is confused!`, 'status-effect');
        if (Math.random() < 0.33) {
          log(`It hurt itself in its confusion!`, 'status-effect');
          setBattleMessage({ text: "HURT SELF!", type: 'status' });
                    sounds.hit();
          
          const level = 50;
          const a = getEffectiveStat(attacker, 'attack', isPlayer);
          const d = getEffectiveStat(attacker, 'defense', isPlayer);
          const confusionDamage = Math.max(1, Math.floor((((2 * level / 5 + 2) * 40 * (a / d)) / 50) + 2));
          
          if (isPlayer) {
            setPokemonHP(prev => Math.max(0, prev - confusionDamage));
            setAttackerAnimation('hit');
            await battleDelay(400);
            setAttackerAnimation('none');
          } else {
            setOpponentHP(prev => Math.max(0, prev - confusionDamage));
            setDefenderAnimation('hit');
            await battleDelay(400);
            setDefenderAnimation('none');
          }
          
          await battleDelay(600);
          setBattleMessage(null);
          return 0;
        }
      }
    }

    // Accuracy check
    if (move.accuracy && Math.random() * 100 > move.accuracy) {
      log(`${move.name.toUpperCase()}!`, isPlayer ? 'player' : 'opponent');
      log(`But it missed!`, 'normal');
      setBattleMessage({ text: "MISSED!", type: 'status' });
            sounds.notVeryEffective();
      await battleDelay(800);
      setBattleMessage(null);
      return 0;
    }

    // Special handling for Transform
    if (move.name.toLowerCase() === 'transform') {
      log(`${move.name.toUpperCase()}!`, isPlayer ? 'player' : 'opponent');
      setBattleMessage({ text: "TRANSFORM!", type: 'move' });
      sounds.playMoveSound('normal', true);
      await battleDelay(600);
      
      log(`${attacker.name.toUpperCase()} transformed into ${defender.name.toUpperCase()}!`, 'system');
      setBattleMessage({ text: "TRANSFORMED!", type: 'move' });
            
      const transformedData: Pokemon = {
        ...attacker,
        name: defender.name,
        types: [...defender.types],
        stats: attacker.stats.map(s => {
          if (s.stat.name === 'hp') return s;
          const targetStat = defender.stats.find(ts => ts.stat.name === s.stat.name);
          return targetStat ? { ...targetStat } : s;
        }),
        sprites: { ...defender.sprites },
        moves: [...defender.moves],
        cries: defender.cries ? { ...defender.cries } : attacker.cries,
      };

      if (isPlayer) {
        setPokemon(transformedData);
        setSelectedMoves([...opponentMoves]);
        setPlayerStatStages({...opponentStatStages});
      } else {
        setBattleOpponent(transformedData);
        setOpponentMoves([...selectedMoves]);
        setOpponentStatStages({...playerStatStages});
      }
      
      await battleDelay(800);
      setBattleMessage(null);
      return 0;
    }

    // Add Accuracy mechanics!
    const moveAccuracy = move.accuracy;
    const doesHit = moveAccuracy === null || (Math.random() * 100) <= moveAccuracy;

    // Disabled dialog bubble quotes to prevent overlapping text and clutter
    const speakQuote = getOpponentMoveQuote(attacker.name, move.name);
    /* 
    if (isPlayer) {
      setPlayerDialogue(speakQuote);
      setTimeout(() => setPlayerDialogue(null), 3000);
    } else {
      setOpponentDialogue(speakQuote);
      setTimeout(() => setOpponentDialogue(null), 3000);
    }
    */

    log(`${move.name.toUpperCase()}!`, isPlayer ? 'player' : 'opponent');
    setBattleMessage({ text: move.name.toUpperCase(), type: 'move' });
    
    // Determine Damage Class precisely from the API
    const isSpecial = move.damage_class === 'special';
    sounds.playMoveSound(move.type, isSpecial);

    // Turn Reset logic for volatile states
    if (isPlayer) setPlayerProtected(false);
    else setOpponentProtected(false);

    // Custom Protection Engine
    const isDefenderProtected = isPlayer ? opponentProtected : playerProtected;
    const isProtectMove = move.name === 'protect' || move.name === 'detect' || move.name === 'spiky-shield' || move.name === 'kings-shield';
    if (isProtectMove) {
      if (isPlayer) setPlayerProtected(true);
      else setOpponentProtected(true);
      log(`${attacker.name.toUpperCase()} protected itself!`, 'stat-boost');
      setBattleMessage({ text: "PROTECTED!", type: 'status' });
            await battleDelay(800);
      setBattleMessage(null);
      return 0; // successfully protected this turn
    }

    if (isDefenderProtected && (move.power !== null && move.power > 0 || (move.stat_changes && move.stat_changes.some(s => s.change < 0)))) {
       await battleDelay(400);
       log(`${defender.name.toUpperCase()} protected itself!`, 'normal');
       setBattleMessage({ text: "BLOCKED!", type: 'status' });
              await battleDelay(800);
       setBattleMessage(null);
       return 0;
    }
    
    // Custom Substitute Engine (Creation)
    if (move.name === 'substitute') {
      const currentAttackerHP = isPlayer ? pokemonHP : opponentHP;
      const attackerMaxHP = isPlayer ? pokemonMaxHP : opponentMaxHP;
      const subCost = Math.floor(attackerMaxHP * 0.25);
      
      if (currentAttackerHP <= subCost) {
        log(`But it failed! Not enough HP.`, 'not-effective');
        addFloatingText("FAILED", 'not-effective', isPlayer);
      } else {
        if (isPlayer) {
          setPokemonHP(prev => prev - subCost);
          setPlayerSubstitute(subCost);
        } else {
          setOpponentHP(prev => prev - subCost);
          setOpponentSubstitute(subCost);
        }
        log(`${attacker.name.toUpperCase()} sacrificed HP to make a substitute!`, 'system');
        setBattleMessage({ text: "SUBSTITUTE!", type: 'status' });
              }
      await battleDelay(800);
      setBattleMessage(null);
      return 0;
    }

    if (!doesHit) {
      await battleDelay(600);
      log(`${attacker.name.toUpperCase()}'s attack missed!`, 'normal');
      setBattleMessage({ text: "MISSED!", type: 'status' });
            await battleDelay(800);
      setBattleMessage(null);
      return 0; // Turn ends on miss!
    }

    // Calculate type effectiveness for both damaging and status moves
    const targetTypes = defender.types.map(t => t.type.name);
    const attackerTypes = attacker.types.map(t => t.type.name);
    const effectiveness = getTypeEffectiveness(move.type, targetTypes);

    const isDamaging = move.power !== null && move.power > 0;
    let totalDamage = 0;
    let anyCrit = false;
    let turnOutcomeMessages: string[] = [];
    let highestMsgType: any = "move";

    if (effectiveness === 0) {
      log(`It had no effect on ${defender.name.toUpperCase()}...`, 'not-effective');
      addFloatingText("NO EFFECT", 'not-effective', isPlayer);
      turnOutcomeMessages.push("NO EFFECT!");
      highestMsgType = 'status';
      await battleDelay(350);
    } else if (isDamaging) {
      // Determine number of hits
      const minHits = move.meta?.min_hits || 1;
      const maxHits = move.meta?.max_hits || 1;
      const numHits = Math.floor(Math.random() * (maxHits - minHits + 1)) + minHits;
      
      for (let i = 0; i < numHits; i++) {
        // Critical Hit (6.25% chance)
        const isCrit = Math.random() < 0.0625;
        if (isCrit) anyCrit = true;
        const critMultiplier = isCrit ? 1.5 : 1;
        const stabMultiplier = attackerTypes.includes(move.type) ? 1.5 : 1;
        
        // Determine if move is physical or special
        const attackStat = isSpecial ? getEffectiveStat(attacker, 'special-attack', isPlayer) : getEffectiveStat(attacker, 'attack', isPlayer);
        const defenseStat = isSpecial ? getEffectiveStat(defender, 'special-defense', !isPlayer) : getEffectiveStat(defender, 'defense', !isPlayer);
        
        const baseDamage = move.power || 40;
        const randomMultiplier = 0.85 + Math.random() * 0.15;
        const weatherMultiplier = 1;

        const damage = Math.max(1, Math.floor((((baseDamage * (attackStat / defenseStat) * effectiveness * critMultiplier * stabMultiplier * weatherMultiplier) / 5) + 2) * randomMultiplier));
        totalDamage += damage;
        
        sounds.hit();
        let dmgType: any = 'damage'; if (critMultiplier > 1) dmgType = 'crit-damage'; else if (effectiveness > 1) dmgType = 'super-damage'; else if (effectiveness < 1) dmgType = 'weak-damage'; addFloatingText(damage.toString(), dmgType, isPlayer);
        
        // Trigger visual effect
        if (enableAnimations) {
          const animationType = isSpecial ? 'special' : 'physical';
          
          setMoveAnimation(animationType);
          
          if (isPlayer) {
            setAttackerAnimation(isSpecial ? 'attack_special' : 'attack_physical');
            await battleDelay(80);
            setAttackerAnimation('none');
            
            setDefenderAnimation('hit');
            await battleDelay(200);
            setDefenderAnimation('none');
          } else {
            setDefenderAnimation(isSpecial ? 'attack_special' : 'attack_physical');
            await battleDelay(80);
            setDefenderAnimation('none');
            
            setAttackerAnimation('hit');
            await battleDelay(200);
            setAttackerAnimation('none');
          }
          
          setMoveAnimation('none');
        }

        // Visual feedback for move execution
        if (numHits > 1) {
          setBattleMessage({ text: `${move.name.toUpperCase()} (Hit ${i + 1})`, type: 'move' });
        }
        await battleDelay(250);
        setBattleMessage(null);

        // Detailed Logging
        let damageDetails = `Damage: ${damage}`;
        if (isCrit) {
          damageDetails += " - Critical Hit!";
          sounds.criticalHit();
          playHaptic(100);
          setArenaCriticalNotify(true);
          setTimeout(() => {
            setArenaCriticalNotify(false);
          }, 1200);
          if (enableAnimations) {
            if (isPlayer) {
              setDefenderAnimation('hit_critical');
              await battleDelay(300);
              setDefenderAnimation('none');
            } else {
              setAttackerAnimation('hit_critical');
              await battleDelay(300);
              setAttackerAnimation('none');
            }
          }
        }
        log(damageDetails, isCrit ? 'critical' : 'normal');
      }

      if (numHits > 1) {
        log(`Hit ${numHits} times!`, 'normal');
        setBattleMessage(null);
      }

      if (effectiveness > 1) {
        log("It's super effective!", 'effective');
        if (isPlayer) {
          setUsedSuperEffectiveCurrentBattle(true);
        }
      } else if (effectiveness < 1 && effectiveness > 0) {
        log("It's not very effective...", 'not-effective');
      }
      
      // Unified aesthetic battle message for hits
      let hitMsg = "";
      let hitType = 'default';
      
      if (anyCrit && effectiveness > 1) {
          hitMsg = "CRITICAL & EFFECTIVE!";
          hitType = 'critical';
      } else if (anyCrit && effectiveness < 1 && effectiveness > 0) {
          hitMsg = "CRITICAL (RESISTED)";
          hitType = 'critical';
      } else if (anyCrit) {
          hitMsg = "CRITICAL HIT!";
          hitType = 'critical';
      } else if (effectiveness > 1) {
          hitMsg = "SUPER EFFECTIVE!";
          hitType = 'effective';
      } else if (effectiveness < 1 && effectiveness > 0) {
          hitMsg = "NOT VERY EFFECTIVE...";
          hitType = 'status';
      }
      
      if (hitMsg) {
        turnOutcomeMessages.push(hitMsg);
        if (hitType === 'critical') highestMsgType = 'critical';
        else if (hitType === 'effective' && highestMsgType !== 'critical') highestMsgType = 'effective';
        else if (hitType === 'status' && highestMsgType === 'move') highestMsgType = 'status';
      }

      let hpDamageRemaining = totalDamage;
      const setDefenderSubstitute = isPlayer ? setOpponentSubstitute : setPlayerSubstitute;
      const defenderSubstitute = isPlayer ? opponentSubstitute : playerSubstitute;

      if (defenderSubstitute > 0) {
        if (totalDamage >= defenderSubstitute) {
          log(`The substitute broke from the damage!`, 'status-effect');
          sounds.hit();
          setDefenderSubstitute(0);
          hpDamageRemaining = 0; // Does not overflow
        } else {
          log(`The substitute took the damage for ${defender.name.toUpperCase()}!`, 'normal');
          addFloatingText("BLOCKED DECOY", 'not-effective', !isPlayer);
          setDefenderSubstitute(prev => prev - totalDamage);
          hpDamageRemaining = 0;
        }
      }

      if (isPlayer) {
        setOpponentHP(prev => {
          const next = Math.max(0, prev - hpDamageRemaining);
          if (next === 0 && prev > 0) {
            sounds.faint();
            setScreenShake(true);
            setTimeout(() => setScreenShake(false), 500);
            setDefenderAnimation('faint');
          }
          return next;
        });
      } else {
        setPokemonHP(prev => {
          const next = Math.max(0, prev - hpDamageRemaining);
          if (next === 0 && prev > 0) {
            sounds.faint();
            playHaptic(200);
            setScreenShake(true);
            setTimeout(() => setScreenShake(false), 500);
            setAttackerAnimation('faint');
          }
          return next;
        });
      }
      await battleDelay(300);
      setBattleMessage(null);
    } else {
      await battleDelay(300);
      setBattleMessage(null);
    }

    // Chance to apply status effects (only if not immune)
    const defenderStatus = isPlayer ? opponentStatus : pokemonStatus;
    const setDefenderStatus = isPlayer ? setOpponentStatus : setPokemonStatus;
    let applied = false;

    // Handle Healing Moves
    if (move.meta?.healing && move.meta.healing > 0) {
      const attackerMaxHP = isPlayer ? pokemonMaxHP : opponentMaxHP;
      const healAmount = Math.floor(attackerMaxHP * (move.meta.healing / 100));
      if (isPlayer) {
        setPokemonHP(prev => Math.min(pokemonMaxHP, prev + healAmount));
        log(`${attacker.name.toUpperCase()} recovered HP!`, 'system');
        addFloatingText(`+${healAmount}`, 'boost', !isPlayer);
      } else {
        setOpponentHP(prev => Math.min(opponentMaxHP, prev + healAmount));
        log(`${attacker.name.toUpperCase()} recovered HP!`, 'system');
        addFloatingText(`+${healAmount}`, 'boost', !isPlayer);
      }
      sounds.statBoost();
      await battleDelay(350);
    }

    // Handle Drain Moves
    if (move.meta?.drain && move.meta.drain !== 0 && totalDamage > 0) {
      const drainAmount = Math.floor(totalDamage * (move.meta.drain / 100));
      if (drainAmount > 0) {
        if (isPlayer) setPokemonHP(prev => Math.min(pokemonMaxHP, prev + drainAmount));
        else setOpponentHP(prev => Math.min(opponentMaxHP, prev + drainAmount));
        log(`${attacker.name.toUpperCase()} drained health!`, 'system');
        addFloatingText(`+${drainAmount}`, 'boost', !isPlayer);
      } else if (drainAmount < 0) {
        // Recoil
        const recoil = Math.abs(drainAmount);
        if (isPlayer) setPokemonHP(prev => Math.max(0, prev - recoil));
        else setOpponentHP(prev => Math.max(0, prev - recoil));
        log(`${attacker.name.toUpperCase()} was hit by recoil!`, 'normal');
        addFloatingText(`-${recoil}`, 'damage', !isPlayer);
      }
      await battleDelay(350);
    }
    
    // Apply stat changes (only if not immune when targeting opponent)
    if (move.stat_changes) {
      for (const change of move.stat_changes) {
        const targetsUser = move.target === 'user' || move.target === 'users-field';
        if (!targetsUser && effectiveness === 0) continue; // Immune target cannot have stats lowered
        
        const targetStages = targetsUser ? (isPlayer ? playerStatStages : opponentStatStages) : (isPlayer ? opponentStatStages : playerStatStages);
        const setTargetStages = targetsUser ? (isPlayer ? setPlayerStatStages : setOpponentStatStages) : (isPlayer ? setOpponentStatStages : setPlayerStatStages);
        
        // Prevent lowering stats if opponent has a substitute
        if (!targetsUser && (isPlayer ? opponentSubstitute : playerSubstitute) > 0) {
           log(`But it failed because of the substitute!`, 'not-effective');
           continue; 
        }
        
        const statName = change.stat.name;
        const currentStage = targetStages[statName] || 0;
        if (currentStage === (change.change > 0 ? 6 : -6)) {
          const targetName = targetsUser ? attacker.name : defender.name;
          log(`${targetName.toUpperCase()}'s ${statName} won't go any ${change.change > 0 ? 'higher' : 'lower'}!`, 'normal');
        } else {
          const newStage = Math.max(-6, Math.min(6, currentStage + change.change));
          setTargetStages(prev => ({ ...prev, [statName]: newStage }));
          const isTargetPlayer = (isPlayer && targetsUser) || (!isPlayer && !targetsUser);
          if (isTargetPlayer) {
            setPlayerStatAnimation(change.change > 0 ? 'boost' : 'lower');
            setTimeout(() => setPlayerStatAnimation('none'), 600);
          } else {
            setOpponentStatAnimation(change.change > 0 ? 'boost' : 'lower');
            setTimeout(() => setOpponentStatAnimation('none'), 600);
          }
          
          // Floating text on the correct target
          const floatingTarget = targetsUser ? !isPlayer : isPlayer;
          turnOutcomeMessages.push(`${statName.toUpperCase()} ${change.change > 0 ? 'ROSE' : 'FELL'}!`);
          addStatEffect(change.change > 0 ? 'boost' : 'lower', floatingTarget);
          
          if (change.change > 0) sounds.statBoost(); else sounds.statLower();
          await battleDelay(450);
          setStatAnimation('none');
          const targetName = targetsUser ? attacker.name : defender.name;
          log(`${targetName.toUpperCase()}'s ${statName} ${change.change > 0 ? 'rose' : 'fell'}!`, change.change > 0 ? 'stat-boost' : 'stat-lower');
        }
      }
    }

    if (effectiveness > 0 && !defenderStatus && move.meta?.ailment && Math.random() < (move.meta.ailment_chance || 100) / 100) {
      const ailment = move.meta.ailment.name;
      if (ailment === 'paralysis') {
        log(`${defender.name.toUpperCase()} is paralyzed! It may be unable to move!`, 'status-effect');
        setDefenderStatus('PAR');
        turnOutcomeMessages.push("PARALYZED!");
        sounds.statusParalysis();
        applied = true;
      } else if (ailment === 'burn') {
        log(`${defender.name.toUpperCase()} was burned!`, 'status-effect');
        setDefenderStatus('BRN');
        turnOutcomeMessages.push("BURNED!");
        sounds.statusBurn();
        applied = true;
      } else if (ailment === 'poison') {
        log(`${defender.name.toUpperCase()} was poisoned!`, 'status-effect');
        setDefenderStatus('PSN');
        turnOutcomeMessages.push("POISONED!");
        sounds.statusPoison();
        applied = true;
      } else if (ailment === 'freeze') {
        log(`${defender.name.toUpperCase()} was frozen solid!`, 'status-effect');
        setDefenderStatus('FRZ');
        turnOutcomeMessages.push("FROZEN!");
        sounds.statusFreeze();
        applied = true;
      } else if (ailment === 'sleep') {
        log(`${defender.name.toUpperCase()} fell asleep!`, 'status-effect');
        setDefenderStatus('SLP');
        turnOutcomeMessages.push("ASLEEP!");
        sounds.statusSleep();
        applied = true;
      } else if (ailment === 'confusion') {
        log(`${defender.name.toUpperCase()} became confused!`, 'status-effect');
        setDefenderStatus('CON');
        turnOutcomeMessages.push("CONFUSED!");
        applied = true;
      }
      
      if (applied && enableAnimations) {
        if (isPlayer) {
          setDefenderAnimation('hit_status');
          await battleDelay(300);
          setDefenderAnimation('none');
        } else {
          setAttackerAnimation('hit_status');
          await battleDelay(300);
          setAttackerAnimation('none');
        }
      }
    }
    
    // Catch-all for Status Moves that don't fall into the simplified ailments/stat changes
    const hasStatChanges = move.stat_changes && move.stat_changes.length > 0;
    const hasHealing = move.meta?.healing && move.meta.healing > 0;
    const hasDrain = move.meta?.drain && move.meta.drain !== 0 && totalDamage > 0;
    
    if (effectiveness > 0 && !isDamaging && !hasStatChanges && !hasHealing && !hasDrain && !applied) {
      if (move.description && move.description !== 'No description available.') {
        log(`Effect: ${move.description.replace(/\n|\f|\r/g, ' ')}`, 'system');
      } else {
        log("But it failed!", 'not-effective');
      }
      await battleDelay(450);
    }
    
    if (turnOutcomeMessages.length > 0) {
      setBattleMessage({ text: turnOutcomeMessages.join(' ‚Ä¢ '), type: highestMsgType });
      await battleDelay(1250);
      setBattleMessage(null);
    }

    // Check for flinch
    const pSpeed = getEffectiveStat(pokemon, 'speed', true);
    const oSpeed = getEffectiveStat(battleOpponent, 'speed', false);
    const goesFirst = isPlayer ? (pSpeed >= oSpeed) : (oSpeed > pSpeed);

    if (goesFirst && move.meta?.flinch_chance && Math.random() < move.meta.flinch_chance / 100) {
      if (isPlayer) {
        setOpponentFlinched(true);
      } else {
        setPokemonFlinched(true);
      }
    }
    
    await battleDelay(200);
    return totalDamage;
  }, [pokemonMaxHP, opponentMaxHP, pokemonStatus, opponentStatus, pokemonFlinched, opponentFlinched, pokemon, battleOpponent, selectedMoves, opponentMoves, playerStatStages, opponentStatStages, enableAnimations, battleSpeed, delay, addFloatingText, getEffectiveStat, getTypeEffectiveness, isAnimating, customStats, turnNumber, pokemonHP, opponentHP]);

  const getAiBattleSuggestion = async () => {
    if (!pokemon || !battleOpponent || isChatLoading) return;
    sounds.scan(); playHaptic('light');
    
    // Switch to tactical chat tab
    setActiveTab('chat');
    
    // Construct extremely concise tactical prompt for the unified coach chatbot
    const prompt = `Give me a highly concise tactical tip for my active battle match: my **${pokemon.name}** vs opponent's **${battleOpponent.name}**. My current moves: ${selectedMoves.map(m => m.name).join(', ')}. HP status: Player ${pokemonHP}/${pokemonMaxHP}, Opponent ${opponentHP}/${opponentMaxHP}.`;
    
    submitChatMessage(prompt);
  };

  const handleRun = () => {
    sounds.flee();
    setBattleLog(prev => [{ text: "PLAYER QUIT THE BATTLE!", type: 'system' }, ...prev]);
    setTimeout(() => {
      resetSimulation();
      setBattleState('setup');
      setBattleLog([]);
    }, 1000);
  };

  const runBattle = async () => {
    if (!pokemon || !battleOpponent || selectedMoves.length === 0) {
      setBattleLog([{ text: "SELECT 4 MOVES BEFORE STARTING!", type: 'system' }]);
      return;
    }
    
    // 1. Instantly display matchup VS screen & play high quality matchup buzzer
    setActiveTab('battle');
    setShowVSScreen(true);
    sounds.battleStart(); playHaptic('heavy');
    playHaptic('heavy');

    // 2. Clear previous active animations & timeouts
    if (vsTimeoutRef.current) clearTimeout(vsTimeoutRef.current);
    if (vsPlayerCryTimeoutRef.current) clearTimeout(vsPlayerCryTimeoutRef.current);
    if (vsOpponentCryTimeoutRef.current) clearTimeout(vsOpponentCryTimeoutRef.current);

    setAttackerAnimation('none');
    setDefenderAnimation('none');
    setMoveAnimation('none');

    // 3. Play both Pokemon cries completely in sequence before transition auto-completes
    (async () => {
      // 300ms initial enter delay
      await new Promise(r => setTimeout(r, 300));

      if (pokemon?.cries?.latest) {
        playHaptic('cry');
        await sounds.playCry(pokemon?.name ?? '', pokemon.cries.latest, pokemon?.name?.includes('-gmax') ?? false, false);
      } else {
        await new Promise(r => setTimeout(r, 900));
      }

      // 350ms buffer between cries
      await new Promise(r => setTimeout(r, 350));

      if (battleOpponent?.cries?.latest) {
        playHaptic('cry');
        await sounds.playCry(battleOpponent?.name ?? '', battleOpponent.cries.latest, battleOpponent?.name?.includes('-gmax') ?? false, false);
      } else {
        await new Promise(r => setTimeout(r, 900));
      }

      // Buffer to allow echo to conclude smoothly
      await new Promise(r => setTimeout(r, 550));

      skipVSScreen();
    })();
  };

  const applyEndOfTurnEffects = async (isPlayer: boolean) => {
    const status = isPlayer ? pokemonStatus : opponentStatus;
    const startTurn = isPlayer ? statusStartTurnRef.current.player : statusStartTurnRef.current.opponent;
    const p = isPlayer ? pokemon : battleOpponent;
    if (!p) return 0;
    const maxHP = isPlayer ? pokemonMaxHP : opponentMaxHP;
    const log = (msg: string, type: LogEntry['type'] = 'status-effect') => setBattleLog(prev => [...prev, { text: msg, type, turn: turnNumber }].slice(-50));
    
    if (status && startTurn !== null && turnNumber - startTurn >= 3) {
      if (isPlayer) setPokemonStatus(null);
      else setOpponentStatus(null);
      statusStartTurnRef.current[isPlayer ? 'player' : 'opponent'] = null;
      log(`${isPlayer ? pokemon?.name?.toUpperCase() : battleOpponent?.name?.toUpperCase()}'s ${status} wore off!`, 'status-effect');
      await new Promise(r => setTimeout(r, 200));
      return 0;
    }
    
    let damage = 0;
    if (status === 'BRN') {
      damage = Math.max(1, Math.floor(maxHP / 16));
      log(`${isPlayer ? pokemon?.name?.toUpperCase() : battleOpponent?.name?.toUpperCase()} is hurt by its burn!`, 'status-effect');
      if (isPlayer) setPokemonHP(prev => Math.max(0, prev - damage));
      else setOpponentHP(prev => Math.max(0, prev - damage));
      await new Promise(r => setTimeout(r, 200));
    } else if (status === 'PSN') {
      damage = Math.max(1, Math.floor(maxHP / 8));
      log(`${isPlayer ? pokemon?.name?.toUpperCase() : battleOpponent?.name?.toUpperCase()} is hurt by poison!`, 'status-effect');
      if (isPlayer) setPokemonHP(prev => Math.max(0, prev - damage));
      else setOpponentHP(prev => Math.max(0, prev - damage));
      await new Promise(r => setTimeout(r, 200));
    }
    
    return damage;
  };

  useEffect(() => {
    if (battleState === 'battling') {
      if (pokemonHP <= 0) {
        setBattleLog(prev => [...prev, { text: `${battleOpponent?.name?.toUpperCase()} IS THE VICTOR!`, type: 'faint' }]);
        setBattleMessage({ text: "DEFEATED!", type: 'status' });
        setIsBattling(false);
        setBattleState('finished');
        setBattleResult('defeat');
        setSessionLosses(prev => {
          const next = prev + 1;
          sessionStorage.setItem('pokethology_session_losses', String(next));
          return next;
        });
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 1000);
        sounds.defeat();
        setTimeout(() => {
          setAttackerAnimation('none');
          setDefenderAnimation('none');
        }, 2000);

        // Simulate learning a new move after defeat too


      } else if (opponentHP <= 0) {
        setBattleLog(prev => [...prev, { text: `${pokemon?.name?.toUpperCase()} IS THE VICTOR!`, type: 'system' }]);
        setBattleMessage({ text: "VICTORY!", type: 'effective' });
        setIsBattling(false);
        setBattleState('finished');
        setBattleResult('victory');
        setSessionWins(prev => {
          const next = prev + 1;
          sessionStorage.setItem('pokethology_session_wins', String(next));
          return next;
        });
        sounds.victory();

        // Check and update Daily Combat Mission & Daily Hub Combat Challenges on victory
        if (battleOpponent) {
          try {
            // Robust extractor for opponent types
            const oppAny = battleOpponent as any;
            const opponentTypes: string[] = [];
            if (Array.isArray(oppAny.types)) {
              oppAny.types.forEach((t: any) => {
                if (typeof t === 'string') opponentTypes.push(t.toLowerCase());
                else if (t?.type?.name) opponentTypes.push(t.type.name.toLowerCase());
                else if (t?.name) opponentTypes.push(t.name.toLowerCase());
              });
            }
            if (oppAny.type && typeof oppAny.type === 'string') {
              opponentTypes.push(oppAny.type.toLowerCase());
            }

            // Robust extractor for opponent stats
            let opponentDefense = 0;
            let opponentSpeed = 0;
            let opponentAttack = 0;
            let opponentHp = 0;
            let opponentSpAtk = 0;
            let opponentSpDef = 0;
            if (Array.isArray(oppAny.stats)) {
              const defStat = oppAny.stats.find((s: any) => s?.stat?.name === 'defense' || s?.name === 'defense');
              if (defStat) opponentDefense = defStat.base_stat ?? defStat.value ?? 0;
              
              const spdStat = oppAny.stats.find((s: any) => s?.stat?.name === 'speed' || s?.name === 'speed');
              if (spdStat) opponentSpeed = spdStat.base_stat ?? spdStat.value ?? 0;

              const atkStat = oppAny.stats.find((s: any) => s?.stat?.name === 'attack' || s?.name === 'attack');
              if (atkStat) opponentAttack = atkStat.base_stat ?? atkStat.value ?? 0;
              
              const hpStat = oppAny.stats.find((s: any) => s?.stat?.name === 'hp' || s?.name === 'hp');
              if (hpStat) opponentHp = hpStat.base_stat ?? hpStat.value ?? 0;

              const spAtkStat = oppAny.stats.find((s: any) => s?.stat?.name === 'special-attack' || s?.name === 'special-attack' || s?.stat?.name === 'sp_attack');
              if (spAtkStat) opponentSpAtk = spAtkStat.base_stat ?? spAtkStat.value ?? 0;

              const spDefStat = oppAny.stats.find((s: any) => s?.stat?.name === 'special-defense' || s?.name === 'special-defense' || s?.stat?.name === 'sp_defense');
              if (spDefStat) opponentSpDef = spDefStat.base_stat ?? spDefStat.value ?? 0;
            } else if (oppAny.defense !== undefined) {
              opponentDefense = Number(oppAny.defense);
              opponentSpeed = Number(oppAny.speed || 0);
              opponentAttack = Number(oppAny.attack || 0);
              opponentHp = Number(oppAny.hp || 0);
              opponentSpAtk = Number(oppAny.specialAttack || oppAny.sp_attack || 0);
              opponentSpDef = Number(oppAny.specialDefense || oppAny.sp_defense || 0);
            }

            const opponentWeight = Number(oppAny.weight || 0) / 10; // kg
            const bst = opponentHp + opponentAttack + opponentDefense + opponentSpAtk + opponentSpDef + opponentSpeed;

            const opponentName = (oppAny.name || '').toLowerCase();
            const isMega = opponentName.includes('-mega') || opponentName.includes('mega-') || opponentName.includes('primal');
            const isGmax = opponentName.includes('-gmax') || opponentName.includes('gmax') || opponentName.includes('gigantamax');
            
            const paradoxNames = ['great tusk', 'scream tail', 'brute bonnet', 'flutter mane', 'slither wing', 'sandy shocks', 'iron treads', 'iron bundle', 'iron hands', 'iron jugulis', 'iron moth', 'iron thorns', 'roaring moon', 'iron valiant', 'walking wake', 'iron leaves', 'gouging fire', 'raging bolt', 'iron boulder', 'iron crown'];
            const ultraBeastNames = ['nihilego', 'buzzwole', 'pheromosa', 'xurkitree', 'celesteela', 'kartana', 'guzzlord', 'poipole', 'naganadel', 'stakataka', 'blacephalon'];

            const legendaries = ['articuno', 'zapdos', 'moltres', 'mewtwo', 'mew', 'raikou', 'entei', 'suicune', 'lugia', 'ho-oh', 'celebi', 'regirock', 'regice', 'registeel', 'latias', 'latios', 'kyogre', 'groudon', 'rayquaza', 'jirachi', 'deoxys', 'uxie', 'mesprit', 'azelf', 'dialga', 'palkia', 'heatran', 'regigigas', 'giratina', 'cresselia', 'phione', 'manaphy', 'darkrai', 'shaymin', 'arceus', 'victini', 'cobalion', 'terrakion', 'virizion', 'tornadus', 'thundurus', 'reshiram', 'zekrom', 'landorus', 'kyurem', 'keldeo', 'meloetta', 'genesect', 'xerneas', 'yveltal', 'zygarde', 'diancie', 'hoopa', 'volcanion', 'tapu koko', 'tapu lele', 'tapu bulu', 'tapu fini', 'cosmog', 'cosmoem', 'solgaleo', 'lunala', 'necrozma', 'magearna', 'marshadow', 'zeraora', 'meltan', 'melmetal', 'zacian', 'zamazenta', 'eternatus', 'kubfu', 'urshifu', 'zarude', 'regieleki', 'regidrago', 'glastrier', 'spectrier', 'calyrex', 'enamorus', 'wo-chien', 'chien-pao', 'ting-lu', 'chi-yu', 'koraidon', 'miraidon', 'terapagos', 'pecharunt', ...paradoxNames, ...ultraBeastNames];
            const isLegendary = legendaries.some(leg => opponentName.includes(leg));

            let latestMissionNotice: { title: string; description: string; isComplete: boolean } | null = null;

            // 1. Evaluate Main Daily Combat Mission
            const isHardMode = (localStorage.getItem(`pokethology_mission_hard_${today}`) || localStorage.getItem(`poketheology_mission_hard_${today}`)) === 'true';
            const currentMission = getDailyCombatMission(today, isHardMode);
            let matched = false;

            if (currentMission.target === 'legendary') {
              if (isLegendary) matched = true;
            } else if (currentMission.target === 'mega') {
              if (isMega) matched = true;
            } else if (currentMission.target === 'gmax') {
              if (isGmax) matched = true;
            } else if (currentMission.target === 'huge_bst') {
              if (bst >= 540 || isLegendary || isMega) matched = true;
            } else if (currentMission.target === 'high_defense') {
              if (opponentDefense >= 150) matched = true;
            } else if (currentMission.target === 'ultra_defense') {
              if (opponentDefense >= 180) matched = true;
            } else if (currentMission.type === 'type') {
              if (opponentTypes.includes(currentMission.target.toLowerCase())) matched = true;
            } else if (currentMission.type === 'stat') {
              if (currentMission.target === 'defense' && opponentDefense >= 120) matched = true;
              if (currentMission.target === 'attack' && opponentAttack >= 130) matched = true;
              if (currentMission.target === 'speed' && opponentSpeed >= 120) matched = true;
              if (currentMission.target === 'special-attack' && opponentSpAtk >= 130) matched = true;
              if (currentMission.target === 'special-defense' && opponentSpDef >= 130) matched = true;
              if (currentMission.target === 'hp' && opponentHp >= 130) matched = true;
            }

            if (matched) {
              const countKey = `pokethology_mission_progress_count_${today}`;
              const required = getRequiredCount(currentMission, isHardMode);
              
              const savedCountStr = localStorage.getItem(countKey);
              let prevCount = savedCountStr ? parseInt(savedCountStr, 10) : 0;
              let nextCount = Math.min(required, prevCount + 1);
              
              localStorage.setItem(countKey, String(nextCount));
              setMissionProgressCount(nextCount);
              
              if (nextCount >= required) {
                const completedKey = `pokethology_mission_completed_${today}`;
                localStorage.setItem(completedKey, 'true');
                setIsMissionCompleted(true);
                
                latestMissionNotice = {
                  title: "Daily Combat Protocol",
                  description: `Protocol Fully Cleared (${nextCount}/${required})!`,
                  isComplete: true
                };

                // Trigger celebratory animation, award sound and success toast
                if (prevCount < required) {
                  setCelebratedMission(currentMission);
                  setShowMissionCelebration(true);
                  try {
                    sounds.success();
                  } catch (_) {}
                  addToast(
                    "‚ú® MISSION FULLY COMPLETE", 
                    "You have successfully validated today's daily combat protocol! Open the congratulations interface.", 
                    "success"
                  );
                }
              } else {
                latestMissionNotice = {
                  title: "Daily Combat Protocol",
                  description: `Progress Updated: ${nextCount}/${required} Defeats Recorded.`,
                  isComplete: false
                };

                // Show floating animated HUD element for status update
                setShowMissionUpdateHUD(true);
                setTimeout(() => setShowMissionUpdateHUD(false), 4500);
                
                if (nextCount === required - 1) {
                  addToast(
                    "üéØ DAILY MISSION FOCUS", 
                    `Almost there! Progress: ${nextCount}/${required}. Just 1 more win to complete the mission!`, 
                    "combat"
                  );
                } else {
                  addToast(
                    "‚öîÔ∏è DAILY MISSION PROGRESS", 
                    `Progress updated: ${nextCount}/${required} defeats recorded. Keep going!`, 
                    "info"
                  );
                }
              }
            }

            // 2. ALWAYS Evaluate All Daily Hub Combat Challenges (Bronze, Silver, Gold activities)
            const hubChallenges = getDailyHubCombatChallenges(today);
            let hubMessageToDisplay: string | null = null;

            for (const challenge of hubChallenges) {
              const stateKey = `pokethology_hub_combat_${today}_${challenge.id}`;
              const currentProgress = parseInt(localStorage.getItem(stateKey) || '0', 10);
              
              if (currentProgress < challenge.required) {
                let isMatch = false;
                if (challenge.type === 'type') {
                  if (opponentTypes.includes(challenge.target.toLowerCase())) isMatch = true;
                } else if (challenge.type === 'single_type') {
                  if (opponentTypes.length === 1) isMatch = true;
                } else if (challenge.type === 'dual_type') {
                  if (opponentTypes.length >= 2) isMatch = true;
                } else if (challenge.type === 'stat') {
                  if (challenge.target === 'defense') {
                    if (challenge.tier === 'bronze' && opponentDefense >= 110) isMatch = true;
                    else if (challenge.tier === 'silver' && opponentDefense >= 130) isMatch = true;
                    else if (challenge.tier === 'gold' && opponentDefense >= 150) isMatch = true;
                    else if (opponentDefense >= 110) isMatch = true;
                  } else if (challenge.target === 'speed') {
                    if (challenge.tier === 'bronze' && opponentSpeed >= 110) isMatch = true;
                    else if (challenge.tier === 'silver' && opponentSpeed >= 125) isMatch = true;
                    else if (challenge.tier === 'gold' && opponentSpeed >= 135) isMatch = true;
                    else if (opponentSpeed >= 110) isMatch = true;
                  } else if (challenge.target === 'attack') {
                    if (challenge.tier === 'bronze' && opponentAttack >= 110) isMatch = true;
                    else if (challenge.tier === 'silver' && opponentAttack >= 130) isMatch = true;
                    else if (challenge.tier === 'gold' && opponentAttack >= 140) isMatch = true;
                    else if (opponentAttack >= 110) isMatch = true;
                  } else if (challenge.target === 'hp') {
                    if (challenge.tier === 'bronze' && opponentHp >= 110) isMatch = true;
                    else if (opponentHp >= 130) isMatch = true;
                  } else if (challenge.target === 'special-attack') {
                    if (challenge.tier === 'bronze' && opponentSpAtk >= 110) isMatch = true;
                    else if (challenge.tier === 'silver' && opponentSpAtk >= 130) isMatch = true;
                    else if (challenge.tier === 'gold' && opponentSpAtk >= 140) isMatch = true;
                    else if (opponentSpAtk >= 110) isMatch = true;
                  } else if (challenge.target === 'special-defense') {
                    if (challenge.tier === 'bronze' && opponentSpDef >= 110) isMatch = true;
                    else if (challenge.tier === 'silver' && opponentSpDef >= 130) isMatch = true;
                    else if (challenge.tier === 'gold' && opponentSpDef >= 140) isMatch = true;
                    else if (opponentSpDef >= 110) isMatch = true;
                  } else if (challenge.target === 'bst') {
                    if (challenge.tier === 'bronze' && bst >= 500) isMatch = true;
                    else if (challenge.tier === 'silver' && bst >= 520) isMatch = true;
                    else if (challenge.tier === 'gold' && bst >= 580) isMatch = true;
                    else if (bst >= 500) isMatch = true;
                  }
                } else if (challenge.type === 'category') {
                  if (challenge.target === 'legendary' && isLegendary) isMatch = true;
                  if (challenge.target === 'mega' && isMega) isMatch = true;
                  if (challenge.target === 'gmax' && isGmax) isMatch = true;
                }
                
                if (isMatch) {
                  const newProgress = Math.min(challenge.required, currentProgress + 1);
                  localStorage.setItem(stateKey, String(newProgress));
                  const isFinished = newProgress >= challenge.required;
                  const wasFinished = currentProgress >= challenge.required;
                  
                  if (isFinished) {
                    if (!wasFinished) {
                      try {
                        let stats = JSON.parse(localStorage.getItem('Pokethology_MissionStats') || '{"pokemonWins":{}, "typeWins":{}, "hubCompletions":0, "examCompletions":0}');
                        const currentMonth = new Date().toISOString().slice(0, 7);
                        if (stats.lastResetMonth !== currentMonth) {
                          stats = { pokemonWins: {}, typeWins: {}, hubCompletions: 0, examCompletions: 0, lastResetMonth: currentMonth };
                        }
                        stats.hubCompletions = (stats.hubCompletions || 0) + 1;
                        localStorage.setItem('Pokethology_MissionStats', JSON.stringify(stats));
                        window.dispatchEvent(new Event('storage'));
                      } catch (e) {
                        console.error("Error updating hub stats", e);
                      }
                    }
                    hubMessageToDisplay = `DAILY HUB: ${challenge.title} (${newProgress}/${challenge.required}) - MISSION COMPLETE!`;
                    latestMissionNotice = {
                      title: `Daily Hub: ${challenge.title}`,
                      description: `Challenge Cleared (${newProgress}/${challenge.required})! Daily Progress & Rank upgraded.`,
                      isComplete: true
                    };
                    addToast(
                      "üéâ DAILY HUB MISSION COMPLETED",
                      `Activity Complete: ${challenge.title} (${newProgress}/${challenge.required})! Your Daily Hub progress & rank have increased.`,
                      "success"
                    );
                    try { sounds.success?.(); } catch (_) {}
                  } else {
                    if (!hubMessageToDisplay) {
                      hubMessageToDisplay = `DAILY HUB: ${challenge.title} (${newProgress}/${challenge.required})`;
                      if (!latestMissionNotice) {
                        latestMissionNotice = {
                          title: `Daily Hub: ${challenge.title}`,
                          description: `Goal Advanced: ${newProgress}/${challenge.required} completed.`,
                          isComplete: false
                        };
                      }
                    }
                    addToast(
                      "‚öîÔ∏è DAILY HUB COMBAT PROGRESS",
                      `Combat Goal Advanced: ${challenge.title} (${newProgress}/${challenge.required})!`,
                      "combat"
                    );
                  }
                }
              }
            }

            if (hubMessageToDisplay) {
              setHubChallengeProgressMessage(hubMessageToDisplay);
              if (hubProgressTimeoutRef.current) clearTimeout(hubProgressTimeoutRef.current);
              hubProgressTimeoutRef.current = setTimeout(() => {
                setHubChallengeProgressMessage(null);
              }, 8000);
            }

            if (latestMissionNotice) {
              setLastBattleMissionNotice(latestMissionNotice);
            }

            // Sync state with open widgets immediately
            try {
              window.dispatchEvent(new Event('pokethology_hub_update'));
              window.dispatchEvent(new Event('storage'));
            } catch (_) {}
          } catch (e) {
            console.error("Error evaluating combat mission progress", e);
          }
        }
        setTimeout(() => {
          setAttackerAnimation('none');
          setDefenderAnimation('none');
        }, 2000);
        

      }
    }
  }, [pokemonHP, opponentHP, battleState, pokemon, battleOpponent]);

  const handleFlee = () => {
    sounds.flee();
    resetSimulation();
  };

  const handlePlayerMove = async (move: Move) => {
    playHaptic(30);
    if (turn !== 'player' || !isBattling || isAnimating || !pokemon || !battleOpponent || isProcessingMoveRef.current) return;
    isProcessingMoveRef.current = true;
    
    // Smoothly scroll the arena into view and keep it centered
    arenaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Clear old AI battle suggestions as the turn state advances
    setBattleSuggestion(null);
    
    try {
      // Deduct PP
      setSelectedMoves(prev => prev.map(m => m.name === move.name ? { ...m, currentPP: Math.max(0, (m.currentPP ?? m.pp) - 1) } : m));
      
      await executeMove(pokemon, battleOpponent, move, true);
      await applyEndOfTurnEffects(true);
      
      setTurn('opponent');
    } catch (err) {
      console.error("Error during player move:", err);
    } finally {
      setIsAnimating(false);
      isProcessingMoveRef.current = false;
    }
  };

  const opponentTurnStartedRef = useRef(false);

  useEffect(() => {
    if (battleState === 'battling' && turn === 'opponent' && opponentHP > 0 && pokemonHP > 0) {
      if (opponentTurnStartedRef.current) return;
      opponentTurnStartedRef.current = true;
      
      const timer = setTimeout(async () => {
        if (!pokemon || !battleOpponent) {
          opponentTurnStartedRef.current = false;
          return;
        }

        // Check speeds: if opponent is faster than the player, do not permit attack until completely scrolled up on the arena
        const playerSpe = getEffectiveStat(pokemon, 'speed', true);
        const oppSpe = getEffectiveStat(battleOpponent, 'speed', false);

        if (oppSpe > playerSpe) {
          // Smoothly scroll completely up to the top of the battle arena
          const arenaContainer = document.getElementById('battle-arena-container');
          if (arenaContainer) {
            arenaContainer.scrollTo({ top: 0, behavior: 'smooth' });
          }
          arenaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (detailsContainerRef.current) {
            detailsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });

          // Block execution until scrolling animation is 100% complete
          await new Promise(resolve => setTimeout(resolve, 650));
        }

        // Master Competitive Opponent AI Move Selection
        const chooseOptimalMove = () => {
          if (!opponentMoves || opponentMoves.length === 0) return battleOpponent.moves[0];

          // Filter moves with available PP
          const availableMoves = opponentMoves.filter(m => (m.currentPP ?? m.pp) > 0);
          if (availableMoves.length === 0) return opponentMoves[0];

          let bestMove = availableMoves[0];
          let highestScore = -1000000;

          const playerTypes = pokemon.types.map(t => t.type.name.toLowerCase());
          const oppTypes = battleOpponent.types.map(t => t.type.name.toLowerCase());

          const opponentHealthPercent = (opponentHP / opponentMaxHP) * 100;
          const playerHealthPercent = (pokemonHP / pokemonMaxHP) * 100;

          // Effective stats incorporating stat stage multipliers
          const oppAtk = getEffectiveStat(battleOpponent, 'attack', false);
          const oppSpA = getEffectiveStat(battleOpponent, 'special-attack', false);
          const oppSpe = getEffectiveStat(battleOpponent, 'speed', false);

          const playerDef = getEffectiveStat(pokemon, 'defense', true);
          const playerSpD = getEffectiveStat(pokemon, 'special-defense', true);
          const playerSpe = getEffectiveStat(pokemon, 'speed', true);
          const playerAtk = getEffectiveStat(pokemon, 'attack', true);
          const playerSpA = getEffectiveStat(pokemon, 'special-attack', true);

          const opponentIsFaster = oppSpe >= playerSpe;
          const isFaintingSoon = opponentHealthPercent < 22;

          for (const move of availableMoves) {
            let score = 0;
            const moveNameLower = move.name.toLowerCase();
            const moveType = (move.type || 'normal').toLowerCase();
            const effectiveness = getTypeEffectiveness(moveType, playerTypes);

            // 0. Hard Immunity Check: NEVER pick an immune move (0x multiplier)
            if (effectiveness === 0) {
              score = -500000;
              if (score > highestScore) {
                highestScore = score;
                bestMove = move;
              }
              continue;
            }

            if (move.power && move.power > 0) {
              // Level 50 Competitive Damage Estimation
              const atkVal = move.damage_class === 'special' ? oppSpA : oppAtk;
              const defVal = move.damage_class === 'special' ? playerSpD : playerDef;
              
              let baseDamage = Math.floor(((22 * move.power * (atkVal / defVal)) / 50) + 2);

              // STAB (Same Type Attack Bonus)
              if (oppTypes.includes(moveType)) {
                baseDamage = Math.floor(baseDamage * 1.5);
              }

              // Multi-hit moves adjustment (e.g. Icicle Spear, Bullet Seed)
              const isMultiHit = moveNameLower.includes('bullet seed') || moveNameLower.includes('icicle spear') || moveNameLower.includes('rock blast') || moveNameLower.includes('pin missile');
              if (isMultiHit) {
                baseDamage = Math.floor(baseDamage * 3.1);
              }

              const accuracy = move.accuracy || 100;
              const expectedDamage = Math.floor(baseDamage * effectiveness * (accuracy / 100));

              score += expectedDamage * 15;

              // 1. GUARANTEED KO FINISHER (Prefer 100% accuracy move if multiple moves KO)
              if (expectedDamage >= pokemonHP) {
                let koBonus = opponentIsFaster || (move.priority || 0) > 0 ? 600000 : 350000;
                // Prefer reliable 100% accuracy over risky move for KO
                if (accuracy >= 95) koBonus += 50000;
                score += koBonus;
              }

              // Multi-hit bonus if player has Substitute active
              if (playerSubstitute > 0 && isMultiHit) {
                score += 45000; // Multi-hit breaks Substitute!
              }

              // 2. PRIORITY STRIKE TACTICS
              const movePriority = move.priority || 0;
              if (movePriority > 0) {
                // If player is faster and can finish off AI, or player HP is low, use priority!
                if (!opponentIsFaster && (playerHealthPercent < 35 || isFaintingSoon)) {
                  score += expectedDamage >= pokemonHP ? 500000 : 55000;
                } else {
                  score += 12000;
                }
              }

              // 3. TYPE MATCHUP & DEFENSIVE WEAKNESS EXPLOITATION
              if (effectiveness >= 2) {
                score += 8000 * effectiveness;
              } else if (effectiveness < 1) {
                score -= 4000; // Avoid resisted attacks
              }

              // Target physical/special defense weakness
              if (move.damage_class === 'physical' && playerDef < playerSpD * 0.8) {
                score += 4500; // Exploit weak Physical Defense
              } else if (move.damage_class === 'special' && playerSpD < playerDef * 0.8) {
                score += 4500; // Exploit weak Special Defense
              }

              // 4. DRAIN / RECOIL SYNERGY
              if (move.meta?.drain && move.meta.drain > 0 && opponentHealthPercent < 75) {
                score += 18000; // Great sustain
              }
              if (move.meta?.drain && move.meta.drain < 0 && opponentHealthPercent < 30) {
                score -= 12000; // Avoid suicidal recoil when low
              }

              // 5. ABOUT TO FAINT: ATTACK HARD WITH FASTEST/HIGHEST POWER MOVE
              if (isFaintingSoon) {
                score += 35000;
              }

            } else {
              // STATUS, SETUP, RECOVERY & UTILITY AI

              // If player has a Substitute active, status & stat-lowering moves WILL FAIL!
              if (playerSubstitute > 0) {
                if (move.meta?.ailment || (move.stat_changes && move.stat_changes.some(c => c.change < 0))) {
                  score = -300000;
                  if (score > highestScore) {
                    highestScore = score;
                    bestMove = move;
                  }
                  continue;
                }
              }

              // If AI is low on HP, penalize non-damaging utility moves heavily (except healing)
              if (isFaintingSoon && !(move.meta?.healing && move.meta.healing > 0) && !moveNameLower.includes('recover') && !moveNameLower.includes('roost')) {
                score = -100000;
                if (score > highestScore) {
                  highestScore = score;
                  bestMove = move;
                }
                continue;
              }

              // A. Strategic Status Ailment Application
              if (move.meta?.ailment && move.meta.ailment.name !== 'none') {
                const ailment = move.meta.ailment.name.toLowerCase();

                // Do not re-inflict status if target already afflicted
                if (pokemonStatus) {
                  score = -300000;
                } else {
                  // Immunity checks
                  const isImmuneParalysis = (ailment === 'paralysis' && playerTypes.includes('electric')) ||
                    (ailment === 'paralysis' && moveType === 'electric' && playerTypes.includes('ground'));
                  const isImmuneBurn = ailment === 'burn' && playerTypes.includes('fire');
                  const isImmunePoison = (ailment === 'poison' || ailment === 'toxic') && (playerTypes.includes('poison') || playerTypes.includes('steel'));
                  const isImmuneSleep = (ailment === 'sleep' && playerTypes.includes('grass') && moveNameLower.includes('powder'));

                  if (isImmuneParalysis || isImmuneBurn || isImmunePoison || isImmuneSleep) {
                    score = -300000;
                  } else if (opponentHealthPercent > 30) {
                    if (ailment === 'sleep' || ailment === 'freeze') {
                      score += 48000; // Complete turn shutdown
                    } else if (ailment === 'burn' && playerAtk >= playerSpA) {
                      score += 38000; // Halve physical threat's Attack!
                    } else if (ailment === 'paralysis' && !opponentIsFaster) {
                      score += 35000; // Steal turn speed control!
                    } else if (ailment === 'poison' || ailment === 'toxic') {
                      score += 28000; // Inevitable wear down
                    } else {
                      score += 18000;
                    }
                  } else {
                    score -= 15000;
                  }
                }
              }

              // B. Competitive Stat Buffing (Stat Buffer)
              if (move.stat_changes && move.stat_changes.length > 0) {
                if (opponentHealthPercent > 45 && turnNumber < 8) {
                  let setupBonus = 0;
                  for (const change of move.stat_changes) {
                    if (change.change > 0) {
                      const statName = change.stat.name;
                      const cur = opponentStatStages[statName] || 0;
                      if (cur < 3) {
                        if ((statName === 'attack' && oppAtk >= oppSpA) || (statName === 'special-attack' && oppSpA >= oppAtk)) {
                          setupBonus += change.change * 20000; // Primary damage buff!
                        } else if (statName === 'speed' && !opponentIsFaster) {
                          setupBonus += change.change * 16000; // Speed control setup!
                        } else {
                          setupBonus += change.change * 9000;
                        }
                      }
                    } else {
                      const pCur = playerStatStages[change.stat.name] || 0;
                      if (pCur > -3 && playerSubstitute === 0) setupBonus += Math.abs(change.change) * 7000;
                    }
                  }
                  score += setupBonus;
                } else {
                  score -= 12000;
                }
              }

              // C. Critical Recovery & Healing Logic
              if (move.meta?.healing && move.meta.healing > 0 || moveNameLower.includes('recover') || moveNameLower.includes('roost') || moveNameLower.includes('soft-boiled') || moveNameLower.includes('synthesis')) {
                if (opponentHealthPercent < 55 && opponentHealthPercent > 18) {
                  score += 45000; // Vital recovery priority
                } else if (opponentHealthPercent >= 80) {
                  score = -100000; // Don't waste heal when healthy
                }
              }

              // D. Substitute Tactical Usage
              if (moveNameLower === 'substitute') {
                if (opponentSubstitute === 0 && opponentHealthPercent > 35) {
                  score += 38000; // Create protective puppet!
                } else {
                  score = -200000;
                }
              }

              // E. Protect / Stall Logic
              if (moveNameLower === 'protect' || moveNameLower === 'detect') {
                if (!opponentProtected) {
                  if (pokemonStatus === 'PSN' || pokemonStatus === 'BRN') {
                    score += 32000; // Stall to let residual status deal damage!
                  } else if (opponentHealthPercent < 25) {
                    score += 22000;
                  } else {
                    score -= 15000; // Don't spam protect randomly
                  }
                } else {
                  score = -300000; // Consecutive Protect usually fails
                }
              }

              if (moveNameLower === 'transform') {
                score += 20000;
              }
            }

            score += Math.random() * 5; // Slight tie-breaking variance

            if (score > highestScore) {
              highestScore = score;
              bestMove = move;
            }
          }

          return bestMove;
        };

        const move = chooseOptimalMove();
        
        if (move) {
          try {
            setOpponentMoves(prev => prev.map(m => m.name === move.name ? { ...m, currentPP: Math.max(0, (m.currentPP ?? m.pp) - 1) } : m));
            
            const damage = await executeMove(battleOpponent, pokemon, move, false);
            
            // We must use the latest state values here, or just let the state updates happen
            // The issue is `pokemonHP` and `opponentHP` in this closure are stale.
            // We can just rely on the state updates in `executeMove` and `applyEndOfTurnEffects`.
            // Wait, `executeMove` updates the state, but `damage` is returned.
            // We don't need to manually calculate `newPokemonHP` because `executeMove` already called `setPokemonHP`.
            // We just need to check if the battle is over.
            // Let's just set turn to player and let the battle over effect handle it.
            
            await applyEndOfTurnEffects(false);
            
            setTurnNumber(prev => prev + 1);
            setTurn('player');
          } catch (err) {
            console.error("Error during opponent move:", err);
          } finally {
            setIsAnimating(false);
            opponentTurnStartedRef.current = false;
          }
        } else {
          opponentTurnStartedRef.current = false;
        }
      }, 500);
      return () => {
        clearTimeout(timer);
        // We don't reset opponentTurnStartedRef here because the timer might have already fired,
        // and we want to prevent concurrent executions.
      };
    } else {
      opponentTurnStartedRef.current = false;
    }
  }, [turn, battleState]);

  useEffect(() => {
    setSelectedMoves([]);
    setBattleLog([]);
    setBattleState('setup');
    setIsBattling(false);
    setBattleSuggestion(null);
    setAttackerAnimation('none');
    setDefenderAnimation('none');
  }, [pokemon?.id]);

  useEffect(() => {
    // Play boot sound when app loads
    sounds.boot(); playHaptic('medium');
    
    // Check if it's the first time opening the app
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeMessage');
    if (!hasSeenWelcome) {
      setIsWelcomeOpen(true);
      localStorage.setItem('hasSeenWelcomeMessage', 'true');
    }
  }, []);

  useEffect(() => {
    const handleGlobalScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.classList) {
        target.classList.add('is-scrolling');
        if ((target as any)._scrollTimeout) {
          clearTimeout((target as any)._scrollTimeout);
        }
        (target as any)._scrollTimeout = setTimeout(() => {
          target.classList.remove('is-scrolling');
        }, 500);
      }
    };
    window.addEventListener('scroll', handleGlobalScroll, true);
    return () => {
      window.removeEventListener('scroll', handleGlobalScroll, true);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (detailsContainerRef.current) {
      detailsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  // Stop any active voices/speech synthesis when changing sections, tabs, or Pokemon
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setChatSpeakingIndex(null);
  }, [activeTab, pokemon?.id, pokemon?.name, currentVariety]);

  useEffect(() => {
    if (listMode === 'home') return;
    loadAllPokemon();
  }, [currentGenId, viewAllGenerations, listMode]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
      savedChatScrollTopRef.current = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatLoading]);

  // Instantly show the last message when opening or switching to the Pok√©thology chat tab
  useEffect(() => {
    if (activeTab === 'chat' && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      const timer = setTimeout(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const handleBattleAnalysis = async () => {
    if (isChatLoading || isAiAnalyzing) return;
    setIsAiAnalyzing(true);
    setIsChatLoading(true);
    sounds.scan(); playHaptic('light');
    
    setChatMessages(prev => [...prev, { role: 'user', text: "Requesting tactical analysis..." }]);

    try {
      const battleData = {
        player: {
          name: pokemon?.name,
          hp: pokemonHP,
          maxHp: pokemonMaxHP,
          status: pokemonStatus,
          types: pokemon?.types.map(t => t.type.name),
        },
        opponent: {
          name: battleOpponent?.name,
          hp: opponentHP,
          maxHp: opponentMaxHP,
          status: opponentStatus,
          types: battleOpponent?.types.map(t => t.type.name),
        },
        turn: turnNumber
      };

      
      const { allowed: analyzeAllowed } = checkQuotaAllowed("gemini_ai");
      if (!analyzeAllowed) {
        throw new Error("Local AI Quota Exceeded! Please reset quota or wait until tomorrow.");
      }
      recordApiUsage("gemini_ai", 1);
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept-Language": navigator.language
        },
        body: JSON.stringify({ 
          battleData,
          lang: 'en'
        }),
      });

      const responseText = await response.text();
      let data: any = {};
      try { data = JSON.parse(responseText); } catch (_) { data = { error: responseText || "Rate limit or server error", isQuotaExhausted: true }; }
      if (response.status === 429 || data.isQuotaExhausted) {
        if (data.isQuotaExhausted || data.percentRemaining === 0) {
          setQuotaLimitReached(true);
        }
        setLastQuotaError(data.error);
        if (data.analysis) {
          setIsAiTyping(true);
          setChatMessages(prev => [...prev, { role: 'model', text: data.analysis }]);
          const typingInterval = setInterval(() => {
            if (Math.random() > 0.3) sounds.typing();
          }, 150);
          setTimeout(() => {
            clearInterval(typingInterval);
            setIsAiTyping(false);
          }, Math.min(data.analysis.length * 15, 3000));
          return;
        }
      }
      if (!response.ok) throw new Error(data.error || "Connection lost to battle server.");

      setIsAiTyping(true);
      setChatMessages(prev => [...prev, { role: 'model', text: data.analysis }]);
      
      const typingInterval = setInterval(() => {
        if (Math.random() > 0.3) sounds.typing();
      }, 150);
      
      setTimeout(() => {
        clearInterval(typingInterval);
        setIsAiTyping(false);
      }, Math.min(data.analysis.length * 15, 3000));

    } catch (err: any) {
      if (err.message !== "QUOTA_LIMIT" && !err.message?.includes("Quota")) {
        console.error(err);
      }
      setChatMessages(prev => [...prev, { role: 'model', text: `‚ö†Ô∏è **SYSTEM ERROR**: ${err.message}` }]);
    } finally {
      setIsAiAnalyzing(false);
      setIsChatLoading(false);
    }
  };

  const submitChatMessage = async (msg: string) => {
    if (!msg.trim() || isChatLoading) return;

    const userMessage = msg.trim();

    // Check if device is offline
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setChatMessages(prev => [...prev, 
        { role: 'user' as const, text: userMessage },
        { 
          role: 'model' as const, 
          text: `üåê **OFFLINE MODE ACTIVE**: The live AI Chatbot requires an active internet connection to query online AI models.\n\n‚ö° **ALL OTHER FEATURES ARE 100% PLAYABLE OFFLINE**:\n- Pok√©dex Browsing & Search (IndexedDB storage)\n- Real-Time Battle Combat Simulator\n- Daily Encounters & Quizzes\n- Type Weaknesses & Move Stats`
        }
      ]);
      sounds.error();
      return;
    }

    setChatMessages(prev => [...prev, { role: 'user' as const, text: userMessage }]);
    setIsChatLoading(true);
    sounds.scan(); playHaptic('light');

    const context = {
      selectedPokemon: pokemon ? {
        name: pokemon?.name,
        types: pokemon.types.map(t => t.type.name),
        stats: pokemon.stats,
        description: pokemon.description,
        weaknesses: pokemon.weaknesses
      } : null,
      battleState: isBattling ? {
        opponent: battleOpponent?.name,
        playerHP: pokemonHP,
        opponentHP: opponentHP
      } : null
    };

    // If WebSocket is active, route all chat communications through WS
    if (wsRef.current && wsStatus === 'connected') {
      wsRef.current.send(JSON.stringify({
        type: "chat:message",
        payload: {
          messages: [...chatMessages, { role: 'user', text: userMessage }],
          context,
          lang: 'en'
        }
      }));
      return;
    }

    // Fallback REST endpoint execution
    try {
      
      const { allowed: chatAllowed } = checkQuotaAllowed("gemini_ai");
      if (!chatAllowed) {
        throw new Error("Local AI Quota Exceeded! Please reset quota or wait until tomorrow.");
      }
      recordApiUsage("gemini_ai", 1);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept-Language": navigator.language
        },
        body: JSON.stringify({ 
          messages: [...chatMessages, { role: 'user', text: userMessage }],
          context,
          lang: 'en'
        }),
      });

      const responseText = await response.text();
      let data: any = {};
      try { data = JSON.parse(responseText); } catch (_) { data = { error: responseText || "Rate limit or server error", isQuotaExhausted: true }; }
      if (response.status === 429 || data.isQuota === true || data.isQuotaExhausted) {
        if (data.isQuotaExhausted || data.percentRemaining === 0) {
          setQuotaLimitReached(true);
        }
        setLastQuotaError(data.error || "Gemini API Quota reached");
        if (data.text) {
          setIsAiTyping(true);
          const finalMsg = { role: 'model' as const, text: data.text, groundingChunks: data.groundingChunks, groundingMetadata: data.groundingMetadata };
          if (data.navigatePokemon) {
            setChatMessages([{ role: 'model', text: finalMsg.text }]);
            performSearch(data.navigatePokemon, false);
          } else {
            setChatMessages(prev => [...prev, finalMsg]);
          }
          const typingInterval = setInterval(() => {
            if (Math.random() > 0.3) sounds.typing();
          }, 150);
          setTimeout(() => {
            clearInterval(typingInterval);
            setIsAiTyping(false);
          }, Math.min(data.text.length * 15, 3000));
          sounds.success();
          return;
        }
      }
      if (!response.ok) throw new Error(data.error || "Offline");

      setIsAiTyping(true);
      const finalMsg = { role: 'model' as const, text: data.text, groundingChunks: data.groundingChunks, groundingMetadata: data.groundingMetadata };
      if (data.navigatePokemon) {
        setChatMessages([{ role: 'model', text: finalMsg.text }]);
        performSearch(data.navigatePokemon, false);
      } else {
        setChatMessages(prev => [...prev, finalMsg]);
      }
      
      const typingInterval = setInterval(() => {
        if (Math.random() > 0.3) sounds.typing();
      }, 150);
      
      setTimeout(() => {
        clearInterval(typingInterval);
        setIsAiTyping(false);
      }, Math.min(data.text.length * 15, 3000));

      sounds.success();
    } catch (err: any) {
      if (!err.message?.includes("OVERLOAD")) {
        console.error(err);
      }
      const errorMessage = err.message === "Offline" ? "CONNECTION INTERRUPTED. System reset required." : 
                           err.message.includes("OVERLOAD") ? err.message :
                           `SYSTEM ERROR: ${err.message}`;
      setChatMessages(prev => [...prev, { role: 'model' as const, text: errorMessage }]);
      sounds.error();
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    const msg = chatInput;
    setChatInput('');
    await submitChatMessage(msg);
  };

  const loadAllPokemon = useCallback(async (overrideGenId?: number, overrideViewAll?: boolean) => {
    sounds.scan(); playHaptic('light');
    setListMode('pokemon');
    
    setLoadingList(true);
    try {
      const isAll = overrideViewAll !== undefined ? overrideViewAll : viewAllGenerations;
      const genId = overrideGenId !== undefined ? overrideGenId : currentGenId;
      
      const gen = isAll 
        ? { start: 1, end: 1025 } 
        : (GENERATIONS.find(g => g.id === genId) || GENERATIONS[0]);
      const list = await getPokemonList(gen.start, gen.end);
      setFilteredList(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  }, [viewAllGenerations, currentGenId]);

  const loadTypePokemon = useCallback(async (type: string, overrideGenId?: number, overrideViewAll?: boolean) => {
    sounds.scan(); playHaptic('light');
    setListMode('pokemon');
    
    setLoadingList(true);
    try {
      const isAll = overrideViewAll !== undefined ? overrideViewAll : viewAllGenerations;
      const genId = overrideGenId !== undefined ? overrideGenId : currentGenId;

      const gen = isAll 
        ? { start: 1, end: 1025 } 
        : (GENERATIONS.find(g => g.id === genId) || GENERATIONS[0]);
      const list = await getPokemonByType(type, gen.start, gen.end);
      setFilteredList(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  }, [viewAllGenerations, currentGenId]);

  const performSearch = useCallback(async (searchQuery: string, fromChat: boolean = false, targetTab?: 'data' | 'chat' | 'battle') => {
    const formatted = searchQuery.trim().toLowerCase();
    if (!formatted) return;

    setLastSearched(formatted);
    sounds.scan(); playHaptic('light');
    setLoadingPokemon(true);
    setError(null);
    // REMOVED: setPokemon(null); to prevent jarring layout teardown
    setCurrentVariety(null);
    setQuery(searchQuery);
    setInputValue(searchQuery);

    try {
      // Fetch PokeAPI data
      const pokeData = await searchPokemon(searchQuery);
      setPokemon(pokeData);
      basePlayerPokemonRef.current = pokeData;
      setScanHistory(prev => {
        const filtered = prev.filter(p => p.name.toLowerCase() !== pokeData.name.toLowerCase());
        const displayId = pokeData.id;
        const types = pokeData.types?.map((t: any) => t.type.name) || [];
        const bst = pokeData.stats?.reduce((sum: number, stat: any) => sum + stat.base_stat, 0) || 0;
        const newHistory = [{ name: pokeData.name, id: displayId, types, bst }, ...filtered].slice(0, 10);
        return newHistory;
      });
      setAttackerAnimation('none');
      setLoadingPokemon(false);
      
      // Scroll to top of details container and browser
      if (detailsContainerRef.current) {
        detailsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (!fromChat) {
        // Reset chat messages to remove precedent messages and show directly the typical chatbot welcome message
        setChatMessages([{ 
          role: 'model' as const, 
          text: getChatWelcomeMessage(pokeData.name)
        }]);
      }
      setActiveTab(targetTab || 'data');
      
      setBattleOpponent(null);
      setIsBattling(false);
      setBattleLog([]);
      setBattleState('setup');
      setTurnNumber(1);
      
      setIsShiny(false);
      setIsFemale(false);
      sounds.success();
      setAiSuggestion(null);
      
      // Auto-generate AI suggestion with cache and quota check
      if (suggestTimeoutRef.current) clearTimeout(suggestTimeoutRef.current);

      if (aiCache.current[pokeData.name]) {
        setAiSuggestion(aiCache.current[pokeData.name]);
      } else if (!quotaLimitReached && autoAiEnabled) {
        // Use a small delay before fetching auto-suggestion to avoid spam during rapid browsing
        suggestTimeoutRef.current = setTimeout(() => {
          fetch("/api/suggest", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept-Language": navigator.language
            },
            body: JSON.stringify({ 
              pokemonName: pokeData.name,
              lang: 'en'
            }),
          })
          .then(async res => {
            const resText = await res.text();
            let data: any = {};
            try { data = JSON.parse(resText); } catch (_) { data = { error: resText || "Rate limit or server error", isQuotaExhausted: true }; }
            if (res.status === 429 || data.isQuotaExhausted) {
               if (data.isQuotaExhausted || data.percentRemaining === 0) {
                 setQuotaLimitReached(true);
               }
               setLastQuotaError(data.error);
               if (data.suggestion) {
                 aiCache.current[pokeData.name] = data.suggestion;
                 setAiSuggestion(data.suggestion);
                 return;
               }
               throw new Error("QUOTA");
            }
            if (!res.ok) throw new Error(data.error || "Failed");
            if (data.suggestion) {
              aiCache.current[pokeData.name] = data.suggestion;
              setAiSuggestion(data.suggestion);
            }
          })
          .catch(err => {
            if (err.message !== "QUOTA_LIMIT" && err.message !== "QUOTA") {
              console.error("Suggestion failed", err);
            }
            if (err.message !== "QUOTA") setAiSuggestion(null);
          });
        }, 1200);
      }

      if (pokeData.cries?.latest && !fromChat) {
        setTimeout(() => sounds.playCry(pokeData.name, pokeData.cries?.latest, pokeData.name.includes('-gmax')), 400);
      }
      
      // If we are on home, switch to pokemon list mode to show the context
      setListMode(prev => prev === 'home' ? 'pokemon' : prev);
    } catch (err: any) {
      sounds.error();
      setError(`Error: ${err.message || 'An error occurred'}${err.stack ? `\n\n${err.stack}` : ''}`);
      setPokemon(null);
      setLastSearched('');
    } finally {
      setLoadingPokemon(false);
    }
  }, []);

  const sortedAndFilteredList = useMemo(() => {
    let list = listMode === 'favorites' ? [...favorites] : [...filteredList];
    
    // Search filtering
    if (debouncedQuery.trim()) {
      const search = debouncedQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.url.split('/').filter(Boolean).pop()?.includes(search)
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'id') {
        const idA = a.displayId || parseInt(a.url.split('/').filter(Boolean).pop() || '0', 10);
        const idB = b.displayId || parseInt(b.url.split('/').filter(Boolean).pop() || '0', 10);
        if (idA === idB) {
          // If they share the same base ID, base form comes first
          if (!a.isForm && b.isForm) return -1;
          if (a.isForm && !b.isForm) return 1;
          return a.name.localeCompare(b.name);
        }
        return sortOrder === 'asc' ? idA - idB : idB - idA;
      } else {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
    });

    return list;
  }, [filteredList, sortBy, sortOrder, debouncedQuery, listMode, favorites]);

  const isSelectingOpponentRef = useRef(isSelectingOpponent);
  useEffect(() => {
    isSelectingOpponentRef.current = isSelectingOpponent;
  }, [isSelectingOpponent]);

  const handlePokemonClick = useCallback(async (name: string) => {
    if (isSelectingOpponentRef.current) {
      sounds.scan(); playHaptic('light');
      try {
        const opp = await searchPokemon(name);
        setBattleOpponent(opp);
        setOpponentMoves(generateCompetitiveMoveset(opp, [], pokemon));
        setIsOpponentShiny(false);
        setDefenderAnimation('none');
        setIsSelectingOpponent(false);
        setQuery('');
        setInputValue('');
        handleTabChange('battle');
        sounds.success();
      } catch (err) {
        console.error("Failed to select opponent:", err);
        sounds.error();
      }
      return;
    }
    if (inspectingOpponent) {
      sounds.scan(); playHaptic('light');
      try {
        setLoadingPokemon(true);
        const opp = await searchPokemon(name);
        setBattleOpponent(opp);
        setOpponentMoves(generateCompetitiveMoveset(opp, [], pokemon));
        setIsOpponentShiny(false);
      } catch (err) {
        console.error("Failed to inspect opponent:", err);
      } finally {
        setLoadingPokemon(false);
      }
      return;
    }
    performSearch(name);
  }, [performSearch, inspectingOpponent]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSelectingOpponent) return;
    
    const formatted = inputValue.trim().toLowerCase();
    if (formatted && formatted !== lastSearched) {
      if (inspectingOpponent) {
        setLoadingPokemon(true);
        try {
          const opp = await searchPokemon(formatted);
          setBattleOpponent(opp);
          setIsOpponentShiny(false);
        } catch (err) {
          console.error("Failed to search opponent:", err);
        } finally {
          setLoadingPokemon(false);
        }
      } else {
        performSearch(inputValue);
      }
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    startTransition(() => {
      setQuery(val);
    });
    
    if (val.trim()) {
      const q = val.toLowerCase().trim();
      const matches = allPokemonRef.current.filter(p => p.includes(q)).slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    sounds.typing();
  };

  const isStandard1025Pokemon = useCallback((p: any): boolean => {
    if (!p) return false;
    const idNum = typeof p.baseId === 'number' ? p.baseId : (typeof p.id === 'number' ? p.id : parseInt(p.id, 10));
    if (!idNum || isNaN(idNum) || idNum < 1 || idNum > 1025) return false;
    const name = (p.name || '').toLowerCase();
    if (
      name.includes('-mega') || 
      name.includes('-gmax') || 
      name.includes('-alola') || 
      name.includes('-galar') || 
      name.includes('-hisui') || 
      name.includes('-paldea') ||
      name.includes('-totem') ||
      name.includes('-primal') ||
      name.includes('-origin') ||
      name.includes('-therian') ||
      name.includes('-crowned') ||
      name.includes('-eternamax')
    ) {
      return false;
    }
    return true;
  }, []);

  const handleClear = () => {
    setQuery('');
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    setDebouncedQuery('');
    setLastSearched('');
    setError(null);
    
    if (isSelectingOpponent) {
      sounds.scan(); playHaptic('light');
      return;
    }
    
    setPokemon(null);
    setListMode('pokemon');
    setActiveTab('data');
    setIsShiny(false);
    setIsCardView(false);
    setIsFemale(false);
    setIsOpponentShiny(false);
    setIsOpponentFemale(false);
    sounds.boot(); playHaptic('medium');
  };

  useEffect(() => {
    setDisplayLimit(50);
  }, [filteredList, query, sortBy, sortOrder]);

  return (
    <ErrorBoundary>
      <NowPlayingToast />
      <Suspense fallback={null}>
        <div className={cn(
      "w-full h-screen h-[100dvh] flex items-stretch justify-center transition-colors duration-300 ease-out bg-slate-950 relative overflow-hidden overflow-x-hidden",
      "bg-[linear-gradient(to_right,rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:48px_48px]",
      isLightMode && "light bg-slate-50 bg-[linear-gradient(to_right,rgba(15,23,42,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.015)_1px,transparent_1px)]"
    )}>


      {/* System Reboot Overlay */}
      <AnimatePresence>
        {isRebooting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0  z-[200] bg-black flex flex-col items-center justify-center gap-6"
          >
            <div className="relative">
              <motion.div 
                className="w-24 h-24 border-2 border-red-500/30 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-0 border-t-2 border-red-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <PokeballIcon className="w-8 h-8 text-red-500 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-red-400 font-hud text-xl font-bold tracking-[0.3em] uppercase">Pok√©dex Syncing</h2>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i}
                    className="w-2 h-2 bg-red-500"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 h-1 bg-slate-900 overflow-hidden rounded-full">
              <motion.div 
                className="h-full bg-red-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        
      {/* Tab Change Black Vision Overlay */}
      <AnimatePresence>
        {isTabTransitioning && (
          <motion.div
            key="tab-transition-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="fixed inset-0  z-[240] bg-slate-950/40 backdrop-blur-sm pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* VS Screen Matchup Transition Overlay */}
      <AnimatePresence>
        {showVSScreen && pokemon && battleOpponent && (
          <motion.div
            key="vs-screen-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)", transition: { duration: 0.4, ease: "easeInOut" } }}
            className="fixed inset-0  z-[250] flex flex-col items-center justify-center overflow-hidden bg-slate-950/95 backdrop-blur-md select-none p-2 xs:p-4 sm:p-8 cursor-default pointer-events-auto"
          >
            {/* Background Ambient Glows & Slashed Effect */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-cyan-500/15 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-red-500/15 rounded-full blur-3xl" />
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] sm:[background-size:24px_24px]" />
            </div>

            {/* Main Content Container - Fitted for Mobile & Desktop */}
            <motion.div 
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full max-w-5xl flex items-center justify-between gap-1 xs:gap-2 sm:gap-6 px-1 xs:px-2 sm:px-8 z-20 my-auto"
            >
              {/* Player Pokemon (Left Side) */}
              <motion.div
                initial={{ x: -120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 120, delay: 0.08 }}
                className="flex flex-col items-center gap-2 sm:gap-4 relative flex-1 basis-0 min-w-0"
              >
                <div className="px-2.5 xs:px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-[9px] sm:text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  USER
                </div>

                <div className="w-28 h-28 xs:w-36 xs:h-36 sm:w-60 sm:h-60 relative flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-cyan-500/15 rounded-full blur-2xl animate-pulse" />
                  <img 
                    src={(isShiny ? (pokemon?.sprites?.other?.home?.front_shiny || pokemon?.sprites?.other?.['official-artwork']?.front_shiny) : (pokemon?.sprites?.other?.home?.front_default || pokemon?.sprites?.other?.['official-artwork']?.front_default)) || pokemon?.sprites?.other?.home?.front_default || pokemon?.sprites?.other?.['official-artwork']?.front_default || pokemon?.sprites?.front_default || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'} 
                    alt={pokemon?.name} 
                    className={cn("max-w-full max-h-full object-contain scale-x-[-1] filter drop-shadow-[0_8px_20px_rgba(6,182,212,0.5)] relative z-10 transition-transform hover:scale-105", playerAnimMode === 'hit' && "animate-hit", playerAnimMode === 'boost' && "animate-stat-boost", playerAnimMode === 'drop' && "animate-stat-drop")} 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const fallback = pokemon?.sprites?.other?.home?.front_default || pokemon?.sprites?.other?.['official-artwork']?.front_default || pokemon?.sprites?.front_default;
                      if (fallback && e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      } else {
                        e.currentTarget.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                      }
                    }}
                  />
                </div>

                <div className="bg-slate-950/90 border-2 border-cyan-400/80 px-2.5 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl z-20 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex flex-col items-center gap-1 w-full max-w-[130px] xs:max-w-[160px] sm:max-w-[280px] md:max-w-[340px] text-center backdrop-blur-md">
                  <span className="font-hud uppercase text-cyan-100 tracking-[0.08em] sm:tracking-[0.14em] text-xs xs:text-sm sm:text-xl md:text-2xl font-black drop-shadow-[0_0_10px_rgba(34,211,238,0.6)] w-full break-words leading-tight">
                    {pokemon?.name?.replace(/-/g, ' ')}
                  </span>
                  <div className="flex gap-1 flex-wrap justify-center">
                    {pokemon.types.map((t: any, idx: number) => (
                      <TypeBadge key={`${t.type?.name || 'type'}-${idx}`} type={t.type.name} label={t.type.localized_name || t.type.name} size="xs" />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Central VS Badge */}
              <motion.div
                initial={{ scale: 2.5, rotate: -180, opacity: 0 }}
                animate={{ scale: [2.5, 0.85, 1.1, 1], rotate: [180, -12, 6, 0], opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], times: [0, 0.6, 0.85, 1] }}
                className="z-30 flex flex-col items-center justify-center shrink-0 pointer-events-none mx-1 sm:mx-4"
              >
                <div className="relative flex flex-col items-center justify-center text-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute -inset-3 xs:-inset-5 sm:-inset-8 rounded-full border-2 border-dashed border-amber-400/40 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-red-500/40 to-cyan-500/30 blur-xl rounded-full scale-150 animate-pulse" />
                  <h1 className="text-4xl xs:text-5xl sm:text-8xl md:text-9xl font-black font-hud tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-400 to-red-600 drop-shadow-[0_0_35px_rgba(245,158,11,0.95)] select-none px-2 flex items-center justify-center leading-none text-center" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.8)' }}>
                    VS
                  </h1>
                </div>
              </motion.div>

              {/* Opponent Pokemon (Right Side) */}
              <motion.div
                initial={{ x: 120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 120, delay: 0.12 }}
                className="flex flex-col items-center gap-2 sm:gap-4 relative flex-1 basis-0 min-w-0"
              >
                <div className="px-2.5 xs:px-3.5 py-1 rounded-full bg-red-500/20 border border-red-400/50 text-[9px] sm:text-[10px] font-mono text-red-300 font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  OPPONENT
                </div>

                <div className="w-28 h-28 xs:w-36 xs:h-36 sm:w-60 sm:h-60 relative flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-red-500/15 rounded-full blur-2xl animate-pulse" />
                  <img 
                    src={(isOpponentShiny ? (battleOpponent?.sprites?.other?.home?.front_shiny || battleOpponent?.sprites?.other?.['official-artwork']?.front_shiny) : (battleOpponent?.sprites?.other?.home?.front_default || battleOpponent?.sprites?.other?.['official-artwork']?.front_default)) || battleOpponent?.sprites?.other?.home?.front_default || battleOpponent?.sprites?.other?.['official-artwork']?.front_default || battleOpponent?.sprites?.front_default || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'} 
                    alt={battleOpponent?.name} 
                    className={cn("max-w-full max-h-full object-contain filter drop-shadow-[0_8px_20px_rgba(239,68,68,0.5)] relative z-10 transition-transform hover:scale-105", opponentAnimMode === 'hit' && "animate-hit", opponentAnimMode === 'boost' && "animate-stat-boost", opponentAnimMode === 'drop' && "animate-stat-drop")} 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const fallback = battleOpponent?.sprites?.other?.home?.front_default || battleOpponent?.sprites?.other?.['official-artwork']?.front_default || battleOpponent?.sprites?.front_default;
                      if (fallback && e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      } else {
                        e.currentTarget.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                      }
                    }}
                  />
                </div>

                <div className="bg-slate-950/90 border-2 border-red-500/80 px-2.5 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl z-20 shadow-[0_0_20px_rgba(239,68,68,0.3)] flex flex-col items-center gap-1 w-full max-w-[130px] xs:max-w-[160px] sm:max-w-[280px] md:max-w-[340px] text-center backdrop-blur-md">
                  <span className="font-hud uppercase text-red-100 tracking-[0.08em] sm:tracking-[0.14em] text-xs xs:text-sm sm:text-xl md:text-2xl font-black drop-shadow-[0_0_10px_rgba(239,68,68,0.6)] w-full break-words leading-tight">
                    {battleOpponent?.name?.replace(/-/g, ' ')}
                  </span>
                  <div className="flex gap-1 flex-wrap justify-center">
                    {battleOpponent.types.map((t: any, idx: number) => (
                      <TypeBadge key={`${t.type?.name || 'type'}-${idx}`} type={t.type.name} label={t.type.localized_name || t.type.name} size="xs" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Bottom Status Indicator */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-6 sm:bottom-10 z-30 flex flex-col items-center gap-2 pointer-events-none"
            >
              <div className="px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-[10px] sm:text-xs font-mono text-cyan-300 uppercase tracking-widest shadow-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                START SIMULATION
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn(
        "w-full h-full overflow-hidden overflow-x-hidden flex flex-col relative z-10 transition-all duration-300",
        isLightMode 
          ? "bg-slate-50 text-slate-800 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-50/70 via-slate-50 to-slate-100" 
          : "bg-slate-950 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"
      )}>
        
        {/* Single Panel Layout */}
        <div className="flex-1 flex flex-col relative overflow-hidden overflow-x-hidden bg-transparent w-full">
          {/* Compact Top Bar with Integrated Search */}
          <div className="bg-slate-900/60 border-b border-slate-800/60 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md z-40 relative overflow-x-hidden w-full flex justify-center">
            <div className="w-full max-w-[1920px] px-2 lg:px-4 xl:px-6 flex items-center justify-between gap-3 sm:gap-4 py-2 sm:py-3">
            <AnimatePresence>
              <motion.form 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSearch} 
                className="flex-1 flex gap-1 sm:gap-2 max-w-4xl"
              >
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="relative flex-1 group"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleTyping}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                    placeholder="SEARCH POK√âMON..."
                    aria-label="Search Pokemon"
                    className={cn(
                      "w-full border-2 rounded-lg py-2.5 px-10 sm:px-14 focus:outline-none transition-all font-hud text-[11px] sm:text-sm uppercase tracking-[0.2em]",
                      isLightMode
                        ? "bg-white border-slate-300 text-slate-800 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 shadow-sm placeholder:text-slate-400"
                        : "bg-slate-950/95 border-cyan-500/30 text-cyan-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,0.15)] placeholder:text-cyan-600/40"
                    )}
                  />
                  <motion.div animate={{ rotate: inputValue ? 360 : 0 }} transition={{ duration: 1, ease: "anticipate" }} className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Search className={cn("w-4 h-4 sm:w-5 sm:h-5 transition-colors", isLightMode ? "text-slate-400 group-focus-within:text-cyan-650" : "text-cyan-600 group-focus-within:text-cyan-400")} />
                  </motion.div>
                  <AnimatePresence>
                    {inputValue && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={handleClear}
                        className={cn("absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 mt-[1px] transition-colors z-10", isLightMode ? "text-slate-400 hover:text-red-500" : "text-cyan-600 hover:text-red-400")}
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>
                    )}
        </AnimatePresence>
                </motion.div>
              </motion.form>
        </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(250,204,21,0.35)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsFavoritesModalOpen(true);
                sounds.hover();
              }}
              className={cn(
                "px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-all shrink-0 flex items-center justify-center gap-1.5 sm:gap-2 border-2 text-[10px] uppercase font-hud font-extrabold tracking-widest leading-none outline-none ml-auto relative overflow-hidden group cursor-pointer",
                isFavoritesModalOpen || listMode === 'favorites'
                   ? "text-yellow-300 bg-yellow-950/60 border-yellow-400 shadow-[0_0_16px_rgba(250,204,21,0.4)]"
                   : "text-yellow-400 border-yellow-500/40 hover:text-white hover:border-yellow-400 bg-slate-900/60 shadow-[0_0_12px_rgba(250,204,21,0.2)]"
              )}
              title="Favorites Vault (Full Screen)"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/25 to-transparent pointer-events-none z-10 animate-scan-shimmer" />
              <motion.div 
                 animate={isFavoritesModalOpen || listMode === 'favorites' ? { rotate: [0, 15, -15, 0] } : {}}
                 whileHover={{ scale: 1.2, rotate: [0, -15, 15, 0] }}
                 transition={{ duration: 0.4 }}
                 className="relative z-10"
              >
                <Star className={cn("w-4 h-4 filter drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]", isFavoritesModalOpen || listMode === 'favorites' ? "text-yellow-300 animate-pulse fill-yellow-300" : "text-yellow-400 fill-yellow-400")} />
              </motion.div>
              <span className="hidden sm:inline font-hud tracking-[0.1em] relative z-10 font-black">{'Favs'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34,211,238,0.35)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsDailyHubOpen(prev => !prev);
                sounds.hover();
              }}
              className={cn(
                "px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-all shrink-0 flex items-center justify-center gap-1.5 sm:gap-2 border-2 text-[10px] uppercase font-hud font-extrabold tracking-widest leading-none outline-none ml-auto relative overflow-hidden group cursor-pointer",
                isDailyHubOpen 
                  ? "text-cyan-300 bg-cyan-950/60 border-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.4)]" 
                  : "text-cyan-400 border-cyan-500/40 hover:text-white hover:border-cyan-400 bg-slate-900/60 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
              )}
              title="Toggle Daily Core panel"
            >
              {/* Scan Ready Shimmer Light Sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent pointer-events-none z-10 animate-scan-shimmer" />
              <motion.div
                 animate={isDailyHubOpen ? { rotate: [0, 15, -15, 0] } : {}}
                 whileHover={{ scale: 1.2, rotate: [0, -15, 15, 0] }}
                 transition={{ duration: 0.4 }}
                 className="relative z-10"
              >
                <Trophy className={cn("w-4 h-4 filter drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]", isDailyHubOpen ? "text-cyan-300 animate-pulse" : "text-cyan-400")} />
              </motion.div>
              <span className="hidden sm:inline font-hud tracking-[0.1em] relative z-10 font-black">{'Daily Hub'}</span>
            </motion.button>



             

            
             

            {!isOnline && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsOfflineManagerOpen(true);
                  sounds.hover();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/60 text-amber-300 text-[9px] font-hud uppercase tracking-wider cursor-pointer hover:bg-amber-900 transition-all shadow-[0_0_10px_rgba(245,158,11,0.3)] shrink-0"
                title="Offline Mode Active - Pok√©dex, Battles & Games 100% playable offline"
              >
                <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden sm:inline font-bold">Offline Ready</span>
              </motion.button>
            )}

            <motion.button
               whileHover={{ scale: 1.1, rotate: 90 }}
               whileTap={{ scale: 0.95 }}
               transition={{ duration: 0.4 }}
               onClick={() => setIsSettingsOpen(true)}
               className={cn(
                 "p-2 shrink-0 transition-colors",
                 isLightMode ? "text-slate-700 hover:text-slate-900" : "text-white hover:text-cyan-300"
               )}
               title="Settings"
             >
               <Settings className="w-5 h-5" />
             </motion.button>
            </div>
          </div>

          {/* Main App Container */}
          <div className="flex-1 flex flex-col relative overflow-hidden">
              <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
                <AnimatePresence mode="wait">
                    {(loadingPokemon && !pokemon && !isSelectingOpponent) ? (
                      <PokethologyRadarScanner
                        targetName={query || "Database"}
                        onAbort={handleAbort}
                      />
                    ) : error ? (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center text-red-500 p-6 bg-red-950/50 rounded-xl border border-red-900 font-hud text-xs uppercase tracking-[0.2em]"
                      >
                        <p className="font-bold text-red-500" style={{ textShadow: '0 0 8px rgba(239,68,68,0.8)' }}>ERROR: {error}</p>
                      </motion.div>
                    ) : (pokemon && !isSelectingOpponent) ? (
                      ((originalPokemon, originalIsShiny, originalIsFemale, originalPerformSearch, originalSetIsShiny, originalSetIsFemale) => {
                        const pokemon = (inspectingOpponent && battleOpponent) ? battleOpponent : originalPokemon;
                        const isShiny = (inspectingOpponent && battleOpponent) ? isOpponentShiny : originalIsShiny;
                        const isFemale = (inspectingOpponent && battleOpponent) ? isOpponentFemale : originalIsFemale;

                        const performSearch = async (name: string) => {
                          if (inspectingOpponent) {
                            setLoadingPokemon(true);
                            try {
                              const opp = await searchPokemon(name);
                              setBattleOpponent(opp);
                            } catch (e) {
                              console.error(e);
                            } finally {
                              setLoadingPokemon(false);
                            }
                          } else {
                            originalPerformSearch(name);
                          }
                        };

                        const setIsShiny = (val: any) => {
                          if (inspectingOpponent) {
                            setIsOpponentShiny(val);
                          } else {
                            originalSetIsShiny(val);
                          }
                        };

                        const setIsFemale = (val: any) => {
                          if (inspectingOpponent) {
                            setIsOpponentFemale(val);
                          } else {
                            originalSetIsFemale(val);
                          }
                        };

                        return (
                          <motion.div
                            key={pokemon.name + '-' + (inspectingOpponent ? 'opp' : 'player')}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="flex-1 bg-transparent relative overflow-hidden flex flex-col p-1 sm:p-2 w-full max-w-[1920px] mx-auto lg:px-4 xl:px-6"
                          >
                        {loadingPokemon && (
                           <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-950/80 border border-cyan-500/50 rounded-full px-4 py-2 z-[100] flex items-center gap-3 pointer-events-auto backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                               <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                               <span className="font-hud text-[10px] text-cyan-400 animate-pulse tracking-widest uppercase">
                                 {activeTab === 'battle' || isSelectingOpponent ? 'SEARCHING OPPONENT...' : (query ? `Fetching ${query}...` : 'Fetching Data...')}
                               </span>
                           </div>
                        )}
                        <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none"></div>
                        
                        <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
                          {/* Top Bar */}
                          <div className="flex justify-between items-center mb-3 mt-3 sm:mt-4 px-1 shrink-0 z-10 relative">
                            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAvatarModalOpen(true);
                                  try { sounds.boot(); } catch(e) {}
                                }}
                                className="relative flex items-center justify-center shrink-0 group hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                                title="Change Trainer Avatar"
                              >
                                <img 
                                  src={`https://play.pokemonshowdown.com/sprites/trainers/${currentAvatar.id}.png`} 
                                  alt={currentAvatar.name}
                                  className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain [image-rendering:pixelated] drop-shadow-[0_3px_10px_rgba(34,211,238,0.35)] shrink-0"
                                />
                              </button>
                              <div className="flex flex-col min-w-0">
                                <span className="font-hud font-black text-sm xs:text-base sm:text-lg text-cyan-300 uppercase tracking-widest truncate leading-tight drop-shadow">
                                  {currentAvatar.name}
                                </span>
                                <span className="text-[9px] xs:text-[10px] sm:text-xs font-mono text-cyan-400/80 tracking-wider uppercase leading-none mt-0.5">
                                  {currentAvatar.role}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button 
                                onClick={() => {
                                  setPokemon(null);
                                  setBattleOpponent(null);
                                  resetSimulation();
                                  setListMode('home');
                                  setArenaArtworkMode('home');
                                  try { localStorage.setItem('pokethology_arena_artwork_mode', 'home'); } catch(_) {}
                                  sounds.scan(); playHaptic('light');
                                }}
                                className={cn(hudButtonClass(false, 'cyan'), "!py-1 !px-3 !text-[10px] font-bold tracking-wider flex items-center gap-1 cursor-pointer")}
                              >
                                <ChevronLeft className="w-3 h-3" />
                                Back to List
                              </button>
                            </div>
                          </div>

                          {/* Tabs for Stats, AI & Battle - Premium segment-style HUD button bar with Daily Hub shimmer effects */}
                          <div className="w-full grid grid-cols-3 gap-1.5 sm:gap-2.5 mb-4 shrink-0 pt-1 py-1 px-0.5 sm:px-1 z-30 select-none">
                            {/* Stats Section Button */}
                            <motion.button
                              type="button"
                              onClick={() => {
                                if (activeTab === 'data') {
                                  slideSection('data');
                                } else {
                                  handleTabChange('data');
                                }
                              }}
                              whileHover={{ scale: 1.03, boxShadow: activeTab === 'data' ? "0 0 22px rgba(6,182,212,0.35)" : "0 0 16px rgba(6,182,212,0.2)" }}
                              whileTap={{ scale: 0.97 }}
                              className={cn(
                                hudButtonClass(activeTab === 'data', 'cyan'),
                                "w-full text-center !px-1 sm:!px-2 py-2.5 sm:py-3 text-[9.5px] min-[330px]:text-[10.5px] sm:text-xs font-hud font-black !rounded-xl relative flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer !tracking-normal sm:!tracking-wider overflow-hidden shadow-[0_0_14px_rgba(6,182,212,0.15)] border-cyan-500/40 group/data"
                              )}
                            >
                              {/* Scan Ready Shimmer Light Sweep */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent pointer-events-none z-10 animate-scan-shimmer" />
                              
                              {activeTab === 'data' && (
                                <motion.div
                                  layoutId="activeTabPill"
                                  className="absolute inset-0 bg-cyan-500/20 border border-cyan-400/40 rounded-xl pointer-events-none"
                                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                              )}
                              
                              <div className="relative z-10 shrink-0">
                                <Info className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 filter drop-shadow-[0_0_6px_rgba(6,182,212,0.85)]", activeTab === 'data' ? "text-slate-950 font-black" : "text-cyan-400")} />
                              </div>
                              <span className="whitespace-nowrap relative z-10 uppercase">Stats</span>
                            </motion.button>

                            {/* Pok√©thology Section Button */}
                            <motion.button
                              type="button"
                              onClick={() => {
                                if (activeTab === 'chat') {
                                  slideSection('chat');
                                } else {
                                  handleTabChange('chat');
                                }
                              }}
                              whileHover={{ scale: 1.03, boxShadow: activeTab === 'chat' ? "0 0 22px rgba(220,161,29,0.45)" : "0 0 16px rgba(220,161,29,0.25)" }}
                              whileTap={{ scale: 0.97 }}
                              className={cn(
                                hudButtonClass(activeTab === 'chat', 'mustard'),
                                "w-full text-center !px-0.5 xxs:!px-1 sm:!px-2 py-2.5 sm:py-3 text-[8.5px] min-[330px]:text-[9.5px] min-[380px]:text-[10.5px] sm:text-xs font-hud font-black !rounded-xl relative flex items-center justify-center gap-0.5 xxs:gap-1 sm:gap-1.5 cursor-pointer !tracking-tight xxs:!tracking-normal sm:!tracking-wider overflow-hidden shadow-[0_0_14px_rgba(220,161,29,0.2)] border-[#dca11d]/50 group/chat"
                              )}
                            >
                              {/* Scan Ready Shimmer Light Sweep */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent pointer-events-none z-10 animate-scan-shimmer" />
                              
                              {activeTab === 'chat' && (
                                <motion.div
                                  layoutId="activeTabPill"
                                  className="absolute inset-0 bg-amber-500/25 border border-yellow-400/50 rounded-xl pointer-events-none"
                                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                              )}
                              
                              <div className="relative z-10 shrink-0">
                                <User className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 filter drop-shadow-[0_0_6px_rgba(220,161,29,0.85)]", activeTab === 'chat' ? "text-slate-950 font-black" : "text-[#dca11d]")} />
                              </div>
                              <span className={cn("whitespace-nowrap relative z-10 uppercase text-center", activeTab === 'chat' ? "text-slate-950 font-black" : "text-[#dca11d]")}>Pok√©thology</span>
                            </motion.button>

                            {/* Combat Section Button */}
                            <motion.button
                              type="button"
                              onClick={() => {
                                if (activeTab === 'battle') {
                                  slideSection('battle');
                                } else {
                                  handleTabChange('battle');
                                }
                              }}
                              whileHover={{ scale: 1.03, boxShadow: activeTab === 'battle' ? "0 0 22px rgba(239,68,68,0.35)" : "0 0 16px rgba(239,68,68,0.2)" }}
                              whileTap={{ scale: 0.97 }}
                              className={cn(
                                hudButtonClass(activeTab === 'battle', 'red'),
                                "w-full text-center !px-1 sm:!px-2 py-2.5 sm:py-3 text-[9.5px] min-[330px]:text-[10.5px] sm:text-xs font-hud font-black !rounded-xl relative flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer !tracking-normal sm:!tracking-wider overflow-hidden shadow-[0_0_14px_rgba(239,68,68,0.15)] border-red-500/40 group/battle"
                              )}
                            >
                              {/* Scan Ready Shimmer Light Sweep */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-300/25 to-transparent pointer-events-none z-10 animate-scan-shimmer" />
                              
                              {activeTab === 'battle' && (
                                <motion.div
                                  layoutId="activeTabPill"
                                  className="absolute inset-0 bg-red-500/20 border border-red-400/40 rounded-xl pointer-events-none"
                                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                              )}
                              
                              <div className="relative z-10 shrink-0">
                                <Swords className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 filter drop-shadow-[0_0_6px_rgba(239,68,68,0.85)]", activeTab === 'battle' ? "text-white font-black" : "text-red-400")} />
                              </div>
                              <span className="whitespace-nowrap relative z-10 uppercase">Combat</span>
                            </motion.button>
                          </div>

                          {battleOpponent && activeTab === 'data' && (
                            <div className="flex gap-2 p-1.5 bg-slate-950/50 border border-white/5 rounded-xl mb-4 shrink-0 select-none items-center justify-between">
                              <span className="text-[7.5px] font-hud text-slate-500 uppercase tracking-widest pl-2">ACTIVE TARGET INSPECTION:</span>
                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setInspectingOpponent(false);
                                    sounds.scan(); playHaptic('light');
                                  }}
                                  className={cn(
                                    "px-3 py-1.5 rounded-lg font-hud text-[8px] sm:text-[9px] font-black tracking-wider uppercase transition-all cursor-pointer relative",
                                    !inspectingOpponent 
                                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]" 
                                      : "text-slate-400 hover:text-cyan-400 border border-transparent"
                                  )}
                                >
                                  PLAYER ({originalPokemon?.name?.toUpperCase()})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setInspectingOpponent(true);
                                    sounds.scan(); playHaptic('light');
                                  }}
                                  className={cn(
                                    "px-3 py-1.5 rounded-lg font-hud text-[8px] sm:text-[9px] font-black tracking-wider uppercase transition-all cursor-pointer relative",
                                    inspectingOpponent 
                                      ? "bg-red-500/20 text-red-300 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
                                      : "text-slate-400 hover:text-red-400 border border-transparent"
                                  )}
                                >
                                  OPPONENT ({battleOpponent?.name?.toUpperCase()})
                                </button>
                              </div>
                            </div>
                          )}

                          <div className={cn(
                            "flex-1 flex flex-col lg:flex-row lg:gap-6 min-h-0 h-full custom-scrollbar optimize-scrolling",
                            activeTab === 'chat' ? "overflow-hidden items-stretch pb-0 lg:pb-0" : "overflow-y-auto lg:items-start pb-8 sm:pb-12"
                          )} 
                          ref={detailsContainerRef}
                          onScroll={(e) => setShowDetailsScrollTop(e.currentTarget.scrollTop > 150)}
                          >
                            <div className={cn(
                              "flex flex-col items-center lg:w-[35%] xl:w-[30%] lg:sticky lg:top-0 shrink-0",
                              activeTab === 'chat' && "hidden lg:flex",
                              activeTab === 'battle' && "hidden"
                            )}>
                              <div className="relative w-44 h-44 sm:w-56 sm:h-56 mb-4 group shrink-0">
                                <div className="absolute inset-2 bg-gradient-to-tr from-cyan-500/10 via-cyan-400/20 to-transparent rounded-full shadow-[0_0_35px_rgba(34,211,238,0.3),inset_0_0_15px_rgba(34,211,238,0.15)] animate-pulse"></div>
                                <div className="absolute inset-0 border border-cyan-500/10 rounded-full animate-[ping_4s_cubic-bezier(0.2,0.8,0.2,1)_infinite] opacity-65"></div>
                                <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                                  <PokemonBattleSprite
                                    pokemon={pokemon}
                                    isBack={false}
                                    isShiny={isShiny}
                                    isFemale={isFemale}
                                    use2dSprite={false}
                                    className="w-full h-full object-contain transition-transform duration-500 select-none  filter drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:scale-105 group-hover:drop-shadow-[0_0_25px_rgba(34,211,238,0.65)]"
                                    onClick={() => sounds.playCry(pokemon?.name, pokemon.cries?.latest, pokemon?.name?.includes('-gmax'))}
                                  />
                                </div>
                                
                                {/* Left Visual Toggles (Favorite Star) */}
                                <div className="absolute -left-4 top-0 flex flex-col gap-2 z-20">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (pokemon) {
                                        const art = pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default || '';
                                        toggleFavorite({
                                          name: pokemon.name,
                                          url: art,
                                          displayId: pokemon.baseId || pokemon.id,
                                          formId: pokemon.id,
                                          baseId: pokemon.baseId,
                                          artwork: art
                                        });
                                        try { sounds.shiny(); } catch (_) {}
                                      }
                                    }}
                                    onMouseEnter={() => { try { sounds.hover(); } catch (_) {} }}
                                    className={cn(
                                      hudButtonClass(pokemon ? isFavorite(pokemon.name) : false, 'yellow'),
                                      "!p-1.5 !rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all",
                                      pokemon && isFavorite(pokemon.name)
                                        ? "bg-yellow-950/80 border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                                        : "bg-slate-900/80 border-slate-700 text-slate-400 hover:text-yellow-300 hover:border-yellow-500/50"
                                    )}
                                    title={pokemon && isFavorite(pokemon.name) ? "Remove from Favorites" : "Add to Favorites"}
                                  >
                                    <HUDCorners />
                                    <Star
                                      className={cn(
                                        "w-4 h-4 transition-transform duration-300 hover:scale-110",
                                        pokemon && isFavorite(pokemon.name)
                                          ? "fill-yellow-400 text-yellow-400 animate-pulse filter drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]"
                                          : "text-slate-400 hover:text-yellow-300"
                                      )}
                                    />
                                  </button>
                                </div>

                                {/* Visual Toggles */}
                                <div className="absolute -right-4 top-0 flex flex-col gap-2 z-20">
                                  {/* Shiny Toggle Button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsShiny(!isShiny);
                                      sounds.shiny();
                                    }}
                                    onMouseEnter={() => sounds.hover()}
                                    className={cn(
                                      hudButtonClass(isShiny, 'cyan'),
                                      "!p-1.5 !rounded-full shadow-lg"
                                    )}
                                    title={isShiny ? "Show Default" : "Show Shiny"}
                                  >
                                    <HUDCorners />
                                    <Sparkles className={cn("w-4 h-4", isShiny ? "text-yellow-400 animate-pulse" : (isLightMode ? "text-slate-400" : "text-cyan-400"))} />
                                  </button>

                                  {/* Compare Stats Toggle Button (below Shiny button) */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleOpenComparison(pokemon);
                                      try { sounds.scan(); playHaptic('light'); } catch (_) {}
                                    }}
                                    onMouseEnter={() => sounds.hover()}
                                    className={cn(
                                      hudButtonClass(false, 'purple'),
                                      "!p-1.5 !rounded-full shadow-lg flex items-center justify-center cursor-pointer"
                                    )}
                                    title="Pin & Compare Stats"
                                  >
                                    <HUDCorners />
                                    <ArrowLeftRight className="w-4 h-4 text-cyan-300" />
                                  </button>
                                  
                                  {/* Female Form Toggle Button */}
                                  {['pyroar', 'unfezant', 'frillish', 'jellicent', 'hippowdon', 'hippopotas', 'meowstic', 'indeedee', 'oinkologne', 'basculegion'].includes(pokemon?.name?.split('-')[0].toLowerCase()) && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsFemale(!isFemale);
                                        sounds.hover();
                                      }}
                                      onMouseEnter={() => sounds.hover()}
                                      className={cn(
                                        hudButtonClass(isFemale, 'cyan'),
                                        "!p-1.5 !rounded-full shadow-lg flex items-center justify-center"
                                      )}
                                      title={isFemale ? "Show Male" : "Show Female"}
                                    >
                                      <HUDCorners />
                                      <span className={cn("text-xs font-black w-4 h-4 leading-none text-center flex items-center justify-center", isFemale ? "text-pink-400" : "text-blue-400")}>{isFemale ? '‚ôÄ' : '‚ôÇ'}</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-center gap-2 mb-4 shrink-0">
                                <h2 className={cn(
                                  "text-2xl sm:text-3xl font-hud font-black uppercase tracking-wider text-center break-words leading-tight",
                                  isLightMode ? "text-slate-900" : "text-cyan-400"
                                )} style={isLightMode ? undefined : { textShadow: '0 0 10px rgba(34,211,238,0.5)' }}>
                                  {pokemon?.name}
                                </h2>
                                <div className="flex items-center gap-3">
                                  {pokemon.cries?.latest && (
                                    <motion.button
                                      whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
                                      whileTap={{ scale: 0.9 }}
                                      transition={{ duration: 0.4 }}
                                      type="button"
                                      onClick={() => sounds.playCry(pokemon?.name, pokemon.cries?.latest, pokemon?.name?.includes('-gmax'))}
                                      className={cn(hudButtonClass(false, 'cyan'), "!p-1.5 !rounded-full")}
                                      title="Play Cry"
                                    >
                                      <HUDCorners />
                                      <Volume2 className="w-4 h-4" />
                                    </motion.button>
                                  )}
                                  <span className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-hud tracking-[0.2em] font-black uppercase",
                                    isLightMode 
                                      ? "bg-slate-100 border border-slate-300 text-slate-800" 
                                      : "bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                                  )}>
                                     NO.{(pokemon.baseId || pokemon.id).toString().padStart(4, '0')}
                                  </span>
                                </div>
                              </div>
                              {/* Enhanced Type fields */}
                              <div className={cn(
                                "grid grid-cols-2 gap-4 py-2.5 px-3 mb-4 rounded-xl border text-center w-full shrink-0",
                                isLightMode 
                                  ? "bg-slate-50 border-slate-200" 
                                  : "bg-slate-950/30 border-cyan-500/10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]"
                              )}>
                                <div className="flex flex-col items-center">
                                  <span className={cn("text-[9px] font-mono tracking-widest uppercase mb-1.5 font-bold", isLightMode ? "text-slate-500" : "text-cyan-500/60")}>Primary Type</span>
                                  <span className={cn(
                                    "px-3 py-1 rounded-md text-[10px] font-bold tracking-wider font-hud uppercase shadow-md w-full max-w-[120px]",
                                    typeColors[pokemon.types[0]?.type.name] || "bg-slate-600"
                                  )}>
                                    {pokemon.types[0]?.type.name.toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <span className={cn("text-[9px] font-mono tracking-widest uppercase mb-1.5 font-bold", isLightMode ? "text-slate-500" : "text-cyan-500/60")}>Secondary Type</span>
                                  {pokemon.types[1] ? (
                                    <span className={cn(
                                      "px-3 py-1 rounded-md text-[10px] font-bold tracking-wider font-hud uppercase shadow-md w-full max-w-[120px]",
                                      typeColors[pokemon.types[1].type.name] || "bg-slate-600"
                                    )}>
                                      {pokemon.types[1].type.name.toUpperCase()}
                                    </span>
                                  ) : (
                                    <span className={cn(
                                      "px-3 py-1 rounded-md text-[10px] font-bold tracking-wider font-hud border w-full max-w-[120px] uppercase",
                                      isLightMode
                                        ? "text-slate-400 border-slate-200 bg-slate-100"
                                        : "text-slate-500 border-slate-800 bg-slate-900/40"
                                    )}>
                                      None
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Alternative Forms / Varieties (Hidden in Pokethology section for a cleaner left interface) */}
                              {activeTab !== 'chat' && !pokemon?.name?.includes('koraidon') && !pokemon?.name?.includes('miraidon') && ( (pokemon.varieties && pokemon.varieties.length > 1) || ['pyroar', 'unfezant', 'frillish', 'jellicent', 'hippowdon', 'hippopotas', 'basculegion', 'oinkologne', 'tatsugiri'].some(d => pokemon?.name?.includes(d)) ) && (
                                <div className="w-full mb-3 shrink-0">
                                  {(() => {
                                    let varietiesList = (pokemon.varieties || [{ pokemon: { name: pokemon?.name, url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id || ''}` } }])
                                      .filter(v => 
                                        v.pokemon?.name !== 'tatsugiri-curly-mega' && 
                                        v.pokemon?.name !== 'tatsugiri-droopy-mega' && 
                                        v.pokemon?.name !== 'floette-eternal-mega' &&
                                        !v.pokemon?.name?.startsWith('koraidon-') &&
                                        !v.pokemon?.name?.startsWith('miraidon-')
                                      );
                                    
                                    if (pokemon?.name?.includes('tatsugiri') && !varietiesList.some(v => v.pokemon?.name === 'tatsugiri-stretchy-mega')) {
                                      varietiesList.push({ pokemon: { name: 'tatsugiri-stretchy-mega', url: '' } });
                                    }

                                    let megas = varietiesList.filter(v => v.pokemon?.name?.includes('-mega'));
                                    
                                    const gmax = varietiesList.filter(v => v.pokemon?.name?.includes('-gmax'));
                                    let rawOthers = varietiesList.filter(v => 
                                      !v.pokemon?.name?.includes('-mega') && 
                                      !v.pokemon?.name?.includes('-gmax') && 
                                      !v.pokemon?.name?.endsWith('-f') && 
                                      !v.pokemon?.name?.endsWith('-female') && 
                                      !v.pokemon?.name?.endsWith('-m') && 
                                      !v.pokemon?.name?.endsWith('-male')
                                    );
                                    
                                    const others = [...rawOthers];

                                    const renderVarietyButton = (v: any, colorMode: 'cyan' | 'amber' | 'red', index: number = 0) => {
                                      const isCurrent = v.pokemon?.name === pokemon?.name;
                                      // Extracting suffix for display
                                      let displayName = v.pokemon?.name;
                                      const baseName = pokemon?.name?.split('-')[0];
                                      if (displayName.startsWith(baseName + '-')) {
                                        displayName = displayName.substring(baseName.length + 1).replace('-', ' ').toUpperCase();
                                      } else {
                                        displayName = displayName.toUpperCase();
                                      }

                                      return (
                                        <button
                                          key={`${v.pokemon?.name || 'var'}-${colorMode}-${index}`}
                                          onClick={() => {
                                            performSearch(v.pokemon?.name);
                                            if (detailsContainerRef.current) {
                                              detailsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                                            }
                                          }}
                                          className={cn(
                                            hudButtonClass(isCurrent, colorMode),
                                            "!py-1 !px-2 !text-[9px] font-bold tracking-wider min-w-[80px]"
                                          )}
                                          title={v.pokemon?.name}
                                        >
                                          <HUDCorners />
                                          {displayName || 'DEFAULT'}
                                        </button>
                                      );
                                    };

                                    return (
                                      <div className="space-y-4">
                                        {others.length > 1 && (
                                          <div>
                                            <h3 className="text-cyan-500 font-hud text-[10px] font-bold tracking-wider uppercase tracking-[0.2em] mb-2 text-center border-b border-cyan-900/30 pb-1">Alternative Forms</h3>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                              {others.map((v, i) => renderVarietyButton(v, 'cyan', i))}
                                            </div>
                                          </div>
                                        )}
                                        {megas.length > 0 && (
                                          <div>
                                            <h3 className="text-amber-500 font-hud text-[10px] font-bold tracking-wider uppercase tracking-[0.2em] mb-2 text-center border-b border-amber-900/30 pb-1">Mega Evolutions</h3>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                              {megas.map((v, i) => renderVarietyButton(v, 'amber', i))}
                                            </div>
                                          </div>
                                        )}
                                        {gmax.length > 0 && (
                                          <div>
                                            <h3 className="text-red-500 font-hud text-[10px] font-bold tracking-wider uppercase tracking-[0.2em] mb-2 text-center border-b border-red-900/30 pb-1">Gigantamax Forms</h3>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                              {gmax.map((v, i) => renderVarietyButton(v, 'red', i))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })()}
                                </div>
                              )}
                              
                            </div>

                            <motion.div className="flex-1 flex flex-col min-w-0 w-full h-full">
                              <AnimatePresence mode="wait">
                                {activeTab === 'data' ? (
                                  <motion.div
                                    key="data"
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                    className="w-full space-y-4"
                                  >
                                    {/* Enhanced Pokedex Entry Section */}
                                    <PokedexEntrySection
                                      pokemon={pokemon}
                                      selectedGameDescIndex={selectedGameDescIndex}
                                      setSelectedGameDescIndex={setSelectedGameDescIndex}
                                      isLightMode={isLightMode}
                                      sounds={sounds}
                                      TypewriterText={TypewriterText}
                                      onCompare={() => handleOpenComparison(pokemon)}
                                    />

                                     {/* Abilities Section */}
                                     <AbilitiesSection
                                       abilities={pokemon.abilities}
                                       isLightMode={isLightMode}
                                       sounds={sounds}
                                     />

                                     {/* Evolution Line & Methods Section (Only for standard 1025 Pok√©mon) */}
                                     {isStandard1025Pokemon(pokemon) && pokemon.evolutionChain && pokemon.evolutionChain.evolves_to && pokemon.evolutionChain.evolves_to.length > 0 && (
                                       <div className={cn(
                                         "rounded-xl p-4 sm:p-5 border-2 shadow-[0_4px_22px_rgba(0,0,0,0.03)] overflow-x-auto custom-scrollbar optimize-scrolling relative mb-4 touch-pan-x touch-pan-y [touch-action:pan-x_pan-y]",
                                         isLightMode ? "bg-white border-slate-200" : "bg-slate-950/60 border-cyan-900/40 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                                       )}>
                                         <h3 className={cn(
                                           "font-hud text-[11px] uppercase tracking-[0.3em] mb-4 border-b pb-2 flex items-center justify-between shrink-0",
                                           isLightMode ? "text-cyan-800 border-slate-200" : "text-cyan-400 border-cyan-900/40"
                                         )}>
                                           <div className="flex items-center gap-2">
                                             <GitFork className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                             <span>Evolution Line & Methods</span>
                                           </div>
                                         </h3>

                                         <div className="flex items-center justify-start min-w-max pb-1 pt-2 touch-pan-x touch-pan-y [touch-action:pan-x_pan-y]">
                                           <EvolutionNodeComponent 
                                             node={pokemon.evolutionChain}
                                             currentPokemonName={pokemon.name}
                                             onSearch={(searchName) => {
                                               performSearch(searchName);
                                             }}
                                           />
                                         </div>
                                       </div>
                                     )}

                                     {/* Type Weaknesses Matrix Section */}
                                     <TypeWeaknessesSection
                                       weaknesses={pokemon.weaknesses}
                                       types={pokemon.types}
                                       isLightMode={isLightMode}
                                       typeColors={typeColors}
                                     />

                                     {/* Combat Base Stats HUD Section */}
                                     <CombatStatsSection
                                       stats={pokemon.stats}
                                       isLightMode={isLightMode}
                                       sounds={sounds}
                                       onCompare={() => handleOpenComparison(pokemon)}
                                     />

                                     {/* Moveset Analysis Section */}
                                     {pokemon.moves && pokemon.moves.length > 0 && (
                                       <MovesetAnalysisSection
                                         moves={pokemon.moves}
                                         isLightMode={isLightMode}
                                         typeColors={typeColors}
                                         sounds={sounds}
                                         setSelectedMoveDetail={setSelectedMoveDetail}
                                         setIsMoveDetailOpen={setIsMoveDetailOpen}
                                       />
                                     )}
                                   </motion.div>
                                ) : activeTab === 'chat' ? (
                                  <motion.div
                                    key="chat"
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                    className="w-full flex-1 flex flex-col gap-2 min-h-0 h-full overflow-hidden"
                                  >
                                    <div className={cn(
                                      "chat-container flex-1 rounded-xl border overflow-hidden flex flex-col relative min-h-0",
                                      isLightMode ? "bg-white border-slate-200" : "bg-slate-950/95 border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                                    )}>
                                      <HUDCorners className="opacity-40" />
                                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
                                      <div className={cn(
                                        "px-3 py-2 border-b flex justify-between items-center relative z-10",
                                        isLightMode ? "bg-slate-50 border-slate-200" : "bg-cyan-950/30 border-cyan-900/40"
                                      )}>
                                        <div className="flex items-center gap-2">
                                          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", quotaLimitReached ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]")}></div>
                                          <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                              <span className={cn("text-[9px] font-black tracking-wider font-hud uppercase tracking-[0.15em] leading-tight", quotaLimitReached ? "text-red-500" : "text-cyan-300")}>
                                                {quotaLimitReached ? "AI OFFLINE" : "Pok√©thology AI"}
                                              </span>
                                              {/* <span className="text-[5px] text-slate-600 font-mono">Sign: {(import.meta as any).env.VITE_POKETHOLOGY || "Pok√©dex"}</span> */}
                                            </div>
                                            <span className={cn("text-[6px] font-hud font-bold uppercase tracking-widest", quotaLimitReached ? "text-red-400/80" : "text-cyan-500/60")}>
                                              STATUS: {quotaLimitReached ? "WAITING FOR COOLDOWN..." : "ACTIVE"} // SIGN: {(import.meta as any).env.VITE_POKETHOLOGY || "POKEDEX"}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {quotaLimitReached && (
                                             <button 
                                               onClick={() => setQuotaLimitReached(false)}
                                               className="text-[6px] font-hud text-cyan-500/50 hover:text-cyan-400 border border-cyan-500/20 px-1 rounded transition-colors"
                                             >
                                               RETRY
                                             </button>
                                          )}


                                          {showClearChatConfirm ? (
                                            <div className="flex items-center gap-1 bg-slate-900/85 px-1.5 py-0.5 rounded border border-rose-500/30">
                                              <span className="text-[6.5px] font-mono font-bold text-rose-400 uppercase">Clear?</span>
                                              <button
                                                onClick={() => {
                                                  setChatMessages([{ role: "model", text: getChatWelcomeMessage(pokemon?.name) }]);
                                                  setShowClearChatConfirm(false);
                                                  try { sounds.scan(); playHaptic('light'); } catch(_) {}
                                                }}
                                                className="px-1.5 py-0.5 text-[6.5px] font-hud font-black uppercase rounded bg-rose-950 border border-rose-500/40 text-rose-400 hover:bg-rose-900 transition-all cursor-pointer select-none"
                                              >
                                                YES
                                              </button>
                                              <button
                                                onClick={() => {
                                                  setShowClearChatConfirm(false);
                                                  try { sounds.scan(); playHaptic('light'); } catch(_) {}
                                                }}
                                                className="px-1.5 py-0.5 text-[6.5px] font-hud font-black uppercase rounded bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-750 transition-all cursor-pointer select-none"
                                              >
                                                NO
                                              </button>
                                            </div>
                                          ) : (
                                            <button 
                                              onClick={() => {
                                                setShowClearChatConfirm(true);
                                                try { sounds.scan(); playHaptic('light'); } catch(_) {}
                                              }}
                                              className="text-[7px] font-bold tracking-wider text-cyan-700 hover:text-cyan-400 transition-colors uppercase font-hud tracking-widest flex items-center gap-1 cursor-pointer"
                                            >
                                              <RotateCcw className="w-2.5 h-2.5" />
                                              Clear All
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                      


                                      <div 
                                        ref={chatScrollRef}
                                        onScroll={(e) => {
                                          savedChatScrollTopRef.current = e.currentTarget.scrollTop;
                                        }}
                                        className={cn(
                                          "chat-messages-area flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 custom-scrollbar optimize-scrolling relative min-h-0 transition-colors",
                                          isLightMode ? "bg-[#efeae2]" : "bg-[#0b141a]"
                                        )}
                                      >
                                        {/* WhatsApp Wallpaper Pattern Overlay */}
                                        <div 
                                          className="absolute inset-0 pointer-events-none opacity-[0.06] dark:opacity-[0.07] bg-repeat z-0"
                                          style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M11 18h2v2h-2v-2zm10 0h2v2h-2v-2zm-10 10h2v2h-2v-2zm10 0h2v2h-2v-2zM3 39h2v2H3v-2zm10 0h2v2h-2v-2zm10 0h2v2h-2v-2zM3 49h2v2H3v-2zm10 0h2v2h-2v-2zm10 0h2v2h-2v-2zm10 0h2v2h-2v-2zM51 18h2v2h-2v-2zm10 0h2v2h-2v-2zm-10 10h2v2h-2v-2zm10 0h2v2h-2v-2zM43 39h2v2h-2v-2zm10 0h2v2h-2v-2zm10 0h2v2h-2v-2zm10 0h2v2h-2v-2zM43 49h2v2h-2v-2zm10 0h2v2h-2v-2zm10 0h2v2h-2v-2zm10 0h2v2h-2v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
                                          }}
                                        />

                                        {quotaLimitReached && (
                                          <div className="bg-red-950/40 border border-red-500/30 p-2 rounded flex flex-col gap-1 mb-2 animate-in fade-in slide-in-from-top-1">
                                            <div className="flex items-center gap-2">
                                              <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />
                                              <span className="text-[7px] font-bold tracking-wider text-red-400 font-hud uppercase">
                                                System Overload Detected
                                              </span>
                                            </div>
                                            <p className="text-[6px] text-red-300 font-mono ml-5 leading-relaxed">
                                              Enjoy <b>unlimited questions & answers</b> all day for free with our offline neural fallback engine ‚Äî no payment required ever!
                                            </p>
                                            <button 
                                              onClick={() => setQuotaLimitReached(false)}
                                              className="mt-1 text-[6px] text-cyan-400 font-hud tracking-widest text-left ml-5 underline uppercase"
                                            >
                                              Dismiss & Retry
                                            </button>
                                          </div>
                                        )}

                                        {chatMessages.map((msg, i) => (
                                          <motion.div 
                                            key={`chat-msg-${i}-${msg.role}`} 
                                            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className={cn(
                                              "flex w-full gap-2.5 py-3 relative z-10 border-b border-cyan-900/20 last:border-0",
                                              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                            )}
                                          >
                                            <div className={cn("shrink-0 mt-1 flex items-center justify-center", msg.role === 'user' ? (isLightMode ? 'text-slate-500' : 'text-slate-400') : (isLightMode ? 'text-cyan-600' : 'text-cyan-400'))}>
                                              {msg.role === 'user' ? <User className="w-4 h-4" /> : <BrainCircuit className="w-4 h-4" />}
                                            </div>
                                            <div className={cn("flex flex-col w-full min-w-0 max-w-[85%]", msg.role === 'user' ? "items-end" : "items-start")}>
                                              {msg.role === 'model' ? (
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                  <span className={cn("text-[8px] font-hud font-bold uppercase tracking-widest", isLightMode ? "text-cyan-800" : "text-cyan-400/90")}>
                                                    Pok√©thology AI
                                                  </span>
                                                  <div className="flex items-center gap-1.5 ml-0.5">
                                                    <button
                                                      type="button"
                                                      onClick={() => handleChatTTS(msg.text, i)}
                                                      title={chatSpeakingIndex === i ? "Stop Voice" : "Listen to Message"}
                                                      className={cn(
                                                        "flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-hud uppercase tracking-wider border transition-all cursor-pointer font-bold select-none",
                                                        chatSpeakingIndex === i
                                                          ? "bg-cyan-500 text-slate-950 border-cyan-300 shadow-sm"
                                                          : isLightMode
                                                            ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                                                            : "bg-slate-800/90 text-cyan-300 border-slate-700 hover:bg-slate-700"
                                                      )}
                                                    >
                                                      {chatSpeakingIndex === i ? <VolumeX className="w-2.5 h-2.5" /> : <Volume2 className="w-2.5 h-2.5 text-cyan-400" />}
                                                      <span>{chatSpeakingIndex === i ? "Stop" : "Voice"}</span>
                                                    </button>

                                                    <button
                                                      type="button"
                                                      onClick={() => handleChatCopy(msg.text, i)}
                                                      title="Copy Message"
                                                      className={cn(
                                                        "flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-hud uppercase tracking-wider border transition-all cursor-pointer font-bold select-none",
                                                        chatCopiedIndex === i
                                                          ? "bg-emerald-500 text-white border-emerald-400 shadow-sm"
                                                          : isLightMode
                                                            ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                                                            : "bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-700"
                                                      )}
                                                    >
                                                      {chatCopiedIndex === i ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                                                      <span>{chatCopiedIndex === i ? "Copied" : "Copy"}</span>
                                                    </button>
                                                  </div>
                                                </div>
                                              ) : (
                                                <span className={cn("text-[8px] font-hud font-bold uppercase tracking-widest mb-1", isLightMode ? "text-slate-600" : "text-slate-400")}>
                                                  Operator
                                                </span>
                                              )}
                                              <div className={cn(
                                                "markdown-body select-text text-[11px] sm:text-[12.5px] font-sans leading-relaxed break-words rounded-2xl px-3.5 py-2.5 text-left shadow-sm transition-all", 
                                                msg.role === 'user' 
                                                  ? (isLightMode ? "bg-[#d9fdd3] text-[#111b21] border border-[#c1eab8] rounded-tr-none" : "bg-[#005c4b] text-[#e9edef] border border-[#02735e] rounded-tr-none") 
                                                  : (isLightMode ? "bg-white text-[#111b21] border border-slate-200/90 rounded-tl-none" : "bg-[#202c33] text-[#e9edef] border border-[#2a3942] rounded-tl-none")
                                              )}>
                                                <Markdown
                                                  components={{
                                                    a: ({ href, children }) => (
                                                      <span className="inline-block">
                                                        <a 
                                                          href={href} 
                                                          target="_blank" 
                                                          rel="noopener noreferrer" 
                                                          className="text-cyan-400 hover:text-cyan-300 underline font-semibold inline-flex items-center gap-1"
                                                        >
                                                          {children}
                                                          <Globe className="w-2.5 h-2.5 inline text-cyan-400/80" />
                                                        </a>
                                                      </span>
                                                    )
                                                  }}
                                                >
                                                  {msg.text}
                                                </Markdown>
                                              </div>
                                              {msg.role === 'model' && pokemon?.name && (
                                                <div className="mt-2.5 pt-2 border-t border-cyan-500/10 flex flex-wrap gap-1.5 align-middle items-center">
                                                  <span className="text-[7.5px] text-slate-500 font-hud tracking-widest uppercase block w-full mb-0.5">Verified Knowledge Sources:</span>
                                                  <a 
                                                    href={`https://bulbapedia.bulbagarden.net/wiki/${encodeURIComponent(pokemon.name)}_(Pok√©mon)`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="inline-flex items-center gap-1 text-[7.5px] font-hud font-black uppercase tracking-wider text-cyan-400 hover:text-cyan-200 bg-slate-950/40 hover:bg-cyan-500/15 border border-cyan-500/20 px-2 py-0.5 rounded transition-colors"
                                                  >
                                                    <BookOpen className="w-2.5 h-2.5 text-cyan-500" />
                                                    Bulbapedia
                                                  </a>
                                                  <a 
                                                    href={`https://www.serebii.net/search.shtml?q=${encodeURIComponent(pokemon.name)}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="inline-flex items-center gap-1 text-[7.5px] font-hud font-black uppercase tracking-wider text-cyan-400 hover:text-cyan-200 bg-slate-950/40 hover:bg-cyan-500/15 border border-cyan-500/20 px-2 py-0.5 rounded transition-colors"
                                                  >
                                                    <Globe className="w-2.5 h-2.5 text-cyan-500" />
                                                    Serebii
                                                  </a>

                                                  <a 
                                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(pokemon.name + ' lore pok√©mon')}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="inline-flex items-center gap-1 text-[7.5px] font-hud font-black uppercase tracking-wider text-red-400 hover:text-red-200 bg-slate-950/40 hover:bg-red-500/15 border border-red-500/20 px-2 py-0.5 rounded transition-colors"
                                                  >
                                                    <Search className="w-2.5 h-2.5 text-red-500" />
                                                    YouTube
                                                  </a>
                                                </div>
                                              )}
                                              {msg.groundingMetadata?.webSearchQueries?.length > 0 && (
                                                <div className="flex flex-wrap items-center gap-1 mt-2 border-t border-slate-700/30 pt-1.5 text-[8px] font-mono text-cyan-400/90 select-none">
                                                  <Search className="w-2 h-2 text-cyan-400 animate-pulse" />
                                                  <span className="font-bold uppercase tracking-wider text-[7px] text-cyan-400/70">Scanned Web:</span>
                                                  {msg.groundingMetadata.webSearchQueries.map((query: string, qi: number) => (
                                                    <span key={`query-${qi}`} className="bg-cyan-950/50 border border-cyan-500/15 px-1 py-0.5 rounded text-[7px] font-bold">
                                                      "{query}"
                                                    </span>
                                                  ))}
                                                </div>
                                              )}

                                              {msg.groundingChunks?.length > 0 && (
                                                <div className="mt-2 text-[8px] select-all">
                                                  <div className="text-[7px] tracking-widest font-black text-slate-400/70 uppercase mb-1 flex items-center gap-1 font-hud">
                                                    <Globe className="w-1.5 h-1.5 text-cyan-500" />
                                                    <span>Academic Citations & Origins</span>
                                                  </div>
                                                  <div className="flex flex-wrap gap-1">
                                                    {msg.groundingChunks.filter(c => c.web?.uri).map((chunk, ci) => {
                                                      let domain = 'Source';
                                                      try {
                                                        domain = new URL(chunk.web.uri).hostname.replace('www.', '');
                                                      } catch (err) {}
                                                      return (
                                                        <a 
                                                          key={`chunk-${ci}`} 
                                                          href={chunk.web.uri} 
                                                          target="_blank" 
                                                          rel="noopener noreferrer" 
                                                          className="text-[7.5px] font-mono text-cyan-300 hover:text-cyan-100 flex items-center gap-1 border border-cyan-500/15 px-1.5 py-0.5 bg-cyan-950/30 hover:bg-cyan-950/85 rounded transition-all duration-150 decoration-transparent"
                                                        >
                                                          <Globe className="w-1.5 h-1.5 text-cyan-500" />
                                                          <span className="underline truncate max-w-[120px] font-bold">
                                                            {chunk.web.title || domain}
                                                          </span>
                                                          <span className="opacity-40 text-[6.5px]">({domain})</span>
                                                        </a>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </motion.div>
                                        ))}
                                        {isChatLoading && (
                                          <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center justify-center gap-2 py-4"
                                          >
                                            <div className="flex gap-1">
                                              {[0, 1, 2].map(i => (
                                                <motion.div
                                                  key={`loading-dot-${i}`}
                                                  className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                                                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                                                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                                />
                                              ))}
                                            </div>
                                            <span className="text-[8px] font-hud text-cyan-500/70 tracking-widest uppercase">Processing Request...</span>
                                          </motion.div>
                                        )}
                                        <div ref={chatEndRef} />
                                      </div>
                                      <div className={cn(
                                        "px-2.5 py-1.5 flex gap-1.5 overflow-x-auto custom-scrollbar optimize-scrolling whitespace-nowrap border-t relative z-10 shrink-0",
                                        isLightMode ? "bg-slate-50 border-slate-200" : "bg-slate-900/90 border-cyan-900/40 backdrop-blur-md"
                                      )}>
                                        {quotaLimitReached && (
                                          <div className="absolute bottom-[40px] left-0 right-0 z-10 bg-red-950/90 border-t border-red-500/30 p-2 flex flex-col gap-1 backdrop-blur-md animate-in slide-in-from-bottom-5">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-2">
                                                <AlertTriangle className="w-2.5 h-2.5 text-red-500 animate-pulse" />
                                                <span className="text-[7px] font-bold tracking-wider text-red-400 font-hud uppercase">Quota Limit</span>
                                              </div>
                                              <button onClick={() => setQuotaLimitReached(false)} className="text-[6px] text-cyan-400 underline">RETRY</button>
                                            </div>
                                            <p className="text-[6px] text-red-300 font-mono leading-tight">
                                              System Overload. Add your own <b>GEMINI_API_KEY</b> in <b>Settings</b>.
                                            </p>
                                          </div>
                                        )}
                                        {(pokemon 
                                          ? [`Lore: ${pokemon?.name}`, `Counter for ${pokemon?.name}?`, `Battle usage?`, `Moveset?`]
                                          : ["Strongest Pokemon?", "Mega Evolutions?", "Chaos Match Tips?", "Who is Arceus?"]
                                        ).map((s, idx) => (
                                          <button 
                                            key={`suggested-${s}-${idx}`} 
                                            onClick={() => {
                                              setChatInput(s);
                                              // Auto trigger send if it feels natural
                                            }}
                                            className={cn(
                                              "px-2 py-1 rounded-full border text-[7px] font-bold tracking-wider uppercase font-hud transition-colors",
                                              isLightMode 
                                                ? "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200" 
                                                : "bg-cyan-950/40 border-cyan-500/20 text-cyan-500 hover:bg-cyan-900/60"
                                            )}
                                          >
                                            {s}
                                          </button>
                                        ))}
                                      </div>
                                      <form onSubmit={handleSendMessage} className={cn(
                                        "sticky bottom-0 left-0 right-0 p-2.5 border-t flex gap-2 shrink-0 z-30 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-md",
                                        isLightMode ? "bg-slate-100/95 border-slate-200" : "bg-slate-900/95 border-cyan-900/40"
                                      )}>
                                        <input
                                          type="text"
                                          value={chatInput}
                                          onChange={(e) => setChatInput(e.target.value)}
                                          placeholder={"ASK POK√âTHEOLOGY CORE..."}
                                          className={cn(
                                            "flex-1 border rounded px-2.5 py-2 text-[10px] font-bold tracking-wider uppercase tracking-widest focus:outline-none shadow-inner",
                                            isLightMode 
                                              ? "bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-cyan-500" 
                                              : "bg-slate-950 border-cyan-900/60 text-cyan-400 focus:border-cyan-400"
                                          )}
                                        />
                                        <button type="submit" className={cn(hudButtonClass(false, 'cyan'), "!p-2 flex items-center justify-center shrink-0")}>
                                          <Send className="w-3.5 h-3.5" />
                                        </button>
                                      </form>
                                    </div>
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="battle"
                                    ref={battleScrollRef}
                                    initial={{ opacity: 0, y: 12, scale: 0.99 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -12, scale: 0.99 }}
                                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                                    className="w-full flex-1 min-h-0 overflow-y-auto custom-scrollbar optimize-scrolling max-w-full"
                                  >
                                    {/* ‚îÄ‚îÄ‚îÄ DUAL MODEL MATCHUP PREVIEW REMOVED (THE ARENA ONLY IS SUFFICIENT) ‚îÄ‚îÄ‚îÄ */}

                                    <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 items-start max-w-full pb-2 sm:pb-3">
                                      {/* Left Column (Arena, Actions) */}
                                      <div className="lg:col-span-8 flex flex-col w-full min-w-0">
                                        
                                        <div 
                                          ref={arenaRef}
                                          className="bg-slate-900/80 backdrop-blur-md rounded-2xl relative shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col mb-1.5 sm:mb-2 overflow-hidden w-full max-w-full h-auto z-10 arena-container no-scrollbar"
                                        >
                                      {/* Battle Background / Field */}
                                      <div className="absolute inset-0 z-0 rounded-xl sm:rounded-2xl overflow-hidden pointer-events-none">
                                        {/* Dynamic CSS split-gradient representing the clashing Pok√©mon types */}
                                        <div 
                                          className="absolute inset-0 z-0"
                                          style={{
                                            background: getBattleFallbackGradient(pokemon?.types?.[0]?.type?.name, battleOpponent?.types?.[0]?.type?.name),
                                          }}
                                        />
                                      </div>
                                      
                                      <div className="absolute inset-0 z-0 opacity-40 rounded-xl sm:rounded-2xl overflow-hidden pointer-events-none bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/70"></div>
                                      <div className="absolute inset-0 z-0 opacity-20 rounded-xl sm:rounded-2xl overflow-hidden pointer-events-none">
                                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_80%)]"></div>
                                      </div>


                                      {victoryConfetti && <VictoryConfetti />}
                                      <motion.div
                                        animate={screenShake ? { x: [-10, 10, -10, 10, 0] } : {}}
                                        transition={{ duration: 0.5 }}
                                        className={cn(
                                          "flex flex-row justify-between items-center bg-slate-900/80 rounded-none border-b border-cyan-500/30 relative z-20 shadow-lg shrink-0 transition-all duration-300 w-full !mx-0 !mt-0 overflow-hidden flex-nowrap",
                                          "p-1.5 sm:p-2.5 mb-2.5"
                                        )}>
                                        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink">
                                          <PokeballIcon className={cn(
                                            "animate-pulse shrink-0 transition-all duration-300",
                                            "w-6 h-6 sm:w-9 sm:h-9"
                                          )} />
                                          <div className="flex flex-col min-w-0">
                                            <h3 className={cn(
                                              isLightMode ? "text-cyan-700 font-hud font-black truncate transition-all duration-300 leading-none drop-shadow-sm" : "text-cyan-400 font-hud font-black truncate transition-all duration-300 leading-none",
                                              "text-[10px] sm:text-[14px] uppercase tracking-[0.1em] sm:tracking-[0.3em]"
                                            )}>
                                              Combat Arena
                                            </h3>
                                            <span className={cn(
                                              isLightMode ? "font-hud uppercase text-cyan-800 truncate transition-all duration-300 font-bold" : "font-hud uppercase text-cyan-700 truncate transition-all duration-300 font-bold",
                                              "text-[6px] sm:text-[9px] tracking-widest mt-0.5 sm:mt-1"
                                            )}>
                                              {isBattling ? 'Live Simulation' : 'System Ready'}
                                            </span>
                                          </div>
                                        </div>

                                        <div className={cn(
                                          "flex flex-nowrap items-center shrink-0 pl-1 sm:pl-2 transition-all duration-300",
                                          "gap-1 sm:gap-3 justify-end"
                                        )}>

                                          
                                          {isBattling && (
                                            <div
                                              className="px-1.5 py-1 sm:px-3 sm:py-2 rounded-lg text-[6px] sm:text-[12px] font-black font-hud uppercase tracking-[0.15em] bg-slate-950/70 border border-cyan-500/30 text-cyan-400 shadow-md shrink-0 flex items-center gap-1 sm:gap-1.5"
                                            >
                                              <Clock className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-cyan-400 animate-pulse shrink-0" />
                                              <span>{Math.floor(battleDuration / 60).toString().padStart(2, '0')}:{Math.floor(battleDuration % 60).toString().padStart(2, '0')}</span>
                                            </div>
                                          )}

                                          {isBattling && (
                                            <div 
                                              className={cn(
                                                "px-1.5 py-1 sm:px-4 sm:py-2 rounded-lg text-[6px] font-bold tracking-wider sm:text-[12px] font-black font-hud uppercase tracking-[0.1em] sm:tracking-[0.2em] border shadow-md shrink-0",
                                                turn === 'player' ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-cyan-500/20" : "bg-red-500/20 border-red-400 text-red-300 shadow-red-500/20"
                                              )}
                                            >
                                              {turn === 'player' ? 'PLAYER' : "ENEMY"}
                                            </div>
                                          )}

                                          <button 
                                            onClick={() => {
                                              const nextMode = arenaArtworkMode === 'home' ? '2d' : 'home';
                                              setArenaArtworkMode(nextMode);
                                              try { localStorage.setItem('pokethology_arena_artwork_mode', nextMode); } catch(_) {}
                                              try { sounds.scan(); playHaptic('light'); } catch(_) {}
                                              playHaptic();
                                            }}
                                            title={`Switch Combat Arena Visuals (Current: ${arenaArtworkMode === 'home' ? '3D Home Artwork' : '2D Pixel Sprite'})`}
                                            className={cn(
                                              hudButtonClass(arenaArtworkMode === '2d', 'cyan'),
                                              "shadow-sm whitespace-nowrap transition-all duration-300 shrink-0 flex items-center gap-1 font-hud font-bold",
                                              "!py-0.5 !px-1.5 sm:!py-1 sm:!px-2.5 !text-[7px] sm:!text-[10px]",
                                              arenaArtworkMode === '2d' ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-amber-500/20" : ""
                                            )}
                                          >
                                            {arenaArtworkMode === 'home' ? (
                                              <>
                                                <Image className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400 shrink-0" />
                                                <span>Art</span>
                                              </>
                                            ) : (
                                              <>
                                                <Gamepad2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0 animate-pulse" />
                                                <span>Sprite</span>
                                              </>
                                            )}
                                          </button>

                                          <button 
                                            onClick={() => setIsMusicOpen(true)}
                                            title="System Options"
                                            className={cn(
                                              hudButtonClass(false, 'cyan'),
                                              "shadow-sm whitespace-nowrap transition-all duration-300 shrink-0",
                                              "!py-1 !px-1.5 sm:!py-2 sm:!px-4 !text-[7px] sm:!text-[11px]"
                                            )}
                                          >
                                            <Settings className={cn( "w-4 h-4")} />
                                            
                                          </button>
                                          <button 
                                            onClick={() => setIsTypeChartOpen(true)}
                                            title="Type Chart"
                                            className={cn(
                                              hudButtonClass(false, 'cyan'),
                                              "shadow-sm whitespace-nowrap transition-all duration-300 shrink-0",
                                              "!py-1 !px-1.5 sm:!py-2 sm:!px-4 !text-[7px] sm:!text-[11px]"
                                            )}
                                          >
                                            <Info className={cn( "w-4 h-4")} />
                                            
                                          </button>
                                          

                                        </div>
                                      </motion.div>
                                      
                                      {/* Showdown Style Layout */}
                                      <BattleErrorBoundary>
                                      <motion.div 
                                        animate={
                                          (attackerAnimation === 'hit' || defenderAnimation === 'hit')
                                            ? { x: [-4, 4, -4, 4, 0], y: [-2, 2, -2, 2, 0] }
                                            : (attackerAnimation === 'hit_critical' || defenderAnimation === 'hit_critical')
                                              ? { x: [-12, 12, -12, 12, -8, 8, -4, 4, 0], y: [-8, 8, -8, 8, -4, 4, -2, 2, 0] }
                                              : { x: 0, y: 0 }
                                        }
                                        ref={arenaCallbackRef}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                        id="battle-arena-container"
                                        className="relative flex-1 flex flex-col justify-center min-h-[220px] xs:min-h-[260px] sm:min-h-[300px] md:min-h-[320px] lg:min-h-[340px] h-[300px] sm:h-[340px] lg:h-[380px] max-h-[40vh] z-10 p-[clamp(0.5rem,2vw,1.5rem)] font-bold overflow-hidden w-full max-w-full  "
                                        style={{ touchAction: 'pan-y', boxSizing: 'border-box' }}
                                      >
                                        {/* Battle Flash Overlay */}
                                        <AnimatePresence>
                                          {(attackerAnimation === 'hit' || defenderAnimation === 'hit') && (
                                            <motion.div 
                                              key="hit-flash animate-ping"
                                              initial={{ opacity: 0.15 }}
                                              animate={{ opacity: 0 }}
                                              exit={{ opacity: 0 }}
                                              transition={{ type: "spring", damping: 25, stiffness: 250 }}
                                              className="absolute inset-0 bg-white/30 pointer-events-none z-50 "
                                            />
                                          )}
                                          {(attackerAnimation === 'hit_critical' || defenderAnimation === 'hit_critical') && (
                                            <motion.div 
                                              key="critical-flash"
                                              initial={{ opacity: 0.35 }}
                                              animate={{ opacity: 0 }}
                                              exit={{ opacity: 0 }}
                                              transition={{ duration: 0.3 }}
                                              className="absolute inset-0 bg-red-500/25 pointer-events-none z-50 "
                                            />
                                          )}
        </AnimatePresence>
                                        {/* Top Left: Opponent Status */}
                                        <OpponentStatusBar
                                          battleOpponent={battleOpponent}
                                          opponentHP={opponentHP}
                                          opponentMaxHP={opponentMaxHP}
                                          opponentStatStages={opponentStatStages}
                                          opponentStatus={opponentStatus}
                                          opponentSubstitute={opponentSubstitute}
                                          opponentProtected={opponentProtected}
                                          turn={turn}
                                          enableAnimations={enableAnimations}
                                          isSelectingOpponent={isSelectingOpponent}
                                          opponentAvatar={opponentAvatar}
                                          isShiny={isOpponentShiny}
                                          onSearchOpponent={async (name) => {
                                            sounds.scan(); playHaptic('light');
                                            setLoadingPokemon(true);
                                            try {
                                              const opp = await searchPokemon(name.toLowerCase());
                                              setBattleOpponent(opp);
                                              setIsOpponentShiny(false);
                                              setIsSelectingOpponent(false);
                                            } catch (err) {
                                              console.error("Failed to search opponent:", err);
                                            } finally {
                                              setLoadingPokemon(false);
                                            }
                                          }}
                                          onSelectOpponentClick={() => {
                                            setIsSelectingOpponent(true);
                                            setViewAllGenerations(true);
                                            setListMode('pokemon');
                                            setQuery('');
                                            setInputValue('');
                                            sounds.scan(); playHaptic('light');
                                          }}
                                          statChange={opponentStatAnimation}
                                        />

                                        {/* Opponent Sprite (Top Right Area) */}
                                        <div className="absolute top-[12%] right-2 xs:top-[15%] xs:right-4 sm:top-[20%] sm:right-12 md:top-[16%] md:right-16 lg:top-[16%] lg:right-24 xl:top-[14%] xl:right-24 pointer-events-auto z-10">
                                          {battleOpponent && (
                                            <motion.div
                                              key={battleOpponent?.name + '-' + isBattling}
                                              initial={{ opacity: 1, scale: 0.8 }}
                                              animate={getBattleSpriteAnimation(defenderAnimation, opponentStatus, opponentStatAnimation)}
                                              transition={getBattleSpriteTransition(defenderAnimation, opponentStatAnimation)}

                                              className="relative flex flex-col items-center justify-end   group"
                                            >
                                              <div className="relative h-28 w-28 xs:h-32 xs:w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-52 lg:w-52 xl:h-56 xl:w-56 flex items-center justify-center max-h-[35vh]">
                                              {opponentDialogue && (
                                                <div 
                                                  className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-red-500 rounded-xl px-2.5 py-1.5 sm:px-4 sm:py-2 text-[8px] sm:text-[11px] font-bold text-red-200 shadow-lg select-none z-50 flex items-center gap-1.5 min-w-[max-content]"
                                                  style={{ transformOrigin: 'bottom center' }}
                                                >
                                                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></span>
                                                  <span>{opponentDialogue}</span>
                                                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 border-r border-b border-red-500 rotate-45"></div>
                                                </div>
                                              )}
                                              <motion.div
                                                animate={enableAnimations ? {
                                                  y: [0, -0.5, 0],
                                                  scaleY: [1, 1.005, 1],
                                                  scaleX: [1, 0.995, 1],
                                                } : {}}
                                                transition={{
                                                  duration: 2.8,
                                                  repeat: Infinity,
                                                  ease: "easeInOut",
                                                  delay: 0.3
                                                }}
                                                className="w-full h-full flex items-center justify-center pointer-events-auto"
                                              >
                                                <PokemonBattleSprite
                                                  pokemon={battleOpponent}
                                                  isBack={false}
                                                  isShiny={isOpponentShiny}
                                                  isFemale={isOpponentFemale}
                                                  arenaMode={true}
                                                  use2dSprite={arenaArtworkMode === '2d'}
                                                  flip={opponentSpriteFlip}
                                                  scaleMultiplier={arenaScale}
                                                  isPlayer={false}
                                                  className="cursor-pointer transition-all duration-300 pointer-events-auto hover:scale-105 hover:-translate-y-1 active:scale-[0.98]"
                                                  onClick={() => {
                                                    setOpponentSpriteFlip(!opponentSpriteFlip);
                                                    sounds.playCry(battleOpponent?.name, battleOpponent.cries?.latest, battleOpponent?.name?.includes('-gmax'));
                                                  }}
                                                />
                                                <StatusOverlay status={opponentStatus} />
                                              </motion.div>
                                              </div>
                                              
                                            </motion.div>
                                          )}
                                        </div>

                                        {/* Bottom Right: Player Status */}
                                        <PlayerStatusBar
                                          pokemon={pokemon}
                                          pokemonHP={pokemonHP}
                                          pokemonMaxHP={pokemonMaxHP}
                                          playerStatStages={playerStatStages}
                                          pokemonStatus={pokemonStatus}
                                          playerSubstitute={playerSubstitute}
                                          playerProtected={playerProtected}
                                          turn={turn}
                                          enableAnimations={enableAnimations}
                                          statChange={playerStatAnimation}
                                          opponent={battleOpponent}
                                          showComparison={showStatComparison}
                                          playerAvatar={currentAvatar}
                                          isShiny={isShiny}
                                        />
                                        
                                        {/* Opponent Status Bar (implied) */}
                                        {/* OpponentStatusBar is likely already in the file... let me check*/}



                                        {/* Player Sprite (Bottom Left Area) */}
                                        <div className="absolute bottom-20 left-2 xs:bottom-24 xs:left-4 sm:bottom-28 sm:left-12 md:bottom-20 md:left-16 lg:bottom-24 lg:left-24 xl:bottom-20 xl:left-24 pointer-events-auto z-10">
                                          <motion.div
                                            key={pokemon?.name + '-' + isBattling}
                                            initial={{ opacity: 1, scale: 0.8 }}
                                            animate={getBattleSpriteAnimation(attackerAnimation, pokemonStatus, playerStatAnimation)}
                                            transition={getBattleSpriteTransition(attackerAnimation, playerStatAnimation)}

                                            className="relative flex flex-col items-center justify-end   group"
                                          >
                                            <div className="relative h-28 w-28 xs:h-32 xs:w-32 sm:h-44 sm:w-44 md:h-52 md:w-52 lg:h-60 lg:w-60 xl:h-64 xl:w-64 flex items-center justify-center max-h-[35vh]">
                                              {playerDialogue && (
                                                <div 
                                                  className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-cyan-500 rounded-xl px-2.5 py-1.5 sm:px-4 sm:py-2 text-[8px] sm:text-[11px] font-bold text-cyan-200 shadow-lg select-none z-50 flex items-center gap-1.5 min-w-[max-content]"
                                                  style={{ transformOrigin: 'bottom center' }}
                                                >
                                                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full shrink-0"></span>
                                                  <span>{playerDialogue}</span>
                                                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 border-r border-b border-cyan-500 rotate-45"></div>
                                                </div>
                                              )}
                                              <motion.div
                                                animate={enableAnimations ? {
                                                  y: [0, -0.5, 0],
                                                  scaleY: [1, 1.005, 1],
                                                  scaleX: [1, 0.995, 1],
                                                } : {}}
                                                transition={{
                                                  duration: 3.1,
                                                  repeat: Infinity,
                                                  ease: "easeInOut"
                                                }}
                                                className="w-full h-full flex items-center justify-center pointer-events-auto"
                                              >
                                                <PokemonBattleSprite
                                                  pokemon={pokemon}
                                                  isBack={false}
                                                  flip={playerSpriteFlip}
                                                  isShiny={isShiny}
                                                  isFemale={isFemale}
                                                  arenaMode={true}
                                                  use2dSprite={arenaArtworkMode === '2d'}
                                                  scaleMultiplier={arenaScale}
                                                  isPlayer={true}
                                                  className="cursor-pointer transition-all duration-300 pointer-events-auto hover:scale-105 hover:-translate-y-1 active:scale-[0.98]"
                                                  onClick={() => {
                                                    setPlayerSpriteFlip(!playerSpriteFlip);
                                                    sounds.playCry(pokemon?.name, pokemon.cries?.latest, pokemon?.name?.includes('-gmax'));
                                                  }}
                                                />
                                                <StatusOverlay status={pokemonStatus} />
                                                

                                              </motion.div>
                                              <div className="hidden xs:block absolute -bottom-6 text-[7px] text-cyan-400/50 font-hud uppercase tracking-wider whitespace-nowrap">tap Pok√©mon to play cry and rotate</div>
                                            </div>
                                            
                                          </motion.div>
                                        </div>

                                        {/* Center: VS & Messages */}
                                        <div className="absolute inset-0 pointer-events-none z-30">
                                          <div className={cn(
                                            "absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-hud text-2xl sm:text-5xl lg:text-7xl italic font-black select-none z-0 transition-colors",
                                            isLightMode ? "text-slate-900/10" : "text-cyan-500/10"
                                          )}>VS</div>
                                          
                                          <AnimatePresence>
                                            {battleMessage && (
                                              <BattleMessage 
                                                message={battleMessage.text} 
                                                type={battleMessage.type}
                                                enableAnimations={enableAnimations}
                                                onComplete={handleBattleMessageComplete}
                                                isLightMode={isLightMode}
                                              />
                                            )}
                                            {arenaCriticalNotify && (
                                              <motion.div
                                                key="arena-critical"
                                                initial={{ opacity: 0, scale: 0.5, y: -20 }}
                                                animate={{ 
                                                  opacity: [0, 1, 1, 0], 
                                                  scale: [0.5, 1.3, 1.1, 1],
                                                  y: [0, -10, -15, -20]
                                                }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 1.2, ease: "easeOut" }}
                                                className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] flex flex-col items-center justify-center pointer-events-none"
                                              >
                                                <div className="text-yellow-400 font-hud text-3xl sm:text-6xl font-black tracking-widest uppercase drop-shadow-[0_0_15px_rgba(234,179,8,0.95)] animate-pulse select-none whitespace-nowrap">
                                                  CRITICAL HIT!
                                                </div>
                                              </motion.div>
                                            )}
                                            {floatingTexts.map(ft => (
                                              <FloatingText
                                                key={ft.id}
                                                id={ft.id}
                                                text={ft.text}
                                                type={ft.type}
                                                x={ft.x}
                                                y={ft.y}
                                                onComplete={removeFloatingText}
                                              />
                                            ))}
        </AnimatePresence>
                                        </div>


                                        {/* Chaos Match Setup Overlay */}
                                        <AnimatePresence>
                                          {isChaosMatchSetup && battleState === 'setup' && (
                                            <motion.div
                                              initial={{ opacity: 0 }}
                                              animate={{ opacity: 1 }}
                                              exit={{ opacity: 0 }}
                                              className="absolute inset-0 z-[100] flex flex-col items-center justify-center p-2 sm:p-4 bg-slate-950/50 backdrop-blur-md"
                                            >
                                              <motion.div 
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                                className={cn("border-2 border-amber-500 rounded-2xl p-3 sm:p-6 shadow-[0_0_50px_rgba(245,158,11,0.4)] max-w-sm w-full text-center space-y-2 sm:space-y-6 relative overflow-y-auto max-h-[98%]", isLightMode ? "bg-slate-100/90" : "bg-slate-900/90")}
                                              >
                                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                                              
                                              <div className="space-y-0.5 sm:space-y-1">
                                                <h3 className="text-amber-400 font-hud text-sm sm:text-xl font-black tracking-widest uppercase">Chaos Mode Setup</h3>
                                                <p className="text-[8px] sm:text-[10px] text-amber-500/70 font-mono uppercase tracking-[0.2em]">Preparing Random Battle</p>
                                              </div>

                                              <div className="flex justify-between items-center gap-2 py-2 sm:py-4 border-y border-amber-500/10">
                                                <div className="flex flex-col items-center gap-1">
                                                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-950 border-2 border-cyan-500/30 flex items-center justify-center overflow-hidden">
                                                    <img
                                                      src={(isShiny ? (pokemon?.sprites?.other?.home?.front_shiny || pokemon?.sprites?.other?.['official-artwork']?.front_shiny) : (pokemon?.sprites?.other?.home?.front_default || pokemon?.sprites?.other?.['official-artwork']?.front_default)) || pokemon?.sprites?.other?.home?.front_default || pokemon?.sprites?.other?.['official-artwork']?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${isShiny ? 'shiny/' : ''}${pokemon?.id}.png`}
                                                      alt={pokemon?.name}
                                                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                                                      referrerPolicy="no-referrer"
                                                      onError={(e) => (e.currentTarget.style.display = 'none')}
                                                    />
                                                  </div>
                                                  <span className={cn("text-[9px] font-bold uppercase truncate w-16 tracking-tighter", isLightMode ? "text-cyan-700" : "text-cyan-400")}>{pokemon?.name}</span>
                                                </div>
                                                <div className="text-amber-500 font-black italic text-lg sm:text-2xl">VS</div>
                                                <div className="flex flex-col items-center gap-1">
                                                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-950 border-2 border-red-500/30 flex items-center justify-center overflow-hidden">
                                                    <img
                                                      src={(isOpponentShiny ? (battleOpponent?.sprites?.other?.home?.front_shiny || battleOpponent?.sprites?.other?.['official-artwork']?.front_shiny) : (battleOpponent?.sprites?.other?.home?.front_default || battleOpponent?.sprites?.other?.['official-artwork']?.front_default)) || battleOpponent?.sprites?.other?.home?.front_default || battleOpponent?.sprites?.other?.['official-artwork']?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${isOpponentShiny ? 'shiny/' : ''}${battleOpponent?.id}.png`}
                                                      alt={battleOpponent?.name}
                                                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                                                      referrerPolicy="no-referrer"
                                                      onError={(e) => (e.currentTarget.style.display = 'none')}
                                                    />
                                                  </div>
                                                  <span className={cn("text-[9px] font-bold uppercase truncate w-16 tracking-tighter", isLightMode ? "text-red-700" : "text-red-400")}>{battleOpponent?.name}</span>
                                                </div>
                                              </div>

                                              {chaosPhase === 'selecting_pokemon' ? (
                                                <div className="space-y-3">
                                                  <p className="text-[9px] text-slate-400 italic">Pokemon selected. Now get some random moves!</p>
                                                  <button 
                                                    onClick={async () => {
                                                      if (!pokemon || !battleOpponent) return;
                                                      sounds.scan(); playHaptic('light');
                                                      
                                                      // Advanced Competitive Moveset Randomization (Offline Optimized)
                                                      setSelectedMoves(generateCompetitiveMoveset(pokemon, selectedMoves));
                                                      if (battleOpponent) {
                                                        setOpponentMoves(generateCompetitiveMoveset(battleOpponent, opponentMoves, pokemon));
                                                      }
                                                      setChaosPhase('moves_ready');
                                                    }}
                                                    className="w-full py-3 sm:py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-hud text-[10px] font-black tracking-[0.2em] rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)] group flex items-center justify-center gap-2"
                                                  >
                                                    <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                                                    Random Moves
                                                  </button>
                                                </div>
                                              ) : (
                                                <div className="space-y-4">
                                                  <button
                                                    onClick={() => setIsMoveModalOpen(true)}
                                                    className="w-full py-2 bg-slate-800 border border-cyan-500/50 text-cyan-300 rounded-lg font-hud text-xs uppercase hover:bg-slate-700 transition-all"
                                                  >
                                                    View Moves ({selectedMoves.length})
                                                  </button>
                                                  <MoveModal 
                                                    isOpen={isMoveModalOpen} 
                                                    onClose={() => setIsMoveModalOpen(false)} 
                                                    moves={selectedMoves} 
                                                    onMoveClick={() => setIsMoveModalOpen(false)}
                                                    isLightMode={isLightMode}
                                                    typeColors={typeColors}
                                                  />
                                                  <div className="flex gap-2">
                                                    <button 
                                                      onClick={() => {
                                                        if (!pokemon || !battleOpponent) return;
                                                        const getLv50 = (stats: any[], statName: string) => {
                                                          const base = stats.find((s: any) => s.stat.name === statName)?.base_stat || 50;
                                                          return isChaosModeActive ? (statName === 'hp' ? base + 75 : base + 20) : base;
                                                        };
                                                        
                                                        const pMax = getLv50(pokemon.stats, 'hp');
                                                        const oMax = getLv50(battleOpponent.stats, 'hp');
                                                        const pSpeed = getLv50(pokemon.stats, 'speed');
                                                        const oSpeed = getLv50(battleOpponent.stats, 'speed');
                                                        
                                                        setPokemonMaxHP(pMax);
                                                        setPokemonHP(pMax);
                                                        setOpponentMaxHP(oMax);
                                                        setOpponentHP(oMax);
                                                        setTurnNumber(1);
                                                        sounds.battleStart(); playHaptic('heavy');
                                                        setBattleLog([{ text: 'Starting Chaos Match...', type: 'critical' }]);
                                                        setBattleState('battling');
                                                        setIsBattling(true);
                                                        setIsChaosMatchSetup(false);
                                                        setChaosPhase('none');
                                                        const startsFirst = pSpeed >= oSpeed ? 'player' : 'opponent';
                                                        setTimeout(() => setTurn(startsFirst), 500);
                                                      }}
                                                      className="flex-[2] py-3 bg-cyan-600 hover:bg-cyan-500 font-hud text-[10px] font-black tracking-widest rounded-xl transition-all active:scale-95 shadow-[0_4px_20px_rgba(8,145,178,0.4)]"
                                                    >
                                                      Start Match
                                                    </button>
                                                  </div>
                                                </div>
                                              )}
                                              </motion.div>
                                            </motion.div>
                                          )}
        </AnimatePresence>

                                         {/* Centered Initiate Battle Trigger embedded on the Arena border (Responsive for Mobile, Tablet & PC) */}
                                         {!isBattling && (
                                           <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center justify-center max-w-[92%]">
                                             <button
                                               onClick={runBattle}
                                               disabled={selectedMoves.length === 0 || !battleOpponent}
                                               className={cn(
                                                 "px-3.5 xs:px-5 sm:px-7 py-1.5 xs:py-2 sm:py-2.5 bg-red-700/90 hover:bg-red-600 text-white font-hud rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5),0_0_10px_rgba(0,0,0,0.8)] transition-all text-[9.5px] xs:text-[10.5px] sm:text-xs uppercase tracking-wider xs:tracking-widest border-2 border-red-400/80 font-black flex items-center gap-1.5 sm:gap-2 active:scale-95 cursor-pointer btn-breathe-red whitespace-nowrap backdrop-blur-md",
                                                 (selectedMoves.length === 0 || !battleOpponent) && "opacity-60 cursor-not-allowed bg-slate-900 border-slate-700 text-slate-400 font-medium shadow-none hover:bg-slate-900"
                                               )}
                                             >
                                               <Zap className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-yellow-300 animate-bounce shrink-0" />
                                               <span className="truncate">
                                                 {!battleOpponent ? "SELECT OPPONENT FIRST" : selectedMoves.length === 0 ? "EQUIP AT LEAST 1 MOVE" : "START BATTLE"}
                                               </span>
                                             </button>
                                           </div>
                                         )}
                                       </motion.div>
                                       </BattleErrorBoundary>
                                      <AnimatePresence>
                                         {isBattling && turn === 'player' && !isAnimating && (
                                        <motion.div
                                           key="battle-action-bar-holder"
                                           initial={{ opacity: 0, y: 25, scale: 0.98 }}
                                           animate={{ opacity: 1, y: 0, scale: 1 }}
                                           exit={{ opacity: 0, y: 25, scale: 0.98 }}
                                           transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                           className="mt-1 sm:mt-2 shrink-0 w-full bg-slate-950/60 backdrop-blur-sm rounded-xl p-2 border border-cyan-500/20 shadow-xl relative z-20 flex flex-col gap-2"
                                         >
                                          <HUDCorners />
                                          <div className="flex justify-between items-center px-1">
                                            <span className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-[0.2em] font-bold">Moveset</span>
                                            <div className="flex items-center gap-2">
                                            
                                            <button
                                               onClick={() => { sounds.scan(); playHaptic('light'); setPendingAction('flee'); setShowExitConfirmation(true); }}
                                               onMouseEnter={() => sounds.hover()}
                                               className="py-1 px-3 rounded text-[9px] border border-red-900/40 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/30 hover:border-red-500/30 active:scale-95 font-hud font-black uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                                             >
                                               QUIT
                                             </button>
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-2 gap-2 relative z-10 w-full">
                                            {selectedMoves.map((move, i) => {
                                              const opponentTypes = battleOpponent?.types?.map((t: any) => t.type.name) || [];
                                              const effectiveness = getTypeEffectiveness(move.type, opponentTypes);
                                              
                                              let effectivenessLabel = '';
                                              let effectivenessBadgeColor = 'bg-slate-800 border-slate-700 text-slate-400';
                                              if (effectiveness > 1) {
                                                effectivenessLabel = `x${effectiveness}`;
                                                effectivenessBadgeColor = 'bg-green-950/80 border-green-500/30 text-green-400';
                                              } else if (effectiveness < 1 && effectiveness > 0) {
                                                effectivenessLabel = `x${effectiveness}`;
                                                effectivenessBadgeColor = 'bg-red-950/80 border-red-500/30 text-red-400';
                                              } else if (effectiveness === 0) {
                                                effectivenessLabel = `x0`;
                                                effectivenessBadgeColor = 'bg-slate-900 border-slate-850 text-slate-500';
                                              }
                                              const isOutOfPP = (move.currentPP ?? move.pp) === 0;
                                              
                                              return (
                                                <button
                                                  key={`${move.name}-${i}`}
                                                  onClick={() => {
                                                    if (!isOutOfPP) {
                                                      handlePlayerMove(move);
                                                      setIsCombatMoveModalOpen(false);
                                                    }
                                                  }}
                                                  onMouseEnter={() => sounds.hover()}
                                                  disabled={isOutOfPP}
                                                  className={cn(
                                                    "w-full text-left p-2 rounded-lg border transition-all relative overflow-hidden flex flex-col gap-1 cursor-pointer",

                                                    isOutOfPP
                                                       ? "bg-slate-950/60 text-slate-600 border-slate-900/60 cursor-not-allowed opacity-40"
                                                       : cn(
                                                          "hover:scale-[1.02] active:scale-98 shadow-sm",
                                                          getMoveButtonClasses(move.type)
                                                        )
                                                  )}
                                                >

                                                  <div className="flex justify-between items-start w-full gap-1">
                                                    <div className="flex flex-col min-w-0">
                                                      <span className="text-[9px] sm:text-[10px] font-hud font-black uppercase tracking-wider truncate">
                                                        {move.name.replace('-', ' ')}
                                                      </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                      {effectivenessLabel && (
                                                        <span className={cn("text-[7px] font-mono font-bold px-1 rounded border uppercase", effectivenessBadgeColor)}>
                                                          {effectivenessLabel}
                                                        </span>
                                                      )}
                                                      {move.power && (
                                                        <span className="text-[7px] font-mono font-bold bg-black/30 px-1 rounded">
                                                          {move.power}
                                                        </span>
                                                      )}
                                                    </div>
                                                  </div>
                                                  <div className="flex items-center justify-between w-full">
                                                    <span className="text-[7px] font-mono opacity-80 uppercase">
                                                      {move.type}
                                                    </span>
                                                    <span className={cn(
                                                      "text-[7px] font-mono font-bold",
                                                      isOutOfPP ? "text-red-500" : "text-white/80"
                                                    )}>
                                                      PP {move.currentPP ?? move.pp}/{move.pp}
                                                    </span>
                                                  </div>
                                                </button>
                                              );
                                            })}
                                          </div>
                                         </motion.div>
                                       )}
        </AnimatePresence>

                                      </div> {/* End of arenaRef Container */}
                                     </div> {/* End of Left Column Wrapper */}

                                      {/* Right Column: logs, tactical advice, records, and setup */}
                                      <div className="lg:col-span-4 flex flex-col gap-4 w-full min-w-0 select-none pb-0 z-20">
                                        <AnimatePresence>
                                          {isBattling && <BattleLog log={battleLog} enableAnimations={enableAnimations} turn={turn || 'player'} isBattling={isBattling} />}
        </AnimatePresence>

                                     
                                     {/* AI Coach Tactical Advice Panel - Displayed directly inside the Combat Arena */}
                                     {isBattling && (isAiSuggesting || battleSuggestion) && (
                                       <motion.div 
                                         initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                         animate={{ opacity: 1, scale: 1, y: 0 }}
                                         className="bg-slate-950/95 rounded-xl border border-purple-500/30 p-3 sm:p-4 text-[10px] sm:text-[11px] leading-relaxed relative overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.15)] select-text my-2"
                                       >
                                         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
                                         <div className="flex justify-between items-center mb-2 border-b border-purple-900/40 pb-2">
                                           <div className="flex items-center gap-1.5">
                                             <div className={cn("w-1.5 h-1.5 rounded-full", isAiSuggesting ? "bg-purple-400 animate-pulse shadow-[0_0_8px_rgba(192,132,252,0.6)]" : "bg-purple-500")} />
                                             <span className="text-[10px] font-black uppercase tracking-[0.15em] font-hud text-purple-300">
                                               AI Strategist
                                              </span>
                                            </div>
                                            <button 
                                              onClick={() => setBattleSuggestion(null)}
                                              className="text-[8px] font-hud bg-purple-950/40 border border-purple-900/50 hover:bg-purple-900/60 text-purple-400 hover:text-purple-300 transition-colors uppercase font-bold px-2 py-0.5 rounded cursor-pointer"
                                            >
                                              DISMISS
                                            </button>
                                          </div>
                                          
                                          {isAiSuggesting ? (
                                            <div className="py-4 flex flex-col items-center justify-center gap-2">
                                              <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                                              <span className="text-[9px] font-mono text-purple-400/80 uppercase tracking-widest animate-pulse">Running Neural Simulation...</span>
                                            </div>
                                          ) : (
                                            <div className="text-purple-100 font-sans text-[11px] leading-relaxed select-text space-y-2 markdown-body prose prose-invert prose-p:text-purple-100 prose-headings:text-purple-300 prose-strong:text-purple-300">
                                              <Markdown>
                                                {battleSuggestion || ""}
                                              </Markdown>
                                            </div>
                                          )}
                                       </motion.div>
                                     )}
                                      <div className={cn("flex flex-col justify-center", !isBattling ? "flex-1" : "flex-initial mt-4")}>
                                        {/* Collapsible Arena Records & Medals panel toggler */}
                                        {!isBattling && (
                                        <div className="border border-slate-800/85 bg-slate-950/45 rounded-xl overflow-hidden mb-4 shrink-0 transition-all z-10 relative">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setIsBattleHistoryExpanded(!isBattleHistoryExpanded);
                                              sounds.scan(); playHaptic('light');
                                            }}
                                            className="w-full flex items-center justify-between px-3.5 py-2 sm:py-2.5 bg-slate-900/45 hover:bg-slate-900/75 transition-all font-hud text-[9.5px] tracking-widest text-slate-400 hover:text-cyan-400 font-bold uppercase cursor-pointer"
                                          >
                                            <div className="flex items-center gap-1.5">
                                              <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                              <span>ARENA RECORDS</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <span className="text-[7.5px] opacity-65 font-mono">
                                                {isBattleHistoryExpanded ? "COLLAPSE" : "EXPAND"}
                                              </span>
                                              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", isBattleHistoryExpanded ? "rotate-180" : "rotate-0")} />
                                            </div>
                                          </button>
                                          
                                          {isBattleHistoryExpanded && (
                                            <div className="p-3 border-t border-slate-900/55 ">
                                              <BattleHistory isLightMode={isLightMode} />
                                            </div>
                                          )}
                                        </div>
                                        )}
                                        <AnimatePresence mode="wait">
                                          {!isBattling ? (
                                            <motion.div
                                              key="arena-setup"
                                              initial={{ opacity: 0, scale: 0.98, y: 15 }}
                                              animate={{ opacity: 1, scale: 1, y: 0 }}
                                              exit={{ opacity: 0, scale: 0.98, y: -15 }}
                                              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                              className="space-y-4 bg-slate-900/50 p-4 rounded-xl border border-cyan-900/30"
                                            >
                                          <div className="flex flex-col gap-3">
                                            <button
                                              disabled={loadingPokemon}
                                              onClick={async () => {
                                                setLoadingPokemon(true);
                                                try {
                                                  // 1. Random Player Pokemon
                                                  const playerBaseId = Math.floor(Math.random() * 1025) + 1;
                                                  const basePlayer = await searchPokemon(playerBaseId.toString());
                                                  let finalPlayer = basePlayer;
                                                  
                                                  if (basePlayer.varieties && basePlayer.varieties.length > 1 && Math.random() < 0.6) {
                                                    const pool = basePlayer.varieties;
                                                    const varietyIndex = Math.floor(Math.random() * pool.length);
                                                    finalPlayer = await searchPokemon(pool[varietyIndex].pokemon?.name);
                                                  }
                                                  setPokemon(finalPlayer);
                                                  setIsShiny(Math.random() < 0.1); 
                                                  setIsFemale(Math.random() < 0.5);
                                                  setAttackerAnimation('none');
                                                  
                                                  // 2. Random Opponent Pokemon
                                                  const oppBaseId = Math.floor(Math.random() * 1025) + 1;
                                                  const baseOpponent = await searchPokemon(oppBaseId.toString());
                                                  let finalOpponent = baseOpponent;
                                                  
                                                  if (baseOpponent.varieties && baseOpponent.varieties.length > 1 && Math.random() < 0.8) {
                                                    const interestingVarieties = baseOpponent.varieties.filter(v => 
                                                      v.pokemon?.name?.includes('-mega') || v.pokemon?.name?.includes('-gmax') || v.pokemon?.name?.includes('-alola') || v.pokemon?.name?.includes('-galar') || v.pokemon?.name?.includes('-hisui') || v.pokemon?.name?.includes('-primal')
                                                    );
                                                    const pool = interestingVarieties.length > 0 ? interestingVarieties : baseOpponent.varieties;
                                                    const varietyIndex = Math.floor(Math.random() * pool.length);
                                                    finalOpponent = await searchPokemon(pool[varietyIndex].pokemon?.name);
                                                  }
                                                  
                                                  setBattleOpponent(finalOpponent);
                                                  setIsOpponentShiny(Math.random() < 0.1);
                                                  setIsOpponentFemale(Math.random() < 0.5);
                                                  setDefenderAnimation('none');
                                                  setIsSelectingOpponent(false);
                                                  
                                                  // Reset moves for manual chaos randomization later
                                                  setSelectedMoves([]);
                                                  setOpponentMoves([]);
                                                  
                                                  setBattleState('setup');
                                                  setIsChaosMatchSetup(true);
                                                  setChaosPhase('selecting_pokemon');
                                                   setIsChaosModeActive(true);
                                                  handleTabChange('battle');
                                                  
                                                  sounds.scan(); playHaptic('light');
                                                  setBattleLog([{ text: 'CHAOS SETUP INITIATED. SELECT MOVES.', type: 'critical' }]);
                                                } catch (err) {
                                                  console.error("Failed to setup chaos match", err);
                                                } finally {
                                                  setLoadingPokemon(false);
                                                }
                                              }}
                                              className={cn("w-full relative py-4 group overflow-hidden rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.2)]", loadingPokemon && "opacity-50 cursor-not-allowed")}
                                            >
                                              <div className="absolute inset-0 bg-gradient-to-r from-cyan-950 via-blue-900/40 to-cyan-950 border-2 border-cyan-400 group-hover:border-white transition-colors" />
                                              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                                              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent via-cyan-400/10 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000" />
                                              
                                              <div className="relative flex items-center justify-center gap-3">
                                                <span className="text-white font-hud text-xs sm:text-sm font-black tracking-[0.3em] uppercase drop-shadow-[0_0_5px_rgba(34,211,238,1)]">
                                                  Chaos Mode
                                                </span>
                                              </div>

                                              <HUDCorners />
                                              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-400/50 shadow-[0_-2px_8px_rgba(34,211,238,0.5)]" />
                                            </button>

                                            <button
                                              onClick={async () => {
                                                setLoadingPokemon(true);
                                                try {
                                                  const randomBaseId = Math.floor(Math.random() * 1025) + 1;
                                                  const baseOpponent = await searchPokemon(randomBaseId.toString());
                                                  
                                                  let finalOpponent = baseOpponent;
                                                  if (baseOpponent.varieties && baseOpponent.varieties.length > 1 && Math.random() < 0.8) {
                                                    const pool = baseOpponent.varieties;
                                                    const varietyIndex = Math.floor(Math.random() * pool.length);
                                                    finalOpponent = await searchPokemon(pool[varietyIndex].pokemon?.name);
                                                  }
                                                  setBattleOpponent(finalOpponent);
                                                  setIsOpponentShiny(Math.random() < 0.05);
                                                  setDefenderAnimation('none');
                                                  setIsSelectingOpponent(false);

                                                  // Randomize Opponent Moves
                                                  setOpponentMoves(generateCompetitiveMoveset(finalOpponent, [], pokemon));

                                                  
                                                  sounds.scan(); playHaptic('light');
                                                  handleTabChange('battle');
                                                } catch (err) {
                                                  console.error("Failed to fetch random opponent", err);
                                                } finally {
                                                  setLoadingPokemon(false);
                                                }
                                              }}
                                              className={cn("w-full relative py-4 group overflow-hidden rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.2)]", loadingPokemon && "opacity-50 cursor-not-allowed")}
                                              disabled={loadingPokemon}
                                            >
                                              <div className="absolute inset-0 bg-gradient-to-r from-purple-950 via-indigo-900/40 to-purple-950 border-2 border-purple-500 group-hover:border-white transition-colors" />
                                              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                                              <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-purple-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                              
                                              <div className="relative flex items-center justify-center gap-3">
                                                <span className="text-white font-hud text-xs sm:text-sm font-black tracking-[0.3em] uppercase drop-shadow-[0_0_5px_rgba(168,85,247,1)]">
                                                  Random Opponent
                                                </span>
                                              </div>

                                              <HUDCorners />
                                              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-purple-400/50 shadow-[0_-2px_8px_rgba(168,85,247,0.5)]" />
                                            </button>
                                          </div>
                                          <div className="space-y-2">
                                            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 mb-2">
                                              <span className="text-[10px] font-bold tracking-wider text-cyan-700 font-hud uppercase tracking-widest">Select 4 Moves</span>
                                              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                                                <button
                                                  type="button"
                                                  onClick={(e) => { e.stopPropagation();
                                                    setShowCombatOptionsCompare(!showCombatOptionsCompare);
                                                    sounds.scan(); playHaptic('light');
                                                  }}
                                                  className={cn(
                                                    "border rounded px-1.5 py-0.5 flex items-center gap-1 transition-colors active:scale-95 text-[9px] font-bold uppercase tracking-widest cursor-pointer",
                                                    showCombatOptionsCompare 
                                                      ? "bg-amber-600/40 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]" 
                                                      : "bg-slate-900 border-slate-700 text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800"
                                                  )}
                                                >
                                                  <Swords className="w-2.5 h-2.5" />
                                                  {showCombatOptionsCompare ? "Show Moves List" : "Compare Combat Options"}
                                                </button>

                                                <button
                                                  type="button"
                                                  onClick={(e) => { e.stopPropagation();
                                                    setSelectedMoves(generateCompetitiveMoveset(pokemon, selectedMoves));
                                                    sounds.scan(); playHaptic('light');
                                                  }}
                                                  className="bg-cyan-900/40 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 rounded px-1.5 py-0.5 flex items-center gap-1 transition-colors active:scale-95 text-[9px] font-bold uppercase tracking-widest cursor-pointer"
                                                >
                                                  <RefreshCw className="w-2 h-2" />
                                                  Random
                                                </button>
                                                <div className="flex items-center gap-1 shrink-0 bg-slate-950/80 px-1 py-0.5 rounded border border-cyan-900/50">
                                                  <span className="text-[7px] text-cyan-600 sm:hidden uppercase font-black">SEL:</span>
                                                  <span className={cn(selectedMoves.length === 4 ? "text-green-400" : "text-cyan-400", "font-mono font-bold text-[9px]")}>
                                                    {selectedMoves.length}/4
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            
                                            {showCombatOptionsCompare ? (
                                              /* COMBAT OPTIONS TAC-ANALYSIS MATRIX grid list */
                                              <div className="bg-slate-950/90 border border-slate-800/80 rounded-xl p-3 space-y-3 ">
                                                {!battleOpponent ? (
                                                  <div className="text-center py-6 text-slate-500 text-[10px] uppercase font-mono tracking-wider animate-pulse">
                                                    ‚ö†Ô∏è Select a battle opponent to enable tactical combat options comparison.
                                                  </div>
                                                ) : selectedMoves.length === 0 ? (
                                                  <div className="text-center py-6 text-slate-500 text-[10px] uppercase font-mono tracking-wider animate-pulse">
                                                    ‚öîÔ∏è Select at least one active move to compare combat options against {battleOpponent?.name?.toUpperCase()}.
                                                  </div>
                                                ) : (
                                                  <div className="space-y-3">
                                                    <div className="flex justify-between items-center text-[8px] sm:text-[9.5px] font-hud text-cyan-500 border-b border-cyan-500/10 pb-1.5">
                                                      <span>MOVE EFFECTIVENESS SUMMARY</span>
                                                      <span className="font-mono text-[7px] text-slate-500">{pokemon.name.toUpperCase()} vs {battleOpponent.name.toUpperCase()}</span>
                                                    </div>
                                                     <div className="flex flex-col gap-2">
                                                       {selectedMoves.map((move, i) => {
                                                        const isStab = pokemon.types.some((t: any) => t.type.name.toLowerCase() === move.type.toLowerCase());
                                                        const oppTypes = battleOpponent.types.map((t: any) => t.type.name);
                                                        
                                                        // Calculate multiplier
                                                        let eff = 1;
                                                        const chart = TYPE_CHART[move.type.toLowerCase()];
                                                        if (chart) {
                                                          oppTypes.forEach((t: string) => {
                                                            const oppTypeStr = t.toLowerCase();
                                                            if (chart[oppTypeStr] !== undefined) {
                                                              eff *= chart[oppTypeStr];
                                                            }
                                                          });
                                                        }

                                                        const textEffectiveness = 
                                                          eff > 1 ? `text-emerald-400 font-black border-emerald-500/30 bg-emerald-950/20` :
                                                          eff === 1 ? `text-slate-400 border-slate-800 bg-slate-900/40` :
                                                          eff > 0 ? `text-amber-400 font-medium border-amber-500/30 bg-amber-950/10` :
                                                          `text-red-400 font-black border-red-500/30 bg-red-950/20`;

                                                        return (
                                                          <div key={`${move.name}-${i}`} className="border border-slate-900 bg-slate-950/30 rounded px-2.5 py-2 flex flex-col gap-1.5">
                                                            <div className="flex justify-between items-center">
                                                              <div className="flex items-center gap-1.5">
                                                                <span className={cn("font-hud uppercase text-[9px] sm:text-[10px] font-black tracking-wide", isLightMode ? "text-slate-900" : "text-cyan-400")}>{move.name.replace('-', ' ')}</span>
                                                                <span className={cn("text-[6px] sm:text-[7px] px-1 py-0.5 rounded font-bold uppercase", typeColors[move.type] || "bg-slate-600")}>
                                                                  {move.type}
                                                                </span>
                                                              </div>
                                                              <div className="flex gap-1 items-center">
                                                                {isStab && <span className="text-[6px] sm:text-[6.5px] font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-1 rounded uppercase tracking-wide">STAB 1.5x</span>}
                                                                <span className={cn("text-[6.5px] sm:text-[7px] border rounded px-1.5 py-0.5 tracking-wider uppercase font-extrabold", textEffectiveness)}>
                                                                  {eff > 1.1 ? `${eff}x Super Effective` : eff === 1 ? '1x Neutral' : eff > 0 ? `${eff}x Resisted` : '0x Immune'}
                                                                </span>
                                                              </div>
                                                            </div>
                                                            
                                                            <div className="flex justify-between items-center gap-2 pt-0.5 text-[6.5px] sm:text-[7.5px] font-mono text-slate-500">
                                                              <div className="flex gap-3">
                                                                <span>POWER: <strong className="text-slate-300">{move.power || 'Status'}</strong></span>
                                                                <span>ACCURACY: <strong className="text-slate-300">{move.accuracy ? `${move.accuracy}%` : '--'}</strong></span>
                                                                <span>PP: <strong className="text-slate-300">{move.pp}</strong></span>
                                                              </div>
                                                              <span className="uppercase text-slate-400 font-semibold text-[6px] sm:text-[7px]">
                                                                {move.power ? `TARGETS ${move.damage_class === 'special' ? 'SPE-DEF' : 'DEFENSE'}` : 'UTILITY SETUP'}
                                                              </span>
                                                            </div>
                                                          </div>
                                                        );
                                                      })}
                                                    </div>
                                                    
                                                    {/* Speed Assessment Showdown indicator badge */}
                                                    {(() => {
                                                        const pSpeed = pokemon.stats.find((s: any) => s.stat.name === 'speed')?.base_stat || 100;
                                                        const oSpeed = battleOpponent.stats.find((s: any) => s.stat.name === 'speed')?.base_stat || 100;
                                                        const speedy = pSpeed >= oSpeed;
                                                        return (
                                                          <div className="bg-slate-900 border border-slate-800 p-2 rounded text-[7.5px] sm:text-[8px] font-mono flex justify-between items-center">
                                                            <span className="text-slate-500 uppercase">PRIORITY ASSESSMENT:</span>
                                                            <span className={cn("font-bold uppercase", speedy ? "text-emerald-400" : "text-amber-500")}>
                                                              {speedy 
                                                                ? `First Strike Secured (Speed: ${pSpeed} vs ${oSpeed})` 
                                                                : `Opponent speed priority (Speed: ${pSpeed} vs ${oSpeed})`}
                                                            </span>
                                                          </div>
                                                        );
                                                    })()}
                                                  </div>
                                                )}
                                              </div>
                                            ) : (
                                              /* WINDOWED LEARNABLE MOVES LIBRARY */
                                              <div className="bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-col gap-2.5 relative max-w-full">
                                                <HUDCorners />
                                                
                                                {/* Header & Quick Filter Input */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-900/40 pb-2">
                                                  <div className="flex items-center gap-2 min-w-0">
                                                    <Swords className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
                                                    <span className="text-[10px] sm:text-xs font-hud font-black text-cyan-400 tracking-wider uppercase truncate">
                                                      LEARNABLE MOVESET LIBRARY
                                                    </span>
                                                    <span className="text-[8.5px] font-mono text-cyan-400 font-bold bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded-full shrink-0">
                                                      {selectedMoves.length} / 4
                                                    </span>
                                                  </div>
                                                </div>

                                                {/* Selected Moves Tray */}
                                                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-900/60 rounded-xl border border-cyan-900/30 min-h-[36px] items-center">
                                                  {selectedMoves.length === 0 ? (
                                                    <span className="text-[9px] font-mono text-slate-500 italic px-1">No moves equipped. Select up to 4 moves from the window below.</span>
                                                  ) : (
                                                    selectedMoves.map((m, idx) => (
                                                      <span 
                                                        key={`${m.name}-${idx}`}
                                                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/50 text-[9px] font-hud font-bold text-cyan-300 uppercase tracking-wider"
                                                      >
                                                        <span>{m.name.replace('-', ' ')}</span>
                                                        <button 
                                                          type="button"
                                                          onClick={() => setSelectedMoves(prev => prev.filter(x => x.name !== m.name))}
                                                          className="text-cyan-500 hover:text-red-400 transition-colors cursor-pointer text-xs"
                                                          title="Remove move"
                                                        >
                                                          ‚úï
                                                        </button>
                                                      </span>
                                                    ))
                                                  )}
                                                </div>

                                                {/* Scrollable Windowed Grid */}
                                                <div className="max-h-56 sm:max-h-64 overflow-y-auto custom-scrollbar optimize-scrolling p-1.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 border border-cyan-900/30 bg-slate-950/80 rounded-xl w-full">
                                                  {pokemon.moves
                                                    .map((move, idx) => {
                                                      const isSelected = selectedMoves.some(m => m.name === move.name);
                                                      return (
                                                        <button
                                                          key={`${move.name}-${idx}`}
                                                          disabled={!isSelected && selectedMoves.length >= 4}
                                                          onClick={() => {
                                                            if (isSelected) {
                                                              setSelectedMoves(prev => prev.filter(m => m.name !== move.name));
                                                            } else if (selectedMoves.length < 4) {
                                                              setSelectedMoves(prev => [...prev, move]);
                                                            }
                                                            sounds.scan(); playHaptic('light');
                                                          }}
                                                          className={cn(
                                                            "text-[9px] font-bold tracking-wider sm:text-[10px] p-2 border rounded-xl flex flex-col items-start gap-1 transition-all group cursor-pointer text-left w-full",
                                                            isSelected 
                                                              ? "bg-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.25)]" 
                                                              : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800",
                                                            !isSelected && selectedMoves.length >= 4 && "opacity-40 cursor-not-allowed"
                                                          )}
                                                        >
                                                          <div className="flex justify-between w-full items-center gap-1">
                                                            <span className={cn("font-hud uppercase tracking-wider truncate", isLightMode ? "text-slate-900 group-hover:text-slate-950" : "text-cyan-300 group-hover:text-white")}>{move.name.replace('-', ' ')}</span>
                                                            <TypeBadge type={move.type} size="xs" />
                                                          </div>
                                                          <div className="flex gap-2.5 text-[8px] font-mono text-slate-400 font-bold">
                                                            <span>PWR: <strong className="text-cyan-400">{move.power || '-'}</strong></span>
                                                            <span>ACC: <strong className="text-cyan-400">{move.accuracy ? `${move.accuracy}%` : '-'}</strong></span>
                                                            <span>PP: <strong className="text-cyan-400">{move.pp}</strong></span>
                                                          </div>
                                                        </button>
                                                      );
                                                  })}
                                                </div>
                                              </div>
                                            )}
                                          </div>

                                        </motion.div>
                                      ) : (
                                        <motion.div
                                          key="arena-active"
                                          initial={{ opacity: 0, scale: 0.98, y: 15 }}
                                          animate={{ opacity: 1, scale: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.98, y: -15 }}
                                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                          className="space-y-4"
                                        >


                                          {/* AI Strategy & Run Buttons */}
                                          {/* AI Strategy & Run Buttons */}
                                          {isBattling && (
<div className="flex gap-2 mb-4 items-center">
                                            <motion.button
                                              whileHover={{ scale: 1.03 }}
                                              whileTap={{ scale: 0.95 }}
                                              onClick={getBattleStrategy}
                                              disabled={isAiSuggesting || !isBattling}
                                              className={cn(
                                                "flex-[3] py-1.5 bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 font-hud rounded-lg border border-purple-500/40 transition-all text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2",
                                                (!isBattling || isAiSuggesting) && "opacity-50 cursor-not-allowed"
                                              )}
                                            >
                                              {isAiSuggesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <BrainCircuit className="w-3 h-3" /> }
                                              AI Strategist
                                            </motion.button>
                                            
                                            <motion.button
                                              whileHover={{ scale: 1.05 }}
                                              whileTap={{ scale: 0.95 }}
                                              onClick={() => { setPendingAction('run'); setShowExitConfirmation(true); }}
                                              disabled={!isBattling}
                                              className={cn(
                                                "flex-1 py-1.5 bg-slate-900 border border-slate-700 text-slate-500 font-hud rounded-lg transition-all text-[9px] font-black uppercase tracking-widest hover:border-red-500/50 hover:text-red-400 active:scale-95 flex items-center justify-center gap-2",
                                                !isBattling && "opacity-50 cursor-not-allowed"
                                              )}
                                            >
                                              <MoveRight className="w-3 h-3" />
                                              Quit
                                            </motion.button>
                                          </div>
)}



                                        </motion.div>
                                      )}
        </AnimatePresence>
                                    </div> {/* End of flex container */}
                                      </div> {/* End of Right Column */}
                                    </div>
                                  </motion.div>
                                )}
        </AnimatePresence>
                            </motion.div>

                            {/* Floating Scroll to Top button for details container */}
                            <button
                              type="button"
                              onClick={() => {
                                detailsContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                                sounds.scan(); playHaptic('light');
                              }}
                              className={cn(
                                "absolute bottom-6 right-6 z-50 p-3 rounded-full bg-slate-950/90 border-2 border-cyan-500/50 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center cursor-pointer shadow-lg group duration-150 ease-out",
                                (showDetailsScrollTop && activeTab !== 'chat') ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-75 pointer-events-none"
                              )}
                              title="Scroll to Top"
                            >
                              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })(pokemon, isShiny, isFemale, performSearch, setIsShiny, setIsFemale)
                ) : listMode === 'home' ? (
                      <motion.div
                        key="home"
                        initial={{ opacity: 0, scale: 0.98, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -12 }}
                        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-1 flex flex-col items-center justify-center gap-2 sm:gap-4 md:gap-2.5 lg:gap-3 py-2 sm:py-4 md:py-2 px-3 sm:px-4 text-center relative overflow-y-auto md:overflow-y-hidden custom-scrollbar md:scrollbar-none optimize-scrolling select-none w-full h-full my-auto max-w-5xl mx-auto min-h-0"
                      >
                        {/* Top-Right Corner Avatar with Interactive Selector */}
                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 flex flex-col items-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAvatarModalOpen(true);
                              try { sounds.boot(); } catch(e) {}
                            }}
                            className="relative flex items-center justify-center shrink-0 group hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                            title="Change Trainer Avatar"
                          >
                            <div className="absolute inset-0 rounded-2xl bg-cyan-400/10 filter blur-sm group-hover:bg-cyan-400/20 transition-all pointer-events-none"></div>
                            <img 
                              src={`https://play.pokemonshowdown.com/sprites/trainers/${currentAvatar.id}.png`} 
                              alt={currentAvatar.name}
                              className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 lg:w-22 lg:h-22 object-contain drop-shadow-[0_2px_10px_rgba(34,211,238,0.3)] [image-rendering:pixelated] relative z-10"
                            />
                          </button>
                          <div className="text-right hidden xs:flex flex-col items-end -mt-1">
                            <span className="font-hud font-bold text-[9px] sm:text-[10px] text-cyan-300 uppercase tracking-widest leading-none drop-shadow">
                              {currentAvatar.name}
                            </span>
                            <span className="text-[7px] sm:text-[8px] font-mono text-cyan-400/75 tracking-wider uppercase leading-none mt-0.5">
                              {currentAvatar.role}
                            </span>
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 to-transparent pointer-events-none"></div>
                        
                        <motion.div 
                          className="relative w-44 h-44 xxs:w-52 xxs:h-52 xs:w-64 xs:h-64 sm:w-72 sm:h-72 md:w-60 md:h-60 lg:w-68 lg:h-68 flex items-center justify-center shrink max-h-[28vh] sm:max-h-[34vh] md:max-h-[26vh] lg:max-h-[28vh] -mt-1 sm:-mt-3 md:mt-0 mb-1 sm:mb-2 md:mb-0.5"
                          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                          <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 75%)' }}></div>
                          <PokethologyLogo className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]" />
                        </motion.div>

                        <div className="flex flex-col gap-1 sm:gap-2 md:gap-1.5 relative z-10 shrink-0 w-full max-w-4xl px-2 sm:px-4">
                          <h1 className={cn("flex flex-row flex-wrap items-center justify-center gap-1.5 sm:gap-3 lg:gap-4 text-3xl xxs:text-4xl xs:text-5xl sm:text-6xl md:text-5xl lg:text-6xl font-hud font-black tracking-normal sm:tracking-[0.05em] leading-tight text-center w-full break-words py-0.5 px-1 overflow-visible font-extrabold", isLightMode ? 'text-slate-900' : 'bg-gradient-to-r from-cyan-400 via-purple-300 to-cyan-400 text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]')}>
                            <span className="inline-block py-0.5 whitespace-nowrap">POK√âTHOLOGY</span>
                            <span className="text-cyan-400 text-2xl xxs:text-3xl xs:text-4xl sm:text-5xl md:text-4xl lg:text-5xl font-black text-glow inline-block py-0.5 ml-1" style={{ textShadow: isLightMode ? 'none' : '0 0 16px rgba(34,211,238,0.7)' }}>OS</span>
                          </h1>
                          <p className="font-serif italic text-xs xxs:text-sm xs:text-base sm:text-lg md:text-base lg:text-lg text-cyan-400 select-none px-4 mt-0.5 tracking-wider whitespace-normal break-words text-center drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                            Where dreams and adventures begin!
                          </p>
                          
                          <div className="flex justify-center items-center mt-2 sm:mt-4 md:mt-2.5 lg:mt-3 w-full max-w-md mx-auto px-4">
                            <motion.button
                              disabled={isInitializingDb}
                              whileHover={isInitializingDb ? {} : { scale: 1.04, boxShadow: "0 0 30px rgba(34,211,238,0.7)" }}
                              whileTap={isInitializingDb ? {} : { scale: 0.96 }}
                              transition={{ type: "spring", stiffness: 220, damping: 14 }}
                              onClick={async () => {
                                if (isInitializingDb) return;
                                setIsInitializingDb(true);
                                setQuery('');
                                setInputValue('');
                                setLastSearched('');
                                setListMode('pokemon');
                                setCurrentGenId(1);
                                setViewAllGenerations(false);
                                setPokemon(null);
                                setBattleOpponent(null);
                                resetSimulation();
                                sounds.boot(); playHaptic('medium');
                                try {
                                  await loadAllPokemon(1, false);
                                  await new Promise(resolve => setTimeout(resolve, 1400));
                                } finally {
                                  setIsInitializingDb(false);
                                }
                              }}
                              className={cn(hudButtonClass(false, 'cyan'), "animate-btn-entrance w-full px-6 py-3 sm:px-8 sm:py-4 md:py-3.5 !text-[13px] sm:!text-[15px] md:!text-[16px] !rounded-2xl border-2 border-cyan-400/80 shadow-[0_0_25px_rgba(34,211,238,0.45)] font-black tracking-[0.2em] group/init relative overflow-hidden flex flex-col items-center justify-center gap-1 cursor-pointer", isInitializingDb && "opacity-95 cursor-wait")}
                            >
                              {isInitializingDb && (
                                <motion.div 
                                  initial={{ width: "0%" }}
                                  animate={{ width: "100%" }}
                                  transition={{ duration: 1.4, ease: "easeInOut" }}
                                  className="absolute inset-0 bg-cyan-500/35 z-0 pointer-events-none"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/init:translate-x-full transition-transform duration-1000 ease-in-out" />
                              <div className="flex items-center justify-center gap-3 z-10">
                                {isInitializingDb ? (
                                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-cyan-200 shrink-0" />
                                ) : (
                                  <Cpu className="w-5 h-5 sm:w-6 sm:h-6 group-hover/init:rotate-12 transition-transform shrink-0 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                                )}
                                <span className="text-cyan-100 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">{isInitializingDb ? "STARTING SYSTEM..." : "START APP"}</span>
                              </div>
                              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-cyan-300/80 z-10 font-normal uppercase">
                                {isInitializingDb ? "Loading Dex Registry & Generation I" : "Enter into Pok√©thology World"}
                              </span>
                            </motion.button>
                          </div>

                          {/* Home Screen Copyright & Legal Disclaimer Toggle */}
                          <div className="flex flex-col items-center justify-center mt-2 sm:mt-4 md:mt-2.5 lg:mt-3 mb-1 select-none px-2">
                            <DisclaimerButton onClick={() => setIsDisclaimerOpen(true)} variant="pill" />
                          </div>
                        </div>
                      </motion.div>
                    ) : listMode === 'types' ? (
                      <motion.div
                        key="types"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col p-6 overflow-hidden"
                      >
                        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-2">
                          <h2 className="text-xl font-hud tracking-widest uppercase">Type Analysis</h2>
                          <button 
                            onClick={() => setListMode('home')}
                            className={cn(hudButtonClass(false, 'cyan'), "!py-1 !px-3 !text-[10px] font-bold tracking-wider")}
                          >
                            <HUDCorners />
                            Back
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 ">
                          {Object.keys(typeColors).map((type) => (
                            <button
                              key={`typebtn-${type}`}
                              onClick={() => {
                                setQuery(type);
                                setInputValue(type);
                                setListMode('pokemon');
                                sounds.scan(); playHaptic('light');
                              }}
                              className={cn(
                                "p-4 rounded-lg transition-all hover:scale-105 hover:shadow-lg flex flex-col items-center gap-2 group",
                                typeColors[type]
                              )}
                            >
                              <span className="text-white font-hud text-xs uppercase tracking-widest" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{type}</span>
                              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                <div className="w-full h-full bg-white/40 animate-pulse" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ) : (listMode === 'pokemon' || isSelectingOpponent) ? (
                      <motion.div 
                        key="pokemon-list"
                        initial={{ opacity: 0, scale: 0.985, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.985, y: -15 }}
                        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-1 bg-transparent relative overflow-hidden flex flex-col p-1 sm:p-2 w-full max-w-[1920px] mx-auto lg:px-4 xl:px-6"
                      >
                        <div className="relative z-10 shrink-0">
                          <div className="flex flex-col gap-2.5 mb-2.5 border-b border-cyan-900/50 pb-2.5 shrink-0">
                            <div className="flex justify-between items-center px-2 py-2">
                              <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                                <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center shrink-0">
                                  <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)' }}></div>
                                  <PokethologyLogo className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(6,182,212,0.35)]" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <h1 className="text-base xxs:text-lg xs:text-xl sm:text-2xl md:text-3xl font-hud font-black bg-gradient-to-r from-cyan-400 via-purple-300 to-cyan-400 text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(6,182,212,0.4)] tracking-[0.12em] xs:tracking-[0.15em] sm:tracking-[0.2em] leading-none">
                                    POK√âTHOLOGY
                                  </h1>
                                  <span className="font-serif italic text-xs xs:text-sm sm:text-base text-cyan-400/90 tracking-wider mt-2 leading-none">
                                    Where dreams and adventures begin!
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <button
                                  onClick={() => { setIsAvatarModalOpen(true); try { sounds.boot(); } catch(e){} }}
                                  className="relative flex items-center justify-center shrink-0 group hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                                  title="Change Trainer Avatar"
                                >
                                  <div className="absolute inset-0 rounded-2xl bg-cyan-500/10 filter blur-md group-hover:bg-cyan-500/25 transition-all"></div>
                                  <img 
                                    src={`https://play.pokemonshowdown.com/sprites/trainers/${currentAvatar.id}.png`} 
                                    alt={currentAvatar.name}
                                    className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain drop-shadow-[0_5px_16px_rgba(34,211,238,0.5)] [image-rendering:pixelated] relative z-10"
                                  />
                                </button>
                                <div className="text-right hidden sm:flex flex-col items-end -mt-1">
                                  <span className="font-hud font-bold text-[9px] sm:text-[10px] text-cyan-300 uppercase tracking-widest leading-none drop-shadow">
                                    {currentAvatar.name}
                                  </span>
                                  <span className="text-[7px] sm:text-[8px] font-mono text-cyan-400/75 tracking-wider uppercase leading-none mt-0.5">
                                    {currentAvatar.role}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Sliding Pop-up Dual Triggers for Daily Scans & Theological Exam */}
                            <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 mt-1 sm:mt-1.5 px-2 shrink-0 relative z-10">
                              {/* Daily Scans Button */}
                              <motion.button
                                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(245,158,11,0.3)" }}
                                whileTap={{ scale: 0.97 }}
                                type="button"
                                onClick={() => {
                                  setIsDailyScanOpen(true);
                                  sounds.boot(); playHaptic('medium');
                                }}
                                className={cn(
                                  hudButtonClass(isDailyScanOpen, 'amber'),
                                  "!py-1.5 !px-3.5 sm:!px-4.5 font-hud font-black tracking-[0.08em] uppercase flex items-center justify-center gap-1.5 sm:gap-2 relative shadow-[0_0_14px_rgba(245,158,11,0.18)] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] text-[9.5px] sm:text-[10.5px] cursor-pointer group overflow-hidden border-amber-500/50 rounded-xl"
                                )}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/25 to-transparent pointer-events-none z-10 animate-scan-shimmer" />
                                <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                                  <Sparkles className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]", isDailyScanOpen ? "text-slate-950 font-black" : "text-amber-400")} />
                                </motion.div>
                                <span className="relative z-10 font-bold whitespace-nowrap">{'DAILY SCANS'}</span>
                                <span className="relative z-10 items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-[6.5px] sm:text-[7px] text-amber-300 font-extrabold tracking-wider uppercase shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.4)] animate-pulse hidden xs:inline-flex">
                                  <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping shrink-0" />
                                  READY
                                </span>
                              </motion.button>

                              {/* Theological Exam Button */}
                              <motion.button
                                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(168,85,247,0.3)" }}
                                whileTap={{ scale: 0.97 }}
                                type="button"
                                onClick={() => {
                                  setIsDailyQuizOpen(true);
                                  sounds.boot(); playHaptic('medium');
                                }}
                                className={cn(
                                  hudButtonClass(isDailyQuizOpen, 'purple'),
                                  "!py-1.5 !px-3.5 sm:!px-4.5 font-hud font-black tracking-[0.08em] uppercase flex items-center justify-center gap-1.5 sm:gap-2 relative shadow-[0_0_14px_rgba(168,85,247,0.18)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] text-[9.5px] sm:text-[10.5px] cursor-pointer group overflow-hidden border-purple-500/50 rounded-xl"
                                )}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/25 to-transparent pointer-events-none z-10 animate-scan-shimmer" />
                                <motion.div animate={{ rotate: 360, scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                                  <BrainCircuit className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 filter drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]", isDailyQuizOpen ? "text-white font-black" : "text-purple-400")} />
                                </motion.div>
                                <span className="relative z-10 font-bold whitespace-nowrap">{'THEORY EXAM'}</span>
                                <span className="relative z-10 items-center gap-1 px-1.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/50 text-[6.5px] sm:text-[7px] text-purple-300 font-extrabold tracking-wider uppercase shrink-0 shadow-[0_0_6px_rgba(168,85,247,0.4)] animate-pulse hidden xs:inline-flex">
                                  <span className="w-1 h-1 rounded-full bg-purple-400 animate-ping shrink-0" />
                                  READY
                                </span>
                              </motion.button>
                            </div>

                            <div className="flex flex-col gap-1 w-full mt-1.5 sm:mt-2">
                              <div className="flex items-center justify-between gap-3 px-2 w-full">
                                <div className="flex overflow-x-auto custom-scrollbar optimize-scrolling sm:flex-wrap gap-2 sm:gap-2.5 pb-2 shrink-0 max-w-full w-full">
                                  {GENERATIONS.map((gen) => (
                                    <button
                                      key={gen.id}
                                      type="button"
                                      onClick={() => {
                                        setCurrentGenId(gen.id);
                                        setViewAllGenerations(false);
                                        sounds.scan(); playHaptic('light');
                                      }}
                                      className={cn(
                                        "whitespace-nowrap px-2.5 sm:px-3 py-1 text-[8px] font-bold tracking-wider sm:text-[9px] font-bold uppercase tracking-[0.1em] transition-all duration-300 relative rounded-lg border shrink-0",
                                        !viewAllGenerations && currentGenId === gen.id 
                                          ? "text-cyan-300 bg-cyan-950/50 border-cyan-500/50 font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)]" 
                                          : "text-cyan-600 border-transparent hover:text-cyan-400 hover:bg-cyan-900/20"
                                      )}
                                    >
                                      {gen.name}
                                    </button>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setViewAllGenerations(!viewAllGenerations);
                                      setQuery('');
                                      setInputValue('');
                                      setLastSearched('');
                                      setListMode('pokemon');
                                      sounds.scan(); playHaptic('light');
                                    }}
                                    className={cn(
                                      "whitespace-nowrap px-2 py-1 text-[7px] sm:text-[8px] font-bold tracking-wider uppercase tracking-[0.1em] transition-all duration-300 relative rounded-lg border font-black group/viewall-bottom shrink-0",
                                      viewAllGenerations 
                                        ? "text-purple-300 bg-purple-950/50 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]" 
                                        : "text-cyan-700 border-cyan-900/30 hover:text-cyan-400 hover:bg-cyan-900/20 hover:border-cyan-500/50"
                                    )}
                                  >
                                    <HUDCorners />
                                    {viewAllGenerations ? (
                                      <BookOpen className={cn("w-2.5 h-2.5 inline-block mr-1 transition-transform group-hover/viewall-bottom:scale-110", viewAllGenerations && "animate-pulse text-yellow-400")} />
                                    ) : (
                                      <Book className="w-2.5 h-2.5 inline-block mr-1 transition-transform group-hover/viewall-bottom:scale-110 text-purple-400" />
                                    )}
                                    {viewAllGenerations ? "VIEWING ALL" : "ALL"}
                                  </button>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-1 w-full">
                                {/* Units Found indicator alongside Export PDF & Filters */}
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-500/25 bg-cyan-950/40 shadow-[0_0_10px_rgba(6,182,212,0.1)] shrink-0">
                                  {isSelectingOpponent && (
                                    <button 
                                      onClick={() => {
                                        setIsSelectingOpponent(false);
                                        setPokemon(pokemon);
                                        setAttackerAnimation('none');
                                        handleTabChange('battle');
                                        sounds.scan(); playHaptic('light');
                                      }}
                                      className={cn(hudButtonClass(false, 'red'), "!py-1 !px-2.5 !text-[9px] font-bold tracking-wider uppercase tracking-widest mr-1")}
                                    >
                                      <HUDCorners />
                                      Cancel Selection
                                    </button>
                                  )}
                                  <span className="text-cyan-400 text-[10px] sm:text-[11px] font-black font-mono uppercase tracking-wider whitespace-nowrap">
                                    {sortedAndFilteredList.length} Units Found
                                  </span>
                                </div>

                                <div className="flex gap-1 sm:gap-1.5 shrink-0 items-center">
                                  <button
                                    onClick={() => {
                                      const nextMode = arenaArtworkMode === 'home' ? '2d' : 'home';
                                      setArenaArtworkMode(nextMode);
                                      try { localStorage.setItem('pokethology_arena_artwork_mode', nextMode); } catch(_) {}
                                      try { sounds.scan(); playHaptic('light'); } catch(_) {}
                                      playHaptic();
                                    }}
                                    className={cn(
                                      hudButtonClass(arenaArtworkMode === '2d', 'cyan'),
                                      "!py-0.5 !px-1 sm:!px-1.5 !text-[7px] sm:!text-[7.5px] font-bold tracking-wider flex items-center gap-1 font-hud shrink-0",
                                      arenaArtworkMode === '2d' ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-amber-500/20" : ""
                                    )}
                                    title={`Switch Artwork Mode (Current: ${arenaArtworkMode === 'home' ? 'Art' : 'Sprite'})`}
                                  >
                                    {arenaArtworkMode === 'home' ? (
                                      <>
                                        <Image className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                                        <span>Art</span>
                                      </>
                                    ) : (
                                      <>
                                        <Gamepad2 className="w-2.5 h-2.5 text-amber-400 shrink-0 animate-pulse" />
                                        <span>Sprite</span>
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setIsShiny(!isShiny);
                                      sounds.shiny();
                                    }}
                                    className={cn(
                                      hudButtonClass(isShiny, 'amber'), 
                                      "!py-0.5 !px-1 sm:!px-1.5 !text-[7.5px] font-bold tracking-wider flex items-center gap-1 shrink-0",
                                      isShiny ? "animate-pulse" : "opacity-60"
                                    )}
                                    title="Toggle Shiny"
                                  >
                                    <Sparkles className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                                    <span>Shiny</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSortBy(sortBy === 'id' ? 'name' : 'id');
                                      sounds.scan(); playHaptic('light');
                                    }}
                                    className={cn(hudButtonClass(false, 'slate'), "!p-1.5 !text-[8px] font-bold tracking-wider")}
                                    title="Toggle Sort"
                                  >
                                    {sortBy === 'id' ? 'ID' : 'ABC'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                      sounds.scan(); playHaptic('light');
                                    }}
                                    className={cn(hudButtonClass(false, 'slate'), "!p-1.5 !text-[8px] font-bold tracking-wider")}
                                  >
                                    {sortOrder === 'asc' ? 'ASC' : 'DESC'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                          {loadingList ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-cyan-500/70 min-h-[300px]">
                            <div className="relative mb-6">
                              <Loader2 className="w-16 h-16 animate-spin text-cyan-400" />
                              <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
                              <div className="absolute inset-2 border-4 border-cyan-400/50 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
                            </div>
                            <span className="font-hud text-lg tracking-[0.3em] uppercase animate-pulse text-cyan-400" style={{ textShadow: '0 0 8px rgba(34,211,238,0.8)' }}>Scanning Database...</span>
                            <span className="text-xs text-cyan-600 font-mono uppercase tracking-widest mt-2">Retrieving Gen {currentGenId} Data</span>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setLoadingList(false);
                                setListMode('home');
                                sounds.scan(); playHaptic('light');
                              }}
                              className="mt-8 px-5 py-2 hover:bg-rose-950/10 border border-neutral-800 hover:border-cyan-500/40 rounded-lg text-[9px] font-hud uppercase tracking-[0.2em] text-cyan-400 hover:text-cyan-300 transition-all font-black"
                            >
                              <span className="relative z-10 flex items-center justify-center gap-1.5">
                                <X className="w-3 h-3 text-rose-500" />
                                Cancel Scan
                              </span>
                            </motion.button>
                          </div>
                        ) : sortedAndFilteredList.length > 0 ? (
                          <div 
                            ref={gridScrollRef}
                            onScroll={(e) => {
                              const scrollTop = e.currentTarget.scrollTop;
                              if (scrollTop > 150) {
                                setShowScrollTop(true);
                              } else {
                                setShowScrollTop(false);
                              }
                            }}
                            className="flex-1 overflow-y-auto py-1 custom-scrollbar optimize-scrolling relative" 
                            style={{ overflowAnchor: 'none' }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                gridScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                                sounds.scan(); playHaptic('light');
                              }}
                              className={cn(
                                "fixed bottom-6 right-6 z-50 p-3 rounded-full bg-slate-950/90 border-2 border-cyan-500/50 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center cursor-pointer shadow-lg group duration-150 ease-out",
                                showScrollTop ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-75 pointer-events-none"
                              )}
                              title="Scroll to Top"
                            >
                              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                            </button>

                            <PokemonGrid
                              list={sortedAndFilteredList}
                              displayLimit={displayLimit}
                              selectedName={pokemon?.name}
                              opponentName={battleOpponent?.name}
                              enableAnimations={enableAnimations}
                              onClick={handlePokemonClick}
                              isShiny={isShiny}
                              isCardView={isCardView}
                              isLightMode={isLightMode}
                              use2dSprite={arenaArtworkMode === '2d'}
                              isFavorite={isFavorite}
                              onToggleFavorite={toggleFavorite}
                            />
                            {displayLimit < sortedAndFilteredList.length && (
                              <div className="flex justify-center mt-4 mb-8">
                                <button
                                  onClick={() => {
                                    setDisplayLimit(prev => prev + 50);
                                    sounds.typing();
                                  }}
                                  className={cn(hudButtonClass(false, 'cyan'), "px-6 py-2 !text-[10px] font-bold tracking-wider")}
                                >
                                  <HUDCorners />
                                  LOAD MORE POK√âMON ({sortedAndFilteredList.length - displayLimit} REMAINING)
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-cyan-600/50 font-hud text-sm uppercase tracking-[0.2em]">
                            <Database className="w-12 h-12 mb-4 opacity-50" />
                            <p>No Data Found</p>
                          </div>
                        )}
                    </motion.div>
                 ) : null}
        </AnimatePresence>
              </div>
            </div>
        </div>
      </div>

        <TypeChartModal
          isOpen={isTypeChartOpen}
          onClose={() => {
            setIsTypeChartOpen(false);
            try { sounds.scan(); playHaptic('light'); } catch (_) {}
          }}
          typeColors={typeColors}
          TYPE_CHART={TYPE_CHART}
          isLightMode={isLightMode}
          sounds={sounds}
        />

        {/* Avatar Selection Modal */}
        <AnimatePresence>
          {isAvatarModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] flex bg-black/90 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ type: "spring", damping: 25, stiffness: 250 }}
                className="w-full h-full bg-slate-950 flex flex-col overflow-hidden border-t-2 border-cyan-500/30"
              >
                <div className="flex items-center justify-between p-3 sm:p-5 lg:p-6 border-b border-cyan-900/50 bg-slate-900/80 shrink-0">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <User className="w-5 h-5 sm:w-8 sm:h-8 text-cyan-400" />
                    <h2 className="font-hud text-lg sm:text-2xl lg:text-3xl font-black text-cyan-300 tracking-widest">SELECT AVATAR</h2>
                  </div>
                  <button
                    onClick={() => { setIsAvatarModalOpen(false); try { sounds.scan(); playHaptic('light'); } catch(e){} }}
                    className="p-2 sm:p-3 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-full transition-colors group cursor-pointer"
                  >
                    <X className="w-5 h-5 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                  {/* Left Side: Avatar Details & Default Save */}
                  <div className="w-full lg:w-[360px] xl:w-[400px] bg-slate-950/80 p-3 sm:p-5 lg:p-6 xl:p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-cyan-900/50 shrink-0 z-10 shadow-2xl relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />
                    
                    <div className="flex flex-row lg:flex-col items-center lg:items-stretch gap-3 lg:gap-0 h-full mb-3 lg:mb-0">
                      {/* Avatar Image Container - Adjusted sizing & cutting for PC */}
                      <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-44 lg:h-44 xl:w-48 xl:h-48 mx-auto mb-0 lg:mb-4 bg-slate-900/60 rounded-3xl flex items-center justify-center border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(34,211,238,0.2)] group shrink-0 p-2 overflow-visible">
                        <div className="absolute inset-0 rounded-3xl bg-cyan-400/5 animate-pulse" />
                        <img 
                          src={`https://play.pokemonshowdown.com/sprites/trainers/${currentAvatar.id}.png`} 
                          alt={currentAvatar.name}
                          className="w-16 h-16 sm:w-24 sm:h-24 lg:w-36 lg:h-36 xl:w-40 xl:h-40 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300 [image-rendering:pixelated]"
                        />
                      </div>
                      
                      {/* Avatar Details */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar optimize-scrolling pr-1 sm:pr-2 lg:pr-3 flex flex-col max-h-[22vh] lg:max-h-none">
                        <h3 className="text-base sm:text-2xl lg:text-3xl xl:text-4xl font-hud font-black text-left lg:text-center text-cyan-300 uppercase tracking-[0.15em] mb-1 sm:mb-2 drop-shadow-lg shrink-0">
                          {currentAvatar.name}
                        </h3>
                        <div className="text-[9px] sm:text-xs lg:text-sm text-emerald-400 font-bold uppercase tracking-widest text-center mb-1.5 sm:mb-4 py-0.5 sm:py-1 px-2 sm:px-3 border border-emerald-500/30 bg-emerald-950/30 rounded-full self-start lg:self-center shrink-0">
                          {currentAvatar.role}
                        </div>

                        <p className="text-[11px] sm:text-sm lg:text-base font-serif italic text-slate-300 leading-relaxed opacity-90 text-left lg:text-center mb-1 sm:mb-4">
                          "{currentAvatar.lore}"
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        try {
                          localStorage.setItem('pokethology_user_avatar', currentAvatar.id);
                          sounds.scan(); playHaptic('light');
                          setIsAvatarModalOpen(false);
                        } catch(e) {}
                      }}
                      className="w-full mt-1 lg:mt-auto py-2.5 sm:py-3.5 lg:py-4 px-4 sm:px-6 bg-emerald-600 hover:bg-emerald-500 text-emerald-50 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 lg:hover:-translate-y-1 text-xs sm:text-sm lg:text-base shrink-0 cursor-pointer"
                    >
                      <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5" />
                      Set as Default
                    </button>
                  </div>

                  {/* Right Side: Grid Selection */}
                  <div className="flex-1 flex flex-col h-full min-h-[300px] bg-slate-900/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none mix-blend-overlay" />
                    
                    <div className="p-3 sm:p-5 lg:p-5 border-b border-cyan-900/30 bg-slate-900/80 flex gap-2 sm:gap-3 overflow-x-auto hide-scrollbar shrink-0 z-10 backdrop-blur-md">
                      {['All', 'Protagonist', 'Rival', 'Gym Leader', 'Champion', 'Trainer', 'Villain'].map(role => (
                        <button 
                          key={role}
                          onClick={() => { setAvatarFilter(role as any); try { sounds.scan() } catch(e){} }}
                          className={cn(
                            "px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-2.5 rounded-xl border-2 whitespace-nowrap transition-all text-xs sm:text-sm lg:text-sm font-bold tracking-widest uppercase cursor-pointer", 
                            avatarFilter === role 
                              ? "bg-cyan-950 border-cyan-400 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.3)]" 
                              : "bg-slate-900/50 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-cyan-500/50"
                          )}
                        >
                          {role}
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar optimize-scrolling p-3 sm:p-5 lg:p-6 z-10">
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 lg:gap-4 pb-16">
                        {TRAINER_SPRITES.filter(t => avatarFilter === 'All' || t.role === avatarFilter).map(trainer => (
                          <button
                            key={trainer.id}
                            onClick={() => { setCurrentAvatar(trainer); try { sounds.scan() } catch(e){} }}
                            className={cn(
                              "relative aspect-[4/4.8] rounded-xl lg:rounded-2xl border-2 transition-all duration-300 group overflow-hidden flex flex-col items-center justify-between p-2 sm:p-2.5 lg:p-3 cursor-pointer",
                              "[content-visibility:auto] contain-intrinsic-size-[110px]",
                              currentAvatar.id === trainer.id 
                                ? "border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.5)] bg-cyan-900/60 ring-1 ring-cyan-400/50" 
                                : "border-slate-700/40 hover:border-cyan-500/60 hover:bg-slate-800/80 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] bg-slate-900/40"
                            )}
                          >
                            <div className="w-full flex-1 flex items-center justify-center min-h-0 pt-0.5 pb-1">
                              <img 
                                src={`https://play.pokemonshowdown.com/sprites/trainers/${trainer.id}.png`} 
                                alt={trainer.name}
                                className={cn(
                                  "w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain transition-all duration-300 drop-shadow-md [image-rendering:pixelated]",
                                  currentAvatar.id === trainer.id ? "scale-105 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]" : "group-hover:scale-105 opacity-80 group-hover:opacity-100 group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                                )}
                              />
                            </div>
                            <div className={cn(
                              "w-full bg-slate-950/90 py-1 px-1 rounded-lg transition-opacity duration-300 border border-cyan-500/20 shrink-0",
                              currentAvatar.id === trainer.id ? "opacity-100 border-cyan-400/50 bg-cyan-950/80" : "opacity-80 group-hover:opacity-100"
                            )}>
                              <span className="block w-full text-center text-[10px] sm:text-xs font-bold text-cyan-100 truncate tracking-wider uppercase">
                                {trainer.name}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Move Learning Modal */}
        <AnimatePresence>
          {isMoveLearningOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0  z-[120] flex items-center justify-center p-4 bg-black/90"
            >
              <motion.div
                initial={{ scale: 0.98, y: 6, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.98, y: 6, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-slate-950 border-2 border-cyan-500/50 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.3)]"
              >
                <div className="p-4 sm:p-6 border-b border-cyan-900/30 bg-cyan-950/20">
                  <h2 className="text-cyan-400 font-hud text-xl uppercase tracking-widest text-center">
                    {isReplacingMove ? "Replace Move" : "New Moves Available"}
                  </h2>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  {!isReplacingMove ? (
                    <>
                      <p className="text-slate-400 text-[10px] font-bold tracking-wider uppercase tracking-widest text-center mb-6">
                        {battleResult === 'victory' ? "Victory achieved!" : "Even in defeat, progress is made!"} Select a new move for {pokemon?.name?.toUpperCase()}:
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        {offeredMoves.map((move, idx) => (
                          <button
                            key={`${move.name}-${idx}`}
                            onClick={() => {
                              if (selectedMoves.length < 4) {
                                setSelectedMoves(prev => [...prev, move]);
                                setBattleLog(prev => [...prev, { text: `${pokemon?.name?.toUpperCase()} LEARNED ${move.name.toUpperCase()}!`, type: 'system' }]);
                                finalizeMoveLearn();
                                setOfferedMoves([]);
                                sounds.success();
                              } else {
                                setMoveBeingLearned(move);
                                setIsReplacingMove(true);
                                sounds.scan(); playHaptic('light');
                              }
                            }}
                            className="w-full bg-slate-900/50 p-4 rounded-xl border border-cyan-900/30 hover:border-cyan-400 transition-all text-left group"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-cyan-400 font-hud text-xs font-bold tracking-wider uppercase tracking-wider group-hover:text-cyan-300">
                                {move.name.replace('-', ' ')}
                              </span>
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[8px] font-bold tracking-wider font-black uppercase",
                                typeColors[move.type]
                              )}>
                                {move.type}
                              </span>
                            </div>
                            <div className="flex gap-4 text-[9px] font-bold tracking-wider font-mono text-slate-400">
                              <span>PWR: {move.power || '--'}</span>
                              <span>ACC: {move.accuracy || '--'}</span>
                              <span>PP: {move.pp}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          setOfferedMoves([]);
                          sounds.scan(); playHaptic('light');
                          finalizeMoveLearn();
                        }}
                        className="w-full py-3 text-slate-500 hover:text-slate-300 transition-colors uppercase font-hud text-[9px] font-bold tracking-wider tracking-widest mt-2"
                      >
                        Skip Learning
                      </button>
                    </>
                  ) : moveBeingLearned && (
                    <>
                      <div className="bg-cyan-900/20 p-4 rounded-xl border border-cyan-500/30 mb-4">
                        <p className="text-cyan-600 text-[8px] font-bold tracking-wider uppercase tracking-widest mb-2">Learning:</p>
                        <div className="flex justify-between items-center">
                          <span className="text-cyan-300 font-hud text-sm font-bold tracking-wider uppercase">{moveBeingLearned.name.replace('-', ' ')}</span>
                          <TypeBadge type={moveBeingLearned.type} size="xs" />
                        </div>
                      </div>
                      <p className="text-red-400 text-[8px] font-bold tracking-wider uppercase tracking-widest text-center mb-2">Select a move to forget:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedMoves.map((move, index) => (
                          <button
                            key={`${move.name}-${index}`}
                            onClick={() => {
                              const newMoves = [...selectedMoves];
                              newMoves[index] = moveBeingLearned;
                              setSelectedMoves(newMoves);
                              finalizeMoveLearn();
                              setMoveBeingLearned(null);
                              setIsReplacingMove(false);
                              setOfferedMoves([]);
                              sounds.scan(); playHaptic('light');
                              setBattleLog(prev => [...prev, { text: `${pokemon?.name?.toUpperCase()} FORGOT ${move.name.toUpperCase()} AND LEARNED ${moveBeingLearned.name.toUpperCase()}!`, type: 'system' }]);
                            }}
                            className="w-full bg-slate-900/50 p-3 rounded-xl border border-red-900/30 hover:border-red-500/50 transition-all text-left group flex justify-between items-center"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-red-400 text-[10px] font-bold tracking-wider font-hud uppercase">{move.name.replace('-', ' ')}</span>
                              <div className="flex gap-3 text-[7px] font-bold tracking-wider font-mono text-slate-400">
                                <span>PWR: {move.power || '--'}</span>
                                <span>PP: {move.pp}</span>
                              </div>
                            </div>
                            <X className="w-3 h-3 text-red-900 group-hover:text-red-500" />
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          setIsReplacingMove(false);
                          setMoveBeingLearned(null);
                          sounds.scan(); playHaptic('light');
                        }}
                        className="w-full py-3 text-slate-500 hover:text-slate-300 transition-colors uppercase font-hud text-[9px] font-bold tracking-wider tracking-widest mt-2"
                      >
                        Go Back
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Move Detail Modal */}
        <AnimatePresence>
          <MoveDetailModal
            isOpen={isMoveDetailOpen}
            move={selectedMoveDetail}
            onClose={() => setIsMoveDetailOpen(false)}
            typeHeaderGradients={typeHeaderGradients}
          />
        </AnimatePresence>

        <WelcomeModal 
          isOpen={isWelcomeOpen} 
          onClose={() => setIsWelcomeOpen(false)} 
          onOpenTutorial={() => setIsTutorialOpen(true)} 
        />
        <Tutorial isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />

        <PokemonComparisonSidebar
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
          pinnedPokemon={pinnedComparisonPokemon || pokemon}
          onSelectMainPokemon={(p) => {
            setPokemon(p);
            setIsComparisonOpen(false);
            if (sounds?.scan) sounds.scan(); playHaptic('light');
          }}
          isLightMode={isLightMode}
        />

        {/* Daily Hub Fullscreen Modal */}
        <AnimatePresence>
          {isDailyHubOpen && (
            <motion.div
              key="daily-hub-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed inset-0  z-[200] flex flex-col bg-slate-950/98 backdrop-blur-2xl overflow-hidden"
            >
              {/* Ambient Glows */}
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Top System Header Bar */}
              <div className="shrink-0 border-b border-cyan-500/30 bg-slate-900/90 px-4 sm:px-8 py-3 flex items-center justify-between gap-3 z-20 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 filter drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                  </div>
                  <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
                    <h2 className="font-hud font-black text-base sm:text-xl text-cyan-300 uppercase tracking-widest leading-none whitespace-nowrap">
                      DAILY HUB
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-[10px] sm:text-xs font-mono font-bold whitespace-nowrap shadow-sm">
                      {today}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsDailyHubOpen(false);
                    try { sounds.scan(); playHaptic('light'); } catch (_) {}
                  }}
                  className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-hud font-bold uppercase tracking-wider group shadow-sm shrink-0"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                  <span className="hidden sm:inline">CLOSE</span>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar optimize-scrolling p-3.5 sm:p-6 md:p-8 max-w-5xl mx-auto w-full flex flex-col">
                <PokethologyCombatMissionWidget 
                  todayStr={today} 
                  isCompleted={isMissionCompleted} 
                  missionProgressCount={missionProgressCount}
                  missionRequiredCount={missionRequiredCount}
                  dailyStreak={dailyStreak}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Daily Featured Cosmic Scans Fullscreen Modal */}
        <AnimatePresence>
          {isDailyScanOpen && dailyPokemon && (() => {
            const activePokemonData = (dailyGender === 'female' && dailyFemalePokemon) ? dailyFemalePokemon : dailyPokemon;
            const hp = activePokemonData.stats?.find((s: any) => s.stat.name === 'hp')?.base_stat || 50;
            const attack = activePokemonData.stats?.find((s: any) => s.stat.name === 'attack')?.base_stat || 50;
            const defense = activePokemonData.stats?.find((s: any) => s.stat.name === 'defense')?.base_stat || 50;
            const spAtk = activePokemonData.stats?.find((s: any) => s.stat.name === 'special-attack')?.base_stat || 50;
            const spDef = activePokemonData.stats?xúÏ}€r€H≤‡˚|E5∑ßIMàIâjYcŸKQ¥≈m›F§ª«Îpÿ Y"— öbkÙÁeœÀFlƒæÏÛ˛¡æü?9?∞˚	õYÖK®*ÄîÏvõ3-ì@°Pïïôïôïó⁄çiè+Ôêˆjã=#^ÕÛøf3JéééHŸõ”ëiX’1Ω°∂GÀ[œkC√£Ô∞˘Á?I´˛◊?·3rlœ'ì#bå|Û#Ωr>–ôcüæ¡∫˜û◊
Ωòé•ØìºoJÕ…‘?á7V≤Ø‰7…i‘∑jæÛ¬º•„JcK6nﬁÙ•>tun¯”⁄çÂ8n%ßWÚ≤[k‘ˆ4ΩˆÏ—îzaøÆ≥@ÓòTÖ¡·ıFS˙Æ%kÙ”DäeqP¶gC±lòÀ‰0õµf}oøô◊´14-”7©◊˜])~Dû◊f∆^£H%ºªzŒÒ¡àæïÀ[5óŒ-cD+;’ù…6)ìÚ÷VÌW«¥+e¯µ≈Z]86-KqhÓäªß"`v`œkÊò<;ÇŸ¬áΩ9€áÌÏëµSØRû—â¡_[†1“≈bb∫fY8◊_:ÓáWÆÖÎaz˝©iØ»s…"?Øys◊ÙÇé?•ÓÛ⁄õ≤ssc22∫)øt€Á±~‰CL˜3up»¬s[‰êÿÀ⁄Jò`wú≈F)ˆ‹∆XX~¡qÈÊÙÑ#}§û≤s}úé…FÀ†∂^Gyœæü˙˛‹;‹Ÿqçemb˙”≈p·Q–“ß∂_9≥Ï∏}’€	˙‹ôûO›ËÁúøwáy'àùÔÔbt.3º⁄)√rïÀ˜ﬂﬂIÈæ6∑'Ô•D<°~(È
∆ÉCR˘hXà§≥!ua‹w<(y;¡ã°%≤≥}∆œ‡Ó÷VÍ.ıÆM*)=ù9æÈÿµ±˘1uáêtuT¶µ™z#√ÆŒú±aï2ÕLxûa››gnåÄ≈í:πøœ44lsf¯4—∞!kHoM?ø;ﬂ5lœƒ—c[5ßá§ÑÀfOJ€dlÃÊÌê4[€ƒÛÕõõz˛îv6≤œª ∂vT∫¡- fÂQøZ'‰∑ÍõfΩ˛ñ‹XÙñ˝©éã'UœÇ…Tü¥Í;O»–}ªŒº:¥nµykÁ#ua^VßÊxLÌ4‹ûeÜp∑Û“ûM\˚ó†G˛≤ìËSX)q¥∆–s¨ÖOâ/Øãﬁ¯’∆ŒYVüÏì)˛Å°àA’VΩæ”®Ü1t\ΩÊGÿpwa∏sÿj Ô´Ù#ºﬂ´⁄∞’î»Nvî ˜ﬂwf0˜÷ÏXÆ	›lRXú9ÈØÄXg }ó,Å∫…ﬁç‘∏54lõ∫Ö¿ËMo>¿Ëáé;Ü√/1ËvÎ¬™√Ô'u2ø≠Óovˇê˘™∫À±«Ã´"√€] ˆ≠™CÍ/)µ…ƒòCªﬂ™Õ:Ò¶∆ƒöî≤pŒ1€5ÎJ˙lˆÈ%åp
ˇ¡hóUX ¯wZ‚÷J"J3E{p(H=Õ‡g0µ7ıwıwç÷¸ˆù;ïÊ^kª—:ÿn4∂Îµ›≠∑$ªb0ç˛‹p?X {&Ê≤sŸ„siÒ©¥àOo˝xî!∑©Œñ'Ge÷ˇ¿©Âo™á>m&¨¨Nc¬æA÷˚¿áå:ŒÅ˝ÄeÊ±ÛXÃÁ∞!`@Í—‡i’•	Ró¥nåÒ'#’(ÄV 'ÌﬁŸk“Ô¥/ YJ·0mÆ	°‡ÜÏŒpº¿NÔ«¸„ÿÀ}8∫´∞-Ìé üÌy'∏ÕÙaóπúSªrc¿öm˝ïxàú†]¡ı
¸yujÃ}sT)[»e@‹f.è zX•ÄJwk]ÄTõ)ÃÁt}¿ÈzäÃ˚0∫˙#,[˛WÖ∑`óSì±?ëXÑÁ¢]™j ´-\œq´£ì–‚T£`Û≠GRh„XcF¿≥0•yHzﬁ,¶.)Ä|”∑ 8ÀÅû*]o¥%kß@äøÀËëΩø A„:>gî"ÿ◊«ùëÒ¬5ÿ%ÿ[’ƒÈÕ[|ﬂJqM€2Î;gó˝Ó”l(«Qéäí}LÅΩ∏≥ÙGÆcY∆–¢§√%ErÏåWÏáa›Rò¨–àÂÄU’X¯`Äá˚§«ﬁÅó=3£¡%XN2∂ïÍ>ôç·ü23n´ÀÍèÄ´≥[ﬁœíÌùÖvéâ˙˛A—≈É1Yì√¯gì·‹~ÄÜû¢≠Çõ lŒ@¿ @Xãôj˝©c9◊òOÕÈ£µeÀÉÈrN}◊…EŸP˘¨Hº'v‹VH_MÈˆR4ä_ìí[Ü⁄ˆ@6ÜWÄ®íN»Ñy#5É?}u“q\ò®'Rb†uoÁ¿ÛLüÙò@“1‹19Ó≠¿$-hÚ%µ”lë˘Ä7VÎ»	Ûv_		2¿ºi‘Á∑o„M+√¶‚›-ﬁêSÃ*ÊbJ&®å¨ª¢I sü≤ø©7GÛÑe"˝´nßwﬁΩ`˚·E˜Z=u%W) P˚ú‘XvÍ1'◊ŒÔ?›ı}‘e$Ê+îzc©nÊVmnå˚H∆ï›mRÆó∑Tñ7GıèüPoèêëìc`eïó‘∆µ8ì	 l?êéª"}$À≠50=≈Z`ì•uÚSa_–ôaÖêB´éµ
I~çîÍ \yê5ëä8™<â0Öåjc◊‚Ié∏dÇª¯¢U †ra©+Ám1¯ÓFv•≤W5§@¢X lŸöîçòçé€’ŸaÒJiU%E2ÕÖÔ%rHJÇ,∑'ëÂJÇ¡è~59oüuı¶îJ≠iYoËóø∞¡É•ù#∑Wñ]».l‘ÓÛ¨ÎãÓ£¨¨FÂƒZ{ÇΩÍ^≈{Å´eYˇ»eG8–¯Aœ„√ØvR <ãû"0—–ÿc—C“®’[y»¬s·±zÌIÓcèjÿKt]ï¯åÂ:Q¯IU@8H0∞°Ivd<ŸñÏ∆â%ë5¿ÖÉîÍ˝ÚV¢&T€F†“
-Ó=¬÷§⁄àB5ó_≠õ”ûNŸe≠‚kv7¿Ω∫ÑÙSrê∏Â°*õ6i®ı·î‚)3ã´CL˜‘-j≥çÌ‡)|ÁäÏ!ySﬂ&’¸¡ˇÍo—ÓêD‘P•E$Gœc'OF-ä6UBl¬ÄEbË#k5Ìƒ∫(uÈË≠;ÒLı-ØŒ⁄ØIÁ˙µñï%∏àÜ©©ÌNy"Ê)ÏL’ÄxxJ⁄¸‹ÖÙßŒíIJ≈• HÀ[—^Qà˚Åq?ﬂ¨	¯˛∆5∆x4¡·jed∫#ãæ3¸wº—ˆG√≠T´˛2jJµ3˜∂∂ Û]P˝k|ã|4ÅR}G¯ë¥ë+ﬂΩ:WvCäH<ênŒ°=ñkºC´ÏÆ‹*€lmΩ’ÈÉ*Ûx^ä¶≥Ò%S∆ÀH9s√E”äƒËüúz1K.~‘√6gù Âπ££ª¯òZaR‰√Úè$ª/rrÌs‘∏5áMøN˘Wg¯+)sÛ	π1-D9v™$ö”õÚÖk¡¬Å*Ñ¶}ja?ê2‡Ír1sg[6tÿ“±UvRÓR˜ ÅsuT≤ùjxI˝òr	ÛŸA®¡! Aøƒ-]m] ‚´`◊	ï»ÑwÄƒ¥õ∞+µ8ôLw3oÖæBÉ	®r,&”øãˆõF>≥“O0Ä*í¨/äŒÑ0›-Œ/b[‹“5Ê—Óû˘Ãœ5ˇHÜŒpÅ{ﬁ¯ÃÛfõòâ„sù<C¿Û«∆xBŸ…˜›˚ÔÔ|÷''ÌÍ˜wÊ˝˚{.D&ÓÀR+∫f9@7Êot¸.tÔI4ˆ‡÷Q…õÂÏ‘:P´A‰ì⁄d—nª˙πöÆ<∆KfÅ°ñŸäã”S ¥Ãm…MX—–Z kÏ)Y≥
vòOíÖå∂ÏÖrÀìMlÒ√†!,®⁄6#≥ÅU5$Ï“≥”nÔÂÈ œé®OhUXC$Â=ªºÔ…åÏêªÿΩÓæ|'∫Ï›órÕòzuÙ?Ï‚¸Úÿã3_∏sãÀ∫2ﬁì\†»#∏≈–{–öÿ#]ò\ñCƒıO≤À\dSπÈÁ-vlÕŸt•Öu*=ª∫Óù∑Ø_ìˆqÔ¨7Ëu˚õ˘£’g:¨b”,=FÔŸ⁄◊]p\ÓkÊÃù…#t–ëÌÔgé´÷ë‘õ3îÒ≥±XÅV”ŸU-¸∞c:ö⁄l[·„¯hz¯a⁄c∏Ë;†æ”…eˇ‚xôwò8øó∂Hv~ª ≥?t§"±úÆ√·‰1†≤Y±CÖZ+s~ó89œÔRß"z∂ZÙıyá«Ü€ôÇ™$s –úªÈ;’RŸf«ä•g«Ì~óÙÌAü¥/⁄gØΩN.ΩÁÔáZÓ¯†√?¿…#/ı“TlÜÁô#s±10ö\iﬂZ‰ΩıXàã^üá≤N”Gw	ú”ù&«Ã5≤DÊº?@$êª⁄gÉSruŸªÄµØú^mÂ/{ÙtV[çn¬πÌ›tû√œÉı»$Z ÛiBÆ Ï…∫√≈¥ÁiÓ¥S#òFØ-9.∑‰Ñfb¥‚–ukÃÄìi È)≤-` Bâx˛ b^¿@±˛ÙêÄ¢ït}ÆLÁ[˜~è&÷\kf|s‰R€ˇ5S“’ÈÎ~Ø”>#Ì¡†›˘È!dslëéﬂˆ˝ï“R§… 1˛—èNK¬èLO9TsBoæQPÕI˜E˜BÁüòy6C6CkA3T4~•d√@PM¥9?*Õ˝ºD”üÌªsÕ{îÕ&r©∆õ|øRö	]eêfC’£SÉÔgßôØ|Ø	iÊ∂/íd ˛Z…ÜÉ$ ¥_MúOA8 ·œM8ò‰‡+¶õüz›AØÉÓ‡›ìáPç®'… ¸ïíMìÄn|jXüÇj ¿ü…N¿ôˆ»”ô9"ö„€∞Vø—oVp≠|spæ˝\0Îp¢gﬂ8“∏”–’J‚¢çäõ∞„ó6Æ∑gzü‰ˆëVêª˘ÆcO‰Êœ›Ë éªûÑk¢NÚB¶ÕyxÈŸïÛ·ﬂ˛˜÷Ωk˚Ó
8${±vlsŸ·@ÿØ7∑ÄfΩE∆"Zc0?ØÏ&8Œ¢cs1#Có™KÄìGòÉ8∞Í,¶K´,∏0ÊA!≥¸≈5Êá§lÿ´Âî∫¥úÎÂ)ÒRËå\sé¨Nª˘ÓÃ?!;b;'‘˚@∏ÁÊ:'ƒâõ⁄cILztVËkê
D8§£¥–ûˆ8äÒaœ)\µSYj“uD≤Ê1≠Ôy2h(ÁòÕºÉóyﬂ€ÄV»: [€§$:œ§Xﬂ¸∂∫èÒ{‰ªê‘DXÃEL∆˝SÓ÷<≤8ÌY3]h≈:ßíyÓ§Å|!∫è¢mt˙Œ"FÚ›Kôõd»ºYnojŒ@h…9©,∏…·)©kòv«tGSzRm!)ÔÅh)pày£IÀ£…áü˝‹Î˛B^º:;ãc€◊ù”ﬁœπZb^Kæ≥B·“Àj'ı	ﬁoUº{∫”Ê+zÂRè⁄#*@Êî0•Ëı∆‹∫∑∆åº ^å
«9¶∂I¿ßôŒ‚˜ﬁôú;¸ma˛Ü‹!k£N´#$’˘<.O™S0•N¡Ñ:E“È<bÃÕgN•ì∆ù"it6J¢»<0áŒ∆t≠Í¡)t¬‡› 
ÉwÛ¡§LíÅÊÛÊ»yHÜúÕÚ„DÕ§«	"êgªq–‹n6ö≈í„‰Ô1ŸÙ8—qIëò
5+/ñáì∏Ì0OoA¿ÊWT≥zH÷úHW)ñ4ß†úv/Ø_ìÓﬂ€ÁämOô?'ΩKá≥uâÈ&
¶{"≈/1</ö´Œ>∆˜bKYfæq≤µ?ü;‘J·@®Iº¢€Ì≥◊’öÄ&_P∏ˇ>Bæ†oŸÇ¥ŸÇä‰
í¢¡g»Ù–,A*aWé´èöÂ'D∞tûüΩLûü§Ã$€Q«ıß,ÆÈ‚s<°æD˙»¶J⁄.([gÜÇ≤≈±·∆êkÍabNâxÕ˚}&Ñ˝òíı—›ê5B£oêX˘$coJ«â<fC°´˛Kl$Ú<∫æd{∏úœaS∞£>¬ﬂŸñgŒ$l_≈˚òdÛÇE›≈ﬂ%„8ΩäFrz%ﬁwÇ∑bÉ¯ª§ás„VËÑ˝íı4K¸îÙÜ@^xQw¸ß¨ø∞aÚ˜}bıŒXlä3’D¯!∂ôôû(wà7ÇV@O>«àsÒF‚˝ˆ5MÂ∂†ÄıG„˙È`Jçè´tÇb∂ô∞7c™ôïZ«hX)√Ô≈\“Õ¿úQg·W‰Ü*waÛ^*©'Ô∑Y∫÷ÑZõúvœ∆<Êæb⁄0~~∆"l≈wíi¥ô-l`+Â±·í9öhº?vvê jª‘6«ïtáW!TD\Œæ¯2¢ÜJõ≥-ØD$Æ∞,œ ﬁ¥çÇé^¿lG¿vTˆï◊Ó
–ë∫¯F¯oBΩ ·Óy†ìÉñÕΩéÿ˜(w=ø_N^⁄≥´Ïå}£è' ¿T <#ÆÌÎgˇ{èÂ8d§ï7ou»T@∫SS—]Ú˜»È∑5øoŒ7*™Æv≤ﬂ› o/∆¶ÉÈÕÜ &*Dgc”√í◊…ìGw◊‘˘5ÿÅˆ∫≈s¡
ª∆qÜèhM{·Zá$~ˇv‚&æéYm&ñ34¨ÛÖgé:ém≥†cÍäuMíœ}dy)∞_û°"y◊rú˘!Aìºú”ñÍ•‰uç»n$Lw¢p![˜I´]ü˙»⁄º5MtO/onPˆ;7l@nó?ÃloøQùÒ;Å.9‡ﬂƒìxıû)! ˙F˘`êf€dèÕ∞,ÔŸ—]Ä∂L‹ΩO Ê¶∑ë—˛fD¸fD,jDå=öæŸe„˚ là{›–~ËI√Z9K·¥úﬂ.peD*7Í^YÈßÛPC„`JTöœ˙›¡†wÒ≤øñ’S[œƒ]ÁõÒÏõÒÏsœt…µÛ∑éOêPªôchc8"âfJ›‰Ú3ãn˜bQµhvt¨Ω.•wn≤agãÿµöâ≈^]
÷~u“ªÑYûÙ˙<#‹Â≈‡˙ÚL∆–‘«≤∆|Ãfh-*yÊ§yÕèËFÉ√ qÃtÂ®≤hÎa¯¿æªŒ≤à$Q∞ŒFÚb>åpá—:IkBêwC„î„]÷:πƒ•g=|ˇç1¢z9â(÷HkeÁ(=Vdl∏»aF®Ú≤µ’ΩTÁNR$MÈ⁄yF£]ë{å1®	®ûêÁl K˛qMÏÉ–í\ô¿ ùÖœÙSv@ô ú+úr!Öîñä&Çí»§ µó†%ﬁä^Úú4à¢DS¯—+ÜÇ.ÿ¬∫Vë¢∏´Ì4ÈSßlFHR3kjQ¢M,[ÆºÕıπpÀüçSféX J§´)PÑ%.ép&∫œ+ﬂ†t∑S˚t›%«Ù¥ø∞ì‚≈.Êe^Àá‰Èπ„»n'¯8´S{Êe-ê>tMIò•√°”Û]Ãnˆ ◊%@˙√n…◊›óΩ˛‡˙5Ê◊ø<?u—º&ØAJ£oÃERí®*Ñò^œˆ|#49®Êüñ≥ˆ_X√eò≥ˇ`ƒWø¥”á3…œzˆÁ‰ß+P¯Äüãû"˚ô\Ã|Q∏è¥diü≈ÿú€Ld◊uƒ8ØH…7B`>ŸB€òéw¥‰U9qñ∂Â„|á\i¢Â jC°mÖ&ë! r§œS[Hl,LófA€QÜ_‰+∑X?7Î	iœÁ§§R(•éÇE$ÜıD"XFñ∞Éz“ckÊ£ﬂT<K∏=ñy”Z +g·í1˝hérƒ]6ÃÈ')õ÷Æ,7∑lhˆÅ∏˜ôA#ˇuî˛bZ$
 ©ôº>k]Å‡[ä2êÌ5@aˆØ¥ÑÈü,@·ëô=!9hO<∞Òé°úﬁfªE|6≤ü1π©›üpwCyôÄV·-„AJLQŒü‰∫†£c«˘¿é€>≈.†e˚è¡Ù?#ÀO÷Ì7MòZÄÈ«π>•,ˇÂ¬D6∑4¨˛d2%Œ/ˆÍXòÎÚÙ’	π°ÜøpÈ£dX]z2vﬂ“ïkP/à	yï#◊YYRºZﬁ Pt=uÈÕQ)¨ßΩ\.k&n◊ò±:⁄Ôﬁ’Ê±bÌ›ªÁÊƒõΩ˛ıø∫ÙWkq~2nçOùﬂT¬üo∏ÍïﬁÅÆdPµr©Ö)ÊÄ êæÌ‰•öó◊q·¸¯q9¨:yDP„‘Xñ∞VäPÍ!Ê≤âÎªéõÀƒ{°Rí]áâp∞£u$¸(ÅŒgaﬁ:v›±,ü_GÉ˛∆ØI∂O»∞º1ÍÚGÀ~·Xñ≥$ˇ9√†'L’:∆∫H¿π1-¬¡±•ﬂin»±6Ô6bŸ∆√ÿÙƒÙßã!„œ3òæ9s˚7√Ç5j6Î{’©·Mw«Òˇ®Ã˘wì¢‰ÔŒO_2î¯&¸Ê0S ”)ÄÈöŒò¶√ÚT¸NÇ/V∆<"@ ÓàÇƒ;∆ 7cg¥@/Qv¬ˇE0œO$Ó>ày*g+ªìoèX”ë:gÏØ< ÷k jlÀüõZŒ«ËàzMáéÉ÷	y”ÕX°Y^S`ÑÏgvI6(‹HpAº^ê	b
êhVáÅ˜(<_8¢Ì¯¯ò≥/üIÆqØ∂‡4t∆Çß◊Ãø¶3Z¶CñY⁄&¬2·qGItå+miSmŒÀtµÇµî$‚yN ◊›„ÀKÙN#Wó?˝€øútˇ^´’ ‰ÔÙÌÎAtùÙ_˜›Û≤˙¨o≥”˝‚Ã◊j_∆[∆f¨ÖE¶(Ü¨ékÕ1x*ÚY<v–ùc◊Ω5±˙á}c∫‹Ìr›lﬁ‘Yb'â>÷Eˇ¸éÊZÔ∆^ËÆ;ŒÅêÅ2ö⁄9h•¸∆g„MºÕÙÆÂj8& Ô.ÕmÇêí∫≥0ÎÚ≤÷R«â≤≈∫VdùÀ§ú˜Ç˝d¬9°º!sêLÁO˜ÍQE√›'€˚¯ˇ‡‰p^ç"d%éyq∫úY∞<Å3_zÀê;q«=“!NÏ†ü?“©iûR≤4\•9r(‚?  h. 3 ﬁ≤Àj∑èÊ^∏!+ΩÒã;„Á	ÿí$]¢sZ⁄?ˆX∆ºΩBÓÔÿß aH•â¿FïLôø?m[‘ıÆiÿËe&ÒπXBã§ßxòU.‹}ôÉxr{Üõ≥#ø©◊-:{À
™¸+è/a£Ì˜Œ_ùµΩÀãÁ“Å+¸ƒ≥yÒb]BZz9%P®¸õcÂR È˛Ωsˆ™c%É”În{@N∫Éng–=ë]í«NÈ»ÆÀt∏œÎ‹ tò¿Ìî?yË0©L(ù|∞ï≥ ﬁ"¯≤4l(ùqU∆/xË1¡¨c∆sÚ†Aée9»FŒÓíπÎL`ˆ¬B‡ƒ√BA êy>^æ≥∞=„#åÖ:å“%KôU»J	<ÙËÃLj∫•gef`§ßµ"ÛÖ;°†åç@ÏDú⁄∆k#≠¸∏´∆Ùßµ™‡ôÌÊ«©{Km\nû˚PÓõh›ó»D⁄ÛaÖ(≤«?≥øM"±,}ÀõF#ÎD7\CZ5=¶bU]æD‘EKb!6 F]§¥;é¡ÅAËâ¥D∞éﬂuˇﬁHπÖ∆hÉÖ©ÏÜTÊ"ˆ\Ó¬.oi¸∏ŒΩ∞’^e˜Ñb‚ÿº>^X4ì7@Ë‰p˛KƒﬁP\ÿ´ãR≈Å‹në`ÜÌ0ÖΩrø5Q˙l†Ùπ1íw./^ÙÆœ◊GÛ5”!>ûyJ≠˘˙i˘√¯Ï∫Ã_ö“∏ª±“XO)ç¢≤Ûª)çL≥€ﬂ÷BD£?nk¡-”%æq≥q$·G–Q[’öhu‘ñ\G&±∂Íô’õˆ‰˙◊ïÚ+$àb≤\ró)8È∞WπÇìì·;,Ë|
∫3¿ÄÛe2º0P5}Ú%ïâXIîJAÆﬂ¥d
ãNM≤Pè“Œ≥5YÆ|ïKDöºÅ¶’7?÷?Nﬂ
G‰GM´ÇzuÿZÑéãª+èKî§Háåõv∆—î„üOt¨3∑¿PuÇ=ÉÁÌÇ’ﬁULßû*‘∞“3¶9âwàÈ°7/™W¨Åÿf®Mg+·&KvP#?Q:á6ÑÆhxgJÀüãvΩÔHÔÜQ◊Í{”c˘àe~Äy-\@N|ªÈ9ˆ6PWø–B
#6å—:6]Çôƒkä<ÌJS√'ZoIu≈ç<U‚+˛À¥T–πò⁄;vûk|aXÒp~M ∫ÁÎ√ÁüZÊ≥ˇˇV'xˆwà®l πNÎ8™ƒµ·Iäj‰Ö·!oW{Å¶>–Å'πﬂÛø{∫]|kÿI«5©'ºz`Ãœbú¬HGGhÁ˙xd‰ÆjÎº™›c¢p∂¯5åYí2‹Í√Í˘,æ©åjIdá0∆ËÈécV8ör` y£v`ˆT3äß;kÕ£“G@YYπ©çqV(‘ƒë∂35ñ4à>Ñ?™LÜG¶ \Ÿ«Õ¬& “åù[¸Ô‰°ñOáÓŒ≥*Üﬂí	ºåÃaA=‚/ùŸ Å≤Ê·i`å0^Ü
◊¸©sXfØååπ˜‹˜¥Ω∞‹xå5r#≤Tèb.\òùÌ}∑G[c˜LD∆¶´H(‰ñáöR ›∞BòP¶¥uˇÏ•„µ~˜%Èe¨¯Ã⁄
>ıGW≈öÎ´bIWÆ/ÔØıÈŒt]Àî≠2W∂ è•l°]>	q–%6”≤ò%f?R¥Í€Ïµ˝≠Ì‰)°_»Ï4…£Æ@R£<˛ÍYp˘cFKcz«N+ôØj/Æ‚QHºOÚº]u €nCÆõßWÏ‡1u	⁄“:'b∞v2u1˜¨â'`â⁄$äd<JÈAùÈûGÚ'cT>7»C˜Ü{Î:GmrWe‚æ\wpÏÇÕ –;Uµ•ÉÆ~‹S´4éÃsƒ∆åé“l?`ÌÍÑ<“]À”Ï2ÓˆU'iëÛfäãŸµ`]8~!=8KÂ!¸keÀYm∞‹	GD<kà?Ì°≥aÆ
^)‰ÍŒT˜rŒTCh”∂Y&åî4¨ÇCBº6}¿‹Q2çß¡…•ÍÃleòò°⁄IÅ∆.5fìRA…ctË5”VI™Ÿwã≤||J—d™E:è∆∞AŒwÖ≤=?ÔqníÅ∆ ˘£¶9ÚYZV2ñ™%c¿¸»`õÄ≤	‡™"1m5≤ú9õõHpÏÒt≥é[√RlÊƒ∆Ë6”Gëú,,¿Õ*vL Yﬂaï¥›∏0≠•„~`&
oeè–Ä,’àˆUè|4\Ω+=¬Ç¥ÿÈ/ûU€,-“PïI·P|–™∞cDd◊±SÎ9ıM∆õÊæÊÁ©,:˜ä«0Ü¸·i_PQS∞ƒl]‚OdbÀKaä Y~—Zè_Ël;
g]Ê BZ“Ü “LiYtB¿ÙÉQÚKd^˘WUË2Ëåï~	riîGùºÿ√HΩóï•	+FB0™‚^YlÏKN*¸çz˚œó
Ñ˛j$¨Äú£•`1'†t~4ÈR ãé 	¨À2œÄ±¡5ñˆ˝Ü3«ÛÄìz§∏¿s˛;Ü;Ncƒ 6∞ƒ/œû≈%ˇ¡'ﬂßÓGÙ$1«îº§∞˘ò§›#ù©·_@◊π]±†>k=Éîáeé=$4Jb¯ v¥Ì6L¯<M0\Ã@´È‹˝—·$''¶1±ÿTagÊ∫F,úÙO∞'„qŸxB…G~!üå ≥
 !«dõΩ±∆VªGÊ~|$Èßx˚:yu!)Ím°¿Ò€ÀuUà•õ˙ö{πDÈãt5÷◊¥ |y◊
Yc·#ë≥*ÓBÕSñ¯/Ëö·c`;I‡hCÛcãÖüƒòvΩ∞mŸ'úc˙!˘«¬Òç3–Ω|¨)0ŒÃÖ^∑A∫HÖﬁ∫∂~ºõZ!q6âÒáPÀ|+≠‘‡[≈üw?êª*V!´RÙíí{$'ÂYdÎv∂0ÄŒîé>®≥àâÅc®>FEÊ˘≈≤9ÀïäD&Eh`MB±QÔT«à…ú‡ı˘30–¥&i¨C3[˙0]1Rº(ÈsÆ}Åò‰QP·<µ!¯¥qW¡∑!~&Ç«€≈ôÌïo◊Tf6«¿—v’ßXp§
Í©≤mPôîä\•¨’jå@·é@N%u ô.ìîÆ¥yAˇdi6€¬Í\‚êpJók@Çäî4ä•=y¶y¨˘Æ$[Ï:ªV qF≤S˚ˇ˜/;?u‰™w’=Î]‰WåñÌÍc]‰∞,=^}â9‘ñFamö‚kñºïî,=î?ç6≈ËÒƒ8Ã;∑8≈ﬁiÜˆæsyq¡‚»˜–∏50•ÓJÔ+‚Ö˚≠˜¯⁄“˝˚º¡ˆ.^Ü‰r“ÎGoQKﬁ>¶ÏŒ†vìHXT&#BΩ£GÏOç†ùÀó=ò!›ãó`ha?)Ü´9∏2`‘wWœkA}!4„áÈœ.;Ì3r˘‚RÈ\^wŸøÏû˜.zégÌ˛È∑uñ2¢Óıœ›krﬁ=øº~˝hãº—“ŒËÃqWß‘òøÚò˙˛{±AÍ˛˝˘1Ÿ!™êi-h¬XƒÂ√å~∑Û
p„®˜£êS^^Ù7√qGy :ÑLèÊ2∏ ‹º'mÒœ∞æl}∂‰`|÷Îü¬.rqyÚIV]'.°ã…IØ˝Ú‚≤?Ëu˙ÿ˛ÂYWQI⁄Wdrﬁ?ˇI∆Çä‚`ıÿ%∑äd~.ñó^t$Ÿéä…i√KU‚gKÃ†`FÊ»Õ_]ê[gµXQ_y‰e:‹0Rî˛‹væ∂8æ∂F^à]¥ÊCfõ◊4qL∑≈ìÉ≈c≤äNz´=`ÿªtœŒz/ªE…ŸÂÀMs»xMÈŸ]å∫WAdÊ˝üîIG©Ûszﬂ¢(ï&º$cπÃññHŸT<¬uÀÀà]ÑÒì§IÆ√Ë`.ôˆÿú8‹GüüŸi˚éÍÜ$Åë ÊΩébÒÛà’≈è.•ïÜø‚◊¸ÃôxË∂KçŸZKc°;SÉÎ¨πÖ¿Ö◊«`ƒQ‘f∆ºR±ú…6p◊1Ωeûî:ìœ¯¡RﬁΩ«7Vøøc˝ﬂ√x[Õ[Ò@ŸûTÍXÎxÎ˛Ω~ïÃˇˆêT5E]¬èÇ˝ﬂÊÏ¸Sÿ∆?8?”Yã1ı*•7˝WùN∑ﬂ[⁄íj∞ëº‚ˇ∫]ˇ“ææ˚ï8¸o–ÎÂObü±U®-«é9=k¨L¯—°)~QÙ=‰W	¢IN¥ºH{.\ªêù©p∑Ø‘¡J"2[ìµ#È´:á91=x´	hw¨ˆùé≈iÃÔπ◊àÌ√XM`⁄kÂ–(ö5`3?5BøŸÙB/Ë–)\˙†8™†ÆhS®≠±_O÷hâ∏÷MÀ% à `‰Ω˘Ìªf‰Êz∞›ÿkm7~ƒ@√ΩáD#ﬁÌ“’¸rﬁY}Í¿„ΩmÜ€L>>‰π≠&Î˚¬≥ø|g¯œQ5˘[—dÌÀÛä&√{∑drpæ∏YÂ‰¸Ä‡LΩd‰közÀ˝Ç◊f˝¥≈ìÛdKÅƒxù”C≤ªØ·íT4é*7@ptÈú†˘√∂Ä‰Ω⁄&84PjWi»öÀ¢™K⁄KÈ¸9Âív˜∂õç∆vs˜Äm^#ﬂ•º|≥ƒ)>viQmÎzÈÁ©⁄»§œù€ùæ⁄#‘XÓp«¢À93∑)LaõTZŒ\.\hôâ!—ßIL!ŸWX<˘kÆÜ|nòvP ”v©±y!d!CA&Ú"Ù˜≠µRø¸B⁄8ô¬"è’Ÿ≠‚’ª@"‡kO®∞,AV≈óË‰U&í}U1¬¨„êŒ,ùçì(í…0>!)ñÔ†·7!Â„lœá'€Ä
7 ‡øûe≤/Uf]cuKu',≈ÚÎ´…Èr,rbãÉ¥≤«Ò⁄jwjefSCπíLã	oøÀˇ◊òtoß†|î÷nSÛ≠$l$åo
3I≈∆˝ô([4?[(‡¢ctèªµa(	_„!ﬁ )c<Ê%Ïú•ªŒ3~T¸Æ}’{˜S˜5∞ôg ⁄3_k∏
ÏÚå⁄RAÑa≤,9<ÉÈ˘a‚ˇï7π‘Á≠Å(á´9L8óÖ‘¢ ÁSÜ‹h∑«ì›&ˇñ&R≠“Œ?¬1ãJb°íßΩôSá0sãWcK»Ç^ò◊nºcIí◊´M`∫5?1ΩôÈaÏﬁ5ûj ´s|“"ÆTr9h˝™ÎRS÷~∆ä	¿MMBumäZ± ;Ó∏y5Ÿô%â€AÉåˆ⁄X∂ÿìO3¬º1bœÁa)ÉÌöE‹7p^fCÄ:?]Iòy«Nºù
õü’|èZ˝—úê¶ÙlÄSÿﬂG¥û[aË¿åÂtYEâTke˜9Æ∏k&r°_WQ8|ÑCó∏äîï‘ñN6˜C√¶(•(0Pø!#ÁLj		üY±¢Ñ kv7„h∑Lôà	&®=#œŸà&“÷¡6(–Lyñ‘rŸào_QPÄl√2£üÇgØ+˘iÀ
Ñ∑P#A7E¬[`< %Äﬁ2VkTÄÁ„«ø√L©®ºólÑ›éì^H
Æ(N˝¬åEL≥˙<F˙HâëPkQMÌE“#…Ëb/iöLûT†1Wme	H´ÌôX⁄$Û¶‰ ≤∏,wu9püü`6∏–vÙ√ØEÏùˇlƒAaû√¯âPﬁèÑÓFVÙí˘ÓﬁÈÜWfX}å?øcNÿÔ3gI·ﬂe ö|öz/,«`Q÷X®t‡¿^F.†œ(ÙÎÃÑ+	:Kã"Ôcı~`¨ﬁG¸keç˚‹›]ñ$™… ÃÙIÛœo…l|àÊÓ î}W≈F√LG¶â?ê!ÁŒ¸ÃÄ=;m ∏c}ŒÏªt#µh(Hv–ΩùvdÌ‘˘ÂÊ[oKÈç˚ˆMﬂ¢Q◊…”nY˚âÂ,è'l¬˘CK⁄ñ-e´D±#MK—ò@öMΩÜß;°8J4%Yi9Ñt»	0®≤g∆JdP#¿≤ç à2®JäÛ∞JÅÈ6Aûkº≈hí‹Ä=*¥¿h RÄd–|≤4oç<àà√»Ö
ì¬◊ÄJP{d®$‰®¢R£Y&qED‚!‰¡#ai Ä%M>.ı1/gvÎ”•·
<í8`Õ±L^VªµÍAR≠m±Xé\Í÷∏Ö©î’B~dÇ<˝cΩ¿Àıg«bN/úípñ,ÔÆÄ˜S)µ£0√Æƒ?qÁâ§òRV7GçùÌ[|ªR9≈*Ç˝Rê‹ó⁄E≤(Üò^eÓ“èxˇ≠›òËÄPÒÒ¢ìcC\íπ…DyÊbπ‡ë—jàj¿d¬‡@–‰$;#«OësÚË‹väu"E®ÜÃVÜKPfÙ’n´ŒD≤2hIYÊ2∞LÃ„îwÎÄäúQzx
Pù°AÓÑéó£@OUwIq í<ÛÑÖ4ã∑ÿ¸¯—V6\5q@~ÄÛ0PPˆ4Ê}©-´{5<≠Öø–YÃ|’ÖÛGp; À!
¨œ	≥√g,Ö·W“x'ƒŸ‘áÍ@BuÆπ¿t¡è≤Rgâ‰$à51≠¡~åç7)yX¿Û!ökY¢5»˛
8©1·K¥∆°Õxö∫«bëÍÏÏ¡â_K≈™ËYc≤KÔ2˙ÅøÉf°†bÈ-Y±∫$IRåeÓÃ∞rJI·'¿0–æGÆ…¸‰@^7Ø⁄ã#µ¿˜≈,BiÆÇºÎ"w¶ÜeQ{B„†ÜÉjò7Ïk	•u›¬∂£Èbuˆ{ˇûáõèVË?ûê™
õëÚ‰8ôáØk&^'ë∫6‡ˆ®PTÿgg˝Â î¬¸¢øa¡Ç–jê6T±\YAÔ¨UôT±° x[mÖÆjbˆX˘π«û:|* 3‰ãÀJé,|„;óÁWg›A∑¥%°øÁ§îv≥⁄È~R€mIµ”]Ã`õ—>%/=Tæ4Íîom$Ò#H˚P~D‚èA^√à?$tULSéüü@´A¸O©QØˇY·ì'êgÿZŸVÂxPÃ˝Øà.îu àl
é\ey‰√OhqÕ»˚˛1˘”qi‚7U˝à]Ã˝U—âD*PúTRL—≈ÄWœ¯‘ËÏÍâ\eê∏?œX~öı4·Ôq2L¥“{ ôπHË-§Ã®+µÇ\ê’Ì•“	√‰‰X.=CÊ.¶°–k§r⁄ÇY*zÓ/a∂RÁ’"ﬁE‘+Üí4ï˛t3”ÜùCÓ0´|˜ß¸D⁄¢ÔäêØV%_n∞¸•ˇ˜ø˛€øêìvÔÏ5àm«‰Ú¯øty‡˙yw¿l˛˝˛˜ˇ˚˛Uhœ∑‰Í˙ÚÂu∑ﬂW±k´√ßAÇ *ﬂs‘9#Á◊L™)ÊÄüSáâì–•NÈÏ [hú?Tæ√Íj*e\∫‡X˚&ºÙfj∑Ë∞ﬁ&–,≥ﬁz°[gy∏ö6mxˆ∫“Ce’£ø-cnÖ<'–ˆ3>0g‘Y¯◊Ù¶îŒ› ¬‹»i+WaA>UI]3G*@#Q"®+©fØìæ¢¶µ·xì¡çG•–üÃî¨8PKYkésÚ“ÉèEyˆ‹¿á?pÖ!A≤§WÛ1í¿ZJ$Î
∫·è„”†=~gÜé6QûäGR*˜Ú¥º/W´¨ÁHµ Ê^®V64uÓA≈‹GÛ°~*µ'[¢N‘ô;º®’•7Yô9®PhùúﬂS‚‹\‡‡g$™®!πÿ!ìΩ0.m?ÂÎö//,‘îü^@%ÃHä˛¶c}Ù%ƒ˙ÑÏ!2:q
Ø±”)gÇ<°¨b¸e∆«°´ÎﬂìùË∆5˝«¬tÈ8∏Ò≥aôÎéÒ”z{ÂsﬂµË–›‘,Êøb?¿jG¡O:_ÙEÊj=æZ≠bU™“Â©≤ß¢È›ùp∏wH5¿®Í(Üc’·Îëä€¶Œí4eç-qö9ÊÉ©ºASÅaE&É »tAD{g¯Ô¯ú∑≥æı˝≠wı?ogçÔ~¨ˇ#⁄EÆ˝Ú`‡ 2g)·cÈØ[àãm†ªıœXπ‡7ão/’’ ÷Eé=66ØåºØ≈E+c2_∂<≠E`§F5ﬂ)‚wø@µ.êÓ:ékc¶y…Æ'5c
áÃ·v¨2^Æwﬂ(xWXM¡K∂qÈDæ˙—ƒ ¶áå‹â±4\Ù⁄fBÉ≈¸Ò
Õ+πN:é;£<û«ÖQˇ»q^√Ÿ√⁄nKî1ß¯'ÌcûçøGÑ3™+ÃE≤◊kà§!ËoÄíw˜Å˜ØáéÑ˚qËÄ¢Úp	ârlxSÊ$öéyi%!ó+ìÛè‹%d∞Ã∂…˙`k<:ÿ@cô‚üÿﬂè¡&JB≠ ≤c%mŸ˙xıˆS„HE%ãÎ…ïûs•Ge™îiD5¯É,>Pêık≠∑èìà%ƒ@ÀÜúC®≥¢•™Ê◊S“˚ƒä≠®dD˙'Ú‹¿¨vüJKÈı˚òò8Hˆ‚’Ÿz˙â$£¬ﬂõäÚã)¨P&[-èÇs4≠–V"œ§H™ qõxíé<Øœ≥ïÖ<ç)›0¯†PãbÏÌ≥≥h"#6¶8Â∆ÓÈT$~:§·„%K4b˘ñBò,Kπ≤øF£ƒWı⁄ºÓh3h™R=$˜·Ü:åc‚o°f¿o•¯?r,H-{å≤J„Ää[a5Î$XõÃ!ˇﬁòñ%¶ÄWy‘1:‰g«óØ4âÖ◊™ÆSº`hl5V¶Ã‡Xß˙ìOÖ{ﬂìÀ·ØîÂ
ÛH1√RÜ≤ƒÄÍiJyR¢(O2∏HrÆgUéˇ≤»≥Ú
†@ccÅ⁄OUÑ• kä<Â>]aNå»©+LåõŒ®ßfŸWù1Ifï„¶p €Ëà2Ìïô‡Ã≤cµπ⁄ñÕ+fiËtÆª'ΩAõeÎÔ\ût◊:LE!<ª∫¸©[Ω;Å7’lgYŸ™˘Nü'›™yñ9¢ïÍ˛÷˝⁄T¨„ˆ˝≈êaﬂN«±AøÛy™9£œ≠<&*P£◊ªgr2çÅ—>&1WCkáN˝mf4ÄG˝—tf Î‡Â’Çb|∏WAÀÖcü®˘"XŒd¬l˙,ó¢	VbK,UôÚƒ†¢ 8≥b•Ã˝«(ÏŒêIñ¿£C]<∆Çû·Ê‹iÿ~∞à¨≤úÔåçU63#πñî‡[g?åó‚ØëÇRÂ ÎQø/µçÊDäcJµ{∞á¨WÛF∫ì9h˝ß∞ìQ•l!^îï˝ﬁÉ¥»B*Ô∂»ù\Ö ◊¨B∏aÖVÊ6(3EæXl§rgjdæâh2™"µ21ÁÚxÒ¶\bépöT†<9xõJÜU<=[Á¨›;'«Ììó }˛@XÍ()?˙]ìpÜ∑Xà*VÓè0Jóƒ9bqÏŒ|≈ H“p∆-ŸM·Õ¶á˘xM21„¨àVH=éGu˘i”aI.÷>àòPA:öt∆ÖºÒd24hFƒ“`≤™›?Ñy1*îÏê„≈Ñ\”π„J°»ûQô›.2÷®°$ëéÈù·"baÏ3˙!ù»”´•—√Ú—ñ•¥)E±mEL|a|t\ÃÍ@Œ€ò–öJ6`/ì¡1jÕZ®Gµ+<˛ÏﬂÑçéÓ¢Ø‚}∂\ãÜ]aÑ¢¯;9Ñ>ÀªÜà=C√X≈ñ+ŸbÇ
·}j∏£)o$Ú¸˚TßÖsl¯ Œ¸b˙”®wÎà’;å•a˙í7mÇmR≤.”€Õdãt¿±'¥"mvøéÜõﬁ—ˇWÇD	Œ˘tßø =›ˆn˜tßÎ∫é{åÉrÑa8˜˙”ˇ  ˇˇ «4X