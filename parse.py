import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

tags = []
for m in re.finditer(r'<(/)?([A-Za-z0-9\.]+)([^>]*?)>', text):
    is_closing = m.group(1) == '/'
    tag_name = m.group(2)
    
    if tag_name.isspace() or not tag_name[0].isalpha(): continue
    if tag_name in ['motion.img', 'img', 'input', 'br', 'hr', 'path', 'svg', 'circle', 'line', 'polygon', 'rect']: continue
    
    is_self_closing = m.group(0).endswith('/>')
    if is_self_closing: continue
    
    tags.append((is_closing, tag_name, m.start()))

stack = []
for is_closing, name, pos in tags:
    if not is_closing:
        stack.append((name, pos))
    else:
        if not stack:
            print(f"Extra closing tag </{name}> at {pos}")
            continue
        last_name, last_pos = stack.pop()
        if last_name != name:
            print(f"Mismatched tag at {pos}: expected </{last_name}> (opened at {last_pos}), found </{name}>")
            print(f"Around text: {text[pos-30:pos+30]}")
            break

if stack:
    print(f"Remaining on stack: {len(stack)} items")
    for name, pos in stack[-10:]:
        print(f"Unclosed <{name}> at {pos}")
