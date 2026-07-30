const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes("import { getCustomApiKey, getChatEngine }")) {
  code = code.replace("import { OfflineManagerModal }", "import { getCustomApiKey, getChatEngine, setCustomApiKey, setChatEngine } from './lib/chatSettings';\nimport { processChatMessage } from './lib/pokedexBot';\nimport { OfflineManagerModal }");
}

const oldChatLogic = `    // Fallback REST endpoint execution
    try {
      const { allowed: chatAllowed } = checkQuotaAllowed("gemini_ai");
      if (!chatAllowed) {
        throw new Error("Local AI Quota Exceeded! Please reset quota or wait until tomorrow.");
      }
      recordApiUsage("gemini_ai", 1);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept-Language": navigator.language
        },
        body: JSON.stringify({ 
          messages: [...chatMessages, { role: 'user', text: userMessage }],
          context,
          lang: selectedLang === 'auto' ? navigator.language : selectedLang
        }),
      });`;

const newChatLogic = `    // Fallback REST endpoint execution
    try {
      const chatEngine = getChatEngine();
      const customApiKey = getCustomApiKey();
      
      if (chatEngine === 'local') {
         setIsAiTyping(true);
         const botResponse = await processChatMessage(userMessage, allPokemonRef.current);
         const finalMsg = { role: 'model' as const, text: botResponse.text };
         setChatMessages(prev => [...prev, finalMsg]);
         const typingInterval = setInterval(() => { if (Math.random() > 0.3) sounds.typing(); }, 150);
         setTimeout(() => { clearInterval(typingInterval); setIsAiTyping(false); }, Math.min(botResponse.text.length * 15, 3000));
         sounds.success();
         setIsChatLoading(false);
         return;
      }

      if (!customApiKey) {
        const { allowed: chatAllowed } = checkQuotaAllowed("gemini_ai");
        if (!chatAllowed) {
          throw new Error("Local AI Quota Exceeded! Please reset quota or wait until tomorrow.");
        }
        recordApiUsage("gemini_ai", 1);
      }

      const headers: any = { 
        "Content-Type": "application/json",
        "Accept-Language": navigator.language
      };
      if (customApiKey) {
        headers["X-Custom-Gemini-Key"] = customApiKey;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({ 
          messages: [...chatMessages, { role: 'user', text: userMessage }],
          context,
          lang: selectedLang === 'auto' ? navigator.language : selectedLang
        }),
      });`;

code = code.replace(oldChatLogic, newChatLogic);

fs.writeFileSync(file, code);
