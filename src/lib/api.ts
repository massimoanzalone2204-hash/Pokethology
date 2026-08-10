import { savePokemonToCache, getPokemonFromCache, searchOfflinePokemon, getOfflinePokemonList } from "./cacheManager";
import { Pokemon, Ability, EvolutionNode, Move } from '../types';
import { pokeApi, isApiError } from './pokeApiService';

export const ALL_GAME_VERSIONS = [
  'red', 'blue', 'yellow', 'gold', 'silver', 'crystal', 
  'ruby', 'sapphire', 'emerald', 'firered', 'leafgreen', 
  'diamond', 'pearl', 'platinum', 'heartgold', 'soulsilver', 
  'black', 'white', 'black-2', 'white-2', 'x', 'y', 
  'omega-ruby', 'alpha-sapphire', 'sun', 'moon', 
  'ultra-sun', 'ultra-moon', 'lets-go-pikachu', 'lets-go-eevee', 
  'sword', 'shield', 'brilliant-diamond', 'shining-pearl', 
  'legends-arceus', 'scarlet', 'violet', 'legends-z-a'
];

const fetch = async (url: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const urlStr = typeof url === "string" ? url : (url instanceof URL ? url.toString() : (url as any).url || "");
  
  if (urlStr && urlStr.startsWith("https://pokeapi.co/api/v2")) {
    const endpoint = urlStr.replace("https://pokeapi.co/api/v2", "");
    const cacheKey = `proxy_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const data = await pokeApi.fetchWithCache<any>(endpoint, cacheKey);
    
    if (isApiError(data)) {
      return new Response(JSON.stringify(data), { status: data.status || 404, statusText: data.message });
    }
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' }});
  }

  return globalThis.fetch(url, init);
};

let cachedAllForms: any[] | null = null;
let pokemonFormsPromise: Promise<any[]> | null = null;

async function getAllFormsList(): Promise<any[]> {
  if (cachedAllForms) return cachedAllForms;
  if (pokemonFormsPromise) return pokemonFormsPromise;

  pokemonFormsPromise = (async () => {
    try {
      const allData = await pokeApi.fetchWithCache<any>('/pokemon?limit=10000', 'all_forms_10000');
      if (isApiError(allData)) return [];
      cachedAllForms = allData.results || [];
      return cachedAllForms;
    } catch (err) {
      console.error("Failed to fetch forms cache", err);
      return [];
    }
  })();

  return pokemonFormsPromise;
}

// Trigger background cache fetch immediately on module load so it's ready ASAP
getAllFormsList().catch(() => {});

const ALLOWED_SUFFIXES = [
  '-mega', '-mega-x', '-mega-y', '-mega-z', '-gmax',
  '-alola', '-galar', '-hisui', '-paldea',
  '-primal', '-ash', '-therian', '-origin', '-zen',
  '-crowned', '-eternamax', '-unbound', '-resolute', '-pirouette', '-sky',
  '-10-power-construct', '-50-power-construct', '-complete',
  '-dusk', '-dawn', '-ultra',
  '-midnight',
  '-ice', '-shadow',
  '-hero',
  '-single-strike', '-rapid-strike',
  '-bloodmoon',
  '-family-of-four', '-family-of-three',
  '-two-segment', '-three-segment',
  '-white', '-black',
  '-attack', '-defense', '-speed',
  '-sandy', '-trash',
  '-heat', '-wash', '-frost', '-fan', '-mow',
  '-pom-pom', '-pa-u', '-sensu', '-baile',
  '-busted',
  '-blue-striped', '-white-striped', '-red-striped',
  '-small', '-large', '-super', '-average',
  '-low-key', '-amped',
  '-wellspring-mask', '-hearthflame-mask', '-cornerstone-mask', '-teal-mask',
  '-blade', '-shadow-rider', '-ice-rider', '-shield', '-stretchy-mega', '-eternal-mega'
];

export const MALE_BASE_FORMS: Record<string, string> = {
  'pyroar': 'pyroar-male',
  'jellicent': 'jellicent-male',
  'frillish': 'frillish-male',
  'meowstic': 'meowstic-male',
  'indeedee': 'indeedee-male',
  'oinkologne': 'oinkologne-male',
  'basculegion': 'basculegion-male',
  'tatsugiri': 'tatsugiri-curly'
};

const REV_MALE_BASE_FORMS: Record<string, string> = Object.fromEntries(
  Object.entries(MALE_BASE_FORMS).map(([k, v]) => [v, k])
);

export const LEGENDS_ZA_MEGA_ENTRIES: Record<string, string> = {
  'raichu-mega-x': "It flies forming an X while releasing 50-million-volt electrical sparks from its ears and two tails.",
  'raichu-mega-y': "When it unleashes electrical shocks, it channels electricity from the tip of its tail to the zigzag fur growing on its temples, tracing a Y.",
  'chimecho-mega': "It attacks in every direction with sound waves emitted by vibrating every inch of its body. Anyone who listens loses self-awareness.",
  'absol-mega-z': "As an act of kindness to spare its opponents from suffering, it slashes them in a single blow with its coat, which has been sharpened like claws.",
  'staraptor-mega': "Its flying ability is top-class. It soars into the sky with ease even after grabbing a Steelix weighing over 400 kg.",
  'garchomp-mega-z': "A new Mega Evolution. It flies at the speed of sound and tears through enemies with the menacing claws on its wings.",
  'lucario-mega-z': "It evades every attack thanks to the aura waves surrounding its body, making it look as though it is dancing when it battles.",
  'heatran-mega': "It uses its extremely high body temperature to keep enemies at bay. It is said to be capable of raising it up to 1,000,000 °C when going all out.",
  'darkrai-mega': "Its dark power hides the sun and plunges everything around it into darkness. It is impossible to escape its evil eye.",
  'golurk-mega': "The energy inside it was activated following Mega Evolution and could cause it to explode at any moment.",
  'meowstic-mega': "It expands and compresses anything using its psychic powers. To defeat its enemies, it goes so far as to distort space itself.",
  'meowstic-female-mega': "It expands and compresses anything using its psychic powers. To defeat its enemies, it goes so far as to distort space itself.",
  'meowstic-male-mega': "It expands and compresses anything using its psychic powers. To defeat its enemies, it goes so far as to distort space itself.",
  'crabominable-mega': "A light strike from its fists, coated in a thick layer of ice, is enough to crumble even reinforced concrete.",
  'golisopod-mega': "It furiously attacks opponents with its four primary limbs, and when they are cornered, it finishes them off with its hidden limbs.",
  'magearna-mega': "It assumes this form when its hidden mode is activated. Its emotions are suppressed at birth, and it knocks down any enemy in front of it.",
  'zeraora-mega': "It stores electrical energy equivalent to ten lightning bolts. When it decides to transcend its limits, it becomes one of the finest Electric-type Pokémon.",
  'scovillain-mega': "Mega Evolution has made it even spicier. It strikes opponents by flailing the tie-shaped part of its body.",
  'glimmora-mega': "Its petals detached after increasing in size and scatter toxic shards while spinning to protect its central body.",
  'tatsugiri-stretchy-mega': "Mega Evolution stimulated its brain, making it even more cunning. It can create copies of itself that it commands at will.",
  'tatsugiri-mega': "Mega Evolution stimulated its brain, making it even more cunning. It can create copies of itself that it commands at will.",
  'tatsugiri-curly-mega': "Mega Evolution stimulated its brain, making it even more cunning. It can create copies of itself that it commands at will.",
  'tatsugiri-droopy-mega': "Mega Evolution stimulated its brain, making it even more cunning. It can create copies of itself that it commands at will.",
  'baxcalibur-mega': "Following Mega Evolution, the blade on its dorsal crest has grown gigantic. It fires beams from the hilt located in its solar plexus.",
  'dragonite-mega': "Mega Dragonite takes on elements of Dragonair’s design with angelic wings growing from its head and feathers at the base of its legs. It’s predominantly a special attacker with insane bulk, though its physical attack is also respectable.",
  'victreebel-mega': "The volume of acid in Mega Victreebel’s mouth has increased significantly due to Mega Evolution. Its body has become extremely round and bouncy, with the vine usually hanging in front of its mouth now wrapped around its head.",
  'hawlucha-mega': "Mega Hawlucha’s muscles are enhanced by Mega Evolution, increasing both Attack and Defense. It features a fancy wing-like collar and an impressive gold-decorated mask, showing off its strength with confidence.",
  'malamar-mega': "Mega Evolution has caused Malamar’s brain to swell, significantly enhancing its psychic power. It uses colorful lights to overwrite personalities and memories, controlling others with its hypnotic abilities.",
  'greninja-mega': "Mega Greninja spins a giant shuriken at high speed to make it float, then clings to it upside down to catch opponents unawares. Its blue tones have been replaced with black, enhancing its ninja-inspired design.",
  'delphox-mega': "Mega Delphox wields flaming branches to dazzle opponents before incinerating them with a huge fireball. It appears to ride a broomstick, with the black coloring of its lower half making it look like it just escaped a fire.",
  'chesnaught-mega': "Mega Chesnaught has fortified armor and an unwavering will to defend at all costs. Its back plate has been upgraded with numerous spikes, and it wears a red fur cape with an overall darker color design.",
  'drampa-mega': "Drampa’s cells have been invigorated, allowing it to regain its youth. It manipulates the atmosphere to summon storms, featuring a black body rather than the traditional teal, a tail that billows like a storm cloud, and an impressive mustache.",
  'excadrill-mega': "Mega Excadrill can destroy anything when it brings its arms and head together to form a streamlined shape and spins at high speeds. It’s a top-notch physical attacker with monstrous Attack and high Defense.",
  'eelektross-mega': "Mega Eelektross generates 10 times the electricity it did before Mega Evolving, discharging this power from false Eelektrik made of mucus. It’s a fantastic mixed attacker despite still taking damage from Ground types.",
  'chandelure-mega': "One of Mega Chandelure’s eyes is a window linking our world with the afterlife. It draws in hatred and converts it into power, making it the pinnacle of Special Attack among non-Legendary Pokemon.",
  'falinks-mega': "Mega Falinks has achieved the ultimate battle formation, possible only when the troopers and brass have the strongest of bonds. It’s the only Galar Pokemon to receive a new Mega Evolution.",
  'barbaracle-mega': "Mega Barbaracle uses its many arms to toy with opponents, keeping its head extremely busy. It’s a dangerous physical tank that thrives in close combat with excellent coverage and resistances.",
  'skarmory-mega': "Mega Skarmory flies faster than the speed of sound, whipping up shock waves to send enemies flying before finishing them with its talons. It features a golden design that brilliantly matches its appearance.",
  'scolipede-mega': "Mega Scolipede’s deadly venom gives off a faint glow that affects its mind, honing its viciousness. It has become a very slow physical tank with equally impressive Attack and Defense.",
  'froslass-mega': "Mega Froslass can use eerie cold air imbued with ghost energy to freeze even insubstantial things like flames or wind. It’s a fast and strong special attacker that can take some damage.",
  'dragalge-mega': "Mega Dragalge spits a liquid that causes regenerative power to run wild. The liquid is deadly poison to everything other than itself, making it very tanky and usable despite its Ground weakness.",
  'clefable-mega': "Mega Clefable flies by using moonlight to control gravity within a 32-foot radius. It’s no longer a pure Fairy type, gaining Flying typing and becoming stronger offensively rather than bulky.",
  'scrafty-mega': "Mega Evolution has caused Scrafty’s shed skin to turn white, growing tough and supple. It’s a tanky behemoth with incredible defenses in both physical and special categories.",
  'starmie-mega': "Mega Starmie’s movements have become more humanlike, with long humanoid legs making it nightmare fuel. It’s no longer just a special attacker but rather a mixed attacker with high stats across the board.",
  'pyroar-mega': "Mega Pyroar spews flames hotter than 18,000 degrees Fahrenheit, swinging its grand blazing mane as it protects allies. It’s strong, reliable, and well-rounded as a Fire-type Special Attacker.",
  'pyroar-male-mega': "Mega Pyroar spews flames hotter than 18,000 degrees Fahrenheit, swinging its grand blazing mane as it protects allies. It’s strong, reliable, and well-rounded as a Fire-type Special Attacker.",
  'pyroar-female-mega': "Mega Pyroar spews flames hotter than 18,000 degrees Fahrenheit, swinging its grand blazing mane as it protects allies. It’s strong, reliable, and well-rounded as a Fire-type Special Attacker.",
  'meganium-mega': "Mega Meganium gains Fairy typing and can fire a tremendously powerful Solar Beam from its four flowers, earning it the nickname “Mega Sol Cannon.” It’s a definitive step up from regular Meganium.",
  'feraligatr-mega': "Mega Feraligatr forms a gigantic set of jaws with its arms and hood-like fin, with a bite 10 times as powerful as its actual jaws. It features a dinosaur-themed helm design and deals tremendous physical damage.",
  'emboar-mega': "Mega Emboar brandishes a blazing flame shaped like a serpentine spear as it rushes to rescue imperiled allies. It has particularly strong physical attack with okay defense but is somewhat slow.",
  'floette-eternal-mega': "The Eternal Flower has absorbed all energy from Mega Evolution, now attacking enemies on its own. This unique form of Floette has incredible special attacking potential with excellent special bulk.",
  'floette-mega': "The Eternal Flower has absorbed all energy from Mega Evolution, now attacking enemies on its own. This unique form of Floette has incredible special attacking potential with excellent special bulk.",
  'zygarde-mega': "Mega Zygarde is only available when Zygarde is at 50% health and transforms into its 100% form. It responds to people’s emotions during unprecedented crises, calming situations with unmatched power.",
  'zygarde-50-mega': "Mega Zygarde is only available when Zygarde is at 50% health and transforms into its 100% form. It responds to people’s emotions during unprecedented crises, calming situations with unmatched power."
};

export function getZAEntry(pokemonName: string): string | null {
  const norm = pokemonName.toLowerCase().trim();
  for (const [key, text] of Object.entries(LEGENDS_ZA_MEGA_ENTRIES)) {
    if (norm === key || norm.endsWith('-' + key) || norm === key) {
      return text;
    }
  }
  return null;
}


export async function searchPokemon(query: string, lang: string = 'en'): Promise<Pokemon> {
  let formattedQuery = query.trim().toLowerCase();

  // Normalize Koraidon and Miraidon to base form (removing alternate forms from backend)
  if (formattedQuery.startsWith('koraidon-')) {
    formattedQuery = 'koraidon';
  } else if (formattedQuery.startsWith('miraidon-')) {
    formattedQuery = 'miraidon';
  }

  // Block removed Tatsugiri megas
  if (formattedQuery === 'tatsugiri-curly-mega' || formattedQuery === 'tatsugiri-droopy-mega') {
    throw new Error("Pokemon " + formattedQuery + " not found!");
  }

  if (MALE_BASE_FORMS[formattedQuery]) {
    formattedQuery = MALE_BASE_FORMS[formattedQuery];
  }
  if (!formattedQuery) throw new Error("Please enter a Pokemon name or ID.");

  const baseLang = lang.split('-')[0];
  const cacheKey = `v2-${formattedQuery}-${baseLang}`;
  const cachedPokemon = await getPokemonFromCache(cacheKey);
  if (cachedPokemon) {
    return cachedPokemon;
  }

  // Fallback check in IndexedDB offline cache
  const offlineMatch = await searchOfflinePokemon(formattedQuery);

  // If client device is strictly offline
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    if (offlineMatch) return offlineMatch;
    throw new Error(`Pokemon "${query}" is not available in local IndexedDB cache while offline.`);
  }

  // Fetch from PokeAPI
  let pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${formattedQuery}`);
  let data;

  if (!pokeRes.ok) {
    // 1. Try species endpoint (handles cases like "basculin", "meowstic", "wormadam", "pumpkaboo", etc. where species name differs from default variety endpoint name)
    try {
      const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${formattedQuery}`);
      if (speciesRes.ok) {
        const speciesData = await speciesRes.json();
        const defaultVar = speciesData.varieties?.find((v: any) => v.is_default) || speciesData.varieties?.[0];
        if (defaultVar && defaultVar.pokemon?.url) {
          const varRes = await fetch(defaultVar.pokemon.url);
          if (varRes.ok) {
            pokeRes = varRes;
            data = await varRes.json();
          }
        }
      }
    } catch (_) {}

    // 2. If species fallback didn't resolve it, try progressively shorter base forms (e.g., tatsugiri-curly-mega -> tatsugiri-curly -> tatsugiri)
    if (!data) {
      const parts = formattedQuery.split('-');
      for (let i = parts.length - 1; i > 0; i--) {
        const baseQuery = parts.slice(0, i).join('-');
        try {
          const baseRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${baseQuery}`);
          if (baseRes.ok) {
            pokeRes = baseRes;
            data = await baseRes.json();
            data.name = formattedQuery; // Preserve the requested form name
            break;
          }
        } catch (_) {}
      }
    }
  }
  if (!data) {
    if (offlineMatch) {
      return offlineMatch;
    }
    if (!pokeRes || !pokeRes.ok) {
      throw new Error(`Pokemon "${query}" not found!`);
    }
    data = await pokeRes.json();
  }

  // --- MASTER FALLBACK FOR INCOMPLETE FORM DATA ---
  // Many alternate forms (Megas, Gmax, special forms) from PokeAPI are missing abilities, moves, stats, or cries.
  if (data.species && data.species.url) {
    let needsFallback = false;
    if (!data.abilities || data.abilities.length === 0) needsFallback = true;
    if (!data.moves || data.moves.length === 0) needsFallback = true;
    if (!data.stats || data.stats.length === 0) needsFallback = true;
    if (!data.sprites || !data.sprites.front_default) needsFallback = true;
    if (!data.sprites?.other?.['official-artwork']?.front_default) needsFallback = true;
    if (!data.cries || (!data.cries.latest && !data.cries.legacy)) needsFallback = true;
    if (!data.types || data.types.length === 0) needsFallback = true;

    if (needsFallback) {
      try {
        const speciesRes = await fetch(data.species.url);
        if (speciesRes.ok) {
          const speciesData = await speciesRes.json();
          const defaultVariety = speciesData.varieties.find((v: any) => v.is_default);
          
          if (defaultVariety && defaultVariety.pokemon.url) {
            const baseRes = await fetch(defaultVariety.pokemon.url);
            if (baseRes.ok) {
              const baseData = await baseRes.json();
              
              if (!data.abilities || data.abilities.length === 0) data.abilities = baseData.abilities;
              if (!data.moves || data.moves.length === 0) data.moves = baseData.moves;
              if (!data.stats || data.stats.length === 0) data.stats = baseData.stats;
              
              // For sprites, we merge to keep any form-specific ones if they exist, but fill gaps
              if (!data.sprites) data.sprites = baseData.sprites;
              else if (!data.sprites.other?.['official-artwork']?.front_default) {
                  if (!data.sprites.other) data.sprites.other = {};
                  data.sprites.other['official-artwork'] = baseData.sprites.other?.['official-artwork'];
              }
              if (!data.sprites.front_default) data.sprites.front_default = baseData.sprites.front_default;

              if (!data.cries || (!data.cries.latest && !data.cries.legacy)) data.cries = baseData.cries;
              if (!data.types || data.types.length === 0) data.types = baseData.types;
              if (!data.weight) data.weight = baseData.weight;
              if (!data.height) data.height = baseData.height;
            }
          }
        }
      } catch(e) {
         console.error("Failed to fetch fallback base data for form", e);
      }
    }
  }
  // --- END MASTER FALLBACK ---

  // Ensure official-artwork is populated for sprites, including shiny artwork from pokeAPI
  if (data && data.sprites) {
    if (!data.sprites.other) data.sprites.other = {};
    if (!data.sprites.other['official-artwork']) {
      data.sprites.other['official-artwork'] = {
        front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
        front_shiny: (data.id === 10309 || data.name === 'garchomp-mega-z')
          ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/10058.png`
          : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${data.id}.png`
      };
    } else {
      const offArt = data.sprites.other['official-artwork'];
      if (!offArt.front_default) {
        offArt.front_default = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;
      }
      if (!offArt.front_shiny) {
        if (data.id === 10309 || data.name === 'garchomp-mega-z') {
          offArt.front_shiny = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/10058.png`;
        } else {
          offArt.front_shiny = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${data.id}.png`;
        }
      }
    }
  }

  // Fetch abilities
  const abilities: Ability[] = (data.abilities && data.abilities.length > 0) ? await Promise.all(
    data.abilities.map(async (a: any) => {

      try {
        const res = await fetch(a.ability.url);
        const abilityDetails = await res.json();
        let entry = abilityDetails.flavor_text_entries.find((e: any) => e.language.name === baseLang);
        if (!entry) {
          entry = abilityDetails.flavor_text_entries.find((e: any) => e.language.name === 'en');
        }
        const localizedName = abilityDetails.names?.find((n: any) => n.language.name === baseLang)?.name ||
                                abilityDetails.names?.find((n: any) => n.language.name === 'en')?.name ||
                                a.ability.name;
        return {
          name: localizedName,
          is_hidden: a.is_hidden,
          description: entry ? entry.flavor_text : 'No description available.'
        };
      } catch (e) {
        return {
          name: a.ability.name,
          is_hidden: a.is_hidden,
          description: 'Description unavailable.'
        };
      }
    })
  ) : [];

  // Fetch evolutions and species data
  let evolutionChain: EvolutionNode | null = null;
  let description = 'No description available.';
  let gameDescriptions: { version: string; flavor_text: string }[] = [];
  let varieties: Pokemon['varieties'] = [];
  let baseId = data.id;
  try {
    const speciesRes = await fetch(data.species.url);
    const speciesData = await speciesRes.json();
    
    // Original variety mapping
    varieties = speciesData.varieties
      .filter((v: any) => 
        v.pokemon.name !== 'tatsugiri-curly-mega' && 
        v.pokemon.name !== 'tatsugiri-droopy-mega' &&
        !v.pokemon.name.startsWith('koraidon-') &&
        !v.pokemon.name.startsWith('miraidon-')
      )
      .map((v: any) => ({
        ...v,
        pokemon: {
          ...v.pokemon,
          name: REV_MALE_BASE_FORMS[v.pokemon.name] || v.pokemon.name
        }
      }));
    
    baseId = speciesData.id;
    
    let entry = speciesData.flavor_text_entries.find((e: any) => e.language.name === baseLang);
    if (!entry) {
      entry = speciesData.flavor_text_entries.find((e: any) => e.language.name === 'en');
    }
    if (entry) {
      description = entry.flavor_text
        .replace(/\f/g, ' ')
        .replace(/\u00ad\n/g, '')
        .replace(/\u00ad/g, '')
        .replace(/ \n/g, ' ')
        .replace(/\n/g, ' ')
        .trim();
    }

    if (speciesData.flavor_text_entries) {
      const langEntries = speciesData.flavor_text_entries.filter((e: any) => e.language.name === baseLang);
      const entriesToUse = langEntries.length > 0 ? langEntries : speciesData.flavor_text_entries.filter((e: any) => e.language.name === 'en');
      
      const versionMap = new Map<string, string>();
      entriesToUse.forEach((e: any) => {
        const cleanText = e.flavor_text;
        const vName = e.version?.name;
        if (vName && cleanText.length > 0 && cleanText !== 'No description available.') {
          // Keep the first entry for each unique version
          if (!versionMap.has(vName)) {
            versionMap.set(vName, cleanText);
          }
        }
      });

      let parsedDescriptions: { version: string; flavor_text: string }[] = [];
      
      const pokemonName = data.name.toLowerCase();
      const zaEntryText = getZAEntry(pokemonName);
      const isZAMega = zaEntryText !== null || pokemonName.includes('legends-z-a') || pokemonName.includes('legends-za');

      let validVersions: string[] | null = null;
      if (pokemonName.includes('-gmax')) {
        validVersions = ['sword', 'shield'];
      } else if (isZAMega) {
        validVersions = ['legends-z-a'];
      } else if (pokemonName.includes('-mega') || pokemonName.includes('-primal')) {
        validVersions = ['x', 'y', 'omega-ruby', 'alpha-sapphire', 'sun', 'moon', 'ultra-sun', 'ultra-moon', 'lets-go-pikachu', 'lets-go-eevee'];
      } else if (pokemonName.includes('-alola')) {
        validVersions = ['sun', 'moon', 'ultra-sun', 'ultra-moon', 'lets-go-pikachu', 'lets-go-eevee', 'sword', 'shield', 'scarlet', 'violet'];
      } else if (pokemonName.includes('-galar')) {
        validVersions = ['sword', 'shield', 'scarlet', 'violet'];
      } else if (pokemonName.includes('-hisui')) {
        validVersions = ['legends-arceus', 'scarlet', 'violet'];
      } else if (pokemonName.includes('-paldea')) {
        validVersions = ['scarlet', 'violet'];
      }

      ALL_GAME_VERSIONS.forEach(version => {
        if (versionMap.has(version) && (!validVersions || validVersions.includes(version))) {
          const text = versionMap.get(version) || "";
          const cleanText = text
            .replace(/\f/g, ' ')
            .replace(/\u00ad\n/g, '')
            .replace(/\u00ad/g, '')
            .replace(/ \n/g, ' ')
            .replace(/\n/g, ' ')
            .trim();
          parsedDescriptions.push({ version, flavor_text: cleanText });
        }
      });
      
      // Fallback for Scarlet and Violet if missing (only for base forms)
      if (!validVersions) {
        const fallbackText = parsedDescriptions.length > 0 
          ? parsedDescriptions[parsedDescriptions.length - 1].flavor_text 
          : description;
        if (!parsedDescriptions.some(d => d.version === 'scarlet')) {
          parsedDescriptions.push({ version: 'scarlet', flavor_text: fallbackText });
        }
        if (!parsedDescriptions.some(d => d.version === 'violet')) {
          parsedDescriptions.push({ version: 'violet', flavor_text: fallbackText });
        }
      }

      // Special handling for Legends Z-A Megas
      if (isZAMega) {
        const zaText = zaEntryText || description || "Discovered in the Kalos region during urban redevelopment, this Mega Evolution unleashes incredible power in Pokémon Legends: Z-A.";
        parsedDescriptions = [{ version: 'legends-z-a', flavor_text: zaText }];
      } else if (validVersions && parsedDescriptions.length === 0) {
        const fallbackText = description || "Special form entry available in designated games.";
        validVersions.forEach(v => {
          parsedDescriptions.push({ version: v, flavor_text: fallbackText });
        });
      }

      if (parsedDescriptions.length === 0 && description) {
        parsedDescriptions.push({ version: 'default', flavor_text: description });
      }

      gameDescriptions = parsedDescriptions;
    }

    const evoRes = await fetch(speciesData.evolution_chain.url);
    const evoData = await evoRes.json();

    const formatEvolutionDetails = (detailsArr: any[]) => {
      if (!detailsArr || detailsArr.length === 0) return '';
      const detail = detailsArr[0];
      const parts: string[] = [];

      if (detail.min_level) {
        parts.push(`Lv. ${detail.min_level}`);
      }

      if (detail.trigger?.name === 'use-item' && detail.item?.name) {
        parts.push(`Use ${detail.item.name.replace(/-/g, ' ')}`);
      } else if (detail.item?.name) {
        parts.push(detail.item.name.replace(/-/g, ' '));
      }

      if (detail.held_item?.name) {
        parts.push(`Hold ${detail.held_item.name.replace(/-/g, ' ')}`);
      }

      if (detail.min_happiness) {
        parts.push(`High Friendship`);
      }
      if (detail.min_affection) {
        parts.push(`High Affection`);
      }
      if (detail.min_beauty) {
        parts.push(`High Beauty`);
      }

      if (detail.gender === 1) parts.push('♀');
      if (detail.gender === 2) parts.push('♂');

      if (detail.time_of_day) {
        parts.push(detail.time_of_day.charAt(0).toUpperCase() + detail.time_of_day.slice(1));
      }

      if (detail.location?.name) {
        parts.push(`at ${detail.location.name.replace(/-/g, ' ')}`);
      }

      if (detail.known_move?.name) {
        parts.push(`knows ${detail.known_move.name.replace(/-/g, ' ')}`);
      }

      if (detail.known_move_type?.name) {
        parts.push(`knows ${detail.known_move_type.name} move`);
      }

      if (detail.relative_physical_stats === 1) parts.push('Atk > Def');
      if (detail.relative_physical_stats === -1) parts.push('Def > Atk');
      if (detail.relative_physical_stats === 0) parts.push('Atk = Def');

      if (detail.needs_overworld_rain) parts.push('Rain');
      if (detail.turn_upside_down) parts.push('Turn Upside Down');

      if (detail.trigger?.name === 'trade') {
        if (!parts.some(p => p.toLowerCase().includes('trade'))) {
          parts.unshift('Trade');
        }
      }

      if (detail.trigger?.name === 'shed') {
        parts.push('Empty Spot');
      }

      if (detail.trigger?.name === 'spin') {
        parts.push('Spin Trainer');
      }

      if (parts.length === 0) {
        if (detail.trigger?.name === 'level-up') {
          return 'Level Up';
        } else if (detail.trigger?.name) {
          return detail.trigger.name.replace(/-/g, ' ');
        }
      }

      return parts.join(' + ');
    };

    const parseEvoChain = (chain: any): EvolutionNode => {
      const id = parseInt(chain.species.url.split('/').filter(Boolean).pop() || '0', 10);
      const min_details = formatEvolutionDetails(chain.evolution_details);
      const current: EvolutionNode = {
        name: chain.species.name,
        id,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        min_details,
        evolves_to: []
      };
      if (chain.evolves_to && chain.evolves_to.length > 0) {
        current.evolves_to = chain.evolves_to.map((next: any) => parseEvoChain(next));
      }
      return current;
    };
    evolutionChain = parseEvoChain(evoData.chain);
  } catch (e) {
    console.error("Failed to fetch evolutions", e);
  }

  // Calculate weaknesses
  const typeMultipliers: Record<string, number> = {};
  try {
    await Promise.all(data.types.map(async (t: any) => {
      const typeRes = await fetch(t.type.url);
      const typeData = await typeRes.json();
      const locName = typeData.names?.find((n: any) => n.language.name === baseLang)?.name;
      t.type.localized_name = locName || t.type.name.toUpperCase();
      const relations = typeData.damage_relations;
      
      relations.double_damage_from.forEach((r: any) => {
        typeMultipliers[r.name] = (typeMultipliers[r.name] || 1) * 2;
      });
      relations.half_damage_from.forEach((r: any) => {
        typeMultipliers[r.name] = (typeMultipliers[r.name] || 1) * 0.5;
      });
      relations.no_damage_from.forEach((r: any) => {
        typeMultipliers[r.name] = 0;
      });
    }));
  } catch (e) {
    console.error("Failed to fetch type relations", e);
  }

  const weaknesses = Object.entries(typeMultipliers)
    .filter(([_, multiplier]) => multiplier > 1)
    .map(([name]) => name);

  // Fetch moves details (limited to avoid 100+ requests)
  let movesSource = data.moves || [];

  // Prioritize level-up moves
  const levelUpMoves = movesSource.filter((m: any) => 
    m.version_group_details.some((v: any) => v.move_learn_method.name === 'level-up')
  );
  const otherMoves = movesSource.filter((m: any) => 
    !m.version_group_details.some((v: any) => v.move_learn_method.name === 'level-up')
  );
  
  const movesToFetch = [...levelUpMoves, ...otherMoves].slice(0, 150); // Increased to 150 to fetch all possible moves for comprehensive analysis
  const moves: Move[] = await Promise.all(
    movesToFetch.map(async (m: any) => {
      try {
        const res = await fetch(m.move.url);
        const moveData = await res.json();
        
        // Find description
        let description = 'No description available.';
        const entry = moveData.flavor_text_entries.find((e: any) => e.language.name === baseLang) || 
                      moveData.flavor_text_entries.find((e: any) => e.language.name === 'en');
        if (entry) {
          description = entry.flavor_text
            .replace(/\f/g, ' ')
            .replace(/\u00ad\n/g, '')
            .replace(/\u00ad/g, '')
            .replace(/ \n/g, ' ')
            .replace(/\n/g, ' ')
            .trim();
        }

        const versionGroup = m.version_group_details[0];
        let learnMethod: Move['learn_method'] = 'other';
        if (versionGroup.move_learn_method.name === 'level-up') learnMethod = 'level-up';
        else if (versionGroup.move_learn_method.name === 'machine') learnMethod = 'machine';
        else if (versionGroup.move_learn_method.name === 'egg') learnMethod = 'egg';
        else if (versionGroup.move_learn_method.name === 'tutor') learnMethod = 'tutor';

        return {
          name: m.move.name,
          url: m.move.url,
          level_learned_at: versionGroup.level_learned_at,
          learn_method: learnMethod,
          power: moveData.power,
          accuracy: moveData.accuracy,
          priority: moveData.priority,
          type: moveData.type.name,
          pp: moveData.pp,
          damage_class: moveData.damage_class.name,
          description,
          effect_chance: moveData.effect_chance,
          stat_changes: moveData.stat_changes.map((sc: any) => ({
            change: sc.change,
            stat: { name: sc.stat.name }
          })),
          meta: moveData.meta,
          target: moveData.target.name
        };
      } catch (e) {
        return {
          name: m.move.name,
          url: m.move.url,
          learn_method: 'other' as const,
          power: null,
          accuracy: null,
          priority: 0,
          type: 'normal',
          pp: 5,
          damage_class: 'physical' as const,
          description: 'Failed to load move data.',
          effect_chance: null,
          target: 'selected-pokemon'
        };
      }
    })
  );

  const result = {
    ...data,
    name: REV_MALE_BASE_FORMS[data.name] || data.name,
    baseId,
    abilities,
    evolutionChain,
    weaknesses,
    description,
    gameDescriptions,
    moves,
    varieties
  };

  await savePokemonToCache(cacheKey, result);
  return result;
}

