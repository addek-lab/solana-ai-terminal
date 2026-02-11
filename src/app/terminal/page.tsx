"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChartView } from "@/components/terminal/chart-view"
import { AIPanel } from "@/components/terminal/ai-panel"
import { TokenSearch } from "@/components/terminal/token-search"
import { TokenMetrics } from "@/components/terminal/token-metrics"
import { Loader2 } from "lucide-react"

function TerminalContent() {
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
        <div className="flex flex-col h-full min-h-[calc(100vh-100px)] gap-6 p-4">
            {/* Header: Search Bar */}
            <div className="w-full max-w-4xl mx-auto">
                <TokenSearch onSelect={handleTokenSelect} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[70vh]">

                {/* Left: Chart (Larger 3/4) */}
                <div className="lg:col-span-3 bg-card rounded-xl border border-border p-1 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex-1 bg-background/50 rounded-lg overflow-hidden">
                        <ChartView pairAddress={selectedToken.pairAddress} />
                    </div>
                </div>

                {/* Right: Metrics (Smaller 1/4) */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <TokenMetrics tokenData={selectedToken} />
                </div>
            </div>

            {/* Bottom: AI Analysis (Centered) */}
            <div className="w-full max-w-4xl mx-auto">
                <AIPanel tokenData={selectedToken} />
            </div>
        </div>
    )
}

export default function TerminalPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        }>
            <TerminalContent />
        </Suspense>
    )
}
