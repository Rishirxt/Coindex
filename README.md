# Coindex

> Real-time crypto market data. Search any coin, track prices, view charts — no account needed.

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Powered by CoinGecko](https://img.shields.io/badge/Powered_by-CoinGecko-8DC63F?style=flat-square)

---

## Overview

Coindex is a clean, minimal crypto market viewer built for people who just want the data. No sign-up, no clutter. Search for any of 18,000+ coins, view live prices and charts, browse the full markets table, and see what's trending — all in one place.

**Live:** [coindex.vercel.app](https://coindex.vercel.app) <!-- update with your actual URL -->

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, floating price cards, trending strip |
| `/markets` | Full sortable coin table — price, 24h%, market cap, sparkline |
| `/coins/[id]` | Coin detail — live chart, stats, about section |
| `/trending` | Trending coins updated every 60s |

---

## Tech Stack

- **Framework** — Next.js 14 App Router
- **Language** — TypeScript
- **Styling** — Tailwind CSS + custom CSS variables
- **Components** — shadcn/ui
- **Charts** — Recharts
- **Data** — CoinGecko Public API (free tier, no key required)

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Rishirxt/Coindex.git
cd Coindex

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No API key needed. The CoinGecko public API is free and works out of the box.

---

## Project Structure

```
coindex/
├── app/
│   ├── page.tsx              # Landing / Hero
│   ├── markets/
│   │   └── page.tsx          # Full coin table
│   ├── coins/
│   │   └── [id]/
│   │       └── page.tsx      # Coin detail + chart
│   └── trending/
│       └── page.tsx          # Trending coins
├── components/
│   ├── layout/
│   │   └── Header.tsx        # Search-first top bar
│   ├── sections/
│   │   └── HeroSection.tsx   # Landing hero
│   └── ui/
│       ├── PriceCard.tsx     # Floating coin card
│       ├── Sparkline.tsx     # 7d mini chart
│       ├── PriceChange.tsx   # Colored % badge
│       └── Ticker.tsx        # Infinite scroll ticker
├── lib/
│   └── coingecko.ts          # Fetcher + formatCurrency util
└── types/
    └── index.d.ts            # Shared TypeScript types
```

---

## Deployment

Deploy instantly with Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Rishirxt/Coindex)

Or manually:

```bash
npm run build
npm run start
```

No environment variables required for the free CoinGecko API tier.


---

## License

MIT — do whatever you want with it.

---

*Data provided by the [CoinGecko API](https://www.coingecko.com/en/api). Coindex is not a financial advisor. Nothing here is investment advice.*
