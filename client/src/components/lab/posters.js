import { SPECIMENS, specimenNumber } from "./specimens";

// ─── WALL BOARDS ────────────────────────────────────────────────────────────
// -jr Every board is drawn on a <canvas> with the 2D API. The same canvas is
// the texture on the wall and, enlarged, the picture in the reading overlay,
// so the content is written once. Redrawn when the language changes.

const FONT = "Inter, 'Segoe UI', system-ui, sans-serif";
const PAPER = "#f7f2e6";
const INK = "#1f2d24";
const MUTED = "#56665b";
const ACCENT = "#2d6e34";
const LINE = "#7a6a48";
const SHELL = "#fbf3dc";

export const POSTERS = [
  { id: "anatomy", icon: "🔬", size: [900, 1200] },
  { id: "arrangements", icon: "🌀", size: [900, 1200] },
  { id: "depth", icon: "🌊", size: [900, 1200] },
  { id: "timeline", icon: "⏳", size: [1400, 900] },
  { id: "walls", icon: "🧱", size: [1400, 900] },
  { id: "microscope", icon: "🧪", size: [1400, 900], station: true },
];

export const posterById = (id) => POSTERS.find((p) => p.id === id) || null;

const TEXT = {
  anatomy: {
    tr: {
      title: "Foraminifer nedir?",
      subtitle: "Kavkılı, tek hücreli bir deniz canlısı",
      lead: "Foraminiferler tek bir hücreden oluşur, ama kendilerine odacıklı bir kavkı (kabuk) yaparlar. Hücre büyüdükçe yeni ve daha büyük bir odacık ekler. Öldüklerinde kavkıları deniz tabanında birikir ve kayaçlara karışır.",
      labels: {
        proloculus: "Proloculus: ilk odacık",
        chamber: "Odacık",
        suture: "Dikiş (sütür)",
        aperture: "Ağız (aperture)",
        pores: "Gözenekler",
        spines: "Dikenler",
        pseudopodia: "Psödopodlar: yalancı ayaklar",
      },
      note: "Şematik çizim: bu özelliklerin hepsi her türde bulunmaz.",
      facts: [
        "Boyut: çoğu 0,1–1 mm; büyük bentik türler birkaç santimetre.",
        "Kambriyen'den (~540 milyon yıl) beri denizlerde yaşarlar.",
        "On binlerce fosil türü tanımlanmıştır.",
        "Planktonik (suda süzülen) veya bentik (tabanda yaşayan) olabilirler.",
      ],
    },
    en: {
      title: "What is a foraminifer?",
      subtitle: "A single-celled sea creature with a shell",
      lead: "A foraminifer is a single cell, yet it builds itself a chambered shell (test). As the cell grows it adds a new, larger chamber. After death the tests pile up on the sea floor and become part of rocks.",
      labels: {
        proloculus: "Proloculus: first chamber",
        chamber: "Chamber",
        suture: "Suture",
        aperture: "Aperture",
        pores: "Pores",
        spines: "Spines",
        pseudopodia: "Pseudopodia",
      },
      note: "Schematic drawing: not every species has all of these features.",
      facts: [
        "Size: mostly 0.1–1 mm; larger benthic species reach several centimetres.",
        "They have lived in the sea since the Cambrian (~540 million years).",
        "Tens of thousands of fossil species have been described.",
        "They can be planktonic (drifting) or benthic (living on the floor).",
      ],
    },
  },
  arrangements: {
    tr: {
      title: "Odacık dizilimleri",
      subtitle: "Tanının en önemli ipuçlarından biri",
      lab: "Laboratuvarda",
      other: "Örnek cins",
      items: {
        planispiral: ["Planispiral", "Tek bir düzlemde sarmal; iki yüz simetrik."],
        trochospiral: ["Trokospiral", "Koni gibi yükselen sarmal; iki yüz farklı görünür."],
        uniserial: ["Uniseri", "Odacıklar tek sıra hâlinde üst üste."],
        biserial: ["Biseri", "İki sıra, zikzak yaparak büyür."],
        triserial: ["Triseri", "Her turda üç odacık, üç sıra."],
        annular: ["Anüler", "Merkezin çevresinde tam halkalar."],
      },
    },
    en: {
      title: "Chamber arrangements",
      subtitle: "One of the most important clues for identification",
      lab: "In the lab",
      other: "Example genus",
      items: {
        planispiral: ["Planispiral", "Coiled in one plane; both sides symmetrical."],
        trochospiral: ["Trochospiral", "A spiral rising like a cone; the two sides differ."],
        uniserial: ["Uniserial", "Chambers stacked in a single row."],
        biserial: ["Biserial", "Two rows, growing in a zigzag."],
        triserial: ["Triserial", "Three chambers per whorl, three rows."],
        annular: ["Annular", "Complete rings around the centre."],
      },
    },
  },
  depth: {
    tr: {
      title: "Nerede yaşarlar?",
      subtitle: "Yüzeyden derin denize",
      surface: "Deniz yüzeyi",
      photic: "Işıklı zon (~0–200 m)",
      zones: ["Kıyı / lagün", "Şelf", "Şelf kenarı", "Kıta yamacı"],
      sink: "ölünce tabana çöker",
      planktonic: "Planktonik",
      benthic: "Bentik",
      caption: "Her tür belirli bir derinlik ve ortamı sever. Bir kayaç tabakasındaki türlerin birlikteliğine bakarak o tabakanın ne kadar derin bir denizde çökeldiği tahmin edilir (paleobatimetri). Planktoniklerin kavkıları ise ölünce tabana çöker ve derin deniz çamurlarına karışır.",
      approx: "Derinlikler tipik ve yaklaşıktır.",
    },
    en: {
      title: "Where do they live?",
      subtitle: "From the surface to the deep sea",
      surface: "Sea surface",
      photic: "Sunlit zone (~0–200 m)",
      zones: ["Coast / lagoon", "Shelf", "Shelf edge", "Continental slope"],
      sink: "sinks after death",
      planktonic: "Planktonic",
      benthic: "Benthic",
      caption: "Each species prefers a certain depth and setting. The species found together in a rock layer tell how deep the sea was when the layer formed (paleobathymetry). Planktonic tests sink after death and end up in deep-sea muds.",
      approx: "Depths are typical and approximate.",
    },
  },
  timeline: {
    tr: {
      title: "Zaman içinde foraminiferler",
      subtitle: "540 milyon yıllık bir hikâye",
      eras: ["Paleozoyik", "Mezozoyik", "Senozoyik"],
      events: [
        "Kambriyen: ilk foraminiferler. Basit, aglütine kavkılar.",
        "Karbonifer–Permiyen: fusulinidler; pirinç tanesi boyunda dev hücreler.",
        "Permiyen sonu yok oluşu: fusulinidler tükenir.",
        "Jura: ilk planktonik foraminiferler.",
        "Kretase sonu (K–Pg) yok oluşu: planktonik türlerin çoğu kaybolur.",
        "Paleosen–Eosen: büyük bentiklerin altın çağı (Nummulites, Alveolina, Discocyclina). ForamID bu aralığa odaklanır.",
        "Paleosen–Eosen Termal Maksimumu: ani ısınma, derin deniz bentiklerinin büyük kısmı yok olur.",
        "Bugün: her denizde. Paleoiklim araştırmalarının temel aracı.",
      ],
      unit: "Ma = milyon yıl önce · Ölçek her zamanda farklıdır.",
      pyramids: "Gize piramitlerinin taşı: Eosen yaşlı Nummulites kireçtaşı.",
    },
    en: {
      title: "Foraminifera through time",
      subtitle: "A 540-million-year story",
      eras: ["Paleozoic", "Mesozoic", "Cenozoic"],
      events: [
        "Cambrian: the first foraminifera. Simple, agglutinated tests.",
        "Carboniferous–Permian: fusulinids; giant cells the size of rice grains.",
        "End-Permian extinction: the fusulinids die out.",
        "Jurassic: the first planktonic foraminifera.",
        "End-Cretaceous (K–Pg) extinction: most planktonic species vanish.",
        "Paleocene–Eocene: golden age of larger benthics (Nummulites, Alveolina, Discocyclina). ForamID focuses on this interval.",
        "Paleocene–Eocene Thermal Maximum: sudden warming; much of the deep-sea benthic fauna goes extinct.",
        "Today: in every sea. A key tool of climate research.",
      ],
      unit: "Ma = million years ago · The scale differs per era.",
      pyramids: "The stone of the Giza pyramids: Eocene Nummulites limestone.",
    },
  },
  walls: {
    tr: {
      title: "Kavkı duvarı: tanının ilk sorusu",
      subtitle: "Duvarın neyden ve nasıl yapıldığı, foraminiferleri üç büyük gruba ayırır",
      types: [
        ["Hiyalin", "Camsı ve ışığı geçirir. Duvar ince gözeneklerle delik deşiktir; kalsitten yapılır.", "Nummulites, Discocyclina, Elphidium", "Bu laboratuvardaki bütün gerçek örnekler hiyalindir."],
        ["Porselenimsi", "Mat ve süt beyazı, porselen gibi. Gözeneksizdir; magnezyumca zengin kalsitten yapılır.", "Alveolina, Quinqueloculina, Peneroplis", ""],
        ["Aglütine", "Hücre, çevresindeki kum tanelerini ve başka parçacıkları bir çimentoyla yapıştırır. Yüzeyi pürüzlüdür.", "Textularia, Ammodiscus, Dictyoconus", ""],
      ],
      examples: "Örnekler",
      footer: "ForamID tanı aracı da işe bu soruyla başlar: CHR_01 · Kavkı bileşimi (hiyalin / porselen / aglütine).",
    },
    en: {
      title: "The test wall: the first identification question",
      subtitle: "What the wall is made of, and how, splits foraminifera into three large groups",
      types: [
        ["Hyaline", "Glassy and translucent. The wall is riddled with fine pores; made of calcite.", "Nummulites, Discocyclina, Elphidium", "Every real specimen in this lab is hyaline."],
        ["Porcelaneous", "Opaque and milky white, like porcelain. Without pores; made of magnesium-rich calcite.", "Alveolina, Quinqueloculina, Peneroplis", ""],
        ["Agglutinated", "The cell glues sand grains and other particles from its surroundings with a cement. The surface is rough.", "Textularia, Ammodiscus, Dictyoconus", ""],
      ],
      examples: "Examples",
      footer: "The ForamID tool starts with the same question: CHR_01 · Test composition (hyaline / porcelaneous / agglutinated).",
    },
  },
  microscope: {
    tr: {
      title: "Bir foraminifer nasıl incelenir?",
      subtitle: "Deniz tabanından bilgisayar ekranına",
      steps: [
        ["Örnek al", "Deniz tabanından çamur ya da karadan kayaç örneği alınır."],
        ["Yıka ve ele", "Çamur 63 µm elekten yıkanır: kil ve silt gider, kavkılar elekte kalır."],
        ["Ayıkla", "Stereomikroskop altında kavkılar ince bir fırçayla tek tek toplanır."],
        ["İnce kesit", "Sert kayaçtaki büyük foraminiferler için kayaç ~30 µm'ye inceltilir. ForamID bu görüntülerle çalışır."],
        ["µCT taraması", "X-ışınıyla yüzlerce kesit alınır ve bir 3D modele dönüştürülür. Buradaki modellerin çoğu böyle üretildi."],
      ],
      footer: "İpucu: bir sergiyi incelerken \"Kesit\" modunu aç; µCT modellerinde odacıkların içini ince kesitteki gibi görürsün.",
    },
    en: {
      title: "How is a foraminifer studied?",
      subtitle: "From the sea floor to the screen",
      steps: [
        ["Sample", "Mud is taken from the sea floor, or rock from land."],
        ["Wash and sieve", "The mud is washed through a 63 µm sieve: clay and silt go, the tests stay."],
        ["Pick", "Under a stereo microscope the tests are picked one by one with a fine brush."],
        ["Thin section", "For larger foraminifera in hard rock, the rock is ground to ~30 µm. ForamID works with such images."],
        ["µCT scan", "Hundreds of X-ray slices are turned into a 3D model. Most models here were made this way."],
      ],
      footer: "Tip: when inspecting an exhibit, switch on \"Section\" mode to look into the chambers of the µCT models, as in a thin section.",
    },
  },
};

