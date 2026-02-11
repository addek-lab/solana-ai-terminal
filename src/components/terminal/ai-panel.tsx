"use client"

import { useState } from "react"
import html2canvas from "html2canvas"
import { BrainCircuit, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AIPanel() {
    const [loading, setLoading] = useState(false)
    const [analysis, setAnalysis] = useState<string | null>(null)

    const handleScan = async () => {
        setLoading(true)
        setAnalysis(null)

        try {
            const chartElement = document.getElementById("trading-chart")
            if (!chartElement) {
                setAnalysis("Error: Chart not found")
                setLoading(false)
                return
            }

            const canvas = await html2canvas(chartElement)
            const imageBase64 = canvas.toDataURL("image/png")

            const res = await fetch("/api/analyze", {
                method: "POST",
                body: JSON.stringify({ image: imageBase64, symbol: "SOL/USDC" }),
            })

            const data = await res.json()
            setAnalysis(data.analysis || data.error)
        } catch (e) {
            setAnalysis("Failed to connect to AI Engine.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-card rounded-xl border border-blue-500/20 shadow-lg shadow-blue-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
                {loading ? (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                ) : (
                    <BrainCircuit className="w-5 h-5 text-blue-500" />
                )}
                <h2 className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Gemini 3 Analysis
                </h2>
            </div>

            <div className="bg-background/50 rounded-lg p-4 min-h-[200px] text-sm text-foreground/80 font-mono leading-relaxed border border-border whitespace-pre-wrap">
                {analysis ? analysis : "Waiting for chart snapshot..."}
            </div>

            <Button
                onClick={handleScan}
                disabled={loading}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
            >
                {loading ? "Analyzing..." : "Scan Chart & Analyze"}
            </Button>
        </div>
    )
}
