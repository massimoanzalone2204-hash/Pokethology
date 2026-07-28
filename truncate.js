const fs = require('fs');
const lines = fs.readFileSync('src/index.css', 'utf-8').split('\n');
const result = lines.slice(0, 212).join('\n');
fs.writeFileSync('src/index.css', result, 'utf-8');
