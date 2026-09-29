import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════════════
// LAB ROOM — static scenery: walls, windows, garden, furniture, equipment.
// Interactive things (vitrines, boards, stations) are built in labWorld.js.
// Every builder returns what the world needs: obstacles to walk around and
// hit boxes to click.
// ═══════════════════════════════════════════════════════════════════════════

export const ROOM = { W: 24, H: 7, D: 20 };

// Axis-aligned boxes on the floor plan (x0, x1, z0, z1) the visitor cannot
// walk through.
const box = (x0, x1, z0, z1) => ({ x0, x1, z0, z1 });

const WINDOWS_X = [-7, 0, 7];
const WINDOW = { w: 2.4, h: 3.0, y: 4.1 };

// ─── ROOM SHELL ─────────────────────────────────────────────────────────────
function floorTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const colors = ["#e2d8c5", "#c8baa5"];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      ctx.fillStyle = colors[(i + j) % 2];
      ctx.fillRect(i * 128, j * 128, 128, 128);
    }
  }
  ctx.strokeStyle = "rgba(90, 75, 55, 0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 254, 254);
  ctx.beginPath();
  ctx.moveTo(128, 0);
  ctx.lineTo(128, 256);
  ctx.moveTo(0, 128);
  ctx.lineTo(256, 128);
  ctx.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  // One canvas holds 2 x 2 tiles of 1 m.
  texture.repeat.set(ROOM.W / 2, ROOM.D / 2);
  texture.anisotropy = 8;
  return texture;
}

