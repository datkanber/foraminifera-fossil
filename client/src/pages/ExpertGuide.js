import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import PageHero from '../components/ms/PageHero';
import '../styles/pages/expert-guide.css';

const copy = {
  tr: {
    eyebrow: 'GeoKnow · Uzmanlar için', title: 'Uzman kullanım rehberi',
    intro: 'Değerlendirme sırasında ne yapacağınızı buradan okuyabilirsiniz. Önce fosilleri bağımsız gözlemleyin; ardından size atanan kural kartlarını inceleyin.',
    enter: 'Uzman alanına giriş yap', jump: 'Adımları incele',
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
    eyebrow: 'GeoKnow · For experts', title: 'Expert user guide',
    intro: 'Read these instructions before you begin. Observe the specimens independently first, then review the rule cards assigned to you.',
    enter: 'Sign in to the expert workspace', jump: 'Read the steps',
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
      <ol className="expert-guide-sequence" aria-label={lang === 'tr' ? 'Değerlendirme sırası' : 'Evaluation order'}>{c.sequence.map(item => <li key={item}>{item}</li>)}</ol>
      <section className="expert-guide-before" aria-labelledby="expert-guide-before-title"><h2 id="expert-guide-before-title">{c.beforeTitle}</h2><ul>{c.before.map(item => <li key={item}>{item}</li>)}</ul></section>
      <section id="expert-guide-steps" aria-labelledby="expert-guide-steps-title"><h2 id="expert-guide-steps-title">{c.stepsTitle}</h2><ol className="expert-guide-steps">{c.steps.map((step, index) => <li key={step.title}><span className="expert-guide-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.text}</p><p className="expert-guide-note">{step.note}</p></div></li>)}</ol></section>
      <section className="expert-guide-states" aria-labelledby="expert-guide-states-title"><h2 id="expert-guide-states-title">{c.statesTitle}</h2><div className="expert-guide-table"><table><thead><tr>{c.stateHead.map(value => <th key={value} scope="col">{value}</th>)}</tr></thead><tbody>{c.states.map(([state, description]) => <tr key={state}><th scope="row"><code>{state}</code></th><td>{description}</td></tr>)}</tbody></table></div><p className="expert-guide-note">{c.stateNote}</p></section>
      <section className="expert-guide-faq" aria-labelledby="expert-guide-faq-title"><h2 id="expert-guide-faq-title">{c.faqTitle}</h2>{c.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
      <section className="expert-guide-finish"><h2>{c.finishTitle}</h2><p>{c.finishText}</p><Link className="ms-btn" to="/expert-validation">{c.enter}<span aria-hidden="true">→</span></Link></section>
    </div>
  </main>;
}
