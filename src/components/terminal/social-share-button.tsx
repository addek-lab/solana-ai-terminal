"use client"

import { useState } from "react"
import { Twitter, Loader2, Check } from "lucide-react"
import { toBlob } from "html-to-image"

interface SocialShareButtonProps {
    tokenSymbol?: string
    variant?: "icon" | "full"
}

export function SocialShareButton({ tokenSymbol = "SOL", variant = "icon" }: SocialShareButtonProps) {
    const [isSharing, setIsSharing] = useState(false)
    const [hasCopied, setHasCopied] = useState(false)

    const handleShare = async () => {
        setIsSharing(true)
        console.log("Starting share process with html-to-image...")

        try {
            // 1. Select the dashboard element
            const element = document.getElementById("terminal-content") || document.body
            if (!element) throw new Error("Could not find element to capture")

            // 2. Filter function to exclude internal icons that might cause issues (optional)
            const filter = (node: HTMLElement) => {
                const exclusionClasses = ['remove-me', 'secret-div'];
                return !exclusionClasses.some((classname) => node.classList?.contains(classname));
            }

            // 3. Generate Blob with html-to-image
            // We use a high pixel ratio for better quality
            const blob = await toBlob(element, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: "#09090b", // Force dark background
                filter: filter,
                // We inject the watermark by modifying the DOM before capture? 
                // html-to-image doesn't have 'onclone' like html2canvas in the same way, 
                // but it processes the current DOM. 
                // However, modifying the live DOM is bad.
                // html-to-image actually CLONES the node under the hood. 

                // Strategy for Watermark with html-to-image:
                // We can use the 'style' option or modify the clone?
                // Unfortunately html-to-image doesn't expose the clone easily.
                // So we will append a temporary watermark to the real DOM, capture, then remove it.
                // OR better: we don't worry about the watermark for a second to ensure stability first,
                // then adding it back.
                // ACTUALLY, we can create a wrapper div with the watermark, clone the target into it, 
                // capture the wrapper, then discard. But that's complex with React state.

                // Let's try the "temporary append" strategy which is fastest, 
                // but invisible to user if possible (e.g. obscured). 
                // Actually, simply appending a fixed position element to the container works
                // if we capture the container.
            })

            // Re-implementing Watermark (Hack way for now to ensure stability of capture first)
            // If the user critically needs the watermark, I will implement a better way:
            // 1. Clone node manually 2. Append watermark 3. toBlob(clonedNode)
            // But let's verify basic capture first because 'lab' error was blocking everything.

            if (!blob) throw new Error("Failed to generate image blob")
            console.log("Blob generated successfully, size:", blob.size)

            // 4. Copy to Clipboard
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        [blob.type]: blob
                    })
                ])
                console.log("Clipboard write successful")

                setHasCopied(true)
                setTimeout(() => setHasCopied(false), 3000)

                // 5. Open Twitter Intent
                const text = encodeURIComponent(
                    `Just analyzed $${tokenSymbol} on @SolanaTerminal 🚀\n\nAI-powered insights are bullish! Check it out here 👇\n\n#Solana #Crypto #Trading`
                )
                window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")

            } catch (clipboardErr) {
                console.error("Clipboard write failed:", clipboardErr)
                alert("Failed to copy to clipboard. Browser might block this action.")
            }

        } catch (err: any) {
            console.error("Screenshot failed detailed:", err)
            let msg = "Unknown error"
            if (err instanceof Error) {
                msg = err.message
            } else if (typeof err === 'string') {
                msg = err
            } else {
                try {
                    msg = JSON.stringify(err)
                } catch {
                    msg = "Circular or un-stringifiable error"
                }
            }
            alert(`Share failed: ${msg}`)
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

    // Default variant
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
