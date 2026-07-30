const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const toRemove = `// --- SERVER-SIDE REAL-TIME QUOTA TRACKING ENGINE ---
let dailyRequestCount = 18; // Default seed
let lastQuotaDayReset = new Date().getUTCDate();
const requestTimestamps: number[] = []; // Timestamps in ms for RPM calculation
const DAILY_CAPACITY_LIMIT = 1500; // Gemini Free tier standard daily quota
const RPM_LIMIT = 15; // Gemini Requests Per Minute standard limit
let quotaExhaustedUntilMs: number | null = null;

function updateQuotaDayIfNeeded() {
  const currentDay = new Date().getUTCDate();
  if (currentDay !== lastQuotaDayReset) {
    dailyRequestCount = 0;
    lastQuotaDayReset = currentDay;
    quotaExhaustedUntilMs = null;
  }
}

function recordServerApiCall(isExhaustedError = false) {
  updateQuotaDayIfNeeded();
  const now = Date.now();
  requestTimestamps.push(now);
  dailyRequestCount++;

  // Clean old timestamps (> 60s)
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - 60000) {
    requestTimestamps.shift();
  }

  if (isExhaustedError) {
    // 60-second cooldown on 429
    quotaExhaustedUntilMs = now + 60000;
  }
}

registerApiCallRecorder(recordServerApiCall);`;

code = code.replace(toRemove, '');
code = code.replace(/,\s*registerApiCallRecorder/g, '');
code = code.replace(/registerApiCallRecorder,/g, '');

fs.writeFileSync('server.ts', code);
