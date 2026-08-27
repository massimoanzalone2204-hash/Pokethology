const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace in PokemonBattleSprite (1)
code = code.replace(`          animate={{ 
            scaleX: finalFlip ? -scaleFactor : scaleFactor, 
            scaleY: scaleFactor, 
            opacity: (!imageLoaded && fallbackLevel < 5) ? 0.6 : 0,
            y: 0 
          }}`, `          animate={{ 
            scaleX: finalFlip ? -scaleFactor : scaleFactor, 
            scaleY: scaleFactor, 
            opacity: (!imageLoaded && fallbackLevel < 5) ? 0.6 : 0,
            y: arenaMode ? [0, -10, 0] : 0 
          }}`);

// Replace in PokemonBattleSprite (2)
code = code.replace(`          animate={{ 
            scaleX: finalFlip ? -scaleFactor : scaleFactor, 
            scaleY: scaleFactor, 
            opacity: imageLoaded && fallbackLevel < 5 ? 1 : 0, 
            y: 0 
          }}`, `          animate={{ 
            scaleX: finalFlip ? -scaleFactor : scaleFactor, 
            scaleY: scaleFactor, 
            opacity: imageLoaded && fallbackLevel < 5 ? 1 : 0, 
            y: arenaMode ? [0, -10, 0] : 0 
          }}`);

// Replace in BattleArena Opponent Wrapper
code = code.replace(`                                              <motion.div
                                                animate={enableAnimations ? {
                                                  y: 0,
                                                  scaleY: [1, 1.005, 1],
                                                  scaleX: [1, 0.995, 1],
                                                } : {}}
                                                transition={{
                                                  duration: 2.8,`, `                                              <motion.div
                                                animate={enableAnimations ? {
                                                  y: [0, -0.5, 0],
                                                  scaleY: [1, 1.005, 1],
                                                  scaleX: [1, 0.995, 1],
                                                } : {}}
                                                transition={{
                                                  duration: 2.8,`);

// Replace in BattleArena Player Wrapper
code = code.replace(`                                              <motion.div
                                                animate={enableAnimations ? {
                                                  y: 0,
                                                  scaleY: [1, 1.005, 1],
                                                  scaleX: [1, 0.995, 1],
                                                } : {}}
                                                transition={{
                                                  duration: 3.1,`, `                                              <motion.div
                                                animate={enableAnimations ? {
                                                  y: [0, -0.5, 0],
                                                  scaleY: [1, 1.005, 1],
                                                  scaleX: [1, 0.995, 1],
                                                } : {}}
                                                transition={{
                                                  duration: 3.1,`);

fs.writeFileSync('src/App.tsx', code);
console.log('Patched animations.');
