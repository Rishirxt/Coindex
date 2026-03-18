import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumberWithSuffix(value: number, decimals: number = 2): string {
  if (value === 0) return '0';
  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['', 'K', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y'];
  const i = Math.floor(Math.log(Math.abs(value)) / Math.log(k));
  if (i === 0) return value.toFixed(dm);
  return parseFloat((value / Math.pow(k, i)).toFixed(dm)) + sizes[i];
}

export function formatCurrency(value: number, currencyCode: string = 'usd', compact: boolean = false): string {
  try {
    if (compact && Math.abs(value) >= 1000) {
      const formatted = formatNumberWithSuffix(value, 2);
      const symbol = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode.toUpperCase(),
      }).format(0).replace(/\d|[,.]/g, '');
      return `${symbol}${formatted}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    return `${currencyCode.toUpperCase()} ${value.toFixed(2)}`;
  }
}
