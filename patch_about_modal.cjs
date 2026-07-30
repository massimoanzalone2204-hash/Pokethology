const fs = require('fs');
let code = fs.readFileSync('src/components/AboutModal.tsx', 'utf8');

// Remove states
code = code.replace(/const \[activeTab, setActiveTab\] = useState\<'info' \| 'bug'\>\('info'\);/g, '');
code = code.replace(/const \[bugCategory, setBugCategory\] = useState\<string\>\('UI & Visuals'\);/g, '');
code = code.replace(/const \[bugSubject, setBugSubject\] = useState\(''\);/g, '');
code = code.replace(/const \[bugDescription, setBugDescription\] = useState\(''\);/g, '');
code = code.replace(/const \[reportSubmitted, setReportSubmitted\] = useState\(false\);/g, '');

// Remove handleSubmitBug
code = code.replace(/const handleSubmitBug = \(e: React\.FormEvent\) => \{[\s\S]*?\}, 2200\);\s*\};/g, '');

// Remove tabs
code = code.replace(/\{\/\* Navigation Tabs \*\/\}[\s\S]*?\{\/\* Tab Contents \*\/\}/, '{/* Tab Contents */}');

// Remove conditional render
code = code.replace(/\{activeTab === 'info' \? \(/g, '(');
code = code.replace(/\) : \([\s\S]*?\{\/\* END OF BUG TAB \*\/\}\s*\)/g, ')'); // We might need to just find where bug tab ends.

fs.writeFileSync('src/components/AboutModal.tsx', code);
