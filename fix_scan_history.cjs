const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startIdx = code.indexOf('{scanHistory.length > 0 && (');
const endIdx = code.indexOf(')}', code.indexOf('Clear All', startIdx)) + 2; // finding end of AnimatePresence for scan history?

console.log(startIdx, endIdx);
