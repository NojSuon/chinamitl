import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

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
  const r = rng(seed);
  const p = g.attributes.position;
  let minY = Infinity;
  for (let i = 0; i < p.count; i++) minY = Math.min(minY, p.getY(i));
  for (let i = 0; i < p.count; i++) {
    const bottom = keepBottom && Math.abs(p.getY(i) - minY) < 1e-3;
    p.setXYZ(
      i,
      p.getX(i) + (r() - 0.5) * amount,
      p.getY(i) + (bottom ? 0 : (r() - 0.5) * amount),
      p.getZ(i) + (r() - 0.5) * amount,
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
    const geo = jitter(new THREE.ConeGeometry(rad, h, 6, 2), rad * 0.15, i + seed, { keepBottom: true });
    const m = mesh(geo, mat(colors[i % colors.length]), { cast: false, receive: false });
    const rr = radius * (0.92 + r() * 0.2);
    m.position.set(Math.cos(a) * rr, h / 2 - 1, Math.sin(a) * rr);
    m.rotation.y = r() * Math.PI;
    g.add(m);
  }
  return g;
}

// Low-poly animated water surface. Stores base positions for the wave/slosh update.
export function waterSurface(size, segs, color, opacity = 0.78) {
  const geo = new THREE.PlaneGeometry(size, size, segs, segs);
  geo.rotateX(-Math.PI / 2);
  const material = new THREE.MeshStandardMaterial({
    color,
    flatShading: true,
    roughness: 0.35,
    metalness: 0.05,
    transparent: true,
    opacity,
  });
  const m = new THREE.Mesh(geo, material);
  m.receiveShadow = true;
  m.userData.base = Float32Array.from(geo.attributes.position.array);
  return m;
}
