const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  /\{isLightMode \? <Sun className="w-2\.5 h-2\.5 text-white" \/\> : <Moon className="w-2\.5 h-2\.5 text-slate-900"\s*\/\>/g,
  '{isLightMode ? <Sun className="w-2.5 h-2.5 text-white" /> : <Moon className="w-2.5 h-2.5 text-slate-900" /> }'
);
fs.writeFileSync('src/App.tsx', code, 'utf8');
