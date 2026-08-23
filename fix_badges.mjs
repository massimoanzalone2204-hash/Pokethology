import fs from 'fs';

// Fix Badge
let contentBadge = fs.readFileSync('src/components/PokethologyMissionBadge.tsx', 'utf-8');
contentBadge = contentBadge.replace(/title=\{\\\`Mission Wins: \\\$\\{wins\\}\\\`\}/g, "title={`Mission Wins: ${wins}`}");
contentBadge = contentBadge.replace(/style=\{\{ boxShadow: \\\`0 0 15px \\\$\\{glowColor\\}\\\` \}\}/g, "style={{ boxShadow: `0 0 15px ${glowColor}` }}");
fs.writeFileSync('src/components/PokethologyMissionBadge.tsx', contentBadge);

// Fix Modal
let contentModal = fs.readFileSync('src/components/PokethologyMissionModal.tsx', 'utf-8');
contentModal = contentModal.replace(/\\\$\\{Math/g, "${Math");
contentModal = contentModal.replace(/\\\`\\\$ /g, "`$ ");
contentModal = contentModal.replace(/width: \\\`/g, "width: `");
contentModal = contentModal.replace(/\}\\\`/g, "}`");
fs.writeFileSync('src/components/PokethologyMissionModal.tsx', contentModal);

