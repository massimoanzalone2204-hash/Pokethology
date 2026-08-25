import re

with open("src/App.tsx", "r") as f:
    text = f.read()

player_class_old = """className="max-w-full max-h-full object-contain scale-x-[-1] filter drop-shadow-[0_8px_20px_rgba(6,182,212,0.5)] relative z-10 transition-transform hover:scale-105\""""
player_class_new = """className={cn("max-w-full max-h-full object-contain scale-x-[-1] filter drop-shadow-[0_8px_20px_rgba(6,182,212,0.5)] relative z-10 transition-transform hover:scale-105", playerAnimMode === 'hit' && "animate-hit", playerAnimMode === 'boost' && "animate-stat-boost", playerAnimMode === 'drop' && "animate-stat-drop")}"""

opponent_class_old = """className="max-w-full max-h-full object-contain filter drop-shadow-[0_8px_20px_rgba(239,68,68,0.5)] relative z-10 transition-transform hover:scale-105\""""
opponent_class_new = """className={cn("max-w-full max-h-full object-contain filter drop-shadow-[0_8px_20px_rgba(239,68,68,0.5)] relative z-10 transition-transform hover:scale-105", opponentAnimMode === 'hit' && "animate-hit", opponentAnimMode === 'boost' && "animate-stat-boost", opponentAnimMode === 'drop' && "animate-stat-drop")}"""

text = text.replace(player_class_old, player_class_new)
text = text.replace(opponent_class_old, opponent_class_new)

with open("src/App.tsx", "w") as f:
    f.write(text)
