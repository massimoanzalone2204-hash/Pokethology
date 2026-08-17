import re

with open('src/components/BattleMessage.tsx', 'r') as f:
    content = f.read()

# Replace getStyle
new_getStyle = """const getStyle = () => {
    switch (type) {
      case 'critical':
        return {
          container: 'bg-red-950/95 border-red-500 text-red-50 shadow-[0_0_40px_rgba(239,68,68,0.5)] backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4',
          text: 'font-hud font-black tracking-[0.25em] text-sm sm:text-lg lg:text-xl drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] uppercase',
          icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,1)] animate-pulse" />
        };
      case 'effective':
        return {
          container: 'bg-amber-950/95 border-amber-500 text-amber-50 shadow-[0_0_40px_rgba(245,158,11,0.5)] backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4',
          text: 'font-hud font-black tracking-[0.25em] text-sm sm:text-lg lg:text-xl drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] uppercase',
          icon: <Target className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,1)] animate-pulse" />
        };
      case 'status':
        return {
          container: 'bg-indigo-950/95 border-indigo-500 text-indigo-50 shadow-[0_0_40px_rgba(99,102,241,0.5)] backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4',
          text: 'font-hud font-black tracking-[0.25em] text-sm sm:text-lg lg:text-xl drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] uppercase',
          icon: <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,1)] animate-pulse" />
        };
      default:
      case 'move':
        return {
          container: 'bg-slate-900/95 border-cyan-400 text-cyan-50 shadow-[0_0_40px_rgba(34,211,238,0.5)] backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4',
          text: 'font-hud font-black tracking-[0.25em] text-sm sm:text-lg lg:text-xl drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] uppercase',
          icon: <Swords className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,1)]" />
        };
    }
  };"""

content = re.sub(r'const getStyle = \(\) => \{.*?\};\n  \};', new_getStyle, content, flags=re.DOTALL)

with open('src/components/BattleMessage.tsx', 'w') as f:
    f.write(content)
