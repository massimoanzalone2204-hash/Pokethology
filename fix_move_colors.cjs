const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `typeColors[move.type]
                                                             ? \`bg-slate-950 border \${typeColors[move.type].replace('bg-', 'border-').replace('500', '500/50')} \${typeColors[move.type].replace('bg-', 'text-').replace('500', '400')} hover:bg-slate-900\`
                                                             : "bg-slate-900 border-cyan-900/40 hover:border-cyan-500/60 text-cyan-300 hover:text-white"`;

code = code.replace(target, 'getMoveButtonClasses(move.type)');

fs.writeFileSync('src/App.tsx', code, 'utf8');
