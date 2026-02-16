"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatternCard } from "@/components/school/pattern-card"
import { PatternSVGs } from "@/components/school/pattern-svgs"
import { Separator } from "@/components/ui/separator"
import { BookOpen, TrendingUp, Activity, BarChart2 } from "lucide-react"

export default function TradingSchoolPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <div className="py-12 bg-gradient-to-b from-background to-secondary/10 border-b border-border">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4 border border-primary/20">
                        <BookOpen className="w-4 h-4" />
                        Trading Academy
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-6 tracking-tight">
                        Master the Charts
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Learn the technical patterns used by pro traders to identify reversals, continuations, and market sentiment.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <Tabs defaultValue="candlesticks" className="space-y-12">
                    <div className="flex justify-center">
                        <TabsList className="grid grid-cols-3 w-full max-w-md bg-secondary/50 p-1">
                            <TabsTrigger value="candlesticks" className="text-sm md:text-base font-bold">Candlesticks</TabsTrigger>
                            <TabsTrigger value="patterns" className="text-sm md:text-base font-bold">Patterns</TabsTrigger>
                            <TabsTrigger value="indicators" className="text-sm md:text-base font-bold">Indicators</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Candlesticks Tab */}
                    <TabsContent value="candlesticks" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                                <BarChart2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Candlestick Patterns</h2>
                                <p className="text-muted-foreground">Single and multi-candle formations that signal immediate price direction.</p>
                            </div>
                        </div>
                        <Separator className="mb-8" />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <PatternCard
                                title="Hammer"
                                category="Candlestick"
                                sentiment="Bullish"
                                description="A single candle with a small body at the top and a long lower wick. It indicates that sellers pushed price down, but buyers rejected the low and pushed it back up. Strong reversal signal at support."
                                visual={<PatternSVGs.Hammer />}
                            />
                            <PatternCard
                                title="Shooting Star"
                                category="Candlestick"
                                sentiment="Bearish"
                                description="The inverse of a Hammer, appearing at the top of an uptrend. A long upper wick showing buyers pushed up but were rejected by sellers. Signals a potential top."
                                visual={<PatternSVGs.ShootingStar />}
                            />
                            <PatternCard
                                title="Bullish Engulfing"
                                category="Candlestick"
                                sentiment="Bullish"
                                description="A two-candle pattern where a small red candle is completely 'engulfed' by a larger green candle. This shows a decisive shift in momentum from sellers to buyers."
                                visual={<PatternSVGs.EngulfingBullish />}
                            />
                            <PatternCard
                                title="Bearish Engulfing"
                                category="Candlestick"
                                sentiment="Bearish"
                                description="A top reversal pattern where a small green candle is followed by a large red candle that completely eclipses it. Signals that bears have taken control."
                                visual={<PatternSVGs.EngulfingBearish />}
                            />
                            <PatternCard
                                title="Morning Star"
                                category="Candlestick"
                                sentiment="Bullish"
                                description="A three-candle pattern: A large red candle, a small-bodied candle (indecision), and a large green candle. A powerful reversal signal often found at bottoms."
                                visual={<PatternSVGs.MorningStar />}
                            />
                            <PatternCard
                                title="Three White Soldiers"
                                category="Candlestick"
                                sentiment="Bullish"
                                description="Three consecutive long green candles with higher closes. Indicates very strong buying pressure and a reliable reversal from a downtrend."
                                visual={<PatternSVGs.ThreeWhiteSoldiers />}
                            />
                            <PatternCard
                                title="Three Black Crows"
                                category="Candlestick"
                                sentiment="Bearish"
                                description="Three consecutive long red candles with lower closes. Indicates very strong selling pressure and a reliable reversal from an uptrend."
                                visual={<PatternSVGs.ThreeBlackCrows />}
                            />
                            <PatternCard
                                title="Doji"
                                category="Candlestick"
                                sentiment="Neutral"
                                description="A candle with virtually no body, meaning open and close prices are the same. It represents indecision in the market and can often precede a reversal or big move."
                                visual={<PatternSVGs.Doji />}
                            />
                        </div>
                    </TabsContent>

                    {/* Chart Patterns Tab */}
                    <TabsContent value="patterns" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Chart Patterns</h2>
                                <p className="text-muted-foreground">Larger formations that play out over time, signaling trend continuations or reversals.</p>
                            </div>
                        </div>
                        <Separator className="mb-8" />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <PatternCard
                                title="Head & Shoulders"
                                category="Chart Pattern"
                                sentiment="Bearish"
                                description="A reversal pattern with three peaks: a higher middle peak (head) and two lower side peaks (shoulders). A break below the 'neckline' confirms the reversal to the downside."
                                visual={<PatternSVGs.HeadAndShoulders />}
                            />
                            <PatternCard
                                title="Double Bottom"
                                category="Chart Pattern"
                                sentiment="Bullish"
                                description="A 'W' shaped pattern where price tests a low twice and fails to break lower. It indicates strong support and often leads to a bullish reversal."
                                visual={<PatternSVGs.DoubleBottom />}
                            />
                            <PatternCard
                                title="Double Top"
                                category="Chart Pattern"
                                sentiment="Bearish"
                                description="An 'M' shaped pattern where price tests a high twice and fails to break higher. A break below the support level signals a trend reversal."
                                visual={<PatternSVGs.DoubleTop />}
                            />
                            <PatternCard
                                title="Ascending Triangle"
                                category="Chart Pattern"
                                sentiment="Bullish"
                                description="A continuation pattern with a flat resistance line and rising support line. Buyers are getting more aggressive, pushing lows higher until price breakouts upwards."
                                visual={<PatternSVGs.AscendingTriangle />}
                            />
                            <PatternCard
                                title="Bull Flag"
                                category="Chart Pattern"
                                sentiment="Bullish"
                                description="A continuation pattern with a sharp price rise (pole) followed by a channel of consolidation (flag). Breakouts usually continue the previous trend."
                                visual={<PatternSVGs.BullFlag />}
                            />
                            <PatternCard
                                title="Cup and Handle"
                                category="Chart Pattern"
                                sentiment="Bullish"
                                description="A bullish continuation pattern resembling a cup with a handle. The handle is a final consolidation before the price breaks out to new highs."
                                visual={<PatternSVGs.CupAndHandle />}
                            />
                            <PatternCard
                                title="Falling Wedge"
                                category="Chart Pattern"
                                sentiment="Bullish"
                                description="A bullish pattern where price consolidation is narrowing but tilting downwards. It suggests selling pressure is waning and a breakout to the upside is imminent."
                                visual={<PatternSVGs.FallingWedge />}
                            />
                            <PatternCard
                                title="Rising Wedge"
                                category="Chart Pattern"
                                sentiment="Bearish"
                                description="A bearish pattern where price consolidation is narrowing and tilting upwards. It suggests buying pressure is fading and a breakdown is likely."
                                visual={<PatternSVGs.RisingWedge />}
                            />
                            <PatternCard
                                title="Bullish Pennant"
                                category="Chart Pattern"
                                sentiment="Bullish"
                                description="A small symmetrical triangle following a sharp move up (pole). Brief consolidation before the trend continues in the same direction."
                                visual={<PatternSVGs.Pennant />}
                            />
                        </div>
                    </TabsContent>

                    {/* Indicators Tab */}
                    <TabsContent value="indicators" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                                <Activity className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Technical Indicators</h2>
                                <p className="text-muted-foreground">Mathematical calculations based on price and volume to forecast market direction.</p>
                            </div>
                        </div>
                        <Separator className="mb-8" />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <PatternCard
                                title="Relative Strength Index (RSI)"
                                category="Indicator"
                                sentiment="Neutral"
                                description="A momentum oscillator measuring the speed of price movements. RSI > 70 is 'Overbought' (potential sell), and RSI < 30 is 'Oversold' (potential buy). Divergence is a key signal."
                                visual={<PatternSVGs.RSI />}
                            />
                            <PatternCard
                                title="MACD"
                                category="Indicator"
                                sentiment="Neutral"
                                description="Moving Average Convergence Divergence. Shows the relationship between two moving averages. Crossovers of the signal line and histogram flips are used as buy/sell signals."
                                visual={<PatternSVGs.MACD />}
                            />
                            <PatternCard
                                title="Bollinger Bands"
                                category="Indicator"
                                sentiment="Neutral"
                                description="Consists of a moving average and two standard deviation bands. Price touching the upper band indicates overbought, while touching the lower indicating oversold. Squeezes signal explosive moves."
                                visual={<PatternSVGs.BollingerBands />}
                            />
                            <PatternCard
                                title="Moving Averages (SMA/EMA)"
                                category="Indicator"
                                sentiment="Neutral"
                                description="Smooths out price data to identify the trend direction. Crosses (like the Golden Cross or Death Cross) are major long-term signals. 50 and 200 periods are standard."
                                visual={<PatternSVGs.MovingAverages />}
                            />
                            <PatternCard
                                title="Fibonacci Retracement"
                                category="Indicator"
                                sentiment="Neutral"
                                description="Horizontal lines indicating where support and resistance are likely to occur. Key levels are 38.2%, 50%, and 61.8% of the previous move."
                                visual={<PatternSVGs.Fibonacci />}
                            />
                            <PatternCard
                                title="Stochastic Oscillator"
                                category="Indicator"
                                sentiment="Neutral"
                                description="A momentum indicator comparing a particular closing price to a range of prices over time. Signals overbought/oversold conditions, similar to RSI but faster."
                                visual={<PatternSVGs.Stochastic />}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
