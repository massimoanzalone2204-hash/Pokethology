with open("src/components/PokethologyQuizWidget.tsx", "r") as f:
    text = f.read()

start_str = "{/* DAILY REFRESH STATUS BANNER */}"
end_str = "{/* REGION SELECTION TABS */}"

start_idx = text.find(start_str)
end_idx = text.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_text = text[:start_idx] + text[end_idx:]
    with open("src/components/PokethologyQuizWidget.tsx", "w") as f:
        f.write(new_text)
    print("Banner removed successfully!")
else:
    print("Not found.")
