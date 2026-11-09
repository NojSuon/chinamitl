import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ELEMENTS, LAYERS, BUILDINGS } from './data.js';
import { BUILDERS } from './buildings.js';
import { UI, LANGS } from './i18n.js';
import { buildChinampa, W, L, BED, TOP } from './chinampa.js';
import { buildCity, insideIsland } from './city.js';
import { MotionPhysics, updateWater, waveHeight } from './physics.js';
import { WaterDepth, setFoamGlow } from './water.js';

/* ───────────────────────── Renderer & scene ───────────────────────── */
// Phones and portrait tablets use the compact layout (matches the 900px CSS breakpoint).
const compactMQ = window.matchMedia('(max-width: 900px)');
const compact = () => compactMQ.matches;
const coarse = window.matchMedia('(pointer: coarse)').matches;

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
// Lighter rendering on touch devices to keep phones smooth and cool.
renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.75 : 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
// Shadows are rendered once per frame for the main pass only (not for the water depth pre-pass).
renderer.shadowMap.autoUpdate = false;

const scene = new THREE.Scene();
const FOG = {
  chinampa: new THREE.Fog('#e3dccb', 90, 300),
  city: new THREE.Fog('#e6dbc8', 300, 950),
};

const hemi = new THREE.HemisphereLight('#fff1d6', '#3d5d4f', 1.25);
scene.add(hemi);
const sun = new THREE.DirectionalLight('#ffe2b8', 2.3);
sun.position.set(30, 45, 18);
sun.castShadow = true;
sun.shadow.mapSize.setScalar(coarse ? 1024 : 2048);
sun.shadow.bias = -0.0005;
sun.shadow.normalBias = 0.03;
scene.add(sun, sun.target);
function setShadowBounds(s, far) {
  const c = sun.shadow.camera;
  c.left = c.bottom = -s;
  c.right = c.top = s;
  c.far = far;
  c.updateProjectionMatrix();
}

const persp = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.3, 3000);
const ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, -500, 1000);
let camera = persp;
let controls = makeControls(persp);

function makeControls(cam) {
  const c = new OrbitControls(cam, renderer.domElement);
  c.enableDamping = true;
  c.dampingFactor = 0.08;
  c.screenSpacePanning = true;
  c.listenToKeyEvents(window);
  c.keyPanSpeed = 14;
  return c;
}

/* ───────────────────────── Content ───────────────────────── */
const chin = buildChinampa();
const city = buildCity();
scene.add(chin.root, city.root);

// Buildings view: every model built once with clickable parts, on a paper-coloured plinth.
const bld = { root: new THREE.Group(), models: {} };
{
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(46, 0.6, 40),
    new THREE.MeshStandardMaterial({ color: '#efe7d8', flatShading: true, roughness: 1 }),
  );
  plinth.position.y = -0.3;
  plinth.receiveShadow = true;
  bld.root.add(plinth);
  for (const id of BUILDINGS) {
    const m = BUILDERS[id]({ parts: true });
    m.visible = false;
    bld.models[id] = m;
    bld.root.add(m);
  }
  bld.root.visible = false;
  scene.add(bld.root);
}
// Depth target for the water shader; lower resolution on touch devices.
const waterDepth = new WaterDepth(renderer, coarse ? 0.5 : 0.75);

const physics = new MotionPhysics();
const canoeBody = { obj: chin.canoe.group, k: 9, c: 1.4, gain: 1.6, max: 0.28, manual: true };
const swayBodies = [...chin.sway, canoeBody];

// Per-element material clones so a single element can glow when hovered/selected.
const idMats = new Map();
function prepareHighlight(root) {
  const cache = new Map();
  root.traverse((o) => {
    if (!o.isMesh || !o.userData.id) return;
    // The water uses a custom shader (onBeforeCompile), which a clone would lose.
    if (o.material.userData.water) {
      const id = o.userData.id;
      o.material.userData.baseEmissive = o.material.emissive.clone();
      o.material.userData.baseIntensity = o.material.emissiveIntensity;
      if (!idMats.has(id)) idMats.set(id, new Set());
      idMats.get(id).add(o.material);
      return;
    }
    const id = o.userData.id;
    const key = id + '|' + o.material.uuid;
    if (!cache.has(key)) {
      const m = o.material.clone();
      m.userData.baseEmissive = m.emissive.clone();
      m.userData.baseIntensity = m.emissiveIntensity;
      cache.set(key, m);
      if (!idMats.has(id)) idMats.set(id, new Set());
      idMats.get(id).add(m);
    }
    o.material = cache.get(key);
  });
}
prepareHighlight(chin.root);
prepareHighlight(city.root);
prepareHighlight(bld.root);

const NO_HOVER_GLOW = new Set(['canal', 'cityWater', 'lake', 'cityCanal']);
const glowColor = new THREE.Color('#5fc4c9'); // Turquesa Mar, brightened for emissive glow
function setGlow(id, amount) {
  const set = idMats.get(id === 'cityCanal' ? 'cityWater' : id);
  if (!set) return;
  for (const m of set) {
    if (amount <= 0) {
      m.emissive.copy(m.userData.baseEmissive);
      m.emissiveIntensity = m.userData.baseIntensity;
    } else {
      m.emissive.copy(glowColor);
      m.emissiveIntensity = amount;
    }
  }
}

