const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `  return (
    <div 
      ref={logRef} 
      className="bg-slate-900/30`;

const replacement = `  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      ref={logRef} 
      className="bg-slate-900/30`;

console.log("Found:", code.includes(targetStr));
code = code.replace(targetStr, replacement);
fs.writeFileSync('src/App.tsx', code, 'utf8');
