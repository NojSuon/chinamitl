import * as THREE from 'three';
import { rng, mat, mesh, box, cyl, cone, ico, tag } from './lowpoly.js';

// Low-poly models of important buildings of Mexico-Tenochtitlan.
// Each builder returns a Group centred on the origin at ground level (y = 0).
// With { parts: true } sub-parts get their own element ids (Buildings view);
// otherwise the whole model is tagged with the building id (city map).

const STONE = '#e6dbc4';
const STONE_2 = '#d9ccb0';
const STUCCO = '#efe7d6';

function stairs(width, run, rise, steps, color) {
  const g = new THREE.Group();
  const sw = run / steps;
  const sh = rise / steps;
  for (let i = 0; i < steps; i++) {
    const s = box(sw, sh * (i + 1), width, color);
    s.position.set(-run / 2 + sw * (i + 0.5), (sh * (i + 1)) / 2, 0);
    g.add(s);
  }
  return g;
}

function part(group, opts, id) {
  if (opts.parts) tag(group, id);
  return group;
}

export function buildTemploMayor(opts = {}) {
  const g = new THREE.Group();
  const TIER = 2.2;
  const TIERS = 4;

  const base = new THREE.Group();
  const plat = box(26, 1, 17, STONE_2);
  plat.position.set(-3.5, 0.5, 0);
  base.add(plat);
  for (let s = 0; s < TIERS; s++) {
    const size = 13 - s * 2.1;
    const tier = box(size, TIER, size, s % 2 ? STONE : '#eadfc7');
    tier.position.set(0.6, 1 + TIER / 2 + s * TIER, 0);
    base.add(tier);
    // Slight overhang band (talud-tablero feel).
    const band = box(size + 0.25, 0.25, size + 0.25, '#cdbf9f');
    band.position.set(0.6, 1 + (s + 1) * TIER - 0.12, 0);
    base.add(band);
  }
  g.add(part(base, opts, 'tmPlatform'));
  const topY = 1 + TIERS * TIER;

  // Double staircase on the west (-x) face, with balustrades.
  const st = new THREE.Group();
  const topWest = 0.6 - (13 - (TIERS - 1) * 2.1) / 2; // west edge of the top tier
  const run = 8.6;
  const rise = topY - 1;
  const cx = topWest - run / 2;
  for (const z of [-1.75, 1.75]) {
    const s = stairs(2.9, run, rise, 16, '#d8cba9');
    s.position.set(cx, 1, z);
    st.add(s);
  }
  const ang = Math.atan2(rise, run);
  const len = Math.hypot(run, rise);
  for (const z of [-3.35, 0, 3.35]) {
    const bal = box(len + 0.3, 0.5, 0.4, '#c4b48f');
    bal.position.set(cx, 1 + rise / 2 + 0.3, z);
    bal.rotation.z = ang;
    st.add(bal);
  }
  const footX = cx - run / 2;
  g.add(part(st, opts, 'tmStairs'));

  // Twin shrines on top: Tlaloc (north, -z) and Huitzilopochtli (south, +z).
  const shrine = (main, accent, z, id) => {
    const s = new THREE.Group();
    const body = box(3.4, 2.6, 3.2, main);
    body.position.y = 1.3;
    s.add(body);
    for (let k = 0; k < 4; k++) {
      const stripe = box(0.2, 2.62, 3.22, accent);
      stripe.position.set(-1.2 + k * 0.8, 1.3, 0);
      s.add(stripe);
    }
    const door = box(0.1, 1.6, 1.2, '#2b1d1a');
    door.position.set(-1.72, 0.8, 0);
    s.add(door);
    for (let k = 0; k < 3; k++) {
      const roof = box(3.4 - k * 0.7, 0.6, 3.2 - k * 0.7, k % 2 ? accent : main);
      roof.position.y = 2.9 + k * 0.6;
      s.add(roof);
    }
    const crest = cone(0.5, 0.8, accent, 4);
    crest.position.y = 4.9;
    crest.rotation.y = Math.PI / 4;
    s.add(crest);
    s.position.set(1.4, topY, z);
    return part(s, opts, id);
  };
  g.add(shrine('#3f7fb5', '#f2f0ea', -2.2, 'tmTlaloc'));
  g.add(shrine('#b5403a', '#f2f0ea', 2.2, 'tmHuitzilopochtli'));

  // Coyolxauhqui stone at the foot of Huitzilopochtli's stairs.
  const coy = new THREE.Group();
  const disc = cyl(1.25, 1.25, 0.2, '#c9a98a', 14);
  disc.position.y = 1.1;
  const relief = cyl(0.8, 0.8, 0.06, '#b5856a', 10);
  relief.position.y = 1.22;
  coy.add(disc, relief);
  coy.position.set(footX - 2.6, 0, 1.75);
  g.add(part(coy, opts, 'tmCoyolxauhqui'));

  // Serpent heads at the base of the balustrades.
  const serp = new THREE.Group();
  for (const z of [-3.35, 0, 3.35]) {
    const hx = footX - 0.4;
    const head = box(1.1, 0.8, 0.9, '#b9ad8c');
    head.position.set(hx, 1.4, z);
    const snout = cone(0.45, 0.7, '#b9ad8c', 4);
    snout.rotation.z = Math.PI / 2;
    snout.position.set(hx - 0.8, 1.35, z);
    const eye = box(0.15, 0.18, 0.95, '#2b1d1a');
    eye.position.set(hx, 1.65, z);
    const tongue = box(0.5, 0.06, 0.18, '#b5403a');
    tongue.position.set(hx - 1.3, 1.1, z);
    serp.add(head, snout, eye, tongue);
  }
  g.add(part(serp, opts, 'tmSerpents'));

  if (!opts.parts) tag(g, opts.id || 'temploMayor');
  return g;
}

