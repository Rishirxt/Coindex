'use client';

import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/coingecko.actions';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeftRight, Search, Loader2 } from 'lucide-react';

interface CoinOption {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
}

export default function ConverterTool() {
  const [coins, setCoins] = useState<CoinOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Default to BTC and ETH
  const [fromCoin, setFromCoin] = useState<CoinOption | null>(null);
  const [toCoin, setToCoin] = useState<CoinOption | null>(null);
  
  const [amount, setAmount] = useState<string>('1');

  // Search popups
  const [searchOpen, setSearchOpen] = useState<'from' | 'to' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTopCoins = async () => {
      try {
        const data = await fetcher<any[]>('/coins/markets', {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 250,
        });
        setCoins(data);
        if (data.length > 1) {
          setFromCoin(data.find((c: any) => c.symbol === 'btc') || data[0]);
          setToCoin(data.find((c: any) => c.symbol === 'eth') || data[1]);
        }
      } catch (err) {
        console.error("Failed to load coins for converter", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopCoins();
  }, []);

  const handleSwap = () => {
    setFromCoin(toCoin);
    setToCoin(fromCoin);
  };

  const getExchangeRate = () => {
    if (!fromCoin || !toCoin) return 0;
    return fromCoin.current_price / toCoin.current_price;
  };

  const calculateResult = () => {
    const rate = getExchangeRate();
    const val = parseFloat(amount) || 0;
    return val * rate;
  };

  const filteredCoins = coins.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="glass-card max-w-3xl mx-auto p-12 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto relative">
      
      <div className="glass-card p-6 md:p-8 rounded-2xl relative z-10">
        
        {/* From Section */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 transition-colors focus-within:border-primary/50">
          <label className="text-white/40 text-sm mb-2 block">You Pay</label>
          <div className="flex items-center justify-between gap-4">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-3xl md:text-4xl text-white font-mono font-bold outline-none w-full min-w-0"
              placeholder="0.00"
            />
            {fromCoin && (
              <button 
                onClick={() => setSearchOpen('from')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors shrink-0"
              >
                <img src={fromCoin.image} alt={fromCoin.name} className="w-6 h-6 rounded-full" />
                <span className="font-bold text-white uppercase">{fromCoin.symbol}</span>
                <span className="text-white/50 text-xs">▼</span>
              </button>
            )}
          </div>
          <p className="text-white/40 text-sm mt-2 font-mono">
            {fromCoin ? formatCurrency((parseFloat(amount) || 0) * fromCoin.current_price) : '$0.00'}
          </p>
        </div>

        {/* Swap Button */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <button 
            onClick={handleSwap}
            className="w-12 h-12 bg-bg-secondary border-4 border-bg-primary rounded-full flex items-center justify-center text-white hover:text-primary hover:rotate-180 transition-all duration-300 shadow-xl"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        {/* To Section */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4 transition-colors">
          <label className="text-white/40 text-sm mb-2 block">You Receive</label>
          <div className="flex items-center justify-between gap-4">
            <input 
              type="text" 
              value={calculateResult().toLocaleString(undefined, { maximumFractionDigits: 6 })}
              readOnly
              className="bg-transparent text-3xl md:text-4xl text-white font-mono font-bold outline-none w-full min-w-0 opacity-90"
            />
            {toCoin && (
              <button 
                onClick={() => setSearchOpen('to')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors shrink-0"
              >
                <img src={toCoin.image} alt={toCoin.name} className="w-6 h-6 rounded-full" />
                <span className="font-bold text-white uppercase">{toCoin.symbol}</span>
                <span className="text-white/50 text-xs">▼</span>
              </button>
            )}
          </div>
          <p className="text-white/40 text-sm mt-2 font-mono">
            {toCoin ? formatCurrency(calculateResult() * toCoin.current_price) : '$0.00'}
          </p>
        </div>

        {/* Exchange Rate Summary */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-white/60 text-sm font-medium">
            1 {fromCoin?.symbol.toUpperCase()} = {getExchangeRate().toLocaleString(undefined, { maximumFractionDigits: 6 })} {toCoin?.symbol.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Coin Selector Modal */}
      {searchOpen && (
        <div className="absolute inset-0 z-50 glass-card bg-bg-primary/95 flex flex-col p-4 rounded-2xl animate-in fade-in duration-200">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
            <Search className="w-5 h-5 text-white/40" />
            <input 
              type="text" 
              placeholder="Search for a coin..." 
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent flex-1 text-white outline-none"
            />
            <button 
              onClick={() => { setSearchOpen(null); setSearchQuery(''); }}
              className="text-white/50 hover:text-white px-2 py-1"
            >
              Cancel
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredCoins.map(coin => (
              <button
                key={coin.id}
                onClick={() => {
                  if (searchOpen === 'from') setFromCoin(coin);
                  else setToCoin(coin);
                  setSearchOpen(null);
                  setSearchQuery('');
                }}
                className="w-full flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors text-left"
              >
                <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                <div className="flex-1 flex flex-col">
                  <span className="font-bold text-white">{coin.name}</span>
                  <span className="text-xs text-white/50 uppercase">{coin.symbol}</span>
                </div>
                <span className="font-mono text-sm text-white/80">{formatCurrency(coin.current_price)}</span>
              </button>
            ))}
            {filteredCoins.length === 0 && (
              <p className="text-center text-white/50 py-12">No coins found.</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
