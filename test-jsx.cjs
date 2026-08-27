const fs = require('fs');
const parser = require('@babel/parser');
try {
  const code = fs.readFileSync('src/App.tsx', 'utf8');
  parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
  console.log('Valid!');
} catch (e) {
  console.log('Error at line ' + e.loc.line + ', column ' + e.loc.column + ': ' + e.message);
}
