import re

with open("src/components/AudioSettings.tsx", "r") as f:
    text = f.read()

bgm_handler = """  const handleToggleBgm = () => {
    sounds.toggleBGM();
    setBgmState(sounds.getBGMState());
  };"""

text = text.replace("  const handleToggleBgm = () => {\n    sounds.toggleBGM();\n  };", bgm_handler)

with open("src/components/AudioSettings.tsx", "w") as f:
    f.write(text)

