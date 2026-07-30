const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/value=\{getChatEngine\(\)\}/g, "value={chatEngineState}");
code = code.replace(/setChatEngine\(e\.target\.value as 'gemini' \| 'local'\);/g, "setChatEngine(e.target.value as 'gemini' | 'local'); setChatEngineState(e.target.value as 'gemini' | 'local');");

code = code.replace(/defaultValue=\{getCustomApiKey\(\)\}/g, "value={customApiKeyState}");
code = code.replace(/onChange=\{\(e\) => setCustomApiKey\(e\.target\.value\)\}/g, "onChange={(e) => { setCustomApiKey(e.target.value); setCustomApiKeyState(e.target.value); }}");

fs.writeFileSync(file, code);
