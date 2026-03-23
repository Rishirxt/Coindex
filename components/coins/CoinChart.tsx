'use client';

import React, { useState, useEffect } from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { fetcher } from '@/lib/coingecko.actions';
import { formatCurrency } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface CoinChartProps {
  coinId: string;
  initialData?: any[];
}

type TimeRange = '1' | '7' | '30' | '365' | 'max';

const timeRanges: { label: string; value: TimeRange }[] = [
  { label: '1D', value: '1' },
  { label: '1W', value: '7' },
  { label: '1M', value: '30' },
  { label: '1Y', value: '365' },
  { label: 'ALL', value: 'max' }
];

export const CoinChart: React.FC<CoinChartProps> = ({ coinId, initialData }) => {
  const [range, setRange] = useState<TimeRange>('1');
  const [chartData, setChartData] = useState<any[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData || initialData.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchChartUrl = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetcher<any>(`/coins/${coinId}/market_chart`, {
          vs_currency: 'usd',
          days: range,
        });
        
        if (active && response.prices) {
          const formatted = response.prices.map((item: [number, number]) => ({
            time: item[0],
            price: item[1]
          }));
          setChartData(formatted);
        }
      } catch (err: any) {
        if (active) setError('Failed to load chart data');
      } finally {
        if (active) setLoading(false);
      }
    };

    // If we have initialData and range is '1', skip fetch to save API call
    if (range === '1' && initialData && initialData.length > 0 && chartData.length > 0) {
      setLoading(false);
      return;
    }

    fetchChartUrl();
    return () => { active = false; };
  }, [coinId, range]);

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    if (range === '1') {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-primary border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-white/50 text-xs mb-1">{formatDate(payload[0].payload.time)}</p>
          <p className="text-white font-mono text-lg font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const isPositive = chartData.length > 1 && chartData[chartData.length - 1].price >= chartData[0].price;
  const strokeColor = isPositive ? 'var(--color-primary)' : 'var(--color-negative)';

  return (
    <div className="w-full glass-card p-4 sm:p-6 mb-8 flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">Price Chart</h3>
        <div className="flex bg-white/5 rounded-lg border border-white/10 p-1">
          {timeRanges.map(t => (
            <button
              key={t.value}
              onClick={() => setRange(t.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                range === t.value ? 'bg-white/10 text-white shadow' : 'text-white/50 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/50 backdrop-blur-[2px] z-10 rounded-lg">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-negative">{error}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                tickFormatter={formatDate} 
                minTickGap={50}
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                hide 
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={strokeColor} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
