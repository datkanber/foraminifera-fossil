const photoFiles = require.context('../assets/photos', false, /\.jpg$/);

function photo(id, day, tr, en, width = 1152, height = 1536) {
  return { id, day, src: photoFiles(`./${id}.jpg`), caption: { tr, en }, width, height };
}

// The cover and day galleries contain every event photo in assets/photos.
export const eventPhotos = [
  photo('1792745406529', 1, 'STONE proje ekibi, ESOGÜ Jeoloji Mühendisliği Bölümü', 'The STONE project team at ESOGÜ’s Department of Geological Engineering', 2048, 1536),
  photo('1792745401979', 1, 'Jeoloji koleksiyonları üzerine sohbet', 'Discussing the geological collections'),
  photo('1792745403944', 1, 'Bölüm koleksiyonlarının ziyareti', 'Visiting the department’s collections'),
  photo('1792745404811', 1, 'Mineral ve kayaç örneklerinin incelenmesi', 'Examining mineral and rock specimens'),
  photo('1792745404852', 1, 'Koleksiyon gezisinden bir kare', 'A moment from the collection visit'),
  photo('1792745406966', 1, 'Laboratuvarda bilgi paylaşımı', 'Sharing knowledge in the laboratory'),
  photo('1792745408759', 1, 'Kayaç örnekleriyle jeoloji eğitimi', 'Geology training with rock specimens', 1600, 1200),
  photo('1792745409090', 1, 'Jeoloji oturumunda katılımcılar', 'Participants in the geology session'),
  photo('1792745417089', 1, 'Eğitim koleksiyonu üzerinde çalışma', 'Working with the teaching collection', 2048, 1536),
  photo('1792745417607', 1, 'Katılımcılar arasında deneyim paylaşımı', 'Exchanging experiences with project partners'),
  photo('1792745431264', 1, 'Yapı taşları üzerine değerlendirmeler', 'Discussing building stones'),
  photo('1792745433581', 1, 'Kurşunlu Külliyesi’nde proje ekibi', 'The project team at the Kurşunlu Complex', 2048, 1536),
  photo('1792745438026', 1, 'Odunpazarı’nın tarihi sokaklarında', 'In the historic streets of Odunpazarı', 2048, 1536),
  photo('1793181571000', 2, 'Jeoloji oturumunda elektromanyetik spektrum sunumu', 'A presentation on the electromagnetic spectrum during the geology session', 1600, 900),
  photo('1793181571002', 2, 'Jeoloji laboratuvarında proje ortakları', 'Project partners in the geology laboratory', 1600, 900),
  photo('1793181572001', 2, 'Tarihi bir mekânda proje ekibi', 'The project team at a historic venue', 1600, 1200),
  photo('1793181674000', 2, 'Taş döşeli bir yolda yürüyüş', 'Walking along a stone-paved path', 1600, 900),
  photo('1793181571001', 2, 'Yazılıkaya saha etkinliğine giriş', 'Introduction to the Yazılıkaya field activity', 1600, 900),
  photo('1793181572000', 2, 'Yazılıkaya’da kaya oluşumları önünde proje ekibi', 'The project team among the rock formations at Yazılıkaya', 1600, 900),
  photo('1793181673000', 2, 'Yazılıkaya’da kaya oluşumlarının incelenmesi', 'Examining the rock formations at Yazılıkaya', 1600, 900),
  photo('1793181673001', 2, 'Yazılıkaya’da saha çalışması', 'Fieldwork at Yazılıkaya', 1600, 900),
  photo('1793181673002', 2, 'Yazılıkaya’da proje katılımcıları', 'Project participants at Yazılıkaya', 1600, 900),
  photo('1793084811332', 3, 'Projenin sonraki aşamaları üzerine toplantı', 'Discussing the next stages of the project', 2048, 1536),
  photo('1793084811531', 3, 'Proje ortaklarıyla ortak planlama', 'Planning together with project partners', 2048, 1536),
  photo('1793084811608', 3, 'Uluslararası iş birliğinin değerlendirilmesi', 'Reviewing our international collaboration', 2048, 1536),
  photo('1793084811787', 3, 'Jeoloji laboratuvarında son gün çalışmaları', 'Final-day activities in the geology laboratory', 2048, 1536),
  photo('1793084819304', 3, 'Ortak çalışma ve değerlendirme oturumu', 'A shared working and review session', 2048, 1536),
  photo('1793084813553', 3, 'Yazılıkaya’nın dijital modeli üzerine çalışma', 'Working with a digital model of Yazılıkaya', 2048, 1152),
  photo('1793084814732', 3, 'Yazılıkaya modelinin birlikte incelenmesi', 'Exploring the Yazılıkaya model together'),
  photo('1793084815421', 3, 'Üç boyutlu taramaları VR gözlüğüyle deneyimlerken', 'Experiencing the 3D scans with a VR headset', 2048, 1536),
  photo('1793084818480', 3, 'Sanal gerçeklik uygulaması', 'A virtual reality demonstration'),
  photo('1793084820971', 3, 'Jeolojik mirası sanal gerçeklikte keşfetmek', 'Exploring geological heritage in virtual reality'),
  photo('1793084820978', 3, 'Katılımcıların VR deneyimi', 'Participants experiencing VR'),
  photo('1793084820901', 3, 'Sazova Parkı’nda proje ekibi', 'The project team at Sazova Park', 2048, 1536),
  photo('1793084820985', 3, 'Sazova gezisinden bir hatıra', 'A memory from the visit to Sazova'),
];

