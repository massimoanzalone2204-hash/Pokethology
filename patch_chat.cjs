const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Remove setting of chat engine in App.tsx
appCode = appCode.replace(/setChatEngine\('local'\);\s*setChatEngineState\('local'\);/g, '');

fs.writeFileSync('src/App.tsx', appCode);

let chatSettingsCode = fs.readFileSync('src/lib/chatSettings.ts', 'utf8');
chatSettingsCode = chatSettingsCode.replace(/return \(localStorage\.getItem\("chat_engine_mode"\) as 'gemini' \| 'local'\) \|\| 'gemini';/g, "return 'gemini';");

fs.writeFileSync('src/lib/chatSettings.ts', chatSettingsCode);
