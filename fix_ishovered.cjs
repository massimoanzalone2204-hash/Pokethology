const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const injectedState = `
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

// 1. Revert in PokemonCardSprite
code = code.replace(injectedState, '\n  const [clickAura, setClickAura] = useState(false);\n');

// 2. Add to PokemonCard
code = code.replace(
  'const PokemonCard = memo(({ p, isSelected, isOpponentSelected, enableAnimations, onClick, isShiny, isCardView, isLightMode }: any) => {\n    const id = p.url.split(\'/\').filter(Boolean).pop();\n  const displayId = p.displayId || p.baseId || id;\n  const isSpecial = parseInt(id || "0") > 1025 && !p.displayId;\n  const isMega = p.name.includes(\'-mega\');\n  const isGmax = p.name.includes(\'-gmax\');\n  \n  const [clickAura, setClickAura] = useState(false);',
  'const PokemonCard = memo(({ p, isSelected, isOpponentSelected, enableAnimations, onClick, isShiny, isCardView, isLightMode }: any) => {\n    const id = p.url.split(\'/\').filter(Boolean).pop();\n  const displayId = p.displayId || p.baseId || id;\n  const isSpecial = parseInt(id || "0") > 1025 && !p.displayId;\n  const isMega = p.name.includes(\'-mega\');\n  const isGmax = p.name.includes(\'-gmax\');\n' + injectedState
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
