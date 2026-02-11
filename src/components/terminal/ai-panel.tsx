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
