import { useEffect, useId, useRef } from "react";

/**
 * Decorative hero backgrounds — one precision geometric illustration per page,
 * unified around GeoKnow's scientific plate palette (#0067b8 cobalt, #cfe4f4 ice blue,
 * #edf5fb pale cloud, #dcebe4 mineral sage, #5f8f7b sage accent, #213b4d slate ink).
 *
 *   <HeroBackdrop variant="strata" />      Home      – radial chronostratigraphic wedges & astrolabe
 *   <HeroBackdrop variant="outcrop" />     Geology   – tectonic fold, fault slip & Schmidt stereonet
 *   <HeroBackdrop variant="spiral" />      Diagnose  – specimen dial + planispiral chambers
 *   <HeroBackdrop variant="thinsection" /> Visual AI – rotating polarizer stage & faceted grains
 *   <HeroBackdrop variant="network" />     About     – triangular taxonomy lattice & signal constellation
 *   <HeroBackdrop variant="survey" />      Contact   – spherical map graticule, route & coordinate beacon
 *   <HeroBackdrop variant="seismic" />     Search    – harmonic acoustic ribbons & fault sweep
 *   <HeroBackdrop variant="heritage" />    News      – radial architectural voussoir rosette & arcs
 */

const W = 1440;
const H = 640;

const BLUE = "var(--bd-blue, #0067b8)";
const AZURE = "var(--bd-azure, #0078d4)";
const SKY = "var(--bd-sky, #9cd8f4)";
const TINT = "var(--bd-tint, #cfe4f4)";
const SOFT = "var(--bd-soft, #edf5fb)";
const NAVY = "var(--bd-navy, #172b3a)";
const SLATE = "var(--bd-slate, #213b4d)";
const SAGE = "var(--bd-sage, #5f8f7b)";
const SAGE_SOFT = "var(--bd-sage-soft, #dcebe4)";
const SEP = "var(--bd-sep, #ffffff)";

/* ── helpers ─────────────────────────────────────────────────────────── */