/* ───────────────────────── State ───────────────────────── */
function storedLang() {
  try {
    const l = localStorage.getItem('chinamitl-lang');
    return UI[l] ? l : 'es';
  } catch {
    return 'es';
  }
}
const state = {
  lang: storedLang(),
  mode: 'chinampa',
  sheet: '',
  viewOff: 0,
  viewOffTarget: 0,
  viewOffApplied: null,
  selected: null,
  hovered: null,
  explode: 0,
  axoLevel: LAYERS.length - 1,
  axoAz: Math.PI / 4,
  building: BUILDINGS[0],
  offsets: LAYERS.map(() => 0),
};
const AXO_GAP = 4.6;
const AXO_ELEV = Math.atan(1 / Math.SQRT2); // true isometric elevation (35.26°)
const LAYER_MID = [BED, -0.7, -2.07, -1.37, -0.82, -0.25, (0.15 + TOP) / 2, TOP + 0.9, TOP + 3.2];

const VIEWS = {
  chinampa: { pos: new THREE.Vector3(17, 16, 21), target: new THREE.Vector3(0, 1.2, 0) },
  city: { pos: new THREE.Vector3(150, 125, 185), target: new THREE.Vector3(0, 0, 0) },
};

/* ───────────────────────── Camera tween ───────────────────────── */
let tween = null;
function flyTo(pos, target, dur = 1.2) {
  tween = {
    p0: camera.position.clone(),
    t0: controls.target.clone(),
    p1: pos.clone(),
    t1: target.clone(),
    t: 0,
    dur,
  };
}
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ───────────────────────── Modes ───────────────────────── */
function setMode(mode, { keepSelection = false } = {}) {
  const prevMode = state.mode;
  state.mode = mode;
  document.body.dataset.mode = mode;
  document.querySelectorAll('.modes button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mode === mode)));

  const isAxo = mode === 'axo';
  const isBld = mode === 'buildings';
  const isOrtho = isAxo || isBld;
  chin.root.visible = mode === 'chinampa' || isAxo;
  city.root.visible = mode === 'city';
  bld.root.visible = isBld;
  chin.detailOnly.forEach((o) => (o.visible = !isAxo));
  chin.axoOnly.forEach((o) => (o.visible = isAxo));
  scene.fog = isOrtho ? null : FOG[mode];

  // Swap camera type.
  if ((camera === ortho) !== isOrtho) {
    const target = controls.target.clone();
    controls.dispose();
    camera = isOrtho ? ortho : persp;
    controls = makeControls(camera);
    controls.target.copy(target);
  }
  // Free drag-rotation everywhere; in the axonometric views the ⟲ ⟳ buttons snap back to a clean isometric angle.
  controls.enableRotate = true;
  controls.autoRotate = !isOrtho && document.getElementById('autoRotate').checked;
  controls.minDistance = mode === 'city' ? 20 : 4;
  controls.maxDistance = mode === 'city' ? 700 : 160;
  controls.maxPolarAngle = mode === 'city' || isOrtho ? Math.PI * 0.47 : Math.PI * 0.62;

  if (mode === 'city') {
    setShadowBounds(170, 600);
    sun.position.set(160, 220, 90);
    physics.setBodies([]);
  } else {
    setShadowBounds(isAxo ? 45 : isBld ? 30 : 36, 200);
    sun.position.set(30, 45, 18);
    physics.setBodies(isBld ? [] : swayBodies);
  }

  if (isAxo) {
    layoutOrtho();
    camera.position.copy(axoCameraPos(state.axoAz, axoTarget()));
    controls.target.copy(axoTarget());
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    tween = null;
    physics.reset();
  } else if (isBld) {
    layoutOrtho();
    tween = null;
    physics.reset();
    showBuilding(state.building, { select: false, keepAngle: false });
  } else {
    const v = VIEWS[mode];
    if (prevMode === 'axo' || prevMode === 'buildings' || prevMode === mode) {
      camera.position.copy(v.pos).add(new THREE.Vector3(30, 20, 30));
      controls.target.copy(v.target);
    }
    flyTo(v.pos, v.target, 1.4);
  }
  updateAxoUI();
  buildMapLabels();
  if (!isBld) buildPartLabels(); // clears the part labels outside the Buildings view
  renderLegend();
  if (!keepSelection) {
    // On phones the info sheet would cover the scene, so only open it on demand.
    if (compact()) select(null);
    else select(isBld ? state.building : mode === 'city' ? 'cityChinampa' : 'chinampa', { focus: false });
  }
}

/* ───────────────────────── Buildings view ───────────────────────── */
const bldNameEl = document.getElementById('bldName');
function showBuilding(id, { select: doSelect = true, keepAngle = true } = {}) {
  state.building = id;
  for (const [k, m] of Object.entries(bld.models)) m.visible = k === id;
  bldNameEl.textContent = `${BUILDINGS.indexOf(id) + 1}/${BUILDINGS.length} · ${loc(id).name}`;
  // Frame the model: centre it and zoom so it fills the view.
  const box = new THREE.Box3().setFromObject(bld.models[id]);
  const center = box.getCenter(new THREE.Vector3());
  // Fit by the model's isometric footprint (flat buildings like the ballcourt get closer).
  const size = box.getSize(new THREE.Vector3());
  const footW = (size.x + size.z) * 0.71;
  const footH = size.y * 0.82 + (size.x + size.z) * 0.41;
  const visW = ortho.right - ortho.left;
  const visH = ortho.top - ortho.bottom;
  camera.zoom = Math.min((visW * (compact() ? 0.62 : 0.32)) / footW, (visH * (compact() ? 0.4 : 0.52)) / footH);
  camera.updateProjectionMatrix();
  const t = new THREE.Vector3(center.x, center.y * 0.8, center.z);
  if (state.mode === 'buildings' && keepAngle) state.axoAz = currentAz();
  if (state.mode === 'buildings') flyTo(axoCameraPos(state.axoAz, t), t, 0.6);
  buildPartLabels();
  if (state.mode === 'buildings') renderLegend();
  if (doSelect) select(id);
}
function stepBuilding(d) {
  const i = (BUILDINGS.indexOf(state.building) + d + BUILDINGS.length) % BUILDINGS.length;
  showBuilding(BUILDINGS[i], { select: !compact() });
}

/* ───────────────────────── Layers (explode / axo) ───────────────────────── */
function targetOffset(i) {
  if (state.mode === 'axo') return i * AXO_GAP;
  return i >= 2 ? (i - 1) * 1.3 * state.explode : 0;
}
function axoTarget() {
  const lvl = state.axoLevel;
  return new THREE.Vector3(0, (lvl * AXO_GAP) / 2 + (LAYER_MID[0] + LAYER_MID[lvl]) / 2, 0);
}
// Current horizontal viewing angle, so stepping layers/buildings keeps the angle the user rotated to.
function currentAz() {
  return Math.atan2(camera.position.x - controls.target.x, camera.position.z - controls.target.z);
}
function axoCameraPos(az, target) {
  const d = 150;
  return new THREE.Vector3(
    target.x + Math.sin(az) * Math.cos(AXO_ELEV) * d,
    target.y + Math.sin(AXO_ELEV) * d,
    target.z + Math.cos(az) * Math.cos(AXO_ELEV) * d,
  );
}
function layoutOrtho() {
  const aspect = window.innerWidth / window.innerHeight;
  const narrow = compact();
  const halfH = narrow ? 40 : 31;
  // Shift the plan left of centre so the layer labels have room beside the info panel.
  const shift = narrow ? halfH * aspect * 0.42 : halfH * aspect * (state.mode === 'buildings' ? 0.08 : 0.2);
  ortho.left = -halfH * aspect + shift;
  ortho.right = halfH * aspect + shift;
  ortho.top = halfH;
  ortho.bottom = -halfH;
  ortho.updateProjectionMatrix();
}

// Gold outline around the current axonometric layer.
const outline = new THREE.LineLoop(
  new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-W / 2 - 0.6, 0, -L / 2 - 0.6),
    new THREE.Vector3(W / 2 + 0.6, 0, -L / 2 - 0.6),
    new THREE.Vector3(W / 2 + 0.6, 0, L / 2 + 0.6),
    new THREE.Vector3(-W / 2 - 0.6, 0, L / 2 + 0.6),
  ]),
  new THREE.LineBasicMaterial({ color: '#7a63a8' }),
);
outline.visible = false;
scene.add(outline);

