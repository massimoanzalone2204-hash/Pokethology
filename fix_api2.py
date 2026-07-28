import re

with open('src/lib/api.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "if (!data.sprites?.other?.['official-artwork']?.front_default) needsFallback = true;",
    "if (!data.sprites?.other?.['official-artwork']?.front_default && !data.sprites?.other?.home?.front_default) needsFallback = true;"
)

content = content.replace(
    """else if (!data.sprites.other?.['official-artwork']?.front_default) {
                  if (!data.sprites.other) data.sprites.other = {};
                  data.sprites.other['official-artwork'] = baseData.sprites.other?.['official-artwork'];
              }""",
    """else {
                  if (!data.sprites.other) data.sprites.other = {};
                  if (!data.sprites.other['official-artwork']?.front_default) {
                      data.sprites.other['official-artwork'] = baseData.sprites.other?.['official-artwork'];
                  }
                  if (!data.sprites.other.home?.front_default) {
                      data.sprites.other.home = baseData.sprites.other?.home;
                  }
              }"""
)

with open('src/lib/api.ts', 'w') as f:
    f.write(content)
