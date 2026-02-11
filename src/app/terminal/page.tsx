import { ChartView } from "@/components/terminal/chart-view";
import { AIPanel } from "@/components/terminal/ai-panel";

export default function TerminalPage() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[calc(100vh-100px)]">
            {/* Chart Area */}
            <div className="md:col-span-2 bg-card rounded-xl border border-border p-4 shadow-sm relative flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Live Chart (DexScreener)</h2>
                    <div className="flex gap-2">
                        <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded">SOL/USDC</span>
                        <span className="text-xs font-mono text-green-400 px-2 py-1 bg-green-950/30 rounded border border-green-900">+5.4%</span>
                    </div>
                </div>
                <div className="flex-1 bg-background/50 rounded-lg overflow-hidden border border-border">
                    <ChartView />
                </div>
            </div>

            {/* Sidebar / Analysis */}
            <div className="md:col-span-1 space-y-6">

                {/* AI Analysis Panel */}
                <AIPanel />

                {/* RugCheck Score */}
                <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">RugCheck Security Score</h3>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center text-green-500 font-bold text-xl">
                            Good
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Mint Authority: <span className="text-red-400">Revoked</span></div>
                            <div className="text-xs text-muted-foreground">Freeze Authority: <span className="text-red-400">Revoked</span></div>
                            <div className="text-xs text-muted-foreground">Liquidity: <span className="text-green-400">Locked 100%</span></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
