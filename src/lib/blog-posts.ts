export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  image: string
  content: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'kedi-beslenmesi-rehberi',
    title: 'Kedi Beslenmesi: Sağlıklı Bir Kedi İçin Tam Rehber',
    excerpt: 'Kedinizin yaşına, ırkına ve sağlık durumuna göre doğru beslenme planını nasıl oluşturacağınızı öğrenin.',
    date: '2026-06-01',
    readTime: '5 dk',
    category: 'Kedi Bakımı',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
    content: `
## Kediler Neden Özel Bir Beslenme Düzenine İhtiyaç Duyar?

Kediler zorunlu etoburlardır. Bu, vücutlarının et kaynaklı protein ve yağ asitlerine ihtiyaç duyduğu anlamına gelir. Bitkisel besinler tek başına yeterli değildir.

## Yaşa Göre Beslenme

**Yavru Kediler (0–12 ay)**
Hızlı büyüme döneminde yüksek protein ve kalori gereksinimi vardır. Günde 3–4 öğün verilmelidir.

**Yetişkin Kediler (1–7 yaş)**
Dengeli bir mama ile günde 2 öğün idealdir. Aşırı yemeden kaçınmak için otomatik mama kapları kullanabilirsiniz.

**Yaşlı Kediler (7+ yaş)**
Böbrek ve eklem sağlığına özel formüller tercih edilmelidir.

## Otomatik Mama Kaplarının Faydaları

Akıllı mama kapları sayesinde:
- Kediniz düzenli saatlerde beslenir
- Porsiyon kontrolü sağlanır
- Uzakta olduğunuzda bile kediniz aç kalmaz

Çin kaynaklı ISO sertifikalı mama kaplarımız WiFi kontrolü ve uygulama entegrasyonu ile kedi beslenmenizi kolaylaştırır.

## Sık Yapılan Hatalar

1. Süt vermek — Yetişkin kedilerin çoğu laktoza intoleranttır
2. Köpek maması vermek — Kedi ve köpek mamaları farklı formüllere sahiptir
3. Tek tip beslenmek — Çeşitlilik bağışıklık sistemini güçlendirir
    `,
  },
  {
    slug: 'kopek-tasma-secimi',
    title: 'Köpeğiniz İçin Doğru Tasma Nasıl Seçilir?',
    excerpt: 'Irk, boyut ve alışkanlığa göre en uygun tasma ve göğüs tasması seçimi için bilmeniz gerekenler.',
    date: '2026-06-05',
    readTime: '4 dk',
    category: 'Köpek Bakımı',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
    content: `
## Tasma mı, Göğüs Tasması mı?

**Boyun tasması:** Küçük ırklara ve tasma eğitimi almış köpeklere uygundur.

**Göğüs tasması:** Çekme alışkanlığı olan büyük ırklar için daha güvenlidir. Boyna baskı yapmaz.

## Malzeme Seçimi

- **Naylon:** Dayanıklı, hafif, yıkanabilir. Günlük kullanım için idealdir.
- **Deri:** Şık görünüm, uzun ömür. Yağmurda dikkat gerekir.
- **Reflektif:** Gece yürüyüşleri için görünürlüğü artırır.

## Doğru Ölçü

İki parmak tasma ile boyun arasına girebiliyorsa ölçü doğrudur. Çok gevşek olursa köpek kaçabilir, çok sıkı olursa can sıkıntısı ve yaralanma riski doğar.

## Uzun Süre Takılı Kalmamalı

Tasma yalnızca yürüyüş sırasında takılmalıdır. Evde sürekli takılı kalmak tüy dökülmesine ve cilt tahrişine neden olabilir.
    `,
  },
  {
    slug: 'kedi-kumu-secimi',
    title: 'Kedi Kumu Seçimi: Hangi Kum Türü Kedinize Uygun?',
    excerpt: 'Topaklaşan, kristal ve biyobozunur kum türlerinin karşılaştırması ve otomatik kum temizleyicilerle uyumluluk rehberi.',
    date: '2026-06-08',
    readTime: '4 dk',
    category: 'Kedi Bakımı',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&q=80',
    content: `
## Kedi Kumu Türleri

**Topaklaşan Kum**
En yaygın kullanılan türdür. İdrar ve dışkıyı topaklaştırarak koku oluşumunu engeller. Temizliği kolaydır.

**Kristal (Silika) Kum**
Yüksek emici kapasitesi vardır, daha az sıklıkta değiştirilir. Ancak bazı kediler sert dokusunu sevmeyebilir.

**Biyobozunur Kum**
Mısır, buğday veya kağıttan üretilir. Çevre dostudur, tuvalet sisteminde atılabilir.

## Otomatik Kum Temizleyiciyle Uyumluluk

Otomatik kum temizleyicilerin büyük çoğunluğu **topaklaşan kum** ile çalışır. Kristal kum bazı modellerde kullanılabilir ancak üretici tavsiyelerini kontrol edin.

## Koku Kontrolü İpuçları

1. Kumu haftada en az 1–2 kez tamamen değiştirin
2. Günlük temizlik yapın
3. Birden fazla kediniz varsa kedi başına 1 kum kabı + 1 yedek kural geçerlidir
4. Otomatik temizleyiciler bu yükü büyük ölçüde azaltır
    `,
  },
  {
    slug: 'evcil-hayvan-oyuncak-rehberi',
    title: 'Evcil Hayvan Oyuncakları: Hem Eğlenceli Hem Eğitici Seçimler',
    excerpt: 'Kediniz veya köpeğiniz için zihinsel ve fiziksel sağlığı destekleyen doğru oyuncak seçimi nasıl yapılır?',
    date: '2026-06-10',
    readTime: '3 dk',
    category: 'Genel Bakım',
    image: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=800&q=80',
    content: `
## Neden Oyuncak Önemlidir?

Oyuncaklar yalnızca eğlence aracı değildir. Evcil hayvanların zihinsel uyarılma, diş sağlığı ve egzersiz ihtiyaçlarını karşılar. Yetersiz uyarılma; yıkıcı davranışlara, aşırı yeme veya depresyona yol açabilir.

## Kediler İçin En İyi Oyuncak Türleri

- **Lazer pointer:** Av içgüdüsünü aktive eder. Seans sonunda gerçek bir ödülle bitirin.
- **Tüylü çubuklar:** Interaktif oyun için idealdir.
- **Tünel ve kutu:** Saklanma ihtiyacını giderir.

## Köpekler İçin En İyi Oyuncak Türleri

- **Dolgu oyuncaklar:** Zihinsel uyarım sağlar.
- **Halat oyuncaklar:** Çekiştirme oyunu için uygundur.
- **Diş oyuncakları:** Diş sağlığını destekler.

## Güvenlik Uyarısı

- Kopan parça riski taşıyan oyuncakları tercih etmeyin
- Oyuncak boyutunun köpeğin ağzına tam girmediğinden emin olun
- Hasarlı oyuncakları hemen atın
    `,
  },
  {
    slug: 'e-collar-koruyucu-koni-kullanimi',
    title: 'E-Collar (Koruyucu Koni) Ne Zaman ve Nasıl Kullanılır?',
    excerpt: 'Ameliyat sonrası veya yara bakımında koruyucu koni ne zaman gerekir, doğru boyut nasıl seçilir ve hayvanın alışması nasıl kolaylaştırılır?',
    date: '2026-07-15',
    readTime: '5 dk',
    category: 'Pet Medikal',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80',
    content: `
## E-Collar (Koruyucu Koni) Nedir, Ne Zaman Gerekir?

E-collar, halk arasında "koruyucu koni" olarak bilinen, evcil hayvanın kendi vücuduna (özellikle yara, dikiş veya tahriş bölgesine) ağzıyla erişmesini engelleyen bir yardımcı ekipmandır. En sık kullanım alanları arasında ameliyat sonrası dikiş bölgesinin korunması, kaşıntılı cilt problemlerinde yaranın büyümesinin önlenmesi ve bandaj/pansuman altındaki bölgenin dış müdahaleden korunması sayılabilir.

Koninin ne zaman ve ne süreyle kullanılması gerektiğine dair kesin karar her zaman veteriner hekiminize aittir; bu ürün bir tedavi yöntemi değil, iyileşme sürecini destekleyen tamamlayıcı bir önlemdir.

## Doğru Boyut Nasıl Seçilir?

Koni seçerken iki ölçü önemlidir: boyun çevresi ve koninin uzunluğu. Boyun çevresi, koninin rahat ama kaymayacak şekilde oturmasını sağlamalıdır — çok gevşek bir koni hayvanın başını çıkarmasına, çok sıkı bir koni ise nefes almasını zorlaştırmasına yol açabilir. Koninin uzunluğu ise, evcil hayvan başını düz tuttuğunda koninin ucunun burnu hafifçe geçmesi şeklinde ayarlanmalıdır; bu sayede hayvan yara bölgesine erişemezken mama kabına ve su kabına rahatça ulaşabilir.

## Sert Plastik Koni mi, Yumuşak/Şişme Yaka mı?

**Sert plastik koniler** görüş açısını daha fazla kısıtlasa da en güvenilir bariyeri sağlar. Dikiş bölgesine erişme riski yüksek olan vakalarda veya hareketli, meraklı hayvanlarda tercih edilir.

**Yumuşak/şişme yaka veya kumaş koniler** ise daha hafif ve konforludur, hayvanın günlük hareketlerini (yemek yeme, uyuma, evin içinde dolaşma) daha az kısıtlar. Ancak koruma seviyesi sert konilere göre daha düşüktür, bu yüzden genellikle hafif tahriş veya düşük riskli durumlarda tercih edilir.

## Hayvanın Koniye Alışması İçin Öneriler

1. Koniyi ilk taktığınızda kısa süreli denemelerle başlayın, hemen uzun süreli takılı bırakmayın
2. Ödül ve sevgi göstererek koniyi olumlu bir deneyimle ilişkilendirin
3. Mama ve su kaplarının erişilebilir yükseklikte olduğundan emin olun, gerekirse kap boyutunu koniye uygun şekilde ayarlayın
4. Eve mobilya köşelerine çarpma riskine karşı ilk günlerde hayvanı yakından gözlemleyin
5. Koninin altındaki cilt bölgesinde kızarıklık veya tahriş fark ederseniz veterinerinize danışın

## Önemli Uyarı

Bu yazıdaki bilgiler genel bilgilendirme amaçlıdır ve bir veteriner hekim muayenesinin yerine geçmez. Evcil hayvanınızın koni kullanımı, süresi ve boyutu konusunda mutlaka veterinerinize danışın; ameliyat sonrası iyileşme sürecinde belirtilerin kötüleşmesi durumunda vakit kaybetmeden veteriner kliniğine başvurun.
    `,
  },
  {
    slug: 'kedi-aksesuar-rehberi-2026',
    title: '2026 Kedi Aksesuar Rehberi: Yeni Bir Kedi İçin Hangi Ürünler Gerçekten Gerekli?',
    excerpt: 'Mama kabından tırmalama direğine, kum kabından taşıma çantasına kadar bir kedinin ihtiyaç duyduğu temel aksesuarları ve doğru seçim kriterlerini tek bir rehberde topladık.',
    date: '2026-07-23',
    readTime: '8 dk',
    category: 'Kedi Bakımı',
    image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&q=80',
    content: `
Yeni bir kedi sahiplendiğinizde ya da mevcut kediniz için ev düzenini gözden geçirirken "gerçekten hangi ürünlere ihtiyacım var?" sorusu kafa karıştırıcı olabilir. Piyasada onlarca aksesuar türü olsa da, bir kedinin günlük yaşamında ihtiyaç duyduğu temel kategoriler aslında sınırlıdır. Bu rehberde her kategoriyi tek tek ele alıyor, hangi kedi için hangi ürünün daha uygun olduğunu ve seçim yaparken nelere dikkat etmeniz gerektiğini anlatıyoruz.

## 1. Mama ve Su Kabı

Her kedinin en temel ihtiyacı, temiz ve düzenli beslenme imkânıdır. Mama kabı seçerken malzeme, boyut ve konum aynı derecede önemlidir.

- **Paslanmaz çelik veya seramik kaplar** plastiğe göre daha hijyeniktir ve çene aknesi riskini azaltır.
- **Geniş, sığ kaplar** kedinin bıyıklarının kaba temas etmesini (bıyık stresi) önler.
- **Su kabı, mama kabından ayrı ve uzakta** konumlandırılmalıdır — kediler doğal olarak su kaynağını av bölgesinden uzak tutmayı tercih eder.
- Birden fazla kediniz varsa kedi başına en az bir kap ayırmak rekabeti azaltır.

Evde kalan zamanınız düzensizse **otomatik/akıllı mama kapları** porsiyon kontrolü ve sabit besleme saatleri sağlar; özellikle uzun mesai saatleri olan sahipler için pratik bir çözümdür. PatiShop'un [mama kapları kategorisinde](/kategori/mama-kabi) WiFi kontrollü ve porsiyon ayarlı modelleri inceleyebilirsiniz. Beslenme düzeni hakkında daha detaylı bilgi için [Kedi Beslenmesi Rehberi](/blog/kedi-beslenmesi-rehberi) yazımıza da göz atabilirsiniz.

## 2. Kum Kabı ve Otomatik Temizleyiciler

Kum kabı, kedinin tuvalet alışkanlıklarını doğrudan etkileyen bir üründür ve yanlış seçim davranış problemlerine (kum kabını kullanmama gibi) yol açabilir.

- **Açık kum kapları** çoğu kedi için daha rahattır çünkü sıkışmışlık hissi yaratmaz.
- **Kapalı/gizli kum kapları** koku yayılımını azaltır ama bazı kediler tarafından tercih edilmeyebilir.
- Genel kural: ev içindeki kedi sayısı + 1 kadar kum kabı bulundurmak, özellikle çoklu kedi evlerinde önemlidir.

Günlük temizlik yükünü azaltmak isteyenler için **otomatik kum temizleyiciler** iyi bir yatırımdır; hareket sensörü ile atığı algılayıp ayrı bir hazneye toplar. Bu cihazların büyük çoğunluğu topaklaşan kum ile uyumlu çalışır, bu yüzden cihaz almadan önce kum türü uyumluluğunu kontrol etmek gerekir. Detaylı kum türü karşılaştırması için [Kedi Kumu Seçimi](/blog/kedi-kumu-secimi) yazımıza bakabilir, PatiShop'un [kum temizleyici kategorisinden](/kategori/kum-temizleyici) sessiz çalışan modelleri inceleyebilirsiniz.

## 3. Tırmalama Direği

Tırmalama, kedilerin pençe sağlığı ve stres atma açısından doğal bir ihtiyacıdır — engellenirse mobilyalara yönelebilir. Bu yüzden tırmalama direği, "isteğe bağlı" değil neredeyse zorunlu bir aksesuar olarak değerlendirilmelidir.

- **Sisal halat kaplı direkler** en dayanıklı ve kedilerin en çok tercih ettiği yüzeydir.
- **Sabit, ağır tabanlı modeller** devrilme riskini azaltır; özellikle enerjik ve genç kedilerde bu önemlidir.
- Direği kedinin sık uğradığı bir alana (pencere kenarı, uyku alanına yakın) yerleştirmek kullanım oranını artırır.
- Çok katlı "kedi evi" tarzı modeller hem tırmalama hem de gözlem noktası ihtiyacını birlikte karşılar.

PatiShop'ta tırmalama direği modellerini [diğer aksesuarlar kategorisinde](/kategori/diger-aksesuar) bulabilirsiniz.

## 4. Oyuncaklar

Kediler zeki ve av içgüdüsü yüksek hayvanlardır; düzenli oyun hem fiziksel hem zihinsel sağlık için gereklidir.

- **Tüylü değnek oyuncaklar** interaktif oyun için idealdir, sahiple bağ kurmayı destekler.
- **Lazer pointer** av içgüdüsünü tetikler ancak seansı gerçek bir ödülle (mama parçası, oyuncak) bitirmek önemlidir — aksi halde kedi tatminsiz kalabilir.
- **Zeka geliştirici bulmaca oyuncaklar**, özellikle tek başına kalan kediler için yararlıdır.
- **Catnip'li oyuncaklar** bazı kedilerde belirgin ilgi uyandırır (genetik olarak her kedi tepki vermeyebilir).

Yavru kediler için daha küçük ve hafif oyuncaklar, yetişkin kediler için daha dayanıklı modeller tercih edilmelidir. PatiShop'un [oyuncak kategorisinde](/kategori/oyuncak) geniş bir seçki bulunuyor.

## 5. Yatak ve Uyku Alanı

Kediler günün büyük bölümünü uyuyarak geçirir; bu yüzden rahat bir uyku alanı yaşam kalitesini doğrudan etkiler.

- **Kenarlı/yuvalı yataklar** kediye güvenlik hissi verir, özellikle çekingen kediler tarafından tercih edilir.
- **Isıtmalı yataklar** kış aylarında veya yaşlı/eklem sorunu olan kediler için faydalı olabilir.
- Yatağı ev içinde sakin, az trafikli bir köşeye yerleştirmek kullanım sıklığını artırır.
- Yıkanabilir kılıflı modeller hijyen açısından pratiklik sağlar.

[Yatak kategorimizde](/kategori/yatak) farklı boyut ve modellerde seçenekler bulunuyor.

## 6. Taşıma Çantası

Veteriner ziyaretleri, seyahat veya ev taşıma gibi durumlar için sağlam bir taşıma çantası/kafesi şarttır — acil bir durumda son anda aramak istemezsiniz.

- **Sert kabuklu taşıma kutuları** uçak/uzun yolculuklar için daha güvenlidir.
- **Yumuşak kumaş taşıma çantaları** kısa mesafeli, günlük kullanım (veteriner gidiş-geliş) için daha pratiktir.
- Havalandırma delikleri geniş ve kedinin rahatça dönebileceği boyutta bir model seçilmelidir.
- Kediyi çantaya erken yaşta, olumlu deneyimlerle (içine ödül koyarak) alıştırmak ileride stresli veteriner ziyaretlerini kolaylaştırır.

PatiShop'un [taşıma çantası kategorisinde](/kategori/tasima-cantasi) farklı bütçe ve boyutlarda modeller mevcut.

## Öncelik Sırası: Hangi Ürünü Önce Almalı?

Yeni bir kedi sahiplendiyseniz ve tüm bu listeyi bir anda karşılamak bütçenizi zorluyorsa, öncelik sırası genellikle şöyledir:

1. Mama ve su kabı
2. Kum kabı
3. Taşıma çantası (ilk veteriner kontrolü için)
4. Tırmalama direği
5. Yatak
6. Oyuncaklar

Otomatik mama kabı ve otomatik kum temizleyici gibi "konfor" ürünleri ise bütçe uygun olduğunda ikinci aşamada eklenebilecek yatırımlardır.

## Sonuç

Bir kedinin temel ihtiyaçları aslında karmaşık değildir: doğru boyutta mama/su kabı, uygun kum kabı, tırmalama alanı, düzenli oyun ve güvenli bir uyku/taşıma alanı. Ürün seçerken kedinizin yaşını, karakterini (çekingen/enerjik) ve ev ortamınızı göz önünde bulundurmak, hem kedinizin hem de sizin için en verimli sonucu verir. Her kategori için detaylı seçim kriterlerini kendi ürün sayfalarımızda da bulabilirsiniz.
    `,
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug)
}
