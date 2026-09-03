import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Ensure invalid GOOGLE_API_KEY placeholder doesn't break @google/genai internal key selection
if (process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY.includes(" ")) {
  delete process.env.GOOGLE_API_KEY;
}

const DEFAULT_MODEL = "gemini-3.1-flash-lite";
const LITE_MODEL = "gemini-3.1-flash-lite";

const getApiKey = () => {
  const key = process.env.GEMINI_API_KEY;
  if (key && key.trim().length > 10 && !key.includes(" ")) return key.trim();
  const altKey = process.env.GOOGLE_API_KEY;
  if (altKey && altKey.trim().length > 10 && !altKey.includes(" ")) return altKey.trim();
  return undefined;
};

function getAiClient() {
  const key = getApiKey();
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

let quotaCooldownUntilMs = 0;

export function isQuotaCooldownActive(): boolean {
  return Date.now() < quotaCooldownUntilMs;
}

export function setQuotaCooldown(durationMs = 60000) {
  quotaCooldownUntilMs = Date.now() + durationMs;
}

export function isQuotaError(error: any) {
  if (!error) return false;
  if (error.isQuota) return true;
  const errorBody = error.response?.body || error.error || {};
  const str = typeof error === 'string' ? error : (error.message || "") + " " + JSON.stringify(error);
  const lowercaseStr = str.toLowerCase();
  return (
    lowercaseStr.includes("429") || 
    lowercaseStr.includes("503") || 
    lowercaseStr.includes("quota") ||
    lowercaseStr.includes("resource_exhausted") ||
    lowercaseStr.includes("exhausted") ||
    lowercaseStr.includes("unavailable") ||
    lowercaseStr.includes("overloaded") ||
    lowercaseStr.includes("prepayment") ||
    lowercaseStr.includes("depleted") ||
    lowercaseStr.includes("credits are depleted") ||
    lowercaseStr.includes("billing#prepay") ||
    error.status === "RESOURCE_EXHAUSTED" || 
    error.status === "UNAVAILABLE" || 
    error.status === 429 || 
    error.status === 503 ||
    errorBody.code === 429 || 
    errorBody.code === 503 ||
    errorBody.status === "RESOURCE_EXHAUSTED" ||
    errorBody.status === "UNAVAILABLE"
  );
}

let apiCallRecorder: ((isQuotaError?: boolean) => void) | null = null;

export function registerApiCallRecorder(recorder: (isQuotaError?: boolean) => void) {
  apiCallRecorder = recorder;
}

export async function generateWithRetry(params: any, retries = 2, delay = 2000): Promise<any> {
    if (isQuotaCooldownActive()) {
      const err = new Error("Gemini API Rate Limit / Quota Exceeded (429)");
      (err as any).isQuota = true;
      throw err;
    }
    if (apiCallRecorder) {
      apiCallRecorder(false);
    }
    try {
      return await getAiClient().models.generateContent(params);
    } catch (error: any) {
      const isQuota = isQuotaError(error);
      if (isQuota) {
        setQuotaCooldown(60000);
        if (apiCallRecorder) {
          apiCallRecorder(true);
        }
        const quotaErr = new Error("Gemini API Rate Limit / Quota Exceeded (429)");
        (quotaErr as any).isQuota = true;
        (quotaErr as any).originalError = error;
        throw quotaErr;
      }

      if (!isQuota && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return generateWithRetry(params, retries - 1, delay * 2);
      }
  
      // Proactive recovery: strip grounding/tools if present
      if (params.config?.tools && params.config.tools.length > 0) {
        const strippedParams = {
          ...params,
          config: { ...params.config }
        };
        delete strippedParams.config.tools;
        try {
          return await getAiClient().models.generateContent(strippedParams);
        } catch (toolError: any) {
          // Keep moving down the pipeline
        }
      }
  
      throw error;
    }
}
