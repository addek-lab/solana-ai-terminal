"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePortfolio, PortfolioToken } from "@/hooks/use-portfolio"
import { useWalletAssets, WalletAsset } from "@/hooks/use-wallet-assets"
import { ArrowLeft, Trash2, RefreshCw, Zap, TrendingUp, TrendingDown, AlertTriangle, Wallet, Plus, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { WalletConnectButton } from "@/components/providers/client-wallet-provider"
import { useWallet } from "@solana/wallet-adapter-react"

export default function PortfolioPage() {
    const { tokens, removeToken } = usePortfolio()
    const { assets, loading: assetsLoading, error: assetsError, refetch } = useWalletAssets()
    const { connected } = useWallet()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [activeTab, setActiveTab] = useState<"wallet" | "watchlist">("wallet")

    // Hydration fix for persist middleware
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const handleAnalyze = (address: string) => {
        router.push(`/terminal?token=${address}`)
    }

    const totalWalletValue = assets.reduce((sum, asset) => sum + asset.balanceUsd, 0)
    const totalWatchlistValue = tokens.reduce((sum, token) => sum + (token.holdings ? token.holdings * token.priceUsd : 0), 0)

    const formatCurrency = (val: number) => {
        if (typeof val !== 'number') return "$0.00"
        if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`
        if (val >= 1_000) return `$${(val / 1_000).toFixed(2)}K`
        return `$${val.toFixed(2)}`
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/terminal" className="p-2 hover:bg-secondary rounded-full transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
                                My Portfolio
                            </h1>
                            <div className="text-muted-foreground text-sm font-medium">
                                Total Value: <span className="text-foreground font-mono font-bold">${(totalWalletValue + totalWatchlistValue).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <WalletConnectButton />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border">
                    <button
                        onClick={() => setActiveTab("wallet")}
                        className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === "wallet"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Wallet Holdings ({assets.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("watchlist")}
                        className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === "watchlist"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Watch List ({tokens.length})
                    </button>
                </div>

                {/* Wallet Holdings Content */}
                {activeTab === "wallet" && (
                    <div className="space-y-6">
                        {!connected ? (
                            <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4 text-center bg-card/50 border border-border/50 rounded-xl p-8">
                                <div className="w-20 h-20 bg-secondary/30 rounded-full flex items-center justify-center">
                                    <Wallet className="w-10 h-10 text-muted-foreground" />
                                </div>
                                <h2 className="text-xl font-bold">Connect Wallet to View Holdings</h2>
                                <p className="text-muted-foreground max-w-md">
                                    Connect your Solana wallet to automatically track your assets and analyze them with Gemini AI.
                                </p>
                                <WalletConnectButton />
                            </div>
                        ) : assetsLoading ? (
                            <div className="flex items-center justify-center min-h-[40vh]">
                                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : assets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4 text-center">
                                <h2 className="text-xl font-bold">No assets found</h2>
                                <p className="text-muted-foreground">Your connected wallet doesn't have any supported tokens.</p>
                            </div>
                        ) : (
                            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-secondary/50 border-b border-border">
                                            <tr>
                                                <th className="text-left p-4 font-medium text-muted-foreground">Asset</th>
                                                <th className="text-right p-4 font-medium text-muted-foreground">Balance</th>
                                                <th className="text-right p-4 font-medium text-muted-foreground">Price</th>
                                                <th className="text-right p-4 font-medium text-muted-foreground">Value</th>
                                                <th className="text-right p-4 font-medium text-muted-foreground">24h Change</th>
                                                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {assets.map((asset) => (
                                                <tr key={asset.address} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            {asset.imageUrl ? (
                                                                <img src={asset.imageUrl} alt={asset.symbol} className="w-10 h-10 rounded-full" />
                                                            ) : (
                                                                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                                                    <span className="font-bold text-xs">{asset.symbol.slice(0, 2)}</span>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="font-bold flex items-center gap-2">
                                                                    {asset.name}
                                                                    <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{asset.symbol}</span>
                                                                </div>
                                                                <div className="text-xs text-muted-foreground font-mono opacity-50 truncate max-w-[100px]">
                                                                    {asset.address}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right font-mono">
                                                        {asset.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {asset.symbol}
                                                    </td>
                                                    <td className="p-4 text-right font-mono">
                                                        ${asset.price < 0.01 ? asset.price.toExponential(4) : asset.price.toFixed(4)}
                                                    </td>
                                                    <td className="p-4 text-right font-mono font-bold">
                                                        ${asset.balanceUsd.toFixed(2)}
                                                    </td>
                                                    <td className={`p-4 text-right font-mono font-bold ${asset.priceChange24h && asset.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                                                        {asset.priceChange24h ? `${asset.priceChange24h > 0 ? "+" : ""}${asset.priceChange24h.toFixed(2)}%` : "-"}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button
                                                            onClick={() => handleAnalyze(asset.address)}
                                                            className="flex items-center gap-2 ml-auto px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium"
                                                        >
                                                            <Zap className="w-4 h-4" />
                                                            Analyze
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Watchlist Content */}
                {activeTab === "watchlist" && (
                    <div className="space-y-6">
                        {tokens.length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4 text-center">
                                <div className="w-20 h-20 bg-secondary/30 rounded-full flex items-center justify-center">
                                    <Zap className="w-10 h-10 text-muted-foreground" />
                                </div>
                                <h2 className="text-xl font-bold">No tokens watched yet</h2>
                                <p className="text-muted-foreground max-w-md">
                                    Go to the Terminal, analyze a token, and click "Add to Portfolio" to track it here.
                                </p>
                                <Link href="/terminal" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                                    Go to Terminal
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-secondary/50 border-b border-border">
                                            <tr>
                                                <th className="text-left p-4 font-medium text-muted-foreground">Token</th>
                                                <th className="text-right p-4 font-medium text-muted-foreground">Price</th>
                                                <th className="text-right p-4 font-medium text-muted-foreground">24h Change</th>
                                                <th className="text-center p-4 font-medium text-muted-foreground">AI Verdict</th>
                                                <th className="text-right p-4 font-medium text-muted-foreground">Last Analyzed</th>
                                                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tokens.map((token) => (
                                                <tr key={token.address} className="border-b border-border/50 hover:bg-secondary/20 transition-colors group">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            {token.imageUrl ? (
                                                                <img src={token.imageUrl} alt={token.symbol} className="w-10 h-10 rounded-full" />
                                                            ) : (
                                                                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                                                    <span className="font-bold text-xs">{token.symbol.slice(0, 2)}</span>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="font-bold flex items-center gap-2">
                                                                    {token.name}
                                                                    <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{token.symbol}</span>
                                                                </div>
                                                                <div className="text-xs text-muted-foreground font-mono opacity-50 truncate max-w-[100px]">
                                                                    {token.address}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right font-mono">
                                                        ${token.priceUsd < 0.01 ? token.priceUsd.toExponential(4) : token.priceUsd.toFixed(4)}
                                                    </td>
                                                    <td className={`p-4 text-right font-mono font-bold ${token.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                                                        {token.priceChange24h > 0 ? "+" : ""}{token.priceChange24h.toFixed(2)}%
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase ${token.aiVerdict === "BUY" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                                                            token.aiVerdict === "SELL" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                                                                token.aiVerdict === "DEGEN PLAY" ? "bg-purple-500/10 text-purple-500 border border-purple-500/20" :
                                                                    "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                                            }`}>
                                                            {token.aiVerdict || "N/A"}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right text-sm text-muted-foreground">
                                                        {token.lastAnalyzed ? new Date(token.lastAnalyzed).toLocaleDateString() : "-"}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleAnalyze(token.address)}
                                                                className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                                                                title="Re-Analyze"
                                                            >
                                                                <RefreshCw className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => removeToken(token.address)}
                                                                className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                                                title="Remove"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
