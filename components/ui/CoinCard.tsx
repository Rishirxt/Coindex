import React from 'react';
import Link from 'next/link';
import CoinIcon from '@/components/ui/CoinIcon';
import { PriceChange } from '@/components/ui/PriceChange';
import { formatCurrency } from '@/lib/utils';
import { Sparkline } from '@/components/ui/Sparkline';

interface CoinCardProps {
  coin: any;
  rank?: number;
  showSparkline?: boolean;
}

export const CoinCard: React.FC<CoinCardProps> = ({ coin, rank, showSparkline = false }) => {
  // Graceful fallback if data is missing
  if (!coin) return null;

  return (
    <Link 
      href={`/coins/${coin.id}`}
      className="glass-card p-4 flex flex-col justify-between hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <CoinIcon src={coin.image || coin.large || coin.thumb} symbol={coin.symbol} name={coin.name} size={40} />
          <div>
            <h3 className="font-bold text-white leading-snug group-hover:text-primary transition-colors">{coin.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50 uppercase tracking-widest">{coin.symbol}</span>
            </div>
          </div>
        </div>
        {rank !== undefined && (
          <div className="text-xs font-mono text-white/30 truncate max-w-16">
            #{rank}
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-xl font-bold tracking-tight text-white mb-1">
            {formatCurrency(coin.current_price || (coin.data && coin.data.price) || 0)}
          </div>
          <PriceChange 
            value={coin.price_change_percentage_24h || (coin.data && coin.data.price_change_percentage_24h?.usd) || 0} 
            className="text-sm" 
          />
        </div>

        {showSparkline && coin.sparkline_in_7d && coin.sparkline_in_7d.price && (
          <Sparkline 
            data={coin.sparkline_in_7d.price} 
            positive={(coin.price_change_percentage_24h || 0) >= 0} 
          />
        )}
      </div>
    </Link>
  );
};
