with open("src/App.tsx", "r") as f:
    text = f.read()

old_str = """                                          <PokeballIcon className={cn(
                                            "animate-pulse shrink-0 transition-all duration-300",
                                            "w-6 h-6 sm:w-9 sm:h-9"
                                          )} />"""

new_str = """                                          <PokethologyLogo className={cn(
                                            "animate-pulse shrink-0 transition-all duration-300",
                                            "w-6 h-6 sm:w-9 sm:h-9",
                                            "object-contain"
                                          )} />"""

if old_str in text:
    text = text.replace(old_str, new_str)
    with open("src/App.tsx", "w") as f:
        f.write(text)
    print("Replaced in Combat Arena.")
else:
    print("Not found.")
