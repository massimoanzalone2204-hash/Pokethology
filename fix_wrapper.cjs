const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<div className="relative z-10 p-0\.5 sm:p-1 flex-1 flex flex-col overflow-hidden">/,
  '<div className="relative z-10 flex-1 flex flex-col overflow-hidden">'
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
