const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// I will just use a regex to find all unclosed tags!
let lines = code.split('\n');

// Since this is JSX, I can use a simple script to find the first place where tags are mismatched.
let tagStack = [];
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  let tagRegex = /<\/?([a-zA-Z0-9\.]+)([^>]*?)>/g;
  let match;
  while ((match = tagRegex.exec(line)) !== null) {
    let tagString = match[0];
    let tagName = match[1];
    
    // Ignore self-closing
    if (tagString.endsWith('/>')) continue;
    // Ignore br, img, input
    if (['br', 'img', 'input', 'hr', 'source'].includes(tagName)) continue;
    
    if (tagString.startsWith('</')) {
       if (tagStack.length > 0) {
         let last = tagStack[tagStack.length - 1];
         if (last.name === tagName) {
           tagStack.pop();
         } else {
           console.log(`Mismatch at line ${i+1}: expected </${last.name}> but found </${tagName}>`);
           return;
         }
       }
    } else {
       tagStack.push({name: tagName, line: i+1});
    }
  }
}
