"use server"

import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Define the schema types explicitly for typescript
interface AnalysisResult {
    verdict: "BUY" | "WAIT" | "SELL" | "DEGEN PLAY";
    confidence: number;
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
    action: string;
    entry: string;
    stopLoss: string;
    takeProfit: string[];
    reasoning: string[];
    // New numerical fields for visualization
    priceTarget: number; // Primary TP
    supportLevel: number;
    resistanceLevel: number;
    stopLossLevel: number;
    error?: string;
}

export async function analyzeTokenAction(tokenData: any, options?: { deepThinking?: boolean }): Promise<AnalysisResult> {
    console.log("Server Action: Starting Analysis for", tokenData?.symbol, "Deep Thinking:", options?.deepThinking);

    if (!process.env.GEMINI_API_KEY) {
        console.error("Server Action: Missing GEMINI_API_KEY");
        // ... (keep existing error handling) ...
        throw new Error("Missing API Key");
    }

    if (!tokenData) {
        throw new Error("No token data provided");
    }

    const schema: Schema = {
        description: "Meme Coin Technical Analysis Trading Plan",
        type: SchemaType.OBJECT,
        properties: {
            verdict: {
                type: SchemaType.STRING,
                format: "enum",
                enum: ["BUY", "WAIT", "SELL", "DEGEN PLAY"]
            },
            confidence: { type: SchemaType.NUMBER },
            riskLevel: {
                type: SchemaType.STRING,
                format: "enum",
                enum: ["LOW", "MEDIUM", "HIGH", "EXTREME"]
            },
            action: { type: SchemaType.STRING },
            entry: { type: SchemaType.STRING },
            stopLoss: { type: SchemaType.STRING },
            takeProfit: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING }
            },
            reasoning: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING }
            },
            // Numerical fields
            priceTarget: { type: SchemaType.NUMBER, description: "Primary Take Profit price in USD" },
            supportLevel: { type: SchemaType.NUMBER, description: "Nearest Support price in USD" },
            resistanceLevel: { type: SchemaType.NUMBER, description: "Nearest Resistance price in USD" },
            stopLossLevel: { type: SchemaType.NUMBER, description: "Stop Loss price in USD" }
        },
        required: ["verdict", "confidence", "riskLevel", "action", "entry", "stopLoss", "takeProfit", "reasoning", "priceTarget", "supportLevel", "resistanceLevel", "stopLossLevel"]
    };

    // Construct Prompt - Add "Deep Thinking" context if enabled
    let promptInstruction = `
    You are a legendary crypto degen trader and technical analyst with a track record of 100x calls. 
    Analyze this Solana meme coin based on the following real-time data:
    `;

    if (options?.deepThinking) {
        promptInstruction = `
        You are a world-class Quantitative Analyst and Crypto Trader. 
        Perform a DEEP DIVE analysis on this Solana meme coin, considering market psychology, liquidity structure, and volume patterns.
        Thinking Process:
        1. Analyze Liquidity/MCap ratio.
        2. Evaluate Volume trend vs Price trend (Divergence?).
        3. Assess Risk/Reward ratio for entry.
        Analyze based on:
        `;
    }

    const modelName = options?.deepThinking
        ? "gemini-2.0-flash-thinking-exp-01-21"
        : "gemini-2.5-flash";

    const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema
        }
    });

    const prompt = `
    ${promptInstruction}

    Token: ${tokenData.name} (${tokenData.symbol})
    Price: $${tokenData.price}
    Market Cap: $${tokenData.marketCap}
    Liquidity: $${tokenData.liquidity}
    24h Volume: $${tokenData.volume24h}
    24h Change: ${tokenData.priceChange24h}%

    Provide a professional, sharp, and no-nonsense trading plan.
    - BE CRITICAL. If the token looks like garbage, say it.
    - Use crypto native language (support/resistance, liq grabs, volume divergence, jeets, diamond hands).
    - If liquidity is < $100k or Volume < $10k, flag as EXTREME RISK immediately.
    - **CRITICAL: Provide specific USD numerical values for priceTarget, supportLevel, resistanceLevel, and stopLossLevel.** These will be used to draw a chart.
    - For text fields (entry, stopLoss, takeProfit), you can still use Market Cap if preferred, but the *Level* fields must be USD numbers.
    - Your goal is to maximize profit and protect capital. 
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log("Server Action: AI Response received");

        try {
            const json = JSON.parse(text);
            return json as AnalysisResult;
        } catch (e) {
            console.error("Server Action: Failed to parse JSON", text);
            throw new Error("AI returned invalid JSON");
        }
    } catch (error: any) {
        console.error("Server Action: AI Generation Failed", error);
        // Fallback or Error return using the interface
        return {
            verdict: "WAIT",
            confidence: 0,
            riskLevel: "HIGH",
            action: "Analysis Failed",
            entry: "N/A",
            stopLoss: "N/A",
            takeProfit: [],
            reasoning: ["AI Service unavailable or timed out.", "Please try again later."],
            priceTarget: 0,
            supportLevel: 0,
            resistanceLevel: 0,
            stopLossLevel: 0,
            error: error.message || "Failed to generate analysis."
        };
    }
}
