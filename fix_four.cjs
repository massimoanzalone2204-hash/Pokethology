const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  /\{isBattling && <BattleLog[^\n]+isBattling={isBattling}\s*\/\>/g,
  '{isBattling && <BattleLog log={battleLog} enableAnimations={enableAnimations} turn={turn || \'player\'} isBattling={isBattling} /> }'
);
fs.writeFileSync('src/App.tsx', code, 'utf8');
