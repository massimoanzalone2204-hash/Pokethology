const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `{isBattling && <BattleLog log={battleLog} enableAnimations={enableAnimations} turn={turn || 'player'} isBattling={isBattling} /> }`,
  `<AnimatePresence>
                                          {isBattling && <BattleLog log={battleLog} enableAnimations={enableAnimations} turn={turn || 'player'} isBattling={isBattling} />}
                                        </AnimatePresence>`
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
