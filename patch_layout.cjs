const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const t1 = `"flex-1 flex flex-col lg:flex-row lg:gap-6 min-h-0 h-full custom-scrollbar"`;
const r1 = `"flex-1 flex flex-col md:flex-row md:gap-6 min-h-0 h-full custom-scrollbar"`;
code = code.replace(t1, r1);

const t2 = `activeTab === 'chat' ? "overflow-hidden items-stretch pb-0 lg:pb-0" : "overflow-y-auto lg:items-start pb-8 sm:pb-12"`;
const r2 = `activeTab === 'chat' ? "overflow-hidden items-stretch pb-0" : "overflow-y-auto md:items-start pb-8 sm:pb-12"`;
code = code.replace(t2, r2);

const t3 = `"flex flex-col items-center lg:w-[35%] xl:w-[30%] lg:sticky lg:top-0 shrink-0",
                              activeTab === 'chat' && "hidden lg:flex",`;
const r3 = `"flex flex-col items-center md:w-[40%] lg:w-[35%] xl:w-[30%] md:sticky md:top-0 shrink-0",
                              activeTab === 'chat' && "hidden md:flex",`;
code = code.replace(t3, r3);

fs.writeFileSync('src/App.tsx', code);
