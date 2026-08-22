import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

target = """                                        {/* Player Sprite (Bottom Left Area) */}"""

replacement = """                                        {/* Trainer Avatar (Bottom Left Area - Battle Only) */}
                                        {isBattling && (
                                          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-0 pointer-events-none opacity-80 mix-blend-screen drop-shadow-md">
                                            <img 
                                              src={`https://play.pokemonshowdown.com/sprites/trainers/${currentAvatar.id}.png`} 
                                              alt={currentAvatar.name}
                                              className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain [image-rendering:pixelated]"
                                            />
                                          </div>
                                        )}

                                        {/* Player Sprite (Bottom Left Area) */}"""

if target in text:
    text = text.replace(target, replacement)
    with open('src/App.tsx', 'w') as f:
        f.write(text)
    print("Trainer avatar added to Arena.")
else:
    print("Could not find the target code in src/App.tsx.")
