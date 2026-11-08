import * as THREE from 'three';
import { rng, mat, mesh, box, cyl, cone, ico, jitter, tag, mountainRing, waterSurface, peakGeometry } from './lowpoly.js';
import { touchesWater } from './water.js';
import { LAYERS } from './data.js';

const NEIGHBOR_SPOTS = [
  [-16, 0], [16, 0], [0, -26], [0, 26], [-16, -26], [16, -26], [-16, 26], [16, 26],
];

export const W = 8; // chinampa width (x)
export const L = 18; // chinampa length (z)
export const BED = -2.4; // lake bottom
export const TOP = 0.6; // growing surface

// Body layers from the lake bed up (heights in scene units ≈ metres, slightly exaggerated).
const BODY = [
  { key: 'mat1', y0: BED, y1: -1.75, color: '#8f8546', id: 'reedMat', reeds: true },
  { key: 'mud1', y0: -1.75, y1: -1.0, color: '#4a3527', id: 'mud' },
  { key: 'mat2', y0: -1.0, y1: -0.65, color: '#8a8a48', id: 'reedMat', reeds: true },
  { key: 'mud2', y0: -0.65, y1: 0.15, color: '#563b2a', id: 'mud' },
  { key: 'soil', y0: 0.15, y1: TOP, color: '#3f2b1f', id: 'topsoil' },
];

// Shared geometries for the many repeated plants.
const G = {
  stalk: new THREE.CylinderGeometry(0.035, 0.05, 2.0, 5).translate(0, 1.0, 0),
  leaf: new THREE.BoxGeometry(0.7, 0.02, 0.12).translate(0.35, 0, 0),
  tassel: new THREE.ConeGeometry(0.08, 0.35, 5),
  ear: new THREE.CylinderGeometry(0.06, 0.045, 0.34, 6),
  beanLeaf: new THREE.IcosahedronGeometry(0.09, 0),
  pod: new THREE.BoxGeometry(0.035, 0.2, 0.035),
  smallRed: new THREE.ConeGeometry(0.04, 0.17, 4),
  berry: new THREE.IcosahedronGeometry(0.075, 1),
  flower: new THREE.DodecahedronGeometry(0.075, 0),
  thinStick: new THREE.CylinderGeometry(0.02, 0.025, 1.2, 4).translate(0, 0.6, 0),
};

