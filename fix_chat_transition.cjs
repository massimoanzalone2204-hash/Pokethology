const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// In submitChatMessage (WebSocket payload)
code = code.replace(
  /setChatMessages\(\[finalMsg\]\);\s*performSearch\(payload\.suggestedPokemon, true\);\s*setActiveTab\('data'\);/g,
  "setChatMessages(prev => [...prev, finalMsg]);\n              performSearch(payload.suggestedPokemon, true);"
);

// In submitChatMessage (HTTP payload)
code = code.replace(
  /setChatMessages\(\[finalMsg\]\);\s*performSearch\(data\.suggestedPokemon, true\);\s*setActiveTab\('data'\);/g,
  "setChatMessages(prev => [...prev, finalMsg]);\n            performSearch(data.suggestedPokemon, true);"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Chat transition fixed!");
