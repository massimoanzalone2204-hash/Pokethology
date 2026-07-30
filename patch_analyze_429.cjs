const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /if \(response\.status === 429 \|\| data\.isQuotaExhausted\) \{\s*if \(data\.isQuotaExhausted \|\| data\.percentRemaining === 0\) \{\s*setQuotaLimitReached\(true\);\s*\}/g;
const replacer = `if (response.status === 429 || data.isQuotaExhausted) {
        if (data.isQuotaExhausted || data.percentRemaining === 0) {
          setQuotaLimitReached(true);
          setChatEngine('local');
          setChatEngineState('local');
        }`;

code = code.replace(regex, replacer);

fs.writeFileSync(file, code);
