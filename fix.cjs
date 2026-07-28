const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

// We want to replace lines 7729 to 7844 (0-indexed 7728 to 7843)
// 7728 is ) : battleState === "finished" ? (
// Let's find it.
let startIdx = lines.findIndex(l => l.includes(') : battleState === "finished" ? ('));
let endIdx = lines.findIndex(l => l.includes(') : null}'));

if (startIdx !== -1 && endIdx !== -1) {
  lines.splice(startIdx, endIdx - startIdx + 1, 
    '                                      ) : battleState === "finished" && (',
    '                                        null',
    '                                      )}'
  );
  fs.writeFileSync('src/App.tsx', lines.join('\n'));
  console.log("Fixed lines");
} else {
  console.log("Not found");
}
