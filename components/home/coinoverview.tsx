import Image from "next/image";
import { formatCurrency, cn } from '@/lib/utils';
import { fetcher } from '@/lib/coingecko.actions';
import { TrendingUp, TrendingDown } from 'lucide-react';

const CoinOverview = async () => {
  const coin = await fetcher<CoinDetailsData>('/coins/bitcoin',
    {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false,
    });

  const priceChange = coin.market_data.price_change_percentage_24h_in_currency?.usd || 0;
  const isTrendingUp = priceChange >= 0;

  return (
    <section className="home-grid">
      <div id="coin-overview" className="bg-dark-400/50 rounded-xl p-6 border border-purple-100/5">
        <div className="header flex items-center gap-4">
          <Image
            src={coin.image.large}
            alt={coin.name}
            width={56}
            height={56}
            className="rounded-full"
          />
          <div className="info flex flex-col">
            <p className="text-purple-100/50 uppercase text-sm font-medium">{coin.name} / {coin.symbol}</p>
            <h1 className="text-3xl font-bold text-white">{formatCurrency(coin.market_data.current_price.usd)}</h1>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dark-400 p-4 rounded-xl flex flex-col gap-1 border border-purple-100/5">
            <span className="text-purple-100/50 text-sm">Market Cap</span>
            <span className="text-purple-100 font-medium">{formatCurrency(coin.market_data.market_cap.usd, 'usd', true)}</span>
          </div>

          <div className="bg-dark-400 p-4 rounded-xl flex flex-col gap-1 border border-purple-100/5">
            <span className="text-purple-100/50 text-sm">24h Change</span>
            <div className={cn('flex items-center gap-1 font-medium', isTrendingUp ? 'text-green-500' : 'text-red-500')}>
              {isTrendingUp ? <TrendingUp width={16} height={16} /> : <TrendingDown width={16} height={16} />}
              <span>{Math.abs(priceChange).toFixed(2)}%</span>
            </div>
          </div>

          <div className="bg-dark-400 p-4 rounded-xl flex flex-col gap-1 border border-purple-100/5">
            <span className="text-purple-100/50 text-sm">24h High / Low</span>
            <span className="text-purple-100 font-medium">
              {formatCurrency(coin.market_data.high_24h?.usd || 0)} / {formatCurrency(coin.market_data.low_24h?.usd || 0)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoinOverview;
