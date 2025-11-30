import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// In a real app, we'd use the API key from env. 
// For this capstone demo in the agent environment, we might need to mock or ask user for key.
// I'll set it up to read from process.env.GEMINI_API_KEY

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateText(prompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("No API Key provided. Returning mock response.");
        return "Mock response: API Key missing.";
    }

    // Debug log (masked)
    console.log(`Using API Key: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);

    try {
        // Use gemini-2.0-flash as it is available and faster
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error("Error generating text:", error.message || error);
        if (error.status === 403) {
            return "Error: API Key invalid or quota exceeded.";
        }
        return `Error generating response: ${error.message}`;
    }
}
