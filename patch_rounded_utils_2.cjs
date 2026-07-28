const fs = require('fs');
let code = fs.readFileSync('src/lib/utils.ts', 'utf8');
code = code.replace(/rounded-full/g, 'rounded-lg');
fs.writeFileSync('src/lib/utils.ts', code, 'utf8');
