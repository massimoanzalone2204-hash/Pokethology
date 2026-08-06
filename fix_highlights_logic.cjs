const fs = require('fs');
let code = fs.readFileSync('src/components/BattleResultScreen.tsx', 'utf8');

code = code.replace(/\/\/ Generate highlights[\s\S]*?const lastLogs/m, 'const lastLogs');

fs.writeFileSync('src/components/BattleResultScreen.tsx', code);