export const stoneDays = [
  {
    day: 1,
    date: '2026-10-22',
    title: { tr: 'Jeoloji ve taş mirası', en: 'Geology and stone heritage' },
    paragraphs: {
      tr: [
        'Erasmus+ STONE projesinin ilk gününde, İspanya ve Türkiye’den ortaklarımızı Eskişehir Osmangazi Üniversitesi Jeoloji Mühendisliği Bölümünde ağırladık. Kayaçlar ve mineraller üzerinden jeoloji, eğitim, mimari ve kültürel miras arasındaki bağları ele aldık.',
        'Dr. Öğr. Üyesi Kübra Yayan’ın jeoloji oturumunda Villamayor kumtaşı ile Ankara andezitini karşılaştırdık; örneklerin gözlemlenebilir özelliklerini ve yapı taşı olarak kullanımlarını değerlendirdik. Laboratuvar ve koleksiyon ziyaretleri, farklı kurumların deneyimlerini paylaşmasına olanak sağladı.',
        'Öğleden sonra Odunpazarı’nın tarihi evlerini, müzelerini ve Kurşunlu Külliyesi’ni gezdik. Kentin yapı taşlarını yerinde inceleyerek malzeme, mimari, geleneksel zanaatlar ve yerel tarih arasındaki ilişkiyi konuştuk.',
      ],
      en: [
        'On the first day of Erasmus+ STONE, we welcomed our partners from Spain and Türkiye to the Department of Geological Engineering at Eskişehir Osmangazi University. Rocks and minerals provided a starting point for exploring the connections between geology, education, architecture and cultural heritage.',
        'In the geology session led by Asst. Prof. Dr. Kübra Yayan, we compared Villamayor sandstone and Ankara andesite, discussing their observable characteristics and use as building stones. Laboratory and collection visits gave partners from different institutions an opportunity to exchange experience.',
        'In the afternoon, we visited the historic houses and museums of Odunpazarı and the Kurşunlu Complex. Observing stone in the city helped us explore its relationship with architecture, traditional crafts and local history.',
      ],
    },
    schedule: [
      { time: '10:00–10:30', label: { tr: 'Tanışma ve proje sunumu', en: 'Introductions and project presentation' }, lead: 'Volkan Karabacak, Teo, Gülşah' },
      { time: '10:30–11:30', label: { tr: 'Jeoloji, kayaçlar ve mineraller', en: 'Geology, rocks and minerals' }, lead: 'Kübra Yayan' },
      { time: '14:00–17:00', label: { tr: 'Odunpazarı ve Kurşunlu Külliyesi', en: 'Odunpazarı and the Kurşunlu Complex' } },
    ],
    focus: {
      tr: 'Günün odağı: gözlemi yorumdan ayırmak; bir taşın görünür özelliklerini ve kent yaşamındaki yerini belgelemek.',
      en: 'The day’s focus: separating observation from interpretation, and documenting a stone’s visible features and its place in local life.',
    },
  },
  {
    day: 2,
    date: '2026-10-23',
    title: { tr: 'Dijital belgeleme ve Yazılıkaya', en: 'Digital documentation and Yazılıkaya' },
    paragraphs: {
      tr: [
        'İkinci gün, taş mirasını dijital ortamda belgelemenin yöntemlerine ayrıldı. Prof. Dr. Volkan Karabacak’ın fotogrametri oturumunda ışık, çekim açısı, fotoğrafların örtüşmesi, ölçek ve dosya düzeni üzerinde duruldu. Ardından Volkan Karabacak ve İsmet Elma’nın Matterport gösteriminde örnek modellerin nasıl incelendiği ele alındı.',
        'Öğleden sonra Yazılıkaya ve Midas Anıtı’nda jeolojik peyzaj ile insan müdahalesinin ilişkisini inceledik. Kayaya oyulmuş Frig cephesi, hem doğal malzemeyi hem de kültürel mirası birlikte okumak için bir saha öğrenme alanı sundu.',
        'Programın saha çalışması; uygun yüzeylerin fotoğraf dizileriyle belgelenmesini, konum ve ölçek bilgilerinin kaydedilmesini ve gözlem notlarının hazırlanmasını kapsıyordu. Bu kayıtlar, üç boyutlu modellerin eğitimde anlamlı biçimde kullanılmasına temel oluşturuyor.',
      ],
      en: [
        'The second day focused on methods for documenting stone heritage digitally. Prof. Dr. Volkan Karabacak’s photogrammetry session covered lighting, camera angles, photographic overlap, scale and file organisation. A Matterport demonstration by Volkan Karabacak and İsmet Elma then introduced ways of navigating and inspecting sample models.',
        'In the afternoon, we explored the relationship between the geological landscape and human activity at Yazılıkaya and the Midas Monument. The Phrygian façade carved into the rock offered a field learning setting for considering natural materials and cultural heritage together.',
        'The fieldwork programme included photographic sequences of suitable surfaces, records of location and scale, and observation notes. These records provide context for using three-dimensional models meaningfully in education.',
      ],
    },
    schedule: [
      { time: '10:00–10:30', label: { tr: 'Fotogrametri ve fotoğraf uygulaması', en: 'Photogrammetry and photography practice' }, lead: 'Volkan Karabacak' },
      { time: '10:30–11:30', label: { tr: 'Matterport tarama gösterimi', en: 'Matterport scanning demonstration' }, lead: 'Volkan Karabacak, İsmet Elma' },
      { time: '14:00–17:00', label: { tr: 'Yazılıkaya ziyareti ve saha belgelemesi', en: 'Yazılıkaya visit and field documentation' } },
    ],
    focus: {
      tr: 'Günün odağı: fotoğraf, ölçek ve saha notlarını birlikte kullanarak dijital modele bağlam kazandırmak.',
      en: 'The day’s focus: giving a digital model context through photographs, scale information and field notes.',
    },
  },
  {
    day: 3,
    date: '2026-10-24',
    title: { tr: 'Sanal gerçeklik, ortak planlar ve Sazova', en: 'Virtual reality, shared plans and Sazova' },
    paragraphs: {
      tr: [
        'Eskişehir’deki üçüncü ve son güne, projenin sonraki aşamalarını ve planlanan faaliyetleri değerlendirerek başladık. Türkiye ve İspanya’dan ortaklarımızla uluslararası iş birliğimizi nasıl geliştirebileceğimizi konuştuk. Günün programında, Villamayor ve Ankara için ortak ders tasarımları ve kapsayıcı dijital öğrenme senaryoları geliştirilmesi hedefleniyordu.',
        'Günün en dikkat çekici deneyimlerinden biri, Yazılıkaya’da gerçekleştirdiğimiz üç boyutlu taramaların sonuçlarını VR gözlükleriyle incelemek oldu. Jeolojik yapıları sanal gerçeklikte deneyimlemek, jeolojik ve kültürel mirasın dijital olarak korunması ve gelecek nesillere aktarılması için yeni olanaklar sundu.',
        'Geo-Digital Knowledge Engineering Research Group (GeoKnow) ile birlikte bu modellerin herkesin erişebileceği sanal müzelere dönüştürülmesi fikrini tartıştık. Böylece dijital belgelemenin, mirası daha geniş kitlelerle buluşturabilecek bir eğitim aracına dönüşmesini ele aldık.',
        'Programın son bölümünde Sazova Parkı’nı ziyaret ettik. Bilim, teknoloji ve kültürel miras etrafında geçen üç günü, birlikte geçirdiğimiz zaman ve yeni çalışma fikirleriyle tamamladık. Bir sonraki proje buluşması için mart ayında İspanya’da yeniden bir araya gelmeyi planlıyoruz.',
      ],
      en: [
        'We began the third and final day in Eskişehir by reviewing the next stages and planned activities of our project. Partners from Türkiye and Spain discussed how to strengthen our international collaboration. The day’s programme aimed to develop shared lesson plans for Villamayor and Ankara, alongside inclusive digital learning scenarios.',
        'One of the highlights was experiencing the results of our three-dimensional scans of Yazılıkaya through VR headsets. Exploring geological structures in virtual reality opened up possibilities for preserving geological and cultural heritage digitally and passing it on to future generations.',
        'Together with the Geo-Digital Knowledge Engineering Research Group (GeoKnow), we discussed transforming these models into virtual museums that everyone can access. This offered a way to bring digital documentation into education and share heritage with a wider audience.',
        'The final part of our programme included a visit to Sazova Park. We completed three days of science, technology and cultural heritage with shared experiences and ideas for future work. We plan to meet again in Spain in March for the next project gathering.',
      ],
    },
    schedule: [
      { time: '10:00–10:45', label: { tr: 'Ortak ders planlarının geliştirilmesi', en: 'Developing shared lesson plans' }, lead: 'Teo, Gülşah' },
      { time: '10:45–11:30', label: { tr: 'Dijital görevler ve kapsayıcı katılım', en: 'Digital tasks and inclusive participation' } },
      { time: '14:00–17:00', label: { tr: 'Sazova, Porsuk ve Adalar için gezi zamanı', en: 'Visit time for Sazova, Porsuk and Adalar' } },
    ],
    focus: {
      tr: 'Günün odağı: saha deneyimini eğitime taşımak ve jeolojik mirası erişilebilir dijital ortamlarla paylaşmak.',
      en: 'The day’s focus: bringing field experience into education and sharing geological heritage through accessible digital environments.',
    },
  },
];

