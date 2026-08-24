# IPL_Auction_PlayerzInfo

A responsive IPL auction player dashboard pilot built with React and Vite.

## Features

- Dashboard with auction totals and spend insights
- Player search, filtering, sorting, and status management
- Sale finalization with base-price and team-purse validation
- Add-player form with duplicate and input validation
- Team spending and purse views
- Local browser persistence for quick demos
- Responsive layout for desktop and mobile

## Run Locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://127.0.0.1:5173/`.

## Build

```bash
npm run build
```

This pilot uses browser `localStorage` for demo persistence. A future production version can replace that data layer with the SQLite/Prisma setup described in `plan.md`.
