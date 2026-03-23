'use client';

import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/coingecko.actions';
import { CoinCard } from '@/components/ui/CoinCard';
import { RefreshCw, Zap } from 'lucide-react';

export default function TrendingDashboard() {
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher<any>('/search/trending');
      if (data && data.coins) {
        setTrending(data.coins.map((c: any) => c.item));
      }
    } catch (err) {
      setError('Failed to fetch trending coins. Please try again later.');
    } finally {
      setLoading(false);
      setCountdown(60);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchTrending();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between glass-card p-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/30">
            <Zap className="w-5 h-5 text-blue-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-white font-bold">Top 15 Searched Coins</h2>
            <p className="text-xs text-white/50">Based on global search volume over the last 24h.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs text-white/40 uppercase tracking-wider">Auto Refresh In</span>
            <span className="text-white font-mono">{countdown}s</span>
          </div>
          <button 
            onClick={fetchTrending}
            disabled={loading}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm border border-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="glass-card p-12 text-center border-negative/20 text-negative">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {loading && trending.length === 0 ? (
            Array(12).fill(0).map((_, i) => (
              <div key={i} className="glass-card p-6 h-32 animate-pulse flex flex-col justify-between">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="w-1/2 h-4 bg-white/5 rounded" />
                    <div className="w-1/3 h-3 bg-white/5 rounded" />
                  </div>
                </div>
                <div className="w-24 h-6 bg-white/5 rounded ml-auto" />
              </div>
            ))
          ) : (
             trending.map((coin, idx) => (
              <CoinCard 
                key={coin.id} 
                coin={coin} 
                rank={idx + 1} 
                showSparkline={true} 
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
