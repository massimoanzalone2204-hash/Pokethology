const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/\n\n\n\}\);\n\napp\.get\("\/api\/proxy"/, '\n\napp.get("/api/proxy"');
fs.writeFileSync('server.ts', code);
