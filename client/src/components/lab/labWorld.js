import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  ROOM, buildDecorations, buildFurniture, buildGarden, buildLabEquipment, buildMicroscope, buildMonitor, buildRoom,
} from "./labRoom";
import { ARRANGEMENT, LIFE, SPECIMENS, formatSize, specimenNumber } from "./specimens";
import { POSTERS, drawPoster } from "./posters";
import { applySpecimenMaterials, fitModel, loadSpecimenCopy } from "./modelLoader";
import { UI } from "./labText";

// ═══════════════════════════════════════════════════════════════════════════
// LAB WORLD — the three.js side of the page.
//
// createLabWorld(canvas, callbacks) builds the room, the vitrines and the
// boards, runs the render loop and handles walking, looking and clicking.
// React talks to it only through the returned API; it reports back through
// the callbacks:
//   onHover({ kind, id } | null)   pointer moved onto / off something
//   onSelect({ kind, id })         something was clicked
//   onProgress(fraction)           bytes of the room models loaded
// ═══════════════════════════════════════════════════════════════════════════

const EYE = 1.7;
const START = { x: 0, z: 9.2, yaw: 0, pitch: -0.08 };
const WALK_SPEED = 3.2; // m/s
const LOOK_SPEED = 0.0035; // rad per pixel
const WALL_MARGIN = 0.5;
const BODY_RADIUS = 0.3;
const DRAG_THRESHOLD = 6; // px: more is a look-around drag, less is a click

const MODEL_SIZE = 0.4;
const PLINTH_HEIGHT = 1.05;

// Boards on the side walls, and where a visitor stands to read them.
const BOARD_PLACES = {
  anatomy: { x: 11.94, y: 4.1, z: -5, ry: -Math.PI / 2, w: 2.4, view: [8.2, -5] },
  arrangements: { x: 11.94, y: 4.1, z: 0, ry: -Math.PI / 2, w: 2.4, view: [8.2, 0] },
  depth: { x: 11.94, y: 4.1, z: 5, ry: -Math.PI / 2, w: 2.4, view: [8.2, 5] },
  timeline: { x: -11.94, y: 4.0, z: -4, ry: Math.PI / 2, w: 4.4, view: [-7.4, -4] },
  walls: { x: -11.94, y: 4.0, z: 3.5, ry: Math.PI / 2, w: 4.4, view: [-7.4, 3.5] },
};
const MICROSCOPE_VIEW = { at: [4, 1.3], look: [4, 1.6, -0.8] };
const MONITOR_POS = [-6.6, -1.1];

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function shortestAngle(from, to) {
  let d = (to - from) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

// ─── CANVAS LABELS ──────────────────────────────────────────────────────────
function fitFont(ctx, text, maxWidth, size, weight, style = "") {
  let s = size;
  do {
    ctx.font = `${style} ${weight} ${s}px Inter, system-ui, sans-serif`;
    s -= 2;
  } while (ctx.measureText(text).width > maxWidth && s > 14);
}

function drawPlaque(canvas, specimen, lang) {
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;
  const t = specimen[lang];
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#13201a";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#c8a24a";
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, w - 8, h - 8);

  ctx.beginPath();
  ctx.arc(62, 70, 36, 0, Math.PI * 2);
  ctx.fillStyle = specimen.art ? "#8a5a9e" : "#2d7a2d";
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 40px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(specimenNumber(specimen.id)), 62, 72);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = "#f2ead0";
  fitFont(ctx, specimen.name, w - 140, 40, 700, specimen.art ? "" : "italic");
  ctx.fillText(specimen.name, 114, 84);

  ctx.fillStyle = "#9fd88f";
  ctx.font = "600 27px Inter, system-ui, sans-serif";
  const kind = specimen.art
    ? UI[lang].artBadge
    : `${LIFE[specimen.life][lang]} · ${ARRANGEMENT[specimen.arrangement][lang].split(" (")[0]}`;
  fitFont(ctx, kind, w - 60, 27, 600);
  ctx.fillText(kind, 30, 160);

  ctx.fillStyle = "#c9c2ab";
  const detail = specimen.art ? t.specimen : `≈ ${formatSize(specimen.size.mm, lang)} · ${specimen.depth[0]}–${specimen.depth[1]} m`;
  fitFont(ctx, detail, w - 60, 25, 500);
  ctx.fillText(detail, 30, 212);
}

