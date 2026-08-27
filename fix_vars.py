with open("src/App.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i in range(9000, len(lines)):
    line = lines[i]
    if "theme" in line or "selectedBGM" in line or "setSelectedBGM" in line:
        line = line.replace("theme === 'dark'", "!isLightMode")
        line = line.replace("theme === 'light'", "isLightMode")
        line = line.replace("setTheme(!isLightMode ? 'light' : 'dark')", "setIsLightMode(!isLightMode)")
        line = line.replace("setTheme(theme === 'dark' ? 'light' : 'dark')", "setIsLightMode(!isLightMode)")
        line = line.replace("selectedBGM", "battleTheme")
        line = line.replace("setSelectedBGM", "setBattleTheme")
        lines[i] = line

with open("src/App.tsx", "w", encoding="utf-8") as f:
    f.writelines(lines)
print("Replaced vars!")
