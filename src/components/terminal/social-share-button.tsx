"use client"

import { useState } from "react"
import { Share2, Twitter, Loader2, Check } from "lucide-react"
import html2canvas from "html2canvas"

interface SocialShareButtonProps {
    tokenSymbol?: string
    variant?: "icon" | "full"
}

export function SocialShareButton({ tokenSymbol = "SOL", variant = "icon" }: SocialShareButtonProps) {
    const [isSharing, setIsSharing] = useState(false)
    const [hasCopied, setHasCopied] = useState(false)

    const handleShare = async () => {
        setIsSharing(true)

        try {
            // 1. Select the dashboard element
            const element = document.getElementById("terminal-content") || document.body

            if (!element) throw new Error("Could not find element to capture")

            // 2. Capture with html2canvas (including watermark)
            // Fix: explicit cast options to any to allow 'scale'
            const options: any = {
                useCORS: true,
                scale: 2,
                backgroundColor: "#09090b",
                onclone: (clonedDoc: Document) => {
                    const watermark = clonedDoc.createElement("div")
                    watermark.style.position = "absolute"
                    watermark.style.bottom = "20px"
                    watermark.style.right = "20px"
                    watermark.style.zIndex = "9999"
                    watermark.style.opacity = "0.9"
                    watermark.style.pointerEvents = "none"
                    watermark.style.display = "flex"
                    watermark.style.alignItems = "center"
                    watermark.style.gap = "8px"
                    watermark.style.padding = "8px 12px"
                    watermark.style.background = "rgba(0,0,0,0.8)"
                    watermark.style.borderRadius = "8px"
                    watermark.style.border = "1px solid rgba(255,255,255,0.1)"
                    watermark.style.fontFamily = "Inter, sans-serif"

                    watermark.innerHTML = `
                        <div style="width: 20px; height: 20px; background: linear-gradient(135deg, #9945FF 0%, #14F195 100%); border-radius: 50%;"></div>
                        <div style="display: flex; flex-direction: column;">
                            <span style="font-size: 12px; font-weight: 700; color: white; line-height: 1;">Solana Terminal</span>
                            <span style="font-size: 10px; color: #a1a1aa;">AI-Powered Analytics</span>
                        </div>
                    `

                    const container = clonedDoc.getElementById("terminal-content") || clonedDoc.body
                    container.style.position = "relative"
                    container.appendChild(watermark)
                }
            }

            const canvas = await html2canvas(element, options)

            // 4. Convert to Blob
            canvas.toBlob(async (blob) => {
                if (!blob) throw new Error("Failed to generate image")

                // 5. Copy to Clipboard
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            [blob.type]: blob
                        })
                    ])

                    setHasCopied(true)
                    setTimeout(() => setHasCopied(false), 3000)

                    // 6. Open Twitter Intent
                    const text = encodeURIComponent(
                        `Just analyzed $${tokenSymbol} on @SolanaTerminal 🚀\n\nAI-powered insights are bullish! Check it out here 👇\n\n#Solana #Crypto #Trading`
                    )
                    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")

                } catch (clipboardErr) {
                    console.error("Clipboard write failed:", clipboardErr)
                }
            }, "image/png")

        } catch (err) {
            console.error("Screenshot failed:", err)
        } finally {
            setIsSharing(false)
        }
    }

    if (variant === "full") {
        return (
            <button
                onClick={handleShare}
                disabled={isSharing}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] rounded-lg text-xs font-medium transition-colors border border-[#1DA1F2]/20"
            >
                {isSharing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : hasCopied ? (
                    <Check className="w-3.5 h-3.5" />
                ) : (
                    <Twitter className="w-3.5 h-3.5" />
                )}
                <span>{isSharing ? "Capturing..." : hasCopied ? "Copied!" : "Share Analysis"}</span>
            </button>
        )
    }

    return (
        <button
            onClick={handleShare}
            disabled={isSharing}
            title="Share on X"
            className="p-2 bg-secondary/50 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] rounded-lg transition-colors border border-border/50 hover:border-[#1DA1F2]/20 text-muted-foreground"
        >
            {isSharing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : hasCopied ? (
                <Check className="w-4 h-4 text-green-400" />
            ) : (
                <Share2 className="w-4 h-4" />
            )}
        </button>
    )
}
