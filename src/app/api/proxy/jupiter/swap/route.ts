import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const response = await fetch("https://quote-api.jup.ag/v6/swap", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status,
            statusText: response.statusText
        });
    } catch (error) {
        console.error("Proxy Swap Error:", error);
        return NextResponse.json({ error: "Failed to create swap transaction" }, { status: 500 });
    }
}
