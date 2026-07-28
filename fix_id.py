import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "{pokemon.id.toString().padStart(3, '0')}",
    "{(pokemon.baseId || pokemon.id).toString().padStart(4, '0')}"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
