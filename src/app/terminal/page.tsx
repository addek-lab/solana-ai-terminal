"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ChartView } from "@/components/terminal/chart-view"
import { AIPanel } from "@/components/terminal/ai-panel"
import { TokenSearch } from "@/components/terminal/token-search"
import { TokenMetrics } from "@/components/terminal/token-metrics"
import { TokenHeader } from "@/components/terminal/token-header"
import { RugCheck } from "@/components/terminal/rug-check"
import { Loader2, LayoutDashboard } from "lucide-react"

import { analyzeTokenAction } from "@/app/actions/analyze-token"
import { AIAnalysisDisplay } from "@/components/terminal/ai-analysis-display"
import { LandingInfo } from "@/components/terminal/landing-info"

function TerminalContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const tokenAddressParam = searchParams.get("token")

    const [selectedToken, setSelectedToken] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // AI Analysis State
    const [analysis, setAnalysis] = useState<any>(null)
    const [analyzing, setAnalyzing] = useState(false)
    const [analysisError, setAnalysisError] = useState<string | null>(null)

    // 1. Sync on Load / URL Change & Auto-Refresh
    useEffect(() => {
        if (!tokenAddressParam) {
            setSelectedToken(null)
            setError(null)
            setAnalysis(null)
            return
        }

        const fetchTokenData = async (isFirstLoad: boolean) => {
            if (isFirstLoad && tokenAddressParam !== selectedToken?.address) {
                setLoading(true)
                setError(null)
                setAnalysis(null)
            }

            try {
                const res = await fetch(`/api/proxy/dex?q=${tokenAddressParam}`)
                const data = await res.json()

                if (data.pairs && data.pairs.length > 0) {
                    const pair = data.pairs[0]
                    setSelectedToken((prev: any) => ({
                        ...prev, // Keep existing state to avoid flicker if needed
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
                    }))
                } else {
                    if (isFirstLoad) {
                        setError(`Token not found: ${tokenAddressParam}`)
                        setSelectedToken(null)
                    }
                }
            } catch (err) {
                console.error("Token fetch error:", err)
                if (isFirstLoad) {
                    setError("Failed to load token data. Please check connection.")
                }
            } finally {
                if (isFirstLoad) {
                    setLoading(false)
                }
            }
        }

        // Initial Load
        fetchTokenData(true)

        // Poll every 3 seconds
        const interval = setInterval(() => {
            fetchTokenData(false)
        }, 3000)

        return () => clearInterval(interval)
    }, [tokenAddressParam])

    // Handle AI Analysis Trigger
    const handleAnalyze = async () => {
        if (!selectedToken) return

        setAnalyzing(true)
        setAnalysis(null)
        setAnalysisError(null)

        try {
            const result = await analyzeTokenAction({
                symbol: selectedToken.symbol,
                name: selectedToken.name,
                price: selectedToken.priceUsd,
                marketCap: selectedToken.marketCap,
                liquidity: selectedToken.liquidity,
                volume24h: selectedToken.volume24h,
                priceChange24h: selectedToken.priceChange24h
            })

            if (result.error) {
                setAnalysisError(result.error)
            } else {
                setAnalysis(result)
            }
        } catch (e: any) {
            setAnalysisError(e.message || "Analysis failed")
        } finally {
            setAnalyzing(false)
        }
    }

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

                {/* Top Right Nav */}
                <div className="absolute top-4 right-4 z-50">
                    <Link href="/portfolio" className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors font-medium backdrop-blur-sm border border-border/50">
                        <LayoutDashboard className="w-4 h-4" />
                        Portfolio
                    </Link>
                </div>

                <div className="w-full max-w-2xl relative z-10">
                    <TokenSearch onSelect={handleTokenSelect} variant="hero" />
                </div>

                <LandingInfo />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-100px)] gap-6 p-4">
            {/* Header Row: Search + Portfolio */}
            <div className="w-full max-w-[1920px] mx-auto flex flex-col md:flex-row items-center gap-4">
                <div className="w-full md:flex-1">
                    <TokenSearch onSelect={handleTokenSelect} variant="compact" />
                </div>
                <Link href="/portfolio" className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-secondary rounded-lg transition-colors font-medium border border-border shadow-sm whitespace-nowrap">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden md:inline">My Portfolio</span>
                </Link>
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

                    {/* 4. AI Analysis Trigger */}
                    <AIPanel
                        tokenData={selectedToken}
                        onAnalyze={handleAnalyze}
                        isAnalyzing={analyzing}
                        error={analysisError}
                    />
                </div>
            </div>

            {/* Bottom Row: AI Analysis Results */}
            {analysis && (
                <div className="w-full max-w-[1920px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <AIAnalysisDisplay analysis={analysis} tokenData={selectedToken} />
                </div>
            )}
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