export function buildRoom(scene) {
  const { W, H, D } = ROOM;

  // -jr One floor mesh with a tiled texture instead of 480 tile meshes: the
  // GPU draws it in one call.
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(W, D),
    new THREE.MeshStandardMaterial({ map: floorTexture(), roughness: 0.38, metalness: 0.02 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.name = "floor";
  scene.add(floor);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ color: 0xf8f5ee, roughness: 0.95 }));
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = H;
  scene.add(ceil);

  const wallUpper = new THREE.MeshStandardMaterial({ color: 0xf0ece0, roughness: 0.85 });
  const wallLower = new THREE.MeshStandardMaterial({ color: 0xd0c8b0, roughness: 0.65, metalness: 0.05 });
  const wallSideUpper = new THREE.MeshStandardMaterial({ color: 0xeae6d8, roughness: 0.85 });
  const wallSideLower = new THREE.MeshStandardMaterial({ color: 0xc8c0a8, roughness: 0.65, metalness: 0.05 });
  const railMat = new THREE.MeshStandardMaterial({ color: 0x8a7454, roughness: 0.4 });

  const wallDefs = [
    { pos: [0, 0, -D / 2], ry: 0, w: W, upper: wallUpper, lower: wallLower, windows: true },
    { pos: [0, 0, D / 2], ry: Math.PI, w: W, upper: wallUpper, lower: wallLower },
    { pos: [-W / 2, 0, 0], ry: Math.PI / 2, w: D, upper: wallSideUpper, lower: wallSideLower },
    { pos: [W / 2, 0, 0], ry: -Math.PI / 2, w: D, upper: wallSideUpper, lower: wallSideLower },
  ];

  wallDefs.forEach(({ pos, ry, w, upper, lower, windows }) => {
    let upperGeometry;
    if (windows) {
      // The back wall has real openings, so the garden shows through them.
      const shape = new THREE.Shape();
      shape.moveTo(-w / 2, 0);
      shape.lineTo(w / 2, 0);
      shape.lineTo(w / 2, H - 2.5);
      shape.lineTo(-w / 2, H - 2.5);
      shape.closePath();
      WINDOWS_X.forEach((x) => {
        const hole = new THREE.Path();
        const y0 = WINDOW.y - WINDOW.h / 2 - 2.5;
        hole.moveTo(x - WINDOW.w / 2, y0);
        hole.lineTo(x - WINDOW.w / 2, y0 + WINDOW.h);
        hole.lineTo(x + WINDOW.w / 2, y0 + WINDOW.h);
        hole.lineTo(x + WINDOW.w / 2, y0);
        hole.closePath();
        shape.holes.push(hole);
      });
      upperGeometry = new THREE.ShapeGeometry(shape);
    } else {
      upperGeometry = new THREE.PlaneGeometry(w, H - 2.5).translate(0, (H - 2.5) / 2, 0);
    }
    const uw = new THREE.Mesh(upperGeometry, upper);
    uw.position.set(pos[0], 2.5, pos[2]);
    uw.rotation.y = ry;
    scene.add(uw);

    const lw = new THREE.Mesh(new THREE.PlaneGeometry(w, 2.5), lower);
    lw.position.set(pos[0], 1.25, pos[2]);
    lw.rotation.y = ry;
    scene.add(lw);

    const rail = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, 0.04), railMat);
    rail.position.set(pos[0], 2.5, pos[2]);
    rail.rotation.y = ry;
    scene.add(rail);
  });

  const windowGlass = [];
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xf0ece0, roughness: 0.4 });
  const sillMat = new THREE.MeshStandardMaterial({ color: 0xd0c0a0, roughness: 0.4, metalness: 0.05 });
  WINDOWS_X.forEach((x) => {
    const z = -D / 2;
    const { w, h, y } = WINDOW;
    // Frame bars around the opening (a solid box would cover the view).
    [
      [w + 0.3, 0.15, 0, h / 2 + 0.075],
      [w + 0.3, 0.15, 0, -h / 2 - 0.075],
      [0.15, h, -w / 2 - 0.075, 0],
      [0.15, h, w / 2 + 0.075, 0],
      [w, 0.06, 0, 0],
      [0.06, h, 0, 0],
    ].forEach(([bw, bh, dx, dy]) => {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.14), frameMat);
      bar.position.set(x + dx, y + dy, z + 0.02);
      scene.add(bar);
    });

    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: 0x90d9f0, transparent: true, opacity: 0.12, depthWrite: false })
    );
    glass.position.set(x, y, z + 0.03);
    scene.add(glass);
    windowGlass.push(glass);

    const sill = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.14, 0.5), sillMat);
    sill.position.set(x, 2.5, z + 0.3);
    scene.add(sill);
    addPottedPlant(scene, x - 0.8, 2.57, z + 0.3);
    addPottedPlant(scene, x + 0.8, 2.57, z + 0.3);
  });

  const baseMat = new THREE.MeshStandardMaterial({ color: 0x8a7454, roughness: 0.5 });
  const crownMat = new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.5 });
  [
    [W, [0, -D / 2 + 0.04], 0],
    [W, [0, D / 2 - 0.04], Math.PI],
    [D, [-W / 2 + 0.04, 0], Math.PI / 2],
    [D, [W / 2 - 0.04, 0], -Math.PI / 2],
  ].forEach(([length, [x, z], ry]) => {
    const skirting = new THREE.Mesh(new THREE.BoxGeometry(length, 0.2, 0.07), baseMat);
    skirting.position.set(x, 0.1, z);
    skirting.rotation.y = ry;
    scene.add(skirting);
    const crown = new THREE.Mesh(new THREE.BoxGeometry(length, 0.15, 0.1), crownMat);
    crown.position.set(x, H - 0.08, z);
    crown.rotation.y = ry;
    scene.add(crown);
  });

  // Pendant lamps; each carries a real point light.
  const housingMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.3, metalness: 0.7 });
  const glowMat = new THREE.MeshStandardMaterial({ color: 0xfff8e0, emissive: 0xfff8d0, emissiveIntensity: 1.5 });
  [[-6, -4], [0, -4], [6, -4], [-6, 4], [0, 4], [6, 4]].forEach(([lx, lz]) => {
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 1.2, 6), housingMat);
    cord.position.set(lx, H - 0.6, lz);
    scene.add(cord);
    const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 0.2, 12), housingMat);
    housing.position.set(lx, H - 1.2, lz);
    scene.add(housing);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), glowMat);
    bulb.position.set(lx, H - 1.35, lz);
    scene.add(bulb);
    const light = new THREE.PointLight(0xfff0cc, 1.6, 12, 1.5);
    light.position.set(lx, H - 1.5, lz);
    scene.add(light);
  });

  return { floor, windowGlass };
}

