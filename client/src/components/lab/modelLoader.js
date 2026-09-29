import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

// -jr One loader and one cache for the whole lab. The room and the inspection
// viewer both ask for the same files; the second request reuses the first
// promise instead of downloading and parsing the model again.
const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

const cache = new Map();

// Resolves to the parsed glTF scene. `onProgress(loaded, total)` reports bytes.
export function loadModel(url, onProgress) {
  if (!cache.has(url)) {
    cache.set(
      url,
      new Promise((resolve, reject) => {
        loader.load(
          url,
          (gltf) => {
            // Copies share these; disposing a room must not free them.
            gltf.scene.traverse((child) => {
              if (!child.isMesh) return;
              child.geometry.userData.shared = true;
              if (child.material.map) child.material.map.userData.shared = true;
            });
            resolve(gltf.scene);
          },
          (event) => onProgress && onProgress(event.loaded, event.total),
          (error) => {
            cache.delete(url);
            reject(error);
          }
        );
      })
    );
  }
  return cache.get(url);
}

// -jr clone(true) shares geometry and materials with the cached scene, so a
// copy costs almost nothing. Callers that change materials must clone them.
export async function loadSpecimenCopy(url, onProgress) {
  const scene = await loadModel(url, onProgress);
  return scene.clone(true);
}

// Eigenvalues/vectors of a symmetric 3x3 matrix (Jacobi rotations).
function eigenSymmetric3(m) {
  const a = m.map((row) => row.slice());
  const v = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let sweep = 0; sweep < 32; sweep++) {
    let p = 0;
    let q = 1;
    if (Math.abs(a[0][2]) > Math.abs(a[p][q])) [p, q] = [0, 2];
    if (Math.abs(a[1][2]) > Math.abs(a[p][q])) [p, q] = [1, 2];
    if (Math.abs(a[p][q]) < 1e-12) break;
    const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
    const t = (theta >= 0 ? 1 : -1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
    const c = 1 / Math.sqrt(t * t + 1);
    const s = t * c;
    for (let k = 0; k < 3; k++) {
      const [akp, akq] = [a[k][p], a[k][q]];
      a[k][p] = c * akp - s * akq;
      a[k][q] = s * akp + c * akq;
    }
    for (let k = 0; k < 3; k++) {
      const [apk, aqk] = [a[p][k], a[q][k]];
      a[p][k] = c * apk - s * aqk;
      a[q][k] = s * apk + c * aqk;
    }
    for (let k = 0; k < 3; k++) {
      const [vkp, vkq] = [v[k][p], v[k][q]];
      v[k][p] = c * vkp - s * vkq;
      v[k][q] = s * vkp + c * vkq;
    }
  }
  return [0, 1, 2]
    .map((i) => ({ value: a[i][i], vector: new THREE.Vector3(v[0][i], v[1][i], v[2][i]) }))
    .sort((x, y) => x.value - y.value);
}

// -jr The scans come in whatever pose the scanner left them. The spread of
// their vertices (principal axes) tells the shape: the longest axis is
// turned upright and the thinnest towards the viewer, so an elongated test
// stands up and the Cycloclypeus disc shows its face instead of its edge.
function principalRotation(model) {
  model.updateMatrixWorld(true);
  const points = [];
  const p = new THREE.Vector3();
  model.traverse((child) => {
    if (!child.isMesh) return;
    const position = child.geometry.attributes.position;
    const step = Math.max(1, Math.floor(position.count / 20000));
    for (let i = 0; i < position.count; i += step) {
      points.push(p.fromBufferAttribute(position, i).applyMatrix4(child.matrixWorld).clone());
    }
  });
  const mean = points.reduce((sum, q) => sum.add(q), new THREE.Vector3()).divideScalar(points.length);
  const cov = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  points.forEach((q) => {
    const d = [q.x - mean.x, q.y - mean.y, q.z - mean.z];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) cov[i][j] += d[i] * d[j];
  });
  const [thin, middle, long] = eigenSymmetric3(cov).map((e) => e.vector);
  if (new THREE.Vector3().crossVectors(middle, long).dot(thin) < 0) middle.negate();
  // Rows of the rotation: middle -> x, long -> y, thin -> z.
  const basis = new THREE.Matrix4().set(
    middle.x, middle.y, middle.z, 0,
    long.x, long.y, long.z, 0,
    thin.x, thin.y, thin.z, 0,
    0, 0, 0, 1
  );
  return new THREE.Quaternion().setFromRotationMatrix(basis);
}

// Poses a model by its shape, scales it so its largest side is `size` and
// centres it on the origin. Returns a wrapper group to position freely.
export function fitModel(model, size) {
  const posed = new THREE.Group();
  posed.add(model);
  posed.quaternion.copy(principalRotation(model));
  posed.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(posed);
  const dimensions = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  posed.position.sub(center);

  const wrapper = new THREE.Group();
  wrapper.add(posed);
  wrapper.scale.setScalar(size / Math.max(dimensions.x, dimensions.y, dimensions.z));
  return wrapper;
}

// The scans carry no colour of their own (only the Cycloclypeus scan has a
// photo texture), so each specimen gets a soft calcite tint.
export function makeSpecimenMaterial(source, specimen, envMap) {
  const material = source.clone();
  material.side = THREE.DoubleSide;
  // Two scans were published half transparent to show the chambers inside;
  // the lab has its own X-ray and section modes for that.
  material.transparent = false;
  material.opacity = 1;
  material.depthWrite = true;
  material.envMap = envMap || null;
  if (material.map) {
    material.envMapIntensity = 0.35;
    material.roughness = 0.65;
    material.metalness = 0;
  } else {
    material.color = new THREE.Color(specimen.tint.base);
    material.emissive = new THREE.Color(specimen.tint.emissive);
    material.emissiveIntensity = 0.08;
    material.envMapIntensity = 0.6;
    material.roughness = 0.45;
    material.metalness = 0.05;
  }
  return material;
}

export function applySpecimenMaterials(model, specimen, envMap) {
  const materials = new Map();
  model.traverse((child) => {
    if (!child.isMesh) return;
    if (!materials.has(child.material)) {
      materials.set(child.material, makeSpecimenMaterial(child.material, specimen, envMap));
    }
    child.material = materials.get(child.material);
  });
  return [...materials.values()];
}
