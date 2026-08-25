import json

with open("public/manifest.webmanifest", "r") as f:
    data = json.load(f)

data["icons"] = [
    {
        "src": "/logo.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any"
    },
    {
        "src": "/logo.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any"
    },
    {
        "src": "/logo.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "maskable"
    },
    {
        "src": "/logo.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable"
    }
]

with open("public/manifest.webmanifest", "w") as f:
    json.dump(data, f, indent=2)
