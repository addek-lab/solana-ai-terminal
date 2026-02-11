"use client"

import { motion } from "framer-motion"
import { LoginButton } from "@/components/auth/login-button"

export function HeroSection() {
    return (
        <section className="relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden text-center bg-background">
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-500/10 blur-[120px]" />
                <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px]" />
            </div>

            <div className="max-w-5xl mx-auto space-y-8 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-blue-400 bg-blue-500/10 rounded-full border border-blue-500/20">
                        Early Access: Gemini 3.0 AI Integrated
                    </span>
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        The Unfair Advantage <br /> for Solana Traders
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-2xl mx-auto text-xl text-muted-foreground md:text-2xl font-light"
                >
                    Combine real-time On-Chain Data with <span className="text-white font-medium">Gemini 3 AI Analysis</span> to scan, verify, and trade tokens before the crowd.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="pt-8"
                >
                    <LoginButton />
                </motion.div>
            </div>

            {/* Abstract Grid Background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 -z-20 pointer-events-none" />
        </section>
    )
}
