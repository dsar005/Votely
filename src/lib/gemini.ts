import { GoogleGenerativeAI } from "@google/generative-ai";

export async function askGemini(
  question: string,
  context: {
    country?: string;
    region?: string;
    eligibility?: string;
  }
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Missing Gemini API Key");
    return "AI is not configured right now.";
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const prompt = `
You are Votely AI, a concise voting assistant.

Rules:
- Keep answers SHORT (2-4 sentences)
- Use bullet points if helpful
- Be clear and factual
- Do NOT give legal advice

User Context:
${context.country ? `Country: ${context.country}` : ""}
${context.region ? `Region: ${context.region}` : ""}
${context.eligibility ? `Eligibility: ${context.eligibility}` : ""}

User Question:
${question}
`;

  // 🔥 Try models in order (fallback system)
  const models = ["gemini-1.5-flash", "gemini-1.5-pro"];

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text && text.trim() !== "") {
        return text;
      }
    } catch (err) {
      console.warn(`Model ${modelName} failed, trying next...`);
    }
  }

  // 🧨 Final fallback (never break UI)
  return "Sorry, I couldn't fetch an answer right now. Please try again.";
}