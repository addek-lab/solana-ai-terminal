"use client"

import { useEffect, useState } from "react"
import { Shield, ShieldAlert, ShieldCheck, Lock, AlertTriangle, Info, Loader2, Users } from "lucide-react"

interface RugCheckProps {
    tokenData: any
}

export function RugCheck({ tokenData }: RugCheckProps) {
    const [report, setReport] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!tokenData?.address) return

        const fetchRugCheck = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch(`/api/proxy/rugcheck?mint=${tokenData.address}`)
                if (!res.ok) throw new Error("Report not found")
                const data = await res.json()
                setReport(data)
            } catch (err) {
                console.error(err)
                setError("Risk verification unavailable (New ID?)")
                setReport(null)
            } finally {
                setLoading(false)
            }
        }

        fetchRugCheck()
    }, [tokenData.address])

    if (loading) return (
        <div className="bg-card rounded-xl border border-border p-8 flex items-center justify-center h-48">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
    )

    if (error || !report) return (
        <div className="bg-card rounded-xl border border-border p-4 flex flex-col gap-3 h-fit">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Risk Analysis</span>
            </div>
            <div className="p-4 bg-secondary/20 rounded-lg text-center text-sm text-muted-foreground">
                {error || "No risk report available."}
            </div>
        </div>
    )

    const score = report.score || 0
    const markets = report.markets || []
    const topHolders = report.topHolders || []
    const lpLockedPct = report.markets?.[0]?.lp?.lpLocked || 0 // Initial guess, adjust if needed

    // Determine Status
    let status = "Good"
    let statusColor = "bg-green-500/10 text-green-500 border-green-500/20"
    let headerBg = "bg-green-900/20"

    if (score > 1000) { // RugCheck scores can be high for bad tokens
        status = "Danger"
        statusColor = "bg-red-500/10 text-red-500 border-red-500/20"
        headerBg = "bg-red-900/20"
    } else if (score > 400) {
        status = "Warning"
        statusColor = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
        headerBg = "bg-yellow-900/20"
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Risk Card */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2">
                        Risk Analysis
                    </h3>
                    <span className="text-xs font-mono text-muted-foreground">{score} Score</span>
                </div>

                <div className={`p-6 flex flex-col items-center justify-center gap-2 ${headerBg}`}>
                    <h2 className={`text-3xl font-black uppercase tracking-wider ${status === 'Good' ? 'text-green-500' : status === 'Danger' ? 'text-red-500' : 'text-yellow-500'}`}>
                        {status}
                    </h2>
                </div>

                <div className="p-4 space-y-4">
                    {/* Warnings / Risks */}
                    {report.risks && report.risks.length > 0 && (
                        <div className="space-y-2">
                            {report.risks.slice(0, 3).map((risk: any, i: number) => (
                                <div key={i} className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center gap-2 ${risk.level === 'danger' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                        risk.level === 'warn' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                                            'bg-secondary/50 border-border text-muted-foreground'
                                    }`}>
                                    <AlertTriangle className="w-3 h-3 shrink-0" />
                                    {risk.name}: {risk.description}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Insider / Liquidity Summary */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-3 bg-secondary/30 rounded-lg">
                            <span className="text-xs text-muted-foreground block mb-1">Mint Authority</span>
                            <span className={report.token?.mintAuthority ? "text-red-400 font-bold" : "text-green-400 font-bold"}>
                                {report.token?.mintAuthority ? "Enabled" : "Disabled"}
                            </span>
                        </div>
                        <div className="p-3 bg-secondary/30 rounded-lg">
                            <span className="text-xs text-muted-foreground block mb-1">Freeze Authority</span>
                            <span className={report.token?.freezeAuthority ? "text-red-400 font-bold" : "text-green-400 font-bold"}>
                                {report.token?.freezeAuthority ? "Enabled" : "Disabled"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Holders Card */}
            {topHolders.length > 0 && (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <h3 className="font-bold flex items-center gap-2">
                            <Users className="w-4 h-4" /> Top Holders
                        </h3>
                    </div>
                    <div className="divide-y divide-border/50">
                        {topHolders.slice(0, 5).map((holder: any, i: number) => (
                            <div key={i} className="p-3 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <span className="text-xs font-mono text-muted-foreground w-4">{i + 1}.</span>
                                    <a
                                        href={`https://solscan.io/account/${holder.address}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs font-mono hover:text-purple-400 transition-colors truncate w-24"
                                    >
                                        {holder.owner === "System Program" ? "System" :
                                            holder.owner ? holder.owner.slice(0, 8) :
                                                holder.address.slice(0, 8)}...
                                    </a>
                                    {holder.insider && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Insider</span>}
                                </div>
                                <span className="text-xs font-bold">{holder.pct.toFixed(2)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