function addPottedPlant(scene, x, y, z) {
  const potMat = new THREE.MeshStandardMaterial({ color: 0x9b5533, roughness: 0.7 });
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.075, 0.16, 10), potMat);
  pot.position.set(x, y + 0.08, z);
  scene.add(pot);
  const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.025, 8), new THREE.MeshStandardMaterial({ color: 0x3d2b10, roughness: 1 }));
  soil.position.set(x, y + 0.17, z);
  scene.add(soil);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2d8a2d, roughness: 0.75 });
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2;
    const r = 0.06 + ((i * 37) % 10) / 250;
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.05, 5, 5), leafMat);
    leaf.position.set(x + Math.cos(ang) * r, y + 0.24 + ((i * 53) % 15) / 100, z + Math.sin(ang) * r);
    leaf.scale.y = 0.75;
    scene.add(leaf);
  }
}

// ─── GARDEN (seen through the windows) ──────────────────────────────────────
export function buildGarden(scene) {
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(120, 80), new THREE.MeshStandardMaterial({ color: 0x4a8f3f, roughness: 0.9 }));
  grass.rotation.x = -Math.PI / 2;
  grass.position.set(0, -0.02, -50);
  scene.add(grass);

  const patchColors = [0x3d7a34, 0x55a04a, 0x3a7030, 0x4d9040, 0x2a6a22];
  for (let i = 0; i < 20; i++) {
    const patch = new THREE.Mesh(
      new THREE.CircleGeometry(2 + Math.random() * 3, 10),
      new THREE.MeshStandardMaterial({ color: patchColors[i % patchColors.length], roughness: 0.9 })
    );
    patch.rotation.x = -Math.PI / 2;
    patch.position.set((Math.random() - 0.5) * 40, -0.01, -12 - Math.random() * 25);
    scene.add(patch);
  }

  [
    [-16, -18, 1.2], [-9, -23, 1.0], [0, -28, 1.5], [9, -23, 1.1], [16, -18, 1.3],
    [-22, -14, 0.9], [22, -14, 1.0], [-18, -22, 0.8], [18, -22, 1.1],
    [-12, -30, 1.4], [12, -30, 1.2], [0, -35, 1.6], [-25, -20, 0.7], [25, -20, 0.8],
  ].forEach(([tx, tz, scale]) => addTree(scene, tx, tz, scale));

  const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x2d6e2d, roughness: 0.85 });
  for (let hx = -10; hx <= 10; hx += 1.5) {
    const hedge = new THREE.Mesh(new THREE.SphereGeometry(0.6, 6, 5), hedgeMat);
    hedge.position.set(hx, 0.25, -11);
    hedge.scale.set(1.5, 0.8, 1);
    scene.add(hedge);
  }

  addFlowerBeds(scene);

  const pathMat = new THREE.MeshStandardMaterial({ color: 0xb8a882, roughness: 0.8 });
  for (let i = 0; i < 12; i++) {
    const stone = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.04, 7), pathMat);
    stone.position.set((Math.random() - 0.5) * 0.8, 0.01, -11.5 - i * 1.3);
    stone.rotation.y = Math.random() * Math.PI;
    scene.add(stone);
  }

  const benchWood = new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.6 });
  const benchMetal = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.3, metalness: 0.8 });
  const bench = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(2, 0.08, 0.45), benchWood);
  seat.position.y = 0.5;
  bench.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.06), benchWood);
  back.position.set(0, 0.8, -0.2);
  bench.add(back);
  for (const bx of [-0.8, 0.8]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.4), benchMetal);
    leg.position.set(bx, 0.25, 0);
    bench.add(leg);
  }
  bench.position.set(5, 0, -14);
  bench.rotation.y = Math.PI;
  scene.add(bench);
}

