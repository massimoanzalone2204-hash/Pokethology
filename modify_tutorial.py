import re

with open('src/components/Tutorial.tsx', 'r') as f:
    text = f.read()

# 1. Extract and remove Type Matchup Matrix
type_matchup_pattern = r'\{\/\* Type Weaknesses & Resistances \*\/}(.*?)(?=\{\/\* Evolution Trees & Moveset Engine \*\/}|\{\/\* Artwork & Sprite Presentation Modes \*\/})'
type_matchup_match = re.search(type_matchup_pattern, text, flags=re.DOTALL)
if type_matchup_match:
    type_matchup_block = "{/* Type Weaknesses & Resistances */}" + type_matchup_match.group(1)
    text = text.replace(type_matchup_block, "")
else:
    print("Could not find Type Matchup Matrix")

# 2. Remove Base Stats & Radar Diagnostics
radar_pattern = r'\{\/\* Stats & Radar Charts \*\/}.*?(?=\{\/\* Type Weaknesses & Resistances \*\/}|\{\/\* Evolution Trees & Moveset Engine \*\/}|\{\/\* Artwork & Sprite Presentation Modes \*\/})'
radar_match = re.search(radar_pattern, text, flags=re.DOTALL)
if radar_match:
    text = text.replace(radar_match.group(0), "")
else:
    print("Could not find Base Stats")

# 3. Remove Evolution Nodes & Moveset Pool
evo_pattern = r'\{\/\* Evolution Trees & Moveset Engine \*\/}.*?(?=\{\/\* Artwork & Sprite Presentation Modes \*\/})'
evo_match = re.search(evo_pattern, text, flags=re.DOTALL)
if evo_match:
    text = text.replace(evo_match.group(0), "")
else:
    print("Could not find Evolution Nodes")

# 4. Remove Daily Combat Missions
missions_pattern = r'\{\/\* COMBAT MISSIONS & OPERATOR RANKS \*\/}.*?(?=\{\/\* SEARCH BAR \*\/})'
missions_match = re.search(missions_pattern, text, flags=re.DOTALL)
if missions_match:
    text = text.replace(missions_match.group(0), "")
else:
    print("Could not find Daily Combat Missions")

# 5. Remove Search Bar
search_pattern = r'\{\/\* SEARCH BAR \*\/}.*?(?=\{\/\* SETTINGS SECTION \*\/})'
search_match = re.search(search_pattern, text, flags=re.DOTALL)
if search_match:
    text = text.replace(search_match.group(0), "")
else:
    print("Could not find Search Bar")

# 6. Insert Avatar Section in Pokedex
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
# We'll insert it right after the opening of the feature cards in pokedex
text = text.replace('<div className="grid grid-cols-1 gap-3 text-left">\n', '<div className="grid grid-cols-1 gap-3 text-left">\n' + avatar_block)

# 7. Insert Type Matchup into Combat section
if type_matchup_match:
    # Need to change border and text colors from emerald to red
    tb = type_matchup_block
    tb = tb.replace('border-emerald-500', 'border-red-500')
    tb = tb.replace('bg-emerald-950', 'bg-red-950')
    tb = tb.replace('text-emerald-400', 'text-red-400')
    
    # insert into combat section
    combat_insert_target = """              {/* HUD Feature Cards */}
              <div className="grid grid-cols-1 gap-3 text-left">"""
    
    text = text.replace(combat_insert_target, combat_insert_target + "\n" + tb)

with open('src/components/Tutorial.tsx', 'w') as f:
    f.write(text)

