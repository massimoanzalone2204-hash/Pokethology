const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'src/App.tsx',
  'src/components/EvolutionNodeComponent.tsx',
  'src/components/FloatingText.tsx',
  'src/components/BattleMessage.tsx',
  'src/components/Tutorial.tsx',
  'src/lib/utils.ts'
];

const bumpMap = {
  '5': '8',
  '6': '9',
  '7': '10',
  '8': '11',
  '9': '12',
  '10': '13',
  '11': '14',
  '12': '15',
  '13': '16',
  '14': '18',
};

filesToProcess.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/text-\[([0-9]+)px\]/g, (match, p1) => {
    if (bumpMap[p1]) {
      return `text-[${bumpMap[p1]}px]`;
    }
    return match;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed ${file}`);
});
