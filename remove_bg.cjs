const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove battleBackgroundUrl declaration
code = code.replace(/const battleBackgroundUrl = useMemo\(\(\) => getBattleBackground[^\n]+\n/g, '');

// Remove the image element
code = code.replace(/\{\/\* Dynamic 16-bit Pixel-Art Battleground Image[\s\S]+?\}\)/g, '');

fs.writeFileSync('src/App.tsx', code, 'utf8');
