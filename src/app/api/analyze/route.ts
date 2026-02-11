import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const schema = {
    description: "Meme Coin Technical Analysis Trading Plan",
    type: SchemaType.OBJECT,
    properties: {
        verdict: {
            type: SchemaType.STRING,
            format: "enum",
            description: "Overall trading verdict",
            enum: ["BUY", "WAIT", "SELL", "DEGEN PLAY"]
        },
        confidence: {
            type: SchemaType.NUMBER,
            description: "Confidence score 0-100",
        },
        riskLevel: {
            type: SchemaType.STRING,
            format: "enum",
            description: "Risk assessment",
            enum: ["LOW", "MEDIUM", "HIGH", "EXTREME"]
        },
        action: {
            type: SchemaType.STRING,
            description: "Short concise action phrase (e.g. 'Accumulate Dips' or 'Wait for Breakout')"
        },
        entry: {
            type: SchemaType.STRING,
            description: "Recommended entry price zone"
        },
        stopLoss: {
            type: SchemaType.STRING,
            description: "Stop loss price level"
        },
        takeProfit: {
            type: SchemaType.ARRAY,
            description: "Three take profit targets",
            items: { type: SchemaType.STRING }
        },
        reasoning: {
            type: SchemaType.ARRAY,
            description: "Key technical reasons for the verdict",
            items: { type: SchemaType.STRING }
        }
    },
    required: ["verdict", "confidence", "riskLevel", "action", "entry", "stopLoss", "takeProfit", "reasoning"]
} as const;

export async function POST(req: NextRequest) {
    try {
        const { tokenSymbol, tokenName, price, marketCap, liquidity, volume24h, priceChange24h } = await req.json();

        // Use flash for speed and cost effectiveness
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });

        const prompt = `
      Act as a legendary Crypto Degen and Technical Analyst specializing in Solana Meme Coins. 
      Analyze the following marker data for ${tokenName} (${tokenSymbol}):

      - Price: $${price}
      - 24h Change: ${priceChange24h}%
      - Market Cap: $${marketCap}
      - Liquidity: $${liquidity}
      - 24h Volume: $${volume24h}

      **Strategy Guidelines:**
      1. **Momentum**: If 24h Change > 20% and Volume > Liquidity, it's a momentum play.
      2. **Safety**: If Liquidity < $10k, it's EXTREME risk.
      3. **RSI/Overbought**: If price trend implies parabolic move, look for pullbacks.
      4. **Targets**: Set realistic meme coin targets (2x, 5x, 10x potential or standard fib levels).

      Provide a structured JSON trading plan as requested by the schema.
    `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Validate that we got a valid JSON string
            try {
                JSON.parse(text); // Just to check validity
                return NextResponse.json(JSON.parse(text));
            } catch (e) {
                console.error("Invalid JSON from AI:", text);
                throw new Error("AI returned invalid JSON");
            }

        } catch (apiError: any) {
            console.warn("Gemini API Error:", apiError.message);

            // Fallback Mock Response
            const mockResponse = {
                verdict: "WAIT",
                confidence: 50,
                riskLevel: "MEDIUM",
                action: "Wait for Volume Confirmation",
                entry: "N/A",
                stopLoss: "N/A",
                takeProfit: ["N/A"],
                reasoning: ["API Quota Exceeded or Error", "Using Mock Data"]
            };

            return NextResponse.json(mockResponse);
        }
    } catch (error) {
        console.error("General Error:", error);
        return NextResponse.json(
            { error: "Failed to analyze data" },
            { status: 500 }
        );
    }
}
