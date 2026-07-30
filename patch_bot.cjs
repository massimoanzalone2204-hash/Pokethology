const fs = require('fs');
const file = 'src/lib/pokedexBot.ts';
let code = fs.readFileSync(file, 'utf8');

const evoRegex = /if \\(isEvoQuery\\) \\{[^}]*\\}/g;
const moveRegex = /if \\(isMoveQuery\\) \\{[^}]*\\}/g;
const locationRegex = /if \\(isLocationQuery\\) \\{[^}]*\\}/g;

code = code.replace(evoRegex, '');
code = code.replace(moveRegex, '');
code = code.replace(locationRegex, '');

code = code.replace(/const isMoveQuery = [^;]*;/g, '');
code = code.replace(/const isEvoQuery = [^;]*;/g, '');
code = code.replace(/const isLocationQuery = [^;]*;/g, '');

code = code.replace(/, or moves/g, '');

fs.writeFileSync(file, code);
