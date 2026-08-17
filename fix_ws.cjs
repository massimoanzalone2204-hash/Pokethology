const fs = require('fs');

let code = fs.readFileSync('server/websocket.ts', 'utf8');

code = code.replace(
  "const suggestedPokemon = extractSuggestedPokemon(userText, pokemonNamesList);",
  `const suggestedPokemon = extractSuggestedPokemon(userText, pokemonNamesList);
          const navigateWords = ["show", "search", "open", "find", "view", "display", "stats", "load"];
          const wantsNavigation = navigateWords.some(w => userText.toLowerCase().includes(w)) && suggestedPokemon;
          const navigatePokemon = wantsNavigation ? suggestedPokemon : null;`
);

fs.writeFileSync('server/websocket.ts', code, 'utf8');