const r1 = (n) => Math.round(n * 10) / 10;

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function closedSmoothPath(points) {
  const n = points.length;
  let d = `M${r1(points[0][0])} ${r1(points[0][1])}`;
  for (let i = 0; i < n; i += 1) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    d += ` C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return `${d} Z`;
}

function openSmoothPath(points) {
  let d = `M${r1(points[0][0])} ${r1(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    d += ` C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d;
}

const polyPath = (pts) => `M${pts.map((p) => `${r1(p[0])} ${r1(p[1])}`).join(" L")} Z`;

// Annular ring sector SVG path.
function annularSector(cx, cy, rIn, rOut, a0, a1) {
  const cos = Math.cos;
  const sin = Math.sin;
  const p0 = [cx + cos(a0) * rOut, cy + sin(a0) * rOut];
  const p1 = [cx + cos(a1) * rOut, cy + sin(a1) * rOut];
  const p2 = [cx + cos(a1) * rIn, cy + sin(a1) * rIn];
  const p3 = [cx + cos(a0) * rIn, cy + sin(a0) * rIn];
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${r1(p0[0])} ${r1(p0[1])} A${r1(rOut)} ${r1(rOut)} 0 ${large} 1 ${r1(p1[0])} ${r1(p1[1])} L${r1(p2[0])} ${r1(p2[1])} A${r1(rIn)} ${r1(rIn)} 0 ${large} 0 ${r1(p3[0])} ${r1(p3[1])} Z`;
}

function contourRings({ cx, cy, count, start, step, stretch = 1.35, phase = 0 }) {
  return Array.from({ length: count }, (_, i) => {
    const base = start + i * step;
    const pts = Array.from({ length: 44 }, (_, k) => {
      const t = (k / 44) * Math.PI * 2;
      const r =
        base *
        (1 +
          0.11 * Math.sin(2 * t + 0.6 + phase + i * 0.16) +
          0.06 * Math.sin(3 * t + 1.4 - phase - i * 0.22) +
          0.03 * Math.sin(5 * t + i * 0.45));
      return [cx + Math.cos(t) * r * stretch, cy + Math.sin(t) * r];
    });
    return { d: closedSmoothPath(pts), index: i % 4 === 3, opacity: Math.max(0.1, 0.3 - i * 0.02) };
  });
}

/* ── 1. Home: chronostratigraphic arc lenses & elevation astrolabe ───── */

const HOME_AST = (() => {
  const cx = 1120;
  const cy = 540;
  const bands = [
    { rIn: 480, rOut: 560, fill: SOFT, opacity: 0.9 },
    { rIn: 400, rOut: 480, fill: TINT, opacity: 0.52 },
    { rIn: 325, rOut: 400, fill: SAGE_SOFT, opacity: 0.62 },
    { rIn: 255, rOut: 325, fill: SOFT, opacity: 0.85 },
    { rIn: 185, rOut: 255, fill: TINT, opacity: 0.48 },
  ];
  const wedges = [];
  const step = 0.24;
  bands.forEach((b, bi) => {
    for (let k = 0; k < 14; k += 1) {
      const a0 = -Math.PI * 1.05 + k * step + bi * 0.08;
      const a1 = a0 + step;
      const tone = (k + bi) % 3 === 0 ? "a" : (k + bi) % 3 === 1 ? "b" : "c";
      wedges.push({
        d: annularSector(cx, cy, b.rIn, b.rOut, a0, a1),
        fill: b.fill,
        opacity: r1(b.opacity * (0.65 + ((k + bi) % 3) * 0.16)),
        tone,
      });
    }
  });
  const ticks = Array.from({ length: 64 }, (_, k) => {
    const a = -Math.PI + (k / 64) * Math.PI * 1.1;
    const len = k % 4 === 0 ? 18 : 8;
    const r0 = 568;
    return `M${r1(cx + Math.cos(a) * r0)} ${r1(cy + Math.sin(a) * r0)}L${r1(cx + Math.cos(a) * (r0 + len))} ${r1(cy + Math.sin(a) * (r0 + len))}`;
  }).join("");
  return { cx, cy, wedges, ticks };
})();

function StrataArt() {
  const { cx, cy } = HOME_AST;
  return (
    <>
      <g className="hero-bd-parallax-back">
        <g className="hero-bd-breathe" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          {HOME_AST.wedges.map((w, i) => (
            <path
              key={i}
              d={w.d}
              fill={w.fill}
              fillOpacity={w.opacity}
              stroke={SEP}
              strokeOpacity="0.9"
              strokeWidth="1.2"
              className={`hero-bd-grain-${w.tone}`}
            />
          ))}
        </g>
        <circle cx={cx} cy={cy} r="560" fill="none" stroke={SLATE} strokeOpacity="0.18" strokeWidth="1" />
        <path d={HOME_AST.ticks} fill="none" stroke={BLUE} strokeOpacity="0.28" strokeWidth="1" />
      </g>

      <g className="hero-bd-parallax-front" fill="none">
        <g className="hero-bd-spin" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <circle cx={cx} cy={cy} r="480" stroke={BLUE} strokeOpacity="0.45" strokeWidth="1.6" strokeDasharray="160 320" />
          <circle cx={cx} cy={cy} r="325" stroke={SAGE} strokeOpacity="0.42" strokeWidth="1.4" strokeDasharray="90 220" />
          <circle cx={cx} cy={cy} r="604" stroke={SLATE} strokeOpacity="0.18" strokeWidth="1" strokeDasharray="4 10" />
        </g>
        <circle
          cx={cx}
          cy={cy}
          r="520"
          stroke={BLUE}
          strokeOpacity="0.58"
          strokeWidth="2.1"
          strokeDasharray="140 380"
          className="hero-bd-dash-flow"
        />
      </g>
    </>
  );
}

/* ── 2. Geology: Schmidt stereonet & faceted anticline fault block ───── */

const GEOLOGY_NET = (() => {
  const cx = 920;
  const cy = 190;
  const r = 152;
  const arcs = [-0.65, -0.35, 0, 0.35, 0.65].map((k) => {
    const bulge = k * r;
    return `M${cx} ${cy - r} Q${r1(cx + bulge)} ${cy} ${cx} ${cy + r}`;
  });
  const beds = [
    { fill: SOFT, opacity: 0.9, y: 270, amp: 85 },
    { fill: TINT, opacity: 0.62, y: 332, amp: 74 },
    { fill: SAGE_SOFT, opacity: 0.68, y: 394, amp: 64 },
    { fill: SOFT, opacity: 0.85, y: 454, amp: 52 },
    { fill: TINT, opacity: 0.56, y: 514, amp: 42 },
  ].map((b, idx) => {
    const pts = [];
    for (let x = -160; x <= W + 160; x += 68) {
      const fold = b.amp * Math.exp(-(((x - 1030) / 340) ** 2));
      pts.push([x, b.y - fold + 5 * Math.sin(x / 130 + idx)]);
    }
    const surface = openSmoothPath(pts);
    return { ...b, surface, area: `${surface} L${W + 160} ${H + 80} L-160 ${H + 80} Z` };
  });
  return { cx, cy, r, arcs, beds };
})();

function OutcropBeds({ id }) {
  return GEOLOGY_NET.beds.map((bed, i) => (
    <g key={i}>
      <path d={bed.area} fill={bed.fill} fillOpacity={bed.opacity} />
      {i % 2 === 1 && <path d={bed.area} fill={`url(#${id("beddots")})`} />}
      <path d={bed.surface} fill="none" stroke={SEP} strokeOpacity="0.92" strokeWidth="1.6" />
      <path d={bed.surface} fill="none" stroke={SLATE} strokeOpacity="0.16" strokeWidth="0.9" transform="translate(0 2)" />
      {(i === 0 || i === 2) && (
        <path
          d={bed.surface}
          fill="none"
          stroke={i === 0 ? BLUE : SAGE}
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeDasharray="110 310"
          className="hero-bd-dash-flow"
        />
      )}
    </g>
  ));
}

function OutcropArt({ id }) {
  const { cx, cy, r } = GEOLOGY_NET;
  return (
    <>
      <defs>
        <pattern id={id("beddots")} width="22" height="14" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1" fill={SLATE} fillOpacity="0.18" />
          <circle cx="15" cy="10" r="1" fill={BLUE} fillOpacity="0.2" />
        </pattern>
        <clipPath id={id("footwall")}>
          <path d="M-180 -120H1318L1228 780H-180Z" />
        </clipPath>
        <clipPath id={id("hangingwall")}>
          <path d="M1318 -120H1680V780H1228Z" />
        </clipPath>
      </defs>

      {/* Schmidt equal-area stereonet upper-left of hero frame */}
      <g className="hero-bd-parallax-back">
        <g className="hero-bd-breathe" style={{ transformOrigin: `${cx}px ${cy}px` }} fill="none">
          <circle cx={cx} cy={cy} r={r} fill={SOFT} fillOpacity="0.55" stroke={BLUE} strokeOpacity="0.32" strokeWidth="1.4" />
          <circle cx={cx} cy={cy} r={r * 0.66} stroke={SLATE} strokeOpacity="0.18" strokeDasharray="4 6" />
          <circle cx={cx} cy={cy} r={r * 0.34} stroke={SAGE} strokeOpacity="0.24" />
          {GEOLOGY_NET.arcs.map((d, i) => (
            <path key={i} d={d} stroke={BLUE} strokeOpacity={i === 2 ? 0.3 : 0.16} strokeWidth="1" />
          ))}
          <line x1={cx - r - 18} y1={cy} x2={cx + r + 18} y2={cy} stroke={SLATE} strokeOpacity="0.2" strokeDasharray="3 5" />
        </g>

        <g className="hero-bd-wave-a" clipPath={`url(#${id("footwall")})`}>
          <OutcropBeds id={id} />
        </g>
      </g>

      <g className="hero-bd-parallax-front">
        <g clipPath={`url(#${id("hangingwall")})`}>
          <g className="hero-bd-fault-slip">
            <OutcropBeds id={id} />
          </g>
        </g>
        <path d="M1318 -120L1228 780" stroke={SLATE} strokeOpacity="0.34" strokeWidth="1.5" strokeDasharray="10 6" fill="none" />
        <path d="M1318 -120L1228 780" stroke={BLUE} strokeOpacity="0.56" strokeWidth="2.2" strokeDasharray="48 160" fill="none" className="hero-bd-dash-flow" />
      </g>
    </>
  );
}

/* ── 3. Diagnose: specimen calibration dial + planispiral halo ────────── */

const SPIRAL = (() => {
  const cx = 1045;
  const cy = 320;
  const a = 9;
  const b = Math.log(415 / a) / (6 * Math.PI);
  const r = (t) => (t <= 0 ? 0 : a * Math.exp(b * t));
  const at = (t, rad) => [cx + Math.cos(t) * rad, cy + Math.sin(t) * rad];
  const step = 0.42;
  const chambers = [];
  for (let k = 0; (k + 1) * step <= 6 * Math.PI + 0.001; k += 1) {
    const t0 = k * step;
    const t1 = (k + 1) * step;
    const outer = [];
    const inner = [];
    for (let s = 0; s <= 5; s += 1) {
      const t = t0 + ((t1 - t0) * s) / 5;
      outer.push(at(t, r(t)));
      inner.push(at(t, r(t - 2 * Math.PI)));
    }
    chambers.push({
      d: polyPath([...outer, ...inner.reverse()]),
      septum: `M${r1(at(t0, r(t0 - 2 * Math.PI))[0])} ${r1(at(t0, r(t0 - 2 * Math.PI))[1])} L${r1(at(t0, r(t0))[0])} ${r1(at(t0, r(t0))[1])}`,
      fill: k % 3 === 0 ? SAGE_SOFT : k % 2 === 0 ? TINT : SOFT,
      opacity: r1(0.16 + (k / 45) * 0.32),
      tone: k % 3 === 0 ? "a" : k % 3 === 1 ? "b" : "c",
    });
  }
  const spiralPts = [];
  for (let t = 0.2; t <= 6 * Math.PI; t += 0.12) spiralPts.push(at(t, r(t)));
  const dialTicks = Array.from({ length: 48 }, (_, k) => {
    const angle = (k / 48) * Math.PI * 2;
    const r0 = 268;
    const r1Len = k % 4 === 0 ? 18 : 9;
    return `M${r1(cx + Math.cos(angle) * r0)} ${r1(cy + Math.sin(angle) * r0)}L${r1(cx + Math.cos(angle) * (r0 + r1Len))} ${r1(cy + Math.sin(angle) * (r0 + r1Len))}`;
  }).join("");
  return { chambers, outline: openSmoothPath(spiralPts), dialTicks, cx, cy };
})();

function SpiralArt() {
  const { cx, cy } = SPIRAL;
  return (
    <>
      <g className="hero-bd-parallax-back">
        <g className="hero-bd-spin-rev" style={{ transformOrigin: `${cx}px ${cy}px` }} fill="none">
          <circle cx={cx} cy={cy} r="292" stroke={SLATE} strokeOpacity="0.22" strokeWidth="1.2" strokeDasharray="3 10" />
          <circle cx={cx} cy={cy} r="360" stroke={BLUE} strokeOpacity="0.2" strokeWidth="1" strokeDasharray="28 14" />
          <circle cx={cx} cy={cy} r="430" stroke={SAGE} strokeOpacity="0.22" strokeWidth="1" strokeDasharray="10 14" />
          <path d={SPIRAL.dialTicks} stroke={BLUE} strokeOpacity="0.3" strokeWidth="1.1" />
        </g>
        <path
          d={`M${cx - 460} ${cy}H${cx + 460}M${cx} ${cy - 460}V${cy + 460}`}
          stroke={SLATE}
          strokeOpacity="0.14"
          strokeWidth="1"
          strokeDasharray="6 8"
        />
        <circle className="hero-bd-pulse" cx={cx} cy={cy} r="210" fill="none" stroke={BLUE} strokeOpacity="0.3" strokeWidth="1.4" />
      </g>

      <g className="hero-bd-parallax-front">
        <g className="hero-bd-spin" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          {SPIRAL.chambers.map((c, i) => (
            <path
              key={i}
              d={c.d}
              fill={c.fill}
              fillOpacity={Math.min(c.opacity, 0.5)}
              stroke={SEP}
              strokeOpacity="0.92"
              strokeWidth="1.2"
              className={`hero-bd-grain-${c.tone}`}
            />
          ))}
          <g fill="none" stroke={SLATE} strokeOpacity="0.24" strokeWidth="0.95">
            {SPIRAL.chambers.map((c, i) => (
              <path key={i} d={c.septum} />
            ))}
          </g>
          <path d={SPIRAL.outline} fill="none" stroke={BLUE} strokeOpacity="0.34" strokeWidth="1.5" />
          <path
            d={SPIRAL.outline}
            fill="none"
            stroke={BLUE}
            strokeOpacity="0.65"
            strokeWidth="2.4"
            strokeDasharray="120 420"
            className="hero-bd-dash-flow"
          />
        </g>
      </g>
    </>
  );
}

/* ── 4. Visual AI: calibrated polarizer lens & faceted mineral plate ─── */

const FIELD = { cx: 1055, cy: 310, r: 306 };
const THIN_SECTION = (() => {
  const rand = rng(17);
  const sx = 64;
  const sy = 56;
  const cols = 15;
  const rows = 13;
  const pts = [];
  for (let j = 0; j < rows; j += 1) {
    pts.push([]);
    for (let i = 0; i < cols; i += 1) {
      pts[j].push([680 + i * sx + (j % 2) * (sx / 2) + (rand() - 0.5) * 26, -20 + j * sy + (rand() - 0.5) * 22]);
    }
  }
  const palette = [SOFT, TINT, SAGE_SOFT, "var(--bd-tint, #dbeaf7)", SKY, "var(--bd-sage-soft, #e7f1ee)"];
  const tris = [];
  for (let j = 0; j < rows - 1; j += 1) {
    for (let i = 0; i < cols - 1; i += 1) {
      const a = pts[j][i];
      const b = pts[j][i + 1];
      const c = pts[j + 1][i];
      const d = pts[j + 1][i + 1];
      const pair = j % 2 === 0 ? [[a, b, c], [b, d, c]] : [[a, d, c], [a, b, d]];
      pair.forEach((t) => {
        const roll = rand();
        const tone = roll < 0.2 ? "a" : roll < 0.4 ? "b" : roll < 0.6 ? "c" : "";
        tris.push({
          d: polyPath(t),
          fill: roll < 0.72 ? palette[Math.floor(rand() * palette.length)] : null,
          opacity: r1(0.24 + rand() * 0.34),
          tone,
        });
      });
    }
  }
  const ticks = Array.from({ length: 72 }, (_, k) => {
    const t = (k / 72) * Math.PI * 2;
    const len = k % 6 === 0 ? 18 : 8;
    const p1 = [FIELD.cx + Math.cos(t) * (FIELD.r + 6), FIELD.cy + Math.sin(t) * (FIELD.r + 6)];
    const p2 = [FIELD.cx + Math.cos(t) * (FIELD.r + 6 + len), FIELD.cy + Math.sin(t) * (FIELD.r + 6 + len)];
    return `M${r1(p1[0])} ${r1(p1[1])}L${r1(p2[0])} ${r1(p2[1])}`;
  }).join("");
  return { tris, ticks };
})();

function ThinSectionArt({ id }) {
  const { cx, cy, r } = FIELD;
  return (
    <>
      <defs>
        <clipPath id={id("field")}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <linearGradient id={id("scan")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={TINT} stopOpacity="0" />
          <stop offset="0.78" stopColor={SKY} stopOpacity="0.36" />
          <stop offset="1" stopColor={BLUE} stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <g className="hero-bd-parallax-back">
        <g className="hero-bd-spin" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={SLATE} strokeOpacity="0.28" strokeWidth="1.3" />
          <circle cx={cx} cy={cy} r={r + 48} fill="none" stroke={SAGE} strokeOpacity="0.22" strokeWidth="1" strokeDasharray="16 12" />
          <path d={THIN_SECTION.ticks} stroke={BLUE} strokeOpacity="0.34" strokeWidth="1.1" fill="none" />
        </g>
        <path
          d={`M${cx - r - 56} ${cy}H${cx + r + 56}M${cx} ${cy - r - 56}V${cy + r + 56}`}
          stroke={SLATE}
          strokeOpacity="0.18"
          strokeWidth="1"
          strokeDasharray="5 7"
        />
        {/* Optical framing target brackets */}
        <path
          d={`M${cx - 352} ${cy - 238}h34m-34 0v34M${cx + 352} ${cy - 238}h-34m34 0v34M${cx - 352} ${cy + 238}h34m-34 0v-34M${cx + 352} ${cy + 238}h-34m34 0v-34`}
          stroke={BLUE}
          strokeOpacity="0.45"
          strokeWidth="1.6"
          fill="none"
        />
      </g>

      <g className="hero-bd-parallax-front" clipPath={`url(#${id("field")})`}>
        <circle cx={cx} cy={cy} r={r} fill={SOFT} fillOpacity="0.65" />
        {THIN_SECTION.tris.map((t, i) => (
          <path
            key={i}
            d={t.d}
            fill={t.fill || "none"}
            fillOpacity={t.opacity}
            stroke={SEP}
            strokeOpacity="0.92"
            strokeWidth="1.1"
            className={t.tone ? `hero-bd-grain-${t.tone}` : undefined}
          />
        ))}
        <g className="hero-bd-scan">
          <rect x={cx - r} y={cy - r - 76} width={r * 2} height="76" fill={`url(#${id("scan")})`} />
          <line x1={cx - r} y1={cy - r} x2={cx + r} y2={cy - r} stroke={BLUE} strokeOpacity="0.72" strokeWidth="1.6" />
        </g>
      </g>
    </>
  );
}

/* ── 5. About: faceted ontology constellation & hierarchy orbits ─────── */

const NETWORK = (() => {
  const rand = rng(42);
  const cx = 1040;
  const cy = 310;
  const nodes = [];
  let guard = 0;
  while (nodes.length < 36 && guard < 4000) {
    guard += 1;
    const p = [620 + rand() * 840, 20 + rand() * 600];
    if (nodes.every((n) => Math.hypot(n[0] - p[0], n[1] - p[1]) > 78)) nodes.push(p);
  }
  const seen = new Set();
  const edges = [];
  nodes.forEach((n, i) => {
    nodes
      .map((m, j) => ({ j, d: Math.hypot(m[0] - n[0], m[1] - n[1]) }))
      .filter((e) => e.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 3)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push([n, nodes[j]]);
        }
      });
  });
  // Triangulated background facets connecting clusters
  const facets = [];
  for (let i = 0; i < nodes.length - 2; i += 3) {
    const tri = [nodes[i], nodes[i + 1], nodes[i + 2]];
    const maxEdge = Math.max(
      Math.hypot(tri[0][0] - tri[1][0], tri[0][1] - tri[1][1]),
      Math.hypot(tri[1][0] - tri[2][0], tri[1][1] - tri[2][1])
    );
    if (maxEdge < 280) {
      facets.push({
        d: polyPath(tri),
        fill: i % 2 === 0 ? TINT : SAGE_SOFT,
        tone: i % 3 === 0 ? "a" : i % 3 === 1 ? "b" : "c",
      });
    }
  }
  return { cx, cy, nodes, edges, facets };
})();

