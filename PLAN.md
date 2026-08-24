# IPL_Auction_PlayerzInfo Development Plan

## 1. Application Name

**IPL_Auction_PlayerzInfo**

A web application for maintaining and viewing IPL player information and auction outcomes.

### Pilot Scope

For the initial quick demo, use a lightweight local SQLite database. This keeps setup simple while preserving the same relational entities and validation rules needed for a later production release.

The pilot will support one selected IPL auction season, a reviewed seeded dataset, one administrator account, public player browsing, search and filtering, and validated updates to auction status, sold amount, and purchasing team. Historical multi-season reporting, live bidding, multiple administrators, and advanced IPL squad-rule enforcement are future enhancements.

## 2. Problem Statement

IPL player and auction information is often spread across spreadsheets, articles, and unofficial lists. Users need one reliable application that provides:

- A complete IPL player list with profile and cricket details.
- The current auction status of each player: **Available for Bid**, **Sold**, or **Unsold**.
- The team that purchased a sold player.
- The final sold amount and auction season.
- Search, filtering, sorting, and validation so that the displayed information is consistent and trustworthy.

The application should support controlled data entry by administrators and fast, clear browsing for other users.

### Data Source and Ownership

- Select and document one authoritative source before importing data.
- Store the source name, source URL, import date, and last verification date for each imported dataset.
- Review imported records manually before publishing them.
- Add attribution where the source or image license requires it.
- Keep a correction process so inaccurate records can be updated without deleting history.

## 3. Target Users

### Administrators / Auction Managers

- Add, edit, and remove player records.
- Create auction seasons and teams.
- Update player auction status and sold amount.
- Record the purchasing team and auction event details.
- Correct invalid or duplicate data.

### IPL Analysts and Cricket Researchers

- Search player profiles.
- Compare auction prices and player statuses.
- Filter players by team, role, nationality, season, and status.

### Fans and General Visitors

- Browse all players.
- Quickly identify sold, unsold, and available players.
- View player profiles and auction history.

## 4. Main Features

### Player Management

- Create, view, update, and archive player records.
- Store player name, photo, date of birth, nationality, role, batting style, bowling style, and biography.
- Store optional cricket statistics such as matches, runs, wickets, strike rate, and economy rate.
- Prevent duplicate player profiles using a normalized name and date-of-birth check.

### Auction Management

- Create and manage auction seasons or auction events.
- Add players to an auction pool.
- Set a player's base price.
- Record the player's final auction status.
- Record the winning IPL team and final sold amount when applicable.
- Maintain auction history when a player appears in multiple seasons.
- Store the auction type, auction purse, and team spending totals where those rules are in scope.

### Status Tracking

Each player-season auction record must have exactly one status:

- **Available for Bid**: The player is in the auction pool and bidding is open or has not yet been finalized.
- **Sold**: The player was purchased by a team.
- **Unsold**: The player was not purchased in that auction.

Status should be stored per auction season, not only on the player profile, because a player can be sold in one season and unsold or unavailable in another.

For the pilot, `Available for Bid` is valid only while the selected auction is open. A closed auction must contain only finalized `Sold` or `Unsold` records.

### Search, Filter, and Sort

- Search by player name.
- Filter by auction season, auction status, team, playing role, nationality, and price range.
- Sort by name, base price, sold amount, role, or status.
- Support pagination for large player lists.
- Provide a reset-filters action.

### Player Details

- Show the player's profile and cricket details.
- Show current auction status.
- Show sold amount and purchasing team for sold records.
- Show complete auction history by season.
- Clearly distinguish missing information from zero-valued statistics.

### Dashboard and Reports

- Total players in the selected auction.
- Counts of sold, unsold, and available-for-bid players.
- Highest sold price.
- Total auction spend by team.
- Player and team price summaries.
- Export filtered results to CSV for administrators or analysts.

### Authentication and Authorization

- Public users can browse published player and auction information.
- Administrators must sign in before changing data.
- Role-based permissions should restrict management actions to authorized users.
- Record who created or changed auction data and when.
- Hash passwords with a modern password-hashing algorithm, expire sessions, and provide logout behavior.
- Use one seeded administrator account for the pilot; do not expose its credentials in source control or documentation.
- Protect cookie-based sessions against CSRF and configure CORS for the known frontend origin.

## 5. Pages / Screens Required

### Public Screens

1. **Home / Dashboard**
   - Application summary and selected auction overview.
   - Status counts and highest sold prices.
   - Links to player list and teams.

2. **Player List**
   - Paginated table or responsive list.
   - Search, filters, sorting, and status badges.
   - Quick display of sold amount and team where relevant.

3. **Player Details**
   - Player profile, statistics, current status, and auction history.

4. **Auction Overview**
   - Players grouped or filtered by auction season.
   - Sold, unsold, and available-for-bid summaries.

