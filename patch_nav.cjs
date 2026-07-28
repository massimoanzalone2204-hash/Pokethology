const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '"w-full border-2 rounded-2xl py-2.5 px-10 sm:px-14 focus:outline-none transition-all font-hud text-[11px] sm:text-sm uppercase tracking-[0.2em]"',
  '"w-full border-2 rounded-none py-2.5 px-10 sm:px-14 focus:outline-none transition-all font-hud text-[11px] sm:text-sm uppercase tracking-[0.2em]"'
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
