import welcome from '../assets/photos/1792745406529.jpg';
import specimens from '../assets/photos/1792745408759.jpg';
import collection from '../assets/photos/1792745417089.jpg';
import conversation from '../assets/photos/1792745431264.jpg';
import heritage from '../assets/photos/1792745433581.jpg';
import odunpazari from '../assets/photos/1792745438026.jpg';
import meeting from '../assets/photos/1793084811332.jpg';
import workshop from '../assets/photos/1793084811787.jpg';
import digitalModel from '../assets/photos/1793084813553.jpg';
import vr from '../assets/photos/1793084815421.jpg';
import vrExperience from '../assets/photos/1793084820971.jpg';
import sazova from '../assets/photos/1793084820901.jpg';

export const newsPhotos = {
  vr: { src: vr, caption: { tr: 'Yazılıkaya’nın dijital modelleriyle sanal gerçeklik deneyimi', en: 'Experiencing digital models of Yazılıkaya in virtual reality' } },
  meeting: { src: meeting, caption: { tr: 'STONE ortaklarıyla proje değerlendirme toplantısı', en: 'A project review meeting with STONE partners' } },
  welcome: { src: welcome, caption: { tr: 'STONE proje ortakları ESOGÜ Jeoloji Mühendisliği Bölümünde', en: 'STONE partners at ESOGÜ’s Department of Geological Engineering' } },
  specimens: { src: specimens, caption: { tr: 'Kayaç örnekleriyle jeoloji eğitimi', en: 'Learning geology through rock specimens' } },
  collection: { src: collection, caption: { tr: 'Jeoloji koleksiyonlarını birlikte keşfederken', en: 'Exploring geological collections together' } },
  conversation: { src: conversation, caption: { tr: 'Yapı taşları üzerine bilgi ve deneyim paylaşımı', en: 'Sharing knowledge and experience about building stones' } },
  heritage: { src: heritage, caption: { tr: 'Kültürel miras gezisinden bir hatıra', en: 'A moment from our cultural heritage visit' } },
  odunpazari: { src: odunpazari, caption: { tr: 'Odunpazarı’nın tarihi sokaklarında', en: 'In the historic streets of Odunpazarı' } },
  workshop: { src: workshop, caption: { tr: 'Jeoloji, eğitim ve dijital teknolojiler üzerine ortak çalışma', en: 'Working together on geology, education and digital technologies' } },
  digitalModel: { src: digitalModel, caption: { tr: 'Jeolojik mirasın dijital ortamda incelenmesi', en: 'Exploring geological heritage in a digital environment' } },
  vrExperience: { src: vrExperience, caption: { tr: 'Jeolojik mirasa sanal gerçeklikten bir bakış', en: 'A virtual reality perspective on geological heritage' } },
  sazova: { src: sazova, caption: { tr: 'Proje ekibiyle Sazova’da', en: 'The project team at Sazova' } },
};

export const pressSources = [
  {
    name: 'Tribuna de Salamanca',
    title: 'De la piedra de Villamayor a Turquía: un viaje europeo para aprender a cuidar el patrimonio',
    url: 'https://www.tribunasalamanca.com/noticias/463921/de-la-piedra-de-villamayor-a-turquia-un-viaje-europeo-para-aprender-a-cuidar-el-patrimonio',
  },
  {
    name: 'La Crónica de Salamanca',
    title: 'Villamayor lleva su patrimonio de piedra a Turquía',
    url: 'https://lacronicadesalamanca.com/702930-villamayor-lleva-su-patrimonio-piedra-turquia/',
  },
  {
    name: 'Salamanca24horas',
    title: 'Villamayor lleva su piedra y su patrimonio hasta Turquía a través de un proyecto educativo europeo',
    url: 'https://www.salamanca24horas.com/provincia/comarca-de-salamanca/villamayor-lleva-piedra-patrimonio-turquia-traves-proyecto-educativo-europeo',
  },
];

