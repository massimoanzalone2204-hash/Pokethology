const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add the state and effect inside PokemonCard
const stateAddition = `
  const [clickAura, setClickAura] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cardType, setCardType] = useState<string | null>(null);

  useEffect(() => {
    if ((isHovered || isSelected || isOpponentSelected) && !cardType && p.url) {
      let isMounted = true;
      fetch(p.url)
        .then(res => res.json())
        .then(data => {
          if (isMounted && data.types && data.types[0]) {
            setCardType(data.types[0].type.name);
          }
        })
        .catch(err => console.error("Failed to fetch card type", err));
      return () => { isMounted = false; };
    }
  }, [isHovered, isSelected, isOpponentSelected, cardType, p.url]);
`;

code = code.replace(
  /const \[clickAura, setClickAura\] = useState\(false\);/,
  stateAddition
);

// Update handleMouseLeave
const mouseLeaveOriginal = `  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };`;

const mouseLeaveReplacement = `  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };`;

code = code.replace(mouseLeaveOriginal, mouseLeaveReplacement);

// Update onMouseEnter
const onMouseEnterOriginal = `      onMouseEnter={() => sounds.hover()}`;
const onMouseEnterReplacement = `      onMouseEnter={() => {
        setIsHovered(true);
        sounds.hover();
      }}`;

code = code.replace(onMouseEnterOriginal, onMouseEnterReplacement);

// Add the aura inside the card container.
// We'll place it right after the gradient background `absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent`

const auraTarget = `      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>`;
const auraReplacement = `      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Type-based Particle Aura */}
      <AnimatePresence>
        {(isHovered || isSelected || isOpponentSelected) && cardType && typeColors[cardType] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className={\`absolute w-1.5 h-1.5 rounded-full blur-[1px] \${typeColors[cardType].replace('bg-', 'bg-')}\`}
                initial={{
                  x: Math.random() * 100 + "%",
                  y: "110%",
                  scale: Math.random() * 0.5 + 0.5,
                  opacity: Math.random() * 0.5 + 0.2
                }}
                animate={{
                  y: "-10%",
                  x: \`\${Math.random() * 100}%\`,
                  opacity: [0, Math.random() * 0.5 + 0.2, 0],
                  scale: [Math.random() * 0.5 + 0.5, Math.random() * 1.5 + 0.5, 0]
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: Math.random() * 2
                }}
              />
            ))}
            <div className={\`absolute inset-0 opacity-20 blur-xl \${typeColors[cardType].replace('bg-', 'bg-')}\`} />
          </motion.div>
        )}
      </AnimatePresence>`;

code = code.replace(auraTarget, auraReplacement);

fs.writeFileSync('src/App.tsx', code, 'utf8');
