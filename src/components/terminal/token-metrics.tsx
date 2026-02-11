"use client"

import { DollarSign, Droplets, Activity, BarChart3 } from "lucide-react"

interface TokenMetricsProps {
    tokenData: {
        priceUsd: string
        marketCap: number
        liquidity: number
        fdv: number
        volume24h: number
        priceChange24h: number
    }
}

export function TokenMetrics({ tokenData }: TokenMetricsProps) {
    const formatCurrency = (val: number) => {
        if (typeof val !== 'number') return "$0.00"
        if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(2)}B`
        if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`
        if (val >= 1_000) return `$${(val / 1_000).toFixed(2)}K`
        return `$${val.toFixed(2)}`
    }

    const price = parseFloat(tokenData.priceUsd) || 0

    return (
        <div className="bg-card rounded-xl border border-border p-4 space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" /> Market Overview
            </h3>

            <div className="grid grid-cols-1 gap-4">
                {/* Price */}
                <div className="p-4 bg-secondary/20 rounded-lg border border-border/50 flex justify-between items-center">
                    <div>
                        <div className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
                            <DollarSign className="w-3 h-3" /> Price
                        </div>
                        <div className="font-mono font-bold text-xl">
                            ${price < 0.01 ? price.toFixed(8) : price.toFixed(4)}
                        </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${tokenData.priceChange24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {tokenData.priceChange24h > 0 ? '+' : ''}{tokenData.priceChange24h}%
                    </div>
                </div>

                {/* Liquidity */}
                <div className="p-4 bg-secondary/20 rounded-lg border border-border/50">
                    <div className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
                        <Droplets className="w-3 h-3" /> Liquidity
                    </div>
                    <div className="font-mono font-bold text-lg">
                        {formatCurrency(tokenData.liquidity)}
                    </div>
                </div>

                {/* Market Cap */}
                <div className="p-4 bg-secondary/20 rounded-lg border border-border/50">
                    <div className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
                        <BarChart3 className="w-3 h-3" /> Mkt Cap
                    </div>
                    <div className="font-mono font-bold text-lg">
                        {formatCurrency(tokenData.marketCap)}
                    </div>
                </div>

                {/* Volume */}
                <div className="p-4 bg-secondary/20 rounded-lg border border-border/50">
                    <div className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
                        <Activity className="w-3 h-3" /> 24h Vol
                    </div>
                    <div className="font-mono font-bold text-lg">
                        {formatCurrency(tokenData.volume24h)}
                    </div>
                </div>
            </div>
        </div>
    )
}