function addTree(scene, x, z, s) {
  const h = (3 + Math.random() * 2) * s;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * s, 0.3 * s, h, 8), new THREE.MeshStandardMaterial({ color: 0x5a3820, roughness: 0.9 }));
  trunk.position.set(x, h / 2, z);
  scene.add(trunk);
  const leafColors = [0x2d6e2d, 0x3a8a3a, 0x257825, 0x1f6b1f, 0x458a45];
  const leaves = new THREE.MeshStandardMaterial({ color: leafColors[Math.floor(Math.random() * leafColors.length)], roughness: 0.8 });
  [
    [0, h + 1.5 * s, 0, 2.0 * s],
    [0.8 * s, h + 0.8 * s, 0.5 * s, 1.5 * s],
    [-0.7 * s, h + 1.0 * s, -0.4 * s, 1.4 * s],
    [0.3 * s, h + 2.2 * s, -0.3 * s, 1.6 * s],
    [-0.4 * s, h + 1.8 * s, 0.6 * s, 1.2 * s],
  ].forEach(([lx, ly, lz, r]) => {
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 7), leaves);
    canopy.position.set(x + lx, ly, z + lz);
    scene.add(canopy);
  });
}

// -jr ~140 flowers of 8 parts each used to be 1100 separate meshes. Three
// InstancedMeshes draw the same thing in three GPU calls.
function addFlowerBeds(scene) {
  const beds = [
    { x: -7, z: -14, n: 18 }, { x: 0, z: -14, n: 22 }, { x: 7, z: -14, n: 18 },
    { x: -12, z: -16, n: 12 }, { x: 12, z: -16, n: 12 },
    { x: -5, z: -18, n: 10 }, { x: 5, z: -18, n: 10 },
    { x: -8, z: -20, n: 8 }, { x: 8, z: -20, n: 8 },
  ];
  const flowers = [];
  beds.forEach(({ x, z, n }) => {
    for (let i = 0; i < n; i++) {
      flowers.push({ x: x + (Math.random() - 0.5) * 4, z: z + (Math.random() - 0.5) * 3, h: 0.25 + Math.random() * 0.25, turn: Math.random() * Math.PI * 2 });
    }
  });

  const petalColors = [0xff6b6b, 0xffb347, 0xffd700, 0xff69b4, 0x9b59b6, 0x3498db, 0xe74c3c, 0xff8c00, 0xffffff, 0xff1493, 0xff4500, 0xda70d6];
  const stems = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.015, 0.015, 1, 5), new THREE.MeshStandardMaterial({ color: 0x2d8a2d, roughness: 0.9 }), flowers.length);
  const centres = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.038, 6, 6),
    new THREE.MeshStandardMaterial({ color: 0xffee00, roughness: 0.5, emissive: 0xffaa00, emissiveIntensity: 0.2 }),
    flowers.length
  );
  const petals = new THREE.InstancedMesh(new THREE.SphereGeometry(0.05, 5, 5), new THREE.MeshStandardMaterial({ roughness: 0.5 }), flowers.length * 6);

  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const color = new THREE.Color();
  flowers.forEach((f, i) => {
    stems.setMatrixAt(i, m.compose(new THREE.Vector3(f.x, f.h / 2, f.z), q.identity(), new THREE.Vector3(1, f.h, 1)));
    centres.setMatrixAt(i, m.makeTranslation(f.x, f.h + 0.01, f.z));
    color.setHex(petalColors[i % petalColors.length]);
    for (let k = 0; k < 6; k++) {
      const a = f.turn + (k / 6) * Math.PI * 2;
      const index = i * 6 + k;
      petals.setMatrixAt(index, m.compose(new THREE.Vector3(f.x + Math.cos(a) * 0.08, f.h, f.z + Math.sin(a) * 0.08), q.identity(), new THREE.Vector3(1, 0.5, 1)));
      petals.setColorAt(index, color);
    }
  });
  scene.add(stems, centres, petals);
}

