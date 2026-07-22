/**
 * Fetches Higgsfield-backed (or fallback) vendor hero images from the API.
 */
window.VendorVisuals = (function () {
  const cache = new Map();
  const API_BASE = window.MARRYMAP_API || '';

  async function fetchVisual(seedId, category, couple, vendor) {
    const key = `${seedId || couple?.seedId || 'custom'}/${category}`;
    if (cache.has(key)) return cache.get(key);

    const seed = couple?.seedId || seedId || 'priya-arjun';
    const url = `${API_BASE}/api/vendor-visual/${encodeURIComponent(seed)}/${encodeURIComponent(category)}`;

    const promise = fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .catch(() => ({
        url: null,
        source: 'offline',
        prompt: null,
      }));

    cache.set(key, promise);
    return promise;
  }

  async function loadHeroImage(imgEl, badgeEl, seedId, category, couple, vendor) {
    if (!imgEl) return;
    imgEl.classList.add('vd-hero-loading');
    imgEl.removeAttribute('src');
    if (badgeEl) badgeEl.textContent = 'Generating preview…';

    const data = await fetchVisual(seedId, category, couple, vendor);
    if (data.url) {
      imgEl.src = data.url;
      imgEl.onload = () => imgEl.classList.remove('vd-hero-loading');
    } else {
      imgEl.classList.remove('vd-hero-loading');
    }

    if (badgeEl) {
      const labels = {
        higgsfield: 'Higgsfield AI',
        fallback: 'Procedural preview',
        offline: 'Offline mode',
      };
      badgeEl.textContent = labels[data.source] || data.source;
      badgeEl.dataset.source = data.source;
    }
    return data;
  }

  function prefetchForCouple(couple) {
    if (!couple?.vendors) return;
    const seed = couple.seedId || 'priya-arjun';
    couple.vendors.forEach((v) => fetchVisual(seed, v.category, couple, v));
  }

  return { fetchVisual, loadHeroImage, prefetchForCouple };
})();
