const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  /\{\!isCardView && <HUDCorners[^\/]+\/\>/,
  '{!isCardView && <HUDCorners />}'
);
fs.writeFileSync('src/App.tsx', code, 'utf8');
