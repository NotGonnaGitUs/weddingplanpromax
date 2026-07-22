/**
 * Three.js isometric "Blender-style" vendor previews for the detail drawer.
 */
window.Vendor3D = (function () {
  let renderer = null;
  let scene = null;
  let camera = null;
  let animId = null;
  let mountEl = null;
  let spinGroup = null;

  function initRenderer(container) {
    if (renderer) {
      container.innerHTML = '';
      renderer.domElement.remove();
    }
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    mountEl = container;
  }

  function studioLights(palette) {
    const key = new THREE.DirectionalLight(0xfff0dd, 1.4);
    key.position.set(4, 8, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(palette?.glow || 0xff8866, 0.35);
    fill.position.set(-5, 3, -2);
    scene.add(fill);
    scene.add(new THREE.AmbientLight(0x888899, 0.55));
    const rim = new THREE.PointLight(palette?.accent || 0xc9a267, 0.8, 12);
    rim.position.set(0, 2, -3);
    scene.add(rim);
  }

  function addPedestal(accent) {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xe8e2d8,
      roughness: 0.65,
      metalness: 0.05,
    });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.5, 0.18, 48), mat);
    base.position.y = -0.09;
    scene.add(base);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.38, 0.03, 8, 64),
      new THREE.MeshStandardMaterial({ color: accent || 0xc9a267, roughness: 0.3, metalness: 0.6 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.01;
    scene.add(ring);
  }

  function buildTravel(group, accent) {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.5, 0.7),
      new THREE.MeshStandardMaterial({ color: 0xf2f0ec, roughness: 0.4, metalness: 0.1 })
    );
    body.position.y = 0.35;
    group.add(body);
    [-0.45, 0.45].forEach((x) => {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.12, 16),
        new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 })
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.15, 0.35);
      group.add(wheel);
    });
    const wing = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.06, 0.35),
      new THREE.MeshStandardMaterial({ color: accent, roughness: 0.35, metalness: 0.4 })
    );
    wing.position.set(0, 0.75, 0);
    group.add(wing);
  }

  function buildVenue(group, accent, glow) {
    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(0.65, 0.07, 12, 32, Math.PI),
      new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.25, roughness: 0.35, metalness: 0.45 })
    );
    arch.position.y = 0.55;
    group.add(arch);
    for (let i = 0; i < 6; i++) {
      const t = (i / 5) * Math.PI;
      const s = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 10, 10),
        new THREE.MeshStandardMaterial({ color: glow, emissive: glow, emissiveIntensity: 0.5 })
      );
      s.position.set(0.65 * Math.cos(t), 0.55 + 0.65 * Math.sin(t), 0);
      group.add(s);
    }
  }

  function buildCatering(group, accent) {
    const table = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 0.08, 24),
      new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.5 })
    );
    table.position.y = 0.35;
    group.add(table);
    const colors = [accent, 0xff8866, 0x88aa66];
    colors.forEach((c, i) => {
      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.04, 16),
        new THREE.MeshStandardMaterial({ color: c, roughness: 0.4 })
      );
      const a = (i / 3) * Math.PI * 2;
      plate.position.set(Math.cos(a) * 0.28, 0.42, Math.sin(a) * 0.28);
      group.add(plate);
    });
  }

  function buildFlowers(group, accent, glow) {
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.06, 0.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x4a6b3a, roughness: 0.9 })
    );
    stem.position.y = 0.35;
    group.add(stem);
    [accent, glow, 0xffeedd].forEach((c, i) => {
      const petal = new THREE.Mesh(
        new THREE.SphereGeometry(0.14 - i * 0.02, 12, 12),
        new THREE.MeshStandardMaterial({ color: c, roughness: 0.55 })
      );
      petal.position.set((i - 1) * 0.12, 0.62 + i * 0.06, 0);
      group.add(petal);
    });
  }

  function buildMusic(group, accent) {
    const speaker = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.65, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6, metalness: 0.2 })
    );
    speaker.position.set(-0.35, 0.45, 0);
    group.add(speaker);
    const cone = new THREE.Mesh(
      new THREE.CircleGeometry(0.12, 16),
      new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.3 })
    );
    cone.position.set(-0.35, 0.45, 0.18);
    group.add(cone);
    const viol = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.5, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.7 })
    );
    viol.position.set(0.35, 0.45, 0);
    group.add(viol);
  }

  function buildModel(category, palette) {
    spinGroup = new THREE.Group();
    const builders = {
      Travel: buildTravel,
      Venue: buildVenue,
      Catering: buildCatering,
      Flowers: buildFlowers,
      Music: buildMusic,
    };
    (builders[category] || buildVenue)(spinGroup, palette?.accent, palette?.glow);
    scene.add(spinGroup);
  }

  function disposeScene() {
    if (!scene) return;
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
    scene = null;
    spinGroup = null;
  }

  function animate() {
    if (!renderer || !scene || !camera) return;
    if (spinGroup) spinGroup.rotation.y += 0.008;
    renderer.render(scene, camera);
    animId = requestAnimationFrame(animate);
  }

  function stop() {
    if (animId) cancelAnimationFrame(animId);
    animId = null;
  }

  function show(container, category, palette) {
    if (!container || typeof THREE === 'undefined') return;
    stop();
    disposeScene();
    initRenderer(container);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 50);
    camera.position.set(2.2, 1.6, 2.8);
    camera.lookAt(0, 0.4, 0);

    studioLights(palette);
    addPedestal(palette?.accent);
    buildModel(category, palette);
    animate();
  }

  function resize() {
    if (!renderer || !camera || !mountEl) return;
    const w = mountEl.clientWidth;
    const h = mountEl.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize);

  return { show, stop, resize };
})();
