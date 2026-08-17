const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "setIsMoveLearningOpen(false);\\n                                setOfferedMoves([]);\\n                                sounds.success();",
  "finalizeMoveLearn();\\n                                setOfferedMoves([]);\\n                                sounds.success();"
);

code = code.replace(
  "onClick={() => {\\n                          setIsMoveLearningOpen(false);\\n                          setOfferedMoves([]);\\n                          sounds.scan();\\n                        }}",
  "onClick={() => {\\n                          setOfferedMoves([]);\\n                          sounds.scan();\\n                          finalizeMoveLearn();\\n                        }}"
);

code = code.replace(
  "setSelectedMoves(newMoves);\\n                              setIsMoveLearningOpen(false);",
  "setSelectedMoves(newMoves);\\n                              finalizeMoveLearn();"
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
