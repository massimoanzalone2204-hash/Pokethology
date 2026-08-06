import re
with open('src/App.tsx', 'r') as f:
    text = f.read()

# Replace any `<PokemonBattleSprite ... >` that are not self closing with `<PokemonBattleSprite ... />`
text = re.sub(r'<PokemonBattleSprite([^>]*?)(?<!/)>', r'<PokemonBattleSprite\1 />', text)

with open('src/App.tsx', 'w') as f:
    f.write(text)
