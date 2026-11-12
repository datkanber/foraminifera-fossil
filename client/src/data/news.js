import { dayTwoPhotos } from './fieldPhotos';

const photoFiles = require.context('../assets/photos', false, /\.jpg$/);

function photo(id, day, tr, en, width = 1152, height = 1536) {
  return { id, day, src: photoFiles(`./${id}.jpg`), caption: { tr, en }, width, height };
}

// The cover and daily galleries share one ordered collection for the photo viewer.
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
  ...dayTwoPhotos,
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

export { stoneDays, projectParticipants, pressSources } from './newsContent';
