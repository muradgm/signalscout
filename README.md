# SignalScout

SignalScout is a `pnpm` monorepo centered on a lead-review workflow:

1. create or load a lead
2. refresh a website snapshot
3. derive structured signals
4. generate an audit
5. generate outreach
6. review, edit, and send the draft
7. track delivery and replies

The currently implemented workspace contains:

- `apps/api`: Express API for leads, snapshots, signals, audits, outreach, replies, feedback, and health routes.
- `apps/dashboard`: Vite + React operator workspace for the lead queue and lead detail review flow.
- `packages/core`: domain entities, ports, and use cases.
- `packages/db`: Mongo models, mappers, and repositories.
- `packages/scraper`: website extraction and rule-based signal logic.
- `packages/ai`: mock audit and outreach generators.
- `packages/logger`: small shared logger utility.
- `tests/mvp`: real tests for the core MVP path.

## Requirements

- Node.js 20+
- `pnpm` 10.x
- MongoDB

## Setup

```bash
pnpm install
cp .env.example .env
```

Fill in the values in `.env` for your local environment before running the apps.

## What Is Actually Productized

Confirmed in code:
- lead queue and lead detail review workflow in the dashboard
- snapshot -> signals -> audit -> outreach path
- persisted outreach review actions
- Resend send hook
- delivery-event persistence
- reply persistence and reply panels

Not productized yet:
- worker-based background execution
- queue-backed background processing
- a generalized email abstraction package beyond the current Resend path
- campaigns, follow-up, and multi-operator workflow

### Sending configuration

SignalScout now supports real outreach sending through Resend. The minimum send-related env settings are:

```bash
RESEND_API_KEY=...
RESEND_FROM_EMAIL=hello@your-verified-domain.example
RESEND_FROM_NAME=SignalScout
OUTREACH_ALLOWED_SENDER_DOMAINS=your-verified-domain.example
PUBLIC_API_BASE_URL=https://api.your-public-host.example
RESEND_WEBHOOK_SECRET=...
```

Development note:

- `ALLOW_DEVELOPMENT_SENDER=true` lets you keep using `onboarding@resend.dev` locally.
- When `NODE_ENV=production`, the API now blocks startup if:
  - `ALLOW_DEVELOPMENT_SENDER=true`
  - `RESEND_FROM_EMAIL` is still `onboarding@resend.dev`
  - the sender domain is not listed in `OUTREACH_ALLOWED_SENDER_DOMAINS`

This keeps the send path production-safe instead of relying on UI warnings alone.

Webhook hosting note:

- `PUBLIC_API_BASE_URL` should point to the public HTTPS host that Resend can reach for webhook delivery events.
- Temporary tunnel URLs such as `ngrok` are supported for testing, but the app will flag them as non-stable hosting in the UI.

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

Current practical dev workflow:

```bash
pnpm --filter @signalscout/api dev
pnpm --filter @signalscout/dashboard dev
```

## Notes Before Pushing

- This repo uses `pnpm`; `pnpm-lock.yaml` should be the authoritative lockfile.
- Do not commit `.env` or generated `*.tsbuildinfo` files.
- Review local changes with `git status` and `git diff` before creating the initial GitHub commit.
