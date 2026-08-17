const fs = require('fs');

let file = fs.readFileSync('src/App.tsx', 'utf-8');

// Step 1: add the hook import at the top
if (!file.includes("useTranslation")) {
  file = file.replace("import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';\nimport { useTranslation } from 'react-i18next';");
}

// Ensure the hook is inside the App component
if (!file.includes("const { t } = useTranslation();")) {
  file = file.replace("export default function App() {\n", "export default function App() {\n  const { t } = useTranslation();\n");
}

const stringsToTranslate = [
  "Pokéthology",
  "Combat",
  "Stats",
  "LORE ACCURACY",
  "DAILY HUB",
  "Weight",
  "Height",
  "Abilities",
  "Type Weaknesses",
  "Pokédex Entry",
  "LIVE ANALYSIS",
  "Type",
  "Type Chart",
  "Settings",
  "STABILITY_LINK",
  "Pokéthology Certification Exam",
  "Rank Attained",
  "Analysis Mode",
  "Alternative Forms",
  "Mega Evolutions",
  "Gigantamax Forms",
  "SYSTEM SOURCE SCAN",
  "Source Chronology:",
  "PASSIVE TRAITS",
  "Hidden",
  "No abilities detected",
  "No major weaknesses detected",
  "EVOLUTIONARY PATH",
  "TACTICAL DATABASE",
  "Quota Limit",
  "RETRY",
  "COMBAT OPT",
  "VS",
  "Chaos Mode Setup",
  "Preparing Random Battle",
  "FINISH",
  "ARENA RECORDS",
  "Select 4 Moves",
  "POWER:",
  "ACCURACY:",
  "PP:",
  "Combat Soundtrack",
  "Active BGM Theme",
  "OS",
  "SHOW ALL",
  "Type Analysis",
  "LIVE",
  "CORE COGNITION",
  "DAILY SCANS",
  "THEOLOGICAL EXAM",
  "Combat Matrix",
  "Super Effective (2x)",
  "Not Very Effective (0.5x)",
  "No Effect (0x)",
  "Learning:",
  "Select a move to forget:",
  "Data Entry",
  "Performance Metrics",
  "Power",
  "Accuracy",
  "Effect Chance",
  "Modifier Effects",
  "Additional Data",
  "AILMENT:",
  "PRIORITY:",
  "TARGET:",
  "HEIGHT",
  "WEIGHT",
  "PRIMARY ABILITIES",
  "TACTICAL BASE STAT INDEX",
  "MAX DEPTH",
  "HEALTH POINTS (HP)",
  "PHYSICAL ATTACK",
  "PHYSICAL DEFENSE",
  "SPECIAL ATTACK",
  "SPECIAL DEFENSE",
  "KINETIC SPEED",
  "SYSTEM CONFIGURATION",
  "BGM Volume",
  "SFX Volume",
  "BGM Audio Pack",
  "Dynamic Web Audio Synthesizer",
  "Theme",
  "Animations",
  "System Language",
  "Changes require full system reboot",
  "REGISTRY UTILITIES",
  "Tutorial",
  "How to Battle",
  "The Battle Screen",
  "Core System Specifications & Modalities",
  "Gen Registry grids",
  "Symmetric Matchup Previews",
  "Lossless Cry Audio Board",
  "Server-side Gemini AI Coach",
  "Offline Diagnostics Center",
  "SOCKET PIPELINE",
  "COGNITION ENGINE",
  "SERVER MEMORY",
  "SOCKET CONNECTIONS",
  "INTELLIGENT DIAGNOSTIC LOG",
  "Version 1.0.0",
  "Powered by PokeAPI",
  "Combat Options",
  "AI Quota Exhausted"
];

for (const text of stringsToTranslate) {
  // Try replacing instances like >Text< with >{t("Text")}<
  file = file.split(">" + text + "<").join(">{t(\"" + text + "\")}<");
  // Some might be padded with spaces > Text <
  file = file.split("> " + text + " <").join("> {t(\"" + text + "\")} <");
  // Try >Text 
  // For buttons or mixed items, we'll just handle the safest exact matches.
}

fs.writeFileSync('src/App.tsx', file);
console.log("App script modified.");
