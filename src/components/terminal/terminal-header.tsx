"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { WalletConnectButton } from "@/components/providers/client-wallet-provider"
import { LogoutButton } from "@/components/auth/logout-button"
import { Button } from "@/components/ui/button"
import { Moon, Sun, BookOpen } from "lucide-react"
import { useTheme } from "next-themes"

export function TerminalHeader() {
    const { data: session } = useSession()
    const { theme, setTheme } = useTheme()

    return (
        <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center gap-2 md:gap-4">
                <Link href="/terminal" className="hover:opacity-80 transition-opacity">
                    <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        {/* Shorten logo on very small screens if needed, but text-lg should fit */}
                        Solana AI Terminal
                    </h1>
                </Link>
                <div className="hidden md:flex items-center gap-4 ml-6">
                    <Link href="/school" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Academy
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                {/* Wallet Button Wrapper for Mobile Styling */}
                <div className="wallet-adapter-mobile-fix scale-90 md:scale-100 origin-right">
                    <WalletConnectButton />
                </div>

                <div className="h-6 w-[1px] bg-border hidden md:block" />

                <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-sm font-medium hidden lg:block">
                        {session?.user?.name || "Trader"}
                    </span>
                    {session?.user?.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={session.user.image}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full border border-border"
                        />
                    )}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="hidden md:flex"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                <LogoutButton />
            </div>
        </header>
    )
}
