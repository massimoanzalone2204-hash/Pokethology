import re
with open('src/App.tsx', 'r') as f:
    text = f.read()

target1 = """  const getChatWelcomeMessage = useCallback((pokemonName?: string) => {
    const nameUpper = pokemonName ? pokemonName.toUpperCase() : null;
    return `POKÉTHEOLOGY CORE ONLINE. ${nameUpper ? nameUpper + " SELECTED." : ""} WAITING FOR QUERIES...`;
  }, []);"""

replacement1 = """  const getChatWelcomeMessage = useCallback((pokemonName?: string) => {
    const nameUpper = pokemonName ? pokemonName.toUpperCase() : null;
    return `Hello! I am Pokéthology AI. I can assist you with Pokémon strategies, biology, stats, and canonical lore. ${nameUpper ? `I see you have selected **${nameUpper}**. ` : ""}How can I assist you today?`;
  }, []);"""

target2 = """  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string, groundingChunks?: any[], groundingMetadata?: any}[]>([]);"""
replacement2 = """  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string, groundingChunks?: any[], groundingMetadata?: any}[]>([{ role: 'model', text: getChatWelcomeMessage() }]);"""

text = text.replace(target1, replacement1).replace(target2, replacement2)

with open('src/App.tsx', 'w') as f:
    f.write(text)
