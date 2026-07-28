const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                  {/* Scrollable Content Body Grid */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 sm:pr-2 pb-1 flex flex-col gap-4 sm:gap-6 items-center max-w-full">`;
const replacement = `                  {/* Scrollable Content Body Grid */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 sm:pr-2 pb-1 flex flex-col md:grid md:grid-cols-2 gap-4 sm:gap-6 items-start max-w-full">`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Fixed Daily Scan layout!");
} else {
    console.log("Could not find Daily Scan layout target.");
}
