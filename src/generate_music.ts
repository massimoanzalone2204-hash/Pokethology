import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function generateTrack(prompt: string, filename: string) {
  const response = await ai.models.generateContentStream({
    model: "lyria-3-pro-preview",
    contents: prompt,
  });

  let audioBase64 = "";
  let mimeType = "audio/wav";

  for await (const chunk of response) {
    const parts = chunk.candidates?.[0]?.content?.parts;
    if (!parts) continue;
    for (const part of parts) {
      if (part.inlineData?.data) {
        if (!audioBase64 && part.inlineData.mimeType) {
          mimeType = part.inlineData.mimeType;
        }
        audioBase64 += part.inlineData.data;
      }
    }
  }

  const binary = Buffer.from(audioBase64, 'base64');
  fs.writeFileSync(filename, binary);
}

async function main() {
  await generateTrack("A 30-second intense, high-energy 8-bit chiptune battle theme for a Pokemon-style game.", "battle_theme.wav");
  await generateTrack("A 30-second dark, ominous, and epic 8-bit chiptune boss battle theme.", "boss_theme.wav");
  await generateTrack("A 30-second calm, adventurous 8-bit chiptune exploration theme.", "exploration_theme.wav");
}

main().catch(console.error);
