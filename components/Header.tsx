'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { fetcher } from '@/lib/coingecko.actions'
import { Search, Menu, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { ThemeToggle } from './ThemeToggle'
import CurrencySwitcher from '@/components/layout/CurrencySwitcher'

const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchCoin[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K or / to search
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName))) {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    const searchCoins = async () => {
      if (query.trim().length === 0) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetcher<{ coins: SearchCoin[] }>('/search', { query });
        setResults(response.coins || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchCoins, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/10 bg-background/80 backdrop-blur-xl transition-all duration-300">
      <div className="main-container inner flex items-center justify-between py-4">
        <Link href="/" className="z-50 logo-text">
          ZYNC
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href='/' className={cn('nav-link', {
            'is-active': pathname === '/',
            'is-home': true
          })}>Home</Link>

          <SearchDialog open={open} onOpenChange={setOpen} query={query} setQuery={setQuery} loading={loading} results={results} />

          <Link href="/coins" className={cn('nav-link', { 'is-active': pathname === '/coins' })}>All Coins</Link>
          <CurrencySwitcher />
          <ThemeToggle />
        </nav>

        {/* Mobile Nav Trigger */}
        <div className="flex md:hidden items-center gap-4">
          <button 
            onClick={() => setOpen(true)}
            className="p-2 text-purple-100/50 hover:text-purple-100"
            aria-label="Search"
          >
            <Search size={22} />
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-purple-100/50 hover:text-purple-100 z-50"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={cn(
        "fixed inset-0 z-40 bg-dark-400 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col pt-24 px-6 gap-8",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <Link 
          href="/" 
          onClick={() => setIsMobileMenuOpen(false)}
          className={cn("text-2xl font-bold", pathname === '/' ? "text-purple-400" : "text-purple-100/70")}
        >
          Home
        </Link>
        <Link 
          href="/coins" 
          onClick={() => setIsMobileMenuOpen(false)}
          className={cn("text-2xl font-bold", pathname === '/coins' ? "text-purple-400" : "text-purple-100/70")}
        >
          All Coins
        </Link>
        <div className="flex flex-col gap-6 mt-4 border-t border-purple-100/10 pt-8">
          <div className="flex items-center justify-between">
            <span className="text-purple-100/50">Currency</span>
            <CurrencySwitcher />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-purple-100/50">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

// Extract SearchDialog to keep Header clean
const SearchDialog = ({ open, onOpenChange, query, setQuery, loading, results }: any) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-dark-400 border border-purple-100/10 rounded-lg text-purple-100/50 hover:text-purple-100 transition-colors"
          aria-label="Search coins (shortcut: /)"
        >
          <Search size={16} />
          <span className="text-sm">Search</span>
          <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-purple-100/10 bg-dark-400 px-1.5 font-mono text-[10px] font-medium text-purple-100/50">
            <span className="text-xs">/</span>
          </kbd>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl bg-dark-400 border-purple-100/10 text-purple-100 rounded-xl!">
        <DialogHeader>
          <DialogTitle className="sr-only">Search Coins</DialogTitle>
        </DialogHeader>
        <div className="flex items-center border-b border-purple-100/10 pb-4 pt-2">
          <Search className="mr-3 h-5 w-5 text-purple-100/50 shrink-0" />
          <input
            className="flex h-11 w-full rounded-md bg-transparent text-base outline-none placeholder:text-purple-100/50"
            placeholder="Search for a coin..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            aria-label="Search coin input"
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar mt-2 pr-2">
          {loading && <div className="text-center text-purple-100/50 py-8 text-sm">Searching...</div>}
          {!loading && query.length > 0 && results.length === 0 && (
            <div className="text-center text-purple-100/50 py-8 text-sm">No results found.</div>
          )}
          {!loading && results.map((coin: SearchCoin) => (
            <Link
              key={coin.id}
              href={`/coins/${coin.id}`}
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors border-b border-purple-100/5 last:border-0"
              aria-label={`View ${coin.name}`}
            >
              <Image src={coin.large} alt={coin.name} width={32} height={32} className="rounded-full shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium text-sm text-white">{coin.name}</span>
                <span className="text-xs text-purple-100/50 uppercase">{coin.symbol}</span>
              </div>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Header;