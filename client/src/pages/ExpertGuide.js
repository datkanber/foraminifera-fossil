import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import PageHero from '../components/ms/PageHero';
import '../styles/pages/expert-guide.css';

const copy = {
  tr: {
    eyebrow: 'GeoKnow · Platform rehberi', title: 'GeoKnow Kullanım Kılavuzu',
    intro: 'Tanı, görsel yapay zekâ, jeoloji ve 3D laboratuvar araçlarını nasıl kullanacağınızı öğrenin. Bilimsel sonuçları kendi gözlemlerinizle doğrulayın.',
    enter: 'Değerlendirme Alanını Aç', jump: 'Değerlendirme adımlarını incele',
    toolsTitle: 'GeoKnow araçlarını kullanma',
    toolsIntro: 'Her araç farklı bir çalışma adımını destekler. En uygun akış, önce 3D Laboratuvar ile temel morfolojiyi tanımak, ardından Tanı Yap veya Görsel YZ ile incelemeyi derinleştirmektir.',
    tools: [
      { title: 'Tanı Yap', description: 'İnce kesit gözlemlerinden olası cinsleri kural tabanlı karar desteğiyle daraltın.', steps: ['Adım Adım Tanı ile soruları sırayla yanıtlayın veya Karakter Puanlama ile CHR karakterlerini doğrudan girin.', 'Görüntüde açıkça görülen değerleri seçin; gözlenemeyen yapıları yok kabul etmeyin.', 'Sonuç durumunu, eşleşen karakterleri ve uyarıları birlikte değerlendirip gerektiğinde taksonomik kaynaklarla doğrulayın.'], href: '/tani', cta: 'Tanı aracını aç' },
      { title: 'Görsel YZ', description: 'Foraminifer görüntüsünü görsel yapay zekâ ile inceleyip morfolojik adaylar ve gözlem notları üretin.', steps: ['JPG, PNG veya WEBP formatında, 8 MB’dan küçük bir görüntü yükleyin.', 'Lokasyon, jeolojik yaş, optik/büyütme ve ölçek bilgilerini mümkün olduğunca doldurun.', 'Analiz Sonuçları bölümündeki adayları karar değil, doğrulanması gereken bir gözlem önerisi olarak kullanın. İsterseniz Karar Destek motorunu ayrıca çalıştırın.'], href: '/vlm', cta: 'Görsel YZ’yi aç' },
      { title: 'Jeoloji', description: 'Jeolojik zaman, çökelme derinliği, ortam ve takson kayıtlarını birlikte inceleyin.', steps: ['Paleosen–Eosen zaman çizelgesinden bir kat seçin ve seçili katın açıklamasını okuyun.', 'Takson etiketlerini seçerek WoRMS ve ontoloji profilini açın.', 'Derinlik zonu ve taksonomik seviye filtreleriyle ortam kayıtlarını daraltın; seçili taksonu fosil kataloğunda görüntüleyin.'], href: '/jeoloji', cta: 'Jeoloji alanını aç' },
      { title: '3D Laboratuvar', description: 'Foraminifer modellerini sanal sergi içinde inceleyin ve morfolojik terimleri etkileşimli olarak öğrenin.', steps: ['Rehberli turla başlayın veya serbest dolaşımı seçin; Keşif Defteri üzerinden sergileri ve panoları takip edin.', 'Bir modeli açınca Yüzey, Röntgen ve Kesit görünümleriyle dış ve iç yapıyı karşılaştırın; sürükleyerek döndürün, tekerlekle yakınlaşın.', 'Rehberli turdan sonra Kendini Sına bölümündeki sorularla öğrenmenizi kontrol edin.'], href: '/lab', cta: '3D Laboratuvarı aç' },
      { title: 'Haberler ve Etkinlikler', description: 'GeoKnow araştırma grubunun saha, eğitim ve akademik etkinlik notlarını takip edin.', steps: ['Haberler ve Etkinlikler sayfasından bir başlık seçin.', 'Gün, konu ve görseller üzerinden etkinliğin bağlamını inceleyin.', 'İlgili araçlara geçiş bağlantılarını kullanarak okuduğunuz içeriği Tanı, Jeoloji veya 3D Lab ile ilişkilendirin.'], href: '/haberler', cta: 'Haberleri aç' },
      { title: 'Değerlendirme Alanı', description: 'Yetkili koordinatör ve katılımcılar için bağımsız gözlem ve kural inceleme çalışma alanıdır.', steps: ['Koordinatör hesabınızla veya kişisel davet bağlantınızla giriş yapın.', 'Önce Form B’de bağımsız fosil gözlemini tamamlayın; Form A yalnızca aşama açıldığında kullanılabilir.', 'Taslakları kaydedin, bağımsızlık beyanlarını kontrol edin ve kesin gönderimden önce yanıtları gözden geçirin.'], href: '/expert-validation', cta: 'Alana git' }
    ],
    sequence: ['1 · Form B: Fosil gözlemi', '2 · Form A: Kural incelemesi', '3 · Son kontrol ve gönderim'],
    beforeTitle: 'Başlamadan önce',
    before: [
      'Koordinatörünüzden size özel bir davet bağlantısı almış olmalısınız. Her uzman kendi hesabını kullanır.',
      'Görüntüleri rahat incelemek için bilgisayar veya tablet kullanın. Değerlendirme için kesintisiz zaman ayırın.',
      'Form B sırasında başka uzmanın yanıtlarına, referans cinslerine, AI önerilerine veya GeoKnow tanı ve puanlama çıktılarına bakmayın.'
    ],
    stepsTitle: 'Adım adım değerlendirme',
    steps: [
      { title: 'Davetinizi açın ve hesabınıza girin', text: 'Koordinatörün gönderdiği kişisel bağlantıyı açın. İlk girişte en az 12 karakterlik kendi parolanızı belirleyip “Hesabı etkinleştir” düğmesine basın. Ekranda gösterilen hesap adını not edin; sonraki girişlerde “Uzman girişi” menüsünden bu hesap adı ve parolayı kullanın.', note: 'Davetiniz yoksa veya bağlantı geçersizse koordinatörünüzden yeni davet isteyin. Ortak bir uzman parolası kullanılmaz.' },
      { title: 'Önce Form B’de atanmış fosili seçin', text: '“1. Form B · Kör fosil gözlemi” bölümünde “Atanan değerlendirme” listesinden bir kayıt seçin. Yalnız anonim örnek kodunu ve size sunulan materyali inceleyin. Birden fazla görünüm varsa her birini açın; yakınlaştırma düğmeleriyle büyütün, sürükleyerek veya ok tuşlarıyla kaydırın.', note: '“Gözleme başla” ile süreyi başlatın. Ara verdiğinizde “Mola”, döndüğünüzde “Devam et” düğmesini kullanın. Sekme gizlendiğinde sayaç durur; geri döndüğünüzde devam ettirin.' },
      { title: 'Kaliteyi ve 21 karakteri kendiniz kaydedin', text: 'Görüntü / korunma kalitesini seçin. CHR_01–CHR_21 karakterlerinin her biri için uygun gözlem durumunu ve değerlendirebildiğiniz kontrollü değeri girin. Gerekirse görsel gerekçe veya sınırlılık notu ekleyin. Görünmeyen bir yapıyı yok kabul etmeyin; emin olmadığınız değeri tahmin ederek tamamlamayın.', note: 'CHR_21 yalnız kesit yönü bağlamıdır ve puana girmez. Bağımsız cins tahmini ve öznel güven alanları, 21 karakterin durumları tamamlandıktan sonra isteğe bağlı olarak açılır.' },
      { title: 'Taslağınızı kaydedin veya Form B’yi kesin gönderin', text: 'Ara vermek için “Taslağı kaydet” düğmesine basın. Yeniden giriş yaptığınızda aynı kaydı seçerek devam edebilirsiniz. Bitirdiğinizde bütün yanıtları ve bağımsızlık beyanlarını kontrol edin; “Değerlendirmeyi gönder”, ardından “Onaylıyorum, kesin gönder” düğmesine basın.', note: 'Kesin gönderim yanıtı kilitler. Beyanlardan biri doğru değilse onu onaylamayın; durumu koordinatörünüze bildirin. Size atanan her fosil için bu adımları ayrı ayrı tamamlayın.' },
      { title: 'Form A açıldığında kural kartlarını inceleyin', text: 'İki uzmanın da atanmış bütün Form B kayıtlarını göndermesi ve koordinatörün sonraki aşamayı açması gerekir. Ardından “2. Form A · Kural incelemesi” bölümünden bir kart seçin. Özgün ifadeyi, M/D/S/C kanıt düzeyini ve karakter eşlemesini ayrı değerlendirin; onay, düzeltme, ret veya değerlendirilemedi kararınızı kaydedin.', note: 'Düzeltme veya ret için gerekçe, kaynak, sayfa / şekil, sorun tipi ve beklenen etkiyi girin. AI önerileri sunuluyorsa her kartı bizzat inceleyip kendi kararınızı, kanıtınızı ve tek kural için insan doğrulamanızı ayrı kaydedin; öneriyi otomatik doğru kabul etmeyin.' },
      { title: 'İnceleme özetini tamamlayın ve kayıtlarınızı saklayın', text: 'Tüm kural kartlarını gönderdikten sonra “İnceleme sonuç özeti ve kapanış” kaydını açın. Kurum, uzmanlık, kural geliştirmeyle ilişkiniz, kaynaklarınız ve genel bilimsel görüşünüzü yazın; beyanları kontrol edip özeti gönderin. Gönderilmiş kendi formlarınızı salt okunur açabilir; JSON, CSV veya “Yazdır / PDF kaydet” bağlantılarıyla alabilirsiniz.', note: 'Bir hata fark ederseniz koordinatörünüze kayıt kodunu bildirin. Orijinal yanıtlarınız korunur; gerekli düzeltme veya uzlaştırma ayrı kaydedilir. Sonuç analizleri, koordinatör çalışma verilerini kilitledikten sonra yapılır.' }
    ],
    statesTitle: 'Gözlem durumunu nasıl seçmeliyim?', stateHead: ['Durum', 'Ne zaman kullanılır?'],
    states: [
      ['PRESENT', 'Karakteri değerlendirebildiniz ve seçtiğiniz değeri güvenle kaydediyorsunuz. Değerin kendisi negatif de olabilir.'],
      ['ABSENT', 'İlgili özelliğin yokluğunu açıkça gözlediniz. Bu durum yalnız ABSENT veya NONE değeriyle kullanılır.'],
      ['NOT_OBSERVABLE', 'İlgili yapı kesit yönü, görüntü kalitesi, korunma veya görünürlük nedeniyle değerlendirilemiyor.'],
      ['UNCERTAIN', 'İlgili bölge görünür, ancak yapının yorumundan veya doğru değerinden emin değilsiniz.']
    ],
    stateNote: 'Örnek kodlama: Yokluğu güvenle gözlenen bir özellik için Değer = ABSENT ve Durum = PRESENT geçerlidir. NOT_OBSERVABLE ve UNCERTAIN yokluk kanıtı sayılmaz.',
    faqTitle: 'Sık sorulan sorular',
    faq: [
      ['Form A neden kilitli?', 'Önce iki uzmanın da bütün atanmış fosil gözlemlerini tamamlaması, sonra koordinatörün kural incelemesini açması gerekir. Bu sıra, kural bilgisinin bağımsız fosil gözlemini etkilemesini azaltır.'],
      ['Listede değerlendirme görünmüyor.', 'Koordinatörünüz materyali veya atamaları henüz hazırlıyor olabilir. “Durumu yenile” düğmesini kullanın; kayıt görünmüyorsa koordinatörünüze haber verin.'],
      ['Taslak otomatik kaydediliyor mu?', 'Devam etmeden veya sayfadan ayrılmadan önce “Taslağı kaydet” düğmesini kullanın. Kaydedilmemiş değişiklikler sunucuya aktarılmış sayılmaz.'],
      ['Parolamı unuttum veya davetim açılmıyor.', 'Koordinatörünüzden yeni kişisel davet bağlantısı isteyin. Hesabınızın parolasını veya davet bağlantısını başka bir uzmanla paylaşmayın.'],
      ['Referans cinsini ben mi belirleyeceğim?', 'Form B’deki isteğe bağlı cins tahmininiz bağımsız görüşünüzdür. Çalışmanın kesin referans cinsi, koordinatörün yönettiği ayrı ve belgelenmiş bir doğrulama sürecinde tutulur.']
    ],
    finishTitle: 'Hazırsanız kendi hesabınızla başlayın', finishText: 'Bu rehberi giriş yapmadan okuyabilirsiniz. Değerlendirme kayıtları ve özel materyaller yalnız yetkili hesaplara açılır.'
  },
  en: {
    eyebrow: 'GeoKnow · Platform guide', title: 'GeoKnow User Guide',
    intro: 'Learn how to use the identification, visual AI, geology and 3D laboratory tools. Verify scientific results against your own observations.',
    enter: 'Open Review Workspace', jump: 'Read evaluation steps',
    toolsTitle: 'Using GeoKnow tools',
    toolsIntro: 'Each tool supports a different stage of the workflow. A useful path is to begin with the 3D Laboratory, then deepen the investigation with Identification or Visual AI.',
    tools: [
      { title: 'Identification', description: 'Narrow possible genera from thin-section observations with rule-based decision support.', steps: ['Choose Step-by-Step Identification to answer questions in sequence, or Character Scoring to enter CHR characters directly.', 'Record values that are clearly visible; do not treat an unobservable structure as absent.', 'Review the result state, matching characters and warnings together, then verify with taxonomic sources.'], href: '/tani', cta: 'Open Identification' },
      { title: 'Visual AI', description: 'Use visual AI to inspect a foraminifera image and generate morphological candidates and observation notes.', steps: ['Upload a JPG, PNG or WEBP image smaller than 8 MB.', 'Fill in locality, geological age, optics/magnification and scale when available.', 'Treat candidates in Analysis Results as suggestions to verify, not as a diagnosis. You may also run the Decision Support engine.'], href: '/vlm', cta: 'Open Visual AI' },
      { title: 'Geology', description: 'Explore geological time, depositional depth, habitats and taxonomic records together.', steps: ['Select a stage from the Paleocene–Eocene timeline and read its overview.', 'Select taxon labels to open the WoRMS and ontology profile.', 'Use depth-zone and taxonomic-rank filters to narrow environment records, then open the taxon in the fossil catalogue.'], href: '/jeoloji', cta: 'Open Geology' },
      { title: '3D Laboratory', description: 'Explore foraminifera models in a virtual exhibition and learn morphology interactively.', steps: ['Start the guided tour or choose free roam; use the Field Notebook to follow exhibits and boards.', 'Open a model and compare Surface, X-ray and Section views; drag to rotate and use the wheel to zoom.', 'After the tour, use Test Yourself to check what you learned.'], href: '/lab', cta: 'Open 3D Lab' },
      { title: 'News & Events', description: 'Follow field, teaching and academic activity notes from the GeoKnow research group.', steps: ['Choose a story from News & Events.', 'Use its day, topic and images to understand the activity context.', 'Follow related tool links to connect the story with Identification, Geology or the 3D Lab.'], href: '/haberler', cta: 'Open News' },
      { title: 'Review Workspace', description: 'A controlled workspace for independent observations and rule review by authorized coordinators and participants.', steps: ['Sign in with your coordinator account or personal invitation link.', 'Complete independent specimen observations in Form B first; Form A opens only when the phase is enabled.', 'Save drafts, check independence declarations and review responses before final submission.'], href: '/expert-validation', cta: 'Open workspace' }
    ],
    sequence: ['1 · Form B: Specimen observations', '2 · Form A: Rule review', '3 · Final check and submission'],
    beforeTitle: 'Before you begin',
    before: [
      'You need an individual invitation from your coordinator. Each expert uses a separate account.',
      'Use a computer or tablet to examine the images comfortably, and allow uninterrupted time for the review.',
      'During Form B, do not consult the other expert’s responses, reference genera, AI proposals or GeoKnow identification and scoring outputs.'
    ],
    stepsTitle: 'Step-by-step evaluation',
    steps: [
      { title: 'Open your invitation and sign in', text: 'Open the personal link provided by your coordinator. On your first visit, choose your own password of at least 12 characters and select “Activate account”. Note the account login displayed on screen. On later visits, use “Expert sign-in” with that login and password.', note: 'If you have no invitation or the link is invalid, request a new invitation from your coordinator. Experts do not share a common password.' },
      { title: 'Select your assigned specimen in Form B first', text: 'In “1. Form B · Blinded specimens”, choose a record under “Assigned evaluation”. Examine only the anonymous specimen code and the supplied material. Open each available view, use the zoom buttons, and drag or use the arrow keys to pan.', note: 'Select “Start observation” to start the timer. Use “Pause” during breaks and “Resume” when you return. The timer pauses when the tab is hidden; resume it after returning.' },
      { title: 'Record quality and all 21 characters yourself', text: 'Select the image / preservation quality. For each character CHR_01–CHR_21, enter the appropriate observation state and a controlled value where you can assess it. Add visual reasons or limitations when useful. Do not treat an unseen structure as absent or guess an uncertain value just to complete the form.', note: 'CHR_21 provides section-orientation context only and is not scored. Optional independent genus identification and subjective confidence become available after all 21 character states are recorded.' },
      { title: 'Save a draft or submit your final Form B', text: 'Select “Save draft” to take a break. Sign in again and select the same record to resume. When finished, check every response and independence declaration. Select “Submit evaluation”, followed by “Confirm final submission”.', note: 'Final submission locks the response. Do not confirm a declaration that is untrue; inform your coordinator instead. Complete these steps separately for every assigned specimen.' },
      { title: 'Review rule cards once Form A opens', text: 'Both experts must submit all assigned Form B records, and the coordinator must open the next phase. Then choose a card under “2. Form A · Rule review”. Assess the original statement, M/D/S/C evidence level and character mapping separately, and record Approve, Correct, Reject or Unable to assess.', note: 'Corrections or rejections require a reason, reference, page / figure, problem type and expected effect. If AI proposals are supplied, personally examine each card and separately record your own decision, evidence and individual human verification. Do not assume a proposal is correct.' },
      { title: 'Complete the review summary and retain your records', text: 'After submitting every rule card, open “Review summary and closure”. Enter your institution, expertise, relationship to rule development, sources and overall scientific opinion. Check the declarations and submit the summary. Your submitted forms remain available read-only, with JSON, CSV and “Print / Save PDF” links.', note: 'If you discover an error, give the record code to your coordinator. Original responses are retained; corrections and adjudications are recorded separately. Analyses take place after the coordinator locks the study data.' }
    ],
    statesTitle: 'Which observation state should I choose?', stateHead: ['State', 'When to use it'],
    states: [
      ['PRESENT', 'You can assess the character and confidently record the selected value. The value itself may be negative.'],
      ['ABSENT', 'You clearly observed the absence of the feature. Use this state only with the value ABSENT or NONE.'],
      ['NOT_OBSERVABLE', 'The structure cannot be assessed because of section orientation, image quality, preservation or visibility.'],
      ['UNCERTAIN', 'The relevant area is visible, but you cannot confidently interpret the structure or select its value.']
    ],
    stateNote: 'Example encoding: a clearly observed negative feature may use Value = ABSENT and State = PRESENT. NOT_OBSERVABLE and UNCERTAIN do not provide evidence of absence.',
    faqTitle: 'Frequently asked questions',
    faq: [
      ['Why is Form A locked?', 'Both experts must finish every assigned specimen observation before the coordinator opens rule review. This order reduces the influence of rule knowledge on independent observations.'],
      ['No evaluation appears in my list.', 'Your coordinator may still be preparing material or assignments. Select “Refresh status”; contact your coordinator if no records appear.'],
      ['Are drafts saved automatically?', 'Use “Save draft” before continuing later or leaving the page. Unsaved changes have not necessarily been stored on the server.'],
      ['I forgot my password or cannot open my invitation.', 'Ask your coordinator for a new personal invitation. Do not share your password or invitation with another expert.'],
      ['Am I responsible for the reference genus?', 'The optional genus identification in Form B is your independent opinion. The definitive study reference is held in a separate, documented verification process managed by the coordinator.']
    ],
    finishTitle: 'Ready to begin with your own account?', finishText: 'You can read this guide without signing in. Evaluation records and private material are accessible only to authorized accounts.'
  }
};

