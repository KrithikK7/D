# K-Drama Journal

A full-stack journaling experience inspired by K-Drama aesthetics. This repo contains both the Vite + React client and the Express + Drizzle API so you can run the entire stack with one Node.js process.

## Highlights

- 📖 **Immersive reading flow** with chapters, sections, and richly formatted pages seeded with sample stories.
- 🔐 **Role-based authentication** using bcrypt-hashed passwords and a forthcoming Passport.js integration.
- 📊 **Reading progress & analytics** tables for tracking engagement across the journal.
- 🪄 **Design system** powered by Tailwind CSS, shadcn/ui, and Radix UI primitives for polished interactions.

## Tech stack

### Frontend
- React 18 + TypeScript (`client/`)
- TanStack Query, Wouter routing, Radix UI, shadcn/ui
- Tailwind CSS with custom theming and animation presets

### Backend
- Express server with modular routing (`server/routes.ts`)
- Drizzle ORM talking to PostgreSQL (`server/storage.ts` + `shared/schema.ts`)
- Session-ready foundation using `connect-pg-simple` and bcrypt utilities

### Tooling
- Vite for client bundling and dev server integration (`server/vite.ts`)
- Drizzle Kit migrations driven by `drizzle.config.ts`
- TypeScript project references shared through `tsconfig.json`

## Repository layout

```
./
├── client/             # React application (components, hooks, contexts)
├── server/             # Express API, database layer, seed script
├── shared/             # Database schema and type exports consumed by both sides
├── drizzle.config.ts   # Drizzle Kit configuration
├── package.json        # Combined workspace scripts and dependencies
└── README.md
```

Additional documentation lives in [`design_guidelines.md`](design_guidelines.md) and UI tokens under `attached_assets/`.

## Prerequisites

Before running the project locally make sure these are installed:

- **Node.js 20+** (ships with npm)
- **PostgreSQL** instance (Neon is recommended; self-hosted/Postgres-in-Docker works if it allows TLS connections)
- **git** for cloning the repository

## 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd D
npm install
```

> The repository root is called `D` in this workspace. Adjust the folder name if you cloned it elsewhere.

## 2. Provision PostgreSQL

The backend uses the `@neondatabase/serverless` driver which connects over WebSockets. Any Postgres service that supports TLS and WebSocket proxies (Neon, Supabase, Railway, etc.) will work out of the box.

- **Neon (recommended)**
  1. Create a project and database on https://neon.tech.
  2. From the Project dashboard, copy the `postgresql://` connection string.
  3. Append `?sslmode=require` if it is not already present.

- **Local / Docker Postgres**
  1. Start a TLS-enabled Postgres instance or tunnel it through a proxy that exposes WebSockets.
  2. Example Docker command:
     ```bash
     docker run --name kdrama-postgres \
       -e POSTGRES_USER=postgres \
       -e POSTGRES_PASSWORD=postgres \
       -e POSTGRES_DB=kdrama_journal \
       -p 5432:5432 -d postgres:16
     ```
  3. Expose the database through a tool such as [Postgres.js's `wsproxy`](https://github.com/neondatabase/wsproxy) or adjust `server/db.ts` to use the native `pg` driver if you prefer a direct TCP connection.

Regardless of where you host Postgres, enable the `pgcrypto` extension once so the schema can call `gen_random_uuid()`:

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

## 3. Configure environment variables

Copy the example file and edit it with your credentials:

```bash
cp .env.example .env
```

`.env` expects a single `DATABASE_URL` environment variable. Examples:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kdrama_journal?sslmode=require
DATABASE_URL=postgresql://<user>:<password>@<your-neon-host>/<database>?sslmode=require
```

The same variable powers both Drizzle Kit (`drizzle.config.ts`) and the runtime pool in [`server/db.ts`](server/db.ts).

## 4. Push the schema

Create the tables defined in [`shared/schema.ts`](shared/schema.ts) by running:

```bash
npm run db:push
```

Drizzle Kit will read the schema, connect via `DATABASE_URL`, and create/update tables in place. If you see a TLS or connection error double-check that `?sslmode=require` is present in the connection string.

## 5. Seed sample content

Populate the journal with demo data, admin/reader accounts, and analytics fixtures:

```bash
npx tsx server/seed.ts
```

The script uses the storage layer in [`server/storage.ts`](server/storage.ts) and bcrypt to hash the default passwords.

## 6. Run the development server

```bash
npm run dev
```

The Express API and Vite client share the same port (defaults to `5000`). Open [http://localhost:5000](http://localhost:5000) to explore the journal.

While the server is running you can keep an eye on API traffic through the request logger configured in [`server/index.ts`](server/index.ts).

## 7. Optional: type-check and build

- `npm run check` — TypeScript project-wide diagnostics
- `npm run build` — Produces the production bundle in `dist/`
- `npm start` — Serves the pre-built bundle (sets `NODE_ENV=production`)

## Default accounts after seeding

| Role   | Username | Password  |
|--------|----------|-----------|
| Admin  | `admin`  | `admin123` |
| Reader | `reader` | `reader123` |

Use the admin account for CRUD routes and the reader for the standard browsing experience.

## API overview

All routes live in [`server/routes.ts`](server/routes.ts). The most common endpoints are:

| Method & path | Description |
|---------------|-------------|
| `POST /api/auth/login` | Authenticate with username/password, returns user profile |
| `GET /api/chapters` | List chapters ordered by `order` |
| `POST /api/chapters` | Create a chapter (requires admin role in future Passport flow) |
| `GET /api/chapters/:chapterId/sections` | Sections within a chapter |
| `GET /api/sections/:sectionId/pages` | Pages within a section |
| `POST /api/pages` | Create a page with rich text content |
| `POST /api/reading-progress` | Upsert reading progress for a user/section pair |
| `POST /api/analytics` | Record engagement events |

Refer to the file for additional update/delete endpoints and error handling specifics.

## Database schema

The Drizzle schema defines six core tables with array and timestamp columns:

- [`users`](shared/schema.ts) — stores credentials and roles.
- [`chapters`](shared/schema.ts) — top-level story groupings with optional media URLs.
- [`sections`](shared/schema.ts) — child records of chapters with mood/tags metadata.
- [`pages`](shared/schema.ts) — ordered rich-text content connected to sections.
- [`reading_progress`](shared/schema.ts) — per-user tracking of last read page and completion flag.
- [`analytics_events`](shared/schema.ts) — captures engagement metrics including duration and timestamps.

Every primary key defaults to `gen_random_uuid()` so make sure `pgcrypto` is installed before pushing the schema.

## Troubleshooting

- **`DATABASE_URL must be set`** — ensure `.env` exists and that you export the variable when invoking Node (e.g. `source .env` or use a process manager that loads env files).
- **`gen_random_uuid` does not exist** — enable the `pgcrypto` extension on your database before running migrations or seeding.
- **Connection hangs or TLS errors** — include `?sslmode=require` and verify that your Postgres instance accepts TLS/WebSocket traffic. For plain local Postgres you can swap in the `pg` driver inside [`server/db.ts`](server/db.ts).
- **`npm run dev` exits immediately** — the server stops when it fails to reach Postgres; inspect the terminal output for Drizzle connection errors.

## Next steps & customization

- Explore the React UI starting from [`client/src/App.tsx`](client/src/App.tsx).
- Tailwind theming lives in [`tailwind.config.ts`](tailwind.config.ts) and design tokens in `client/src/index.css`.
- Add new tables or columns by editing [`shared/schema.ts`](shared/schema.ts) and re-running `npm run db:push`.

Enjoy building your own K-Drama inspired journal! 💖