export function posterTitle(id, lang) {
  return TEXT[id][lang].title;
}

// ─── DRAWING HELPERS ────────────────────────────────────────────────────────
function font(size, weight = 400, style = "") {
  return `${style} ${weight} ${size}px ${FONT}`.trim();
}

// Draws `text` wrapped to `maxWidth`; returns the y below the last line.
function wrap(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y);
  return y + lineHeight;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function frame(ctx, w, h, title, subtitle) {
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = ACCENT;
  ctx.fillRect(0, 0, w, 150);
  ctx.fillStyle = "#e8f5e0";
  ctx.font = font(26, 500);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillText(subtitle.toUpperCase(), 50, 52);
  ctx.fillStyle = "#ffffff";
  ctx.font = font(w > 1000 ? 54 : 50, 700);
  ctx.fillText(title, 50, 115);
  ctx.strokeStyle = "#3d5a40";
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, w - 12, h - 12);
}

// A tiny deterministic random, so pores and grains look the same every draw.
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function badge(ctx, x, y, n, color = ACCENT, r = 17) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = font(r * 1.1, 700);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(n), x, y + 1);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

function chamber(ctx, x, y, r, fill = SHELL) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = LINE;
  ctx.lineWidth = Math.max(1.5, r * 0.08);
  ctx.stroke();
}

