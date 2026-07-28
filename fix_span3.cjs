const fs = require('fs');
let code = fs.readFileSync('src/components/BattleResultScreen.tsx', 'utf8');

code = code.replace(`                className={cn("p-4 rounded-xl border flex flex-col gap-4", panelBg)}
              >`, `              >`);
              
fs.writeFileSync('src/components/BattleResultScreen.tsx', code);
