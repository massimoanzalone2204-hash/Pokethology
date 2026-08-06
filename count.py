with open('src/App.tsx', 'r') as f:
    text = f.read()

opens = text.count('<motion.div')
closes = text.count('</motion.div>')
print(f"opens: {opens}, closes: {closes}")

self_closing = 0
import re
for m in re.finditer(r'<motion\.div[^>]*/>', text):
    self_closing += 1
print(f"self_closing (simple): {self_closing}")
