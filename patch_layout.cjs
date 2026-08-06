const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Ensure overflow-x-hidden is present in major wrapper
code = code.replace(
  /"w-full h-full overflow-hidden mx-auto flex flex-col relative z-10 transition-all duration-300 xl:shadow-\[0_0_80px_rgba\(0,0,0,0\.85\)\]"/g,
  '"w-full h-full overflow-hidden overflow-x-hidden mx-auto flex flex-col relative z-10 transition-all duration-300 xl:shadow-[0_0_80px_rgba(0,0,0,0.85)]"'
);

// Main outer wrapper
code = code.replace(
  /"w-full h-screen h-\[100dvh\] flex items-stretch justify-center transition-colors duration-300 ease-out bg-slate-950 relative overflow-hidden"/g,
  '"w-full h-screen h-[100dvh] flex items-stretch justify-center transition-colors duration-300 ease-out bg-slate-950 relative overflow-hidden overflow-x-hidden"'
);

// Top bar
code = code.replace(
  /"flex items-center justify-between gap-3 sm:gap-4 bg-slate-900\/60 p-2 sm:p-3 border-b border-slate-800\/60 shadow-\[0_4px_20px_rgba\(0,0,0,0\.4\)\] backdrop-blur-md z-40 relative"/g,
  '"flex items-center justify-between gap-3 sm:gap-4 bg-slate-900/60 p-2 sm:p-3 border-b border-slate-800/60 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md z-40 relative overflow-x-hidden w-full"'
);

// Second wrapper
code = code.replace(
  /<div className="flex-1 flex flex-col relative overflow-hidden bg-transparent">/g,
  '<div className="flex-1 flex flex-col relative overflow-hidden overflow-x-hidden bg-transparent w-full">'
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
