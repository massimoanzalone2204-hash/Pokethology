const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import \{ checkQuotaAllowed, recordApiUsage \} from "\.\/lib\/quotaManager";\n?/g, '');

code = code.replace(/const \{ allowed: strategyAllowed \} = checkQuotaAllowed\("gemini_ai"\);\s*if \(!strategyAllowed\) \{\s*throw new Error\("Local AI Quota Exceeded! Please reset quota or wait until tomorrow\."\);\s*\}\s*recordApiUsage\("gemini_ai", 1\);/g, '');

code = code.replace(/const \{ allowed: analyzeAllowed \} = checkQuotaAllowed\("gemini_ai"\);\s*if \(!analyzeAllowed\) \{\s*throw new Error\("Local AI Quota Exceeded! Please reset quota or wait until tomorrow\."\);\s*\}\s*recordApiUsage\("gemini_ai", 1\);/g, '');

const chatQuotaRegex = /if \(!customApiKey\) \{\s*const \{ allowed: chatAllowed \} = checkQuotaAllowed\("gemini_ai"\);\s*if \(!chatAllowed\) \{[\s\S]*?return;\s*\}\s*recordApiUsage\("gemini_ai", 1\);\s*\}/;
code = code.replace(chatQuotaRegex, '');

fs.writeFileSync('src/App.tsx', code);
