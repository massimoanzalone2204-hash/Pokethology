const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the homepage styles to be less problematic
code = code.replace(
  /className="flex-1 flex flex-col items-center justify-start gap-7 pt-12 pb-12 mobile-container-safe-padding min-h-\[500px\] text-center relative overflow-y-auto custom-scrollbar select-none w-full h-full"/g,
  'className="flex-1 flex flex-col items-center justify-center gap-7 pt-6 pb-6 p-4 text-center relative overflow-y-auto custom-scrollbar select-none w-full h-full"'
);

// Stop the rotation animation on the logo that might be causing layout issues or motion sickness
code = code.replace(
  /animate=\{\{\s*rotate: \[0, 5, -5, 0\],\s*scale: \[1, 1.02, 0.98, 1\]\s*\}\}\s*transition=\{\{ duration: 10, repeat: Infinity, ease: "easeInOut" \}\}/g,
  'initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}'
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
