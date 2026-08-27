import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace generateSrc Level 4 to fall back to home instead of official-artwork
# Or better, let's fix the hardcoded URLs in App.tsx

content = content.replace(
    "`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shinyPath}${idNum}.png`",
    "`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${shinyPath}${idNum}.png`"
)

content = content.replace(
    "`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`",
    "`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`"
)

content = content.replace(
    "`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`",
    "`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon?.id}.png`"
)

content = content.replace(
    "`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${battleOpponent?.id}.png`",
    "`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${battleOpponent?.id}.png`"
)

content = content.replace(
    "`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${activePokemonData?.id}.png`",
    "`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${activePokemonData?.id}.png`"
)

# And in generateSrc:
content = re.sub(
    r"const offArt = pokemon\.sprites\.other\?\.\['official-artwork'\];\s*if \(offArt && \(offArt\.front_default \|\| offArt\.front_shiny\)\) \{\s*return isShiny \? \(offArt\.front_shiny \|\| offArt\.front_default\) : offArt\.front_default;\s*\}",
    """const offArt = pokemon.sprites.other?.['official-artwork'];
        const homeArt = pokemon.sprites.other?.home;
        if (offArt && (offArt.front_default || offArt.front_shiny)) {
          return isShiny ? (offArt.front_shiny || offArt.front_default) : offArt.front_default;
        } else if (homeArt && (homeArt.front_default || homeArt.front_shiny)) {
          return isShiny ? (homeArt.front_shiny || homeArt.front_default) : homeArt.front_default;
        }""",
    content
)


with open('src/App.tsx', 'w') as f:
    f.write(content)

