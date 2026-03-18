'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

export default function WatchlistButton({ coinId }: { coinId: string }) {
    const [isStarred, setIsStarred] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('zync_watchlist');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.includes(coinId)) {
                    setTimeout(() => setIsStarred(true), 0);
                }
            } catch (e) {
                // ignore
            }
        }
    }, [coinId]);

    const toggleStar = () => {
        const saved = localStorage.getItem('zync_watchlist');
        let parsed: string[] = [];
        if (saved) {
            try {
                parsed = JSON.parse(saved);
                if (!Array.isArray(parsed)) parsed = [];
            } catch (e) {
                parsed = [];
            }
        }

        if (isStarred) {
            parsed = parsed.filter(id => id !== coinId);
        } else {
            if (!parsed.includes(coinId)) {
                parsed.push(coinId);
            }
        }

        localStorage.setItem('zync_watchlist', JSON.stringify(parsed));
        setIsStarred(!isStarred);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
    };

    return (
        <button
            onClick={toggleStar}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${isStarred
                ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20'
                : 'bg-card-bg border-border-color text-text-primary hover:bg-bg-secondary hover:border-text-muted/30'
                }`}
        >
            <Star size={18} className={`${isStarred ? 'fill-yellow-400' : ''} ${isAnimating ? 'animate-star-pop' : ''}`} />
            <span className="font-medium">{isStarred ? 'Saved to Watchlist' : 'Add to Watchlist'}</span>
        </button>
    );
}