5. **Team Details**
   - Team profile and players purchased in a selected auction.
   - Total spend and purchase list.

6. **About / Data Information**
   - Data source, update information, and project scope.

### Administrator Screens

7. **Admin Login**
   - Secure administrator authentication.

8. **Admin Dashboard**
   - Data-quality alerts, recent changes, and management shortcuts.

9. **Player Management**
   - Player table with add, edit, archive, and view actions.

10. **Player Form**
    - Validated form for profile details and statistics.

11. **Auction Season Management**
    - Create, edit, publish, close, and archive auction events.

12. **Auction Player Management**
    - Add players to an auction pool and update status, base price, sold amount, and team.

13. **Team Management**
    - Add and edit IPL team records, abbreviations, logos, and active seasons.

14. **Import / Export**
    - Upload validated CSV files and download filtered data.
    - Show row-level validation errors before import is committed.

15. **Audit Log**
    - View changes to players, auction records, teams, and user permissions.

## 6. Technology Stack

The pilot should use a simple full-stack setup that can be upgraded without changing the core business model:

### Frontend

- React with TypeScript.
- Vite for development and production builds.
- React Router for page navigation.
- TanStack Query for server-state fetching and caching.
- React Hook Form with Zod for form handling and validation.
- CSS Modules or a small component styling system for responsive UI.

### Backend

- Node.js with TypeScript.
- Express or NestJS for REST APIs.
- Zod or the backend framework's validation layer for request validation.
- JWT or secure session-based authentication for administrators.

### Database

- SQLite stored as a local file, for example `server/prisma/dev.db`.
- Prisma ORM for schema management, migrations, and type-safe queries.
- Database migrations committed to source control.
- Enable SQLite foreign-key enforcement for every database connection.
- Keep the schema relational so the database provider can later be changed to PostgreSQL.

### Testing and Quality

- Vitest for unit tests.
- React Testing Library for frontend behavior tests.
- Supertest for API tests.
- Playwright for critical end-to-end workflows.
- ESLint and Prettier.
- GitHub Actions for continuous integration.

### Infrastructure

- No database server is required for the pilot.
- Store player photos as external URLs or use local placeholder images during the demo.
- Deploy the pilot to a simple Node.js hosting service with persistent storage, or run it locally for the demonstration.
- Upgrade to managed PostgreSQL and object storage when concurrent users, reliability, or data volume require it.

## 7. Project Folder Structure

```text
IPL_Auction_PlayerzInfo/
├── client/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── features/
│       │   ├── players/
│       │   ├── auctions/
│       │   ├── teams/
│       │   └── auth/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── schemas/
│       ├── types/
│       ├── utils/
│       ├── App.tsx
│       └── main.tsx
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── players/
│   │   │   ├── auctions/
│   │   │   ├── teams/
│   │   │   ├── users/
│   │   │   └── audit-log/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   └── tests/
├── shared/
│   ├── types/
│   └── validation/
├── scripts/
│   ├── seed.ts
│   └── import-players.ts
├── docs/
├── .env.example
├── docker-compose.yml
├── package.json
└── README.md
```

## 8. Data That Needs to Be Stored

### Player

- `id`
- `fullName`
- `normalizedName`
- `dateOfBirth`
- `nationality`
- `countryCode`
- `role`: batter, bowler, all-rounder, or wicketkeeper
- `battingStyle`
- `bowlingStyle`
- `profileImageUrl`
- `biography`
- Optional statistics: matches, innings, runs, wickets, strike rate, batting average, economy rate
- `createdAt`, `updatedAt`, `archivedAt`

### Team

- `id`
- `name`
- `shortCode`
- `logoUrl`
- `homeGround`
- `isActive`
- `createdAt`, `updatedAt`

### Auction Season / Event

- `id`
- `name`, such as `IPL 2026 Auction`
- `seasonYear`
- `auctionDate`
- `currency`, such as `INR`
- `status`: draft, open, closed, or archived
- `auctionType`: mini or mega, if applicable
- `createdAt`, `updatedAt`

### Auction Team Record

Use one record per team in an auction so purse and spending are tracked independently.

- `id`
- `auctionId`
- `teamId`
- `purseAmount`
- `totalSpent`, calculated from sold records
- `squadSize`, calculated from sold records when squad tracking is enabled
- Unique `auctionId` plus `teamId` pair

### Auction Player Record

This is the central status and transaction table.

- `id`
- `auctionId`
- `playerId`
- `basePrice`
- `status`: available, sold, or unsold
- `soldAmount`, nullable unless status is sold
- `soldToTeamId`, nullable unless status is sold
- `soldAt`, nullable unless status is sold
- `bidSequence`, optional
- `notes`
- `updatedBy`
- `createdAt`, `updatedAt`

