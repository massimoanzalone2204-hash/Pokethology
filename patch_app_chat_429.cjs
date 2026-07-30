const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /if \(response\.status === 429 \|\| data\.isQuota === true \|\| data\.isQuotaExhausted\) \{[\s\S]*?return;[\s\S]*?\}[\s\S]*?\}/;
const replacer = `if (response.status === 429 || data.isQuota === true || data.isQuotaExhausted) {
        if (data.isQuotaExhausted || data.percentRemaining === 0 || response.status === 429) {
          setQuotaLimitReached(true);
        }
        
        // Auto fallback to local mode
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
      }`;

code = code.replace(regex, replacer);

fs.writeFileSync(file, code);
