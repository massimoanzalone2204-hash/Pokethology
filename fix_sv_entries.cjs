const fs = require('fs');
let code = fs.readFileSync('src/lib/api.ts', 'utf8');

const target = `      ALL_GAME_VERSIONS.forEach(version => {
        if (versionMap.has(version) && (!validVersions || validVersions.includes(version))) {
          const text = versionMap.get(version) || "";
          const cleanText = text
            .replace(/\\f/g, ' ')
            .replace(/\\u00ad\\n/g, '')
            .replace(/\\u00ad/g, '')
            .replace(/ \\n/g, ' ')
            .replace(/\\n/g, ' ')
            .trim();
          parsedDescriptions.push({ version, flavor_text: cleanText });
        }
      });`;

const replacement = `      ALL_GAME_VERSIONS.forEach(version => {
        if (versionMap.has(version) && (!validVersions || validVersions.includes(version))) {
          const text = versionMap.get(version) || "";
          const cleanText = text
            .replace(/\\f/g, ' ')
            .replace(/\\u00ad\\n/g, '')
            .replace(/\\u00ad/g, '')
            .replace(/ \\n/g, ' ')
            .replace(/\\n/g, ' ')
            .trim();
          parsedDescriptions.push({ version, flavor_text: cleanText });
        }
      });
      
      // Fallback for Scarlet and Violet if missing
      if (!validVersions) {
        const fallbackText = parsedDescriptions.length > 0 
          ? parsedDescriptions[parsedDescriptions.length - 1].flavor_text 
          : description;
        if (!parsedDescriptions.some(d => d.version === 'scarlet')) {
          parsedDescriptions.push({ version: 'scarlet', flavor_text: fallbackText });
        }
        if (!parsedDescriptions.some(d => d.version === 'violet')) {
          parsedDescriptions.push({ version: 'violet', flavor_text: fallbackText });
        }
      }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/lib/api.ts', code);
console.log("Added SV fallbacks");
