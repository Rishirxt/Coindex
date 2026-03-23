'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { formatCurrency } from '@/lib/utils';
import { useCurrency } from '@/components/providers/CurrencyProvider';

/* ── Mini sparkline SVG ── */
function Sparkline({ data, positive }: { data?: number[], positive: boolean }) {
    const color = positive ? '#00D4AA' : '#F43F5E';
    
    // Fallback static path if no data
    let path = positive
        ? 'M0,20 C10,18 20,12 30,14 C40,16 50,8 60,6 C70,4 80,10 90,8 C100,6 110,2 120,0' 
        : 'M0,0 C10,2 20,6 30,4 C40,2 50,10 60,12 C70,14 80,8 90,14 C100,18 110,16 120,20';

    if (data && data.length > 0) {
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const pts = data.map((val, i) => {
            const x = (i / (data.length - 1)) * 120;
            const y = 24 - ((val - min) / range) * 24;
            return `${i === 0 ? 'M' : 'L'}${x},${y}`;
        });
        path = pts.join(' ');
    }

    return (
        <svg width="80" height="24" viewBox="0 0 120 24" fill="none" className="opacity-80">
            <path d={path} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" className="chart-line" />
        </svg>
    );
}

/* ── Price flash card ── */
function PriceCard({
    coin,
    className,
}: {
    coin?: CoinMarketData;
    className?: string;
}) {
    const [flash, setFlash] = useState<'green' | 'red' | null>(null);
    const [currentPrice, setCurrentPrice] = useState(coin?.current_price || 0);

    // Initial sync with coin prop updates
    useEffect(() => {
        if (coin) {
            setCurrentPrice(coin.current_price);
        }
    }, [coin?.current_price]);

    if (!coin) {
        return (
            <div className={`glass-card rounded-2xl p-4 w-56 animate-pulse bg-zync-surface-2 ${className ?? ''}`}>
                <div className="h-8 w-full mb-3 rounded-md bg-white/5"></div>
                <div className="h-6 w-1/2 mb-2 rounded-md bg-white/5"></div>
                <div className="h-4 w-full rounded-md bg-white/5"></div>
            </div>
        );
    }

    const isPositive = coin.price_change_percentage_24h >= 0;
    
    // Extract a dominant color based on symbol
    const colorMap: Record<string, string> = {
        'btc': '#F0B429', // Bitcoin
        'eth': '#627EEA', // Ethereum
        'sol': '#9945FF', // Solana
        'bnb': '#F3BA2F', // BNB
    };
    const ringColor = colorMap[coin.symbol.toLowerCase()] || '#00D4AA';

    return (
        <div
            className={`glass-card rounded-2xl p-4 w-56 ${className ?? ''}`}
            style={{
                transition: 'background-color 0.3s ease',
                backgroundColor:
                    flash === 'green' ? 'rgba(0,212,170,0.08)'
                        : flash === 'red' ? 'rgba(244,63,94,0.08)'
                            : undefined,
            }}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full border"
                        style={{ borderColor: `${ringColor}44` }}
                    />
                    <div>
                        <p className="text-sm font-semibold text-white uppercase">{coin.symbol}</p>
                        <p className="text-xs text-zync-muted max-w-[80px] truncate">{coin.name}</p>
                    </div>
                </div>
                <div className="relative flex whitespace-nowrap">
                    <span className="ping-dot absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </div>
            </div>
            <p
                className="font-mono-data text-lg font-bold text-white tabular-nums"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
                {formatCurrency(currentPrice)}
            </p>
            <div className="flex items-center justify-between mt-2">
                <span
                    className={`text-xs font-semibold ${isPositive ? 'text-primary' : 'text-accent-red'}`}
                >
                    {isPositive ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </span>
                <Sparkline data={coin.sparkline_in_7d?.price} positive={isPositive} />
            </div>
        </div>
    );
}

/* ── Top Gainer card (Replacing OrderBookCard) ── */
function TopGainerCard({ coin, className }: { coin?: CoinMarketData, className?: string }) {
    if (!coin) {
        return (
            <div className={`glass-card rounded-2xl p-4 w-64 animate-pulse bg-zync-surface-2 ${className ?? ''}`}>
                <div className="h-6 w-full mb-3 rounded-md bg-white/5"></div>
                <div className="h-10 w-full mb-2 rounded-md bg-white/5"></div>
                <div className="h-4 w-1/2 rounded-md bg-white/5"></div>
            </div>
        );
    }

    const change = coin.price_change_percentage_24h;
    
    return (
        <div className={`glass-card rounded-2xl p-4 w-64 ${className ?? ''}`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-zync-muted uppercase tracking-wider flex items-center gap-1">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2">
                       <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                       <polyline points="22 4 12 14.01 9 11.01"></polyline>
                   </svg>
                   Top Gainer
                </span>
                <span className="text-xs text-primary font-mono-data uppercase">{coin.symbol}/USD</span>
            </div>
            
            <div className="flex items-center gap-3 my-4">
                 <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                 <div>
                     <p className="text-accent-green font-mono-data font-semibold relative z-10 text-xl">{formatCurrency(coin.current_price)}</p>
                     <p className="text-white text-sm">{coin.name}</p>
                 </div>
            </div>
           
            <div className="text-center text-sm font-bold text-white font-mono-data border-t border-zync-border pt-2 mt-2 flex justify-between items-center">
                <span className="text-zync-muted text-xs">24h Change</span>
                <span className="text-primary text-sm flex items-center gap-1">▲ {change.toFixed(2)}%</span>
            </div>
        </div>
    );
}

/* ── Trending card ── */
function TrendingCard({ trendingList, className }: { trendingList: any[], className?: string }) {
    return (
        <div className={`glass-card rounded-2xl p-4 w-52 ${className ?? ''}`}>
            <div className="flex items-center gap-2 mb-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F0B429" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                </svg>
                <span className="text-xs font-semibold text-accent-amber uppercase tracking-wider">Trending</span>
            </div>
            <div className="space-y-2">
                {trendingList.length === 0 ? (
                    Array(4).fill(0).map((_, i) => (
                         <div key={i} className="flex items-center justify-between animate-pulse">
                              <div className="h-4 w-1/2 rounded bg-white/5"></div>
                              <div className="h-4 w-1/4 rounded bg-white/5"></div>
                         </div>
                    ))
                ) : trendingList.slice(0, 4).map((t, index) => {
                    const priceChange = t.item.data.price_change_percentage_24h?.usd || 0;
                    const isPositive = priceChange >= 0;
                    return (
                        <div key={t.item.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-zync-subtle font-mono-data w-3">{index + 1}</span>
                                <span className="text-sm font-semibold text-white uppercase truncate max-w-[60px]">{t.item.symbol}</span>
                            </div>
                            <span className={`text-xs font-bold font-mono-data ${isPositive ? 'text-primary' : 'text-accent-red'}`}>
                                {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function HeroSection({ markets, trendingList }: { markets: any[], trendingList: any[] }) {
    const sectionRef = useRef<HTMLElement>(null);

    // Scroll-linked parallax
    useEffect(() => {
        const onScroll = () => {
            if (!sectionRef.current) return;
            const scrollY = window.scrollY;
            const blobs = sectionRef.current.querySelectorAll<HTMLElement>('[data-parallax]');
            blobs.forEach((el) => {
                const speed = parseFloat(el.dataset.parallax ?? '0.3');
                el.style.transform = `translateY(${scrollY * speed}px)`;
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const btc = markets.find(c => c.symbol.toLowerCase() === 'btc');
    const eth = markets.find(c => c.symbol.toLowerCase() === 'eth');
    const sol = markets.find(c => c.symbol.toLowerCase() === 'sol');
    const bnb = markets.find(c => c.symbol.toLowerCase() === 'bnb');

    // Find the biggest gainer in top 100 for the TopGainerCard
    const topGainer = [...markets]
        .slice(0, 100)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)[0];

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-16 px-4"
            aria-label="Hero"
        >
            {/* ── Ambient glow blobs ── */}
            <div
                data-parallax="0.15"
                className="glow-blob absolute top-[-10%] left-[20%] w-[500px] h-[500px] opacity-20"
                style={{ background: 'radial-gradient(circle, #00D4AA, transparent 70%)' }}
            />
            <div
                data-parallax="0.25"
                className="glow-blob absolute bottom-[5%] right-[10%] w-[400px] h-[400px] opacity-15"
                style={{ background: 'radial-gradient(circle, #627EEA, transparent 70%)' }}
            />
            <div
                data-parallax="0.1"
                className="glow-blob absolute top-[40%] right-[30%] w-[300px] h-[300px] opacity-10"
                style={{ background: 'radial-gradient(circle, #F0B429, transparent 70%)' }}
            />

            {/* ── Background watermark ── */}
            <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                style={{
                    maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, transparent 100%)',
                }}
            >
                <span
                    className="text-white font-display font-black whitespace-nowrap"
                    style={{ fontSize: 'clamp(8rem, 25vw, 22rem)', opacity: 0.025, letterSpacing: '-0.04em', lineHeight: 1 }}
                >
                    COINDEX
                </span>
            </div>

            {/* ── Floating UI cards ── */}
            {/* Top-left: BTC price card */}
            <div className="float-1 hidden lg:block absolute left-[6%] top-[22%] z-20">
                <PriceCard coin={btc} />
            </div>

            {/* Top-right: ETH price card */}
            <div className="float-2 hidden lg:block absolute right-[6%] top-[18%] z-20">
                <PriceCard coin={eth} />
            </div>

            {/* Bottom-left: Top Gainer (replaced Orderbook) */}
            <div className="float-3 hidden xl:block absolute left-[4%] bottom-[12%] z-20">
                <TopGainerCard coin={topGainer} />
            </div>

            {/* Bottom-right: Trending */}
            <div className="float-4 hidden xl:block absolute right-[5%] bottom-[15%] z-20">
                <TrendingCard trendingList={trendingList} />
            </div>

            {/* ── SOL + BNB cards (mid) ── */}
            <div className="float-2 hidden xl:block absolute right-[3%] top-[50%] -translate-y-1/2 z-20">
                <PriceCard coin={sol} />
            </div>
            <div className="float-3 hidden xl:block absolute left-[3%] top-[52%] -translate-y-1/2 z-20">
                <PriceCard coin={bnb} />
            </div>

            {/* ── Central content ── */}
            <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-8 border border-white/5">
                    <span className="relative flex h-2 w-2">
                        <span className="ping-dot absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    <span className="text-xs font-semibold text-zync-muted">
                        Live data across <span className="text-white">18,000+</span> coins
                    </span>
                </div>

                {/* Headline */}
                <h1
                    className="font-display font-black leading-none tracking-tight mb-6"
                    style={{ fontSize: 'clamp(3.2rem, 10vw, 8rem)', letterSpacing: '-0.04em' }}
                >
                    <span className="block text-white">TRACK</span>
                    <span className="block gradient-text">EVERY</span>
                    <span className="block text-white">COIN</span>
                </h1>

                {/* Sub */}
                <p className="text-lg md:text-xl text-zync-muted max-w-xl leading-relaxed mb-10 font-normal">
                    Real-time prices, candlestick charts, trending coins, and a currency converter —
                    the only crypto dashboard you'll ever need.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <Link href="/markets" className="spin-beam-wrapper rounded-full relative overflow-hidden group">
                        <span className="relative z-10 flex items-center gap-3 bg-zync-surface border border-white/10 rounded-full pl-2 pr-6 py-2 text-base font-semibold text-white">
                            <span className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-black flex-shrink-0 shadow-glow-primary">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                </svg>
                            </span>
                            Explore Coins
                            <svg className="group-hover:translate-x-1 transition-transform" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </span>
                    </Link>
                    <Link href="/trending" className="glass-card rounded-full px-6 py-3 text-base font-semibold text-zync-muted hover:text-white transition-colors border border-white/5">
                        View Trending
                    </Link>
                </div>
            </div>

            {/* ── Bottom fade ── */}
            <div
                className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, transparent, #030712)' }}
            />
        </section>
    );
}
