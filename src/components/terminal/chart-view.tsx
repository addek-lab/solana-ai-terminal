"use client"

export function ChartView({ pairAddress }: { pairAddress?: string }) {
    if (!pairAddress) {
        return (
            <div className="flex items-center justify-center w-full h-full min-h-[500px] text-muted-foreground bg-black/20">
                Select a token to view chart
            </div>
        )
    }

    return (
        <div className="w-full h-full min-h-[600px] relative">
            <style jsx global>{`
                #dexscreener-embed {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                @media(min-width:1400px) {
                    #dexscreener-embed {
                        padding-bottom: 65%;
                    }
                }
            `}</style>
            <iframe
                src={`https://dexscreener.com/solana/${pairAddress}?embed=1&theme=dark&trades=0&info=0`}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '600px' }}
                title="DexScreener Chart"
            />
        </div>
    )
}