function NetworkArt() {
  const { cx, cy } = NETWORK;
  return (
    <>
      <g className="hero-bd-parallax-back">
        <g className="hero-bd-spin-rev" style={{ transformOrigin: `${cx}px ${cy}px` }} fill="none">
          {[160, 260, 360].map((rad, idx) => (
            <circle
              key={rad}
              cx={cx}
              cy={cy}
              r={rad}
              stroke={idx === 1 ? BLUE : SLATE}
              strokeOpacity={idx === 1 ? 0.22 : 0.14}
              strokeWidth="1"
              strokeDasharray="6 10"
            />
          ))}
        </g>

        <g className="hero-bd-float-slow">
          {NETWORK.facets.map((f, i) => (
            <path
              key={i}
              d={f.d}
              fill={f.fill}
              fillOpacity="0.35"
              stroke={SEP}
              strokeOpacity="0.85"
              strokeWidth="1.1"
              className={`hero-bd-grain-${f.tone}`}
            />
          ))}
          <g stroke={SLATE} strokeOpacity="0.2" strokeWidth="1">
            {NETWORK.edges.map(([a, b], i) => (
              <line key={i} x1={r1(a[0])} y1={r1(a[1])} x2={r1(b[0])} y2={r1(b[1])} />
            ))}
          </g>
          <g fill="none" stroke={BLUE} strokeOpacity="0.58" strokeWidth="1.9" strokeDasharray="24 96" className="hero-bd-dash-flow">
            {NETWORK.edges.filter((_, i) => i % 4 === 0).map(([a, b], i) => (
              <line key={i} x1={r1(a[0])} y1={r1(a[1])} x2={r1(b[0])} y2={r1(b[1])} />
            ))}
          </g>
        </g>
      </g>

      <g className="hero-bd-parallax-front">
        <g className="hero-bd-float">
          {NETWORK.nodes.map((n, i) => {
            const hub = i % 6 === 0;
            const sageHub = i % 5 === 2;
            return (
              <g key={i}>
                {hub && (
                  <>
                    <circle
                      className="hero-bd-pulse"
                      style={{ animationDelay: `${(i % 4) * 0.9}s` }}
                      cx={r1(n[0])}
                      cy={r1(n[1])}
                      r="20"
                      fill={TINT}
                      fillOpacity="0.34"
                      stroke={BLUE}
                      strokeOpacity="0.34"
                    />
                    <circle
                      className="hero-bd-pulse"
                      style={{ animationDelay: `${(i % 4) * 0.9 + 1.4}s` }}
                      cx={r1(n[0])}
                      cy={r1(n[1])}
                      r="20"
                      fill="none"
                      stroke={BLUE}
                      strokeOpacity="0.3"
                    />
                  </>
                )}
                <circle
                  cx={r1(n[0])}
                  cy={r1(n[1])}
                  r={hub ? 6.5 : sageHub ? 5 : 3.6}
                  fill={sageHub ? SAGE : hub ? BLUE : AZURE}
                  fillOpacity={sageHub ? 0.8 : 0.72}
                  stroke={SEP}
                  strokeWidth="1.6"
                />
              </g>
            );
          })}
        </g>
      </g>
    </>
  );
}

