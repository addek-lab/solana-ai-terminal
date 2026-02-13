"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
    return (
        <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 px-2 md:px-3"
        >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
        </Button>
    )
}
