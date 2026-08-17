const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const ts = require('typescript');
const srcFile = ts.createSourceFile('src/App.tsx', code, ts.ScriptTarget.Latest, true);

function findError(node) {
    if (node.kind === ts.SyntaxKind.JsxExpression) {
        // We can inspect nodes
    }
    ts.forEachChild(node, findError);
}

console.log("Compiling program programmatically to see AST error");
let program = ts.createProgram(['src/App.tsx'], {noEmit: true});
let emitResult = program.emit();
let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
let important = allDiagnostics.filter(d => d.start && d.file && d.file.fileName.includes('App.tsx')).slice(0, 5);
important.forEach(diagnostic => {
  if (diagnostic.file) {
    let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
    let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
    console.log(`Error ${diagnostic.code} at line ${line + 1}, col ${character + 1}: ${message}`);
  }
});
