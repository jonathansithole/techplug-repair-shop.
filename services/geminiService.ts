import { GoogleGenAI } from "@google/genai";

// Initialize the API client
// Note: In a real environment, ensure process.env.API_KEY is set.
// For this demo, if the key is missing, we will simulate a response or handle the error gracefully in the UI.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTicketAnalysis = async (ticketDescription: string, ticketType: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "AI Analysis Unavailable: No API Key provided.";
  }

  try {
    const prompt = `
      You are a senior IT technician at TechPlug.
      Analyze the following customer service request.
      
      Service Type: ${ticketType}
      Description: "${ticketDescription}"
      
      Please provide:
      1. Likely technical cause.
      2. Recommended immediate steps or tools needed for the repair.
      3. A polite short response draft to the customer acknowledging the issue.
      
      Keep the output concise and structured.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No analysis could be generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating analysis. Please try again later.";
  }
};
