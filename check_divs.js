const fs = require('fs');
const content = fs.readFileSync('/src/App.tsx', 'utf8');

let stack = [];
let lines = content.split('\n');

const divOpenRegex = /<div(?![a-z])([^>]*)/g;
const divCloseRegex = /<\/div>/g;

let pos = 0;
while (pos < content.length) {
    divOpenRegex.lastIndex = pos;
    const om = divOpenRegex.exec(content);
    
    divCloseRegex.lastIndex = pos;
    const cm = divCloseRegex.exec(content);
    
    let next = Math.min(
        om ? om.index : Infinity,
        cm ? cm.index : Infinity
    );
    
    if (next === Infinity) break;
    
    if (om && next === om.index) {
        // opening tag
        const tagContent = om[0];
        const isSelfClosing = tagContent.trim().endsWith('/') || content.substring(om.index, content.indexOf('>', om.index) + 1).includes('/>');
        
        if (!isSelfClosing) {
            const lineNum = content.substring(0, next).split('\n').length;
            stack.push({ line: lineNum });
        }
        pos = om.index + om[0].length;
        // Advance to end of tag
        const endOfTag = content.indexOf('>', pos);
        if (endOfTag !== -1) pos = endOfTag + 1;
    } else if (cm && next === cm.index) {
        // closing tag
        const top = stack.pop();
        if (!top) {
            const lineNum = content.substring(0, next).split('\n').length;
            console.log(`Unmatched </div> at line ${lineNum}`);
        }
        pos = cm.index + cm[0].length;
    }
}

stack.forEach(div => {
    console.log(`Unclosed <div> opened at line ${div.line}`);
});
