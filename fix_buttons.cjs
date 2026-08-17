const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<Settings className=\{cn\("hidden sm:block",/g,
  '<Settings className={cn('
);

code = code.replace(
  /<Info className=\{cn\("hidden sm:block",/g,
  '<Info className={cn('
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
