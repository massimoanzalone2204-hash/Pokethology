const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

// 7733 is 0-indexed 7732
// Wait, 7732 in file is line 7733.
console.log("Line 7731:", lines[7730]); // ) : battleState === 'finished' ? (
console.log("Line 7732:", lines[7731]); // null
console.log("Line 7733:", lines[7732]); // ) : false ? (
console.log("Line 7843:", lines[7842]); // </motion.div>
console.log("Line 7844:", lines[7843]); // ) : null}
console.log("Line 7845:", lines[7844]); // </AnimatePresence>