function updateAxoUI() {
  const isAxo = state.mode === 'axo';
  LAYERS.forEach((l, i) => {
    chin.layerGroups[l.key].visible = !isAxo || i <= state.axoLevel;
  });
  const all = state.axoLevel === LAYERS.length - 1;
  document.getElementById('layerName').textContent = all
    ? T().allLayers
    : `${state.axoLevel + 1}/${LAYERS.length} · ${LAYERS[state.axoLevel].name[state.lang]}`;
  outline.visible = isAxo && !all;
  buildAxoLabels();
}

function stepLayer(d) {
  state.axoLevel = THREE.MathUtils.clamp(state.axoLevel + d, 0, LAYERS.length - 1);
  updateAxoUI();
  const t = axoTarget();
  state.axoAz = currentAz();
  flyTo(axoCameraPos(state.axoAz, t), t, 0.6);
  if (!compact()) select(LAYERS[state.axoLevel].id, { focus: false });
}

const labelsEl = document.getElementById('axoLabels');
let labelEls = [];
function buildAxoLabels() {
  labelsEl.innerHTML = '';
  labelEls = [];
  if (state.mode !== 'axo') return;
  LAYERS.forEach((l, i) => {
    if (i > state.axoLevel) return;
    const el = document.createElement('div');
    el.className = 'axo-label' + (i === state.axoLevel && state.axoLevel < LAYERS.length - 1 ? ' current' : '');
    el.innerHTML = `<span class="dot"></span><span class="line"></span><span class="txt"><b>${i + 1}</b>${l.name[state.lang]}<i>${l.nahuatl}</i></span>`;
    el.addEventListener('click', () => {
      select(l.id, { focus: false });
    });
    labelsEl.appendChild(el);
    labelEls.push({ el, i });
  });
}

const _v = new THREE.Vector3();
function positionAxoLabels() {
  if (state.mode !== 'axo') return;
  // Anchor each label at the right-most corner of its layer on screen.
  const corners = [
    [W / 2 + 0.3, L / 2 + 0.3],
    [W / 2 + 0.3, -L / 2 - 0.3],
    [-W / 2 - 0.3, L / 2 + 0.3],
    [-W / 2 - 0.3, -L / 2 - 0.3],
  ];
  let best = corners[0],
    bestX = -Infinity;
  for (const c of corners) {
    _v.set(c[0], 0, c[1]).project(camera);
    if (_v.x > bestX) {
      bestX = _v.x;
      best = c;
    }
  }
  for (const { el, i } of labelEls) {
    _v.set(best[0], LAYER_MID[i] + state.offsets[i], best[1]).project(camera);
    el.style.left = ((_v.x + 1) / 2) * window.innerWidth + 'px';
    el.style.top = ((1 - _v.y) / 2) * window.innerHeight + 'px';
  }
}

