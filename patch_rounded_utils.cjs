const fs = require('fs');
let code = fs.readFileSync('src/lib/utils.ts', 'utf8');
code = code.replace(/rounded-xl/g, 'rounded-full');
fs.writeFileSync('src/lib/utils.ts', code, 'utf8');
