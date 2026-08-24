import re

with open("src/App.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    if line.strip() == ")}":
        # Check what the previous line was
        prev_line = new_lines[-1].strip() if new_lines else ""
        next_line = lines[i+1].strip() if i+1 < len(lines) else ""
        
        if prev_line == ")}" or prev_line == "})()" or prev_line == "}))" or prev_line == "})}" or prev_line == ") : null}":
            # Duplicate or extra.
            i += 1
            continue
            
        if next_line == "</AnimatePresence>":
            # Let's check if the previous line opened a brace or something, but generally we might have added too many.
            pass
            
        # Check if the line above is `)}` but with spaces
        if re.search(r'\)\}\s*$', prev_line):
            i += 1
            continue

        if prev_line.endswith("/>") and next_line == "</AnimatePresence>":
            # like 8188: <BattleLog ... /> \n )} \n </AnimatePresence>
            i += 1
            continue
            
    new_lines.append(line)
    i += 1
    
with open("src/App.tsx", "w") as f:
    f.writelines(new_lines)
