const fs = require('fs');
let code = fs.readFileSync('server/websocket.ts', 'utf8');

code = code.replace(/const LITE_MODEL = "gemini-3\.1-flash-lite";/g, 'const LITE_MODEL = "gemini-1.5-flash-8b";');
code = code.replace(/const DEFAULT_MODEL = "gemini-3\.1-flash";/g, 'const DEFAULT_MODEL = "gemini-1.5-flash";');
code = code.replace(/const DEFAULT_MODEL = "gemini-2\.5-flash";/g, 'const DEFAULT_MODEL = "gemini-1.5-flash";');
code = code.replace(/const DEFAULT_MODEL = "gemini-3\.0-flash";/g, 'const DEFAULT_MODEL = "gemini-1.5-flash";');

fs.writeFileSync('server/websocket.ts', code);
