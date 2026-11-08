import * as THREE from 'three';
import { rng, mat, mesh, box, cyl, cone, ico, jitter, tag, mountainRing, waterSurface } from './lowpoly.js';
import { LAYERS } from './data.js';

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
  const bedGeo = jitter(new THREE.PlaneGeometry(150, 150, 40, 40).rotateX(-Math.PI / 2), 0.35, 5);
  const bed = mesh(bedGeo, mat('#3c4637'), { cast: false });
  bed.position.y = BED - 0.05;
  layerGroups.bed.add(bed);

  const water = waterSurface(150, 75, '#3b9fae', 0.74);
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
    layerGroups[b.key].add(m);

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
  layerGroups.frame.add(stakes);

  const wattle = new THREE.Group();
  const bandYs = [-2.0, -1.45, -0.9, -0.35, 0.2, 0.7];
  bandYs.forEach((y, i) => {
    const off = i % 2 ? 0.06 : -0.02;
    const color = i % 2 ? '#b89a5c' : '#a3874f';
    const a = box(0.07, 0.16, L + 0.3, color);
    a.position.set(-hx - off, y, 0);
    const b = a.clone();
    b.position.x = hx + off;
    const c = box(W + 0.3, 0.16, 0.07, color);
    c.position.set(0, y, -hz - off);
    const d = c.clone();
    d.position.z = hz + off;
    wattle.add(a, b, c, d);
  });
  tag(wattle, 'wattle');
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
  const roofGeo = jitter(new THREE.ConeGeometry(2.0, 1.7, 4, 2).rotateY(Math.PI / 4), 0.08, 9);
  const roof = mesh(roofGeo, mat('#d4b25e'));
  roof.scale.set(1.35, 1, 0.98);
  roof.position.y = 1.7 + 0.8;
  hut.add(roof);
  const ridge = cone(0.15, 0.4, '#b8954a', 4);
  ridge.position.y = 3.6;
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

  return {
    root,
    layerGroups,
    sway,
    water,
    axoOnly,
    detailOnly: [bed, water, extras, neighbors, mountains],
    canoe: { ...canoe, path, u: 0 },
    axolotl,
  };
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
  const spots = [
    [-16, 0], [16, 0], [0, -26], [0, 26], [-16, -26], [16, -26], [-16, 26], [16, 26],
  ];
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
    g.add(body, top);
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
