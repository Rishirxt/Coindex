import Image from "next/image";
import DataTable from '@/components/DataTable';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { fetcher } from '@/lib/coingecko.actions';
import type { ReactNode } from 'react';

interface ColumnConfig {
  header: string;
  cellClassName: string;
  cell: (coin: TrendingCoin) => ReactNode;
}

const columns: ColumnConfig[] = [
  {
    header: 'Name',
    cellClassName: 'name-cell',
    cell: (coin: TrendingCoin) => {
      const item = coin.item;
      return (
        <a href={`/coins/${item.id}`} className="flex items-center gap-3">
          <Image src={item.large} alt={item.name} width={36} height={36} className="rounded-full" />
          <div className="flex flex-col">
            <span className="text-purple-100 font-medium">{item.name}</span>
            <span className="text-purple-100/50 text-xs uppercase">{item.symbol}</span>
          </div>
        </a>
      );
    },
  },
  {
    header: '24h Change',
    cellClassName: 'name-cell',
    cell: (coin: TrendingCoin) => {
      const item = coin.item;
      const change = item.data.price_change_percentage_24h.usd;
      const isTrendingUp = change > 0;
      return (
        <div className={cn('price-change flex items-center gap-1 font-medium', isTrendingUp ? 'text-green-500' : 'text-red-500')}>
          {isTrendingUp ? (
            <TrendingUp width={16} height={16} />
          ) : (
            <TrendingDown width={16} height={16} />
          )}
          <span>{Math.abs(change).toFixed(2)}%</span>
        </div>
      );
    },
  },
  {
    header: 'Price',
    cellClassName: 'price-cell',
    cell: (coin: TrendingCoin) => `$${coin.item.data.price.toFixed(2)}`,
  },
];

async function getTrendingCoins() {
  interface TrendingResponse {
    coins: TrendingCoin[];
  }
  const response = await fetcher<TrendingResponse>('/search/trending');
  return response.coins;
}

const TrendingCoins = async () => {
  const trendingCoins = await getTrendingCoins();

  return (
    <div id="trending-coins">
      <h4>Trending Coins</h4>
      <div id="trending-coins">
        <DataTable
          data={trendingCoins.slice(0, 6) || []}
          columns={columns}
          rowKey={(coin) => coin.item.id}
          tableClassName="trending-coins-table"
        />
      </div>
    </div>
  );
};

export default TrendingCoins;
