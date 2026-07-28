const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
let stack = [];
let re = /<\/?([a-zA-Z0-9\.]+)[^>]*>/g;
let match;
let count = 0;
while ((match = re.exec(code)) !== null) {
  let tag = match[1];
  if (match[0].endsWith('/>')) continue; // self closing
  if (match[0].startsWith('</')) {
    if (stack.length === 0) { console.log('Extra closing tag: ' + tag + ' around ' + match.index); continue; }
    let last = stack.pop();
    if (last !== tag) {
      console.log('Mismatched tag: expected </' + last + '> but got </' + tag + '> around index ' + match.index);
    }
  } else {
    stack.push(tag);
  }
}
console.log('Remaining on stack: ', stack);
