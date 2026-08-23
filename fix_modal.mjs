import fs from 'fs';
let content = fs.readFileSync('src/components/PokethologyMissionModal.tsx', 'utf-8');

// The problematic end is:
// </div></div>              </div>            </div>          </motion.div>        </motion.div>      )}    </AnimatePresence>  );};
// I'll just find that block and replace it correctly.

content = content.replace(
  '</div></div>              </div>            </div>          </motion.div>        </motion.div>      )}    </AnimatePresence>  );};',
  '              </div>\n            </div>\n          </motion.div>\n        </motion.div>\n      )}\n    </AnimatePresence>\n  );\n};'
);

fs.writeFileSync('src/components/PokethologyMissionModal.tsx', content);
