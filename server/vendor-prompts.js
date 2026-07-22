/**
 * Higgsfield prompt templates for vendor hero images.
 * Used by MCP workflow (Cursor /higgs) and documented in README.
 */

const CATEGORY_SCENES = {
  Travel: (loc, vibe) =>
    `Isometric 3D render, Blender-style product visualization: luxury wedding guest shuttle bus and small airplane icon on minimal pedestal, destination ${loc}, ${vibe} travel mood, soft studio lighting, matte materials, clean white background gradient, wedding planning app UI hero, 16:9`,

  Venue: (loc, vibe) =>
    `Isometric 3D render, Blender-style: open-air wedding ceremony venue at ${loc}, ${vibe} aesthetic, floral arch, sand or vineyard floor, golden hour, soft shadows, premium product viz, no people, 16:9`,

  Catering: (loc, vibe) =>
    `Isometric 3D render, Blender-style: elegant wedding reception food station at ${loc}, ${vibe} styling, plated courses and cocktail bar miniature, studio lighting, appetizing but stylized, 16:9`,

  Flowers: (loc, vibe) =>
    `Isometric 3D render, Blender-style: wedding floral arrangement bouquet and ceremony arch flowers for ${loc} wedding, ${vibe} color palette, botanical product photography, soft studio light, 16:9`,

  Music: (loc, vibe) =>
    `Isometric 3D render, Blender-style: wedding DJ booth with speakers and string quartet instruments miniature, ${loc} ${vibe} celebration, neon accent lights subtle, product viz, 16:9`,
};

const VIBE_WORDS = {
  beach: 'tropical beach coastal',
  vineyard: 'Tuscan vineyard rustic',
  island: 'Mediterranean island chic',
  jungle: 'jungle bohemian cenote',
  coastal: 'serene ocean cliff calm',
  wine: 'Napa wine country elegant',
};

function buildVendorPrompt(vendor, couple) {
  const vibe = VIBE_WORDS[couple.vibe] || couple.vibe || 'destination wedding';
  const loc = couple.location || 'destination';
  const builder = CATEGORY_SCENES[vendor.category] || CATEGORY_SCENES.Venue;
  const base = builder(loc, vibe);
  return `${base}. Vendor: "${vendor.name}". Palette accent ${couple.palette?.accent || '#C9A267'}. Commercial wedding marketplace hero image.`;
}

module.exports = { buildVendorPrompt, CATEGORY_SCENES, VIBE_WORDS };
