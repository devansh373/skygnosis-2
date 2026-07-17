import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are a Customer Support Triage AI. 
Analyze the following customer support ticket message.
You must output a JSON object with exactly three fields:
1. priority: Must be one of "Low", "Medium", or "High".
2. category: A short category name (e.g., "Billing", "Technical", "Sales", "Other").
3. suggested_reply: A brief, professional suggested response to the customer.

Output ONLY valid JSON without any markdown formatting.`;

export async function triageTicketMessage(message: string) {
  const fallback = {
    priority: "Medium",
    category: "Other",
    suggested_reply: null,
    ai_success: false
  };

  try {
    const aiPromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      }
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('AI Request Timeout')), 5000);
    });

    const response = await Promise.race([aiPromise, timeoutPromise]) as any;
    
    // Parse the JSON output
    const rawText = response.text;
    const parsed = JSON.parse(rawText);

    return {
      priority: parsed.priority || "Medium",
      category: parsed.category || "Other",
      suggested_reply: parsed.suggested_reply || null,
      ai_success: true
    };
  } catch (error: any) {
    console.error("Gemini AI Triage Failed:", error.message);
    return fallback;
  }
}
