"use client"

import { useState } from "react"
import { Search, Loader2 } from "lucide-react"

export function TokenSearch({ onSelect }: { onSelect: (token: any) => void }) {
    const [query, setQuery] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query) return

        setLoading(true)
        setError("")

        try {
            // Fetch token info via internal proxy to avoid CORS/CSP issues
            const res = await fetch(`/api/proxy/dex?q=${query}`)
            const data = await res.json()

            if (!data.pairs || data.pairs.length === 0) {
                setError("Token not found or no pairs available.")
                setLoading(false)
                return
            }

            // Get the most liquid pair (usually the first one returned by DexScreener)
            const pair = data.pairs[0]

            onSelect({
                address: pair.baseToken.address,
                symbol: pair.baseToken.symbol,
                name: pair.baseToken.name,
                priceUsd: pair.priceUsd,
                pairAddress: pair.pairAddress,
                imageUrl: pair.info?.imageUrl,
                chainId: pair.chainId,
                dexId: pair.dexId
            })

            setQuery("")
        } catch (err) {
            setError("Failed to fetch token data.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative w-full max-w-md">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    placeholder="Paste Solana Token Address (e.g. DezX...)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <button
                    type="submit"
                    disabled={loading || !query}
                    className="absolute right-1.5 top-1.5 h-7 px-3 text-xs bg-primary text-primary-foreground rounded-md disabled:opacity-50 hover:bg-primary/90 transition-colors"
                >
                    {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Search"}
                </button>
            </form>
            {error && <p className="absolute top-full mt-1 text-xs text-red-500">{error}</p>}
        </div>
    )
}