/* ── 6. Contact: cool geodetic map graticule, contours & beacon ──────── */

const SURVEY = (() => {
  const meridians = [];
  for (let m = -7; m <= 7; m += 1) {
    const pts = [];
    for (let y = -60; y <= H + 60; y += 70) {
      const k = (y - 300) / 360;
      pts.push([1050 + m * 92 * (1 - 0.12 * k * k), y]);
    }
    meridians.push(openSmoothPath(pts));
  }
  const parallels = [];
  for (let p = -5; p <= 5; p += 1) {
    const pts = [];
    for (let x = 500; x <= W + 80; x += 80) pts.push([x, 300 + p * 70 + 46 * ((x - 1050) / 700) ** 2]);
    parallels.push(openSmoothPath(pts));
  }
  const route = openSmoothPath([[590, 620], [740, 535], [895, 565], [1025, 475], [1135, 446], [1226, 412]]);
  return {
    meridians,
    parallels,
    route,
    hillA: contourRings({ cx: 900, cy: 175, count: 6, start: 26, step: 28, phase: 1.2 }),
    hillB: contourRings({ cx: 1320, cy: 525, count: 7, start: 24, step: 28, stretch: 1.2, phase: 2.4 }),
  };
})();

function SurveyArt() {
  return (
    <>
      <g className="hero-bd-parallax-back">
        <g className="hero-bd-float-slow" fill="none" stroke={SLATE} strokeWidth="0.9">
          {SURVEY.meridians.map((d, i) => (
            <path key={`m${i}`} d={d} strokeOpacity={i % 3 === 0 ? 0.22 : 0.1} />
          ))}
          {SURVEY.parallels.map((d, i) => (
            <path key={`p${i}`} d={d} strokeOpacity={i % 3 === 0 ? 0.22 : 0.1} />
          ))}
        </g>

        <g className="hero-bd-breathe" style={{ transformOrigin: "900px 175px" }}>
          {SURVEY.hillA.map((c, i) => (
            <path
              key={i}
              d={c.d}
              fill={i % 2 === 0 ? SOFT : TINT}
              fillOpacity={0.28 - i * 0.03}
              stroke={BLUE}
              strokeOpacity={c.index ? 0.36 : c.opacity}
              strokeWidth={c.index ? 1.5 : 1}
            />
          ))}
        </g>

        <g className="hero-bd-breathe" style={{ transformOrigin: "1320px 525px" }}>
          {SURVEY.hillB.map((c, i) => (
            <path
              key={i}
              d={c.d}
              fill={SAGE_SOFT}
              fillOpacity={0.22 - i * 0.02}
              stroke={SAGE}
              strokeOpacity={c.index ? 0.36 : c.opacity + 0.04}
              strokeWidth={c.index ? 1.5 : 1}
            />
          ))}
        </g>
      </g>

      <g className="hero-bd-parallax-front">
        <path d={SURVEY.route} fill="none" stroke={TINT} strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round" />
        <path
          d={SURVEY.route}
          fill="none"
          stroke={BLUE}
          strokeOpacity="0.68"
          strokeWidth="2.2"
          strokeDasharray="10 10"
          strokeLinecap="round"
          className="hero-bd-route-flow"
        />
        <g transform="translate(1226 412)">
          <g className="hero-bd-spin-rev" style={{ transformOrigin: "0px 0px" }}>
            <circle r="58" fill="none" stroke={BLUE} strokeOpacity="0.3" strokeWidth="1" strokeDasharray="4 10" />
            <circle r="84" fill="none" stroke={SAGE} strokeOpacity="0.24" strokeWidth="1" strokeDasharray="16 12" />
          </g>
          <circle className="hero-bd-pulse" r="46" fill={TINT} fillOpacity="0.36" stroke={BLUE} strokeOpacity="0.36" />
          <circle className="hero-bd-pulse" style={{ animationDelay: "1.2s" }} r="46" fill="none" stroke={BLUE} strokeOpacity="0.32" />
          <circle className="hero-bd-pulse" style={{ animationDelay: "2.4s" }} r="46" fill="none" stroke={SAGE} strokeOpacity="0.28" />
          <path d="M0 0c-9-12-15-20-15-28a15 15 0 0 1 30 0c0 8-6 16-15 28z" fill={BLUE} fillOpacity="0.78" stroke={SEP} strokeWidth="1.6" />
          <circle cy="-28" r="5" fill="#FFFFFF" />
        </g>
      </g>
    </>
  );
}

