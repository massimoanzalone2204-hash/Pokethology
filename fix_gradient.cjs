const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /return \`linear-gradient\(to right, \$\{color1\}aa 0%, #020617f2 35%, #020617f2 65%, \$\{color2\}aa 100%\)\`;/,
  'return `linear-gradient(135deg, ${color1}cc 0%, ${color1}cc 40%, #020617 40%, #020617 60%, ${color2}cc 60%, ${color2}cc 100%)`;'
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
