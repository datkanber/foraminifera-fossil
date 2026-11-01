const photoFiles = require.context('../assets/photos/day-2', false, /\.jpg$/);

function fieldPhoto(id, tr, en, width = 1920, height = 1440) {
  const src = photoFiles(`./${id}-1920.jpg`);
  const thumbnail = photoFiles(`./${id}-960.jpg`);

  return {
    id,
    day: 2,
    src,
    srcSet: `${thumbnail} ${width / 2}w, ${src} ${width}w`,
    caption: { tr, en },
    width,
    height,
  };
}

export const dayTwoPhotos = [
  fieldPhoto('20261023_143133', 'Saha gezisinden: geleneksel tarım aletleri', 'From the field visit: traditional agricultural tools', 1440, 1920),
  fieldPhoto('20261023_144952', 'Yazılıkaya gezisinde proje katılımcıları', 'Project participants on the Yazılıkaya visit'),
  fieldPhoto('20261023_145158', 'Yazılıkaya’da birlikte keşif', 'Exploring Yazılıkaya together', 1920, 1081),
  fieldPhoto('20261023_145547', 'Yazılıkaya’nın kaya oluşumları ve kayaya oyulmuş yapıları', 'Rock formations and rock-cut structures at Yazılıkaya'),
  fieldPhoto('20261023_145716', 'Kaya oluşumları arasında saha gözlemleri', 'Field observations among the rock formations', 1920, 1081),
  fieldPhoto('20261023_145744', 'Midas Anıtı önünde saha çalışması', 'Fieldwork in front of the Midas Monument', 1920, 1081),
  fieldPhoto('20261023_145821', 'Midas Anıtı ve çevresindeki jeolojik peyzaj', 'The Midas Monument and its surrounding geological landscape', 1920, 1081),
  fieldPhoto('20261023_145836', 'Yazılıkaya’da jeolojik ve kültürel mirası incelerken', 'Exploring geological and cultural heritage at Yazılıkaya', 1920, 1081),
  fieldPhoto('20261023_150127', 'Yazılıkaya’da doğal kaya oluşumu ve kayaya oyulmuş mekânlar', 'A natural rock formation and rock-cut spaces at Yazılıkaya'),
];