/* ── 7. Search: harmonic acoustic ribbons & fault interferometry ─────── */

const SEISMIC = (() => {
  const waves = Array.from({ length: 18 }, (_, j) => {
    const pts = [];
    for (let x = 440; x <= W + 140; x += 14) {
      const env = Math.exp(-(((x - 1020) / 360) ** 2));
      const crest = (56 - j * 1.4) * env;
      const harmonic = 7 * Math.sin(x / 36 + j * 0.55) * env;
      const throwPx = 18 * Math.min(Math.max((x - 1266) / 22, 0), 1);
      pts.push([x, 128 + j * 26 - crest + harmonic + throwPx]);
    }
    const line = openSmoothPath(pts);
    return {
      d: line,
      area: j % 3 === 0 ? `${line} L${W + 140} ${H + 40} L440 ${H + 40} Z` : null,
      fill: j % 6 === 0 ? TINT : j % 6 === 3 ? SAGE_SOFT : SOFT,
      horizon: j % 4 === 1,
      band: j % 2 === 0 ? "a" : "b",
      opacity: j % 4 === 1 ? 0.52 : 0.18,
    };
  });
  return waves;
})();

function SeismicArt() {
  return (
    <>
      <g className="hero-bd-parallax-back" fill="none">
        <g className="hero-bd-wave-a">
          {SEISMIC.filter((l) => l.band === "a").map((l, i) => (
            <g key={i}>
              {l.area && <path d={l.area} fill={l.fill} fillOpacity="0.28" />}
              <path d={l.d} stroke={l.horizon ? BLUE : SLATE} strokeOpacity={l.opacity} strokeWidth={l.horizon ? 1.5 : 0.95} />
            </g>
          ))}
        </g>
        <g className="hero-bd-wave-b">
          {SEISMIC.filter((l) => l.band === "b").map((l, i) => (
            <g key={i}>
              {l.area && <path d={l.area} fill={l.fill} fillOpacity="0.28" />}
              <path d={l.d} stroke={l.horizon ? SAGE : SLATE} strokeOpacity={l.opacity} strokeWidth={l.horizon ? 1.5 : 0.95} />
            </g>
          ))}
        </g>
      </g>

      <g className="hero-bd-parallax-front" fill="none">
        {SEISMIC.filter((l) => l.horizon).map((l, i) => (
          <path
            key={i}
            d={l.d}
            stroke={i % 2 === 0 ? BLUE : SAGE}
            strokeOpacity="0.62"
            strokeWidth="2.1"
            strokeDasharray="110 300"
            className="hero-bd-dash-flow"
          />
        ))}
        <path d="M1288 44L1254 640" stroke={SLATE} strokeOpacity="0.32" strokeWidth="1.3" strokeDasharray="8 6" />
        <path
          d={Array.from({ length: 48 }, (_, i) => `M${540 + i * 20} 36v${i % 5 === 0 ? 16 : 8}`).join("")}
          stroke={BLUE}
          strokeOpacity="0.32"
          strokeWidth="1.1"
        />
      </g>
    </>
  );
}

