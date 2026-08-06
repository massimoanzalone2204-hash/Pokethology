const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "const suggestedPokemon = extractSuggestedPokemonWrapper(userText);",
  `const suggestedPokemon = extractSuggestedPokemonWrapper(userText);
  const navigateWords = ["show", "search", "open", "find", "view", "display", "stats", "load"];
  const wantsNavigation = navigateWords.some(w => userText.toLowerCase().includes(w)) && suggestedPokemon;
  const navigatePokemon = wantsNavigation ? suggestedPokemon : null;`
);

fs.writeFileSync('server.ts', code, 'utf8');