export function buildChinampa() {
  const root = new THREE.Group();
  const r = rng(42);
  const sway = []; // physics bodies: { obj, k, c, gain, max }
  const layerGroups = {};
  for (const l of LAYERS) {
    const g = new THREE.Group();
    g.name = l.key;
    layerGroups[l.key] = g;
    root.add(g);
  }

  /* ── Layer 0: lake bed + water ─────────────────────────────── */
  // The canal bed slopes up against each chinampa (built-up sediment) and is deepest
  // mid-canal, so the water shader can shade shallows and depths like a real canal.
  const bedGeo = jitter(new THREE.PlaneGeometry(420, 420, 170, 170).rotateX(-Math.PI / 2), 0.25, 5);
  const rects = [[0, 0, W / 2 + 0.3, L / 2 + 0.3], ...NEIGHBOR_SPOTS.map(([x, z]) => [x, z, W / 2, L / 2])];
  const bp = bedGeo.attributes.position;
  for (let i = 0; i < bp.count; i++) {
    const x = bp.getX(i),
      z = bp.getZ(i);
    let d = Infinity;
    for (const [cx, cz, hx, hz] of rects) {
      const dx = Math.max(Math.abs(x - cx) - hx, 0);
      const dz = Math.max(Math.abs(z - cz) - hz, 0);
      d = Math.min(d, Math.hypot(dx, dz));
    }
    const t = THREE.MathUtils.smoothstep(d, 0.3, 4.5);
    bp.setY(i, bp.getY(i) + THREE.MathUtils.lerp(-1.1, -3.7, t));
  }
  bedGeo.computeVertexNormals();
  const bed = mesh(bedGeo, mat('#3c4637'), { cast: false });
  layerGroups.bed.add(touchesWater(bed));

  const water = waterSurface(420, 130, { depthRange: 2.8, foamWidth: 0.55, foamScale: 1.5 });
  tag(water, 'canal');
  layerGroups.bed.add(water);

  // Compact versions used in the axonometric plan.
  const axoBed = box(W + 6, 0.25, L + 6, '#3c4637');
  axoBed.position.y = BED - 0.15;
  tag(axoBed, 'canal');
  const axoWater = new THREE.Mesh(
    new THREE.BoxGeometry(W + 6, 0.06, L + 6),
    new THREE.MeshStandardMaterial({ color: '#3b9fae', transparent: true, opacity: 0.45, flatShading: true }),
  );
  tag(axoWater, 'canal');
  const axoOnly = [axoBed, axoWater];
  axoOnly.forEach((m) => {
    m.visible = false;
    layerGroups.bed.add(m);
  });

  /* ── Body layers ───────────────────────────────────────────── */
  BODY.forEach((b, i) => {
    const inset = i * 0.06;
    const h = b.y1 - b.y0;
    let geo = new THREE.BoxGeometry(W - inset, h, L - inset, 4, 1, 9);
    geo = jitter(geo, 0.07, 100 + i);
    const m = mesh(geo, mat(b.color));
    m.position.y = (b.y0 + b.y1) / 2;
    tag(m, b.id);
    layerGroups[b.key].add(touchesWater(m));

    if (b.reeds) {
      // Loose reeds and tule lying on top of the mat, for texture.
      const reeds = new THREE.Group();
      const colors = ['#b5a55b', '#9a9a4e', '#c4b56c', '#7f8a43'];
      for (let k = 0; k < 34; k++) {
        const len = W * (0.6 + r() * 0.4);
        const c = cyl(0.04, 0.04, len, colors[k % colors.length], 4);
        c.rotation.z = Math.PI / 2;
        c.rotation.y = (r() - 0.5) * 0.4;
        c.position.set((r() - 0.5) * 0.8, b.y1 + 0.02, (r() - 0.5) * (L - 1));
        reeds.add(c);
      }
      tag(reeds, 'reedMat');
      layerGroups[b.key].add(reeds);
    }
    if (b.key === 'soil') {
      // Planting furrows.
      for (let k = -3; k <= 3; k++) {
        const f = box(0.35, 0.08, L - 5.5, '#4a3324');
        f.position.set(k * 0.95, TOP + 0.03, 0.4);
        tag(f, 'topsoil');
        layerGroups.soil.add(f);
      }
    }
  });

  /* ── Frame: stakes + woven reed fence ──────────────────────── */
  const stakeH = TOP + 0.4 - BED;
  const stakePositions = [];
  const hx = W / 2 + 0.15;
  const hz = L / 2 + 0.15;
  for (let z = -hz; z <= hz + 0.01; z += 1.2) stakePositions.push([-hx, z], [hx, z]);
  for (let x = -hx + 1.2; x < hx - 0.1; x += 1.2) stakePositions.push([x, -hz], [x, hz]);
  const stakes = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.1, 0.13, stakeH, 6), mat('#6b4a2e'), stakePositions.length);
  const dummy = new THREE.Object3D();
  stakePositions.forEach(([x, z], i) => {
    dummy.position.set(x, BED + stakeH / 2 + (r() - 0.5) * 0.15, z);
    dummy.rotation.set((r() - 0.5) * 0.06, r() * 3, (r() - 0.5) * 0.06);
    dummy.updateMatrix();
    stakes.setMatrixAt(i, dummy.matrix);
  });
  stakes.castShadow = true;
  stakes.receiveShadow = true;
  tag(stakes, 'stakes');
  touchesWater(stakes);
  layerGroups.frame.add(stakes);

  // Edge retaining wall: logs and slabs of tree bark stacked horizontally behind the stakes,
  // from the lake bed up to the soil, as chinamperos line the edges of a real chinampa.
  const wattle = new THREE.Group();
  const logR = 0.13;
  const logYs = [];
  for (let y = BED + logR; y <= TOP - 0.02; y += logR * 1.9) logYs.push(y);
  const logGeo = new THREE.CylinderGeometry(1, 1, 1, 7).rotateZ(Math.PI / 2); // unit log along x
  const logMat = new THREE.MeshStandardMaterial({ color: '#ffffff', flatShading: true, roughness: 1 });
  const logs = new THREE.InstancedMesh(logGeo, logMat, logYs.length * 4 * 2);
  const barkColors = ['#5b4330', '#6b4f37', '#4e3a2a', '#73563b', '#5f4a36'];
  const lc = new THREE.Color();
  let li = 0;
  const ex = W / 2 + 0.02;
  const ez = L / 2 + 0.02;
  const addLog = (x, y, z, len, alongZ, rad) => {
    dummy.position.set(x, y, z);
    dummy.rotation.set((r() - 0.5) * 0.4, alongZ ? Math.PI / 2 : 0, (r() - 0.5) * 0.02);
    dummy.scale.set(len, rad, rad * (0.8 + r() * 0.3));
    dummy.updateMatrix();
    logs.setMatrixAt(li, dummy.matrix);
    logs.setColorAt(li, lc.set(barkColors[Math.floor(r() * barkColors.length)]));
    li++;
  };
  logYs.forEach((y) => {
    // Each course is made of two shorter logs per side, so the joints stagger.
    const split = 0.35 + r() * 0.3;
    for (const s of [-1, 1]) {
      const zA = -ez + (L * split) / 2;
      const zB = ez - (L * (1 - split)) / 2;
      addLog(s * ex, y, zA, L * split + 0.1, true, logR * (0.85 + r() * 0.3));
      addLog(s * ex, y, zB, L * (1 - split) + 0.1, true, logR * (0.85 + r() * 0.3));
      const xA = -ex + (W * split) / 2;
      const xB = ex - (W * (1 - split)) / 2;
      addLog(xA, y, s * ez, W * split + 0.25, false, logR * (0.85 + r() * 0.3));
      addLog(xB, y, s * ez, W * (1 - split) + 0.25, false, logR * (0.85 + r() * 0.3));
    }
  });
  logs.count = li;
  logs.castShadow = logs.receiveShadow = true;
  wattle.add(logs);
  // Flat slabs of bark pressed between some logs and the stakes.
  for (let k = 0; k < 18; k++) {
    const side = k % 4;
    const slab = box(side < 2 ? 0.05 : 0.9 + r() * 0.6, 0.5 + r() * 0.5, side < 2 ? 0.9 + r() * 0.6 : 0.05, ['#4e3a2a', '#6b4f37'][k % 2]);
    const y = -0.9 + r() * 1.2;
    if (side === 0) slab.position.set(-ex - 0.1, y, (r() - 0.5) * (L - 2));
    if (side === 1) slab.position.set(ex + 0.1, y, (r() - 0.5) * (L - 2));
    if (side === 2) slab.position.set((r() - 0.5) * (W - 1.5), y, -ez - 0.1);
    if (side === 3) slab.position.set((r() - 0.5) * (W - 1.5), y, ez + 0.1);
    slab.rotation.set((r() - 0.5) * 0.15, 0, (r() - 0.5) * 0.15);
    wattle.add(slab);
  }
  tag(wattle, 'wattle');
  touchesWater(wattle);
  layerGroups.frame.add(wattle);

  /* ── Crops & seedbed (sit on the soil surface) ─────────────── */
  const crops = layerGroups.crops;

  // Seedbed with chapines.
  const seedbed = new THREE.Group();
  const sbBase = box(W - 1.2, 0.08, 2.3, '#2f2118');
  sbBase.position.set(0, TOP + 0.04, -L / 2 + 1.75);
  seedbed.add(sbBase);
  const cols = 19,
    rows = 6;
  const chap = new THREE.InstancedMesh(new THREE.BoxGeometry(0.27, 0.16, 0.27), mat('#4f3626'), cols * rows);
  const sprout = new THREE.InstancedMesh(new THREE.ConeGeometry(0.045, 0.18, 4), mat('#8fd05a'), cols * rows);
  let n = 0;
  for (let ci = 0; ci < cols; ci++)
    for (let ri = 0; ri < rows; ri++) {
      const x = -3.05 + ci * 0.34;
      const z = -L / 2 + 0.85 + ri * 0.34;
      dummy.position.set(x, TOP + 0.16, z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      chap.setMatrixAt(n, dummy.matrix);
      dummy.position.y = TOP + 0.32;
      dummy.scale.setScalar(0.7 + r() * 0.6);
      dummy.updateMatrix();
      sprout.setMatrixAt(n, dummy.matrix);
      n++;
    }
  chap.castShadow = sprout.castShadow = true;
  chap.receiveShadow = true;
  seedbed.add(chap, sprout);
  tag(seedbed, 'seedbed');
  crops.add(seedbed);

  // Milpa: maize + beans + squash.
  const maizeMats = { stalk: mat('#8fae4a'), leaf: mat('#6f9a3a'), tassel: mat('#d9c27a'), ear: mat('#e8c84a') };
  let plantIndex = 0;
  for (let zi = 0; zi < 6; zi++)
    for (let xi = 0; xi < 8; xi++) {
      const p = new THREE.Group();
      p.position.set(-3.2 + xi * 0.92 + (r() - 0.5) * 0.2, TOP, -5.3 + zi * 0.95 + (r() - 0.5) * 0.2);
      const s = 0.85 + r() * 0.35;
      p.scale.setScalar(s);
      p.add(mesh(G.stalk, maizeMats.stalk));
      for (let k = 0; k < 5; k++) {
        const lf = mesh(G.leaf, maizeMats.leaf);
        lf.position.y = 0.35 + k * 0.32;
        lf.rotation.set(0, k * 2.4 + r(), -0.45 - r() * 0.3);
        p.add(lf);
      }
      const t = mesh(G.tassel, maizeMats.tassel);
      t.position.y = 2.15;
      p.add(t);
      const ear = mesh(G.ear, maizeMats.ear);
      ear.position.set(0.08, 1.05, 0);
      ear.rotation.z = -0.35;
      p.add(ear);
      tag(p, 'maize');

      if (plantIndex % 2 === 0) {
        const bean = new THREE.Group();
        for (let k = 0; k < 5; k++) {
          const a = k * 1.9;
          const lf = mesh(G.beanLeaf, mat('#3f7a34'));
          lf.position.set(Math.cos(a) * 0.08, 0.3 + k * 0.28, Math.sin(a) * 0.08);
          bean.add(lf);
        }
        for (let k = 0; k < 3; k++) {
          const pod = mesh(G.pod, mat(k % 2 ? '#7a3b72' : '#5f8a3a'));
          pod.position.set(Math.cos(k * 2) * 0.11, 0.6 + k * 0.33, Math.sin(k * 2) * 0.11);
          pod.rotation.z = 0.3;
          bean.add(pod);
        }
        tag(bean, 'beans');
        p.add(bean);
      }
      crops.add(p);
      sway.push({ obj: p, k: 16 + r() * 6, c: 2.0, gain: 1.0, max: 0.35 });
      plantIndex++;
    }

  for (let k = 0; k < 11; k++) {
    const sq = new THREE.Group();
    sq.position.set(-3.0 + r() * 6, TOP, -5.2 + r() * 4.8);
    const fruit = ico(0.24, k % 3 ? '#e08a2b' : '#7a9a3a', 0, k, 0.08);
    fruit.scale.set(1, 0.7, 1.1);
    fruit.position.y = 0.16;
    sq.add(fruit);
    for (let j = 0; j < 3; j++) {
      const lf = cyl(0.32, 0.32, 0.03, '#4f8a3a', 6);
      lf.position.set(Math.cos(j * 2.1) * 0.35, 0.12 + j * 0.03, Math.sin(j * 2.1) * 0.35);
      lf.rotation.set((r() - 0.5) * 0.5, 0, (r() - 0.5) * 0.5);
      sq.add(lf);
    }
    tag(sq, 'squash');
    crops.add(sq);
    sway.push({ obj: sq, k: 45, c: 4, gain: 0.25, max: 0.1 });
  }

  // Chili (left) and tomato (right).
  for (let zi = 0; zi < 3; zi++)
    for (let xi = 0; xi < 4; xi++) {
      const ch = new THREE.Group();
      ch.position.set(-3.1 + xi * 0.75, TOP, 0.75 + zi * 0.8);
      const bush = ico(0.28, '#3e7a33', 0, xi + zi * 4, 0.1);
      bush.scale.set(1, 0.85, 1);
      bush.position.y = 0.33;
      ch.add(bush);
      for (let k = 0; k < 6; k++) {
        const pep = mesh(G.smallRed, mat(k % 3 ? '#c8302a' : '#e0542d'));
        const a = k * 1.05;
        pep.position.set(Math.cos(a) * 0.24, 0.22 + (k % 2) * 0.16, Math.sin(a) * 0.24);
        pep.rotation.x = Math.PI;
        ch.add(pep);
      }
      tag(ch, 'chili');
      crops.add(ch);
      sway.push({ obj: ch, k: 32, c: 3, gain: 0.5, max: 0.2 });

      const tm = new THREE.Group();
      tm.position.set(0.8 + xi * 0.75, TOP, 0.75 + zi * 0.8);
      tm.add(mesh(G.thinStick, mat('#a88a5a')));
      for (let k = 0; k < 2; k++) {
        const b = ico(0.22, '#4b8a3a', 0, 50 + xi + zi + k, 0.08);
        b.position.y = 0.35 + k * 0.42;
        tm.add(b);
      }
      for (let k = 0; k < 5; k++) {
        const t = mesh(G.berry, mat('#d9452b'));
        const a = k * 1.3;
        t.position.set(Math.cos(a) * 0.2, 0.25 + k * 0.15, Math.sin(a) * 0.2);
        tm.add(t);
      }
      tag(tm, 'tomato');
      crops.add(tm);
      sway.push({ obj: tm, k: 28, c: 2.8, gain: 0.6, max: 0.22 });
    }

  // Amaranth (left) and cempasúchil (right).
  for (let zi = 0; zi < 3; zi++)
    for (let xi = 0; xi < 4; xi++) {
      const am = new THREE.Group();
      am.position.set(-3.1 + xi * 0.75 + (r() - 0.5) * 0.15, TOP, 3.35 + zi * 0.75);
      const h = 1.2 + r() * 0.4;
      const st = cyl(0.03, 0.045, h, '#7a6a3a', 5);
      st.position.y = h / 2;
      am.add(st);
      for (let k = 0; k < 3; k++) {
        const lf = ico(0.12, '#5c7a35', 0, k);
        lf.scale.set(1.4, 0.3, 0.8);
        lf.position.set(Math.cos(k * 2.2) * 0.12, 0.35 + k * 0.25, Math.sin(k * 2.2) * 0.12);
        am.add(lf);
      }
      const plume = cone(0.15, 0.65, xi % 2 ? '#b0245a' : '#c43d4f', 5);
      plume.position.y = h + 0.25;
      am.add(plume);
      for (let k = 0; k < 2; k++) {
        const sp = cone(0.08, 0.35, '#a52a55', 5);
        sp.position.set((k ? 1 : -1) * 0.13, h - 0.05, 0);
        sp.rotation.z = (k ? -1 : 1) * 0.6;
        am.add(sp);
      }
      tag(am, 'amaranth');
      crops.add(am);
      sway.push({ obj: am, k: 18, c: 2.2, gain: 0.9, max: 0.32 });

      for (let j = 0; j < 2; j++) {
        const cm = new THREE.Group();
        cm.position.set(0.7 + xi * 0.75 + j * 0.35, TOP, 3.3 + zi * 0.75 + j * 0.3);
        const bush = ico(0.2, '#3f7a33', 0, 70 + xi + zi * 3 + j, 0.06);
        bush.position.y = 0.2;
        cm.add(bush);
        for (let k = 0; k < 4; k++) {
          const f = mesh(G.flower, mat(k % 2 ? '#f39a1c' : '#f6b928'));
          const a = k * 1.6;
          f.position.set(Math.cos(a) * 0.15, 0.36 + (k % 2) * 0.05, Math.sin(a) * 0.15);
          cm.add(f);
        }
        tag(cm, 'cempasuchil');
        crops.add(cm);
        sway.push({ obj: cm, k: 40, c: 3.5, gain: 0.35, max: 0.15 });
      }
    }

  /* ── Willows, house, tools ─────────────────────────────────── */
  const life = layerGroups.life;
  const treeColors = ['#5f8f3e', '#6e9c45', '#4f7f37', '#78a64c'];
  for (const side of [-1, 1])
    for (let z = -L / 2 + 0.9; z <= L / 2 - 0.5; z += 2.55) {
      const t = ahuejote(r, treeColors);
      t.position.set(side * (W / 2 - 0.35), TOP, z + (r() - 0.5) * 0.4);
      tag(t, 'ahuejote');
      life.add(t);
      sway.push({ obj: t, k: 6 + r() * 2, c: 1.1, gain: 0.55, max: 0.18 });
    }

  const hut = new THREE.Group();
  hut.position.set(0, TOP, L / 2 - 1.7);
  const walls = box(3.2, 1.7, 2.2, '#c9a77a');
  walls.position.y = 0.85;
  hut.add(walls);
  // Vertical reed texture on the walls.
  for (let k = 0; k < 14; k++) {
    const rd = box(0.06, 1.6, 0.04, k % 2 ? '#b8956a' : '#d6b88a');
    rd.position.set(-1.5 + k * 0.23, 0.82, -1.12);
    hut.add(rd);
  }
  const door = box(0.7, 1.2, 0.05, '#4a3020');
  door.position.set(0.6, 0.6, -1.15);
  hut.add(door);
  // Hip roof of thatch: a clean 4-sided pyramid (no vertex jitter, which tore holes in it)
  // plus a slightly larger, darker under-layer that reads as the thatch's thickness.
  const roofGeo = new THREE.ConeGeometry(2.0, 1.7, 4, 1).rotateY(Math.PI / 4);
  const roof = mesh(roofGeo, mat('#d4b25e', { side: THREE.DoubleSide }));
  roof.scale.set(1.35, 1, 0.98);
  roof.position.y = 1.7 + 0.85;
  const eaves = mesh(new THREE.ConeGeometry(2.08, 0.5, 4, 1, true).rotateY(Math.PI / 4), mat('#b8954a', { side: THREE.DoubleSide }));
  eaves.scale.set(1.35, 1, 0.98);
  eaves.position.y = 1.7 + 0.15;
  hut.add(roof, eaves);
  const ridge = cone(0.13, 0.35, '#b8954a', 4);
  ridge.rotation.y = Math.PI / 4;
  ridge.position.y = 1.7 + 0.85 + 0.85 + 0.08;
  hut.add(ridge);
  tag(hut, 'hut');
  life.add(hut);

  const coa = new THREE.Group();
  coa.position.set(-1.85, TOP, L / 2 - 2.9);
  const handle = cyl(0.03, 0.035, 1.7, '#8a6a44', 5);
  handle.position.y = 0.85;
  coa.add(handle);
  const blade = box(0.16, 0.32, 0.04, '#6e4f30');
  blade.position.y = 0.12;
  coa.add(blade);
  coa.rotation.z = 0.22;
  tag(coa, 'coa');
  life.add(coa);

  /* ── Extras: canoe, axolotl, heron (hidden in the axonometric plan) ── */
  const extras = new THREE.Group();
  root.add(extras);

  const canoe = buildCanoe(r);
  extras.add(canoe.group);
  const path = new THREE.CatmullRomCurve3(
    [
      [7, -9], [6.4, -12.2], [0, -12.8], [-6.4, -12.2], [-7, -9], [-7.1, 0], [-7, 9],
      [-6.4, 12.2], [0, 12.8], [6.4, 12.2], [7, 9], [7.1, 0],
    ].map(([x, z]) => new THREE.Vector3(x, 0, z)),
    true,
  );

  const axolotl = buildAxolotl();
  extras.add(axolotl);

  const heron = buildHeron();
  heron.position.set(hx, BED + stakeH + 0.05, -hz);
  extras.add(heron);
  sway.push({ obj: heron, k: 22, c: 2.5, gain: 0.4, max: 0.2 });

  /* ── Neighbouring chinampas & mountains ───────────────────── */
  const neighbors = buildNeighbors(r);
  root.add(neighbors);
  const mountains = mountainRing({
    radius: 150,
    count: 30,
    minH: 10,
    maxH: 22,
    seed: 3,
    colors: ['#9fb0ad', '#a9b6b0', '#93a6a4'],
  });
  root.add(mountains);

  // Popocatépetl and Iztaccíhuatl on the south-east horizon.
  const volcanoes = new THREE.Group();
  const popo = mesh(jitter(peakGeometry(58, 62, 8, 3), 4, 4, { keepBottom: true }), mat('#8a9a9a'), { cast: false, receive: false });
  popo.position.set(150, 30, 165);
  const popoSnow = mesh(new THREE.ConeGeometry(19, 20, 8), mat('#f4f1ea'), { cast: false, receive: false });
  popoSnow.position.set(150, 52, 165);
  const izta = mesh(jitter(peakGeometry(55, 44, 7, 3), 4, 6, { keepBottom: true }), mat('#94a3a2'), { cast: false, receive: false });
  izta.scale.set(1.9, 1, 0.8);
  izta.position.set(60, 21, 195);
  const iztaSnow = mesh(new THREE.ConeGeometry(36, 12, 7), mat('#f4f1ea'), { cast: false, receive: false });
  iztaSnow.scale.set(1.9, 1, 0.6);
  iztaSnow.position.set(60, 38, 195);
  volcanoes.add(popo, popoSnow, izta, iztaSnow);
  tag(volcanoes, 'volcanoes');
  root.add(volcanoes);

  /* ── Lake life: tule, water lilies, fish, acocil, ducks ───── */
  const nature = buildLakeLife(r, sway);
  extras.add(nature.group);

  return {
    root,
    layerGroups,
    sway,
    water,
    axoOnly,
    detailOnly: [bed, water, extras, neighbors, mountains, volcanoes],
    canoe: { ...canoe, path, u: 0 },
    axolotl,
    nature,
  };
}

