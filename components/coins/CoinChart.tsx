'use client';

import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/coingecko.actions';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

interface ChartProps {
    coinId: string;
}

interface PricePoint {
    date: string;
    price: number;
}

const CoinChart = ({ coinId }: ChartProps) => {
    const [data, setData] = useState<PricePoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChartData = async () => {
            setLoading(true);
            try {
                const response = await fetcher<{ prices: [number, number][] }>(`/coins/${coinId}/market_chart`, {
                    vs_currency: 'usd',
                    days: 7,
                });

                const formattedData = response.prices.map(([timestamp, price]) => {
                    const date = new Date(timestamp);
                    return {
                        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                        price: price,
                        timestamp
                    };
                });

                setData(formattedData);
            } catch (error) {
                console.error("Failed to fetch chart data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [coinId]);

    if (loading) {
        return (
            <div className="w-full h-[400px] bg-card-bg rounded-xl border border-border-color animate-pulse flex flex-col items-center justify-center">
                <RefreshCw className="h-8 w-8 text-text-muted animate-spin mb-4" />
                <p className="text-text-muted">Loading chart data...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="w-full h-[400px] bg-card-bg rounded-xl border border-border-color flex items-center justify-center">
                <p className="text-text-muted">Chart data unavailable</p>
            </div>
        );
    }

    const isPositive = data[data.length - 1].price >= data[0].price;
    const color = isPositive ? '#22c55e' : '#ef4444';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card-bg border border-border-color p-3 rounded-lg shadow-xl">
                    <p className="text-text-muted text-xs mb-1">{label}</p>
                    <p className="text-text-primary font-bold">{formatCurrency(payload[0].value)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[400px] bg-card-bg/50 rounded-xl border border-border-color p-6 flex flex-col">
            <h3 className="text-lg font-bold text-text-primary mb-6">Price History (7 Days)</h3>
            <div className="flex-1 w-full min-h-0 text-text-muted">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            hide
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                            stroke="currentColor"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            width={80}
                            className="opacity-50"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke={color}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CoinChart;
