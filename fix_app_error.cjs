const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The replacement was:
// <ErrorBoundary>\n    <div className={cn(

code = code.replace('<ErrorBoundary>\n    <div className={cn(', '<div className={cn(');

// Now put it where it actually belongs
// We need to find:
// "w-full h-screen h-[100dvh] flex items-stretch justify-center transition-colors duration-300 ease-out bg-slate-950 relative overflow-hidden",

const targetStr = '<div className={cn(\n      "w-full h-screen h-[100dvh] flex items-stretch justify-center transition-colors duration-300 ease-out bg-slate-950 relative overflow-hidden",';

code = code.replace(
  targetStr,
  '<ErrorBoundary>\n    ' + targetStr
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