// ─── FURNITURE ──────────────────────────────────────────────────────────────
export function buildFurniture(scene) {
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x6b5020, roughness: 0.5, metalness: 0.05 });
  const darkWood = new THREE.MeshStandardMaterial({ color: 0x4d3520, roughness: 0.6 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0xa8b0b8, roughness: 0.25, metalness: 0.85 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.35 });
  const counterMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.2, metalness: 0.3 });
  const obstacles = [];

  // Main bench across the back half; shorter than the room so both ends can
  // be walked around.
  const benchTop = new THREE.Mesh(new THREE.BoxGeometry(15, 0.1, 2.0), counterMat);
  benchTop.position.set(0, 0.93, -1.0);
  scene.add(benchTop);
  const benchBody = new THREE.Mesh(new THREE.BoxGeometry(15, 0.85, 1.8), woodMat);
  benchBody.position.set(0, 0.43, -1.0);
  scene.add(benchBody);
  obstacles.push(box(-7.5, 7.5, -2, 0));
  const drawerMat = new THREE.MeshStandardMaterial({ color: 0x5a4218, roughness: 0.5 });
  for (let dx = -6.25; dx <= 6.25; dx += 2.5) {
    const drawer = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, 0.04), drawerMat);
    drawer.position.set(dx, 0.65, -0.08);
    scene.add(drawer);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.03, 0.04), metalMat);
    handle.position.set(dx, 0.65, -0.06);
    scene.add(handle);
  }

  // Side counters under the wall boards.
  [-10.5, 10.5].forEach((sx) => {
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 10), counterMat);
    top.position.set(sx, 0.93, 0);
    scene.add(top);
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.85, 10), woodMat);
    body.position.set(sx, 0.43, 0);
    scene.add(body);
    obstacles.push(box(sx - 0.35, sx + 0.35, -5, 5));
  });

  // Bookshelves on the back wall, between the windows.
  const bookColors = [0x8b0000, 0x006400, 0x00008b, 0x8b4513, 0x4b0082, 0x2f4f4f, 0x8b6914, 0x800080];
  const bookMats = bookColors.map((color) => new THREE.MeshStandardMaterial({ color, roughness: 0.7 }));
  [-3.5, 3.5].forEach((sx) => {
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x5a4020, roughness: 0.6 });
    [-2.0, 2.0].forEach((dx) => {
      const side = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.5, 0.4), frameMat);
      side.position.set(sx + dx, 1.75, -9.7);
      scene.add(side);
    });
    const backPanel = new THREE.Mesh(new THREE.BoxGeometry(4.1, 3.5, 0.04), frameMat);
    backPanel.position.set(sx, 1.75, -9.92);
    scene.add(backPanel);
    [0.3, 1.1, 1.9, 2.7].forEach((sy) => {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.06, 0.38), darkWood);
      shelf.position.set(sx, sy, -9.7);
      scene.add(shelf);
      let bx = sx - 1.9;
      for (let bi = 0; bi < 14 && bx < sx + 1.75; bi++) {
        const bw = 0.06 + Math.random() * 0.1;
        const bh = 0.35 + Math.random() * 0.3;
        const book = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.25), bookMats[bi % bookMats.length]);
        book.position.set(bx + bw / 2, sy + bh / 2 + 0.03, -9.65);
        book.rotation.z = (Math.random() - 0.5) * 0.05;
        scene.add(book);
        bx += bw + 0.02;
      }
    });
    obstacles.push(box(sx - 2.1, sx + 2.1, -10, -9.4));
  });

  // Stools at the bench, clear of the exhibit aisle.
  const seatMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.4 });
  [-5.5, -0.9, 4, 6].forEach((cx) => {
    const stool = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.06, 12), seatMat);
    seat.position.y = 0.6;
    stool.add(seat);
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), metalMat);
    column.position.y = 0.35;
    stool.add(column);
    for (let i = 0; i < 5; i++) {
      const ang = (i / 5) * Math.PI * 2;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 5), metalMat);
      leg.rotation.z = Math.PI / 2;
      leg.rotation.y = -ang;
      leg.position.set(Math.cos(ang) * 0.12, 0.08, Math.sin(ang) * 0.12);
      stool.add(leg);
    }
    stool.position.set(cx, 0, 0.6);
    scene.add(stool);
  });

  // Glass-door cabinets in the back right corner.
  const glassDoor = new THREE.MeshBasicMaterial({ color: 0xd0e8ff, transparent: true, opacity: 0.3 });
  const lowerDoor = new THREE.MeshStandardMaterial({ color: 0xe5e5e5, roughness: 0.3 });
  [-8.2, -5.6].forEach((cz) => {
    const cab = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.2, 0.6), whiteMat);
    body.position.y = 1.1;
    cab.add(body);
    [-0.32, 0.32].forEach((dx) => {
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.58, 1.0, 0.03), glassDoor);
      upper.position.set(dx, 1.6, 0.32);
      cab.add(upper);
      const lower = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.7, 0.04), lowerDoor);
      lower.position.set(dx, 0.6, 0.32);
      cab.add(lower);
    });
    cab.position.set(9.6, 0, cz);
    cab.rotation.y = -Math.PI / 2;
    scene.add(cab);
    obstacles.push(box(9.2, 10, cz - 0.7, cz + 0.7));
  });

  return { obstacles };
}

