const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  /\{isChatLoading && <Loader2 className="w-4 h-4 animate-spin text-cyan-500 mx-auto"\s*\/\>/g,
  '{isChatLoading && <Loader2 className="w-4 h-4 animate-spin text-cyan-500 mx-auto" /> }'
);
fs.writeFileSync('src/App.tsx', code, 'utf8');
