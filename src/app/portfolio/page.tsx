"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePortfolio, PortfolioToken } from "@/hooks/use-portfolio"
import { useWalletAssets, WalletAsset } from "@/hooks/use-wallet-assets"
import { ArrowLeft, Trash2, RefreshCw, Zap, TrendingUp, TrendingDown, AlertTriangle, Wallet, Plus, ExternalLink, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { WalletConnectButton } from "@/components/providers/client-wallet-provider"
import { useWallet } from "@solana/wallet-adapter-react"
import { TransactionDialog } from "@/components/portfolio/transaction-dialog"

export default function PortfolioPage() {
    const { tokens: watchedTokens, addToken, removeToken, addTransaction, removeTransaction } = usePortfolio()
    const [displayTokens, setDisplayTokens] = useState<any[]>([])
    const { assets, loading: assetsLoading, error: assetsError, refetch } = useWalletAssets()
    const { connected } = useWallet()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [activeTab, setActiveTab] = useState<"wallet" | "watchlist">("wallet")

    // Helper to calculate metrics from transactions
    const getPositionMetrics = (token: PortfolioToken) => {
        const txs = token.transactions || []
        if (txs.length === 0) return null

        let totalSolInvested = 0
        let totalUnitsBought = 0 // Unit = SOL / MC
        let realizedPnL = 0

        // Process transactions chronologically
        const sortedTxs = [...txs].sort((a, b) => a.date - b.date)

        sortedTxs.forEach(tx => {
            if (tx.type === 'BUY') {
                totalSolInvested += tx.amountSol
                totalUnitsBought += (tx.amountSol / tx.marketCap)
            } else if (tx.type === 'SELL') {
                const unitsSold = tx.amountSol / tx.marketCap
                // Cost basis of sold units = unitsSold * (TotalInvested / TotalUnitsBought)
                if (totalUnitsBought > 0) {
                    const costOfSold = unitsSold * (totalSolInvested / totalUnitsBought)
                    realizedPnL += (tx.amountSol - costOfSold)

                    // Reduce position
                    totalUnitsBought -= unitsSold
                    totalSolInvested -= costOfSold // Reduce cost basis
                }
            }
        })

        // Current Value = Remaining Units * Current Price (or MC)
        // Since units are 1/MC based, Value = Units * Current MC
        const currentMC = token.marketCap || (token.priceUsd * (token.supply || 0)) || 0

        let currentValue = 0
        if (currentMC > 0) {
            currentValue = totalUnitsBought * currentMC
        } else if (token.priceUsd > 0) {
            // Fallback logic
        }

        const unrealizedPnL = currentValue - totalSolInvested

        return {
            invested: totalSolInvested,
            currentValue,
            realizedPnL,
            unrealizedPnL,
            totalPnL: realizedPnL + unrealizedPnL,
            holdings: totalUnitsBought > 0 // Do we hold any?
        }
    }

    // Merge Wallet + Watchlist
    useEffect(() => {
        const walletMap = new Map(assets.map(a => [a.address, a]))

        // Start with watched tokens
        const merged = watchedTokens.map(wt => {
            const walletAsset = walletMap.get(wt.address)
            return {
                ...wt,
                ...walletAsset,
                priceUsd: walletAsset ? walletAsset.price : wt.priceUsd,
                holdings: walletAsset ? walletAsset.balance : wt.holdings,
                isWallet: !!walletAsset
            }
        })

        // Add wallet assets not in watchlist
        assets.forEach(wa => {
            if (!merged.find(m => m.address === wa.address)) {
                merged.push({
                    ...wa,
                    priceUsd: wa.price,
                    holdings: wa.balance,
                    avgEntryPrice: 0,
                    priceChange24h: wa.priceChange24h || 0,
                    transactions: [],
                    isWallet: true
                })
            }
        })

        setDisplayTokens(merged)
    }, [assets, watchedTokens])

    // Hydration fix for persist middleware
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const handleAnalyze = (address: string) => {
        router.push(`/terminal?token=${address}`)
    }

    const handleTrack = (asset: WalletAsset) => {
        addToken({
            address: asset.address,
            symbol: asset.symbol,
            name: asset.name,
            priceUsd: asset.price,
            priceChange24h: asset.priceChange24h || 0,
            holdings: asset.balance,
            avgEntryPrice: 0,
            imageUrl: asset.imageUrl,
            lastAnalyzed: new Date().toISOString(),
            aiVerdict: null
        })
        setActiveTab("watchlist")
    }

    const totalWalletValue = assets.reduce((sum, asset) => sum + asset.balanceUsd, 0)
    // Use watchedTokens for watchlist value calculation
    const totalWatchlistValue = watchedTokens.reduce((sum, token) => {
        return sum + (token.holdings ? token.holdings * token.priceUsd : 0)
    }, 0)

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
                                Total Wallet Value: <span className="text-foreground font-mono font-bold">${totalWalletValue.toFixed(2)}</span>
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
                        Watch List ({watchedTokens.length})
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
                        ) : assetsError ? (
                            <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4 text-center border border-dashed border-red-500/50 rounded-xl bg-red-500/10 p-8">
                                <AlertTriangle className="w-12 h-12 text-red-500" />
                                <h3 className="text-lg font-bold text-red-500">Error Loading Assets</h3>
                                <p className="text-red-400 max-w-md">
                                    {assetsError}
                                </p>
                                <button
                                    onClick={refetch}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Retry
                                </button>
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
                                            {assets.map((asset) => {
                                                const isWatched = watchedTokens.some(t => t.address === asset.address)
                                                return (
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
                                                            <div className="flex items-center justify-end gap-2">
                                                                {!isWatched && (
                                                                    <button
                                                                        onClick={() => handleTrack(asset)}
                                                                        className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors text-sm font-medium border border-border/50"
                                                                        title="Add to Watchlist"
                                                                    >
                                                                        <Plus className="w-4 h-4" />
                                                                        Track
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleAnalyze(asset.address)}
                                                                    className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium"
                                                                >
                                                                    <Zap className="w-4 h-4" />
                                                                    Analyze
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
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
                        {watchedTokens.length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4 text-center">
                                <div className="w-20 h-20 bg-secondary/30 rounded-full flex items-center justify-center">
                                    <Zap className="w-10 h-10 text-muted-foreground" />
                                </div>
                                <h2 className="text-xl font-bold">No tokens watched yet</h2>
                                <p className="text-muted-foreground max-w-md">
                                    Go to the Terminal, analyze a token, and click "Add to Portfolio" to track it here.
                                    <br />
                                    Or verify your wallet holdings and click "Track" to start monitoring PnL.
                                </p>
                                <Link href="/terminal" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                                    Go to Terminal
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {watchedTokens.map((token) => {
                                    const metrics = getPositionMetrics(token)

                                    return (
                                        <div key={token.address} className="bg-card border border-border rounded-xl p-4 md:p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                                                {/* Token Info */}
                                                <div className="flex items-center gap-4">
                                                    {token.imageUrl ? (
                                                        <img src={token.imageUrl} alt={token.symbol} className="w-12 h-12 rounded-full bg-secondary object-cover" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold">
                                                            {token.symbol?.slice(0, 2)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-bold text-lg">{token.name}</h3>
                                                            {token.aiVerdict && (
                                                                <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase tracking-wide border ${token.aiVerdict === "BUY" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                                                    token.aiVerdict === "SELL" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                                        "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                                                    }`}>
                                                                    {token.aiVerdict}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                            <span>{token.symbol}</span>
                                                            {token.priceUsd > 0 && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>${token.priceUsd < 0.01 ? token.priceUsd.toExponential(4) : token.priceUsd.toFixed(4)}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 w-full md:w-auto">
                                                    <Link
                                                        href={`/terminal?token=${token.address}`}
                                                        className="flex-1 md:flex-none text-center px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Analyze
                                                    </Link>
                                                    <TransactionDialog
                                                        tokenSymbol={token.symbol}
                                                        onAddTransaction={(type, amount, mc, date) => {
                                                            addTransaction(token.address, {
                                                                type,
                                                                amountSol: amount,
                                                                marketCap: mc,
                                                                date
                                                            })
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => removeToken(token.address)}
                                                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                                                        title="Remove from Watchlist"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Metrics Grid */}
                                            {metrics ? (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Invested</p>
                                                        <p className="font-mono font-medium">{metrics.invested.toFixed(2)} SOL</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Value</p>
                                                        <p className="font-mono font-medium">{metrics.currentValue.toFixed(2)} SOL</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Realized PnL</p>
                                                        <p className={`font-mono font-medium flex items-center gap-1 ${metrics.realizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                            {metrics.realizedPnL >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                            {Math.abs(metrics.realizedPnL).toFixed(2)} SOL
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Total PnL</p>
                                                        <p className={`font-mono font-medium flex items-center gap-1 ${metrics.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                            {metrics.totalPnL >= 0 ? '+' : ''}{metrics.totalPnL.toFixed(2)} SOL
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center p-4 bg-secondary/20 rounded-lg border border-dashed border-border/50">
                                                    <p className="text-sm text-muted-foreground">No transactions tracked. Add one to see PnL.</p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