// ─── MICROSCOPE (a clickable station) ───────────────────────────────────────
export function buildMicroscope(scene) {
  const group = new THREE.Group();
  const blk = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.25, metalness: 0.65 });
  const chr = new THREE.MeshStandardMaterial({ color: 0xd0d8e0, roughness: 0.15, metalness: 0.95 });
  const gls = new THREE.MeshBasicMaterial({ color: 0x70b8ff, transparent: true, opacity: 0.8 });
  const gry = new THREE.MeshStandardMaterial({ color: 0x505060, roughness: 0.35, metalness: 0.55 });

  group.add(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.32), blk));
  const arm1 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.45, 0.07), blk);
  arm1.position.set(-0.12, 0.27, 0);
  group.add(arm1);
  const arm2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.07, 0.07), blk);
  arm2.position.set(-0.08, 0.52, 0);
  group.add(arm2);
  const stage = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.025, 12), gry);
  stage.position.set(0.02, 0.22, 0);
  group.add(stage);
  const cond = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.028, 0.1, 8), chr);
  cond.position.set(0.02, 0.16, 0);
  group.add(cond);
  const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.035, 12), blk);
  turret.position.set(0.02, 0.48, 0);
  group.add(turret);
  [0xffcc00, 0x00cc00, 0x0066cc, 0xcc0000].forEach((color, i) => {
    const ang = (i / 4) * Math.PI * 2;
    const objective = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.014, 0.1, 8), chr);
    objective.position.set(0.02 + Math.cos(ang) * 0.045, 0.42, Math.sin(ang) * 0.045);
    group.add(objective);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.021, 0.021, 0.015, 8), new THREE.MeshStandardMaterial({ color, roughness: 0.3 }));
    band.position.set(0.02 + Math.cos(ang) * 0.045, 0.39, Math.sin(ang) * 0.045);
    group.add(band);
  });
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.15, 8), blk);
  tube.position.set(-0.02, 0.58, 0);
  tube.rotation.z = 0.3;
  group.add(tube);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.12), blk);
  head.position.set(-0.06, 0.67, 0);
  head.rotation.z = 0.3;
  group.add(head);
  for (const eo of [-0.04, 0.04]) {
    const eyepiece = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.02, 0.08, 8), chr);
    eyepiece.position.set(-0.08, 0.72, eo);
    eyepiece.rotation.z = 0.3;
    group.add(eyepiece);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.02, 8), gls);
    lens.position.set(-0.09, 0.77, eo);
    group.add(lens);
  }
  for (const fz of [0.09, -0.09]) {
    const coarse = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.025, 10), chr);
    coarse.rotation.x = Math.PI / 2;
    coarse.position.set(-0.12, 0.28, fz);
    group.add(coarse);
  }
  const led = new THREE.Mesh(
    new THREE.TorusGeometry(0.04, 0.008, 6, 20),
    new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffffcc, emissiveIntensity: 2.5 })
  );
  led.position.set(0.02, 0.24, 0);
  led.rotation.x = Math.PI / 2;
  group.add(led);
  const slide = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.004, 0.08), new THREE.MeshBasicMaterial({ color: 0xc8deff, transparent: true, opacity: 0.6 }));
  slide.position.set(0.02, 0.235, 0);
  group.add(slide);

  // Eyepieces (local -x) face the visitor at the front of the bench.
  group.scale.setScalar(2.2);
  group.rotation.y = Math.PI / 2;
  group.position.set(4, 0.98, -0.8);
  scene.add(group);

  return { position: new THREE.Vector3(4, 1.85, -0.8), size: [1.0, 1.8, 1.0] };
}

