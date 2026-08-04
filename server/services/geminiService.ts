import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const DEFAULT_MODEL = "gemini-1.5-flash";
const LITE_MODEL = "gemini-1.5-flash-lite";

const getApiKey = () => process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

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

export function isQuotaError(error: any) {
  if (!error) return false;
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
    if (apiCallRecorder) {
      apiCallRecorder(false);
    }
    try {
      return await getAiClient().models.generateContent(params);
    } catch (error: any) {
      const isQuota = isQuotaError(error);
      if (isQuota && apiCallRecorder) {
        apiCallRecorder(true);
      }
      
      // Attempt LITE model if quota/rate limit error hit on primary model
      if (isQuota && params.model && params.model !== LITE_MODEL) {
        try {
          if (apiCallRecorder) apiCallRecorder(false);
          return await getAiClient().models.generateContent({
            ...params,
            model: LITE_MODEL
          });
        } catch (liteErr) {
          // Fall through to throw quota error
        }
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
  
      if (isQuota) {
        throw new Error("Gemini API Rate Limit / Quota Exceeded (429)");
      }

      throw error;
    }
}
