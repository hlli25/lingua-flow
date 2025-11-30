from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='public')
CORS(app)

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Warning: GEMINI_API_KEY not found in .env")
else:
    genai.configure(api_key=api_key)

# In-memory storage (replacing SessionService for now)
sessions = {}
profiles = {
    "user_123": {
        "id": "user_123",
        "nativeLanguage": "yue",
        "targetLanguage": "en",
        "proficiencyLevel": "intermediate",
        "interests": ["travel", "food"]
    }
}

@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('public', path)

@app.route('/api/profile', methods=['GET', 'POST'])
def handle_profile():
    user_id = "user_123" # Simulated auth
    if request.method == 'POST':
        data = request.json
        profiles[user_id].update(data)
        return jsonify(profiles[user_id])
    return jsonify(profiles[user_id])

from agents.conversation import ConversationAgent
from agents.grammar import GrammarAgent
from agents.culture import CulturalAgent
from agents.scenario import ScenarioAgent
import re

# Initialize Agents
conversation_agent = ConversationAgent()
grammar_agent = GrammarAgent()
cultural_agent = CulturalAgent()
scenario_agent = ScenarioAgent()

# ... existing code ...

@app.route('/api/chat', methods=['POST'])
def chat():
    user_id = "user_123"
    data = request.json
    message = data.get('message')
    
    if not message:
        return jsonify({"error": "Message is required"}), 400

    profile = profiles[user_id]
    context = sessions.get(user_id, {})
    
    # Run agents (Sequential for simplicity in Flask, could be threaded)
    reply = conversation_agent.process(message, context, profile)
    grammar = grammar_agent.process(message, context, profile)
    cultural = cultural_agent.process(message, context, profile)
    
    return jsonify({
        "reply": reply,
        "grammar": grammar,
        "cultural": cultural
    })

@app.route('/api/scenario', methods=['POST'])
def generate_scenario():
    user_id = "user_123"
    profile = profiles[user_id]
    context = sessions.get(user_id, {})
    
    response = scenario_agent.process("", context, profile)
    
    # Parse response (Regex for Python)
    scenario_native_match = re.search(r'SCENARIO_NATIVE:(.*?)(?=SCENARIO_TARGET:|OPENING_LINE:|$)', response, re.DOTALL)
    scenario_target_match = re.search(r'SCENARIO_TARGET:(.*?)(?=OPENING_LINE:|$)', response, re.DOTALL)
    opening_line_match = re.search(r'OPENING_LINE:(.*?)$', response, re.DOTALL)

    scenario_native = scenario_native_match.group(1).strip() if scenario_native_match else "Scenario generation failed (Native)"
    scenario_target = scenario_target_match.group(1).strip() if scenario_target_match else "Scenario generation failed (Target)"
    opening_line = opening_line_match.group(1).strip() if opening_line_match else ""
    
    # Update context
    sessions[user_id] = {"scenario": f"{scenario_native}\n{scenario_target}"}

    return jsonify({
        "scenarioNative": scenario_native,
        "scenarioTarget": scenario_target,
        "openingLine": opening_line
    })

if __name__ == '__main__':
    app.run(port=3000, debug=True)
