const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const { parse } = require('@babel/parser');
try {
  parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
} catch(e) {
  console.log(e.message);
}
