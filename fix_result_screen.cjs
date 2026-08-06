const fs = require('fs');
let code = fs.readFileSync('src/components/BattleResultScreen.tsx', 'utf8');

// 1. Remove Highlights generation
code = code.replace(/const highlights: string\[\] = \[\];[\s\S]*?\}\n\n  const lastLogs/m, '  const lastLogs');

// 2. Remove Highlights UI
code = code.replace(/<div className="mt-2 pt-3 border-t border-inherit">[\s\S]*?<\/div>\n\s*<\/div>/m, '</div>');

// 3. Make modal smaller:
// max-w-4xl -> max-w-2xl
code = code.replace('max-w-4xl', 'max-w-3xl'); // Not too small

// 4. Change grid:
// grid-cols-1 md:grid-cols-3 -> grid-cols-1 md:grid-cols-2
code = code.replace('grid-cols-1 md:grid-cols-3', 'grid-cols-1 md:grid-cols-2');

// 5. Change padding and text sizing slightly to avoid cutoff
code = code.replace('text-4xl sm:text-5xl', 'text-3xl sm:text-4xl');
code = code.replace('py-8', 'py-6');
code = code.replace('p-6 sm:p-8', 'p-4 sm:p-6');
code = code.replace('p-4 sm:p-8', 'p-3 sm:p-4');
code = code.replace('p-5 rounded-2xl', 'p-4 rounded-xl');

fs.writeFileSync('src/components/BattleResultScreen.tsx', code);
