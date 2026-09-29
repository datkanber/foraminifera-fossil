// ─── 3D LAB SPECIMENS ───────────────────────────────────────────────────────
// -jr All teaching content of the lab lives here, apart from the code, so a
// paleontologist can review or extend it without touching three.js.
//
// Order = tour order: from the sea surface down to the deep sea, then the
// art piece. `pedestal` is the exhibit's spot on the floor of the lab.
//
// Specimen facts (size, locality, method) come from the Sketchfab pages of
// the scans (see `source`). All real specimens are modern (Recent) and all
// have hyaline (glassy, perforate calcite) walls.

const lab = (file) => require(`../../assets/3d/lab/${file}`);

export const SPECIMENS = [
  {
    id: "globigerinoides_ruber",
    name: "Globigerinoides ruber",
    authority: "(d'Orbigny, 1839)",
    model: lab("globigerinoides_ruber.glb"),
    detail: lab("globigerinoides_ruber-detail.glb"),
    life: "planktonic",
    wall: "hyaline",
    arrangement: "trochospiral",
    internal: true,
    size: { mm: 0.5, known: true },
    depth: [0, 50],
    tint: { base: 0xe6b8a8, emissive: 0x7a4a40 },
    pedestal: { x: -2.0, z: 6.4 },
    tr: {
      summary:
        "Okyanusların en tanınmış planktonik foraminiferlerinden biri. Tropikal ve subtropikal denizlerin en üstteki sıcak, ışıklı katmanında süzülerek yaşar. İnce dikenleri ve hücresinde taşıdığı fotosentetik ortak yaşarlar (simbiyont algler) bu yaşama uyum sağlar. Adı Latincede \"kırmızı\" anlamına gelen ruber'den gelir: bazı bireylerin kavkısı pembedir.",
      habitat: "Açık okyanus, yüzey suyu (~0–50 m)",
      record: "Miyosen – günümüz",
      look: [
        "Son turda üç küresel odacık. Odacıklar yüksekçe bir sarmal (trokospiral) üzerinde dizilir.",
        "Ana ağız (aperture), son iki odacığın birleştiği dikişin üstünde yüksek bir kemer gibi açılır.",
        "Sarmalın üst (spiral) yüzünde küçük ek ağızlar bulunur. Bu, Globigerinoides cinsinin ayırt edici özelliğidir.",
        "Canlıyken ince, uzun dikenler taşır; ölünce dikenler çoğunlukla kırılır.",
      ],
      why:
        "Kavkısının kimyası (oksijen izotopları, Mg/Ca oranı), oluştuğu suyun sıcaklığını kaydeder. Bu yüzden G. ruber, geçmişteki deniz yüzeyi sıcaklıklarını hesaplamak için en çok kullanılan türlerden biridir.",
      specimen: "µCT taraması (Zeiss MicroXCT-400) · Thibault de Garidel-Thoron ve Vladimir Vidal, CEREGE (Fransa)",
    },
    en: {
      summary:
        "One of the best-known planktonic foraminifera. It drifts in the warm, sunlit top layer of tropical and subtropical oceans. Its fine spines and the photosynthetic partners (symbiotic algae) inside its cell suit this way of life. The name comes from the Latin ruber, \"red\": some individuals have a pink test.",
      habitat: "Open ocean, surface water (~0–50 m)",
      record: "Miocene – Recent",
      look: [
        "Three globular chambers in the final whorl, arranged on a fairly high spiral (trochospiral).",
        "The primary opening (aperture) is a high arch over the suture between the last two chambers.",
        "Small extra apertures on the spiral side — the mark of the genus Globigerinoides.",
        "Carries long, thin spines in life; they usually break off after death.",
      ],
      why:
        "The chemistry of its test (oxygen isotopes, Mg/Ca ratio) records the temperature of the water it grew in. That makes G. ruber one of the most widely used species for reconstructing past sea-surface temperatures.",
      specimen: "µCT scan (Zeiss MicroXCT-400) · Thibault de Garidel-Thoron and Vladimir Vidal, CEREGE (France)",
    },
    source: {
      author: "Secteur Sciences et Technologies – Aix-Marseille Université",
      license: "CC BY-NC-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      url: "https://sketchfab.com/3d-models/foraminifera-globigerinoides-ruber-c626771f89ae4ae782228ee41e325954",
    },
    terms: ["planktonic", "trochospiral", "aperture", "symbiont"],
  },
  {
    id: "globigerinella_calida",
    name: "Globigerinella calida",
    authority: "(Parker, 1962)",
    model: lab("globigerinella_calida.glb"),
    detail: lab("globigerinella_calida-detail.glb"),
    life: "planktonic",
    wall: "hyaline",
    arrangement: "trochospiral",
    // So low it reads as planispiral in 3D: keep it out of arrangement questions.
    quizSkip: ["arrangement"],
    internal: true,
    size: { mm: 0.4, known: false },
    depth: [0, 100],
    tint: { base: 0xe0c48a, emissive: 0x805520 },
    pedestal: { x: 2.0, z: 6.4 },
    tr: {
      summary:
        "Sıcak okyanusların üst su katmanında yaşayan, dikenli bir planktonik foraminifer. Sarmalı o kadar alçaktır ki yandan bakınca neredeyse düz bir diske benzer. Adındaki calida Latincede \"sıcak\" demektir.",
      habitat: "Tropikal–subtropikal açık okyanus, üst su kolonu (~0–100 m)",
      record: "Pleistosen – günümüz (genç bir tür)",
      look: [
        "Çok alçak bir sarmal: odacıklar neredeyse tek bir düzlemde dizilir.",
        "Son turdaki odacıklar dışa doğru hafifçe uzamıştır; kavkının kenarı dalgalı (loblu) görünür.",
        "Ağız, kavkının kenarına doğru açılan geniş ve alçak bir kemerdir.",
        "Canlıyken uzun, ince dikenler taşır.",
      ],
      why:
        "Bir sediment örneğindeki planktonik türlerin oranları, o zamanki yüzey suyunun sıcaklığına göre değişir. G. calida gibi sıcak su türlerinin payına bakılarak geçmiş iklimin ne kadar sıcak olduğu tahmin edilir.",
      specimen: "Foraminarium, 2021 · tarama yöntemi ve boyut belirtilmemiş",
    },
    en: {
      summary:
        "A spinose planktonic foraminifer of the upper water layer of warm oceans. Its spiral is so low that from the side it looks almost like a flat disc. Calida is Latin for \"warm\".",
      habitat: "Tropical–subtropical open ocean, upper water column (~0–100 m)",
      record: "Pleistocene – Recent (a young species)",
      look: [
        "A very low spiral: the chambers lie almost in one plane.",
        "Chambers of the last whorl are slightly drawn out; the outline of the test is lobate.",
        "The aperture is a broad, low arch opening towards the edge of the test.",
        "Carries long, thin spines in life.",
      ],
      why:
        "The proportions of planktonic species in a sediment sample follow the surface-water temperature of the time. The share of warm-water species such as G. calida is used to estimate how warm a past climate was.",
      specimen: "Foraminarium, 2021 · scanning method and size not given",
    },
    source: {
      author: "Secteur Sciences et Technologies – Aix-Marseille Université",
      license: "CC BY-NC-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      url: "https://sketchfab.com/3d-models/foraminifera-globigerinella-calida-c0920a975aab47a6abdfce201518e0b6",
    },
    terms: ["planktonic", "trochospiral", "aperture"],
  },
  {
    id: "elphidium_sp",
    name: "Elphidium sp.",
    authority: "",
    model: lab("elphidium_sp.glb"),
    detail: lab("elphidium_sp-detail.glb"),
    life: "benthic",
    wall: "hyaline",
    arrangement: "planispiral",
    internal: true,
    size: { mm: 0.5, known: false },
    depth: [0, 50],
    tint: { base: 0xc8d6a8, emissive: 0x4a6030 },
    pedestal: { x: -2.0, z: 4.6 },
    tr: {
      summary:
        "Kıyıya en yakın ortamların foraminiferi: lagünlerde, haliçlerde ve gelgit düzlüklerinde deniz tabanında yaşar. Tuzluluğun sık değiştiği acısu ortamlarına dayanıklıdır. Örnek µCT ile tarandığı için kavkının içindeki odacık duvarları da modelde vardır: \"Kesit\" moduyla içine bakın.",
      habitat: "Kıyı, lagün, haliç (~0–50 m)",
      record: "Eosen – günümüz (cins)",
      look: [
        "Düzlemsel sarmal (planispiral) ve örtülü (involüt): yalnızca son tur görünür, iki yüzü birbirinin ayna görüntüsüdür.",
        "Odacıkları ayıran dikişleri küçük köprüler keser; aralarında sıra sıra çukurcuklar oluşur. Bu, cinsin en belirgin özelliğidir.",
        "Ağız, son odacığın tabanında sıralanmış küçük deliklerden oluşur.",
      ],
      why:
        "Bir kayaç tabakasında bol Elphidium bulunması, o tabakanın kıyı, lagün ya da haliç gibi çok sığ bir ortamda çökeldiğini gösterir. Bu yüzden eski kıyı çizgilerini ve deniz seviyesi değişimlerini izlemek için kullanılır.",
      specimen: "µCT taraması · BelangerForamLab · boyut ve yer belirtilmemiş",
    },
    en: {
      summary:
        "The foraminifer of the shallowest settings: it lives on the sea floor of lagoons, estuaries and tidal flats and tolerates brackish water with changing salinity. The specimen was scanned with µCT, so the chamber walls inside the test are in the model too — look inside with \"Section\" mode.",
      habitat: "Coast, lagoon, estuary (~0–50 m)",
      record: "Eocene – Recent (genus)",
      look: [
        "Flat spiral (planispiral) and involute: only the last whorl shows, and the two sides mirror each other.",
        "Small bridges cross the sutures between chambers, leaving rows of pits — the most distinctive feature of the genus.",
        "The aperture is a row of small openings at the base of the last chamber.",
      ],
      why:
        "Abundant Elphidium in a rock layer shows that the layer formed in a very shallow setting such as a coast, lagoon or estuary. It is used to trace old shorelines and changes in sea level.",
      specimen: "µCT scan · BelangerForamLab · size and locality not given",
    },
    source: {
      author: "Secteur Sciences et Technologies – Aix-Marseille Université",
      license: "CC BY-NC-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      url: "https://sketchfab.com/3d-models/foraminifera-elphidium-sp-eb53e56df0a84252989c3a7f8a7537ed",
    },
    terms: ["benthic", "planispiral", "involute", "suture"],
  },
  {
    id: "cycloclypeus_carpenteri",
    name: "Cycloclypeus carpenteri",
    authority: "Brady, 1881",
    model: lab("cycloclypeus_carpenteri.glb"),
    detail: lab("cycloclypeus_carpenteri-detail.glb"),
    life: "benthic",
    wall: "hyaline",
    arrangement: "annular",
    internal: false,
    size: { mm: 55, known: true },
    depth: [50, 150],
    tint: { base: 0xe8d8b0, emissive: 0x7a6028 },
    pedestal: { x: 2.0, z: 4.6 },
    tr: {
      summary:
        "Yaşayan en büyük foraminiferlerden biri: tek bir hücre olmasına rağmen bu örnek 5,5 × 4 cm. İçinde fotosentez yapan ortak yaşar algler (diyatomeler) barındırdığı için güneş ışığına muhtaçtır ve ışığın ulaşabildiği en derin sularda yaşar. Örnek, Okinawa (Japonya) açıklarında 70 m derinlikten toplanmıştır.",
      habitat: "Tropikal Batı Pasifik, ışıklı zonun alt kısmı (~50–150 m)",
      record: "Oligosen – günümüz (cins)",
      look: [
        "Büyük, ince ve yassı bir disk.",
        "Merkezdeki kısa bir sarmalın ardından odacıklar merkezin çevresinde tam halkalar (anüler dizilim) oluşturur.",
        "Her halka çok sayıda küçük odacıkçığa bölünmüştür.",
        "Bu model bir yüzey taramasıdır; renkler örneğin gerçek fotoğrafından gelir.",
      ],
      why:
        "Nummulites ile aynı aileden (Nummulitidae) gelir: ForamID tanı aracının odaklandığı Paleosen–Eosen büyük bentik foraminiferlerinin yaşayan bir akrabasıdır. Işığa bağımlı olduğundan fosilleri, eski denizin ışıklı zonun alt kısmında olduğunu gösterir; Oligosen–Miyosen kayaçlarının yaşlandırılmasında da (biyostratigrafi) kullanılır.",
      specimen:
        "Viyana Doğa Tarihi Müzesi (NHMW-GEO-1996z0123/0002) · Onna, Okinawa, 70 m · Artec Space Spider yüzey taraması, Anna Haider",
    },
    en: {
      summary:
        "One of the largest living foraminifera: a single cell, yet this specimen measures 5.5 × 4 cm. It houses photosynthetic partners (diatoms), so it depends on sunlight and lives in the deepest water light still reaches. The specimen was collected at 70 m off Okinawa, Japan.",
      habitat: "Tropical West Pacific, lower sunlit zone (~50–150 m)",
      record: "Oligocene – Recent (genus)",
      look: [
        "A large, thin, flat disc.",
        "After a short spiral at the centre, chambers form complete rings around it (annular arrangement).",
        "Each ring is divided into many small chamberlets.",
        "This model is a surface scan; its colours come from photos of the real specimen.",
      ],
      why:
        "It belongs to the same family as Nummulites (Nummulitidae): a living relative of the Paleocene–Eocene larger benthic foraminifera that the ForamID tool focuses on. Being light-dependent, its fossils mark the lower part of an ancient sunlit sea, and it is used to date Oligocene–Miocene rocks (biostratigraphy).",
      specimen:
        "Natural History Museum Vienna (NHMW-GEO-1996z0123/0002) · Onna, Okinawa, 70 m · Artec Space Spider surface scan, Anna Haider",
    },
    source: {
      author: "Natural History Museum Vienna",
      license: "CC BY-NC 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
      url: "https://sketchfab.com/3d-models/large-foraminifera-nhmw-geo-1996z01230002-4f9d16be59db4913bace1b28240d34a6",
    },
    terms: ["benthic", "annular", "symbiont", "biostratigraphy"],
  },
  {
    id: "amphicoryna_scalaris",
    name: "Amphicoryna scalaris",
    authority: "(Batsch, 1791)",
    model: lab("amphicoryna_scalaris.glb"),
    detail: lab("amphicoryna_scalaris-detail.glb"),
    life: "benthic",
    wall: "hyaline",
    arrangement: "uniserial",
    internal: true,
    size: { mm: 0.8, known: true },
    depth: [50, 500],
    tint: { base: 0xdcc49a, emissive: 0x6e5830 },
    pedestal: { x: -2.0, z: 2.8 },
    tr: {
      summary:
        "Odacıkları tek bir sıra hâlinde üst üste dizilen, boğum boğum görünüşlü bir bentik foraminifer. Kıta sahanlığı ve yamacın çamurlu tabanlarında yaşar. Bu örnek Akdeniz'deki Cassidaigne Kanyonu'ndan (Fransa) alınmıştır ve boyu yalnızca ~0,8 mm'dir.",
      habitat: "Şelf – üst kıta yamacı, çamurlu taban (~50–500 m)",
      record: "",
      look: [
        "Odacıklar düz bir çizgi boyunca tek sıra (uniseri) dizilir; kavkı boğumlu bir çubuğa benzer. İlk odacıklar kısa bir kıvrım yapabilir.",
        "Yüzeyde boyuna uzanan ince kaburgalar (kostalar) bulunur.",
        "Son odacık bir boyunla sonlanır; ağız bu boynun ucundadır.",
      ],
      why:
        "Şelf ve üst yamaç çamurlarının tipik bir üyesidir. Birlikte bulunduğu türlerle beraber, eski deniz tabanının derinliğini (paleobatimetri) tahmin etmeye yardım eder.",
      specimen: "Cassidaigne Kanyonu, Fransa · µCT taraması (Zeiss MicroXCT-400) · Vladimir Vidal, CEREGE, 2019",
    },
    en: {
      summary:
        "A benthic foraminifer whose chambers are stacked in a single row, giving it a beaded look. It lives on the muddy floors of the continental shelf and slope. This specimen comes from the Cassidaigne Canyon in the Mediterranean (France) and is only ~0.8 mm long.",
      habitat: "Shelf – upper continental slope, muddy floor (~50–500 m)",
      record: "",
      look: [
        "Chambers follow a straight line in a single row (uniserial); the test looks like a beaded rod. The first chambers may form a short curl.",
        "Fine ribs (costae) run along the surface.",
        "The last chamber ends in a neck with the aperture at its tip.",
      ],
      why:
        "A typical member of shelf and upper-slope muds. Together with the species found alongside it, it helps estimate the depth of an ancient sea floor (paleobathymetry).",
      specimen: "Cassidaigne Canyon, France · µCT scan (Zeiss MicroXCT-400) · Vladimir Vidal, CEREGE, 2019",
    },
    source: {
      author: "Secteur Sciences et Technologies – Aix-Marseille Université",
      license: "CC BY-NC-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      url: "https://sketchfab.com/3d-models/foraminifera-amphicoryna-scalaris-81c7e60df15a4aa0a20d5b0a5d8fc253",
    },
    terms: ["benthic", "uniserial", "aperture", "paleobathymetry"],
  },
  {
    id: "trifarina_angulosa",
    name: "Trifarina angulosa",
    authority: "(Williamson, 1858)",
    model: lab("trifarina_angulosa.glb"),
    detail: lab("trifarina_angulosa-detail.glb"),
    life: "benthic",
    wall: "hyaline",
    arrangement: "triserial",
    internal: true,
    size: { mm: 0.4, known: false },
    depth: [100, 600],
    tint: { base: 0xd4c8b8, emissive: 0x585040 },
    pedestal: { x: 2.0, z: 2.8 },
    tr: {
      summary:
        "Enine kesiti üçgen, köşeleri keskin ve kaburgalı bir bentik foraminifer. Güçlü dip akıntılarının süpürdüğü, iri taneli tabanları sever. µCT taraması içteki odacıkları da gösterir.",
      habitat: "Dış şelf – üst yamaç, iri taneli taban (~100–600 m)",
      record: "",
      look: [
        "Enine kesiti üçgendir; kavkının üç köşesi keskindir (angulosa = \"köşeli\").",
        "Yüzeyde belirgin, boyuna uzanan kaburgalar vardır.",
        "Odacıklar üç sıralı (triseri) dizilir.",
        "Ağız kavkının tepesinde, kısa bir boyun üzerindedir.",
      ],
      why:
        "Bol bulunduğu tabakalar, dipteki güçlü akıntıların ince çamuru alıp götürdüğü ve geriye iri tanelerin kaldığı ortamlara işaret eder. Bu yüzden geçmişteki dip akıntılarının şiddetini yorumlamada kullanılır.",
      specimen: "µCT taraması · BelangerForamLab · boyut ve yer belirtilmemiş",
    },
    en: {
      summary:
        "A benthic foraminifer with a triangular cross-section, sharp edges and ribs. It favours coarse sea floors swept by strong bottom currents. The µCT scan shows the chambers inside as well.",
      habitat: "Outer shelf – upper slope, coarse floor (~100–600 m)",
      record: "",
      look: [
        "Triangular in cross-section with three sharp edges (angulosa = \"angular\").",
        "Strong ribs run along the surface.",
        "Chambers are arranged in three rows (triserial).",
        "The aperture sits at the top of the test on a short neck.",
      ],
      why:
        "Layers rich in it point to settings where strong bottom currents carried the fine mud away and left coarse grains behind, so it is used to read the strength of past bottom currents.",
      specimen: "µCT scan · BelangerForamLab · size and locality not given",
    },
    source: {
      author: "Secteur Sciences et Technologies – Aix-Marseille Université",
      license: "CC BY-NC-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      url: "https://sketchfab.com/3d-models/foraminifera-trifarina-angulosa-6867461418d548d7baeafd3f9663b8c8",
    },
    terms: ["benthic", "triserial", "aperture"],
  },
  {
    id: "bulimina_marginata",
    name: "Bulimina marginata",
    authority: "d'Orbigny, 1826",
    model: lab("bulimina_marginata.glb"),
    detail: lab("bulimina_marginata-detail.glb"),
    life: "benthic",
    wall: "hyaline",
    arrangement: "triserial",
    internal: true,
    size: { mm: 0.25, known: true },
    depth: [100, 1000],
    tint: { base: 0xd0b498, emissive: 0x6a5038 },
    pedestal: { x: -2.0, z: 1.0 },
    tr: {
      summary:
        "Dış şelften kıta yamacına kadar, çamurlu deniz tabanının içinde (sedimentin içinde) yaşayan bir bentik foraminifer. Organik maddece zengin, oksijeni düşük çamurlara dayanıklıdır. Bu örnek Cassidaigne Kanyonu'ndan (Fransa) ve boyu yalnızca ~0,25 mm: bir kum tanesinden bile küçük.",
      habitat: "Dış şelf – üst kıta yamacı, çamur içinde (~100–1000 m)",
      record: "Paleosen – günümüz (cins)",
      look: [
        "Üç sıralı (triseri) dizilim: her turda üç odacık, kavkı koni biçiminde uzar.",
        "Odacıkların alt kenarında kısa dikenlerden oluşan bir saçak vardır; adındaki marginata (\"kenarlı\") buradan gelir.",
        "Ağız, son odacıkta ilmek (virgül) biçiminde bir yarıktır.",
      ],
      why:
        "Bulimina marginata'nın bolluğu, deniz tabanına çok organik madde ulaştığını ve dip suyunda oksijenin azaldığını gösterir. Geçmişteki deniz verimliliğini ve oksijen koşullarını yorumlamada kullanılır.",
      specimen: "Cassidaigne Kanyonu, Fransa · µCT taraması (Zeiss MicroXCT-400) · Vladimir Vidal, CEREGE, 2019",
    },
    en: {
      summary:
        "A benthic foraminifer living inside the mud of the sea floor (infaunal), from the outer shelf to the continental slope. It tolerates organic-rich, oxygen-poor mud. This specimen from the Cassidaigne Canyon (France) is only ~0.25 mm long — smaller than a grain of sand.",
      habitat: "Outer shelf – upper continental slope, within the mud (~100–1000 m)",
      record: "Paleocene – Recent (genus)",
      look: [
        "Triserial: three chambers per whorl, the test lengthening into a cone.",
        "A fringe of short spines along the lower edge of the chambers gives the name marginata (\"bordered\").",
        "The aperture is a loop- (comma-) shaped slit in the last chamber.",
      ],
      why:
        "An abundance of Bulimina marginata shows that much organic matter reached the sea floor and that the bottom water was low in oxygen. It is used to read past productivity and oxygen conditions.",
      specimen: "Cassidaigne Canyon, France · µCT scan (Zeiss MicroXCT-400) · Vladimir Vidal, CEREGE, 2019",
    },
    source: {
      author: "Secteur Sciences et Technologies – Aix-Marseille Université",
      license: "CC BY-NC-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      url: "https://sketchfab.com/3d-models/foraminifera-bulimina-marginata-a2367e2f26124786b94d76a76c750252",
    },
    terms: ["benthic", "infaunal", "triserial", "aperture"],
  },
  {
    id: "interwoven_microcosmos",
    name: "Interwoven Microcosmos",
    authority: "",
    art: true,
    model: lab("interwoven_microcosmos.glb"),
    detail: lab("interwoven_microcosmos-detail.glb"),
    life: null,
    wall: null,
    arrangement: null,
    internal: false,
    size: null,
    depth: null,
    tint: { base: 0xb8d0c4, emissive: 0x406050 },
    pedestal: { x: 2.0, z: 1.0 },
    tr: {
      summary:
        "Bu model gerçek bir foraminifer değildir. Sanatçı Andrea Nagl'ın 2024 tarihli bir performans projesi için, bir görselden yapay zekâ (CSM AI) ile üretilip Blender'da şekillendirilmiş bir yorumdur. Laboratuvarda, gerçek taramalarla karşılaştırasınız diye sergileniyor.",
      habitat: "—",
      record: "",
      look: [
        "Kaynağı bir örnek değil: µCT taramalarının aksine ne boyutu, ne toplandığı yer, ne de müze numarası vardır.",
        "Biçimi ölçümden değil, bir yapay zekâ modelinin tahmininden ve sanatçının elinden gelir.",
        "Bir 3D modeli bilimsel kaynak olarak kullanmadan önce nasıl üretildiğine (tarama yöntemi, örnek numarası, koleksiyon) bakın.",
      ],
      why:
        "Sanatsal canlandırmalar merak uyandırır ve bilim iletişiminde değerlidir; ama ölçüme dayanan verilerle karıştırılmamalıdır. Bu sergi, \"önce kaynağı kontrol et\" alışkanlığı için burada.",
      specimen: "Sanat eseri · Andrea Nagl, 2024 · CSM AI + Blender",
    },
    en: {
      summary:
        "This model is not a real foraminifer. It is an interpretation made by the artist Andrea Nagl for a 2024 performance project: generated from an image with AI (CSM AI) and sculpted further in Blender. It is on show so you can compare it with the real scans.",
      habitat: "—",
      record: "",
      look: [
        "No specimen behind it: unlike the µCT scans it has no size, no collecting site and no museum number.",
        "Its shape comes from an AI model's guess and the artist's hand, not from measurement.",
        "Before using a 3D model as a scientific source, check how it was made (scanning method, specimen number, collection).",
      ],
      why:
        "Artistic reconstructions spark curiosity and are valuable in science communication, but they must not be mistaken for measured data. This exhibit is here to build the habit of checking the source first.",
      specimen: "Artwork · Andrea Nagl, 2024 · CSM AI + Blender",
    },
    source: {
      author: "Andrea Nagl",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      url: "https://sketchfab.com/3d-models/foraminifera-interwoven-microcosmos-04c16bbf5e2a4b84a8a876da40ff2020",
    },
    terms: ["scan"],
  },
];

