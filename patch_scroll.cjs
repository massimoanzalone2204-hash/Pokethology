const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /chatEndRef\.current\.scrollIntoView\(\{ behavior: 'auto' \}\);/g,
  "if (chatScrollRef.current) { chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight; }"
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
