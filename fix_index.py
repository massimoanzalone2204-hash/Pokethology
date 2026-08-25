import re

with open("index.html", "r") as f:
    text = f.read()

# Replace <link rel="icon" type="image/svg+xml" href="/icon.svg" />
# with <link rel="icon" type="image/png" href="/logo.png" />
text = re.sub(r'<link rel="icon" type="image/svg\+xml" href="/icon\.svg" />', '<link rel="icon" type="image/png" href="/logo.png" />', text)
text = re.sub(r'<link rel="apple-touch-icon" href="/icon\.svg" />', '<link rel="apple-touch-icon" href="/logo.png" />', text)

with open("index.html", "w") as f:
    f.write(text)
