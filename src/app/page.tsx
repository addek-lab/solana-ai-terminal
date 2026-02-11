import { HeroSection } from "@/components/landing/hero-section";
import { FeatureGrid } from "@/components/landing/feature-grid";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <FeatureGrid />

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-white/5 bg-black/20">
        <p>© 2024 Solana AI Terminal. Built with Next.js 14 & Gemini 3.</p>
      </footer>
    </main>
  );
}
