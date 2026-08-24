import re

with open("src/components/AudioSettings.tsx", "r") as f:
    text = f.read()

loop_handler = """  const handleToggleShuffle = () => {
    sounds.toggleShuffle();
    setBgmState(sounds.getBGMState());
  };

  const handleToggleLoop = () => {
    sounds.toggleLoop();
    setBgmState(sounds.getBGMState());
  };"""

text = text.replace("  const handleToggleShuffle = () => {\n    sounds.toggleShuffle();\n  };", loop_handler)

with open("src/components/AudioSettings.tsx", "w") as f:
    f.write(text)

