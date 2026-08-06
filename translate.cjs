const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = />([^<>{}\n]+)</g;

let matches = [];
let match;
while ((match = regex.exec(code)) !== null) {
  let text = match[1].trim();
  if (text.length > 0 && /[A-Za-z]/.test(text) && !text.includes('className') && !text.includes('=>')) {
    matches.push(text);
  }
}

matches = [...new Set(matches)];
fs.writeFileSync('strings.json', JSON.stringify(matches, null, 2));
console.log("Extracted " + matches.length + " strings.");
