import { GoogleGenerativeAI } from "@google/generative-ai";

// Load API key from environment
const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
if (!API_KEY) throw new Error("Missing VITE_GOOGLE_AI_API_KEY in .env");

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(API_KEY);

// Use the highest-quality model available
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// Generation configuration
const generationConfig = {
  temperature: 0.8,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1024,
  responseMimeType: "text/plain",
};

// Export unified AI client
export const AIClient = {
  /**
   * Send a prompt and return a plain text response
   */
  async generate(prompt) {
    if (!prompt || prompt.trim() === "") {
      throw new Error("Prompt cannot be empty");
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    return result;
  },
};
