"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function LoginButton() {
    return (
        <Button
            onClick={() => signIn("google", { callbackUrl: "/terminal" })}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(var(--primary),0.5)] transition-all hover:scale-105"
        >
            Login with Google
        </Button>
    )
}