/* ── Buildings view: part labels with leader lines ── */
const partLabelsEl = document.createElement('div');
partLabelsEl.className = 'axo-labels';
document.body.appendChild(partLabelsEl);
const lineSvg = document.getElementById('labelLines');
let partLabels = [];
function buildPartLabels() {
  partLabelsEl.innerHTML = '';
  lineSvg.innerHTML = '';
  partLabels = [];
  if (state.mode !== 'buildings') return;
  const id = state.building;
  const model = bld.models[id];
  let ids = Object.keys(ELEMENTS).filter((k) => ELEMENTS[k].building === id);
  if (!ids.length) ids = [id];
  else ids = [id, ...ids.filter((k) => k !== id)];
  model.updateMatrixWorld(true);
  ids.forEach((pid, i) => {
    // Anchor: top centre of the part (or the whole model for the building itself).
    const box = new THREE.Box3();
    model.traverse((o) => {
      if (o.isMesh && (pid === id ? true : o.userData.id === pid)) box.expandByObject(o);
    });
    if (box.isEmpty()) return;
    const anchor = pid === id ? new THREE.Vector3((box.min.x + box.max.x) / 2, box.max.y, (box.min.z + box.max.z) / 2) : box.getCenter(new THREE.Vector3());
    if (pid !== id) anchor.y = Math.max(anchor.y, box.max.y - 0.2);
    const el = document.createElement('div');
    el.className = 'axo-label' + (pid === state.selected ? ' current' : '');
    const num = pid === id ? '' : `<b>${i}</b>`;
    el.innerHTML = `<span class="txt">${num}${loc(pid).name}<i>${ELEMENTS[pid].nahuatl}</i></span>`;
    el.addEventListener('click', () => select(pid));
    partLabelsEl.appendChild(el);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('r', '4');
    lineSvg.append(line, dot);
    partLabels.push({ el, pid, anchor, line, dot, box });
  });
}
function positionPartLabels() {
  if (state.mode !== 'buildings' || !partLabels.length) return;
  const W2 = window.innerWidth,
    H2 = window.innerHeight;
  const toScreen = (p) => {
    _v.copy(p).project(camera);
    return [((_v.x + 1) / 2) * W2, ((1 - _v.y) / 2) * H2];
  };
  // Column to the right of the model.
  const mbox = new THREE.Box3().setFromObject(bld.models[state.building]);
  let maxX = -Infinity;
  for (const x of [mbox.min.x, mbox.max.x])
    for (const y of [mbox.min.y, mbox.max.y])
      for (const z of [mbox.min.z, mbox.max.z]) maxX = Math.max(maxX, toScreen(new THREE.Vector3(x, y, z))[0]);
  const rightLimit = compact() ? W2 - 150 : W2 - (info.hidden ? 260 : 640);
  const colX = Math.min(maxX + 36, rightLimit);
  const items = partLabels.map((p) => ({ p, s: toScreen(p.anchor) })).sort((a, b) => a.s[1] - b.s[1]);
  let lastY = -Infinity;
  const gap = compact() ? 26 : 32;
  for (const it of items) {
    const y = Math.max(it.s[1], lastY + gap);
    lastY = y;
    it.p.el.style.left = colX + 'px';
    it.p.el.style.top = y + 'px';
    it.p.line.setAttribute('x1', it.s[0]);
    it.p.line.setAttribute('y1', it.s[1]);
    it.p.line.setAttribute('x2', colX);
    it.p.line.setAttribute('y2', y);
    it.p.dot.setAttribute('cx', it.s[0]);
    it.p.dot.setAttribute('cy', it.s[1]);
  }
}

/* ── Tenochtitlan map: building and landmark names ── */
const mapLabelsEl = document.getElementById('mapLabels');
let mapLabels = [];
function buildMapLabels() {
  mapLabelsEl.innerHTML = '';
  mapLabels = [];
  if (state.mode !== 'city') return;
  for (const [id, x, y, z, maxDist] of city.labels) {
    const el = document.createElement('button');
    el.className = 'map-label hidden';
    el.innerHTML = `${loc(id).name}<i>${ELEMENTS[id].nahuatl.split(' · ')[0]}</i>`;
    el.addEventListener('click', () => select(id, { focus: true }));
    mapLabelsEl.appendChild(el);
    mapLabels.push({ el, id, pos: new THREE.Vector3(x, y, z), maxDist });
  }
}
function positionMapLabels() {
  if (state.mode !== 'city' || !mapLabels.length) return;
  const W2 = window.innerWidth,
    H2 = window.innerHeight;
  const placed = [];
  const scale = compact() ? 0.9 : 1;
  for (const m of mapLabels) {
    const dist = camera.position.distanceTo(m.pos);
    _v.copy(m.pos).project(camera);
    const x = ((_v.x + 1) / 2) * W2,
      y = ((1 - _v.y) / 2) * H2;
    let show = _v.z < 1 && dist < m.maxDist * scale && x > 0 && x < W2 && y > 60 && y < H2;
    const w = m.el.offsetWidth || 120,
      h = m.el.offsetHeight || 24;
    const rect = [x - w / 2, y - h - 6, x + w / 2, y];
    if (show && placed.some((r) => rect[0] < r[2] && rect[2] > r[0] && rect[1] < r[3] && rect[3] > r[1])) show = false;
    if (show) placed.push(rect);
    m.el.classList.toggle('hidden', !show);
    m.el.classList.toggle('active', m.id === state.selected);
    if (show) {
      m.el.style.left = x + 'px';
      m.el.style.top = y - 6 + 'px';
    }
  }
}

