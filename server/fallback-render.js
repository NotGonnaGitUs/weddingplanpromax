/**
 * Procedural SVG vendor hero images (fallback when Higgsfield MCP assets aren't cached yet).
 * Styled to resemble clean Blender product renders.
 */

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function categoryGlyph(category) {
  const glyphs = {
    Travel: '<path d="M80 95 L120 75 L200 75 L240 95 L240 130 L80 130 Z" fill="#ddd"/><circle cx="110" cy="130" r="18" fill="#888"/><circle cx="210" cy="130" r="18" fill="#888"/><path d="M130 75 L170 45 L210 75" fill="#ccc"/>',
    Venue: '<path d="M60 130 L140 60 L220 130 Z" fill="none" stroke="#fff" stroke-width="4"/><rect x="70" y="130" width="140" height="8" fill="#bbb"/>',
    Catering: '<ellipse cx="150" cy="120" rx="70" ry="12" fill="#ccc"/><rect x="80" y="70" width="140" height="50" rx="6" fill="#eee"/><circle cx="110" cy="95" r="10" fill="#f5a"/><circle cx="150" cy="95" r="10" fill="#afa"/><circle cx="190" cy="95" r="10" fill="#aaf"/>',
    Flowers: '<circle cx="150" cy="85" r="22" fill="#f8a"/><circle cx="125" cy="105" r="18" fill="#f6c"/><circle cx="175" cy="105" r="18" fill="#f6c"/><rect x="145" y="105" width="10" height="35" fill="#6a4"/>',
    Music: '<rect x="90" y="75" width="50" height="60" rx="4" fill="#333"/><circle cx="115" cy="105" r="12" fill="#555"/><rect x="160" y="85" width="60" height="40" rx="3" fill="#444"/><path d="M170 95 Q190 75 210 95" stroke="#fff" stroke-width="3" fill="none"/>',
  };
  return glyphs[category] || glyphs.Venue;
}

function renderVendorSvg({ category, vendorName, location, accent, glow, tier }) {
  const accentColor = accent || '#C9A267';
  const glowColor = glow || '#E0447C';
  const tierLabel = tier === 'high' ? 'Premium' : tier === 'low' ? 'Essential' : 'Signature';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a1828"/>
      <stop offset="55%" stop-color="${accentColor}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#0f1418"/>
    </linearGradient>
    <linearGradient id="floor" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e8e4dc"/>
      <stop offset="100%" stop-color="#c8c0b4"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect width="640" height="360" fill="url(#bg)"/>
  <ellipse cx="320" cy="290" rx="220" ry="28" fill="#000" opacity="0.25"/>
  <rect x="120" y="240" width="400" height="24" rx="4" fill="url(#floor)" filter="url(#shadow)"/>
  <g transform="translate(170, 55) scale(1.2)" opacity="0.95">
    ${categoryGlyph(category)}
  </g>
  <circle cx="520" cy="60" r="40" fill="${glowColor}" opacity="0.2"/>
  <text x="32" y="42" fill="#fff" font-family="Georgia, serif" font-size="22" font-style="italic">${escapeXml(vendorName)}</text>
  <text x="32" y="68" fill="${accentColor}" font-family="system-ui, sans-serif" font-size="11" letter-spacing="3" font-weight="600">${escapeXml(category.toUpperCase())} · ${escapeXml(tierLabel)}</text>
  <text x="32" y="330" fill="rgba(255,255,255,0.55)" font-family="system-ui, sans-serif" font-size="12">${escapeXml(location)}</text>
  <text x="608" y="330" text-anchor="end" fill="rgba(255,255,255,0.35)" font-family="system-ui, sans-serif" font-size="10">Marrymap · procedural preview</text>
</svg>`;
}

module.exports = { renderVendorSvg };
