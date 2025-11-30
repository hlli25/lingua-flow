import { Agent, AgentResponse, ConversationContext, UserProfile } from "../types";
import { generateText } from "../llm";

export class ScenarioAgent implements Agent {
    async process(input: string, context: ConversationContext, profile: UserProfile): Promise<AgentResponse> {
        const prompt = `
      Generate a roleplay scenario for a language learner.
      Target Language: ${profile.targetLanguage}
      Proficiency: ${profile.proficiencyLevel}
      Interests: ${profile.interests.join(", ")}
      
      Create a scenario that is realistic and practical (e.g., ordering food, asking directions, checking into a hotel, meeting a friend).
      
      Output format:
      SCENARIO_NATIVE: [Description in ${profile.nativeLanguage}]
      SCENARIO_TARGET: [Description in ${profile.targetLanguage}]
      OPENING_LINE: [First line of dialogue in ${profile.targetLanguage}]
    `;

        const response = await generateText(prompt);
        return { content: response };
    }
}
