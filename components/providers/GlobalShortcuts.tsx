'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

const GlobalShortcuts = () => {
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Escape to clear search or close dialog (browser handles escape for dialog usually, but for custom inputs it's good)
            if (e.key === 'Escape') {
                // If there's a search input active, it might be clearable. 
                // However, most components handle Escape themselves.
                // We mainly need "D" for dark mode.
            }

            // D to toggle dark mode
            if (e.key.toLowerCase() === 'd' && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
                setTheme(theme === 'dark' ? 'light' : 'dark');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [theme, setTheme]);

    return null;
};

export default GlobalShortcuts;
