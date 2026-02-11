import { TerminalHeader } from "@/components/terminal/terminal-header"
import { ClientWalletProvider } from "@/components/providers/client-wallet-provider"

export default function TerminalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClientWalletProvider>
            <div className="min-h-screen flex flex-col bg-background">
                <TerminalHeader />
                <main className="flex-1 p-4 md:p-6 overflow-hidden">
                    {children}
                </main>
            </div>
        </ClientWalletProvider>
    )
}
