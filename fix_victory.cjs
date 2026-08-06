const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /\{victoryConfetti && <VictoryConfetti\s*\/>\s*<motion\.div/g,
  '{victoryConfetti && <VictoryConfetti />}\n                                      <motion.div'
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
