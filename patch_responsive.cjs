const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Patch 1: Battle Layout Grid
const target1 = `className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start max-w-full pb-2 sm:pb-3"`;
const replacement1 = `className="w-full flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start max-w-full pb-2 sm:pb-3"`;
code = code.replace(target1, replacement1);

// Patch 2: Left Column (Arena, Actions)
const target2 = `<div className="lg:col-span-8 flex flex-col w-full min-w-0">`;
const replacement2 = `<div className="md:col-span-7 lg:col-span-8 flex flex-col w-full min-w-0">`;
code = code.replace(target2, replacement2);

// Patch 3: Right Column (Stats)
const target3 = `<div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6 w-full min-w-0 max-w-full lg:sticky lg:top-4 relative z-10 shrink-0">`;
const replacement3 = `<div className="md:col-span-5 lg:col-span-4 flex flex-col gap-4 sm:gap-6 w-full min-w-0 max-w-full md:sticky md:top-4 relative z-10 shrink-0">`;
code = code.replace(target3, replacement3);

// Patch 4: Daily Scans Grid
const target4 = `className="daily-scans-container flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 flex flex-col lg:grid lg:grid-cols-2 gap-5 min-h-0 overscroll-contain touch-pan-y items-start"`;
const replacement4 = `className="daily-scans-container flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 flex flex-col md:grid md:grid-cols-2 gap-5 min-h-0 overscroll-contain touch-pan-y items-start"`;
code = code.replace(target4, replacement4);

fs.writeFileSync('src/App.tsx', code);
