"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChartView } from "@/components/terminal/chart-view"
import { AIPanel } from "@/components/terminal/ai-panel"
import { TokenSearch } from "@/components/terminal/token-search"
import { TokenMetrics } from "@/components/terminal/token-metrics"
import { TokenHeader } from "@/components/terminal/token-header"
import { RugCheck } from "@/components/terminal/rug-check"
import { Loader2 } from "lucide-react"

function TerminalContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const tokenAddressParam = searchParams.get("token")

    const [selectedToken, setSelectedToken] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // 1. Sync on Load / URL Change
    useEffect(() => {
        if (!tokenAddressParam) {
            setSelectedToken(null)
            setError(null)
            return
        }

        // Only fetch if we don't have this token already checks
        if (tokenAddressParam && tokenAddressParam !== selectedToken?.address) {
            setLoading(true)
            setError(null)

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
                            websites: pair.info?.websites || [],
                            socials: pair.info?.socials || [],
                            marketCap: pair.marketCap || pair.fdv || 0,
                            volume24h: pair.volume?.h24 || 0,
                            liquidity: pair.liquidity?.usd || 0,
                            fdv: pair.fdv || 0,
                            priceChange24h: pair.priceChange?.h24 || 0
                        })
                    } else {
                        setError(`Token not found: ${tokenAddressParam}`)
                        setSelectedToken(null)
                    }
                })
                .catch(err => {
                    console.error("Token fetch error:", err)
                    setError("Failed to load token data. Please check connection.")
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [tokenAddressParam])

    // 2. Handle Search Select
    const handleTokenSelect = (token: any) => {
        setSelectedToken(token)
        router.push(`/terminal?token=${token.address}`)
    }

    // 3. Check if active token is selected (not default)
    const isTokenSelected = tokenAddressParam || (selectedToken?.address && selectedToken.address !== "So11111111111111111111111111111111111111112")

    // Show Error State
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] gap-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center max-w-md">
                    <h3 className="text-xl font-bold text-red-500 mb-2">Token Not Found</h3>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/terminal')}
                        className="px-6 py-2 bg-secondary hover:bg-secondary/80 rounded-lg font-medium transition-colors"
                    >
                        Back to Search
                    </button>
                </div>
            </div>
        )
    }

    // Show Loader if refreshing or initial load with param
    if (loading || (tokenAddressParam && !selectedToken)) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                <span className="ml-2 font-medium text-muted-foreground">Loading Token Data...</span>
            </div>
        )
    }

    if (!isTokenSelected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4 relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] -z-10 animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] -z-10 animate-pulse delay-1000" />

                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600 mb-4 text-center">
                    Solana AI Terminal
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto text-center mb-12">
                    Paste a token address to analyze chart, metrics, and safety instantly.
                </p>

                <div className="w-full max-w-2xl">
                    <TokenSearch onSelect={handleTokenSelect} variant="hero" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-100px)] gap-6 p-4">
            {/* Header Row: Just Search Bar (Full Width) */}
            <div className="w-full max-w-[1920px] mx-auto">
                <TokenSearch onSelect={handleTokenSelect} variant="compact" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-auto min-h-[70vh]">

                {/* Left: Chart (Larger 3/4) */}
                <div className="lg:col-span-3 bg-card rounded-xl border border-border p-1 shadow-sm overflow-hidden flex flex-col h-[600px] lg:h-auto">
                    <div className="flex-1 bg-background/50 rounded-lg overflow-hidden">
                        <ChartView pairAddress={selectedToken.pairAddress} />
                    </div>
                </div>

                {/* Right: Sidebar (Metrics, Identity, Risk) */}
                <div className="lg:col-span-1 flex flex-col gap-4 h-full overflow-y-auto">
                    {/* 1. Identity Header */}
                    <TokenHeader tokenData={selectedToken} />

                    {/* 2. Market Overview */}
                    <TokenMetrics tokenData={selectedToken} />

                    {/* 3. Risk Analysis */}
                    <RugCheck tokenData={selectedToken} />
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
