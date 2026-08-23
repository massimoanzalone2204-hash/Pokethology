import fs from 'fs';
let content = fs.readFileSync('src/components/PokethologyMissionModal.tsx', 'utf-8');

// The file currently ends with some broken tags after "All standard Pokémon completed!".
// We'll split the file using that text and append the correct ending.

const parts = content.split('All standard Pokémon completed!</span>\n                      )}');
if (parts.length === 2) {
  content = parts[0] + 'All standard Pokémon completed!</span>\n                      )}\n                    </div>\n                  </div>\n                </div>\n\n              </div>\n            </div>\n          </motion.div>\n        </motion.div>\n      )}\n    </AnimatePresence>\n  );\n};';
  fs.writeFileSync('src/components/PokethologyMissionModal.tsx', content);
  console.log("Fixed!");
} else {
  console.log("Could not find the split point.");
}

