const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

text = text.replace(
  "addFloatingText(damage.toString(), 'damage', isPlayer);",
  "let dmgType: any = 'damage'; if (critMultiplier > 1) dmgType = 'crit-damage'; else if (effectiveness > 1) dmgType = 'super-damage'; else if (effectiveness < 1) dmgType = 'weak-damage'; addFloatingText(damage.toString(), dmgType, isPlayer);"
);

fs.writeFileSync('src/App.tsx', text);
