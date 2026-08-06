const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The file has mismatched divs. Let's find them using a stack-based approach
let lines = code.split('\n');
let stack = [];
for (let i = 0; i < lines.length; i++) {
   // simple heuristic
   let opens = (lines[i].match(/<div[^>]*>/g) || []).length;
   let closes = (lines[i].match(/<\/div>/g) || []).length;
   let selfCloses = (lines[i].match(/<div[^>]*\/>/g) || []).length;
   opens -= selfCloses;
}
