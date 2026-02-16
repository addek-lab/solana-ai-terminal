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
    ShootingStar: () => (
        <svg viewBox="0 0 100 100" className="w-full h-full p-4">
            {/* Uptrend */}
            <line x1="10" y1="90" x2="30" y2="60" stroke="#00ffbd" strokeWidth="2" strokeDasharray="4 4" />
            {/* Shooting Star Candle */}
            <rect x="40" y="50" width="20" height="10" fill="#ef4444" rx="1" /> {/* Body */}
            <line x1="50" y1="50" x2="50" y2="15" stroke="#ef4444" strokeWidth="2" /> {/* Long Upper Wick */}
            <line x1="50" y1="60" x2="50" y2="62" stroke="#ef4444" strokeWidth="2" /> {/* Tiny Lower Wick */}
            {/* Reversal Arrow */}
            <path d="M 70 40 Q 80 50 90 80" stroke="#ef4444" strokeWidth="2" fill="none" markerEnd="url(#arrowhead-red)" />
            <defs>
                <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                </marker>
            </defs>
        </svg>
    ),
    MorningStar: () => (
        <svg viewBox="0 0 100 100" className="w-full h-full p-4">
            {/* 1. Large Red */}
            <rect x="10" y="20" width="20" height="50" fill="#ef4444" rx="1" />
            <line x1="20" y1="20" x2="20" y2="10" stroke="#ef4444" strokeWidth="2" />
            <line x1="20" y1="70" x2="20" y2="75" stroke="#ef4444" strokeWidth="2" />

            {/* 2. Small Doji/Star (Gap Down) */}
            <rect x="40" y="75" width="20" height="10" fill="gray" rx="1" />
            <line x1="50" y1="75" x2="50" y2="70" stroke="gray" strokeWidth="2" />
            <line x1="50" y1="85" x2="50" y2="90" stroke="gray" strokeWidth="2" />

            {/* 3. Large Green (Gap Up) */}
            <rect x="70" y="25" width="20" height="45" fill="#00ffbd" rx="1" />
            <line x1="80" y1="25" x2="80" y2="15" stroke="#00ffbd" strokeWidth="2" />
            <line x1="80" y1="70" x2="80" y2="75" stroke="#00ffbd" strokeWidth="2" />
        </svg>
    ),
    EngulfingBearish: () => (
        <svg viewBox="0 0 100 100" className="w-full h-full p-4">
            {/* Small Green Candle */}
            <rect x="25" y="45" width="15" height="15" fill="#00ffbd" rx="1" />
            <line x1="32.5" y1="45" x2="32.5" y2="40" stroke="#00ffbd" strokeWidth="2" />
            <line x1="32.5" y1="60" x2="32.5" y2="65" stroke="#00ffbd" strokeWidth="2" />

            {/* Large Red Candle Engulfing */}
            <rect x="50" y="35" width="20" height="35" fill="#ef4444" rx="1" />
            <line x1="60" y1="35" x2="60" y2="30" stroke="#ef4444" strokeWidth="2" />
            <line x1="60" y1="70" x2="60" y2="75" stroke="#ef4444" strokeWidth="2" />
        </svg>
    ),
    ThreeWhiteSoldiers: () => (
        <svg viewBox="0 0 100 100" className="w-full h-full p-4">
            {/* 1 */}
            <rect x="20" y="60" width="15" height="25" fill="#00ffbd" rx="1" />
            <line x1="27.5" y1="60" x2="27.5" y2="55" stroke="#00ffbd" strokeWidth="2" />

            {/* 2 */}
            <rect x="42.5" y="45" width="15" height="25" fill="#00ffbd" rx="1" />
            <line x1="50" y1="45" x2="50" y2="40" stroke="#00ffbd" strokeWidth="2" />

            {/* 3 */}
            <rect x="65" y="30" width="15" height="25" fill="#00ffbd" rx="1" />
            <line x1="72.5" y1="30" x2="72.5" y2="25" stroke="#00ffbd" strokeWidth="2" />
        </svg>
    ),
    ThreeBlackCrows: () => (
        <svg viewBox="0 0 100 100" className="w-full h-full p-4">
            {/* 1 */}
            <rect x="20" y="20" width="15" height="25" fill="#ef4444" rx="1" />
            <line x1="27.5" y1="45" x2="27.5" y2="50" stroke="#ef4444" strokeWidth="2" />

            {/* 2 */}
            <rect x="42.5" y="35" width="15" height="25" fill="#ef4444" rx="1" />
            <line x1="50" y1="60" x2="50" y2="65" stroke="#ef4444" strokeWidth="2" />

            {/* 3 */}
            <rect x="65" y="50" width="15" height="25" fill="#ef4444" rx="1" />
            <line x1="72.5" y1="75" x2="72.5" y2="80" stroke="#ef4444" strokeWidth="2" />
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
    DoubleTop: () => (
        <svg viewBox="0 0 200 100" className="w-full h-full p-4">
            <path d="M 10 80 L 40 20 L 80 60 L 120 20 L 150 80" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinejoin="round" />
            {/* Neckline */}
            <line x1="10" y1="60" x2="190" y2="60" stroke="gray" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="40" cy="20" r="3" fill="#ef4444" />
            <circle cx="120" cy="20" r="3" fill="#ef4444" />
        </svg>
    ),
    BullFlag: () => (
        <svg viewBox="0 0 200 100" className="w-full h-full p-4">
            {/* Pole */}
            <line x1="20" y1="90" x2="50" y2="20" stroke="#00ffbd" strokeWidth="3" />
            {/* Flag Channel */}
            <line x1="50" y1="20" x2="120" y2="40" stroke="white" strokeWidth="2" />
            <line x1="50" y1="40" x2="120" y2="60" stroke="white" strokeWidth="2" />
            {/* Consolidation */}
            <path d="M 50 20 L 60 50 L 70 30 L 80 50 L 90 35 L 100 55" stroke="gray" strokeWidth="1" fill="none" />
            {/* Breakout */}
            <line x1="120" y1="45" x2="160" y2="10" stroke="#00ffbd" strokeWidth="3" markerEnd="url(#arrowhead)" />
        </svg>
    ),
    CupAndHandle: () => (
        <svg viewBox="0 0 200 100" className="w-full h-full p-4">
            {/* Cup */}
            <path d="M 20 20 Q 20 80 100 80 Q 150 80 150 20" stroke="#00ffbd" strokeWidth="2" fill="none" />
            {/* Handle */}
            <path d="M 150 20 L 170 40 L 180 30" stroke="#00ffbd" strokeWidth="2" fill="none" />
            {/* Breakout Line */}
            <line x1="20" y1="20" x2="180" y2="20" stroke="gray" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
    ),
    FallingWedge: () => (
        <svg viewBox="0 0 200 100" className="w-full h-full p-4">
            {/* Upper Trendline (Steep down) */}
            <line x1="20" y1="10" x2="140" y2="60" stroke="#ef4444" strokeWidth="2" />
            {/* Lower Trendline (Shallow down) */}
            <line x1="20" y1="50" x2="140" y2="80" stroke="#00ffbd" strokeWidth="2" />
            {/* Price Action bouncing inside */}
            <path d="M 30 20 L 50 60 L 70 35 L 90 70 L 110 50 L 130 75" stroke="white" strokeWidth="1" fill="none" />
            {/* Breakout */}
            <line x1="130" y1="55" x2="160" y2="20" stroke="#00ffbd" strokeWidth="3" markerEnd="url(#arrowhead)" />
        </svg>
    ),
    RisingWedge: () => (
        <svg viewBox="0 0 200 100" className="w-full h-full p-4">
            {/* Upper Trendline (Shallow up) */}
            <line x1="20" y1="80" x2="140" y2="40" stroke="#ef4444" strokeWidth="2" />
            {/* Lower Trendline (Steep up) */}
            <line x1="20" y1="90" x2="140" y2="50" stroke="#00ffbd" strokeWidth="2" />
            {/* Price Action bouncing inside */}
            <path d="M 30 85 L 50 82 L 70 60 L 90 75 L 110 55 L 130 65" stroke="white" strokeWidth="1" fill="none" />
            {/* Breakdown */}
            <line x1="130" y1="65" x2="160" y2="90" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowhead-red)" />
        </svg>
    ),
    Pennant: () => (
        <svg viewBox="0 0 200 100" className="w-full h-full p-4">
            {/* Pole */}
            <line x1="20" y1="90" x2="50" y2="20" stroke="#00ffbd" strokeWidth="3" />
            {/* Converging Lines */}
            <line x1="50" y1="20" x2="130" y2="50" stroke="gray" strokeWidth="2" />
            <line x1="50" y1="80" x2="130" y2="50" stroke="gray" strokeWidth="2" />
            {/* Price Action */}
            <path d="M 50 20 L 70 70 L 90 35 L 110 60 L 125 50" stroke="white" strokeWidth="1" fill="none" />
            {/* Breakout */}
            <line x1="125" y1="50" x2="160" y2="10" stroke="#00ffbd" strokeWidth="3" markerEnd="url(#arrowhead)" />
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
    ),
    BollingerBands: () => (
        <svg viewBox="0 0 200 100" className="w-full h-full p-4">
            {/* Upper Band */}
            <path d="M 10 40 Q 50 20 100 20 T 190 30" stroke="#3b82f6" strokeWidth="1" fill="none" opacity="0.5" />
            {/* Lower Band */}
            <path d="M 10 70 Q 50 90 100 90 T 190 80" stroke="#3b82f6" strokeWidth="1" fill="none" opacity="0.5" />
            {/* Middle SMA */}
            <path d="M 10 55 Q 50 55 100 55 T 190 55" stroke="#eab308" strokeWidth="1" strokeDasharray="4 4" fill="none" />
            {/* Price Action */}
            <path d="M 10 55 L 30 30 L 50 80 L 80 40 L 120 70 L 160 30 L 190 55" stroke="white" strokeWidth="2" fill="none" />
            {/* Fill */}
            <path d="M 10 40 Q 50 20 100 20 T 190 30 L 190 80 Q 150 90 100 90 T 10 70 Z" fill="#3b82f6" fillOpacity="0.1" />
        </svg>
    ),
    MovingAverages: () => (
        <svg viewBox="0 0 200 100" className="w-full h-full p-4">
            {/* Slow MA (200) */}
            <path d="M 10 80 Q 100 70 190 60" stroke="#ef4444" strokeWidth="2" fill="none" />
            {/* Fast MA (50) */}
            <path d="M 10 70 Q 50 80 100 50 T 190 20" stroke="#00ffbd" strokeWidth="2" fill="none" />
            {/* Crossover Point Highlight */}
            <circle cx="155" cy="45" r="4" fill="white" fillOpacity="0.5" />
        </svg>
    ),
    Fibonacci: () => (
        <svg viewBox="0 0 200 100" className="w-full h-full p-4">
            {/* Trend */}
            <line x1="20" y1="80" x2="180" y2="20" stroke="#white" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
            {/* Levels */}
            <line x1="100" y1="20" x2="180" y2="20" stroke="#ef4444" strokeWidth="1" /> <text x="185" y="22" fontSize="6" fill="gray">0 (High)</text>
            <line x1="100" y1="35" x2="180" y2="35" stroke="#ef4444" strokeWidth="1" /> <text x="185" y="37" fontSize="6" fill="gray">0.236</text>
            <line x1="100" y1="45" x2="180" y2="45" stroke="yellow" strokeWidth="1" /> <text x="185" y="47" fontSize="6" fill="gray">0.382</text>
            <line x1="100" y1="55" x2="180" y2="55" stroke="#00ffbd" strokeWidth="1" /> <text x="185" y="57" fontSize="6" fill="gray">0.5</text>
            <line x1="100" y1="65" x2="180" y2="65" stroke="#00ffbd" strokeWidth="1" /> <text x="185" y="67" fontSize="6" fill="gray">0.618</text>
            <line x1="100" y1="80" x2="180" y2="80" stroke="#ef4444" strokeWidth="1" /> <text x="185" y="82" fontSize="6" fill="gray">1 (Low)</text>
        </svg>
    ),
    Stochastic: () => (
        <svg viewBox="0 0 200 100" className="w-full h-full p-4">
            {/* Zones */}
            <rect x="10" y="20" width="180" height="60" fill="#ffffff" fillOpacity="0.05" />
            <line x1="10" y1="30" x2="190" y2="30" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" /> {/* 80 Overbought */}
            <line x1="10" y1="70" x2="190" y2="70" stroke="#00ffbd" strokeWidth="1" strokeDasharray="2 2" /> {/* 20 Oversold */}

            {/* %K Line (Fast) */}
            <path d="M 10 60 Q 50 80 90 20 Q 140 10 190 70" stroke="#3b82f6" strokeWidth="2" fill="none" />
            {/* %D Line (Slow) */}
            <path d="M 10 65 Q 50 75 90 30 Q 140 20 190 65" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" fill="none" />
        </svg>
    )
}
