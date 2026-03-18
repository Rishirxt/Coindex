'use client';

import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/coingecko.actions';
import { formatCurrency } from '@/lib/utils';
import { Activity, BarChart2, PieChart, Coins } from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useCurrency } from '@/components/providers/CurrencyProvider';

async function getGlobalData() {
    try {
        const data = await fetcher<GlobalMarketData>('/global', undefined, 300); // 5 min cache
        return data.data;
    } catch (error) {
        console.error("Failed to fetch global data:", error);
        return null;
    }
}

export default function HeroStats() {
    const { currency } = useCurrency();
    const [globalData, setGlobalData] = useState<GlobalMarketData['data'] | null>(null);

    useEffect(() => {
        getGlobalData().then(data => {
            if (data) setGlobalData(data);
        });
    }, []); // Empty dependency array means this runs once on mount

    if (!globalData) {
        return (
            <div className="w-full bg-card-bg rounded-xl p-6 border border-border-color animate-pulse flex items-center justify-center">
                <p className="text-text-muted">Loading global market stats...</p>
            </div>
        );
    }

    const stats = [
        {
            label: 'Global Market Cap',
            value: <AnimatedCounter value={globalData.total_market_cap[currency] || globalData.total_market_cap.usd} formatValue={(val) => formatCurrency(val, currency, true)} />,
            icon: <BarChart2 size={24} className="text-purple-400" />,
            change: globalData.market_cap_change_percentage_24h_usd
        },
        {
            label: '24h Volume',
            value: <AnimatedCounter value={globalData.total_volume[currency] || globalData.total_volume.usd} formatValue={(val) => formatCurrency(val, currency, true)} />,
            icon: <Activity size={24} className="text-blue-400" />,
            change: null
        },
        {
            label: 'BTC Dominance',
            value: <AnimatedCounter value={globalData.market_cap_percentage.btc} formatValue={(v) => `${v.toFixed(2)}%`} />,
            icon: <PieChart size={24} className="text-orange-400" />,
            change: null
        },
        {
            label: 'Active Cryptos',
            value: <AnimatedCounter value={globalData.active_cryptocurrencies} formatValue={(v) => Math.floor(v).toLocaleString()} />,
            icon: <Coins size={24} className="text-green-400" />,
            change: null
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
                <div key={i} className="bg-card-bg p-6 rounded-xl border border-border-color flex items-center justify-between hover:bg-bg-secondary transition-colors">
                    <div className="flex flex-col gap-2">
                        <span className="text-text-muted text-sm font-medium">{stat.label}</span>
                        <div className="flex flex-col">
                            <span className="text-text-primary text-xl font-bold">{stat.value}</span>
                            {stat.change !== null && (
                                <span className={`text-xs mt-1 ${stat.change >= 0 ? 'text-positive' : 'text-negative'}`}>
                                    {stat.change >= 0 ? '+' : ''}{stat.change.toFixed(2)}% (24h)
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="p-3 bg-text-primary/10 rounded-full shrink-0">
                        {stat.icon}
                    </div>
                </div>
            ))}
        </div>
    );
};
