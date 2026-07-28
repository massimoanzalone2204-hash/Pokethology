const fs = require('fs');
let code = fs.readFileSync('src/components/BattleResultScreen.tsx', 'utf8');

// replace the entire Rewards/Progression opening tag chunk
const target = `              {/* Rewards / Progression */}
              <motion.div 
                className={cn("md:col-span-2 p-4 rounded-xl border flex flex-col gap-4", panelBg)}

                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className={cn("p-4 rounded-xl border flex flex-col gap-4", panelBg)}
              >`;

const rep = `              {/* Rewards / Progression */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className={cn("md:col-span-2 p-4 rounded-xl border flex flex-col gap-4", panelBg)}
              >`;

code = code.replace(target, rep);
fs.writeFileSync('src/components/BattleResultScreen.tsx', code);
