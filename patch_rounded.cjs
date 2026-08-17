const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/rounded-none/g, "rounded-2xl");
code = code.replace(/rounded-sm/g, "rounded-md");
fs.writeFileSync('src/App.tsx', code, 'utf8');
