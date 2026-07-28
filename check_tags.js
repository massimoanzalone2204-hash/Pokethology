const fs = require('fs');
const content = fs.readFileSync('/src/App.tsx', 'utf8');
const lines = content.split('\n');

let stack = [];
const motionOpenRegex = /<motion\.([a-z]+)/g;
const motionCloseRegex = /<\/motion\.([a-z]+)>/g;
const selfClosingRegex = /<motion\.[^>]*\/>/g;

lines.forEach((line, index) => {
    let match;
    
    // Check self-closing first to remove them from further consideration on this line
    let lineCopy = line;
    while((match = selfClosingRegex.exec(line)) !== null) {
        // do nothing
    }
    
    // This is naive because it doesn't handle multiple tags on one line well if mixed
    // Let's do it better
});

// Better approach: tokenization-ish
let pos = 0;
while (pos < content.length) {
    const openMatch = /<motion\.([a-z]+)/g;
    openMatch.lastIndex = pos;
    const om = openMatch.exec(content);
    
    const closeMatch = /<\/motion\.([a-z]+)>/g;
    closeMatch.lastIndex = pos;
    const cm = closeMatch.exec(content);
    
    const selfMatch = /<motion\.[^>]*\/>/g;
    selfMatch.lastIndex = pos;
    const sm = selfMatch.exec(content);
    
    let next = Math.min(
        om ? om.index : Infinity,
        cm ? cm.index : Infinity,
        sm ? sm.index : Infinity
    );
    
    if (next === Infinity) break;
    
    if (sm && next === sm.index) {
        // self closing
        pos = next + sm[0].length;
    } else if (om && next === om.index) {
        // opening
        const lineNum = content.substring(0, next).split('\n').length;
        stack.push({ type: om[1], line: lineNum });
        pos = next + om[0].length;
    } else if (cm && next === cm.index) {
        // closing
        const top = stack.pop();
        if (!top || top.type !== cm[1]) {
            const lineNum = content.substring(0, next).split('\n').length;
            console.log(`Unmatched closing tag </motion.${cm[1]}> at line ${lineNum}. Expected ${top ? top.type : 'nothing'}`);
        }
        pos = next + cm[0].length;
    }
}

stack.forEach(tag => {
    console.log(`Unclosed <motion.${tag.type}> opened at line ${tag.line}`);
});
