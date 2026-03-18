import React, { Suspense } from 'react';
import Image from 'next/image';
import { fetcher } from '@/lib/coingecko.actions';
import { formatCurrency, cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, ArrowLeft, Globe, MessagesSquare, Code } from 'lucide-react';
import Link from 'next/link';
import CoinChart from '@/components/coins/CoinChart';
import WatchlistButton from '@/components/coins/WatchlistButton';

async function getCoinDetails(id: string) {
    try {
        const data = await fetcher<CoinDetailsData>(`/coins/${id}`, {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: false,
        });
        return data;
    } catch (error) {
        console.error("Failed to fetch coin details", error);
        return null;
    }
}

export default async function CoinPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const coin = await getCoinDetails(resolvedParams.id);

    if (!coin) {
        return (
            <main className="main-container py-12 flex flex-col items-center">
                <h1 className="text-2xl font-bold text-text-primary mb-4">Coin not found</h1>
                <Link href="/" className="text-purple-400 hover:text-purple-300 flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
            </main>
        );
    }

    const priceChange = coin.market_data.price_change_percentage_24h_in_currency?.usd || 0;
    const isTrendingUp = priceChange >= 0;

    return (
        <main className="main-container py-8">
            <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-6">
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 bg-card-bg/50 p-6 rounded-2xl border border-border-color">
                <div className="flex items-center gap-5">
                    <Image src={coin.image.large} alt={coin.name} width={64} height={64} className="rounded-full bg-black/5 dark:bg-white/5 p-1" />
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
                            {coin.name}
                            <span className="text-lg bg-card-bg px-2 py-1 rounded border border-border-color text-text-muted uppercase">
                                {coin.symbol}
                            </span>
                            <span className="text-sm bg-purple-500/20 text-purple-300 px-2 py-1 rounded ml-2">
                                Rank #{coin.market_cap_rank}
                            </span>
                        </h1>

                        <div className="flex items-center gap-4 mt-3">
                            <span className="text-3xl font-bold text-text-primary tracking-tight">
                                {formatCurrency(coin.market_data.current_price.usd)}
                            </span>
                            <div className={cn("flex items-center gap-1 font-medium px-2 py-1 rounded text-sm",
                                isTrendingUp ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative"
                            )}>
                                {isTrendingUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                <span>{Math.abs(priceChange).toFixed(2)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                    <WatchlistButton coinId={coin.id} />

                    <div className="flex gap-2">
                        {coin.links.homepage[0] && (
                            <a href={coin.links.homepage[0]} target="_blank" rel="noreferrer" className="p-2 bg-card-bg rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-text-muted hover:text-text-primary" title="Website">
                                <Globe size={18} />
                            </a>
                        )}
                        {coin.links.subreddit_url && (
                            <a href={coin.links.subreddit_url} target="_blank" rel="noreferrer" className="p-2 bg-card-bg rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-text-muted hover:text-text-primary" title="Reddit">
                                <MessagesSquare size={18} />
                            </a>
                        )}
                        {coin.links.blockchain_site[0] && (
                            <a href={coin.links.blockchain_site[0]} target="_blank" rel="noreferrer" className="p-2 bg-card-bg rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-text-muted hover:text-text-primary" title="Explorer">
                                <Code size={18} />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Chart & About) */}
                <div className="lg:col-span-2 space-y-8">
                    <Suspense fallback={
                        <div className="w-full h-[400px] bg-card-bg rounded-xl border border-border-color animate-pulse" />
                    }>
                        <CoinChart coinId={coin.id} />
                    </Suspense>

                    {coin.description?.en && (
                        <div className="bg-card-bg/50 rounded-xl border border-border-color p-6">
                            <h3 className="text-xl font-bold text-text-primary mb-4">About {coin.name}</h3>
                            <div
                                className="text-text-muted leading-relaxed text-sm format-links"
                                dangerouslySetInnerHTML={{ __html: coin.description.en }}
                            />
                        </div>
                    )}
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-4 animate-slide-in-right">
                    <div className="bg-card-bg/50 rounded-xl border border-border-color p-6">
                        <h3 className="text-xl font-bold text-text-primary mb-6">Market Stats</h3>

                        <div className="space-y-5">
                            <div className="flex justify-between items-center border-b border-border-color pb-3">
                                <span className="text-text-muted">Market Cap</span>
                                <span className="text-text-primary font-medium">{formatCurrency(coin.market_data.market_cap.usd)}</span>
                            </div>

                            <div className="flex justify-between items-center border-b border-border-color pb-3">
                                <span className="text-text-muted">Volume (24h)</span>
                                <span className="text-text-primary font-medium">{formatCurrency(coin.market_data.total_volume.usd)}</span>
                            </div>

                            <div className="flex justify-between items-center border-b border-border-color pb-3">
                                <span className="text-text-muted">Circulating Supply</span>
                                <span className="text-text-primary font-medium">
                                    {coin.market_data.circulating_supply?.toLocaleString()} {coin.symbol.toUpperCase()}
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-b border-border-color pb-3">
                                <span className="text-text-muted">Max Supply</span>
                                <span className="text-text-primary font-medium">
                                    {coin.market_data.max_supply ? coin.market_data.max_supply.toLocaleString() : '∞'} {coin.symbol.toUpperCase()}
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-b border-border-color pb-3">
                                <span className="text-text-muted">24h High / Low</span>
                                <span className="text-text-primary font-medium">
                                    {formatCurrency(coin.market_data.high_24h?.usd || 0)} / {formatCurrency(coin.market_data.low_24h?.usd || 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
