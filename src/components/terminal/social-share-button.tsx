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
        console.log("Starting share process...")

        try {
            // 1. Select the dashboard element
            const element = document.getElementById("terminal-content") || document.body
            console.log("Target element found:", element.id || element.tagName)

            if (!element) throw new Error("Could not find element to capture")

            // 2. Capture with html2canvas (including watermark)
            console.log("Starting html2canvas capture...")
            // Fix: explicit cast options to any to allow 'scale'
            const options: any = {
                useCORS: true,
                allowTaint: true, // Try allowing taint
                scale: 2,
                logging: true, // Enable html2canvas logs
                backgroundColor: "#09090b",
                onclone: (clonedDoc: Document) => {
                    console.log("Cloning document for watermark...")
                    const watermark = clonedDoc.createElement("div")
                    // ... (rest of watermark styles) ...
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
                    if (container) {
                        container.style.position = "relative"
                        container.appendChild(watermark)
                    } else {
                        console.warn("Could not find container in cloned doc")
                    }
                }
            }

            const canvas = await html2canvas(element, options)
            console.log("Canvas generated successfully")

            // 4. Convert to Blob
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    console.error("Blob generation failed")
                    throw new Error("Failed to generate image blob")
                }
                console.log("Blob generated, size:", blob.size)

                // 5. Copy to Clipboard
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            [blob.type]: blob
                        })
                    ])
                    console.log("Clipboard write successful")

                    setHasCopied(true)
                    setTimeout(() => setHasCopied(false), 3000)

                    // 6. Open Twitter Intent
                    const text = encodeURIComponent(
                        `Just analyzed $${tokenSymbol} on @SolanaTerminal 🚀\n\nAI-powered insights are bullish! Check it out here 👇\n\n#Solana #Crypto #Trading`
                    )
                    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")

                } catch (clipboardErr) {
                    console.error("Clipboard write failed:", clipboardErr)
                    alert("Failed to copy to clipboard. Browser might block this action.")
                }
            }, "image/png")

        } catch (err: any) {
            console.error("Screenshot failed:", err)
            alert(`Share failed: ${err.message}`)
        } finally {
            setIsSharing(false)
        }
    }

    if (variant === "full") {
        return (
            <button
                onClick={handleShare}
                disabled={isSharing}
                className="w-full h-10 bg-black hover:bg-black/80 text-white font-bold rounded-lg shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/10"
            >
                {isSharing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : hasCopied ? (
                    <Check className="w-4 h-4 text-green-400" />
                ) : (
                    <Twitter className="w-4 h-4 fill-current" />
                )}
                <span>{isSharing ? "Capturing..." : hasCopied ? "Copied!" : "Push on X"}</span>
            </button>
        )
    }

    return (
        <button
            onClick={handleShare}
            disabled={isSharing}
            className="h-9 px-4 bg-black hover:bg-black/80 text-white font-bold rounded-lg shadow-sm active:scale-[0.98] transition-all flex items-center gap-2 border border-white/10 text-sm"
        >
            {isSharing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : hasCopied ? (
                <Check className="w-4 h-4 text-green-400" />
            ) : (
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
            )}
            <span className="hidden md:inline">{isSharing ? "Pushing..." : hasCopied ? "Copied!" : "Push on X"}</span>
        </button>
    )
}
