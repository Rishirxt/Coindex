import React, { Suspense } from 'react'
import HeroStats from '@/components/home/HeroStats';
import LivePricesTable from '@/components/home/LivePricesTable';
import Watchlist from '@/components/home/Watchlist';
import { RefreshCw } from 'lucide-react';

const Page = async () => {
  return (
    <main className="main-container py-8">
      <Suspense fallback={
        <div className="w-full h-32 bg-dark-400 rounded-xl border border-purple-100/5 animate-pulse mb-8" />
      }>
        <HeroStats />
      </Suspense>

      <Suspense fallback={null}>
        <Watchlist />
      </Suspense>

      <section className="w-full mt-7">
        <Suspense fallback={
          <div className="w-full bg-dark-400 rounded-xl p-8 border border-purple-100/5 animate-pulse flex flex-col items-center justify-center min-h-[400px]">
            <RefreshCw className="h-8 w-8 text-purple-100/50 animate-spin mb-4" />
            <p className="text-purple-100/50">Loading live prices...</p>
          </div>
        }>
          <LivePricesTable />
        </Suspense>
      </section>
    </main>
  );
};

export default Page;