const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `            if (payload.suggestedPokemon) {
              setChatMessages(prev => [...prev, finalMsg]);
              performSearch(payload.suggestedPokemon, true);
            } else {`,
  `            if (payload.navigatePokemon) {
              setChatMessages([{ role: 'model', text: finalMsg.text }]);
              performSearch(payload.navigatePokemon, false);
            } else {`
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