// ─── BENCH EQUIPMENT ────────────────────────────────────────────────────────
export function buildLabEquipment(scene) {
  const glassMat = new THREE.MeshBasicMaterial({ color: 0xd0e8ff, transparent: true, opacity: 0.35 });
  const liquidColors = [0x3498db, 0x2ecc71, 0xe74c3c, 0xf1c40f, 0x9b59b6, 0xe67e22];

  [-5.5, -4.9, 5.5, 6.1].forEach((bx, bi) => {
    const beaker = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.2, 10, 1, true), glassMat);
    body.position.y = 0.1;
    beaker.add(body);
    const liquidHeight = 0.08 + ((bi * 29) % 8) / 100;
    const liquid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, liquidHeight, 10),
      new THREE.MeshStandardMaterial({ color: liquidColors[bi % liquidColors.length], transparent: true, opacity: 0.7, roughness: 0.1 })
    );
    liquid.position.y = liquidHeight / 2 + 0.01;
    beaker.add(liquid);
    beaker.position.set(bx, 0.98, -0.5);
    scene.add(beaker);
  });

  const rackMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.4, metalness: 0.6 });
  const rack = new THREE.Group();
  rack.add(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.12), rackMat));
  const rackTop = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.12), rackMat);
  rackTop.position.y = 0.18;
  rack.add(rackTop);
  const tubeMat = new THREE.MeshBasicMaterial({ color: 0xd8e8ff, transparent: true, opacity: 0.4 });
  for (let ti = 0; ti < 6; ti++) {
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8, 1, true), tubeMat);
    tube.position.set(-0.2 + ti * 0.08, 0.11, 0);
    rack.add(tube);
    const h = 0.04 + ((ti * 17) % 10) / 100;
    const liquid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.013, 0.013, h, 8),
      new THREE.MeshStandardMaterial({ color: liquidColors[ti % liquidColors.length], transparent: true, opacity: 0.8 })
    );
    liquid.position.set(-0.2 + ti * 0.08, h / 2, 0);
    rack.add(liquid);
  }
  rack.position.set(-2, 0.98, -0.4);
  scene.add(rack);

  [-3.2, 2].forEach((px) => {
    const petri = new THREE.Group();
    petri.add(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.015, 12), glassMat));
    const sample = new THREE.Mesh(new THREE.CircleGeometry(0.05, 8), new THREE.MeshStandardMaterial({ color: 0xd4aa60, roughness: 0.7 }));
    sample.rotation.x = -Math.PI / 2;
    sample.position.y = 0.008;
    petri.add(sample);
    petri.position.set(px, 0.98, -1.3);
    scene.add(petri);
  });

  const lampMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.3, metalness: 0.7 });
  const lamp = new THREE.Group();
  lamp.add(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.03, 8), lampMat));
  const lampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.35, 6), lampMat);
  lampArm.position.set(0, 0.19, 0);
  lampArm.rotation.z = 0.2;
  lamp.add(lampArm);
  const lampHead = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.1, 8, 1, true), lampMat);
  lampHead.position.set(0.07, 0.38, 0);
  lampHead.rotation.z = Math.PI + 0.2;
  lamp.add(lampHead);
  lamp.position.set(-3.8, 0.98, -0.4);
  scene.add(lamp);
}

