import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.toString();

    try {
        const response = await fetch(`https://quote-api.jup.ag/v6/quote?${query}`);
        const data = await response.json();

        return NextResponse.json(data, {
            status: response.status,
            statusText: response.statusText
        });
    } catch (error) {
        console.error("Proxy Quote Error:", error);
        return NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 });
    }
}
