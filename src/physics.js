import * as THREE from 'three';

// "Inertia" physics: when the camera orbits or pans, the scene behaves as if the
// chinampa itself were being turned and dragged. Plants and trees lean against the
// motion on damped springs, the canoe rocks and the water sloshes, then everything settles.
export class MotionPhysics {
  constructor() {
    this.bodies = [];
    this.enabled = true;
    this.energy = 0;
    this.slosh = { x: 0, z: 0, vx: 0, vz: 0 };
    this.prev = null;
    this.omega = 0; // smoothed apparent yaw speed of the world (rad/s)
    this.omegaP = 0; // smoothed apparent pitch speed
    this.pan = new THREE.Vector3(); // smoothed apparent world velocity from panning
    this._off = new THREE.Vector3();
    this._p = new THREE.Vector3();
  }

  setBodies(list) {
    for (const b of list) {
      if (!b.base) b.base = b.obj.quaternion.clone();
      b.tx = b.tz = b.vx = b.vz = 0;
    }
    this.bodies = list;
  }

  reset() {
    this.prev = null;
    this.omega = this.omegaP = 0;
    this.pan.set(0, 0, 0);
  }

  update(dt, camera, target, time) {
    dt = Math.min(Math.max(dt, 1 / 240), 1 / 30);
    const off = this._off.copy(camera.position).sub(target);
    const len = off.length() || 1;
    const az = Math.atan2(off.x, off.z);
    const pol = Math.acos(THREE.MathUtils.clamp(off.y / len, -1, 1));

    let w = 0,
      wp = 0;
    const panV = new THREE.Vector3();
    if (this.prev) {
      let dAz = az - this.prev.az;
      if (dAz > Math.PI) dAz -= Math.PI * 2;
      if (dAz < -Math.PI) dAz += Math.PI * 2;
      w = -dAz / dt; // the world appears to rotate opposite to the camera
      wp = -(pol - this.prev.pol) / dt;
      panV.copy(target).sub(this.prev.target).multiplyScalar(-1 / dt);
    }
    this.prev = { az, pol, target: target.clone() };
    if (!this.enabled) {
      w = wp = 0;
      panV.set(0, 0, 0);
    }
    const a = 1 - Math.exp(-dt * 18);
    this.omega += (w - this.omega) * a;
    this.omegaP += (wp - this.omegaP) * a;
    this.pan.lerp(panV, a);
    // Pan speed scales with zoom distance; normalise so it feels the same near and far.
    const panN = this._p.copy(this.pan).multiplyScalar(18 / len);

    const targetEnergy = Math.min(3, Math.abs(this.omega) * 0.7 + Math.abs(this.omegaP) * 0.7 + panN.length() * 0.06);
    this.energy += (targetEnergy - this.energy) * (1 - Math.exp(-dt * (targetEnergy > this.energy ? 6 : 1.2)));

    // Camera-right axis, used for the pitch rotation.
    const rx = Math.cos(az),
      rz = -Math.sin(az);

    const p = new THREE.Vector3();
    const euler = new THREE.Euler();
    const q = new THREE.Quaternion();
    for (const b of this.bodies) {
      if (!b.obj.visible && !b.manual) continue;
      b.obj.getWorldPosition(p).sub(target);
      // Keep a minimum lever arm so objects near the pivot still react.
      const plen = Math.hypot(p.x, p.z);
      const s = plen < 6 ? 6 / Math.max(plen, 0.001) : 1;
      const px = p.x * s,
        pz = p.z * s;
      // Apparent world velocity at this point: yaw (Ω × p) + pitch + pan.
      let vx = this.omega * pz + panN.x;
      let vz = -this.omega * px + panN.z;
      vx += this.omegaP * rx * 3;
      vz += this.omegaP * rz * 3;
      // Lean against the motion (drag) + a gentle idle breeze.
      const breeze = Math.sin(time * 1.3 + p.x * 0.3 + p.z * 0.2) * 0.25 + Math.sin(time * 2.1 + p.z) * 0.1;
      const fx = (-vx * 0.06 + breeze * 0.15) * b.gain;
      const fz = (-vz * 0.06 + breeze * 0.08) * b.gain;
      b.vx += (fx - b.k * b.tx - b.c * b.vx) * dt;
      b.vz += (fz - b.k * b.tz - b.c * b.vz) * dt;
      b.tx = THREE.MathUtils.clamp(b.tx + b.vx * dt, -b.max, b.max);
      b.tz = THREE.MathUtils.clamp(b.tz + b.vz * dt, -b.max, b.max);
      if (b.manual) continue;
      // Lean toward +x = rotate about -z, lean toward +z = rotate about +x.
      euler.set(b.tz, 0, -b.tx);
      q.setFromEuler(euler);
      b.obj.quaternion.copy(b.base).premultiply(q);
    }

    // Water slosh: a single damped spring tilting the surface.
    const sl = this.slosh;
    const sfx = -panN.x * 0.02 + this.omega * 0.08 * Math.sin(time * 0.7);
    const sfz = -panN.z * 0.02 + this.omega * 0.08 * Math.cos(time * 0.7);
    sl.vx += (sfx - 9 * sl.x - 1.4 * sl.vx) * dt;
    sl.vz += (sfz - 9 * sl.z - 1.4 * sl.vz) * dt;
    sl.x = THREE.MathUtils.clamp(sl.x + sl.vx * dt, -0.6, 0.6);
    sl.z = THREE.MathUtils.clamp(sl.z + sl.vz * dt, -0.6, 0.6);
  }
}

// Animate a low-poly water plane created with waterSurface().
export function updateWater(water, time, physics, { amp = 0.06, scale = 1, sloshAmp = 0.05, falloff = 30 } = {}) {
  const pos = water.geometry.attributes.position;
  const base = water.userData.base;
  const e = 1 + physics.energy * 1.8;
  const sl = physics.slosh;
  const sw = physics.omega * 0.12; // swirl ripple from rotation
  for (let i = 0; i < pos.count; i++) {
    const x = base[i * 3] * scale;
    const z = base[i * 3 + 2] * scale;
    const rr = Math.hypot(x, z);
    const fall = Math.exp(-rr / falloff);
    let y =
      amp *
      e *
      (Math.sin(x * 0.35 + time * 1.2) + 0.8 * Math.sin(z * 0.42 - time * 0.9) + 0.3 * Math.sin((x + z) * 0.9 + time * 2.2));
    y += (sl.x * x + sl.z * z) * sloshAmp * fall;
    y += sw * Math.sin(Math.atan2(z, x) * 3 + rr * 0.4 - time * 3) * fall;
    pos.setY(i, y);
  }
  pos.needsUpdate = true;
}
