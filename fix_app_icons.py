with open("src/App.tsx", "r") as f:
    text = f.read()

text = text.replace("<PokeballIcon className=\"w-8 h-8 text-red-500 animate-pulse\" />", "<PokethologyLogo className=\"w-12 h-12 object-contain animate-pulse\" />")
text = text.replace("<PokeballIcon className={cn(", "<PokethologyLogo className={cn(")

with open("src/App.tsx", "w") as f:
    f.write(text)
