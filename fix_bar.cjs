const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

// Replace ternary sizes with the larger size
text = text.replace('isBattling ? "p-1.5 sm:p-2.5 mb-2.5" : "p-1.5 sm:p-2 mb-2"', '"p-1.5 sm:p-2.5 mb-2.5"');
text = text.replace('isBattling ? "w-6 h-6 sm:w-9 sm:h-9" : "w-5 h-5 sm:w-7 sm:h-7"', '"w-6 h-6 sm:w-9 sm:h-9"');
text = text.replace('isBattling ? "text-[10px] sm:text-[14px] uppercase tracking-[0.1em] sm:tracking-[0.3em]" : "text-[9px] sm:text-[12px] uppercase tracking-[0.1em]"', '"text-[10px] sm:text-[14px] uppercase tracking-[0.1em] sm:tracking-[0.3em]"');
text = text.replace('isBattling ? "text-[6px] sm:text-[9px] tracking-widest mt-0.5 sm:mt-1" : "text-[5px] sm:text-[7px] tracking-wider mt-0.5"', '"text-[6px] sm:text-[9px] tracking-widest mt-0.5 sm:mt-1"');
text = text.replace('isBattling ? "gap-1 sm:gap-3 justify-end" : "gap-1 sm:gap-2 justify-end"', '"gap-1 sm:gap-3 justify-end"');

// For the buttons (there are two of these)
text = text.replaceAll('isBattling ? "!py-1 !px-1.5 sm:!py-2 sm:!px-4 !text-[7px] sm:!text-[11px]" : "!py-1 !px-1.5 sm:!py-1.5 sm:!px-3 !text-[7px] sm:!text-[9px]"', '"!py-1 !px-1.5 sm:!py-2 sm:!px-4 !text-[7px] sm:!text-[11px]"');
text = text.replaceAll('isBattling ? "w-4 h-4" : "w-3 h-3 sm:w-3.5 sm:h-3.5"', '"w-4 h-4"');

// Fix text colors for light mode visibility on the arena bar
text = text.replace('"text-cyan-400 font-hud font-black truncate transition-all duration-300 leading-none",', 'isLightMode ? "text-cyan-700 font-hud font-black truncate transition-all duration-300 leading-none drop-shadow-sm" : "text-cyan-400 font-hud font-black truncate transition-all duration-300 leading-none",');
text = text.replace('"font-hud uppercase text-cyan-700 truncate transition-all duration-300 font-bold",', 'isLightMode ? "font-hud uppercase text-cyan-800 truncate transition-all duration-300 font-bold" : "font-hud uppercase text-cyan-700 truncate transition-all duration-300 font-bold",');

fs.writeFileSync('src/App.tsx', text);
console.log("Updated bar sizes and colors");