/* ── 8. News: STONE radial voussoir stone rosette & vault drafting ───── */

const HERITAGE_ROSE = (() => {
  const cx = 1090;
  const cy = 320;
  const rings = [
    { rIn: 210, rOut: 274, count: 16, speed: "a" },
    { rIn: 278, rOut: 348, count: 20, speed: "b" },
    { rIn: 352, rOut: 430, count: 24, speed: "c" },
  ];
  const fills = [SOFT, TINT, SAGE_SOFT];
  const innerWedges = [];
  const outerWedges = [];
  rings.forEach((ring, ri) => {
    const step = (Math.PI * 2) / ring.count;
    for (let k = 0; k < ring.count; k += 1) {
      const a0 = k * step + ri * 0.14;
      const a1 = a0 + step - 0.015;
      const wedge = {
        d: annularSector(cx, cy, ring.rIn, ring.rOut, a0, a1),
        fill: fills[(k + ri) % fills.length],
        opacity: r1(0.32 + ((k + ri) % 3) * 0.16),
        tone: (k + ri) % 3 === 0 ? "a" : (k + ri) % 3 === 1 ? "b" : "c",
      };
      if (ri === 1) outerWedges.push(wedge);
      else innerWedges.push(wedge);
    }
  });
  return { cx, cy, innerWedges, outerWedges };
})();