function buildLakeLife(r, sway) {
  const group = new THREE.Group();

  // Tule clumps along the canal edges (clear of the canoe route).
  const tuleSpots = [
    [11.4, -5], [11.4, 4.5], [-11.4, -3], [-11.4, 6.5], [5, 16.6], [-4.5, -16.6], [-11.2, -14], [11.2, 15],
  ];
  const stemGeo = new THREE.ConeGeometry(0.05, 1, 4).translate(0, 0.5, 0);
  const headGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.35, 5);
  for (const [x, z] of tuleSpots) {
    const clump = new THREE.Group();
    clump.position.set(x, 0, z);
    for (let k = 0; k < 14; k++) {
      const h = 1.2 + r() * 1.3;
      const stem = mesh(stemGeo, mat(['#6f8f3e', '#7f9a46', '#8a8a48', '#5f7f37'][k % 4]));
      stem.scale.set(1, h, 1);
      stem.position.set((r() - 0.5) * 1.4, -0.3, (r() - 0.5) * 1.4);
      stem.rotation.set((r() - 0.5) * 0.25, 0, (r() - 0.5) * 0.25);
      clump.add(stem);
      if (k % 4 === 0) {
        const hd = mesh(headGeo, mat('#6b4a2e'));
        hd.position.set(stem.position.x, -0.3 + h * 0.85, stem.position.z);
        clump.add(hd);
      }
    }
    tag(clump, 'tule');
    touchesWater(clump);
    group.add(clump);
    sway.push({ obj: clump, k: 14, c: 1.8, gain: 0.9, max: 0.22 });
  }

  // Water lilies: floating pads and a few flowers.
  const lilies = [];
  const padGeo = new THREE.CylinderGeometry(1, 1, 0.05, 9);
  const flowerGeo = new THREE.ConeGeometry(0.16, 0.22, 6).rotateX(Math.PI);
  for (const [cx, cz] of [[9.8, -2.5], [-9.6, 9.5], [2.5, 17.6], [-8.8, -17.5], [9.5, 18.5]]) {
    const cluster = new THREE.Group();
    cluster.position.set(cx, 0.05, cz);
    for (let k = 0; k < 7; k++) {
      const pad = mesh(padGeo, mat(k % 2 ? '#4f8a3a' : '#5c9a43'), { cast: false });
      const s = 0.3 + r() * 0.22;
      pad.scale.set(s, 1, s);
      pad.position.set((r() - 0.5) * 2.4, 0, (r() - 0.5) * 2.4);
      cluster.add(pad);
      if (k % 3 === 0) {
        const fl = mesh(flowerGeo, mat(k % 2 ? '#f4c6d7' : '#fbf6ee'));
        fl.position.set(pad.position.x, 0.14, pad.position.z);
        cluster.add(fl);
      }
    }
    tag(cluster, 'lily');
    touchesWater(cluster);
    group.add(cluster);
    lilies.push(cluster);
  }

  // A small school of white fish swimming in the east canal.
  const fish = new THREE.Group();
  for (let k = 0; k < 5; k++) {
    const f = new THREE.Group();
    const body = mesh(new THREE.ConeGeometry(0.09, 0.42, 5), mat('#d9e2e0'));
    body.rotation.z = -Math.PI / 2;
    const tail = mesh(new THREE.ConeGeometry(0.08, 0.15, 3), mat('#b9c7c5'));
    tail.rotation.z = Math.PI / 2;
    tail.position.x = -0.26;
    f.add(body, tail);
    f.position.set((r() - 0.5) * 0.8, (r() - 0.5) * 0.3, (r() - 0.5) * 1.2);
    f.scale.setScalar(1.6);
    fish.add(f);
  }
  tag(fish, 'fish');
  group.add(fish);

  // Acocil (crayfish) on the shallow bed beside the chinampa.
  const acocil = new THREE.Group();
  for (let k = 0; k < 6; k++) {
    const a = new THREE.Group();
    const body = mesh(new THREE.CapsuleGeometry(0.06, 0.22, 2, 5), mat('#b5603a'));
    body.rotation.z = Math.PI / 2;
    const claw = mesh(new THREE.ConeGeometry(0.04, 0.16, 3), mat('#c8703f'));
    claw.rotation.z = -Math.PI / 2;
    claw.position.x = 0.22;
    a.add(body, claw);
    a.position.set(-4.75 - r() * 0.5, -1.0, -6 + k * 2.2);
    a.rotation.y = r() * 6;
    a.scale.setScalar(1.8);
    acocil.add(a);
  }
  tag(acocil, 'acocil');
  group.add(acocil);

  // Ducks paddling in the north-east canal.
  const ducks = [];
  for (let k = 0; k < 3; k++) {
    const d = new THREE.Group();
    const body = ico(0.28, '#7a5a3c', 0, k, 0.04);
    body.scale.set(1.5, 0.75, 1);
    body.position.y = 0.12;
    const head = ico(0.15, k === 1 ? '#7a5a3c' : '#2f6b45', 0, k + 5);
    head.position.set(0.36, 0.38, 0);
    const bill = cone(0.06, 0.18, '#d99a2b', 4);
    bill.rotation.z = -Math.PI / 2;
    bill.position.set(0.55, 0.36, 0);
    const tail = cone(0.1, 0.2, '#5a3f2b', 4);
    tail.rotation.z = Math.PI / 2 + 0.5;
    tail.position.set(-0.45, 0.22, 0);
    d.add(body, head, bill, tail);
    d.userData.phase = k * 2.1;
    tag(d, 'duck');
    touchesWater(d);
    group.add(d);
    ducks.push(d);
  }

  return { group, lilies, fish, ducks };
}

