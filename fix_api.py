import re

with open('src/lib/api.ts', 'r') as f:
    content = f.read()

# 1. Remove fakeMegasMap section
fake_megas_regex = r'\s*// Replace unofficial Mega models/art/moves.*?if \(fakeMegasMap\[data\.name\]\) \{.*?catch \(e\) \{\s*console\.error\("Failed to fix fake mega", e\);\s*\}\s*\}'
content = re.sub(fake_megas_regex, '', content, flags=re.DOTALL)

# 2. Add fallback for abilities
abilities_fallback = '''
  // If the pokemon has no abilities (common for some new forms), fetch the base species abilities
  let abilitiesSource = data.abilities || [];
  if (abilitiesSource.length === 0 && data.species && data.species.url) {
    try {
      const speciesRes = await fetch(data.species.url);
      const speciesData = await speciesRes.json();
      const defaultVariety = speciesData.varieties.find((v: any) => v.is_default);
      if (defaultVariety && defaultVariety.pokemon.url) {
        const basePokemonRes = await fetch(defaultVariety.pokemon.url);
        const basePokemonData = await basePokemonRes.json();
        abilitiesSource = basePokemonData.abilities;
      }
    } catch (e) {
      console.error("Failed to fetch base species abilities for form", e);
    }
  }

  // Fetch abilities
  const abilities: Ability[] = abilitiesSource.length > 0 ? await Promise.all(
    abilitiesSource.map(async (a: any) => {
'''

content = re.sub(
    r'\s*// Fetch abilities\s*const abilities: Ability\[\] = data\.abilities \? await Promise\.all\(\s*data\.abilities\.map\(async \(a: any\) => \{',
    abilities_fallback,
    content
)

with open('src/lib/api.ts', 'w') as f:
    f.write(content)
