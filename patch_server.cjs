const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Remove getQuotaStatusPayload and the /api/quota endpoints
code = code.replace(/function getQuotaStatusPayload\(\) \{[\s\S]*?\}\s*app\.get\("\/api\/quota", \(req, res\) => \{[\s\S]*?\}\);\s*app\.post\("\/api\/quota\/test", async \(req, res\) => \{[\s\S]*?\}\);\s*app\.post\("\/api\/quota\/reset-metrics", \(req, res\) => \{[\s\S]*?\}\);/g, '');

// Remove /api/missions endpoint
code = code.replace(/app\.get\("\/api\/missions", async \(req, res\) => \{[\s\S]*?\}\);\s*app\.get\("\/api\/proxy",/g, 'app.get("/api/proxy",');

fs.writeFileSync('server.ts', code);
