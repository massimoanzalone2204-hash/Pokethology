import re

with open('src/components/Tutorial.tsx', 'r') as f:
    text = f.read()

# I will find all instances of "{/* Type Weaknesses & Resistances */}" block and remove them EXCEPT the one inside activeTab === 'combat'
# Let's split the file by "activeTab ===" and process each tab.

parts = re.split(r'(activeTab === \'.*?\' && \()', text)

# parts[0] is the top of the file
# parts[1] is activeTab === 'pokedex' && (
# parts[2] is the pokedex content
# and so on

def remove_type_matchup(content):
    pattern = r'\{\/\* Type Weaknesses & Resistances \*\/}.*?<\/div>\s*<\/div>\s*<\/div>\s*'
    return re.sub(pattern, '', content, flags=re.DOTALL)

for i in range(2, len(parts), 2):
    tab_name = parts[i-1]
    
    if "combat" not in tab_name:
        parts[i] = remove_type_matchup(parts[i])
        
    if "pokedex" in tab_name:
        # Insert Avatar
        avatar_block = """                {/* Avatar Personalization */}
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-emerald-950 rounded-full border border-emerald-500/50 shrink-0 group-hover:scale-110 transition-transform">
                    <User className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="space-y-1 w-full min-w-0">
                    <span className="font-hud font-black text-emerald-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Avatar Personalization
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Choose your favorite trainer avatar from Pokémon regions and customize your HUD persona. Tap the avatar icon in the top navigation to select from Gym Leaders, Champions, Rivals, and Protagonists.
                    </p>
                  </div>
                </div>
"""
        parts[i] = parts[i].replace('<div className="grid grid-cols-1 gap-3 text-left">\n', '<div className="grid grid-cols-1 gap-3 text-left">\n' + avatar_block)

new_text = "".join(parts)

# Also need to import User from lucide-react
if "User," not in new_text and "User " not in new_text:
    new_text = new_text.replace("import { \n  X,", "import { \n  User,\n  X,")
    # Wait, the import looks like:
    # import {
    #   X,
    # Let's just do a regex replace for `import {` in the first match
    new_text = re.sub(r'import \{', 'import { User,', new_text, count=1)

with open('src/components/Tutorial.tsx', 'w') as f:
    f.write(new_text)

