"use client"

import { TrendingUp, TrendingDown, Zap, AlertTriangle, Target, Brain, Shield } from "lucide-react"

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

export function AIAnalysisDisplay({ analysis }: { analysis: AnalysisData | null }) {
    if (!analysis) return null

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

                <div className="flex flex-col items-end">
                    <span className="text-sm text-muted-foreground uppercase font-bold">Confidence Setup</span>
                    <div className="flex items-center gap-1">
                        <span className="text-4xl font-black">{analysis.confidence}%</span>
                    </div>
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
