import re

with open('src/components/BattleStatusBars.tsx', 'r') as f:
    content = f.read()

# Replace the HPBar component entirely
old_hp_bar = re.search(r'const HPBar = memo\(\(\{ current, max.*?\n\}\);\n', content, flags=re.DOTALL)
if old_hp_bar:
    new_hp_bar = """const HPBar = memo(({ current, max, enableAnimations = true }: { current: number; max: number; enableAnimations?: boolean }) => {
  const percentage = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0;
  const color = percentage > 50 ? 'bg-emerald-500' : percentage > 20 ? 'bg-amber-500' : 'bg-red-500';
  
  const prevPercentageRef = useRef(percentage);
  const [isDamaged, setIsDamaged] = useState(false);
  const [glowTrigger, setGlowTrigger] = useState(0);
  
  useEffect(() => {
    if (percentage < prevPercentageRef.current) {
      setIsDamaged(true);
      setGlowTrigger(prev => prev + 1);
      const timer = setTimeout(() => setIsDamaged(false), 800);
      prevPercentageRef.current = percentage;
      return () => clearTimeout(timer);
    } else {
      setIsDamaged(false);
    }
    prevPercentageRef.current = percentage;
  }, [percentage]);
  
  return (
    <motion.div 
      className="w-full bg-slate-950/90 rounded-full h-1.5 sm:h-2 p-[1px] border border-slate-800/80 my-1 overflow-visible relative shadow-inner"
      animate={glowTrigger > 0 ? {
        boxShadow: [
          "0 0 0px rgba(255, 255, 255, 0)",
          "0 0 15px rgba(239, 68, 68, 0.9)",
          "0 0 0px rgba(255, 255, 255, 0)"
        ],
        borderColor: [
          "rgba(30, 41, 59, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(30, 41, 59, 0.8)"
        ]
      } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      key={`hp-bar-${glowTrigger}`}
    >
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {/* Secondary delay translucent red catch-up bar (staggered trailing damage) */}
        <motion.div 
          className="absolute top-0 bottom-0 left-0 bg-red-500/80 rounded-full origin-left shadow-[0_0_8px_rgba(239,68,68,0.8)]"
          initial={{ width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            type: "spring",
            damping: 20,
            stiffness: 40,
            restDelta: 0.001
          }}
        />
        {/* Primary HP color bar - visually drains over when damage is received */}
        <motion.div 
          className={cn("h-full rounded-full relative z-10 origin-left transition-colors duration-1000", color)}
          initial={{ width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            type: "spring",
            damping: 25,
            stiffness: 200,
            restDelta: 0.001
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/20 rounded-full"></div>
          <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-white/70 shadow-[0_0_6px_#fff] rounded-r-full"></div>
        </motion.div>
      </div>
    </motion.div>
  );
});
"""
    content = content.replace(old_hp_bar.group(0), new_hp_bar)

    with open('src/components/BattleStatusBars.tsx', 'w') as f:
        f.write(content)
