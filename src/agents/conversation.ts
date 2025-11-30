import { Agent, AgentResponse, ConversationContext, UserProfile } from "../types";
import { generateText } from "../llm";

export class ConversationAgent implements Agent {
    async process(input: string, context: ConversationContext, profile: UserProfile): Promise<AgentResponse> {
        const prompt = `
      You are a conversation partner helping a user learn ${profile.targetLanguage}.
      The user's native language is ${profile.nativeLanguage}.
      Current proficiency level: ${profile.proficiencyLevel}.
      
      Your goal is to have a natural, engaging conversation.
      - Keep your responses appropriate for their proficiency level.
      - If they make a mistake, DO NOT correct them directly in the conversation flow (another agent will do that). Just respond naturally.
      - If they switch to their native language, gently guide them back to the target language or answer if they are asking for help.
      - Be friendly and encouraging.
      
      Current Scenario: ${context.currentScenario || "Free conversation"}
      
      Conversation History:
      ${context.messages.map(m => `${m.role}: ${m.content}`).join("\n")}
      
      User: ${input}
      Assistant:
    `;

        const response = await generateText(prompt);
        return { content: response };
    }
}
