"use client"

import { HelpCircle, BarChart3, Zap, ShieldCheck } from "lucide-react"

export function LandingInfo() {
    return (
        <div className="w-full max-w-5xl mx-auto mt-20 space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">

            {/* Stats / Value Prop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl">
                <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-bold">Instant Analysis</h3>
                    <p className="text-sm text-muted-foreground">AI-powered technical analysis in seconds, not hours.</p>
                </div>
                <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                        <BarChart3 className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold">Real-Time Data</h3>
                    <p className="text-sm text-muted-foreground">Live connection to on-chain data for accurate metrics.</p>
                </div>
                <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold">Risk Detection</h3>
                    <p className="text-sm text-muted-foreground">Automated logic to flag potential rug pulls and scams.</p>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground mt-2">Everything you need to know about Solana AI Terminal.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card/30 border border-border/50 rounded-xl p-6 hover:bg-card/50 transition-colors">
                        <h4 className="font-bold flex items-center gap-2 mb-2">
                            <HelpCircle className="w-4 h-4 text-purple-400" />
                            How does the AI work?
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We use advanced LLMs (Gemini 2.5 Pro) trained on crypto market patterns to analyze charts, volume, and liquidity in real-time. It acts as a professional trading assistant.
                        </p>
                    </div>

                    <div className="bg-card/30 border border-border/50 rounded-xl p-6 hover:bg-card/50 transition-colors">
                        <h4 className="font-bold flex items-center gap-2 mb-2">
                            <HelpCircle className="w-4 h-4 text-purple-400" />
                            Is it free to use?
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Yes! The core metrics and AI analysis features are currently free for all users during our beta period.
                        </p>
                    </div>

                    <div className="bg-card/30 border border-border/50 rounded-xl p-6 hover:bg-card/50 transition-colors">
                        <h4 className="font-bold flex items-center gap-2 mb-2">
                            <HelpCircle className="w-4 h-4 text-purple-400" />
                            Which tokens are supported?
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Any token on the Solana blockchain that is traded on a DEX (like Raydium or Meteora) can be analyzed. Just paste the contract address.
                        </p>
                    </div>

                    <div className="bg-card/30 border border-border/50 rounded-xl p-6 hover:bg-card/50 transition-colors">
                        <h4 className="font-bold flex items-center gap-2 mb-2">
                            <HelpCircle className="w-4 h-4 text-purple-400" />
                            Is this financial advice?
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            No. The AI provides technical analysis based on data patterns. Crypto is high-risk. Always do your own research (DYOR) before trading.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
