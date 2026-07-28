import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add Home fallback to generateSrc
content = re.sub(
    r"""\} else \{\s*const offArt = pokemon\.sprites\.other\?\.\['official-artwork'\];\s*if \(offArt && \(offArt\.front_default \|\| offArt\.front_shiny\)\) \{\s*return isShiny \? \(offArt\.front_shiny \|\| offArt\.front_default\) : offArt\.front_default;\s*\}\s*\}""",
    """} else {
        const offArt = pokemon.sprites.other?.['official-artwork'];
        const homeArt = pokemon.sprites.other?.home;
        if (offArt && (offArt.front_default || offArt.front_shiny)) {
          return isShiny ? (offArt.front_shiny || offArt.front_default) : offArt.front_default;
        } else if (homeArt && (homeArt.front_default || homeArt.front_shiny)) {
          return isShiny ? (homeArt.front_shiny || homeArt.front_default) : homeArt.front_default;
        }
      }""",
    content
)

# Fix Pokedex Entry title to include ID
content = content.replace(
    """<span className={cn("font-black", isLightMode ? "" : "text-shadow-[0_0_15px_rgba(34,211,238,0.5)]")}>Pokédex Entry</span>""",
    """<span className={cn("font-black", isLightMode ? "" : "text-shadow-[0_0_15px_rgba(34,211,238,0.5)]")}>Pokédex Entry #{(pokemon.baseId || pokemon.id).toString().padStart(4, '0')}</span>"""
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

