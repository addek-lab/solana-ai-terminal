"use client"

import { Copy, Check, Globe, Twitter, Send } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface TokenHeaderProps {
    tokenData: any
}

export function TokenHeader({ tokenData }: TokenHeaderProps) {
    const [copied, setCopied] = useState(false)

    const copyAddress = () => {
        navigator.clipboard.writeText(tokenData.address)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const getSocialIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'twitter': return <Twitter className="w-4 h-4" />
            case 'telegram': return <Send className="w-4 h-4" />
            default: return <Globe className="w-4 h-4" />
        }
    }

    return (
        <div className="bg-card rounded-xl border border-border p-4 flex flex-col gap-4">
            <div className="flex items-start gap-4">
                {/* Avatar - Large */}
                <div className="w-20 h-20 rounded-2xl bg-muted shrink-0 overflow-hidden ring-4 ring-background shadow-lg">
                    {tokenData.imageUrl ? (
                        <img src={tokenData.imageUrl} alt={tokenData.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white">
                            {tokenData.symbol?.[0]}
                        </div>
                    )}
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                    <h2 className="text-xl font-bold truncate">{tokenData.name}</h2>
                    <p className="text-muted-foreground font-mono text-sm">{tokenData.symbol}</p>

                    {/* Address Copy */}
                    <button
                        onClick={copyAddress}
                        className="flex items-center gap-2 mt-2 px-2 py-1 bg-secondary/50 hover:bg-secondary rounded-lg text-xs font-mono text-muted-foreground hover:text-foreground transition-colors w-fit"
                    >
                        <span>{tokenData.address.slice(0, 4)}...{tokenData.address.slice(-4)}</span>
                        {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                </div>
            </div>

            {/* Socials */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                {tokenData.websites?.map((site: any, i: number) => (
                    <Link
                        key={i}
                        href={site.url}
                        target="_blank"
                        className="p-2 bg-secondary/30 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <Globe className="w-4 h-4" />
                    </Link>
                ))}
                {tokenData.socials?.map((social: any, i: number) => (
                    <Link
                        key={i}
                        href={social.url}
                        target="_blank"
                        className="p-2 bg-secondary/30 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    >
                        {getSocialIcon(social.type)}
                    </Link>
                ))}
                {(!tokenData.websites?.length && !tokenData.socials?.length) && (
                    <span className="text-xs text-muted-foreground italic pl-1">No socials found</span>
                )}
            </div>
        </div>
    )
}
