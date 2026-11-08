import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { makeWaterMaterial } from './water.js';

// Deterministic random so the scene looks the same on every load.
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const matCache = new Map();
export function mat(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!matCache.has(key)) {
    matCache.set(
      key,
      new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.92, metalness: 0, ...opts }),
    );
  }
  return matCache.get(key);
}

// Jitters vertices while keeping faces welded, for the faceted low-poly look.
export function jitter(geo, amount, seed = 7, { keepBottom = false } = {}) {
  geo.deleteAttribute('normal');
  geo.deleteAttribute('uv');
  const g = mergeVertices(geo, 1e-4);
  const p = g.attributes.position;
  let minY = Infinity;
  for (let i = 0; i < p.count; i++) minY = Math.min(minY, p.getY(i));
  // The offset depends on where a vertex is (rounded), not on its index, so vertices that sit
  // at (almost) the same spot — seams, a peak's tiny top ring — move together and stay welded.
  const q = Math.max(amount * 0.05, 0.01);
  const rand = (x, y, z, k) => {
    const s = Math.sin(Math.round(x / q) * 12.9898 + Math.round(y / q) * 78.233 + Math.round(z / q) * 37.719 + seed * 4.13 + k * 19.19) * 43758.5453;
    return s - Math.floor(s);
  };
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i),
      y = p.getY(i),
      z = p.getZ(i);
    const bottom = keepBottom && Math.abs(y - minY) < 1e-3;
    p.setXYZ(
      i,
      x + (rand(x, y, z, 1) - 0.5) * amount,
      y + (bottom ? 0 : (rand(x, y, z, 2) - 0.5) * amount),
      z + (rand(x, y, z, 3) - 0.5) * amount,
    );
  }
  g.computeVertexNormals();
  return g;
}

export function mesh(geo, material, { cast = true, receive = true } = {}) {
  const m = new THREE.Mesh(geo, material);
  m.castShadow = cast;
  m.receiveShadow = receive;
  return m;
}

export const box = (w, h, d, color, o) => mesh(new THREE.BoxGeometry(w, h, d), mat(color), o);
export const cyl = (rt, rb, h, color, seg = 6, o) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color), o);
export const cone = (r, h, color, seg = 6, o) => mesh(new THREE.ConeGeometry(r, h, seg), mat(color), o);
export const ico = (r, color, detail = 0, seed = 3, amt = 0, o) => {
  let g = new THREE.IcosahedronGeometry(r, detail);
  if (amt) g = jitter(g, amt, seed);
  return mesh(g, mat(color), o);
};

// Mountain/volcano cone with several height rings. three.js r169's ConeGeometry drops half the
// triangles of every ring below the tip when heightSegments > 1 (holes in mountains), so we
// build it as a cylinder with a near-zero top radius, which generates every face.
export function peakGeometry(radius, height, radialSegments = 6, heightSegments = 2) {
  return new THREE.CylinderGeometry(0.001, radius, height, radialSegments, heightSegments);
}

// Tag every mesh under an object with the element id used for picking.
export function tag(obj, id) {
  obj.traverse((o) => {
    if (o.isMesh) o.userData.id = id;
  });
  obj.userData.id = id;
  return obj;
}

// Distant low-poly mountain ring (the hazy ridges of the Basin of Mexico).
export function mountainRing({ radius, count, minH, maxH, seed = 11, colors = ['#8d9a8a', '#7c8b84', '#9aa49a'] }) {
  const g = new THREE.Group();
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + r() * 0.1;
    const h = minH + r() * (maxH - minH);
    const rad = h * (1.1 + r() * 0.8);
    const geo = jitter(peakGeometry(rad, h, 6, 2), rad * 0.15, i + seed, { keepBottom: true });
    const m = mesh(geo, mat(colors[i % colors.length]), { cast: false, receive: false });
    const rr = radius * (0.92 + r() * 0.2);
    m.position.set(Math.cos(a) * rr, h / 2 - 1, Math.sin(a) * rr);
    m.rotation.y = r() * Math.PI;
    g.add(m);
  }
  return g;
}

// Low-poly animated water surface with the stylised depth/foam shader.
// Stores base positions for the wave/slosh update.
export function waterSurface(size, segs, waterOptions) {
  const geo = new THREE.PlaneGeometry(size, size, segs, segs);
  geo.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(geo, makeWaterMaterial(waterOptions));
  m.receiveShadow = true;
  m.userData.base = Float32Array.from(geo.attributes.position.array);
  return m;
}
