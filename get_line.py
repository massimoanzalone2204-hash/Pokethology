import sys
with open('src/App.tsx', 'r') as f:
    text = f.read()

def get_line(pos):
    return text.count('\n', 0, pos) + 1

print(sys.argv[1], ":", get_line(int(sys.argv[1])))
