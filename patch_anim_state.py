import re

with open("src/App.tsx", "r") as f:
    text = f.read()

new_state = """  const [arenaCriticalNotify, setArenaCriticalNotify] = useState<boolean>(false);
  const [playerAnimMode, setPlayerAnimMode] = useState<'idle' | 'hit' | 'boost' | 'drop'>('idle');
  const [opponentAnimMode, setOpponentAnimMode] = useState<'idle' | 'hit' | 'boost' | 'drop'>('idle');"""

text = text.replace("  const [arenaCriticalNotify, setArenaCriticalNotify] = useState<boolean>(false);", new_state)

with open("src/App.tsx", "w") as f:
    f.write(text)
