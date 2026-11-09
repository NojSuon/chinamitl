import * as THREE from 'three';

// Stylised low-poly water: depth-tinted colour (teal shallows → deep blue) and broken,
// faceted foam wherever the water meets something (chinampa walls, stakes, causeways…).
//
// How it works: before the main render, objects that touch the water (tagged with
// WATER_LAYER) are drawn depth-only into a render target. The water shader compares
// its own depth with that scene depth to know how much water lies behind each pixel.

export const WATER_LAYER = 1;

// Mark an object (and its children) as something the water should react to.
export function touchesWater(obj) {
  obj.traverse((o) => o.layers.enable(WATER_LAYER));
  return obj;
}

const shared = {
  tDepth: { value: null },
  uResolution: { value: new THREE.Vector2(1, 1) },
  uNear: { value: 0.1 },
  uFar: { value: 1000 },
  uOrtho: { value: 0 },
  uTime: { value: 0 },
  uFoamGlow: { value: 0.35 }, // how much the foam glows; lowered at night
};

export function makeWaterMaterial({
  shallow = '#5fb8b2',
  deep = '#0f3b57',
  foam = '#eef6f3',
  depthRange = 2.5, // water thickness (scene units) at which the colour is fully "deep"
  foamWidth = 0.35, // thickness below which foam appears
  foamScale = 1.6, // size of the foam/shimmer triangles (bigger = smaller triangles)
  opacity = [0.72, 0.95], // shallow → deep
} = {}) {
  const material = new THREE.MeshStandardMaterial({
    color: shallow,
    flatShading: true,
    roughness: 0.28,
    metalness: 0.05,
    transparent: true,
  });
  const own = {
    uShallow: { value: new THREE.Color(shallow) },
    uDeep: { value: new THREE.Color(deep) },
    uFoam: { value: new THREE.Color(foam) },
    uDepthRange: { value: depthRange },
    uFoamWidth: { value: foamWidth },
    uFoamScale: { value: foamScale },
    uOpacity: { value: new THREE.Vector2(...opacity) },
  };
  material.userData.water = own;

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, shared, own);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
      .replace(
        '#include <project_vertex>',
        '#include <project_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;',
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <packing>',
        /* glsl */ `#include <packing>
varying vec3 vWPos;
uniform sampler2D tDepth;
uniform vec2 uResolution;
uniform float uNear, uFar, uOrtho, uTime, uFoamGlow;
uniform vec3 uShallow, uDeep, uFoam;
uniform float uDepthRange, uFoamWidth, uFoamScale;
uniform vec2 uOpacity;
float wHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float wViewZ(float d) {
  return uOrtho > 0.5 ? orthographicDepthToViewZ(d, uNear, uFar) : perspectiveDepthToViewZ(d, uNear, uFar);
}`,
      )
      .replace(
        '#include <color_fragment>',
        /* glsl */ `#include <color_fragment>
{
  vec2 suv = gl_FragCoord.xy / uResolution;
  float sceneZ = wViewZ(texture2D(tDepth, suv).x);
  float waterZ = wViewZ(gl_FragCoord.z);
  float thick = max(waterZ - sceneZ, 0.0);

  // Triangular lattice in world space: each triangle gets its own random value,
  // re-rolled now and then so the facets shimmer like the reference.
  vec2 g = vWPos.xz * uFoamScale;
  g.x += g.y * 0.5;
  vec2 cell = floor(g);
  vec2 f = fract(g);
  float tri = step(f.y, f.x);
  vec2 id = cell * 2.0 + vec2(tri, tri * 7.0);
  float seed = wHash(id);
  float n = wHash(id + floor(uTime * 0.9 + seed * 5.0));

  float depthT = smoothstep(0.0, uDepthRange, thick);
  vec3 col = mix(uShallow, uDeep, pow(depthT, 0.8));
  col *= 0.86 + 0.28 * n;
  // Pale rim of shallow water just outside the foam.
  col = mix(col, mix(uShallow, uFoam, 0.45), (1.0 - smoothstep(uFoamWidth, uFoamWidth * 2.2, thick)) * 0.6);

  // Foam: a crisp band hugging the shoreline, broken up per triangle.
  float edge = uFoamWidth * (0.45 + 1.1 * n);
  float foam = 1.0 - step(edge, thick);
  // A few stray foam triangles a little further out.
  foam = max(foam, step(0.93, n) * (1.0 - step(uFoamWidth * 2.6, thick)));

  diffuseColor.rgb = mix(col, uFoam, foam);
  diffuseColor.a = mix(mix(uOpacity.x, uOpacity.y, depthT), 1.0, foam);
  totalEmissiveRadiance += uFoam * foam * uFoamGlow;
}`,
      );
  };
  return material;
}

// Depth-only pre-pass of the objects that touch the water.
export class WaterDepth {
  constructor(renderer, scale = 1) {
    this.renderer = renderer;
    this.scale = scale;
    this.size = new THREE.Vector2();
    this.target = new THREE.WebGLRenderTarget(1, 1, {
      depthBuffer: true,
      depthTexture: new THREE.DepthTexture(1, 1, THREE.UnsignedIntType),
    });
    this.target.texture.generateMipmaps = false;
    this.depthOnly = new THREE.MeshBasicMaterial({ colorWrite: false });
    shared.tDepth.value = this.target.depthTexture;
    this.resize();
  }

  resize() {
    this.renderer.getDrawingBufferSize(this.size);
    shared.uResolution.value.copy(this.size);
    this.target.setSize(Math.max(1, Math.round(this.size.x * this.scale)), Math.max(1, Math.round(this.size.y * this.scale)));
  }

  render(scene, camera, waters, time) {
    shared.uTime.value = time;
    shared.uNear.value = camera.near;
    shared.uFar.value = camera.far;
    shared.uOrtho.value = camera.isOrthographicCamera ? 1 : 0;

    const r = this.renderer;
    const prevLayers = camera.layers.mask;
    const prevOverride = scene.overrideMaterial;
    const prevBg = scene.background;
    const vis = waters.map((w) => w.visible);
    waters.forEach((w) => (w.visible = false));
    camera.layers.set(WATER_LAYER);
    scene.overrideMaterial = this.depthOnly;
    scene.background = null;

    r.setRenderTarget(this.target);
    r.clear(true, true, false);
    r.render(scene, camera);
    r.setRenderTarget(null);

    scene.overrideMaterial = prevOverride;
    scene.background = prevBg;
    camera.layers.mask = prevLayers;
    waters.forEach((w, i) => (w.visible = vis[i]));
  }
}

/** Foam glow strength (emissive), e.g. lower for the dark theme so shores don't look lit up. */
export function setFoamGlow(v) {
  shared.uFoamGlow.value = v;
}
