const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

code = code.replace(/touch-action: none !important;/g, "touch-action: pan-y !important;");

const target = `html, body {
  overflow-x: hidden !important;
  max-width: 100vw !important;
  overscroll-behavior-x: none;
}`;
const rep = `html, body {
  overflow-x: hidden !important;
  max-width: 100vw !important;
  overscroll-behavior-x: none;
  touch-action: pan-y !important;
}`;
code = code.replace(target, rep);

const targetRoot = `#root {
  overflow-x: hidden !important;
  max-width: 100vw !important;
}`;
const repRoot = `#root {
  overflow-x: hidden !important;
  max-width: 100vw !important;
  touch-action: pan-y !important;
}`;
code = code.replace(targetRoot, repRoot);

fs.writeFileSync('src/index.css', code, 'utf8');
