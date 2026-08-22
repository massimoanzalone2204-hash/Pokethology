with open('src/index.css', 'r') as f:
    css = f.read()

perf_css = """
/* Hardware Acceleration & Smoothness Optimizations */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.hardware-accelerated, .transform-gpu {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.smooth-render {
  contain: content;
}
"""

if 'Hardware Acceleration & Smoothness Optimizations' not in css:
    css = perf_css + '\n' + css
    with open('src/index.css', 'w') as f:
        f.write(css)
    print("Added CSS optimizations")
else:
    print("Already optimized CSS")
