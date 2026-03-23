const BASE = 'https://api.coingecko.com/api/v3'

export async function fetcher<T>(path: string, params?: Record<string, any>): Promise<T> {
  const url = new URL(BASE + path)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  
  const res = await fetch(url.toString(), { 
    next: { tags: ['coingecko'] },
    cache: 'force-cache'
  })
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`)
  return res.json()
}

export const formatCurrency = (n: number, compact = false) =>
  new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: compact ? 2 : (n > 1 ? 2 : 6),
    notation: compact ? 'compact' : 'standard',
    compactDisplay: 'short'
  }).format(n)

export const formatCompactNumber = (n: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2
  }).format(n)

export const parseAndFormatCompact = (str?: string) => {
  if (!str) return 'N/A'
  const num = parseFloat(str.replace(/[^0-9.-]+/g, ''))
  if (isNaN(num)) return str
  return '$' + formatCompactNumber(num)
}
