"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Zap, AlertTriangle, Target, Brain, Shield, Plus, Check } from "lucide-react"
import { usePortfolio } from "@/hooks/use-portfolio"

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

export function AIAnalysisDisplay({ analysis, tokenData }: { analysis: AnalysisData | null, tokenData?: any }) {
    const { addToken, hasToken } = usePortfolio()
    const [added, setAdded] = useState(false)

    if (!analysis) return null

    const isSaved = tokenData ? hasToken(tokenData.address) : false

    const handleSave = () => {
        if (!tokenData) return

        addToken({
            address: tokenData.address,
            symbol: tokenData.symbol,
            name: tokenData.name,
            priceUsd: Number(tokenData.priceUsd),
            priceChange24h: Number(tokenData.priceChange24h),
            holdings: 0,
            avgEntryPrice: 0,
            imageUrl: tokenData.imageUrl,
            lastAnalyzed: new Date().toISOString(),
            aiVerdict: analysis.verdict
        })
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 shadow-xl">
            {/* Header: Verdict & Confidence */}
            <div className={`p-6 flex items-center justify-between border-b border-border ${analysis.verdict === "BUY" || analysis.verdict === "DEGEN PLAY" ? "bg-green-500/10" :
                analysis.verdict === "SELL" ? "bg-red-500/10" : "bg-yellow-500/10"
                }`}>
                <div className="flex items-center gap-6">
                    <div className={`px-6 py-2 rounded-full text-lg font-black tracking-wider uppercase flex items-center gap-3 ${analysis.verdict === "BUY" || analysis.verdict === "DEGEN PLAY" ? "bg-green-500 text-white shadow-lg shadow-green-500/20" :
                        analysis.verdict === "SELL" ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                        }`}>
                        {analysis.verdict === "BUY" ? <TrendingUp className="w-6 h-6" /> :
                            analysis.verdict === "SELL" ? <TrendingDown className="w-6 h-6" /> :
                                analysis.verdict === "DEGEN PLAY" ? <Zap className="w-6 h-6" /> :
                                    <AlertTriangle className="w-6 h-6" />}
                        {analysis.verdict}
                    </div>
                    <div className="text-xl font-medium opacity-80">
                        {analysis.action}
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end">
                        <span className="text-sm text-muted-foreground uppercase font-bold">Confidence Setup</span>
                        <div className="flex items-center gap-1">
                            <span className="text-4xl font-black">{analysis.confidence}%</span>
                        </div>
                    </div>

                    {tokenData && (
                        <button
                            onClick={handleSave}
                            disabled={isSaved || added}
                            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${isSaved || added
                                    ? "bg-secondary text-muted-foreground cursor-default"
                                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                                }`}
                        >
                            {isSaved || added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            {isSaved ? "Saved" : added ? "Added" : "Add to Portfolio"}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: Trade Setup */}
                <div className="p-8 border-r border-border space-y-8">
                    <h4 className="font-bold flex items-center gap-3 text-lg uppercase tracking-wider">
                        <Target className="w-6 h-6 text-primary" /> Trade Setup
                    </h4>

                    <div className="space-y-6">
                        <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
                            <div className="text-sm text-muted-foreground mb-2">Entry Zone</div>
                            <div className="font-mono font-black text-2xl text-blue-400">{analysis.entry}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                                <div className="text-sm text-red-400 mb-2">Stop Loss</div>
                                <div className="font-mono font-bold text-xl text-red-500">{analysis.stopLoss}</div>
                            </div>
                            <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                                <div className="text-sm text-green-400 mb-2">Take Profit</div>
                                <div className="font-mono font-bold text-xl text-green-500">{analysis.takeProfit[0]}</div>
                            </div>
                        </div>

                        {analysis.takeProfit.length > 1 && (
                            <div className="flex gap-4 text-sm font-mono pt-2">
                                <span className="text-muted-foreground">TP Targets:</span>
                                {analysis.takeProfit.map((tp, i) => (
                                    <span key={i} className="text-green-400/90 font-bold border-b border-green-500/20">{tp}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Reasoning & Risk */}
                <div className="p-8 flex flex-col justify-between">
                    <div className="space-y-6">
                        <h4 className="font-bold flex items-center gap-3 text-lg uppercase tracking-wider">
                            <Brain className="w-6 h-6 text-primary" /> Analysis Logic
                        </h4>
                        <ul className="space-y-4">
                            {analysis.reasoning.map((point, i) => (
                                <li key={i} className="text-base flex gap-3 items-start text-muted-foreground leading-relaxed">
                                    <span className="mt-2 w-2 h-2 rounded-full bg-primary shrink-0" />
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-8 pt-8 border-t border-border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-muted-foreground" />
                                <span className="text-base font-medium text-muted-foreground">Risk Level</span>
                            </div>
                            <span className={`px-4 py-1.5 rounded-lg text-sm font-black uppercase border ${analysis.riskLevel === "LOW" ? "bg-green-500/10 text-green-500 border-green-500/20" :
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
    )
}
