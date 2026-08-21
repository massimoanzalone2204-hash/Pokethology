import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Replace the logo container classes
old_logo_classes = r'className="relative w-32 h-32 xxs:w-40 xxs:h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 lg:w-64 lg:h-64 flex items-center justify-center shrink max-h-\[24vh\] sm:max-h-\[30vh\] my-1"'
new_logo_classes = 'className="relative w-48 h-48 xxs:w-56 xxs:h-56 xs:w-64 xs:h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] flex items-center justify-center shrink max-h-[35vh] sm:max-h-[45vh] -mt-8 sm:-mt-16 mb-2 sm:mb-6"'

text = re.sub(old_logo_classes, new_logo_classes, text)

with open('src/App.tsx', 'w') as f:
    f.write(text)

print("Logo updated")
