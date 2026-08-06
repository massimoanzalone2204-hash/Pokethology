const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  /\{isAiSuggesting \? <Loader2 className="w-3 h-3 animate-spin" \/\> : <BrainCircuit className="w-3 h-3"\s*\/\>/g,
  '{isAiSuggesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <BrainCircuit className="w-3 h-3" /> }'
);
fs.writeFileSync('src/App.tsx', code, 'utf8');
