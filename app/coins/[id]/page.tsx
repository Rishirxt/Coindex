import React from 'react';
import { fetcher, formatCurrency, formatCompactNumber } from '@/lib/coingecko';
import { notFound } from 'next/navigation';
import TradingChart from '@/components/coins/TradingChart';
import Link from 'next/link';

export default async function CoinPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  // Await params for Next.js 15+ compatibility
  let resolvedParams = params;
  if (params instanceof Promise) {
    resolvedParams = await params;
  } else if (typeof (params as any)?.then === 'function') {
    resolvedParams = await (params as any);
  } else {
      // In Next 15+ even if passed as normal object in types, it's virtually a promise.
      // But we will use React.use() or just await
      resolvedParams = await params;
  }

  const id = (resolvedParams as { id: string }).id;

  let coinData: any;
  let chartInitial1D: any[] = [];
  let topCoins: any[] = [];
  
  try {
    const [detailRes, chartRes, marketsRes] = await Promise.all([
      fetcher<any>(`/coins/${id}`, {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false
      }),
      fetcher<any>(`/coins/${id}/market_chart`, {
        vs_currency: 'usd',
        days: '1'
      }),
      fetcher<any[]>('/coins/markets', {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: '5',
        page: '1'
      })
    ]);
    
    coinData = detailRes;
    if (chartRes && chartRes.prices) {
      chartInitial1D = chartRes.prices.map((p: any) => ({ time: p[0], price: p[1] }));
    }
    topCoins = (marketsRes || []).filter((c: any) => c.id !== id).slice(0, 4);
    
  } catch (err: any) {
    if (err.message && err.message.includes('404')) {
      notFound();
    }
    throw err; // Let outer error.tsx catch it for 429s etc.
  }

  if (!coinData || coinData.error) {
    if (coinData?.error === 'coin not found') {
      notFound();
    }
    throw new Error(coinData?.error || 'Failed to load coin data');
  }

  const cleanDescription = coinData.description?.en 
    ? coinData.description.en.replace(/<[^>]*>?/gm, '') 
    : 'No description available for this coin.';

  return (
    <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 mt-12">
      
      <TradingChart coinId={id} coinData={coinData} initialData={chartInitial1D} />

      {/* 2-column layout */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Left wider */}
        <div className="flex-1">
          {/* About Section */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-3">About {coinData.name}</h3>
            <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line">
              {cleanDescription.length > 500 ? cleanDescription.substring(0, 500) + '...' : cleanDescription}
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-[320px] shrink-0">
           <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
             <h3 className="text-lg font-bold text-white">Stats</h3>
             <div className="flex flex-col gap-3">
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-white/40 text-sm">Market Cap</span>
                 <span className="text-white font-mono text-sm">{formatCurrency(coinData.market_data?.market_cap?.usd, true)}</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-white/40 text-sm">24h Volume</span>
                 <span className="text-white font-mono text-sm">{formatCurrency(coinData.market_data?.total_volume?.usd, true)}</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-white/40 text-sm">Circulating Supply</span>
                 <span className="text-white font-mono text-sm">{coinData.market_data?.circulating_supply ? formatCompactNumber(coinData.market_data.circulating_supply) : 'N/A'}</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-white/40 text-sm">Total Supply</span>
                 <span className="text-white font-mono text-sm">{coinData.market_data?.total_supply ? formatCompactNumber(coinData.market_data.total_supply) : '∞'}</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-white/40 text-sm">All Time High</span>
                 <div className="text-right">
                   <span className="text-white font-mono text-sm block">{formatCurrency(coinData.market_data?.ath?.usd)}</span>
                   <span className="text-white/30 text-xs block">{new Date(coinData.market_data?.ath_date?.usd).toLocaleDateString()}</span>
                 </div>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-white/40 text-sm">All Time Low</span>
                 <div className="text-right">
                   <span className="text-white font-mono text-sm block">{formatCurrency(coinData.market_data?.atl?.usd)}</span>
                   <span className="text-white/30 text-xs block">{new Date(coinData.market_data?.atl_date?.usd).toLocaleDateString()}</span>
                 </div>
               </div>
             </div>

             {/* Links */}
             <div className="mt-2 flex flex-col gap-2">
                {coinData.links?.homepage[0] && (
                  <a href={coinData.links.homepage[0]} target="_blank" rel="noopener noreferrer" className="text-sm text-[#00D4AA] hover:underline flex justify-between group">
                    <span>Website</span>
                    <span className="text-white/30 transition-colors group-hover:text-[#00D4AA]">↗</span>
                  </a>
                )}
                {coinData.links?.whitepaper && (
                  <a href={coinData.links.whitepaper} target="_blank" rel="noopener noreferrer" className="text-sm text-[#00D4AA] hover:underline flex justify-between group cursor-pointer">
                    <span>Whitepaper</span>
                    <span className="text-white/30 transition-colors group-hover:text-[#00D4AA]">↗</span>
                  </a>
                )}
             </div>
           </div>
        </div>
      </div>

      {/* More coins */}
      <div className="w-full">
        <h3 className="text-xl font-bold text-white mb-4">More coins you might like</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topCoins.map(c => {
             const change = c.price_change_percentage_24h || 0;
             const isPos = change >= 0;
             return (
               <Link key={c.id} href={`/coins/${c.id}`} className="glass-card p-4 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={c.image} alt={c.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase">{c.symbol}</h3>
                      <p className="text-xs text-white/50 truncate max-w-[100px]">{c.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white/90">
                      {formatCurrency(c.current_price)}
                    </span>
                    <span className={`text-xs font-bold ${isPos ? 'text-[#00D4AA]' : 'text-[#F43F5E]'}`}>
                      {isPos ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                    </span>
                  </div>
               </Link>
             )
          })}
        </div>
      </div>

    </main>
  );
}
