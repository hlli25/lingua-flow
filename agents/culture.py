from .base import Agent

class CulturalAgent(Agent):
    def process(self, input_text, context, profile):
        prompt = f"""
        You are a cultural advisor.
        Target Language: {profile['targetLanguage']}
        Native Language: {profile['nativeLanguage']}
        Context: {context.get('scenario', 'General Conversation')}
        
        Analyze the user's message for any cultural nuances, etiquette tips, or interesting facts relevant to the target culture.
        If there is nothing specific to note, reply with "No specific cultural notes.".
        Provide your advice in the user's NATIVE LANGUAGE ({profile['nativeLanguage']}).
        
        User message: "{input_text}"
        
        Output (in {profile['nativeLanguage']}):
        """
        return self.generate_text(prompt)