/* ───────────────────────── Picking ───────────────────────── */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
function isShown(o) {
  for (let p = o; p; p = p.parent) if (!p.visible) return false;
  return true;
}
function pick(clientX, clientY) {
  pointer.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const roots = state.mode === 'city' ? [city.root] : state.mode === 'buildings' ? [bld.root] : [chin.root];
  const hits = raycaster.intersectObjects(roots, true);
  for (let k = 0; k < hits.length; k++) {
    const h = hits[k];
    const id = h.object.userData.id;
    if (!id || !isShown(h.object)) continue;
    if (h.object === chin.water) {
      // Let clicks pass through the translucent water to submerged layers just below.
      const below = hits.slice(k + 1).find((b) => b.object.userData.id && isShown(b.object));
      if (below && below.distance - h.distance < 6) return below.object.userData.id;
    }
    if (id === 'cityWater') return insideIsland(h.point.x, h.point.z, 2) ? 'cityCanal' : 'lake';
    return id;
  }
  return null;
}

const tooltip = document.getElementById('tooltip');
let pendingMove = null;
canvas.addEventListener('pointermove', (e) => {
  pendingMove = e;
});
function processHover() {
  if (!pendingMove) return;
  const e = pendingMove;
  pendingMove = null;
  if (e.buttons || e.pointerType === 'touch') {
    tooltip.hidden = true;
    return;
  }
  const id = pick(e.clientX, e.clientY);
  if (id !== state.hovered) {
    if (state.hovered && state.hovered !== state.selected) setGlow(state.hovered, 0);
    state.hovered = id;
    if (id && id !== state.selected && !NO_HOVER_GLOW.has(id)) setGlow(id, 0.22);
  }
  canvas.style.cursor = id ? 'pointer' : 'grab';
  if (id && ELEMENTS[id]) {
    tooltip.innerHTML = `${loc(id).name}<i>${ELEMENTS[id].nahuatl}</i>`;
    tooltip.style.left = e.clientX + 'px';
    tooltip.style.top = e.clientY + 'px';
    tooltip.hidden = false;
  } else tooltip.hidden = true;
}

let down = null;
canvas.addEventListener('pointerdown', (e) => {
  down = { x: e.clientX, y: e.clientY };
  hideHint();
});
let lastTap = { id: null, time: 0 };
canvas.addEventListener('pointerup', (e) => {
  if (!down) return;
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
  down = null;
  if (moved > (e.pointerType === 'touch' ? 12 : 5)) return;
  const id = pick(e.clientX, e.clientY);
  const now = performance.now();
  // Double-tap (touch) or double-click on the same element flies the camera to it.
  const doubleTap = id && id === lastTap.id && now - lastTap.time < 380;
  lastTap = { id, time: now };
  if (id) select(id, { focus: state.mode !== 'axo' && doubleTap });
  else if (compact() && state.sheet === 'info') setSheet('');
});
canvas.addEventListener('pointerleave', () => (tooltip.hidden = true));

/* ───────────────────────── Selection & info panel ───────────────────────── */
const info = document.getElementById('info');
const infoBody = document.getElementById('infoBody');
function select(id, { focus = false } = {}) {
  if (state.selected) setGlow(state.selected, 0);
  state.selected = id;
  renderInfo(id);
  document.querySelectorAll('.legend-item').forEach((b) => b.classList.toggle('active', b.dataset.id === id));
  if (compact()) {
    if (id) setSheet('info');
    else if (state.sheet === 'info') setSheet('');
  }
  if (focus) focusOn(id);
  partLabels.forEach((p) => p.el.classList.toggle('current', p.pid === id));
}

/* ── Phone bottom sheets: 'legend' (element list), 'info' or '' (closed) ── */
const legendEl = document.getElementById('legend');
function setSheet(kind) {
  state.sheet = kind;
  document.body.dataset.sheet = kind;
  document.getElementById('sheetBtn').setAttribute('aria-expanded', String(kind === 'legend'));
  updateViewOffsetTarget();
}
// Shift the 3D view up so whatever is selected stays visible above an open sheet.
function updateViewOffsetTarget() {
  let h = 0;
  if (compact() && state.sheet) {
    const el = state.sheet === 'legend' ? legendEl : info;
    h = el.getBoundingClientRect().height;
  }
  state.viewOffTarget = h * 0.45;
}
function applyViewOffset(dt) {
  const d = state.viewOffTarget - state.viewOff;
  if (Math.abs(d) < 0.5 && state.viewOffApplied === camera) return;
  state.viewOff += d * (1 - Math.exp(-dt * 9));
  if (Math.abs(state.viewOffTarget - state.viewOff) < 0.5) state.viewOff = state.viewOffTarget;
  const w = window.innerWidth,
    h = window.innerHeight;
  if (state.viewOffApplied && state.viewOffApplied !== camera) state.viewOffApplied.clearViewOffset();
  if (state.viewOff > 0.5) camera.setViewOffset(w, h, 0, state.viewOff, w, h);
  else camera.clearViewOffset();
  state.viewOffApplied = camera;
}

function T() {
  return UI[state.lang];
}
function loc(id) {
  return ELEMENTS[id].t[state.lang];
}

