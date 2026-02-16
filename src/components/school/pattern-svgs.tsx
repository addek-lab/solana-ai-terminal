"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export const PatternSVGs = {
    // Candlesticks
    Hammer: () => (
        <svg viewBox="0 0 100 100" className="w-full h-full p-4">
            {/* Downtrend */}
            <line x1="10" y1="10" x2="30" y2="40" stroke="red" strokeWidth="2" strokeDasharray="4 4" />
            {/* Hammer Candle */}
            <rect x="40" y="40" width="20" height="10" fill="#00ffbd" rx="1" /> {/* Body */}
            <line x1="50" y1="50" x2="50" y2="85" stroke="#00ffbd" strokeWidth="2" /> {/* Long Lower Wick */}
            <line x1="50" y1="40" x2="50" y2="38" stroke="#00ffbd" strokeWidth="2" /> {/* Tiny Upper Wick */}
            {/* Reversal Arrow */}
            <path d="M 70 60 Q 80 50 90 20" stroke="#00ffbd" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#00ffbd" />
                </marker>
            </defs>
        </svg>
    ),
    EngulfingBullish: () => (
        <svg viewBox="0 0 100 100" className="w-full h-full p-4">
            {/* Small Red Candle */}
            <rect x="25" y="45" width="15" height="15" fill="#ef4444" rx="1" />
            <line x1="32.5" y1="45" x2="32.5" y2="40" stroke="#ef4444" strokeWidth="2" />
            <line x1="32.5" y1="60" x2="32.5" y2="65" stroke="#ef4444" strokeWidth="2" />

            {/* Large Green Candle Engulfing */}
            <rect x="50" y="35" width="20" height="35" fill="#00ffbd" rx="1" />
            <line x1="60" y1="35" x2="60" y2="30" stroke="#00ffbd" strokeWidth="2" />
            <line x1="60" y1="70" x2="60" y2="75" stroke="#00ffbd" strokeWidth="2" />
        </svg>
    ),
    Doji: () => (
        <svg viewBox="0 0 100 100" className="w-full h-full p-4">
            <line x1="20" y1="80" x2="40" y2="50" stroke="#00ffbd" strokeWidth="2" />
            {/* Doji Star */}
            <line x1="50" y1="30" x2="50" y2="70" stroke="white" strokeWidth="2" /> {/* Vertical */}
            <line x1="40" y1="50" x2="60" y2="50" stroke="white" strokeWidth="2" /> {/* Horizontal (Cross) */}

            <line x1="60" y1="50" x2="80" y2="80" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
    ),

    // Patterns
    HeadAndShoulders: () => (
        <svg viewBox="0 0 200 100" className="w-full h-full p-4">
            {/* Left Shoulder */}
            <path d="M 10 80 L 30 40 L 50 80" stroke="#00ffbd" strokeWidth="2" fill="none" />
            {/* Head */}
            <path d="M 50 80 L 80 10 L 110 80" stroke="#00ffbd" strokeWidth="2" fill="none" />
            {/* Right Shoulder */}
            <path d="M 110 80 L 130 40 L 150 80" stroke="#00ffbd" strokeWidth="2" fill="none" />
            {/* Neckline */}
            <line x1="10" y1="80" x2="190" y2="80" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
            <text x="160" y="90" fill="#ef4444" fontSize="10" fontWeight="bold">BREAK</text>
        </svg>
    ),
    DoubleBottom: () => (
        <svg viewBox="0 0 200 100" className="w-full h-full p-4">
            <path d="M 10 20 L 40 80 L 80 40 L 120 80 L 150 20" stroke="#00ffbd" strokeWidth="3" fill="none" strokeLinejoin="round" />
            {/* Neckline */}
            <line x1="10" y1="40" x2="190" y2="40" stroke="gray" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="40" cy="80" r="3" fill="#00ffbd" />
            <circle cx="120" cy="80" r="3" fill="#00ffbd" />
        </svg>
    ),
    AscendingTriangle: () => (
        <svg viewBox="0 0 200 100" className="w-full h-full p-4">
            {/* Top Resistance */}
            <line x1="50" y1="20" x2="180" y2="20" stroke="#ef4444" strokeWidth="2" />
            {/* Rising Support */}
            <line x1="50" y1="80" x2="180" y2="20" stroke="#00ffbd" strokeWidth="2" />
            {/* Price Action ZigZag */}
            <path d="M 50 80 L 80 20 L 100 60 L 130 20 L 150 40 L 180 10" stroke="white" strokeWidth="1" fill="none" />
        </svg>
    ),

    // Indicators
    RSI: () => (
        <svg viewBox="0 0 200 100" className="w-full h-full p-4">
            {/* Zones */}
            <rect x="10" y="10" width="180" height="80" fill="#ffffff" fillOpacity="0.05" />
            <line x1="10" y1="30" x2="190" y2="30" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" /> {/* 70 Overbought */}
            <line x1="10" y1="70" x2="190" y2="70" stroke="#00ffbd" strokeWidth="1" strokeDasharray="2 2" /> {/* 30 Oversold */}

            {/* RSI Line */}
            <path d="M 10 50 Q 30 80 60 70 T 110 20 T 160 30 T 190 60" stroke="#a855f7" strokeWidth="2" fill="none" />
        </svg>
    ),
    MACD: () => (
        <svg viewBox="0 0 200 100" className="w-full h-full p-4">
            {/* Histogram */}
            <rect x="20" y="50" width="10" height="10" fill="#ef4444" />
            <rect x="35" y="50" width="10" height="5" fill="#ef4444" />
            <rect x="50" y="45" width="10" height="5" fill="#00ffbd" />
            <rect x="65" y="40" width="10" height="10" fill="#00ffbd" />
            <line x1="10" y1="50" x2="190" y2="50" stroke="gray" strokeWidth="1" />

            {/* Lines */}
            <path d="M 10 60 Q 50 40 90 20 Q 140 10 190 30" stroke="#00ffbd" strokeWidth="2" fill="none" />
            <path d="M 10 55 Q 50 45 90 30 Q 140 25 190 40" stroke="#ef4444" strokeWidth="2" fill="none" />
        </svg>
    )
}
