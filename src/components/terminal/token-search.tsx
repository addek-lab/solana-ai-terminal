"use client"

import { useState } from "react"
import { Search, Loader2, ArrowRight } from "lucide-react"

interface TokenSearchProps {
    onSelect: (token: any) => void
    variant?: 'hero' | 'compact'
}

export function TokenSearch({ onSelect, variant = 'compact' }: TokenSearchProps) {
    const [query, setQuery] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
        if (e) e.preventDefault()

        const textToSearch = overrideQuery || query
        if (!textToSearch) return

        const cleanQuery = textToSearch.trim()
        if (!cleanQuery) return

        setLoading(true)
        setError("")

        try {
            // Fetch token info via internal proxy to avoid CORS/CSP issues
            const res = await fetch(`/api/proxy/dex?q=${cleanQuery}`)
            const data = await res.json()

            if (!data.pairs || data.pairs.length === 0) {
                setError(`Token not found: ${cleanQuery.slice(0, 8)}...`)
                setLoading(false)
                return
            }

            // Get the most liquid pair
            const pair = data.pairs[0]

            onSelect({
                address: pair.baseToken.address,
                symbol: pair.baseToken.symbol,
                name: pair.baseToken.name,
                priceUsd: pair.priceUsd,
                pairAddress: pair.pairAddress,
                imageUrl: pair.info?.imageUrl,
                websites: pair.info?.websites || [],
                socials: pair.info?.socials || [],
                pairCreatedAt: pair.pairCreatedAt,
                chainId: pair.chainId,
                dexId: pair.dexId,
                marketCap: pair.marketCap || pair.fdv || 0,
                volume24h: pair.volume?.h24 || 0,
                liquidity: pair.liquidity?.usd || 0,
                fdv: pair.fdv || 0,
                priceChange24h: pair.priceChange?.h24 || 0
            })

            if (variant === 'compact') {
                setQuery("")
            }
        } catch (err) {
            setError("Failed to fetch token data.")
        } finally {
            setLoading(false)
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text').trim()
        if (text) {
            setQuery(text)
            // Auto-search if it looks like a full address (base58 chars, decent length)
            if (text.length > 30) {
                handleSearch(undefined, text)
            }
        }
    };

    const clearSearch = () => {
        setQuery("")
        setError("")
    }

    const isHero = variant === 'hero'

    return (
        <div className={`relative w-full ${isHero ? 'max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh]' : 'max-w-sm'}`}>

            {isHero && (
                <div className="text-center mb-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
                        Solana AI Terminal
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto">
                        Paste a token address to analyze chart, metrics, and safety instantly.
                    </p>
                </div>
            )}

            <form onSubmit={handleSearch} className={`relative w-full ${isHero ? 'transform transition-all hover:scale-[1.01]' : ''}`}>
                <div className="relative group">
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur ${isHero ? 'block' : 'hidden'}`}></div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Paste Solana Token Address..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onPaste={handlePaste}
                            className={`w-full ${isHero ? 'h-16 pl-14 pr-32 text-lg shadow-2xl' : 'h-9 pl-9 pr-20 text-sm'} rounded-xl border border-border bg-background/80 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-muted-foreground/50`}
                        />
                        <Search className={`absolute ${isHero ? 'left-5 top-5 h-6 w-6' : 'left-3 top-2.5 h-4 w-4'} text-muted-foreground`} />

                        {/* Clear Button (only if query exists) */}
                        {query && !loading && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className={`absolute ${isHero ? 'right-36 top-5' : 'right-20 top-2.5'} text-muted-foreground hover:text-foreground transition-colors`}
                            >
                                X
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !query}
                            className={`absolute ${isHero ? 'right-2 top-2 bottom-2 px-6' : 'right-1 top-1 bottom-1 px-3'} bg-primary text-primary-foreground font-medium rounded-lg disabled:opacity-50 hover:bg-primary/90 transition-all flex items-center gap-2`}
                        >
                            {loading ? <Loader2 className={`animate-spin ${isHero ? 'h-5 w-5' : 'h-3 w-3'}`} /> : (
                                <>
                                    {isHero ? "Analyze" : "Search"}
                                    {isHero && <ArrowRight className="w-4 h-4" />}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {error && <p className={`absolute ${isHero ? '-bottom-8' : 'top-full mt-1'} text-sm text-red-500 font-medium animate-in fade-in`}>{error}</p>}
        </div>
    )
}