function renderInfo(id) {
  const el = ELEMENTS[id];
  if (!el) {
    info.hidden = true;
    return;
  }
  info.hidden = false;
  const tx = loc(id);
  const ui = T();
  const hist = tx.hist?.length ? `<h4>${ui.history}</h4><ul>${tx.hist.map((h) => `<li>${h}</li>`).join('')}</ul>` : '';
  let action = el.action ? `<button class="action" data-view="${el.action.view}">${tx.action} →</button>` : '';
  // Buildings on the city map get a shortcut to their axonometric model.
  if (!action && state.mode === 'city' && BUILDINGS.includes(id)) action = `<button class="action" data-view="buildings" data-building="${id}">${ui.viewModel} →</button>`;
  infoBody.innerHTML = `
    <div class="group">${ui.groups[el.group]}</div>
    <h2>${tx.name}</h2>
    <div class="nahuatl-card" lang="nah">
      <div class="label">${ui.nahuatlLabel}</div>
      <div class="word">${el.nahuatl}</div>
      <div class="classical">${ui.classical}: ${el.classical}</div>
      <div class="gloss" lang="${LANGS.find((l) => l.code === state.lang).html}">${tx.gloss}</div>
    </div>
    <h4>${ui.fn}</h4><p>${tx.fn}</p>
    <h4>${ui.what}</h4><p>${tx.desc}</p>
    ${hist}
    ${action}
    <p class="community">${ui.community}</p>`;
  infoBody.querySelector('.action')?.addEventListener('click', (e) => {
    const { view, building } = e.currentTarget.dataset;
    if (building) state.building = building;
    setMode(view);
  });
  info.scrollTop = 0;
}
document.getElementById('infoClose').addEventListener('click', () => {
  if (state.selected) setGlow(state.selected, 0);
  state.selected = null;
  info.hidden = true;
  document.querySelectorAll('.legend-item').forEach((b) => b.classList.remove('active'));
  if (compact()) setSheet('');
});
document.getElementById('infoBack').addEventListener('click', () => setSheet('legend'));

function focusOn(id) {
  if (state.mode === 'buildings') {
    if (BUILDINGS.includes(id)) showBuilding(id, { select: false });
    return;
  }
  const root = state.mode === 'city' ? city.root : chin.root;
  const box = new THREE.Box3();
  const tmp = new THREE.Box3();
  root.traverse((o) => {
    if (!o.isMesh || o.userData.id !== id || !isShown(o)) return;
    if (o.isInstancedMesh) {
      o.computeBoundingBox();
      tmp.copy(o.boundingBox).applyMatrix4(o.matrixWorld);
    } else tmp.setFromObject(o);
    box.union(tmp);
  });
  if (box.isEmpty()) return;
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();
  if (id === 'canal' || id === 'cityWater' || id === 'lake') return; // too big to frame
  const dir = camera.position.clone().sub(controls.target).normalize();
  const dist = THREE.MathUtils.clamp(size * 1.4, 5, state.mode === 'city' ? 400 : 60);
  flyTo(center.clone().add(dir.multiplyScalar(dist)), center, 1.0);
}

/* ───────────────────────── Legend ───────────────────────── */
const viewKey = () => (state.mode === 'axo' ? 'chinampa' : state.mode);
const inView = (el, key) => (Array.isArray(el.view) ? el.view.includes(key) : el.view === key);
const legendBody = document.getElementById('legendBody');
function renderLegend() {
  const view = viewKey();
  const groups = {};
  for (const [id, el] of Object.entries(ELEMENTS)) {
    if (!inView(el, view)) continue;
    if (el.building && el.building !== state.building) continue; // only the shown building's parts
    (groups[el.group] ||= []).push([id, el]);
  }
  legendBody.innerHTML = Object.entries(groups)
    .map(
      ([g, items]) =>
        `<h3>${T().groups[g]}</h3>` +
        items
          .map(
            ([id, el]) =>
              `<button class="legend-item${id === state.selected ? ' active' : ''}" data-id="${id}"><span class="n">${el.t[state.lang].name}</span><span class="nah">${el.nahuatl}</span></button>`,
          )
          .join(''),
    )
    .join('');
  legendBody.querySelectorAll('.legend-item').forEach((b) =>
    b.addEventListener('click', () => select(b.dataset.id, { focus: state.mode !== 'axo' })),
  );
}
/* ── About / contact dialog ── */
const aboutDlg = document.getElementById('about');
document.getElementById('aboutBtn').addEventListener('click', () => {
  hideHint();
  aboutDlg.showModal();
});
document.getElementById('aboutClose').addEventListener('click', () => aboutDlg.close());
aboutDlg.addEventListener('click', (e) => {
  if (e.target === aboutDlg) aboutDlg.close(); // click on the backdrop
});
document.getElementById('copyEmail').addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  try {
    await navigator.clipboard.writeText('matimati.info@gmail.com');
    btn.textContent = T().copied;
    setTimeout(() => (btn.textContent = T().copy), 1600);
  } catch {
    window.location.href = 'mailto:matimati.info@gmail.com';
  }
});

document.getElementById('legendClose').addEventListener('click', () => setSheet(''));
document.getElementById('sheetBtn').addEventListener('click', () => {
  hideHint();
  setSheet(state.sheet === 'legend' ? '' : 'legend');
});
compactMQ.addEventListener('change', () => setSheet(''));

