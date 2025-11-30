from .base import Agent

class GrammarAgent(Agent):
    def process(self, input_text, context, profile):
        prompt = f"""
        You are a strict grammar coach.
        Target Language: {profile['targetLanguage']}
        Native Language: {profile['nativeLanguage']}
        
        Analyze the user's message for grammatical errors or unnatural phrasing.
        If the message is perfect, reply with "No corrections needed! 🎉".
        If there are errors, explain them clearly in the user's NATIVE LANGUAGE ({profile['nativeLanguage']}).
        
        User message: "{input_text}"
        
        Output (in {profile['nativeLanguage']}):
        """
        return self.generate_text(prompt)
