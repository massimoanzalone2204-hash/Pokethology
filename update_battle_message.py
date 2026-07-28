import re

with open('src/components/BattleMessage.tsx', 'r') as f:
    content = f.read()

# Add isLightMode to props
content = content.replace(
    '  enableAnimations?: boolean;\n}',
    '  enableAnimations?: boolean;\n  isLightMode?: boolean;\n}'
)

content = content.replace(
    'export const BattleMessage: React.FC<BattleMessageProps> = memo(({ message, type, onComplete, enableAnimations = true }) => {',
    'export const BattleMessage: React.FC<BattleMessageProps> = memo(({ message, type, onComplete, enableAnimations = true, isLightMode = false }) => {'
)

new_getStyle = """const getStyle = () => {
    switch (type) {
      case 'critical':
        return {
          container: isLightMode 
            ? 'bg-red-50/95 border-red-400 text-red-900 shadow-[0_0_30px_rgba(239,68,68,0.3)] backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4'
            : 'bg-red-950/95 border-red-500 text-red-50 shadow-[0_0_40px_rgba(239,68,68,0.5)] backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4',
          text: cn('font-hud font-black tracking-[0.25em] text-sm sm:text-lg lg:text-xl uppercase', isLightMode ? 'drop-shadow-none' : 'drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'),
          icon: <Zap className={cn("w-5 h-5 sm:w-6 sm:h-6 animate-pulse", isLightMode ? "text-red-600" : "text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,1)]")} />
        };
      case 'effective':
        return {
          container: isLightMode
            ? 'bg-amber-50/95 border-amber-400 text-amber-900 shadow-[0_0_30px_rgba(245,158,11,0.3)] backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4'
            : 'bg-amber-950/95 border-amber-500 text-amber-50 shadow-[0_0_40px_rgba(245,158,11,0.5)] backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4',
          text: cn('font-hud font-black tracking-[0.25em] text-sm sm:text-lg lg:text-xl uppercase', isLightMode ? 'drop-shadow-none' : 'drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'),
          icon: <Target className={cn("w-5 h-5 sm:w-6 sm:h-6 animate-pulse", isLightMode ? "text-amber-600" : "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,1)]")} />
        };
      case 'status':
        return {
          container: isLightMode
            ? 'bg-indigo-50/95 border-indigo-400 text-indigo-900 shadow-[0_0_30px_rgba(99,102,241,0.3)] backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4'
            : 'bg-indigo-950/95 border-indigo-500 text-indigo-50 shadow-[0_0_40px_rgba(99,102,241,0.5)] backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4',
          text: cn('font-hud font-black tracking-[0.25em] text-sm sm:text-lg lg:text-xl uppercase', isLightMode ? 'drop-shadow-none' : 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]'),
          icon: <AlertTriangle className={cn("w-5 h-5 sm:w-6 sm:h-6 animate-pulse", isLightMode ? "text-indigo-600" : "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,1)]")} />
        };
      default:
      case 'move':
        return {
          container: isLightMode
            ? 'bg-slate-50/95 border-cyan-500 text-slate-800 shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4'
            : 'bg-slate-900/95 border-cyan-400 text-cyan-50 shadow-[0_0_40px_rgba(34,211,238,0.5)] backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4',
          text: cn('font-hud font-black tracking-[0.25em] text-sm sm:text-lg lg:text-xl uppercase', isLightMode ? 'drop-shadow-none text-cyan-700' : 'drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]'),
          icon: <Swords className={cn("w-5 h-5 sm:w-6 sm:h-6", isLightMode ? "text-cyan-600" : "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,1)]")} />
        };
    }
  };"""

content = re.sub(r'const getStyle = \(\) => \{.*?\};\n  \};', new_getStyle, content, flags=re.DOTALL)

with open('src/components/BattleMessage.tsx', 'w') as f:
    f.write(content)
