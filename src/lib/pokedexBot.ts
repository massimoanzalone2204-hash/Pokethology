import { pokeApi, isApiError } from './pokeApiService';

export interface BotResponse {
  text: string;
}

// Normalize string for matching
const normalizeString = (str: string) => str.toLowerCase().replace(/[^a-z0-9-]/g, '');

export const processChatMessage = async (
  message: string, 
  allPokemonNames: string[]
): Promise<BotResponse> => {
  const normalizedMsg = message.toLowerCase();
  
  if (normalizedMsg.includes("hello") || normalizedMsg.includes("hi ") || normalizedMsg === "hi") {
    return {
      text: "Hello there! I am the Offline Pokédex Assistant powered directly by PokéAPI. You can ask me about specific Pokémon, their stats, abilities, or types. For example, 'What are Charizard's stats?'"
    };
  }

  let foundPokemon: string | null = null;
  const sortedNames = [...allPokemonNames].sort((a, b) => b.length - a.length);
  for (const name of sortedNames) {
    if (normalizedMsg.includes(name.replace('-', ' ')) || normalizedMsg.includes(name)) {
      foundPokemon = name;
      break;
    }
  }

  if (foundPokemon) {
    try {
      const details = await pokeApi.getPokemonDetails(foundPokemon);
      const species = await pokeApi.getPokemonSpecies(foundPokemon);

      if (isApiError(details) || isApiError(species)) {
        return { text: `I found **${foundPokemon.toUpperCase()}**, but I couldn't load its data.` };
      }

      const isStatQuery = normalizedMsg.includes("stat") || normalizedMsg.includes("strong");
      const isAbilityQuery = normalizedMsg.includes("abilit") || normalizedMsg.includes("hidden");
      const isTypeQuery = normalizedMsg.includes("type") || normalizedMsg.includes("element");

      if (isStatQuery) {
        const statsStr = details.stats.map(s => `**${s.name.toUpperCase()}**: ${s.value}`).join('\n- ');
        return { text: `Here are the base stats for **${details.name.toUpperCase()}**:\n- ${statsStr}` };
      }

      if (isAbilityQuery) {
        const abilitiesStr = details.abilities.map(a => `**${a.name.replace('-', ' ')}** ${a.isHidden ? '(Hidden)' : ''}`).join('\n- ');
        return { text: `**${details.name.toUpperCase()}** can have the following abilities:\n- ${abilitiesStr}` };
      }

      if (isTypeQuery) {
        const typesStr = details.types.join(' and ').toUpperCase();
        return { text: `**${details.name.toUpperCase()}** is a **${typesStr}** type Pokémon.` };
      }

      const typesStr = details.types.join('/').toUpperCase();
      return {
        text: `**${details.name.toUpperCase()}** is a ${typesStr} type Pokémon.\n\n*${species.description}*\n\nWould you like to know about its stats or abilities?`
      };

    } catch (e) {
      return { text: `Sorry, I encountered an error looking up data for ${foundPokemon}.` };
    }
  }

  if (normalizedMsg.includes("type") && (normalizedMsg.includes("chart") || normalizedMsg.includes("effectiveness"))) {
    return { text: "Pokémon attacks have different effectiveness based on the defending Pokémon's type. For example, Water attacks deal double damage to Fire types, but half damage to Grass types. If you search for a Pokémon, you can view its specific type weaknesses in the Radar tab!" };
  }

  if (normalizedMsg.includes("shiny") || normalizedMsg.includes("shinies")) {
    return { text: "Shiny Pokémon are extremely rare variants with different colorations. In the core games, the standard encounter rate for a Shiny Pokémon is 1 in 4096. You can toggle the 'Shiny' switch on a Pokémon's profile to view its shiny artwork!" };
  }

  return {
    text: "I am the Local Pokédex Assistant powered by PokéAPI. I am currently offline from Gemini AI to save API costs. Try asking me about a specific Pokémon's stats, abilities, or types! (e.g., 'Tell me about Lucario's stats')"
  };
};