// Chamber centres of a planispiral test, oldest first; used by two boards.
function spiralChambers(cx, cy, scale, count = 13) {
  const list = [{ x: cx, y: cy, r: 14 * scale }];
  for (let i = 1; i < count; i++) {
    const angle = i * 0.78 + 0.4;
    const distance = 26 * scale * Math.pow(1.15, i - 1);
    list.push({ x: cx + Math.cos(angle) * distance, y: cy + Math.sin(angle) * distance, r: distance * 0.46 });
  }
  return list;
}

function drawSpiral(ctx, cx, cy, scale, count) {
  const chambers = spiralChambers(cx, cy, scale, count);
  chambers.forEach((c) => chamber(ctx, c.x, c.y, c.r));
  return chambers;
}

// ─── BOARDS ─────────────────────────────────────────────────────────────────
// -jr The anatomy board labels its drawing with numbered markers and a key
// below, like a textbook figure: no leader lines crossing the drawing.
function drawAnatomy(ctx, w, h, t) {
  frame(ctx, w, h, t.title, t.subtitle);
  ctx.fillStyle = INK;
  ctx.font = font(25);
  wrap(ctx, t.lead, 50, 200, w - 100, 36);

  const cx = 450;
  const cy = 590;
  const rand = seeded(7);
  const chambers = spiralChambers(cx, cy, 1.2);
  const last = chambers[chambers.length - 1];
  const outwardOf = (c) => Math.atan2(c.y - cy, c.x - cx);

  // Spines from the outer chambers, drawn first so chambers cover their roots.
  ctx.strokeStyle = "#b39a6a";
  ctx.lineWidth = 2.5;
  chambers.slice(7).forEach((c) => {
    for (let k = 0; k < 5; k++) {
      const a = outwardOf(c) + (k - 2) * 0.28;
      ctx.beginPath();
      ctx.moveTo(c.x + Math.cos(a) * c.r * 0.9, c.y + Math.sin(a) * c.r * 0.9);
      ctx.lineTo(c.x + Math.cos(a) * (c.r + 50), c.y + Math.sin(a) * (c.r + 50));
      ctx.stroke();
    }
  });

  chambers.forEach((c) => {
    chamber(ctx, c.x, c.y, c.r);
    ctx.fillStyle = "#c9b68a";
    const pores = Math.round(c.r * 0.5);
    for (let k = 0; k < pores; k++) {
      const a = rand() * Math.PI * 2;
      const d = Math.sqrt(rand()) * c.r * 0.75;
      ctx.beginPath();
      ctx.arc(c.x + Math.cos(a) * d, c.y + Math.sin(a) * d, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  chamber(ctx, chambers[0].x, chambers[0].y, chambers[0].r, "#f0dca8");

  // Aperture: an opening at the base of the last chamber, facing the coil.
  const toCentre = Math.atan2(cy - last.y, cx - last.x) + 0.55;
  const ax = last.x + Math.cos(toCentre) * last.r * 0.78;
  const ay = last.y + Math.sin(toCentre) * last.r * 0.78;
  ctx.fillStyle = "#3a2c18";
  ctx.beginPath();
  ctx.ellipse(ax, ay, 20, 10, toCentre + Math.PI / 2, 0, Math.PI * 2);
  ctx.fill();

  // Pseudopodia streaming out of the aperture.
  ctx.strokeStyle = "rgba(176, 110, 50, 0.75)";
  ctx.lineWidth = 2;
  const out = outwardOf(last) - 0.5;
  for (let k = 0; k < 6; k++) {
    const a = out + (k - 2.5) * 0.2;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.bezierCurveTo(
      ax + Math.cos(a) * 60, ay + Math.sin(a) * 60 + 18,
      ax + Math.cos(a) * 120, ay + Math.sin(a) * 120 - 18,
      ax + Math.cos(a) * 175, ay + Math.sin(a) * 175
    );
    ctx.stroke();
  }

  const spine = chambers[9];
  const spineAngle = outwardOf(spine);
  const pore = chambers[8];
  const markers = [
    ["proloculus", chambers[0].x, chambers[0].y - chambers[0].r - 20],
    ["chamber", last.x - Math.cos(toCentre) * last.r * 0.35, last.y - Math.sin(toCentre) * last.r * 0.35],
    ["suture", (chambers[10].x + chambers[11].x) / 2, (chambers[10].y + chambers[11].y) / 2],
    ["aperture", ax + Math.cos(toCentre) * 30, ay + Math.sin(toCentre) * 30],
    ["pores", pore.x, pore.y],
    ["spines", spine.x + Math.cos(spineAngle) * (spine.r + 40), spine.y + Math.sin(spineAngle) * (spine.r + 40)],
    ["pseudopodia", ax + Math.cos(out) * 150, ay + Math.sin(out) * 150],
  ];
  markers.forEach(([, x, y], i) => badge(ctx, x, y, i + 1, "#b0457a", 17));

  // Key, two columns.
  markers.forEach(([key], i) => {
    const x = 60 + (i % 2) * 400;
    const y = 865 + Math.floor(i / 2) * 40;
    badge(ctx, x, y - 7, i + 1, "#b0457a", 14);
    ctx.fillStyle = INK;
    ctx.font = font(21, 600);
    ctx.fillText(t.labels[key], x + 26, y);
  });

  ctx.fillStyle = MUTED;
  ctx.font = font(18, 400, "italic");
  ctx.fillText(t.note, 50, 1030);

  ctx.fillStyle = "#e9e1cc";
  roundRect(ctx, 40, 1048, w - 80, 128, 14);
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.font = font(18, 500);
  t.facts.forEach((fact, i) => ctx.fillText(`• ${fact}`, 60, 1078 + i * 28));
}

function drawArrangementIcon(ctx, kind, cx, cy) {
  if (kind === "planispiral") {
    drawSpiral(ctx, cx - 6, cy, 0.62, 12);
  } else if (kind === "trochospiral") {
    const rows = [[0], [-1, 1], [-2, 0, 2], [-3, -1, 1, 3]];
    rows.forEach((row, i) => {
      const r = 12 + i * 8;
      row.forEach((k) => chamber(ctx, cx + k * r * 0.85, cy - 60 + i * 38, r));
    });
  } else if (kind === "uniserial") {
    [14, 18, 22, 26, 30].forEach((r, i, all) => {
      const y = cy + 70 - all.slice(0, i).reduce((s, v) => s + v * 1.35, 0) - r;
      chamber(ctx, cx, y + 20, r);
    });
    ctx.fillStyle = SHELL;
    ctx.strokeStyle = LINE;
    ctx.fillRect(cx - 6, cy - 88, 12, 18);
    ctx.strokeRect(cx - 6, cy - 88, 12, 18);
  } else if (kind === "biserial") {
    for (let i = 0; i < 7; i++) {
      const r = 11 + i * 3.2;
      chamber(ctx, cx + (i % 2 ? 1 : -1) * r * 0.7, cy + 70 - i * 22 - r * 0.3, r);
    }
  } else if (kind === "triserial") {
    for (let i = 0; i < 9; i++) {
      const r = 10 + i * 2.6;
      const lane = [-1, 0, 1][i % 3];
      chamber(ctx, cx + lane * r * 0.9, cy + 70 - i * 17 - r * 0.2, r);
    }
  } else if (kind === "annular") {
    for (let ring = 6; ring >= 1; ring--) {
      const r = ring * 13;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = SHELL;
      ctx.fill();
      ctx.strokeStyle = LINE;
      ctx.lineWidth = 2;
      ctx.stroke();
      const cells = ring * 7;
      for (let k = 0; k < cells; k++) {
        const a = (k / cells) * Math.PI * 2 + ring;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * (r - 13), cy + Math.sin(a) * (r - 13));
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }
  }
}

const ARRANGEMENT_EXAMPLES = {
  planispiral: "Nummulites",
  trochospiral: "Rotalia",
  uniserial: "Nodosaria",
  biserial: "Bolivina",
  triserial: "Uvigerina",
  annular: "Discocyclina",
};

function drawArrangements(ctx, w, h, t) {
  frame(ctx, w, h, t.title, t.subtitle);
  const kinds = ["planispiral", "trochospiral", "uniserial", "biserial", "triserial", "annular"];
  kinds.forEach((kind, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 40 + col * 420;
    const y = 180 + row * 335;
    ctx.fillStyle = "#efe7d2";
    roundRect(ctx, x, y, 400, 315, 18);
    ctx.fill();
    drawArrangementIcon(ctx, kind, x + 200, y + 105);

    const [name, description] = t.items[kind];
    ctx.fillStyle = INK;
    ctx.font = font(28, 700);
    ctx.fillText(name, x + 22, y + 225);
    ctx.fillStyle = MUTED;
    ctx.font = font(19);
    wrap(ctx, description, x + 22, y + 254, 360, 24);

    const inLab = SPECIMENS.filter((s) => s.arrangement === kind);
    ctx.fillStyle = ACCENT;
    ctx.font = font(18, 600);
    const example = inLab.length
      ? `${t.lab}: ${inLab.map((s) => `#${specimenNumber(s.id)}`).join(", ")}`
      : `${t.other}: ${ARRANGEMENT_EXAMPLES[kind]}`;
    ctx.fillText(example, x + 22, y + 303);
  });
}

function drawDepth(ctx, w, h, t) {
  frame(ctx, w, h, t.title, t.subtitle);
  const top = 250;
  const bottom = 930;
  const left = 40;
  const right = w - 110;
  const yAt = (depth) => top + (bottom - top) * Math.sqrt(depth / 1000);

  // Sky and sea.
  ctx.fillStyle = "#dff1f8";
  ctx.fillRect(left, 170, right - left, top - 170);
  const sea = ctx.createLinearGradient(0, top, 0, bottom);
  sea.addColorStop(0, "#9fd8ea");
  sea.addColorStop(0.35, "#4f97bf");
  sea.addColorStop(1, "#15314f");
  ctx.fillStyle = sea;
  ctx.fillRect(left, top, right - left, bottom - top);

  // Sunlit zone.
  ctx.fillStyle = "rgba(255, 244, 190, 0.18)";
  ctx.fillRect(left, top, right - left, yAt(200) - top);
  ctx.setLineDash([10, 8]);
  ctx.strokeStyle = "rgba(255, 244, 190, 0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left, yAt(200));
  ctx.lineTo(right, yAt(200));
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#fff6c8";
  ctx.font = font(20, 600);
  ctx.fillText(t.photic, right - 250, yAt(200) - 10);

  // Sea floor: a coast on the left, the shelf, the shelf edge, the slope.
  const shelfEnd = left + (right - left) * 0.62;
  const floorDepth = (x) => {
    if (x <= left + 30) return 0;
    if (x <= shelfEnd) return 200 * Math.pow((x - left - 30) / (shelfEnd - left - 30), 1.6);
    return Math.min(1000, 200 + 800 * Math.pow((x - shelfEnd) / (right - shelfEnd), 1.2));
  };
  ctx.beginPath();
  ctx.moveTo(left, 200);
  for (let x = left; x <= right; x += 4) ctx.lineTo(x, x <= left + 30 ? top - 18 + (x - left) * 0.6 : yAt(floorDepth(x)));
  ctx.lineTo(right, bottom);
  ctx.lineTo(left, bottom);
  ctx.closePath();
  ctx.fillStyle = "#c9b081";
  ctx.fill();
  ctx.strokeStyle = "#8a7148";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#1d4f6e";
  ctx.font = font(20, 600);
  ctx.fillText(t.surface, left + 60, top - 12);

  // Zone names along the bottom, inside the sediment.
  const zoneX = [left + 14, (left + shelfEnd) / 2 - 30, shelfEnd - 70, shelfEnd + 120];
  ctx.fillStyle = "#4a3a1e";
  ctx.font = font(19, 600);
  t.zones.forEach((zone, i) => ctx.fillText(zone, zoneX[i], bottom - 18));

  // Depth scale.
  ctx.fillStyle = INK;
  ctx.font = font(18, 500);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  [0, 50, 100, 200, 500, 1000].forEach((d) => {
    const y = yAt(d);
    ctx.beginPath();
    ctx.moveTo(right, y);
    ctx.lineTo(right + 12, y);
    ctx.stroke();
    ctx.fillText(`${d} m`, right + 16, y + 6);
  });

  // Planktonic species float near the surface; their tests sink.
  const planktonic = SPECIMENS.filter((s) => s.life === "planktonic");
  planktonic.forEach((s, i) => {
    const x = left + 330 + i * 150;
    const y = yAt((s.depth[0] + s.depth[1]) / 2);
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.moveTo(x, y + 20);
    ctx.lineTo(x, yAt(floorDepth(x)) - 6);
    ctx.stroke();
    ctx.setLineDash([]);
    badge(ctx, x, y, specimenNumber(s.id), "#b0457a", 19);
  });
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = font(17, 500, "italic");
  ctx.fillText(`↓ ${t.sink}`, left + 330 + (planktonic.length - 1) * 150 + 14, yAt(95));

  // Benthic species sit on the floor at the middle of their depth range.
  const benthic = SPECIMENS.filter((s) => s.life === "benthic");
  benthic.forEach((s) => {
    const mid = Math.sqrt(Math.max(s.depth[0], 5) * s.depth[1]);
    let x = left + 31;
    while (x < right && floorDepth(x) < mid) x += 2;
    badge(ctx, x, yAt(mid) - 22, specimenNumber(s.id), ACCENT, 19);
  });

  // Legend.
  let y = 975;
  ctx.font = font(19, 600);
  const legend = [...planktonic, ...benthic];
  legend.forEach((s, i) => {
    const col = i % 2;
    const lx = 50 + col * 410;
    const ly = y + Math.floor(i / 2) * 30;
    badge(ctx, lx + 12, ly - 6, specimenNumber(s.id), s.life === "planktonic" ? "#b0457a" : ACCENT, 12);
    ctx.fillStyle = INK;
    ctx.font = font(18, 600, "italic");
    ctx.fillText(s.name, lx + 32, ly);
    ctx.fillStyle = MUTED;
    ctx.font = font(17);
    ctx.fillText(`${s.depth[0]}–${s.depth[1]} m`, lx + 290, ly);
  });
  y += Math.ceil(legend.length / 2) * 30 + 8;
  ctx.fillStyle = MUTED;
  ctx.font = font(17, 400, "italic");
  ctx.fillText(t.approx, 50, y);
}

function drawTimeline(ctx, w, h, t) {
  frame(ctx, w, h, t.title, t.subtitle);
  const band = { y: 430, h: 64 };
  const eras = [
    { from: 541, to: 252, x0: 70, x1: 560, color: "#99c08d" },
    { from: 252, to: 66, x0: 560, x1: 900, color: "#67c5ca" },
    { from: 66, to: 0, x0: 900, x1: 1330, color: "#f2e76b" },
  ];
  const xAt = (ma) => {
    const era = eras.find((e) => ma <= e.from && ma >= e.to) || eras[2];
    return era.x0 + ((era.from - ma) / (era.from - era.to)) * (era.x1 - era.x0);
  };

  eras.forEach((e, i) => {
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x0, band.y, e.x1 - e.x0, band.h);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.strokeRect(e.x0, band.y, e.x1 - e.x0, band.h);
    ctx.fillStyle = INK;
    ctx.font = font(24, 700);
    ctx.textAlign = "center";
    ctx.fillText(t.eras[i], (e.x0 + e.x1) / 2, band.y + 41);
    ctx.textAlign = "left";
  });

  // Paleocene–Eocene highlight: the interval the ForamID tool covers.
  ctx.fillStyle = "rgba(45, 110, 52, 0.28)";
  ctx.fillRect(xAt(66), band.y - 10, xAt(34) - xAt(66), band.h + 20);

  ctx.fillStyle = MUTED;
  ctx.font = font(18, 600);
  ctx.textAlign = "center";
  [541, 252, 201, 145, 66, 34, 0].forEach((ma) => {
    const x = xAt(ma);
    ctx.fillRect(x - 1, band.y + band.h, 2, 12);
    ctx.fillText(`${ma}`, x, band.y + band.h + 34);
  });
  ctx.textAlign = "left";

  const events = [
    { ma: 541, above: false, card: 40 },
    { ma: 300, above: true, card: 250 },
    { ma: 252, above: false, card: 330 },
    { ma: 170, above: true, card: 540 },
    { ma: 66, above: false, card: 640 },
    { ma: 50, above: true, card: 830, highlight: true, label: "66–34 Ma" },
    { ma: 56, above: false, card: 950 },
    { ma: 0, above: true, card: 1110 },
  ];
  events.forEach((e, i) => {
    const cardW = 250;
    const cardH = e.above ? 200 : 180;
    const cardY = e.above ? 185 : 560;
    const x = xAt(e.ma);
    ctx.strokeStyle = e.highlight ? ACCENT : MUTED;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, e.above ? band.y : band.y + band.h + 40);
    ctx.lineTo(Math.min(Math.max(x, e.card + 20), e.card + cardW - 20), e.above ? cardY + cardH : cardY);
    ctx.stroke();

    ctx.fillStyle = e.highlight ? "#dcebd5" : "#ffffff";
    roundRect(ctx, e.card, cardY, cardW, cardH, 14);
    ctx.fill();
    ctx.strokeStyle = e.highlight ? ACCENT : "#d6ccb2";
    ctx.stroke();
    ctx.fillStyle = e.highlight ? ACCENT : "#8a6d2f";
    ctx.font = font(20, 700);
    ctx.fillText(e.label || (e.ma === 0 ? "0 Ma" : `~${e.ma} Ma`), e.card + 16, cardY + 32);
    ctx.fillStyle = INK;
    ctx.font = font(18, 500);
    wrap(ctx, t.events[i], e.card + 16, cardY + 60, cardW - 30, 23);
  });

  ctx.fillStyle = ACCENT;
  ctx.font = font(21, 600);
  ctx.fillText(`▲ ${t.pyramids}`, 70, 800);
  ctx.fillStyle = MUTED;
  ctx.font = font(18, 400, "italic");
  ctx.fillText(t.unit, 70, 845);
}

function drawWallSwatch(ctx, kind, cx, cy, r) {
  const rand = seeded(31 + kind * 17);
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  if (kind === 0) {
    const glass = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
    glass.addColorStop(0, "#ffffff");
    glass.addColorStop(1, "#bfd9e0");
    ctx.fillStyle = glass;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.fillStyle = "rgba(60, 100, 110, 0.55)";
    for (let i = 0; i < 260; i++) {
      ctx.beginPath();
      ctx.arc(cx + (rand() - 0.5) * r * 2, cy + (rand() - 0.5) * r * 2, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 1) {
    const porcelain = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.05, cx, cy, r);
    porcelain.addColorStop(0, "#ffffff");
    porcelain.addColorStop(0.6, "#f4efe4");
    porcelain.addColorStop(1, "#d9d0bd");
    ctx.fillStyle = porcelain;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  } else {
    ctx.fillStyle = "#b99a68";
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    const sand = ["#d9c08e", "#a8865a", "#e8d5a8", "#8f7148", "#c7ad7c"];
    for (let i = 0; i < 180; i++) {
      const gx = cx + (rand() - 0.5) * r * 2;
      const gy = cy + (rand() - 0.5) * r * 2;
      const gr = 4 + rand() * 9;
      ctx.fillStyle = sand[i % sand.length];
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2 + rand();
        const d = gr * (0.7 + rand() * 0.5);
        if (k === 0) ctx.moveTo(gx + Math.cos(a) * d, gy + Math.sin(a) * d);
        else ctx.lineTo(gx + Math.cos(a) * d, gy + Math.sin(a) * d);
      }
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 4;
  ctx.stroke();
}

function drawWalls(ctx, w, h, t) {
  frame(ctx, w, h, t.title, t.subtitle);
  t.types.forEach(([name, description, examples, note], i) => {
    const x = 50 + i * 440;
    ctx.fillStyle = "#efe7d2";
    roundRect(ctx, x, 180, 420, 600, 20);
    ctx.fill();
    drawWallSwatch(ctx, i, x + 210, 310, 100);
    ctx.fillStyle = INK;
    ctx.font = font(34, 700);
    ctx.textAlign = "center";
    ctx.fillText(name, x + 210, 460);
    ctx.textAlign = "left";
    ctx.fillStyle = INK;
    ctx.font = font(21);
    let y = wrap(ctx, description, x + 26, 505, 370, 29);
    ctx.fillStyle = MUTED;
    ctx.font = font(19, 700);
    ctx.fillText(t.examples.toUpperCase(), x + 26, y + 18);
    ctx.fillStyle = INK;
    ctx.font = font(20, 500, "italic");
    y = wrap(ctx, examples, x + 26, y + 46, 370, 27);
    if (note) {
      ctx.fillStyle = ACCENT;
      ctx.font = font(19, 700);
      wrap(ctx, `✓ ${note}`, x + 26, y + 12, 370, 26);
    }
  });
  ctx.fillStyle = ACCENT;
  ctx.font = font(21, 600);
  wrap(ctx, t.footer, 50, 832, w - 100, 30);
}

function drawStepIcon(ctx, step, cx, cy) {
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 4;
  ctx.fillStyle = SHELL;
  if (step === 0) {
    // A sediment core.
    ctx.fillStyle = "#c9b081";
    ctx.fillRect(cx - 30, cy - 55, 60, 110);
    ctx.strokeRect(cx - 30, cy - 55, 60, 110);
    ["#a88f60", "#d8c49a", "#8f7650"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(cx - 30, cy - 30 + i * 28, 60, 12);
    });
  } else if (step === 1) {
    // A sieve.
    ctx.beginPath();
    ctx.ellipse(cx, cy, 70, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.lineWidth = 1.5;
    for (let k = -60; k <= 60; k += 12) {
      ctx.beginPath();
      ctx.moveTo(cx + k, cy - 22 * Math.sqrt(1 - (k / 70) ** 2));
      ctx.lineTo(cx + k, cy + 22 * Math.sqrt(1 - (k / 70) ** 2));
      ctx.stroke();
    }
    ctx.fillStyle = "#8a7148";
    ctx.font = font(22, 700);
    ctx.textAlign = "center";
    ctx.fillText("63 µm", cx, cy + 62);
    ctx.textAlign = "left";
  } else if (step === 2) {
    // A brush and a few picked tests.
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx - 60, cy + 50);
    ctx.lineTo(cx + 20, cy - 30);
    ctx.stroke();
    ctx.fillStyle = "#3a2c18";
    ctx.beginPath();
    ctx.moveTo(cx + 20, cy - 30);
    ctx.lineTo(cx + 42, cy - 44);
    ctx.lineTo(cx + 30, cy - 20);
    ctx.fill();
    [[40, 30, 9], [62, 10, 7], [16, 44, 8]].forEach(([dx, dy, r]) => chamber(ctx, cx + dx, cy + dy, r));
  } else if (step === 3) {
    // A glass slide with a section.
    ctx.fillStyle = "#e3f0f3";
    ctx.fillRect(cx - 75, cy - 30, 150, 60);
    ctx.strokeRect(cx - 75, cy - 30, 150, 60);
    ctx.beginPath();
    ctx.ellipse(cx, cy, 34, 20, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#d9c089";
    ctx.fill();
    ctx.lineWidth = 1.5;
    for (let k = 1; k <= 3; k++) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, k * 10, k * 6, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else {
    // A stack of X-ray slices becoming a model.
    for (let k = 0; k < 5; k++) {
      ctx.fillStyle = `rgba(127, 214, 255, ${0.25 + k * 0.12})`;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 40 - k * 18, 60, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#3f7f9a";
      ctx.stroke();
    }
  }
}

function drawMicroscope(ctx, w, h, t) {
  frame(ctx, w, h, t.title, t.subtitle);
  const cardW = 240;
  const gap = (w - 100 - cardW * 5) / 4;
  t.steps.forEach(([name, description], i) => {
    const x = 50 + i * (cardW + gap);
    ctx.fillStyle = "#efe7d2";
    roundRect(ctx, x, 190, cardW, 500, 18);
    ctx.fill();
    badge(ctx, x + 34, 226, i + 1, ACCENT, 20);
    drawStepIcon(ctx, i, x + cardW / 2, 350);
    ctx.fillStyle = INK;
    ctx.font = font(26, 700);
    ctx.fillText(name, x + 20, 480);
    ctx.fillStyle = MUTED;
    ctx.font = font(19);
    wrap(ctx, description, x + 20, 515, cardW - 36, 26);
    if (i < t.steps.length - 1) {
      ctx.fillStyle = ACCENT;
      ctx.font = font(34, 700);
      ctx.fillText("→", x + cardW + gap / 2 - 14, 360);
    }
  });
  ctx.fillStyle = ACCENT;
  ctx.font = font(21, 600);
  wrap(ctx, t.footer, 50, 760, w - 100, 30);
}

const DRAW = {
  anatomy: drawAnatomy,
  arrangements: drawArrangements,
  depth: drawDepth,
  timeline: drawTimeline,
  walls: drawWalls,
  microscope: drawMicroscope,
};

// Draws a board onto `canvas` (created if missing) and returns it.
export function drawPoster(id, lang, canvas = document.createElement("canvas")) {
  const poster = posterById(id);
  const [w, h] = poster.size;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, w, h);
  DRAW[id](ctx, w, h, TEXT[id][lang]);
  return canvas;
}
