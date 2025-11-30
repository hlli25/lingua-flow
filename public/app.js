const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const newScenarioBtn = document.getElementById('new-scenario-btn');
const saveSettingsBtn = document.getElementById('save-settings');

// Initial load
loadProfile();

function appendMessage(role, content) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.textContent = content;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    userInput.value = '';

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await res.json();

        appendMessage('assistant', data.reply);

        if (data.grammar) {
            document.getElementById('grammar-feedback').innerText = data.grammar;
        } else {
            document.getElementById('grammar-feedback').innerText = "No corrections needed! 🎉";
        }

        if (data.cultural) {
            document.getElementById('culture-feedback').innerText = data.cultural;
        } else {
            document.getElementById('culture-feedback').innerText = "No specific cultural notes.";
        }

    } catch (err) {
        console.error(err);
        appendMessage('system', 'Error sending message.');
    }
}

async function generateScenario() {
    document.getElementById('scenario-content').innerText = "Generating scenario...";
    try {
        const res = await fetch('/api/scenario', { method: 'POST' });
        const data = await res.json();

        // Display both languages
        const contentDiv = document.getElementById('scenario-content');
        contentDiv.innerHTML = `
            <div style="margin-bottom: 0.5rem; font-size: 0.9em; color: #555;">${data.scenarioNative}</div>
            <div style="font-weight: 500; color: #2c3e50;">${data.scenarioTarget}</div>
        `;

        if (data.openingLine) {
            appendMessage('assistant', data.openingLine);
        }
    } catch (err) {
        console.error(err);
        document.getElementById('scenario-content').innerText = "Error generating scenario.";
    }
}

async function loadProfile() {
    try {
        const res = await fetch('/api/profile');
        const profile = await res.json();

        document.getElementById('native-lang').value = profile.nativeLanguage;
        document.getElementById('target-lang').value = profile.targetLanguage;
    } catch (err) {
        console.error(err);
    }
}

async function updateProfile() {
    const nativeLanguage = document.getElementById('native-lang').value;
    const targetLanguage = document.getElementById('target-lang').value;

    try {
        await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nativeLanguage, targetLanguage })
        });
        alert('Settings saved!');
    } catch (err) {
        console.error(err);
    }
}

const micBtn = document.getElementById('mic-btn');

// ... existing code ...

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US'; // Default, will update based on target language
    recognition.interimResults = false;

    recognition.onstart = () => {
        micBtn.textContent = '🔴'; // Visual indicator
        userInput.placeholder = "Listening...";
    };

    recognition.onend = () => {
        micBtn.textContent = '🎤';
        userInput.placeholder = "Type your message...";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        // Optional: Auto-send
        // sendMessage();
    };

    // Update recognition language when target language changes
    document.getElementById('target-lang').addEventListener('change', (e) => {
        recognition.lang = e.target.value;
    });

    micBtn.addEventListener('click', () => {
        // Update lang before starting
        recognition.lang = document.getElementById('target-lang').value;
        recognition.start();
    });
} else {
    // micBtn.style.display = 'none'; // Don't hide it
    console.log("Web Speech API not supported in this browser.");

    micBtn.addEventListener('click', () => {
        alert("Sorry, speech recognition is not supported in this browser. Try using Chrome, Edge, or Safari.");
    });
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
newScenarioBtn.addEventListener('click', generateScenario);
saveSettingsBtn.addEventListener('click', updateProfile);

