"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PatternCardProps {
    title: string
    category: "Candlestick" | "Chart Pattern" | "Indicator"
    sentiment: "Bullish" | "Bearish" | "Neutral" | "Volatility" | "Momentum" | "Strong Trend"
    description: string
    visual: React.ReactNode
}

export function PatternCard({ title, category, sentiment, description, visual }: PatternCardProps) {
    const getSentimentColor = (sentiment: string) => {
        switch (sentiment) {
            case "Bullish": return "bg-green-500/20 text-green-500 hover:bg-green-500/30"
            case "Bearish": return "bg-red-500/20 text-red-500 hover:bg-red-500/30"
            case "Neutral": return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
            case "Volatility": return "bg-orange-500/20 text-orange-500 hover:bg-orange-500/30"
            case "Momentum": return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
            case "Strong Trend": return "bg-purple-500/20 text-purple-500 hover:bg-purple-500/30"
            default: return "bg-secondary text-secondary-foreground"
        }
    }

    return (
        <Card className="overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300 group">
            <div className="h-40 bg-secondary/20 flex items-center justify-center border-b border-border group-hover:bg-secondary/30 transition-colors">
                <div className="w-3/4 h-3/4">
                    {visual}
                </div>
            </div>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs font-mono opacity-70">
                        {category}
                    </Badge>
                    <Badge className={getSentimentColor(sentiment)}>
                        {sentiment}
                    </Badge>
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                    {description}
                </CardDescription>
            </CardContent>
        </Card>
    )
}
