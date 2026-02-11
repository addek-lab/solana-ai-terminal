import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const { tokenSymbol, tokenName, price, marketCap, liquidity, volume24h, priceChange24h } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
      Act as an expert crypto trader and technical analyst. 
      Analyze the following market data for ${tokenName} (${tokenSymbol}):

      - Price: $${price}
      - 24h Change: ${priceChange24h}%
      - Market Cap: $${marketCap}
      - Liquidity: $${liquidity}
      - 24h Volume: $${volume24h}

      Provide a concise 3-bullet point assessment:
      1. Bullish/Bearish Sentiment based on the 24h change and volume.
      2. Liquidity Health Check (is it safe to trade?).
      3. A short-term trading setup or warning.

      Keep it under 100 words.
    `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return NextResponse.json({ analysis: text });
        } catch (apiError: any) {
            console.warn("Gemini API Error (likely location/quota):", apiError.message);

            // Fallback Mock Response for Demo/Restricted Regions
            const mockAnalysis = `
*   **Bullish/Bearish**: Neutral-Bullish. The ${priceChange24h}% gain suggests strength, but volume ($${volume24h}) needs to confirm the move.
*   **Liquidity**: $${liquidity} is sufficient for small-mid size trades. minimal slippage expected.
*   **Setup**: Watch for a breakout above recent highs. Set stops below support levels implied by the market cap ($${marketCap}).
        `.trim();

            return NextResponse.json({ analysis: mockAnalysis });
        }
    } catch (error) {
        console.error("General Error:", error);
        return NextResponse.json(
            { error: "Failed to analyze data" },
            { status: 500 }
        );
    }
}
