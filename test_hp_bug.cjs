const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

console.log(code.includes("setPokemonHP(prev => Math.max(0, prev - confusionDamage));"));
