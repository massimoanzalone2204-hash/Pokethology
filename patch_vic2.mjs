import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  `const stats = JSON.parse(localStorage.getItem('Pokethology_MissionStats') || '{"pokemonWins":{}, "typeWins":{}}');`,
  `let stats = JSON.parse(localStorage.getItem('Pokethology_MissionStats') || '{"pokemonWins":{}, "typeWins":{}}');
            const currentMonth = new Date().toISOString().slice(0, 7);
            if (stats.lastResetMonth !== currentMonth) {
              stats = { pokemonWins: {}, typeWins: {}, lastResetMonth: currentMonth };
            }`
);

fs.writeFileSync('src/App.tsx', content);
