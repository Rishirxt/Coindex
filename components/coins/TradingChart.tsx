'use client'

import React, { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/coingecko'

export default function TradingChart({ 
  coinId, 
  coinData, 
  initialData 
}: { 
  coinId: string, 
  coinData: any, 
  initialData: any[] 
}) {
  const [range, setRange] = useState('1')
  const [chartData, setChartData] = useState(initialData)
  const [loading, setLoading] = useState(false)

  // 1D, 1W (7), 1M (30), 1Y (365)
  const ranges = [
    { label: '1D', value: '1' },
    { label: '1W', value: '7' },
    { label: '1M', value: '30' },
    { label: '1Y', value: '365' },
  ]

  useEffect(() => {
    if (range === '1' && chartData === initialData) return // Skip initial fetch
    
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true)
      try {
        const url = new URL(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`)
        url.searchParams.set('vs_currency', 'usd')
        url.searchParams.set('days', range)
        const res = await fetch(url.toString())
        const data = await res.json()
        if (isMounted && data.prices) {
          setChartData(data.prices.map((p: any) => ({ time: p[0], price: p[1] })))
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchData()
    return () => { isMounted = false; }
  }, [range, coinId, chartData, initialData])

  const priceChange = coinData.market_data?.price_change_percentage_24h || 0
  const isPositive24h = priceChange >= 0
  
  // To determine stroke color based on 7d direction (or fallback to 24h if missing)
  const strokeColor = (coinData.market_data?.price_change_percentage_7d_in_currency?.usd || priceChange) >= 0 ? '#00D4AA' : '#F43F5E'

  // Format YAxis domain to look better
  const minPrice = Math.min(...chartData.map(d => d.price))
  const maxPrice = Math.max(...chartData.map(d => d.price))
  const buffer = (maxPrice - minPrice) * 0.05

  return (
    <div className="w-full mb-8">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <img src={coinData.image?.large} alt={coinData.name} className="w-8 h-8 rounded-full" />
          <h1 className="text-2xl font-bold text-white leading-none">{coinData.name}</h1>
          <span className="text-white/50 font-mono text-sm uppercase">{coinData.symbol}</span>
          <span className="text-3xl font-mono font-bold text-white ml-2">{formatCurrency(coinData.market_data?.current_price?.usd)}</span>
          <span className={`px-2 py-1 flex items-center gap-1 rounded font-bold text-sm ${isPositive24h ? 'bg-[#00D4AA]/10 text-[#00D4AA]' : 'bg-[#F43F5E]/10 text-[#F43F5E]'}`}>
            {isPositive24h ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%
          </span>
        </div>
        
        <div className="flex items-center glass-card p-1 rounded-lg">
          {ranges.map(r => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${range === r.value ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[420px] glass-card rounded-2xl p-4 relative">
        {loading && <div className="absolute inset-0 z-10 bg-[#030712]/50 backdrop-blur-sm flex items-center justify-center rounded-2xl text-white/50">Loading chart...</div>}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(3, 7, 18, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              labelFormatter={(label) => {
                const d = new Date(label)
                return range === '1' ? d.toLocaleTimeString() : d.toLocaleDateString()
              }}
              formatter={(value: any) => [formatCurrency(value as number), 'Price']}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={strokeColor} 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              strokeWidth={2}
              isAnimationActive={false}
            />
            {/* Hidden axes to power the area chart scaling */}
            <XAxis dataKey="time" hide />
            <YAxis domain={[minPrice - buffer, maxPrice + buffer]} hide />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
