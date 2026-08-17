const fs = require('fs');
let code = fs.readFileSync('src/components/BattleResultScreen.tsx', 'utf8');

code = code.replace(`              {/* Rewards / Progression */}
              <motion.div 
                className="md:col-span-2"

              <motion.div `, `              {/* Rewards / Progression */}
              <motion.div 
                className={cn("md:col-span-2 p-4 rounded-xl border flex flex-col gap-4", panelBg)}
`);

code = code.replace(`                className={cn("p-4 rounded-xl border flex flex-col gap-4", panelBg)}
              >`, `              >`);
              
fs.writeFileSync('src/components/BattleResultScreen.tsx', code);
