const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The main layout wrapper: "w-full h-full overflow-hidden mx-auto ..."
code = code.replace(
  /"w-full h-full overflow-hidden mx-auto flex flex-col relative z-10 transition-all duration-300 xl:shadow-\[0_0_80px_rgba\(0,0,0,0\.85\)\]"/g,
  '"w-full h-full overflow-hidden overflow-x-hidden flex flex-col relative z-10 transition-all duration-300"'
);
code = code.replace(
  /"w-full h-full overflow-hidden overflow-x-hidden mx-auto flex flex-col relative z-10 transition-all duration-300 xl:shadow-\[0_0_80px_rgba\(0,0,0,0\.85\)\]"/g,
  '"w-full h-full overflow-hidden overflow-x-hidden flex flex-col relative z-10 transition-all duration-300"'
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
