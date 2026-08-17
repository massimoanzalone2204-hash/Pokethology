import re

with open('src/lib/api.ts', 'r') as f:
    content = f.read()

# 1. Remove the abilities fallback
content = re.sub(
    r'\s*// If the pokemon has no abilities.*?abilitiesSource = basePokemonData\.abilities;\s*\}\s*\} catch \(e\) \{\s*console\.error\("Failed to fetch base species abilities for form", e\);\s*\}\s*\}\s*// Fetch abilities\s*const abilities: Ability\[\] = abilitiesSource\.length > 0 \? await Promise\.all\(\s*abilitiesSource\.map\(async \(a: any\) => \{',
    '''
  // Fetch abilities
  const abilities: Ability[] = (data.abilities && data.abilities.length > 0) ? await Promise.all(
    data.abilities.map(async (a: any) => {''',
    content,
    flags=re.DOTALL
)

# 2. Remove the moves fallback
content = re.sub(
    r'\s*let movesSource = data\.moves;\s*// If the pokemon has no moves.*?movesSource = basePokemonData\.moves;\s*\}\s*\} catch \(e\) \{\s*console\.error\("Failed to fetch base species moves for form", e\);\s*\}\s*\}',
    '\n  let movesSource = data.moves || [];',
    content,
    flags=re.DOTALL
)

# 3. Add the master fallback block right after data = await pokeRes.json();
master_fallback = '''
  if (!data) {
    if (!pokeRes.ok) {
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
'''

content = re.sub(
    r'\s*if \(!data\) \{\s*if \(!pokeRes\.ok\) \{\s*throw new Error\(`Pokemon "\$\{query\}" not found!`\);\s*\}\s*data = await pokeRes\.json\(\);\s*\}',
    master_fallback,
    content,
    flags=re.DOTALL
)

with open('src/lib/api.ts', 'w') as f:
    f.write(content)

