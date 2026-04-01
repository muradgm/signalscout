# SignalScout

SignalScout is a `pnpm` monorepo for prospecting, scoring, auditing, and outreach workflows. The workspace contains:

- `apps/api`: Express API for leads, audits, outreach, replies, and health routes.
- `apps/dashboard`: Vite + React dashboard.
- `apps/worker`: background worker entrypoint.
- `packages/*`: shared domain, database, AI, scraper, logger, queue, email, and schema packages.
- `tests/*`: unit and integration coverage for core flows and API routes.

## Requirements

- Node.js 20+
- `pnpm` 10.x
- MongoDB
- Redis

## Setup

```bash
pnpm install
cp .env.example .env
```

Fill in the values in `.env` for your local environment before running the apps.

## Scripts

At the repo root:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

Useful filtered commands:

```bash
pnpm --filter @signalscout/api dev
pnpm --filter @signalscout/dashboard dev
pnpm --filter @signalscout/core build
```

## Notes Before Pushing

- This repo uses `pnpm`; `pnpm-lock.yaml` should be the authoritative lockfile.
- Do not commit `.env` or generated `*.tsbuildinfo` files.
- Review local changes with `git status` and `git diff` before creating the initial GitHub commit.
