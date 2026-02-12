"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react"

interface TransactionDialogProps {
    tokenSymbol: string
    onAddTransaction: (type: 'BUY' | 'SELL', amountSol: number, marketCap: number, date: number) => void
    trigger?: React.ReactNode
}

export function TransactionDialog({ tokenSymbol, onAddTransaction, trigger }: TransactionDialogProps) {
    const [open, setOpen] = useState(false)
    const [type, setType] = useState<'BUY' | 'SELL'>('BUY')
    const [amountSol, setAmountSol] = useState('')
    const [marketCap, setMarketCap] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!amountSol || !marketCap) return

        onAddTransaction(
            type,
            parseFloat(amountSol),
            parseFloat(marketCap),
            new Date(date).getTime()
        )
        setOpen(false)
        setAmountSol('')
        setMarketCap('')
        setDate(new Date().toISOString().split('T')[0])
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Transaction
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Transaction for {tokenSymbol}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                    {/* Type Toggle */}
                    <div className="grid grid-cols-2 gap-2 bg-secondary/50 p-1 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setType('BUY')}
                            className={`flex items-center justify-center gap-2 py-2 rounded-md font-medium transition-all ${type === 'BUY'
                                    ? 'bg-green-500/20 text-green-500 shadow-sm'
                                    : 'text-muted-foreground hover:bg-secondary'
                                }`}
                        >
                            <TrendingUp className="w-4 h-4" />
                            Buy
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('SELL')}
                            className={`flex items-center justify-center gap-2 py-2 rounded-md font-medium transition-all ${type === 'SELL'
                                    ? 'bg-red-500/20 text-red-500 shadow-sm'
                                    : 'text-muted-foreground hover:bg-secondary'
                                }`}
                        >
                            <TrendingDown className="w-4 h-4" />
                            Sell
                        </button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">SOL Amount {type === 'BUY' ? 'Invested' : 'Received'}</label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="e.g. 1.5"
                            value={amountSol}
                            onChange={(e) => setAmountSol(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Market Cap ($)</label>
                        <Input
                            type="number"
                            step="1000"
                            placeholder="e.g. 150000"
                            value={marketCap}
                            onChange={(e) => setMarketCap(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full mt-4" disabled={!amountSol || !marketCap}>
                        Add {type === 'BUY' ? 'Buy' : 'Sell'} Record
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
