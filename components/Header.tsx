'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { RefreshButton } from '@/components/ui/RefreshButton'

interface SearchCoin {
  id: string
  name: string
  symbol: string
  thumb: string
  large: string
}

export default function Header() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchCoin[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const searchCoins = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        const url = new URL('https://api.coingecko.com/api/v3/search')
        url.searchParams.set('query', query)
        const res = await fetch(url.toString())
        const data = await res.json()
        setResults(data.coins?.slice(0, 10) || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    const t = setTimeout(searchCoins, 300)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setQuery('')
      }
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-[#030712]/80 backdrop-blur-md border-b border-white/5 h-16">
      <div className="flex items-center justify-between px-4 h-full max-w-7xl mx-auto">
        {/* Left */}
        <div className="flex-1 relative z-50">
          <Link href="/" className="logo-text text-xl hover:opacity-80 transition-opacity">
            COINDEX
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md w-full z-50 relative" ref={searchRef}>
          <div className="relative flex items-center w-full h-10 rounded-full bg-white/5 border border-white/10 px-3 transition-colors focus-within:border-primary focus-within:bg-white/10 hover:border-white/20">
            <Search size={16} className="text-white/40 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search coins..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-white/40"
            />
          </div>

          {/* Dropdown menu */}
          {open && (query.trim().length > 0) && (
            <div className="absolute top-full mt-2 left-0 right-0 glass-card max-h-[400px] overflow-y-auto p-2 shadow-2xl">
              {loading && <div className="text-white/50 text-xs text-center p-4">Loading...</div>}
              {!loading && results.length === 0 && (
                <div className="text-white/50 text-xs text-center p-4">No results found.</div>
              )}
              {!loading && results.map((coin) => (
                <Link
                  key={coin.id}
                  href={`/coins/${coin.id}`}
                  onClick={() => {
                    setOpen(false)
                    setQuery('')
                  }}
                  className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <img src={coin.thumb} alt={coin.name} className="w-5 h-5 rounded-full" />
                  <span className="text-sm font-medium text-white">{coin.name}</span>
                  <span className="text-xs text-white/50">{coin.symbol}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex-1 flex justify-end items-center gap-4 relative z-50">
          <RefreshButton />
          <span className="text-[11px] text-white/30 hidden sm:inline">Powered by CoinGecko</span>
        </div>
      </div>
    </header>
  )
}