export function buildEhecatl(opts = {}) {
  const g = new THREE.Group();
  const plat = box(9, 1.6, 8, STONE);
  plat.position.y = 0.8;
  g.add(plat);
  // Stairs face east (+x), toward the Templo Mayor.
  const st = stairs(3, 2.6, 1.6, 6, '#d8cba9');
  st.rotation.y = Math.PI;
  st.position.set(5.8, 0, 0);
  g.add(st);
  const tower = cyl(2.6, 2.9, 3.6, '#e9dfca', 14);
  tower.position.set(-0.8, 1.6 + 1.8, 0);
  const band = cyl(2.65, 2.65, 0.4, '#b5403a', 14);
  band.position.set(-0.8, 1.6 + 3.2, 0);
  const door = box(0.15, 1.8, 1.1, '#2b1d1a');
  door.position.set(1.95, 1.6 + 0.9, 0);
  const roof = cone(3.1, 3.4, '#c9a456', 14);
  roof.position.set(-0.8, 1.6 + 3.6 + 1.7, 0);
  const tip = cone(0.3, 0.8, '#7a5a38', 6);
  tip.position.set(-0.8, 1.6 + 3.6 + 3.6, 0);
  g.add(tower, band, door, roof, tip);
  tag(g, opts.id || 'ehecatl');
  return g;
}

export function buildTlachtli(opts = {}) {
  const g = new THREE.Group();
  const floor = box(16, 0.3, 10, '#e9dfca');
  floor.position.y = 0.15;
  g.add(floor);
  // I-shape: long central alley with sloped side walls and wider end zones.
  for (const s of [-1, 1]) {
    const wall = box(9, 2.2, 1.6, STONE);
    wall.position.set(0, 1.1, s * 2.4);
    const slope = box(9, 0.3, 1.4, STONE_2);
    slope.position.set(0, 0.6, s * 1.5);
    slope.rotation.x = s * 0.7;
    const end = box(3.2, 1.4, 10, STONE);
    end.position.set(s * 6.4, 0.7, 0);
    g.add(wall, slope, end);
  }
  const line = box(0.12, 0.02, 3.2, '#b5403a');
  line.position.set(0, 0.31, 0);
  g.add(line);
  tag(g, opts.id || 'tlachtli');

  const rings = new THREE.Group();
  for (const s of [-1, 1]) {
    const ring = mesh(new THREE.TorusGeometry(0.5, 0.16, 6, 10), mat('#b9ad8c'));
    ring.position.set(0, 1.7, s * 1.55);
    rings.add(ring);
  }
  tag(rings, opts.parts ? 'tlachRing' : opts.id || 'tlachtli');
  g.add(rings);
  return g;
}

export function buildTzompantli(opts = {}) {
  const g = new THREE.Group();
  const r = rng(7);
  const plat = box(11, 1.2, 4.2, STONE_2);
  plat.position.y = 0.6;
  g.add(plat);
  const stepsF = stairs(2.4, 1.6, 1.2, 4, '#d8cba9');
  stepsF.rotation.y = -Math.PI / 2;
  stepsF.position.set(0, 0, -2.9);
  g.add(stepsF);
  const posts = 9;
  for (let i = 0; i < posts; i++) {
    for (const z of [-1.2, 1.2]) {
      const p = cyl(0.12, 0.14, 3.6, '#6b4a2e', 5);
      p.position.set(-4.8 + i * 1.2, 1.2 + 1.8, z);
      g.add(p);
    }
  }
  const rows = 4;
  const skullGeo = new THREE.IcosahedronGeometry(0.17, 0);
  const skulls = new THREE.InstancedMesh(skullGeo, mat('#f1ece0'), rows * (posts - 1) * 5);
  const d = new THREE.Object3D();
  let n = 0;
  for (let rw = 0; rw < rows; rw++) {
    const y = 1.2 + 0.9 + rw * 0.7;
    for (const z of [-1.2, 1.2]) {
      const pole = cyl(0.04, 0.04, 9.8, '#7a5a38', 4);
      pole.rotation.z = Math.PI / 2;
      pole.position.set(0, y, z);
      g.add(pole);
    }
    for (let i = 0; i < posts - 1; i++)
      for (let k = 0; k < 5 && n < skulls.count; k++) {
        d.position.set(-4.6 + i * 1.2 + k * 0.2, y - 0.12, (r() - 0.5) * 2.2);
        d.scale.set(1, 1.1, 1.15);
        d.updateMatrix();
        skulls.setMatrixAt(n++, d.matrix);
      }
  }
  skulls.count = n;
  skulls.castShadow = true;
  g.add(skulls);
  tag(g, opts.id || 'tzompantli');
  return g;
}

