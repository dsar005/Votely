import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

export async function askGemini(
  question: string,
  context: {
    country?: string;
    region?: string;
    eligibility?: string;
  }
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = `You are Votely AI, a helpful and concise voting assistant. 
You help users understand voting processes, eligibility, and election information.
Keep responses SHORT (2-4 sentences max). Use bullet points when listing items.
Be friendly but factual. If you're unsure, say so.
${context.country ? `User's country/region: ${context.country}${context.region ? `, ${context.region}` : ""}` : ""}
${context.eligibility ? `User's eligibility status: ${context.eligibility}` : ""}
Do NOT provide legal advice. Always recommend checking official government sources.`;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: question },
    ]);

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
}
