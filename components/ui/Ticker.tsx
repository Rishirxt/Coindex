'use client';

import React from 'react';
import Link from 'next/link';
import { PriceChange } from '@/components/ui/PriceChange';
import { formatCurrency } from '@/lib/utils';

interface TickerProps {
  coins: any[];
}

export const Ticker: React.FC<TickerProps> = ({ coins }) => {
  if (!coins || coins.length === 0) return null;

  // We duplicate the list to create a seamless infinite scroll illusion
  const doubledCoins = [...coins, ...coins];

  return (
    <div className="w-full border-y border-white/5 bg-black/20 backdrop-blur-md overflow-hidden flex whitespace-nowrap py-2 z-10 relative">
      <div className="animate-marquee flex items-center min-w-full">
        {doubledCoins.map((coin, i) => (
          <Link 
            href={`/coins/${coin.id}`} 
            key={`${coin.id}-${i}`}
            className="flex items-center gap-3 px-6 hover:bg-white/5 rounded transition-colors group"
          >
            <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
              {coin.symbol.toUpperCase()}
            </span>
            <span className="text-sm font-mono text-white">
              {formatCurrency(coin.current_price)}
            </span>
            <PriceChange 
              value={coin.price_change_percentage_24h} 
              className="text-xs" 
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
