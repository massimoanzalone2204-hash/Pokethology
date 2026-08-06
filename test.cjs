const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

// simple brace counting for JSX
let lines = code.split('\n');
let braceCount = 0;
for (let i = 7370; i <= 7843; i++) {
  let line = lines[i];
  for(let char of line) {
     if(char === '{') braceCount++;
     if(char === '}') braceCount--;
  }
}
console.log("Brace count delta: ", braceCount);
