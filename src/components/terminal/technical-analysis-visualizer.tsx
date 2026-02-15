"use client"

import { useMemo } from "react"
import { TrendingUp, TrendingDown, Target, ShieldAlert, ShieldCheck } from "lucide-react"

interface TechnicalAnalysisVisualizerProps {
    currentPrice: number
    support: number
    resistance: number
    stopLoss: number
    target: number
}

export function TechnicalAnalysisVisualizer({
    currentPrice,
    support,
    resistance,
    stopLoss,
    target
}: TechnicalAnalysisVisualizerProps) {
    const { percentToPixel, range, riskRewardRatio } = useMemo(() => {
        // 1. Calculate the full range to display (from lowest SL/Support to highest Target/Resistance)
        // Add some padding (buffer) so points aren't on the very edge
        const prices = [currentPrice, support, resistance, stopLoss, target].filter(p => p > 0)
        const minPrice = Math.min(...prices) * 0.95
        const maxPrice = Math.max(...prices) * 1.05
        const range = maxPrice - minPrice

        // Helper to convert a price to a percentage position (0% at bottom, 100% at top)
        const getPos = (price: number) => {
            if (range === 0) return 50
            return ((price - minPrice) / range) * 100
        }

        // Calculate R:R
        // Risk = Current - StopLoss
        // Reward = Target - Current
        const risk = currentPrice - stopLoss
        const reward = target - currentPrice
        const rr = risk > 0 ? (reward / risk).toFixed(2) : "N/A"

        return {
            percentToPixel: getPos,
            range,
            riskRewardRatio: rr
        }
    }, [currentPrice, support, resistance, stopLoss, target])

    if (!currentPrice || currentPrice === 0) return null

    return (
        <div className="bg-card/50 rounded-xl border border-border p-6 mt-6">
            <h4 className="font-bold flex items-center gap-2 text-lg uppercase tracking-wider mb-6">
                <Target className="w-5 h-5 text-primary" /> Technical Setup Visualization
            </h4>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Interactive Price Ladder (SVG) */}
                <div className="flex-1 h-[300px] relative bg-background/30 rounded-lg border border-border/50 shadow-inner overflow-hidden">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-10 pointer-events-none">
                        <div className="w-full h-px bg-foreground" />
                        <div className="w-full h-px bg-foreground" />
                        <div className="w-full h-px bg-foreground" />
                        <div className="w-full h-px bg-foreground" />
                        <div className="w-full h-px bg-foreground" />
                    </div>

                    {/* SVG Layer */}
                    <div className="absolute inset-0 w-full h-full p-6">
                        <div className="relative w-full h-full">
                            {/* Potential Profit Area (Gradient) */}
                            <div
                                className="absolute w-24 left-1/2 -ml-12 bg-gradient-to-t from-blue-500/0 via-green-500/10 to-green-500/20 border-x border-green-500/20"
                                style={{
                                    bottom: `${percentToPixel(currentPrice)}%`,
                                    height: `${percentToPixel(target) - percentToPixel(currentPrice)}%`,
                                    transition: "all 1s ease-out"
                                }}
                            >
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                            </div>

                            {/* Potential Loss Area (Gradient) */}
                            <div
                                className="absolute w-24 left-1/2 -ml-12 bg-gradient-to-b from-blue-500/0 via-red-500/10 to-red-500/20 border-x border-red-500/20"
                                style={{
                                    bottom: `${percentToPixel(stopLoss)}%`,
                                    height: `${percentToPixel(currentPrice) - percentToPixel(stopLoss)}%`,
                                    transition: "all 1s ease-out"
                                }}
                            >
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                            </div>

                            {/* Current Price Line (Dotted, Pulse) */}
                            <div
                                className="absolute w-full border-t-2 border-dotted border-blue-500 z-20 flex items-center"
                                style={{ bottom: `${percentToPixel(currentPrice)}%`, transition: "bottom 1s cubic-bezier(0.4, 0, 0.2, 1)" }}
                            >
                                <div className="absolute -left-1 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-75" />
                                <div className="absolute -left-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-background" />
                                <span className="absolute left-6 text-blue-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-background/80 backdrop-blur border border-blue-500/20 shadow-xl shadow-blue-500/10">
                                    Current
                                </span>
                            </div>

                            {/* Target (Green Zone) */}
                            <div
                                className="absolute w-full border-t-2 border-green-500 z-10"
                                style={{ bottom: `${percentToPixel(target)}%`, transition: "bottom 1s cubic-bezier(0.4, 0, 0.2, 1)" }}
                            >
                                <span className="absolute right-0 -top-6 text-green-500 font-bold text-xs flex items-center gap-1 bg-background/80 px-2 py-0.5 rounded border border-green-500/20">
                                    TARGET <TrendingUp className="w-3 h-3" />
                                </span>
                            </div>

                            {/* Reference Lines (Support/Resistance) */}
                            {resistance > 0 && resistance > currentPrice && (
                                <div
                                    className="absolute w-full h-px bg-red-500/30 dashed z-0"
                                    style={{ bottom: `${percentToPixel(resistance)}%` }}
                                >
                                    <span className="absolute right-0 -top-2 text-red-500/50 text-[9px] uppercase font-bold px-2">
                                        Res
                                    </span>
                                </div>
                            )}

                            {support > 0 && support < currentPrice && (
                                <div
                                    className="absolute w-full h-px bg-green-500/30 dashed z-0"
                                    style={{ bottom: `${percentToPixel(support)}%` }}
                                >
                                    <span className="absolute right-0 -top-2 text-green-500/50 text-[9px] uppercase font-bold px-2">
                                        Sup
                                    </span>
                                </div>
                            )}

                            {/* Stop Loss (Red Line) */}
                            <div
                                className="absolute w-full border-t-2 border-red-500 z-10"
                                style={{ bottom: `${percentToPixel(stopLoss)}%`, transition: "bottom 1s cubic-bezier(0.4, 0, 0.2, 1)" }}
                            >
                                <span className="absolute right-0 top-2 text-red-500 font-bold text-xs flex items-center gap-1 bg-background/80 px-2 py-0.5 rounded border border-red-500/20">
                                    STOP <TrendingDown className="w-3 h-3" />
                                </span>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right: Metrics & R:R */}
                <div className="w-full md:w-64 flex flex-col gap-4">
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                        <div className="text-sm text-muted-foreground mb-1">Risk / Reward Ratio</div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-black">{riskRewardRatio}</span>
                            <span className="text-sm text-muted-foreground font-medium mb-1.5">R</span>
                        </div>
                        <div className="h-1.5 w-full bg-background rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-green-500 w-full" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            For every $1 risked, you aim to make ${riskRewardRatio}.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                <span className="text-xs font-bold text-green-500 uppercase">Upside</span>
                            </div>
                            <span className="text-lg font-mono font-bold text-green-400">
                                +{((target - currentPrice) / currentPrice * 100).toFixed(1)}%
                            </span>
                        </div>

                        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldAlert className="w-4 h-4 text-red-500" />
                                <span className="text-xs font-bold text-red-500 uppercase">Risk</span>
                            </div>
                            <span className="text-lg font-mono font-bold text-red-400">
                                -{((currentPrice - stopLoss) / currentPrice * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
