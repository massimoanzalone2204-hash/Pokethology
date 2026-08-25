import re
import glob

for filename in ["src/lib/pwa.ts", "src/utils/notificationManager.ts"]:
    with open(filename, "r") as f:
        text = f.read()
    
    text = text.replace('/icon.svg', '/logo.png')
    
    with open(filename, "w") as f:
        f.write(text)
