const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const startStr = "{/* Scan History Section */}";
const startIdx = code.indexOf(startStr);
let searchStr = ")}";
let endIdx = code.indexOf(searchStr, startIdx);
// The block closes with `)}`, we need the matching one for `scanHistory.length > 0 && (`
// Let's just find the exact string that follows the block
const followingStr = "                        <div className=\"absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-40 pointer-events-none\">";
const exactEndIdx = code.indexOf(followingStr, startIdx);

if (startIdx !== -1 && exactEndIdx !== -1) {
  code = code.slice(0, startIdx) + code.slice(exactEndIdx);
  fs.writeFileSync('src/App.tsx', code, 'utf8');
  console.log("Success");
} else {
  console.log("Not found");
}
