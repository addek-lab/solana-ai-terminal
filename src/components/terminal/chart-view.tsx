"use client"

import { useEffect, useRef } from "react"
import { createChart, ColorType, CandlestickSeries } from "lightweight-charts"

export function ChartView({ symbol = "SOL/USDC" }) {
    const chartContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!chartContainerRef.current) return

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: "transparent" },
                textColor: "#9ca3af",
            },
            grid: {
                vertLines: { color: "rgba(42, 46, 57, 0.2)" },
                horzLines: { color: "rgba(42, 46, 57, 0.2)" },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
        })

        const newSeries = chart.addSeries(CandlestickSeries, {
            upColor: "#22c55e",
            downColor: "#ef4444",
            borderVisible: false,
            wickUpColor: "#22c55e",
            wickDownColor: "#ef4444",
        })

        // Mock Data (Replace with real DexScreener API call)
        const data = [
            { time: "2018-12-22", open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
            { time: "2018-12-23", open: 45.12, high: 53.90, low: 45.12, close: 48.09 },
            { time: "2018-12-24", open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
            { time: "2018-12-25", open: 68.26, high: 68.26, low: 59.04, close: 60.50 },
            { time: "2018-12-26", open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
            { time: "2018-12-27", open: 91.04, high: 121.40, low: 82.70, close: 111.40 },
            { time: "2018-12-28", open: 111.51, high: 142.83, low: 103.34, close: 131.25 },
            { time: "2018-12-29", open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
            { time: "2018-12-30", open: 106.33, high: 110.20, low: 90.39, close: 98.10 },
            { time: "2018-12-31", open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
        ]

        // @ts-ignore
        newSeries.setData(data)

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth })
            }
        }

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
            chart.remove()
        }
    }, [symbol])

    return (
        <div className="w-full h-full min-h-[400px]" ref={chartContainerRef} id="trading-chart" />
    )
}
