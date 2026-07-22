require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { buildVendorPrompt, buildPanoramaPrompt } = require('./vendor-prompts');
const { renderVendorSvg } = require('./fallback-render');

const ROOT = path.join(__dirname, '..');
const ASSETS_DIR = path.join(ROOT, 'public', 'assets', 'vendors');
const MANIFEST_PATH = path.join(ASSETS_DIR, 'manifest.json');

const app = express();
const PORT = process.env.PORT || 3847;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(ROOT));
app.use('/public', express.static(path.join(ROOT, 'public')));

function ensureDirs() {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

function readManifest() {
  ensureDirs();
  if (!fs.existsSync(MANIFEST_PATH)) {
    const empty = { version: 1, assets: {} };
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(empty, null, 2));
    return empty;
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

function writeManifest(manifest) {
  ensureDirs();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function assetKey(seedId, category) {
  return `${seedId}/${category.toLowerCase()}`;
}

function higgsfieldPath(seedId, category) {
  const dir = path.join(ASSETS_DIR, seedId);
  for (const ext of ['.webp', '.png', '.jpg', '.jpeg']) {
    const file = path.join(dir, `${category.toLowerCase()}${ext}`);
    if (fs.existsSync(file)) return `/public/assets/vendors/${seedId}/${category.toLowerCase()}${ext}`;
  }
  return null;
}

function fallbackSvgPath(seedId, category) {
  const dir = path.join(ASSETS_DIR, seedId);
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${category.toLowerCase()}.svg`);
}

function getOrCreateFallback(seedId, category, meta) {
  const filePath = fallbackSvgPath(seedId, category);
  if (!fs.existsSync(filePath)) {
    const svg = renderVendorSvg({
      category,
      vendorName: meta.vendorName || category,
      location: meta.location || 'Destination',
      accent: meta.accent || '#C9A267',
      glow: meta.glow || '#E0447C',
      tier: meta.tier || 'mid',
    });
    fs.writeFileSync(filePath, svg);
  }
  return `/public/assets/vendors/${seedId}/${category.toLowerCase()}.svg`;
}

/** List all vendor visual prompts for a wedding seed (for Higgsfield MCP batch generation). */
app.get('/api/vendor-visual/prompts/:seedId', (req, res) => {
  const couples = require(path.join(ROOT, 'data', 'couples.json'));
  const couple = couples.find((c) => c.id === req.params.seedId);
  if (!couple) return res.status(404).json({ error: 'Unknown seed' });

  const prompts = couple.vendors.map((v) => ({
    category: v.category,
    vendorName: v.name,
    prompt: buildVendorPrompt(v, couple),
    saveAs: `public/assets/vendors/${couple.id}/${v.category.toLowerCase()}.webp`,
  }));
  res.json({ seedId: couple.id, location: couple.location, prompts });
});

/** List 360° equirectangular panorama prompts for every wedding seed (for Higgsfield MCP batch generation). */
app.get('/api/panorama/prompts', (_req, res) => {
  const couples = require(path.join(ROOT, 'data', 'couples.json'));
  res.json({
    aspectRatio: '2:1',
    note: 'Generate at 2:1 (e.g. 4096x2048). Save to saveAs; the 3D scene picks it up automatically on next load.',
    prompts: couples.map((c) => ({
      seedId: c.id,
      location: c.location,
      prompt: buildPanoramaPrompt(c),
      saveAs: `assets/weddings/${c.id}-pano.jpg`,
    })),
  });
});

/** Get vendor hero image URL + metadata. */
app.get('/api/vendor-visual/:seedId/:category', (req, res) => {
  const { seedId, category } = req.params;
  const manifest = readManifest();
  const key = assetKey(seedId, category);
  const meta = manifest.assets[key] || {};

  const hfUrl = higgsfieldPath(seedId, category);
  if (hfUrl) {
    return res.json({
      url: hfUrl,
      source: 'higgsfield',
      prompt: meta.prompt || null,
      category,
      seedId,
    });
  }

  const couples = fs.existsSync(path.join(ROOT, 'data', 'couples.json'))
    ? require(path.join(ROOT, 'data', 'couples.json'))
    : [];
  const couple = couples.find((c) => c.id === seedId);
  const vendor = couple?.vendors?.find((v) => v.category.toLowerCase() === category.toLowerCase());

  const url = getOrCreateFallback(seedId, category, {
    vendorName: vendor?.name || category,
    location: couple?.location,
    accent: couple?.palette?.accent,
    glow: couple?.palette?.glow,
    tier: 'mid',
  });

  res.json({
    url,
    source: 'fallback',
    prompt: vendor && couple ? buildVendorPrompt(vendor, couple) : null,
    category,
    seedId,
  });
});

/** Register a Higgsfield MCP-generated asset (after saving file to public/assets/vendors/). */
app.post('/api/vendor-visual/register', (req, res) => {
  const { seedId, category, url, prompt, higgsfieldJobId } = req.body || {};
  if (!seedId || !category) {
    return res.status(400).json({ error: 'seedId and category required' });
  }
  const manifest = readManifest();
  const key = assetKey(seedId, category);
  manifest.assets[key] = {
    url: url || higgsfieldPath(seedId, category),
    prompt: prompt || null,
    higgsfieldJobId: higgsfieldJobId || null,
    source: 'higgsfield',
    registeredAt: new Date().toISOString(),
  };
  writeManifest(manifest);
  res.json({ ok: true, asset: manifest.assets[key] });
});

/** Build prompt for a custom wedding (form submission). */
app.post('/api/vendor-visual/prompt', (req, res) => {
  const { vendor, couple } = req.body || {};
  if (!vendor || !couple) return res.status(400).json({ error: 'vendor and couple required' });
  res.json({ prompt: buildVendorPrompt(vendor, couple) });
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, higgsfieldMcp: 'Use Cursor plugin — generate_image then save to public/assets/vendors/' });
});

ensureDirs();
app.listen(PORT, () => {
  console.log(`Marrymap running → http://localhost:${PORT}`);
  console.log(`Vendor API  → http://localhost:${PORT}/api/vendor-visual/priya-arjun/venue`);
});
