import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ConversationAgent } from "./agents/conversation";
import { GrammarAgent } from "./agents/grammar";
import { CulturalAgent } from "./agents/culture";
import { ScenarioAgent } from "./agents/scenario";
import { SessionService } from "./memory/session";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const sessionService = new SessionService();
const conversationAgent = new ConversationAgent();
const grammarAgent = new GrammarAgent();
const culturalAgent = new CulturalAgent();
const scenarioAgent = new ScenarioAgent();

// Middleware to simulate user ID (for demo purposes)
const getUserId = (req: any) => "user_123";

app.post("/api/chat", async (req, res) => {
    const userId = getUserId(req);
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    const profile = sessionService.getProfile(userId);
    const session = sessionService.getSession(userId);

    // 1. Add user message to history
    sessionService.updateSession(userId, {
        role: "user",
        content: message,
        timestamp: Date.now()
    });

    try {
        // 2. Run agents in parallel
        const [conversationResponse, grammarResponse, culturalResponse] = await Promise.all([
            conversationAgent.process(message, session, profile),
            grammarAgent.process(message, session, profile),
            culturalAgent.process(message, session, profile)
        ]);

        // 3. Add assistant response to history
        sessionService.updateSession(userId, {
            role: "assistant",
            content: conversationResponse.content,
            timestamp: Date.now()
        });

        // 4. Return combined response
        res.json({
            reply: conversationResponse.content,
            grammar: grammarResponse.content,
            cultural: culturalResponse.content
        });
    } catch (error) {
        console.error("Error processing chat:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/scenario", async (req, res) => {
    const userId = getUserId(req);
    const profile = sessionService.getProfile(userId);
    const session = sessionService.getSession(userId);

    try {
        const response = await scenarioAgent.process("", session, profile);
        const content = response.content;
        console.log("Raw Scenario Agent Output:", content);

        // Regex without 's' flag for ES2016 compatibility
        const scenarioNativeMatch = content.match(/SCENARIO_NATIVE:([\s\S]*?)(?=SCENARIO_TARGET:|OPENING_LINE:|$)/);
        const scenarioTargetMatch = content.match(/SCENARIO_TARGET:([\s\S]*?)(?=OPENING_LINE:|$)/);
        const openingLineMatch = content.match(/OPENING_LINE:([\s\S]*?)$/);

        const scenarioNative = scenarioNativeMatch ? scenarioNativeMatch[1].trim() : "Scenario generation failed (Native)";
        const scenarioTarget = scenarioTargetMatch ? scenarioTargetMatch[1].trim() : "Scenario generation failed (Target)";
        const openingLine = openingLineMatch ? openingLineMatch[1].trim() : "";

        // Store the full context
        sessionService.setScenario(userId, `${scenarioNative}\n${scenarioTarget}`);

        res.json({
            scenarioNative,
            scenarioTarget,
            openingLine
        });
    } catch (error) {
        console.error("Error generating scenario:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/profile", (req, res) => {
    const userId = getUserId(req);
    res.json(sessionService.getProfile(userId));
});

app.post("/api/profile", (req, res) => {
    const userId = getUserId(req);
    sessionService.updateProfile(userId, req.body);
    res.json(sessionService.getProfile(userId));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
