with open('src/App.tsx', 'r') as f:
    text = f.read()

# Replace img tags rendering trainers to include [image-rendering:pixelated]
# 1. Mini avatar in top bar
text = text.replace(
    '''className="w-10 h-10 sm:w-14 sm:h-14 object-contain group-hover:scale-110 transition-transform"''',
    '''className="w-10 h-10 sm:w-14 sm:h-14 object-contain group-hover:scale-110 transition-transform [image-rendering:pixelated]"'''
)

# 2. Large avatar in selected modal
text = text.replace(
    '''className="w-16 h-16 sm:w-24 sm:h-24 lg:w-48 lg:h-48 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300"''',
    '''className="w-16 h-16 sm:w-24 sm:h-24 lg:w-48 lg:h-48 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300 [image-rendering:pixelated]"'''
)

# 3. Avatars in the selection grid
text = text.replace(
    '''className={cn(
                                "w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain transition-transform duration-300 drop-shadow-md",''',
    '''className={cn(
                                "w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain transition-transform duration-300 drop-shadow-md [image-rendering:pixelated]",'''
)

with open('src/App.tsx', 'w') as f:
    f.write(text)

print("Images updated")