### Data Provenance

- `entityType`
- `entityId`
- `sourceName`
- `sourceUrl`
- `importedAt`
- `lastVerifiedAt`
- `verifiedBy`
- `correctionReason`, required when correcting a published record

### User

- `id`
- `name`
- `email`
- `passwordHash` or external identity provider ID
- `role`: admin or viewer
- `isActive`
- `lastLoginAt`
- `createdAt`, `updatedAt`

### Audit Log

- `id`
- `userId`
- `entityType`
- `entityId`
- `action`: create, update, archive, import, or delete
- `beforeData`
- `afterData`
- `createdAt`

### Recommended Database Constraints

- Unique player identity constraint using `normalizedName` plus date of birth where available.
- Unique `auctionId` plus `playerId` pair.
- Foreign keys from auction records to players, auctions, and teams.
- Indexes on player name, auction ID, status, team ID, and sold amount.
- Use decimal or integer minor units for money; never use floating-point values for currency.
- Store auction purse and team spending in the same currency and unit as sold amounts.
- For the pilot, use SQLite transactions and Prisma migrations; do not rely on database-specific PostgreSQL features.
- Before production, test the migration from SQLite to PostgreSQL and verify all money, date, and status values.

## 9. Validation Rules

### Player Validation

- Full name is required and must be trimmed.
- Full name must be within a defined length, for example 2 to 150 characters.
- Date of birth must be a valid date and cannot be in the future.
- Nationality and role must come from controlled values.
- Profile image URLs must use an allowed URL format and file type.
- Numeric statistics must be non-negative.
- Ratios such as strike rate and economy rate must be within sensible maximum limits.
- Duplicate names must trigger a review warning; a name plus date-of-birth match should be blocked.

### Auction Validation

- A player can appear only once in an auction event.
- Base price is required, numeric, and non-negative.
- Sold amount is required and greater than zero when status is `sold`.
- Sold amount must be greater than or equal to the base price.
- A sold record must have exactly one purchasing team.
- An unsold record must not have a sold amount or purchasing team.
- An available-for-bid record must not have a sold amount or purchasing team.
- A closed auction cannot be edited through normal update endpoints.
- A player cannot be marked sold to an inactive or invalid team.
- Status transitions should be controlled: an open auction can move `available` to `sold` or `unsold`, and finalized records require an explicit administrator reopen action.
- A closed auction cannot contain `available` records.
- A team's total sold amounts must not exceed its auction purse when purse enforcement is enabled.
- A team must be registered in the auction before it can purchase a player.
- A team's calculated `totalSpent` must equal the sum of its sold auction records.
- If squad rules are enabled, validate squad size and overseas-player limits before finalizing a sale; otherwise mark these rules as out of scope for the pilot.

### Team Validation

- Team name and short code are required.
- Short codes must be unique and normalized to uppercase.
- A team must be active for the auction season in which it purchases a player.

### Import Validation

- Validate file type, header names, row count, and maximum file size.
- Validate every row before inserting any data.
- Show row number, field, and reason for each error.
- Use a transaction so a failed import does not create partial auction records.
- Detect duplicate players and duplicate auction-player rows within the upload.

### API and Security Validation

- Validate all client input again on the server.
- Authenticate and authorize every administrative endpoint.
- Apply rate limiting to login and write endpoints.
- Sanitize or safely render biography and notes to prevent script injection.
- Never return password hashes or sensitive authentication data.
- Use pagination limits to prevent unbounded queries.
- Log important administrative changes.
- Reject edits to published records unless the administrator provides a correction reason.

## 10. Development Steps

### Phase 1: Discovery and Setup

1. Select one auction season, confirm data ownership, currency, and an authoritative data source.
2. Define the MVP as player browsing, auction status, sold amount, team, search, filters, and one-admin updates.
3. Initialize the repository, TypeScript configuration, linting, formatting, and environment configuration.
4. Create the SQLite database, Prisma schema, migrations, seed data, and a documented demo-admin setup.

### Phase 2: Core Backend

1. Implement player, team, auction, auction-team, and auction-player models.
2. Add database constraints and indexes.
3. Implement REST endpoints for public reads.
4. Implement authenticated administrator endpoints for create and update operations.
5. Add server-side validation and controlled auction status transitions.
6. Add audit logging.
7. Add source metadata and correction-reason fields for imported or published data.

### Phase 3: Core Frontend

1. Build the application layout and navigation.
2. Build the player list with pagination, search, filters, sorting, and status badges.
3. Build player details and auction history.
4. Build auction overview and team details.
5. Add loading, empty, error, and permission-denied states.
6. Make the screens responsive for desktop, tablet, and mobile.

### Phase 4: Administration

