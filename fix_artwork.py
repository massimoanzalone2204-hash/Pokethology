import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix for pokemon sprite (line 6698 approx)
content = content.replace(
    "src={pokemon?.sprites?.other?.['official-artwork']?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`}",
    "src={pokemon?.sprites?.other?.['official-artwork']?.front_default || pokemon?.sprites?.other?.home?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`}"
)

# Fix for battleOpponent sprite (line 6711 approx)
content = content.replace(
    "src={battleOpponent?.sprites?.other?.['official-artwork']?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${battleOpponent?.id}.png`}",
    "src={battleOpponent?.sprites?.other?.['official-artwork']?.front_default || battleOpponent?.sprites?.other?.home?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${battleOpponent?.id}.png`}"
)

# Fix for activePokemonData artworkUrl (line 8666 approx)
content = content.replace(
    "const artworkUrl = activePokemonData?.sprites?.other?.['official-artwork']?.front_default || activePokemonData?.sprites?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${activePokemonData?.id}.png`;",
    "const artworkUrl = activePokemonData?.sprites?.other?.['official-artwork']?.front_default || activePokemonData?.sprites?.other?.home?.front_default || activePokemonData?.sprites?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${activePokemonData?.id}.png`;"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
