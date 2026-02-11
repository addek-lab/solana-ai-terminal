"use server"

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

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
    error?: string;
}

export async function analyzeTokenAction(tokenData: any): Promise<AnalysisResult> {
    console.log("Server Action: Starting Analysis for", tokenData?.symbol);

    if (!process.env.GEMINI_API_KEY) {
        console.error("Server Action: Missing GEMINI_API_KEY");
        return {
            verdict: "WAIT",
            confidence: 0,
            riskLevel: "HIGH",
            action: "System Error",
            entry: "N/A",
            stopLoss: "N/A",
            takeProfit: [],
            reasoning: ["API Key missing on server."],
            error: "Server configuration error (Missing API Key)."
        };
    }

    if (!tokenData) {
        return {
            verdict: "WAIT",
            confidence: 0,
            riskLevel: "HIGH",
            action: "Error",
            entry: "N/A",
            stopLoss: "N/A",
            takeProfit: [],
            reasoning: ["No token data provided for analysis."],
            error: "No token data provided."
        };
    }

    const schema = {
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
            }
        },
        required: ["verdict", "confidence", "riskLevel", "action", "entry", "stopLoss", "takeProfit", "reasoning"]
    };

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema
        }
    });

    const prompt = `
    You are a legendary crypto degen trader and technical analyst. 
    Analyze this Solana meme coin based on the following real-time data:

    Token: ${tokenData.name} (${tokenData.symbol})
    Price: $${tokenData.price}
    Market Cap: $${tokenData.marketCap}
    Liquidity: $${tokenData.liquidity}
    24h Volume: $${tokenData.volume24h}
    24h Change: ${tokenData.priceChange24h}%

    Provide a structured trading plan. 
    Be direct, use crypto slang (degen, aping, jeets) where appropriate but keep the analysis sharp.
    If liquidity is < $10k or volume is very low, mark as HIGH/EXTREME RISK.
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
            error: error.message || "Failed to generate analysis."
        };
    }
}
