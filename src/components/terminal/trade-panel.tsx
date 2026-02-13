"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useConnection } from "@solana/wallet-adapter-react"
import { VersionedTransaction } from "@solana/web3.js"
import { Loader2, Settings, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react"
import { getQuote, getSwapTransaction } from "@/lib/jupiter-api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

interface TradePanelProps {
    tokenData: any
}

// SOL Mint Address
const SOL_MINT = "So11111111111111111111111111111111111111112"

export function TradePanel({ tokenData }: TradePanelProps) {
    const { publicKey, signTransaction } = useWallet()
    const { connection } = useConnection()

    // State
    const [amount, setAmount] = useState<string>("")
    const [balance, setBalance] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [showAdvanced, setShowAdvanced] = useState(false)

    // Advanced Strategy State (Visual Only for now)
    const [stopLoss, setStopLoss] = useState<string>("-8")
    const [takeProfit1, setTakeProfit1] = useState<string>("+20")
    const [takeProfit2, setTakeProfit2] = useState<string>("+70")
    const [tp1Amount, setTp1Amount] = useState<string>("50")
    const [tp2Amount, setTp2Amount] = useState<string>("50")

    // Fetch SOL Balance
    useEffect(() => {
        if (!connection || !publicKey) {
            setBalance(null)
            return
        }

        const fetchBalance = async () => {
            try {
                const bal = await connection.getBalance(publicKey)
                setBalance(bal / 1_000_000_000)
            } catch (err) {
                console.error("Failed to fetch balance:", err)
            }
        }

        fetchBalance()

        // Subscribe to account changes for real-time updates
        const id = connection.onAccountChange(publicKey, (accountInfo) => {
            setBalance(accountInfo.lamports / 1_000_000_000)
        })

        return () => {
            connection.removeAccountChangeListener(id)
        }
    }, [connection, publicKey, success])


    const handlePresetClick = (val: string) => {
        setAmount(val)
        setError(null)
        setSuccess(null)
    }

    const handleBuy = async () => {
        if (!publicKey || !signTransaction) {
            setError("Please connect your wallet first")
            return
        }

        if (!tokenData || !tokenData.address) {
            setError("Invalid token data")
            return
        }

        if (!amount || parseFloat(amount) <= 0) {
            setError("Please enter a valid amount")
            return
        }

        setIsLoading(true)
        setError(null)
        setSuccess(null)

        try {
            // 1. Get Quote
            const lamports = parseFloat(amount) * 1_000_000_000
            const quote = await getQuote(SOL_MINT, tokenData.address, lamports)

            if (!quote || quote.error) {
                throw new Error(quote.error || "Failed to get quote")
            }

            // 2. Get Transaction
            const swapTransaction = await getSwapTransaction(quote, publicKey.toString())

            if (!swapTransaction) {
                throw new Error("Failed to create transaction")
            }

            // 3. Deserialize and Sign
            const swapTransactionBuf = Buffer.from(swapTransaction, "base64")
            const transaction = VersionedTransaction.deserialize(swapTransactionBuf)

            const signedTransaction = await signTransaction(transaction)

            // 4. Send Transaction
            const rawTransaction = signedTransaction.serialize()
            const txid = await connection.sendRawTransaction(rawTransaction, {
                skipPreflight: true,
                maxRetries: 2
            })

            // 5. Confirm
            const confirmation = await connection.confirmTransaction(txid, "confirmed")

            if (confirmation.value.err) {
                throw new Error("Transaction failed on-chain")
            }

            setSuccess(`Success! TX: ${txid.slice(0, 8)}...`)
            setAmount("") // Reset amount on success

        } catch (err: any) {
            console.error("Trade Error:", err)
            setError(err.message || "Swap failed")
        } finally {
            setIsLoading(false)
        }
    }

    if (!tokenData) return null

    return (
        <div className="w-full bg-card border border-border rounded-xl p-4 flex flex-col gap-4">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between">
                <Tabs defaultValue="market" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1">
                        <TabsTrigger value="market" className="text-xs font-medium">Market</TabsTrigger>
                        <TabsTrigger value="limit" className="text-xs font-medium relative">
                            Limit
                            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="adv" className="text-xs font-medium text-muted-foreground/50 cursor-not-allowed">Adv.</TabsTrigger>
                    </TabsList>

                    <TabsContent value="limit" className="pt-4">
                        <div className="text-center py-8 text-muted-foreground text-sm flex flex-col items-center gap-2">
                            <Settings className="w-6 h-6 animate-spin-slow" />
                            <span>Limit Orders Coming Soon</span>
                        </div>
                    </TabsContent>

                    <TabsContent value="market" className="space-y-4 pt-2">
                        {/* Amount Input */}
                        <div className="bg-background/50 border border-border rounded-lg p-3 relative focus-within:ring-1 focus-within:ring-purple-500/50 transition-all">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">Amount (SOL)</span>
                                <div className="flex flex-col items-end gap-0.5">
                                    <div className="flex items-center gap-1">
                                        <img src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" className="w-4 h-4 rounded-full" />
                                        <span className="text-xs font-bold text-foreground">SOL</span>
                                    </div>
                                    {balance !== null && (
                                        <button
                                            onClick={() => setAmount((Math.max(0, balance - 0.01)).toFixed(4))}
                                            className="text-[10px] text-muted-foreground hover:text-purple-400 transition-colors"
                                        >
                                            Bal: {balance.toFixed(4)}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2 items-end">
                                <input
                                    type="number"
                                    placeholder="0.0"
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value)
                                        setError(null)
                                        setSuccess(null)
                                    }}
                                    className="bg-transparent border-none outline-none text-2xl font-bold w-full placeholder:text-muted-foreground/30"
                                />
                            </div>
                        </div>

                        {/* Presets */}
                        <div className="grid grid-cols-4 gap-2">
                            {["0.01", "0.1", "0.5", "1.0"].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => handlePresetClick(val)}
                                    className="py-1.5 px-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-md text-xs font-medium transition-colors"
                                >
                                    {val}
                                </button>
                            ))}
                        </div>

                        {/* Info Row */}
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
                            <div className="flex items-center gap-1.5">
                                <span>Slippage: <span className="text-foreground font-medium">0.5%</span></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span>Priority: <span className="text-green-400 font-medium">Turbo</span></span>
                            </div>
                        </div>


                        {/* Advanced Strategy Toggle */}
                        <div className="border border-border/50 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="w-full flex items-center justify-between p-3 bg-secondary/20 hover:bg-secondary/30 transition-colors text-xs font-medium"
                            >
                                <div className="flex items-center gap-2">
                                    <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} />
                                    <span>Advanced Trading Strategy</span>
                                </div>
                                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {showAdvanced && (
                                <div className="p-3 space-y-3 bg-background/50 border-t border-border/50 animate-in slide-in-from-top-2">
                                    {/* Stop Loss */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-card border border-border rounded p-2">
                                            <span className="text-[10px] text-muted-foreground block mb-1">Stop Loss %</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-red-400 text-sm">↓</span>
                                                <input type="text" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} className="w-full bg-transparent border-none outline-none text-sm font-medium" />
                                            </div>
                                        </div>
                                        <div className="bg-card border border-border rounded p-2 opacity-50 cursor-not-allowed">
                                            <span className="text-[10px] text-muted-foreground block mb-1">Amount %</span>
                                            <div className="text-sm font-medium">100%</div>
                                        </div>
                                    </div>

                                    {/* Take Profit 1 */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-card border border-border rounded p-2">
                                            <span className="text-[10px] text-muted-foreground block mb-1">TP 1 %</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-green-400 text-sm">↑</span>
                                                <input type="text" value={takeProfit1} onChange={(e) => setTakeProfit1(e.target.value)} className="w-full bg-transparent border-none outline-none text-sm font-medium" />
                                            </div>
                                        </div>
                                        <div className="bg-card border border-border rounded p-2">
                                            <span className="text-[10px] text-muted-foreground block mb-1">Amount %</span>
                                            <input type="text" value={tp1Amount} onChange={(e) => setTp1Amount(e.target.value)} className="w-full bg-transparent border-none outline-none text-sm font-medium" />
                                        </div>
                                    </div>

                                    {/* Take Profit 2 */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-card border border-border rounded p-2">
                                            <span className="text-[10px] text-muted-foreground block mb-1">TP 2 %</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-green-400 text-sm">↑</span>
                                                <input type="text" value={takeProfit2} onChange={(e) => setTakeProfit2(e.target.value)} className="w-full bg-transparent border-none outline-none text-sm font-medium" />
                                            </div>
                                        </div>
                                        <div className="bg-card border border-border rounded p-2">
                                            <span className="text-[10px] text-muted-foreground block mb-1">Amount %</span>
                                            <input type="text" value={tp2Amount} onChange={(e) => setTp2Amount(e.target.value)} className="w-full bg-transparent border-none outline-none text-sm font-medium" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-[10px] text-yellow-500/80">
                                        <AlertTriangle className="w-3 h-3" />
                                        Strategy is visual-only in this beta.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Buy Button */}
                        <button
                            onClick={handleBuy}
                            disabled={isLoading}
                            className="w-full h-12 bg-[#00ffbd] hover:bg-[#00e6aa] disabled:bg-[#00ffbd]/50 text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(0,255,189,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Swapping...</span>
                                </>
                            ) : (
                                <span>Buy {tokenData.symbol}</span>
                            )}
                        </button>

                        {/* Status Messages */}
                        {error && (
                            <div className="text-xs text-red-400 text-center bg-red-500/10 p-2 rounded border border-red-500/20">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="text-xs text-green-400 text-center bg-green-500/10 p-2 rounded border border-green-500/20">
                                {success}
                            </div>
                        )}

                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
