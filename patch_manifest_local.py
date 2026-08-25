import json

with open("public/manifest.webmanifest", "r") as f:
    data = json.load(f)

for icon in data.get("icons", []):
    if icon["src"].startswith("http"):
        icon["src"] = "/icon.png"

with open("public/manifest.webmanifest", "w") as f:
    json.dump(data, f, indent=2)
