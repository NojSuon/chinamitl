import * as THREE from 'three';
import { rng, mat, mesh, box, cyl, cone, jitter, tag, mountainRing, waterSurface } from './lowpoly.js';

// Island ellipse (scene units ≈ 10 m).
export const ISLAND = { rx: 78, rz: 68 };
export const FOCUS_CELL = { x: 32, z: 24 };

export function insideIsland(x, z, pad = 0) {
  return (x / (ISLAND.rx + pad)) ** 2 + (z / (ISLAND.rz + pad)) ** 2 < 1;
}

export function buildCity() {
  const root = new THREE.Group();
  const r = rng(2024);

  /* ── Water, lake bed, shore, mountains ─────────────────────── */
  const bed = mesh(new THREE.PlaneGeometry(900, 900).rotateX(-Math.PI / 2), mat('#2c5a5e'), { cast: false });
  bed.position.y = -3;
  root.add(bed);
  const water = waterSurface(900, 70, '#46a2b0', 0.86);
  tag(water, 'cityWater');
  root.add(water);

  const shoreGeo = jitter(new THREE.RingGeometry(250, 520, 48, 3).rotateX(-Math.PI / 2), 6, 8);
  const shore = mesh(shoreGeo, mat('#a8a070'), { cast: false });
  shore.position.y = 0.6;
  tag(shore, 'lake');
  root.add(shore);
  root.add(mountainRing({ radius: 470, count: 34, minH: 25, maxH: 60, seed: 9, colors: ['#9fb0ad', '#a9b6b0', '#93a6a4'] }));

  // Popocatépetl & Iztaccíhuatl on the south-east horizon.
  const volc = new THREE.Group();
  const popo = mesh(jitter(new THREE.ConeGeometry(95, 150, 8, 3), 8, 4, { keepBottom: true }), mat('#7d8a87'), { cast: false });
  popo.position.set(330, 74, 360);
  const snow = mesh(new THREE.ConeGeometry(30, 46, 8), mat('#f4f1ea'), { cast: false });
  snow.position.set(330, 128, 360);
  const izta = mesh(jitter(new THREE.ConeGeometry(110, 115, 7, 3), 8, 6, { keepBottom: true }), mat('#86918c'), { cast: false });
  izta.scale.set(1.8, 1, 0.8);
  izta.position.set(190, 56, 410);
  const snow2 = mesh(new THREE.ConeGeometry(70, 30, 7), mat('#f4f1ea'), { cast: false });
  snow2.scale.set(1.8, 1, 0.6);
  snow2.position.set(190, 100, 410);
  volc.add(popo, snow, izta, snow2);
  root.add(volc);

  /* ── Chinampa grid ─────────────────────────────────────────── */
  const CELL = 8;
  const cells = [];
  for (let cx = -76; cx <= 76; cx += CELL)
    for (let cz = -68; cz <= 68; cz += CELL) {
      const wob = Math.sin(cx * 0.08) * 4 + Math.cos(cz * 0.07) * 4;
      if (!insideIsland(cx, cz, wob - 4)) continue;
      if (Math.abs(cx) < 18 && Math.abs(cz) < 18) continue; // ceremonial precinct
      cells.push([cx, cz]);
    }

  const strips = [];
  const houses = [];
  let focus = null;
  const [fx, fz] = cells.reduce((best, c) =>
    Math.hypot(c[0] - FOCUS_CELL.x, c[1] - FOCUS_CELL.z) < Math.hypot(best[0] - FOCUS_CELL.x, best[1] - FOCUS_CELL.z) ? c : best,
  );
  for (const [cx, cz] of cells) {
    for (let k = 0; k < 4; k++) {
      const x = cx - 3 + k * 2;
      const s = { x, z: cz + 1.2, len: 5.2 + (r() - 0.5) * 0.6 };
      if (cx === fx && cz === fz && k === 1) focus = s;
      else strips.push(s);
      houses.push({ x, z: cz - 2.0 });
    }
  }

  const stripMat = new THREE.MeshStandardMaterial({ color: '#ffffff', flatShading: true, roughness: 0.95 });
  const stripMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1.5, 0.7, 1), stripMat, strips.length);
  const palette = ['#6f9a3a', '#86ad4c', '#5a8a36', '#9cbf55', '#b8b24a', '#e09a2c', '#7aa04a', '#c4583f'];
  const d = new THREE.Object3D();
  const col = new THREE.Color();
  strips.forEach((s, i) => {
    d.position.set(s.x, 0.1, s.z);
    d.scale.set(1, 1, s.len);
    d.rotation.set(0, 0, 0);
    d.updateMatrix();
    stripMesh.setMatrixAt(i, d.matrix);
    stripMesh.setColorAt(i, col.set(palette[Math.floor(r() * palette.length)]));
  });
  stripMesh.castShadow = stripMesh.receiveShadow = true;
  tag(stripMesh, 'cityChinampa');
  root.add(stripMesh);

  // Ahuejotes along the strips.
  const treeCount = strips.length;
  const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.08, 0.12, 1.4, 4), mat('#6b5a43'), treeCount);
  const crowns = new THREE.InstancedMesh(jitter(new THREE.IcosahedronGeometry(0.5, 0), 0.15, 2), mat('#5a8a3a'), treeCount);
  strips.forEach((s, i) => {
    const tz = s.z + (r() - 0.5) * s.len * 0.8;
    const tx = s.x + 0.8;
    const sc = 0.8 + r() * 0.5;
    d.scale.set(sc, sc, sc);
    d.position.set(tx, 0.45 + 0.7 * sc, tz);
    d.updateMatrix();
    trunks.setMatrixAt(i, d.matrix);
    d.position.y = 0.45 + 2.3 * sc;
    d.scale.set(0.8 * sc, 2.4 * sc, 0.8 * sc);
    d.updateMatrix();
    crowns.setMatrixAt(i, d.matrix);
  });
  trunks.castShadow = crowns.castShadow = true;
  tag(trunks, 'cityChinampa');
  tag(crowns, 'cityChinampa');
  root.add(trunks, crowns);

  // Houses (one per plot, facing the canal).
  const hb = new THREE.InstancedMesh(new THREE.BoxGeometry(1.7, 0.6, 1.2), mat('#cdbb94'), houses.length);
  const hw = new THREE.InstancedMesh(new THREE.BoxGeometry(1.1, 0.8, 0.8), mat('#efe6d2'), houses.length);
  const hr = new THREE.InstancedMesh(new THREE.ConeGeometry(0.85, 0.6, 4).rotateY(Math.PI / 4), mat('#c9a456'), houses.length);
  houses.forEach((h, i) => {
    d.rotation.set(0, 0, 0);
    d.scale.set(1, 1, 1);
    d.position.set(h.x, 0.15, h.z);
    d.updateMatrix();
    hb.setMatrixAt(i, d.matrix);
    d.position.y = 0.85;
    d.updateMatrix();
    hw.setMatrixAt(i, d.matrix);
    d.position.y = 1.55;
    d.scale.set(1, 1, 0.75);
    d.updateMatrix();
    hr.setMatrixAt(i, d.matrix);
  });
  for (const m of [hb, hw, hr]) {
    m.castShadow = m.receiveShadow = true;
    tag(m, 'calpolli');
    root.add(m);
  }

  // Small calpolli temples scattered through the wards.
  for (let k = 0; k < 10; k++) {
    const [cx, cz] = cells[Math.floor(r() * cells.length)];
    const t = new THREE.Group();
    for (let s = 0; s < 3; s++) {
      const tier = box(3.6 - s * 1.0, 0.8, 3.6 - s * 1.0, '#ddd2b8');
      tier.position.y = 0.5 + s * 0.8;
      t.add(tier);
    }
    const shrine = box(0.9, 0.9, 0.9, '#b5503a');
    shrine.position.y = 3.0;
    t.add(shrine);
    t.position.set(cx + 1, 0, cz - 1);
    tag(t, 'calpolli');
    root.add(t);
  }

  /* ── Your chinampa: highlighted strip + marker ─────────────── */
  const fGroup = new THREE.Group();
  const fStrip = box(1.5, 0.75, focus.len, '#a898c9');
  fStrip.position.set(focus.x, 0.12, focus.z);
  const pin = new THREE.Group();
  const gem = mesh(new THREE.OctahedronGeometry(2.4, 0), mat('#7a63a8', { emissive: '#4a2f5b', emissiveIntensity: 0.7 }));
  gem.scale.y = 1.4;
  const stem = cyl(0.12, 0.12, 9, '#7a63a8', 4);
  stem.position.y = -6;
  pin.add(gem, stem);
  pin.position.set(focus.x, 13, focus.z);
  fGroup.add(fStrip, pin);
  tag(fGroup, 'focusMarker');
  root.add(fGroup);

  /* ── Ceremonial precinct & Templo Mayor ────────────────────── */
  const precinct = new THREE.Group();
  const plaza = box(34, 0.8, 34, '#e8e0cc');
  plaza.position.y = 0.2;
  precinct.add(plaza);
  for (const [w, dd, x, z] of [[34, 0.6, 0, -17], [34, 0.6, 0, 17], [0.6, 34, -17, 0], [0.6, 34, 17, 0]]) {
    const wall = box(w, 1.6, dd, '#d8ccb0');
    wall.position.set(x, 1.2, z);
    precinct.add(wall);
  }
  const tm = new THREE.Group();
  for (let s = 0; s < 4; s++) {
    const size = 13 - s * 2.4;
    const tier = box(size, 2.2, size, s % 2 ? '#e2d7bd' : '#eadfc6');
    tier.position.y = 1.7 + s * 2.2;
    tm.add(tier);
  }
  for (const zz of [-1.7, 1.7]) {
    const stair = box(5, 0.4, 2.2, '#cfc2a3');
    stair.position.set(-6.2, 5.0, zz);
    stair.rotation.z = -0.95;
    stair.scale.x = 2.2;
    tm.add(stair);
  }
  const tlaloc = box(2.6, 2.4, 2.4, '#3f7fb5');
  tlaloc.position.set(0.5, 11.6, -1.7);
  const huitz = box(2.6, 2.4, 2.4, '#b5403a');
  huitz.position.set(0.5, 11.6, 1.7);
  const tr1 = cone(1.9, 1.6, '#2e5f8a', 4);
  tr1.rotation.y = Math.PI / 4;
  tr1.position.set(0.5, 13.6, -1.7);
  const tr2 = cone(1.9, 1.6, '#8a2e2a', 4);
  tr2.rotation.y = Math.PI / 4;
  tr2.position.set(0.5, 13.6, 1.7);
  tm.add(tlaloc, huitz, tr1, tr2);
  tm.position.set(4, 0, -2);
  precinct.add(tm);
  // Round temple of Ehecatl and smaller shrines.
  const eh = cyl(2.2, 2.6, 3, '#e6dcc4', 10);
  eh.position.set(-8, 2, -2);
  const ehRoof = cone(2.4, 2.4, '#c9a456', 10);
  ehRoof.position.set(-8, 4.7, -2);
  precinct.add(eh, ehRoof);
  for (const [x, z] of [[-9, 9], [-9, -11], [10, 11]]) {
    const p = box(4, 2.5, 4, '#e2d7bd');
    p.position.set(x, 1.6, z);
    const sh = box(1.4, 1.2, 1.4, '#b5503a');
    sh.position.set(x, 3.4, z);
    precinct.add(p, sh);
  }
  tag(precinct, 'temploMayor');
  root.add(precinct);

  /* ── Causeways, aqueduct, dike ─────────────────────────────── */
  const causeways = new THREE.Group();
  const routes = [
    [[0, -62], [0, -150], [-12, -260]], // Tepeyac (north)
    [[-74, 0], [-150, -6], [-262, -12]], // Tlacopan (west)
    [[4, 64], [6, 150], [12, 262]], // Iztapalapa (south)
    [[6, 150], [-60, 230], [-80, 262]], // branch to Coyoacán
  ];
  for (const route of routes) addPath(causeways, route, 3, 0.9, '#b9a983');
  tag(causeways, 'causeway');
  root.add(causeways);

  const aqueduct = new THREE.Group();
  addPath(aqueduct, [[-262, -46], [-160, -16], [-80, -6]], 1.2, 4.8, '#a89676');
  addPath(aqueduct, [[-262, -46], [-160, -16], [-80, -6]], 0.5, 0.3, '#58b3c4', 4.6);
  const chapul = mesh(jitter(new THREE.ConeGeometry(26, 22, 7, 2), 3, 12, { keepBottom: true }), mat('#6f8a4a'));
  chapul.position.set(-275, 10, -52);
  aqueduct.add(chapul);
  tag(aqueduct, 'aqueduct');
  root.add(aqueduct);

  const dike = new THREE.Group();
  addPath(dike, [[128, -262], [104, -90], [108, 80], [140, 262]], 1.8, 1.8, '#7d6d58');
  tag(dike, 'albarradon');
  root.add(dike);

  // A few canoes in the main canals and on the lake.
  const canoes = new THREE.Group();
  const canoeGeo = new THREE.BoxGeometry(0.6, 0.3, 2.6);
  for (let k = 0; k < 40; k++) {
    const c = mesh(canoeGeo, mat('#8a5a32'));
    const a = r() * Math.PI * 2;
    const rad = 85 + r() * 80;
    c.position.set(Math.cos(a) * rad, 0.15, Math.sin(a) * rad * 0.9);
    c.rotation.y = r() * Math.PI;
    c.userData.phase = r() * 6;
    canoes.add(c);
  }
  tag(canoes, 'lake');
  root.add(canoes);

  return { root, water, pin, canoes };
}

function addPath(group, pts, width, height, color, raise = 0) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, z0] = pts[i];
    const [x1, z1] = pts[i + 1];
    const len = Math.hypot(x1 - x0, z1 - z0);
    const seg = box(width, height, len + width, color);
    seg.position.set((x0 + x1) / 2, height / 2 - 0.3 + raise, (z0 + z1) / 2);
    seg.rotation.y = Math.atan2(x1 - x0, z1 - z0);
    group.add(seg);
  }
}
