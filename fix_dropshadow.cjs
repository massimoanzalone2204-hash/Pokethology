const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /className="w-full h-full object-contain scale-\[1\.3\] sm:scale-160 scale-x-\[-1\] filter drop-shadow-\[0_15px_30px_rgba\(6,182,212,0\.45\)\]"/,
  'className="w-full h-full object-contain scale-[1.3] sm:scale-160 scale-x-[-1]"'
);

code = code.replace(
  /className="w-full h-full object-contain scale-\[1\.3\] sm:scale-160 filter drop-shadow-\[0_15px_30px_rgba\(239,68,68,0\.45\)\]"/,
  'className="w-full h-full object-contain scale-[1.3] sm:scale-160"'
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