export const projectParticipants = [
  {
    institution: { tr: 'Eskişehir Osmangazi Üniversitesi', en: 'Eskişehir Osmangazi University' },
    detail: { tr: 'Jeoloji Mühendisliği Bölümü · Türkiye', en: 'Department of Geological Engineering · Türkiye' },
    names: {
      tr: ['Prof. Dr. Volkan Karabacak', 'Dr. Öğr. Üyesi Kübra Yayan · GeoKnow Direktörü', 'Jeoloji Mühendisi İsmet Elma, MSc'],
      en: ['Prof. Dr. Volkan Karabacak', 'Asst. Prof. Dr. Kübra Yayan · Director of GeoKnow', 'Geological Engineer İsmet Elma, MSc'],
    },
  },
  {
    institution: { tr: 'IESO Tomás Bretón', en: 'IESO Tomás Bretón' },
    detail: { tr: 'İspanya', en: 'Spain' },
    names: ['María del Valle Sanazario Rodríguez', 'María Domínguez Fraile', 'María Dolores García Sánchez', 'Teófilo Domínguez Díaz'],
  },
  {
    institution: { tr: 'Villamayor Belediyesi', en: 'Villamayor Town Hall' },
    detail: { tr: 'İspanya', en: 'Spain' },
    names: ['María Soledad García Rivero', 'Lucía Guinaldo Martín', 'María José García Amaro'],
  },
  {
    institution: { tr: 'Sirkeli Ortaokulu', en: 'Sirkeli Secondary School' },
    detail: { tr: 'Türkiye', en: 'Türkiye' },
    names: ['Serkan Kara', 'Mehmet Ali Uz', 'Zuhal Urgancı', 'Gülşah Topal'],
  },
];

export const pressSources = [
  {
    name: 'Tribuna de Salamanca',
    title: 'De la piedra de Villamayor a Turquía: un viaje europeo para aprender a cuidar el patrimonio',
    url: 'https://www.tribunasalamanca.com/noticias/463921/de-la-piedra-de-villamayor-a-turquia-un-viaje-europeo-para-aprender-a-cuidar-el-patrimonio',
    date: '2026-10-25',
  },
  {
    name: 'Salamanca24horas',
    title: 'Villamayor lleva su piedra y su patrimonio hasta Turquía a través de un proyecto educativo europeo',
    url: 'https://www.salamanca24horas.com/provincia/comarca-de-salamanca/villamayor-lleva-piedra-patrimonio-turquia-traves-proyecto-educativo-europeo',
    date: '2026-10-24',
  },
];
