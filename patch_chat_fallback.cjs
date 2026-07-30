const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /if \(\!customApiKey\) \{\s*const \{ allowed: chatAllowed \} = checkQuotaAllowed\("gemini_ai"\);\s*if \(\!chatAllowed\) \{\s*throw new Error\("Local AI Quota Exceeded! Please reset quota or wait until tomorrow."\);\s*\}\s*recordApiUsage\("gemini_ai", 1\);\s*\}/g;

const replacer = `if (!customApiKey) {
        const { allowed: chatAllowed } = checkQuotaAllowed("gemini_ai");
        if (!chatAllowed) {
          setQuotaLimitReached(true);
          setChatEngine('local');
          setChatEngineState('local');
          
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
        recordApiUsage("gemini_ai", 1);
      }`;

code = code.replace(regex, replacer);

fs.writeFileSync(file, code);
