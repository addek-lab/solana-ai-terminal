
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("Error: GEMINI_API_KEY is missing.");
    process.exit(1);
}

async function listModels() {
    console.log("Fetching available models from Google API...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
        }
        const data = await response.json();

        if (data.models) {
            console.log("✅ Available Models:");
            data.models.forEach(model => {
                const isGemini = model.name.includes("gemini");
                const supportsGeneration = model.supportedGenerationMethods.includes("generateContent");
                if (isGemini && supportsGeneration) {
                    console.log(`- ${model.name.replace('models/', '')} (${model.displayName})`);
                }
            });
        } else {
            console.log("No models found in response.");
        }

    } catch (error) {
        console.error("Failed to list models:", error.message);
    }
}

listModels();
