const fs = require('fs');
let code = fs.readFileSync('server/services/geminiService.ts', 'utf8');

const regex1 = /let apiCallRecorder: \(\(isQuotaError\?: boolean\) => void\) \| null = null;\s*export function registerApiCallRecorder\(recorder: \(isQuotaError\?: boolean\) => void\) \{\s*apiCallRecorder = recorder;\s*\}/;
code = code.replace(regex1, '');

code = code.replace(/if \(apiCallRecorder\) \{\s*apiCallRecorder\(false\);\s*\}/g, '');
code = code.replace(/if \(isQuota && apiCallRecorder\) \{\s*apiCallRecorder\(true\);\s*\}/g, '');
code = code.replace(/if \(apiCallRecorder\) apiCallRecorder\(false\);/g, '');

fs.writeFileSync('server/services/geminiService.ts', code);
