import React from 'react'
import Link from 'next/link'
import { fetcher, parseAndFormatCompact } from '@/lib/coingecko'
import { Flame } from 'lucide-react'

export default async function TrendingPage() {
  let trending = []
  try {
    const data = await fetcher<any>('/search/trending')
    if (data?.coins) {
      trending = data.coins
    }
  } catch (e) {
    console.error(e)
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 pb-24 mt-14 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 flex items-center gap-4">
            <Flame className="text-[#F0B429] w-8 h-8 md:w-12 md:h-12" /> Trending Now
          </h1>
          <p className="text-white/50 text-lg">
            The most searched coins on CoinGecko in the last 24 hours.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {trending.length > 0 ? trending.map((coinItem: any) => {
          const coin = coinItem.item
          const priceChange = coin.data.price_change_percentage_24h?.usd || 0
          const isPos = priceChange >= 0
          return (
            <Link key={coin.id} href={`/coins/${coin.id}`} className="glass-card p-5 rounded-2xl hover:bg-white/10 transition-colors group flex flex-col justify-between h-32">
               <div className="flex items-start gap-4">
                 <img src={coin.large} alt={coin.name} className="w-10 h-10 rounded-full" />
                 <div className="flex flex-col overflow-hidden">
                   <span className="font-bold text-white truncate group-hover:text-[#00D4AA] transition-colors">{coin.name}</span>
                   <span className="text-xs text-white/40 uppercase tracking-wider">{coin.symbol}</span>
                 </div>
               </div>
               <div className="flex justify-between items-end mt-auto gap-2">
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
                    <span className={`text-xs font-bold font-mono ${isPos ? 'text-[#00D4AA]' : 'text-[#F43F5E]'}`}>
                      {isPos ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%
                    </span>
                 </div>
               </div>
            </Link>
          )
        }) : (
          <div className="col-span-full py-12 text-center text-white/40">No trending data available at the moment. Hit the refresh button to try again.</div>
        )}
      </div>
    </main>
  )
}
