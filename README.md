# Marrymap

DIY wedding planning marketplace: couples get a guided timeline and vendor packages; vendors list services; communication and payments stay in-app.

This repo is an npm workspaces monorepo.

## Layout

```
apps/
  web/   Interactive planning demo (static HTML + Three.js scene)
  cms/   Payload CMS schema + Local API server (package templates, marketplace)
```

| App | Package | Role |
|---|---|---|
| `apps/web` | `@marrymap/web` | Front-end prototype: intake form → package options → 3D wedding scene |
| `apps/cms` | `@marrymap/cms` | Payload data model + Local API: package templates, vendors, weddings, payments |

The web demo loads destination packages from Payload (`GET /api/package-templates`). Override the API base with `?api=https://host:port`, `localStorage.marrymapApiUrl`, or `window.MARRYMAP_API_URL`.

## Quick start

```bash
npm install
cp apps/cms/.env.example apps/cms/.env
# optional: edit DATABASE_URI / PAYLOAD_SECRET

# Terminal 1 — Payload Local API (SQLite by default, seeds package templates)
npm run dev:cms

# Terminal 2 — web demo on http://localhost:5173
npm run dev:web
```

Open http://localhost:5173 — the landing chips and package matching come from the CMS.

### CMS only

```bash
npm run start:cms
curl http://localhost:3000/api/package-templates
```

### Database

- **Default:** SQLite at `apps/cms/data/marrymap.db` (`DATABASE_URI=file:./data/marrymap.db`)
- **MongoDB:** set `DATABASE_URI=mongodb://127.0.0.1/marrymap`

## Product notes

- **V1 focus:** timeline + in-marketplace vendor communication + Stripe settlement
- **Packages:** destination package templates in `package-templates` collection drive the web intake flow
- **Payments:** confirmed bookings create `event_debt`; couples pay via Stripe Connect marketplace flow
