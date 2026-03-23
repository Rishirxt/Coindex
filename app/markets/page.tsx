import React from 'react';
import { fetcher } from '@/lib/coingecko';
import MarketsTable from '@/components/markets/MarketsTable';

export default async function MarketsPage() {
    let coins = [];
    try {
        coins = await fetcher<any[]>('/coins/markets', {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            sparkline: true,
            price_change_percentage: '24h'
        });
    } catch (e) {
        console.error("Failed to fetch markets:", e);
    }

    return (
        <main className="w-full pb-24 mt-8 flex flex-col gap-6">
            <div className="px-4 md:px-8">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">Markets</h1>
                <p className="text-white/50 text-base max-w-2xl">
                    Real-time prices, charts, and metrics for the top 100 cryptocurrencies by market cap.
                </p>
            </div>
            
            <MarketsTable coins={coins} />
        </main>
    );
}
