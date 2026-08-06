const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /\? \`\$\{typeColors\[move\.type\]\} border-white\/10 hover:border-white\/30 text-white\`/g,
  "? `bg-slate-950 border ${typeColors[move.type].replace('bg-', 'border-').replace('500', '500/50')} ${typeColors[move.type].replace('bg-', 'text-').replace('500', '400')} hover:bg-slate-900`"
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