export default function ExpertGuide() {
  const { lang } = useLanguage();
  const c = copy[lang] || copy.tr;
  return <main className="expert-guide" lang={lang}>
    <PageHero eyebrow={c.eyebrow} title={c.title} text={c.intro} tone="gray" actions={<div className="ms-page-hero-actions"><Link className="ms-btn" to="/expert-validation">{c.enter}<span aria-hidden="true">→</span></Link><a className="ms-btn ms-btn--secondary" href="#expert-guide-steps">{c.jump}</a></div>} />
    <div className="ms-container expert-guide-content">
      <section className="expert-guide-tools" aria-labelledby="expert-guide-tools-title">
        <h2 id="expert-guide-tools-title">{c.toolsTitle}</h2>
        <p className="expert-guide-lead">{c.toolsIntro}</p>
        <div className="expert-guide-tool-grid">
          {c.tools.map(tool => (
            <article className="expert-guide-tool" key={tool.title}>
              <div>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <ol>
                  {tool.steps.map(step => <li key={step}>{step}</li>)}
                </ol>
              </div>
              <Link className="expert-guide-tool-link" to={tool.href}>{tool.cta}<span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </section>
      <ol className="expert-guide-sequence" aria-label={lang === 'tr' ? 'Değerlendirme sırası' : 'Evaluation order'}>{c.sequence.map(item => <li key={item}>{item}</li>)}</ol>
      <section className="expert-guide-before" aria-labelledby="expert-guide-before-title"><h2 id="expert-guide-before-title">{c.beforeTitle}</h2><ul>{c.before.map(item => <li key={item}>{item}</li>)}</ul></section>
      <section id="expert-guide-steps" aria-labelledby="expert-guide-steps-title"><h2 id="expert-guide-steps-title">{c.stepsTitle}</h2><ol className="expert-guide-steps">{c.steps.map((step, index) => <li key={step.title}><span className="expert-guide-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.text}</p><p className="expert-guide-note">{step.note}</p></div></li>)}</ol></section>
      <section className="expert-guide-states" aria-labelledby="expert-guide-states-title"><h2 id="expert-guide-states-title">{c.statesTitle}</h2><div className="expert-guide-table"><table><thead><tr>{c.stateHead.map(value => <th key={value} scope="col">{value}</th>)}</tr></thead><tbody>{c.states.map(([state, description]) => <tr key={state}><th scope="row"><code>{state}</code></th><td>{description}</td></tr>)}</tbody></table></div><p className="expert-guide-note">{c.stateNote}</p></section>
      <section className="expert-guide-faq" aria-labelledby="expert-guide-faq-title"><h2 id="expert-guide-faq-title">{c.faqTitle}</h2>{c.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
      <section className="expert-guide-finish"><h2>{c.finishTitle}</h2><p>{c.finishText}</p><Link className="ms-btn" to="/expert-validation">{c.enter}<span aria-hidden="true">→</span></Link></section>
    </div>
  </main>;
}
