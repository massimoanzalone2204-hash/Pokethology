import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Revert generateSrc fallback
content = re.sub(
    r"""const offArt = pokemon\.sprites\.other\?\.\['official-artwork'\];\s*const homeArt = pokemon\.sprites\.other\?\.home;\s*if \(offArt && \(offArt\.front_default \|\| offArt\.front_shiny\)\) \{\s*return isShiny \? \(offArt\.front_shiny \|\| offArt\.front_default\) : offArt\.front_default;\s*\} else if \(homeArt && \(homeArt\.front_default \|\| homeArt\.front_shiny\)\) \{\s*return isShiny \? \(homeArt\.front_shiny \|\| homeArt\.front_default\) : homeArt\.front_default;\s*\}""",
    """const offArt = pokemon.sprites.other?.['official-artwork'];
        if (offArt && (offArt.front_default || offArt.front_shiny)) {
          return isShiny ? (offArt.front_shiny || offArt.front_default) : offArt.front_default;
        }""",
    content
)

# Revert level 4 to official-artwork
content = content.replace(
    "`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${shinyPath}${idNum}.png`",
    "`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shinyPath}${idNum}.png`"
)

content = content.replace(
    "`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${shinyPath}${id}.png`",
    "`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shinyPath}${id}.png`"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
