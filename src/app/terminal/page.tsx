"use client"

import { useState } from "react"
import { ChartView } from "@/components/terminal/chart-view"
import { AIPanel } from "@/components/terminal/ai-panel"
import { TokenSearch } from "@/components/terminal/token-search"

export default function TerminalPage() {
    const [selectedToken, setSelectedToken] = useState<any>({
        symbol: "SOL/USDC",
        name: "Solana",
        address: "So11111111111111111111111111111111111111112",
        pairAddress: "58flLDgdXBRuP8SpkyfiXUJaKV1HMts2a7Id2n9E5d8" // SOL/USDC Pair
    })

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[calc(100vh-100px)]">
            {/* Chart Area */}
            <div className="md:col-span-2 bg-card rounded-xl border border-border p-4 shadow-sm relative flex flex-col h-[80vh]">
                <div className="mb-4">
                    <TokenSearch onSelect={setSelectedToken} />
                </div>
                <div className="flex-1 bg-background/50 rounded-lg overflow-hidden border border-border">
                    <ChartView pairAddress={selectedToken.pairAddress} />
                </div>
            </div>

            {/* Sidebar / Analysis */}
            <div className="md:col-span-1 space-y-6">

                {/* AI Analysis Panel */}
                <AIPanel />

                {/* Looking for more features? */}
                <div className="bg-card rounded-xl border border-border p-6 text-center">
                    <h3 className="text-muted-foreground text-sm">Pro Features Coming Soon</h3>
                    <p className="text-xs text-muted-foreground/60 mt-2">
                        Sniper Bot • Auto-Trade • Copy Trading
                    </p>
                </div>

            </div>
        </div>
    )
}
