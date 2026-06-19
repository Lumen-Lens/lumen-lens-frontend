# lumen-lens-frontend

Next.js 14 dashboard for Lumen Lens.

## Pages

| Route | Description |
|---|---|
| `/` | Upload WASM + pick language → generate SDK |
| `/diff` | Compare two WASM versions, view breaking changes |
| `/inspect` | Explore the parsed spec of any Soroban contract |

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Point `NEXT_PUBLIC_API_URL` at a running `lumen-lens-backend` instance.

## Stack

- Next.js 14 App Router
- Tailwind CSS
- TanStack Query
- Radix UI primitives
- `react-syntax-highlighter` for code display
