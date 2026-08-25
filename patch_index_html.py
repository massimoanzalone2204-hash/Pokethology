with open("index.html", "r") as f:
    text = f.read()

text = text.replace('<link rel="icon" type="image/svg+xml" href="/icon.svg" />', '<link rel="icon" type="image/png" href="/icon.png" />')
text = text.replace('<link rel="apple-touch-icon" href="/icon.svg" />', '<link rel="apple-touch-icon" href="/icon.png" />')

with open("index.html", "w") as f:
    f.write(text)
