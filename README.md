# Marrymap — Wedding Planner Prototype

AI wedding agent demo with **Higgsfield-powered vendor pages**, **Three.js destination scenes**, and budget/vendor matching.

## Quick start

```bash
npm install
npm start
```

Open **http://localhost:3847**

## Flow

1. **Landing** — Enter couple details (or pick a destination chip)
2. **Agent** — Watch vendors get "booked" in the terminal
3. **Plan** — Invite, Vendors (with hero thumbnails), Budget
4. **Vendor page** — Click any vendor for hero image + 3D Blender-style preview
5. **Your Wedding** — Three.js fly-through scene

## Higgsfield MCP integration

Vendor hero images use a **cache-first pipeline**:

| Priority | Source | Badge in UI |
|----------|--------|-------------|
| 1 | File in `public/assets/vendors/{seed}/{category}.webp` | Higgsfield AI |
| 2 | Procedural SVG fallback (server-generated) | Procedural preview |

Generate real images via Cursor + Higgsfield MCP — see [docs/HIGGSFIELD-MCP.md](docs/HIGGSFIELD-MCP.md).

### API

- `GET /api/vendor-visual/:seedId/:category` — hero image URL
- `GET /api/vendor-visual/prompts/:seedId` — all Higgsfield prompts for a destination
- `POST /api/vendor-visual/register` — register MCP-generated asset

## 3D vendor previews

Each vendor drawer includes a **Three.js isometric product render** (Travel bus, Venue arch, Catering table, etc.) — Blender-style studio lighting, separate from the Higgsfield hero image.

## Project structure

```
index.html              Main app (landing, agent, plan, scene)
server/                 Express API + fallback SVG generator
public/js/vendor-3d.js  Three.js vendor previews
public/js/vendor-pages.js  Fetches vendor visuals from API
data/couples.json       Seed data for 7 destination personas
public/assets/vendors/  Higgsfield-generated images go here
```

## Note on Higgsfield MCP auth

The Higgsfield Cursor plugin must be **connected and authenticated** before MCP generation works. If auth times out, use procedural fallbacks (already wired) and generate images later via `/higgs` in Cursor.