function HeritageArt() {
  const { cx, cy } = HERITAGE_ROSE;
  return (
    <>
      <g className="hero-bd-parallax-back">
        <g className="hero-bd-spin" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          {HERITAGE_ROSE.innerWedges.map((w, i) => (
            <path
              key={i}
              d={w.d}
              fill={w.fill}
              fillOpacity={w.opacity}
              stroke={SEP}
              strokeOpacity="0.92"
              strokeWidth="1.3"
              className={`hero-bd-grain-${w.tone}`}
            />
          ))}
        </g>
        <path
          d={`M${cx - 460} ${cy}H${cx + 460}M${cx} ${cy - 460}V${cy + 460}`}
          stroke={SLATE}
          strokeOpacity="0.16"
          strokeWidth="1"
          strokeDasharray="6 8"
        />
      </g>

      <g className="hero-bd-parallax-front">
        <g className="hero-bd-spin-rev" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          {HERITAGE_ROSE.outerWedges.map((w, i) => (
            <path
              key={i}
              d={w.d}
              fill={w.fill}
              fillOpacity={w.opacity}
              stroke={SEP}
              strokeOpacity="0.92"
              strokeWidth="1.4"
            />
          ))}
          <circle cx={cx} cy={cy} r="350" fill="none" stroke={BLUE} strokeOpacity="0.34" strokeWidth="1.4" strokeDasharray="120 80" />
          <circle cx={cx} cy={cy} r="434" fill="none" stroke={SAGE} strokeOpacity="0.28" strokeWidth="1.1" strokeDasharray="12 10" />
        </g>
        <circle
          cx={cx}
          cy={cy}
          r="276"
          fill="none"
          stroke={BLUE}
          strokeOpacity="0.6"
          strokeWidth="2.1"
          strokeDasharray="130 340"
          className="hero-bd-dash-flow"
        />
      </g>
    </>
  );
}

