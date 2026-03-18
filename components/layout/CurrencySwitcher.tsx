'use client';

import React from 'react';
import { useCurrency, CurrencyCode } from '@/components/providers/CurrencyProvider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Globe } from 'lucide-react';

export default function CurrencySwitcher() {
    const { currency, setCurrency } = useCurrency();

    return (
        <Select value={currency} onValueChange={(val: string) => setCurrency(val as CurrencyCode)}>
            <SelectTrigger className="w-[100px] bg-card-bg border-border-color text-text-primary focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-purple-500/50 outline-none h-10 transition-colors pointer-events-auto">
                <div className="flex items-center gap-2">
                    <Globe size={14} className="text-text-muted" />
                    <SelectValue placeholder="Currency" />
                </div>
            </SelectTrigger>
            <SelectContent className="bg-card-bg border-border-color pointer-events-auto z-50">
                <SelectItem value="usd" className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 focus:bg-black/5 dark:focus:bg-white/5 data-[highlighted]:bg-black/5 dark:data-[highlighted]:bg-white/5 data-[state=checked]:bg-purple-500/10 data-[state=checked]:text-purple-400">USD ($)</SelectItem>
                <SelectItem value="eur" className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 focus:bg-black/5 dark:focus:bg-white/5 data-[highlighted]:bg-black/5 dark:data-[highlighted]:bg-white/5 data-[state=checked]:bg-purple-500/10 data-[state=checked]:text-purple-400">EUR (€)</SelectItem>
                <SelectItem value="gbp" className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 focus:bg-black/5 dark:focus:bg-white/5 data-[highlighted]:bg-black/5 dark:data-[highlighted]:bg-white/5 data-[state=checked]:bg-purple-500/10 data-[state=checked]:text-purple-400">GBP (£)</SelectItem>
                <SelectItem value="inr" className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 focus:bg-black/5 dark:focus:bg-white/5 data-[highlighted]:bg-black/5 dark:data-[highlighted]:bg-white/5 data-[state=checked]:bg-purple-500/10 data-[state=checked]:text-purple-400">INR (₹)</SelectItem>
            </SelectContent>
        </Select>
    );
}
