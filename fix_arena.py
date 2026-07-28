import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix arenaRef container
content = content.replace(
    'className="bg-slate-900/80 backdrop-blur-md rounded-2xl relative shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col mb-4 overflow-hidden overflow-x-hidden w-full max-w-full h-auto z-10"',
    'className="bg-slate-900/80 backdrop-blur-md rounded-2xl relative shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col mb-4 overflow-hidden w-full max-w-full h-auto z-10"'
)

# Fix battle-arena-container
content = content.replace(
    'className="relative flex-1 flex flex-col justify-center min-h-[220px] xs:min-h-[260px] sm:min-h-[300px] md:min-h-[320px] lg:min-h-[340px] h-[300px] sm:h-[340px] lg:h-[380px] max-h-[40vh] z-10 p-[clamp(0.5rem,2vw,1.5rem)] font-bold overflow-hidden overflow-x-hidden w-full max-w-full"',
    'className="relative flex-1 flex flex-col justify-center min-h-[220px] xs:min-h-[260px] sm:min-h-[300px] md:min-h-[320px] lg:min-h-[340px] h-[300px] sm:h-[340px] lg:h-[380px] max-h-[40vh] z-10 p-[clamp(0.5rem,2vw,1.5rem)] font-bold overflow-hidden w-full max-w-full"'
)

# Fix touchAction
content = content.replace(
    "style={{ touchAction: 'pan-y', boxSizing: 'border-box' }}",
    "style={{ touchAction: 'none', boxSizing: 'border-box' }}"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
