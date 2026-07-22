# Higgsfield MCP — Vendor image generation

Use this workflow in **Cursor** after authenticating the Higgsfield plugin (`Settings → Tools & MCPs → Higgsfield → Connect`).

## 1. Get prompts for a destination

With the dev server running (`npm start`), open:

```
http://localhost:3847/api/vendor-visual/prompts/priya-arjun
```

This returns 5 prompts (Travel, Venue, Catering, Flowers, Music) with exact save paths.

## 2. Generate in Cursor chat

For each prompt, ask Cursor:

```
/higgs Generate this vendor hero image, 16:9, isometric Blender-style product viz:
[paste prompt from API]

Save the result to public/assets/vendors/priya-arjun/venue.webp
```

Or use natural language:

```
Generate a Higgsfield image for the Goa wedding venue vendor page — isometric 3D Blender render, beach arch, marigold palette. Save to public/assets/vendors/priya-arjun/venue.webp
```

## 3. Register (optional)

If you saved manually, register in manifest:

```bash
curl -X POST http://localhost:3847/api/vendor-visual/register \
  -H 'Content-Type: application/json' \
  -d '{"seedId":"priya-arjun","category":"Venue","prompt":"..."}'
```

The app auto-detects files at `public/assets/vendors/{seedId}/{category}.webp` — no register needed if the filename matches.

## 4. Verify in the app

1. `npm start`
2. Open http://localhost:3847
3. Submit Goa wedding → Vendors tab → click a vendor
4. Hero badge should say **Higgsfield AI** instead of **Procedural preview**

## Batch all 7 destinations

Repeat for seed IDs: `priya-arjun`, `jake-emily`, `marcus-david`, `sofia-mateo`, `aiko-wei`, `lena-sarah`, `kwame-ngozi`

Categories (lowercase filenames): `travel`, `venue`, `catering`, `flowers`, `music`
