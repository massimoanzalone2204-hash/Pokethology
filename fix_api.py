import re

with open('src/lib/api.ts', 'r') as f:
    text = f.read()

# export async function searchPokemon(query: string, lang: string = 'en'): Promise<Pokemon> {
text = re.sub(r"export async function searchPokemon\(query: string, lang: string = 'en'\): Promise<Pokemon> \{", "export async function searchPokemon(query: string): Promise<Pokemon> {", text)
text = re.sub(r"export async function searchPokemon\(query: string, lang: string\): Promise<Pokemon> \{", "export async function searchPokemon(query: string): Promise<Pokemon> {", text)

with open('src/lib/api.ts', 'w') as f:
    f.write(text)

with open('src/components/FavoritesVaultModal.tsx', 'r') as f:
    fav_text = f.read()
fav_text = re.sub(r"searchPokemon\(([^,]+),\s*'en'\)", r"searchPokemon(\1)", fav_text)
with open('src/components/FavoritesVaultModal.tsx', 'w') as f:
    f.write(fav_text)

with open('src/lib/cacheManager.ts', 'r') as f:
    cache_text = f.read()
cache_text = re.sub(r"searchPokemon\(([^,]+),\s*'en'\)", r"searchPokemon(\1)", cache_text)
with open('src/lib/cacheManager.ts', 'w') as f:
    f.write(cache_text)

print("api.ts fixed")
