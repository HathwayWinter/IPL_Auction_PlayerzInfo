# IPL_Auction_PlayerzInfo

## Project Name

**IPL_Auction_PlayerzInfo**

## Project Description

IPL_Auction_PlayerzInfo is a responsive web application for viewing and managing IPL auction players. It shows each player's profile, role, nationality, auction status, base price, sold amount, and purchasing team.

This is a pilot/demo application. It includes seeded IPL-style auction data and saves changes in the browser so it can be demonstrated without a separate backend or database server.

## Features

- Dashboard with auction totals, status counts, and spend insights
- Player search, filtering, sorting, and status management
- Auction desk for players marked Available for Bid
- Sale finalization with base-price and team-purse validation
- Add-player form with duplicate and input validation
- Sold, Unsold, and Available for Bid status tracking
- Team spending and purse views
- Success and error feedback messages
- Local browser persistence for quick demos
- Responsive layout for desktop and mobile

## Technology Used

- React
- Vite
- JavaScript with JSX
- Lucide React for icons
- CSS with responsive media queries
- Browser `localStorage` for pilot persistence

## How to Install

### Prerequisites

- Node.js 18 or newer
- npm

Clone the repository and install the dependencies:

```bash
git clone https://github.com/HathwayWinter/IPL_Auction_PlayerzInfo.git
cd IPL_Auction_PlayerzInfo
npm install
```

## How to Run Locally

```bash
npm run dev
```

Open the URL printed by Vite, usually:

http://127.0.0.1:5173/

Use the navigation to open Overview, Player Pool, Auction Desk, and Teams & Purse. Use **Reset demo data** to restore the original seeded records.

## GitHub Repository

https://github.com/HathwayWinter/IPL_Auction_PlayerzInfo

## Live Application URL

Pilot application URL when running locally:

http://127.0.0.1:5173/

There is not yet a publicly hosted production URL. The pilot is currently intended to run locally.

## Build for Production

```bash
npm run build
```

This pilot uses browser `localStorage` for demo persistence. A future production version can replace that data layer with the SQLite/Prisma setup described in [PLAN.md](PLAN.md).
