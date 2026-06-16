# Prototype

Status: deployed prototype.

Requirements from prompt:

- Real application with frontend and backend.
- Not a Figma mockup.
- Not a static page.
- Mock data is acceptable if plausible.
- Include README instructions to run locally.

Prototype principle: one sharp core workflow James can explain beats broad surface area.

## Current Direction

Build a full-stack prototype of **Connected Maintenance > Shift Brief** for Hertz LAX.

Use a real front end, real backend routes, and a seeded mock database. Build multiple front-end variants against the same backend, then downselect.

## Planning Files

- `00-build-plan.md` - architecture, scope, build phases, and UI variants.
- `01-data-model.md` - mock database plan, tables, seed scenario, and API endpoints.
- `02-feedback-and-decisions.md` - how feedback and decisions get captured.
- `feedback-log.md` - running prototype feedback log.
- `variant-scorecard.md` - downselect scorecard.

## Local App

The app lives in this folder and runs as a Next.js prototype with API routes and a seeded SQLite mock database.

Hosted prototype:

```text
https://prototype-xi-lemon.vercel.app
```

Run locally:

```bash
npm install
npm run dev
```

Then open:

```text
http://127.0.0.1:3000
```

Check seeded mock counts:

```bash
npm run seed
```
