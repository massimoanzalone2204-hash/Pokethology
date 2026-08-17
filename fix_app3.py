import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shinyPath}${id}.png`",
    "`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${shinyPath}${id}.png`"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
