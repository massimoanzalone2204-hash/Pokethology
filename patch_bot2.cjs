const fs = require('fs');
const file = 'src/lib/pokedexBot.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/const isMoveQuery[\s\S]*?if \(isLocationQuery\) \{[\s\S]*?\}/, '');

fs.writeFileSync(file, code);
