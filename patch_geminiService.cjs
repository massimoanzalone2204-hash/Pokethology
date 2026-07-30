const fs = require('fs');
const file = 'server/services/geminiService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/function getAiClient\(\) \{/g, 'function getAiClient(customApiKey?: string) {');
code = code.replace(/const key = getApiKey\(\);/g, 'const key = customApiKey || getApiKey();');
code = code.replace(/export async function generateWithRetry\(params: any, retries = 2, delay = 2000\): Promise<any> \{/g, 'export async function generateWithRetry(params: any, retries = 2, delay = 2000, customApiKey?: string): Promise<any> {');
code = code.replace(/getAiClient\(\)/g, 'getAiClient(customApiKey)');

fs.writeFileSync(file, code);
