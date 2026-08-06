import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

replacement = """
            const isAltForm = activePokemonData?.id >= 10000;
            const artworkUrl = (isAltForm ? activePokemonData?.sprites?.other?.home?.front_default : activePokemonData?.sprites?.other?.['official-artwork']?.front_default)
              || activePokemonData?.sprites?.other?.['official-artwork']?.front_default 
              || activePokemonData?.sprites?.other?.home?.front_default 
              || activePokemonData?.sprites?.front_default 
              || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${activePokemonData?.id}.png`;
"""

content = re.sub(
    r"const artworkUrl = activePokemonData\?\.sprites\?\.other\?\.\['official-artwork'\]\?\.front_default \|\| activePokemonData\?\.sprites\?\.other\?\.home\?\.front_default \|\| activePokemonData\?\.sprites\?\.front_default \|\| `https://raw\.githubusercontent\.com/PokeAPI/sprites/master/sprites/pokemon/other/home/\$\{activePokemonData\?\.id\}\.png`;",
    replacement.strip(),
    content
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
