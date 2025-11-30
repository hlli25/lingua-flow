from .base import Agent

class ConversationAgent(Agent):
    def process(self, input_text, context, profile):
        prompt = f"""
        You are a helpful language learning partner.
        Target Language: {profile['targetLanguage']}
        User Proficiency: {profile['proficiencyLevel']}
        Current Scenario: {context.get('scenario', 'General Conversation')}
        
        Your goal is to engage the user in natural dialogue suitable for their level.
        Do not correct their grammar (another agent does that).
        Keep your responses concise (1-2 sentences).
        
        User said: "{input_text}"
        
        Reply in {profile['targetLanguage']}:
        """
        return self.generate_text(prompt)
