const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `          if (data.navigatePokemon) {
            setChatMessages(prev => [...prev, finalMsg]);
            performSearch(data.suggestedPokemon, true);
          } else {`,
  `          if (data.navigatePokemon) {
            setChatMessages([{ role: 'model', text: finalMsg.text }]);
            performSearch(data.navigatePokemon, false);
          } else {`
);

code = code.replace(
  `      if (data.navigatePokemon) {
        setChatMessages(prev => [...prev, finalMsg]);
            performSearch(data.suggestedPokemon, true);
      } else {`,
  `      if (data.navigatePokemon) {
        setChatMessages([{ role: 'model', text: finalMsg.text }]);
        performSearch(data.navigatePokemon, false);
      } else {`
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
