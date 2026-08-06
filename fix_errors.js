const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/) : null}/g, ') : null}');
fs.writeFileSync('src/App.tsx', code);
