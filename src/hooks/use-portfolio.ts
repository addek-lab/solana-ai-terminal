import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Transaction {
    id: string
    type: 'BUY' | 'SELL'
    amountSol: number
    marketCap: number
    date: number
    notes?: string
}

export interface PortfolioToken {
    address: string
    symbol: string
    name: string
    priceUsd: number
    priceChange24h: number
    marketCap?: number
    supply?: number
    holdings: number // Deprecated in favor of calculated holdings from transactions? Keeping for backward compat.
    avgEntryPrice: number // Deprecated
    transactions?: Transaction[]
    imageUrl?: string
    lastAnalyzed?: string
    aiVerdict?: "BUY" | "SELL" | "WAIT" | "DEGEN PLAY" | null
}

interface PortfolioState {
    tokens: PortfolioToken[]
    addToken: (token: PortfolioToken) => void
    removeToken: (address: string) => void
    updateToken: (address: string, updates: Partial<PortfolioToken>) => void
    addTransaction: (address: string, transaction: Omit<Transaction, 'id'>) => void
    removeTransaction: (address: string, transactionId: string) => void
    hasToken: (address: string) => boolean
}

export const usePortfolio = create<PortfolioState>()(
    persist(
        (set, get) => ({
            tokens: [],
            addToken: (token) => set((state) => {
                const existing = state.tokens.find(t => t.address === token.address)
                if (existing) return state
                return { tokens: [...state.tokens, { ...token, transactions: [] }] }
            }),
            removeToken: (address) => set((state) => ({
                tokens: state.tokens.filter((t) => t.address !== address)
            })),
            updateToken: (address, updates) => set((state) => ({
                tokens: state.tokens.map((t) =>
                    t.address === address ? { ...t, ...updates } : t
                )
            })),
            addTransaction: (address, transaction) => set((state) => ({
                tokens: state.tokens.map((t) => {
                    if (t.address !== address) return t
                    const newTx: Transaction = { ...transaction, id: crypto.randomUUID() }
                    return { ...t, transactions: [...(t.transactions || []), newTx] }
                })
            })),
            removeTransaction: (address, transactionId) => set((state) => ({
                tokens: state.tokens.map((t) => {
                    if (t.address !== address) return t
                    return { ...t, transactions: (t.transactions || []).filter(tx => tx.id !== transactionId) }
                })
            })),
            hasToken: (address) => {
                return get().tokens.some(t => t.address === address)
            }
        }),
        {
            name: 'solana-ai-portfolio-storage',
        }
    )
)
