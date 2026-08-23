const fs = require('fs');
const content = fs.readFileSync('src/components/BattleStatusBars.tsx', 'utf-8');
console.log(content.split('\n')[3]);
