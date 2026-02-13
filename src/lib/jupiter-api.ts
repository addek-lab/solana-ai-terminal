import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";

const JUPITER_QUOTE_API = "https://quote-api.jup.ag/v6/quote";
const JUPITER_SWAP_API = "https://quote-api.jup.ag/v6/swap";

export async function getQuote(
    inputMint: string,
    outputMint: string,
    amount: number, // in lamports/smallest unit
    slippageBps: number = 50 // 0.5%
) {
    try {
        const url = `${JUPITER_QUOTE_API}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Jupiter Quote Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Jupiter Quote Error:", error);
        throw error;
    }
}

export async function getSwapTransaction(
    quoteResponse: any,
    userPublicKey: string
) {
    try {
        const response = await fetch(JUPITER_SWAP_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                quoteResponse,
                userPublicKey,
                wrapAndUnwrapSol: true,
            }),
        });

        if (!response.ok) {
            throw new Error(`Jupiter Swap Transaction Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.swapTransaction;
    } catch (error) {
        console.error("Jupiter Swap Transaction Error:", error);
        throw error;
    }
}
