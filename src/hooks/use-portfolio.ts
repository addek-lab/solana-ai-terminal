import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PortfolioToken {
    address: string
    symbol: string
    name: string
    priceUsd: number
    priceChange24h: number
    holdings: number // User entered amount (optional default 0)
    avgEntryPrice: number // User entered (optional default 0)
    imageUrl?: string
    lastAnalyzed?: string // Date string of last AI analysis
    aiVerdict?: "BUY" | "SELL" | "WAIT" | "DEGEN PLAY" | null
}

interface PortfolioState {
    tokens: PortfolioToken[]
    addToken: (token: PortfolioToken) => void
    removeToken: (address: string) => void
    updateToken: (address: string, updates: Partial<PortfolioToken>) => void
    hasToken: (address: string) => boolean
}

export const usePortfolio = create<PortfolioState>()(
    persist(
        (set, get) => ({
            tokens: [],
            addToken: (token) => set((state) => {
                const existing = state.tokens.find(t => t.address === token.address)
                if (existing) return state // Prevent duplicates
                return { tokens: [...state.tokens, token] }
            }),
            removeToken: (address) => set((state) => ({
                tokens: state.tokens.filter((t) => t.address !== address)
            })),
            updateToken: (address, updates) => set((state) => ({
                tokens: state.tokens.map((t) =>
                    t.address === address ? { ...t, ...updates } : t
                )
            })),
            hasToken: (address) => {
                return get().tokens.some(t => t.address === address)
            }
        }),
        {
            name: 'solana-ai-portfolio-storage', // localstorage key
        }
    )
)
