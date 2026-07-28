const fs = require('fs');
let code = fs.readFileSync('src/components/BattleResultScreen.tsx', 'utf8');

code = code.replace(`                </div>
                
                </div>
              </motion.div>`, `                </div>
              </motion.div>`);

fs.writeFileSync('src/components/BattleResultScreen.tsx', code);
