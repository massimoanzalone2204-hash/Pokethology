with open("src/App.tsx", "r") as f:
    text = f.read()

old_str = """              <div className="absolute inset-0 flex items-center justify-center">
                <PokeballIcon className="w-8 h-8 text-red-500 animate-pulse" />
              </div>"""

new_str = """              <div className="absolute inset-0 flex items-center justify-center">
                <PokethologyLogo className="w-12 h-12" />
              </div>"""

if old_str in text:
    text = text.replace(old_str, new_str)
    with open("src/App.tsx", "w") as f:
        f.write(text)
    print("Replaced PokeballIcon with PokethologyLogo in reboot screen.")
else:
    print("Not found.")
