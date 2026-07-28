const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/setIsMoveLearningOpen\\(false\\);\\s*setOfferedMoves\\(\\[\\]\\);\\s*sounds\\.success\\(\\);/g, 
  "finalizeMoveLearn();\\n                                setOfferedMoves([]);\\n                                sounds.success();");

code = code.replace(/onClick=\\{\\(\\) => \\{\\s*setIsMoveLearningOpen\\(false\\);\\s*setOfferedMoves\\(\\[\\]\\);\\s*sounds\\.scan\\(\\);\\s*\\}\\}/g, 
  "onClick={() => {\\n                          setOfferedMoves([]);\\n                          sounds.scan();\\n                          finalizeMoveLearn();\\n                        }}");

code = code.replace(/setSelectedMoves\\(newMoves\\);\\s*setIsMoveLearningOpen\\(false\\);/g, 
  "setSelectedMoves(newMoves);\\n                              finalizeMoveLearn();");

fs.writeFileSync('src/App.tsx', code, 'utf8');