function ahuejote(r, colors) {
  const g = new THREE.Group();
  const h = 5.5 + r() * 2;
  const trunk = cyl(0.09, 0.16, h * 0.4, '#6b5a43', 5);
  trunk.position.y = h * 0.2;
  g.add(trunk);
  const parts = 3;
  for (let i = 0; i < parts; i++) {
    const rad = 0.75 - i * 0.12;
    const c = ico(rad, colors[(i + Math.floor(r() * 4)) % colors.length], 0, Math.floor(r() * 1000), rad * 0.3);
    c.scale.set(0.8, 2.1, 0.8);
    c.position.y = h * 0.38 + i * (h * 0.22);
    g.add(c);
  }
  return g;
}

function buildCanoe(r) {
  const group = new THREE.Group();
  const hullGeo = new THREE.BoxGeometry(1.0, 0.42, 4.2, 2, 1, 8);
  const p = hullGeo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const z = p.getZ(i) / 2.1;
    const taper = 1 - Math.pow(Math.abs(z), 2.2) * 0.85;
    p.setX(i, p.getX(i) * taper);
    if (p.getY(i) < 0) p.setY(i, p.getY(i) + Math.pow(Math.abs(z), 3) * 0.25);
  }
  hullGeo.computeVertexNormals();
  const hull = mesh(hullGeo, mat('#8a5a32'));
  hull.position.y = 0.1;
  const inner = box(0.7, 0.1, 3.0, '#5e3a1f');
  inner.position.y = 0.26;
  const cargo = new THREE.Group();
  for (let k = 0; k < 7; k++) {
    const f = ico(0.16, k % 2 ? '#e8508a' : '#f39a1c', 0, k, 0.06);
    f.position.set((r() - 0.5) * 0.4, 0.42, -1.1 + k * 0.22);
    cargo.add(f);
  }
  for (let k = 0; k < 4; k++) {
    const e = cyl(0.07, 0.06, 0.38, '#e8c84a', 6);
    e.rotation.x = Math.PI / 2;
    e.position.set(-0.15 + (k % 2) * 0.3, 0.4, 0.45 + Math.floor(k / 2) * 0.18);
    cargo.add(e);
  }
  const boat = new THREE.Group();
  boat.add(hull, inner, cargo);
  tag(boat, 'canoe');
  touchesWater(hull);

  const person = new THREE.Group();
  const body = cone(0.3, 1.05, '#f2ece0', 6);
  body.position.y = 0.85;
  const head = ico(0.17, '#8a5a3c', 1);
  head.position.y = 1.5;
  const hat = cone(0.42, 0.22, '#d9b866', 8);
  hat.position.y = 1.66;
  const pole = cyl(0.025, 0.025, 3.6, '#7a5a38', 4);
  pole.position.set(0.35, 0.7, 0.4);
  pole.rotation.set(0.45, 0, -0.18);
  person.add(body, head, hat, pole);
  person.position.z = 1.5;
  tag(person, 'farmer');

  group.add(boat, person);
  return { group, person };
}