function drawBadge(canvas, number, studied) {
  const ctx = canvas.getContext("2d");
  const s = canvas.width;
  ctx.clearRect(0, 0, s, s);
  ctx.beginPath();
  ctx.arc(s / 2, s / 2, s / 2 - 6, 0, Math.PI * 2);
  ctx.fillStyle = studied ? "#3fae4f" : "rgba(15, 30, 22, 0.88)";
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = studied ? "#d8ffd0" : "#c8a24a";
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 ${studied ? 64 : 58}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(studied ? "✓" : String(number), s / 2, s / 2 + 3);
}

function drawMonitorScreen(canvas, lang) {
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#0f3b36");
  g.addColorStop(1, "#0a2421");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#5eead4";
  ctx.font = "700 44px Inter, system-ui, sans-serif";
  ctx.fillText("ForamID", 28, 62);
  ctx.fillStyle = "#cdeee8";
  fitFont(ctx, UI[lang].monitorTitle, w - 56, 24, 500);
  ctx.fillText(UI[lang].monitorTitle, 28, 98);
  // A thin-section-like disc.
  const cx = 130;
  const cy = 200;
  for (let r = 70; r > 0; r -= 10) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 1.3, r * 0.75, 0, 0, Math.PI * 2);
    ctx.fillStyle = r % 20 ? "#d9c089" : "#bfa46c";
    ctx.fill();
  }
  ctx.fillStyle = "#14b8a6";
  ctx.fillRect(270, 170, 210, 60);
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 24px Inter, system-ui, sans-serif";
  ctx.fillText(lang === "tr" ? "▶ Tanıya başla" : "▶ Start", 290, 209);
}

function drawCtScreen(canvas) {
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;
  ctx.fillStyle = "#050809";
  ctx.fillRect(0, 0, w, h);
  // A grey µCT slice: chambers of a coiled test.
  const cx = w / 2;
  const cy = h / 2 + 10;
  for (let i = 1; i < 12; i++) {
    const angle = i * 0.78;
    const d = 9 * Math.pow(1.19, i);
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * d, cy + Math.sin(angle) * d, d * 0.48, 0, Math.PI * 2);
    ctx.strokeStyle = "#d8d8d8";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  ctx.fillStyle = "#6fd3ff";
  ctx.font = "600 20px Inter, system-ui, sans-serif";
  ctx.fillText("µCT · slice 412 / 980", 16, 30);
}

function contactShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
  g.addColorStop(0, "rgba(0,0,0,0.45)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

function canvasTexture(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// ─── WORLD ──────────────────────────────────────────────────────────────────
export function createLabWorld(canvas, { lang, onHover, onSelect, onProgress }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9fd4ea);
  scene.fog = new THREE.Fog(0xcfe6d8, 30, 75);

  const camera = new THREE.PerspectiveCamera(65, 1, 0.05, 120);
  const view = { x: START.x, z: START.z, yaw: START.yaw, pitch: START.pitch };

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  // ── Lighting ──
  scene.add(new THREE.AmbientLight(0xfff5e0, 0.55));
  scene.add(new THREE.HemisphereLight(0xddeeff, 0x8b9a6a, 0.7));
  const sun = new THREE.DirectionalLight(0xfff0cc, 1.6);
  sun.position.set(10, 25, -15);
  scene.add(sun);

  // ── Static room ──
  const { floor } = buildRoom(scene);
  buildGarden(scene);
  const { obstacles } = buildFurniture(scene);
  const microscope = buildMicroscope(scene);
  buildLabEquipment(scene);
  const monitor = buildMonitor(scene, MONITOR_POS[0], MONITOR_POS[1]);
  const ctMonitor = buildMonitor(scene, 6.8, -1.1);
  drawCtScreen(ctMonitor.canvas);
  ctMonitor.texture.needsUpdate = true;
  const { clock } = buildDecorations(scene);

  const clickables = [];
  const highlights = new Map(); // "kind:id" -> object shown on hover

  const addHitBox = (userData, position, size, highlight) => {
    const hit = new THREE.Mesh(new THREE.BoxGeometry(...size), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.copy(position);
    hit.userData = userData;
    scene.add(hit);
    clickables.push(hit);
    if (highlight) highlights.set(`${userData.kind}:${userData.id}`, highlight);
  };

  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x7ae870, transparent: true, opacity: 0.75, depthWrite: false });
  const makeRing = (x, y, z, inner, outer) => {
    const ring = new THREE.Mesh(new THREE.RingGeometry(inner, outer, 48), ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, y, z);
    ring.visible = false;
    scene.add(ring);
    return ring;
  };

  addHitBox({ kind: "poster", id: "microscope" }, microscope.position, microscope.size, makeRing(4, 0.99, -0.8, 0.5, 0.58));
  addHitBox({ kind: "monitor", id: "foramid" }, monitor.position, monitor.size, makeRing(MONITOR_POS[0], 0.99, MONITOR_POS[1], 0.45, 0.52));

  // ── Vitrines ──
  const shadowTexture = contactShadowTexture();
  const plinthMat = new THREE.MeshStandardMaterial({ color: 0x23302a, roughness: 0.5, metalness: 0.2 });
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.85 });
  const glassMat = new THREE.MeshBasicMaterial({ color: 0xcfeaff, transparent: true, opacity: 0.08, depthWrite: false });
  const edgeMat = new THREE.LineBasicMaterial({ color: 0xd4af37 });
  const glassGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const edgesGeometry = new THREE.EdgesGeometry(glassGeometry);

  const vitrines = SPECIMENS.map((specimen) => {
    const { x, z } = specimen.pedestal;
    const toAisle = x < 0 ? 1 : -1;
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.62, PLINTH_HEIGHT, 0.62), plinthMat);
    plinth.position.y = PLINTH_HEIGHT / 2;
    group.add(plinth);
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.04, 0.66), plateMat);
    plate.position.y = PLINTH_HEIGHT + 0.02;
    group.add(plate);
    const glass = new THREE.Mesh(glassGeometry, glassMat);
    glass.position.y = PLINTH_HEIGHT + 0.29;
    group.add(glass);
    const edges = new THREE.LineSegments(edgesGeometry, edgeMat);
    edges.position.copy(glass.position);
    group.add(edges);

    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 1.4),
      new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.004;
    group.add(shadow);

    // Name plaque on the side facing the aisle, tilted up to the reader.
    const plaqueCanvas = document.createElement("canvas");
    plaqueCanvas.width = 512;
    plaqueCanvas.height = 256;
    const plaqueTexture = canvasTexture(plaqueCanvas);
    const plaque = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.28), new THREE.MeshBasicMaterial({ map: plaqueTexture }));
    // Stands off the plinth so the tilted top edge stays clear of it.
    plaque.rotation.set(-0.3, (toAisle * Math.PI) / 2, 0, "YXZ");
    plaque.position.set(toAisle * 0.37, 0.82, 0);
    group.add(plaque);

    // Number (or ✓ once studied) floating over the vitrine.
    const badgeCanvas = document.createElement("canvas");
    badgeCanvas.width = badgeCanvas.height = 128;
    const badgeTexture = canvasTexture(badgeCanvas);
    const badge = new THREE.Sprite(new THREE.SpriteMaterial({ map: badgeTexture, depthWrite: false }));
    badge.scale.setScalar(0.2);
    badge.position.y = PLINTH_HEIGHT + 0.78;
    group.add(badge);

    const anchor = new THREE.Group();
    anchor.position.y = PLINTH_HEIGHT + 0.25;
    group.add(anchor);

    scene.add(group);
    obstacles.push({ x0: x - 0.36, x1: x + 0.36, z0: z - 0.36, z1: z + 0.36 });
    addHitBox(
      { kind: "specimen", id: specimen.id },
      new THREE.Vector3(x, 0.95, z),
      [0.8, 1.9, 0.8],
      makeRing(x, 0.01, z, 0.52, 0.62)
    );

    return { specimen, anchor, plaqueCanvas, plaqueTexture, badgeCanvas, badgeTexture, badge, studied: false, holder: null };
  });

  // ── Boards ──
  const boards = POSTERS.filter((p) => BOARD_PLACES[p.id]).map((poster) => {
    const place = BOARD_PLACES[poster.id];
    const h = (place.w * poster.size[1]) / poster.size[0];
    const group = new THREE.Group();
    group.position.set(place.x, place.y, place.z);
    group.rotation.y = place.ry;

    const glow = new THREE.Mesh(new THREE.PlaneGeometry(place.w + 0.32, h + 0.32), new THREE.MeshBasicMaterial({ color: 0x7ae870 }));
    glow.position.z = -0.02;
    glow.visible = false;
    group.add(glow);
    const frameBox = new THREE.Mesh(new THREE.BoxGeometry(place.w + 0.16, h + 0.16, 0.05), new THREE.MeshStandardMaterial({ color: 0x5a4020, roughness: 0.6 }));
    frameBox.position.z = -0.01;
    group.add(frameBox);

    const posterCanvas = drawPoster(poster.id, lang);
    const texture = canvasTexture(posterCanvas);
    const board = new THREE.Mesh(new THREE.PlaneGeometry(place.w, h), new THREE.MeshBasicMaterial({ map: texture, color: 0xf2f2f2 }));
    board.position.z = 0.02;
    board.userData = { kind: "poster", id: poster.id };
    group.add(board);
    scene.add(group);
    clickables.push(board);
    highlights.set(`poster:${poster.id}`, glow);
    return { poster, posterCanvas, texture };
  });

  // ── Specimen models ──
  const progress = new Map(SPECIMENS.map((s) => [s.model, [0, 0]]));
  const reportProgress = () => {
    let loaded = 0;
    let total = 0;
    let known = true;
    progress.forEach(([l, t]) => {
      loaded += l;
      total += t;
      if (!t) known = false;
    });
    const done = [...progress.values()].filter(([l, t]) => t && l >= t).length;
    onProgress(known ? loaded / total : done / progress.size);
  };
  let disposed = false;
  vitrines.forEach((v) => {
    loadSpecimenCopy(v.specimen.model, (loaded, total) => {
      progress.set(v.specimen.model, [loaded, total || loaded]);
      reportProgress();
    })
      .then((model) => {
        if (disposed) return;
        const holder = fitModel(model, MODEL_SIZE);
        applySpecimenMaterials(model, v.specimen, envMap);
        v.anchor.add(holder);
        v.holder = holder;
        const entry = progress.get(v.specimen.model);
        progress.set(v.specimen.model, [Math.max(entry[0], entry[1], 1), Math.max(entry[1], 1)]);
        reportProgress();
      })
      .catch((error) => {
        console.error(`Failed to load ${v.specimen.id}:`, error);
        progress.set(v.specimen.model, [1, 1]);
        reportProgress();
      });
  });

  // ── Text on canvases (redrawn for language, progress and fonts) ──
  let currentLang = lang;
  const redrawTexts = () => {
    vitrines.forEach((v) => {
      drawPlaque(v.plaqueCanvas, v.specimen, currentLang);
      v.plaqueTexture.needsUpdate = true;
      drawBadge(v.badgeCanvas, specimenNumber(v.specimen.id), v.studied);
      v.badgeTexture.needsUpdate = true;
    });
    boards.forEach((b) => {
      drawPoster(b.poster.id, currentLang, b.posterCanvas);
      b.texture.needsUpdate = true;
    });
    drawMonitorScreen(monitor.canvas, currentLang);
    monitor.texture.needsUpdate = true;
  };
  redrawTexts();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => !disposed && redrawTexts());

  // ── Movement ──
  const blocked = (x, z) => {
    if (Math.abs(x) > ROOM.W / 2 - WALL_MARGIN || Math.abs(z) > ROOM.D / 2 - WALL_MARGIN) return true;
    return obstacles.some((o) => x > o.x0 - BODY_RADIUS && x < o.x1 + BODY_RADIUS && z > o.z0 - BODY_RADIUS && z < o.z1 + BODY_RADIUS);
  };

  // Moves along x and z separately, so the visitor slides along a bench
  // instead of stopping dead against it.
  const tryMove = (dx, dz) => {
    if (!blocked(view.x + dx, view.z)) view.x += dx;
    if (!blocked(view.x, view.z + dz)) view.z += dz;
  };

  let tween = null;
  const flyTo = (to, duration, onArrive) => {
    if (!duration) {
      tween = null;
      Object.assign(view, to);
      if (onArrive) onArrive();
      return;
    }
    tween = { from: { ...view }, to, start: performance.now(), duration, onArrive };
  };
  const lookAngles = (fromX, fromY, fromZ, [tx, ty, tz]) => {
    const dx = tx - fromX;
    const dz = tz - fromZ;
    return { yaw: Math.atan2(-dx, -dz), pitch: Math.atan2(ty - fromY, Math.hypot(dx, dz)) };
  };

  // Walks towards a floor point and stops at the first obstacle on the way.
  const walkTo = (tx, tz) => {
    const distance = Math.hypot(tx - view.x, tz - view.z);
    const steps = Math.ceil(distance / 0.1);
    let x = view.x;
    let z = view.z;
    for (let i = 1; i <= steps; i++) {
      const nx = view.x + ((tx - view.x) * i) / steps;
      const nz = view.z + ((tz - view.z) * i) / steps;
      if (blocked(nx, nz)) break;
      x = nx;
      z = nz;
    }
    if (Math.hypot(x - view.x, z - view.z) < 0.15) return;
    flyTo({ x, z, yaw: view.yaw, pitch: view.pitch }, Math.max(300, (Math.hypot(x - view.x, z - view.z) / 4) * 1000));
  };

  // ── Input ──
  const keys = {};
  const pointer = { inside: false, ndc: new THREE.Vector2(), down: null, dragged: false };
  const raycaster = new THREE.Raycaster();
  // paused: no input, no movement. Rendering also stops unless asked to
  // keep going (the intro screen shows the room behind it); the canvas then
  // keeps showing the last frame.
  let paused = false;
  let renderWhilePaused = false;

  const setNdc = (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
  };

  const pick = () => {
    raycaster.setFromCamera(pointer.ndc, camera);
    const hit = raycaster.intersectObjects(clickables, false)[0];
    return hit ? hit.object.userData : null;
  };

  const onPointerDown = (e) => {
    if (paused) return;
    canvas.setPointerCapture(e.pointerId);
    pointer.down = { x: e.clientX, y: e.clientY, lastX: e.clientX, lastY: e.clientY };
    pointer.dragged = false;
  };
  const onPointerMove = (e) => {
    pointer.inside = true;
    setNdc(e);
    if (!pointer.down || paused) return;
    const dx = e.clientX - pointer.down.lastX;
    const dy = e.clientY - pointer.down.lastY;
    pointer.down.lastX = e.clientX;
    pointer.down.lastY = e.clientY;
    if (Math.hypot(e.clientX - pointer.down.x, e.clientY - pointer.down.y) > DRAG_THRESHOLD) pointer.dragged = true;
    if (!pointer.dragged) return;
    tween = null;
    view.yaw -= dx * LOOK_SPEED;
    view.pitch = THREE.MathUtils.clamp(view.pitch - dy * LOOK_SPEED, -1.2, 1.2);
  };
  const onPointerUp = (e) => {
    const wasClick = pointer.down && !pointer.dragged;
    pointer.down = null;
    // A lifted finger leaves no pointer behind to hover with.
    if (e.pointerType !== "mouse") pointer.inside = false;
    if (!wasClick || paused) return;
    setNdc(e);
    const target = pick();
    if (target) {
      onSelect(target);
      return;
    }
    // Nothing interactive: walk to the floor point under the pointer.
    raycaster.setFromCamera(pointer.ndc, camera);
    const hit = raycaster.intersectObject(floor, false)[0];
    if (hit) walkTo(hit.point.x, hit.point.z);
  };
  const onPointerLeave = () => {
    pointer.inside = false;
  };
  const onPointerCancel = () => {
    pointer.down = null;
    pointer.inside = false;
  };
  const onWheel = (e) => {
    if (paused) return;
    e.preventDefault();
    tween = null;
    const step = -Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) * 0.008, 0.6);
    tryMove(-Math.sin(view.yaw) * step, -Math.cos(view.yaw) * step);
  };
  const isTyping = (e) => /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
  const MOVE_KEYS = ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"];
  const onKeyDown = (e) => {
    if (paused || isTyping(e)) return;
    const key = e.key.toLowerCase();
    if (!MOVE_KEYS.includes(key)) return;
    // Arrow keys would also scroll the page under the lab.
    e.preventDefault();
    keys[key] = true;
    tween = null;
  };
  const onKeyUp = (e) => {
    keys[e.key.toLowerCase()] = false;
  };
  const onBlur = () => Object.keys(keys).forEach((k) => (keys[k] = false));

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerCancel);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // On a portrait phone a 65° vertical view is a keyhole sideways; widen
    // it (up to 85°) so about 70° stays visible across.
    const keepAcross = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(35)) / camera.aspect);
    camera.fov = THREE.MathUtils.clamp(THREE.MathUtils.radToDeg(keepAcross), 65, 85);
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  // ── Frame loop ──
  let hoverKey = "";
  const setHover = (target) => {
    const key = target ? `${target.kind}:${target.id}` : "";
    if (key === hoverKey) return;
    if (highlights.get(hoverKey)) highlights.get(hoverKey).visible = false;
    hoverKey = key;
    if (highlights.get(key)) highlights.get(key).visible = true;
    canvas.style.cursor = target ? "pointer" : "";
    onHover(target);
  };

  const timer = new THREE.Timer();
  let lastClock = 0;
  let frame = 0;
  const animate = (time) => {
    frame = requestAnimationFrame(animate);
    timer.update(time);
    const dt = Math.min(timer.getDelta(), 0.1);
    if (paused && !renderWhilePaused) return;

    if (paused) {
      // Rendering only.
    } else if (tween) {
      const t = Math.min(1, (performance.now() - tween.start) / tween.duration);
      const k = easeInOut(t);
      view.x = tween.from.x + (tween.to.x - tween.from.x) * k;
      view.z = tween.from.z + (tween.to.z - tween.from.z) * k;
      view.yaw = tween.from.yaw + shortestAngle(tween.from.yaw, tween.to.yaw) * k;
      view.pitch = tween.from.pitch + (tween.to.pitch - tween.from.pitch) * k;
      if (t >= 1) {
        const done = tween.onArrive;
        tween = null;
        if (done) done();
      }
    } else {
      const forward = [-Math.sin(view.yaw), -Math.cos(view.yaw)];
      const right = [Math.cos(view.yaw), -Math.sin(view.yaw)];
      let mx = 0;
      let mz = 0;
      if (keys.w || keys.arrowup) { mx += forward[0]; mz += forward[1]; }
      if (keys.s || keys.arrowdown) { mx -= forward[0]; mz -= forward[1]; }
      if (keys.a || keys.arrowleft) { mx -= right[0]; mz -= right[1]; }
      if (keys.d || keys.arrowright) { mx += right[0]; mz += right[1]; }
      const length = Math.hypot(mx, mz);
      if (length) tryMove((mx / length) * WALK_SPEED * dt, (mz / length) * WALK_SPEED * dt);
    }

    camera.position.set(view.x, EYE, view.z);
    camera.rotation.set(view.pitch, view.yaw, 0, "YXZ");

    vitrines.forEach((v) => v.holder && (v.holder.rotation.y += dt * 0.3));

    if (time - lastClock > 1000) {
      lastClock = time;
      const now = new Date();
      clock.minuteHand.rotation.z = -(now.getMinutes() / 60) * Math.PI * 2;
      clock.hourHand.rotation.z = -(((now.getHours() % 12) + now.getMinutes() / 60) / 12) * Math.PI * 2;
    }

    setHover(!paused && pointer.inside && !pointer.dragged ? pick() : null);
    renderer.render(scene, camera);
  };
  frame = requestAnimationFrame(animate);

  // ── API ──
  return {
    // `instant` places the visitor at once: used when a panel opens over
    // the room anyway, so closing it finds them next to the exhibit.
    flyToSpecimen(id, onArrive, instant = false) {
      const specimen = SPECIMENS.find((s) => s.id === id);
      if (!specimen) return;
      const { x, z } = specimen.pedestal;
      const standX = x - Math.sign(x) * 1.3;
      flyTo({ x: standX, z, ...lookAngles(standX, EYE, z, [x, PLINTH_HEIGHT + 0.2, z]) }, instant ? 0 : 900, onArrive);
    },
    flyToBoard(id, onArrive, instant = false) {
      if (id === "microscope") {
        const [x, z] = MICROSCOPE_VIEW.at;
        flyTo({ x, z, ...lookAngles(x, EYE, z, MICROSCOPE_VIEW.look) }, instant ? 0 : 900, onArrive);
        return;
      }
      const place = BOARD_PLACES[id];
      if (!place) return;
      const [x, z] = place.view;
      flyTo({ x, z, ...lookAngles(x, EYE, z, [place.x, place.y, place.z]) }, instant ? 0 : 1000, onArrive);
    },
    flyHome() {
      flyTo({ ...START }, 900);
    },
    setPaused(value, { render = false } = {}) {
      paused = value;
      renderWhilePaused = render;
      if (value) {
        Object.keys(keys).forEach((k) => (keys[k] = false));
        pointer.down = null;
        setHover(null);
      }
    },
    setLanguage(value) {
      currentLang = value;
      redrawTexts();
    },
    setStudied(ids) {
      vitrines.forEach((v) => {
        const studied = ids.includes(v.specimen.id);
        if (studied === v.studied) return;
        v.studied = studied;
        drawBadge(v.badgeCanvas, specimenNumber(v.specimen.id), studied);
        v.badgeTexture.needsUpdate = true;
      });
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      // Geometry of the specimen models is shared with the loader cache and
      // stays; everything built for this room goes.
      scene.traverse((object) => {
        if (object.geometry && !object.geometry.userData.shared) object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
        materials.forEach((m) => {
          if (m.map && !m.map.userData.shared) m.map.dispose();
          m.dispose();
        });
      });
      envMap.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
