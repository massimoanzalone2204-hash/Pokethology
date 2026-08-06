const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');
code = code.replace(/touch-action: pan-y !important;/g, "");
code = code.replace(/touch-action: none !important;/g, "");
code += "\nhtml, body, #root { touch-action: pan-y !important; }";
fs.writeFileSync('src/index.css', code, 'utf8');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(/touchAction: 'none'/g, "touchAction: 'pan-y'");
fs.writeFileSync('src/App.tsx', appCode, 'utf8');
