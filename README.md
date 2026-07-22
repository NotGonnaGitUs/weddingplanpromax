# Marrymap

DIY wedding planning marketplace: couples get a guided timeline and vendor packages; vendors list services; communication and payments stay in-app.

This repo is an npm workspaces monorepo.

## Layout

```
apps/
  web/   Interactive planning demo (static HTML + Three.js scene)
  cms/   Payload CMS schema, marketplace messaging, Stripe payments
```

| App | Package | Role |
|---|---|---|
| `apps/web` | `@marrymap/web` | Front-end prototype: intake form → package options → 3D wedding scene |
| `apps/cms` | `@marrymap/cms` | Data model + ledger: users, vendors, weddings, guests, conversations, messages, payments |

Vendor categories are shared conceptually across both apps (`venue`, `caterer`, `florist`, `music`, `travel`, plus additional CMS-only marketplace categories).

## Quick start

### Web demo

```bash
npm install
npm run dev:web
```

Open the printed local URL (serves `apps/web`).

### CMS (Payload schema package)

```bash
cp apps/cms/.env.example apps/cms/.env
# set DATABASE_URI, PAYLOAD_SECRET, and Stripe keys
npm install
npm run generate:types
```

`apps/cms` currently ships the Payload collections, hooks, and payment endpoints intended to be wired into a full Next.js + Payload app scaffold.

## Product notes

- **V1 focus:** timeline + in-marketplace vendor communication + Stripe settlement
- **Packages:** two wedding package options from marketplace vendors
- **Payments:** confirmed bookings create `event_debt`; couples pay via Stripe Connect marketplace flow
