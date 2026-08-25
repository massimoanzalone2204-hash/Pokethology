with open("src/App.tsx", "r") as f:
    text = f.read()

old_str = """                  <div className="flex items-center gap-2">
                    <h2 className="font-hud font-black text-base sm:text-xl text-cyan-300 uppercase tracking-widest leading-none">
                      THEORY EXAM
                    </h2>
                  </div>"""

new_str = """                  <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
                    <h2 className="font-hud font-black text-base sm:text-xl text-cyan-300 uppercase tracking-widest leading-none whitespace-nowrap">
                      THEORY EXAM
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-[10px] sm:text-xs font-mono font-bold whitespace-nowrap shadow-sm">
                      {today}
                    </span>
                  </div>"""

if old_str in text:
    text = text.replace(old_str, new_str)
    with open("src/App.tsx", "w") as f:
        f.write(text)
    print("Replaced!")
else:
    print("Not found.")
