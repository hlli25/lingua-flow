import { Agent, AgentResponse, ConversationContext, UserProfile } from "../types";
import { generateText } from "../llm";

export class GrammarAgent implements Agent {
    async process(input: string, context: ConversationContext, profile: UserProfile): Promise<AgentResponse> {
        const prompt = `
      You are a helpful Grammar Coach.
      Target Language: ${profile.targetLanguage}
      Native Language: ${profile.nativeLanguage}
      
      Analyze the USER'S last message for grammatical errors, unnatural phrasing, or vocabulary issues.
      
      User's message: "${input}"
      
      If the message is perfect, return "OK".
      If there are errors or better ways to say it:
      1. Explain the error in ${profile.nativeLanguage}.
      2. Provide the corrected version in ${profile.targetLanguage}.
      3. Keep the explanation concise and encouraging.
      
      Response format:
      [Explanation in ${profile.nativeLanguage}]
      [Correction in ${profile.targetLanguage}]
    `;

        const response = await generateText(prompt);

        if (response.trim() === "OK") {
            return { content: "" };
        }

        return { content: response };
    }
}
