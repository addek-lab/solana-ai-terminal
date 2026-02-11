"use client"

import { useState } from "react"
import { Brain, Loader2, Sparkles } from "lucide-react"

export function AIPanel({ tokenData }: { tokenData?: any }) {
    const [analyzing, setAnalyzing] = useState(false)
    const [analysis, setAnalysis] = useState<string | null>(null)

    const handleAnalyze = async () => {
        if (!tokenData) return
        setAnalyzing(true)
        setAnalysis(null)

        try {
            // Send structured data instead of image
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tokenSymbol: tokenData.symbol,
                    tokenName: tokenData.name,
                    price: tokenData.priceUsd,
                    marketCap: tokenData.marketCap,
                    liquidity: tokenData.liquidity,
                    volume24h: tokenData.volume24h,
                    priceChange24h: tokenData.priceChange24h
                }),
            })

            if (!res.ok) throw new Error("Analysis failed")

            const data = await res.json()
            setAnalysis(data.analysis)
        } catch (error) {
            console.error(error)
            setAnalysis("Failed to generate analysis. Please try again.")
        } finally {
            setAnalyzing(false)
        }
    }

    return (
        <div className="bg-card rounded-xl border border-border p-4 flex flex-col h-[400px]">
            <div className="flex flex-col items-center justify-center mb-4 w-full">
                {!analysis && (
                    <button
                        onClick={handleAnalyze}
                        disabled={analyzing}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg font-bold rounded-xl shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 w-full md:w-auto min-w-[300px]"
                    >
                        {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        {analyzing ? "AI Analyst Thinking..." : "Analyze Chart & Metrics"}
                    </button>
                )}
                {analysis && (
                    <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        <h2 className="font-semibold text-lg">AI Trade Setup</h2>
                    </div>
                )}
            </div>

            <div className="flex-1 bg-secondary/30 rounded-lg p-4 overflow-y-auto text-sm leading-relaxed border border-border/50">
                {analysis ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                        <p className="whitespace-pre-wrap">{analysis}</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center opacity-60">
                        <Sparkles className="w-8 h-8 mb-2" />
                        <p>Click "Analyze Market" to get an instant AI evaluation of {tokenData?.symbol || "the token"}.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