1. Add login and protected routes.
2. Build player, team, auction, and auction-player management screens.
3. Add validated create and edit forms.
4. Add CSV import preview, row-level errors, transaction-based import, and export.
5. Add audit-log viewing and data-quality alerts.

### Phase 5: Testing and Hardening

1. Unit-test status transition and validation rules.
2. Test API authorization, duplicate prevention, and transaction behavior.
3. Test player list filtering and pagination.
4. Add end-to-end coverage for login, player search, sold-player entry, unsold-player entry, and import failure.
5. Run accessibility checks, security checks, and responsive layout checks.
6. Perform a data review against the selected authoritative source.
7. Test SQLite backup restoration and verify that a second simultaneous write is rejected or handled clearly.

### Phase 6: Release

1. Configure pilot environment variables and confirm that the selected host provides persistent storage for the SQLite file.
2. Run Prisma migrations and seed only non-sensitive reference data.
3. Import reviewed player and auction data.
4. Deploy the frontend and backend, or run both locally for the demo.
5. Create and test a restorable backup copy of the SQLite database before each demo data refresh.
6. Perform smoke testing and publish the first supported auction season.
7. For production, migrate to managed PostgreSQL, add automated backups, and configure monitoring and error tracking.

## 11. Suggested API Endpoints

```text
GET    /api/players
GET    /api/players/:playerId
POST   /api/admin/players
PATCH  /api/admin/players/:playerId

GET    /api/auctions
GET    /api/auctions/:auctionId
POST   /api/admin/auctions
PATCH  /api/admin/auctions/:auctionId

GET    /api/auctions/:auctionId/players
POST   /api/admin/auctions/:auctionId/players
PATCH  /api/admin/auction-players/:recordId

GET    /api/auctions/:auctionId/teams
POST   /api/admin/auctions/:auctionId/teams
PATCH  /api/admin/auction-teams/:recordId

GET    /api/teams
GET    /api/teams/:teamId
POST   /api/admin/teams
PATCH  /api/admin/teams/:teamId

POST   /api/auth/login
POST   /api/auth/logout
GET    /api/admin/audit-logs
POST   /api/admin/import
GET    /api/admin/export
```

## 12. Deployment Approach

### Environments

- **Pilot development**: Local frontend, backend, and SQLite database file. Docker is optional.
- **Pilot demo**: Deploy the frontend and backend to a simple Node.js host with persistent disk storage, or run locally. Keep the SQLite file outside source control and back it up before demonstrations.
- **Future staging / production**: Move to managed PostgreSQL, hosted frontend/API, and object storage for images.

### Deployment Process

1. Push changes to the main repository.
2. GitHub Actions runs linting, type checking, unit tests, API tests, and production builds.
3. Build and publish the frontend and backend artifacts.
4. Apply Prisma migrations as a controlled release step.
5. Deploy the backend and frontend with persistent storage for the pilot SQLite file.
6. Run health checks and smoke tests.
7. Monitor errors and application availability; add database monitoring after the PostgreSQL upgrade.

### Production Requirements

- HTTPS enabled for all traffic.
- Secrets stored in the hosting provider's secret manager, never in source control.
- Back up the pilot SQLite file before imports and demo data refreshes.
- Use migration locking and verify the SQLite file is writable in the deployment environment.
- Structured application logs and error tracking.
- Cache public read-heavy requests where appropriate, with cache invalidation after published updates.
- Restrict administrative access and use strong password policies or an external identity provider.

### Pilot Limitations

- SQLite is intended for the quick demo and low-concurrency use only.
- Avoid multiple simultaneous writers and large-scale reporting workloads during the pilot.
- Do not treat the local SQLite file as a substitute for production backups or disaster recovery.

## 13. MVP Acceptance Criteria

The first release is complete when:

- Users can browse a complete, reviewed player list.
- Users can filter players by auction, status, team, role, and price.
- A sold player displays the purchasing team and final sold amount.
- Unsold and available-for-bid players do not display misleading sold information.
- Administrators can create an auction player record and update its status through validated forms.
- Invalid combinations such as `unsold + soldAmount` or `sold + no team` are rejected by both frontend and backend validation.
- Duplicate player-auction records are prevented.
- Public pages work on mobile and desktop.
- Automated tests cover the central status and pricing rules.
- The application can be deployed from a clean checkout using documented environment variables and migrations.
- The pilot is limited to one selected auction season and uses a reviewed, attributed dataset.
- The selected auction cannot be closed while any player remains `available`.
- A team cannot exceed its configured purse when purse enforcement is enabled.
- Admin authentication, authorization, logout, and invalid-input rejection are tested.
- A failed import creates no partial records, and a SQLite backup can be restored successfully.
- Missing images use a visible fallback and do not break the player list.
- The public experience passes the agreed browser, responsive, and basic accessibility checks.
