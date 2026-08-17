const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /className="flex-1 bg-slate-900\/40 rounded-2xl p-2 sm:p-4 border border-white\/5 shadow-\[0_8px_32px_rgba\(0,0,0,0\.4\)\] relative overflow-hidden flex flex-col backdrop-blur-xl"/g,
  'className="flex-1 bg-transparent relative overflow-hidden flex flex-col p-1 sm:p-2"'
);

code = code.replace(
  /className="flex-1 bg-slate-900\/80 backdrop-blur-md rounded-2xl p-4 sm:p-8 border border-white\/5 relative shadow-\[0_8px_32px_rgba\(0,0,0,0\.6\)\] flex flex-col mb-2 overflow-visible w-full h-auto min-h-\[350px\] z-10"/g,
  'className="flex-1 bg-slate-900/80 backdrop-blur-md border-b border-white/5 relative shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col mb-2 overflow-visible w-full h-auto min-h-[350px] z-10"'
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
