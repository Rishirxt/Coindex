'use server';
import qs from 'query-string';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export async function fetcher<T>(endpoint: string, params?: QueryParams, revalidate = 60): Promise<T> {
    const url = qs.stringifyUrl({
        url: `${BASE_URL}${endpoint}`,
        query: params,
    }, { skipEmptyString: true, skipNull: true });

    const response = await fetch(url, {
        headers: {
            "Accept": "application/json",
        } as Record<string, string>,
        next: { revalidate },
    });

    if (!response.ok) {
        const errorBody: CoinGeckoErrorBody = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${response.status}: ${errorBody.error || response.statusText}`);
    }

    return response.json();
} 