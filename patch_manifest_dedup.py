import json

with open("public/manifest.webmanifest", "r") as f:
    data = json.load(f)

# Deduplicate icons, keeping only the necessary sizes
data["icons"] = [
    {
      "src": "/icon.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    }
]

with open("public/manifest.webmanifest", "w") as f:
    json.dump(data, f, indent=2)
