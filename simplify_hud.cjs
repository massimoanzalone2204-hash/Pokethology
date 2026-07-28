const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /\{turn === 'player' \? 'YOUR TURN' : "ENEMY TURN"\}/,
  "{turn === 'player' ? 'PLAYER' : \"ENEMY\"}"
);

code = code.replace(
  /<span className="sm:hidden">OPT<\/span>\s*<span className="hidden sm:inline">COMBAT OPT<\/span>/,
  ""
);

code = code.replace(
  /<span className="sm:hidden">Type<\/span>\s*<span className="hidden sm:inline">Type Chart<\/span>/,
  ""
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
