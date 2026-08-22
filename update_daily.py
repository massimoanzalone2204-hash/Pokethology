import re

with open('src/components/Tutorial.tsx', 'r') as f:
    text = f.read()

# Replace the heading title
text = text.replace(
    '<Calendar className="w-4 h-4 text-amber-400 animate-bounce" /> Daily Hub, Quests & Utilities',
    '<Calendar className="w-4 h-4 text-amber-400 animate-bounce" /> Daily'
)

# Replace the comment just for cleanliness
text = text.replace(
    '{/* TAB: DAILY ACTIVITIES & UTILITIES */}',
    '{/* TAB: DAILY */}'
)

with open('src/components/Tutorial.tsx', 'w') as f:
    f.write(text)
