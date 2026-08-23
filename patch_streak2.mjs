import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  'className="ml-1 sm:ml-2 px-2.5 py-0.5 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-400 text-[10px] sm:text-xs font-hud font-bold whitespace-nowrap shadow-[0_0_10px_rgba(249,115,22,0.3)] flex items-center gap-1.5"',
  'className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-400 text-[8.5px] sm:text-[9.5px] font-hud font-bold whitespace-nowrap shadow-[0_0_10px_rgba(249,115,22,0.3)] flex items-center gap-1"'
);

content = content.replace(
  '<Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-orange-500 text-orange-400" />',
  '<Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-orange-500 text-orange-400" />'
);

fs.writeFileSync('src/App.tsx', content);
