"use client"

import { useState, useEffect } from "react"
import { Brain, Loader2, Sparkles, TrendingUp, TrendingDown, AlertTriangle, Target, Shield, Zap } from "lucide-react"

interface AnalysisData {
    verdict: "BUY" | "WAIT" | "SELL" | "DEGEN PLAY"
    confidence: number
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "EXTREME"
    action: string
    entry: string
    stopLoss: string
    takeProfit: string[]
    reasoning: string[]
}

export function AIPanel({ tokenData }: { tokenData?: any }) {
    const [analyzing, setAnalyzing] = useState(false)
    const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Reset analysis when token changes
    useEffect(() => {
        setAnalysis(null)
        setAnalyzing(false)
        setError(null)
    }, [tokenData?.address])

    const handleAnalyze = async () => {
        if (!tokenData) return
        setAnalyzing(true)
        setAnalysis(null)
        setError(null)

        try {
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
            if (data.error) throw new Error(data.error)

            setAnalysis(data)
        } catch (error) {
            console.error(error)
            setError("Failed to generate analysis. Please try again.")
        } finally {
            setAnalyzing(false)
        }
    }

    if (!tokenData) return null

    return (
        <div className="w-full">
            {!analysis && !analyzing && (
                <div className="bg-card rounded-xl border border-border p-8 flex flex-col items-center justify-center h-[300px] text-center gap-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="p-4 bg-primary/10 rounded-full mb-2 group-hover:scale-110 transition-transform duration-500">
                        <Sparkles className="w-8 h-8 text-primary" />
                    </div>

                    <div className="max-w-md">
                        <h3 className="text-xl font-bold mb-2">AI Trading Assistant</h3>
                        <p className="text-muted-foreground mb-6">
                            Generate a meme-coin specific technical analysis using standard indicators (RSI, Fibs, Volume) and get a structured trade plan.
                        </p>
                        <button
                            onClick={handleAnalyze}
                            className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-lg hover:shadow-primary/25 transition-all active:scale-95 flex items-center gap-2 mx-auto"
                        >
                            <Brain className="w-4 h-4" />
                            Analyze {tokenData.symbol}
                        </button>
                    </div>
                </div>
            )}

            {analyzing && (
                <div className="bg-card rounded-xl border border-border h-[400px] flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <div className="text-center">
                        <h3 className="font-bold text-lg animate-pulse">Scanning Market Structure...</h3>
                        <p className="text-muted-foreground text-sm">Analyzing Volume, Liquidity, and Momentum</p>
                    </div>
                </div>
            )}

            {analysis && (
                <div className="bg-card rounded-xl border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header: Verdict & Confidence */}
                    <div className={`p-6 flex items-center justify-between border-b border-border ${analysis.verdict === "BUY" || analysis.verdict === "DEGEN PLAY" ? "bg-green-500/10" :
                            analysis.verdict === "SELL" ? "bg-red-500/10" : "bg-yellow-500/10"
                        }`}>
                        <div className="flex items-center gap-4">
                            <div className={`px-4 py-1.5 rounded-full text-sm font-black tracking-wider uppercase flex items-center gap-2 ${analysis.verdict === "BUY" || analysis.verdict === "DEGEN PLAY" ? "bg-green-500 text-white shadow-lg shadow-green-500/20" :
                                    analysis.verdict === "SELL" ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                                }`}>
                                {analysis.verdict === "BUY" ? <TrendingUp className="w-4 h-4" /> :
                                    analysis.verdict === "SELL" ? <TrendingDown className="w-4 h-4" /> :
                                        analysis.verdict === "DEGEN PLAY" ? <Zap className="w-4 h-4" /> :
                                            <AlertTriangle className="w-4 h-4" />}
                                {analysis.verdict}
                            </div>
                            <div className="text-sm font-medium opacity-80">
                                {analysis.action}
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <span className="text-xs text-muted-foreground uppercase font-bold">Confidence</span>
                            <div className="flex items-center gap-1">
                                <span className="text-2xl font-black">{analysis.confidence}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left: Trade Setup */}
                        <div className="p-6 border-r border-border space-y-6">
                            <h4 className="font-bold flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-wider">
                                <Target className="w-4 h-4" /> Trade Setup
                            </h4>

                            <div className="space-y-4">
                                <div className="p-3 bg-secondary/30 rounded-lg border border-border/50">
                                    <div className="text-xs text-muted-foreground mb-1">Entry Zone</div>
                                    <div className="font-mono font-bold text-blue-400">{analysis.entry}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                                        <div className="text-xs text-red-400 mb-1">Stop Loss</div>
                                        <div className="font-mono font-bold text-red-500">{analysis.stopLoss}</div>
                                    </div>
                                    <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/10">
                                        <div className="text-xs text-green-400 mb-1">Take Profit 1</div>
                                        <div className="font-mono font-bold text-green-500">{analysis.takeProfit[0]}</div>
                                    </div>
                                </div>

                                {analysis.takeProfit.length > 1 && (
                                    <div className="flex gap-2 text-xs font-mono">
                                        <span className="text-muted-foreground">Extensions:</span>
                                        {analysis.takeProfit.slice(1).map((tp, i) => (
                                            <span key={i} className="text-green-400/80">{tp}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Reasoning & Risk */}
                        <div className="p-6 flex flex-col justify-between">
                            <div className="space-y-4">
                                <h4 className="font-bold flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-wider">
                                    <Brain className="w-4 h-4" /> Analysis
                                </h4>
                                <ul className="space-y-2">
                                    {analysis.reasoning.map((point, i) => (
                                        <li key={i} className="text-sm flex gap-2 items-start text-muted-foreground">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-6 pt-6 border-t border-border">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium text-muted-foreground">Risk Level</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${analysis.riskLevel === "LOW" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                            analysis.riskLevel === "MEDIUM" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                                                "bg-red-500/10 text-red-500 border-red-500/20"
                                        }`}>
                                        {analysis.riskLevel}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
