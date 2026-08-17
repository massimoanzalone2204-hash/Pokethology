const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/finalizeMoveLearn\(\);\\n                                setOfferedMoves\(\[\]\);\\n                                sounds\.success\(\);/g, 
  "finalizeMoveLearn();\n                                setOfferedMoves([]);\n                                sounds.success();");

code = code.replace(/onClick=\{\(\) => \{\\n                          setOfferedMoves\(\[\]\);\\n                          sounds\.scan\(\);\\n                          finalizeMoveLearn\(\);\\n                        \}\}/g, 
  "onClick={() => {\n                          setOfferedMoves([]);\n                          sounds.scan();\n                          finalizeMoveLearn();\n                        }}");

code = code.replace(/setSelectedMoves\(newMoves\);\\n                              finalizeMoveLearn\(\);/g, 
  "setSelectedMoves(newMoves);\n                              finalizeMoveLearn();");

fs.writeFileSync('src/App.tsx', code, 'utf8');