export const GENERATIONS = [
  { id: 1, name: 'GEN 01', start: 1, end: 151 },
  { id: 2, name: 'GEN 02', start: 152, end: 251 },
  { id: 3, name: 'GEN 03', start: 252, end: 386 },
  { id: 4, name: 'GEN 04', start: 387, end: 493 },
  { id: 5, name: 'GEN 05', start: 494, end: 649 },
  { id: 6, name: 'GEN 06', start: 650, end: 721 },
  { id: 7, name: 'GEN 07', start: 722, end: 809 },
  { id: 8, name: 'GEN 08', start: 810, end: 905 },
  { id: 9, name: 'GEN 09', start: 906, end: 1025 },
];

export async function getPokemonList(start: number, end: number): Promise<{name: string, url: string, displayId?: number, isForm?: boolean, isOfflineCached?: boolean}[]> {
  try {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new Error("OFFLINE_NETWORK_UNAVAILABLE");
    }

    const limit = end - start + 1;
    const offset = start - 1;
    
    // Fetch the base list for the requested generation
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error("Failed to fetch Pokemon list");
    const data = await res.json();
    
    // Fetch all forms list as database fallback helper
    const allForms = await getAllFormsList();
    
    const results: any[] = [];
    
    data.results.forEach((p: any) => {
      const displayId = parseInt(p.url.split('/').filter(Boolean).pop() || '0', 10);
      const cleanName = REV_MALE_BASE_FORMS[p.name] || p.name;
      const baseName = p.name;
      
      results.push({
        ...p,
        name: cleanName,
        displayId
      });
      
      // Find matching forms in cache
      let addedForms = new Set<string>();
      let relatedForms = allForms.filter((f: any) => 
        f.name !== baseName && 
        f.name.startsWith(baseName + '-')
      );

      // Special logic for Tatsugiri: replace curly-mega with stretchy-mega
      if (baseName.includes('tatsugiri')) {
        relatedForms = relatedForms.filter((f: any) => f.name !== 'tatsugiri-curly-mega' && f.name !== 'tatsugiri-droopy-mega');
        const stretchyMega = allForms.find((f: any) => f.name === 'tatsugiri-stretchy-mega');
        if (stretchyMega && !relatedForms.some((f: any) => f.name === 'tatsugiri-stretchy-mega')) {
          relatedForms.push(stretchyMega);
        }
      }

      // Inject custom Legends Z-A Megas from LEGENDS_ZA_MEGA_ENTRIES
      Object.keys(LEGENDS_ZA_MEGA_ENTRIES).forEach(zaKey => {
        if (zaKey === 'tatsugiri-curly-mega' || zaKey === 'tatsugiri-droopy-mega' || zaKey === 'meowstic-female-mega' || zaKey === 'meowstic-male-mega' || zaKey === 'pyroar-female-mega' || zaKey === 'pyroar-male-mega' || zaKey === 'zygarde-50-mega' || zaKey === 'floette-eternal-mega') return;
        if (zaKey.startsWith(baseName + '-') || (baseName === 'meowstic' && zaKey.startsWith('meowstic-')) || (baseName === 'pyroar' && zaKey.startsWith('pyroar-')) || (baseName === 'floette' && zaKey.startsWith('floette-')) || (baseName === 'zygarde' && zaKey.startsWith('zygarde-'))) {
          if (!relatedForms.some((f: any) => f.name === zaKey)) {
            relatedForms.push({ name: zaKey, url: `https://pokeapi.co/api/v2/pokemon/${zaKey}` });
          }
        }
      });

      // Order related forms based on suffix relevance (e.g. regional, primal, megas, gmax last)
      const sortedRelated = relatedForms.sort((a, b) => {
        const aSuff = a.name.replace(baseName, '');
        const bSuff = b.name.replace(baseName, '');
        const aIdx = ALLOWED_SUFFIXES.indexOf(aSuff);
        const bIdx = ALLOWED_SUFFIXES.indexOf(bSuff);
        return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
      });

      sortedRelated.forEach((form: any) => {
        if (form.name.includes('-totem') || form.name.includes('-starter') || form.name.includes('-cosplay') || form.name.includes('-cap')) return;
        if (addedForms.has(form.name)) return;

        let suffix = form.name.replace(baseName, '');
        if (form.name === 'tatsugiri-stretchy-mega') suffix = '-stretchy-mega';
        if (!ALLOWED_SUFFIXES.includes(suffix)) return;

        results.push({
          ...form,
          displayId, // Inherit base ID for sorting and displaying alongside base form
          isForm: true
        });
        addedForms.add(form.name);
      });
    });
    
    return results;
  } catch (err) {
    const offlineList = await getOfflinePokemonList();
    if (offlineList && offlineList.length > 0) {
      const filtered = offlineList.filter(p => {
        const id = p.displayId || 0;
        return id >= start && id <= end;
      });
      return filtered.length > 0 ? filtered : offlineList;
    }
    throw err;
  }
}

