from .base import Agent

class ScenarioAgent(Agent):
    def process(self, input_text, context, profile):
        prompt = f"""
        Generate a roleplay scenario for a language learner.
        Target Language: {profile['targetLanguage']}
        Proficiency: {profile['proficiencyLevel']}
        Interests: {', '.join(profile['interests'])}
        
        Create a scenario that is realistic and practical.
        
        Output format:
        SCENARIO_NATIVE: [Description in {profile['nativeLanguage']}]
        SCENARIO_TARGET: [Description in {profile['targetLanguage']}]
        OPENING_LINE: [First line of dialogue in {profile['targetLanguage']} spoken by the PARTNER. If the scenario implies the USER should speak first (e.g., approaching a stranger), leave this empty.]
        """
        return self.generate_text(prompt)
