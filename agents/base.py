import google.generativeai as genai
from abc import ABC, abstractmethod

class Agent(ABC):
    def __init__(self, model_name="gemini-2.0-flash"):
        self.model = genai.GenerativeModel(model_name)

    @abstractmethod
    def process(self, input_text, context, profile):
        pass

    def generate_text(self, prompt):
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error generating text: {e}")
            return "Error generating response."
