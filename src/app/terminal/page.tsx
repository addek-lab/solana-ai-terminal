"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChartView } from "@/components/terminal/chart-view"
import { AIPanel } from "@/components/terminal/ai-panel"
import { TokenSearch } from "@/components/terminal/token-search"
import { TokenMetrics } from "@/components/terminal/token-metrics"

export default function TerminalPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const tokenAddressParam = searchParams.get("token")

    const [selectedToken, setSelectedToken] = useState<any>({
        symbol: "SOL/USDC",
        name: "Solana",
        address: "So11111111111111111111111111111111111111112",
        pairAddress: "58flLDgdXBRuP8SpkyfiXUJaKV1HMts2a7Id2n9E5d8",
        priceUsd: "0",
        marketCap: 0,
        volume24h: 0,
        liquidity: 0,
        fdv: 0,
        priceChange24h: 0
    })

    // 1. Sync on Load / URL Change
    useEffect(() => {
        if (tokenAddressParam && tokenAddressParam !== selectedToken.address) {
            fetch(`/api/proxy/dex?q=${tokenAddressParam}`)
                .then(res => res.json())
                .then(data => {
                    if (data.pairs && data.pairs.length > 0) {
                        const pair = data.pairs[0]
                        setSelectedToken({
                            address: pair.baseToken.address,
                            symbol: pair.baseToken.symbol,
                            name: pair.baseToken.name,
                            priceUsd: pair.priceUsd,
                            pairAddress: pair.pairAddress,
                            imageUrl: pair.info?.imageUrl,
                            marketCap: pair.marketCap || pair.fdv || 0,
                            volume24h: pair.volume?.h24 || 0,
                            liquidity: pair.liquidity?.usd || 0,
                            fdv: pair.fdv || 0,
                            priceChange24h: pair.priceChange?.h24 || 0
                        })
                    }
                })
        }
    }, [tokenAddressParam])

    // 2. Handle Search Select
    const handleTokenSelect = (token: any) => {
        setSelectedToken(token)
        router.push(`/terminal?token=${token.address}`)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[calc(100vh-100px)]">
            {/* Chart Area */}
            <div className="md:col-span-2 bg-card rounded-xl border border-border p-4 shadow-sm relative flex flex-col h-[80vh]">
                <div className="mb-4">
                    <TokenSearch onSelect={handleTokenSelect} />
                </div>
                <div className="flex-1 bg-background/50 rounded-lg overflow-hidden border border-border">
                    <ChartView pairAddress={selectedToken.pairAddress} />
                </div>
            </div>

            {/* Sidebar / Analysis */}
            <div className="md:col-span-1 space-y-6">

                {/* AI Analysis Panel - Now passing Data */}
                <AIPanel tokenData={selectedToken} />

                {/* Metrics Component */}
                <TokenMetrics tokenData={selectedToken} />

            </div>
        </div>
    )
}