export function buildTecpan(opts = {}) {
  const g = new THREE.Group();
  const plat = box(22, 1, 16, STONE_2);
  plat.position.y = 0.5;
  g.add(plat);
  const court = box(10, 0.05, 6, '#d9ccb0');
  court.position.set(0, 1.03, 0);
  g.add(court);
  // Halls around the courtyard.
  const halls = [
    [0, -5.5, 18, 4],
    [0, 5.5, 18, 4],
    [-7.5, 0, 3, 7],
    [7.5, 0, 3, 7],
  ];
  for (const [x, z, w, dd] of halls) {
    const h = box(w, 2.6, dd, STUCCO);
    h.position.set(x, 1 + 1.3, z);
    const roof = box(w + 0.3, 0.3, dd + 0.3, '#b5403a');
    roof.position.set(x, 1 + 2.75, z);
    g.add(h, roof);
  }
  // Colonnade along the courtyard.
  for (let i = 0; i < 7; i++)
    for (const z of [-3.2, 3.2]) {
      const c = cyl(0.18, 0.2, 2.4, '#b5403a', 6);
      c.position.set(-4.5 + i * 1.5, 1 + 1.2, z);
      g.add(c);
    }
  // Garden pond and trees beside the palace.
  const pond = box(5, 0.1, 3, '#46a2b0');
  pond.position.set(0, 1.06, 0);
  g.add(pond);
  for (const [x, z] of [[-3.5, -1.5], [3.5, 1.5], [-3.8, 1.8], [3.8, -1.6]]) {
    const t = ico(0.6, '#5f8f3e', 0, x * 10 + z, 0.15);
    t.scale.set(1, 1.4, 1);
    t.position.set(x, 1.9, z);
    g.add(t);
  }
  // Wide stair on the north side toward the precinct.
  const st = stairs(6, 2, 1, 4, '#d8cba9');
  st.rotation.y = Math.PI / 2;
  st.position.set(0, 0, -9);
  g.add(st);
  tag(g, opts.id || 'tecpan');
  return g;
}

export function buildTianquiztli(opts = {}) {
  const g = new THREE.Group();
  const r = rng(11);
  const plaza = box(22, 0.4, 18, '#e3d6bb');
  plaza.position.y = 0.2;
  g.add(plaza);
  const rows = 6,
    cols = 8;
  const stallGeo = new THREE.BoxGeometry(1.5, 0.7, 1.2);
  const awnGeo = new THREE.ConeGeometry(1.15, 0.6, 4).rotateY(Math.PI / 4);
  const stalls = new THREE.InstancedMesh(stallGeo, mat('#c9a77a'), rows * cols);
  const awnMat = new THREE.MeshStandardMaterial({ color: '#ffffff', flatShading: true, roughness: 0.9 });
  const awns = new THREE.InstancedMesh(awnGeo, awnMat, rows * cols);
  const colors = ['#e09a2c', '#b5403a', '#3f7fb5', '#7a63a8', '#55803f', '#d9a93f', '#44989d'];
  const d = new THREE.Object3D();
  const c = new THREE.Color();
  let n = 0;
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) {
      d.position.set(-8.4 + i * 2.4, 0.75, -6.2 + j * 2.5);
      d.rotation.set(0, 0, 0);
      d.scale.set(1, 1, 1);
      d.updateMatrix();
      stalls.setMatrixAt(n, d.matrix);
      d.position.y = 1.4;
      d.scale.set(1, 1, 0.85);
      d.updateMatrix();
      awns.setMatrixAt(n, d.matrix);
      awns.setColorAt(n, c.set(colors[Math.floor(r() * colors.length)]));
      n++;
    }
  stalls.castShadow = awns.castShadow = true;
  g.add(stalls, awns);
  // Goods: piles of maize, chilies, squash.
  for (let k = 0; k < 40; k++) {
    const pile = ico(0.22, ['#e8c84a', '#c8302a', '#e08a2b', '#55803f'][k % 4], 0, k);
    pile.position.set(-9 + r() * 18, 0.55, -7.5 + r() * 15);
    g.add(pile);
  }
  // Canoe landing on one side.
  const dock = box(22, 0.3, 1.2, '#8a6a44');
  dock.position.set(0, 0.3, 9.6);
  g.add(dock);
  tag(g, opts.id || 'tianquiztli');
  return g;
}

export const BUILDERS = {
  temploMayor: buildTemploMayor,
  ehecatl: buildEhecatl,
  tlachtli: buildTlachtli,
  tzompantli: buildTzompantli,
  tecpan: buildTecpan,
  tianquiztli: buildTianquiztli,
};
