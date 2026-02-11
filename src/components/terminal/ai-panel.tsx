"use client"

import { Brain, Loader2, AlertTriangle } from "lucide-react"

interface AIPanelProps {
    tokenData: any
    onAnalyze: () => void
    isAnalyzing: boolean
    error: string | null
}

export function AIPanel({ tokenData, onAnalyze, isAnalyzing, error }: AIPanelProps) {
    if (!tokenData) return null

    return (
        <div className="w-full">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center mb-4 animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-red-400 mb-3">{error}</p>
                    <button
                        onClick={onAnalyze}
                        className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {!isAnalyzing && !error && (
                <button
                    onClick={onAnalyze}
                    className="w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                    <Brain className="w-5 h-5" />
                    Analyze Chart
                </button>
            )}

            {isAnalyzing && (
                <div className="w-full h-14 bg-card border border-border rounded-xl flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="font-medium text-muted-foreground animate-pulse">Analyzing...</span>
                </div>
            )}
        </div>
    )
}

{
    analysis && (
        <div className="bg-card rounded-xl border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header: Verdict & Confidence */}
            <div className={`p-4 flex items-center justify-between border-b border-border ${analysis.verdict === "BUY" || analysis.verdict === "DEGEN PLAY" ? "bg-green-500/10" :
                analysis.verdict === "SELL" ? "bg-red-500/10" : "bg-yellow-500/10"
                }`}>
                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 ${analysis.verdict === "BUY" || analysis.verdict === "DEGEN PLAY" ? "bg-green-500 text-white shadow-lg shadow-green-500/20" :
                        analysis.verdict === "SELL" ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                        }`}>
                        {analysis.verdict === "BUY" ? <TrendingUp className="w-3 h-3" /> :
                            analysis.verdict === "SELL" ? <TrendingDown className="w-3 h-3" /> :
                                analysis.verdict === "DEGEN PLAY" ? <Zap className="w-3 h-3" /> :
                                    <AlertTriangle className="w-3 h-3" />}
                        {analysis.verdict}
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Confidence</span>
                    <span className="text-xl font-black">{analysis.confidence}%</span>
                </div>
            </div>

            <div className="flex flex-col">
                {/* Trade Setup */}
                <div className="p-4 border-b border-border space-y-4">
                    <h4 className="font-bold flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
                        <Target className="w-3 h-3" /> Trade Setup
                    </h4>

                    <div className="space-y-3">
                        <div className="p-2.5 bg-secondary/30 rounded-lg border border-border/50 flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Entry</span>
                            <span className="font-mono font-bold text-blue-400 text-sm">{analysis.entry}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-2.5 bg-red-500/5 rounded-lg border border-red-500/10">
                                <div className="text-[10px] text-red-400 mb-0.5">Stop Loss</div>
                                <div className="font-mono font-bold text-red-500 text-sm">{analysis.stopLoss}</div>
                            </div>
                            <div className="p-2.5 bg-green-500/5 rounded-lg border border-green-500/10">
                                <div className="text-[10px] text-green-400 mb-0.5">Take Profit</div>
                                <div className="font-mono font-bold text-green-500 text-sm">{analysis.takeProfit[0]}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reasoning */}
                <div className="p-4 space-y-3">
                    <h4 className="font-bold flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
                        <Brain className="w-3 h-3" /> Analysis
                    </h4>
                    <ul className="space-y-2">
                        {analysis.reasoning.slice(0, 3).map((point, i) => (
                            <li key={i} className="text-xs flex gap-2 items-start text-muted-foreground leading-relaxed">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Risk Level Footer */}
                <div className="px-4 py-3 bg-secondary/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Risk Level</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${analysis.riskLevel === "LOW" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                        analysis.riskLevel === "MEDIUM" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                            "bg-red-500/10 text-red-500 border-red-500/20"
                        }`}>
                        {analysis.riskLevel}
                    </span>
                </div>
            </div>
        </div>
    )
}
        </div >
    )
}
