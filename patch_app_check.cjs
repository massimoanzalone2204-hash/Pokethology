const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/if \(!customApiKey\) \{/g, `if (quotaLimitReached) {
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
      
      if (!customApiKey) {`);

fs.writeFileSync('src/App.tsx', code);
