const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

function addHeaders(endpoint, funcName) {
  const findRegex = new RegExp(`const response = await fetch\\("${endpoint}", \\{\\s*method: "POST",\\s*headers: \\{\\s*"Content-Type": "application/json",\\s*"Accept-Language": navigator.language\\s*\\},`, "g");
  
  const replacer = `
      const customApiKey = getCustomApiKey();
      const headers: any = { 
        "Content-Type": "application/json",
        "Accept-Language": navigator.language
      };
      if (customApiKey) {
        headers["X-Custom-Gemini-Key"] = customApiKey;
      }
      
      const response = await fetch("${endpoint}", {
        method: "POST",
        headers,`;
        
  code = code.replace(findRegex, replacer);
}

addHeaders("/api/analyze", "requestAnalysis");
addHeaders("/api/suggest", "requestSuggestion");
addHeaders("/api/strategy", "requestStrategy");

// also fix quota checks
// We need to bypass `checkQuotaAllowed("gemini_ai")` if `customApiKey` is set.
// For these functions, let's find `const { allowed } = checkQuotaAllowed("gemini_ai");`
// And replace with `if (!getCustomApiKey()) { ... }`

code = code.replace(/const \{ allowed \} = checkQuotaAllowed\("gemini_ai"\);\s*if \(\!allowed\) \{\s*throw new Error\("QUOTA_LIMIT"\);\s*\}\s*recordApiUsage\("gemini_ai", 1\);/g, 
  `if (!getCustomApiKey()) {
        const { allowed } = checkQuotaAllowed("gemini_ai");
        if (!allowed) {
          throw new Error("QUOTA_LIMIT");
        }
        recordApiUsage("gemini_ai", 1);
      }`);

fs.writeFileSync(file, code);