function buildAxolotl() {
  const g = new THREE.Group();
  const pink = '#f2a7b5';
  const body = mesh(new THREE.CapsuleGeometry(0.1, 0.4, 2, 6), mat(pink));
  body.rotation.z = Math.PI / 2;
  const head = ico(0.14, pink, 0);
  head.scale.set(1.1, 0.8, 1.2);
  head.position.x = 0.3;
  g.add(body, head);
  for (const s of [-1, 1])
    for (let k = 0; k < 3; k++) {
      const gill = cone(0.03, 0.18, '#d9607a', 4);
      gill.position.set(0.24 - k * 0.04, 0.06 + k * 0.03, s * 0.13);
      gill.rotation.set(s * 1.0, 0, 0.6 - k * 0.3);
      g.add(gill);
    }
  const tail = box(0.35, 0.12, 0.02, '#eb9aaa');
  tail.position.x = -0.38;
  g.add(tail);
  for (const s of [-1, 1])
    for (const x of [0.15, -0.15]) {
      const leg = box(0.04, 0.03, 0.12, pink);
      leg.position.set(x, -0.06, s * 0.12);
      g.add(leg);
    }
  g.scale.setScalar(1.8);
  touchesWater(body);
  tag(g, 'axolotl');
  return g;
}

function buildHeron() {
  const g = new THREE.Group();
  const white = '#f6f4ee';
  const body = ico(0.22, white, 0, 2, 0.05);
  body.scale.set(0.8, 0.8, 1.4);
  body.position.y = 0.55;
  const neck = cyl(0.04, 0.06, 0.45, white, 5);
  neck.position.set(0, 0.85, 0.2);
  neck.rotation.x = 0.4;
  const head = ico(0.08, white, 0);
  head.position.set(0, 1.07, 0.3);
  const beak = cone(0.025, 0.22, '#e3b52b', 4);
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, 1.06, 0.45);
  g.add(body, neck, head, beak);
  for (const s of [-1, 1]) {
    const leg = cyl(0.015, 0.015, 0.4, '#2a2a2a', 3);
    leg.position.set(s * 0.06, 0.2, 0);
    g.add(leg);
  }
  tag(g, 'heron');
  return g;
}

