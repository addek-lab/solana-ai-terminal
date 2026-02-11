import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
    }

    try {
        const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${query}`, {
            headers: {
                "User-Agent": "SolanaAITerminal/1.0",
            },
        });

        if (!res.ok) {
            throw new Error(`DexScreener API error: ${res.statusText}`);
        }

        const data = await res.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error("Proxy Error:", error);
        return NextResponse.json({ error: "Failed to fetch token data" }, { status: 500 });
    }
}
