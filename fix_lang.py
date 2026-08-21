import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Replace `searchPokemon(..., 'en')` with `searchPokemon(...)`
text = re.sub(r"searchPokemon\(([^,]+),\s*'en'\)", r"searchPokemon(\1)", text)

# Replace `getOpponentMoveQuote(..., 'en')` with `getOpponentMoveQuote(...)`
text = re.sub(r"getOpponentMoveQuote\(([^,]+),\s*([^,]+),\s*'en'\)", r"getOpponentMoveQuote(\1, \2)", text)

with open('src/App.tsx', 'w') as f:
    f.write(text)

print("App.tsx lang params removed")
