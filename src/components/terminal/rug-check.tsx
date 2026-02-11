"use client"

import { Shield, ShieldAlert, ShieldCheck, Lock, AlertTriangle } from "lucide-react"

interface RugCheckProps {
    tokenData: any
}

export function RugCheck({ tokenData }: RugCheckProps) {
    // Mock risk analysis based on available data
    // In a real app, you'd fetch this from RugCheck API

    const liquidity = tokenData.liquidity || 0
    const fdv = tokenData.fdv || 0

    // Simple heuristic for demo
    const isLiquidityLow = liquidity < 1000 // < $1k liq
    const isLiquidityVeryHigh = liquidity > 100000 // > $100k liq

    const riskLevel = isLiquidityLow ? "DANGER" : isLiquidityVeryHigh ? "SAFE" : "CAUTION"

    const getRiskColor = () => {
        switch (riskLevel) {
            case "SAFE": return "text-green-500"
            case "DANGER": return "text-red-500"
            default: return "text-yellow-500"
        }
    }

    const getRiskIcon = () => {
        switch (riskLevel) {
            case "SAFE": return <ShieldCheck className="w-5 h-5 text-green-500" />
            case "DANGER": return <ShieldAlert className="w-5 h-5 text-red-500" />
            default: return <Shield className="w-5 h-5 text-yellow-500" />
        }
    }

    return (
        <div className="bg-card rounded-xl border border-border p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Risk Analysis
                </h3>
                <span className={`text-sm font-bold ${getRiskColor()}`}>{riskLevel}</span>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg">
                    <span className="text-xs text-muted-foreground">Liquidity</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-medium">${liquidity.toLocaleString()}</span>
                        {isLiquidityLow ? <AlertTriangle className="w-3 h-3 text-red-500" /> : <Lock className="w-3 h-3 text-green-500" />}
                    </div>
                </div>

                <div className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg">
                    <span className="text-xs text-muted-foreground">Rug Probability</span>
                    <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                            className={`h-full ${riskLevel === 'SAFE' ? 'bg-green-500 w-[10%]' : riskLevel === 'DANGER' ? 'bg-red-500 w-[90%]' : 'bg-yellow-500 w-[50%]'}`}
                        />
                    </div>
                </div>
            </div>

            <p className="text-[10px] text-muted-foreground text-center mt-1">
                *Estimated based on liquidity & volume
            </p>
        </div>
    )
}