export const REAL_SPECIMENS = SPECIMENS.filter((s) => !s.art);

export const specimenById = (id) => SPECIMENS.find((s) => s.id === id) || null;

export const specimenNumber = (id) => SPECIMENS.findIndex((s) => s.id === id) + 1;

// 0.25 -> "0,25 mm" (tr) / "0.25 mm" (en); 55 -> "5,5 cm".
export function formatSize(mm, lang) {
  const text = mm >= 10 ? `${+(mm / 10).toFixed(1)} cm` : `${mm} mm`;
  return lang === "tr" ? text.replace(".", ",") : text;
}

// ─── VOCABULARY ─────────────────────────────────────────────────────────────
export const LIFE = {
  planktonic: { tr: "Planktonik", en: "Planktonic" },
  benthic: { tr: "Bentik", en: "Benthic" },
};

export const WALL = {
  hyaline: { tr: "Hiyalin", en: "Hyaline" },
  porcelaneous: { tr: "Porselenimsi", en: "Porcelaneous" },
  agglutinated: { tr: "Aglütine", en: "Agglutinated" },
};

export const ARRANGEMENT = {
  planispiral: { tr: "Planispiral", en: "Planispiral" },
  trochospiral: { tr: "Trokospiral", en: "Trochospiral" },
  uniserial: { tr: "Uniseri (tek sıra)", en: "Uniserial" },
  biserial: { tr: "Biseri (iki sıra)", en: "Biserial" },
  triserial: { tr: "Triseri (üç sıra)", en: "Triserial" },
  annular: { tr: "Anüler (halkalı)", en: "Annular" },
};

