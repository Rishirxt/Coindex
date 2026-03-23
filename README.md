<div align="center">

# ⚡ Coindex
**A real-time cryptocurrency dashboard built with Next.js 16 and React 19.**

Track live prices, candlestick charts, trending coins, market categories, and convert between currencies — all in a dark-first, responsive UI.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

</div>

---


---

## Features

- **Live price tracking** — Real-time coin prices with green/red flash animations on updates
- **Candlestick chart** — Interactive OHLC chart with 1D / 1W / 1M / 3M / 1Y / All timeframe switching
- **Trending coins** — Live trending list with price change indicators
- **Market categories** — Top gainers and losers grouped by category with market cap and volume
- **Coin detail pages** — Per-coin page with exchange listings, live trades, and full stats
- **Currency converter** — Convert any coin to fiat or another crypto using live rates
- **Coin explorer** — Paginated, sortable full coin list
- **Command search** — Keyboard-accessible search modal (`⌘K` / `Ctrl+K`) with instant results
- **Dark / light mode** — Theme toggle powered by `next-themes`
- **Skeleton loaders** — Graceful loading states for every data-dependent component

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + `tw-animate-css` |
| UI Components | [shadcn/ui](https://ui.shadcn.com) via Radix UI |
| Charts | [Recharts 3](https://recharts.org) |
| Icons | [Lucide React](https://lucide.dev) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| Data | [CoinGecko API](https://www.coingecko.com/en/api) (public) |
| Utilities | `clsx`, `tailwind-merge`, `class-variance-authority`, `query-string` |

---

## Project Structure

```
zync/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home — trending, categories, overview
│   ├── coins/              # Full coin list with pagination
│   └── coins/[id]/         # Individual coin detail page
├── components/             # Reusable UI components
│   ├── header.tsx          # Nav header with search trigger
│   ├── coin-card.tsx       # Summary card for a single coin
│   ├── candlestick-chart/  # Chart with timeframe controls
│   ├── trending-coins/     # Trending table
│   ├── categories/         # Market categories table
│   ├── converter/          # Currency converter widget
│   ├── search-modal/       # Command palette search
│   └── ...fallback/        # Skeleton loader counterparts
├── lib/                    # Utilities and API helpers
├── public/                 # Static assets
├── app/globals.css         # Global styles, CSS tokens, animations
└── type.d.ts               # Shared TypeScript types
```

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm / yarn / pnpm / bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Rishirxt/Zync.git
cd Zync

# Install dependencies
npm install
```

### Running locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other commands

```bash
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Environment Variables

Zync uses the public CoinGecko API which requires no API key for basic usage. If you want to use the Pro API for higher rate limits, create a `.env.local` file:

```env
# Optional — only needed for CoinGecko Pro
COINGECKO_API_KEY=your_api_key_here
```

> **Note:** The free tier has rate limits. If you see empty data during development, wait a moment and refresh.

---

## Deployment

The easiest way to deploy is via [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Rishirxt/Zync)

For other platforms, run `npm run build` and serve the `.next` output directory.

---

## Roadmap

- [ ] Watchlist / favourites with local persistence
- [ ] Portfolio tracker with allocation chart
- [ ] Price alerts
- [ ] Full light mode support
- [ ] Mobile hamburger navigation drawer
- [ ] Keyboard shortcut help overlay (`?`)

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change, then submit a pull request against the `main` branch.

1. Fork the repo
2. Create your branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push and open a PR

---

## License

MIT © [Rishirxt](https://github.com/Rishirxt)
