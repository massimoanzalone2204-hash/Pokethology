const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Insert isListening state
code = code.replace("const [isLightMode, setIsLightMode] = useState(false);", 
"const [isLightMode, setIsLightMode] = useState(false);\n  const [isListening, setIsListening] = useState(false);");

// Define voice recognition logic
const voiceLogic = `  // Voice Command Logic
  const toggleVoiceCommand = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setBattleLog(prev => [{ text: "VOICE COMMANDS NOT SUPPORTED IN THIS BROWSER", type: 'system' }, ...prev]);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return; // The onend will handle the actual stop if it was running, but let's assume we just toggle UI state
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      sounds.scan();
      setBattleLog(prev => [{ text: "LISTENING FOR VOICE COMMAND...", type: 'system' }, ...prev]);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("Heard:", transcript);
      
      const matchedMove = selectedMoves.find(m => {
        const cleanName = m.name.toLowerCase().replace('-', ' ');
        return transcript.includes(cleanName);
      });

      if (matchedMove) {
        setBattleLog(prev => [{ text: \`VOICE COMMAND RECOGNIZED: \${matchedMove.name.toUpperCase()}\`, type: 'system' }, ...prev]);
        handlePlayerMove(matchedMove);
      } else {
        setBattleLog(prev => [{ text: \`UNRECOGNIZED VOICE COMMAND: "\${transcript.toUpperCase()}"\`, type: 'system' }, ...prev]);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch(e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleAbort = useCallback(() => {`;

code = code.replace("const handleAbort = useCallback(() => {", voiceLogic);

fs.writeFileSync('src/App.tsx', code);
