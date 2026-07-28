const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/setActiveTab\('battle'\);/g, "handleTabChange('battle');");
fs.writeFileSync('src/App.tsx', code, 'utf8');
