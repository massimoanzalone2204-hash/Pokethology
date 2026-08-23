import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  '            date: new Date().toISOString(),\n            usedSuperEffective: usedSuperEffectiveCurrentBattle,\n        };\n        idbSet(STORES.BATTLE_HISTORY, newRecord).then(() => {',
  `            date: new Date().toISOString(),\n            usedSuperEffective: usedSuperEffectiveCurrentBattle,\n        };\n        if (battleResult === 'victory') {\n          try {\n            const stats = JSON.parse(localStorage.getItem('Pokethology_MissionStats') || '{"pokemonWins":{}, "typeWins":{}}');\n            stats.pokemonWins[pokemon.name] = (stats.pokemonWins[pokemon.name] || 0) + 1;\n            pokemon.types.forEach((t: any) => {\n              const typeName = t.type.name.toLowerCase();\n              stats.typeWins[typeName] = (stats.typeWins[typeName] || 0) + 1;\n            });\n            localStorage.setItem('Pokethology_MissionStats', JSON.stringify(stats));\n          } catch (e) {\n            console.error("Error updating mission stats", e);\n          }\n        }\n        idbSet(STORES.BATTLE_HISTORY, newRecord).then(() => {`
);

fs.writeFileSync('src/App.tsx', content);
