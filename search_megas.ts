import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getMegaEvolutions() {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: "What are the new Mega Evolutions in Pokemon Legends: Z-A? List their names and provide any known public 3D model URLs (GLB or similar) or high-quality animated sprite URLs (like from Pokemon Showdown or similar).",
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  console.log(response.text);
}

getMegaEvolutions();
