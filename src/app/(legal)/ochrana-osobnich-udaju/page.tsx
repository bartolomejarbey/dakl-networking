import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';

export default function OchranaOsobnichUdajuPage() {
  return (
    <>
      <Navbar solid />
      <main>
        <section className="bg-cream pt-[140px] pb-[140px] max-md:pt-[100px] max-md:pb-[100px]">
          <Container>
            <div className="max-w-[720px] mx-auto">
              <h1 className="font-serif text-ink text-[clamp(40px,5.2vw,72px)] leading-tight mb-16">
                Ochrana osobních údajů
              </h1>

              <div className="space-y-12">
                <section>
                  <h2 className="font-serif text-ink text-2xl mb-4">1. Správce údajů</h2>
                  <p className="font-serif text-ink-soft text-base leading-relaxed">
                    Správcem osobních údajů je David Kladišovský, IČO: 12345678, se sídlem v Praze,
                    Česká republika, provozovatel platformy DaKl Networking (dále jen &quot;Správce&quot;).
                    Správce lze kontaktovat na emailové adrese david@daklnetworking.cz. Správce nejmenoval
                    pověřence pro ochranu osobních údajů, neboť to není s ohledem na rozsah
                    zpracování vyžadováno.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-ink text-2xl mb-4">2. Účel zpracování</h2>
                  <p className="font-serif text-ink-soft text-base leading-relaxed">
                    Osobní údaje jsou zpracovávány za účelem: registrace a správy účasti na akcích
                    pořádaných pod značkou DaKl Networking; vystavení daňových dokladů a plnění účetních
                    povinností; zasílání informací o nadcházejících akcích a novinkách (pouze se
                    souhlasem); komunikace s účastníky ohledně organizačních záležitostí; zlepšování
                    kvality poskytovaných služeb. Zpracováváme následující kategorie údajů: jméno
                    a příjmení, emailová adresa, telefonní číslo, fakturační údaje.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-ink text-2xl mb-4">3. Právní základ</h2>
                  <p className="font-serif text-ink-soft text-base leading-relaxed">
                    Zpracování osobních údajů probíhá na základě: plnění smlouvy (čl. 6 odst. 1
                    písm. b) GDPR) — zpracování nezbytné pro plnění smlouvy o účasti na akci;
                    plnění právní povinnosti (čl. 6 odst. 1 písm. c) GDPR) — zejména povinnosti
                    vyplývající z daňových a účetních předpisů; souhlasu subjektu údajů (čl. 6
                    odst. 1 písm. a) GDPR) — pro zasílání marketingových sdělení; oprávněného
                    zájmu správce (čl. 6 odst. 1 písm. f) GDPR) — pro zlepšování služeb a
                    přímý marketing stávajícím zákazníkům.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-ink text-2xl mb-4">4. Příjemci údajů</h2>
                  <p className="font-serif text-ink-soft text-base leading-relaxed">
                    Osobní údaje mohou být předány následujícím kategoriím příjemců: poskytovatel
                    účetních služeb pro zpracování faktur; poskytovatel emailových služeb pro
                    zasílání potvrzení a komunikaci; poskytovatel webhostingu a cloudových služeb
                    pro uložení dat. Všichni příjemci jsou vázáni smlouvou o zpracování osobních
                    údajů a zajišťují odpovídající úroveň ochrany. Osobní údaje nejsou předávány
                    do třetích zemí mimo Evropský hospodářský prostor.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-ink text-2xl mb-4">5. Doba uchování</h2>
                  <p className="font-serif text-ink-soft text-base leading-relaxed">
                    Osobní údaje jsou uchovávány po dobu nezbytnou k naplnění účelu zpracování:
                    údaje pro plnění smlouvy — po dobu trvání smluvního vztahu a 3 roky po jeho
                    ukončení; účetní a daňové doklady — po dobu stanovenou právními předpisy
                    (zpravidla 10 let); marketingové souhlasy — do odvolání souhlasu; údaje
                    zpracovávané na základě oprávněného zájmu — do vznesení námitky. Po uplynutí
                    doby uchování jsou údaje bezpečně smazány nebo anonymizovány.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-ink text-2xl mb-4">6. Vaše práva</h2>
                  <p className="font-serif text-ink-soft text-base leading-relaxed">
                    Jako subjekt údajů máte následující práva: právo na přístup k osobním údajům;
                    právo na opravu nepřesných údajů; právo na výmaz (&quot;právo být zapomenut&quot;);
                    právo na omezení zpracování; právo na přenositelnost údajů; právo vznést námitku
                    proti zpracování; právo odvolat souhlas se zpracováním; právo podat stížnost
                    u Úřadu pro ochranu osobních údajů (www.uoou.cz). Pro uplatnění svých práv
                    nás kontaktujte na david@daklnetworking.cz. Na vaši žádost odpovíme bez zbytečného
                    odkladu, nejpozději do 30 dnů.
                  </p>
                </section>
              </div>

              <p className="font-mono text-ink-soft text-xs mt-16">
                Poslední aktualizace: duben 2026
              </p>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
