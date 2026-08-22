with open('src/App.tsx', 'r') as f:
    text = f.read()

# Replace transition={{ duration: 0.3, ease: 'easeOut' }} for modals with spring
text = text.replace(
    '''transition={{ duration: 0.3, ease: 'easeOut' }}''',
    '''transition={{ type: "spring", damping: 25, stiffness: 250 }}'''
)

text = text.replace(
    '''transition={{ duration: 0.15, ease: 'easeOut' }}''',
    '''transition={{ type: "spring", damping: 25, stiffness: 300 }}'''
)

text = text.replace(
    '''transition={{ duration: 0.2 }}''',
    '''transition={{ type: "spring", damping: 25, stiffness: 250 }}'''
)

with open('src/App.tsx', 'w') as f:
    f.write(text)

