const app = require('fs').readFileSync('src/App.tsx', 'utf8');
try {
  require('@babel/core').transformSync(app, { presets: ['@babel/preset-react', '@babel/preset-typescript'], filename: 'App.tsx' });
  console.log("Syntax OK");
} catch(e) {
  console.log("Syntax Error", e.message);
}
