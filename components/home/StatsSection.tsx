'use client';

import React, { useEffect, useRef, useState } from 'react';
import { fetcher } from '@/lib/coingecko.actions';
import { formatCurrency } from '@/lib/utils';
import { useCurrency } from '@/components/providers/CurrencyProvider';

interface Stat {
    value: number;
    suffix: string;
    label: string;
    sub: string;
    icon: React.ReactNode;
}

function useCountUp(target: number, duration = 1800, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime: number | null = null;
        const step = (ts: number) => {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(target * ease);
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
        };
        requestAnimationFrame(step);
    }, [target, duration, start]);
    return count;
}

function StatCard({ stat }: { stat: Stat }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const count = useCountUp(stat.value, 1800, visible);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
            { threshold: 0.4 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const display =
        stat.value % 1 === 0
            ? Math.round(count).toLocaleString()
            : count.toFixed(1);

    return (
        <div ref={ref} className="glass-card bento-card rounded-3xl p-8 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-zync-surface-2 flex items-center justify-center border border-zync-border">
                {stat.icon}
            </div>
            <div>
                <p
                    className="text-4xl font-black text-white font-mono-data leading-none"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                    {display}
                    <span className="text-primary">{stat.suffix}</span>
                </p>
                <p className="text-base font-semibold text-white mt-1">{stat.label}</p>
                <p className="text-sm text-zync-muted mt-0.5">{stat.sub}</p>
            </div>
        </div>
    );
}

export default function StatsSection() {
    const ref = useRef<HTMLDivElement>(null);
    const { currency } = useCurrency();
    const [globalData, setGlobalData] = useState<any>(null); // any used since type not globally defined in this file

    useEffect(() => {
        const getGlobalData = async () => {
             try {
                 const response = await fetcher<any>('/global', undefined, 300);
                 if (response && response.data) {
                    setGlobalData(response.data);
                 }
             } catch (error) {
                 console.error("Failed to fetch global data:", error);
             }
        };
        getGlobalData();
    }, []);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add('animate'); obs.unobserve(el); } },
            { threshold: 0.1 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const activeCoins = globalData ? globalData.active_cryptocurrencies : 18420;

    const STATS: Stat[] = [
        {
            value: activeCoins,
            suffix: '+',
            label: 'Coins Tracked',
            sub: 'Across 500+ exchanges',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
            ),
        },
        {
            value: 240,
            suffix: 'K',
            label: 'Active Traders',
            sub: 'Using Zync daily',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F0B429" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
        },
        {
            value: 4.8,
            suffix: 'M',
            label: 'Data Points / sec',
            sub: 'Real-time precision',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#627EEA" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
            ),
        },
        {
            value: 99.98,
            suffix: '%',
            label: 'Uptime SLA',
            sub: 'Enterprise-grade reliability',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
            ),
        },
    ];

    // Formatter logic for the market strip
    // Formatting trillions or billions properly
    let marketCapFormatted = '$0.00';
    let volumeFormatted = '$0.00';
    let capChange = 0;
    let btcDom = 0;

    if (globalData) {
        const mc = globalData.total_market_cap[currency] || globalData.total_market_cap.usd;
        const vol = globalData.total_volume[currency] || globalData.total_volume.usd;
        
        capChange = globalData.market_cap_change_percentage_24h_usd;
        btcDom = globalData.market_cap_percentage.btc;

        if (mc >= 1e12) marketCapFormatted = `$${(mc / 1e12).toFixed(2)}T`;
        else if (mc >= 1e9) marketCapFormatted = `$${(mc / 1e9).toFixed(2)}B`;
        else marketCapFormatted = formatCurrency(mc, currency, true);

        if (vol >= 1e12) volumeFormatted = `$${(vol / 1e12).toFixed(2)}T`;
        else if (vol >= 1e9) volumeFormatted = `$${(vol / 1e9).toFixed(2)}B`;
        else volumeFormatted = formatCurrency(vol, currency, true);
    }

    const stripItems = globalData ? [
        { label: 'Market Cap', value: marketCapFormatted, change: `${capChange >= 0 ? '+' : ''}${capChange.toFixed(2)}%`, positive: capChange >= 0 },
        { label: '24h Volume', value: volumeFormatted, change: '', positive: true },
        { label: 'BTC Dominance', value: `${btcDom.toFixed(1)}%`, change: '', positive: true },
        { label: 'Active Coins', value: activeCoins.toLocaleString(), change: '', positive: true },
    ] : [
        { label: 'Market Cap', value: 'Loading...', change: '', positive: true },
        { label: '24h Volume', value: 'Loading...', change: '', positive: true },
        { label: 'BTC Dominance', value: 'Loading...', change: '', positive: true },
        { label: 'Active Coins', value: 'Loading...', change: '', positive: true },
    ];

    return (
        <section id="markets" className="py-24 px-4 max-w-7xl mx-auto">
            <div ref={ref} className="reveal text-center mb-16">
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">By the numbers</p>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">
                    Data that moves<br />
                    <span className="gradient-text">at market speed</span>
                </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((s) => (
                    <StatCard key={s.label} stat={s} />
                ))}
            </div>

            {/* Live market strip */}
            <div className="mt-8 glass-card rounded-3xl p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className={globalData ? "ping-dot absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" : ""} />
                            <span className={`relative inline-flex h-3 w-3 rounded-full ${globalData ? 'bg-primary' : 'bg-zync-muted'}`} />
                        </span>
                        <span className="text-sm font-semibold text-white">Global Crypto Market</span>
                        <span className="text-xs text-zync-muted">{globalData ? 'Live Data' : 'Fetching...'}</span>
                    </div>
                    <div className="flex items-center gap-8 flex-wrap">
                        {stripItems.map((m) => (
                            <div key={m.label} className="text-right">
                                <p className="text-xs text-zync-muted">{m.label}</p>
                                <p className="text-sm font-bold text-white font-mono-data">{m.value}</p>
                                {m.change && (
                                   <p className={`text-xs font-semibold font-mono-data ${m.positive ? 'text-primary' : 'text-accent-red'}`}>{m.change}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
