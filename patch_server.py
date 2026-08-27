with open('server.ts', 'r') as f:
    content = f.read()

import re

# We want to replace the exact initialization block of GoogleGenAI
pattern = r"const getApiKey = \(\) => process\.env\.GEMINI_API_KEY \|\| process\.env\.GOOGLE_API_KEY;\s*const ai = new GoogleGenAI\(\{\s*apiKey: getApiKey\(\),\s*httpOptions: \{\s*headers: \{\s*'User-Agent': 'aistudio-build',\s*\}\s*\}\s*\}\);"

replacement = """const getApiKey = () => process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
let aiClient: any = null;
function getAiClient() {
  if (!aiClient) {
    const key = getApiKey();
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    }
  }
  return aiClient;
}"""

new_content, count = re.subn(pattern, replacement, content)
if count > 0:
    with open('server.ts', 'w') as f:
        f.write(new_content)
    print("Patched successfully")
else:
    print("Regex not found")
