import { ConversationContext, Message, UserProfile } from "../types";

export class SessionService {
    private sessions: Map<string, ConversationContext> = new Map();
    private profiles: Map<string, UserProfile> = new Map();

    constructor() {
        // Mock initial profile
        this.profiles.set("user_123", {
            id: "user_123",
            nativeLanguage: "yue", // Default to Cantonese as requested
            targetLanguage: "en",
            proficiencyLevel: "intermediate",
            interests: ["travel", "food", "technology"]
        });
    }

    getSession(userId: string): ConversationContext {
        if (!this.sessions.has(userId)) {
            this.sessions.set(userId, { messages: [] });
        }
        return this.sessions.get(userId)!;
    }

    updateSession(userId: string, message: Message) {
        const session = this.getSession(userId);
        session.messages.push(message);
        // Keep only last 20 messages for context window
        if (session.messages.length > 20) {
            session.messages = session.messages.slice(-20);
        }
    }

    getProfile(userId: string): UserProfile {
        return this.profiles.get(userId)!;
    }

    updateProfile(userId: string, profile: Partial<UserProfile>) {
        const current = this.getProfile(userId);
        this.profiles.set(userId, { ...current, ...profile });
    }

    setScenario(userId: string, scenario: string) {
        const session = this.getSession(userId);
        session.currentScenario = scenario;
    }
}
