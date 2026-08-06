const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx.bak', 'utf8').split('\n');

// 9162-9165 removal
lines.splice(9162, 4);

// 9645 was the SECOND SpotifyPlayer. But since we deleted 4 lines, it's now at 9641.
let sIdx = -1;
let count = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<SpotifyPlayer />')) {
    count++;
    if (count === 2) {
       sIdx = i;
       break;
    }
  }
}

if (sIdx !== -1) {
  lines.splice(sIdx + 1, 14);
}

// And delete the extra </div> at 7717 (which is now 7716 because we haven't done anything before it... wait! We didn't change lines before 7717.
lines.splice(7716, 1);

fs.writeFileSync('src/App.tsx', lines.join('\n'));
