import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const getGeminiModel = (modelName: string = "gemini-3.1-pro-preview") => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  const ai = new GoogleGenAI({ apiKey });
  return ai;
};

export const generateText = async (prompt: string, systemInstruction?: string) => {
  const ai = getGeminiModel("gemini-3.1-pro-preview");
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      systemInstruction,
    },
  });
  return response.text;
};

export const analyzeImage = async (prompt: string, base64Image: string, mimeType: string) => {
  const ai = getGeminiModel("gemini-3.1-pro-preview");
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Image,
              mimeType,
            },
          },
        ],
      },
    ],
  });
  return response.text;
};

export const generateSpeech = async (text: string, voice: string = "Kore") => {
  const ai = getGeminiModel("gemini-2.5-flash-preview-tts");
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};
