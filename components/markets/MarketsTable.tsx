'use client'

import React, { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { formatCurrency } from '@/lib/coingecko'
import { useRouter } from 'next/navigation'

function SimpleSparkline({ data, isPositive }: { data?: number[], isPositive: boolean }) {
  if (!data || data.length === 0) return <div className="w-24 h-8 opacity-20 bg-white/5 rounded" />
  const color = isPositive ? '#00D4AA' : '#F43F5E'
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 32 - ((val - min) / range) * 32
    return `${i === 0 ? 'M' : 'L'}${x},${y}`
  })
  return (
    <svg width="100" height="32" viewBox="0 0 100 32" className="overflow-visible stroke-current opacity-80" style={{ color }}>
      <path d={pts.join(' ')} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export default function MarketsTable({ coins }: { coins: any[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'all' | 'gainers' | 'losers'>('all')

  const filteredCoins = useMemo(() => {
    let res = coins || []
    if (search.trim()) {
      const q = search.toLowerCase()
      res = res.filter(c => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
    }
    if (tab === 'gainers') {
      res = res.filter(c => c.price_change_percentage_24h >= 0).sort((a,b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    } else if (tab === 'losers') {
      res = res.filter(c => c.price_change_percentage_24h < 0).sort((a,b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    }
    return res
  }, [coins, search, tab])

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 px-4 md:px-8">
        <div className="flex items-center p-1 glass-card rounded-lg">
          {(['all', 'gainers', 'losers'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text"
            placeholder="Search coins..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full glass-card h-10 pl-9 pr-4 rounded-lg text-sm text-white focus:outline-none focus:border-[#00D4AA]/50 transition-colors placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-y border-white/5 bg-[#030712]/95 backdrop-blur sticky top-16 z-30">
              <th className="py-4 px-4 md:px-8 text-xs font-semibold text-white/40 uppercase tracking-wider w-16">#</th>
              <th className="py-4 px-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Coin</th>
              <th className="py-4 px-4 text-xs font-semibold text-white/40 uppercase tracking-wider text-right">Price</th>
              <th className="py-4 px-4 text-xs font-semibold text-white/40 uppercase tracking-wider text-right">24h%</th>
              <th className="py-4 px-4 text-xs font-semibold text-white/40 uppercase tracking-wider text-right hidden lg:table-cell">Market Cap</th>
              <th className="py-4 px-4 text-xs font-semibold text-white/40 uppercase tracking-wider text-right hidden xl:table-cell">Volume</th>
              <th className="py-4 px-4 md:px-8 text-xs font-semibold text-white/40 uppercase tracking-wider text-right hidden md:table-cell w-32">Last 7 Days</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredCoins.map((coin, i) => {
              const change = coin.price_change_percentage_24h || 0
              const isPos = change >= 0
              return (
                <tr key={coin.id} className="hover:bg-white/[0.04] transition-colors group cursor-pointer relative" onClick={() => router.push(`/coins/${coin.id}`)}>
                  <td className="py-5 px-4 md:px-8 text-sm text-white/50 font-mono">{coin.market_cap_rank || i+1}</td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm group-hover:text-[#00D4AA] transition-colors">{coin.name}</span>
                        <span className="text-xs text-white/40 uppercase tracking-wider">{coin.symbol}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-sm font-bold text-white text-right font-mono">
                    {formatCurrency(coin.current_price)}
                  </td>
                  <td className={`py-5 px-4 text-sm font-bold text-right font-mono ${isPos ? 'text-[#00D4AA]' : 'text-[#F43F5E]'}`}>
                    {isPos ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                  </td>
                  <td className="py-5 px-4 text-sm text-white/70 text-right font-mono hidden lg:table-cell">
                    {formatCurrency(coin.market_cap, true)}
                  </td>
                  <td className="py-5 px-4 text-sm text-white/50 text-right font-mono hidden xl:table-cell">
                    {formatCurrency(coin.total_volume, true)}
                  </td>
                  <td className="py-5 px-4 md:px-8 text-right hidden md:table-cell">
                    <div className="flex justify-end pr-2">
                       <SimpleSparkline data={coin.sparkline_in_7d?.price} isPositive={isPos} />
                    </div>
                  </td>
                </tr>
              )
            })}
            {filteredCoins.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-white/40">No coins found matching criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