export const projectParticipants = [
  {
    institution: { tr: 'ESOGÜ · Jeoloji Mühendisliği Bölümü', en: 'ESOGÜ · Department of Geological Engineering' },
    country: { tr: 'Türkiye', en: 'Türkiye' },
    names: ['Prof. Dr. Volkan Karabacak', 'Dr. Kübra Yayan · GeoKnow', 'İsmet Elma'],
  },
  {
    institution: { tr: 'IESO Tomás Bretón', en: 'IESO Tomás Bretón' },
    country: { tr: 'İspanya', en: 'Spain' },
    names: ['María del Valle Sanazario Rodríguez', 'María Domínguez Fraile', 'María Dolores García Sánchez', 'Teófilo Domínguez Díaz'],
  },
  {
    institution: { tr: 'Villamayor Belediyesi', en: 'Villamayor Town Hall' },
    country: { tr: 'İspanya', en: 'Spain' },
    names: ['María Soledad García Rivero', 'Lucía Guinaldo Martín', 'María José García Amaro'],
  },
  {
    institution: { tr: 'Sirkeci Ortaokulu', en: 'Sirkeci Secondary School' },
    country: { tr: 'Türkiye', en: 'Türkiye' },
    names: ['Serkan Kara', 'Mehmet Ali Uz', 'Zuhal Urgancı', 'Gülşah Topal'],
  },
];