export async function getPokemonByType(type: string, start: number, end: number): Promise<{name: string, url: string, displayId?: number, isForm?: boolean, isOfflineCached?: boolean}[]> {
  try {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new Error("OFFLINE_NETWORK_UNAVAILABLE");
    }

    const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    if (!res.ok) throw new Error("Failed to fetch Pokemon by type");
    const data = await res.json();
    
    const allForms = await getAllFormsList();
    const results: any[] = [];
    
    data.pokemon
      .map((p: any) => p.pokemon)
      .filter((p: any) => {
        const id = parseInt(p.url.split('/').filter(Boolean).pop() || '0', 10);
        return id >= start && id <= end;
      })
      .forEach((p: any) => {
        const displayId = parseInt(p.url.split('/').filter(Boolean).pop() || '0', 10);
        const cleanName = REV_MALE_BASE_FORMS[p.name] || p.name;
        const baseName = p.name;
        
        results.push({
          ...p,
          name: cleanName,
          displayId
        });
        
        let addedForms = new Set<string>();
        let relatedForms = allForms.filter((f: any) => 
        f.name !== baseName && 
        f.name.startsWith(baseName + '-')
      );

      // Special logic for Tatsugiri: replace curly-mega with stretchy-mega
      if (baseName.includes('tatsugiri')) {
        relatedForms = relatedForms.filter((f: any) => f.name !== 'tatsugiri-curly-mega' && f.name !== 'tatsugiri-droopy-mega');
        const stretchyMega = allForms.find((f: any) => f.name === 'tatsugiri-stretchy-mega');
        if (stretchyMega && !relatedForms.some((f: any) => f.name === 'tatsugiri-stretchy-mega')) {
          relatedForms.push(stretchyMega);
        }
      }

      // Inject custom Legends Z-A Megas from LEGENDS_ZA_MEGA_ENTRIES
      Object.keys(LEGENDS_ZA_MEGA_ENTRIES).forEach(zaKey => {
        if (zaKey === 'tatsugiri-curly-mega' || zaKey === 'tatsugiri-droopy-mega' || zaKey === 'meowstic-female-mega' || zaKey === 'meowstic-male-mega' || zaKey === 'pyroar-female-mega' || zaKey === 'pyroar-male-mega' || zaKey === 'zygarde-50-mega' || zaKey === 'floette-eternal-mega') return;
        if (zaKey.startsWith(baseName + '-') || (baseName === 'meowstic' && zaKey.startsWith('meowstic-')) || (baseName === 'pyroar' && zaKey.startsWith('pyroar-')) || (baseName === 'floette' && zaKey.startsWith('floette-')) || (baseName === 'zygarde' && zaKey.startsWith('zygarde-'))) {
          if (!relatedForms.some((f: any) => f.name === zaKey)) {
            relatedForms.push({ name: zaKey, url: `https://pokeapi.co/api/v2/pokemon/${zaKey}` });
          }
        }
      });

        const sortedRelated = relatedForms.sort((a, b) => {
          const aSuff = a.name.replace(baseName, '');
          const bSuff = b.name.replace(baseName, '');
          const aIdx = ALLOWED_SUFFIXES.indexOf(aSuff);
          const bIdx = ALLOWED_SUFFIXES.indexOf(bSuff);
          return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
        });

        sortedRelated.forEach((form: any) => {
          if (form.name.includes('-totem') || form.name.includes('-starter') || form.name.includes('-cosplay') || form.name.includes('-cap')) return;
          if (addedForms.has(form.name)) return;

          let suffix = form.name.replace(baseName, '');
          if (form.name === 'tatsugiri-stretchy-mega') suffix = '-stretchy-mega';
          if (!ALLOWED_SUFFIXES.includes(suffix)) return;

          results.push({
            ...form,
            displayId,
            isForm: true
          });
          addedForms.add(form.name);
        });
      });
      
    return results;
  } catch (err) {
    const offlineList = await getOfflinePokemonList();
    if (offlineList && offlineList.length > 0) {
      const filtered = offlineList.filter(p => p.types?.includes(type));
      return filtered.length > 0 ? filtered : offlineList;
    }
    throw err;
  }
}