// A desk monitor whose screen is a canvas; returns its screen for drawing.
export function buildMonitor(scene, x, z) {
  const group = new THREE.Group();
  const bezelMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.3, metalness: 0.5 });
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.52, 0.03), bezelMat);
  bezel.position.y = 0.5;
  group.add(bezel);
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 312;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.76, 0.46), new THREE.MeshBasicMaterial({ map: texture }));
  screen.position.set(0, 0.5, 0.017);
  group.add(screen);
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.26, 6), bezelMat);
  stand.position.y = 0.13;
  group.add(stand);
  group.add(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 10), bezelMat));
  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.015, 0.14), new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.4 }));
  keyboard.position.set(0, 0.008, 0.28);
  group.add(keyboard);
  group.position.set(x, 0.98, z);
  scene.add(group);
  return { canvas, texture, position: new THREE.Vector3(x, 1.4, z), size: [0.95, 0.9, 0.8] };
}

// ─── SMALL DECORATIONS ──────────────────────────────────────────────────────
export function buildDecorations(scene) {
  const { W, H, D } = ROOM;

  const clock = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.05, 24), new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.3, metalness: 0.6 }));
  body.rotation.x = Math.PI / 2;
  clock.add(body);
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.32, 24), new THREE.MeshStandardMaterial({ color: 0xf8f8f0, roughness: 0.3 }));
  face.position.z = 0.026;
  clock.add(face);
  const handMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2;
    const mark = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 0.005), handMat);
    mark.position.set(Math.sin(ang) * 0.26, Math.cos(ang) * 0.26, 0.028);
    mark.rotation.z = -ang;
    clock.add(mark);
  }
  const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.005), handMat);
  hourHand.geometry.translate(0, 0.08, 0);
  hourHand.position.z = 0.03;
  clock.add(hourHand);
  const minuteHand = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.22, 0.005), handMat);
  minuteHand.geometry.translate(0, 0.11, 0);
  minuteHand.position.z = 0.032;
  clock.add(minuteHand);
  clock.position.set(0, 5, D / 2 - 0.08);
  clock.rotation.y = Math.PI;
  scene.add(clock);

  const extinguisher = new THREE.Group();
  const feBody = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.55, 12), new THREE.MeshStandardMaterial({ color: 0xcc0000, roughness: 0.4, metalness: 0.3 }));
  feBody.position.y = 0.275;
  extinguisher.add(feBody);
  const feTop = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.045, 0.07, 8), new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.3, metalness: 0.8 }));
  feTop.position.y = 0.585;
  extinguisher.add(feTop);
  extinguisher.position.set(-W / 2 + 0.3, 0, 8.2);
  scene.add(extinguisher);

  const exitSign = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.2, 0.03),
    new THREE.MeshStandardMaterial({ color: 0x005500, emissive: 0x00ff00, emissiveIntensity: 0.5, roughness: 0.3 })
  );
  exitSign.position.set(0, H - 0.5, D / 2 - 0.08);
  exitSign.rotation.y = Math.PI;
  scene.add(exitSign);

  const rackMat = new THREE.MeshStandardMaterial({ color: 0x8b6914, roughness: 0.6 });
  const rackPole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.8, 8), rackMat);
  rackPole.position.set(-11.2, 0.9, -7);
  scene.add(rackPole);
  const coat = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.8, 0.4), new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.6 }));
  coat.position.set(-11.2, 1.2, -7);
  scene.add(coat);

  return { clock: { hourHand, minuteHand } };
}
