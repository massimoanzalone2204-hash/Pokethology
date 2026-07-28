const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove the shadow div lines
code = code.replace(/<div className="absolute -bottom-[0-9]+ left-1\/2 -translate-x-1\/2 w-3\/4 h-[^"]+" style=\{\{ background: 'radial-gradient\(ellipse, rgba\(0,0,0,0\.4\) 0%, transparent 70%\)' \}\}\><\/div>/g, '');

fs.writeFileSync('src/App.tsx', code, 'utf8');
