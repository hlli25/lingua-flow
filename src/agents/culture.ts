import { Agent, AgentResponse, ConversationContext, UserProfile } from "../types";
import { generateText } from "../llm";

export class CulturalAgent implements Agent {
    async process(input: string, context: ConversationContext, profile: UserProfile): Promise<AgentResponse> {
        const prompt = `
      You are a Cultural Advisor.
      Target Language: ${profile.targetLanguage}
      Native Language: ${profile.nativeLanguage}
      
      Analyze the conversation context and the user's input.
      Is there a relevant cultural insight, etiquette tip, or interesting fact that would help the learner?
      
      Examples:
      - If they are greeting someone, mention bowing etiquette in Japan.
      - If they are ordering food, mention tipping customs in the US vs Europe.
      
      User's input: "${input}"
      Context: ${context.currentScenario || "General conversation"}
      
      If there is NOTHING important to add, return "NO_COMMENT".
      If there is a tip:
      1. Explain it in ${profile.nativeLanguage}.
      2. Keep it brief and interesting.
      
      Response format:
      [Cultural Tip in ${profile.nativeLanguage}]
    `;

        const response = await generateText(prompt);

        if (response.includes("NO_COMMENT")) {
            return { content: "" };
        }

        return { content: response };
    }
}
