// Builds the 3D Lab's specimen models from the original Sketchfab downloads.
//
// The originals are micro-CT scans of 0.25–2.8 million triangles each
// (~350 MB for all eight, one with an 8192 px texture). The lab only needs:
//   <id>.glb         ~40 k triangles, shown on the pedestals in the room
//   <id>-detail.glb  ~300 k triangles, loaded when a specimen is inspected
// Both are welded, simplified and meshopt-compressed, so the page downloads
// a few MB instead of hundreds. Lab.js decodes them with MeshoptDecoder.
//
// Usage (from client/, once):
//   npm i --no-save @gltf-transform/core@4 @gltf-transform/extensions@4 \
//     @gltf-transform/functions@4 meshoptimizer sharp
//   node scripts/optimize-lab-models.mjs
// Input:  src/assets/3d/*.glb      (originals, not bundled)
// Output: src/assets/3d/lab/*.glb  (what Lab.js imports)
//
// The asset.extras block (author, license, source) is kept in every output:
// the models are CC BY licensed and the lab shows those credits.

import fs from "fs";
import path from "path";
import { Logger, NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import {
  dedup, flatten, join, metalRough, meshopt, prune, simplify, textureCompress, weld,
} from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptSimplifier } from "meshoptimizer";
import sharp from "sharp";

const SRC = path.resolve("src/assets/3d");
const OUT = path.resolve("src/assets/3d/lab");

// Original file -> specimen id used by Lab.js
const MODELS = {
  "foraminifera_-_globigerinoides_ruber.glb": "globigerinoides_ruber",
  "foraminifera_-_globigerinella_calida.glb": "globigerinella_calida",
  "foraminifera_-_elphidium_sp..glb": "elphidium_sp",
  "foraminifera_-_bulimina_marginata.glb": "bulimina_marginata",
  "foraminifera_-_amphicoryna_scalaris.glb": "amphicoryna_scalaris",
  "foraminifera_-_trifarina_angulosa.glb": "trifarina_angulosa",
  "large_foraminifera_nhmw-geo-1996z01230002.glb": "cycloclypeus_carpenteri",
  "foraminifera_-_interwoven_microcosmos.glb": "interwoven_microcosmos",
};

const LEVELS = [
  { suffix: "", triangles: 40000, error: 0.02, textureSize: 1024 },
  { suffix: "-detail", triangles: 300000, error: 0.005, textureSize: 2048 },
];

const io = new NodeIO()
  .setLogger(new Logger(Logger.Verbosity.ERROR))
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder });

function countTriangles(document) {
  let triangles = 0;
  for (const mesh of document.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const indices = prim.getIndices();
      triangles += (indices ? indices.getCount() : prim.getAttribute("POSITION").getCount()) / 3;
    }
  }
  return Math.round(triangles);
}

// Some scans store a separate normal per triangle corner, so the same point
// appears up to five times and weld() cannot merge it -- which also stops
// simplify(). Dropping normals (and UVs where no texture uses them) lets
// weld() join by position; smoothNormals() puts normals back afterwards.
function stripSplitAttributes(document) {
  for (const mesh of document.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      prim.getAttribute("NORMAL")?.dispose();
      const textured = prim.getMaterial()?.getBaseColorTexture();
      if (!textured) prim.getAttribute("TEXCOORD_0")?.dispose();
    }
  }
}

// Area-weighted vertex normals over the welded, indexed mesh.
function smoothNormals(document) {
  for (const mesh of document.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const position = prim.getAttribute("POSITION").getArray();
      const index = prim.getIndices().getArray();
      const normal = new Float32Array(position.length);
      for (let i = 0; i < index.length; i += 3) {
        const a = index[i] * 3, b = index[i + 1] * 3, c = index[i + 2] * 3;
        const abx = position[b] - position[a], aby = position[b + 1] - position[a + 1], abz = position[b + 2] - position[a + 2];
        const acx = position[c] - position[a], acy = position[c + 1] - position[a + 1], acz = position[c + 2] - position[a + 2];
        const nx = aby * acz - abz * acy, ny = abz * acx - abx * acz, nz = abx * acy - aby * acx;
        for (const v of [a, b, c]) {
          normal[v] += nx;
          normal[v + 1] += ny;
          normal[v + 2] += nz;
        }
      }
      for (let v = 0; v < normal.length; v += 3) {
        const length = Math.hypot(normal[v], normal[v + 1], normal[v + 2]) || 1;
        normal[v] /= length;
        normal[v + 1] /= length;
        normal[v + 2] /= length;
      }
      prim.setAttribute("NORMAL", document.createAccessor().setType("VEC3").setArray(normal));
    }
  }
}

await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;
fs.mkdirSync(OUT, { recursive: true });

for (const [file, id] of Object.entries(MODELS)) {
  const input = path.join(SRC, file);
  if (!fs.existsSync(input)) {
    console.warn(`skip ${file}: not found`);
    continue;
  }

  for (const level of LEVELS) {
    const document = await io.read(input);
    const before = countTriangles(document);

    // three.js dropped KHR_materials_pbrSpecularGlossiness, so the NHMW
    // scan's texture was invisible; metalRough moves it to the standard slot.
    await document.transform(metalRough());
    stripSplitAttributes(document);
    await document.transform(dedup(), flatten(), join(), weld());

    const ratio = Math.min(1, level.triangles / countTriangles(document));
    await document.transform(simplify({ simplifier: MeshoptSimplifier, ratio, error: level.error }));
    smoothNormals(document);

    await document.transform(
      textureCompress({ encoder: sharp, targetFormat: "webp", resize: [level.textureSize, level.textureSize] }),
      prune(),
      meshopt({ encoder: MeshoptEncoder, level: "high" }),
    );

    const output = path.join(OUT, `${id}${level.suffix}.glb`);
    await io.write(output, document);
    const kb = Math.round(fs.statSync(output).size / 1024);
    console.log(`${id}${level.suffix}: ${before} -> ${countTriangles(document)} triangles, ${kb} KB`);
  }
}