/* ───────────────────────── Toolbar ───────────────────────── */
document.querySelectorAll('.modes button').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
document.getElementById('resetView').addEventListener('click', resetView);
function resetView() {
  if (state.mode === 'axo') {
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    const t = axoTarget();
    flyTo(axoCameraPos(state.axoAz, t), t, 0.8);
  } else flyTo(VIEWS[state.mode].pos, VIEWS[state.mode].target, 1.0);
}
document.getElementById('autoRotate').addEventListener('change', (e) => {
  controls.autoRotate = e.target.checked && state.mode !== 'axo';
  controls.autoRotateSpeed = 0.8;
});
document.getElementById('physicsToggle').addEventListener('change', (e) => (physics.enabled = e.target.checked));
document.getElementById('explode').addEventListener('input', (e) => (state.explode = +e.target.value));
document.getElementById('layerPrev').addEventListener('click', () => stepLayer(-1));
document.getElementById('layerNext').addEventListener('click', () => stepLayer(1));
document.getElementById('layerAll').addEventListener('click', () => stepLayer(LAYERS.length));
const rotateAxo = (d) => {
  // Snap to the next isometric quarter-turn from wherever the user has rotated to.
  state.axoAz = Math.round((currentAz() - Math.PI / 4) / (Math.PI / 2)) * (Math.PI / 2) + Math.PI / 4 + d * (Math.PI / 2);
  const t = controls.target.clone();
  orbitTween = { from: Math.atan2(camera.position.x - t.x, camera.position.z - t.z), to: state.axoAz, t: 0, target: t };
};
let orbitTween = null;
document.getElementById('axoRotL').addEventListener('click', () => rotateAxo(-1));
document.getElementById('axoRotR').addEventListener('click', () => rotateAxo(1));
document.getElementById('bldRotL').addEventListener('click', () => rotateAxo(-1));
document.getElementById('bldRotR').addEventListener('click', () => rotateAxo(1));
document.getElementById('bldPrev').addEventListener('click', () => stepBuilding(-1));
document.getElementById('bldNext').addEventListener('click', () => stepBuilding(1));

window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === 'r' || e.key === 'R') resetView();
  if (state.mode === 'axo') {
    if (e.key === 'PageUp' || e.key === ']') stepLayer(1);
    if (e.key === 'PageDown' || e.key === '[') stepLayer(-1);
  }
});

/* ───────────────────────── Theme (light / dark) ───────────────────────── */
// Day: warm afternoon sun. Night: cool moonlight over the lake, dimmer sky fill and darker fog.
const THEMES = {
  light: {
    hemi: ['#fff1d6', '#3d5d4f', 1.25], sun: ['#ffe2b8', 2.3], exposure: 1.05,
    fog: { chinampa: '#e3dccb', city: '#e6dbc8' }, meta: '#2f6b73',
    foamGlow: 0.35,
  },
  dark: {
    hemi: ['#9fb4dc', '#1b2a2f', 0.85], sun: ['#c8d6ff', 1.35], exposure: 0.95,
    fog: { chinampa: '#2a2f45', city: '#262c42' }, meta: '#1f1a26',
    foamGlow: 0.06,
  },
};
const themeBtn = document.getElementById('themeBtn');
function applyTheme(theme) {
  const t = THEMES[theme] ? theme : 'light';
  const p = THEMES[t];
  document.documentElement.dataset.theme = t;
  hemi.color.set(p.hemi[0]);
  hemi.groundColor.set(p.hemi[1]);
  hemi.intensity = p.hemi[2];
  sun.color.set(p.sun[0]);
  sun.intensity = p.sun[1];
  renderer.toneMappingExposure = p.exposure;
  setFoamGlow(p.foamGlow);
  FOG.chinampa.color.set(p.fog.chinampa);
  FOG.city.color.set(p.fog.city);
  document.querySelector('meta[name="theme-color"]').setAttribute('content', p.meta);
  themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
  const key = t === 'dark' ? 'themeLight' : 'themeDark';
  themeBtn.dataset.i18nTitle = key;
  themeBtn.dataset.i18nAria = key;
  themeBtn.title = T()[key];
  themeBtn.setAttribute('aria-label', T()[key]);
}
themeBtn.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  try {
    localStorage.setItem('chinamitl-theme', next);
  } catch {
    /* storage unavailable: theme just won't persist */
  }
  applyTheme(next);
});
// Follow the system setting until the user picks a theme themself.
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  let saved = null;
  try {
    saved = localStorage.getItem('chinamitl-theme');
  } catch {
    /* ignore */
  }
  if (!saved) applyTheme(e.matches ? 'dark' : 'light');
});

/* ───────────────────────── Language ───────────────────────── */
const langsEl = document.getElementById('langs');
langsEl.innerHTML = LANGS.map(
  (l) => `<button data-lang="${l.code}" lang="${l.html}" title="${l.name}" aria-pressed="false">${l.label}</button>`,
).join('');
langsEl.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

function setLang(code) {
  state.lang = code;
  try {
    localStorage.setItem('chinamitl-lang', code);
  } catch {
    /* storage unavailable: language just won't persist */
  }
  applyLang();
}
function applyLang() {
  const ui = T();
  const get = (path) => path.split('.').reduce((o, k) => o?.[k], ui);
  document.documentElement.lang = LANGS.find((l) => l.code === state.lang).html;
  document.title = ui.title;
  document.querySelectorAll('[data-i18n]').forEach((n) => (n.textContent = get(n.dataset.i18n)));
  document.querySelectorAll('[data-i18n-title]').forEach((n) => (n.title = get(n.dataset.i18nTitle)));
  document.querySelectorAll('[data-i18n-aria]').forEach((n) => n.setAttribute('aria-label', get(n.dataset.i18nAria)));
  langsEl.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)));
  renderLegend();
  if (state.selected) renderInfo(state.selected);
  buildMapLabels();
  if (state.mode === 'buildings') showBuilding(state.building, { select: false });
  updateAxoUI();
  tooltip.hidden = true;
}

const hint = document.getElementById('hint');
let hintTimer = setTimeout(hideHint, 9000);
function hideHint() {
  clearTimeout(hintTimer);
  hint.classList.add('gone');
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  persp.aspect = window.innerWidth / window.innerHeight;
  persp.updateProjectionMatrix();
  layoutOrtho();
  waterDepth.resize();
  state.viewOffApplied = null; // force the view offset to be re-applied at the new size
  updateViewOffsetTarget();
});

