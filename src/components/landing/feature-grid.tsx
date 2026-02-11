"use client"

import { motion } from "framer-motion"
import { BrainCircuit, ShieldCheck, Activity } from "lucide-react"

const features = [
    {
        icon: BrainCircuit,
        title: "AI Chart Analysis",
        desc: "Gemini 3 Pro scans candlestick patterns and volume data to predict breakouts with 87% accuracy.",
        gradient: "from-purple-500/20 to-blue-500/20"
    },
    {
        icon: ShieldCheck,
        title: "Anti-Rug System",
        desc: "integrated RugCheck API instantly audits smart contracts for liquidity locks, mint authority, and honey-pots.",
        gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
        icon: Activity,
        title: "Live Dex Data",
        desc: "Real-time feeds from DexScreener ensure you never trade on outdated prices. Millisecond latency.",
        gradient: "from-orange-500/20 to-red-500/20"
    }
]

export function FeatureGrid() {
    return (
        <section className="py-24 px-4 bg-background/50 relative">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:bg-white/10 overflow-hidden"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10">
                                <div className="mb-6 inline-flex p-3 rounded-2xl bg-white/10 text-white">
                                    <section.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">{section.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {section.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