/* ── component ───────────────────────────────────────────────────────── */

const ART = {
  strata: StrataArt,
  outcrop: OutcropArt,
  spiral: SpiralArt,
  thinsection: ThinSectionArt,
  network: NetworkArt,
  survey: SurveyArt,
  seismic: SeismicArt,
  heritage: HeritageArt,
};

export default function HeroBackdrop({ variant = "strata" }) {
  // useId can contain characters that are not safe inside url(#…).
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (name) => `hbd-${uid}-${name}`;
  const Art = ART[variant] || StrataArt;
  const rootRef = useRef(null);

  // Pointer parallax: sets CSS custom props (--hx, --hy) on mouse move
  // over the enclosing hero section, skipped under reduced-motion.
  useEffect(() => {
    const el = rootRef.current;
    const host = el?.parentElement;
    if (!el || !host || typeof window === "undefined") return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;

    const flush = () => {
      frame = 0;
      el.style.setProperty("--hx", targetX.toFixed(3));
      el.style.setProperty("--hy", targetY.toFixed(3));
    };

    const schedule = (nx, ny) => {
      targetX = nx;
      targetY = ny;
      if (!frame) frame = requestAnimationFrame(flush);
    };

    const onMove = (event) => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      schedule(Math.max(-1, Math.min(1, nx)), Math.max(-1, Math.min(1, ny)));
    };

    const onLeave = () => schedule(0, 0);

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className={`hero-bd hero-bd--${variant} pointer-events-none -z-10`} aria-hidden="true">
      <div className="hero-bd-art">
        <svg className="hero-bd-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMid slice" focusable="false">
          <Art id={id} />
        </svg>
      </div>
      <div className="hero-bd-veil" />
      <div className="hero-bd-grid" />
    </div>
  );
}