export const newsArticles = [
  {
    slug: 'stone-dijital-miras-ve-sanal-gerceklik',
    category: 'event',
    date: '2026-10-24',
    day: 3,
    photo: 'vr',
    gallery: ['vr', 'meeting', 'digitalModel', 'vrExperience', 'workshop', 'sazova'],
    title: { tr: 'Jeolojik mirasın dijital geleceğine yolculuk', en: 'Bringing geological heritage into the digital future' },
    summary: {
      tr: 'STONE buluşmasının son gününde Yazılıkaya’nın 3B modellerini sanal gerçeklikte deneyimledik. Şimdi hedefimiz, bu mirası herkesin erişebileceği sanal müzelere taşımak.',
      en: 'On the final day of our STONE meeting, we experienced 3D models of Yazılıkaya in virtual reality. Our next ambition: accessible virtual museums that share this heritage with everyone.',
    },
    sections: [
      {
        title: { tr: 'Üç günün ardından, yeni fikirlerle', en: 'Three days of exchange, a future of possibilities' },
        text: {
          tr: 'Erasmus+ STONE projesinin Eskişehir’deki üçüncü ve son gününde, projemizin sonraki aşamalarını ve planlanan faaliyetleri değerlendirdik. İspanya ve Türkiye’den ortaklarımızla uluslararası iş birliğimizi geliştirecek yeni fikirleri paylaştık.',
          en: 'On the third and final day of the Erasmus+ STONE meeting in Eskişehir, we reviewed the next stages and planned activities of our project. Together with our partners from Spain and Türkiye, we explored new ways to strengthen our international collaboration.',
        },
      },
      {
        title: { tr: 'Yazılıkaya’yı sanal gerçeklikte keşfetmek', en: 'Exploring Yazılıkaya in virtual reality' },
        text: {
          tr: 'Yazılıkaya’da gerçekleştirdiğimiz üç boyutlu taramaların sonuçlarını VR ortamında deneyimledik. Bu deneyim, jeolojik ve kültürel mirasın dijital olarak belgelenmesi, korunması ve gelecek nesillere aktarılması için teknolojinin sunduğu olanakları görünür kıldı.',
          en: 'We experienced the results of our three-dimensional scans of Yazılıkaya in VR. The experience demonstrated how digital technologies can help document and preserve geological and cultural heritage, making it available to future generations.',
        },
      },
      {
        title: { tr: 'Herkes için erişilebilir bir miras', en: 'Heritage that everyone can access' },
        text: {
          tr: 'Geo-Digital Knowledge Engineering Research Group (GeoKnow) ile birlikte tartıştığımız fikirlerden biri, bu dijital modelleri erişilebilir sanal müzelere dönüştürmek oldu. Bilim, teknoloji ve dostlukla dolu üç günün ardından, projenin bir sonraki buluşması için mart ayında İspanya’da yeniden bir araya gelmeyi planlıyoruz.',
          en: 'One idea explored with the Geo-Digital Knowledge Engineering Research Group (GeoKnow) was to transform these digital models into accessible virtual museums. After three days of science, technology and friendship, we plan to meet again in Spain in March for the next project gathering.',
        },
      },
    ],
  },
  {
    slug: 'stone-ispanya-basininda',
    category: 'press',
    date: '2026-10-25',
    photo: 'heritage',
    gallery: ['heritage', 'welcome', 'odunpazari'],
    title: { tr: 'Erasmus+ STONE projemiz İspanya basınında', en: 'Our Erasmus+ STONE project in the Spanish press' },
    summary: {
      tr: 'Eskişehir’de ev sahipliği yaptığımız uluslararası eğitim faaliyetleri, jeolojik miras ve dijital eğitim çalışmalarıyla İspanya basınında yer buldu.',
      en: 'Our international training activities in Eskişehir attracted Spanish press coverage for their focus on geological heritage and digital education.',
    },
    sections: [
      {
        title: { tr: 'Eskişehir’den İspanya’ya uzanan iş birliği', en: 'Collaboration connecting Eskişehir and Spain' },
        text: {
          tr: 'Eskişehir Osmangazi Üniversitesi Jeoloji Mühendisliği Bölümü olarak 22–24 Ekim 2026 tarihlerinde ev sahipliği yaptığımız Erasmus+ STONE uluslararası eğitim faaliyetleri; Tribuna de Salamanca, La Crónica de Salamanca ve Salamanca24horas platformlarında haberleştirildi.',
          en: 'The Erasmus+ STONE international training activities hosted by the Department of Geological Engineering at Eskişehir Osmangazi University on 22–24 October 2026 were featured by Tribuna de Salamanca, La Crónica de Salamanca and Salamanca24horas.',
        },
      },
      {
        title: { tr: 'İki taş, ortak bir bilim ve kültür hikâyesi', en: 'Two stones, a shared story of science and culture' },
        text: {
          tr: 'Villamayor kumtaşı ile Ankara andezitini ortak bir bilimsel ve kültürel zeminde buluşturan proje; jeolojiyi, tarihi, teknolojiyi ve eğitimi bir araya getiriyor. Haberler, yapı taşlarının kültürel mirastaki rolünü ve dijital teknolojilerin eğitimle bütünleşmesini öne çıkarıyor.',
          en: 'By bringing Villamayor sandstone and Ankara andesite into a shared scientific and cultural context, the project connects geology, history, technology and education. The coverage highlights the role of building stones in cultural heritage and the integration of digital technologies into learning.',
        },
      },
      {
        title: { tr: 'ESOGÜ ve GeoKnow katkısı', en: 'Contributions from ESOGÜ and GeoKnow' },
        text: {
          tr: 'Prof. Dr. Volkan Karabacak ve GeoKnow Direktörü Dr. Öğr. Üyesi Kübra Yayan’ın yer aldığı ESOGÜ ekibi, üniversitemizin bilimsel birikimini uluslararası eğitim ortaklığına taşıdı. Jeolojik mirasın korunmasına yönelik çalışmalarımızı bilim, eğitim ve kültür etrafında geliştirmeyi sürdürüyoruz.',
          en: 'The ESOGÜ team, including Prof. Dr. Volkan Karabacak and Asst. Prof. Dr. Kübra Yayan, Director of GeoKnow, brought the university’s scientific expertise to this international educational partnership. We continue to develop our work in geological heritage preservation through science, education and culture.',
        },
      },
    ],
  },
  {
    slug: 'stone-yazilikaya-jeolojik-miras',
    category: 'event',
    date: '2026-10-23',
    day: 2,
    photo: 'digitalModel',
    gallery: ['digitalModel'],
    title: { tr: 'Yazılıkaya: taşa işlenen mirası belgelemek', en: 'Yazılıkaya: documenting heritage carved in stone' },
    summary: {
      tr: 'Yazılıkaya ve Midas Anıtı’nda jeoloji ile kültürel mirasın ilişkisini inceledik; dijital belgeleme ve üç boyutlu modeller için sahadan veriler topladık.',
      en: 'At Yazılıkaya and the Midas Monument, we explored the connection between geology and cultural heritage, gathering material for digital documentation and 3D models.',
    },
    sections: [
      {
        title: { tr: 'Doğal peyzajdan kültürel mirasa', en: 'From natural landscapes to cultural heritage' },
        text: {
          tr: 'STONE programının ikinci gününde Yazılıkaya ve kayaya oyulmuş Frig cephesi Midas Anıtı, jeolojik çevre ile insan müdahalesi arasındaki ilişkiyi birlikte incelemek için bir açık hava öğrenme alanı sundu.',
          en: 'On the second day of the STONE programme, Yazılıkaya and the Midas Monument, a Phrygian façade carved into rock, offered an outdoor learning setting for exploring the relationship between the geological environment and human activity.',
        },
      },
      {
        title: { tr: 'Sahadan dijital öğrenme ortamına', en: 'From the field to digital learning' },
        text: {
          tr: 'Fotoğraflar, saha notları ve üç boyutlu taramalarla mirası belgelemenin yollarını araştırdık. Bu çalışmalar, proje kapsamında geliştirilecek eğitim materyallerine ve sanal müze fikrine temel oluşturuyor. Yazılıkaya modellerini programın son gününde sanal gerçeklik ortamında deneyimledik.',
          en: 'Through photographs, field notes and three-dimensional scans, we explored ways of documenting heritage. This work supports the educational materials and virtual museum envisioned by the project. On the final day, we experienced the Yazılıkaya models in virtual reality.',
        },
      },
    ],
    source: pressSources[0],
  },
  {
    slug: 'stone-eskisehir-ilk-bulusma',
    category: 'event',
    date: '2026-10-22',
    day: 1,
    photo: 'welcome',
    gallery: ['welcome', 'specimens', 'collection', 'conversation', 'odunpazari', 'heritage'],
    title: { tr: 'STONE için Eskişehir’de ilham veren bir başlangıç', en: 'An inspiring start to STONE in Eskişehir' },
    summary: {
      tr: 'İspanya ve Türkiye’den proje ortaklarımızı ESOGÜ’de ağırladık. Jeoloji, eğitim, mimari ve kültürel miras etrafında ortak bir keşif yolculuğuna başladık.',
      en: 'We welcomed our partners from Spain and Türkiye to ESOGÜ, beginning a shared journey through geology, education, architecture and cultural heritage.',
    },
    sections: [
      {
        title: { tr: 'Bilim ve eğitim etrafında bir araya geldik', en: 'Coming together through science and education' },
        text: {
          tr: 'Erasmus+ STONE projesinin Eskişehir programına, İspanya ve Türkiye’den ortaklarımızı Eskişehir Osmangazi Üniversitesi Jeoloji Mühendisliği Bölümünde karşılayarak başladık. IESO Tomás Bretón, Villamayor Belediyesi, Sirkeci Ortaokulu ve ESOGÜ ekipleri aynı öğrenme ortamında buluştu.',
          en: 'We began the Erasmus+ STONE programme in Eskişehir by welcoming our partners from Spain and Türkiye to the Department of Geological Engineering at Eskişehir Osmangazi University. Teams from IESO Tomás Bretón, Villamayor Town Hall, Sirkeci Secondary School and ESOGÜ came together in a shared learning environment.',
        },
      },
      {
        title: { tr: 'Kayaçlar, kentler ve ortak hikâyeler', en: 'Rocks, cities and shared stories' },
        text: {
          tr: 'İlk gün, kayaçların ve minerallerin yalnızca gezegenimizi değil, uygarlıkları da nasıl şekillendirdiğini ele aldık. Jeoloji, eğitim, mimari ve kültürel miras arasındaki bağları keşfederek farklı disiplinlerin ve kültürlerin deneyimlerini paylaştık. Bilim, eğitim ve dostluk etrafında uluslararası iş birliğimizi güçlendirdik.',
          en: 'On the first day, we explored how rocks and minerals shape our civilizations as well as our planet. By examining the connections between geology, education, architecture and cultural heritage, we shared experiences across disciplines and cultures, strengthening our international collaboration through science, education and friendship.',
        },
      },
    ],
    showParticipants: true,
  },
];
