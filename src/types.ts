export type Language = 'en' | 'zh-TW' | 'ja' | 'fr' | 'de' | 'yue'; // Added 'yue' for Cantonese

export interface UserProfile {
    id: string;
    nativeLanguage: Language;
    targetLanguage: Language;
    proficiencyLevel: 'beginner' | 'intermediate' | 'advanced';
    interests: string[];
}

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}

export interface ConversationContext {
    messages: Message[];
    currentScenario?: string;
}

export interface AgentResponse {
    content: string;
    metadata?: any;
}

export interface Agent {
    process(input: string, context: ConversationContext, profile: UserProfile): Promise<AgentResponse>;
}
