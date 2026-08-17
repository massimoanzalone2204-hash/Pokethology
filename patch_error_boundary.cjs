const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Insert import
if (!code.includes("import { ErrorBoundary }")) {
  code = code.replace(
    'import React,',
    'import { ErrorBoundary } from "./components/ErrorBoundary";\nimport React,'
  );
}

// Replace the main return
const mainReturnRegex = /  return \([\s\S]*?<div className=\{cn\([\s\S]*?"w-full h-screen h-\[100dvh\] flex items-stretch justify-center/;

code = code.replace(mainReturnRegex, (match) => {
  return match.replace('<div className={cn(', '<ErrorBoundary>\n    <div className={cn(');
});

// We need to add </ErrorBoundary> at the end of the App component.
// It ends with:
//     </div>
//   );
// }

const endRegex = /    <\/div>\n  \);\n\}\n?$/;
code = code.replace(endRegex, '    </div>\n    </ErrorBoundary>\n  );\n}');

fs.writeFileSync('src/App.tsx', code, 'utf8');
