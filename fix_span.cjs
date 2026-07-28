const fs = require('fs');
let code = fs.readFileSync('src/components/BattleResultScreen.tsx', 'utf8');
code = code.replace('{/* Rewards / Progression */}              <motion.div ', '{/* Rewards / Progression */}              <motion.div className="md:col-span-2" ');
fs.writeFileSync('src/components/BattleResultScreen.tsx', code);
