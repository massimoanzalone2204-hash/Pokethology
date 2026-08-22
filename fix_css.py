with open('src/index.css', 'r') as f:
    css = f.read()

# Add scroll-behavior: smooth to custom-scrollbar
if 'scroll-behavior: smooth;' not in css:
    css = css.replace('.custom-scrollbar {', '.custom-scrollbar {\n  scroll-behavior: smooth;')
    
    # Also add to html and body
    if 'html {' not in css:
        css = 'html, body {\n  scroll-behavior: smooth;\n}\n\n' + css

with open('src/index.css', 'w') as f:
    f.write(css)
