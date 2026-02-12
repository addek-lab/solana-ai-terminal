export interface WalletAsset {
    address: string
    symbol: string
    name: string
    decimals: number
    balance: number
    balanceUsd: number
    price: number
    imageUrl?: string
    isSol?: boolean
    priceChange24h?: number
}

import { useState, useEffect, useCallback } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

// Basic ERC20 Token Program ID for SPL tokens on Solana
const TOKEN_PROGRAM_ID_PK = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")

export function useWalletAssets() {
    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const [assets, setAssets] = useState<WalletAsset[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAssets = useCallback(async () => {
        if (!publicKey) {
            setAssets([])
            return
        }

        setLoading(true)
        setError(null)

        try {
            // 1. Fetch SOL Balance
            const solBalance = await connection.getBalance(publicKey)
            const solAmount = solBalance / LAMPORTS_PER_SOL

            // 2. Fetch SPL Tokens
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
                programId: TOKEN_PROGRAM_ID_PK,
            })

            const tokens = tokenAccounts.value
                .map((account) => {
                    const info = account.account.data.parsed.info
                    return {
                        mint: new PublicKey(info.mint),
                        amount: info.tokenAmount.uiAmount,
                        decimals: info.tokenAmount.decimals,
                    }
                })
                .filter((t) => t.amount > 0)

            // 3. Prepare list of addresses to fetch prices for
            // Add SOL address
            const solAddress = "So11111111111111111111111111111111111111112"
            const tokenAddresses = tokens.map(t => t.mint.toString()).join(',')

            // Limit query length if too many tokens (simple approach: just take first 30 for now to avoid URL length issues)
            // In production, you'd batch this.
            // But DexScreener supports comma separated, let's see.
            const queryAddresses = [solAddress, ...tokens.map(t => t.mint.toString())].slice(0, 30).join(',')

            // 4. Fetch Prices from our Proxy
            let priceData: Record<string, any> = {}
            if (queryAddresses) {
                try {
                    const priceRes = await fetch(`/api/proxy/dex?q=${queryAddresses}`)
                    const priceJson = await priceRes.json()

                    if (priceJson.pairs) {
                        // DexScreener returns pairs. We need to match pairs to tokens.
                        // This is a bit tricky because one token might have multiple pairs.
                        // We'll map by baseToken address.
                        priceJson.pairs.forEach((pair: any) => {
                            if (!priceData[pair.baseToken.address]) {
                                priceData[pair.baseToken.address] = pair
                            }
                        })
                    }
                } catch (e) {
                    console.error("Failed to fetch prices", e)
                }
            }

            // 5. Build Asset List
            const finalAssets: WalletAsset[] = []

            // Add SOL
            const solPair = priceData[solAddress]
            const solPrice = solPair ? Number(solPair.priceUsd) : 0

            finalAssets.push({
                address: solAddress,
                symbol: "SOL",
                name: "Solana",
                decimals: 9,
                balance: solAmount,
                balanceUsd: solAmount * solPrice,
                price: solPrice,
                imageUrl: solPair?.info?.imageUrl || "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
                isSol: true,
                priceChange24h: solPair?.priceChange?.h24 || 0
            })

            // Add SPL Tokens
            tokens.forEach(t => {
                const addr = t.mint.toString()
                if (priceData[addr]) {
                    // Only add if we found price data (or if you want to show all, remove this check, but usually portfolio needs value)
                    const pair = priceData[addr]
                    const price = Number(pair.priceUsd)

                    finalAssets.push({
                        address: addr,
                        symbol: pair.baseToken.symbol,
                        name: pair.baseToken.name,
                        decimals: t.decimals,
                        balance: t.amount,
                        balanceUsd: t.amount * price,
                        price: price,
                        imageUrl: pair.info?.imageUrl,
                        priceChange24h: pair.priceChange?.h24 || 0
                    })
                }
            })

            // Sort by USD value
            finalAssets.sort((a, b) => b.balanceUsd - a.balanceUsd)

            setAssets(finalAssets)

        } catch (err: any) {
            console.error("Error loading wallet assets:", err)
            setError(err.message || "Failed to load assets")
        } finally {
            setLoading(false)
        }
    }, [connection, publicKey])

    useEffect(() => {
        fetchAssets()
    }, [fetchAssets])

    return { assets, loading, error, refetch: fetchAssets }
}
