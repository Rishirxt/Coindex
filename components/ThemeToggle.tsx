"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch by only rendering after mounting
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-lg bg-card-bg border border-border-color flex items-center justify-center opacity-50">
                <Moon className="h-[1.2rem] w-[1.2rem] invisible" />
            </div>
        )
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative rounded-lg p-2.5 bg-card-bg hover:bg-bg-secondary text-text-primary border border-border-color transition-colors focus:ring-2 focus:ring-purple-500/50"
            aria-label="Toggle theme"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 dark:scale-0 transition-transform dark:absolute dark:opacity-0" />
            <Moon className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] h-[1.2rem] w-[1.2rem] scale-0 opacity-0 dark:scale-100 dark:opacity-100 transition-transform" />
        </button>
    )
}
