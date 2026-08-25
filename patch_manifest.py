import json

with open("public/manifest.webmanifest", "r") as f:
    data = json.load(f)

# Change icon.svg reference to icon.png
for icon in data.get("icons", []):
    if icon["src"] == "/icon.svg":
        icon["src"] = "/icon.png"
        icon["type"] = "image/png"

with open("public/manifest.webmanifest", "w") as f:
    json.dump(data, f, indent=2)
