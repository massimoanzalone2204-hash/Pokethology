import re

with open("src/components/BattleMessage.tsx", "r") as f:
    text = f.read()

old_container = """"absolute top-[38%] left-1/2 z-[100] px-3.5 sm:px-5 py-2 sm:py-3 rounded-2xl border-2 backdrop-blur-md pointer-events-none w-auto max-w-[92vw] sm:max-w-[85vw] md:max-w-xl lg:max-w-2xl transform-gpu flex items-center justify-center gap-2 sm:gap-3 box-border","""
new_container = """"absolute top-[15%] left-1/2 z-[100] px-3.5 sm:px-5 py-2 sm:py-3 rounded-2xl border-2 backdrop-blur-md pointer-events-none w-auto max-w-[92vw] sm:max-w-[85vw] md:max-w-xl lg:max-w-2xl transform-gpu flex flex-col items-center justify-center gap-2 sm:gap-3 box-border","""

old_multi = """<div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-full relative z-10">"""
new_multi = """<div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 max-w-full relative z-10 w-full">"""

text = text.replace(old_container, new_container)
text = text.replace(old_multi, new_multi)

with open("src/components/BattleMessage.tsx", "w") as f:
    f.write(text)
