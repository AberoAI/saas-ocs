// apps/frontend/app/[locale]/about/page.tsx
import CanonicalAbout from "../../about/page";
import { getLocale } from "next-intl/server";
import Link from "next/link";

export default async function LocalizedAboutPage() {
  const locale = (await getLocale())?.toLowerCase();

  // Jika locale TR → render konten Turki
  if (locale?.startsWith("tr")) {
    return (
      <>
        {/* Navbar global ada di layout.tsx */}
        <main className="mx-auto max-w-4xl px-6 py-16 md:py-16">
          <h1 className="text-3xl font-bold mb-6">AberoAI Hakkında</h1>

          {/* 🎯 Misyonumuz */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">🎯 Misyonumuz</h2>
            <p>
              Müşterilerin %65’ten fazlası, yalnızca geç veya tutarsız yanıtlar yüzünden
              işlemlerini yarıda bırakıyor. Artan mesaj yoğunluğu müşteri hizmetleri ekiplerini
              zorlarken, müşteriler her geçen gün daha sabırsız hale geliyor.
            </p>
            <p>
              WhatsApp Business’ın geleneksel otomatik yanıtları ise genellikle katı ve tekdüze
              kalıyor; bu nedenle “anında yanıt” gerçekte sorunu çözmüyor.
            </p>
            <p>
              AberoAI’nin misyonu, bu boşluğu kapatmak: 7/24 tutarlı ve anında yanıtlar sunmak,
              çoklu dil desteği sağlamak ve her konuşmaya bağlama uygun esnek çözümler üretmek.
            </p>
            <p>
              AberoAI ayrıca rezervasyon ve takip süreçlerini yönetir, her etkileşimde markanızın
              sesini korur. Verimli ve ölçeklenebilirdir — ek personel gerekmeden saniyeler içinde
              binlerce konuşmayı yönetebilir, böylece ekibiniz daha değerli işlere odaklanabilir.
            </p>
            <p>
              Biz inanıyoruz ki: hızlı ve tutarlı iletişim, müşterilere verilen gerçek önemi
              gösterir — ve güven, iş büyümesinin yakıtıdır.
            </p>
          </section>

          {/* ⚙️ Ne Yapıyoruz */}
          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold">⚙️ Ne Yapıyoruz</h2>
            <p>
              AberoAI, işletmelerin daha hızlı, daha tutarlı ve daha insancıl müşteri deneyimleri
              sunmasına yardımcı olur. En yeni yapay zeka teknolojisiyle geliştirilen ve hizmet
              sektörüne özel tasarlanan AberoAI, sadece mesajlara yanıt vermekle kalmaz, müşteri
              ihtiyaçlarını doğrudan çözüme kavuşturur.
            </p>

            <h3 className="mt-6 text-lg font-semibold">🔹 Temel Özellikler</h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <strong>Sezgisel kontrol paneli</strong> → kullanımı kolay, özelleştirilebilir ve
                yoğun müşteri etkileşimi olan sektörler için tasarlandı.
              </li>
              <li>
                <strong>7/24 çok dilli yanıtlar</strong> → yerel ve uluslararası müşterilerin
                sorunsuz hizmet almasını sağlar.
              </li>
              <li>
                <strong>Hazır konuşma akışları</strong> → randevu, SSS, hatırlatıcılar ve takip
                süreçleri.
              </li>
              <li>
                <strong>Sorunsuz entegrasyon</strong> → resmi WhatsApp Cloud API ve AberoAI web
                paneliyle, karmaşık kurulum olmadan hemen çalışır.
              </li>
              <li>
                <strong>İnsan devri (gelişmiş)</strong> → karmaşık durumlarda ekibinize yumuşak
                geçiş yapar.
              </li>
              <li>
                <strong>Analiz ve içgörüler (gelişmiş)</strong> → performansı izlemenize ve
                iyileştirme fırsatlarını görmenize yardımcı olur.
              </li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold">🔹 Katma Değer</h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <strong>Esnek &amp; bağlamsal</strong> → yanıtlar duruma uyum sağlar, kalıplaşmış
                botlar gibi değildir.
              </li>
              <li>
                <strong>Verimli &amp; ölçeklenebilir</strong> → aynı anda binlerce konuşmayı
                yönetebilir.
              </li>
              <li>
                <strong>Marka-öncelikli</strong> → dil ve üslup markanızla her zaman uyumlu kalır.
              </li>
              <li>
                <strong>Ekip uyumlu</strong> → birden fazla ekip üyesi aynı anda erişebilir.
              </li>
              <li>
                <strong>Merkezi &amp; kayıtlı</strong> → tüm konuşmalar tek yerde saklanır,
                dağınıklık ortadan kalkar.
              </li>
              <li>
                <strong>Hizmet sektörüne odaklı</strong> → klinikler, turizm/otelcilik ve diğer
                hizmet işletmeleri için özel tasarlanmıştır.
              </li>
            </ul>
          </section>

          {/* 💡 Nasıl Çalışıyoruz */}
          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold">💡 Nasıl Çalışıyoruz</h2>
            <p>
              Mükemmel müşteri hizmeti yalnızca hızlı yanıt vermek değil, aynı zamanda bağlamı
              anlamak ve doğru çözümü sunmaktır. Bu nedenle AberoAI, proaktif ve uyumlu bir dijital
              asistan olarak tasarlandı — yalnızca bir bot değil.
            </p>

            <h3 className="mt-6 text-lg font-semibold">🔹 AberoAI’nin Çalışma İlkeleri</h3>
            <ul className="mt-2 list-disc pl-5 space-y-3">
              <li>
                <strong>Bağlamsal &amp; proaktif</strong> → niyeti anlar ve sonraki adımı önerir.
                <br />
                <span className="text-black/70">
                  Örn: Randevu soran hasta doğrudan uygun boşluklara yönlendirilir; oda soran
                  misafir rezervasyona aktarılır.
                </span>
              </li>
              <li>
                <strong>Eyleme geçirilebilir</strong> → her etkileşim anında işleme konabilir;
                rezervasyon, onay veya hatırlatma dahil.
              </li>
              <li>
                <strong>Sorunsuz entegrasyon</strong> → resmi WhatsApp Cloud API veya AberoAI web
                paneliyle teknik zahmet olmadan devreye alınır.
              </li>
              <li>
                <strong>Gerektiğinde insan dokunuşu</strong> → karmaşık konuşmalarda ekibinize
                geçiş yapar.
              </li>
              <li>
                <strong>Markanızla uyumlu</strong> → dil, üslup ve iletişim tarzı markanıza göre
                ayarlanır.
              </li>
              <li>
                <strong>Güvenli &amp; kontrollü</strong> → tüm konuşmalar şifrelenir, gizlidir ve
                tamamen işletmenize aittir.
              </li>
            </ul>
          </section>

          {/* ✨ Çıktılar */}
          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold">✨ Bu yaklaşımla işletmeniz:</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Ek personel almadan daha fazla müşteriye hizmet verebilir,</li>
              <li>Geciken yanıtların neden olduğu iptalleri azaltabilir,</li>
              <li>Anında ve alakalı yanıtlarla müşteri memnuniyetini artırabilir,</li>
              <li>Tutarlı ve güvenli iletişimle uzun vadeli güven inşa edebilir.</li>
            </ul>
            <p className="mt-4">
              Sonuç: daha verimli bir işletme, daha mutlu müşteriler ve daha güçlü bir marka. Her
              hızlı ve tutarlı konuşma sadece bir hizmet değil — güveni ve sürdürülebilir büyümeyi
              besleyen bir özen göstergesidir.
            </p>
          </section>

          <footer className="mt-12 border-t border-black/10 pt-6 text-sm text-black/60">
            <div className="flex items-center justify-between">
              <span>© {new Date().getFullYear()} AberoAI</span>
              <div className="space-x-3">
                <Link href="/privacy" className="underline">Gizlilik</Link>
                <span aria-hidden>·</span>
                <Link href="/terms" className="underline">Şartlar</Link>
              </div>
            </div>
          </footer>
        </main>
      </>
    );
  }

  // Default: gunakan About kanonik (EN)
  return <CanonicalAbout />;
}
