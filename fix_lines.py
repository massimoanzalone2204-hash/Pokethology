with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

lines[7843] = '                                      ) : null}\n'
lines[7844] = ''

with open('src/App.tsx', 'w') as f:
    f.writelines(lines)
