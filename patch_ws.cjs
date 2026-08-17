const fs = require('fs');
let code = fs.readFileSync('server/websocket.ts', 'utf8');

const regex = /const suggestedPokemon = extractSuggestedPokemon\\(userText, pokemonNamesList\\);/;
const replaceStr = `const suggestedPokemon = extractSuggestedPokemon(userText, pokemonNamesList);
          const navigateWords = ["show", "search", "open", "find", "view", "display", "stats", "load"];
          const wantsNavigation = navigateWords.some(w => userText.toLowerCase().includes(w)) && suggestedPokemon;
          const navigatePokemon = wantsNavigation ? suggestedPokemon : null;`;

code = code.replace(regex, replaceStr);

code = code.replace(
  `                      suggestedPokemon,
                      isFallback: true,`,
  `                      suggestedPokemon,
                      navigatePokemon,
                      isFallback: true,`
);

code = code.replace(
  `                    suggestedPokemon,
                    groundingChunks: chunks,`,
  `                    suggestedPokemon,
                    navigatePokemon,
                    groundingChunks: chunks,`
);

code = code.replace(
  `                suggestedPokemon,
                isFallback: true,`,
  `                suggestedPokemon,
                navigatePokemon,
                isFallback: true,`
);

fs.writeFileSync('server/websocket.ts', code, 'utf8');
