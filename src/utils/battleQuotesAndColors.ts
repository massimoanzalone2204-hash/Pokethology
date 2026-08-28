import React from 'react';

export const getOpponentMoveQuote = (pokeName: string, moveName: string) => {
  const lowerMove = moveName.toLowerCase();
  
  const translations: Record<string, Record<string, string>> = {
    it: {
      default: `Ecco il potere di ${pokeName}!`,
      fire: "Che le fiamme ti brucino!",
      water: "Travolto dalla corrente d'acqua!",
      electric: "Scossa ad alta tensione fulminea!",
      grass: "La natura reclama il suo regno!",
      ice: "Congelati sotto il gelo assoluto!",
      psychic: "La forza della mente supera la gravita!",
      dragon: "La rabbia del drago imperversera!",
      boost: "Ogni molecola del mio essere si sta ricaricando!",
      protect: "Scudo d'energia inattaccabile!",
      healing: "Rigenerazione cellulare avviata!"
    },
    es: {
      default: `!Aqui esta el poder de ${pokeName}!`,
      fire: "!Que la llama eterna te consuma!",
      water: "!Arrastrado por las corrientes del oceano!",
      electric: "!Relampago de alta tension electrica!",
      grass: "!La naturaleza reclama su poder!",
      ice: "!Siente el frio absoluto!",
      psychic: "!Mi mentalidad supera cualquier fuerza fisica!",
      dragon: "!La ira del dragon se desata!",
      boost: "!Sintiendo la maxima energia competitiva!",
      protect: "!Escudo de energia impenetrable!",
      healing: "!Restauracion vital iniciada!"
    },
    fr: {
      default: `Voici le pouvoir de ${pokeName}!`,
      fire: "Que les flammes te consument !",
      water: "Emporte par le courant marin !",
      electric: "Decharge haute tension foudroyante !",
      grass: "La nature reprend ses droits !",
      ice: "Ressens le froid absolu !",
      psychic: "La force de l'esprit transcende la matiere !",
      dragon: "La colere du dragon fait rage !",
      boost: "Mon energie atteint son paroxysme !",
      protect: "Bouclier d'energie impenetrable !",
      healing: "Regeneration d'energie entamee !"
    },
    de: {
      default: `Sieh die wahre Macht von ${pokeName}!`,
      fire: "Lass die Flammen dich verzehren!",
      water: "Weggespult von der Flut!",
      electric: "Hochspannungsschock aktiv!",
      grass: "Die Kraft der Natur holt sich den Sieg!",
      ice: "Erfriere im absoluten Nullpunkt!",
      psychic: "Die Kraft des Geistes uberwindet alles!",
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

export const getMoveButtonClasses = (type: string) => {
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

export const typeBaseColors: Record<string, string> = {
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

export const typeHeaderGradients: Record<string, string> = {
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

export const baseBadge = "relative overflow-hidden inline-flex items-center justify-center font-hud font-black uppercase tracking-widest text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-3px_6px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.5)] border border-white/20 rounded-md transition-all before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none";

export const typeColors: Record<string, string> = {
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

export const statExplanations: Record<string, string> = {
  hp: "Hit Points: Determines how much damage a Pokemon can take before fainting.",
  attack: "Physical Attack: Affects the damage dealt by physical moves.",
  defense: "Physical Defense: Reduces the damage taken from physical moves.",
  "special-attack": "Special Attack: Affects the damage dealt by special moves.",
  "special-defense": "Special Defense: Reduces the damage taken from special moves.",
  speed: "Speed: Determines which Pokemon moves first in battle.",
};

export const NATURES = [
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

export const TYPE_CHART: Record<string, Record<string, number>> = {
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


export const getBattleBackground = (playerType?: string, opponentType?: string) => {
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
    keyword = `epic symmetric split-screen Pokemon stadium battleground arena: on the left side is a gorgeous ${pDesc} fading into a stunning ${oDesc} on the right side, seamlessly merged at the vertical center line`;
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

export const getBattleFallbackGradient = (playerType?: string, opponentType?: string) => {
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

