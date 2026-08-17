const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  /: <BrainCircuit className=\{\w*\("w-3.5 h-3.5 sm:w-4 sm:h-4", isLightMode \? "text-cyan-600" : "text-cyan-400"\)\}\s*\/\>/g,
  ': <BrainCircuit className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", isLightMode ? "text-cyan-600" : "text-cyan-400")} /> }'
);
fs.writeFileSync('src/App.tsx', code, 'utf8');
