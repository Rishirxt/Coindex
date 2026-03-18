'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetcher } from '@/lib/coingecko.actions';
import { formatCurrency, cn } from '@/lib/utils';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';
import { TrendingUp, TrendingDown, Star, RefreshCw } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import CoinIcon from '@/components/ui/CoinIcon';

const SparklineChart = ({ data, isPositive }: { data: number[], isPositive: boolean }) => {
    const formattedData = data.map((price, i) => ({ value: price, index: i }));
    const color = isPositive ? '#22c55e' : '#ef4444';

    return (
        <div className="h-[30px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData}>
                    <defs>
                        <linearGradient id={`gradient-mini-${isPositive ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <YAxis domain={['dataMin', 'dataMax']} hide />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        fillOpacity={1}
                        fill={`url(#gradient-mini-${isPositive ? 'up' : 'down'})`}
                        isAnimationActive={false}
                        strokeWidth={1.5}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

const Watchlist = () => {
    const [watchlistCoins, setWatchlistCoins] = useState<CoinMarketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [starredIds, setStarredIds] = useState<string[]>([]);

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('zync_watchlist');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setStarredIds(parsed);
                }
            } catch (e) {
                console.error("Failed to parse watchlist", e);
            }
        } else {
            setLoading(false); // nothing to load
        }
    }, []);

    const fetchWatchlistData = async (quiet = false) => {
        if (starredIds.length === 0) {
            setWatchlistCoins([]);
            setLoading(false);
            return;
        }

        if (!quiet) setLoading(true);
        try {
            const data = await fetcher<CoinMarketData[]>('/coins/markets', {
                vs_currency: 'usd',
                ids: starredIds.join(','),
                sparkline: true,
                price_change_percentage: '24h'
            });
            setWatchlistCoins(data);
        } catch (error) {
            console.error("Failed to fetch watchlist data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWatchlistData();
    }, [starredIds]);

    const toggleStar = (e: React.MouseEvent, coinId: string) => {
        e.preventDefault();
        e.stopPropagation();

        const newStarred = starredIds.filter(id => id !== coinId);
        setStarredIds(newStarred);
        localStorage.setItem('zync_watchlist', JSON.stringify(newStarred));
    };

    if (loading) {
        return (
            <div className="mb-8">
                <h3 className="text-xl font-bold text-text-primary mb-4">Your Watchlist</h3>
                <div className="w-full bg-card-bg rounded-xl p-8 border border-border-color animate-pulse flex flex-col items-center justify-center min-h-[160px]">
                    <RefreshCw className="h-6 w-6 text-text-muted animate-spin mb-4" />
                    <p className="text-text-muted text-sm">Loading watchlist...</p>
                </div>
            </div>
        );
    }

    if (starredIds.length === 0) {
        return (
            <div className="mb-8">
                <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    Your Watchlist
                </h3>
                <EmptyState type="no-watchlist" className="min-h-[160px]" />
            </div>
        );
    }

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    Your Watchlist
                </h3>
                <button 
                    onClick={() => fetchWatchlistData()}
                    disabled={loading}
                    className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {watchlistCoins.map((coin) => {
                    const isPositive = coin.price_change_percentage_24h >= 0;
                    return (
                        <Link
                            key={coin.id}
                            href={`/coins/${coin.id}`}
                            className="bg-card-bg border border-border-color p-5 rounded-xl block hover:bg-bg-secondary hover:border-text-muted/30 transition-all group relative"
                        >
                            <button
                                onClick={(e) => toggleStar(e, coin.id)}
                                className="absolute top-4 right-4 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors z-10"
                            >
                                <Star className="text-yellow-400 fill-yellow-400" size={16} />
                            </button>

                            <div className="flex items-center gap-3 mb-3">
                                <CoinIcon src={coin.image} symbol={coin.symbol} name={coin.name} size={36} />
                                <div className="flex flex-col">
                                    <span className="font-bold text-text-primary leading-tight">{coin.name}</span>
                                    <span className="text-xs text-text-muted uppercase">{coin.symbol}</span>
                                </div>
                            </div>

                            <div className="flex items-end justify-between mt-4">
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-text-primary">{formatCurrency(coin.current_price)}</span>
                                    <div className={cn("inline-flex items-center text-sm font-medium mt-1", isPositive ? "text-positive" : "text-negative")}>
                                        {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                    </div>
                                </div>
                            </div>

                            {coin.sparkline_in_7d && (
                                <SparklineChart data={coin.sparkline_in_7d.price} isPositive={isPositive} />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Watchlist;
