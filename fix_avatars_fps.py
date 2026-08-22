import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Fix the over-optimized img tags which ruin FPS
text = text.replace(
    '"transform-gpu will-change-transform w-16 h-16',
    '"w-16 h-16'
)

# Apply content-visibility to the avatar buttons to boost scroll performance
text = text.replace(
    '''className={cn(
                              "relative aspect-square rounded-2xl border-2 transition-all group overflow-hidden flex flex-col items-center justify-center p-3 sm:p-4 backdrop-blur-sm",''',
    '''className={cn(
                              "relative aspect-square rounded-2xl border-2 transition-colors group overflow-hidden flex flex-col items-center justify-center p-3 sm:p-4",
                              "[content-visibility:auto] contain-intrinsic-size-[100px]",'''
)

# Also remove transition-all and backdrop-blur-sm from them, as transitioning EVERYTHING (including layout properties) or blurring 100+ items kills FPS
text = text.replace(
    '''"absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm py-1.5 px-2 transition-opacity duration-200 border-t border-cyan-500/30",''',
    '''"absolute bottom-0 inset-x-0 bg-black/80 py-1.5 px-2 transition-opacity duration-200 border-t border-cyan-500/30",'''
)

with open('src/App.tsx', 'w') as f:
    f.write(text)

print("Avatar scroll optimizations applied")