function buildNeighbors(r) {
  const g = new THREE.Group();
  const spots = NEIGHBOR_SPOTS;
  const trunkGeo = new THREE.CylinderGeometry(0.1, 0.15, 2.4, 5);
  const crownGeo = jitter(new THREE.IcosahedronGeometry(0.7, 0), 0.2, 3);
  const perPlot = 14;
  const trunks = new THREE.InstancedMesh(trunkGeo, mat('#6b5a43'), spots.length * perPlot);
  const crowns = new THREE.InstancedMesh(crownGeo, mat('#5f8f3e'), spots.length * perPlot);
  const d = new THREE.Object3D();
  let n = 0;
  spots.forEach(([x, z], si) => {
    const body = box(W, TOP - BED, L, '#4e382a');
    body.position.set(x, (TOP + BED) / 2, z);
    const top = box(W - 0.2, 0.12, L - 0.2, '#5a7d38');
    top.position.set(x, TOP + 0.06, z);
    g.add(touchesWater(body), top);
    for (let k = 0; k < 4; k++) {
      const row = box(0.6, 0.5 + r() * 0.6, L - 4, ['#86ad4c', '#9cbf55', '#e09a2c', '#6f9a3a'][(k + si) % 4]);
      row.position.set(x - 2.2 + k * 1.45, TOP + 0.3, z);
      g.add(row);
    }
    for (let k = 0; k < perPlot; k++) {
      const side = k % 2 ? 1 : -1;
      const tz = z - L / 2 + 1 + Math.floor(k / 2) * 2.6;
      const s = 0.7 + r() * 0.3;
      d.position.set(x + side * (W / 2 - 0.35), TOP + 1.2 * s, tz);
      d.scale.set(s, s, s);
      d.rotation.set(0, 0, 0);
      d.updateMatrix();
      trunks.setMatrixAt(n, d.matrix);
      d.position.y = TOP + 4.2 * s;
      d.scale.set(0.9 * s, 3.4 * s, 0.9 * s);
      d.updateMatrix();
      crowns.setMatrixAt(n, d.matrix);
      n++;
    }
  });
  trunks.castShadow = crowns.castShadow = true;
  g.add(trunks, crowns);
  tag(g, 'neighbor');
  return g;
}
