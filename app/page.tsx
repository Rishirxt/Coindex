import React from 'react';
import Link from 'next/link';
import HeroSection from '@/components/home/HeroSection';
import { Ticker } from '@/components/ui/Ticker';
import { fetcher, parseAndFormatCompact } from '@/lib/coingecko';
import { ArrowRight, Flame } from 'lucide-react';

const fetchTickerCoins = async () => {
  try {
    const data = await fetcher<any[]>('/coins/markets', {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: '20',
      page: '1',
      sparkline: 'false',
    });
    return data || [];
  } catch (error) {
    console.error("Failed to fetch ticker data:", error);
    return [];
  }
};

const fetchTrendingCoins = async () => {
  try {
    const data = await fetcher<any>('/search/trending');
    return data?.coins?.slice(0, 4) || [];
  } catch (error) {
    console.error("Failed to fetch trending:", error);
    return [];
  }
};

const Page = async () => {
  const tickerCoins = await fetchTickerCoins();
  const trendingCoins = await fetchTrendingCoins();

  return (
    <main className="w-full flex flex-col overflow-x-hidden pb-12 min-h-screen">
      <HeroSection markets={tickerCoins} trendingList={trendingCoins} />
      
      {tickerCoins.length > 0 && (
        <div className="w-full -mt-px relative z-20">
          <Ticker coins={tickerCoins} />
        </div>
      )}

      {trendingCoins.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 w-full mt-24">
          <div className="flex items-center gap-3 mb-8">
            <Flame className="text-[#F0B429] w-6 h-6" />
            <h2 className="text-2xl font-bold text-white">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingCoins.map((coinItem: any) => {
              const coin = coinItem.item;
              const priceChange = coin.data.price_change_percentage_24h?.usd || 0;
              const isPositive = priceChange >= 0;
              return (
                <Link key={coin.id} href={`/coins/${coin.id}`} className="glass-card p-4 rounded-2xl hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={coin.thumb} alt={coin.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase">{coin.symbol}</h3>
                      <p className="text-xs text-white/50 truncate max-w-[100px]">{coin.name}</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between mt-auto gap-2">
                    <div className="flex flex-col">
                      <span className="text-white/40 text-[10px] uppercase tracking-wider">Mkt Cap</span>
                      <span className="text-xs font-mono font-bold text-white/80">
                        {parseAndFormatCompact(coin.data.market_cap)}
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-mono font-bold text-white/90">
                        {coin.data.price}
                      </span>
                      <span className={`text-xs font-bold font-mono ${isPositive ? 'text-[#00D4AA]' : 'text-[#F43F5E]'}`}>
                        {isPositive ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 w-full mt-16">
        <Link href="/markets" className="glass-card w-full p-6 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors group">
          <span className="text-lg font-bold text-white group-hover:text-[#00D4AA] transition-colors">
            Browse All Coins
          </span>
          <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-[#00D4AA] group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </main>
  );
};

export default Page;