"use client"

import { useSession } from "next-auth/react"
import { WalletConnectButton } from "@/components/providers/client-wallet-provider"
import { LogoutButton } from "@/components/auth/logout-button"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function TerminalHeader() {
    const { data: session } = useSession()
    const { theme, setTheme } = useTheme()

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                    Solana AI Terminal
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <WalletConnectButton />

                <div className="h-8 w-[1px] bg-border" />

                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium hidden md:block">
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
