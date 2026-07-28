const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `{/* Collapsible Arena Records & Medals panel toggler */}
                                        <div className="border border-slate-800/85 bg-slate-950/45 rounded-xl overflow-hidden mb-4 shrink-0 transition-all z-10 relative">`;
const replacement = `{/* Collapsible Arena Records & Medals panel toggler */}
                                        {!isBattling && (
                                        <div className="border border-slate-800/85 bg-slate-950/45 rounded-xl overflow-hidden mb-4 shrink-0 transition-all z-10 relative">`;
code = code.replace(target, replacement);

const targetEnd = `                                          )}
                                        </div>
                                      </div> {/* End of Right Column */}`;
const replacementEnd = `                                          )}
                                        </div>
                                        )}
                                      </div> {/* End of Right Column */}`;
code = code.replace(targetEnd, replacementEnd);
fs.writeFileSync('src/App.tsx', code, 'utf8');
