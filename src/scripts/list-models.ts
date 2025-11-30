import dotenv from "dotenv";
dotenv.config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("No API Key found in .env");
        return;
    }

    console.log("Fetching models...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.models) {
            console.log("\nAvailable Models:");
            data.models.forEach((m: any) => {
                console.log(`- ${m.name.replace('models/', '')} (${m.displayName})`);
            });
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Error fetching models:", error);
    }
}

listModels();