/* ───────────────────────── Loop ───────────────────────── */
const clock = new THREE.Clock();
const canoeTangent = new THREE.Vector3();
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.1);
  const t = clock.elapsedTime;

  if (tween) {
    tween.t += dt / tween.dur;
    const k = ease(Math.min(tween.t, 1));
    camera.position.lerpVectors(tween.p0, tween.p1, k);
    controls.target.lerpVectors(tween.t0, tween.t1, k);
    if (tween.t >= 1) tween = null;
  }
  if (orbitTween) {
    orbitTween.t += dt / 0.7;
    let d = orbitTween.to - orbitTween.from;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    const az = orbitTween.from + d * ease(Math.min(orbitTween.t, 1));
    camera.position.copy(axoCameraPos(az, orbitTween.target));
    if (orbitTween.t >= 1) orbitTween = null;
  }
  controls.update();

  // Layer offsets ease toward their targets.
  LAYERS.forEach((l, i) => {
    const to = targetOffset(i);
    state.offsets[i] += (to - state.offsets[i]) * (1 - Math.exp(-dt * 7));
    chin.layerGroups[l.key].position.y = state.offsets[i];
  });
  if (outline.visible) outline.position.y = LAYER_MID[state.axoLevel] + state.offsets[state.axoLevel] + (state.axoLevel <= 1 ? 0 : 0.35);

  physics.update(dt, camera, controls.target, t);

  if (state.mode !== 'city') {
    updateWater(chin.water, t, physics, { amp: 0.05, sloshAmp: 0.06, falloff: 25 });
    // Canoe glides around the chinampa and rocks with the physics.
    const c = chin.canoe;
    c.u = (c.u + dt * 0.011) % 1;
    const p = c.path.getPointAt(c.u);
    c.path.getTangentAt(c.u, canoeTangent);
    c.group.position.set(p.x, 0.02 + Math.sin(t * 1.4) * 0.04 * (1 + physics.energy), p.z);
    c.group.rotation.order = 'YXZ';
    c.group.rotation.y = Math.atan2(canoeTangent.x, canoeTangent.z);
    c.group.rotation.z = canoeBody.tx * 1.2 + Math.sin(t * 1.1) * 0.03;
    c.group.rotation.x = canoeBody.tz * 0.6;
    c.person.rotation.x = Math.sin(t * 0.9) * 0.08;
    // Axolotl swims a lazy loop in the west canal.
    const a = t * 0.22;
    const ax = chin.axolotl;
    ax.position.set(-7 + Math.cos(a) * 1.2, -0.55 + Math.sin(t * 0.8) * 0.08, 2 + Math.sin(a) * 5);
    ax.rotation.y = Math.atan2(-Math.cos(a) * 5, -Math.sin(a) * 1.2) + Math.sin(t * 6) * 0.12;
    // Lake life: lilies and ducks ride the waves, fish swim up and down the east canal.
    const nat = chin.nature;
    for (const l of nat.lilies) {
      l.position.y = 0.05 + waveHeight(l.position.x, l.position.z, t, physics);
      l.rotation.y = Math.sin(t * 0.2 + l.position.x) * 0.15;
    }
    nat.ducks.forEach((d, i) => {
      const da = t * 0.12 + d.userData.phase;
      const x = 11.6 + Math.cos(da) * 1.8 + i * 0.4,
        z = -13.4 + Math.sin(da) * 1.1;
      d.position.set(x, waveHeight(x, z, t, physics), z);
      d.rotation.order = 'YXZ';
      d.rotation.y = Math.atan2(-Math.cos(da) * 1.1, -Math.sin(da) * 1.8) + Math.PI;
      d.rotation.z = canoeBody.tx * 0.8;
    });
    const fz = Math.sin(t * 0.16) * 6.5;
    nat.fish.position.set(9.4 + Math.sin(t * 0.5) * 0.4, -0.75, fz);
    nat.fish.rotation.y = Math.cos(t * 0.16) >= 0 ? -Math.PI / 2 : Math.PI / 2;
    nat.fish.children.forEach((f, i) => (f.rotation.y = Math.sin(t * 5 + i) * 0.2));
  } else if (state.mode === 'city') {
    updateWater(city.water, t, physics, { amp: 0.18, scale: 0.6, sloshAmp: 0.02, falloff: 120 });
    city.pin.position.y = 13 + Math.sin(t * 2) * 0.8;
    city.pin.rotation.y = t * 0.8;
    city.canoes.children.forEach((c) => {
      c.position.y = 0.15 + Math.sin(t * 1.3 + c.userData.phase) * 0.08 * (1 + physics.energy);
      c.rotation.z = Math.sin(t * 1.1 + c.userData.phase) * 0.05 * (1 + physics.energy * 2);
    });
  }

  if (state.selected) setGlow(state.selected, 0.13 + Math.sin(t * 4) * 0.07);

  applyViewOffset(dt);
  processHover();
  // Depth pre-pass for the stylised water (skipped in the axonometric plan, which has no shader water).
  if (state.mode !== 'axo') waterDepth.render(scene, camera, [chin.water, city.water], t);
  renderer.shadowMap.needsUpdate = true;
  renderer.render(scene, camera);
  positionAxoLabels();
  positionPartLabels();
  positionMapLabels();
}

// Dev-only handle for inspecting the scene from the console.
if (import.meta.env.DEV) window.__chinamitl = { THREE, scene, chin, city, get camera() { return camera; }, get controls() { return controls; }, flyTo, state };

applyTheme(document.documentElement.dataset.theme);
applyLang();
setMode('chinampa');
camera.position.set(60, 45, 70);
controls.target.copy(VIEWS.chinampa.target);
flyTo(VIEWS.chinampa.pos, VIEWS.chinampa.target, 2.2);
animate();
