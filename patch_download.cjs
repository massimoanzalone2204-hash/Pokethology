const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Insert the download function
const fn = `  const handleDownloadPokedex = () => {
    sounds.scan();
    const data = JSON.stringify(filteredList, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`pokedex_records_\${viewAllGenerations ? 'all' : 'gen_' + currentGenId}.json\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
`;

code = code.replace(/const handleThemeToggle = \(\) => {/, fn + "\n  const handleThemeToggle = () => {");

// Add the button
const btn = `
<button
  type="button"
  onClick={handleDownloadPokedex}
  className={cn(
    "whitespace-nowrap px-1.5 py-0.5 text-[5px] sm:text-[6px] font-bold tracking-wider uppercase tracking-[0.1em] transition-all duration-300 relative rounded-md border font-black shrink-0",
    isLightMode
      ? "text-slate-600 border-slate-300 hover:text-slate-800 hover:bg-slate-200"
      : "text-emerald-500 border-emerald-900/30 hover:text-emerald-300 hover:bg-emerald-900/20 hover:border-emerald-500/50"
  )}
  title="Download Records"
>
  <Download className="w-1.5 h-1.5 inline-block mr-0.5" />
  EXPORT JSON
</button>
`;

code = code.replace(/<div className="flex items-center justify-end gap-2 px-1">/, '<div className="flex items-center justify-end gap-2 px-1">' + btn);

// Ensure Download icon is imported
if (!code.includes('Download')) {
  code = code.replace(/import {([^}]+)} from "lucide-react";/, 'import { Download,$1} from "lucide-react";');
}

fs.writeFileSync('src/App.tsx', code, 'utf8');
