'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetcher } from '@/lib/coingecko.actions';
import { cn, formatCurrency } from '@/lib/utils';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';
import { ArrowDown, ArrowUp, ArrowUpDown, Search, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import EmptyState from '@/components/ui/EmptyState';
import CoinIcon from '@/components/ui/CoinIcon';

type SortConfig = {
    key: keyof CoinMarketData | '';
    direction: 'asc' | 'desc';
};

const LivePricesTable = () => {
    const [coins, setCoins] = useState<CoinMarketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'market_cap_rank', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [error, setError] = useState<string | null>(null);
    const previousPricesRef = useRef<Record<string, number>>({});
    const [priceFlashes, setPriceFlashes] = useState<Record<string, 'up' | 'down'>>({});
    const retryTimeoutRef = useRef<NodeJS.Timeout|null>(null);

    const fetchCoins = async (quiet = false) => {
        if (!quiet) setLoading(true);
        setIsRefreshing(true);
        setError(null);
        try {
            const data = await fetcher<CoinMarketData[]>('/coins/markets', {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 250, // Increased to support more coins as requested
                page: 1,
                sparkline: true,
                price_change_percentage: '24h'
            });

            if (quiet) {
                const newFlashes: Record<string, 'up' | 'down'> = {};
                data.forEach(coin => {
                    const prevPrice = previousPricesRef.current[coin.id];
                    if (prevPrice !== undefined) {
                        if (coin.current_price > prevPrice) newFlashes[coin.id] = 'up';
                        else if (coin.current_price < prevPrice) newFlashes[coin.id] = 'down';
                    }
                    previousPricesRef.current[coin.id] = coin.current_price;
                });

                if (Object.keys(newFlashes).length > 0) {
                    setPriceFlashes(newFlashes);
                    setTimeout(() => setPriceFlashes({}), 1000);
                }
            } else {
                data.forEach(coin => previousPricesRef.current[coin.id] = coin.current_price);
            }

            setCoins(data);
            setLastUpdated(new Date());

            // Dynamic Tab Title
            const btc = data.find(c => c.symbol === 'btc');
            if (btc) {
                document.title = `BTC ${formatCurrency(btc.current_price)} | Zync`;
            }
        } catch (error: any) {
            console.error("Failed to fetch markets data", error);
            if (!quiet) setError(error.message || "Failed to load market data");
            
            // Auto-retry silently every 60s if failed
            if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = setTimeout(() => fetchCoins(true), 60000);
        } finally {
            if (!quiet) setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCoins();
    }, []);

    const handleSort = (key: keyof CoinMarketData) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredCoins = useMemo(() => {
        let result = [...coins];

        if (searchQuery.trim()) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(coin =>
                coin.name.toLowerCase().includes(lowerQuery) ||
                coin.symbol.toLowerCase().includes(lowerQuery)
            );
        }

        if (sortConfig.key) {
            result.sort((a: any, b: any) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];

                if (valA === null || valA === undefined) return 1;
                if (valB === null || valB === undefined) return -1;

                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [coins, searchQuery, sortConfig]);

    const paginatedCoins = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedAndFilteredCoins.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedAndFilteredCoins, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(sortedAndFilteredCoins.length / itemsPerPage);

    // Reset to page 1 when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const SparklineChart = ({ data, isPositive }: { data: number[], isPositive: boolean }) => {
        const formattedData = data.map((price, i) => ({ value: price, index: i }));
        const color = isPositive ? '#22c55e' : '#ef4444';

        return (
            <div className="h-[40px] w-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formattedData}>
                        <defs>
                            <linearGradient id={`gradient-${isPositive ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
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
                            fill={`url(#gradient-${isPositive ? 'up' : 'down'})`}
                            isAnimationActive={false}
                            strokeWidth={2}
                            className="animate-draw-line"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const SortIcon = ({ columnKey }: { columnKey: keyof CoinMarketData }) => {
        if (sortConfig.key !== columnKey) return <ArrowUpDown className="ml-1 h-3 w-3 text-text-muted opacity-50" />;
        return sortConfig.direction === 'asc' ? <ArrowUp className="ml-1 h-3 w-3 text-text-primary" /> : <ArrowDown className="ml-1 h-3 w-3 text-text-primary" />;
    };

    if (loading) {
        return (
            <div className="w-full bg-card-bg rounded-xl p-8 border border-border-color animate-pulse flex flex-col items-center justify-center min-h-[400px]">
                <RefreshCw className="h-8 w-8 text-text-muted animate-spin mb-4" aria-hidden="true" />
                <p className="text-text-muted">Loading live prices...</p>
            </div>
        );
    }

    if (error) {
        return (
            <EmptyState 
                type="fetch-failed" 
                title="Market Connection Error"
                description={error}
                onRetry={() => fetchCoins()}
                className="min-h-[400px]"
            />
        );
    }

    return (
        <div className="bg-card-bg/50 rounded-xl border border-border-color overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border-color flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-text-primary">Live Cryptocurrency Prices</h2>
                    <div className="flex items-center gap-2 text-sm text-text-muted mt-1">
                        <button 
                            onClick={() => fetchCoins()}
                            disabled={isRefreshing}
                            className="flex items-center gap-1 hover:text-text-primary transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
                            {isRefreshing ? "Refreshing..." : "Refresh Now"}
                        </button>
                        <span>•</span>
                        <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                    </div>
                </div>

                <div className="relative w-[160px] focus-within:w-[280px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted transition-colors focus-within:text-text-primary" />
                    <input
                        type="text"
                        placeholder="Search coins..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-card-bg border border-border-color rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table className="min-w-[800px]" aria-label="Cryptocurrency Price Table">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-purple-100/5">
                            <TableHead className="w-[80px] cursor-pointer hover:text-purple-100 select-none" onClick={() => handleSort('market_cap_rank')}>
                                <button className="flex items-center w-full focus:outline-none" aria-label="Sort by rank">
                                    # <SortIcon columnKey="market_cap_rank" />
                                </button>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:text-purple-100 select-none" onClick={() => handleSort('name')}>
                                <button className="flex items-center w-full focus:outline-none" aria-label="Sort by name">
                                    Coin <SortIcon columnKey="name" />
                                </button>
                            </TableHead>
                            <TableHead className="text-right cursor-pointer hover:text-purple-100 select-none" onClick={() => handleSort('current_price')}>
                                <button className="flex items-center justify-end w-full focus:outline-none" aria-label="Sort by price">
                                    Price <SortIcon columnKey="current_price" />
                                </button>
                            </TableHead>
                            <TableHead className="text-right cursor-pointer hover:text-purple-100 select-none" onClick={() => handleSort('price_change_percentage_24h')}>
                                <button className="flex items-center justify-end w-full focus:outline-none" aria-label="Sort by 24 hour change">
                                    24h % <SortIcon columnKey="price_change_percentage_24h" />
                                </button>
                            </TableHead>
                            <TableHead className="text-right cursor-pointer hover:text-purple-100 select-none" onClick={() => handleSort('market_cap')}>
                                <button className="flex items-center justify-end w-full focus:outline-none" aria-label="Sort by market cap">
                                    Market Cap <SortIcon columnKey="market_cap" />
                                </button>
                            </TableHead>
                            <TableHead className="text-right cursor-pointer hover:text-purple-100 select-none hidden md:table-cell" onClick={() => handleSort('total_volume')}>
                                <button className="flex items-center justify-end w-full focus:outline-none" aria-label="Sort by volume">
                                    Volume (24h) <SortIcon columnKey="total_volume" />
                                </button>
                            </TableHead>
                            <TableHead className="text-right w-[150px]">Last 7 Days</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedCoins.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12">
                                    <EmptyState 
                                        type="no-results" 
                                        description={`No coins found matching "${searchQuery}"`}
                                        className="bg-transparent border-none"
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedCoins.map((coin, index) => {
                                const isPositive = coin.price_change_percentage_24h >= 0;
                                const flashStatus = priceFlashes[coin.id];
                                return (
                                    <TableRow
                                        key={coin.id}
                                        className={cn(
                                            "border-border-color transition-colors duration-150 ease-in-out group cursor-pointer animate-slide-up-fade",
                                            flashStatus === 'up' ? "animate-flash-green" : flashStatus === 'down' ? "animate-flash-red" : "hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                        style={{ animationDelay: `${(index % itemsPerPage) * 40}ms` }}
                                    >
                                        <TableCell className="font-medium text-text-muted" scope="row">
                                            {coin.market_cap_rank}
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/coins/${coin.id}`} className="flex items-center gap-3" aria-label={`View details for ${coin.name}`}>
                                                <CoinIcon src={coin.image} symbol={coin.symbol} name={coin.name} size={32} />
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-text-primary group-hover:text-text-muted transition-colors">{coin.name}</span>
                                                    <span className="text-xs text-text-muted uppercase">{coin.symbol}</span>
                                                </div>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-text-primary">
                                            {formatCurrency(coin.current_price)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className={cn("inline-flex items-center justify-end font-medium", isPositive ? "text-positive" : "text-negative")} aria-label={`${isPositive ? 'Increased' : 'Decreased'} by ${Math.abs(coin.price_change_percentage_24h).toFixed(2)} percent`}>
                                                {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-text-primary/80">
                                            {formatCurrency(coin.market_cap, 'usd', true)}
                                        </TableCell>
                                        <TableCell className="text-right text-text-primary/80 hidden md:table-cell">
                                            {formatCurrency(coin.total_volume, 'usd', true)}
                                        </TableCell>
                                        <TableCell className="text-right pb-1 pt-1 justify-end flex">
                                            {coin.sparkline_in_7d && (
                                                <SparklineChart
                                                    data={coin.sparkline_in_7d.price}
                                                    isPositive={isPositive}
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="p-4 border-t border-border-color flex items-center justify-between">
                    <p className="text-sm text-text-muted">
                        Showing <span className="text-text-primary">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-text-primary">{Math.min(currentPage * itemsPerPage, sortedAndFilteredCoins.length)}</span> of <span className="text-text-primary">{sortedAndFilteredCoins.length}</span> coins
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm bg-dark-400 border border-purple-100/10 rounded-lg text-purple-100/70 hover:text-purple-100 disabled:opacity-30 transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm bg-dark-400 border border-purple-100/10 rounded-lg text-purple-100/70 hover:text-purple-100 disabled:opacity-30 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LivePricesTable;