export const GLOSSARY = {
  planktonic: {
    tr: ["Planktonik", "Su kolonunda süzülerek yaşayan. Öldüklerinde kavkıları deniz tabanına çöker."],
    en: ["Planktonic", "Living adrift in the water column. After death their tests sink to the sea floor."],
  },
  benthic: {
    tr: ["Bentik", "Deniz tabanının üstünde ya da tabandaki sedimentin içinde yaşayan."],
    en: ["Benthic", "Living on the sea floor or within its sediment."],
  },
  infaunal: {
    tr: ["İnfaunal", "Deniz tabanının yüzeyinde değil, sedimentin (çamurun) içinde yaşayan."],
    en: ["Infaunal", "Living within the sediment (mud) rather than on its surface."],
  },
  trochospiral: {
    tr: ["Trokospiral", "Koni gibi yükselen sarmal. Bir yüzde bütün turlar, öbür yüzde yalnızca son tur görünür."],
    en: ["Trochospiral", "A spiral that rises like a cone: one side shows every whorl, the other only the last."],
  },
  planispiral: {
    tr: ["Planispiral", "Tek bir düzlemde kıvrılan, iki yüzü simetrik sarmal."],
    en: ["Planispiral", "A spiral coiled in a single plane, with two symmetrical sides."],
  },
  involute: {
    tr: ["İnvolüt (örtülü)", "Her yeni tur öncekileri örter; dışarıdan yalnızca son tur görünür."],
    en: ["Involute", "Each new whorl covers the earlier ones, so only the last is visible."],
  },
  uniserial: {
    tr: ["Uniseri", "Odacıkların tek bir sıra hâlinde üst üste eklenmesi."],
    en: ["Uniserial", "Chambers added one after another in a single row."],
  },
  triserial: {
    tr: ["Triseri", "Her turda üç odacık; odacıklar üç sıra oluşturur."],
    en: ["Triserial", "Three chambers per whorl, forming three rows."],
  },
  annular: {
    tr: ["Anüler", "Odacıkların merkezin çevresinde tam halkalar oluşturması."],
    en: ["Annular", "Chambers forming complete rings around the centre."],
  },
  aperture: {
    tr: ["Ağız (aperture)", "Kavkının ana açıklığı; hücrenin psödopodları (yalancı ayakları) buradan dışarı uzanır."],
    en: ["Aperture", "The main opening of the test, through which the cell's pseudopodia reach out."],
  },
  suture: {
    tr: ["Dikiş (sütür)", "İki odacığın birleştiği çizgi."],
    en: ["Suture", "The line where two chambers meet."],
  },
  symbiont: {
    tr: ["Simbiyont", "Hücrenin içinde yaşayan, fotosentez yapan ortak (alg, diyatome). Konakçıya besin sağlar."],
    en: ["Symbiont", "A photosynthetic partner (alga, diatom) living inside the cell and feeding its host."],
  },
  biostratigraphy: {
    tr: ["Biyostratigrafi", "Kayaçları içerdikleri fosillere göre yaşlandırma ve karşılaştırma."],
    en: ["Biostratigraphy", "Dating and correlating rocks by the fossils they contain."],
  },
  paleobathymetry: {
    tr: ["Paleobatimetri", "Eski bir deniz tabanının derinliğinin tahmin edilmesi."],
    en: ["Paleobathymetry", "Estimating the depth of an ancient sea floor."],
  },
  scan: {
    tr: ["Tarama (µCT)", "X-ışınıyla yüzlerce kesit alınıp gerçek bir örnekten ölçülen 3D model. Sanatsal modellerden farkı budur."],
    en: ["Scan (µCT)", "A 3D model measured from a real specimen from hundreds of X-ray slices — unlike an artistic model."],
  },
};

// Everyday objects on the size ruler of the inspection panel (millimetres).
export const SIZE_REFERENCES = [
  { mm: 0.07, tr: "saç teli kalınlığı", en: "width of a hair" },
  { mm: 0.5, tr: "orta kum tanesi", en: "medium sand grain" },
  { mm: 5, tr: "pirinç tanesi", en: "grain of rice" },
  { mm: 25, tr: "madeni para", en: "coin" },
];
