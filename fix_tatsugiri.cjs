const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `let megas = varietiesList.filter(v => v.pokemon?.name?.includes('-mega'));`;
const replacement = `let megas = varietiesList.filter(v => v.pokemon?.name?.includes('-mega') && !v.pokemon?.name?.includes('tatsugiri'));`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log("Fixed Tatsugiri megas!");
