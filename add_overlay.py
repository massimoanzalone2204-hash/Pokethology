import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

target = """      {/* VS Screen Matchup Transition Overlay */}"""
replacement = """      {/* Tab Change Black Vision Overlay */}
      <AnimatePresence>
        {isTabTransitioning && (
          <motion.div
            key="tab-transition-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="fixed inset-0 z-[240] bg-slate-950 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* VS Screen Matchup Transition Overlay */}"""

text = text.replace(target, replacement)

with open('src/App.tsx', 'w') as f:
    f.write(text)
