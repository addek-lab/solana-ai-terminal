import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const mint = searchParams.get("mint");

    if (!mint) {
        return NextResponse.json({ error: "Missing mint parameter" }, { status: 400 });
    }

    try {
        const res = await fetch(`https://api.rugcheck.xyz/v1/tokens/${mint}/report`, {
            headers: {
                "User-Agent": "SolanaAITerminal/1.0",
            },
        });

        if (res.status === 404) {
            return NextResponse.json({ error: "Report not found (New Token?)" }, { status: 404 });
        }

        if (!res.ok) {
            throw new Error(`RugCheck API error: ${res.statusText}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("RugCheck Proxy Error:", error);
        return NextResponse.json({ error: "Failed to fetch rug check data" }, { status: 500 });
    }
}
