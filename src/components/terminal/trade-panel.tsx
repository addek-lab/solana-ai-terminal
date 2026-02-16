import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useConnection } from "@solana/wallet-adapter-react"
import { VersionedTransaction, PublicKey } from "@solana/web3.js"
import { Loader2, Settings, ChevronDown, ChevronUp, AlertTriangle, ArrowRightLeft } from "lucide-react"
import { getQuote, getSwapTransaction } from "@/lib/jupiter-api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface TradePanelProps {
    tokenData: any
}

// SOL Mint Address
const SOL_MINT = "So11111111111111111111111111111111111111112"

export function TradePanel({ tokenData }: TradePanelProps) {
    const { publicKey, signTransaction } = useWallet()
    const { connection } = useConnection()

    // Mode State
    const [isBuying, setIsBuying] = useState(true)

    // Data State
    const [solBalance, setSolBalance] = useState<number | null>(null)
    const [tokenBalance, setTokenBalance] = useState<number | null>(null)
    const [tokenDecimals, setTokenDecimals] = useState<number>(6) // Default to 6, update on fetch

    // Form State
    const [amount, setAmount] = useState<string>("")
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

    // 1. Fetch decimals when token changes
    useEffect(() => {
        if (!tokenData?.address || !connection) return

        const fetchDecimals = async () => {
            try {
                const mint = new PublicKey(tokenData.address)
                const info = await connection.getParsedAccountInfo(mint)
                if (info.value && 'parsed' in info.value.data) {
                    setTokenDecimals(info.value.data.parsed.info.decimals)
                }
            } catch (err) {
                console.error("Failed to fetch decimals", err)
            }
        }
        fetchDecimals()
    }, [tokenData?.address, connection])

    // 2. Fetch Balances
    useEffect(() => {
        if (!connection || !publicKey) {
            setSolBalance(null)
            setTokenBalance(null)
            return
        }

        const fetchBalances = async () => {
            try {
                // SOL Balance
                const bal = await connection.getBalance(publicKey)
                setSolBalance(bal / 1_000_000_000)

                // Token Balance
                if (tokenData?.address) {
                    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
                        mint: new PublicKey(tokenData.address)
                    })
                    if (tokenAccounts.value.length > 0) {
                        setTokenBalance(tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount)
                    } else {
                        setTokenBalance(0)
                    }
                }
            } catch (err) {
                console.error("Failed to fetch balances:", err)
            }
        }

        fetchBalances()

        // Poll for updates
        const id = setInterval(fetchBalances, 10000)
        return () => clearInterval(id)
    }, [connection, publicKey, success, tokenData?.address])


    const handlePresetClick = (val: string) => {
        if (isBuying) {
            // SOL presets are direct values
            setAmount(val)
        } else {
            // Sell presets are percentages
            if (tokenBalance === null) return
            const pct = parseFloat(val) / 100
            setAmount((tokenBalance * pct).toFixed(tokenDecimals))
        }
        setError(null)
        setSuccess(null)
    }

    const handleTrade = async () => {
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
            // Define Input/Output based on Mode
            const inputMint = isBuying ? SOL_MINT : tokenData.address
            const outputMint = isBuying ? tokenData.address : SOL_MINT

            // Calculate atomic amount (lamports/units)
            const decimals = isBuying ? 9 : tokenDecimals
            const atomicAmount = Math.floor(parseFloat(amount) * Math.pow(10, decimals))

            console.log(`Trading: ${isBuying ? "Buy" : "Sell"} | In: ${inputMint} | Out: ${outputMint} | Amount: ${atomicAmount} (Decimals: ${decimals})`)

            // 1. Get Quote
            const quote = await getQuote(inputMint, outputMint, atomicAmount)

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
            setAmount("")
            // Trigger balance refresh logic via effect dep or explicit call if needed

        } catch (err: any) {
            console.error("Trade Error:", err)
            setError(err.message || "Swap failed. Try increasing slippage.")
        } finally {
            setIsLoading(false)
        }
    }

    if (!tokenData) return null

    const currentBalance = isBuying ? solBalance : tokenBalance
    const balanceLabel = isBuying ? "SOL" : tokenData.symbol

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
                        {/* Buy/Sell Toggle */}
                        <div className="grid grid-cols-2 bg-muted/30 p-1 rounded-lg">
                            <button
                                onClick={() => setIsBuying(true)}
                                className={cn(
                                    "text-sm font-bold py-2 rounded-md transition-all",
                                    isBuying ? "bg-[#00ffbd] text-black shadow-lg" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Buy
                            </button>
                            <button
                                onClick={() => setIsBuying(false)}
                                className={cn(
                                    "text-sm font-bold py-2 rounded-md transition-all",
                                    !isBuying ? "bg-red-500 text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Sell
                            </button>
                        </div>

                        {/* Amount Input */}
                        <div className={cn(
                            "bg-background/50 border rounded-lg p-3 relative focus-within:ring-1 transition-all",
                            isBuying ? "focus-within:ring-[#00ffbd]/50 border-border" : "focus-within:ring-red-500/50 border-red-500/20"
                        )}>
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">
                                    Amount ({isBuying ? "SOL" : tokenData.symbol})
                                </span>
                                <div className="flex flex-col items-end gap-0.5">
                                    <div className="flex items-center gap-1">
                                        {isBuying ? (
                                            <img src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" className="w-4 h-4 rounded-full" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full bg-secondary" />
                                            // TODO: Add token image here if available in tokenData
                                        )}
                                        <span className="text-xs font-bold text-foreground">{balanceLabel}</span>
                                    </div>
                                    {currentBalance !== null && (
                                        <button
                                            onClick={() => setAmount(isBuying ? (Math.max(0, currentBalance - 0.01)).toFixed(4) : currentBalance.toString())}
                                            className="text-[10px] text-muted-foreground hover:text-purple-400 transition-colors"
                                        >
                                            Bal: {currentBalance.toLocaleString()}
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
                            {isBuying ? (
                                ["0.1", "0.5", "1.0", "5.0"].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => handlePresetClick(val)}
                                        className="py-1.5 px-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-md text-xs font-medium transition-colors"
                                    >
                                        {val} SOL
                                    </button>
                                ))
                            ) : (
                                ["25", "50", "75", "100"].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => handlePresetClick(val)}
                                        className="py-1.5 px-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-md text-xs font-medium transition-colors"
                                    >
                                        {val}%
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Info Row */}
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
                            <div className="flex items-center gap-1.5">
                                <span>Slippage: <span className="text-foreground font-medium">Auto (0.5%)</span></span>
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
                                    <span>Advanced Strategy</span>
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

                                    <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-[10px] text-yellow-500/80">
                                        <AlertTriangle className="w-3 h-3" />
                                        Strategy is visual-only in this beta.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Trade Button Logic */}
                        <button
                            onClick={handleTrade}
                            disabled={isLoading}
                            className={cn(
                                "w-full h-12 text-black font-bold text-lg rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 shadow-[0_0_20px_rgba(0,0,0,0.2)]",
                                isLoading ? "bg-muted cursor-wait" :
                                    isBuying ? "bg-[#00ffbd] hover:bg-[#00e6aa] shadow-[0_0_20px_rgba(0,255,189,0.3)]" :
                                        "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                            )}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>{isBuying ? "Buying..." : "Selling..."}</span>
                                </>
                            ) : (
                                <span>{isBuying ? `Buy ${tokenData.symbol}` : `Sell ${tokenData.symbol}`}</span>
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
