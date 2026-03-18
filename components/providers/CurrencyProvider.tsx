'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'usd' | 'eur' | 'gbp' | 'inr';

interface CurrencyContextType {
    currency: CurrencyCode;
    symbol: string;
    setCurrency: (currency: CurrencyCode) => void;
}

const currencySymbols: Record<CurrencyCode, string> = {
    usd: '$',
    eur: '€',
    gbp: '£',
    inr: '₹'
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrencyState] = useState<CurrencyCode>('usd');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const saved = localStorage.getItem('zync_currency') as CurrencyCode;
        if (saved && currencySymbols[saved]) {
            setCurrencyState(saved);
        }
    }, []);

    const setCurrency = (newCurrency: CurrencyCode) => {
        setCurrencyState(newCurrency);
        localStorage.setItem('zync_currency', newCurrency);
    };

    if (!isMounted) {
        // Prevent hydration mismatch by returning null or default context initially
        return (
            <CurrencyContext.Provider value={{ currency: 'usd', symbol: '$', setCurrency }}>
                {children}
            </CurrencyContext.Provider>
        );
    }

    return (
        <CurrencyContext.Provider value={{ currency, symbol: currencySymbols[currency], setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
