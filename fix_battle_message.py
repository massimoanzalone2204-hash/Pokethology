import re

with open('src/components/BattleMessage.tsx', 'r') as f:
    content = f.read()

# Replace the getStyle function with a single unified style
old_getStyle = re.search(r'const getStyle = \(\) => \{.*?\n  \};\n', content, flags=re.DOTALL)

if old_getStyle:
    unified_style = """const getStyle = () => {
    return {
      container: 'bg-slate-900/95 border-cyan-400 text-cyan-50 shadow-[0_0_40px_rgba(34,211,238,0.5)] backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4',
      text: 'font-hud font-black tracking-[0.25em] text-sm sm:text-lg lg:text-xl drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] uppercase',
      icon: <Swords className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,1)]" />
    };
  };
"""
    content = content.replace(old_getStyle.group(0), unified_style)
    with open('src/components/BattleMessage.tsx', 'w') as f:
        f.write(content)
